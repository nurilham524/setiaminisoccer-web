import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TestFields() {
  const fields = await prisma.field.findMany();
  const bookings = await prisma.booking.findMany();
  const promos = await prisma.promo.findMany();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Info</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Fields ({fields.length})</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
          {JSON.stringify(fields, null, 2)}
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Bookings ({bookings.length})</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
          {JSON.stringify(bookings, null, 2)}
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Promos ({promos.length})</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
          {JSON.stringify(promos, null, 2)}
        </pre>
      </section>
    </div>
  );
}
