const Medicine = require('../models/Medicine');
const Brand = require('../models/Brand');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { notifyChemist } = require('./chatNotifications');
const { emitNewMessage, emitConversationUpdated } = require('../socket');

// ─────────────────────────────────────────────────────────────────────────────
// CureBasket chat assistant.
//
// Hybrid + escalation-first design:
//   1. A deterministic RULE layer handles the common, high-value intents for
//      free and with zero hallucination — greetings, "talk to a human",
//      medical-advice refusal (guardrail), product/brand availability (real DB
//      lookups), and FAQs.
//   2. Only genuinely ambiguous free-form messages fall through to Gemini Flash
//      (free tier), grounded with catalog context and the same guardrails.
//   3. If Gemini is unconfigured / rate-limited / errors → we escalate to a
//      human rather than guess.
// ─────────────────────────────────────────────────────────────────────────────

const ESCALATE_MSG =
  'Let me connect you with a member of our team who can help with that — they’ll reply right here shortly.';

const GREETING = /^(hi+|hey+|hello|yo|namaste|good\s+(morning|afternoon|evening))\b/i;

const WANT_HUMAN =
  /(talk|speak|connect|chat)\s+(to|with)?\s*(a\s+)?(human|person|agent|representative|someone|pharmacist|chemist|team|staff)|real person|human (please|agent)/i;

// Advice-seeking — the bot must NOT answer these (legal/safety). Kept distinct
// from availability ("do you have X") so product questions aren't caught here.
const MEDICAL_ADVICE =
  /(what should i (take|use|do)|which (medicine|drug|tablet|medication).*(for|to)|is it safe to (take|use)|can i (take|use|mix) .* (with|and|together)|how (much|many|often).*(take|dose)|dosage|side ?effects?|i (have|feel|am|'m|am suffering|got).*(pain|fever|cough|cold|headache|infection|rash|allerg)|symptom|overdose|drug interaction|interactions?\b)/i;

const AVAILABILITY =
  /(do you (have|sell|stock|carry)|is\s+.+\s+available|in stock|available\??$|price of|cost of|how much (is|for)|looking for|want to buy|can i (get|buy)|sell|link of|link for|details? of|info on|inquiry about|tell me about|find|search for|buy\b)/i;

// "How do I order?" — explain the website's ordering flow. Keyed on order/
// checkout (not "buy"), so product queries like "want to buy X" still route to
// the catalog search above.
const HOW_TO_ORDER =
  /how (do|can|to|does|should|would).{0,25}(order|place an order|checkout|check out)|(want|wish|like|need|how|trying) to (order|checkout|place an order)|place (an|my|the|your) order|order (from|on|through|via|at) (your |the )?(website|site|app|store|page)|order(ing)? (online|here|now)|ordering (process|work|works|flow|steps?|procedure)|how (does|do) (the )?(order|ordering)/i;

const ORDER_FLOW_REPLY =
  'Ordering on CureBasket is easy! Here’s how it works:\n\n' +
  '1️⃣ Search or browse for your medicine and tap “Add to Cart” (adjust the quantity as needed).\n' +
  '2️⃣ Open your Cart and tap “Checkout”. If any item needs a prescription, upload your doctor’s slip (photo or PDF) when prompted.\n' +
  '3️⃣ Enter your shipping address and choose a payment method to place the order securely.\n' +
  '4️⃣ Our pharmacists review and pack your order, then dispatch it.\n' +
  '5️⃣ You’ll get a tracking number to follow your delivery right to your doorstep.\n\n' +
  'Just tell me what you’re looking for and I’ll help you find it. 🙂';

// FAQ rules are matched top-to-bottom; first match wins, so keep more specific
// patterns above broader ones.
const FAQ = [
  // ── Account & login ───────────────────────────────────────────────────────
  { test: /(sign ?up|create.*account|register|registration|make an account|new account|how.*account)/i,
    answer: 'To create an account, tap “Sign Up”, enter your details, and you’re set. Already registered? Just tap “Login”. You’ll need an account to check out, upload prescriptions and track orders.' },
  { test: /(forgot|reset|lost|change).*(password)|password.*(forgot|reset|help|change)|can.?t (log ?in|sign ?in)|locked out/i,
    answer: 'No problem — tap “Login”, then “Forgot Password”, and we’ll email you a reset link. Follow it to set a new password and sign back in.' },
  { test: /(how.*(log ?in|sign ?in)|^log ?in|^sign ?in)/i,
    answer: 'Tap “Login” at the top, then enter your registered email and password. Forgotten it? Use “Forgot Password” to reset.' },

  // ── Prescriptions ─────────────────────────────────────────────────────────
  { test: /(upload|submit|send).*(prescription|rx)|how.*prescription/i,
    answer: 'To upload a prescription, tap “Upload Rx” in the header. Our pharmacists review it and prepare your order shortly. You’ll need to be logged in.' },
  { test: /(need|require|required|necessary|mandatory|do i need|have to have).*(prescription|rx)|prescription.*(need|require|required|necessary|mandatory|must)/i,
    answer: 'Some medicines need a valid doctor’s prescription. If an item in your cart requires one, you’ll be asked to upload it (photo or PDF) at checkout, and our pharmacist verifies it before dispatch.' },

  // ── Orders: track / history / modify / cancel ─────────────────────────────
  { test: /(track|where.?s?|status).*(order|delivery|parcel|package)/i,
    answer: 'You can track an order from “Track Order” in the menu, or under “My Orders” in your account.' },
  { test: /(my orders|order history|past orders|previous orders|view.*orders|see.*orders|where.*(my )?orders)/i,
    answer: 'Your past and current orders live under “My Orders” in your account. Open any order to see its items, status and tracking.' },
  { test: /(change|modify|edit|update|wrong|cancel).*(order)|cancel my order|change.*(delivery )?address.*order|edit.*address/i,
    answer: 'You can cancel an order before it ships, from “My Orders”. To change items or the delivery address on a placed order, message us here and our team will sort it out right away.' },

  // ── Delivery & shipping ───────────────────────────────────────────────────
  { test: /(delivery|shipping).*(time|charge|cost|fee|how long)|how long.*(deliver|ship|arrive)|when.*(arrive|delivered)/i,
    answer: 'Orders usually arrive within a few days. Any delivery charge is shown at checkout based on your address.' },
  { test: /(deliver|ship).*(to|in|my (area|city|pin ?code|zip|location|country|town))|do you deliver|delivery (area|location|available)|international (delivery|shipping)|where do you (deliver|ship)/i,
    answer: 'We deliver to the locations supported at checkout. Enter your shipping address at checkout to see availability and any delivery charge for your area.' },

  // ── Refund / return / cancellation policy ─────────────────────────────────
  { test: /(refund|return|replace|replacement|cancel)/i,
    answer: 'Cancellations are possible before an order ships, and refunds go back to your original payment method (typically 5–7 business days). See our Refund and Cancellation Policy pages for details.' },

  // ── Payment ───────────────────────────────────────────────────────────────
  { test: /(payment|pay\b|card|upi|cod|cash on delivery|net ?banking|emi|wallet)/i,
    answer: 'We support the payment methods shown at checkout (including Cash on Delivery where available). If a payment fails it’s usually a bank-side issue — please retry or use another method.' },

  // ── Coupons / offers ──────────────────────────────────────────────────────
  { test: /(coupon|promo|discount|offer|voucher|deal\b|cashback|apply.*code|code.*work)/i,
    answer: 'Have a coupon code? Enter it in the “Apply Coupon” box at checkout to get your discount. Keep an eye on the homepage for the latest offers too.' },

  // ── Referral ──────────────────────────────────────────────────────────────
  { test: /(referr?al|refer a friend|invite.*friend|refer.*earn)/i,
    answer: 'You can refer friends from the “Referral” page and share your link. Check that page for the current referral rewards.' },

  // ── Authenticity / trust ──────────────────────────────────────────────────
  { test: /(genuine|authentic|original|fake|counterfeit|real medicine|safe to (buy|order)|is (this|your) (site|website|store) (safe|legit|legitimate|trusted|reliable)|trust ?(worthy)?|licen[cs]ed)/i,
    answer: 'Yes — we’re a licensed pharmacy and dispense only genuine, sealed products. Prescription items are verified by our qualified pharmacists before dispatch.' },

  // ── Insurance ─────────────────────────────────────────────────────────────
  { test: /(insurance|mediclaim|claim my|covered by insurance|insurance cover)/i,
    answer: 'See our “Insurance Coverage” page for how insurance works with your order. For a specific claim, our team can guide you — just ask here.' },

  // ── Newsletter / subscription ─────────────────────────────────────────────
  { test: /(subscribe|newsletter|unsubscribe|mailing list|email updates|stop emails)/i,
    answer: 'Subscribe to our newsletter from the footer for offers and updates. To stop emails, use the “Unsubscribe” link in any newsletter.' },

  // ── Browse / categories / brands ──────────────────────────────────────────
  { test: /(what (categor|brand)|browse|product range|catalog\b|list.*(categor|brand|product)|show.*(categor|brand)|all (categories|brands)|what.*you sell)/i,
    answer: 'Browse everything from the menu — explore "Categories", "Brands" or "Customer Favourites", or use the search bar to find a specific medicine.' },

  // ── Contact / hours ───────────────────────────────────────────────────────
  { test: /(contact|phone number|email you|reach you|support hours|opening hours|business hours|customer care|helpline|address of)/i,
    answer: 'You can reach our team right here in chat, or via the details on our Contact page.' },
];

// "What can you do?" — describe the assistant's capabilities.
const CAPABILITIES =
  /(what can you (do|help( me)?( with)?)|how can you help|what (do|can) you (do|assist)|who are you|what are you|are you (a |an )?(bot|human|robot|ai|real person)|^help$|^menu$|^options$|^start$)/i;

const CAPABILITIES_REPLY =
  'I’m CureBasket’s assistant 🤖. I can help you:\n' +
  '• Find medicines and check prices & availability\n' +
  '• Explain how to order, pay, and track deliveries\n' +
  '• Help with prescriptions, accounts, coupons, refunds and returns\n\n' +
  'Just ask — e.g. “do you have paracetamol?”, “how do I order?”, or “where is my order?”. ' +
  'Want a person instead? Say “talk to a human”.';

// Politeness — acknowledge thanks / goodbyes without escalating.
const THANKS = /^(thanks|thank you|thankyou|thx|tysm|ty|appreciate|got it|perfect|awesome|brilliant)\b/i;
const THANKS_REPLY = 'You’re welcome! 😊 Is there anything else I can help you with?';

const BYE = /^(bye|goodbye|see ya|see you|cya|good ?night|gtg|that.?s all|nothing else|no thanks|that.?ll be all|that will be all)\b/i;
const BYE_REPLY = 'Take care! 👋 Come back anytime you need help with your medicines or orders.';

// Strip question/stop words to isolate the product the visitor is asking about.
const extractQuery = (text) =>
  text
    .replace(/[?!.,]/g, ' ')
    .replace(/\b(do|you|have|sell|stock|stocks|stok|stoc|carry|is|are|the|a|an|available|availablke|availble|availabe|availeble|avialable|in|of|price|prce|priec|prices|cost|cst|costs|how|much|many|looking|lookin|look|for|i|need|want|to|buy|get|me|please|hey|hi|hello|any|there|guys|tablet|tablets|capsule|capsules|medicine|medicines|medication|brand|got|link|lnk|links|details|detail|info|inquiry|inquire|inquiries|about)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const searchCatalog = async (query) => {
  if (!query || query.length < 2) return { meds: [], brands: [] };

  const words = query.split(/\s+/).map(w => w.trim()).filter(w => w.length >= 3 || /\d/.test(w));
  if (words.length === 0) return { meds: [], brands: [] };

  const conditions = words.map(word => {
    const escaped = escapeRegex(word);
    const fuzzyWord = escaped.replace(/(\d+)([a-zA-Z]+)/g, '$1\\s*$2')
                             .replace(/([a-zA-Z]+)(\d+)/g, '$1\\s*$2');
    const rx = new RegExp(fuzzyWord, 'i');
    return {
      $or: [
        { title: rx },
        { name: rx },
        { genericFor: rx },
        { activeIngredient: rx }
      ]
    };
  });

  const [meds, brands] = await Promise.all([
    Medicine.find({
      status: 'Active',
      $and: conditions
    }).limit(4).select('title pricePerUnit priceLabel'),
    Brand.find({
      $and: words.map(w => ({ name: new RegExp(escapeRegex(w), 'i') }))
    }).limit(3).select('name'),
  ]);

  return { meds, brands };
};

const formatMeds = (query, meds) => {
  const list = meds
    .map((m) => `[${m.title}](/product/${m._id})${m.pricePerUnit != null ? ` (₹${m.pricePerUnit})` : ''}`)
    .join(', ');
  return `Yes! We have: ${list}. You can click the links to view details and place your order.`;
};

// ── Gemini fallback (free tier, REST — no SDK dependency) ────────────────────
const callGemini = async (system, user) => {
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 220 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
  const data = await res.json();
  const txt = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('').trim();
  if (!txt) throw new Error('Gemini empty response');
  return txt;
};

const geminiReply = async (text) => {
  if (!process.env.GEMINI_API_KEY) return { text: ESCALATE_MSG, escalate: true };
  try {
    const { meds, brands } = await searchCatalog(extractQuery(text));
    const ctx = [
      meds.length ? `Medicines: ${meds.map((m) => m.title).join(', ')}` : 'Medicines: (none matched)',
      brands.length ? `Brands: ${brands.map((b) => b.name).join(', ')}` : '',
    ].filter(Boolean).join(' | ');

    const system =
      "You are CureBasket's website assistant for an online pharmacy. Help only with using the " +
      'website: product availability, orders, delivery, prescriptions, returns and payments. ' +
      'State product availability and prices ONLY from the provided CATALOG context — never invent ' +
      'products, prices or stock. You must NOT give medical, dosage, diagnosis or drug-interaction ' +
      'advice; if asked, briefly decline and append the token [[ESCALATE]]. If you cannot help, or ' +
      'the visitor wants a human, append [[ESCALATE]]. Keep replies under 60 words and friendly.';
    const out = await callGemini(system, `CATALOG: ${ctx}\n\nVisitor: ${text}`);
    const escalate = /\[\[ESCALATE\]\]/i.test(out);
    const clean = out.replace(/\[\[ESCALATE\]\]/gi, '').trim();
    return { text: clean || ESCALATE_MSG, escalate };
  } catch (err) {
    console.error('[chatBot] Gemini failed, escalating:', err.message);
    return { text: ESCALATE_MSG, escalate: true };
  }
};

// ── Public: decide the assistant's reply for a user message ──────────────────
const generateBotReply = async (raw) => {
  const text = (raw || '').trim();
  if (!text) return { text: ESCALATE_MSG, escalate: true };

  if (WANT_HUMAN.test(text)) {
    return { text: 'Sure — connecting you with our team now. They’ll reply right here shortly.', escalate: true };
  }
  if (MEDICAL_ADVICE.test(text)) {
    return {
      text: 'I’m not able to give medical or dosage advice. Please consult a doctor for that — I’ll connect you with our pharmacist who can help further.',
      escalate: true,
    };
  }
  if (GREETING.test(text) && text.length < 40) {
    return { text: 'Hi! 👋 I’m CureBasket’s assistant. Ask me about product availability, prescriptions, delivery or your orders.', escalate: false };
  }
  if (CAPABILITIES.test(text)) {
    return { text: CAPABILITIES_REPLY, escalate: false };
  }
  if (THANKS.test(text)) {
    return { text: THANKS_REPLY, escalate: false };
  }
  if (BYE.test(text)) {
    return { text: BYE_REPLY, escalate: false };
  }

  for (const f of FAQ) {
    if (f.test.test(text)) return { text: f.answer, escalate: false };
  }

  if (HOW_TO_ORDER.test(text)) {
    return { text: ORDER_FLOW_REPLY, escalate: false };
  }

  if (AVAILABILITY.test(text)) {
    const q = extractQuery(text);
    if (q.length >= 2) {
      const { meds, brands } = await searchCatalog(q);
      if (meds.length) return { text: formatMeds(q, meds), escalate: false };
      if (brands.length) {
        return { text: `Yes, we carry ${brands.map((b) => b.name).join(', ')}. You can browse their products on the site.`, escalate: false };
      }
      return {
        text: `I couldn’t find “${q}” in our catalog right now. You can search the site, or say “talk to a person” and I’ll connect you with our team.`,
        escalate: false,
      };
    }
  }

  // Genuinely ambiguous → Gemini (or escalate if unavailable).
  return geminiReply(text);
};

// ── Public: run the assistant for a conversation's latest user message ───────
const respond = async (conversationId) => {
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || conversation.status === 'human_active') return;

    const last = await Message.findOne({ conversation: conversationId, sender: 'user' }).sort('-createdAt');
    if (!last) return;

    let { text, escalate } = await generateBotReply(last.text);

    let clarificationCount = conversation.clarificationCount || 0;
    let finalReplyText = text;
    let finalEscalate = escalate;

    if (escalate) {
      if (clarificationCount >= 2) {
        const userText = last.text.toLowerCase().trim();
        const isYes = /^(yes|yeah|yep|sure|ok|okay|y|connect|executive|chemist|human|person|please)/i.test(userText);
        const isNo = /^(no|nope|neither|dont|don't|n|stop)/i.test(userText);
        
        if (isYes) {
          finalReplyText = "Sure! Connecting you with a member of our team now. They’ll reply right here shortly.";
          finalEscalate = true;
          clarificationCount = 0;
        } else if (isNo) {
          finalReplyText = "Okay, I won't connect you. How else can I help you today?";
          finalEscalate = false;
          clarificationCount = 0;
        } else {
          finalReplyText = "Let me connect you with a member of our team who can help with that — they’ll reply right here shortly.";
          finalEscalate = true;
          clarificationCount = 0;
        }
      } else {
        clarificationCount += 1;
        finalEscalate = false;
        if (clarificationCount === 1) {
          finalReplyText = "I'm sorry, I didn't quite catch that. Could you please rephrase or clarify your question?";
        } else if (clarificationCount === 2) {
          finalReplyText = "I'm still having trouble understanding. Would you like me to connect you to an executive?";
        }
      }
    } else {
      clarificationCount = 0;
    }

    conversation.clarificationCount = clarificationCount;

    const botMsg = await Message.create({
      conversation: conversationId,
      sender: finalEscalate ? 'system' : 'bot',
      senderName: finalEscalate ? '' : 'CureBasket Assistant',
      text: finalReplyText,
      readByAdmin: !finalEscalate, // escalations should show as needing attention
      readByUser: false,
    });

    conversation.lastMessageAt = botMsg.createdAt;
    conversation.lastMessageText = finalReplyText;
    conversation.lastMessageSender = botMsg.sender;
    if (finalEscalate) {
      conversation.status = 'waiting_human';
      conversation.unreadForAdmin = true;
    } else {
      conversation.status = 'bot';
      conversation.unreadForAdmin = false;
    }
    await conversation.save();

    // Push the assistant's reply to the customer live, and refresh the admin
    // inbox (an escalation flips the conversation to "waiting_human").
    emitNewMessage(conversation, botMsg);
    emitConversationUpdated(conversation);

    if (finalEscalate) notifyChemist(conversation, last.text);
  } catch (err) {
    console.error('[chatBot] respond failed:', err.message);
  }
};

module.exports = { generateBotReply, respond };
