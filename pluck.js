/**
 * Pluck.js - A lightweight jQuery alternative
 * Version: 2.0.0
 * Author: Sayed Abdul Karim
 * License: MIT
 *
 * Complete jQuery-compatible API including:
 * - Deferred/Promises ($.Deferred, $.when)
 * - Callbacks ($.Callbacks)
 * - Animation Queue (.queue, .dequeue, .clearQueue, .promise)
 * - Global AJAX Events (.ajaxStart, .ajaxStop, etc.)
 * - Custom Selectors (:hidden, :visible, :animated, etc.)
 * - All traversing, manipulation, and effect methods
 *
 * Usage: pluck('.selector') or p('.selector')
 */

(function(global, factory) {
  'use strict';

  // UMD (Universal Module Definition)
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(global);
  } else if (typeof define === 'function' && define.amd) {
    define(function() { return factory(global); });
  } else {
    factory(global);
  }
})(typeof window !== 'undefined' ? window : this, function(global) {

  'use strict';

  // ============================================
  // SECTION 1: CORE - Constructor & Selection
  // ============================================

  /**
   * Pluck Constructor
   * @param {string|Element|NodeList|Function} selector
   * @param {Element} context - Optional context for selection
   */
  function Pluck(selector, context) {
    if (!(this instanceof Pluck)) {
      return new Pluck(selector, context);
    }

    this.elements = [];
    this.length = 0;
    this._prevObject = null;

    if (!selector) {
      return this;
    }

    // Function - DOM ready
    if (typeof selector === 'function') {
      return this.ready(selector);
    }

    // String selector
    if (typeof selector === 'string') {
      selector = selector.trim();

      // HTML string - create elements
      if (selector[0] === '<' && selector[selector.length - 1] === '>' && selector.length >= 3) {
        const temp = document.createElement('div');
        temp.innerHTML = selector;
        this.elements = Array.from(temp.children);
      } else {
        // Query selector
        const ctx = context ? (context instanceof Pluck ? context.elements[0] : context) : document;
        try {
          this.elements = Array.from(ctx.querySelectorAll(selector));
        } catch (e) {
          this.elements = [];
        }
      }
    }
    // Single Element
    else if (selector instanceof Element || selector === document || selector === window) {
      this.elements = [selector];
    }
    // NodeList or HTMLCollection
    else if (selector instanceof NodeList || selector instanceof HTMLCollection) {
      this.elements = Array.from(selector);
    }
    // Array
    else if (Array.isArray(selector)) {
      this.elements = selector.filter(el => el instanceof Element || el === document || el === window);
    }
    // Pluck instance
    else if (selector instanceof Pluck) {
      return selector;
    }

    this.length = this.elements.length;

    // Add indexed access
    for (let i = 0; i < this.length; i++) {
      this[i] = this.elements[i];
    }

    return this;
  }

  // Prototype shorthand (like jQuery.fn)
  Pluck.fn = Pluck.prototype;

  // ============================================
  // SECTION 2: UTILITIES - Helper Methods
  // ============================================

  /**
   * Iterate over elements
   */
  Pluck.fn.each = function(callback) {
    this.elements.forEach((el, index) => {
      callback.call(el, index, el);
    });
    return this;
  };

  /**
   * Map elements to new array
   */
  Pluck.fn.map = function(callback) {
    const results = this.elements.map((el, index) => callback.call(el, index, el));
    return new Pluck(results.filter(r => r != null));
  };

  /**
   * Get element at index or get all elements
   */
  Pluck.fn.get = function(index) {
    if (index === undefined) {
      return this.elements.slice();
    }
    return index < 0 ? this.elements[this.length + index] : this.elements[index];
  };

  /**
   * Convert to array
   */
  Pluck.fn.toArray = function() {
    return this.elements.slice();
  };

  /**
   * Get index of element
   */
  Pluck.fn.index = function(selector) {
    if (!selector) {
      const el = this.elements[0];
      if (!el || !el.parentNode) return -1;
      return Array.from(el.parentNode.children).indexOf(el);
    }
    if (typeof selector === 'string') {
      return new Pluck(selector).elements.indexOf(this.elements[0]);
    }
    const searchEl = selector instanceof Pluck ? selector.elements[0] : selector;
    return this.elements.indexOf(searchEl);
  };

  // ============================================
  // SECTION 3: DOM MANIPULATION - Content
  // ============================================

  /**
   * Get or set innerHTML
   */
  Pluck.fn.html = function(content) {
    if (content === undefined) {
      return this.elements[0]?.innerHTML || '';
    }
    if (typeof content === 'function') {
      return this.each(function(i) {
        const val = content.call(this, i, this.innerHTML);
        this.innerHTML = val;
      });
    }
    return this.each(function() {
      this.innerHTML = content;
    });
  };

  /**
   * Get or set textContent
   */
  Pluck.fn.text = function(content) {
    if (content === undefined) {
      return this.elements.map(el => el.textContent).join('');
    }
    if (typeof content === 'function') {
      return this.each(function(i) {
        const val = content.call(this, i, this.textContent);
        this.textContent = val;
      });
    }
    return this.each(function() {
      this.textContent = content;
    });
  };

  /**
   * Get or set value (for form elements)
   */
  Pluck.fn.val = function(value) {
    if (value === undefined) {
      const el = this.elements[0];
      if (!el) return undefined;

      // Handle select multiple
      if (el.multiple && el.tagName === 'SELECT') {
        return Array.from(el.selectedOptions).map(opt => opt.value);
      }
      return el.value;
    }
    if (typeof value === 'function') {
      return this.each(function(i) {
        const val = value.call(this, i, this.value);
        this.value = val;
      });
    }
    return this.each(function() {
      this.value = value;
    });
  };

  // ============================================
  // SECTION 4: DOM MANIPULATION - Attributes
  // ============================================

  /**
   * Get or set attribute
   */
  Pluck.fn.attr = function(name, value) {
    if (typeof name === 'string' && value === undefined) {
      return this.elements[0]?.getAttribute(name);
    }
    if (typeof name === 'object') {
      return this.each(function() {
        for (const key in name) {
          if (name[key] === null) {
            this.removeAttribute(key);
          } else {
            this.setAttribute(key, name[key]);
          }
        }
      });
    }
    if (typeof value === 'function') {
      return this.each(function(i) {
        const val = value.call(this, i, this.getAttribute(name));
        if (val === null) {
          this.removeAttribute(name);
        } else {
          this.setAttribute(name, val);
        }
      });
    }
    return this.each(function() {
      if (value === null) {
        this.removeAttribute(name);
      } else {
        this.setAttribute(name, value);
      }
    });
  };

  /**
   * Remove attribute
   */
  Pluck.fn.removeAttr = function(name) {
    const names = name.split(/\s+/);
    return this.each(function() {
      names.forEach(n => this.removeAttribute(n));
    });
  };

  /**
   * Get or set property
   */
  Pluck.fn.prop = function(name, value) {
    if (typeof name === 'string' && value === undefined) {
      return this.elements[0]?.[name];
    }
    if (typeof name === 'object') {
      return this.each(function() {
        for (const key in name) {
          this[key] = name[key];
        }
      });
    }
    return this.each(function() {
      this[name] = value;
    });
  };

  /**
   * Remove property
   */
  Pluck.fn.removeProp = function(name) {
    return this.each(function() {
      try {
        delete this[name];
      } catch (e) {
        // Some properties can't be deleted
      }
    });
  };

  /**
   * Get or set data attribute
   */
  Pluck.fn.data = function(key, value) {
    if (key === undefined) {
      const el = this.elements[0];
      if (!el) return undefined;
      const data = {};
      for (const k in el.dataset) {
        data[k] = tryParseJSON(el.dataset[k]);
      }
      return data;
    }
    if (typeof key === 'object') {
      return this.each(function() {
        for (const k in key) {
          this.dataset[camelToKebab(k)] = typeof key[k] === 'object' ? JSON.stringify(key[k]) : key[k];
        }
      });
    }
    if (value === undefined) {
      const data = this.elements[0]?.dataset[key];
      return tryParseJSON(data);
    }
    return this.each(function() {
      this.dataset[key] = typeof value === 'object' ? JSON.stringify(value) : value;
    });
  };

  /**
   * Remove data attribute
   */
  Pluck.fn.removeData = function(key) {
    if (key === undefined) {
      return this.each(function() {
        for (const k in this.dataset) {
          delete this.dataset[k];
        }
      });
    }
    const keys = key.split(/\s+/);
    return this.each(function() {
      keys.forEach(k => delete this.dataset[k]);
    });
  };

  // ============================================
  // SECTION 5: DOM MANIPULATION - CSS & Classes
  // ============================================

  /**
   * Get or set CSS styles
   */
  Pluck.fn.css = function(prop, value) {
    // Get computed style
    if (typeof prop === 'string' && value === undefined) {
      const el = this.elements[0];
      if (!el) return undefined;
      const computed = getComputedStyle(el);
      return computed.getPropertyValue(prop) || computed[prop];
    }
    // Set multiple styles
    if (typeof prop === 'object') {
      return this.each(function() {
        for (const key in prop) {
          setStyle(this, key, prop[key]);
        }
      });
    }
    // Set with function
    if (typeof value === 'function') {
      return this.each(function(i) {
        const current = getComputedStyle(this)[prop];
        const val = value.call(this, i, current);
        setStyle(this, prop, val);
      });
    }
    // Set single style
    return this.each(function() {
      setStyle(this, prop, value);
    });
  };

  /**
   * Add class(es)
   */
  Pluck.fn.addClass = function(className) {
    if (typeof className === 'function') {
      return this.each(function(i) {
        const classes = className.call(this, i, this.className);
        if (classes) {
          classes.split(/\s+/).filter(c => c).forEach(c => this.classList.add(c));
        }
      });
    }
    const classes = className.split(/\s+/).filter(c => c);
    return this.each(function() {
      this.classList.add(...classes);
    });
  };

  /**
   * Remove class(es)
   */
  Pluck.fn.removeClass = function(className) {
    if (className === undefined) {
      return this.each(function() {
        this.className = '';
      });
    }
    if (typeof className === 'function') {
      return this.each(function(i) {
        const classes = className.call(this, i, this.className);
        if (classes) {
          classes.split(/\s+/).filter(c => c).forEach(c => this.classList.remove(c));
        }
      });
    }
    const classes = className.split(/\s+/).filter(c => c);
    return this.each(function() {
      this.classList.remove(...classes);
    });
  };

  /**
   * Toggle class(es)
   */
  Pluck.fn.toggleClass = function(className, state) {
    if (typeof className === 'function') {
      return this.each(function(i) {
        const classes = className.call(this, i, this.className, state);
        new Pluck(this).toggleClass(classes, state);
      });
    }
    const classes = className.split(/\s+/).filter(c => c);
    return this.each(function() {
      classes.forEach(cls => {
        if (state !== undefined) {
          this.classList.toggle(cls, state);
        } else {
          this.classList.toggle(cls);
        }
      });
    });
  };

  /**
   * Check if element has class
   */
  Pluck.fn.hasClass = function(className) {
    return this.elements.some(el => el.classList?.contains(className));
  };

  // ============================================
  // SECTION 6: DOM MANIPULATION - Insertion
  // ============================================

  /**
   * Append content to elements
   */
  Pluck.fn.append = function(...contents) {
    return this.each(function() {
      contents.forEach(content => {
        if (typeof content === 'string') {
          this.insertAdjacentHTML('beforeend', content);
        } else if (content instanceof Element) {
          this.appendChild(content);
        } else if (content instanceof Pluck) {
          content.elements.forEach(el => this.appendChild(el));
        } else if (typeof content === 'function') {
          const result = content.call(this, this.children.length, this.innerHTML);
          new Pluck(this).append(result);
        }
      });
    });
  };

  /**
   * Prepend content to elements
   */
  Pluck.fn.prepend = function(...contents) {
    return this.each(function() {
      const parent = this;
      contents.reverse().forEach(content => {
        if (typeof content === 'string') {
          parent.insertAdjacentHTML('afterbegin', content);
        } else if (content instanceof Element) {
          parent.insertBefore(content, parent.firstChild);
        } else if (content instanceof Pluck) {
          content.elements.reverse().forEach(el => parent.insertBefore(el, parent.firstChild));
        } else if (typeof content === 'function') {
          const result = content.call(parent, parent.children.length, parent.innerHTML);
          new Pluck(parent).prepend(result);
        }
      });
    });
  };

  /**
   * Insert content before elements
   */
  Pluck.fn.before = function(...contents) {
    return this.each(function() {
      const el = this;
      contents.forEach(content => {
        if (typeof content === 'string') {
          el.insertAdjacentHTML('beforebegin', content);
        } else if (content instanceof Element) {
          el.parentNode.insertBefore(content, el);
        } else if (content instanceof Pluck) {
          content.elements.forEach(c => el.parentNode.insertBefore(c, el));
        } else if (typeof content === 'function') {
          const result = content.call(el, Array.from(el.parentNode.children).indexOf(el));
          new Pluck(el).before(result);
        }
      });
    });
  };

  /**
   * Insert content after elements
   */
  Pluck.fn.after = function(...contents) {
    return this.each(function() {
      const el = this;
      contents.reverse().forEach(content => {
        if (typeof content === 'string') {
          el.insertAdjacentHTML('afterend', content);
        } else if (content instanceof Element) {
          el.parentNode.insertBefore(content, el.nextSibling);
        } else if (content instanceof Pluck) {
          content.elements.reverse().forEach(c => el.parentNode.insertBefore(c, el.nextSibling));
        } else if (typeof content === 'function') {
          const result = content.call(el, Array.from(el.parentNode.children).indexOf(el));
          new Pluck(el).after(result);
        }
      });
    });
  };

  /**
   * Append elements to target
   */
  Pluck.fn.appendTo = function(target) {
    const targetEl = new Pluck(target);
    this.elements.forEach(el => {
      targetEl.elements.forEach((t, i) => {
        t.appendChild(i === 0 ? el : el.cloneNode(true));
      });
    });
    return this;
  };

  /**
   * Prepend elements to target
   */
  Pluck.fn.prependTo = function(target) {
    const targetEl = new Pluck(target);
    this.elements.forEach(el => {
      targetEl.elements.forEach((t, i) => {
        t.insertBefore(i === 0 ? el : el.cloneNode(true), t.firstChild);
      });
    });
    return this;
  };

  /**
   * Insert elements after target
   */
  Pluck.fn.insertAfter = function(target) {
    const targetEl = new Pluck(target);
    this.elements.forEach(el => {
      targetEl.elements.forEach((t, i) => {
        t.parentNode.insertBefore(i === 0 ? el : el.cloneNode(true), t.nextSibling);
      });
    });
    return this;
  };

  /**
   * Insert elements before target
   */
  Pluck.fn.insertBefore = function(target) {
    const targetEl = new Pluck(target);
    this.elements.forEach(el => {
      targetEl.elements.forEach((t, i) => {
        t.parentNode.insertBefore(i === 0 ? el : el.cloneNode(true), t);
      });
    });
    return this;
  };

  // ============================================
  // SECTION 7: DOM MANIPULATION - Removal & Cloning
  // ============================================

  /**
   * Remove elements from DOM
   */
  Pluck.fn.remove = function(selector) {
    return this.each(function() {
      if (!selector || new Pluck(this).is(selector)) {
        this.parentNode?.removeChild(this);
      }
    });
  };

  /**
   * Detach elements (keep events/data)
   */
  Pluck.fn.detach = function(selector) {
    return this.remove(selector);
  };

  /**
   * Empty element contents
   */
  Pluck.fn.empty = function() {
    return this.each(function() {
      while (this.firstChild) {
        this.removeChild(this.firstChild);
      }
    });
  };

  /**
   * Clone elements
   */
  Pluck.fn.clone = function(withDataAndEvents = false, deepWithDataAndEvents) {
    const cloned = this.elements.map(el => {
      const clone = el.cloneNode(true);
      // Note: Data and events cloning would require additional tracking
      return clone;
    });
    return new Pluck(cloned);
  };

  /**
   * Wrap elements
   */
  Pluck.fn.wrap = function(wrapper) {
    return this.each(function() {
      let wrap;
      if (typeof wrapper === 'function') {
        wrap = wrapper.call(this, Array.from(this.parentNode.children).indexOf(this));
      } else {
        wrap = wrapper;
      }

      if (typeof wrap === 'string') {
        const temp = document.createElement('div');
        temp.innerHTML = wrap;
        wrap = temp.firstElementChild;
      } else if (wrap instanceof Pluck) {
        wrap = wrap.elements[0];
      }

      if (wrap) {
        const clone = wrap.cloneNode(true);
        this.parentNode.insertBefore(clone, this);
        // Find innermost element
        let inner = clone;
        while (inner.firstElementChild) {
          inner = inner.firstElementChild;
        }
        inner.appendChild(this);
      }
    });
  };

  /**
   * Wrap all elements together
   */
  Pluck.fn.wrapAll = function(wrapper) {
    if (this.elements.length === 0) return this;

    let wrap;
    if (typeof wrapper === 'function') {
      wrap = wrapper.call(this.elements[0]);
    } else if (typeof wrapper === 'string') {
      const temp = document.createElement('div');
      temp.innerHTML = wrapper;
      wrap = temp.firstElementChild;
    } else if (wrapper instanceof Pluck) {
      wrap = wrapper.elements[0].cloneNode(true);
    } else {
      wrap = wrapper.cloneNode(true);
    }

    if (wrap) {
      this.elements[0].parentNode.insertBefore(wrap, this.elements[0]);
      let inner = wrap;
      while (inner.firstElementChild) {
        inner = inner.firstElementChild;
      }
      this.elements.forEach(el => inner.appendChild(el));
    }

    return this;
  };

  /**
   * Wrap inner contents
   */
  Pluck.fn.wrapInner = function(wrapper) {
    return this.each(function() {
      const contents = Array.from(this.childNodes);
      const $this = new Pluck(this);
      $this.html('');

      let wrap;
      if (typeof wrapper === 'function') {
        wrap = wrapper.call(this, Array.from(this.parentNode.children).indexOf(this));
      } else {
        wrap = wrapper;
      }

      if (typeof wrap === 'string') {
        const temp = document.createElement('div');
        temp.innerHTML = wrap;
        wrap = temp.firstElementChild;
      } else if (wrap instanceof Pluck) {
        wrap = wrap.elements[0].cloneNode(true);
      } else {
        wrap = wrap.cloneNode(true);
      }

      if (wrap) {
        this.appendChild(wrap);
        let inner = wrap;
        while (inner.firstElementChild) {
          inner = inner.firstElementChild;
        }
        contents.forEach(node => inner.appendChild(node));
      }
    });
  };

  /**
   * Unwrap elements (remove parent)
   */
  Pluck.fn.unwrap = function(selector) {
    this.parent(selector).each(function() {
      if (this.tagName !== 'BODY') {
        new Pluck(this).replaceWith(this.childNodes);
      }
    });
    return this;
  };

  /**
   * Replace elements
   */
  Pluck.fn.replaceWith = function(content) {
    return this.each(function() {
      let replacement;

      if (typeof content === 'function') {
        replacement = content.call(this, Array.from(this.parentNode.children).indexOf(this));
      } else {
        replacement = content;
      }

      if (typeof replacement === 'string') {
        this.insertAdjacentHTML('beforebegin', replacement);
        this.parentNode?.removeChild(this);
      } else if (replacement instanceof Element) {
        this.parentNode?.replaceChild(replacement, this);
      } else if (replacement instanceof Pluck) {
        const parent = this.parentNode;
        replacement.elements.forEach((el, i) => {
          if (i === 0) {
            parent.replaceChild(el, this);
          } else {
            parent.insertBefore(el, replacement.elements[i - 1].nextSibling);
          }
        });
      } else if (replacement instanceof NodeList) {
        const parent = this.parentNode;
        const arr = Array.from(replacement);
        arr.forEach((el, i) => {
          if (i === 0) {
            parent.replaceChild(el, this);
          } else {
            parent.insertBefore(el, arr[i - 1].nextSibling);
          }
        });
      }
    });
  };

  /**
   * Replace all targets with elements
   */
  Pluck.fn.replaceAll = function(target) {
    new Pluck(target).replaceWith(this);
    return this;
  };

  // ============================================
  // SECTION 8: TRAVERSING - Tree Traversal
  // ============================================

  /**
   * Find descendants
   */
  Pluck.fn.find = function(selector) {
    const found = [];
    this.each(function() {
      const elements = this.querySelectorAll(selector);
      found.push(...elements);
    });
    const result = new Pluck([...new Set(found)]);
    result._prevObject = this;
    return result;
  };

  /**
   * Get parent element
   */
  Pluck.fn.parent = function(selector) {
    const parents = [];
    this.each(function() {
      const parent = this.parentElement;
      if (parent && !parents.includes(parent)) {
        if (!selector || parent.matches(selector)) {
          parents.push(parent);
        }
      }
    });
    const result = new Pluck(parents);
    result._prevObject = this;
    return result;
  };

  /**
   * Get all ancestors
   */
  Pluck.fn.parents = function(selector) {
    const parents = [];
    this.each(function() {
      let parent = this.parentElement;
      while (parent) {
        if (!parents.includes(parent)) {
          if (!selector || parent.matches(selector)) {
            parents.push(parent);
          }
        }
        parent = parent.parentElement;
      }
    });
    const result = new Pluck(parents);
    result._prevObject = this;
    return result;
  };

  /**
   * Get ancestors until selector matches
   */
  Pluck.fn.parentsUntil = function(selector, filter) {
    const parents = [];
    this.each(function() {
      let parent = this.parentElement;
      while (parent) {
        if (selector && parent.matches(selector)) break;
        if (!parents.includes(parent)) {
          if (!filter || parent.matches(filter)) {
            parents.push(parent);
          }
        }
        parent = parent.parentElement;
      }
    });
    const result = new Pluck(parents);
    result._prevObject = this;
    return result;
  };

  /**
   * Get closest ancestor matching selector
   */
  Pluck.fn.closest = function(selector) {
    const closest = [];
    this.each(function() {
      const found = this.closest(selector);
      if (found && !closest.includes(found)) {
        closest.push(found);
      }
    });
    const result = new Pluck(closest);
    result._prevObject = this;
    return result;
  };

  /**
   * Get positioned parent
   */
  Pluck.fn.offsetParent = function() {
    const parents = this.elements.map(el => {
      let parent = el.offsetParent;
      while (parent && getComputedStyle(parent).position === 'static') {
        parent = parent.offsetParent;
      }
      return parent || document.documentElement;
    });
    const result = new Pluck([...new Set(parents)]);
    result._prevObject = this;
    return result;
  };

  /**
   * Get children
   */
  Pluck.fn.children = function(selector) {
    const children = [];
    this.each(function() {
      Array.from(this.children).forEach(child => {
        if (!children.includes(child)) {
          if (!selector || child.matches(selector)) {
            children.push(child);
          }
        }
      });
    });
    const result = new Pluck(children);
    result._prevObject = this;
    return result;
  };

  /**
   * Get all child nodes including text
   */
  Pluck.fn.contents = function() {
    const contents = [];
    this.each(function() {
      contents.push(...this.childNodes);
    });
    const result = new Pluck(contents);
    result._prevObject = this;
    return result;
  };

  /**
   * Get siblings
   */
  Pluck.fn.siblings = function(selector) {
    const siblings = [];
    this.each(function() {
      const el = this;
      Array.from(this.parentNode.children).forEach(sibling => {
        if (sibling !== el && !siblings.includes(sibling)) {
          if (!selector || sibling.matches(selector)) {
            siblings.push(sibling);
          }
        }
      });
    });
    const result = new Pluck(siblings);
    result._prevObject = this;
    return result;
  };

  /**
   * Get next sibling
   */
  Pluck.fn.next = function(selector) {
    const next = [];
    this.each(function() {
      const sibling = this.nextElementSibling;
      if (sibling && !next.includes(sibling)) {
        if (!selector || sibling.matches(selector)) {
          next.push(sibling);
        }
      }
    });
    const result = new Pluck(next);
    result._prevObject = this;
    return result;
  };

  /**
   * Get all next siblings
   */
  Pluck.fn.nextAll = function(selector) {
    const siblings = [];
    this.each(function() {
      let sibling = this.nextElementSibling;
      while (sibling) {
        if (!siblings.includes(sibling)) {
          if (!selector || sibling.matches(selector)) {
            siblings.push(sibling);
          }
        }
        sibling = sibling.nextElementSibling;
      }
    });
    const result = new Pluck(siblings);
    result._prevObject = this;
    return result;
  };

  /**
   * Get next siblings until selector
   */
  Pluck.fn.nextUntil = function(selector, filter) {
    const siblings = [];
    this.each(function() {
      let sibling = this.nextElementSibling;
      while (sibling) {
        if (selector && sibling.matches(selector)) break;
        if (!siblings.includes(sibling)) {
          if (!filter || sibling.matches(filter)) {
            siblings.push(sibling);
          }
        }
        sibling = sibling.nextElementSibling;
      }
    });
    const result = new Pluck(siblings);
    result._prevObject = this;
    return result;
  };

  /**
   * Get previous sibling
   */
  Pluck.fn.prev = function(selector) {
    const prev = [];
    this.each(function() {
      const sibling = this.previousElementSibling;
      if (sibling && !prev.includes(sibling)) {
        if (!selector || sibling.matches(selector)) {
          prev.push(sibling);
        }
      }
    });
    const result = new Pluck(prev);
    result._prevObject = this;
    return result;
  };

  /**
   * Get all previous siblings
   */
  Pluck.fn.prevAll = function(selector) {
    const siblings = [];
    this.each(function() {
      let sibling = this.previousElementSibling;
      while (sibling) {
        if (!siblings.includes(sibling)) {
          if (!selector || sibling.matches(selector)) {
            siblings.unshift(sibling);
          }
        }
        sibling = sibling.previousElementSibling;
      }
    });
    const result = new Pluck(siblings);
    result._prevObject = this;
    return result;
  };

  /**
   * Get previous siblings until selector
   */
  Pluck.fn.prevUntil = function(selector, filter) {
    const siblings = [];
    this.each(function() {
      let sibling = this.previousElementSibling;
      while (sibling) {
        if (selector && sibling.matches(selector)) break;
        if (!siblings.includes(sibling)) {
          if (!filter || sibling.matches(filter)) {
            siblings.unshift(sibling);
          }
        }
        sibling = sibling.previousElementSibling;
      }
    });
    const result = new Pluck(siblings);
    result._prevObject = this;
    return result;
  };

  // ============================================
  // SECTION 9: TRAVERSING - Filtering
  // ============================================

  /**
   * Get first element
   */
  Pluck.fn.first = function() {
    const result = new Pluck(this.elements[0] ? [this.elements[0]] : []);
    result._prevObject = this;
    return result;
  };

  /**
   * Get last element
   */
  Pluck.fn.last = function() {
    const result = new Pluck(this.elements[this.length - 1] ? [this.elements[this.length - 1]] : []);
    result._prevObject = this;
    return result;
  };

  /**
   * Get element at index
   */
  Pluck.fn.eq = function(index) {
    const idx = index < 0 ? this.length + index : index;
    const result = new Pluck(this.elements[idx] ? [this.elements[idx]] : []);
    result._prevObject = this;
    return result;
  };

  /**
   * Filter elements
   */
  Pluck.fn.filter = function(selector) {
    let filtered;
    if (typeof selector === 'function') {
      filtered = this.elements.filter((el, i) => selector.call(el, i, el));
    } else if (typeof selector === 'string') {
      filtered = this.elements.filter(el => el.matches && el.matches(selector));
    } else if (selector instanceof Element) {
      filtered = this.elements.filter(el => el === selector);
    } else if (selector instanceof Pluck) {
      filtered = this.elements.filter(el => selector.elements.includes(el));
    } else {
      filtered = [];
    }
    const result = new Pluck(filtered);
    result._prevObject = this;
    return result;
  };

  /**
   * Exclude elements
   */
  Pluck.fn.not = function(selector) {
    let filtered;
    if (typeof selector === 'function') {
      filtered = this.elements.filter((el, i) => !selector.call(el, i, el));
    } else if (typeof selector === 'string') {
      filtered = this.elements.filter(el => !el.matches || !el.matches(selector));
    } else if (selector instanceof Element) {
      filtered = this.elements.filter(el => el !== selector);
    } else if (selector instanceof Pluck) {
      filtered = this.elements.filter(el => !selector.elements.includes(el));
    } else {
      filtered = this.elements.slice();
    }
    const result = new Pluck(filtered);
    result._prevObject = this;
    return result;
  };

  /**
   * Check if any element matches selector
   */
  Pluck.fn.is = function(selector) {
    if (typeof selector === 'function') {
      return this.elements.some((el, i) => selector.call(el, i, el));
    }
    if (typeof selector === 'string') {
      return this.elements.some(el => el.matches && el.matches(selector));
    }
    if (selector instanceof Element) {
      return this.elements.includes(selector);
    }
    if (selector instanceof Pluck) {
      return this.elements.some(el => selector.elements.includes(el));
    }
    return false;
  };

  /**
   * Check if elements contain selector
   */
  Pluck.fn.has = function(selector) {
    const filtered = this.elements.filter(el => {
      if (typeof selector === 'string') {
        return el.querySelector(selector);
      }
      if (selector instanceof Element) {
        return el.contains(selector);
      }
      return false;
    });
    const result = new Pluck(filtered);
    result._prevObject = this;
    return result;
  };

  /**
   * Slice elements
   */
  Pluck.fn.slice = function(start, end) {
    const result = new Pluck(this.elements.slice(start, end));
    result._prevObject = this;
    return result;
  };

  /**
   * Get even elements
   */
  Pluck.fn.even = function() {
    const result = new Pluck(this.elements.filter((_, i) => i % 2 === 0));
    result._prevObject = this;
    return result;
  };

  /**
   * Get odd elements
   */
  Pluck.fn.odd = function() {
    const result = new Pluck(this.elements.filter((_, i) => i % 2 === 1));
    result._prevObject = this;
    return result;
  };

  /**
   * Add elements to collection
   */
  Pluck.fn.add = function(selector, context) {
    const added = new Pluck(selector, context);
    const combined = [...this.elements, ...added.elements];
    const result = new Pluck([...new Set(combined)]);
    result._prevObject = this;
    return result;
  };

  /**
   * Add previous set
   */
  Pluck.fn.addBack = function(selector) {
    const prev = this._prevObject || new Pluck();
    const filtered = selector ? prev.filter(selector) : prev;
    return this.add(filtered);
  };

  /**
   * Return to previous set
   */
  Pluck.fn.end = function() {
    return this._prevObject || new Pluck();
  };

  // ============================================
  // SECTION 10: EVENTS - Handler Attachment
  // ============================================

  /**
   * Attach event handler
   */
  Pluck.fn.on = function(events, selector, data, handler) {
    // Handle argument variations
    if (typeof selector === 'function') {
      handler = selector;
      selector = null;
      data = null;
    } else if (typeof data === 'function') {
      handler = data;
      if (typeof selector === 'object') {
        data = selector;
        selector = null;
      } else {
        data = null;
      }
    }

    const eventList = events.split(/\s+/);

    return this.each(function() {
      const el = this;

      eventList.forEach(eventName => {
        // Parse namespace
        const [event, ...namespaces] = eventName.split('.');
        const namespace = namespaces.join('.');

        let actualHandler;

        if (selector) {
          // Event delegation
          actualHandler = function(e) {
            const target = e.target.closest(selector);
            if (target && el.contains(target)) {
              if (data) e.data = data;
              handler.call(target, e);
            }
          };
        } else {
          actualHandler = function(e) {
            if (data) e.data = data;
            handler.call(el, e);
          };
        }

        el.addEventListener(event, actualHandler);

        // Store reference for removal
        el._pluckEvents = el._pluckEvents || {};
        el._pluckEvents[event] = el._pluckEvents[event] || [];
        el._pluckEvents[event].push({
          handler,
          actualHandler,
          selector,
          namespace
        });
      });
    });
  };

  /**
   * Remove event handler
   */
  Pluck.fn.off = function(events, selector, handler) {
    if (typeof selector === 'function') {
      handler = selector;
      selector = null;
    }

    return this.each(function() {
      const el = this;
      if (!el._pluckEvents) return;

      if (!events) {
        // Remove all events
        for (const event in el._pluckEvents) {
          el._pluckEvents[event].forEach(item => {
            el.removeEventListener(event, item.actualHandler);
          });
        }
        el._pluckEvents = {};
        return;
      }

      const eventList = events.split(/\s+/);

      eventList.forEach(eventName => {
        const [event, ...namespaces] = eventName.split('.');
        const namespace = namespaces.join('.');

        if (event && el._pluckEvents[event]) {
          el._pluckEvents[event] = el._pluckEvents[event].filter(item => {
            const matchHandler = !handler || item.handler === handler;
            const matchSelector = !selector || item.selector === selector;
            const matchNamespace = !namespace || item.namespace === namespace;

            if (matchHandler && matchSelector && matchNamespace) {
              el.removeEventListener(event, item.actualHandler);
              return false;
            }
            return true;
          });
        } else if (!event && namespace) {
          // Remove by namespace only
          for (const evt in el._pluckEvents) {
            el._pluckEvents[evt] = el._pluckEvents[evt].filter(item => {
              if (item.namespace === namespace) {
                el.removeEventListener(evt, item.actualHandler);
                return false;
              }
              return true;
            });
          }
        }
      });
    });
  };

  /**
   * Attach one-time event handler
   */
  Pluck.fn.one = function(events, selector, data, handler) {
    if (typeof selector === 'function') {
      handler = selector;
      selector = null;
      data = null;
    } else if (typeof data === 'function') {
      handler = data;
      if (typeof selector === 'object') {
        data = selector;
        selector = null;
      } else {
        data = null;
      }
    }

    const self = this;
    const eventList = events.split(/\s+/);

    return this.each(function() {
      const el = this;
      eventList.forEach(event => {
        const oneHandler = function(e) {
          new Pluck(el).off(event, selector, oneHandler);
          handler.call(this, e);
        };
        new Pluck(el).on(event, selector, data, oneHandler);
      });
    });
  };

  /**
   * Trigger event
   */
  Pluck.fn.trigger = function(eventType, data) {
    const [event, ...namespaces] = eventType.split('.');

    return this.each(function() {
      let evt;

      // Use native events when possible
      if (event === 'click' || event === 'focus' || event === 'blur' || event === 'submit') {
        if (typeof this[event] === 'function' && !data) {
          this[event]();
          return;
        }
      }

      evt = new CustomEvent(event, {
        bubbles: true,
        cancelable: true,
        detail: data
      });

      this.dispatchEvent(evt);
    });
  };

  /**
   * Trigger handler without bubbling
   */
  Pluck.fn.triggerHandler = function(eventType, data) {
    const el = this.elements[0];
    if (!el || !el._pluckEvents) return;

    const [event] = eventType.split('.');
    const handlers = el._pluckEvents[event];

    if (handlers) {
      const fakeEvent = {
        type: event,
        target: el,
        currentTarget: el,
        preventDefault: function() { this.isDefaultPrevented = true; },
        stopPropagation: function() {},
        stopImmediatePropagation: function() { this.isImmediatePropagationStopped = true; },
        data: data
      };

      for (const item of handlers) {
        const result = item.handler.call(el, fakeEvent);
        if (fakeEvent.isImmediatePropagationStopped) break;
        if (result !== undefined) return result;
      }
    }
  };

  // Event shortcuts
  const eventShortcuts = [
    'click', 'dblclick', 'mousedown', 'mouseup', 'mousemove',
    'mouseenter', 'mouseleave', 'mouseover', 'mouseout',
    'keydown', 'keyup', 'keypress',
    'focus', 'blur', 'focusin', 'focusout',
    'change', 'select', 'submit',
    'scroll', 'resize',
    'contextmenu', 'input'
  ];

  eventShortcuts.forEach(event => {
    Pluck.fn[event] = function(dataOrHandler, handler) {
      if (arguments.length === 0) {
        return this.trigger(event);
      }
      if (typeof dataOrHandler === 'function') {
        return this.on(event, dataOrHandler);
      }
      return this.on(event, null, dataOrHandler, handler);
    };
  });

  /**
   * Hover helper
   */
  Pluck.fn.hover = function(enterHandler, leaveHandler) {
    return this.on('mouseenter', enterHandler).on('mouseleave', leaveHandler || enterHandler);
  };

  /**
   * DOM Ready
   */
  Pluck.fn.ready = function(callback) {
    if (document.readyState !== 'loading') {
      setTimeout(callback, 0);
    } else {
      document.addEventListener('DOMContentLoaded', callback);
    }
    return this;
  };

  // ============================================
  // SECTION 11: EFFECTS - Show/Hide
  // ============================================

  /**
   * Show elements
   */
  Pluck.fn.show = function(duration, easing, callback) {
    if (typeof duration === 'function') {
      callback = duration;
      duration = undefined;
    }
    if (typeof easing === 'function') {
      callback = easing;
      easing = undefined;
    }

    if (!duration) {
      return this.each(function() {
        this.style.display = this._pluckDisplay || '';
        if (getComputedStyle(this).display === 'none') {
          this.style.display = getDefaultDisplay(this.tagName);
        }
        delete this._pluckDisplay;
      });
    }

    return this.each(function() {
      const el = this;
      el.style.display = el._pluckDisplay || getDefaultDisplay(el.tagName);
      el.style.overflow = 'hidden';

      const targetHeight = el.scrollHeight;
      const targetWidth = el.scrollWidth;

      el.style.height = '0';
      el.style.width = '0';
      el.style.opacity = '0';
      el.style.transition = `all ${duration}ms ${easing || 'ease'}`;

      // Force reflow
      el.offsetHeight;

      el.style.height = targetHeight + 'px';
      el.style.width = targetWidth + 'px';
      el.style.opacity = '1';

      setTimeout(() => {
        el.style.height = '';
        el.style.width = '';
        el.style.overflow = '';
        el.style.transition = '';
        delete el._pluckDisplay;
        if (callback) callback.call(el);
      }, duration);
    });
  };

  /**
   * Hide elements
   */
  Pluck.fn.hide = function(duration, easing, callback) {
    if (typeof duration === 'function') {
      callback = duration;
      duration = undefined;
    }
    if (typeof easing === 'function') {
      callback = easing;
      easing = undefined;
    }

    if (!duration) {
      return this.each(function() {
        const display = getComputedStyle(this).display;
        if (display !== 'none') {
          this._pluckDisplay = display;
        }
        this.style.display = 'none';
      });
    }

    return this.each(function() {
      const el = this;
      const display = getComputedStyle(el).display;
      if (display !== 'none') {
        el._pluckDisplay = display;
      }

      el.style.overflow = 'hidden';
      el.style.transition = `all ${duration}ms ${easing || 'ease'}`;

      // Force reflow
      el.offsetHeight;

      el.style.height = '0';
      el.style.width = '0';
      el.style.opacity = '0';

      setTimeout(() => {
        el.style.display = 'none';
        el.style.height = '';
        el.style.width = '';
        el.style.opacity = '';
        el.style.overflow = '';
        el.style.transition = '';
        if (callback) callback.call(el);
      }, duration);
    });
  };

  /**
   * Toggle visibility
   */
  Pluck.fn.toggle = function(duration, easing, callback) {
    if (typeof duration === 'boolean') {
      return duration ? this.show() : this.hide();
    }
    return this.each(function() {
      if (getComputedStyle(this).display === 'none') {
        new Pluck(this).show(duration, easing, callback);
      } else {
        new Pluck(this).hide(duration, easing, callback);
      }
    });
  };

  // ============================================
  // SECTION 12: EFFECTS - Fading
  // ============================================

  /**
   * Fade in
   */
  Pluck.fn.fadeIn = function(duration = 400, easing, callback) {
    if (typeof duration === 'function') {
      callback = duration;
      duration = 400;
    }
    if (typeof easing === 'function') {
      callback = easing;
      easing = undefined;
    }

    return this.each(function() {
      const el = this;
      el.style.opacity = '0';
      el.style.display = el._pluckDisplay || getDefaultDisplay(el.tagName);
      el.style.transition = `opacity ${duration}ms ${easing || 'ease'}`;

      // Force reflow
      el.offsetHeight;

      el.style.opacity = '1';

      setTimeout(() => {
        el.style.transition = '';
        delete el._pluckDisplay;
        if (callback) callback.call(el);
      }, duration);
    });
  };

  /**
   * Fade out
   */
  Pluck.fn.fadeOut = function(duration = 400, easing, callback) {
    if (typeof duration === 'function') {
      callback = duration;
      duration = 400;
    }
    if (typeof easing === 'function') {
      callback = easing;
      easing = undefined;
    }

    return this.each(function() {
      const el = this;
      const display = getComputedStyle(el).display;
      if (display !== 'none') {
        el._pluckDisplay = display;
      }

      el.style.transition = `opacity ${duration}ms ${easing || 'ease'}`;
      el.style.opacity = '0';

      setTimeout(() => {
        el.style.display = 'none';
        el.style.transition = '';
        if (callback) callback.call(el);
      }, duration);
    });
  };

  /**
   * Fade toggle
   */
  Pluck.fn.fadeToggle = function(duration = 400, easing, callback) {
    return this.each(function() {
      const display = getComputedStyle(this).display;
      const opacity = getComputedStyle(this).opacity;

      if (display === 'none' || opacity === '0') {
        new Pluck(this).fadeIn(duration, easing, callback);
      } else {
        new Pluck(this).fadeOut(duration, easing, callback);
      }
    });
  };

  /**
   * Fade to specific opacity
   */
  Pluck.fn.fadeTo = function(duration, opacity, easing, callback) {
    if (typeof easing === 'function') {
      callback = easing;
      easing = undefined;
    }

    return this.each(function() {
      const el = this;
      if (getComputedStyle(el).display === 'none') {
        el.style.opacity = '0';
        el.style.display = el._pluckDisplay || getDefaultDisplay(el.tagName);
      }

      el.style.transition = `opacity ${duration}ms ${easing || 'ease'}`;

      // Force reflow
      el.offsetHeight;

      el.style.opacity = opacity;

      setTimeout(() => {
        el.style.transition = '';
        if (callback) callback.call(el);
      }, duration);
    });
  };

  // ============================================
  // SECTION 13: EFFECTS - Sliding
  // ============================================

  /**
   * Slide down
   */
  Pluck.fn.slideDown = function(duration = 400, easing, callback) {
    if (typeof duration === 'function') {
      callback = duration;
      duration = 400;
    }
    if (typeof easing === 'function') {
      callback = easing;
      easing = undefined;
    }

    return this.each(function() {
      const el = this;
      el.style.display = el._pluckDisplay || getDefaultDisplay(el.tagName);
      const height = el.scrollHeight;

      el.style.overflow = 'hidden';
      el.style.height = '0';
      el.style.transition = `height ${duration}ms ${easing || 'ease'}`;

      // Force reflow
      el.offsetHeight;

      el.style.height = height + 'px';

      setTimeout(() => {
        el.style.height = '';
        el.style.overflow = '';
        el.style.transition = '';
        delete el._pluckDisplay;
        if (callback) callback.call(el);
      }, duration);
    });
  };

  /**
   * Slide up
   */
  Pluck.fn.slideUp = function(duration = 400, easing, callback) {
    if (typeof duration === 'function') {
      callback = duration;
      duration = 400;
    }
    if (typeof easing === 'function') {
      callback = easing;
      easing = undefined;
    }

    return this.each(function() {
      const el = this;
      const display = getComputedStyle(el).display;
      if (display !== 'none') {
        el._pluckDisplay = display;
      }

      el.style.overflow = 'hidden';
      el.style.height = el.scrollHeight + 'px';
      el.style.transition = `height ${duration}ms ${easing || 'ease'}`;

      // Force reflow
      el.offsetHeight;

      el.style.height = '0';

      setTimeout(() => {
        el.style.display = 'none';
        el.style.height = '';
        el.style.overflow = '';
        el.style.transition = '';
        if (callback) callback.call(el);
      }, duration);
    });
  };

  /**
   * Slide toggle
   */
  Pluck.fn.slideToggle = function(duration = 400, easing, callback) {
    return this.each(function() {
      if (getComputedStyle(this).display === 'none') {
        new Pluck(this).slideDown(duration, easing, callback);
      } else {
        new Pluck(this).slideUp(duration, easing, callback);
      }
    });
  };

  // ============================================
  // SECTION 14: EFFECTS - Animation
  // ============================================

  /**
   * Animate CSS properties
   */
  Pluck.fn.animate = function(properties, duration = 400, easing = 'ease', callback) {
    if (typeof duration === 'function') {
      callback = duration;
      duration = 400;
      easing = 'ease';
    }
    if (typeof duration === 'object') {
      const options = duration;
      duration = options.duration || 400;
      easing = options.easing || 'ease';
      callback = options.complete;
    }
    if (typeof easing === 'function') {
      callback = easing;
      easing = 'ease';
    }

    const props = Object.keys(properties);
    const transitionProps = props.map(p => `${camelToKebab(p)} ${duration}ms ${easing}`).join(', ');

    return this.each(function() {
      const el = this;
      el.style.transition = transitionProps;

      // Apply properties
      for (const prop in properties) {
        let value = properties[prop];

        // Handle relative values (+=, -=)
        if (typeof value === 'string') {
          const match = value.match(/^([+-]=)(.+)$/);
          if (match) {
            const current = parseFloat(getComputedStyle(el)[prop]) || 0;
            const delta = parseFloat(match[2]);
            value = match[1] === '+=' ? current + delta : current - delta;
          }
        }

        // Add px if needed
        if (typeof value === 'number' && !cssNumber[prop]) {
          value = value + 'px';
        }

        el.style[prop] = value;
      }

      setTimeout(() => {
        el.style.transition = '';
        if (callback) callback.call(el);
      }, duration);
    });
  };

  /**
   * Stop animations
   */
  Pluck.fn.stop = function(clearQueue, jumpToEnd) {
    return this.each(function() {
      const el = this;
      const computed = getComputedStyle(el);

      if (jumpToEnd) {
        // Let transitions complete
        el.style.transition = 'none';
        // Force reflow
        el.offsetHeight;
      } else {
        // Capture current state
        const currentStyles = {};
        ['opacity', 'height', 'width', 'top', 'left', 'right', 'bottom', 'marginTop', 'marginLeft', 'paddingTop', 'paddingLeft'].forEach(prop => {
          if (el.style[prop] || computed[prop]) {
            currentStyles[prop] = computed[prop];
          }
        });

        el.style.transition = 'none';

        // Apply current computed values
        for (const prop in currentStyles) {
          el.style[prop] = currentStyles[prop];
        }
      }

      // Force reflow
      el.offsetHeight;
      el.style.transition = '';
    });
  };

  /**
   * Finish animations
   */
  Pluck.fn.finish = function() {
    return this.stop(true, true);
  };

  /**
   * Delay execution
   */
  Pluck.fn.delay = function(duration) {
    // Since we don't have a queue system, delay returns a promise-like
    const self = this;
    return {
      fadeIn: function(d, e, c) { setTimeout(() => self.fadeIn(d, e, c), duration); return self; },
      fadeOut: function(d, e, c) { setTimeout(() => self.fadeOut(d, e, c), duration); return self; },
      slideDown: function(d, e, c) { setTimeout(() => self.slideDown(d, e, c), duration); return self; },
      slideUp: function(d, e, c) { setTimeout(() => self.slideUp(d, e, c), duration); return self; },
      show: function(d, e, c) { setTimeout(() => self.show(d, e, c), duration); return self; },
      hide: function(d, e, c) { setTimeout(() => self.hide(d, e, c), duration); return self; },
      animate: function(p, d, e, c) { setTimeout(() => self.animate(p, d, e, c), duration); return self; }
    };
  };

  // ============================================
  // SECTION 15: DIMENSIONS & POSITION
  // ============================================

  /**
   * Get or set width
   */
  Pluck.fn.width = function(value) {
    if (value === undefined) {
      const el = this.elements[0];
      if (!el) return undefined;
      if (el === window) return window.innerWidth;
      if (el === document) return document.documentElement.scrollWidth;
      return el.getBoundingClientRect().width;
    }
    return this.css('width', typeof value === 'number' ? value + 'px' : value);
  };

  /**
   * Get or set height
   */
  Pluck.fn.height = function(value) {
    if (value === undefined) {
      const el = this.elements[0];
      if (!el) return undefined;
      if (el === window) return window.innerHeight;
      if (el === document) return document.documentElement.scrollHeight;
      return el.getBoundingClientRect().height;
    }
    return this.css('height', typeof value === 'number' ? value + 'px' : value);
  };

  /**
   * Get inner width (includes padding)
   */
  Pluck.fn.innerWidth = function() {
    const el = this.elements[0];
    if (!el) return undefined;
    if (el === window) return window.innerWidth;
    return el.clientWidth;
  };

  /**
   * Get inner height (includes padding)
   */
  Pluck.fn.innerHeight = function() {
    const el = this.elements[0];
    if (!el) return undefined;
    if (el === window) return window.innerHeight;
    return el.clientHeight;
  };

  /**
   * Get outer width (includes padding, border, optionally margin)
   */
  Pluck.fn.outerWidth = function(includeMargin) {
    const el = this.elements[0];
    if (!el) return undefined;
    if (el === window) return window.outerWidth;
    let width = el.offsetWidth;
    if (includeMargin) {
      const style = getComputedStyle(el);
      width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }
    return width;
  };

  /**
   * Get outer height (includes padding, border, optionally margin)
   */
  Pluck.fn.outerHeight = function(includeMargin) {
    const el = this.elements[0];
    if (!el) return undefined;
    if (el === window) return window.outerHeight;
    let height = el.offsetHeight;
    if (includeMargin) {
      const style = getComputedStyle(el);
      height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    }
    return height;
  };

  /**
   * Get position relative to parent
   */
  Pluck.fn.position = function() {
    const el = this.elements[0];
    if (!el) return { top: 0, left: 0 };
    return {
      top: el.offsetTop,
      left: el.offsetLeft
    };
  };

  /**
   * Get or set offset relative to document
   */
  Pluck.fn.offset = function(coords) {
    if (coords) {
      return this.each(function() {
        const el = this;
        const position = getComputedStyle(el).position;

        if (position === 'static') {
          el.style.position = 'relative';
        }

        const currentOffset = new Pluck(el).offset();
        const currentPosition = {
          top: parseFloat(getComputedStyle(el).top) || 0,
          left: parseFloat(getComputedStyle(el).left) || 0
        };

        if (coords.top !== undefined) {
          el.style.top = (currentPosition.top + coords.top - currentOffset.top) + 'px';
        }
        if (coords.left !== undefined) {
          el.style.left = (currentPosition.left + coords.left - currentOffset.left) + 'px';
        }
      });
    }

    const el = this.elements[0];
    if (!el) return { top: 0, left: 0 };

    const rect = el.getBoundingClientRect();
    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset
    };
  };

  /**
   * Get or set scroll top
   */
  Pluck.fn.scrollTop = function(value) {
    if (value === undefined) {
      const el = this.elements[0];
      if (!el) return undefined;
      if (el === window || el === document) {
        return window.pageYOffset;
      }
      return el.scrollTop;
    }
    return this.each(function() {
      if (this === window || this === document) {
        window.scrollTo(window.pageXOffset, value);
      } else {
        this.scrollTop = value;
      }
    });
  };

  /**
   * Get or set scroll left
   */
  Pluck.fn.scrollLeft = function(value) {
    if (value === undefined) {
      const el = this.elements[0];
      if (!el) return undefined;
      if (el === window || el === document) {
        return window.pageXOffset;
      }
      return el.scrollLeft;
    }
    return this.each(function() {
      if (this === window || this === document) {
        window.scrollTo(value, window.pageYOffset);
      } else {
        this.scrollLeft = value;
      }
    });
  };

  // ============================================
  // SECTION 16: AJAX
  // ============================================

  /**
   * Core AJAX method
   */
  Pluck.ajax = function(options) {
    const defaults = {
      method: 'GET',
      url: '',
      data: null,
      headers: {},
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      dataType: 'text',
      timeout: 0,
      cache: true,
      processData: true,
      async: true,
      username: null,
      password: null,
      beforeSend: null,
      success: null,
      error: null,
      complete: null,
      statusCode: {}
    };

    const settings = { ...defaults, ...options };
    settings.method = settings.method.toUpperCase();

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Build URL with cache buster
      let url = settings.url;
      if (!settings.cache && settings.method === 'GET') {
        const separator = url.includes('?') ? '&' : '?';
        url += separator + '_=' + Date.now();
      }

      // Add data to URL for GET requests
      if (settings.data && settings.method === 'GET' && settings.processData) {
        const separator = url.includes('?') ? '&' : '?';
        url += separator + (typeof settings.data === 'string' ? settings.data : new URLSearchParams(settings.data).toString());
      }

      xhr.open(settings.method, url, settings.async, settings.username, settings.password);

      // Set headers
      if (settings.contentType && settings.method !== 'GET') {
        xhr.setRequestHeader('Content-Type', settings.contentType);
      }
      for (const header in settings.headers) {
        xhr.setRequestHeader(header, settings.headers[header]);
      }

      // Set timeout
      if (settings.timeout) {
        xhr.timeout = settings.timeout;
      }

      // Before send callback
      if (settings.beforeSend) {
        if (settings.beforeSend(xhr, settings) === false) {
          xhr.abort();
          return;
        }
      }

      xhr.onload = function() {
        let response = xhr.responseText;

        // Parse response based on dataType
        if (settings.dataType === 'json') {
          try {
            response = JSON.parse(response);
          } catch (e) {
            if (settings.error) settings.error(xhr, 'parsererror', e);
            reject(e);
            return;
          }
        } else if (settings.dataType === 'xml') {
          response = xhr.responseXML;
        }

        // Status code callbacks
        if (settings.statusCode[xhr.status]) {
          settings.statusCode[xhr.status](response);
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          if (settings.success) settings.success(response, xhr.statusText, xhr);
          resolve(response);
        } else {
          if (settings.error) settings.error(xhr, xhr.statusText);
          reject(new Error(xhr.statusText));
        }

        if (settings.complete) settings.complete(xhr, xhr.statusText);
      };

      xhr.onerror = function() {
        if (settings.error) settings.error(xhr, 'error');
        if (settings.complete) settings.complete(xhr, 'error');
        reject(new Error('Network error'));
      };

      xhr.ontimeout = function() {
        if (settings.error) settings.error(xhr, 'timeout');
        if (settings.complete) settings.complete(xhr, 'timeout');
        reject(new Error('Timeout'));
      };

      // Prepare data for POST
      let sendData = null;
      if (settings.data && settings.method !== 'GET') {
        if (settings.processData && typeof settings.data === 'object' && !(settings.data instanceof FormData)) {
          if (settings.contentType && settings.contentType.includes('json')) {
            sendData = JSON.stringify(settings.data);
          } else {
            sendData = new URLSearchParams(settings.data).toString();
          }
        } else {
          sendData = settings.data;
        }
      }

      xhr.send(sendData);
    });
  };

  /**
   * GET request shorthand
   */
  Pluck.get = function(url, data, success, dataType) {
    if (typeof data === 'function') {
      dataType = success;
      success = data;
      data = null;
    }

    return Pluck.ajax({
      method: 'GET',
      url: url,
      data: data,
      success: success,
      dataType: dataType || 'text'
    });
  };

  /**
   * POST request shorthand
   */
  Pluck.post = function(url, data, success, dataType) {
    if (typeof data === 'function') {
      dataType = success;
      success = data;
      data = null;
    }

    return Pluck.ajax({
      method: 'POST',
      url: url,
      data: data,
      success: success,
      dataType: dataType || 'text'
    });
  };

  /**
   * GET JSON shorthand
   */
  Pluck.getJSON = function(url, data, success) {
    if (typeof data === 'function') {
      success = data;
      data = null;
    }

    return Pluck.get(url, data, success, 'json');
  };

  /**
   * Load script
   */
  Pluck.getScript = function(url, success) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = function() {
        if (success) success();
        resolve();
      };
      script.onerror = function() {
        reject(new Error('Script load error'));
      };
      document.head.appendChild(script);
    });
  };

  /**
   * Load HTML into elements
   */
  Pluck.fn.load = function(url, data, complete) {
    if (typeof data === 'function') {
      complete = data;
      data = null;
    }

    const self = this;

    // Check for selector in URL
    const spaceIndex = url.indexOf(' ');
    let selector = null;
    if (spaceIndex > -1) {
      selector = url.slice(spaceIndex + 1).trim();
      url = url.slice(0, spaceIndex);
    }

    Pluck.ajax({
      method: data ? 'POST' : 'GET',
      url: url,
      data: data,
      dataType: 'html',
      success: function(response) {
        if (selector) {
          const temp = document.createElement('div');
          temp.innerHTML = response;
          response = new Pluck(temp).find(selector).html();
        }
        self.html(response);
        if (complete) complete.call(self, response);
      },
      error: function(xhr, status) {
        if (complete) complete.call(self, xhr.responseText, status, xhr);
      }
    });

    return this;
  };

  // ============================================
  // SECTION 17: FORM SERIALIZATION
  // ============================================

  /**
   * Serialize form to URL-encoded string
   */
  Pluck.fn.serialize = function() {
    const form = this.elements[0];
    if (!form || form.tagName !== 'FORM') return '';

    const formData = new FormData(form);
    return new URLSearchParams(formData).toString();
  };

  /**
   * Serialize form to array
   */
  Pluck.fn.serializeArray = function() {
    const form = this.elements[0];
    if (!form || form.tagName !== 'FORM') return [];

    const formData = new FormData(form);
    const result = [];

    formData.forEach((value, name) => {
      result.push({ name, value });
    });

    return result;
  };

  // ============================================
  // SECTION 18: DEFERRED OBJECT (Promise-like)
  // ============================================

  /**
   * jQuery-compatible Deferred object
   */
  Pluck.Deferred = function(beforeStart) {
    const states = {
      pending: 0,
      resolved: 1,
      rejected: 2
    };

    let state = states.pending;
    let resolveValue = null;
    let rejectReason = null;
    let progressValue = null;

    const doneCallbacks = [];
    const failCallbacks = [];
    const progressCallbacks = [];
    const alwaysCallbacks = [];

    const deferred = {
      state: function() {
        return state === states.pending ? 'pending' :
               state === states.resolved ? 'resolved' : 'rejected';
      },

      always: function(...fns) {
        alwaysCallbacks.push(...fns);
        if (state !== states.pending) {
          fns.forEach(fn => fn(state === states.resolved ? resolveValue : rejectReason));
        }
        return this;
      },

      done: function(...fns) {
        doneCallbacks.push(...fns);
        if (state === states.resolved) {
          fns.forEach(fn => fn(resolveValue));
        }
        return this;
      },

      fail: function(...fns) {
        failCallbacks.push(...fns);
        if (state === states.rejected) {
          fns.forEach(fn => fn(rejectReason));
        }
        return this;
      },

      progress: function(...fns) {
        progressCallbacks.push(...fns);
        if (progressValue !== null) {
          fns.forEach(fn => fn(progressValue));
        }
        return this;
      },

      then: function(doneFn, failFn, progressFn) {
        const newDeferred = Pluck.Deferred();

        this.done(function(value) {
          try {
            if (typeof doneFn === 'function') {
              const result = doneFn(value);
              if (result && typeof result.then === 'function') {
                result.then(newDeferred.resolve, newDeferred.reject);
              } else {
                newDeferred.resolve(result);
              }
            } else {
              newDeferred.resolve(value);
            }
          } catch (e) {
            newDeferred.reject(e);
          }
        });

        this.fail(function(reason) {
          try {
            if (typeof failFn === 'function') {
              const result = failFn(reason);
              if (result && typeof result.then === 'function') {
                result.then(newDeferred.resolve, newDeferred.reject);
              } else {
                newDeferred.resolve(result);
              }
            } else {
              newDeferred.reject(reason);
            }
          } catch (e) {
            newDeferred.reject(e);
          }
        });

        if (typeof progressFn === 'function') {
          this.progress(progressFn);
        }

        return newDeferred.promise();
      },

      catch: function(failFn) {
        return this.then(null, failFn);
      },

      promise: function(obj) {
        const promise = {
          state: deferred.state,
          always: deferred.always,
          done: deferred.done,
          fail: deferred.fail,
          progress: deferred.progress,
          then: deferred.then,
          catch: deferred.catch,
          promise: function() { return this; }
        };
        if (obj) {
          return Pluck.extend(obj, promise);
        }
        return promise;
      },

      resolve: function(...args) {
        if (state === states.pending) {
          state = states.resolved;
          resolveValue = args.length === 1 ? args[0] : args;
          doneCallbacks.forEach(fn => fn(resolveValue));
          alwaysCallbacks.forEach(fn => fn(resolveValue));
        }
        return this;
      },

      resolveWith: function(context, args) {
        if (state === states.pending) {
          state = states.resolved;
          resolveValue = args && args.length === 1 ? args[0] : args;
          doneCallbacks.forEach(fn => fn.apply(context, args || []));
          alwaysCallbacks.forEach(fn => fn.apply(context, args || []));
        }
        return this;
      },

      reject: function(...args) {
        if (state === states.pending) {
          state = states.rejected;
          rejectReason = args.length === 1 ? args[0] : args;
          failCallbacks.forEach(fn => fn(rejectReason));
          alwaysCallbacks.forEach(fn => fn(rejectReason));
        }
        return this;
      },

      rejectWith: function(context, args) {
        if (state === states.pending) {
          state = states.rejected;
          rejectReason = args && args.length === 1 ? args[0] : args;
          failCallbacks.forEach(fn => fn.apply(context, args || []));
          alwaysCallbacks.forEach(fn => fn.apply(context, args || []));
        }
        return this;
      },

      notify: function(...args) {
        if (state === states.pending) {
          progressValue = args.length === 1 ? args[0] : args;
          progressCallbacks.forEach(fn => fn(progressValue));
        }
        return this;
      },

      notifyWith: function(context, args) {
        if (state === states.pending) {
          progressValue = args && args.length === 1 ? args[0] : args;
          progressCallbacks.forEach(fn => fn.apply(context, args || []));
        }
        return this;
      }
    };

    if (beforeStart) {
      beforeStart.call(deferred, deferred);
    }

    return deferred;
  };

  /**
   * $.when - Wait for multiple deferreds/promises
   */
  Pluck.when = function(...deferreds) {
    if (deferreds.length === 0) {
      return Pluck.Deferred().resolve().promise();
    }

    if (deferreds.length === 1) {
      const d = deferreds[0];
      if (d && typeof d.promise === 'function') {
        return d.promise();
      }
      return Pluck.Deferred().resolve(d).promise();
    }

    const master = Pluck.Deferred();
    const resolvedValues = new Array(deferreds.length);
    let remaining = deferreds.length;

    deferreds.forEach((d, index) => {
      if (d && typeof d.then === 'function') {
        d.then(
          function(value) {
            resolvedValues[index] = value;
            remaining--;
            if (remaining === 0) {
              master.resolve(...resolvedValues);
            }
          },
          function(reason) {
            master.reject(reason);
          }
        );
      } else {
        resolvedValues[index] = d;
        remaining--;
        if (remaining === 0) {
          master.resolve(...resolvedValues);
        }
      }
    });

    return master.promise();
  };

  // ============================================
  // SECTION 19: CALLBACKS OBJECT
  // ============================================

  /**
   * jQuery-compatible Callbacks object
   * Flags: once, memory, unique, stopOnFalse
   */
  Pluck.Callbacks = function(options) {
    const flags = {};
    if (typeof options === 'string') {
      options.split(/\s+/).forEach(flag => flags[flag] = true);
    }

    let list = [];
    let fired = false;
    let firing = false;
    let firingStart = 0;
    let firingLength = 0;
    let firingIndex = 0;
    let memory = null;
    let locked = false;
    let disabled = false;

    const fire = function(context, args) {
      if (disabled || (flags.once && fired)) {
        return;
      }

      fired = true;
      firing = true;
      firingLength = list.length;

      for (firingIndex = firingStart; firingIndex < firingLength; firingIndex++) {
        if (list[firingIndex]) {
          const result = list[firingIndex].apply(context, args);
          if (flags.stopOnFalse && result === false) {
            memory = false;
            break;
          }
        }
      }

      firing = false;

      if (flags.memory) {
        memory = args;
      }

      if (flags.once) {
        if (flags.memory) {
          list = [];
        } else {
          disabled = true;
        }
      }
    };

    const self = {
      add: function(...fns) {
        if (disabled) return this;

        fns.forEach(fn => {
          if (typeof fn === 'function') {
            if (!flags.unique || list.indexOf(fn) === -1) {
              list.push(fn);
            }
          } else if (Array.isArray(fn)) {
            self.add(...fn);
          }
        });

        if (flags.memory && memory && !firing) {
          firingStart = list.length - fns.length;
          fire(this, memory);
        }

        return this;
      },

      remove: function(...fns) {
        fns.forEach(fn => {
          let index;
          while ((index = list.indexOf(fn)) > -1) {
            list.splice(index, 1);
            if (firing && index <= firingLength) {
              firingLength--;
              if (index <= firingIndex) {
                firingIndex--;
              }
            }
          }
        });
        return this;
      },

      has: function(fn) {
        return fn ? list.indexOf(fn) > -1 : list.length > 0;
      },

      empty: function() {
        list = [];
        firingLength = 0;
        return this;
      },

      disable: function() {
        disabled = true;
        list = [];
        memory = null;
        return this;
      },

      disabled: function() {
        return disabled;
      },

      lock: function() {
        locked = true;
        if (!memory) {
          self.disable();
        }
        return this;
      },

      locked: function() {
        return locked;
      },

      fire: function(...args) {
        fire(this, args);
        return this;
      },

      fireWith: function(context, args) {
        fire(context, args || []);
        return this;
      },

      fired: function() {
        return fired;
      }
    };

    return self;
  };

  // ============================================
  // SECTION 20: ANIMATION QUEUE SYSTEM
  // ============================================

  /**
   * Animation queue storage
   */
  const queues = new WeakMap();

  /**
   * Get or set queue for element
   */
  Pluck.fn.queue = function(type, data) {
    if (typeof type !== 'string') {
      data = type;
      type = 'fx';
    }

    if (data === undefined) {
      const el = this.elements[0];
      if (!el) return [];
      const q = queues.get(el);
      return (q && q[type]) || [];
    }

    return this.each(function() {
      let q = queues.get(this);
      if (!q) {
        q = {};
        queues.set(this, q);
      }

      if (!q[type]) {
        q[type] = [];
      }

      if (Array.isArray(data)) {
        q[type] = data.slice();
      } else if (typeof data === 'function') {
        q[type].push(data);

        // Auto-dequeue if this is the first item
        if (q[type].length === 1) {
          Pluck.dequeue(this, type);
        }
      }
    });
  };

  /**
   * Execute next function in queue
   */
  Pluck.fn.dequeue = function(type) {
    if (typeof type !== 'string') {
      type = 'fx';
    }

    return this.each(function() {
      Pluck.dequeue(this, type);
    });
  };

  /**
   * Static dequeue
   */
  Pluck.dequeue = function(elem, type) {
    type = type || 'fx';

    const q = queues.get(elem);
    if (!q || !q[type] || q[type].length === 0) return;

    const fn = q[type].shift();

    if (fn === 'inprogress') {
      Pluck.dequeue(elem, type);
      return;
    }

    if (fn) {
      if (type === 'fx') {
        q[type].unshift('inprogress');
      }

      const next = function() {
        Pluck.dequeue(elem, type);
      };

      fn.call(elem, next);
    }
  };

  /**
   * Static queue
   */
  Pluck.queue = function(elem, type, data) {
    if (typeof type !== 'string') {
      data = type;
      type = 'fx';
    }

    if (data === undefined) {
      const q = queues.get(elem);
      return (q && q[type]) || [];
    }

    return new Pluck(elem).queue(type, data);
  };

  /**
   * Clear queue
   */
  Pluck.fn.clearQueue = function(type) {
    return this.queue(type || 'fx', []);
  };

  /**
   * Promise for queue completion
   */
  Pluck.fn.promise = function(type) {
    if (typeof type !== 'string') {
      type = 'fx';
    }

    const deferred = Pluck.Deferred();
    const elements = this.elements;

    let remaining = elements.length;

    if (remaining === 0) {
      deferred.resolve(this);
      return deferred.promise();
    }

    const checkQueue = () => {
      remaining--;
      if (remaining === 0) {
        deferred.resolve(this);
      }
    };

    elements.forEach(el => {
      const q = queues.get(el);
      if (!q || !q[type] || q[type].length === 0) {
        checkQueue();
      } else {
        q[type].push(checkQueue);
      }
    });

    return deferred.promise();
  };

  // ============================================
  // SECTION 21: GLOBAL AJAX EVENTS
  // ============================================

  /**
   * Global AJAX event handlers
   */
  const ajaxEvents = Pluck.Callbacks('memory');
  let activeAjaxCount = 0;

  Pluck.fn.ajaxStart = function(handler) {
    return this.on('ajaxStart', handler);
  };

  Pluck.fn.ajaxStop = function(handler) {
    return this.on('ajaxStop', handler);
  };

  Pluck.fn.ajaxComplete = function(handler) {
    return this.on('ajaxComplete', handler);
  };

  Pluck.fn.ajaxError = function(handler) {
    return this.on('ajaxError', handler);
  };

  Pluck.fn.ajaxSuccess = function(handler) {
    return this.on('ajaxSuccess', handler);
  };

  Pluck.fn.ajaxSend = function(handler) {
    return this.on('ajaxSend', handler);
  };

  /**
   * Trigger global AJAX event
   */
  function triggerGlobalAjax(event, xhr, settings, extra) {
    new Pluck(document).trigger(event, [xhr, settings, extra]);
  }

  /**
   * AJAX Setup - Set default options
   */
  const ajaxDefaults = {
    method: 'GET',
    url: '',
    data: null,
    headers: {},
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    dataType: 'text',
    timeout: 0,
    cache: true,
    processData: true,
    async: true,
    global: true
  };

  Pluck.ajaxSetup = function(options) {
    Pluck.extend(ajaxDefaults, options);
    return ajaxDefaults;
  };

  /**
   * AJAX Prefilter functions
   */
  const ajaxPrefilters = [];

  Pluck.ajaxPrefilter = function(dataTypes, handler) {
    if (typeof dataTypes === 'function') {
      handler = dataTypes;
      dataTypes = '*';
    }
    ajaxPrefilters.push({ dataTypes: dataTypes.split(/\s+/), handler });
  };

  // ============================================
  // SECTION 22: LEGACY EVENT METHODS
  // ============================================

  /**
   * .bind() - Deprecated, use .on()
   */
  Pluck.fn.bind = function(eventType, data, handler) {
    return this.on(eventType, null, data, handler);
  };

  /**
   * .unbind() - Deprecated, use .off()
   */
  Pluck.fn.unbind = function(eventType, handler) {
    return this.off(eventType, null, handler);
  };

  /**
   * .delegate() - Deprecated, use .on()
   */
  Pluck.fn.delegate = function(selector, eventType, data, handler) {
    return this.on(eventType, selector, data, handler);
  };

  /**
   * .undelegate() - Deprecated, use .off()
   */
  Pluck.fn.undelegate = function(selector, eventType, handler) {
    if (arguments.length === 0) {
      return this.off();
    }
    return this.off(eventType, selector, handler);
  };

  // ============================================
  // SECTION 23: CUSTOM SELECTOR EXTENSIONS
  // ============================================

  /**
   * Custom pseudo-selectors support
   */
  Pluck.expr = {
    ':': {
      hidden: function(el) {
        return el.offsetWidth <= 0 && el.offsetHeight <= 0;
      },
      visible: function(el) {
        return el.offsetWidth > 0 || el.offsetHeight > 0;
      },
      animated: function(el) {
        const q = queues.get(el);
        return q && q.fx && q.fx.length > 0;
      },
      contains: function(el, text) {
        return (el.textContent || el.innerText || '').indexOf(text) > -1;
      },
      empty: function(el) {
        return !el.firstChild;
      },
      parent: function(el) {
        return !!el.firstChild;
      },
      header: function(el) {
        return /^h[1-6]$/i.test(el.nodeName);
      },
      input: function(el) {
        return /^(input|select|textarea|button)$/i.test(el.nodeName);
      },
      button: function(el) {
        return el.nodeName === 'BUTTON' || (el.nodeName === 'INPUT' && el.type === 'button');
      },
      text: function(el) {
        return el.nodeName === 'INPUT' && el.type === 'text';
      },
      password: function(el) {
        return el.nodeName === 'INPUT' && el.type === 'password';
      },
      checkbox: function(el) {
        return el.nodeName === 'INPUT' && el.type === 'checkbox';
      },
      radio: function(el) {
        return el.nodeName === 'INPUT' && el.type === 'radio';
      },
      file: function(el) {
        return el.nodeName === 'INPUT' && el.type === 'file';
      },
      submit: function(el) {
        return el.nodeName === 'INPUT' && el.type === 'submit';
      },
      reset: function(el) {
        return el.nodeName === 'INPUT' && el.type === 'reset';
      },
      image: function(el) {
        return el.nodeName === 'INPUT' && el.type === 'image';
      },
      enabled: function(el) {
        return !el.disabled;
      },
      disabled: function(el) {
        return el.disabled;
      },
      checked: function(el) {
        return el.checked;
      },
      selected: function(el) {
        return el.selected;
      },
      focus: function(el) {
        return el === document.activeElement;
      }
    }
  };

  /**
   * Filter elements by custom pseudo-selector
   */
  Pluck.fn.filterCustom = function(pseudo, arg) {
    if (Pluck.expr[':'][pseudo]) {
      return this.filter(function() {
        return Pluck.expr[':'][pseudo](this, arg);
      });
    }
    return this;
  };

  // ============================================
  // SECTION 24: ADDITIONAL STATIC UTILITIES
  // ============================================

  /**
   * Extend objects
   */
  Pluck.extend = function(...args) {
    let deep = false;
    let target = args[0];
    let i = 1;

    if (typeof target === 'boolean') {
      deep = target;
      target = args[1];
      i = 2;
    }

    if (typeof target !== 'object' && typeof target !== 'function') {
      target = {};
    }

    for (; i < args.length; i++) {
      const source = args[i];
      if (!source) continue;

      for (const key in source) {
        const srcVal = source[key];

        if (deep && srcVal && typeof srcVal === 'object' && !Array.isArray(srcVal)) {
          target[key] = Pluck.extend(true, target[key] || {}, srcVal);
        } else if (srcVal !== undefined) {
          target[key] = srcVal;
        }
      }
    }

    return target;
  };

  /**
   * Extend Pluck prototype
   */
  Pluck.fn.extend = function(obj) {
    return Pluck.extend(Pluck.fn, obj);
  };

  /**
   * Iterate over array or object
   */
  Pluck.each = function(obj, callback) {
    if (Array.isArray(obj) || obj instanceof NodeList) {
      for (let i = 0; i < obj.length; i++) {
        if (callback.call(obj[i], i, obj[i]) === false) break;
      }
    } else {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (callback.call(obj[key], key, obj[key]) === false) break;
        }
      }
    }
    return obj;
  };

  /**
   * Map array or object
   */
  Pluck.map = function(obj, callback) {
    const result = [];
    if (Array.isArray(obj) || obj instanceof NodeList) {
      for (let i = 0; i < obj.length; i++) {
        const val = callback(obj[i], i);
        if (val != null) result.push(val);
      }
    } else {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const val = callback(obj[key], key);
          if (val != null) result.push(val);
        }
      }
    }
    return result;
  };

  /**
   * Filter array
   */
  Pluck.grep = function(arr, callback, invert) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      const passes = callback(arr[i], i);
      if (invert ? !passes : passes) {
        result.push(arr[i]);
      }
    }
    return result;
  };

  /**
   * Find index in array
   */
  Pluck.inArray = function(value, arr, fromIndex) {
    return arr.indexOf(value, fromIndex);
  };

  /**
   * Merge arrays
   */
  Pluck.merge = function(first, second) {
    first.push(...second);
    return first;
  };

  /**
   * Make array
   */
  Pluck.makeArray = function(obj) {
    return Array.from(obj);
  };

  /**
   * Check if value is array
   */
  Pluck.isArray = Array.isArray;

  /**
   * Check if value is function
   */
  Pluck.isFunction = function(fn) {
    return typeof fn === 'function';
  };

  /**
   * Check if value is plain object
   */
  Pluck.isPlainObject = function(obj) {
    if (!obj || typeof obj !== 'object') return false;
    const proto = Object.getPrototypeOf(obj);
    return proto === null || proto === Object.prototype;
  };

  /**
   * Check if object is empty
   */
  Pluck.isEmptyObject = function(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };

  /**
   * Check if value is numeric
   */
  Pluck.isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  /**
   * Check if value is window
   */
  Pluck.isWindow = function(obj) {
    return obj != null && obj === obj.window;
  };

  /**
   * Get type of value
   */
  Pluck.type = function(obj) {
    if (obj === null) return 'null';
    if (obj === undefined) return 'undefined';
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
  };

  /**
   * Get current timestamp
   */
  Pluck.now = Date.now;

  /**
   * Trim whitespace
   */
  Pluck.trim = function(str) {
    return str == null ? '' : String(str).trim();
  };

  /**
   * Create URL params
   */
  Pluck.param = function(obj, traditional) {
    if (traditional || Array.isArray(obj)) {
      const params = [];
      const add = (key, value) => {
        params.push(encodeURIComponent(key) + '=' + encodeURIComponent(value == null ? '' : value));
      };

      if (Array.isArray(obj)) {
        obj.forEach(item => add(item.name, item.value));
      } else {
        for (const key in obj) {
          buildParams(key, obj[key], traditional, add);
        }
      }
      return params.join('&');
    }
    return new URLSearchParams(obj).toString();
  };

  /**
   * Parse JSON safely
   */
  Pluck.parseJSON = function(str) {
    return JSON.parse(str);
  };

  /**
   * Parse HTML string
   */
  Pluck.parseHTML = function(html, context, keepScripts) {
    if (typeof html !== 'string') return [];

    const temp = document.createElement('div');
    temp.innerHTML = html;

    if (!keepScripts) {
      temp.querySelectorAll('script').forEach(s => s.remove());
    }

    return Array.from(temp.childNodes);
  };

  /**
   * Parse XML string
   */
  Pluck.parseXML = function(data) {
    const parser = new DOMParser();
    return parser.parseFromString(data, 'application/xml');
  };

  /**
   * Check if element contains another
   */
  Pluck.contains = function(container, contained) {
    return container !== contained && container.contains(contained);
  };

  /**
   * Empty function
   */
  Pluck.noop = function() {};

  /**
   * Proxy function (bind context)
   */
  Pluck.proxy = function(fn, context) {
    if (typeof fn === 'string') {
      const tmp = context[fn];
      fn = tmp;
    }
    return fn.bind(context);
  };

  /**
   * No conflict mode
   */
  Pluck.noConflict = function() {
    if (global.pluck === Pluck) {
      global.pluck = undefined;
    }
    if (global.p === Pluck) {
      global.p = undefined;
    }
    return Pluck;
  };

  /**
   * Escape CSS selector string
   */
  Pluck.escapeSelector = function(sel) {
    return (sel + '').replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1');
  };

  /**
   * Check if element has data
   */
  Pluck.hasData = function(elem) {
    if (!elem) return false;
    // Check for data attributes
    if (elem.dataset && Object.keys(elem.dataset).length > 0) return true;
    // Check for stored events
    if (elem._pluckEvents && Object.keys(elem._pluckEvents).length > 0) return true;
    // Check for queue data
    if (queues.has(elem)) return true;
    return false;
  };

  /**
   * Remove duplicates and sort
   */
  Pluck.uniqueSort = function(arr) {
    const unique = [...new Set(arr)];
    return unique.sort((a, b) => {
      if (a === b) return 0;
      if (!a.compareDocumentPosition) return 0;
      const result = a.compareDocumentPosition(b);
      if (result & 4) return -1; // a before b
      if (result & 2) return 1;  // a after b
      return 0;
    });
  };

  /**
   * Execute script globally
   */
  Pluck.globalEval = function(code) {
    const script = document.createElement('script');
    script.text = code;
    document.head.appendChild(script).parentNode.removeChild(script);
  };

  /**
   * Check if document is XML
   */
  Pluck.isXMLDoc = function(elem) {
    const namespace = elem && (elem.ownerDocument || elem).documentElement;
    return namespace ? namespace.nodeName !== 'HTML' : false;
  };

  /**
   * Hold or release ready event
   */
  let readyHold = false;
  const readyWait = [];

  Pluck.holdReady = function(hold) {
    if (hold) {
      readyHold = true;
    } else {
      readyHold = false;
      readyWait.forEach(fn => fn());
      readyWait.length = 0;
    }
  };

  /**
   * Throw error
   */
  Pluck.error = function(msg) {
    throw new Error(msg);
  };

  /**
   * HTML prefilter (for processing HTML before insertion)
   */
  Pluck.htmlPrefilter = function(html) {
    return html;
  };

  /**
   * CSS Hooks for custom property handling
   */
  Pluck.cssHooks = {};

  /**
   * Animation settings
   */
  Pluck.fx = {
    off: false,
    interval: 13,
    speeds: {
      slow: 600,
      fast: 200,
      _default: 400
    }
  };

  /**
   * Speed helper for animations
   */
  Pluck.speed = function(speed, easing, callback) {
    const opt = speed && typeof speed === 'object' ? Pluck.extend({}, speed) : {
      complete: callback || (!callback && easing) || (typeof speed === 'function' && speed),
      duration: speed,
      easing: callback && easing || easing && typeof easing !== 'function' && easing
    };

    if (Pluck.fx.off) {
      opt.duration = 0;
    } else if (typeof opt.duration !== 'number') {
      if (opt.duration in Pluck.fx.speeds) {
        opt.duration = Pluck.fx.speeds[opt.duration];
      } else {
        opt.duration = Pluck.fx.speeds._default;
      }
    }

    return opt;
  };

  /**
   * Static data get/set
   */
  Pluck.data = function(elem, key, value) {
    if (value !== undefined) {
      if (key) {
        elem.dataset[key] = typeof value === 'object' ? JSON.stringify(value) : value;
      }
      return value;
    }
    if (key === undefined) {
      const data = {};
      for (const k in elem.dataset) {
        data[k] = tryParseJSON(elem.dataset[k]);
      }
      return data;
    }
    return tryParseJSON(elem.dataset[key]);
  };

  /**
   * Static removeData
   */
  Pluck.removeData = function(elem, key) {
    if (key === undefined) {
      for (const k in elem.dataset) {
        delete elem.dataset[k];
      }
    } else {
      delete elem.dataset[key];
    }
  };

  /**
   * Push elements onto stack (for internal traversing)
   */
  Pluck.fn.pushStack = function(elements) {
    const ret = new Pluck(elements);
    ret._prevObject = this;
    return ret;
  };

  // ============================================
  // SECTION 19: HELPER FUNCTIONS (Private)
  // ============================================

  /**
   * Try to parse JSON, return original if fails
   */
  function tryParseJSON(str) {
    if (str === undefined || str === null) return undefined;
    try {
      return JSON.parse(str);
    } catch {
      return str;
    }
  }

  /**
   * Convert camelCase to kebab-case
   */
  function camelToKebab(str) {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  /**
   * Set style with auto px
   */
  function setStyle(el, prop, value) {
    if (typeof value === 'number' && !cssNumber[prop]) {
      value = value + 'px';
    }
    el.style[prop] = value;
  }

  /**
   * Get default display for element
   */
  function getDefaultDisplay(tagName) {
    const displays = {
      DIV: 'block', SPAN: 'inline', P: 'block', A: 'inline',
      TABLE: 'table', TR: 'table-row', TD: 'table-cell', TH: 'table-cell',
      UL: 'block', OL: 'block', LI: 'list-item',
      IMG: 'inline', INPUT: 'inline-block', BUTTON: 'inline-block',
      H1: 'block', H2: 'block', H3: 'block', H4: 'block', H5: 'block', H6: 'block',
      FORM: 'block', SECTION: 'block', ARTICLE: 'block', NAV: 'block',
      HEADER: 'block', FOOTER: 'block', MAIN: 'block', ASIDE: 'block'
    };
    return displays[tagName.toUpperCase()] || 'block';
  }

  /**
   * Build params for $.param
   */
  function buildParams(key, value, traditional, add) {
    if (Array.isArray(value)) {
      value.forEach((v, i) => {
        if (traditional) {
          add(key, v);
        } else {
          buildParams(key + '[' + (typeof v === 'object' ? i : '') + ']', v, traditional, add);
        }
      });
    } else if (!traditional && typeof value === 'object') {
      for (const k in value) {
        buildParams(key + '[' + k + ']', value[k], traditional, add);
      }
    } else {
      add(key, value);
    }
  }

  /**
   * CSS properties that don't need 'px'
   */
  const cssNumber = {
    columnCount: true, fillOpacity: true, flexGrow: true, flexShrink: true,
    fontWeight: true, gridArea: true, gridColumn: true, gridColumnEnd: true,
    gridColumnStart: true, gridRow: true, gridRowEnd: true, gridRowStart: true,
    lineHeight: true, opacity: true, order: true, orphans: true,
    widows: true, zIndex: true, zoom: true
  };

  // Expose cssNumber
  Pluck.cssNumber = cssNumber;

  /**
   * Prototype uniqueSort method
   */
  Pluck.fn.uniqueSort = function() {
    return new Pluck(Pluck.uniqueSort(this.elements));
  };

  // ============================================
  // SECTION 20: EXPOSE GLOBALLY
  // ============================================

  // Create the main function
  const pluck = function(selector, context) {
    return new Pluck(selector, context);
  };

  // Copy over prototype
  pluck.fn = Pluck.fn;
  pluck.prototype = Pluck.prototype;

  // Copy static methods
  const staticMethods = [
    // AJAX
    'ajax', 'get', 'post', 'getJSON', 'getScript', 'ajaxSetup', 'ajaxPrefilter',
    // Core utilities
    'extend', 'each', 'map', 'grep', 'inArray', 'merge', 'makeArray',
    // Type checking
    'isArray', 'isFunction', 'isPlainObject', 'isEmptyObject', 'isNumeric', 'isWindow', 'isXMLDoc',
    // Parsing
    'type', 'now', 'trim', 'param', 'parseJSON', 'parseHTML', 'parseXML',
    // DOM utilities
    'contains', 'noop', 'proxy', 'noConflict', 'escapeSelector', 'uniqueSort',
    // Data
    'data', 'removeData', 'hasData',
    // Deferred & Callbacks
    'Deferred', 'when', 'Callbacks',
    // Queue
    'queue', 'dequeue',
    // Animation
    'fx', 'speed',
    // Other
    'globalEval', 'holdReady', 'error', 'htmlPrefilter', 'cssHooks', 'cssNumber', 'expr'
  ];

  staticMethods.forEach(method => {
    pluck[method] = Pluck[method];
  });

  // Version
  pluck.version = '2.0.0';

  // Expose
  global.pluck = global.p = pluck;

  return pluck;
});
