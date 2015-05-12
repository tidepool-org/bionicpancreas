var parseParams = function(){return _.object(_.compact(_.map(window.location.search.slice(1).split('&'), function(item) {  if (item) return item.split('='); })));}

var socket = io(window.location.origin);

socket.on('connect', function(){
  console.log("connected!!!");

  socket.on('screen', function(url){
    console.log('screen event:', url);
    window.location = url;
  });
});

window.onerror = function(message, url, lineNumber) {
  //save error and send to server for example.
 $('body').html(message + ' ' + url + ' ' + lineNumber);
 $('body').css({display:'block',background:'blue'});
  return true;
};

var options = {
  width: 315,
  height: 343,
  hours: 6,
  size:'small',
  xPaddingLeft: 17,
  labelPadding:0,
  ticks: 1,
  background: '#cbcccb'
};

var defaultData = {
  battery: 10,
  cgmLife: 1,
  calibration: 420,
  insulin: 10,
  glucagon: 10,
  oclusion: 1,
  cgmTransmitterBatteryLow: 0,
  cgmOffline: 0,
  infusionSite: 2
};

$(function() {
  cutData(0, options.hours);
  // flash the screen to clear epaper pixel artifacts
  setTimeout(function() {
    $('body').css('display', 'block');
  }, 200);

  setInterval(function() {
    load(function(err, levels) {
      if(err) {
        console.log('error fetching levels from server');
        return;
      }

      update(levels);
    });
  }, 2000);

  load(function(err, levels) {
    if(err) {
      console.log('error fetching levels from server');
      return;
    }

    update(levels);

    if (typeof refreshGraph != 'undefined') {
      refreshGraph();
    }
  });
});


var screens = {
  batteryDeadSoon: '/alerts/battery',
  batteryDead: '/alerts/batterydead',
  cgmFinished: '/alerts/transmitterlow', //todo: missing image
  splash: '/splash',
  lock: '/lock',
  home: '/',
  childlock: '/locktest',
  calibrationNeeded: '/alerts/calibration',
  insulinFinished: '/alerts/insulin',
  glucagonFinished: '/alerts/glucagon',
  oclusion: '/alerts/oclusion',
  cgmTransmitterBatteryLow: '/alerts/transmitterlow'
};

var update = function(data) {
  if (data.cgmOffline) {
    data.cgmLife = 0;
    console.log('cgmOffline');
    padWithOffline();
  } else {
    padWithOffline(true);
  }

  /*battery*/
  $('.battery-level').css('height', data.battery/100 * 46);
  $('.battery-level').css('margin-top', 46 - (data.battery/100 * 46));

  // show battery alert
  if (data.battery < 20) {
    $('.battery-alert').show();
  } else {
    $('.battery-alert').hide();
  }

  $('.battery .line1').html(data.battery + '% remaining');

  /*cgmlife*/
  // compute cgm level height and set $('cgm-level')
  // if cgmOffline set level to zero
  $('.cgm-level').css('height', (data.cgmLife/14 * 25));
  $('.cgm-level').css('margin-top', 25 - (data.cgmLife/14 * 25));

  $('.cgm .line1').html(data.cgmLife + ' days remaining');

  if (data.cgmLife < 2 || data.cgmTransmitterBatteryLow || data.cgmOffline) {
    $('.cgm-alert').show();
  } else {
    $('.cgm-alert').hide();
  }

  if (data.cgmLife == 0) {
    $('.cgm .line1').html('offline');
  }

  if (data.cgmTransmitterBatteryLow) {
    $('.cgm .line1').html('transmitter battery low');
  }

  /*cgmCalibration*/
  // compute calibration level height and set $('calibration-level')
  $('.calibration-level').css('height', (data.calibration/720 * 19));
  //$('.calibration-level').css('margin-top', (data.calibration/720 * 19));

  if (data.calibration == 0) {
    $('.calibration-alert').show();
    $('.cgm .line2').html('calibration needed');
  } else {
    $('.calibration-alert').hide();

    var txt = '';
    if (data.calibration < 60) {
      txt = data.calibration + ' minutes';
    } else {
      txt = Math.round(data.calibration/60) + ' hours';
    }

    $('.cgm .line2').html('calibrate in ' + txt);
  }

  /*insulin*/
  // compute insulin level height and set $('insulin-level')
  $('.insulin-level').css('height', data.insulin/120 * 34);
  $('.insulin-level').css('margin-top', 34 - (data.insulin/120 * 34));

  if (data.insulin < 20) {
    $('.insulin-alert').show();
  } else {
    $('.insulin-alert').hide();
  }

  $('.insulin .line1').html(data.insulin + ' units left');

  /*glucagon*/
  // compute glucagon level height and set $('glucagon-level')
  $('.glucagon-level').css('height', data.glucagon/120 * 34);
  $('.glucagon-level').css('margin-top', 34 - (data.glucagon/120 * 34));

  if (data.glucagon < 20) {
    $('.glucagon-alert').show();
  } else {
    $('.glucagon-alert').hide();
  }

  $('.glucagon .line1').html(data.glucagon + ' units left');

  /*infusionSite*/
  $('.infusionSet-level').html(parseInt(data.infusionSite));
  $('.infusion .line1').html(data.infusionSite + ' days old');

  /*oclusion*/
  if(data.oclusion == 1) {
    $('.infusionSet-alert').show();
    $('.infusion .line1').html('Occlusion detected. Change infusion site.');
    $('.infusion .line2').html(data.infusionSite + '  days old');
  } else {
    $('.infusionSet-alert').hide();
  }
};

/* utils */
var saveData = localStorage ? JSON.parse(localStorage.saveData || null) || {} : {};

// Store your data.
function save(obj) {
  saveData.obj = obj;

  if (localStorage) {
    localStorage.saveData = JSON.stringify(saveData);
  }
}

// Do something with your data. // get data from server
function load(callback) {
  $.getJSON('/levels', function(levels, status) {
    callback(status != 'success', levels);
  });
}

var timeout = function() {
return;
  return setTimeout(function() {
    if (window.location.pathname != '/lock') {
      window.location = '/lock';
    }
  }, 5000);
};

var startTimer = timeout();

$(function() {
  $('body').click(function() {

    clearTimeout(startTimer);

    startTimer = timeout();
  });
})
