const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

function toTimeOnlyDate(timeStr) {
  return new Date(`1970-01-01T${timeStr}Z`);
}

async function main() {
  // Create predefined time slots
  const timeSlots = [
    {
      name: '9:00 AM - 11:00 AM',
      startTime: toTimeOnlyDate('09:00:00'),
      endTime: toTimeOnlyDate('11:00:00'),
      type: 'MORNING',
      isActive: true,
      isBookable: true,
      duration: 120, // 2 hours
      date: new Date('2025-7-20'),
    },
    {
      name: '11:00 AM - 1:00 PM',
      startTime: toTimeOnlyDate('11:00:00'),
      endTime: toTimeOnlyDate('13:00:00'),
      type: 'MORNING',
      isActive: true,
      isBookable: true,
      duration: 120, // 2 hours
      date: new Date('2025-7-20'),
    },
    {
      name: '1:00 PM - 2:00 PM',
      startTime: toTimeOnlyDate('13:00:00'),
      endTime: toTimeOnlyDate('14:00:00'),
      type: 'LUNCH_BREAK',
      isActive: true,
      isBookable: false, // Lunch break - not bookable
      duration: 60, // 1 hour
      date: new Date('2025-7-20'),
    },
    {
      name: '2:00 PM - 4:00 PM',
      startTime: toTimeOnlyDate('14:00:00'),
      endTime: toTimeOnlyDate('16:00:00'),
      type: 'AFTERNOON',
      isActive: true,
      isBookable: true,
      duration: 120, // 2 hours
      date: new Date('2025-7-20'),
    },
    {
      name: '4:00 PM - 6:00 PM',
      startTime: toTimeOnlyDate('16:00:00'),
      endTime: toTimeOnlyDate('18:00:00'),
      type: 'AFTERNOON',
      isActive: true,
      isBookable: true,
      duration: 120, // 2 hours
      date: new Date('2025-7-20'),
    },
    {
      name: '6:00 PM - 8:00 PM',
      startTime: toTimeOnlyDate('18:00:00'),
      endTime: toTimeOnlyDate('20:00:00'),
      type: 'EVENING',
      isActive: true,
      isBookable: true,
      duration: 120, // 2 hours
      date: new Date('2025-7-20'),
    },
  ];

  console.log('🌱 Seeding time slots...');

  for (const slot of timeSlots) {
    await prisma.timeSlot.upsert({
      where: {name: slot.name},
      update: slot,
      create: slot,
    });
  }

  console.log('✅ Time slots seeded successfully!');

  // Create default categories
  const categories = [
    {name: 'Plumbing', isActive: true},
    {name: 'Electrical', isActive: true},
    {name: 'HVAC', isActive: true},
    {name: 'Carpentry', isActive: true},
    {name: 'Painting', isActive: true},
    {name: 'Appliance Repair', isActive: true},
    {name: 'Internet/WiFi', isActive: true},
    {name: 'Computer Repair', isActive: true},
    {name: 'Cleaning', isActive: true},
  ];

  console.log('🌱 Seeding categories...');

  for (const category of categories) {
    await prisma.category.upsert({
      where: {name: category.name},
      update: category,
      create: category,
    });
  }

  console.log('✅ Categories seeded successfully!');

  const users = [
    {
      id: 100,
      email: 'b.someone@alustudent.com',
      password: '$2b$10$rD3hzJJEfGw4qTXzfMwuQeVx7sxGx9fvdYYDo7ubLtsTkFnx0U9si', // Safe_12002
      fullName: 'Bruce SHIMWA',
      phoneNumber: '+250788123456',
    },
    {
      id: 101,
      email: 'a.someone@alustudent.com',
      password: '$2b$10$rD3hzJJEfGw4qTXzfMwuQeVx7sxGx9fvdYYDo7ubLtsTkFnx0U9si', // Safe_12002
      fullName: 'Just My Name',
      phoneNumber: '+250788123456',
      role: 'TECHNICIAN',
    },
    {
      email: 'd.someone@alustudent.com',
      password: '$2b$10$rD3hzJJEfGw4qTXzfMwuQeVx7sxGx9fvdYYDo7ubLtsTkFnx0U9si', // Safe_12002
      fullName: 'I The Admin',
      phoneNumber: '+250788123456',
      role: 'ADMIN',
    },
  ];

  const technicialDetails = {
    userId: 101,
    gender: 'FEMALE',
    age: 25,
    dateOfBirth: new Date('2025-7-20',),
    experience: '2 years',
    specialization: 'tech support, computer repair',
    imageUrl: 'https://rgkddhzqjokftkkwexdd.supabase.co/storage/v1/object/public/images/technician-profiles/1753024616657-14mcztzxh64.PNG',
    certificateUrl: 'https://rgkddhzqjokftkkwexdd.supabase.co/storage/v1/object/public/documents/technician-certificates/1753024619785-gbldklhyr0v.png',
  }

  console.log('🌱 Seeding users...');

  for (const user of users) {
    await prisma.users.upsert({
      where: {email: user.email},
      update: user,
      create: user,
    });
  }

  await prisma.technicianDetails.upsert({
    where: {userId: technicialDetails.userId},
    update: technicialDetails,
    create: technicialDetails,
  })

  console.log('✅ Users seeded successfully!');

  const services = [];

  console.log('🌱 Seeding services...');
  // services seeding code
  console.log('✅ Services seeded successfully!');

  const locations = [];

  console.log('🌱 Seeding locations...');
  // locations seeding code
  console.log('✅ Locations seeded successfully!');

  const technicianAvailability = [];

  console.log('🌱 Seeding technician availability...');
  // technician availability seeding code
  console.log('✅ Technician availabilities seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
