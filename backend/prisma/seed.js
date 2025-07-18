const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function main() {
  // Create predefined time slots
  const timeSlots = [
    {
      name: '9:00 AM - 11:00 AM',
      startTime: '09:00',
      endTime: '11:00',
      type: 'MORNING',
      isActive: true,
      isBookable: true,
      duration: 120, // 2 hours
    },
    {
      name: '11:00 AM - 1:00 PM',
      startTime: '11:00',
      endTime: '13:00',
      type: 'MORNING',
      isActive: true,
      isBookable: true,
      duration: 120, // 2 hours
    },
    {
      name: '1:00 PM - 2:00 PM',
      startTime: '13:00',
      endTime: '14:00',
      type: 'LUNCH_BREAK',
      isActive: true,
      isBookable: false, // Lunch break - not bookable
      duration: 60, // 1 hour
    },
    {
      name: '2:00 PM - 4:00 PM',
      startTime: '14:00',
      endTime: '16:00',
      type: 'AFTERNOON',
      isActive: true,
      isBookable: true,
      duration: 120, // 2 hours
    },
    {
      name: '4:00 PM - 6:00 PM',
      startTime: '16:00',
      endTime: '18:00',
      type: 'AFTERNOON',
      isActive: true,
      isBookable: true,
      duration: 120, // 2 hours
    },
    {
      name: '6:00 PM - 8:00 PM',
      startTime: '18:00',
      endTime: '20:00',
      type: 'EVENING',
      isActive: true,
      isBookable: true,
      duration: 120, // 2 hours
    },
  ];

  console.log('🌱 Seeding time slots...');
  
  for (const slot of timeSlots) {
    await prisma.timeSlot.upsert({
      where: { name: slot.name },
      update: slot,
      create: slot,
    });
  }

  console.log('✅ Time slots seeded successfully!');
  
  // Create default categories
  const categories = [
    { name: 'Plumbing', isActive: true },
    { name: 'Electrical', isActive: true },
    { name: 'HVAC', isActive: true },
    { name: 'Carpentry', isActive: true },
    { name: 'Painting', isActive: true },
    { name: 'Appliance Repair', isActive: true },
    { name: 'Internet/WiFi', isActive: true },
    { name: 'Computer Repair', isActive: true },
    { name: 'Cleaning', isActive: true },
  ];

  console.log('🌱 Seeding categories...');
  
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: category,
      create: category,
    });
  }

  console.log('✅ Categories seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
