var graph = function(element, bgReadings, carbReadings, bolusReadings, correctedMeals, options){
	options.colors = {
		highRange: '#B99BEA',
		normalRange: '#98CB64',
		lowRange: '#FF8D79',
		bolus: '#B99BEA',
		carbs: '#FF8D79',
		carbs2: '#FAFF79',
		glucagon: '#FFD445',
		shades: [
			'#DAE4E9',
			'#E2E9ED',
			'#E9EFF2',
			'#F5F7F7',
			'#F5F7F7',
			'#E9EFF2',
			'#E2E9ED',
			'#DAE4E9',
		]
	};

  options.colors = {
		highRange: 'black',
		normalRange: 'gray',
		lowRange: 'black',
		bolus: 'black',
		carbs: 'black',
		carbs2: 'black',
		glucagon: 'black',
		shades: [
			'#DAE4E9',
			'#E2E9ED',
			'#E9EFF2',
			'#F5F7F7',
			'#F5F7F7',
			'#E9EFF2',
			'#E2E9ED',
			'#DAE4E9',
		]
	};

	//options.axisWidth = 30;
	options.yPaddingTop = 40;
	options.dotWidth = 6;
	options.ratio = 0.6;
	options.padding = 0.05;

	var svg = d3.select(element)
		.append("svg")
		.attr("width", options.width)
		.attr("height", options.height);

	var xScale = d3.scale.linear()
		.domain([0, 12*options.hours])
		.range([options.xPaddingLeft || 0, options.width])
		.clamp(true);
		xXScale = xScale;

	var drawYAxisLabels = function(labels, yScale, css) {
		for(var i in labels) {
    	var label = labels[i];
    	var x = options.labelPadding;

    	if (label < 100) {
    		x = options.labelPadding + 7;
    	}
    	if (label < 10) {
    		x = options.labelPadding + 13;
    	}

    	svg.append('text')
				.attr('class', css || 'svg-label-axis')
				.attr('x', x)
				.attr('width', options.xPaddingLeft)
				.attr('y', yScale(label))
				.text(label);
    }
	};

	var dot = function(readings, options) {
		var yScale = d3.scale.linear()
			.domain([0, 320])
			.range([(options.height - options.dotWidth - 10) + options.yPaddingTop, options.dotWidth + options.yPaddingTop])
			.clamp(true)

		drawYAxisLabels([70,120,180,300], yScale, options.size === 'small' ? 'svg-label-axis-small' : 'svg-label-axis');

		svg.selectAll("circle")
			.data(readings)
			.enter()
			.append("circle")
			.attr("cx", function(reading) {
				return xScale(reading._index);
			})
			.attr("cy", function(reading) {
				return yScale(reading.value);
				return yScale(0);
			})
			.attr('r', options.dotWidth/2)
			.attr('fill', function(reading) {
				if (reading.value < 80) {
					return options.colors.lowRange;
				}

				if (reading.value > 180) {
					return options.colors.highRange;
				}

				return options.colors.normalRange;
			});
	};

	var bubble = function(readings, options) {
		svg.selectAll()
			.data(readings)
			.enter()
			.append("circle")
			.attr('attr', function(reading) {
				var size = 8;
				$(this).attr("cx", (xScale(reading._index) + size/2) - 3);

				if(reading.value < 10) {
					size = 4;
					$(this).attr("cx", (xScale(reading._index) + size/2));
				}
				if(reading.value > 30) {
					size = 11;
					$(this).attr("cx", (xScale(reading._index) + size/2));
				}
				if(reading.value < 1) {
					size = 0;
				}

				$(this).attr('r', size);
				$(this).attr("cy", options.paddingTop);
			})
			.attr('fill', options.colors.carbs);
	};

	var glucagonReadings = [
		{
			_index: 0,
			value: 2,
			realIndex: 0
		},
		{
			_index: 1,
			value: 3,
			realIndex: 1
		},
	];

	var drawWe = {
		carbs: function(readings, options) {
			var yScale = d3.scale.linear()
				.domain([0, 20])
				.range([0, options.height])
				.clamp(true);

			drawYAxisLabels([10,30,50,90], d3.scale.linear()
				.domain([-10, 100])
				.range([options.paddingTop, options.paddingTop + options.height])
				.clamp(true), 'svg-label-axis-carb');

			svg.selectAll()
				.data(readings)
				.enter()
				.append("rect")
		    .attr("x", function(reading) {
		    	return xScale(reading._index);
				})
				.attr('attr', function(reading) {
					var length = yScale(reading.value < 1 ? 0 : reading.value);

					$(this).attr('fill', options.colors.carbs);
					$(this).attr("height", length);
					$(this).attr("width", options.width / options.hours * 20);
					$(this).attr("y", options.paddingTop);
				});
		},
		glucagon: function(readings, options) {
			var yScale = d3.scale.linear()
				.domain([0, 40])
				.range([0, options.height])
				.clamp(true);

			drawYAxisLabels([2,8], d3.scale.linear()
				.domain([-2, 12])
				.range([options.paddingTop, options.paddingTop + options.height])
				.clamp(true), 'svg-label-axis-glucagon');

			svg.selectAll()
				.data(readings)
				.enter()
				.append("rect")
		    .attr("x", function(reading) {
		    	return xScale(reading._index);
				})
				.attr('attr', function(reading) {
					var length = yScale(reading.value);

					length = yScale(0);

					if(correctedMeals.length > 0) {
						//console.log(correctedMeals);

						if(correctedMeals[reading.realIndex]) {
							//console.log('reading.realIndex', reading.realIndex, correctedMeals);
							//length = yScale(correctedMeals[reading.realIndex].d);
							length = yScale(15);
						} else {
							//length = yScale(15);
						}
					}

					$(this).attr('fill', options.colors.glucagon);
					$(this).attr("height", length);
					$(this).attr("width", options.dotWidth);
					$(this).attr("y", options.paddingTop);
				});
		},
		bolus: function(readings, options) {
			var yScale = d3.scale.linear()
				.domain([0, 600])
				.range([0, options.height])
				.clamp(true);


				drawYAxisLabels([2, 8], d3.scale.linear()
					.domain([12, -2])
					.range([options.paddingTop, options.paddingTop + options.height])
					.clamp(true), 'svg-label-axis-bolus');



			svg.selectAll()
				.data(readings)
				.enter()
				.append("rect")
		    .attr("x", function(reading) {
		    	return xScale(reading._index);
				})
				.attr('attr', function(reading) {
					var length = yScale(reading.value);

					$(this).attr('fill', options.colors.bolus);
					$(this).attr("height", length);
					$(this).attr("width", options.dotWidth);
					$(this).attr("y", (options.paddingTop + options.height) - length);
				});
			}
	};

	drawWe.glucagon(glucagonReadings);

	var carbSizePadding = 19;

	var background = function(startIndexTime, options) {
		var segmentCount = 9;//options.hours/3;
		var sectionWidth = (options.width-options.xPaddingLeft)/8;

		//console.log('sectionWidth',sectionWidth);
		var fiveMinCount = 24 * 12; //60/5 is number of 5 minutes periods in 1 hour

		if(options.ticks > fiveMinCount) {
			options.ticks = 0;
		}

		var fiveMinPerSegment = fiveMinCount/8;

		var startSegment = Math.floor(startIndexTime/fiveMinPerSegment);
		var startSegmentPosition = startIndexTime%fiveMinPerSegment;

		var startSegmentPositionOffset = sectionWidth * (startSegmentPosition/fiveMinPerSegment);
		//var startSegmentPositionOffset = startIndexTime*3;
		var data = [];
		var segmentShadeIndex = startSegment;
		var xScale = d3.scale.linear()
			.domain([0, segmentCount])
			.range([options.xPaddingLeft, options.width + sectionWidth])
			.clamp(true);
		globalXScale = xScale;

		var textLabels = ['12 AM', '3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];

		for (var i = 0; i < segmentCount; i++) {

			if(segmentShadeIndex > (options.colors.shades.length - 1)) {
				segmentShadeIndex = 0;
			}
			var entry = {
    		x: xScale(i) - startSegmentPositionOffset,
    		//y: options.timeline ? options.heights.label : 0,
    		y: options.yPaddingTop,
    		fill: options.colors.shades[segmentShadeIndex],
    		width: sectionWidth,
    		label: textLabels[segmentShadeIndex],
    		//height: options.height - (options.timeline ? options.heights.label*2 : 0)
    		height: options.height
			};
			data.push(entry);

			svg.append('text')
					.attr('class', 'svg-label-axis-x')
					.attr('x', entry.x + 2)
					.attr('y', 12)
					.text(entry.label);

			segmentShadeIndex++;
		}

		svg.selectAll()
			.data(data)
			.enter()
			.append("rect")
	    .attr('attr', function(d) {
	    	$(this).attr({
	    		x: d.x,
	    		y: d.y,
	    		fill: d.fill,
	    		width: d.width,
	    		height: d.height
	    	});
	    });

	  svg.append('rect')
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', options.xPaddingLeft)
			.attr('height', options.height)
			.attr('fill', options.background || 'white');

		var yScale = d3.scale.linear()
			.domain([0, 320])
			.range([(options.bgOptions.height - options.dotWidth - 10) + options.yPaddingTop, options.dotWidth + options.yPaddingTop])
			.clamp(true);

		svg.append('rect')
			.attr('x', 0)
			.attr('y', yScale(0))
			.attr('width', options.width)
			.attr('height', (options.rPaddingTop - yScale(0)) * 1.17)
			.attr('fill', options.background || 'white');

		svg.append('rect')
			.attr('x', options.xPaddingLeft)
			.attr('y', 16)
			.attr('width', options.width - options.xPaddingLeft)
			.attr('height', 2)
			.attr('fill', '#f3f1f0');

		svg.append("line")
			.attr("x1", options.xPaddingLeft)
			.attr('class', 'svg-line')
			.attr("y1", yScale(80))
			.attr("stroke-dasharray", ("5, 5"))
			.attr("x2", options.width)
			.attr("y2", yScale(80));

		svg.append("line")
			.attr("x1", options.xPaddingLeft)
			.attr('class', 'svg-line')
			.attr("y1", yScale(180))
			.attr("stroke-dasharray", ("5, 5"))
			.attr("x2", options.width)
			.attr("y2", yScale(180));
	};

	var labels = function(inputLabel) {
		var labels = [
		  {text:'', css: options.size === 'small' ? 'svg-label-small' : 'svg-label' , x: options.xPaddingLeft, y: 34}
		  //{text: glucagonLabel, css:'svg-label', x: 50, y: 290},
		];

    for(var i in labels) {
    	var label = labels[i];

    	svg.append('text')
				.attr('class', label.css)
				.attr('x', label.x)
				.attr('y', label.y)
				.text(label.text);
    }

		if (inputLabel.insulin && inputLabel.glucagon && inputLabel.carbs) {
			$(element).find('.overlay-chart-label').html("<span class='overlay-chart-label-insulin'>Insulin</span>, <span class='overlay-chart-label-glucagon'>Glucagon</span> & <span class='overlay-chart-label-carbs'>Carbs</span>");
		} else if (inputLabel.insulin && inputLabel.glucagon) {
			$(element).find('.overlay-chart-label').html("<span class='overlay-chart-label-insulin'>Insulin</span> & <span class='overlay-chart-label-glucagon'>Glucagon</span>");
		} else if (inputLabel.insulin && inputLabel.carbs) {
			$(element).find('.overlay-chart-label').html("<span class='overlay-chart-label-insulin'>Insulin</span> & <span class='overlay-chart-label-carbs'>Carbs</span>");
		} else if (inputLabel.insulin) {
			$(element).find('.overlay-chart-label').html("<span class='overlay-chart-label-insulin'>Insulin</span>");
		}

	};

	var bgOptions = _.defaults({
		height: (options.height - options.yPaddingTop) * options.ratio
	}, options);

	var rOptions = _.defaults({
		paddingTop: options.height * (options.ratio + options.padding),
		height: options.height * (1 - options.ratio - options.padding)
	}, options);

	options.bgOptions = bgOptions;

	if (options.small) {
		dot(bgReadings, options);
		return;
	}
	options.rPaddingTop = rOptions.paddingTop;
	//console.log(options.ticks);
	background(options.ticks || 0, options);
	dot(bgReadings, bgOptions);

	var height = rOptions.height;
	var paddingTop = rOptions.paddingTop;

	rOptions.height = height/2;
	drawWe.bolus(bolusReadings, rOptions);

	rOptions.paddingTop = paddingTop + height/2;
	drawWe.glucagon(carbReadings, rOptions);

	labels({
		insulin: true,
		glucagon: true
	});

	return options.ticks;
};
