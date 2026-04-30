import cat_allergy from '../assets/allergy.png'
import cat_skin from '../assets/skin-care.png'
import cat_acne from '../assets/acne.png'
import cat_diabetes from '../assets/diabetes.png'
import cat_antibiotics from '../assets/antibiotic.png'
import cat_pain from '../assets/pain-relief.png'
import cat_cancer from '../assets/anti-cancer.png'
import cat_eye from '../assets/eye-care.png'

const categories = [
  { name: 'Allergy', img: cat_allergy },
  { name: 'Beauty & Skin Care', img: cat_skin },
  { name: 'Acne', img: cat_acne },
  { name: 'Diabetes', img: cat_diabetes },
  { name: 'Antibiotics', img: cat_antibiotics },
  { name: 'Pain Relief', img: cat_pain },
  { name: 'Anti Cancer', img: cat_cancer },
  { name: 'Eye Care', img: cat_eye },
]

// Repeat items for infinite scroll feel
const extendedCategories = [...categories, ...categories, ...categories]

function ShopByCategory() {
  return (
    <section className="relative -mt-[180px] pt-56 pb-2 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[160%] h-[200%] bg-[#fcf0f0] rounded-t-[100%] translate-y-32"></div>
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 text-center">
        <h2 className="text-[32px] md:text-[44px] font-bold text-gray-900 leading-tight mb-4">
          Shop By Category
        </h2>
        <div className="flex overflow-x-auto gap-8 md:gap-16 pb-10 no-scrollbar justify-start px-4">
          {extendedCategories.map((cat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-0 shrink-0 group cursor-pointer px-4">
              <div className="w-[180px] h-[180px] md:w-[200px] md:h-[200px]">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className={`w-full h-full object-contain ${cat.name === 'Pain Relief' ? 'scale-[0.7]' : ''}`}
                />
              </div>
              <span className="text-[14px] md:text-[18px] font-bold text-[#005050] text-center max-w-[140px] leading-tight transition-colors -mt-4">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ShopByCategory
