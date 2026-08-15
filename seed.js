const { PrismaClient } = require('../Assginment-4/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  const customer = await prisma.user.findUnique({
    where: { email: 'customer@gmail.com' }
  });
  if (!customer) return console.log("Customer not found");

  const tech = await prisma.technicianProfile.findFirst();
  if (!tech) return console.log("Tech not found");

  const service = await prisma.service.findFirst();
  if (!service) return console.log("Service not found");

  let booking = await prisma.booking.findFirst({
    where: { customerId: customer.id, status: 'COMPLETED' }
  });

  if (!booking) {
    booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        technicianId: tech.id,
        serviceId: service.id,
        status: 'COMPLETED',
        date: new Date(),
        timeSlot: "10:00 AM - 12:00 PM",
        address: "123 Test St",
        location: "Test Location",
        totalPrice: 100,
        paymentStatus: 'COMPLETED',
      }
    });
  }

  const existingReview = await prisma.review.findFirst({
    where: { bookingId: booking.id }
  });

  if (!existingReview) {
    const review = await prisma.review.create({
      data: {
        bookingId: booking.id,
        customerId: customer.id,
        technicianId: booking.technicianId,
        serviceId: booking.serviceId,
        rating: 5,
        comment: "Excellent service! Highly recommended.",
      }
    });
    console.log("Review created:", review);
  } else {
    console.log("Review already exists for this booking:", existingReview);
  }
}

seed().catch(console.error).finally(() => prisma.$disconnect());
