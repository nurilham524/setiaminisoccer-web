import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.booking.deleteMany()
  await prisma.field.deleteMany()
  await prisma.user.deleteMany()
  await prisma.promo.deleteMany()

  const admin = await prisma.user.create({
    data: {
      email: 'admin@minisoccer.com',
      name: 'Admin Lapangan',
      password: 'adminpassword123',
      role: 'ADMIN',
    },
  })

  await prisma.user.create({
    data: {
      email: 'user@gmail.com',
      name: 'Budi Santoso',
      password: 'user123',
      role: 'USER',
    },
  })

  await prisma.field.create({
    data: {
      name: 'Lapangan 1',
      type: 'Sintetis',
      pricePerHour: 150000,
      description: 'Rumput sintetis standar FIFA, cocok untuk 7vs7. Dilengkapi lampu LED terang.',
      imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    },
  })
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