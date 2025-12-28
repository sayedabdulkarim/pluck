// Type definitions for Pluck.js 2.0.0
// Project: https://github.com/sayedabdulkarim/pluck
// Definitions by: Sayed Abdul Karim

declare module 'pluck-dom' {
  export = pluck;
}

// Global declarations
declare const p: PluckStatic;
declare const pluck: PluckStatic;

interface PluckStatic {
  // Constructor
  (selector: string | Element | Element[] | Document | PluckObject | Function): PluckObject;
  <T extends Element>(selector: string | Element | Element[] | Document | PluckObject | Function): PluckObject;

  // Prototype
  fn: PluckObject;

  // AJAX Methods
  ajax(options: AjaxOptions): Deferred;
  get(url: string, data?: any, success?: Function, dataType?: string): Deferred;
  post(url: string, data?: any, success?: Function, dataType?: string): Deferred;
  getJSON(url: string, data?: any, success?: Function): Deferred;
  getScript(url: string, success?: Function): Deferred;
  ajaxSetup(options: AjaxOptions): AjaxOptions;
  ajaxPrefilter(dataTypes: string, handler: Function): void;
  ajaxPrefilter(handler: Function): void;

  // Deferred & Callbacks
  Deferred(beforeStart?: Function): Deferred;
  when(...deferreds: (Deferred | any)[]): Deferred;
  Callbacks(flags?: string): Callbacks;

  // Queue
  queue(elem: Element, type?: string, data?: Function | Function[]): Function[];
  dequeue(elem: Element, type?: string): void;

  // Data
  data(elem: Element, key?: string, value?: any): any;
  removeData(elem: Element, key?: string): void;
  hasData(elem: Element): boolean;

  // Utilities
  extend(...objects: any[]): any;
  extend(deep: boolean, ...objects: any[]): any;
  each(obj: any, callback: (index: number | string, value: any) => boolean | void): any;
  map(obj: any, callback: (value: any, index: number | string) => any): any[];
  grep(arr: any[], callback: (value: any, index: number) => boolean, invert?: boolean): any[];
  inArray(value: any, arr: any[], fromIndex?: number): number;
  merge(first: any[], second: any[]): any[];
  makeArray(obj: any): any[];
  isArray(obj: any): obj is any[];
  isFunction(obj: any): obj is Function;
  isPlainObject(obj: any): boolean;
  isEmptyObject(obj: any): boolean;
  isNumeric(value: any): boolean;
  isWindow(obj: any): boolean;
  isXMLDoc(elem: Element): boolean;
  type(obj: any): string;
  now(): number;
  trim(str: string): string;
  param(obj: any, traditional?: boolean): string;
  parseJSON(str: string): any;
  parseHTML(html: string, context?: Document, keepScripts?: boolean): Element[];
  parseXML(data: string): Document;
  contains(container: Element, contained: Element): boolean;
  noop(): void;
  proxy(fn: Function, context: any): Function;
  proxy(context: any, name: string): Function;
  noConflict(removeAll?: boolean): PluckStatic;
  escapeSelector(selector: string): string;
  uniqueSort(arr: Element[]): Element[];
  globalEval(code: string): void;
  holdReady(hold: boolean): void;
  error(message: string): never;
  htmlPrefilter(html: string): string;

  // CSS
  cssHooks: { [key: string]: any };
  cssNumber: { [key: string]: boolean };

  // Effects
  fx: {
    off: boolean;
    interval: number;
    speeds: { slow: number; fast: number; _default: number };
  };
  speed(speed?: number | string, easing?: string, callback?: Function): { duration: number; easing: string; complete?: Function };

  // Custom selectors
  expr: {
    ':': { [key: string]: (elem: Element, arg?: string) => boolean };
  };
}

interface PluckObject {
  // Core
  length: number;
  [index: number]: Element;

  // Each & Map
  each(callback: (index: number, element: Element) => boolean | void): PluckObject;
  map(callback: (index: number, element: Element) => any): PluckObject;
  toArray(): Element[];
  get(index?: number): Element | Element[];
  index(selector?: string | Element | PluckObject): number;

  // Manipulation - Content
  html(): string;
  html(content: string | Function): PluckObject;
  text(): string;
  text(content: string | number | boolean | Function): PluckObject;
  val(): string | string[] | number;
  val(value: string | string[] | number | Function): PluckObject;

  // Attributes & Properties
  attr(name: string): string | undefined;
  attr(name: string, value: string | number | null | Function): PluckObject;
  attr(attributes: { [key: string]: string | number | null }): PluckObject;
  removeAttr(name: string): PluckObject;
  prop(name: string): any;
  prop(name: string, value: any): PluckObject;
  prop(properties: { [key: string]: any }): PluckObject;
  removeProp(name: string): PluckObject;

  // Data
  data(key: string): any;
  data(key: string, value: any): PluckObject;
  data(obj: { [key: string]: any }): PluckObject;
  data(): { [key: string]: any };
  removeData(key?: string): PluckObject;

  // CSS & Classes
  css(property: string): string;
  css(property: string, value: string | number | Function): PluckObject;
  css(properties: { [key: string]: string | number }): PluckObject;
  addClass(className: string | Function): PluckObject;
  removeClass(className?: string | Function): PluckObject;
  toggleClass(className: string | Function, state?: boolean): PluckObject;
  hasClass(className: string): boolean;

  // DOM Manipulation
  append(...contents: (string | Element | PluckObject)[]): PluckObject;
  prepend(...contents: (string | Element | PluckObject)[]): PluckObject;
  before(...contents: (string | Element | PluckObject)[]): PluckObject;
  after(...contents: (string | Element | PluckObject)[]): PluckObject;
  appendTo(target: string | Element | PluckObject): PluckObject;
  prependTo(target: string | Element | PluckObject): PluckObject;
  insertAfter(target: string | Element | PluckObject): PluckObject;
  insertBefore(target: string | Element | PluckObject): PluckObject;
  remove(selector?: string): PluckObject;
  detach(selector?: string): PluckObject;
  empty(): PluckObject;
  clone(withDataAndEvents?: boolean, deepWithDataAndEvents?: boolean): PluckObject;
  wrap(wrapper: string | Element | PluckObject | Function): PluckObject;
  wrapAll(wrapper: string | Element | PluckObject | Function): PluckObject;
  wrapInner(wrapper: string | Element | PluckObject | Function): PluckObject;
  unwrap(selector?: string): PluckObject;
  replaceWith(content: string | Element | PluckObject | Function): PluckObject;
  replaceAll(target: string | Element | PluckObject): PluckObject;

  // Traversing
  find(selector: string): PluckObject;
  parent(selector?: string): PluckObject;
  parents(selector?: string): PluckObject;
  parentsUntil(selector?: string | Element, filter?: string): PluckObject;
  closest(selector: string | Element | PluckObject): PluckObject;
  offsetParent(): PluckObject;
  children(selector?: string): PluckObject;
  contents(): PluckObject;
  siblings(selector?: string): PluckObject;
  next(selector?: string): PluckObject;
  nextAll(selector?: string): PluckObject;
  nextUntil(selector?: string | Element, filter?: string): PluckObject;
  prev(selector?: string): PluckObject;
  prevAll(selector?: string): PluckObject;
  prevUntil(selector?: string | Element, filter?: string): PluckObject;

  // Filtering
  first(): PluckObject;
  last(): PluckObject;
  eq(index: number): PluckObject;
  filter(selector: string | Element | PluckObject | Function): PluckObject;
  not(selector: string | Element | PluckObject | Function): PluckObject;
  is(selector: string | Element | PluckObject | Function): boolean;
  has(selector: string | Element): PluckObject;
  slice(start: number, end?: number): PluckObject;
  even(): PluckObject;
  odd(): PluckObject;
  add(selector: string | Element | PluckObject, context?: Element): PluckObject;
  addBack(selector?: string): PluckObject;
  end(): PluckObject;
  pushStack(elements: Element[]): PluckObject;
  uniqueSort(): PluckObject;
  filterCustom(pseudo: string, arg?: string): PluckObject;

  // Events
  on(events: string, handler: EventHandler): PluckObject;
  on(events: string, selector: string, handler: EventHandler): PluckObject;
  on(events: string, selector: string, data: any, handler: EventHandler): PluckObject;
  on(events: { [key: string]: EventHandler }, selector?: string, data?: any): PluckObject;
  off(events?: string, selector?: string, handler?: EventHandler): PluckObject;
  off(events: { [key: string]: EventHandler }, selector?: string): PluckObject;
  one(events: string, handler: EventHandler): PluckObject;
  one(events: string, selector: string, handler: EventHandler): PluckObject;
  one(events: string, selector: string, data: any, handler: EventHandler): PluckObject;
  trigger(eventType: string | Event, data?: any): PluckObject;
  triggerHandler(eventType: string | Event, data?: any): any;
  hover(enterHandler: EventHandler, leaveHandler?: EventHandler): PluckObject;
  ready(callback: Function): PluckObject;

  // Event shortcuts
  click(handler?: EventHandler): PluckObject;
  dblclick(handler?: EventHandler): PluckObject;
  mousedown(handler?: EventHandler): PluckObject;
  mouseup(handler?: EventHandler): PluckObject;
  mousemove(handler?: EventHandler): PluckObject;
  mouseenter(handler?: EventHandler): PluckObject;
  mouseleave(handler?: EventHandler): PluckObject;
  mouseover(handler?: EventHandler): PluckObject;
  mouseout(handler?: EventHandler): PluckObject;
  keydown(handler?: EventHandler): PluckObject;
  keyup(handler?: EventHandler): PluckObject;
  keypress(handler?: EventHandler): PluckObject;
  focus(handler?: EventHandler): PluckObject;
  blur(handler?: EventHandler): PluckObject;
  change(handler?: EventHandler): PluckObject;
  submit(handler?: EventHandler): PluckObject;
  scroll(handler?: EventHandler): PluckObject;
  resize(handler?: EventHandler): PluckObject;
  load(handler?: EventHandler): PluckObject;
  unload(handler?: EventHandler): PluckObject;
  error(handler?: EventHandler): PluckObject;
  contextmenu(handler?: EventHandler): PluckObject;
  focusin(handler?: EventHandler): PluckObject;
  focusout(handler?: EventHandler): PluckObject;
  select(handler?: EventHandler): PluckObject;

  // Legacy Events
  bind(eventType: string, data: any, handler: EventHandler): PluckObject;
  bind(eventType: string, handler: EventHandler): PluckObject;
  unbind(eventType?: string, handler?: EventHandler): PluckObject;
  delegate(selector: string, eventType: string, handler: EventHandler): PluckObject;
  delegate(selector: string, eventType: string, data: any, handler: EventHandler): PluckObject;
  undelegate(selector?: string, eventType?: string, handler?: EventHandler): PluckObject;

  // Effects
  show(duration?: number | string, easing?: string, callback?: Function): PluckObject;
  hide(duration?: number | string, easing?: string, callback?: Function): PluckObject;
  toggle(duration?: number | string, easing?: string, callback?: Function): PluckObject;
  fadeIn(duration?: number | string, easing?: string, callback?: Function): PluckObject;
  fadeOut(duration?: number | string, easing?: string, callback?: Function): PluckObject;
  fadeToggle(duration?: number | string, easing?: string, callback?: Function): PluckObject;
  fadeTo(duration: number | string, opacity: number, easing?: string, callback?: Function): PluckObject;
  slideDown(duration?: number | string, easing?: string, callback?: Function): PluckObject;
  slideUp(duration?: number | string, easing?: string, callback?: Function): PluckObject;
  slideToggle(duration?: number | string, easing?: string, callback?: Function): PluckObject;
  animate(properties: { [key: string]: string | number }, duration?: number | string, easing?: string, callback?: Function): PluckObject;
  animate(properties: { [key: string]: string | number }, options?: AnimateOptions): PluckObject;
  stop(clearQueue?: boolean, jumpToEnd?: boolean): PluckObject;
  finish(): PluckObject;
  delay(duration: number, queueName?: string): PluckObject;

  // Dimensions
  width(): number;
  width(value: number | string | Function): PluckObject;
  height(): number;
  height(value: number | string | Function): PluckObject;
  innerWidth(): number;
  innerHeight(): number;
  outerWidth(includeMargin?: boolean): number;
  outerHeight(includeMargin?: boolean): number;

  // Offset & Position
  position(): { top: number; left: number };
  offset(): { top: number; left: number };
  offset(coords: { top?: number; left?: number } | Function): PluckObject;
  scrollTop(): number;
  scrollTop(value: number): PluckObject;
  scrollLeft(): number;
  scrollLeft(value: number): PluckObject;

  // AJAX
  load(url: string, data?: any, complete?: Function): PluckObject;

  // Forms
  serialize(): string;
  serializeArray(): { name: string; value: string }[];

  // Queue
  queue(queueName?: string): Function[];
  queue(queueName: string, newQueue: Function[]): PluckObject;
  queue(queueName: string, callback: Function): PluckObject;
  queue(callback: Function): PluckObject;
  dequeue(queueName?: string): PluckObject;
  clearQueue(queueName?: string): PluckObject;
  promise(type?: string): Deferred;

  // Global AJAX Events
  ajaxStart(handler: Function): PluckObject;
  ajaxStop(handler: Function): PluckObject;
  ajaxComplete(handler: Function): PluckObject;
  ajaxError(handler: Function): PluckObject;
  ajaxSuccess(handler: Function): PluckObject;
  ajaxSend(handler: Function): PluckObject;

  // Extend
  extend(obj: any): PluckObject;
}

// Event Handler Type
type EventHandler = (event: Event, ...args: any[]) => boolean | void;

// AJAX Options
interface AjaxOptions {
  url?: string;
  method?: string;
  type?: string;
  data?: any;
  dataType?: string;
  contentType?: string | boolean;
  headers?: { [key: string]: string };
  timeout?: number;
  async?: boolean;
  cache?: boolean;
  processData?: boolean;
  traditional?: boolean;
  beforeSend?: (xhr: XMLHttpRequest, settings: AjaxOptions) => boolean | void;
  success?: (data: any, textStatus: string, xhr: XMLHttpRequest) => void;
  error?: (xhr: XMLHttpRequest, textStatus: string, errorThrown: string) => void;
  complete?: (xhr: XMLHttpRequest, textStatus: string) => void;
  statusCode?: { [code: number]: Function };
  context?: any;
  global?: boolean;
  username?: string;
  password?: string;
  xhrFields?: { [key: string]: any };
  mimeType?: string;
  jsonp?: string | boolean;
  jsonpCallback?: string | Function;
}

// Animate Options
interface AnimateOptions {
  duration?: number | string;
  easing?: string;
  complete?: Function;
  step?: Function;
  queue?: boolean | string;
  specialEasing?: { [key: string]: string };
  progress?: Function;
  start?: Function;
  done?: Function;
  fail?: Function;
  always?: Function;
}

// Deferred Interface
interface Deferred {
  state(): 'pending' | 'resolved' | 'rejected';
  always(...callbacks: Function[]): Deferred;
  done(...callbacks: Function[]): Deferred;
  fail(...callbacks: Function[]): Deferred;
  progress(...callbacks: Function[]): Deferred;
  then(doneFilter?: Function, failFilter?: Function, progressFilter?: Function): Deferred;
  promise(target?: any): Deferred;
  resolve(...args: any[]): Deferred;
  resolveWith(context: any, args?: any[]): Deferred;
  reject(...args: any[]): Deferred;
  rejectWith(context: any, args?: any[]): Deferred;
  notify(...args: any[]): Deferred;
  notifyWith(context: any, args?: any[]): Deferred;
  catch(failFilter: Function): Deferred;
}

// Callbacks Interface
interface Callbacks {
  add(...callbacks: Function[]): Callbacks;
  remove(...callbacks: Function[]): Callbacks;
  has(callback?: Function): boolean;
  empty(): Callbacks;
  disable(): Callbacks;
  disabled(): boolean;
  lock(): Callbacks;
  locked(): boolean;
  fire(...args: any[]): Callbacks;
  fireWith(context: any, args?: any[]): Callbacks;
  fired(): boolean;
}
