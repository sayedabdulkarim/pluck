# Pluck.js

A lightweight jQuery alternative for modern browsers. **Write less, do more.**

**Size:** ~41kb minified | **Zero dependencies** | **100% jQuery-compatible API**

[![npm version](https://img.shields.io/npm/v/pluck-dom.svg)](https://www.npmjs.com/package/pluck-dom)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- ⚡ **Lightweight** - Only ~41KB minified, no dependencies
- 🎯 **jQuery Compatible** - 100% API compatible, drop-in replacement
- 🌐 **Modern Browsers** - Works on Chrome, Firefox, Safari, Edge
- 🌙 **Dark/Light Theme** - Built-in theme support for demo page
- 📦 **AJAX Support** - Full AJAX methods (get, post, ajax, getJSON)
- 🔄 **Deferred/Promise** - jQuery-style Deferred objects
- 🎨 **Animations** - fadeIn, fadeOut, slideUp, slideDown, animate
- 📝 **Form Utilities** - serialize, serializeArray, val

## 🚀 Demo

Check out the [Live Demo](https://sayedabdulkarim.github.io/pluck/) to see all features in action!

## Installation

### CDN (Recommended)

```html
<!-- jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/pluck-dom@2.0.0/pluck.min.js"></script>

<!-- unpkg -->
<script src="https://unpkg.com/pluck-dom@2.0.0/pluck.min.js"></script>

<!-- Latest version (auto-updates) -->
<script src="https://cdn.jsdelivr.net/npm/pluck-dom/pluck.min.js"></script>
```

### npm

```bash
npm install pluck-dom
```

```javascript
// CommonJS
const pluck = require('pluck-dom');

// ES6 Module
import pluck from 'pluck-dom';
```

### Download

Download `pluck.min.js` from [GitHub Releases](https://github.com/sayedabdulkarim/pluck/releases) and include it:

```html
<script src="pluck.min.js"></script>
```

## Usage

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <button id="btn">Click Me</button>
  <div id="output"></div>

  <script src="https://cdn.jsdelivr.net/npm/pluck-dom/pluck.min.js"></script>
  <script>
    // p() for elements, pluck. for utilities
    p('#btn').on('click', function() {
      p('#output').html('<h2>Clicked!</h2>');
    });

    // AJAX
    pluck.getJSON('https://api.example.com/data', function(data) {
      console.log(data);
    });
  </script>
</body>
</html>
```

## Quick Start

```javascript
// Select elements
pluck('.button')
  .addClass('active')
  .css('color', 'red')
  .on('click', function() {
    alert('Clicked!');
  })
  .fadeIn();

// DOM Ready
pluck(function() {
  console.log('DOM is ready!');
});

// Create elements
pluck('<div class="new">Hello</div>').appendTo('body');
```

---

## Complete API Reference

### Selection & Core

```javascript
pluck('#id')              // By ID
pluck('.class')           // By class
pluck('div')              // By tag
pluck('div.class')        // Combined selectors
pluck('[data-id="1"]')    // By attribute
pluck(element)            // DOM element
pluck(nodeList)           // NodeList
pluck('<div>New</div>')   // Create element from HTML
pluck(function() {})      // DOM ready callback
```

---

### DOM Manipulation

#### Content Methods
```javascript
.html()                   // Get innerHTML of first element
.html('<b>New</b>')       // Set innerHTML of all elements
.html(function(i, old) {})// Set with function

.text()                   // Get combined text of all elements
.text('New text')         // Set text of all elements
.text(function(i, old) {})// Set with function

.val()                    // Get value of first element
.val('new value')         // Set value of all elements
.val(function(i, old) {}) // Set with function
```

#### Attribute Methods
```javascript
.attr('href')             // Get attribute
.attr('href', '/url')     // Set attribute
.attr({ href: '/url', title: 'Link' })  // Set multiple
.attr('href', function(i, old) {})      // Set with function
.attr('href', null)       // Remove attribute

.removeAttr('title')      // Remove attribute
.removeAttr('title class')// Remove multiple (space-separated)

.prop('checked')          // Get property
.prop('checked', true)    // Set property
.prop({ disabled: true }) // Set multiple

.removeProp('checked')    // Remove property

.data()                   // Get all data as object
.data('key')              // Get data value
.data('key', value)       // Set data value
.data({ key1: 'a', key2: 'b' })  // Set multiple

.removeData()             // Remove all data
.removeData('key')        // Remove specific data
.removeData('key1 key2')  // Remove multiple (space-separated)
```

#### Class Methods
```javascript
.addClass('active')       // Add class
.addClass('one two')      // Add multiple classes
.addClass(function(i, current) {})  // Add with function

.removeClass()            // Remove all classes
.removeClass('active')    // Remove class
.removeClass('one two')   // Remove multiple
.removeClass(function(i, current) {})  // Remove with function

.toggleClass('active')    // Toggle class
.toggleClass('active', true)   // Force add
.toggleClass('active', false)  // Force remove
.toggleClass(function(i, current, state) {})  // Toggle with function

.hasClass('active')       // Check if ANY element has class (boolean)
```

#### CSS Methods
```javascript
.css('color')             // Get computed style
.css('color', 'red')      // Set style
.css('color', function(i, old) {})  // Set with function
.css({ color: 'red', fontSize: '14px' })  // Set multiple
.css({ 'background-color': '#fff' })      // Kebab-case works too
```

---

### DOM Insertion

#### Inside Target
```javascript
.append(content)          // Insert at end inside element
.append(content1, content2)  // Multiple contents
.append('<div>')          // HTML string
.append(element)          // DOM element
.append(pluckObject)      // Pluck object
.append(function(i, html) {})  // With function

.prepend(content)         // Insert at beginning inside
.prepend(content1, content2)
.prepend(function(i, html) {})

.appendTo(target)         // Append this to target
.prependTo(target)        // Prepend this to target
```

#### Outside Target
```javascript
.after(content)           // Insert after element
.after(content1, content2)
.after(function(i, html) {})

.before(content)          // Insert before element
.before(content1, content2)
.before(function(i, html) {})

.insertAfter(target)      // Insert this after target
.insertBefore(target)     // Insert this before target
```

#### Wrapping
```javascript
.wrap('<div>')            // Wrap each element
.wrap(element)            // Wrap with element
.wrap(function(i) {})     // Wrap with function result

.wrapAll('<div>')         // Wrap all elements together
.wrapAll(function() {})

.wrapInner('<div>')       // Wrap contents of each element
.wrapInner(function(i) {})

.unwrap()                 // Remove parent wrapper
.unwrap('.wrapper')       // Only if parent matches selector
```

#### Removal & Replacement
```javascript
.remove()                 // Remove from DOM
.remove('.filter')        // Remove only matching

.detach()                 // Remove but keep data/events
.detach('.filter')

.empty()                  // Remove all children

.clone()                  // Clone elements
.clone(true)              // Clone with data and events
.clone(true, true)        // Deep clone with data and events

.replaceWith(content)     // Replace elements with content
.replaceWith(function(i) {})

.replaceAll(target)       // Replace all targets with this
```

---

### Traversing

#### Tree Navigation
```javascript
.find('.item')            // Find descendants matching selector

.parent()                 // Get direct parent
.parent('.filter')        // Filter parents

.parents()                // Get all ancestors
.parents('.filter')       // Filter ancestors

.parentsUntil('.stop')    // Ancestors until selector matches
.parentsUntil('.stop', '.filter')  // With filter

.closest('.container')    // Nearest ancestor (or self) matching

.offsetParent()           // Get positioned ancestor

.children()               // Get direct children
.children('.filter')      // Filter children

.contents()               // Get all child nodes (including text)

.siblings()               // Get all siblings
.siblings('.filter')      // Filter siblings

.next()                   // Get next sibling
.next('.filter')          // Only if matches

.nextAll()                // Get all following siblings
.nextAll('.filter')       // Filter

.nextUntil('.stop')       // Following siblings until
.nextUntil('.stop', '.filter')

.prev()                   // Get previous sibling
.prev('.filter')

.prevAll()                // Get all preceding siblings
.prevAll('.filter')

.prevUntil('.stop')       // Preceding siblings until
.prevUntil('.stop', '.filter')
```

#### Filtering
```javascript
.first()                  // Get first element
.last()                   // Get last element
.eq(2)                    // Get element at index (0-based)
.eq(-1)                   // Negative index from end

.filter('.active')        // Filter by selector
.filter(element)          // Filter to single element
.filter(pluckObject)      // Filter to elements in collection
.filter(function(i, el) {})  // Filter by function

.not('.disabled')         // Exclude matching
.not(element)
.not(function(i, el) {})

.has('.child')            // Keep elements containing selector
.has(element)             // Keep elements containing element

.is('.active')            // Check if ANY matches (boolean)
.is(element)
.is(function(i, el) {})

.slice(1, 3)              // Subset by indices
.slice(2)                 // From index to end
.slice(-2)                // Last 2 elements

.even()                   // Even-indexed elements (0, 2, 4...)
.odd()                    // Odd-indexed elements (1, 3, 5...)
```

#### Collection Manipulation
```javascript
.add('.more')             // Add elements to collection
.add(element)
.add('<div>')             // Add created element

.addBack()                // Add previous set to current
.addBack('.filter')       // Filter previous set first

.end()                    // Return to previous set in chain

.pushStack(elements)      // Create new set with previous reference

.uniqueSort()             // Remove duplicates and sort by DOM order
```

#### Utilities
```javascript
.each(function(i, el) {}) // Iterate over elements
                          // Return false to break

.map(function(i, el) {})  // Transform to new collection
                          // Return null/undefined to exclude

.get()                    // Get all elements as array
.get(0)                   // Get element at index
.get(-1)                  // Negative index from end

.toArray()                // Convert to array

.index()                  // Index of first element in parent
.index('.selector')       // Index of first element in selector results
.index(element)           // Index of element in collection
```

---

### Events

#### Handler Attachment
```javascript
.on('click', handler)                    // Attach handler
.on('click', '.btn', handler)            // Delegated event
.on('click', { key: 'value' }, handler)  // With data
.on('click.namespace', handler)          // Namespaced event
.on('click mouseenter', handler)         // Multiple events
.on({                                    // Multiple events object
  click: handler1,
  mouseenter: handler2
})

.off()                                   // Remove all handlers
.off('click')                            // Remove click handlers
.off('click', handler)                   // Remove specific handler
.off('click', '.btn')                    // Remove delegated
.off('click', '.btn', handler)           // Remove specific delegated
.off('.namespace')                       // Remove by namespace

.one('click', handler)                   // Run once then remove
.one('click', '.btn', handler)           // Delegated, runs once
.one('click', data, handler)             // With data

.trigger('click')                        // Trigger event
.trigger('click', [arg1, arg2])          // With extra data

.triggerHandler('click')                 // Trigger without bubbling
                                         // Returns handler result
```

#### Event Shortcuts
```javascript
// Mouse events
.click(handler)           // Click event
.click()                  // Trigger click
.dblclick(handler)        // Double click
.mousedown(handler)       // Mouse button down
.mouseup(handler)         // Mouse button up
.mousemove(handler)       // Mouse move
.mouseenter(handler)      // Mouse enter (no bubbling)
.mouseleave(handler)      // Mouse leave (no bubbling)
.mouseover(handler)       // Mouse over (bubbles)
.mouseout(handler)        // Mouse out (bubbles)
.contextmenu(handler)     // Right-click menu

// Keyboard events
.keydown(handler)         // Key pressed down
.keyup(handler)           // Key released
.keypress(handler)        // Key pressed (character)

// Form events
.focus(handler)           // Element focused
.blur(handler)            // Element lost focus
.focusin(handler)         // Focus (bubbles)
.focusout(handler)        // Blur (bubbles)
.change(handler)          // Value changed
.select(handler)          // Text selected
.submit(handler)          // Form submit
.input(handler)           // Input value changed

// Browser events
.scroll(handler)          // Scroll event
.resize(handler)          // Resize event

// Combo
.hover(enterFn, leaveFn)  // Mouseenter + mouseleave
.hover(fn)                // Same fn for both
```

#### Document Ready
```javascript
pluck(function() {
  // DOM ready
});

pluck(document).ready(function() {
  // Same as above
});

pluck.holdReady(true)     // Hold ready event
pluck.holdReady(false)    // Release ready event
```

#### Legacy Event Methods (Deprecated)
```javascript
.bind('click', handler)                  // Same as .on()
.bind('click', data, handler)

.unbind()                                // Same as .off()
.unbind('click')
.unbind('click', handler)

.delegate('.child', 'click', handler)    // Same as .on() with selector
.delegate('.child', 'click', data, handler)

.undelegate()                            // Same as .off()
.undelegate('.child', 'click')
.undelegate('.child', 'click', handler)
```

---

### Effects

#### Show/Hide
```javascript
.show()                   // Show element (restore display)
.show(400)                // Animate show (ms)
.show('slow')             // Named speed (slow=600, fast=200)
.show(400, callback)      // With callback
.show(400, 'ease-out', callback)  // With easing

.hide()                   // Hide element (display: none)
.hide(400)                // Animate hide
.hide(400, callback)
.hide(400, 'ease-out', callback)

.toggle()                 // Toggle visibility
.toggle(true)             // Force show
.toggle(false)            // Force hide
.toggle(400)              // Animate toggle
.toggle(400, callback)
```

#### Fading
```javascript
.fadeIn()                 // Fade in (default 400ms)
.fadeIn(1000)             // Custom duration
.fadeIn('slow')           // Named speed
.fadeIn(400, callback)    // With callback
.fadeIn(400, 'ease-out', callback)

.fadeOut()                // Fade out
.fadeOut(1000)
.fadeOut(400, callback)

.fadeToggle()             // Toggle fade
.fadeToggle(400)
.fadeToggle(400, callback)

.fadeTo(400, 0.5)         // Fade to specific opacity
.fadeTo(400, 0.5, callback)
.fadeTo(400, 0.5, 'ease-out', callback)
```

#### Sliding
```javascript
.slideDown()              // Slide down (show)
.slideDown(1000)          // Custom duration
.slideDown('fast')        // Named speed
.slideDown(400, callback)
.slideDown(400, 'ease-out', callback)

.slideUp()                // Slide up (hide)
.slideUp(1000)
.slideUp(400, callback)

.slideToggle()            // Toggle slide
.slideToggle(400)
.slideToggle(400, callback)
```

#### Custom Animation
```javascript
.animate({ left: '100px' })                    // Animate CSS properties
.animate({ left: '100px' }, 1000)              // With duration
.animate({ left: '100px' }, 1000, 'ease-out')  // With easing
.animate({ left: '100px' }, 1000, 'ease-out', callback)

.animate({ left: '100px' }, {                  // Options object
  duration: 1000,
  easing: 'ease-out',
  complete: callback
})

.animate({ left: '+=50px' })                   // Relative value (add)
.animate({ left: '-=50px' })                   // Relative value (subtract)
.animate({ opacity: 0.5, height: 200 })        // Multiple properties

.stop()                   // Stop current animation
.stop(true)               // Stop and clear queue
.stop(true, true)         // Stop, clear queue, jump to end

.finish()                 // Stop and jump to end

.delay(500)               // Delay next animation
.delay(500).fadeIn()
```

#### Animation Queue
```javascript
.queue()                  // Get current queue
.queue('fx')              // Get specific queue
.queue(function(next) {   // Add to queue
  // Do something
  next();                 // Call next to continue
})
.queue('fx', [])          // Replace queue
.queue('fx', function(next) {})

.dequeue()                // Execute next in queue
.dequeue('fx')            // Specific queue

.clearQueue()             // Clear the queue
.clearQueue('fx')

.promise()                // Promise resolved when queue empty
.promise('fx')
.promise().done(fn)       // When all animations complete
```

#### Animation Settings
```javascript
pluck.fx.off = true       // Disable all animations globally
pluck.fx.off = false      // Re-enable

pluck.fx.speeds.slow      // 600ms
pluck.fx.speeds.fast      // 200ms
pluck.fx.speeds._default  // 400ms

pluck.speed(duration)     // Get speed object
pluck.speed('slow')       // { duration: 600 }
```

---

### Dimensions & Position

```javascript
.width()                  // Get content width (no padding/border)
.width(100)               // Set width
.width('100px')           // Set with unit
.width(function(i, old) {})

.height()                 // Get content height
.height(100)              // Set height
.height(function(i, old) {})

.innerWidth()             // Width + padding
.innerHeight()            // Height + padding

.outerWidth()             // Width + padding + border
.outerWidth(true)         // + margin
.outerHeight()            // Height + padding + border
.outerHeight(true)        // + margin

.offset()                 // Get position relative to document
                          // Returns { top: n, left: n }
.offset({ top: 100, left: 50 })  // Set position

.position()               // Get position relative to offset parent
                          // Returns { top: n, left: n }

.offsetParent()           // Get positioned ancestor

.scrollTop()              // Get vertical scroll position
.scrollTop(100)           // Set scroll position

.scrollLeft()             // Get horizontal scroll position
.scrollLeft(100)          // Set scroll position
```

---

### AJAX

#### Core Method
```javascript
pluck.ajax({
  url: '/api/data',
  method: 'POST',              // GET, POST, PUT, DELETE, etc.
  data: { key: 'value' },      // Data to send
  dataType: 'json',            // Expected response type
  contentType: 'application/json',  // Request content type
  headers: { 'X-Token': '123' },
  timeout: 5000,               // Timeout in ms
  cache: false,                // Add cache buster
  async: true,                 // Async request
  processData: true,           // Process data to string
  username: 'user',            // Basic auth
  password: 'pass',
  beforeSend: function(xhr, settings) {},
  success: function(data, status, xhr) {},
  error: function(xhr, status, error) {},
  complete: function(xhr, status) {},
  statusCode: {
    404: function() {},
    500: function() {}
  }
});

// Returns Promise
pluck.ajax({ url: '/api' })
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

#### Shorthand Methods
```javascript
pluck.get('/api/data')
pluck.get('/api/data', function(data) {})
pluck.get('/api/data', { id: 1 }, function(data) {})
pluck.get('/api/data', { id: 1 }, function(data) {}, 'json')

pluck.post('/api/data', { key: 'value' })
pluck.post('/api/data', { key: 'value' }, function(data) {})
pluck.post('/api/data', { key: 'value' }, function(data) {}, 'json')

pluck.getJSON('/api/data')
pluck.getJSON('/api/data', function(data) {})
pluck.getJSON('/api/data', { id: 1 }, function(data) {})

pluck.getScript('/script.js')
pluck.getScript('/script.js', function() {})
```

#### Load Content
```javascript
.load('/page.html')                      // Load HTML into element
.load('/page.html', function(response, status, xhr) {})
.load('/page.html .content')             // Load specific selector
.load('/page.html', { id: 1 })           // With data (becomes POST)
.load('/page.html', { id: 1 }, callback)
```

#### Form Serialization
```javascript
.serialize()              // Serialize form to "name=value&..."
.serializeArray()         // Serialize to [{ name, value }, ...]
```

#### Global AJAX Events
```javascript
pluck(document).ajaxStart(function() {})     // First request starts
pluck(document).ajaxStop(function() {})      // All requests complete
pluck(document).ajaxSend(function(e, xhr, settings) {})  // Before send
pluck(document).ajaxSuccess(function(e, xhr, settings) {})  // On success
pluck(document).ajaxError(function(e, xhr, settings, error) {})  // On error
pluck(document).ajaxComplete(function(e, xhr, settings) {})  // On complete
```

#### AJAX Configuration
```javascript
pluck.ajaxSetup({         // Set defaults for all requests
  headers: { 'X-Custom': 'value' },
  timeout: 5000,
  dataType: 'json'
});

pluck.ajaxPrefilter(function(options, originalOptions, xhr) {
  // Modify options before request
});

pluck.ajaxPrefilter('json', function(options) {
  // Only for json requests
});
```

---

### Deferred Object (Promises)

```javascript
// Create Deferred
const deferred = pluck.Deferred();

// Add callbacks
deferred.done(function(value) {})    // On resolve
deferred.done(fn1, fn2, fn3)         // Multiple

deferred.fail(function(reason) {})   // On reject
deferred.fail(fn1, fn2, fn3)

deferred.always(function() {})       // On resolve OR reject
deferred.always(fn1, fn2)

deferred.progress(function(value) {})  // On notify

// Promise-style
deferred.then(doneFn, failFn, progressFn)
deferred.catch(failFn)

// Resolve/Reject
deferred.resolve(value)              // Resolve with value
deferred.resolve(val1, val2)         // Multiple values
deferred.resolveWith(context, [args])  // With context

deferred.reject(reason)              // Reject with reason
deferred.rejectWith(context, [args])

deferred.notify(value)               // Progress notification
deferred.notifyWith(context, [args])

// State
deferred.state()                     // 'pending', 'resolved', 'rejected'

// Get Promise (read-only)
const promise = deferred.promise()
const promise = deferred.promise(obj)  // Extend existing object

// Wait for multiple
pluck.when(deferred1, deferred2, deferred3)
  .done(function(result1, result2, result3) {})
  .fail(function(reason) {})

pluck.when(value)                    // Wrap non-deferred value
pluck.when()                         // Resolved immediately
```

---

### Callbacks Object

```javascript
// Create callbacks list
const callbacks = pluck.Callbacks()

// Flags (space-separated string)
const callbacks = pluck.Callbacks('once')          // Fire only once
const callbacks = pluck.Callbacks('memory')        // Remember last fire
const callbacks = pluck.Callbacks('unique')        // No duplicate callbacks
const callbacks = pluck.Callbacks('stopOnFalse')   // Stop if callback returns false
const callbacks = pluck.Callbacks('once memory unique')  // Combine flags

// Methods
callbacks.add(fn)                    // Add callback
callbacks.add(fn1, fn2)              // Add multiple
callbacks.add([fn1, fn2])            // Add array

callbacks.remove(fn)                 // Remove callback
callbacks.remove(fn1, fn2)

callbacks.has(fn)                    // Check if has specific callback
callbacks.has()                      // Check if has any callbacks

callbacks.fire(arg1, arg2)           // Call all callbacks with args
callbacks.fireWith(context, [args])  // Call with specific context

callbacks.fired()                    // Has been fired? (boolean)

callbacks.empty()                    // Remove all callbacks
callbacks.disable()                  // Disable (no more fires)
callbacks.disabled()                 // Is disabled? (boolean)
callbacks.lock()                     // Lock (no more adds after fire)
callbacks.locked()                   // Is locked? (boolean)
```

---

### Custom Selectors

```javascript
// Use via filterCustom method
.filterCustom('hidden')              // :hidden - Not visible
.filterCustom('visible')             // :visible - Is visible
.filterCustom('animated')            // :animated - Currently animating

.filterCustom('contains', 'text')    // :contains() - Has text
.filterCustom('empty')               // :empty - No children
.filterCustom('parent')              // :parent - Has children
.filterCustom('header')              // :header - h1-h6

// Form selectors
.filterCustom('input')               // :input - input/select/textarea/button
.filterCustom('button')              // :button - button or input[type=button]
.filterCustom('text')                // :text - input[type=text]
.filterCustom('password')            // :password
.filterCustom('checkbox')            // :checkbox
.filterCustom('radio')               // :radio
.filterCustom('file')                // :file
.filterCustom('submit')              // :submit
.filterCustom('reset')               // :reset
.filterCustom('image')               // :image

// State selectors
.filterCustom('enabled')             // :enabled
.filterCustom('disabled')            // :disabled
.filterCustom('checked')             // :checked
.filterCustom('selected')            // :selected
.filterCustom('focus')               // :focus

// Access selector functions directly
pluck.expr[':'].hidden(element)      // Returns boolean
pluck.expr[':'].contains(element, 'text')
```

---

### Static Utilities

#### Type Checking
```javascript
pluck.isArray([])                    // true
pluck.isFunction(fn)                 // true
pluck.isPlainObject({})              // true (not class instance)
pluck.isEmptyObject({})              // true
pluck.isNumeric('123')               // true
pluck.isNumeric(123)                 // true
pluck.isWindow(window)               // true
pluck.isXMLDoc(document)             // false (true for XML)
pluck.type(value)                    // 'array', 'object', 'string', etc.
```

#### Array/Object Utilities
```javascript
pluck.each(array, function(index, value) {})
pluck.each(object, function(key, value) {})
// Return false to break

pluck.map(array, function(value, index) {})
pluck.map(object, function(value, key) {})
// Return null/undefined to exclude

pluck.grep(array, function(value, index) {})  // Filter array
pluck.grep(array, fn, true)                   // Invert filter

pluck.inArray(value, array)           // Index or -1
pluck.inArray(value, array, fromIndex)

pluck.merge(array1, array2)           // Merge into first array
pluck.makeArray(arrayLike)            // Convert to array
pluck.uniqueSort(array)               // Remove duplicates, sort by DOM order
```

#### Object Utilities
```javascript
pluck.extend(target, obj1, obj2)      // Shallow merge into target
pluck.extend(true, target, obj)       // Deep merge
pluck.extend({}, defaults, options)   // Common pattern
```

#### String Utilities
```javascript
pluck.trim('  text  ')                // 'text'
pluck.param({ a: 1, b: 2 })           // 'a=1&b=2'
pluck.param([{ name: 'a', value: 1 }]) // From serializeArray format
pluck.escapeSelector('[name="val"]')  // Escape special chars for CSS
```

#### Parsing
```javascript
pluck.parseJSON('{"a":1}')            // { a: 1 }
pluck.parseHTML('<div>Hi</div>')      // [Element]
pluck.parseHTML(html, context, keepScripts)
pluck.parseXML('<root/>')             // XMLDocument
```

#### Data Utilities
```javascript
pluck.data(element, 'key', 'value')   // Set data
pluck.data(element, 'key')            // Get data
pluck.data(element)                   // Get all data
pluck.removeData(element, 'key')      // Remove data
pluck.removeData(element)             // Remove all data
pluck.hasData(element)                // Has any data? (boolean)
```

#### DOM Utilities
```javascript
pluck.contains(container, contained)  // Is contained inside?
```

#### Miscellaneous
```javascript
pluck.now()                           // Current timestamp (ms)
pluck.noop                            // Empty function
pluck.proxy(fn, context)              // Bind function to context
pluck.proxy(context, 'methodName')    // Bind method
pluck.globalEval('var x = 1;')        // Execute in global scope
pluck.error('message')                // Throw error
pluck.noConflict()                    // Release pluck/p variables
pluck.htmlPrefilter(html)             // Process HTML before insertion
```

#### CSS Utilities
```javascript
pluck.cssHooks                        // Custom CSS property handlers
pluck.cssNumber                       // Properties that don't need 'px'
```

---

## Properties

```javascript
pluck.version                         // '2.0.0'
pluck.fn                              // Prototype (extend here)

// On collections
collection.length                     // Number of elements
collection[0]                         // First element (direct access)
collection[n]                         // Element at index n
```

---

## Extending Pluck

```javascript
// Add instance method
pluck.fn.myMethod = function() {
  return this.each(function() {
    // 'this' is each DOM element
  });
};

// Add static method
pluck.myUtility = function() {
  // ...
};

// Extend prototype with object
pluck.fn.extend({
  method1: function() {},
  method2: function() {}
});
```

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE 11 (partial)

## Differences from jQuery

1. **Modern only** - No legacy browser workarounds (IE9 and below)
2. **Lighter** - ~25kb vs ~90kb minified
3. **Native Promises** - AJAX returns native Promises AND supports Deferred
4. **CSS Transitions** - Uses CSS transitions for animations (smoother)
5. **Custom selectors via filterCustom()** - Use `.filterCustom('hidden')` instead of `:hidden`

---

## Examples

### Todo List

```javascript
// Add todo
pluck('#add-btn').on('click', function() {
  const text = pluck('#todo-input').val();
  if (text) {
    pluck('#todo-list').append(
      '<li>' + text + ' <button class="delete">X</button></li>'
    );
    pluck('#todo-input').val('');
  }
});

// Delete todo (delegated)
pluck('#todo-list').on('click', '.delete', function() {
  pluck(this).parent().fadeOut(300, function() {
    pluck(this).remove();
  });
});
```

### Accordion

```javascript
pluck('.accordion-header').on('click', function() {
  const content = pluck(this).next('.accordion-content');

  // Close others
  pluck('.accordion-content').not(content).slideUp();

  // Toggle current
  content.slideToggle();
});
```

### Form Validation

```javascript
pluck('#my-form').on('submit', function(e) {
  e.preventDefault();

  let valid = true;

  pluck(this).find('input[required]').each(function() {
    if (!pluck(this).val()) {
      pluck(this).addClass('error');
      valid = false;
    } else {
      pluck(this).removeClass('error');
    }
  });

  if (valid) {
    const data = pluck(this).serialize();
    pluck.post('/api/submit', data, function(response) {
      alert('Submitted!');
    });
  }
});
```

### Infinite Scroll

```javascript
pluck(window).on('scroll', function() {
  const scrollTop = pluck(window).scrollTop();
  const windowHeight = pluck(window).height();
  const docHeight = pluck(document).height();

  if (scrollTop + windowHeight >= docHeight - 100) {
    loadMoreContent();
  }
});
```

### Deferred Example

```javascript
function loadData() {
  const deferred = pluck.Deferred();

  pluck.ajax({
    url: '/api/data',
    success: function(data) {
      deferred.resolve(data);
    },
    error: function(xhr, status, error) {
      deferred.reject(error);
    }
  });

  return deferred.promise();
}

loadData()
  .done(function(data) {
    console.log('Loaded:', data);
  })
  .fail(function(error) {
    console.error('Error:', error);
  })
  .always(function() {
    console.log('Finished');
  });
```

### Animation Queue

```javascript
pluck('#box')
  .queue(function(next) {
    pluck(this).addClass('highlight');
    setTimeout(next, 1000);
  })
  .fadeOut(500)
  .fadeIn(500)
  .queue(function(next) {
    pluck(this).removeClass('highlight');
    next();
  })
  .promise()
  .done(function() {
    console.log('All animations complete!');
  });
```

---

## License

MIT License - Sayed Abdul Karim

## Contributing

1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 60+ |
| Firefox | 55+ |
| Safari | 12+ |
| Edge | 79+ |

---

Created with ❤️ by **[Sayed Abdul Karim](https://github.com/sayedabdulkarim)**
