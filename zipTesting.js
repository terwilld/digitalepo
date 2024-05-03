var AdmZip = require("adm-zip");
const fs = require("fs")
const path = require('path')
console.log(AdmZip)
var zip = new AdmZip();
console.log(zip)


const first_file = path.join(process.cwd(), 'ForTesting.tcx')
console.log(first_file)
const second_file = path.join(process.cwd(), 'ForTesting_2.tcx')
console.log(second_file)

zip.addLocalFile(first_file);
zip.addLocalFile(second_file);
zip.writeZip(path.join(process.cwd(), 'derp.zip'));