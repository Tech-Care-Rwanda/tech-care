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
    {id: 1, name: 'Plumbing', isActive: true},
    {id: 2, name: 'Electrical', isActive: true},
    {id: 3, name: 'HVAC', isActive: true},
    {id: 4, name: 'Carpentry', isActive: true},
    {id: 5, name: 'Painting', isActive: true},
    {id: 6, name: 'Appliance Repair', isActive: true},
    {id: 7, name: 'Internet/WiFi', isActive: true},
    {id: 8, name: 'Computer Repair', isActive: true},
    {id: 9, name: 'Cleaning', isActive: true},
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

  const technicianDetails = {
    id: 1,
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
    where: {userId: technicianDetails.userId},
    update: technicianDetails,
    create: technicianDetails,
  })

  console.log('✅ Users seeded successfully!');

  const services = [
    {
      serviceName: 'Computer Support',
      description: 'Complete computer setup, repair, and optimization services',
      duration: '1–4 hours',
      imageUrl: '/images/thisisengineering-hnXf73-K1zo-unsplash.jpg',
      categoryId: 8, // Computer Repair category
      price: 8.00 // From 8,000 RWF
    },
    {
      serviceName: 'Mobile Device Help',
      description: 'Smartphone and tablet repair, setup, and optimization',
      duration: '30 min – 2 hours',
      imageUrl: '/images/clint-bustrillos-K7OUs6y_cm8-unsplash.jpg',
      categoryId: 8, // Computer Repair category
      price: 5.00 // From 5,000 RWF
    },
    {
      serviceName: 'Network & WiFi',
      description: 'Internet setup, WiFi optimization, and network security',
      duration: '1–3 hours',
      imageUrl: '/images/samsung-memory-KTF38UTEKR4-unsplash.jpg',
      categoryId: 7, // Internet/WiFi category
      price: 10.00 // From 10,000 RWF
    },
    {
      serviceName: 'Software Solutions',
      description: 'Software installation, updates, and troubleshooting',
      duration: '30 min – 2 hours',
      imageUrl: '/images/md-riduwan-molla-ZO0weaaDrBs-unsplash.jpg',
      categoryId: 8, // Computer Repair category
      price: 6.00 // From 6,000 RWF
    },
    {
      serviceName: 'Security & Backup',
      description: 'Data protection, security setup, and backup solutions',
      duration: '1–3 hours',
      imageUrl: '/images/sammyayot254-vIQDv6tUHYk-unsplash.jpg',
      categoryId: 9, // Cleaning
      price: 12.00 // From 12,000 RWF
    },
    {
      serviceName: 'Maintenance & Repair',
      description: 'Regular maintenance and hardware repair services',
      duration: '2–4 hours',
      imageUrl: '/images/sxriptx-7Kehl5idKbU-unsplash.jpg',
      categoryId: 8, // Computer Repair category
      price: 15.00 // From 15,000 RWF
    }
  ];

  console.log('🌱 Seeding services...');

  for (const service of services) {
    const createdService = await prisma.service.upsert({
      where: {
        id: services.indexOf(service) + 1 // Using index+1 as ID for simplicity
      },
      update: service,
      create: service,
    });

    // Connect service to technician
    await prisma.technicianDetails.update({
      where: {userId: 101},
      data: {
        services: {
          connect: {id: createdService.id}
        }
      }
    });
  }

  console.log('✅ Services seeded successfully!');

  const locations = [
    {
      customerId: 100, // Bruce SHIMWA (customer)
      addressName: 'Work',
      description: 'Down town building, Kigali, Rwanda',
      googleMapUrl: 'https://maps.app.goo.gl/Q1uJDiG9E9RjaddHA',
      latitude: -1.944876980860392,
      longitude: 30.056057787565578,
    },
    {
      customerId: 100, // Bruce SHIMWA (customer)
      addressName: 'Office',
      description: 'ALU Campus, Kigali Innovation City, Rwanda',
      googleMapUrl: 'https://maps.google.com/?q=-1.9297,30.0919',
      latitude: -1.9297,
      longitude: 30.0919,
    }
  ];

  console.log('🌱 Seeding locations...');

  for (const location of locations) {
    await prisma.location.upsert({
      where: {
        id: locations.indexOf(location) + 1 // Using index+1 as ID for simplicity
      },
      update: location,
      create: location,
    });
  }

  console.log('✅ Locations seeded successfully!');

  const technicianAvailability = [
    {
      technicianId: 1, // The technician with userId 101
      timeSlotId: 1, // 9:00 AM - 11:00 AM
      date: new Date('2025-7-21'), // Using tomorrow's date
      status: 'AVAILABLE'
    },
    {
      technicianId: 1, // The technician with userId 101
      timeSlotId: 2, // 11:00 AM - 1:00 PM
      date: new Date('2025-7-21'), // Using tomorrow's date
      status: 'AVAILABLE'
    },
    {
      technicianId: 1, // The technician with userId 101
      timeSlotId: 4, // 2:00 PM - 4:00 PM
      date: new Date('2025-7-21'), // Using tomorrow's date
      status: 'AVAILABLE'
    },
    {
      technicianId: 1, // The technician with userId 101
      timeSlotId: 5, // 4:00 PM - 6:00 PM
      date: new Date('2025-7-22'), // Using day after tomorrow
      status: 'AVAILABLE'
    },
    {
      technicianId: 1, // The technician with userId 101
      timeSlotId: 6, // 6:00 PM - 8:00 PM
      date: new Date('2025-7-22'), // Using day after tomorrow
      status: 'AVAILABLE'
    }
  ];

  console.log('🌱 Seeding technician availability...');

  // Create the availability records
  for (const availability of technicianAvailability) {
    await prisma.technicianAvailability.upsert({
      where: {
        technicianId_date_timeSlotId: {
          technicianId: availability.technicianId,
          date: availability.date,
          timeSlotId: availability.timeSlotId
        }
      },
      update: availability,
      create: availability,
    });
  }

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
