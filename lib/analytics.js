'use strict';

function warn(s) {
  console.warn('[analytics]', s);
}

/* global ga */
function _set() {
  var args = []
    , length = arguments.length
    , i = 0;

  for(; i < length; i++) {
    args.push(arguments[i]);
  }

  while(typeof args[args.length - 1] === 'undefined') {
    args.pop();
  }

  /* jshint validthis: true */
  if(this._namespace) {
    args[0] = this._namespace + '.' + args[0];
    this._namespace = null;
  }

  if(typeof ga === 'function') {
    ga.apply(undefined, args);
  }
}

var Analytics = function() {
  return this;
};

Analytics.prototype = {

  initialize: function(trackingID, options) {
    var src = 'https://www.google-analytics.com/';

    if(typeof trackingID === 'object') {
      options = trackingID;
    }

    options = options || {};

    if(options.debug) {
      src += 'analytics_debug.js';
      delete options.debug;
    } else {
      src += 'analytics.js';
    }

    /* jshint ignore:start */
    (function(i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;
      i[r] = i[r] || function() {
        (i[r].q=i[r].q||[]).push(arguments)
      }, i[r].l = 1 * new Date();
      a = s.createElement(o),
      m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m)
    })(window, document, 'script', src, 'ga');
    /* jshint ignore:end */

    if(trackingID) {
      options = JSON.stringify(options) === "{}" ? undefined : options;
      this.create(trackingID, options);
    }
  },

  create: function(trackingID, options) {
    if(!trackingID) {
      warn('tracking id is required to initialize.');
      return;
    }

    _set.call(this, 'create', trackingID, 'auto', options);
  },

  name: function(name) {
    this._namespace = name;
    return this;
  },

  set: function(key, value) {
    if(!key || !key.length) {
      warn('set: `key` is required.');
      return;
    }

    _set.call(this, 'set', key, value);
  },

  // https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
  pageview: function(path, options) {
    _set.call(this, 'send', 'pageview', path, options);
  },

  // https://developers.google.com/analytics/devguides/collection/analyticsjs/screens
  screenview: function(screenName, options) {
    if(!screenName) {
      warn('screenview: `screenName` is required.');
      return;
    }

    options = options || {};
    options.screenName = screenName;
    _set.call(this, 'send', 'screenview', options);
  },

  // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
  event: function(category, action, options) {
    if(!category || !action) {
      warn('event: both `category` and `action` are required.');
      return;
    }

    if(options && typeof options.eventValue !== 'undefined' && typeof options.eventValue !== 'number') {
      warn('event: expected `options.eventValue` to be a Number.');
      options.eventValue = undefined;
    }

    if(options && options.nonInteraction && typeof options.nonInteraction !== 'boolean') {
      warn('event: expected `options.nonInteraction` to be a boolean.');
      options.nonInteraction = false;
    }

    _set.call(this, 'send', 'event', category, action, options);
  },

  // https://developers.google.com/analytics/devguides/collection/analyticsjs/user-timings
  timing: function(timingCategory, timingVar, timingValue, options) {
    if(!timingCategory || !timingVar || typeof timingValue === 'undefined') {
      warn('timing: `timingCategory`, `timingVar`, and `timingValue` are required.');
    } else if (typeof timingValue !== 'number') {
      warn('event: expected `timingValue` to be a Number.');
    } else {
      _set.call(this, 'send', 'timing', timingCategory, timingVar, timingValue, options);
    }
  },

  // https://developers.google.com/analytics/devguides/collection/analyticsjs/exceptions
  exception: function(message, isFatal) {
    _set.call(this, 'send', 'exception', {
      exDescription: message,
      exFatal: !!isFatal
    });
  },

  // https://developers.google.com/analytics/devguides/collection/analyticsjs/custom-dims-mets
  custom: function(key, value) {
    if(!/(dimension|metric)[0-9]+/i.test(key)) {
      warn('custom: key must match dimension[0-9]+ or metric[0-9]+');
      return;
    }

    _set.call(this, 'set', key, value);
  }

};

module.exports = new Analytics();