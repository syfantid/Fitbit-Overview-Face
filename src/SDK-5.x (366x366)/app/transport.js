import asap from "fitbit-asap/app";

export function send(event) {
    asap.send(event, {'timeout': 604800000});
}
