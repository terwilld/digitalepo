const express = require('express')
const router = express.Router();
const baseControllers = require('../controllers/base.js')
const multer = require('multer')
require('dotenv').config()
const path = require('path')
const AdmZip = require("adm-zip");
const fs = require('fs')
const inputFileOutputfile = require('../js/index.js')
const { Worker, isMainThread, workerData } = require('worker_threads');
// const upload = multer({ dest: 'fileProcessing/uploads/' })


const uploadDir = path.join(process.cwd(), process.env.processingDirectory, 'uploads')
const processedDir = path.join(process.cwd(), process.env.processingDirectory, 'processed')
const upload = multer({ dest: uploadDir })




router.get('/', baseControllers.index)



router.post('/',
    upload.single('gpxfile', 12),
    baseControllers.sanitizeInputs,
    baseControllers.checkXML,
    async (req, res) => {
        const { speedIncrease, increasePower, increaseHeartRate, addHours } = res.locals
        const file = req.file
        var newName = file.originalname.split('.')[0] + '_adjusted' + file.filename.substring(0, 10) + '.' + file.originalname.split('.')[1]
        const outputFileName = path.join(processedDir, newName)
        const worker = new Worker("./js/worker.js",
            {
                workerData:
                {
                    file: file.path, outputFileName,
                    params: { speedIncrease, increasePower, increaseHeartRate, addHours }
                }
            });
        worker.on("message", msg => { console.log(`Worker message received:`, msg) });
        worker.on("error", err => {
            req.flash('error', `There was an error handling your request.  ${err}`)
            console.error(err)
            res.redirect('/')
        });
        worker.on("exit", (code, result, workerData) => {
            res.download(outputFileName)
        });


        // res.send('test')
        //res.download(outputFileName)
    })


module.exports = router;




    //  Old produced when I was allowing multi file uploads.
    //  This has been removed
    //

// (req, res) => {
//     console.log('inside the post about to log file and req.body')
//     console.log(req.file)
//     console.log(req.body)
//     const { speedIncrease, increasePower, increaseHeartRate, addHours } = res.locals
//     console.log("Post req body parsing", speedIncrease, increasePower, increaseHeartRate, addHours)

//     const resultFileNames = []
//     for (const file of req.files) {

//         var newName = file.originalname.split('.')[0] + '_adjusted' + file.filename.substring(0, 10) + '.' + file.originalname.split('.')[1]

//         // inputFileOutputfile(file.path, 'fileProcessing/processed/' + newName, { addHours, increasePower, increaseHeartRate, speedIncrease })
//         const outputFileName = path.join(processedDir, newName)
//         inputFileOutputfile(file.path, outputFileName, { addHours, increasePower, increaseHeartRate, speedIncrease })
//         resultFileNames.push(outputFileName)
//         //res.download(path.join(processedDir, newName))


//         // res.download('fileProcessing/processed/' + newName)

//     }
//     //console.log(resultFileNames)
//     var zip = new AdmZip();
//     for (const file of resultFileNames) {
//         zip.addLocalFile(file);
//     }
//     const randomNumber = Math.floor(Math.random() * 1000000)
//     //console.log(randomNumber, "Random Number")
//     const zipFileName = path.join(processedDir, 'Adjusted_' + randomNumber + '.zip')
//     zip.writeZip(zipFileName);
//     res.download(zipFileName)
// })