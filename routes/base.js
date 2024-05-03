const express = require('express')
const router = express.Router();
const baseControllers = require('../controllers/base.js')
const multer = require('multer')
require('dotenv').config()
const path = require('path')
const inputFileOutputfile = require('../js/index.js')

// const upload = multer({ dest: 'fileProcessing/uploads/' })


const uploadDir = path.join(process.cwd(), process.env.processingDirectory, 'uploads')
const processedDir = path.join(process.cwd(), process.env.processingDirectory, 'processed')
const upload = multer({ dest: uploadDir })




router.get('/', baseControllers.index)


router.post('/', upload.array('gpxfile', 12), baseControllers.sanitizeInputs, baseControllers.checkXML, (req, res) => {
    const { speedIncrease, increasePower, increaseHeartRate, addHours } = res.locals
    console.log("Post req body parsing", speedIncrease, increasePower, increaseHeartRate, addHours)

    for (const file of req.files) {

        var newName = file.originalname.split('.')[0] + '_adjusted' + file.filename.substring(0, 10) + '.' + file.originalname.split('.')[1]

        // inputFileOutputfile(file.path, 'fileProcessing/processed/' + newName, { addHours, increasePower, increaseHeartRate, speedIncrease })
        inputFileOutputfile(file.path, path.join(processedDir, newName), { addHours, increasePower, increaseHeartRate, speedIncrease })
        res.download(path.join(processedDir, newName))
        // res.download('fileProcessing/processed/' + newName)

    }

})



module.exports = router;
