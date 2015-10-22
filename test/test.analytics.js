'use strict';

var Chai   = require('chai')
  , assert = Chai.assert
  , sinon = require('sinon')
  , analytics = require('../lib/analytics')
  , sandbox;

describe('analytics', function() {

  function analyticsArgs() {
    var q = (window.ga && window.ga.q) || [];
    return q.map(args => [].slice.call(args));
  }

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(console, 'warn');
    global.window = global;
    global.document = {
      createElement: function() { return {}; },
      getElementsByTagName: function() {
        return [{ parentNode: { insertBefore: function(){} }}];
      }
    };
  });

  afterEach(function() {
    sandbox.restore();
    delete global.ga;
    delete global.window;
    delete global.document;
    delete global.GoogleAnalyticsObject;
  });

  describe('initialize', function() {

    it('should create window.ga', function() {
      analytics.initialize();
      assert.isFunction(window.ga);
    });

    it('should initialize analytics in debug mode', function() {
      var createElement = sandbox.spy(global.document, 'createElement');
      analytics.initialize({ debug: true });
      assert.match(createElement.returnValues[0].src, /analytics_debug\.js$/i);
    });

    it('should initialize analytics in production mode', function() {
      var createElement = sandbox.spy(global.document, 'createElement');
      analytics.initialize();
      assert.match(createElement.returnValues[0].src, /analytics\.js$/i);
    });

    it('should pass tracking id to create', function() {
      var create = sandbox.spy(analytics, 'create');
      analytics.initialize('UA-XXXXX-Y');
      assert.isTrue(create.calledWith('UA-XXXXX-Y'));
    });

    it('should pass tracking id to create with options', function() {
      var create = sandbox.spy(analytics, 'create');
      analytics.initialize('UA-XXXXX-Y', { clientId: '32816aa5-9dab-4e9c-8f1b-0f53a1be5497' });
      assert.isTrue(create.calledWith('UA-XXXXX-Y', { clientId: '32816aa5-9dab-4e9c-8f1b-0f53a1be5497' }));
    });

    it('should pass tracking id to create with options excluding debug flag', function() {
      var create = sandbox.spy(analytics, 'create');
      analytics.initialize('UA-XXXXX-Y', { clientId: '32816aa5-9dab-4e9c-8f1b-0f53a1be5497', debug: true });
      assert.isTrue(create.calledWith('UA-XXXXX-Y', { clientId: '32816aa5-9dab-4e9c-8f1b-0f53a1be5497' }));
    });

  });

  describe('name', function() {

    beforeEach(function() {
      analytics.initialize();
    });

    it('should create namespaced tracking id', function() {
      analytics.create('UA-XXXXX-Z', 'anotherTracker');
      assert.deepEqual(analyticsArgs().pop(), ['create', 'UA-XXXXX-Z', 'auto', 'anotherTracker']);
    });

    it('should create namespaced value', function() {
      analytics.name('anotherTracker').set('key', 'value');
      assert.deepEqual(analyticsArgs().pop(), ['anotherTracker.set', 'key', 'value']);
    });

    it('should reset namespace after use', function() {
      analytics.name('anotherTracker').set('key1', 'value1');
      analytics.set('key2', 'value2');
      assert.deepEqual(analyticsArgs().slice(-2), [['anotherTracker.set', 'key1', 'value1'], ['set', 'key2', 'value2']]);
    });

  });

  describe('create', function() {

    beforeEach(function() {
      analytics.initialize();
    });

    it('should create tracking id', function() {
      analytics.create('UA-XXXXX-Y');
      assert.deepEqual(analyticsArgs(), [['create', 'UA-XXXXX-Y', 'auto']]);
    });

    it('should abort and log warning if tracking id is not provided', function() {
      analytics.create();
      assert.isTrue(console.warn.calledWith('[analytics]', 'tracking id is required to initialize.'));
      assert.deepEqual(analyticsArgs(), []);
    });

  });

  describe('set', function() {

    beforeEach(function() {
      analytics.initialize();
      analytics.create('UA-XXXXX-Y');
    });

    it('should set key and value', function() {
      analytics.set('key', 'value');
      assert.deepEqual(analyticsArgs().pop(), ['set', 'key', 'value']);
    });

    it('should abort and log warning if key is not set', function() {
      analytics.set();
      assert.isTrue(console.warn.calledWith('[analytics]', 'set: `key` is required.'));
      assert.equal(analyticsArgs().length, 1);
    });

  });

  describe('pageview', function() {

    beforeEach(function() {
      analytics.initialize();
      analytics.create('UA-XXXXX-Y');
    });

    it('should record a pageview', function() {
      analytics.pageview();
      assert.deepEqual(analyticsArgs().pop(), ['send', 'pageview']);
    });

    it('should record a pageview with a path', function() {
      analytics.pageview('/index');
      assert.deepEqual(analyticsArgs().pop(), ['send', 'pageview', '/index']);
    });

    it('should record a pageview with options', function() {
      analytics.pageview('/index', { title: 'index' });
      assert.deepEqual(analyticsArgs().pop(), ['send', 'pageview', '/index', { title: 'index' }]);
    });

  });

  describe('screenview', function() {

    beforeEach(function() {
      analytics.initialize();
      analytics.create('UA-XXXXX-Y');
    });

    it('should record a screenview', function() {
      analytics.screenview('index');
      assert.deepEqual(analyticsArgs().pop(), ['send', 'screenview', { screenName: 'index' }]);
    });

    it('should record a screenview with additional options', function() {
      analytics.screenview('index', { appName: 'foo' });
      assert.deepEqual(analyticsArgs().pop(), ['send', 'screenview', { screenName: 'index', appName: 'foo' }]);
    });

    it('should log warning and abort if screenName is not provided', function() {
      analytics.screenview();
      assert.isTrue(console.warn.calledWith('[analytics]', 'screenview: `screenName` is required.'));
      assert.equal(analyticsArgs().length, 1);
    });

  });

  describe('event', function() {

    beforeEach(function() {
      analytics.initialize();
      analytics.create('UA-XXXXX-Y');
    });

    it('should record event', function() {
      analytics.event('category', 'action');
      assert.deepEqual(analyticsArgs().pop(), ['send', 'event', 'category', 'action']);
    });

    it('should log warning and abort if category or action is not provided', function() {
      var msg = 'event: both `category` and `action` are required.';
      analytics.event();
      assert.isTrue(console.warn.calledWith('[analytics]', msg));
      analytics.event(undefined, 'action');
      assert.isTrue(console.warn.calledWith('[analytics]', msg));
      analytics.event('category', undefined);
      assert.isTrue(console.warn.calledWith('[analytics]', msg));
      assert.equal(analyticsArgs().length, 1);
    });

    it('should record event with value', function() {
      analytics.event('category', 'action', { eventValue: 125 });
      assert.deepEqual(analyticsArgs().pop(), ['send', 'event', 'category', 'action', { eventValue: 125 }]);
    });

    it('should log warning if options.value is not a number', function() {
      analytics.event('category', 'action', { eventValue: 'this is not a number' });
      assert.isTrue(console.warn.calledWith('[analytics]', 'event: expected `options.eventValue` to be a Number.'));
      assert.deepEqual(analyticsArgs().pop(), ['send', 'event', 'category', 'action', { eventValue: undefined }]);
    });

    it('should log warning if options.nonInteraction is not a boolean', function() {
      analytics.event('category', 'action', { nonInteraction: 'this is not a bool' });
      assert.isTrue(console.warn.calledWith('[analytics]', 'event: expected `options.nonInteraction` to be a boolean.'));
      assert.deepEqual(analyticsArgs().pop(), ['send', 'event', 'category', 'action', { nonInteraction: false }]);
    });

  });

  describe('timing', function() {

    beforeEach(function() {
      analytics.initialize();
      analytics.create('UA-XXXXX-Y');
    });

    it('should record timing', function() {
      analytics.timing('userTiming', 'load', 100);
      assert.deepEqual(analyticsArgs().pop(), ['send', 'timing', 'userTiming', 'load', 100]);
    });

    it('should log warning and abort if timingValue is not a number', function() {
      analytics.timing('userTiming', 'load', 'this is not a number');
      assert.isTrue(console.warn.calledWith('[analytics]', 'event: expected `timingValue` to be a Number.'));
      assert.equal(analyticsArgs().length, 1);
    });

    it('timing log warning and abort if timingCategory, timingVar, or timingValue is not provided', function() {
      analytics.timing();
      assert.isTrue(console.warn.calledWith('[analytics]', 'timing: `timingCategory`, `timingVar`, and `timingValue` are required.'));
      assert.equal(analyticsArgs().length, 1);
    });

  });

  describe('exception', function() {

    beforeEach(function() {
      analytics.initialize();
      analytics.create('UA-XXXXX-Y');
    });

    it('should record exception', function() {
      analytics.exception('there was an error');
      assert.deepEqual(analyticsArgs().pop(), ['send', 'exception', { exDescription: 'there was an error', exFatal: false }]);
    });

    it('should record a fatal exception', function() {
      analytics.exception('there was a fatal error', true);
      assert.deepEqual(analyticsArgs().pop(), ['send', 'exception', { exDescription: 'there was a fatal error', exFatal: true }]);
    });

  });

  describe('custom', function() {

    beforeEach(function() {
      analytics.initialize();
      analytics.create('UA-XXXXX-Y');
    });

    it('should record custom dimension', function() {
      analytics.custom('dimension1', 'value');
      assert.deepEqual(analyticsArgs().pop(), ['set', 'dimension1', 'value']);
    });

    it('should record custom metric', function() {
      analytics.custom('metric1', 'value');
      assert.deepEqual(analyticsArgs().pop(), ['set', 'metric1', 'value']);
    });

    it('should warn and abort if metric or dimension is undefined', function() {
      analytics.custom();
      assert(console.warn.calledWith('[analytics]', 'custom: key must match dimension[0-9]+ or metric[0-9]+'));
      assert.equal(analyticsArgs().length, 1);
    });

    it('should warn and abort if metric or dimension does not match regex', function() {
      analytics.custom('dimensionxxx', 'value');
      assert(console.warn.calledWith('[analytics]', 'custom: key must match dimension[0-9]+ or metric[0-9]+'));
      assert.equal(analyticsArgs().length, 1);
    });

  });

});