var refreshGraph = function() {
  $('.graph').html('');
  cutData(0, options.hours);
  chart($('.graph')[0], currentReadings, options);
};

$(function() {
  $('.bottom-more').click(function(){
    $('.bottom-bar').toggleClass("bottom-bar-expand")
    $('.graph').toggleClass('shrink');
    $('.toggle').toggleClass('shrink');
    $('.currentCGM').toggleClass('shrink');
  });

  if (_.keys(parseParams()).length) {
    appendReading(parseParams());
  }


  $('.toggle').click(function() {
    $('.toggle').toggleClass('toggle12');

    if ($('.toggle').hasClass('toggle12')) {
      options.hours = 12;
    } else {
      options.hours = 6;
    }

    refreshGraph();
  });
});
