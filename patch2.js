const fs = require('fs');
const pathCtrl = '/home/dipongkar/Desktop/ProgramingHeroProject/Assginment-4/src/Modules/technician/technician.controller.ts';
let codeCtrl = fs.readFileSync(pathCtrl, 'utf8');

const target1 = `    completeBooking
}`;

const rep1 = `    completeBooking,
    seedBooking
}`;

const newFunc = `
const seedBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customer = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
    const technicianUser = await prisma.user.findFirst({ where: { role: 'TECHNICIAN' } });
    const technician = await prisma.technician.findFirst({ where: { userId: technicianUser?.id } });
    const service = await prisma.service.findFirst({ where: { technicianId: technician?.id } });
    
    if(!customer || !technician || !service) {
        return res.status(400).send("Missing data");
    }
    
    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        technicianId: technician.id,
        serviceId: service.id,
        price: service.price,
        status: 'REQUESTED',
        totalPrice: service.price
      }
    });
    res.send(booking);
});
`;

codeCtrl = codeCtrl.replace(target1, rep1);
codeCtrl = codeCtrl + "\n" + newFunc;
fs.writeFileSync(pathCtrl, codeCtrl);

const pathRoute = '/home/dipongkar/Desktop/ProgramingHeroProject/Assginment-4/src/Modules/technician/technician.route.ts';
let codeRoute = fs.readFileSync(pathRoute, 'utf8');
codeRoute = codeRoute.replace('export const technicianRouter = router', 'router.get("/seed-booking", technicianController.seedBooking);\nexport const technicianRouter = router');
fs.writeFileSync(pathRoute, codeRoute);
