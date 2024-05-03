const fs = require('fs');
const convert = require('xml-js');
const { performance } = require('perf_hooks');


Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}

//  Child Functions recursively deconstruct the input json
//  Make changes and return the reconstructed json
//  Each key has a value of object {arr or object} or a string
//  If the value is a string, it is returned post edits.
//  If the value is an object, the same function is called
//  The function requires a json which has been created by xml2js.  Ideally tcx / gpx data
//  
//  Optional Parameters are 
//          addHours: 30,          This should be an integer number positive or negative  It will shift data timestamps
//          increasePower: 30,     This should be an integer number positive or negative  It will shift power data if present in <Watts>{}</Watts>
//          addHeartRate: 100      This should be an integer number positive or negative  It will shift heart rate data if present in HR

//   Does not handle nested arrays currently
//   Searches for specific format.  This should be adjusted {can it}?
//   Monster function was broken into parts.  Json construction and deconstruction happens multiple times.
//   This is not ideal but will make debugging / editing easier  Otherwise each key value will have to be searched for each possible input paramter
//   Add Scale HR
//   Add Scale Power
//speedIncrease = 25

//  MOTHER FUCKING CIRCULAR REFERENCES CREATED BY ACCIDENTAL GLOBAL VARIABLE CREATION

//  Unused arg depth is used for recusion debugging.  No effect
//  Might have to adjust script for multiple laps




function myloopjson(obj, options = { speedIncrease: 0, addHours: 0, increasePower: 0, increaseHeartRate: 0 }, depth = 1) {
    var result = {};
    // console.log(options)
    var { addHours, increasePower, increaseHeartRate, speedIncrease } = options;
    //console.log("Increase Heartrate: ", increaseHeartRate)

    // console.log("Add hours: ", addHours)
    // console.log("Increase Power: ", increasePower)
    // console.log("Speed increase: ", speedIncrease)

    var startTime = performance.now()
    if ((increaseHeartRate) && (Math.floor(increaseHeartRate))) {
        increaseHeartRate = Math.floor(increaseHeartRate)     //Round it and type conversion
        var tmp = increaseHeartRateFunction(obj, { increaseHeartRate })
        obj = tmp
    }
    var endTime = performance.now()
    console.log(`Editing Heart rate data took: ${endTime - startTime} milliseconds`)



    var startTime = performance.now()
    if ((increasePower) && (Math.floor(increasePower))); {
        increasePower = Math.floor(increasePower)
        var tmp = increasePowerFunction(obj, { increasePower })
        obj = tmp
    }
    var endTime = performance.now()
    console.log(`Editing Power data took: ${endTime - startTime} milliseconds`)



    var startTime = performance.now()
    if ((addHours) && (Math.floor(addHours))) {
        console.log("Adding Hours")
        addHours = Math.floor(addHours)
        var tmp = addHoursFunction(obj, { addHours })
        obj = tmp;
    }
    var endTime = performance.now()
    console.log(`Adding time: ${endTime - startTime} milliseconds`)


    var startTime = performance.now()

    if ((speedIncrease) && (Math.floor(speedIncrease))) {

        speedIncrease = Math.floor(speedIncrease)
        var tmp = increaseSpeed(obj, speedIncrease)
        obj = tmp
    }

    var endTime = performance.now()
    console.log(`speed increase took: ${endTime - startTime} milliseconds`)

    return obj
    // return result
}

function increaseHeartRateFunction(obj, options = {}, depth = 1) {
    //Options should only have increase heartrate but should be an object
    // input here is expected to be a number {+ or -}
    var result = {}
    for (let key in obj) {
        if (typeof (obj[key]) === 'object') {
            if (Array.isArray(obj[key])) {
                var arrResult = []
                for (let i = 0; i < obj[key].length; i++) {
                    var tmpResult = increaseHeartRateFunction(obj[key][i], options, depth + 1)
                    arrResult.push(tmpResult)
                }
                result[key] = arrResult
            } else if ((key == 'HeartRateBpm') && ((typeof options.increaseHeartRate == 'number'))) {
                var originalHr = Number(obj[key]["Value"]["_text"])
                var addHr = Number(options.increaseHeartRate)
                result[key] = { "Value": { "_text": (originalHr + addHr).toString() } }
            } else {
                //Non Array Object that isn't matching our HeartRateBpm tag
                var tmpResult = increaseHeartRateFunction(obj[key], options, depth + 1)
                result[key] = tmpResult
            }
        } else {
            //Bottom of the tree
            // value of key is a string
            var tmpResult = obj[key]
            result[key] = tmpResult
        }
    }
    return result
}

function increasePowerFunction(obj, options = {}, depth = 1) {
    // Options should only have increase power but should be an object
    // input here is expected to be a number {+ or -}
    var result = {}
    for (let key in obj) {
        if (typeof (obj[key]) === 'object') {
            if (Array.isArray(obj[key])) {
                var arrResult = []
                for (let i = 0; i < obj[key].length; i++) {
                    var tmpResult = increasePowerFunction(obj[key][i], options, depth + 1)
                    arrResult.push(tmpResult)
                }
                result[key] = arrResult
            } else if (key == 'Watts' && (Number(options.increasePower))) {
                var tmpWatts = Number(obj[key]["_text"]) * (1 + (Number(options.increasePower) / 100))
                tmpWatts = Math.floor(tmpWatts).toString()
                var tmpWattsString = { "_text": tmpWatts }
                result[key] = tmpWattsString
            } else {
                //Non Array Object that isn't matching our HeartRateBpm tag
                var tmpResult = increasePowerFunction(obj[key], options, depth + 1)
                result[key] = tmpResult
            }
        } else {
            //Bottom of the tree
            // value of key is a string
            var tmpResult = obj[key]
            result[key] = tmpResult
        }
    }
    return result
}

function addHoursFunction(obj, options = {}, depth = 1) {
    // Options should only have increase power but should be an object
    // input here is expected to be a number {+ or -}
    var result = {}
    for (let key in obj) {
        if (typeof (obj[key]) === 'object') {
            if (Array.isArray(obj[key])) {
                var arrResult = []
                for (let i = 0; i < obj[key].length; i++) {
                    var tmpResult = addHoursFunction(obj[key][i], options, depth + 1)
                    arrResult.push(tmpResult)
                }
                result[key] = arrResult
            } else {
                //Non Array Object that isn't matching our HeartRateBpm tag
                var tmpResult = addHoursFunction(obj[key], options, depth + 1)
                result[key] = tmpResult
            }
        } else {
            if (obj[key].startsWith('2024') && obj[key].endsWith('Z')) {
                var originalDate = new Date(obj[key])
                if (typeof options.addHours === 'number') {
                    var newDate = new Date(originalDate.getTime())
                    newDate.addHours(options.addHours)
                    result[key] = newDate.toISOString().split('.')[0] + "Z"
                } else {
                    result[key] = obj[key]
                }
            } else {
                result[key] = obj[key]
            }
        }
    }
    return result
}

function increaseSpeed(obj, speedIncrease = 0) {
    const trackPoints = obj.TrainingCenterDatabase.Activities.Activity.Lap.Track.Trackpoint
    newTrackpoints = []
    const startTime = new Date(trackPoints[0].Time._text)
    const startTimeEpoch = Date.parse(startTime)

    for (const element of trackPoints) {
        //console.log(element);
        let newElement = JSON.parse(JSON.stringify(element))
        const currentTime = new Date(element.Time._text)
        const currentTimeEpoch = Date.parse(currentTime)
        const epochDifference = currentTimeEpoch - startTimeEpoch
        const newTimeEpoch = startTimeEpoch + (epochDifference / (1 + (Math.floor(speedIncrease) * .01)))
        //console.log("Start time Epoc: ", startTimeEpoch, "Epoch Difference: ", epochDifference, "CurrentTime Epoch: ", currentTimeEpoch, "New Time Epoch: ", newTimeEpoch)
        const newTime = new Date(newTimeEpoch);

        newElement.Time._text = newTime.toISOString().split('.')[0] + "Z"
        newTrackpoints.push(newElement)
    }
    newerTrackpoints = []
    for (let i = 0; i < newTrackpoints.length - 1; i++) {
        const obj = newTrackpoints[i];
        const nextObj = newTrackpoints[i + 1]
        if ((obj.Time._text == nextObj.Time._text) == false) {
            newerTrackpoints.push(obj)
        }
    }
    obj.TrainingCenterDatabase.Activities.Activity.Lap.Track.Trackpoint = newerTrackpoints
    return obj
}


//  Core logic of the recursive function.
//  If value of a key is an object it is either an array or an object.
//      If it is an array - each element of the array is assumed to be an object and has the function applied to it.
//      if it is an object - the object has the function applied to it.
//      If the vlue of the key is a string - it is returned
//      This is fucky
//      This is a dream.  Unused because I need to modify code to have variable search critera.
//      This seems very difficult.

function boilierPlateRecursion(obj, options, depth = 1) {
    var result = {}
    for (let key in obj) {
        if (typeof (obj[key]) === 'object') {
            if (Array.isArray(obj[key])) {
                var arrResult = []
                for (let i = 0; i < obj[key].length; i++) {
                    arrResult.push(boilierPlateRecursion(obj[key][i], options, depth + 1))
                }
                result[key] = arrResult
            } else {
                var tmpResult = boilierPlateRecursion(obj[key], options, depth + 1)
                result[key] = tmpResult
            }
        }
        else {
            result[key] = obj[key]
        }
    }
    return result
}



function inputFileOutputfile(input, output, options) {

    var startTime = performance.now()
    const xmlFile = fs.readFileSync(input, 'utf8');
    var endTime = performance.now()
    console.log(`Reading xml took: ${endTime - startTime} milliseconds`)

    var startTime = performance.now()
    const my_json = convert.xml2js(xmlFile, { compact: true, spaces: 1 });
    var endTime = performance.now()
    console.log(`Converting xml to json took: ${endTime - startTime} milliseconds`)


    var startTime = performance.now()
    var my_json2 = myloopjson(my_json, options)
    var endTime = performance.now()
    console.log(`My whole loop took: ${endTime - startTime} milliseconds`)

    var startTime = performance.now()
    var my_xml = convert.js2xml(my_json2, { compact: true, ignoreComment: true, spaces: 1 })
    var endTime = performance.now()
    console.log(`Converting json back to xml took: ${endTime - startTime} milliseconds`)

    var startTime = performance.now()
    fs.writeFileSync(output, my_xml)
    var endTime = performance.now()
    console.log(`Writing file took: ${endTime - startTime} milliseconds`)

}


var startTime = performance.now()
inputFileOutputfile('ForTesting.tcx', 'output.tcx', { addHours: 30, increasePower: 30, increaseHeartRate: 100, speedIncrease: 15 })
var endTime = performance.now()
console.log(`\nWhole operation took: ${endTime - startTime} milliseconds\n`)



// const xmlFile = fs.readFileSync('ForTesting.tcx', 'utf8');
// var my_json = convert.xml2js(xmlFile, { compact: true, spaces: 1 });
// //var my_json2 = myloopjson(my_json, { addHours: 30, increasePower: 30, increaseHeartRate: 100, speedIncrease: 25 })

// roughObjSize = JSON.stringify(my_json).length;
// console.log("roughObj Size my_json", roughObjSize)
// var my_json2 = myloopjson(my_json, { addHours: 30, increasePower: 30, speedIncrease: 25, increaseHeartRate: '33.3' })

// // console.log(my_json.TrainingCenterDatabase.Activities.Activity.Lap)
// console.log(my_json2.TrainingCenterDatabase.Activities.Activity.Lap)
// roughObjSize = JSON.stringify(my_json2).length;
// console.log("roughObj Size my_json2", roughObjSize)

// console.log('derp')
// var my_xml = convert.js2xml(my_json2, { compact: true, ignoreComment: true, spaces: 1 })
// // fs.writeFileSync('output.tcx', my_xml)