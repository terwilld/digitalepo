// fs = require('fs')
// var parser = require('xml2json');

// var my_json = fs.readFile('./Afternoon_Ride.tcx', async function (err, data) {
//     var json = await parser.toJson(data);
//     // console.log(json);
//     // console.log(Object.keys(json))
//     // console.log(json)
//     console.log('test')
//     console.log(json.TrainingCenterDatabase)
//     return json
//     // console.log("to json ->", json);
// });

// console.log('test2')
// console.log(my_json)

// import { XMLValidator } from 'fast-xml-parser';
// const xmlparser = require('fast-xml-parser')
// var xml2js = require('xml2js');
const fs = require('fs')
const { type } = require('os')
const justClone = require('just-clone')
// const xmlFile = fs.readFileSync('ForTesting.tcx', 'utf8');
// const parser = new xmlparser.XMLParser()
// const json = parser.parse(xmlFile)

// console.log(`First Book:`, json.catalog.book[0])

const iterate = (obj) => {
    Object.keys(obj).forEach(key => {

        console.log(`key: ${key}, value: ${obj[key]}`)

        if (typeof obj[key] === 'object' && obj[key] !== null) {
            iterate(obj[key])
        }
    })
}


// const rebuild = (obj) => {
//     Object.keys.obj.forEach(key => {

//     })
// }



// var parser = require('xml2json');

// var xml = "<foo attr=\"value\">bar</foo>";
// console.log("input -> %s", xml)


// // const xmlFile = fs.readFileSync('ForTesting.tcx', 'utf8');

// var myjson = parser.toJson(xmlFile,{object:true})
// console.log(myjson.keys)

// derp = { 'a': 2, 'b': 3 }
// console.log(Object.keys(derp))
// console.log(Object.keys(myjson))
// // console.log(derp.keys)
// // console.log(myjson)
// // xml to json
// var json = parser.toJson(xml);
// console.log("to json -> %s", json);

// // json to xml
// var xml = parser.toXml(json);
// console.log("back to xml -> %s", xml)
// // var builder = new xml2js.Builder();
// // // var newxml = builder.buildObject(groupChildren(json))
// // var newxml = builder.buildObject(json)
// // console.log(newxml)
// // // iterate(json)
// // console.log(json.TrainingCenterDatabase.Activities.Activity.Lap.Track)





// module.exports.myjson = myjson


//console.log(xmlFile)
// module.exports.xmlFile = xmlFile


//https://geshan.com.np/blog/2022/11/nodejs-xml-parser/
// https://medium.com/@alaneicker/how-to-process-json-data-with-recursion-dc530dd3db09
//https://medium.com/@stheodorejohn/circular-references-in-javascript-1a798940e7eb

let data = {
    "name": "John",
    "age": 30,
    "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zip": "10001"
    },
    "phoneNumbers": [
        {
            "type": "home",
            "number": "555-555-1234"
        },
        {
            "type": "work",
            "number": "555-555-5678"
        }
    ]
};
// console.log(data)




function loopThroughJSON(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            if (Array.isArray(obj[key])) {
                // loop through array


                for (let i = 0; i < obj[key].length; i++) {
                    loopThroughJSON(obj[key][i]);
                }
            } else {
                // call function recursively for object
                
                //Going to need this
                // loopThroughJSON(obj[key]);
            }
        } else {
            // do something with value
            console.log(key + ': ' + obj[key]);
        }
    }
}

//loopThroughJSON(data)

// Holy shit I spent two hours 

var addDays = function (str, days) {
    var myDate = new Date(str);
    myDate.setDate(myDate.getDate() + parseInt(days));
    return myDate;
}


function myloopjson(obj, options = {},depth=1) {
    var result = {}
    console.log("These are my options")
    console.log(options)

    for (let key in obj) {

        if (typeof (obj[key]) === 'object') {

            //  Check if this object is an array - and reconstruct it
            if (Array.isArray(obj[key])) {
                var arrResult = []
                for (let i = 0; i < obj[key].length; i++){
                    arrResult.push(myloopjson(obj[key][i],depth+1))
                }
                result[key] = arrResult
            } else {
                var tmpResult = myloopjson(obj[key], depth + 1)
                result[key] = tmpResult
            }
        } else {
            //console.log('Non Object', key, obj[key], depth)
            if (obj[key].startsWith('2024') && obj[key].endsWith('Z') ) {
                var originalDate = new Date(obj[key])
                // var newDate = originalDate.setDate(originalDate.getDate() + 1)
                var newDate = addDays(originalDate, 2);
                // console.log(originalDate, obj[key], key, newDate.toISOString(),newDate, typeof obj[key], typeof newDate,typeof originalDate)
                result[key] = newDate.toISOString().split('.')[0] + "Z"
                //console.log(key,obj[key],result[key])
            } else {
                result[key] = obj[key]
            }

            
        }
    }
    //console.log(`final result: \n`, result)
    // console.log(obj)
    return result
}


// data = {
//     "name": "John",
//     "address": {
//         "street": "123 Main St"

//     },
//     "phoneNumbers": [
//         {
//             "type": "home",
//             "number": "555-555-1234"
//         }
//         // },
//         // {
//         //     "type": "work",
//         //     "number": "555-555-5678"
//         // }
//     ]
// };

// const my_result = myloopjson(data)
console.log("******")
// console.log("my result:    \n", my_result)
// console.log(data)




var convert = require('xml-js');


// var result1 = convert.xml2js(xml, { compact: true, spaces: 4 });
// var result2 = convert.xml2js(xml, { compact: false, spaces: 4 });
// console.log(result1, '\n', result2);
console.log("ASDFASDF")
//console.log(result1)

const xmlFile = fs.readFileSync('ForTesting.tcx', 'utf8');
var my_json = convert.xml2js(xmlFile, { compact: true, spaces: 1 });
//console.log(my_json)

var myTestOutput = myloopjson(my_json)

// console.log('My output:')
// console.log(myTestOutput)
// console.log('input json')
// console.log(my_json)

console.log('My output:')
console.log(myTestOutput.TrainingCenterDatabase.Activities.Activity.Lap.Track.Trackpoint[0])
console.log('input json')
console.log(my_json.TrainingCenterDatabase.Activities.Activity.Lap.Track.Trackpoint[0])

var my_xml = convert.js2xml(myTestOutput, { compact: true, ignoreComment: true, spaces: 1 })
//var my_xml = convert.js2xml(my_json, { compact: true, ignoreComment: true, spaces: 1 })
console.log(my_xml)

fs.writeFileSync('output.tcx',my_xml)


// console.log('what the fuck is this:  my_json')
// console.log(my_json)
// const my_result = myloopjson(my_json)

console.log("ASDFASDFASDF")

// console.log(justClone({a:'d'}))