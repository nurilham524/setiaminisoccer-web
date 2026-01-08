/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useEffect, useState } from "react";

interface Promo {
  id: string;
  title: string;
  description: string;
  emoji: string;
  borderColor: string;
  buttonColor: string;
  buttonHoverColor: string;
  whatsappText: string;
}

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
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      slides: { perView: 1, spacing: 16 },
      initial: 0,
    },
    [AutoplayPlugin]
  );

  // Fetch promos dari database
  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const res = await fetch("/api/promo");
        const data = await res.json();
        setPromos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching promos:", error);
        setPromos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update();
    }
  }, [instanceRef, promos]);

  return (
    <section className="py-20 md:py-28 bg-white relative">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-4">
            Penawaran Eksklusif
          </p>
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            Kesempatan Terbatas
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nikmati penawaran istimewa dengan benefit eksklusif untuk setiap booking Anda
          </p>
        </div>

        <div className="relative w-full">
          {loading ? (
            <div className="text-center py-32">
              <div className="text-gray-400">Loading penawaran...</div>
            </div>
          ) : promos.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-gray-500 text-xl">Belum ada penawaran tersedia</p>
            </div>
          ) : (
            <>
              <div ref={sliderRef} className="keen-slider w-full overflow-hidden">
                {promos.map((promo) => (
                  <div
                    key={promo.id}
                    className={`keen-slider__slide !w-full flex-shrink-0 bg-white rounded-2xl shadow-lg p-12 flex flex-col items-center justify-center border ${promo.borderColor} group hover:shadow-xl transition duration-300`}
                  >
                    <span className="text-6xl md:text-7xl mb-6 group-hover:scale-110 transition duration-300">
                      {promo.emoji}
                    </span>
                    <h3 className="font-light text-gray-900 text-3xl md:text-4xl mb-4 text-center tracking-tight">
                      {promo.title}
                    </h3>
                    <p className="text-gray-600 text-center mb-8 max-w-md leading-relaxed">
                      {promo.description}
                    </p>
                    <a
                      href={`https://wa.me/6285117692051?text=${promo.whatsappText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${promo.buttonColor} text-white font-medium px-8 py-3 rounded-lg ${promo.buttonHoverColor} transition uppercase text-sm tracking-widest shadow-md hover:shadow-lg`}
                    >
                      Klaim Penawaran
                    </a>
                  </div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <button
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-700 rounded-full p-3 shadow-md hover:shadow-lg transition border border-gray-200 hover:border-gray-300"
                onClick={() => instanceRef.current?.prev()}
                aria-label="Previous"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
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
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-700 rounded-full p-3 shadow-md hover:shadow-lg transition border border-gray-200 hover:border-gray-300"
                onClick={() => instanceRef.current?.next()}
                aria-label="Next"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M9 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
