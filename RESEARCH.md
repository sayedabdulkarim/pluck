# Pluck.js - Complete Research & Planning Document

> A lightweight jQuery alternative library

---

## Table of Contents

1. [What is jQuery & Why It Exists](#1-what-is-jquery--why-it-exists)
2. [Complete jQuery API Reference](#2-complete-jquery-api-reference)
3. [JavaScript Concepts Used](#3-javascript-concepts-used)
4. [Implementation Plan](#4-implementation-plan)
5. [File Structure](#5-file-structure)
6. [Learning Topics](#6-learning-topics)

---

## 1. What is jQuery & Why It Exists

### Problems jQuery Solves

```
Before jQuery (Vanilla JS):
├── Verbose DOM selection: document.querySelectorAll()
├── Cross-browser inconsistencies
├── Complex event handling: addEventListener()
├── No method chaining
├── Tedious AJAX: XMLHttpRequest
└── Difficult animations
```

### jQuery's Core Philosophy

```javascript
// jQuery way - Simple, chainable, cross-browser
$('.button')
  .addClass('active')
  .css('color', 'red')
  .on('click', handler)
  .fadeIn();

// Vanilla JS way - Verbose, no chaining
const buttons = document.querySelectorAll('.button');
buttons.forEach(btn => {
  btn.classList.add('active');
  btn.style.color = 'red';
  btn.addEventListener('click', handler);
  // fadeIn requires custom animation code...
});
```

### Why Build an Alternative?

1. **jQuery is 87kb** - Too heavy for modern web
2. **Modern browsers** don't need cross-browser hacks
3. **Learning opportunity** - Understand JS deeply
4. **Customization** - Include only what you need

---

## 2. Complete jQuery API Reference

### 2.1 Selectors

#### Basic Selectors
| Selector | Example | Description |
|----------|---------|-------------|
| `*` | `$('*')` | Select all elements |
| `element` | `$('div')` | Select by tag name |
| `#id` | `$('#header')` | Select by ID |
| `.class` | `$('.btn')` | Select by class |
| `selector1, selector2` | `$('div, p')` | Multiple selectors |

#### Hierarchy Selectors
| Selector | Example | Description |
|----------|---------|-------------|
| `ancestor descendant` | `$('div p')` | All descendants |
| `parent > child` | `$('ul > li')` | Direct children only |
| `prev + next` | `$('h1 + p')` | Immediately following sibling |
| `prev ~ siblings` | `$('h1 ~ p')` | All following siblings |

#### Attribute Selectors
| Selector | Example | Description |
|----------|---------|-------------|
| `[attr]` | `$('[href]')` | Has attribute |
| `[attr="val"]` | `$('[type="text"]')` | Exact match |
| `[attr^="val"]` | `$('[href^="https"]')` | Starts with |
| `[attr$="val"]` | `$('[src$=".png"]')` | Ends with |
| `[attr*="val"]` | `$('[class*="btn"]')` | Contains |
| `[attr~="val"]` | `$('[class~="active"]')` | Contains word |
| `[attr!="val"]` | `$('[type!="hidden"]')` | Not equal |

#### Form Selectors
| Selector | Description |
|----------|-------------|
| `:input` | All input, textarea, select, button |
| `:text` | Input type="text" |
| `:password` | Input type="password" |
| `:checkbox` | Input type="checkbox" |
| `:radio` | Input type="radio" |
| `:submit` | Input/button type="submit" |
| `:button` | Button elements |
| `:file` | Input type="file" |
| `:checked` | Checked checkboxes/radios |
| `:selected` | Selected options |
| `:disabled` | Disabled elements |
| `:enabled` | Enabled elements |
| `:focus` | Currently focused element |

#### Filter Selectors
| Selector | Description |
|----------|-------------|
| `:first` | First matched element |
| `:last` | Last matched element |
| `:eq(n)` | Element at index n |
| `:gt(n)` | Elements after index n |
| `:lt(n)` | Elements before index n |
| `:even` | Even indexed elements |
| `:odd` | Odd indexed elements |
| `:not(selector)` | Elements not matching |
| `:has(selector)` | Contains matching descendant |
| `:contains(text)` | Contains text |
| `:empty` | No children |
| `:parent` | Has children |
| `:hidden` | Hidden elements |
| `:visible` | Visible elements |
| `:animated` | Currently animating |

#### Child Filter Selectors
| Selector | Description |
|----------|-------------|
| `:first-child` | First child of parent |
| `:last-child` | Last child of parent |
| `:only-child` | Only child of parent |
| `:nth-child(n)` | Nth child |
| `:nth-last-child(n)` | Nth child from end |
| `:first-of-type` | First of its type |
| `:last-of-type` | Last of its type |
| `:only-of-type` | Only of its type |
| `:nth-of-type(n)` | Nth of its type |

---

### 2.2 DOM Manipulation

#### Content Methods
| Method | Description | Returns |
|--------|-------------|---------|
| `.html()` | Get HTML content | string |
| `.html(content)` | Set HTML content | jQuery |
| `.text()` | Get text content | string |
| `.text(content)` | Set text content | jQuery |
| `.val()` | Get form value | string |
| `.val(value)` | Set form value | jQuery |

#### Attribute Methods
| Method | Description |
|--------|-------------|
| `.attr(name)` | Get attribute value |
| `.attr(name, value)` | Set attribute |
| `.attr({name: value})` | Set multiple attributes |
| `.removeAttr(name)` | Remove attribute |
| `.prop(name)` | Get property |
| `.prop(name, value)` | Set property |
| `.removeProp(name)` | Remove property |
| `.data(key)` | Get data attribute |
| `.data(key, value)` | Set data attribute |
| `.removeData(key)` | Remove data |

#### Class Methods
| Method | Description |
|--------|-------------|
| `.addClass(name)` | Add class(es) |
| `.removeClass(name)` | Remove class(es) |
| `.toggleClass(name)` | Toggle class(es) |
| `.toggleClass(name, state)` | Toggle with condition |
| `.hasClass(name)` | Check if has class |

#### CSS Methods
| Method | Description |
|--------|-------------|
| `.css(prop)` | Get CSS property |
| `.css(prop, value)` | Set CSS property |
| `.css({prop: value})` | Set multiple CSS |
| `.width()` | Get width |
| `.width(value)` | Set width |
| `.height()` | Get height |
| `.height(value)` | Set height |
| `.innerWidth()` | Width + padding |
| `.innerHeight()` | Height + padding |
| `.outerWidth()` | Width + padding + border |
| `.outerWidth(true)` | + margin |
| `.outerHeight()` | Height + padding + border |
| `.outerHeight(true)` | + margin |
| `.offset()` | Position relative to document |
| `.offset({top, left})` | Set position |
| `.position()` | Position relative to parent |
| `.scrollTop()` | Get scroll position |
| `.scrollTop(value)` | Set scroll position |
| `.scrollLeft()` | Get horizontal scroll |
| `.scrollLeft(value)` | Set horizontal scroll |

#### DOM Insertion - Inside
| Method | Description |
|--------|-------------|
| `.append(content)` | Insert at end inside |
| `.appendTo(target)` | Insert this at end of target |
| `.prepend(content)` | Insert at beginning inside |
| `.prependTo(target)` | Insert this at beginning of target |

#### DOM Insertion - Outside
| Method | Description |
|--------|-------------|
| `.after(content)` | Insert after element |
| `.before(content)` | Insert before element |
| `.insertAfter(target)` | Insert this after target |
| `.insertBefore(target)` | Insert this before target |

#### DOM Insertion - Around
| Method | Description |
|--------|-------------|
| `.wrap(wrapper)` | Wrap each element |
| `.wrapAll(wrapper)` | Wrap all elements together |
| `.wrapInner(wrapper)` | Wrap contents |
| `.unwrap()` | Remove parent wrapper |

#### DOM Removal
| Method | Description |
|--------|-------------|
| `.remove()` | Remove from DOM |
| `.detach()` | Remove but keep data/events |
| `.empty()` | Remove children |

#### DOM Replacement
| Method | Description |
|--------|-------------|
| `.replaceWith(content)` | Replace with new content |
| `.replaceAll(target)` | Replace target with this |

#### Copying
| Method | Description |
|--------|-------------|
| `.clone()` | Shallow copy |
| `.clone(true)` | Deep copy with events |

---

### 2.3 Traversing

#### Tree Traversal
| Method | Description |
|--------|-------------|
| `.children()` | Direct children |
| `.children(selector)` | Filtered children |
| `.find(selector)` | All descendants matching |
| `.parent()` | Direct parent |
| `.parent(selector)` | Filtered parent |
| `.parents()` | All ancestors |
| `.parents(selector)` | Filtered ancestors |
| `.parentsUntil(selector)` | Ancestors up to selector |
| `.closest(selector)` | Nearest ancestor matching |
| `.offsetParent()` | Nearest positioned ancestor |
| `.siblings()` | All siblings |
| `.siblings(selector)` | Filtered siblings |
| `.next()` | Next sibling |
| `.next(selector)` | Next if matches |
| `.nextAll()` | All following siblings |
| `.nextAll(selector)` | Filtered following |
| `.nextUntil(selector)` | Following up to selector |
| `.prev()` | Previous sibling |
| `.prev(selector)` | Previous if matches |
| `.prevAll()` | All preceding siblings |
| `.prevAll(selector)` | Filtered preceding |
| `.prevUntil(selector)` | Preceding up to selector |
| `.contents()` | Children including text nodes |

#### Filtering
| Method | Description |
|--------|-------------|
| `.first()` | First element |
| `.last()` | Last element |
| `.eq(index)` | Element at index |
| `.filter(selector)` | Elements matching |
| `.filter(function)` | Elements passing test |
| `.not(selector)` | Elements not matching |
| `.not(function)` | Elements not passing test |
| `.has(selector)` | Has matching descendant |
| `.is(selector)` | Check if matches |
| `.slice(start, end)` | Subset by indices |
| `.even()` | Even indexed |
| `.odd()` | Odd indexed |

#### Miscellaneous
| Method | Description |
|--------|-------------|
| `.add(selector)` | Add elements to set |
| `.addBack()` | Add previous set |
| `.end()` | Return to previous set |
| `.each(function)` | Iterate elements |
| `.map(function)` | Transform elements |
| `.get()` | Get all as array |
| `.get(index)` | Get element at index |
| `.toArray()` | Convert to array |
| `.index()` | Index in parent |
| `.index(selector)` | Index in selector |

---

### 2.4 Events

#### Event Handler Attachment
| Method | Description |
|--------|-------------|
| `.on(event, handler)` | Attach handler |
| `.on(event, selector, handler)` | Delegated handler |
| `.on(event, data, handler)` | With data |
| `.on({event: handler})` | Multiple events |
| `.off(event)` | Remove handlers |
| `.off(event, handler)` | Remove specific |
| `.off()` | Remove all |
| `.one(event, handler)` | Handler runs once |
| `.trigger(event)` | Trigger event |
| `.trigger(event, data)` | With data |
| `.triggerHandler(event)` | Without bubbling |

#### Event Shortcuts
| Method | Event |
|--------|-------|
| `.click()` | click |
| `.dblclick()` | dblclick |
| `.mousedown()` | mousedown |
| `.mouseup()` | mouseup |
| `.mousemove()` | mousemove |
| `.mouseenter()` | mouseenter |
| `.mouseleave()` | mouseleave |
| `.mouseover()` | mouseover |
| `.mouseout()` | mouseout |
| `.hover(enter, leave)` | mouseenter + mouseleave |
| `.keydown()` | keydown |
| `.keyup()` | keyup |
| `.keypress()` | keypress |
| `.focus()` | focus |
| `.blur()` | blur |
| `.focusin()` | focusin |
| `.focusout()` | focusout |
| `.change()` | change |
| `.select()` | select |
| `.submit()` | submit |
| `.scroll()` | scroll |
| `.resize()` | resize |
| `.contextmenu()` | contextmenu |

#### Document Loading
| Method | Description |
|--------|-------------|
| `$(document).ready(fn)` | DOM ready |
| `$(fn)` | Shorthand for ready |
| `$(window).load(fn)` | Window load |

#### Event Object Properties
| Property | Description |
|----------|-------------|
| `event.target` | Element that triggered |
| `event.currentTarget` | Current element (this) |
| `event.delegateTarget` | Where handler attached |
| `event.relatedTarget` | Related element |
| `event.type` | Event type |
| `event.which` | Key/button code |
| `event.pageX` | Mouse X from document |
| `event.pageY` | Mouse Y from document |
| `event.timeStamp` | When event occurred |
| `event.data` | Data passed to handler |
| `event.result` | Previous handler's return |
| `event.namespace` | Event namespace |

#### Event Object Methods
| Method | Description |
|--------|-------------|
| `event.preventDefault()` | Prevent default action |
| `event.stopPropagation()` | Stop bubbling |
| `event.stopImmediatePropagation()` | Stop all handlers |
| `event.isDefaultPrevented()` | Check if prevented |
| `event.isPropagationStopped()` | Check if stopped |

---

### 2.5 Effects

#### Basic Effects
| Method | Description |
|--------|-------------|
| `.show()` | Show element |
| `.show(duration)` | Show with animation |
| `.show(duration, callback)` | With callback |
| `.hide()` | Hide element |
| `.hide(duration)` | Hide with animation |
| `.toggle()` | Toggle visibility |
| `.toggle(duration)` | With animation |

#### Fading
| Method | Description |
|--------|-------------|
| `.fadeIn()` | Fade in |
| `.fadeIn(duration)` | With duration |
| `.fadeIn(duration, callback)` | With callback |
| `.fadeOut()` | Fade out |
| `.fadeOut(duration)` | With duration |
| `.fadeToggle()` | Toggle fade |
| `.fadeTo(duration, opacity)` | Fade to opacity |

#### Sliding
| Method | Description |
|--------|-------------|
| `.slideDown()` | Slide down |
| `.slideDown(duration)` | With duration |
| `.slideUp()` | Slide up |
| `.slideUp(duration)` | With duration |
| `.slideToggle()` | Toggle slide |

#### Custom Animation
| Method | Description |
|--------|-------------|
| `.animate(props)` | Animate CSS properties |
| `.animate(props, duration)` | With duration |
| `.animate(props, options)` | With options |
| `.stop()` | Stop current animation |
| `.stop(true)` | Clear queue |
| `.stop(true, true)` | Jump to end |
| `.finish()` | Complete all animations |
| `.delay(duration)` | Pause queue |

#### Queue
| Method | Description |
|--------|-------------|
| `.queue()` | Get queue |
| `.queue(fn)` | Add to queue |
| `.dequeue()` | Execute next in queue |
| `.clearQueue()` | Clear queue |

#### Settings
| Property | Description |
|----------|-------------|
| `$.fx.off` | Disable all animations |
| `$.fx.interval` | Animation frame rate |

---

### 2.6 AJAX

#### Core Method
```javascript
$.ajax({
  url: '/api/data',
  method: 'GET',           // GET, POST, PUT, DELETE
  data: { key: 'value' },  // Data to send
  dataType: 'json',        // Expected response type
  contentType: 'application/json',
  headers: { 'X-Custom': 'value' },
  timeout: 5000,
  cache: true,
  async: true,
  success: function(data, status, xhr) {},
  error: function(xhr, status, error) {},
  complete: function(xhr, status) {},
  beforeSend: function(xhr) {},
  statusCode: {
    404: function() {},
    500: function() {}
  }
});
```

#### Shorthand Methods
| Method | Description |
|--------|-------------|
| `$.get(url)` | GET request |
| `$.get(url, data)` | With query params |
| `$.get(url, data, success)` | With callback |
| `$.post(url)` | POST request |
| `$.post(url, data)` | With data |
| `$.post(url, data, success)` | With callback |
| `$.getJSON(url)` | GET JSON |
| `$.getScript(url)` | Load & execute script |

#### Element Method
| Method | Description |
|--------|-------------|
| `.load(url)` | Load HTML into element |
| `.load(url, data)` | With data |
| `.load(url, complete)` | With callback |

#### Form Serialization
| Method | Description |
|--------|-------------|
| `.serialize()` | Form as query string |
| `.serializeArray()` | Form as array of objects |

#### Global AJAX Events
| Method | Description |
|--------|-------------|
| `.ajaxStart(fn)` | First request starts |
| `.ajaxStop(fn)` | All requests complete |
| `.ajaxSend(fn)` | Before request sent |
| `.ajaxComplete(fn)` | Request completes |
| `.ajaxSuccess(fn)` | Request succeeds |
| `.ajaxError(fn)` | Request fails |

---

### 2.7 Utilities

#### Type Checking
| Method | Description |
|--------|-------------|
| `$.isArray(obj)` | Is array |
| `$.isFunction(obj)` | Is function |
| `$.isNumeric(val)` | Is numeric |
| `$.isPlainObject(obj)` | Is plain object |
| `$.isEmptyObject(obj)` | Is empty object |
| `$.isWindow(obj)` | Is window |
| `$.isXMLDoc(node)` | Is XML document |
| `$.type(obj)` | Get type string |

#### Array/Object Utilities
| Method | Description |
|--------|-------------|
| `$.each(arr, fn)` | Iterate array/object |
| `$.map(arr, fn)` | Transform array |
| `$.grep(arr, fn)` | Filter array |
| `$.inArray(val, arr)` | Find index |
| `$.merge(arr1, arr2)` | Merge arrays |
| `$.makeArray(obj)` | Convert to array |
| `$.unique(arr)` | Remove duplicates |
| `$.extend(target, obj)` | Merge objects |
| `$.extend(true, target, obj)` | Deep merge |

#### String Utilities
| Method | Description |
|--------|-------------|
| `$.trim(str)` | Trim whitespace |
| `$.param(obj)` | Object to query string |

#### Parsing
| Method | Description |
|--------|-------------|
| `$.parseJSON(str)` | Parse JSON |
| `$.parseHTML(str)` | Parse HTML |
| `$.parseXML(str)` | Parse XML |

#### Other
| Method | Description |
|--------|-------------|
| `$.noop` | Empty function |
| `$.now()` | Current timestamp |
| `$.proxy(fn, context)` | Bind context |
| `$.contains(parent, child)` | Check containment |
| `$.noConflict()` | Release $ |
| `$.holdReady(hold)` | Hold/release ready |

---

## 3. JavaScript Concepts Used

### 3.1 Core JS Concepts

| Concept | Where Used | Priority |
|---------|------------|----------|
| IIFE (Immediately Invoked Function Expression) | Library wrapper | High |
| Closures | Private variables | High |
| Prototypes | Method inheritance | High |
| `this` keyword | Method context | High |
| Method chaining | Return `this` | High |
| Constructor functions | `new Pluck()` | High |
| Object.prototype | Adding methods | High |
| Array methods (map, filter, forEach) | Iteration | High |
| Spread operator | Arguments handling | Medium |
| Rest parameters | Variable arguments | Medium |
| Default parameters | Optional args | Medium |
| Destructuring | Object/array unpacking | Medium |
| Template literals | String building | Medium |
| Arrow functions | Callbacks | Medium |
| Promises | AJAX | Medium |
| Classes (ES6) | Alternative syntax | Low |
| Symbols | Private properties | Low |
| WeakMap | Private data storage | Low |
| Proxy | Property interception | Low |

### 3.2 DOM Concepts

| Concept | Where Used |
|---------|------------|
| `document.querySelectorAll()` | Selection |
| `document.querySelector()` | Single selection |
| `element.matches()` | Selector matching |
| `element.closest()` | Ancestor finding |
| `element.classList` | Class manipulation |
| `element.style` | Inline styles |
| `getComputedStyle()` | Computed styles |
| `element.getAttribute()` | Attribute access |
| `element.setAttribute()` | Attribute setting |
| `element.dataset` | Data attributes |
| `element.innerHTML` | HTML content |
| `element.textContent` | Text content |
| `element.insertAdjacentHTML()` | HTML insertion |
| `element.appendChild()` | DOM insertion |
| `element.removeChild()` | DOM removal |
| `element.cloneNode()` | Cloning |
| `element.parentNode` | Parent access |
| `element.children` | Children access |
| `element.nextElementSibling` | Sibling access |
| `element.offsetWidth/Height` | Dimensions |
| `element.getBoundingClientRect()` | Position |
| `element.scrollTop/Left` | Scroll position |
| `NodeList` | Query results |
| `HTMLCollection` | Live collection |
| `DocumentFragment` | Batch insertion |

### 3.3 Event Concepts

| Concept | Where Used |
|---------|------------|
| `addEventListener()` | Event binding |
| `removeEventListener()` | Event unbinding |
| Event bubbling | Delegation |
| Event capturing | Capture phase |
| `event.target` | Event source |
| `event.currentTarget` | Handler element |
| `event.preventDefault()` | Default prevention |
| `event.stopPropagation()` | Bubble prevention |
| `CustomEvent` | Custom events |
| `DOMContentLoaded` | DOM ready |

### 3.4 Animation Concepts

| Concept | Where Used |
|---------|------------|
| CSS transitions | Fade, slide |
| `requestAnimationFrame` | Smooth animation |
| `setTimeout/setInterval` | Timing |
| CSS transform | Animation |
| CSS opacity | Fading |
| Element dimensions | Sliding |

---

## 4. Implementation Plan

### Phase 1: Core (Priority: High)
```
1. Library structure (IIFE/UMD)
2. Constructor function
3. Selector engine (querySelectorAll wrapper)
4. Prototype setup
5. Chaining mechanism (return this)
6. .each() method
7. .get() and .toArray()
```

### Phase 2: DOM Manipulation (Priority: High)
```
1. .html() / .text() / .val()
2. .attr() / .removeAttr() / .prop()
3. .addClass() / .removeClass() / .toggleClass() / .hasClass()
4. .css()
5. .append() / .prepend() / .after() / .before()
6. .remove() / .empty()
7. .clone()
8. .wrap() / .unwrap()
9. .data()
```

### Phase 3: Traversing (Priority: High)
```
1. .find()
2. .parent() / .parents() / .closest()
3. .children()
4. .siblings()
5. .next() / .nextAll() / .prev() / .prevAll()
6. .first() / .last() / .eq()
7. .filter() / .not() / .is() / .has()
```

### Phase 4: Events (Priority: High)
```
1. .on() / .off()
2. Event delegation
3. .one()
4. .trigger()
5. Event shortcuts (click, keydown, etc.)
6. .hover()
7. .ready()
```

### Phase 5: Effects (Priority: Medium)
```
1. .show() / .hide() / .toggle()
2. .fadeIn() / .fadeOut() / .fadeToggle() / .fadeTo()
3. .slideDown() / .slideUp() / .slideToggle()
4. .animate()
5. .stop() / .finish()
6. .delay()
```

### Phase 6: Dimensions (Priority: Medium)
```
1. .width() / .height()
2. .innerWidth() / .innerHeight()
3. .outerWidth() / .outerHeight()
4. .offset() / .position()
5. .scrollTop() / .scrollLeft()
```

### Phase 7: AJAX (Priority: Medium)
```
1. pluck.ajax()
2. pluck.get() / pluck.post()
3. pluck.getJSON()
4. .load()
5. .serialize() / .serializeArray()
```

### Phase 8: Utilities (Priority: Low)
```
1. pluck.extend()
2. pluck.each() / pluck.map()
3. pluck.isArray() / pluck.isFunction() / etc.
4. pluck.parseJSON() / pluck.parseHTML()
5. pluck.now()
6. pluck.noConflict()
```

---

## 5. File Structure

```
pluck/
├── src/
│   ├── core/
│   │   ├── pluck.js        # Constructor, selection
│   │   ├── utils.js        # each, map, get
│   │   └── init.js         # Initialization
│   │
│   ├── manipulation/
│   │   ├── content.js      # html, text, val
│   │   ├── attributes.js   # attr, prop, data
│   │   ├── classes.js      # addClass, removeClass
│   │   ├── css.js          # css, dimensions
│   │   └── dom.js          # append, remove, wrap
│   │
│   ├── traversing/
│   │   ├── tree.js         # parent, children, find
│   │   ├── filtering.js    # first, last, filter
│   │   └── siblings.js     # next, prev, siblings
│   │
│   ├── events/
│   │   ├── handlers.js     # on, off, one
│   │   ├── trigger.js      # trigger
│   │   └── shortcuts.js    # click, keydown, etc
│   │
│   ├── effects/
│   │   ├── basic.js        # show, hide, toggle
│   │   ├── fading.js       # fadeIn, fadeOut
│   │   ├── sliding.js      # slideUp, slideDown
│   │   └── animate.js      # animate, stop
│   │
│   ├── ajax/
│   │   ├── core.js         # ajax method
│   │   ├── shortcuts.js    # get, post, getJSON
│   │   └── helpers.js      # serialize
│   │
│   └── utilities/
│       ├── types.js        # isArray, isFunction
│       ├── objects.js      # extend, merge
│       └── parsing.js      # parseJSON, parseHTML
│
├── dist/
│   ├── pluck.js            # Full build
│   ├── pluck.min.js        # Minified
│   └── pluck.esm.js        # ES Module
│
├── tests/
│   ├── core.test.js
│   ├── manipulation.test.js
│   ├── traversing.test.js
│   ├── events.test.js
│   └── effects.test.js
│
├── examples/
│   └── index.html          # Demo page
│
├── RESEARCH.md             # This file
├── LEARNING.md             # Concepts to learn
├── README.md               # Documentation
├── package.json
└── rollup.config.js        # Build config
```

---

## 6. Learning Topics

### Must Learn Before Starting
```
1. [ ] IIFE Pattern
2. [ ] Closures
3. [ ] Prototypes & Prototype Chain
4. [ ] this keyword & binding
5. [ ] Constructor functions
6. [ ] Method chaining
7. [ ] DOM API basics
8. [ ] Event handling
```

### Learn While Building
```
1. [ ] UMD/CommonJS/ES Modules
2. [ ] CSS Transitions programmatically
3. [ ] XMLHttpRequest / Fetch API
4. [ ] Event delegation
5. [ ] requestAnimationFrame
6. [ ] getComputedStyle
7. [ ] getBoundingClientRect
8. [ ] insertAdjacentHTML
```

### Advanced (Optional)
```
1. [ ] Build tools (Rollup/Webpack)
2. [ ] Minification
3. [ ] Source maps
4. [ ] npm publishing
5. [ ] Testing (Jest)
6. [ ] TypeScript definitions
```

---

## Sources

- [jQuery API Documentation](https://api.jquery.com/)
- [jQuery Manipulation](https://api.jquery.com/category/manipulation/)
- [jQuery Traversing](https://api.jquery.com/category/traversing/)
- [jQuery Events](https://api.jquery.com/category/events/)
- [jQuery Effects](https://api.jquery.com/category/effects/)
- [jQuery AJAX](https://api.jquery.com/category/ajax/)
- [jQuery Utilities](https://api.jquery.com/category/utilities/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

*Document Created: December 2024*
*For: Pluck.js Development*
