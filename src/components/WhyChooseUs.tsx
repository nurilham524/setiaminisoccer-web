"use client";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export function WhyChooseUs() {
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1, spacing: 16 },
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 3, spacing: 16 },
      },
    },
  });

  return (
    <section className="pt-16 md:pt-24 pb-24 md:pb-44 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Kenapa Memilih Kami?
          </h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto rounded"></div>
        </div>

        <div ref={sliderRef} className="keen-slider">
          {/* Feature 1 */}
          <div className="keen-slider__slide">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-xl transition duration-300 text-center group">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 text-3xl md:text-4xl group-hover:scale-110 transition">
                🌱
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-900">
                Rumput Standar FIFA
              </h3>
              <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                Rumput sintetis monofilamen import yang empuk dan aman saat
                jatuh.
              </p>
            </div>
          </div>
          {/* Feature 2 */}
          <div className="keen-slider__slide">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-xl transition duration-300 text-center group">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 text-3xl md:text-4xl group-hover:scale-110 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#000000"
                  viewBox="0 0 256 256"
                >
                  <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"></path>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-900">
                Lokasi Strategis
              </h3>
              <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                Lokasi berada di tengah kota dengan akses mudah dan parkir luas.
              </p>
            </div>
          </div>
          {/* Feature 3 */}
          <div className="keen-slider__slide">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-xl transition duration-300 text-center group">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 text-3xl md:text-4xl group-hover:scale-110 transition">
                🚿
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-900">
                Fasilitas Premium
              </h3>
              <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                Kamar mandi dilengkapi dengan sabun mandi, sabun muka, shampoo,
                loker dan kantin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}