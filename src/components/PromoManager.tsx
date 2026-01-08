"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Promo {
  id: string;
  title: string;
  description: string;
  emoji: string;
  borderColor: string;
  buttonColor: string;
  buttonHoverColor: string;
  whatsappText: string;
  createdAt: string;
}

export default function PromoManager() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    emoji: "",
    borderColor: "border-blue-400",
    buttonColor: "bg-blue-600",
    buttonHoverColor: "hover:bg-blue-700",
    whatsappText: "",
  });

  // Fetch promos
  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      const res = await fetch("/api/promo");
      const data = await res.json();
      setPromos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching promos:", error);
      Swal.fire("Error", "Gagal mengambil data promo", "error");
      setPromos([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      emoji: "",
      borderColor: "border-blue-500",
      buttonColor: "bg-blue-500",
      buttonHoverColor: "hover:bg-blue-600",
      whatsappText: "",
    });
    setEditingId(null);
  };

  const handleEdit = (promo: Promo) => {
    setFormData({
      title: promo.title,
      description: promo.description,
      emoji: promo.emoji,
      borderColor: promo.borderColor,
      buttonColor: promo.buttonColor,
      buttonHoverColor: promo.buttonHoverColor,
      whatsappText: promo.whatsappText,
    });
    setEditingId(promo.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.emoji ||
      !formData.whatsappText
    ) {
      Swal.fire("Error", "Semua field harus diisi", "error");
      return;
    }

    try {
      if (editingId) {
        // Update
        const res = await fetch(`/api/promo/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Update failed");
        }

        Swal.fire("Success", "Promo berhasil diperbarui", "success");
      } else {
        // Create
        const res = await fetch("/api/promo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Create failed");
        }

        Swal.fire("Success", "Promo berhasil dibuat", "success");
      }

      await fetchPromos();
      resetForm();
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Gagal menyimpan promo";
      Swal.fire("Error", errorMessage, "error");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Hapus Promo?",
      text: "Anda yakin ingin menghapus promo ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/promo/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Delete failed");

        Swal.fire("Success", "Promo berhasil dihapus", "success");
        await fetchPromos();
      } catch (error) {
        console.error("Error:", error);
        Swal.fire("Error", "Gagal menghapus promo", "error");
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* FORM SECTION */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition">
        <h3 className="text-2xl font-light text-gray-900 mb-8 tracking-wide">
          {editingId ? "Edit Penawaran" : "Buat Penawaran Baru"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-600 mb-2 font-semibold">
                Judul
              </label>
              <input
                type="text"
                placeholder="Nama penawaran"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-600 mb-2 font-semibold">
                Emoji
              </label>
              <input
                type="text"
                placeholder="🎉"
                value={formData.emoji}
                onChange={(e) =>
                  setFormData({ ...formData, emoji: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition"
                maxLength={2}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-600 mb-2 font-semibold">
              Deskripsi
            </label>
            <textarea
              placeholder="Jelaskan penawaran dengan singkat dan menarik"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition resize-none"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-600 mb-2 font-semibold">
              Pesan WhatsApp
            </label>
            <textarea
              placeholder="Teks yang akan dikirim ke WA saat diklik"
              value={formData.whatsappText}
              onChange={(e) =>
                setFormData({ ...formData, whatsappText: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition resize-none"
              rows={2}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium uppercase tracking-wide text-sm rounded-lg transition border border-gray-900 hover:border-gray-800 shadow-md hover:shadow-lg"
            >
              {editingId ? "Perbarui" : "Buat"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium uppercase tracking-wide text-sm rounded-lg transition border border-gray-300 hover:border-gray-400"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* PROMO LIST SECTION */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition">
        <h3 className="text-2xl font-light text-gray-900 mb-8 tracking-wide">
          Penawaran Aktif
          <span className="ml-3 text-sm font-normal text-gray-500">
            ({promos.length})
          </span>
        </h3>
        {promos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Belum ada penawaran</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promos.map((promo) => (
              <div
                key={promo.id}
                className={`bg-gray-50 border-2 ${promo.borderColor} rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition group`}
              >
                <div>
                  <div className="text-5xl mb-4 group-hover:scale-110 transition duration-300">
                    {promo.emoji}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {promo.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {promo.description}
                  </p>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleEdit(promo)}
                    className="flex-1 px-3 py-2 text-xs uppercase tracking-widest font-medium bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition border border-gray-300 hover:border-gray-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(promo.id)}
                    className="flex-1 px-3 py-2 text-xs uppercase tracking-widest font-medium bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 rounded-lg transition border border-gray-300 hover:border-red-300"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
