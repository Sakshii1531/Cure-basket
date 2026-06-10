const Medicine = require('../models/Medicine');
const Brand = require('../models/Brand');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { notifyChemist } = require('./chatNotifications');

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

const FAQ = [
  { test: /(upload|submit|send).*(prescription|rx)|how.*prescription/i,
    answer: 'To upload a prescription, tap “Upload Rx” in the header. Our pharmacists review it and prepare your order shortly. You’ll need to be logged in.' },
  { test: /(track|where.?s?|status).*(order|delivery|parcel|package)/i,
    answer: 'You can track an order from “Track Order” in the menu, or under “My Orders” in your account.' },
  { test: /(delivery|shipping).*(time|charge|cost|fee|how long)|how long.*(deliver|ship|arrive)/i,
    answer: 'Orders usually arrive within a few days. Any delivery charge is shown at checkout based on your address.' },
  { test: /(refund|return|cancel)/i,
    answer: 'Cancellations are possible before an order ships, and refunds go back to your original payment method (typically 5–7 business days). See our Refund Policy for details.' },
  { test: /(payment|pay\b|card|upi|cod|cash on delivery)/i,
    answer: 'We support the payment methods shown at checkout. If a payment fails it’s usually a bank-side issue — please retry or use another method.' },
  { test: /(contact|phone number|email you|reach you|support hours|customer care)/i,
    answer: 'You can reach our team right here in chat, or via the details on our Contact page.' },
];

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

  for (const f of FAQ) {
    if (f.test.test(text)) return { text: f.answer, escalate: false };
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

    if (finalEscalate) notifyChemist(conversation, last.text);
  } catch (err) {
    console.error('[chatBot] respond failed:', err.message);
  }
};

module.exports = { generateBotReply, respond };
