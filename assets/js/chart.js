var chart = function(element, readings, options) {
  if(!options) {
    options = {}
  };

  var constants = {
    xPaddingLeft: 60,
    yPaddingTop: options.height * 0.05,//*0.025,
    yPadding: options.height * 0.02,//*0.033,
    tickPadding: 20, //y
    iconWidth: 14  * (options.height/410),//14,
    cgm: {
      height: options.height * 0.485,
      dot: 8   * (options.height/410)
    },
    hormone: {
      height: options.height * 0.066
    },
    tickWidth: 7 * (options.height/410),
    carbs: {
      small: options.height * 0.01,
      medium: options.height * 0.014,
      typical: options.height * 0.018,
      large: options.height * 0.022,
    }
  };

  constants.chartElementWidth = (options.width - constants.tickWidth - 71)/(options.hours * 20);

  var svg = d3.select(element)
		.append("svg")
		.attr("width", options.width)
		.attr("height", options.height);

  var drawAxis = {
    y: function(labels, yScale) {
  		for(var i in labels) {
      	svg.append('text')
  				.attr('class', 'svg-label-yaxis')
  				.attr('x', constants.xPaddingLeft - constants.tickPadding)
  				.attr('width', constants.xPaddingLeft)
  				.attr('y', yScale(labels[i]))
  				.text(labels[i]);
      }
  	},
    yTicks: function(interval, yScale) {
      var ticks = (yScale.domain()[1] - yScale.domain()[0]) / interval;

      for (var i=0; i<ticks; i++) {
        var y = yScale(yScale.domain()[0] + (i * interval));

        //left ticks
        svg.append("line")
    			.attr("x1", constants.xPaddingLeft)
    			.attr('class', 'svg-tick')
    			.attr("y1", y)
    			.attr("x2", constants.xPaddingLeft + constants.tickWidth)
    			.attr("y2", y);

        //right ticks
        svg.append("line")
    			.attr("x1", options.width - constants.tickWidth)
    			.attr('class', 'svg-tick')
    			.attr("y1", y)
    			.attr("x2", options.width)
    			.attr("y2", y);
      }
  	},
    xTicks: function(xScale) {
      for(var i = 0; i < options.hours; i++) {
        var x = xScale(i * 20);
        console.log(x);
        svg.append("line")
          .attr("x1", x)
          .attr('class', 'svg-xtick')
          .attr("y1", 14)
          .attr("x2", x)
          .attr("y2", 20);

        if (options.hours > 7 && i % 2) {
          continue;
        }
        var hour = new Date().getHours();

        hour = hour - (options.hours - i);

        if (hour > 12) {
          hour = hour - 12 + 'p';
        } else {
          hour = hour + 'a';
        }
        svg.append('text')
  					.attr('class', 'svg-xtext')
  					.attr('x', x + 5)
  					.attr('y', 10)
  					.text(hour);
      }
    },
    yLines: function(levels, yScale, _class) {
      for (var i in levels) {
        var y = yScale(levels[i]);

        svg.append("line")
          .attr("x1", constants.xPaddingLeft)
          .attr('class', _class)
          .attr("y1", y)
          .attr("x2", options.width)
          .attr("y2", y);
      }
    },
    icon: function(l, y) {
      svg.append('circle')
					.attr('class', 'svg-icon')
          .attr('cx', constants.xPaddingLeft - constants.tickPadding*1.5)
					.attr('cy', y - constants.iconWidth/3)
          .attr('r', constants.iconWidth);

      svg.append('text')
					.attr('class', 'svg-icon-text')
					.attr('x', constants.xPaddingLeft - constants.tickPadding*1.5)
					.attr('y', y)
					.text(l);
    },
    pentagon: function(x,y, size) {
      var sidesLength = 1.45308506 * size;
      var adjacent1 = 1.17557051 * size;
      var oposite1 = 0.854101969 * size;
      var adjacent2 = 1.38196602 * size;
      var oposite2 = 0.449027978 * size;

      var points = (x+-oposite2) +',' + (y-oposite2-oposite1) +' '+ (x+adjacent1) +',' + (y+-oposite1) +' '+ (x+adjacent1) +',' + (y+oposite1) +' '+ (x+-oposite2) +',' + (y+adjacent2) +' '+ (x+-sidesLength) +',' + (y+0);

      //var points = (x+0) +',' + (y-0) +' '+ (x-oposite2) +',' + (y+adjacent2) +' '+ (x+adjacent1) +',' + (y-oposite1) +' '+ (x+adjacent1) +',' + (y+oposite1) +' '+ (x+-oposite2) +',' + (y+adjacent2);

      svg.append('polygon')
					.attr('class', 'svg-pentagon')
					.attr('points', points);
    }
  };

  var xScale = d3.scale.linear()
  	.domain([0, 20*options.hours])
  	.range([71, options.width - constants.tickWidth])
  	.clamp(true);

  var draw = {
    cgm: function(readings) {
      var yScale = d3.scale.linear()
        .domain([0, 320])
        .range([(constants.cgm.height - constants.cgm.dot), constants.cgm.dot*2])
        .clamp(true);

      drawAxis.y([70,120,180,300], yScale);
      drawAxis.yLines([80,200], yScale, 'svg-line-target');
      drawAxis.yLines([0,320], yScale, 'svg-line');

      drawAxis.xTicks(xScale);
      drawAxis.yTicks(20, yScale);

      svg.selectAll()
  			.data(readings)
  			.enter()
  			.append("circle")
  			.attr("cx", function(reading, i) {
  				return xScale(i);
  			})
  			.attr("cy", function(reading) {
  				return yScale(reading);
  			})
  			.attr('r', constants.chartElementWidth)
  			.attr('fill', function(reading) {
          if(!reading) {
            return 'transparent';
          }
          return 'black';
        });
    },
    bg: function(readings) {
      var yScale = d3.scale.linear()
        .domain([0, 320])
        .range([(constants.cgm.height - constants.cgm.dot), constants.cgm.dot])
        .clamp(true);

      svg.selectAll()
  			.data(readings)
  			.enter()
  			.append("circle")
  			.attr("cx", function(reading, i) {
          console.log(reading);
  				return xScale(reading.index);
  			})
  			.attr("cy", function(reading) {
  				return yScale(reading.value);
  			})
  			.attr('r', constants.chartElementWidth*3)
        .attr('stroke-width', '1')
        .attr('stroke', 'black')
        .attr('fill', 'white');
    },
    insulin: function(data) {
      var height = constants.cgm.height + constants.hormone.height + constants.yPaddingTop + constants.yPadding*2;

      console.log('data',data);
      var yScale = d3.scale.linear()
        .domain([0, 3])
        .range([constants.hormone.height + height, height])
        .clamp(true);

      var heightScale = d3.scale.linear()
        .domain([0, 3])
        .range([0, constants.hormone.height])
        .clamp(true);

        drawAxis.icon('I', yScale(0) - 7);
      drawAxis.yTicks(0.8, yScale);

      svg.selectAll()
				.data(data)
				.enter()
				.append("rect")
		    .attr("x", function(reading, i) {
		    	return xScale(i);
				})
				.attr('attr', function(reading) {
          var length = heightScale(reading*10);
					$(this).attr('fill', 'black');
          $(this).attr('class', 'svg-hormone-dose');
					$(this).attr("height", length);
					$(this).attr("width", constants.chartElementWidth);
					$(this).attr("y", yScale(0) - length + 1);
				});
    },
    glucagon: function(readings) {
      var height = constants.cgm.height + constants.hormone.height*2 + constants.yPaddingTop*2 + constants.yPadding*2;

      var yScale = d3.scale.linear()
        .domain([0, 3])
        .range([constants.hormone.height + height + 4, height])
        .clamp(true);

      drawAxis.icon('G', yScale(0) - 7);
      drawAxis.yTicks(0.8, yScale);

      var heightScale = d3.scale.linear()
        .domain([0, 3])
        .range([0, constants.hormone.height])
        .clamp(true);

      svg.selectAll()
				.data(readings)
				.enter()
				.append("rect")
		    .attr("x", function(reading, i) {
		    	return xScale(i);
				})
				.attr('attr', function(reading) {
					var length = heightScale(reading);
					$(this).attr('fill', 'black');
					$(this).attr("height", length);
          $(this).attr('class', 'svg-hormone-dose');
					$(this).attr("width", constants.chartElementWidth);
					$(this).attr("y", yScale(0) - length + 1);
				});
    },
    carb: function(readings) {
      var height = constants.cgm.height + constants.yPaddingTop - 10;



      var yScale = d3.scale.linear()
        .domain([0, 3])
        .range([constants.hormone.height + height, height])
        .clamp(true);

      drawAxis.yTicks(0.8, yScale);
      drawAxis.icon('C', yScale(0) + constants.carbs.small);

      for(var i in readings) {
        var reading = readings[i];
        var map = [
          'small',
          'medium',
          'typical',
          'large'
        ];

        drawAxis.pentagon(xScale(reading.index), yScale(0), constants.carbs[map[reading.value]]);
      }
    }
  };

  draw.cgm(readings.cgm);
  draw.glucagon(readings.glucagon);
  draw.insulin(readings.insulin);
  draw.carb(readings.carb);
  draw.bg(readings.bg);

  updateCurrentCGM();
};

var updateCurrentCGM = function() {
  if (_.keys(currentReadings).length && currentReadings.cgm.length) {
    var last = currentReadings.cgm[currentReadings.cgm.length -1];

    $('.currentCGM-value').html(last || '---');
  }

};
