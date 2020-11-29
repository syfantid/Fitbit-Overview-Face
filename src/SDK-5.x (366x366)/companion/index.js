import { settingsStorage } from "settings";
import * as messaging from "messaging";
import { me } from "companion";
import { device } from "peer";
import { localStorage } from 'local-storage';

import { onReceive } from './transport';
import asap from "fitbit-asap/companion"


// Settings have been changed
settingsStorage.onchange = function(evt) {
  sendSettingValue(evt.key, evt.newValue);
}

//Message socket error
messaging.peerSocket.onerror = function(evt) {
  sendAllSettings();
}

messaging.peerSocket.onopen = function(evt) {
  setDefaultSettings();
  setSetting("deviceModelId", device.modelId);
  sendAllSettings();
}

function sendAllSettings() {
  console.log("Sending all settings");
  for (var i=0; i < settingsStorage.length; i++) {  
    var key = settingsStorage.key(i);
    var value = settingsStorage.getItem(key);
    sendSettingValue(key, value);
  }
}

function setDefaultSettings() {
  console.log("Set Default Settings");
  setDefaultSetting("distanceUnit", {"values":[{"value":"auto","name":"Automatic (Use Fitbit Setting)"}],"selected":[0]});
  setDefaultSetting("dateFormat", {"values":[{"value":"dd mmmm yyyy","name":"dd mmmm yyyy"}],"selected":[11]});
  setDefaultSetting("timeFormat", {"values":[{"value":"auto","name":"Automatic (Use Fitbit Setting)"}],"selected":[0]});
  setDefaultSetting("showHeartRate",true);
  setDefaultSetting("isHeartbeatAnimation",true);
  setDefaultSetting("heartRateZoneVis",true);
  setDefaultSetting("showTime",true);
  setDefaultSetting("isAmPm",true);
  setDefaultSetting("showSeconds",false);
  setDefaultSetting("showLeadingZero",true);
  setDefaultSetting("flashDots",false);
  setDefaultSetting("showDate",true);

  // steps: 2, distance: 3, BMIBMR: 1, calories: 5, elevationGain: 4, Active Zone Minites: 6
  setDefaultSetting("StatsTL",{"values":[{"value":"steps","name":"Steps"}],"selected":[2]});
  setDefaultSetting("StatsBL",{"values":[{"value":"elevationGain","name":"Floors"}],"selected":[4]});
  // setDefaultSetting("StatsBL",{"values":[{"value":"elevationGain","name":"Floors"}],"selected":[4]}); // elevation gain original
  // setDefaultSetting("StatsBL",{"values":[{"value":"distance","name":"Distance"}],"selected":[3]}); // original
  // setDefaultSetting("StatsTM",{"values":[{"value":"NONE","name":"Empty"}],"selected":[0]});
  // setDefaultSetting("StatsMM",{"values":[{"value":"NONE","name":"Empty"}],"selected":[0]});
  // setDefaultSetting("StatsBM",{"values":[{"value":"NONE","name":"Empty"}],"selected":[0]});
  // setDefaultSetting("StatsMM",{"values":[{"value":"calories","name":"Calories"}],"selected":[5]}); // calories original
  // setDefaultSetting("StatsBM",{"values":[{"value":"BMIBMR","name":"BMR/BMI"}],"selected":[1]}); // BMI original
  // setDefaultSetting("StatsTR",{"values":[{"value":"elevationGain","name":"Floors"}],"selected":[4]}); // original
  // setDefaultSetting("StatsTR",{"values":[{"value":"calories","name":"Calories"}],"selected":[5]});
  setDefaultSetting("StatsTR",{"values":[{"value":"calories","name":"Calories"}],"selected":[5]});
  setDefaultSetting("StatsBR",{"values":[{"value":"activeMinutes","name":"Active Zone Minutes"}],"selected":[6]});
  setDefaultSetting("BMRVis",false);
  setDefaultSetting("BMIVis",false);
  setDefaultSetting("progressBars",{"values":[{"value":"bars","name":"Bars"}],"selected":[1]});
  setDefaultSetting("showBatteryPercent",true);
  setDefaultSetting("showBatteryBar",false);
  setDefaultSetting("torchEnabled",false);
  setDefaultSetting("timeColour","white");
  setDefaultSetting("dateColour","white");
  setDefaultSetting("stepsColour","lightseagreen");
  setDefaultSetting("distanceColour","darkorchid");
  setDefaultSetting("elevationGainColour","slateblue");
  setDefaultSetting("caloriesColour","mediumvioletred");
  setDefaultSetting("bmColour","darkturquoise");
  setDefaultSetting("heartColour","#FA4D61");
  setDefaultSetting("heartRateColour","white");
  setDefaultSetting("activeMinutesColour","#0652DD");
  setDefaultSetting("progressBackgroundColour","#A0A0A0");
  setDefaultSetting("battery0Colour","#A0A0A0");
  setDefaultSetting("battery25Colour","#A0A0A0");
  setDefaultSetting("battery50Colour","#A0A0A0");
  setDefaultSetting("battery75Colour","#A0A0A0");
  setDefaultSetting("batteryBackgroundColour","#A0A0A0");
  setDefaultSetting("backgroundColour","black");
}

function setDefaultSetting(key, value) {
  let existingValue = settingsStorage.getItem(key);
  if (existingValue == null) {
    setSetting(key, value);
  } else {
    console.log(`Companion Existing Setting - key:${key} existingValue:${existingValue}`);
  }
}

function setSetting(key, value) {
  let jsonValue = JSON.stringify(value)
  console.log(`Companion Set - key:${key} val:${jsonValue}`);
  settingsStorage.setItem(key, jsonValue);
}

function sendSettingValue(key, val) {
  if (val) {
    var data = {
      dataType: "settingChange",
      key: key,
      value: JSON.parse(val)
    };
    
    // If we have a MessageSocket, send the data to the device
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send(data);
    } else {
      console.log(`No peerSocket connection to send updated ${key}`);
    }
  }
}

asap.onmessage = message => {
  if (message) {
    onReceive(message);
  }
}
