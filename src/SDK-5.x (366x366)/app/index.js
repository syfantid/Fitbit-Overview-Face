import document from "document";
import display from "display";
import { Accelerometer } from "accelerometer";
import { Gyroscope } from "gyroscope";
import { BodyPresenceSensor } from "body-presence";
import { HeartRateSensor } from "heart-rate";
import * as bm from "./bm.js";
import * as date from "./date.js"
import * as battery from "./battery.js"
import * as time from "./time.js"
import * as hr from "./hr.js"
import * as activity from "./activity.js"
import * as settings from "./settings.js"
import * as state from "./state.js"
import * as torch from "./torch.js"
import {send} from "./transport";

settings.applySettings();
me.appTimeoutEnabled = false;

let data_loc = {}


// sensor settings
const samplerate = 1; // low for testing
const batch = 5; // low for testing
const settings = { frequency: samplerate, batch: batch };

// initialize sensors
let acc = new Accelerometer(settings);
let gyro = new Gyroscope(settings);
let bps = new BodyPresenceSensor();
let hrm = new HeartRateSensor({frequency:1});

//Heart Rate sensor
hrm.addEventListener("reading", () => {
    // initialize sending objects
    let data_hrm = {};
    data_hrm['datatype']="raw_sensor";
    data_hrm['key']="hrm";
    data_hrm['timestamp'] = new Date().getTime();
    data_hrm["heart_rate"] = hrm.heartRate
    data_hrm['timestamps'] = hrm.heartRate.timestamp
    send(data_hrm)
})
hrm.start()

//Accelerometer Sensor
acc.addEventListener("reading", () => {
    // initialize sending objects
    let data_acc = {};
    data_acc['datatype']="raw_sensor";
    data_acc['key']="acc";
    data_acc['timestamp'] = new Date().getTime();
    data_acc["acc_x"] = acc.readings.x
    data_acc["acc_y"] = acc.readings.y
    data_acc["acc_z"] = acc.readings.z
    data_acc['timestamps'] = acc.readings.timestamp
    send(data_acc)
})
acc.start()

//Gyroscope Sensor
gyro.addEventListener("reading", () => {
    // initialize sending objects
    let data_gyro = {};
    data_gyro['datatype']="raw_sensor";
    data_gyro['key']="gyro";
    data_gyro['timestamp'] = new Date().getTime();
    data_gyro["gyro_x"] = gyro.readings.x
    data_gyro["gyro_y"] = gyro.readings.y
    data_gyro["gyro_z"] = gyro.readings.z
    data_gyro['timestamps'] = gyro.readings.timestamp
    send(data_gyro)
})
gyro.start()

//Body-Presence Sensor
bps.addEventListener("reading", () => {
    // initialize sending objects
    let data_bps = {};
    data_bps['datatype']="raw_sensor";
    data_bps['key']="bps";
    data_bps['timestamp'] = new Date().getTime();
    data_bps['presence'] = bps.present;
    data_bps['timestamps'] = bps.present.timestamp
    send(data_bps)
})
bps.start()

// Event listener to capture screen (not only watch face) turning on and off
display.addEventListener("change", () => {
    if (display.on) {
        console.log('DIS ON');
        const displayOn = {
            dataType: "ue_metric",
            key: "display",
            value: "on",
            timestamp: new Date().getTime()
        };
        send(displayOn)
    } else {
        console.log('DIS OFF');
        const displayOff = {
            dataType: "ue_metric",
            key: "display",
            value: "off",
            timestamp: new Date().getTime()
        };
        send(displayOff)
    }
});


// Event listener for body presence sensor; currently buggy cause it deactivates the sensor automatically
// import { BodyPresenceSensor } from "body-presence";
//
// if (BodyPresenceSensor) {
//     // console.log("This device has a BodyPresenceSensor!");
//     const bodyPresence = new BodyPresenceSensor();
//     bodyPresence.addEventListener("reading", () => {
//         console.log(`Device ${bodyPresence.present ? '' : 'not'} on the user's body.`);
//     });
//     bodyPresence.start();
// }

