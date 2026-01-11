/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";

interface Promo {
  id: string;
  title: string;
  posterImage: string | null;
  whatsappText: string | null;
}

export function PromoCarousel() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);

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

  const handlePromoClick = (promo: Promo) => {
    setSelectedPromo(promo);
  };

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest text-blue-600 font-semibold">
              Booking Sekarang Dan Dapatkan Promo Menarik!
            </span>
          </div>
        </div>

        <div className="relative w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-400 font-medium">Memuat penawaran...</p>
            </div>
          ) : promos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
              </div>
              <p className="text-slate-500 text-lg font-medium">
                Belum ada penawaran tersedia
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Nantikan promo menarik dari kami
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promos.map((promo, index) => (
                <div
                  key={promo.id}
                  className="group relative bg-white rounded-2xl border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                          />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        PROMO
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors">
                      {promo.title}
                    </h3>

                    {promo.posterImage && (
                      <div className="mb-4 overflow-hidden rounded-xl">
                        <img
                          src={promo.posterImage}
                          alt={promo.title}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <button
                      onClick={() => handlePromoClick(promo)}
                      className="w-full bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                    >
                      <span>Lihat Detail</span>
                      <svg
                        className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedPromo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedPromo(null)}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 pb-4 flex-shrink-0 border-b border-slate-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      PROMO SPESIAL
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-1">
                      {selectedPromo.title}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPromo(null)}
                  className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <svg
                    className="w-5 h-5 text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[60vh] custom-scrollbar p-6">
              {selectedPromo.posterImage ? (
                <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                  <img
                    src={selectedPromo.posterImage}
                    alt={selectedPromo.title}
                    className="w-full h-auto max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                  <svg
                    className="w-12 h-12 text-slate-300 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-slate-400 font-medium">
                    Tidak ada gambar
                  </span>
                </div>
              )}
            </div>

            {/* Modal Footer - Fixed */}
            <div className="p-6 pt-4 flex-shrink-0 border-t border-slate-100">
              <button
                onClick={() => setSelectedPromo(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
