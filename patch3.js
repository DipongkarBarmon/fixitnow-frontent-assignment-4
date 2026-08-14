const fs = require('fs');
const pathCtrl = '/home/dipongkar/Desktop/ProgramingHeroProject/Assginment-4/src/Modules/technician/technician.controller.ts';
let codeCtrl = fs.readFileSync(pathCtrl, 'utf8');

// Find the export block and move seedBooking above it!
const exportBlock = 'export const technicianController = {';
const splitParts = codeCtrl.split(exportBlock);

if (splitParts.length === 2) {
    let topPart = splitParts[0];
    let bottomPart = exportBlock + splitParts[1];
    
    // Extract the const seedBooking from the bottom part
    const seedFuncRegex = /const seedBooking = catchAsync[\s\S]+?\}\);/;
    const match = bottomPart.match(seedFuncRegex);
    if(match) {
        bottomPart = bottomPart.replace(match[0], ''); // remove from bottom
        topPart = topPart + '\n' + match[0] + '\n'; // put in top
    }
    
    fs.writeFileSync(pathCtrl, topPart + bottomPart);
}
