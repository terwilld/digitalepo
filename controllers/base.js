const parser = require('fast-xml-parser');
const fs = require('fs')

module.exports.index = (req, res) => {
    // console.log('derp in the controller')
    // console.log(res.locals)

    res.render('base/index.ejs')
    // res.send('asdf in the controllers')
}

module.exports.sanitizeInputs = (req, res, next) => {
    const { percentSpeedIncrease: speedIncrease, percentWattsIncrease: increasePower, hourOffset: addHours, percentHeartRateIncrease: increaseHeartRate } = req.body
    console.log("in sanitizeInputs", speedIncrease, increasePower, addHours, increaseHeartRate)
    if (Number(speedIncrease)) {
        res.locals.speedIncrease = Number(speedIncrease)
    }
    if (Number(increasePower)) {
        res.locals.increasePower = Number(increasePower)
    }
    if (Number(addHours)) {
        res.locals.addHours = Math.floor(Number(addHours))
    }
    if (Number(increaseHeartRate)) {
        res.locals.increaseHeartRate = Number(increaseHeartRate)
    }
    next();
}

module.exports.checkXML = (req, res, next) => {
    //console.log('in the check xml section')
    // console.log(req.files)
    // console.log(parser)
    // console.log(parser.XMLValidator)
    if (req.file) {
        console.log('this is a single file')
        const file = req.file
        const data = fs.readFileSync(file.path, 'utf8');
        const validationResult = parser.XMLValidator.validate(data);
        if (validationResult !== true) {
            //console.log(validationResult, "Validation result not true")

            //clean file on this request.
            req.flash('error', `Malformed XML file.  
            Your file ${file.originalname} is either malformed or not an XML file.  
            Please try again.  Error Code:  ${validationResult.err.code}. \r\n Error Message:  ${validationResult.err.msg}`)
            // Delete submitted files
            fs.unlink(file.path, (err) => {
                if (err) throw err;
            })
            // redirect home with flash message
            return res.redirect('/');
        }
        console.log("validation is fine")
        next();
    } else {
        //This else block should never run. It is for attempted multi uploads
        //  This was removed.
        for (const file of req.files) {
            console.log(file)
            const data = fs.readFileSync(file.path, 'utf8');
            const validationResult = parser.XMLValidator.validate(data);
            if (validationResult !== true) {
                console.log(validationResult, "Validation result not true")

                //clean All files on this request.

                req.flash('error', `Malformed XML file.  
            \nYour file ${file.originalname} is either malformed or not an XML file.  
            \nPlease try again.  Error Code:  ${validationResult.err.code}. \r\n Error Message:  ${validationResult.err.msg}`)
                // Delete submitted files
                for (const fileForDeletion of req.files) {
                    fs.unlink(fileForDeletion.path, (err) => {
                        if (err) throw err;
                        //console.log(fileForDeletion.path, "Was deleted")
                    })
                }
                // redirect home with flash message
                return res.redirect('/');
            }
        }
        next();
    }
    // const validationResult = parser.XMLValidator.validate(xmlString);
    // console.log(validationResult)
    // next();
}


// import { unlink } from 'node:fs';
// // Assuming that 'path/file.txt' is a regular file.
// unlink('path/file.txt', (err) => {
//     if (err) throw err;
//     console.log('path/file.txt was deleted');
// });



// const parser = require('fast-xml-parser');

// const validationResult = parser.validate(xmlString);
// console.log(validationResult)

// // validationResult will be an object of:
// {
//     err: {
//         code: 'InvalidTag',
//             msg: "Closing tag 'tagname' is expected inplace of 'tag.name'.",
//                 line: 5
//     }
// }