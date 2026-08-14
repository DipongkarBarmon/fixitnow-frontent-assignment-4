const fs = require('fs');
const path = '/home/dipongkar/Desktop/ProgramingHeroProject/Assginment-4/src/Modules/technician/technician.controller.ts';
let code = fs.readFileSync(path, 'utf8');

const exportRegex = /export const technicianController = \{[\s\S]*?\}/;
const match = code.match(exportRegex);
if(match) {
    code = code.replace(match[0], '');
    code = code + '\n' + match[0] + '\n';
    fs.writeFileSync(path, code);
}
