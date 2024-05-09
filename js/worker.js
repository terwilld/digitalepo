const { workerData, parentPort } = require('worker_threads');
const fs = require('fs');
const convert = require('xml-js');
const { performance } = require('perf_hooks');
const path = require('path')

Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}







function inputFileOutputfile(input, output, options) {
    // parentPort.postMessage("I am inside the big function")
    // parentPort.postMessage(`input file name: ${input}`)
    // parentPort.postMessage(`output file name: ${output}`)
    // parentPort.postMessage(JSON.stringify({ foo: 'bar', lol: 'sadf' }))
    // parentPort.postMessage(JSON.stringify(options))
    const xmlFile = fs.readFileSync(input, 'utf8');
    const my_json = convert.xml2js(xmlFile, { compact: true, spaces: 1 });
    var my_json2 = myloopjson(my_json, options)
    var my_xml = convert.js2xml(my_json2, { compact: true, ignoreComment: true, spaces: 1 })
    fs.writeFileSync(output, my_xml)
}



let counter = 0;
// parentPort.postMessage('This is a message from the child thread')
// parentPort.postMessage(workerData)

// for (let i = 0; i < 500_000_000; i++) {
//     if (counter % 100_000_000 == 0) {
//         //parentPort.postMessage(counter);
//     }
//     counter++;
// }

inputFileOutputfile(workerData.file, workerData.outputFileName, workerData.params)

function myloopjson(obj, options = { speedIncrease: 0, addHours: 0, increasePower: 0, increaseHeartRate: 0 }, depth = 1) {
    var result = {};
    // console.log(options)
    var { addHours, increasePower, increaseHeartRate, speedIncrease } = options;

    //  All Log messages now need to be sent to parentPort.postMessage.
    //  data sent must be iterable - i.e. cannot be of the below form.
    // console.log("Executing big function with parameters:")
    // console.log("Add Hours: ", addHours)
    // console.log("increasePower: ", increasePower)
    // console.log("increaseHeartRate: ", increaseHeartRate)
    // console.log("speedIncrease: ", speedIncrease)

    //console.log("Increase Heartrate: ", increaseHeartRate)

    // console.log("Add hours: ", addHours)
    // console.log("Increase Power: ", increasePower)
    // console.log("Speed increase: ", speedIncrease)

    // var startTime = performance.now()
    if ((increaseHeartRate) && (Math.floor(increaseHeartRate))) {
        increaseHeartRate = Math.floor(increaseHeartRate)     //Round it and type conversion
        var tmp = increaseHeartRateFunction(obj, { increaseHeartRate })
        obj = tmp
    }
    // var endTime = performance.now()
    // console.log(`Editing Heart rate data took: ${endTime - startTime} milliseconds`)




    if ((increasePower) && (Math.floor(increasePower))); {
        increasePower = Math.floor(increasePower)
        var tmp = increasePowerFunction(obj, { increasePower })
        obj = tmp
    }



    if ((addHours) && (Math.floor(addHours))) {
        addHours = Math.floor(addHours)
        var tmp = addHoursFunction(obj, { addHours })
        obj = tmp;
    }


    if ((speedIncrease) && (Math.floor(speedIncrease))) {

        speedIncrease = Math.floor(speedIncrease)
        var tmp = increaseSpeed(obj, speedIncrease)
        obj = tmp
    }
    return obj
}


function myloopjson(obj, options = { speedIncrease: 0, addHours: 0, increasePower: 0, increaseHeartRate: 0 }, depth = 1) {
    var result = {};
    // console.log(options)
    var { addHours, increasePower, increaseHeartRate, speedIncrease } = options;

    // var startTime = performance.now()
    if ((increaseHeartRate) && (Math.floor(increaseHeartRate))) {
        increaseHeartRate = Math.floor(increaseHeartRate)     //Round it and type conversion
        var tmp = increaseHeartRateFunction(obj, { increaseHeartRate })
        obj = tmp
    }
    // var endTime = performance.now()
    // console.log(`Editing Heart rate data took: ${endTime - startTime} milliseconds`)

    if ((increasePower) && (Math.floor(increasePower))); {
        increasePower = Math.floor(increasePower)
        var tmp = increasePowerFunction(obj, { increasePower })
        obj = tmp
    }

    if ((addHours) && (Math.floor(addHours))) {
        addHours = Math.floor(addHours)
        var tmp = addHoursFunction(obj, { addHours })
        obj = tmp;
    }

    if ((speedIncrease) && (Math.floor(speedIncrease))) {

        speedIncrease = Math.floor(speedIncrease)
        var tmp = increaseSpeed(obj, speedIncrease)
        obj = tmp
    }
    return obj
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

    //console.log(obj.TrainingCenterDatabase.Activities.Activity)

    //  Two options.  obj.TrainingCenterDatabase.Activities.Activity.Lap is an object or array of objects
    //  In either case the form of these objects themselves has a field called Track, with an array of track points.


    //  In both cases we need the global start time of the activity.
    //  First - handle single lap activites

    const startTime = new Date(obj.TrainingCenterDatabase.Activities.Activity.Id._text)
    //const startTimeEpoch = Date.parse(startTime)

    //console.log(obj.TrainingCenterDatabase.Activities.Activity.Lap)
    if (!(Array.isArray(obj.TrainingCenterDatabase.Activities.Activity.Lap))) {
        //Branch for 1 lap
        //console.log('This is not an array')
        //  The function compress lap must take a lap object, a global start time and a speed increase %.
        //  This returns the adjusted object.
        const adjustedObject = adjustLap(obj.TrainingCenterDatabase.Activities.Activity.Lap, startTime, speedIncrease)
        obj.TrainingCenterDatabase.Activities.Activity.Lap = adjustedObject
        return obj
    } else {
        //Branch for multiple laps
        //  This must iterate through all the lap objects adjusting each one at a time, adding them to an array.
        //console.log('this is an array')
        //console.log(obj.TrainingCenterDatabase.Activities.Activity.Lap)
        newLap = []
        for (const element of obj.TrainingCenterDatabase.Activities.Activity.Lap) {
            //console.log(element)
            const adjustedObject = adjustLap(element, startTime, speedIncrease)
            newLap.push(adjustedObject)
        }
        obj.TrainingCenterDatabase.Activities.Activity.Lap = newLap
        //console.log('Just one at the end')
        //console.log(obj.TrainingCenterDatabase.Activities.Activity.Lap[1])
        //console.log(obj.TrainingCenterDatabase.Activities)
        return obj
    }



    //console.log(startTime, startTimeEpoch)
    return obj
    const trackPoints = obj.TrainingCenterDatabase.Activities.Activity.Lap.Track.Trackpoint
    newTrackpoints = []
    //const startTime = new Date(trackPoints[0].Time._text)
    //const startTimeEpoch = Date.parse(startTime)

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

function adjustLap(lap, startTime, speedIncrease) {
    //console.log(lap)
    //console.log(startTime)
    //console.log(speedIncrease)
    const trackPoints = lap.Track.Trackpoint
    const newTrackpoints = []
    const startTimeEpoch = Date.parse(startTime)
    //  This takes a single trackpoint.  calculates the difference from start to this track point, and adjustes.  Conversion to and from date
    //  There might be a better way to do this without converting to and from epoch.
    //  Data is rounded to seconds.
    for (const element of trackPoints) {
        //console.log(element)
        //This is confusing but to avoid circular references  There might be a better way.
        let newElement = JSON.parse(JSON.stringify(element))

        const currentTime = new Date(element.Time._text)
        const currentTimeEpoch = Date.parse(currentTime)

        const epochDifference = currentTimeEpoch - startTimeEpoch
        const newTimeEpoch = startTimeEpoch + (epochDifference / (1 + (Math.floor(speedIncrease) * .01)))
        const newTime = new Date(newTimeEpoch);
        newElement.Time._text = newTime.toISOString().split('.')[0] + "Z"
        newTrackpoints.push(newElement)
    }

    //  This takes the newly calculated track points - and REMOVES ANY DUPLICATES AFTER ROUNDING OF TIME
    //  Neccessary for parsing else there will be multiple points with identical times because I have compressed
    //  This could probably be done in place, rather than with multiple temporary arrays.
    newerTrackpoints = []
    for (let i = 0; i < newTrackpoints.length - 1; i++) {
        const obj = newTrackpoints[i];
        const nextObj = newTrackpoints[i + 1]
        if ((obj.Time._text == nextObj.Time._text) == false) {
            newerTrackpoints.push(obj)
        }
    }
    lap.Track.Trackpoint = newerTrackpoints
    //  Also adjust the lap start time.  Just incase.  This should have no effect on a single lap activity.
    //  Take the _attribute Start Time and compress it towards the input global start time according to the speed increase.
    const lapStartTime = new Date(lap._attributes.StartTime)
    const lapStartTimeEpoch = Date.parse(lapStartTime)
    const epochDifference = lapStartTimeEpoch - startTimeEpoch
    const newLapTimeEpoch = startTimeEpoch + (epochDifference / (1 + (Math.floor(speedIncrease) * .01)))
    const newLapTime = new Date(newLapTimeEpoch);
    lap._attributes.StartTime = newLapTime.toISOString().split('.')[0] + "Z"
    return lap
}
