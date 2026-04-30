import section1 from '../assets/section-1.png'
import section2 from '../assets/section-2.png'
import section3 from '../assets/section-3.png'
import section4 from '../assets/section-4.png'

function FeatureIcons() {
  return (
    <section className="bg-[#f7f2ea] pt-24 pb-8">
      <div className="max-w-[1450px] mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32">
          <img src={section1} alt="Insurance Coverage" className="h-32 md:h-44 object-contain" />
          <img src={section2} alt="Wide Collection" className="h-32 md:h-44 object-contain" />
          <img src={section3} alt="Secured Site" className="h-32 md:h-44 object-contain" />
          <img src={section4} alt="Official Blog" className="h-32 md:h-44 object-contain" />
        </div>
      </div>
    </section>
  )
}

export default FeatureIcons
