# universal-ga

[![Build Status](https://travis-ci.org/daxko/universal-ga.svg?branch=master)](https://travis-ci.org/daxko/universal-ga) [![Coverage Status](https://coveralls.io/repos/daxko/universal-ga/badge.svg?branch=master)](https://coveralls.io/r/daxko/universal-ga?branch=master) [![npm](https://img.shields.io/npm/v/universal-ga.svg?style=flat)](https://www.npmjs.com/package/universal-ga)

A Universal Google Analytics module for node and the browser. You can either include this referenced via a script tag globally, or use a bundling process such as webpack or browserify. Once universal-ga has been initialized, you can any of the tracking methods to send your analytics data to Google.

Currently supported features:

* Plugins
* Pageviews
* Screenviews
* Events
* User timings
* Exceptions
* Custom Dimensions/Metrics
* Ecommerce Tracking

# Install

```bash
$ npm install --save universal-ga
```

# Getting Started

To initialize `universal-ga`, you will need to first pass in your analytics tracking id.

###### browserify/webpack

```js
var analytics = require('universal-ga');
...
analytics.initialize('UA-XXXXX-YYY');
```

###### Global script (browser)

```html
<script src="analytics.js"></script>
...
<script>analytics.initialize('UA-XXXXX-YYY');</script>
```

Initialization is dependant upon `window` being available at the time you call it, so be sure you call this once you can attach to window and before you call any of the other tracking methods.

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

Additional options can also be sent to `analytics.create` by including them as additional properties on the options object.

###### Example

```js
analytics.initialize('UA-12345-12', { storage: 'none' });
```


#### analytics.create( *trackingID*, *options* )

|Name|Description|
|-----|-----|
|trackingID| `string` Another analytics tracking id, i.e. `UA-XXXXX-YY`.
|options| `object` or `string` (optional) additional options to pass to the tracker.

Allows you to create multiple tracking ids. If you just need to add an additional tracking id, `options` can just be the name of your additional tracker. This can be used in combination with the `.name()` method.

###### Example

```js
analytics.initialize('UA-12345-1');
analytics.create('UA-12345-2', 'anotherTracker');
...
analytics.pageview('/home');
analytics.name('anotherTracker').pageview('/home');
```

However, if you need to combine additional options with a name, you will need to name your tracker as part of the options object.

###### Example

```js
analytics.initialize('UA-12345-1');
analytics.create('UA-12345-2', {
  name: 'anotherTracker',
  clientId: generateUUID()
});
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

Namespaces the next set of values sent to analytics.

###### Example

```js
analytics
  .name('anotherTracker')
  .pageView('/home')
  .timing('load', 'page', 123);
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

Set key/value pairs for analytics.

###### Example

```js
analytics.set('page', '/about');
```

#### analytics.plugin( *name* , *options* )

|Name|Description|
|-----|-----|
|name| `string` Plugin to require.
|options| `object` (optional) Additional options.

Allows you to add plugins to analytics. Additional options for plugins can be seen in the [plugins documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/using-plugins).

###### Example

```js
analytics.plugin('foo');
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

Send a screenview to analytics. Additional options for the screenview can be seen in the [app screens documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/screens).

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

Send event data and event metrics to analytics. Additional options for events can be seen in the [event tracking documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/events).

###### Example

```js
analytics.event('category', 'action', { eventLabel: 'label' });
```

#### analytics.timing( *category*, *var*, *value*, *options* )

|Name|Description|
|-----|-----|
|category| `string` Timing category.
|var| `string` Timing variable.
|value| `int` Timing value (in milliseconds).
|options| `object` (optional) Additional options.

Send timing data to analytics. Additional options for timing can be seen in the [user timing documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/user-timings).

###### Example

```js
analytics.timing('load', 'DOMContentLoaded', 123);
```

#### analytics.exception( *message*, *isFatal* )

|Name|Description|
|-----|-----|
|message| `string` Exception message.
|isFatal| `bool` (optional) Is fatal event.

Send exception data to analytics. You can specify whether or not the event was fatal with the optional boolean flag.

#### analytics.custom( *key*, *value* )

|Name|Description|
|-----|-----|
|key| `string` Custom dimension/metric key.
|value| `string` Custom dimension/metric value.

Send custom dimension/metrics to analytics. You need to first configure caustom dimensions/metrics through the analytics management interface. This allows you to specify a metric/dimension index to track custom values. See [custom dimensions/metrics documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/custom-dims-mets) for more details.

Dimensions and metrics keys will be a key of `dimension[0-9]` or `metric[0-9]`.

###### Example

```js
analytics
  .custom('dimension01', 1234)
  .custom('metric04', 'my custom dimension');
```

You can additional combine custom metrics/dimensions with other analytics properties (such as events or pageviews) as additional data.

```js
analytics
  .event('category', 'action', { metric05: 'custom metric data' })
  .pageview('/index', { dimension02: 'custom dimension data' });
```

#### analytics.ecAddTransaction( *transaction* )

|Name|Description|
|-----|-----|
|transaction| `object` a transaction.

An ecommerce transaction represents the entire transaction that occurs on your site. See[ecommerce documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce) for more details. A transaction `object` can consist of the following objects:

|Name|Type|Description|
|-----|-----|-----|
|id| `text`| The transaction ID. (e.g. 1234).
|affiliation| `text`| (optional) The store or affiliation from which this transaction occurred (e.g. Acme Clothing).
|revenue| `currency`| (optional) No Specifies the total revenue or grand total associated with the transaction (e.g. 11.99). This value may include shipping, tax costs, or other adjustments to total revenue that you want to include as part of your revenue calculations.
|shipping| `currency`| (optional) No Specifies the total shipping cost of the transaction. (e.g. 5).
|tax| `currency`| (optional) No Specifies the total tax of the transaction. (e.g. 1.29).

###### Example

```js
let transaction = {
    'id': '1234',                     // Transaction ID. Required.
    'affiliation': 'Acme Clothing',   // Affiliation or store name.
    'revenue': '11.99',               // Grand Total.
    'shipping': '5',                  // Shipping.
    'tax': '1.29'                     // Tax.
};

analytics.ecAddTransaction(transaction);
```

#### analytics.ecAddItem( *productItem* )

|Name|Description|
|-----|-----|
|productItem| `object` individual product.

An item represents the individual products that were in the shopping cart, and contains the following values::

|Name|Type|Description|
|-----|-----|-----|
|id| `text`| The transaction ID. This ID is what links items to the transactions to which they belong. (e.g. 1234).
|name| `text`| The item name. (e.g. Fluffy Pink Bunnies).
|sku| `text`| (optional) Specifies the SKU or item code. (e.g. SKU47).
|category| `text`| (optional) The category to which the item belongs (e.g. Party Toys).
|price| `text`| (optional) The individual, unit, price for each item. (e.g. 11.99).
|quantity| `integer`| (optional) The number of units purchased in the transaction. If a non-integer value is passed into this field (e.g. 1.5), it will be rounded to the closest integer value.

###### Example

```js
let productItem = {
    'id': '1234',                     // Transaction ID. Required.
    'name': 'Fluffy Pink Bunnies',    // Product name. Required.
    'sku': 'DD23444',                 // SKU/code.
    'category': 'Party Toys',         // Category or variation.
    'price': '11.99',                 // Unit price.
    'quantity': '1'                   // Quantity.
};

analytics.ecAddItem(productItem);
```

#### analytics.ecSend()

Finally, once you have configured all your ecommerce data in the shopping cart, you send the data to Google Analytics using the ecSend command.

#### analytics.ecClear()

If you need to manually clear the shopping cart of all transactions and items, you use this command.