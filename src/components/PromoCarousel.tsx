"use client";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

function AutoplayPlugin(slider: any) {
  let timeout: NodeJS.Timeout;
  let mouseOver = false;

  function clearNextTimeout() {
    clearTimeout(timeout);
  }

  function nextTimeout() {
    clearTimeout(timeout);
    if (mouseOver) return;
    timeout = setTimeout(() => {
      slider.next();
    }, 3000);
  }

  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clearNextTimeout();
    });
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      nextTimeout();
    });
    nextTimeout();
  });
  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
}

export function PromoCarousel() {
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      slides: { perView: 1, spacing: 16 },
    },
    [AutoplayPlugin]
  );

  return (
    <section className="py-16 bg-linear-to-r from-gray-50 via-white to-gray-200 relative">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-400 drop-shadow-lg mb-2">
            Promo Spesial Akhir Tahun!
          </h2>
          <p className="text-lg text-white/80 mb-4">
            Dapatkan diskon & bonus menarik untuk booking lapangan sekarang.
          </p>
        </div>
        <div className="relative">
          <div ref={sliderRef} className="keen-slider">
            {/* Promo Card 1 */}
            <div className="keen-slider__slide min-w-[320px] bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center border-4 border-blue-400">
              <span className="text-5xl mb-4">🎉</span>
              <h3 className="font-bold text-xl text-blue-700 mb-2">
                Diskon 20%
              </h3>
              <p className="text-gray-500 text-center mb-4">
                Booking minimal 2 jam, dapatkan potongan harga langsung!
              </p>
              <a
                href="https://wa.me/6285117692051?text=Promo%2020%25%20Booking%20Lapangan"
                target="_blank"
                className="bg-blue-600 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
              >
                Klaim Promo
              </a>
            </div>
            {/* Promo Card 2 */}
            <div className="keen-slider__slide min-w-[320px] bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center border-4 border-cyan-400">
              <span className="text-5xl mb-4">⚽️</span>
              <h3 className="font-bold text-xl text-cyan-700 mb-2">
                Free Jersey
              </h3>
              <p className="text-gray-500 text-center mb-4">
                Setiap booking 3 jam, dapat jersey eksklusif gratis!
              </p>
              <a
                href="https://wa.me/6285117692051?text=Free%20Jersey%20Booking%20Lapangan"
                target="_blank"
                className="bg-cyan-600 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:bg-cyan-700 transition"
              >
                Klaim Promo
              </a>
            </div>
            {/* Promo Card 3 */}
            <div className="keen-slider__slide min-w-[320px] bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center border-4 border-yellow-400">
              <span className="text-5xl mb-4">🥤</span>
              <h3 className="font-bold text-xl text-yellow-700 mb-2">
                Free Minuman
              </h3>
              <p className="text-gray-500 text-center mb-4">
                Booking malam hari dapat minuman gratis untuk seluruh tim!
              </p>
              <a
                href="https://wa.me/6285117692051?text=Free%20Minuman%20Booking%20Lapangan"
                target="_blank"
                className="bg-yellow-500 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:bg-yellow-600 transition"
              >
                Klaim Promo
              </a>
            </div>
          </div>
          {/* Arrow Button */}
          <button
            className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/80 text-blue-600 rounded-full p-2 shadow-lg hover:bg-white transition"
            onClick={() => instanceRef.current?.prev()}
          >
            <svg width="24" height="24" fill="none">
              <path
                d="M15 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/80 text-blue-600 rounded-full p-2 shadow-lg hover:bg-white transition"
            onClick={() => instanceRef.current?.next()}
          >
            <svg width="24" height="24" fill="none">
              <path
                d="M9 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
