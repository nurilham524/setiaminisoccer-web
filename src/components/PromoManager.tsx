"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { uploadPromoImage } from "@/app/actions/uploadPromoImage";
import { deletePromo } from "@/app/actions/deletePromo";

interface Promo {
  id: string;
  title: string;
  posterImage: string | null;
  whatsappText: string | null;
  createdAt: string;
}

export default function PromoManager() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
  });
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

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
    setFormData({ title: "" });
    setSelectedImageFile(null);
    setImagePreview(null);
    setEditingId(null);
  };

  const handleEdit = (promo: Promo) => {
    setFormData({
      title: promo.title,
    });
    setEditingId(promo.id);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      Swal.fire("Error", "Judul promo tidak boleh kosong", "error");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/promo/${editingId}` : "/api/promo";
      const payload = { title: formData.title };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save promo");
      }

      const savedPromo = await res.json();

      if (selectedImageFile) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64String =
            (e.target?.result as string)?.split(",")[1] || "";
          const uploadResult = await uploadPromoImage(
            savedPromo.id,
            base64String,
            selectedImageFile.name
          );
          if (!uploadResult.success) {
            Swal.fire(
              "Warning",
              "Promo dibuat tapi gagal upload gambar",
              "warning"
            );
          } else {
            await fetchPromos();
          }
        };
        reader.readAsDataURL(selectedImageFile);
        resetForm();
        Swal.fire(
          "Sukses",
          editingId ? "Promo berhasil diubah" : "Promo berhasil ditambahkan",
          "success"
        );
      } else {
        await fetchPromos();
        resetForm();
        Swal.fire(
          "Sukses",
          editingId ? "Promo berhasil diubah" : "Promo berhasil ditambahkan",
          "success"
        );
      }
    } catch (error) {
      console.error("Save Error:", error);
      Swal.fire(
        "Error",
        error instanceof Error ? error.message : "Gagal menyimpan promo",
        "error"
      );
    }
  };

  const handleImageUpload = async (promoId: string, file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("Error", "Ukuran file maksimal 5MB", "error");
      return;
    }

    if (!file.type.startsWith("image/")) {
      Swal.fire("Error", "File harus berupa gambar", "error");
      return;
    }

    setUploadingId(promoId);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64String = (e.target?.result as string)?.split(",")[1] || "";
        const result = await uploadPromoImage(promoId, base64String, file.name);

        if (result.success) {
          await fetchPromos();
          Swal.fire("Sukses", "Gambar promo berhasil diupload", "success");
        } else {
          Swal.fire("Error", result.error || "Gagal upload gambar", "error");
        }
        setUploadingId(null);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload Error:", error);
      Swal.fire("Error", "Gagal upload gambar", "error");
      setUploadingId(null);
    }
  };

  const handleDelete = async (promoId: string, title: string) => {
    const result = await Swal.fire({
      title: "Hapus Promo?",
      text: `Hapus promo "${title}"? Gambar akan ikut dihapus.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const deleteResult = await deletePromo(promoId);
        if (deleteResult.success) {
          await fetchPromos();
          Swal.fire("Sukses", "Promo berhasil dihapus", "success");
        } else {
          Swal.fire("Error", deleteResult.error, "error");
        }
      } catch (error) {
        console.error("Delete Error:", error);
        Swal.fire("Error", "Gagal hapus promo", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-br from-slate-50 to-white">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Memuat data promo...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Form Section - Left */}
      <div className="w-full md:w-[420px] flex-shrink-0 p-8 bg-white border-r border-slate-200">
        {/* Header with Icon */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center">
            <span className="text-xl">
              {editingId ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#000000"
                  viewBox="0 0 256 256"
                >
                  <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#000000"
                  viewBox="0 0 256 256"
                >
                  <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                </svg>
              )}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              {editingId ? "Edit Promo" : "Tambah Promo"}
            </h3>
            <p className="text-sm text-slate-500">Kelola promosi Anda</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Judul Promo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Contoh: Diskon 20% Weekend"
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Poster Promo
            </label>

            {/* Show preview if image selected, otherwise show upload area */}
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all"
                >
                  <svg
                    className="w-4 h-4"
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
                <p className="text-xs text-slate-500 mt-2 text-center truncate">
                  {selectedImageFile?.name}
                </p>
              </div>
            ) : (
              <label className="group flex flex-col items-center justify-center w-full h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-600 font-medium">
                    Klik untuk upload gambar
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    PNG, JPG hingga 5MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedImageFile(file);
                      // Create preview URL
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImagePreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
            >
              {editingId ? (
                <div className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14M12 5v14"
                    />
                  </svg>
                  Update Promo
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 5v14M5 12h14"
                    />
                  </svg>
                  Tambah Promo
                </div>
              )}
            </button>
            {editingId && (
              <button
                onClick={resetForm}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
              >
                Batal
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-8 w-full">
        <div className="flex items-center justify-between mb-8 sticky top-0 bg-gradient-to-b from-white via-white to-white pb-4 z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center">
              <span className="text-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#000000"
                  viewBox="0 0 256 256"
                >
                  <path d="M168,152a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,152Zm-8-40H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm56-64V216a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V48A16,16,0,0,1,56,32H92.26a47.92,47.92,0,0,1,71.48,0H200A16,16,0,0,1,216,48ZM96,64h64a32,32,0,0,0-64,0ZM200,48H173.25A47.93,47.93,0,0,1,176,64v8a8,8,0,0,1-8,8H88a8,8,0,0,1-8-8V64a47.93,47.93,0,0,1,2.75-16H56V216H200Z"></path>
                </svg>
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Daftar Promo</h3>
              <p className="text-sm text-slate-500">
                {promos.length} promo aktif
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[550px] pr-2 custom-scrollbar">
          {promos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-slate-200 rounded-3xl flex items-center justify-center mb-4">
                <span className="text-4xl">🎯</span>
              </div>
              <p className="text-lg font-semibold text-slate-700">
                Belum ada promo
              </p>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">
                Tambahkan promo pertama Anda untuk menarik lebih banyak
                pelanggan
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {promos.map((promo, index) => (
                <div
                  key={promo.id}
                  className="group bg-white rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex gap-5 p-5">
                    {/* Image */}
                    <div className="flex-shrink-0 relative">
                      {promo.posterImage ? (
                        <div className="relative">
                          <img
                            src={promo.posterImage}
                            alt={promo.title}
                            className="w-28 h-28 object-cover rounded-xl shadow-sm"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ) : (
                        <div className="w-28 h-28 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                          <svg
                            className="w-8 h-8 text-slate-300 mb-1"
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
                          <span className="text-xs text-slate-400">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="font-bold text-slate-800 text-lg mb-4 truncate">
                        {promo.title}
                      </h4>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(promo)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all text-sm shadow-sm hover:shadow-md"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(promo.id, promo.title)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg font-semibold transition-all text-sm border border-red-200 hover:border-red-600"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
