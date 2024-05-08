const express = require('express')
const router = express.Router();
const baseControllers = require('../controllers/base.js')
const multer = require('multer')
require('dotenv').config()
const path = require('path')
const AdmZip = require("adm-zip");
const fs = require('fs')
const inputFileOutputfile = require('../js/index.js')

// const upload = multer({ dest: 'fileProcessing/uploads/' })


const uploadDir = path.join(process.cwd(), process.env.processingDirectory, 'uploads')
const processedDir = path.join(process.cwd(), process.env.processingDirectory, 'processed')
const upload = multer({ dest: uploadDir })




router.get('/', baseControllers.index)


router.post('/', upload.array('gpxfile', 12), baseControllers.sanitizeInputs, baseControllers.checkXML, (req, res) => {
    const { speedIncrease, increasePower, increaseHeartRate, addHours } = res.locals
    console.log("Post req body parsing", speedIncrease, increasePower, increaseHeartRate, addHours)

    const resultFileNames = []
    for (const file of req.files) {

        var newName = file.originalname.split('.')[0] + '_adjusted' + file.filename.substring(0, 10) + '.' + file.originalname.split('.')[1]

        // inputFileOutputfile(file.path, 'fileProcessing/processed/' + newName, { addHours, increasePower, increaseHeartRate, speedIncrease })
        const outputFileName = path.join(processedDir, newName)
        inputFileOutputfile(file.path, outputFileName, { addHours, increasePower, increaseHeartRate, speedIncrease })
        resultFileNames.push(outputFileName)
        //res.download(path.join(processedDir, newName))


        // res.download('fileProcessing/processed/' + newName)

    }
    //console.log(resultFileNames)
    var zip = new AdmZip();
    for (const file of resultFileNames) {
        zip.addLocalFile(file);
    }
    const randomNumber = Math.floor(Math.random() * 1000000)
    //console.log(randomNumber, "Random Number")
    const zipFileName = path.join(processedDir, 'Adjusted_' + randomNumber + '.zip')
    zip.writeZip(zipFileName);
    res.download(zipFileName)



})



module.exports = router;
