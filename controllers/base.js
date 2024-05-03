const parser = require('fast-xml-parser');


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
    console.log('in the check xml section')
    console.log(req.files)


    const xmlString = `<?xml version="1.0" encoding="UTF-8" ?>
<body>
    <tagname>
        test1
    </tag.name>   <--- error here
    <tagname>
        test2
    </tagname>
</body>`;


    const parser = require('fast-xml-parser');
    console.log(parser)
    console.log(parser.XMLValidator)
    const validationResult = parser.XMLValidator.validate(xmlString);
    console.log(validationResult)
    next();
}





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