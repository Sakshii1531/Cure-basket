import med1 from '../assets/med1.png'
import med2 from '../assets/med2.png'
import med3 from '../assets/med3.png'
import med4 from '../assets/med4.png'
import med5 from '../assets/med5.png'

const products = [
  { img: med1, name: 'Austro Ivermectin 12 mg', generic: '(Ivermectin)', price: '115', scale: 'scale-[1.8]' },
  { img: med2, name: 'A Ret Gel - 0.1%', generic: '(Tretinoin Gel)', price: '40.50', scale: 'scale-[1.4]' },
  { img: med3, name: 'Mebex 100mg', generic: '(Mebendazole)', price: '60.00', scale: 'scale-[1.4]' },
  { img: med4, name: 'A Ret Gel - 0.05%', generic: '(Tretinoin Gel)', price: '32.00', scale: 'scale-[1.4]' },
  { img: med5, name: 'A Ret Gel - .025%', generic: '(Tretinoin Gel)', price: '31.00', scale: 'scale-[1.4]' },
]

function ProductCard({ product }) {
  return (
    <div className="min-w-[380px] min-h-[240px] snap-start bg-[#F3F4F6] rounded-[20px] overflow-hidden shadow-lg border border-gray-200 flex flex-col h-full duration-300">
      <div className="flex-1 p-5 flex items-center gap-8">
        <div className="w-1/2 flex items-center justify-center">
          <img src={product.img} alt={product.name} className={`w-full h-auto object-contain drop-shadow-md ${product.scale}`} />
        </div>
        <div className="w-1/2 flex flex-col justify-center">
          <h3 className="text-[22px] font-bold text-[#1a1a1a] leading-tight mb-1">{product.name}</h3>
          <p className="text-[12px] text-gray-500 font-semibold mb-3">{product.generic}</p>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-[14px] font-bold text-black">$</span>
            <span className="text-[28px] font-black text-black leading-none">{product.price}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductSection({ title }) {
  return (
    <section className="px-4 md:px-12 pt-16 pb-10 bg-white">
      <div className="max-w-[1200px] mx-auto mb-10 flex flex-col items-center text-center">
        <h2 className="text-[36px] font-bold text-[#006B6B] leading-none">{title}</h2>
      </div>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory no-scrollbar">
          {products.map((product, i) => (
            <ProductCard key={i} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductSection
