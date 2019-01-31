import document from "document";
import * as util from "../common/utils";
import { preferences } from "user-settings";
import { me as device } from "device";

export let root = document.getElementById('root')
export const deviceType = device.modelName.toLowerCase()
export let timedeviceType = deviceType + '-time'
export let seconddeviceType = deviceType + '-second'
export let amPmdeviceType = deviceType + '-am-pm'
export let timeEl = document.getElementById(timedeviceType);
export let secEl = document.getElementById(seconddeviceType);
export let amPmEl = document.getElementById(amPmdeviceType);
export let isAmPm = false;
export let showSeconds = true;
export let showLeadingZero = true;
export function setIsAmPm(val) { isAmPm = val}
export function setShowSeconds(val) { showSeconds = val }
export function setShowLeadingZero(val) { showLeadingZero = val }

//Time Draw - START
export function drawTime(now) {
  var hours = setHours(now);
  let mins = setMinutes(now);
  let secs = setSeconds(now);
  timeEl.text = `${hours}:${mins}`;
  secEl.text = `${secs}`;  
}

export function setSeconds(now){
  if (showSeconds)
  {
    secEl.style.display= 'inline';
    return util.zeroPad(now.getSeconds());    
  }
  else
  {
      secEl.style.display= 'none';
  }  
}

export function setMinutes(now){
  return util.zeroPad(now.getMinutes());
}

export function setHours(now) {
  var hours = now.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format    
    if (isAmPm) {
      if (hours < 12) {
        amPmEl.text = " AM";
      } else {
        amPmEl.text = " PM";        
      }
      amPmEl.style.display= 'inline';
    }
    else
    {
      amPmEl.style.display= 'none';
    }
    
    if (hours === 0)
    {
      hours = 12;  
    } else if (hours > 12) {
      hours = hours - 12;
    }
  } else {
    // 24h format
    amPmEl.style.display= 'none';
  }
  
  if(showLeadingZero)
  {
      return util.zeroPad(hours);
  }
  else
  {
    return hours;
  }
}
//Time Draw - END