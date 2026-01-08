// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Bersihkan data lama (opsional, agar tidak duplikat saat coba-coba)
  await prisma.booking.deleteMany()
  await prisma.field.deleteMany()
  await prisma.user.deleteMany()
  await prisma.promo.deleteMany()

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

  // 5. Buat Promo Default
  await prisma.promo.create({
    data: {
      title: 'Diskon 20%',
      description: 'Booking minimal 2 jam, dapatkan potongan harga langsung!',
      emoji: '🎉',
      borderColor: 'border-blue-500',
      buttonColor: 'bg-blue-500',
      buttonHoverColor: 'hover:bg-blue-600',
      whatsappText: 'Promo%2020%25%20Booking%20Lapangan',
    },
  })

  await prisma.promo.create({
    data: {
      title: 'Free Jersey',
      description: 'Setiap booking 3 jam, dapat jersey eksklusif gratis!',
      emoji: '⚽',
      borderColor: 'border-blue-500',
      buttonColor: 'bg-blue-500',
      buttonHoverColor: 'hover:bg-blue-600',
      whatsappText: 'Free%20Jersey%20Booking%20Lapangan',
    },
  })

  await prisma.promo.create({
    data: {
      title: 'Free Minuman',
      description: 'Booking malam hari dapat minuman gratis untuk seluruh tim!',
      emoji: '🥤',
      borderColor: 'border-blue-500',
      buttonColor: 'bg-blue-500',
      buttonHoverColor: 'hover:bg-blue-600',
      whatsappText: 'Free%20Minuman%20Booking%20Lapangan',
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