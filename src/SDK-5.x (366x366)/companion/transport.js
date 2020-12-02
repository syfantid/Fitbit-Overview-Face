import {localStorage} from 'local-storage';
import {me as companion} from "companion";
import { settingsStorage } from "settings";


const url = 'https://httpbin.org/post';
// const url = 'https://httpbin.org/status/500';
const checkUrl = 'https://httpbin.org/status/200';
// const checkUrl = 'https://httpbin.org/status/500';
const token = 'RANDOMTOKEN';

const trigger = 5;
let maxNumber = 0;

const MINUTE = 1000 * 60;
companion.wakeInterval = 5 * MINUTE;

companion.onwakeinterval = evt => {
    console.log("Companion was already awake - onwakeinterval");
}

if (companion.launchReasons.wokenUp) {
    // The companion started due to a periodic timer
    console.log("Started due to wake interval!");
}


export function onReceive(event, noTrigger = false) {
    // TODO: Check if this function is thread safe (with the numbering of the last item).

    // Load last entry number from local storage.
    const localMaxNumber = parseInt(localStorage.getItem('queue_last'));
    // console.log(localMaxNumber);
    if (isNaN(localMaxNumber)) {
        localStorage.setItem('queue_last', 0);
        maxNumber = 0;
        // console.log('Local queue maxNumber set to 0!');
    } else {
        maxNumber = localMaxNumber;
        // console.log('Loaded queue maxNumber: ' + maxNumber);
    }

    // Append to local storage and index.
    const key = 'queue_' + maxNumber;
    // console.log('key', key, 'value', JSON.stringify(event));
    localStorage.setItem(key, JSON.stringify(event));

    maxNumber += 1;
    localStorage.setItem('queue_last', maxNumber);
    // Check if trigger has been reached.
    if (maxNumber % trigger === 0 && ! noTrigger && companion.permissions.granted("access_internet")) {
        fetch(checkUrl, {
            method: 'GET',
            cache: 'no-cache',
        }).then((response) => {
            if (! response.ok) {
                console.log('Not sending queue, internet seems down!');
                return;
            }
            console.log('Internet seems Okay, sending queue to server...');
            sendQueue();
        }).catch((err) => {
            console.error('Internet seems down: ', err);
        });
    }
}

function preparePayload() {
    const payload = {
        count: 0,
        participant_id: settingsStorage.getItem("participantID"),
        items: []
    };

    // Loop over items.
    for (let i = 0; i < maxNumber; i++) {
        // console.log('read key:', 'queue_'+i);
        let item = {error: true};
        // console.log(JSON.parse(localStorage.getItem('queue_' + i)));
        try {
            item = JSON.parse(localStorage.getItem('queue_' + i));
        } catch (error) {
            console.error('Error in parsing JSON from queue!', error);
            continue;
        }

        payload.items.push(item);
        payload.count++;

        localStorage.removeItem('queue_' + i);
    }
    return payload;
}

export function sendQueue() {
    console.log('SEND NOW');
    let payload = preparePayload();

    // Reset
    localStorage.setItem('queue_last', 0);
    maxNumber = 0;

    function reQueue() {
        for (let item of payload.items) {
            onReceive(item, true);
        }
    }

    // Send to server.
    fetch(url, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(payload)
    }).then((response) => {
        if (! response.ok) {
            reQueue();
            return;
        }
        // Cool!
        console.log('Send okay!!');
    }).catch((error) => {
        console.error('Error sending', error);
        reQueue();
    });
}
