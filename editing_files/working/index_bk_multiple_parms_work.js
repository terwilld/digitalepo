const fs = require('fs')
const convert = require('xml-js');


var addDays = function (str, days) {
    var myDate = new Date(str);
    myDate.setDate(myDate.getDate() + parseInt(days));
    return myDate;
}

Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}


function myloopjson(obj, options = {}, depth = 1) {
    var result = {}
    //console.log(`These are my options:`, options, ` and my current depth: ${depth}`)
    // console.log(options.addHours)
    for (let key in obj) {

        //console.log(`this is my key: ${key}`)
        if (typeof (obj[key]) === 'object') {

            if (Array.isArray(obj[key])) {
                var arrResult = []
                for (let i = 0; i < obj[key].length; i++) {
                    arrResult.push(myloopjson(obj[key][i], options, depth + 1))
                }
                result[key] = arrResult
            } else if ((key == 'HeartRateBpm') && ((typeof options.addHeartRate == 'number'))) {
                //console.log("Heart rate: ", key, obj[key], obj[key]["Value"], obj[key]["Value"]["_text"], typeof obj[key]["Value"]["_text"])
                // Original to be replace with something else
                try {
                    var originalHr = Number(obj[key]["Value"]["_text"])
                    var addHr = Number(options.addHeartRate)
                    result[key] = { "Value": { "_text": (originalHr + addHr).toString() } }
                    // console.log('HearRate Modified: ', originalHr, options.addHeartRate, originalHr + addHr)
                    // console.log(obj[key])
                    // console.log(result[key])
                } catch {
                    var tmpResult = myloopjson(obj[key], options, depth + 1)
                    // console.log('this is not a number')
                    result[key] = tmpResult
                }

            } else if (key == 'Watts' && (Number(options.increasePower))) {
                //console.log("obj: ", obj, "key: ", key, "obj[key]: ", obj[key], obj[key]["_text"], Number(options.increasePower))
                try {
                    var tmpWatts = Number(obj[key]["_text"]) * (1 + (Number(options.increasePower) / 100))
                    tmpWatts = Math.floor(tmpWatts).toString()
                    //console.log("Temporary Watts: ", tmpWatts)
                    var tmpWattsString = { "_text": tmpWatts }
                    //var tmpResult = myloopjson(obj[key], options, depth + 1)
                    //console.log("Tmp watts:", tmpResult)
                    //console.log("Tmp watts String: ", tmpWattsString)
                    result[key] = tmpWattsString

                    console.log("Orig: ", obj, obj[key])
                    console.log("Result: ", result, result[key])
                } catch {
                    console.log('WHAT THE FUCK')
                    var tmpResult = myloopjson(obj[key], options, depth + 1)
                    result[key] = tmpResult
                }

            } else {
                var tmpResult = myloopjson(obj[key], options, depth + 1)
                result[key] = tmpResult
            }
        } else {

            //console.log('Non Object', key, obj[key], depth)
            if (obj[key].startsWith('2024') && obj[key].endsWith('Z')) {
                var originalDate = new Date(obj[key])
                if (typeof options.addHours === 'number') {
                    // console.log(typeof options.addHours)

                    // var newDate = originalDate.setDate(originalDate.getDate() + 1)
                    //var newDate = addDays(originalDate, 2);
                    var newDate = new Date(originalDate.getTime())
                    newDate.addHours(options.addHours)
                    //console.log(originalDate, obj[key], key, newDate.toISOString(), newDate, typeof obj[key], typeof newDate, typeof originalDate)
                    result[key] = newDate.toISOString().split('.')[0] + "Z"
                } else {
                    //console.log(originalDate, obj[key], key, typeof obj[key], typeof originalDate)
                    result[key] = obj[key]
                }

                //console.log(key,obj[key],result[key])
            } else {
                result[key] = obj[key]
            }
        }
    }

    return result
}

console.log("******")

console.log("ASDFASDF")
const xmlFile = fs.readFileSync('ForTesting.tcx', 'utf8');

var my_json = convert.xml2js(xmlFile, { compact: true, spaces: 1 });

var myTestOutput = myloopjson(my_json, { addHours: 30, increasePower: 30, addHeartRate: 100 })
console.log(myTestOutput.TrainingCenterDatabase.Activities.Activity.Lap.Track.Trackpoint[0])
var my_xml = convert.js2xml(myTestOutput, { compact: true, ignoreComment: true, spaces: 1 })


fs.writeFileSync('output.tcx', my_xml)