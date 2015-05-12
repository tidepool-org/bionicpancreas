$(function() {
  var options = {width: 430, height: 310, hours: 3, size:'small', xPaddingLeft: 30, labelPadding:0, ticks: 1, background: '#cbcccb'};

  chart($('.graph')[0], graphDataJSON.cgm, graphDataJSON.carb, graphDataJSON.bolus, graphDataJSON.correctedMeals, options);

  $('.chartToggle').click(function(){$(this).toggleClass("sixThreeToggle" )});

  $('.bottom-more').click(function(){$('.bottom-bar').toggleClass("bottom-bar-expand")});

});
