import document from "document";
import { preferences } from "user-settings";
import { units } from "user-settings";
import { user } from "user-profile";
import * as fs from "fs";
import * as messaging from "messaging";
import { me as appbit } from "appbit";
import { me as device } from "device";
import { locale } from "user-settings";
import { gettext } from "i18n";

import * as bm from "./bm.js";
import * as date from "./date.js"
import * as battery from "./battery.js"
import * as time from "./time.js"
import * as hr from "./hr.js"
import * as activity from "./activity.js"
import * as state from "./state.js"
import * as torch from "./torch.js"

// Messaging
import {send} from "./transport";

// SETTINGS
export const SETTINGS_TYPE = "cbor";
export const SETTINGS_FILE = "settingsV1.cbor";
export let root = document.getElementById('root');
export let backgroundEl = document.getElementById('background');
export let noSettingsEl = document.getElementById('noSettings');
export let noSettingsTextEl = document.getElementById('noSettingsText');
export let settings = loadSettings();

export function applySettings() {
  const noSettingsData = {
    dataType: "error",
    key: "settings",
    value: "No settings loaded",
    timestamp: new Date().getTime()
  };

  if (!loadSettings) {
    console.log("No settings loaded");
    send(noSettingsData);
    return;
  }
  
  if(!settings) {
    console.log("No settings loaded");
    send(noSettingsData);
    return;
  }
  
  try {
    if (settings.hasOwnProperty("distanceUnit") && settings["distanceUnit"]) {
      activity.distanceUnitSet(settings["distanceUnit"]);
    } else {
      activity.distanceUnitSet("auto");
    }
            
    if (settings.hasOwnProperty("dateFormat") && settings["dateFormat"]) {
      date.setDateFormat(settings["dateFormat"]); 
    } else {
      date.setDateFormat("dd mmmm yy"); 
    }
            
    if (settings.hasOwnProperty("timeFormat") && settings["timeFormat"]) {
      time.setTimeFormat(settings["timeFormat"]); 
    } else {
      time.setTimeFormat("auto");
    } 
    
    if(settings.hasOwnProperty("showTime"))
    {
      if (settings.hasOwnProperty("isAmPm")) {
        time.setIsAmPm(!!settings["isAmPm"] && !!settings["showTime"]); 
      } else {
        time.setIsAmPm(!!settings["showTime"]);
      } 
    }
    else
    {
      if (settings.hasOwnProperty("isAmPm")) {
        time.setIsAmPm(!!settings["isAmPm"]); 
      } else {
        time.setIsAmPm(true);
      } 
    } 
    
    if(settings.hasOwnProperty("showTime"))
    {
      if (settings.hasOwnProperty("showSeconds")) {
        time.setShowSeconds(!!settings["showSeconds"] && !!settings["showTime"]); 
      } else {
        time.setShowSeconds(!!settings["showTime"]);
      } 
    }
    else
    {
      if (settings.hasOwnProperty("showSeconds")) {
        time.setShowSeconds(!!settings["showSeconds"]); 
      } else {
        time.setShowSeconds(true);
      } 
    }
    
    if(settings.hasOwnProperty("showTime"))
    {
      if (settings.hasOwnProperty("flashDots")) {
        time.setFlashDots(!!settings["flashDots"] && !!settings["showTime"]); 
      } else {
        time.setFlashDots(!!settings["showTime"]);
      } 
    }
    else
    {
      if (settings.hasOwnProperty("flashDots")) {
        time.setFlashDots(!!settings["flashDots"]); 
      } else {
        time.setFlashDots(false);
      } 
    }
    
    if (settings.hasOwnProperty("showLeadingZero")) {
      time.setShowLeadingZero(!!settings["showLeadingZero"]); 
    } else {
      time.setShowLeadingZero(true);
    } 
    
    if (settings.hasOwnProperty("heartRateZoneVis")) {
      hr.setHrZoneVis(!!settings["heartRateZoneVis"]); 
    } else {
      hr.setHrZoneVis(true);
    }

    if (settings.hasOwnProperty("torchEnabled")) {
      torch.setEnabled(!!settings["torchEnabled"]); 
    } else {
      torch.setEnabled(false);
    } 
    
    if (settings.hasOwnProperty("torchAutoOff")) {
      torch.setAutoOff(settings["torchAutoOff"]); 
    } else {
      torch.setAutoOff(-1);
    } 
    
    if (settings.hasOwnProperty("BMIVis")) {
      bm.setBMIVis(!!settings["BMIVis"]); 
    } else {
      bm.setBMIVis(true);
    } 
    
    if (settings.hasOwnProperty("BMRVis")) {
      bm.setBMRVis(!!settings["BMRVis"]); 
    } else {
      bm.setBMRVis(true);
    } 
        
    if (settings.hasOwnProperty("timeColour") && settings["timeColour"]) {      
      time.timeHourEl.style.fill = settings["timeColour"];
      time.timeColonEl.style.fill = settings["timeColour"];
      time.timeMinuteEl.style.fill = settings["timeColour"];
      time.timeSecEl.style.fill = settings["timeColour"];
      time.timeAmPmEl.style.fill = settings["timeColour"];
    } else {
      time.timeHourEl.style.fill = "white";
      time.timeColonEl.style.fill = "white";
      time.timeMinuteEl.style.fill = "white";
      time.timeSecEl.style.fill = "white";
      time.timeAmPmEl.style.fill = "white";
    }
    
    if (settings.hasOwnProperty("showTime")) {      
      time.timeHourEl.style.display = (!!settings["showTime"] ? "inline" : "none");
      time.timeColonEl.style.display = (!!settings["showTime"] ? "inline" : "none");
      time.timeMinuteEl.style.display = (!!settings["showTime"] ? "inline" : "none");
    } else {
      time.timeHourEl.style.display = "inline";
      time.timeColonEl.style.display = "inline";
      time.timeMinuteEl.style.display = "inline";
    }

    if (settings.hasOwnProperty("dateColour") && settings["dateColour"]) {
      date.dateEl.style.fill = settings["dateColour"];
      date.dayEl.style.fill = settings["dateColour"];      
    } else {
      date.dateEl.style.fill = "#969696";
      date.dayEl.style.fill = "#969696";  
    }   
        
    if (settings.hasOwnProperty("showDate")) {      
      date.dateEl.style.display = (!!settings["showDate"] ? "inline" : "none");
      date.dayEl.style.display = (!!settings["showDate"] ? "inline" : "none");
    } else {
      date.dateEl.style.display = "inline";
      date.dayEl.style.display = "inline";
    }

    if(settings.hasOwnProperty("showHeartRate"))
    {
      if (settings.hasOwnProperty("isHeartbeatAnimation")) {
        hr.isHeartbeatAnimationSet(!!settings["isHeartbeatAnimation"] && !!settings["showHeartRate"]); 
      } else {
        hr.isHeartbeatAnimationSet(!!settings["showHeartRate"]);
      } 
    }
    else
    {
      if (settings.hasOwnProperty("isHeartbeatAnimation")) {
        hr.isHeartbeatAnimationSet(!!settings["isHeartbeatAnimation"]); 
      } else {
        hr.isHeartbeatAnimationSet(true);
      } 
    }
    
    if (settings.hasOwnProperty("backgroundColour") && settings["backgroundColour"]) {
      backgroundEl.style.fill = settings["backgroundColour"];     
    } else {
      backgroundEl.style.fill = "black"; 
    }

    if (settings.hasOwnProperty("heartColour") && settings["heartColour"]) {
      hr.hrIconDiastoleEl.style.fill = settings["heartColour"];
      hr.hrIconSystoleEl.style.fill = settings["heartColour"];         
    } else {
      hr.hrIconDiastoleEl.style.fill = "#FA4D61";
      hr.hrIconSystoleEl.style.fill = "#FA4D61";
    }
    
    if (settings.hasOwnProperty("heartRateColour") && settings["heartRateColour"]) {
      hr.hrCountEl.style.fill = settings["heartRateColour"];
      hr.hrZoneEl.style.fill = settings["heartRateColour"];
    } else {
      hr.hrCountEl.style.fill = "#969696";
      hr.hrZoneEl.style.fill = "#969696";
    }   
        
    if (settings.hasOwnProperty("showHeartRate")) {      
      hr.hrIconDiastoleEl.style.display = (!!settings["showHeartRate"] ? "inline" : "none");
      hr.hrIconSystoleEl.style.display = (!!settings["showHeartRate"] ? "inline" : "none");
      hr.hrCountEl.style.display = (!!settings["showHeartRate"] ? "inline" : "none");
    } else {
      hr.hrIconDiastoleEl.style.display = "inline";
      hr.hrIconSystoleEl.style.display = "inline";
      hr.hrCountEl.style.display = "inline";
    }
    
    if(settings.hasOwnProperty("showHeartRate"))
    {
      if (settings.hasOwnProperty("heartRateZoneVis")) {
        hr.setHrZoneVis(!!settings["heartRateZoneVis"] && !!settings["showHeartRate"]); 
      } else {
        hr.setHrZoneVis(!!settings["showHeartRate"]);
      } 
    }
    else
    {
      if (settings.hasOwnProperty("heartRateZoneVis")) {
        hr.setHrZoneVis(!!settings["heartRateZoneVis"]); 
      } else {
        hr.setHrZoneVis(true);
      } 
    }
    
    if (settings.hasOwnProperty("showBatteryPercent")) {
      battery.setShowBatteryPercent(!!settings["showBatteryPercent"]); 
    } else {
      battery.setShowBatteryPercent(true);
    } 
    
    if (settings.hasOwnProperty("showBatteryBar")) {
      battery.setShowBatteryBar(!!settings["showBatteryBar"]); 
    } else {
      battery.setShowBatteryBar(false);
    } 
        
    if (settings.hasOwnProperty("battery0Colour") && settings["battery0Colour"]) {
      battery.setColour0(settings["battery0Colour"]);
    } else {
      battery.setColour0("#FF0000");
    } 
        
    if (settings.hasOwnProperty("battery25Colour") && settings["battery25Colour"]) {
      battery.setColour25(settings["battery25Colour"]);
    } else {
      battery.setColour25("lightseagreen");
    }
        
    if (settings.hasOwnProperty("battery50Colour") && settings["battery50Colour"]) {
      battery.setColour50(settings["battery50Colour"]);
    } else {
      battery.setColour50("steelblue");
    }
        
    if (settings.hasOwnProperty("battery75Colour") && settings["battery75Colour"]) {
      battery.setColour75(settings["battery75Colour"]);
    } else {
      battery.setColour75("#00FF00");
    }
        
    if (settings.hasOwnProperty("batteryBackgroundColour") && settings["batteryBackgroundColour"]) {
      battery.batteryLineBack.style.fill = settings["batteryBackgroundColour"];
    } else {
      battery.batteryLineBack.style.fill = "#A0A0A0"
    }

    if (settings.hasOwnProperty("batteryBarAutoOff")) {
      torch.setAutoOff(settings["batteryBarAutoOff"]);
    } else {
      torch.setAutoOff(-1);
    }

    if (settings.hasOwnProperty("bmColour") && settings["bmColour"]) {
      bm.bmrZoneEl.style.fill = settings["bmColour"];
      bm.bmiZoneEl.style.fill = settings["bmColour"]; 
      
    } else {
      bm.bmrZoneEl.style.fill = "white";
      bm.bmiZoneEl.style.fill = "white"; 
    } 
    
    var progressBarType = "bars";
    if (settings.hasOwnProperty("progressBars") && settings["progressBars"]) {
      progressBarType = settings["progressBars"];
    }
    
    for (var i=0; i < activity.goalTypes.length; i++) {
      var goalType = activity.goalTypes[i];      
      var goalTypeColourProp = goalType + "Colour";
      if (settings.hasOwnProperty(goalTypeColourProp) && settings[goalTypeColourProp]) {
        activity.progressEls[i].count.style.fill = settings[goalTypeColourProp];        
        activity.progressEls[i].icon.style.fill = settings[goalTypeColourProp];
        activity.progressEls[i].line.style.fill = settings[goalTypeColourProp];
        activity.progressEls[i].countArc.style.fill = settings[goalTypeColourProp];        
        activity.progressEls[i].iconArc.style.fill = settings[goalTypeColourProp];
        activity.progressEls[i].lineArc.style.fill = settings[goalTypeColourProp];
      } else {
        activity.progressEls[i].count.style.fill = "white";        
        activity.progressEls[i].icon.style.fill = "white";
        activity.progressEls[i].line.style.fill = "white"; 
        activity.progressEls[i].countArc.style.fill = "white";        
        activity.progressEls[i].iconArc.style.fill = "white";
        activity.progressEls[i].lineArc.style.fill = "white";
      }

      if (settings.hasOwnProperty("progressBackgroundColour") && settings["progressBackgroundColour"]) {
        activity.progressEls[i].lineBack.style.fill = settings["progressBackgroundColour"]; 
        activity.progressEls[i].lineBackArc.style.fill = settings["progressBackgroundColour"];
      } else {
        activity.progressEls[i].lineBack.style.fill = "#A0A0A0";
        activity.progressEls[i].lineBackArc.style.fill = "#A0A0A0";
      }
      
      if(progressBarType == "bars") {
        activity.progressEls[i].line.style.display = "inline";
        activity.progressEls[i].lineBack.style.display = "inline";
        activity.progressEls[i].lineArc.style.display = "none";
        activity.progressEls[i].lineBackArc.style.display = "none"; 
      } else if(progressBarType == "arc") {
        activity.progressEls[i].line.style.display = "none";
        activity.progressEls[i].lineBack.style.display = "none";
        activity.progressEls[i].lineArc.style.display = "inline";
        activity.progressEls[i].lineBackArc.style.display = "inline"; 
      } else {
        activity.progressEls[i].line.style.display = "none";
        activity.progressEls[i].lineBack.style.display = "none";
        activity.progressEls[i].lineArc.style.display = "none";
        activity.progressEls[i].lineBackArc.style.display = "none"; 
      }
    }
    
    // var positions = ["TL","BL","TM","MM","BM","TR","BR"];
    var positions = ["TL","BL","TR","BR"];
    
    for (var i=0; i < positions.length; i++) {
      var position = positions[i];  
            
      //Remove item from position
      if(bm.position == position) {
        setStatsLocation(bm.bmEl, "NONE")
        bm.setPosition("NONE");
      }

      for (var x=0; x < activity.goalTypes.length; x++) {
         if(activity.progressEls[x].position == position) {
           setStatsLocation(activity.progressEls[x].container, "NONE");
           setStatsLocation(activity.progressEls[x].containerArc, "NONE");
           activity.progressEls[x].position = "NONE";
         }
      }
      
      var positionProp = "Stats" + position;
      var stat = "";
      if (settings.hasOwnProperty(positionProp) && settings[positionProp]) {
        stat = settings[positionProp];
      } else {
        if(position == "TL"){
          stat = "steps";
        } else if(position == "BL") {
          stat = "distance";
        }
        // else if(position == "TM"){
        //   stat = "BMIBMR";
        // } else if(position == "MM"){
        //   stat = "calories";
        // }
        else if(position == "TR"){
          stat = "elevationGain";
        } else if(position == "BR"){
          stat = "activeMinutes";
        } 
      }
        
      if(stat == "BMIBMR") {        
        bm.setPosition(position);
        setStatsLocation(bm.bmEl, position);  
      } else {
        for (var x=0; x < activity.goalTypes.length; x++) {
          if(activity.goalTypes[x] == stat) {
            activity.progressEls[x].position = position;
            if(progressBarType == "bars") {
              setStatsLocation(activity.progressEls[x].container, position);
              setStatsLocation(activity.progressEls[x].containerArc, "NONE");
            } else if(progressBarType == "arc") {
              setStatsLocation(activity.progressEls[x].container, "NONE");
              setStatsLocation(activity.progressEls[x].containerArc, position);
            }
          }
        }
      }
    }
    
    activity.resetProgressPrevState();
    state.reApplyState();
  } catch (ex) {
    const errorData = {
      dataType: "error",
      key: "exception",
      value: ex,
      timestamp: new Date().getTime()
    };
    console.error(ex);
    send(errorData);
  }
}

applySettings();

export function setStatsLocation(element, location)
{
    var maxWidth = device.screen.width;
    var maxHeight = device.screen.height;
    if(location == "TL")
    {
      element.style.display = "inline";
      element.x = (20 * maxWidth) / 100;
      element.y = maxHeight - 115
      return;
    }
  
    if(location == "BL")
    {
      element.style.display = "inline";
      element.x = (20 * maxWidth) / 100;
      element.y = maxHeight - 75
      return;
    }
  
    // if(location == "TM")
    // {
    //   element.style.display = "inline";
    //   element.x = (36 * maxWidth) / 100;
    //   element.y = maxHeight - 115;
    //   return;
    // }
    //
    // if(location == "MM")
    // {
    //   element.style.display = "inline";
    //   element.x = (36 * maxWidth) / 100;
    //   element.y = maxHeight - 75;
    //   return;
    // }
    //
    // if(location == "BM")
    // {
    //   element.style.display = "inline";
    //   element.x = (36 * maxWidth) / 100;
    //   element.y = maxHeight - 35;
    //   return;
    // }
  
    if(location == "TR")
    {
      element.style.display = "inline";
      element.x = (55 * maxWidth) / 100;
      element.y = maxHeight - 115;
      return;
    }
  
    if(location == "BR")
    {
      element.style.display = "inline";
      element.x = (55 * maxWidth) / 100;
      element.y = maxHeight - 75;
      return;
    }
  
    if(location == "NONE")
    {
      element.style.display = "none";
      return;
    }
}

export function onsettingschange(data) {
  if (!data) {
   return;
  }
  settings = data;
  applySettings();
  saveSettings();
  time.drawTime(new Date());
}

messaging.peerSocket.addEventListener("message", function(evt) {
  if(evt.data.dataType === "settingChange")
  {
    if (!settings) {
      settings = {};
    }

    var newValue = "";
    if(typeof evt.data.value === "object" && evt.data.value.values !== undefined) {
      // console.log(evt.data.value.values[0].value)
      newValue = evt.data.value.values[0].value; 
    } else if (evt.data.value.hasOwnProperty('name')) {
        newValue = evt.data.value.name;
        console.log('JAMAN');
    } else {
      console.log(JSON.stringify(evt.data.value));
      newValue = evt.data.value;
    }
    // console.log("New value",newValue)
    
    if(settings[evt.data.key] != newValue)
    {
      const settingUpdate = {
        dataType: "setting_update",
        key: evt.data.key,
        value: newValue,
        timestamp: new Date().getTime()
      };
      console.log(`Setting update - key:${evt.data.key} value:${newValue}`);
      send(settingUpdate);
      settings[evt.data.key] = newValue
    } else {
      return;
    }  
    
    onsettingschange(settings);
  }  
})

appbit.addEventListener("unload", saveSettings);

export function loadSettings() {
  try {
    var fileContent = fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
    if(fileContent === null || Object.keys(fileContent).length === 0)
    {
      return {};
    }
    return fileContent;
  } catch (ex) {
    console.log(ex);
    return {};
  }
}

// Save settings to the filesystem
export function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}

