const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  // Create predefined time slots
  const baseDate = new Date();
  const timeSlots = [
    {
      name: '9:00 AM - 11:00 AM',
      startTime: new Date(`${baseDate.toISOString().split('T')[0]}T09:00:00.000Z`),
      endTime: new Date(`${baseDate.toISOString().split('T')[0]}T11:00:00.000Z`),
      type: 'MORNING',
      isActive: true,
      isBookable: true,
      duration: 120, // 2 hours
      date: baseDate,
    },
    {
      name: '11:00 AM - 1:00 PM',
      startTime: new Date(`${baseDate.toISOString().split('T')[0]}T11:00:00.000Z`),
      endTime: new Date(`${baseDate.toISOString().split('T')[0]}T13:00:00.000Z`),
      type: 'MORNING',
      isActive: true,
      isBookable: true,
      duration: 120, // 2 hours
      date: baseDate,
    },
    {
      name: '1:00 PM - 2:00 PM',
      startTime: new Date(`${baseDate.toISOString().split('T')[0]}T13:00:00.000Z`),
      endTime: new Date(`${baseDate.toISOString().split('T')[0]}T14:00:00.000Z`),
      type: 'LUNCH_BREAK',
      isActive: true,
      isBookable: false, // Lunch break - not bookable
      duration: 60, // 1 hour
      date: baseDate,
    },
    {
      name: '2:00 PM - 4:00 PM',
      startTime: new Date(`${baseDate.toISOString().split('T')[0]}T14:00:00.000Z`),
      endTime: new Date(`${baseDate.toISOString().split('T')[0]}T16:00:00.000Z`),
      type: 'AFTERNOON',
      isActive: true,
      isBookable: true,
      duration: 120, // 2 hours
      date: baseDate,
    },
    {
      name: '4:00 PM - 6:00 PM',
      startTime: new Date(`${baseDate.toISOString().split('T')[0]}T16:00:00.000Z`),
      endTime: new Date(`${baseDate.toISOString().split('T')[0]}T18:00:00.000Z`),
      type: 'AFTERNOON',
      isActive: true,
      isBookable: true,
      duration: 120, // 2 hours
      date: baseDate,
    },
    {
      name: '6:00 PM - 8:00 PM',
      startTime: new Date(`${baseDate.toISOString().split('T')[0]}T18:00:00.000Z`),
      endTime: new Date(`${baseDate.toISOString().split('T')[0]}T20:00:00.000Z`),
      type: 'EVENING',
      isActive: true,
      isBookable: true,
      duration: 120, // 2 hours
      date: baseDate,
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