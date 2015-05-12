var dataReadings = {
  cgm: [115,116,110,105,105,105,142,170,183,196,216,220,219,233,232,231,237,233,235,230,226,226,219,206,202,191,181,178,168,158,154,146,140,129,113,105,95	,101,95	,94	,90	,89	,87	,86,81,79	,77	,74	,73	,75	,77	,74	,74	,72	,74	,76	,81	,85	,84	,97	,98	,109,110,120,123,127,130,131,129,128,127,125,126,123,123,122,120,120,119,116,112,109,106,105,102,99	,98	,96	,95	,94	,93	,93	,93	,94	,96	,99	,99	,101,100,100,99	,98	,97	,97	,95	,93	,92	,93	,94	,94	,97	,97	,98	,100,101,103,103,104,104,104,104,106,105,102,108,108,106,108,110,110,112,112,114,116,115,116,116,117,115,117,115,116,117,118,117,118,116,116,118,120,119,120,119,120,120,117,117,118,124,133,161,184,193,214,216,238,233,244,246,240,240,240,246,246,264,237,231,225,221,219,215,208,206,199,190,189,169,158,156,152,142,137,126,123,117,110,104,98	,93	,91	,85	,82	,81	,74	,74	,67	,66	,67	,69	,70	,73	,74	,79	,78	,79	,78	,77	,77	,76	,80	,83	,108,131,140,165,192,221,237,239,239,241,231,237,229,220,218,212,206,199,188,166,159,151,145,136,128,123,113,105,102,97	,94	,90	,90	,88	,90	,90	,86	,84	,81	,80	,78	,78	,79	,81	,83	,79	,82	,85	,84	,82	,82	,77	,81	,81	,82	,82	,85	,82	,85	,85	,87	,88	,90	,93	,94	,94	,92	,115],
  bg: [{value:100,index:216}, {value:200, index:156}, {value:80, index:0}],
  insulin: [0.03,0.03,0.03,0.03,0.03,0.03,0.99,0.63,0.09,0.24,0.78,0.18,0.03,0.69,0.06,0.06,0.42,0.06,0.3,0.03,0.06,0.21,0.03,0,0.06,0,0,0.06,0,0,0.06,0.03,0.03,0,0,0,0,0.06,0.03,0.06,0.03,0.06,0.06,0.06,0.03,0,0,0,0,0,0,0,0,0,0,0,0.06,0.03,0.03,0.06,0.06,0.21,0.06,0.33,0.06,0.12,0.06,0.06,0.06,0.06,0.06,0.06,0.12,0.06,0.06,0.06,0.06,0.06,0.06,0.06,0.03,0.03,0.03,0.06,0.03,0.03,0.06,0.03,0.06,0.06,0.03,0.06,0.06,0.06,0.03,0.06,0.06,0.03,0.06,0.06,0.03,0.03,0.03,0.06,0.03,0.03,0.03,0.06,0.03,0.06,0.03,0.06,0.03,0.06,0.06,0.09,0.03,0.06,0.03,0.03,0.06,0.12,0.03,0.03,0.21,0.03,0.03,0.06,0.03,0.03,0.06,0.03,0.06,0.03,0.03,0.06,0.03,0.06,0.03,0.12,0.03,0.03,0.06,0.06,0.03,0.06,0.03,0.03,0.06,0.03,0.03,0.06,0.03,0.09,0.03,0.03,0.06,0.09,0.24,0.42,1.29,1.08,0.24,0.66,0.06,0.93,0.03,0.42,0.06,0.03,0.06,0.12,0.42,0.24,0.45,0,0.03,0.06,0.06,0.09,0.06,0.03,0.09,0.06,0,0.12,0,0,0.12,0.09,0,0.06,0,0.09,0.03,0.03,0.03,0.03,0.03,0.06,0.03,0.06,0.06,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.06,0.75,0.75,0.18,1.02,1.35,1.59,0.9,0.09,0.09,0.09,0,0.24,0.03,0,0.09,0.06,0.06,0.03,0,0,0.06,0.03,0.06,0,0.03,0.06,0,0.03,0.06,0.06,0.06,0.06,0.09,0.06,0.09,0.06,0.06,0.06,0.06,0,0,0,0,0.06,0.06,0,0.06,0.06,0.06,0.06,0.06,0,0.06,0.06,0.09,0.06,0.06,0.03,0.06,0.06,0.09,0.06,0.06,0.06,0.09,0.06,0.06,0.9],
  glucagon: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2.85,3,0,0.6,0,0,0,0.6,0,0,0,3.15,0,1.05,1.8,0.45,0,0,2.55,0,1.8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4.95,2.85,0,0,0,0,2.85,0,0,0,0,0,0.6,0,2.7,0,0,4.35,0,3.9,0,0,0,1.2,0,0,0,1.35,0,1.05,0.9,0,1.35,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4.95,0,0,0,0,0,0,0.3,0.9,0,0.6,0,1.2,0,0,0,0,2.25,0,1.5,0,1.2,0,0,0,0,3,0,0,0,1.05,0,3,0,0,0,0,0,1.95,0,0,0,0,0,0,0,0,0,0],
  carb: [{value:1,index:216}, {value:2, index:156}, {value:3, index:9}]
};

var currentReadings = {
};

var cutData = function(offset, hours) {
  currentReadings = {
    cgm: _.clone(dataReadings.cgm),
    bg: _.clone(dataReadings.bg),
    insulin: _.clone(dataReadings.insulin),
    glucagon: _.clone(dataReadings.glucagon),
    carb: _.clone(dataReadings.carb)
  };

  if(!hours) {
    hours = offset;
    offset = 0;
  }

  var bg = [];

  for(var i in currentReadings.bg) {
    var reading = currentReadings.bg[i];

    if(reading.index >= offset && reading.index < (offset + hours * 20)) {
      bg.push(reading);
    }
  }

  var carb = [];

  for(var i in currentReadings.carb) {
    var reading = currentReadings.carb[i];

    if(reading.index >= offset && reading.index < (offset + hours * 20)) {
      carb.push(reading);
    }
  }

  currentReadings.cgm = currentReadings.cgm.splice(offset, hours * 20);

  if (padded) {
    padded = false;
    padWithOffline();
  }


  currentReadings = {
    cgm: currentReadings.cgm,
    insulin: currentReadings.insulin.splice(offset, hours * 20),
    glucagon: currentReadings.glucagon.splice(offset, hours * 20),
    carb: carb,
    bg: bg
  }

  if (appended) {
    appended = false;
    appendReading(appendedReading);
  }
};

var padded = false;

var padWithOffline = function(off) {
  if (off) {
    padded = false;
    return;
  }

  if (padded) {
    return;
  }
  padded = true;
  // add :hours amount of readings to arrays
  var zeroes = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];

  currentReadings.cgm =  $.merge(currentReadings.cgm.splice(0, currentReadings.cgm.length - zeroes.length), zeroes);

  if (typeof updateCurrentCGM != 'undefined') {
    updateCurrentCGM();
  }

};

var turnOnline = function() {
  padded = false;
  refreshGraph();
};

var appended = false;
var appendedReading = {};

var appendReading = function(reading) {
  appendedReading = reading;

  if (appended) {
    return;
  }
  appended = true;
  var index = (options.hours * 20) - 1;
  currentReadings.insulin[index] = 0;
  currentReadings.glucagon[index] = 0;

  if (reading.glucagon) {
    currentReadings.glucagon[index] = reading.glucagon;
  }

  if (reading.insulin) {
    currentReadings.insulin[index] = parseInt(reading.insulin);
  }

  if (reading.carbs) {
    currentReadings.carb.push({
      value: reading.carbs,
      index: index
    });
  }

  if (reading.bg) {
    currentReadings.bg.push({
      value: reading.bg,
      index: index
    });
  };

  console.log('appendReading',reading);
};
