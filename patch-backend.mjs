import fs from 'fs';
import path from 'path';

const baseDir = '/home/dipongkar/Desktop/ProgramingHeroProject/Assginment-4/src/Modules/admin';

// 1. Patch admin.service.ts
let servicePath = path.join(baseDir, 'admin.service.ts');
let serviceCode = fs.readFileSync(servicePath, 'utf8');
if (!serviceCode.includes('getAllBookingsFromDB')) {
  serviceCode = serviceCode.replace('export const adminService = {', `
const getAllBookingsFromDB = async () => {
    return await prisma.booking.findMany({
        include: {
            service: { include: { category: true } },
            customer: { omit: { password: true } },
            technician: true,
        },
        orderBy: { createdAt: 'desc' }
    });
}

export const adminService = {
    getAllBookingsFromDB,`);
  fs.writeFileSync(servicePath, serviceCode);
  console.log('Patched admin.service.ts');
}

// 2. Patch admin.controller.ts
let controllerPath = path.join(baseDir, 'admin.controller.ts');
let controllerCode = fs.readFileSync(controllerPath, 'utf8');
if (!controllerCode.includes('getAllBookings')) {
  controllerCode = controllerCode.replace('export const adminController = {', `
const getAllBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     const bookings = await adminService.getAllBookingsFromDB();
     sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "All bookings retrieved successfully!",
        data : bookings
     }) 
})

export const adminController = {
    getAllBookings,`);
  fs.writeFileSync(controllerPath, controllerCode);
  console.log('Patched admin.controller.ts');
}

// 3. Patch admin.route.ts
let routePath = path.join(baseDir, 'admin.route.ts');
let routeCode = fs.readFileSync(routePath, 'utf8');
if (!routeCode.includes('/get-all-bookings')) {
  routeCode = routeCode.replace('export const adminRouter = router', `
router.get('/get-all-bookings', auth(Role.ADMIN), adminController.getAllBookings)

export const adminRouter = router`);
  fs.writeFileSync(routePath, routeCode);
  console.log('Patched admin.route.ts');
}
