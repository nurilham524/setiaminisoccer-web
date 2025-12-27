// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Bersihkan data lama (opsional, agar tidak duplikat saat coba-coba)
  await prisma.booking.deleteMany()
  await prisma.field.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️  Database dibersihkan...')

  // 2. Buat User Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@minisoccer.com',
      name: 'Admin Lapangan',
      password: 'adminpassword123', // Nanti di real app kita hash ini
      role: 'ADMIN',
    },
  })
  console.log('👤 Admin dibuat:', admin.email)

  // 3. Buat User Biasa (Contoh)
  await prisma.user.create({
    data: {
      email: 'user@gmail.com',
      name: 'Budi Santoso',
      password: 'user123',
      role: 'USER',
    },
  })

  // 4. Buat Lapangan 1
  await prisma.field.create({
    data: {
      name: 'Lapangan A (Rumput Sintetis)',
      type: 'Sintetis',
      pricePerHour: 150000,
      description: 'Rumput sintetis standar FIFA, cocok untuk 7vs7. Dilengkapi lampu LED terang.',
      imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    },
  })

  // 5. Buat Lapangan 2
  await prisma.field.create({
    data: {
      name: 'Lapangan B (Vinyl Indoor)',
      type: 'Vinyl',
      pricePerHour: 120000,
      description: 'Lantai vinyl rata, bola bergulir cepat. Indoor, anti hujan.',
      imageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80',
    },
  })

  console.log('✅ Database berhasil diisi dengan data awal!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })