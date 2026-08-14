const fs = require('fs');
const path = '/home/dipongkar/Desktop/ProgramingHeroProject/Assginment-4/src/Modules/technician/technician.controller.ts';
let code = fs.readFileSync(path, 'utf8');

const target = `const getAllBookingOfTechnician = catchAsync(async (req: Request, res: Response, next :NextFunction) => {
     const technicianId = req.user.id;`;

const replacement = `import { prisma } from "../../lib/prisma.js";
const getAllBookingOfTechnician = catchAsync(async (req: Request, res: Response, next :NextFunction) => {
     const tech = await prisma.technician.findUnique({ where: { userId: req.user.id } });
     const technicianId = tech?.id || req.user.id;`;

code = code.replace(target, replacement);
fs.writeFileSync(path, code);
