var updateScreen = function(url) {
  socket.emit('screenUpdate',url);
  //var remoteAPI = '/remoteControl?screen=' + url;
  //sendRemote(remoteAPI);
};

var sendRemote = function(url) {
  $.getJSON(url, function() {});
};

var socket = io(window.location.origin);
socket.on('connect', function () {
});

$(function() {
  var updateLevels = function() {
    var data = {
      battery: $('.battery-slider').val(),
      cgmLife: $('.cgm-slider').val(),
      calibration: $('.calibration-slider').val(),
      insulin: $('.insulin-slider').val(),
      glucagon: $('.glucagon-slider').val(),
      oclusion: $('.oclusion-slider').val(),
      cgmTransmitterBatteryLow: $('.cgmTransmitterBatteryLow-slider').val(),
      cgmOffline: $('.cgmOffline-slider').val(),
      infusionSite: $('.infusion-slider').val()
    };

    var remoteAPI = '/remoteControl?levels=' + JSON.stringify(data);
    sendRemote(remoteAPI);
  };

  $('.insulin-slider').noUiSlider({
  	start: [ 50 ],
    step: 1,
    connect: "lower",
  	range: {
  		'min': [ 0 ],
  		'max': [ 100 ]
  	}
  }).on({
  	change: function(e, val) {
      if (parseInt(val) < 20) {
        updateScreen('/alerts/insulin');
      }
      updateLevels();
    }
  });

  $('.glucagon-slider').noUiSlider({
  	start: [ 50 ],
    step: 1,
    connect: "lower",
  	range: {
  		'min': [ 0 ],
  		'max': [ 100 ]
  	}
  }).on({
  	change: function(e, val) {
      if (parseInt(val) < 20) {
        updateScreen('/alerts/glucagon');
      }
      updateLevels();
    }
  });

  $('.cgm-slider').noUiSlider({
  	start: [ 14 ],
    step: 1,
    connect: "lower",
  	range: {
  		'min': [ 0 ],
  		'max': [ 14 ]
  	}
  }).on({
  	change: function(e, val) {
      if (parseInt(val) == 0) {
        updateScreen('/alerts/transmitterlow'); //make cgm ending soon screen
      }
      updateLevels();
    }
  });

  $('.cgmTransmitterBatteryLow-slider').noUiSlider({
  	start: [ 0 ],
    step: 1,
    connect: "lower",
  	range: {
  		'min': [ 0 ],
  		'max': [ 1 ]
  	}
  }).on({
    change: function(e, val) {
      if (parseInt(val) == 1) {
        updateScreen('/alerts/transmitterlow');
      }
      updateLevels();
    }
  });

  $('.cgmOffline-slider').noUiSlider({
  	start: [ 0 ],
    step: 1,
    connect: "lower",
  	range: {
  		'min': [ 0 ],
  		'max': [ 1 ]
  	}
  }).on({
    change: function(e, val) {
      if (parseInt(val) == 1) {
        updateScreen('/alerts/transmitterlow'); //make this offline cgm screen
      }
      updateLevels();
    }
  });

  $('.calibration-slider').noUiSlider({
  	start: [ 0 ],
    step: 1,
    connect: "lower",
  	range: {
  		'min': [ 0 ],
  		'max': [ 720 ]
  	}
  }).on({
    change: function(e, val) {
      if (parseInt(val) == 0) {
        updateScreen('/alerts/calibration');
      }
      updateLevels();
    }
  });

  $('.infusion-slider').noUiSlider({
  	start: [ 1 ],
    step: 1,
    connect: "lower",
  	range: {
  		'min': [ 1 ],
  		'max': [ 14 ]
  	}
  }).on({
  	change: updateLevels
  });

  $('.oclusion-slider').noUiSlider({
  	start: [ 0 ],
    step: 1,
    connect: "lower",
  	range: {
  		'min': [ 0 ],
  		'max': [ 1 ]
  	}
  }).on({
    change: function(e, val) {
      if (parseInt(val) == 1) {
        updateScreen('/alerts/occlusion');
      }
      updateLevels();
    }
  });

  $('.battery-slider').noUiSlider({
  	start: [ 50 ],
    step: 1,
    connect: "lower",
  	range: {
  		'min': [  0 ],
  		'max': [ 100 ]
  	}
  }).on({
    change: function(e, val) {
      if (parseInt(val) == 0) {
        updateScreen('/alerts/batterydead');
      }

      if (parseInt(val) > 0 && parseInt(val) < 15) {
        updateScreen('/alerts/battery');
      }

      updateLevels();
    }
  });
});
