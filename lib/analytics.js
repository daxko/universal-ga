/*!
 * universal-ga v1.2.0
 * https://github.com/daxko/universal-ga 
 *
 * Copyright (c) 2017 Daxko
 * MIT License
 */

(function(global) {
  'use strict';

  function warn(s) {
    console.warn('[analytics]', s);
  }

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

    if(window && typeof window.ga === 'function') {
      window.ga.apply(undefined, args);
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
      var self = new Analytics();
      self._namespace = name;
      return self;
    },

    set: function(key, value) {
      if(!key || !key.length) {
        warn('set: `key` is required.');
        return;
      }

      _set.call(this, 'set', key, value);

      return this;
    },

    plugin: function(name, options) {
      if(!name || !name.length) {
        warn('plugin: `name` is required.');
        return;
      }

      _set.call(this, 'require', name, options);

      return this;
    },

    // https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
    pageview: function(path, options) {
      _set.call(this, 'send', 'pageview', path, options);

      return this;
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

      return this;
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

      return this;
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

      return this;
    },

    // https://developers.google.com/analytics/devguides/collection/analyticsjs/exceptions
    exception: function(message, isFatal) {
      _set.call(this, 'send', 'exception', {
        exDescription: message,
        exFatal: !!isFatal
      });

      return this;
    },

    // https://developers.google.com/analytics/devguides/collection/analyticsjs/custom-dims-mets
    custom: function(key, value) {
      if(!/(dimension|metric)[0-9]+/i.test(key)) {
        warn('custom: key must match dimension[0-9]+ or metric[0-9]+');
        return;
      }

      _set.call(this, 'set', key, value);

      return this;
    },

    // https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce

    initializeEcommerce: function() {
      this.plugin('ecommerce');
    },
    ecAddTransaction: function(transaction) {
      if(!transaction || !transaction.id){
        warn('addTransaction: `transaction` is required and needs an `id`.');
        return;
      }

      _set.call(this, 'ecommerce:addTransaction', transaction);

      return this;
    },
    ecAddItem: function(productItem) {
      if(!productItem || !productItem.id || !productItem.name){
        warn('addItem: `productItem` is required and needs an `id` and a `name`.');
        return;
      }

      _set.call(this, 'ecommerce:addItem', productItem);

      return this;
    },
    ecSend: function() {
      _set.call(this, 'ecommerce:send');
    },
    ecClear: function () {
      _set.call(this, 'ecommerce:clear');
    }

  };

  var ua = new Analytics();
  /* istanbul ignore next */
  if(typeof define === 'function' && define.amd) {
    define([], function() { return ua; });
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = ua;
  } else {
    global.analytics = ua;
  }

})(this);