# Pluck.js - Learning Guide

> JavaScript concepts to learn before and while building pluck.js

---

## Table of Contents

1. [IIFE - Immediately Invoked Function Expression](#1-iife---immediately-invoked-function-expression)
2. [Closures](#2-closures)
3. [Prototypes & Prototype Chain](#3-prototypes--prototype-chain)
4. [The `this` Keyword](#4-the-this-keyword)
5. [Constructor Functions](#5-constructor-functions)
6. [Method Chaining](#6-method-chaining)
7. [UMD Pattern](#7-umd-pattern)
8. [DOM APIs](#8-dom-apis)
9. [Event System](#9-event-system)
10. [CSS Manipulation](#10-css-manipulation)
11. [Animation Techniques](#11-animation-techniques)
12. [AJAX & Fetch](#12-ajax--fetch)

---

## 1. IIFE - Immediately Invoked Function Expression

### What is it?
A function that runs immediately after it's defined. Used to create private scope.

### Why we need it?
- Avoid polluting global namespace
- Create private variables
- Module pattern foundation

### Syntax

```javascript
// Basic IIFE
(function() {
  // Private code here
  var privateVar = 'I am private';
  console.log('IIFE runs immediately!');
})();

// IIFE with parameters
(function(global, doc) {
  // 'global' is window
  // 'doc' is document
  global.myLibrary = {};
})(window, document);

// Arrow function IIFE
(() => {
  console.log('Arrow IIFE');
})();

// IIFE that returns value
const result = (function() {
  return 'Hello';
})();
```

### How jQuery/Pluck uses it

```javascript
// Library wrapper pattern
(function(global) {
  'use strict';

  // Private helper (not accessible outside)
  function privateHelper() {
    return 'I am private';
  }

  // Public API
  function Pluck(selector) {
    // ...
  }

  // Expose to global scope
  global.pluck = Pluck;

})(window);

// Now only 'pluck' is global, everything else is private
```

### Practice Exercise
```javascript
// Create an IIFE that:
// 1. Has a private counter
// 2. Exposes increment() and getCount() globally

// Your code here:
(function(global) {
  var count = 0; // private

  global.counter = {
    increment: function() {
      count++;
    },
    getCount: function() {
      return count;
    }
  };
})(window);

counter.increment();
counter.increment();
console.log(counter.getCount()); // 2
console.log(count); // Error: count is not defined
```

---

## 2. Closures

### What is it?
A closure is a function that remembers its outer variables even after the outer function has finished.

### Why we need it?
- Data privacy
- State persistence
- Factory functions
- Event handlers that remember data

### How it works

```javascript
function outer() {
  var x = 10; // This variable stays alive!

  function inner() {
    console.log(x); // inner() "closes over" x
  }

  return inner;
}

const myFunc = outer(); // outer() finishes
myFunc(); // 10 - x is still accessible!
```

### Real Examples

```javascript
// Example 1: Private variables
function createCounter() {
  let count = 0; // Private!

  return {
    increment() { count++; },
    decrement() { count--; },
    getCount() { return count; }
  };
}

const counter = createCounter();
counter.increment();
counter.increment();
console.log(counter.getCount()); // 2
console.log(counter.count); // undefined - it's private!

// Example 2: Function factory
function multiply(x) {
  return function(y) {
    return x * y; // remembers x
  };
}

const double = multiply(2);
const triple = multiply(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// Example 3: Event handlers
function setupButton(name) {
  document.getElementById('btn').addEventListener('click', function() {
    console.log('Button ' + name + ' clicked'); // remembers name
  });
}
```

### How Pluck uses closures

```javascript
(function(global) {
  // Private storage for event handlers (closure)
  const eventStorage = new WeakMap();

  Pluck.prototype.on = function(event, handler) {
    this.each(function() {
      // eventStorage is accessible via closure
      if (!eventStorage.has(this)) {
        eventStorage.set(this, {});
      }
      // ...
    });
    return this;
  };
})(window);
```

### Practice Exercise
```javascript
// Create a function that generates unique IDs
// Each call should return an incremented number

function createIdGenerator() {
  // Your code here
  let id = 0;

  return function() {
    return ++id;
  };
}

const generateId = createIdGenerator();
console.log(generateId()); // 1
console.log(generateId()); // 2
console.log(generateId()); // 3
```

---

## 3. Prototypes & Prototype Chain

### What is it?
JavaScript's inheritance mechanism. Objects can inherit properties from other objects.

### Why we need it?
- Memory efficiency (shared methods)
- Inheritance
- How jQuery-style libraries work

### How it works

```javascript
// Every function has a .prototype property
function Person(name) {
  this.name = name;
}

// Methods defined on prototype are shared by all instances
Person.prototype.sayHello = function() {
  console.log('Hello, I am ' + this.name);
};

const john = new Person('John');
const jane = new Person('Jane');

john.sayHello(); // Hello, I am John
jane.sayHello(); // Hello, I am Jane

// Both share the SAME sayHello function
console.log(john.sayHello === jane.sayHello); // true
```

### Prototype Chain

```javascript
const arr = [1, 2, 3];

// arr --> Array.prototype --> Object.prototype --> null
arr.push(4);        // Found on Array.prototype
arr.toString();     // Found on Object.prototype
arr.hasOwnProperty; // Found on Object.prototype

// Check prototype chain
console.log(arr.__proto__ === Array.prototype); // true
console.log(Array.prototype.__proto__ === Object.prototype); // true
```

### How Pluck uses prototypes

```javascript
function Pluck(selector) {
  this.elements = document.querySelectorAll(selector);
  this.length = this.elements.length;
}

// All instances share these methods
Pluck.prototype.each = function(callback) {
  this.elements.forEach(callback);
  return this;
};

Pluck.prototype.addClass = function(className) {
  return this.each(function() {
    this.classList.add(className);
  });
};

Pluck.prototype.css = function(prop, value) {
  return this.each(function() {
    this.style[prop] = value;
  });
};

// Usage
const btns = new Pluck('.btn');
btns.addClass('active').css('color', 'red');
```

### Memory Comparison

```javascript
// BAD: Methods created for each instance
function BadPluck(selector) {
  this.elements = document.querySelectorAll(selector);

  // Each instance gets its own copy!
  this.addClass = function(className) { /* ... */ };
  this.css = function(prop, value) { /* ... */ };
}

// 1000 instances = 1000 copies of each method = memory waste!

// GOOD: Methods on prototype (shared)
function GoodPluck(selector) {
  this.elements = document.querySelectorAll(selector);
}

GoodPluck.prototype.addClass = function(className) { /* ... */ };
GoodPluck.prototype.css = function(prop, value) { /* ... */ };

// 1000 instances = 1 copy of each method = efficient!
```

### Prototype Shorthand

```javascript
// jQuery style: Pluck.fn = Pluck.prototype
function Pluck(selector) {
  this.elements = document.querySelectorAll(selector);
}

Pluck.fn = Pluck.prototype;

// Now we can use shorter syntax
Pluck.fn.addClass = function(className) { /* ... */ };
Pluck.fn.css = function(prop, value) { /* ... */ };
Pluck.fn.html = function(content) { /* ... */ };
```

---

## 4. The `this` Keyword

### What is it?
A special keyword that refers to the "context" in which a function is called.

### The Rules (in order of priority)

```javascript
// Rule 1: new binding
function Person(name) {
  this.name = name; // this = new object being created
}
const p = new Person('John'); // this = p

// Rule 2: Explicit binding (call, apply, bind)
function greet() {
  console.log('Hello, ' + this.name);
}
const obj = { name: 'John' };
greet.call(obj);  // this = obj
greet.apply(obj); // this = obj
const bound = greet.bind(obj);
bound(); // this = obj

// Rule 3: Implicit binding (method call)
const person = {
  name: 'John',
  greet() {
    console.log('Hello, ' + this.name); // this = person
  }
};
person.greet();

// Rule 4: Default binding
function show() {
  console.log(this); // this = window (or undefined in strict mode)
}
show();
```

### Common Gotchas

```javascript
// Problem: Lost 'this' in callbacks
const obj = {
  name: 'John',
  greetLater() {
    setTimeout(function() {
      console.log(this.name); // undefined! 'this' is window
    }, 1000);
  }
};

// Solution 1: Arrow function (inherits this)
const obj1 = {
  name: 'John',
  greetLater() {
    setTimeout(() => {
      console.log(this.name); // 'John' - arrow inherits this
    }, 1000);
  }
};

// Solution 2: Store this in variable
const obj2 = {
  name: 'John',
  greetLater() {
    const self = this;
    setTimeout(function() {
      console.log(self.name); // 'John'
    }, 1000);
  }
};

// Solution 3: Bind
const obj3 = {
  name: 'John',
  greetLater() {
    setTimeout(function() {
      console.log(this.name);
    }.bind(this), 1000); // 'John'
  }
};
```

### How Pluck uses `this`

```javascript
Pluck.prototype.each = function(callback) {
  this.elements.forEach((el, index) => {
    // callback.call(el, ...) makes 'this' inside callback = el
    callback.call(el, index, el);
  });
  return this; // return Pluck instance for chaining
};

// Usage
pluck('.btn').each(function(index, element) {
  // 'this' is the current DOM element
  this.classList.add('processed');
  console.log(this.textContent);
});
```

---

## 5. Constructor Functions

### What is it?
Functions designed to create objects using `new` keyword.

### Convention
- Start with capital letter
- Called with `new`

### How it works

```javascript
function Car(make, model) {
  // 'new' creates empty object: {}
  // 'this' points to that empty object

  this.make = make;
  this.model = model;
  this.speed = 0;

  // Implicitly returns 'this'
}

Car.prototype.accelerate = function() {
  this.speed += 10;
  return this;
};

// Usage
const myCar = new Car('Toyota', 'Camry');
console.log(myCar.make); // 'Toyota'
myCar.accelerate().accelerate();
console.log(myCar.speed); // 20
```

### What `new` does

```javascript
function Person(name) {
  this.name = name;
}

// When you call: new Person('John')
// JavaScript does this:

// 1. Create empty object
const obj = {};

// 2. Set prototype
obj.__proto__ = Person.prototype;

// 3. Call function with 'this' = obj
Person.call(obj, 'John');

// 4. Return obj (unless function returns different object)
return obj;
```

### Pluck Constructor

```javascript
function Pluck(selector, context) {
  // Allow calling without 'new'
  if (!(this instanceof Pluck)) {
    return new Pluck(selector, context);
  }

  // Initialize
  this.elements = [];

  // Handle different selector types
  if (typeof selector === 'string') {
    this.elements = Array.from(document.querySelectorAll(selector));
  } else if (selector instanceof Element) {
    this.elements = [selector];
  } else if (selector instanceof NodeList) {
    this.elements = Array.from(selector);
  }

  this.length = this.elements.length;
}

// Can call with or without 'new'
const a = new Pluck('.btn');
const b = Pluck('.btn'); // Also works!
```

---

## 6. Method Chaining

### What is it?
Calling multiple methods in sequence on the same object.

### How it works
Each method returns `this` (the object itself).

```javascript
// Without chaining
const el = pluck('.box');
el.addClass('active');
el.css('color', 'red');
el.hide();

// With chaining
pluck('.box')
  .addClass('active')
  .css('color', 'red')
  .hide();
```

### Implementation

```javascript
function Pluck(selector) {
  this.elements = document.querySelectorAll(selector);
}

// Each method returns 'this'
Pluck.prototype.addClass = function(className) {
  this.elements.forEach(el => el.classList.add(className));
  return this; // Enable chaining!
};

Pluck.prototype.removeClass = function(className) {
  this.elements.forEach(el => el.classList.remove(className));
  return this; // Enable chaining!
};

Pluck.prototype.css = function(prop, value) {
  this.elements.forEach(el => el.style[prop] = value);
  return this; // Enable chaining!
};

// Now chaining works!
new Pluck('.btn')
  .addClass('active')
  .removeClass('disabled')
  .css('background', 'blue');
```

### Getter Methods (Don't Chain)

```javascript
// Some methods return values, not 'this'
Pluck.prototype.html = function(content) {
  // Getter - return value
  if (content === undefined) {
    return this.elements[0]?.innerHTML || '';
  }
  // Setter - return this for chaining
  this.elements.forEach(el => el.innerHTML = content);
  return this;
};

// Usage
const html = pluck('.box').html(); // Returns string, can't chain
pluck('.box').html('<b>New</b>').addClass('updated'); // Setter, can chain
```

---

## 7. UMD Pattern

### What is it?
Universal Module Definition - code that works in all environments.

### Why we need it?
Different environments load modules differently:
- Browser: global variables (`window.jQuery`)
- Node.js: CommonJS (`require()`)
- ES Modules: `import/export`
- AMD: `define()` (RequireJS)

### UMD Template

```javascript
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD (RequireJS)
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node.js / CommonJS
    module.exports = factory();
  } else {
    // Browser globals
    root.Pluck = factory();
  }
})(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  // Your library code here
  function Pluck(selector) {
    // ...
  }

  return Pluck;
});
```

### Usage in Different Environments

```javascript
// Browser
<script src="pluck.js"></script>
<script>
  pluck('.btn').addClass('active');
</script>

// Node.js
const pluck = require('./pluck');

// ES Modules
import pluck from './pluck.esm.js';

// AMD (RequireJS)
require(['pluck'], function(pluck) {
  pluck('.btn').addClass('active');
});
```

---

## 8. DOM APIs

### Selection

```javascript
// Single element
document.getElementById('myId');
document.querySelector('.myClass');
document.querySelector('div.container > p');

// Multiple elements
document.getElementsByClassName('myClass'); // Live HTMLCollection
document.getElementsByTagName('div');       // Live HTMLCollection
document.querySelectorAll('.myClass');      // Static NodeList

// Context-based selection
element.querySelector('.child');
element.querySelectorAll('.child');
```

### Element Properties

```javascript
const el = document.querySelector('.box');

// Content
el.innerHTML;          // HTML string
el.outerHTML;          // Including element itself
el.textContent;        // Text only
el.innerText;          // Visible text only

// Attributes
el.id;
el.className;
el.classList;          // DOMTokenList
el.getAttribute('data-id');
el.setAttribute('data-id', '123');
el.removeAttribute('data-id');
el.hasAttribute('data-id');
el.dataset.id;         // data-id attribute

// Relationships
el.parentNode;         // Parent (including document)
el.parentElement;      // Parent element only
el.children;           // Child elements (HTMLCollection)
el.childNodes;         // All child nodes (NodeList)
el.firstChild;         // First child node
el.firstElementChild;  // First child element
el.lastChild;
el.lastElementChild;
el.nextSibling;        // Next node
el.nextElementSibling; // Next element
el.previousSibling;
el.previousElementSibling;
```

### Creating & Modifying

```javascript
// Create
const div = document.createElement('div');
const text = document.createTextNode('Hello');
const fragment = document.createDocumentFragment();

// Insert
parent.appendChild(child);
parent.insertBefore(newChild, referenceChild);
parent.replaceChild(newChild, oldChild);
el.insertAdjacentHTML('beforebegin', '<p>Before</p>');
el.insertAdjacentHTML('afterbegin', '<p>First child</p>');
el.insertAdjacentHTML('beforeend', '<p>Last child</p>');
el.insertAdjacentHTML('afterend', '<p>After</p>');

// Remove
parent.removeChild(child);
el.remove(); // Modern

// Clone
el.cloneNode();      // Shallow
el.cloneNode(true);  // Deep (with children)
```

### Classes

```javascript
el.classList.add('active');
el.classList.add('one', 'two', 'three');
el.classList.remove('active');
el.classList.toggle('active');
el.classList.toggle('active', true);  // Force add
el.classList.toggle('active', false); // Force remove
el.classList.contains('active');      // Boolean
el.classList.replace('old', 'new');
```

### Styles

```javascript
// Inline styles
el.style.color = 'red';
el.style.backgroundColor = 'blue';
el.style.cssText = 'color: red; background: blue;';

// Computed styles (read-only, all values)
const styles = getComputedStyle(el);
styles.color;
styles.getPropertyValue('color');
```

### Dimensions & Position

```javascript
// Dimensions
el.offsetWidth;   // Width + padding + border
el.offsetHeight;
el.clientWidth;   // Width + padding (no border, no scrollbar)
el.clientHeight;
el.scrollWidth;   // Full scrollable width
el.scrollHeight;

// Position
el.offsetTop;     // From offsetParent
el.offsetLeft;
el.offsetParent;  // Nearest positioned ancestor

// Precise position
const rect = el.getBoundingClientRect();
rect.top;         // From viewport top
rect.left;
rect.bottom;
rect.right;
rect.width;
rect.height;
rect.x;           // Same as left
rect.y;           // Same as top

// Scroll
el.scrollTop;     // Pixels scrolled
el.scrollLeft;
el.scrollTo(x, y);
el.scrollBy(x, y);
el.scrollIntoView();
```

### Checking

```javascript
// Does element match selector?
el.matches('.active');
el.matches('div.container');

// Find closest ancestor matching selector
el.closest('.container');
el.closest('form');

// Is element contained in another?
parent.contains(child); // Boolean
```

---

## 9. Event System

### Adding Event Listeners

```javascript
// Modern way
el.addEventListener('click', function(event) {
  console.log('Clicked!', event);
});

// With options
el.addEventListener('click', handler, {
  capture: false,  // Use capture phase
  once: true,      // Remove after first trigger
  passive: true    // Won't call preventDefault()
});

// Remove listener
el.removeEventListener('click', handler);
```

### Event Object

```javascript
el.addEventListener('click', function(event) {
  // Target info
  event.target;         // Element that triggered event
  event.currentTarget;  // Element handler is attached to

  // Event info
  event.type;           // 'click'
  event.timeStamp;      // When it happened

  // Position (mouse events)
  event.clientX;        // From viewport
  event.clientY;
  event.pageX;          // From document
  event.pageY;
  event.screenX;        // From screen
  event.screenY;

  // Keyboard
  event.key;            // 'Enter', 'a', etc.
  event.code;           // 'Enter', 'KeyA', etc.
  event.keyCode;        // Deprecated
  event.altKey;         // Boolean
  event.ctrlKey;
  event.shiftKey;
  event.metaKey;        // Cmd on Mac

  // Control
  event.preventDefault();  // Stop default action
  event.stopPropagation(); // Stop bubbling
  event.stopImmediatePropagation(); // Stop all handlers
});
```

### Event Delegation

```javascript
// Instead of adding listener to each button...
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', handler);
});

// Add one listener to parent (event delegation)
document.querySelector('.container').addEventListener('click', function(e) {
  // Check if clicked element matches
  if (e.target.matches('.btn')) {
    console.log('Button clicked:', e.target);
  }

  // Or find closest matching ancestor
  const btn = e.target.closest('.btn');
  if (btn) {
    console.log('Button clicked:', btn);
  }
});

// Benefits:
// 1. Less memory (one handler vs many)
// 2. Works for dynamically added elements
// 3. Cleaner code
```

### Custom Events

```javascript
// Create custom event
const event = new CustomEvent('myEvent', {
  detail: { message: 'Hello!' },
  bubbles: true,
  cancelable: true
});

// Dispatch it
el.dispatchEvent(event);

// Listen for it
el.addEventListener('myEvent', function(e) {
  console.log(e.detail.message); // 'Hello!'
});
```

### Common Events

```javascript
// Mouse
'click', 'dblclick', 'mousedown', 'mouseup', 'mousemove',
'mouseenter', 'mouseleave', 'mouseover', 'mouseout',
'contextmenu', 'wheel'

// Keyboard
'keydown', 'keyup', 'keypress'

// Form
'focus', 'blur', 'input', 'change', 'submit', 'reset'

// Document/Window
'DOMContentLoaded', 'load', 'unload', 'resize', 'scroll'

// Touch
'touchstart', 'touchmove', 'touchend', 'touchcancel'

// Drag
'dragstart', 'drag', 'dragend', 'dragenter', 'dragleave',
'dragover', 'drop'
```

---

## 10. CSS Manipulation

### Inline Styles

```javascript
// Set single property
el.style.color = 'red';
el.style.backgroundColor = 'blue'; // camelCase!
el.style.fontSize = '16px';

// Set multiple
Object.assign(el.style, {
  color: 'red',
  backgroundColor: 'blue',
  fontSize: '16px'
});

// Set via cssText
el.style.cssText = 'color: red; background-color: blue;';

// Remove property
el.style.color = '';
el.style.removeProperty('color');
```

### Computed Styles

```javascript
// Get actual computed value
const styles = getComputedStyle(el);
styles.color;                    // 'rgb(255, 0, 0)'
styles.getPropertyValue('color');

// Get pseudo-element styles
const before = getComputedStyle(el, '::before');
before.content;
```

### CSS Classes (Best Practice)

```javascript
// Toggle states via classes (better than inline styles)
el.classList.add('active');
el.classList.remove('hidden');
el.classList.toggle('expanded');

// CSS handles the actual styling
// .active { background: blue; }
// .hidden { display: none; }
// .expanded { height: auto; }
```

---

## 11. Animation Techniques

### CSS Transitions

```javascript
// Add transition via CSS
// .box { transition: all 0.3s ease; }

// Then change property - it animates!
el.style.opacity = '0';
el.style.transform = 'translateX(100px)';

// Programmatically
el.style.transition = 'opacity 0.3s ease';
el.style.opacity = '0';

// Wait for transition end
el.addEventListener('transitionend', function(e) {
  console.log('Transition finished:', e.propertyName);
});
```

### requestAnimationFrame

```javascript
// Smooth animations (60fps)
function animate() {
  // Update something
  el.style.left = (parseFloat(el.style.left) + 1) + 'px';

  // Continue if not done
  if (parseFloat(el.style.left) < 100) {
    requestAnimationFrame(animate);
  }
}

requestAnimationFrame(animate);

// With timing
function animateWithTiming(duration) {
  const start = performance.now();

  function step(timestamp) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);

    // Apply easing
    const eased = easeOutQuad(progress);
    el.style.opacity = eased;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// Easing function
function easeOutQuad(t) {
  return t * (2 - t);
}
```

### Fade In/Out

```javascript
function fadeOut(el, duration = 400) {
  el.style.transition = `opacity ${duration}ms`;
  el.style.opacity = '0';

  setTimeout(() => {
    el.style.display = 'none';
    el.style.transition = '';
  }, duration);
}

function fadeIn(el, duration = 400) {
  el.style.opacity = '0';
  el.style.display = '';

  // Force reflow
  el.offsetHeight;

  el.style.transition = `opacity ${duration}ms`;
  el.style.opacity = '1';

  setTimeout(() => {
    el.style.transition = '';
  }, duration);
}
```

### Slide Up/Down

```javascript
function slideUp(el, duration = 400) {
  el.style.overflow = 'hidden';
  el.style.height = el.scrollHeight + 'px';
  el.style.transition = `height ${duration}ms`;

  // Force reflow
  el.offsetHeight;

  el.style.height = '0';

  setTimeout(() => {
    el.style.display = 'none';
    el.style.height = '';
    el.style.overflow = '';
    el.style.transition = '';
  }, duration);
}

function slideDown(el, duration = 400) {
  el.style.display = '';
  const height = el.scrollHeight;

  el.style.overflow = 'hidden';
  el.style.height = '0';
  el.style.transition = `height ${duration}ms`;

  // Force reflow
  el.offsetHeight;

  el.style.height = height + 'px';

  setTimeout(() => {
    el.style.height = '';
    el.style.overflow = '';
    el.style.transition = '';
  }, duration);
}
```

---

## 12. AJAX & Fetch

### XMLHttpRequest (Old Way)

```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/data', true);

xhr.onload = function() {
  if (xhr.status >= 200 && xhr.status < 300) {
    const data = JSON.parse(xhr.responseText);
    console.log(data);
  } else {
    console.error('Request failed');
  }
};

xhr.onerror = function() {
  console.error('Network error');
};

xhr.send();

// POST with data
xhr.open('POST', '/api/data', true);
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send(JSON.stringify({ name: 'John' }));
```

### Fetch API (Modern)

```javascript
// GET
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// POST
fetch('/api/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'John' })
})
  .then(response => response.json())
  .then(data => console.log(data));

// Async/await
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('Not OK');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
```

### Wrapping for jQuery-style

```javascript
function ajax(options) {
  const defaults = {
    method: 'GET',
    url: '',
    data: null,
    headers: {},
    dataType: 'json'
  };

  const settings = { ...defaults, ...options };

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(settings.method, settings.url, true);

    // Set headers
    for (const key in settings.headers) {
      xhr.setRequestHeader(key, settings.headers[key]);
    }

    xhr.onload = function() {
      let response = xhr.responseText;
      if (settings.dataType === 'json') {
        response = JSON.parse(response);
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        if (settings.success) settings.success(response);
        resolve(response);
      } else {
        if (settings.error) settings.error(xhr);
        reject(new Error(xhr.statusText));
      }
    };

    xhr.onerror = function() {
      if (settings.error) settings.error(xhr);
      reject(new Error('Network Error'));
    };

    xhr.send(settings.data ? JSON.stringify(settings.data) : null);
  });
}

// Usage
ajax({
  url: '/api/users',
  method: 'GET',
  success: data => console.log(data),
  error: err => console.error(err)
});
```

---

## Checklist

Use this checklist to track your learning:

### Essential (Learn First)
- [ ] IIFE Pattern
- [ ] Closures
- [ ] Prototypes
- [ ] `this` keyword
- [ ] Constructor functions
- [ ] Method chaining
- [ ] DOM Selection APIs
- [ ] DOM Manipulation APIs
- [ ] Event Listeners

### Important (Learn While Building)
- [ ] UMD Pattern
- [ ] Event Delegation
- [ ] CSS Transitions
- [ ] getComputedStyle
- [ ] getBoundingClientRect
- [ ] insertAdjacentHTML
- [ ] XMLHttpRequest

### Nice to Have
- [ ] requestAnimationFrame
- [ ] Custom Events
- [ ] Fetch API
- [ ] Promises
- [ ] ES6 Classes

---

*Created for Pluck.js Development*
*December 2024*
