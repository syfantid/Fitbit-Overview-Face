import document from "document";
import display from "display";

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

