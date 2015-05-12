'use strict';

var express = require('express'),
    request = require('supertest'),
    expressLess = require('../');

describe('Express LESS', function() {
	beforeEach(function() {
		this.app = express();
		this.app.use(expressLess(__dirname + '/fixtures'));
	});

	it('should return valid CSS', function(done) {
		request(this.app)
			.get('/valid.css')
			.expect('Content-Type', /css/)
			.expect(/color: #aabbcc/)
			.expect(200, done);
	});

	it('should return compressed CSS', function(done) {
		var app = express();
		app.use(expressLess(__dirname + '/fixtures', { compress: true }));

		request(app)
			.get('/valid.css')
			.expect('Content-Type', /css/)
			.expect(/color:#abc/)
			.expect(200, done);
	});

	it('should ignore methods other than GET and HEAD', function(done) {
		request(this.app)
			.post('/valid.css')
			.expect(404, done);
	});

	it('should respond with 404 if input file not found', function(done) {
		request(this.app)
			.get('/phantom.css')
			.expect(404, done);
	});

	it('should respond with 500 if input file is invalid', function(done) {
		request(this.app)
			.get('/invalid.css')
			.expect(500, done);
	});
});
