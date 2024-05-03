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


    const xmlString = `<?xml version="1.0" encoding="UTF-8" ?>
<body>
    <tagname>
        test1
    </tag.name>   <--- error here
    <tagname>
        test2
    </tagname>
</body>`;

    // console.log(parser)
    // console.log(parser.XMLValidator)
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

            console.log(req.files)
            for (const fileForDeletion of req.files) {
                fs.unlink(fileForDeletion.path, (err) => {
                    if (err) throw err;
                    //console.log(fileForDeletion.path, "Was deleted")
                })
            }

            return res.redirect('/');
        }
        console.log("AFTER THE FILE")
        //  redirect with a flash

    }
    next();
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