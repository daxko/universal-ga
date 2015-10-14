# universal-ga

[![Build Status](https://travis-ci.org/daxko/universal-ga.svg?branch=master)](https://travis-ci.org/daxko/universal-ga) [![Coverage Status](https://coveralls.io/repos/daxko/universal-ga/badge.svg?branch=master)](https://coveralls.io/r/daxko/universal-ga?branch=master)

A Universal Google Analytics module for node.

Currently supported features:

* Pageviews
* Screenviews
* Events
* User timings
* Exceptions
* Custom Dimensions/Metrics

# Install

```bash
$ npm install --save universal-ga
```

# Getting Started

To initialize `universal-ga`, you will need to first pass in your analytics tracking id.

```js
var analytics = require('universal-ga');
...
analytics.initialize('UA-XXXXX-YYY');
```

## Documentation

#### analytics.initialize( *trackingID*, *options* )

|Name|Description|
|-----|-----|
|trackingID| `string` Your analytics tracking id, i.e. `UA-XXXXX-YY`.
|options.debug| `bool` (optional) If set to `true`, will use `analytics_debug.js` for some additional console logging.

Before anything else will work, you must first initialize analytics by passing an initial tracking id.

###### Example

```js
analytics.initialize('UA-12345-12');
```


#### analytics.create( *trackingID*, *name* )

|Name|Description|
|-----|-----|
|trackingID| `string` Another analytics tracking id, i.e. `UA-XXXXX-YY`.
|name| `string` Namespace additional tracking ids.

Allows you to track multiple tracking ids, used in combination with `.name()`.

###### Example

```js
analytics.initialize('UA-12345-1');
analytics.create('UA-12345-2', 'anotherTracker');
...
analytics.pageview('/home');
analytics.name('anotherTracker').pageView('/home');

```

This will namespace any additional values, allowing you to specify which values to send to which tracker. The above example would send the following data to analytics:

```js
['send', 'pageview', '/home'],
['anotherTracker.send', 'pageview', 'home']
```


#### analytics.name( *name* )

|Name|Description|
|-----|-----|
|name| `string` Send next value for the namespaced tracking id.

Namespaces the next value that is sent to the tracker.

###### Example

```js
analytics.name('anotherTracker').pageView('/home');
analytics.name('anotherTracker').timing('load', 'page', 123);
```

The above would send the following data to analytics:

```js
['anotherTracker.send', 'pageview', '/home'],
['anotherTracker.send', 'timing', 'load', 'page', 123]
```


#### analytics.set( *key*, *value* )

|Name|Description|
|-----|-----|
|key| `string` Key to send to analytics.
|value| `string` Value for the key.

Set key/value pairs for the tracker.

###### Example

```js
analytics.set('page', '/about');
```

#### analytics.pageview( *pagename* , *options* )

|Name|Description|
|-----|-----|
|pagename| `string` Pagename to send to analytics.
|options| `object` (optional) Additional options.

Allows you to send a pageview to analytics. Additional options for the pageview can be seen in the [pages documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/pages).

###### Example

```js
analytics.pageview('/about');
```

#### analytics.screenview( *screenname*, *options* )

|Name|Description|
|-----|-----|
|screenname| `string` Screenname to send to analytics.
|options| `object` (optional) Additional options.

Allows you to send a screenview to analytics. Additional options for the screenview can be seen in the [app screens documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/screens).

###### Example

```js
analytics.screenview('/about');
```

#### analytics.event( *category*, *action*, *options* )

|Name|Description|
|-----|-----|
|category| `string` Event category.
|action| `string` Event action.
|options| `object` (optional) Additional options.

#### analytics.timing( *category*, *var*, *value*, *options* )

|Name|Description|
|-----|-----|
|category| `string` Timing category.
|var| `string` Timing variable.
|value| `int` Timing value (in milliseconds).
|options| `object` (optional) Additional options.

#### analytics.exception( *message*, *isFatal* )

|Name|Description|
|-----|-----|
|message| `string` Exception message.
|isFatal| `bool` Is fatal event.

#### analytics.custom( *key*, *value* )

|Name|Description|
|-----|-----|
|key| `string` Custom dimension/metric key.
|value| `string` Custom dimension/metric value.