import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import allergyImg from '../assets/allergy.png';
import diabetesImg from '../assets/diabetes.png';
import skinCareImg from '../assets/skin-care.png';

const BlogDetailPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const savedBlogs = localStorage.getItem('cb_blogs');
    if (savedBlogs) {
      setBlogs(JSON.parse(savedBlogs));
    }
  }, []);

  const blogFromStorage = blogs.find(b => b.slug === slug);
  const blog = blogFromStorage || blogData[slug] || blogData['splinter'];

  return (
    <div className="bg-white min-h-screen font-sans">

      {/* Banner Section */}
      <div className="relative bg-[#f5b23e] px-4 md:px-8 pt-8 md:pt-12" style={{ paddingBottom: '120px' }}>

        {/* Decorative sparkle icons */}
        <div className="absolute top-8 left-1/2 flex items-center gap-3 opacity-60 pointer-events-none">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/>
          </svg>
          <div className="w-2 h-2 rounded-full bg-gray-800 opacity-40"></div>
        </div>
        <div className="absolute bottom-16 right-1/4 opacity-40 pointer-events-none">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/>
          </svg>
        </div>

        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
          
          {/* Left Side — Content */}
          <div className="md:w-1/2 text-gray-900">
            <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{blog.category}</span>
            <h1 className="text-2xl md:text-5xl font-bold text-gray-900 mt-4 leading-tight">{blog.title}</h1>
            
            {/* Metadata (Author, Date) */}
            <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-4 md:mt-6 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-xs">
                  CB
                </div>
                <span className="font-medium">CureBasket Medical Team</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-500"></div>
              <span>May 11, 2026</span>
              <div className="w-1 h-1 rounded-full bg-gray-500"></div>
              <span>8 min read</span>
            </div>
          </div>

          {/* Right Side — Image (extends below banner) */}
          <div className="hidden md:flex md:w-1/2 flex-col items-end" style={{ marginBottom: '-100px' }}>
            <div className="bg-white p-4 rounded-3xl shadow-xl max-w-[450px]">
              <img 
                src={blog.image} 
                alt={blog.title} 
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>

        </div>

        {/* Bottom Curved Wave Shape */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px]" fill="#ffffff">
            <path d="M0,64 C150,120 350,120 500,64 C650,8 850,8 1200,64 L1200,120 L0,120 Z"></path>
          </svg>
        </div>

      </div>

      {/* Section Navigation Points */}
      <div className="border-b border-gray-200 mt-0">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-3 flex items-center gap-2 md:gap-3 overflow-x-auto text-sm font-medium text-gray-700 whitespace-nowrap">
          {['Introduction', 'Causes', 'Symptoms', 'Treatment', 'Prevention', 'When to See a Doctor', 'Conclusion'].map((section, idx) => (
            <a
              key={idx}
              href={`#${section.toLowerCase().replace(/\s+/g, '-')}`}
              className={`px-4 py-2 rounded-full transition-colors ${idx === 0 ? 'bg-[#f5b23e] text-gray-900 font-bold' : 'hover:bg-gray-100'}`}
            >
              {section}
            </a>
          ))}
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12 text-gray-800 leading-relaxed space-y-10 md:space-y-12">
        {blog.sections ? (
          Array.isArray(blog.sections) ? (
            blog.sections.map((section, idx) => (
              section.content && (
                <section id={section.title.toLowerCase().replace(/\s+/g, '-')} key={idx} className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e] capitalize">{section.title}</h2>
                  <div className="text-gray-600 text-[15px] space-y-4">
                    {section.content.split('\n').map((para, i) => para && <p key={i}>{para}</p>)}
                  </div>
                </section>
              )
            ))
          ) : (
            Object.entries(blog.sections).map(([id, content]) => (
              content && (
                <section id={id} key={id} className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e] capitalize">{id.replace(/([A-Z])/g, ' $1')}</h2>
                  <div className="text-gray-600 text-[15px] space-y-4">
                    {content.split('\n').map((para, i) => para && <p key={i}>{para}</p>)}
                  </div>
                </section>
              )
            ))
          )
        ) : (
          blog.content
        )}

        {/* Related Posts */}
        <section id="related-posts" className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-[#f5b23e]">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/blog/allergy')}>
              <div className="relative h-48">
                <img src={allergyImg} alt="Allergy" className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-[#f5b23e] text-white text-xs font-bold px-3 py-1 rounded-full">Allergy</span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">How to Manage Seasonal Allergies</h3>
                <p className="text-gray-600 text-sm line-clamp-2">Learn effective ways to manage seasonal allergies and enjoy the outdoors without sneezing.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/blog/diabetes')}>
              <div className="relative h-48">
                <img src={diabetesImg} alt="Diabetes" className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-[#f5b23e] text-white text-xs font-bold px-3 py-1 rounded-full">Diabetes</span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Understanding Type 2 Diabetes</h3>
                <p className="text-gray-600 text-sm line-clamp-2">A comprehensive guide to understanding, preventing, and managing Type 2 Diabetes.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/blog/skincare')}>
              <div className="relative h-48">
                <img src={skinCareImg} alt="Skin Care" className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-[#f5b23e] text-white text-xs font-bold px-3 py-1 rounded-full">Skin Care</span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Daily Skin Care Routine for Glowing Skin</h3>
                <p className="text-gray-600 text-sm line-clamp-2">Discover the essential steps for a daily skin care routine that promotes healthy, glowing skin.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

// Data object for different blogs
const blogData = {
  'splinter': {
    title: "How to Safely Remove a Splinter",
    category: "First Aid",
    image: allergyImg, // Using allergyImg as fallback for splinter for now
    content: (
      <>
        {/* Introduction */}
        <section id="introduction">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Introduction</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>
              A splinter is a small fragment of a foreign object — such as wood, glass, or metal — that becomes embedded in the skin. While splinters are usually minor injuries, they can be painful and may lead to infection if not removed promptly. Understanding how to safely remove a splinter at home can save you a trip to the doctor and prevent complications.
            </p>
            <p>
              Splinters can vary greatly in size, depth, and material. The most common type is a wood splinter, which often has rough edges and can easily harbor bacteria. Glass splinters are often smooth but can be extremely sharp and difficult to see. Metal splinters are usually sharp and can carry a high risk of infection due to rust or oils on the metal.
            </p>
            <p>
              When a foreign object enters the skin, the body's immune system recognizes it as an invader. This triggers an inflammatory response, causing redness, swelling, and pain. If the splinter is not removed, this inflammation can worsen, and a bacterial infection may develop. In some cases, the body may try to wall off the object, forming a granuloma.
            </p>
            <p>
              Therefore, prompt and proper removal is essential. This guide will cover the causes, symptoms, and various methods for safe splinter removal at home, as well as when you should seek professional medical help.
            </p>
          </div>
        </section>

        {/* Causes */}
        <section id="causes">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Causes</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>
              Splinters can happen to anyone and occur in a variety of everyday situations. They are most commonly caused by direct contact with materials that can fragment easily. Understanding the common causes can help you take preventive measures.
            </p>
            <p><strong>Common scenarios include:</strong></p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong>Walking Barefoot:</strong> This is perhaps the most frequent cause. Walking without shoes on wooden floors, decks, or outdoor areas with debris can easily lead to splinters in the feet. Rough, weathered wood is particularly hazardous.</li>
              <li><strong>Handling Raw Materials:</strong> Working with untreated wood, glass, or metal without proper protection is a major risk. Carpenters, gardeners, and DIY enthusiasts are often exposed to these materials.</li>
              <li><strong>Broken Objects:</strong> Handling broken glass or ceramic items can result in tiny shards entering the skin. Even small, seemingly insignificant fragments can cause significant pain.</li>
              <li><strong>Outdoor Activities:</strong> Gardening, hiking, or even playing in areas with thorns or brush can expose skin to natural splinters. Thorns from plants like roses or blackberries are common culprits.</li>
              <li><strong>Industrial and Workshop Environments:</strong> Working in environments where metal is cut or ground can produce fine metal shavings that can easily pierce the skin.</li>
            </ul>
          </div>
        </section>

        {/* Symptoms */}
        <section id="symptoms">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Symptoms</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>
              Most splinters are visible to the naked eye, but some may be buried deeper under the skin. Recognizing the symptoms promptly is key to ensuring timely removal and preventing infection.
            </p>
            <p><strong>Common symptoms include:</strong></p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong>A Small Speck or Line:</strong> You may see a dark or colored line or speck under the skin, indicating the presence of the foreign object.</li>
              <li><strong>A Feeling of Something Stuck:</strong> A distinct sensation that something is lodged in the skin, especially when pressure is applied to the area.</li>
              <li><strong>Pain:</strong> Pain at the site of the splinter is common. The pain may be sharp or dull, depending on the depth and size of the splinter.</li>
              <li><strong>Inflammation:</strong> Redness, swelling, and warmth around the area are signs that the body is reacting to the foreign object. This is part of the normal inflammatory response.</li>
              <li><strong>Tenderness:</strong> The area around the splinter may be tender to the touch.</li>
            </ul>
          </div>
        </section>

        {/* Treatment */}
        <section id="treatment">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Treatment</h2>
          <p className="text-gray-600 text-[15px] mb-4">
            There are several effective home methods to remove a splinter. Always wash your hands and clean the area with soap and warm water before attempting removal to prevent infection. Here are the most common and effective methods used by professionals and at home:
          </p>
          
          <div className="space-y-6 text-gray-600 text-[15px]">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Method 1: The Tweezers Method (Best for visible splinters)</h3>
              <p>If the end of the splinter is sticking out of the skin, this is the easiest method. Sterilize the tips of your tweezers with rubbing alcohol. Use a magnifying glass if necessary to see the splinter clearly. Grip the end of the splinter firmly and pull it out slowly and steadily at the same angle it entered the skin. Pulling it straight up or at a different angle might break it, leaving part of it behind.</p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Method 2: The Needle Method (For splinters just under the surface)</h3>
              <p>If the splinter is completely buried under a thin layer of skin, you may need to use a clean needle. Sterilize a sewing needle with rubbing alcohol. Gently use the needle tip to break the skin over one end of the splinter. Once the tip of the splinter is exposed, use tweezers to pull it out. Be careful not to push the splinter deeper or poke too hard.</p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Method 3: The Baking Soda Paste (For deep or invisible splinters)</h3>
              <p>Baking soda can cause the skin to swell slightly, which can push the splinter toward the surface. Mix 1/4 teaspoon of baking soda with a little water to make a thick paste. Clean the area and apply the paste over the splinter. Cover it with a bandage and leave it on for 24 hours. When you remove the bandage, the splinter may be sticking out or at least close enough to the surface to remove with tweezers.</p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Method 4: Epsom Salt Soak (For softening the skin)</h3>
              <p>Soaking the affected area in a solution of Epsom salts and warm water can help draw out the splinter. Dissolve a cup of Epsom salts in a bowl of warm water. Soak the area for 20 to 30 minutes. This softens the skin around the splinter, making it easier to remove, and the osmotic pressure can sometimes pull the splinter closer to the surface.</p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Aftercare is Crucial</h3>
              <p>Once the splinter is out, gently wash the area again with soap and water. Apply an antibiotic ointment to prevent infection and cover the wound with a bandage. Keep an eye on it for the next few days for any signs of infection such as increased redness, swelling, or pus.</p>
            </div>
          </div>
        </section>

        {/* Prevention */}
        <section id="prevention">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Prevention</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>
              While it's impossible to avoid splinters entirely, you can reduce your risk significantly by taking a few simple precautions in your daily life.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong>Wear Shoes:</strong> Always wear shoes or sandals when walking on wooden decks or rough surfaces.</li>
              <li><strong>Use Gloves:</strong> Wear appropriate work gloves when handling wood, glass, or metal.</li>
              <li><strong>Handle Breakable Objects with Care:</strong> Be cautious when handling glass or ceramic items.</li>
              <li><strong>Maintain Wooden Surfaces:</strong> Regularly sand and seal wooden handrails and furniture.</li>
            </ul>
          </div>
        </section>

        {/* When to See a Doctor */}
        <section id="when-to-see-a-doctor">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">When to See a Doctor</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>
              In most cases, splinters can be safely removed at home. However, seek medical attention if:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>The splinter is large, deep, or located near the eye.</li>
              <li>You cannot remove the splinter yourself or it breaks during removal.</li>
              <li>The area shows signs of infection like increased redness, swelling, or pus.</li>
              <li>Your tetanus vaccination is not up to date.</li>
            </ul>
          </div>
        </section>

        {/* Conclusion */}
        <section id="conclusion">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Conclusion</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>
              Splinters are a common nuisance, but with the right approach, they can be easily and safely managed. By understanding the causes, recognizing the symptoms, and knowing when to seek professional help, you can protect yourself and your family from unnecessary pain and complications.
            </p>
          </div>
        </section>
      </>
    )
  },
  'allergy': {
    title: "How to Manage Seasonal Allergies",
    category: "Allergy",
    image: allergyImg,
    content: (
      <>
        {/* Introduction */}
        <section id="introduction">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Introduction</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>Seasonal allergies, often called hay fever, are immune system reactions to airborne substances like pollen, mold spores, and pet dander. These allergies are particularly common in the spring and fall when plants release pollen into the air.</p>
            <p>Managing seasonal allergies effectively requires a combination of avoiding triggers, using appropriate medications, and making lifestyle adjustments. This guide will help you understand how to minimize your symptoms and enjoy the outdoors.</p>
          </div>
        </section>

        {/* Causes */}
        <section id="causes">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Causes</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>The primary cause of seasonal allergies is the immune system's overreaction to harmless substances. Common triggers include:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong>Tree Pollen:</strong> Common in early spring (oak, cedar, birch).</li>
              <li><strong>Grass Pollen:</strong> Common in late spring and summer.</li>
              <li><strong>Weed Pollen:</strong> Common in the fall (ragweed).</li>
              <li><strong>Mold Spores:</strong> Can be found indoors and outdoors, often in damp areas.</li>
            </ul>
          </div>
        </section>

        {/* Symptoms */}
        <section id="symptoms">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Symptoms</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>Symptoms can vary from mild to severe and typically include:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Sneezing and runny or stuffy nose.</li>
              <li>Itchy, watery, or red eyes.</li>
              <li>Itchy throat, nose, or ears.</li>
              <li>Postnasal drip and cough.</li>
              <li>Fatigue due to poor sleep caused by symptoms.</li>
            </ul>
          </div>
        </section>

        {/* Treatment */}
        <section id="treatment">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Treatment</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>There are several ways to treat seasonal allergies:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong>Antihistamines:</strong> Reduce sneezing, itching, and runny nose.</li>
              <li><strong>Nasal Steroid Sprays:</strong> Reduce inflammation in the nose.</li>
              <li><strong>Decongestants:</strong> Help relieve a stuffy nose (use short-term).</li>
              <li><strong>Immunotherapy:</strong> Allergy shots or tablets for long-term relief.</li>
            </ul>
          </div>
        </section>

        {/* Prevention */}
        <section id="prevention">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Prevention</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>Minimize exposure to allergens with these tips:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Stay indoors on dry, windy days when pollen counts are highest.</li>
              <li>Keep windows and doors closed during pollen season.</li>
              <li>Use air conditioning in your home and car.</li>
              <li>Wash your hair and clothes after spending time outdoors.</li>
            </ul>
          </div>
        </section>

        {/* When to See a Doctor */}
        <section id="when-to-see-a-doctor">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">When to See a Doctor</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>Consult a healthcare professional if:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Over-the-counter medications do not provide relief.</li>
              <li>Your symptoms are severe or affect your quality of life.</li>
              <li>You experience symptoms like shortness of breath or wheezing.</li>
              <li>You want to explore long-term treatment options like immunotherapy.</li>
            </ul>
          </div>
        </section>

        {/* Conclusion */}
        <section id="conclusion">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Conclusion</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>Seasonal allergies can be a significant nuisance, but they are highly manageable. By understanding your triggers, using effective treatments, and taking preventive measures, you can enjoy all seasons comfortably.</p>
          </div>
        </section>
      </>
    )
  },
  'diabetes': {
    title: "Understanding Type 2 Diabetes",
    category: "Diabetes",
    image: diabetesImg,
    content: (
      <>
        {/* Introduction */}
        <section id="introduction">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Introduction</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>Type 2 diabetes is a chronic condition that affects the way your body processes blood sugar (glucose). With type 2 diabetes, your body either doesn't produce enough insulin or resists its effects.</p>
            <p>It is the most common form of diabetes and is often associated with lifestyle factors. Understanding the condition is the first step toward effective management and prevention of complications.</p>
          </div>
        </section>

        {/* Causes */}
        <section id="causes">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Causes</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>Type 2 diabetes develops when the body becomes resistant to insulin or when the pancreas stops producing enough insulin. Risk factors include:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Being overweight or obese.</li>
              <li>Physical inactivity.</li>
              <li>Genetics and family history.</li>
              <li>Age (risk increases as you get older).</li>
              <li>High blood pressure or abnormal cholesterol levels.</li>
            </ul>
          </div>
        </section>

        {/* Symptoms */}
        <section id="symptoms">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Symptoms</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>Symptoms often develop slowly and may be mild initially:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Increased thirst and frequent urination.</li>
              <li>Increased hunger, even after eating.</li>
              <li>Unintended weight loss.</li>
              <li>Fatigue and blurred vision.</li>
              <li>Slow-healing sores or frequent infections.</li>
            </ul>
          </div>
        </section>

        {/* Treatment */}
        <section id="treatment">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Treatment</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>Management focuses on keeping blood sugar levels within a target range:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong>Healthy Eating:</strong> Focusing on fruits, vegetables, and whole grains.</li>
              <li><strong>Regular Exercise:</strong> Helps lower blood sugar and improve insulin sensitivity.</li>
              <li><strong>Medication:</strong> Oral medications or insulin therapy may be prescribed.</li>
              <li><strong>Blood Sugar Monitoring:</strong> Regular checks to ensure levels are controlled.</li>
            </ul>
          </div>
        </section>

        {/* Prevention */}
        <section id="prevention">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Prevention</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>Lifestyle choices can help prevent or delay type 2 diabetes:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Maintain a healthy weight.</li>
              <li>Eat a balanced, low-sugar diet.</li>
              <li>Be physically active for at least 30 minutes most days.</li>
              <li>Avoid smoking and limit alcohol consumption.</li>
            </ul>
          </div>
        </section>

        {/* When to See a Doctor */}
        <section id="when-to-see-a-doctor">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">When to See a Doctor</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>See a doctor if you notice any symptoms of type 2 diabetes or if you have significant risk factors. Early diagnosis and treatment are crucial for preventing complications like heart disease, nerve damage, and kidney problems.</p>
          </div>
        </section>

        {/* Conclusion */}
        <section id="conclusion">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Conclusion</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>Type 2 diabetes is a serious, lifelong condition, but it can be managed effectively. With proper care, a healthy diet, and regular exercise, people with type 2 diabetes can live long, healthy lives.</p>
          </div>
        </section>
      </>
    )
  },
  'skincare': {
    title: "Daily Skin Care Routine for Glowing Skin",
    category: "Skin Care",
    image: skinCareImg,
    content: (
      <>
        {/* Introduction */}
        <section id="introduction">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Introduction</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>A consistent daily skin care routine is the foundation for healthy, glowing skin. It helps protect your skin from environmental damage, prevents premature aging, and addresses specific concerns like acne or dryness.</p>
            <p>Building a routine doesn't have to be complicated. By understanding your skin type and using the right products in the right order, you can achieve your skincare goals.</p>
          </div>
        </section>

        {/* Causes */}
        <section id="causes">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Causes</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>Skin conditions and concerns can be caused by various factors:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong>Genetics:</strong> Determines your basic skin type (oily, dry, combination).</li>
              <li><strong>Environment:</strong> Sun exposure, pollution, and climate affect skin health.</li>
              <li><strong>Lifestyle:</strong> Diet, sleep, and stress levels impact your skin's appearance.</li>
              <li><strong>Aging:</strong> Natural loss of collagen and elastin over time.</li>
            </ul>
          </div>
        </section>

        {/* Symptoms */}
        <section id="symptoms">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Symptoms</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>Common signs that your skin needs attention or a better routine include:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Dryness, flakiness, or a feeling of tightness.</li>
              <li>Excessive oiliness or frequent breakouts.</li>
              <li>Dullness or uneven skin tone.</li>
              <li>Fine lines, wrinkles, or loss of elasticity.</li>
            </ul>
          </div>
        </section>

        {/* Treatment */}
        <section id="treatment">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Treatment</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>A basic, effective skincare routine involves four essential steps:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong>Cleanse:</strong> Remove dirt, oil, and makeup twice daily.</li>
              <li><strong>Tone:</strong> Balance skin pH and prepare it for next steps (optional).</li>
              <li><strong>Moisturize:</strong> Hydrate and lock in moisture.</li>
              <li><strong>Protect:</strong> Apply sunscreen (SPF 30+) every morning.</li>
            </ul>
          </div>
        </section>

        {/* Prevention */}
        <section id="prevention">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Prevention</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>Prevent premature aging and damage with these practices:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Wear sunscreen daily, even on cloudy days.</li>
              <li>Stay hydrated by drinking plenty of water.</li>
              <li>Eat a diet rich in antioxidants (fruits and vegetables).</li>
              <li>Avoid touching your face frequently to prevent bacteria transfer.</li>
            </ul>
          </div>
        </section>

        {/* When to See a Doctor */}
        <section id="when-to-see-a-doctor">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">When to See a Doctor</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>Consult a dermatologist if you experience persistent acne, sudden changes in moles or skin lesions, severe irritation, or if you suspect you have a skin condition like eczema or rosacea.</p>
          </div>
        </section>

        {/* Conclusion */}
        <section id="conclusion">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#f5b23e]">Conclusion</h2>
          <div className="space-y-4 text-gray-600 text-[15px]">
            <p>Skincare is a journey, not a quick fix. Consistency is key. By following a basic routine and protecting your skin from damage, you can maintain a healthy, glowing complexion for years to come.</p>
          </div>
        </section>
      </>
    )
  }
};

export default BlogDetailPage;
