"use client";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { useEffect } from "react";

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
    }, 4000);
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

export function FacilitiesCarousel() {
  const facilities = [
    {
      id: 1,
      title: "Lapangan",
      description:
        "Lapangan rumput sintetis standar FIFA, cocok untuk latihan dan pertandingan persahabatan.",
      image: "/Lapangan.jpeg",
    },
    {
      id: 2,
      title: "Fasilitas",
      description:
        "Dilengkapi tribun penonton, cocok untuk event dan turnamen. Serta Loker yang aman.",
      image: "/Tribun.jpeg",
    },
    {
      id: 3,
      title: "Kantin",
      description:
        "Tersedia berbagai minuman dan snack untuk menemani waktu istirahat Anda setelah bermain.",
      image: "/Kantin.jpeg",
    },
    {
      id: 4,
      title: "Kamar Mandi",
      description:
        "Kamar mandi bersih dengan fasilitas lengkap dan air hangat.",
      image: "/Lapangan.jpeg",
    },
    {
      id: 5,
      title: "Area Parkir",
      description: "Parkir luas dan aman untuk kendaraan roda 4 maupun roda 2.",
      image: "/Tribun.jpeg",
    },
    {
      id: 6,
      title: "Mushola",
      description:
        "Mushola yang nyaman untuk beribadah sebelum atau sesudah bermain.",
      image: "/Kantin.jpeg",
    },
  ];

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: false,
      slides: { perView: 1.1, spacing: 16 },
      initial: 0,
      mode: "snap",
      rubberband: false,
      // duration: 300,
      breakpoints: {
        "(min-width: 768px)": {
          slides: { perView: 2, spacing: 16 },
        },
        "(min-width: 1024px)": {
          slides: { perView: 3, spacing: 20 },
        },
      },
    },
    [AutoplayPlugin]
  );

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update();
    }
  }, [instanceRef]);

  return (
    <section id="booking-area" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
            Fasilitas Pendukung
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-2">
            Lengkap dengan semua fasilitas yang Anda butuhkan
          </p>
        </div>

        <div className="relative w-full">
          <div
            ref={sliderRef}
            className="keen-slider w-full overflow-visible h-100"
          >
            {facilities.map((facility) => (
              <div
                key={facility.id}
                className="keen-slider__slide flex-shrink-0 bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-blue-200 transition-all duration-300 relative group flex flex-col h-full min-h-[420px]"
              >
                <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden bg-gray-200">
                  {facility.image ? (
                    <Image
                      src={facility.image}
                      alt={facility.title}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      [Tambahkan Gambar]
                    </div>
                  )}
                </div>
                <div className="p-6 md:p-8 flex-1 flex flex-col relative bg-white">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
                    {facility.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">
                    {facility.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Arrow Buttons */}
          <button
            className="absolute top-1/3 -left-4 md:left-2 z-10 bg-white text-blue-600 rounded-full p-2 shadow-lg hover:bg-blue-50 hover:scale-110 hover:text-blue-700 transition-all duration-200"
            onClick={() => instanceRef.current?.prev()}
            aria-label="Previous"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
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
            className="absolute top-1/3 -right-4 md:right-2 z-10 bg-white text-blue-600 rounded-full p-2 shadow-lg hover:bg-blue-50 hover:scale-110 hover:text-blue-700 transition-all duration-200"
            onClick={() => instanceRef.current?.next()}
            aria-label="Next"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
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
