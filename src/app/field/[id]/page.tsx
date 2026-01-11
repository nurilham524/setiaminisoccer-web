import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookingForm from "@/components/BookingForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const field = await prisma.field.findUnique({
    where: { id },
  });

  if (!field) return notFound();

  const price =
    typeof field.pricePerHour === "number"
      ? field.pricePerHour
      : Number(field.pricePerHour);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 relative">
      <div className="mb-6 relative z-10">
        <Link
          href="/"
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          &larr; Kembali ke Home
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-3 relative">
        <div className="md:col-span-2 relative z-10">
          <div className="rounded-xl overflow-hidden shadow-md bg-gray-50 border border-gray-100">
            <Image
              src={field.imageUrl || "/images/placeholder-field.jpg"}
              alt={field.name || "Field image"}
              width={1600}
              height={900}
              className="w-full h-80 object-cover md:h-120"
              priority
            />
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">{field.name}</h1>
              <span className="bg-black text-white px-3 py-1 rounded text-sm font-bold uppercase tracking-wider">
                {field.type ?? "Standar"}
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold text-green-600">
              Rp {price.toLocaleString("id-ID")}{" "}
              <span className="text-sm text-gray-500 font-normal">/ jam</span>
            </p>

            <div className="mt-6 prose prose-blue text-gray-700 leading-relaxed whitespace-pre-line">
              {field.description}
            </div>
          </div>
        </div>

        <aside className="md:col-span-1 relative z-20">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg sticky top-6">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Jadwal & Booking
              </h2>
              <p className="text-sm text-gray-500">Pilih waktu bermain Anda</p>
            </div>

            <BookingForm fieldId={field.id} pricePerHour={price} />
          </div>
        </aside>
      </div>
    </main>
  );
}
