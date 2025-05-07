"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const obsidian = require("obsidian");
function noop() {
}
function assign(tar, src) {
  for (const k in src)
    tar[k] = src[k];
  return tar;
}
function add_location(element2, file2, line, column, char) {
  element2.__svelte_meta = {
    loc: { file: file2, line, column, char }
  };
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}
function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) {
    const lets = definition[2](fn(dirty));
    if ($$scope.dirty === void 0) {
      return lets;
    }
    if (typeof lets === "object") {
      const merged = [];
      const len = Math.max($$scope.dirty.length, lets.length);
      for (let i = 0; i < len; i += 1) {
        merged[i] = $$scope.dirty[i] | lets[i];
      }
      return merged;
    }
    return $$scope.dirty | lets;
  }
  return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
  if (slot_changes) {
    const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}
function get_all_dirty_from_scope($$scope) {
  if ($$scope.ctx.length > 32) {
    const dirty = [];
    const length = $$scope.ctx.length / 32;
    for (let i = 0; i < length; i++) {
      dirty[i] = -1;
    }
    return dirty;
  }
  return -1;
}
function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  node.parentNode.removeChild(node);
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_input_value(input, value) {
  input.value = value == null ? "" : value;
}
function set_style(node, key, value, important) {
  if (value === null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, important ? "important" : "");
  }
}
function toggle_class(element2, name, toggle) {
  element2.classList[toggle ? "add" : "remove"](name);
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, cancelable, detail);
  return e;
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail, { cancelable = false } = {}) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail, { cancelable });
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
      return !event.defaultPrevented;
    }
    return true;
  };
}
const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
function add_flush_callback(fn) {
  flush_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  const saved_component = current_component;
  do {
    while (flushidx < dirty_components.length) {
      const component = dirty_components[flushidx];
      flushidx++;
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
const outroing = /* @__PURE__ */ new Set();
let outros;
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}
const globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
function destroy_block(block, lookup) {
  block.d(1);
  lookup.delete(block.key);
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block2, next, get_context) {
  let o = old_blocks.length;
  let n = list.length;
  let i = o;
  const old_indexes = {};
  while (i--)
    old_indexes[old_blocks[i].key] = i;
  const new_blocks = [];
  const new_lookup = /* @__PURE__ */ new Map();
  const deltas = /* @__PURE__ */ new Map();
  i = n;
  while (i--) {
    const child_ctx = get_context(ctx, list, i);
    const key = get_key(child_ctx);
    let block = lookup.get(key);
    if (!block) {
      block = create_each_block2(key, child_ctx);
      block.c();
    } else if (dynamic) {
      block.p(child_ctx, dirty);
    }
    new_lookup.set(key, new_blocks[i] = block);
    if (key in old_indexes)
      deltas.set(key, Math.abs(i - old_indexes[key]));
  }
  const will_move = /* @__PURE__ */ new Set();
  const did_move = /* @__PURE__ */ new Set();
  function insert2(block) {
    transition_in(block, 1);
    block.m(node, next);
    lookup.set(block.key, block);
    next = block.first;
    n--;
  }
  while (o && n) {
    const new_block = new_blocks[n - 1];
    const old_block = old_blocks[o - 1];
    const new_key = new_block.key;
    const old_key = old_block.key;
    if (new_block === old_block) {
      next = new_block.first;
      o--;
      n--;
    } else if (!new_lookup.has(old_key)) {
      destroy(old_block, lookup);
      o--;
    } else if (!lookup.has(new_key) || will_move.has(new_key)) {
      insert2(new_block);
    } else if (did_move.has(old_key)) {
      o--;
    } else if (deltas.get(new_key) > deltas.get(old_key)) {
      did_move.add(new_key);
      insert2(new_block);
    } else {
      will_move.add(old_key);
      o--;
    }
  }
  while (o--) {
    const old_block = old_blocks[o];
    if (!new_lookup.has(old_block.key))
      destroy(old_block, lookup);
  }
  while (n)
    insert2(new_blocks[n - 1]);
  return new_blocks;
}
function validate_each_keys(ctx, list, get_context, get_key) {
  const keys = /* @__PURE__ */ new Set();
  for (let i = 0; i < list.length; i++) {
    const key = get_key(get_context(ctx, list, i));
    if (keys.has(key)) {
      throw new Error("Cannot have duplicate keys in a keyed each");
    }
    keys.add(key);
  }
}
function bind(component, name, callback) {
  const index = component.$$.props[name];
  if (index !== void 0) {
    component.$$.bound[index] = callback;
    callback(component.$$.ctx[index]);
  }
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor, customElement) {
  const { fragment, on_mount, on_destroy, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = on_mount.map(run).filter(is_function);
      if (on_destroy) {
        on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: null,
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
}
function dispatch_dev(type, detail) {
  document.dispatchEvent(custom_event(type, Object.assign({ version: "3.50.1" }, detail), { bubbles: true }));
}
function append_dev(target, node) {
  dispatch_dev("SvelteDOMInsert", { target, node });
  append(target, node);
}
function insert_dev(target, node, anchor) {
  dispatch_dev("SvelteDOMInsert", { target, node, anchor });
  insert(target, node, anchor);
}
function detach_dev(node) {
  dispatch_dev("SvelteDOMRemove", { node });
  detach(node);
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
  const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
  if (has_prevent_default)
    modifiers.push("preventDefault");
  if (has_stop_propagation)
    modifiers.push("stopPropagation");
  dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
  const dispose = listen(node, event, handler, options);
  return () => {
    dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
    dispose();
  };
}
function attr_dev(node, attribute, value) {
  attr(node, attribute, value);
  if (value == null)
    dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
  else
    dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
}
function set_data_dev(text2, data) {
  data = "" + data;
  if (text2.wholeText === data)
    return;
  dispatch_dev("SvelteDOMSetData", { node: text2, data });
  text2.data = data;
}
function validate_each_argument(arg) {
  if (typeof arg !== "string" && !(arg && typeof arg === "object" && "length" in arg)) {
    let msg = "{#each} only iterates over array-like objects.";
    if (typeof Symbol === "function" && arg && Symbol.iterator in arg) {
      msg += " You can use a spread to convert this iterable into an array.";
    }
    throw new Error(msg);
  }
}
function validate_slots(name, slot, keys) {
  for (const slot_key of Object.keys(slot)) {
    if (!~keys.indexOf(slot_key)) {
      console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
    }
  }
}
class SvelteComponentDev extends SvelteComponent {
  constructor(options) {
    if (!options || !options.target && !options.$$inline) {
      throw new Error("'target' is a required option");
    }
    super();
  }
  $destroy() {
    super.$destroy();
    this.$destroy = () => {
      console.warn("Component was already destroyed");
    };
  }
  $capture_state() {
  }
  $inject_state() {
  }
}
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
const Table_svelte_svelte_type_style_lang = "";
const file$3 = "E:/obdev/.obsidian/plugins/Obsidian-Table-Generator/src/ui/basic/Table.svelte";
function get_each_context$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[20] = list[i];
  child_ctx[22] = i;
  return child_ctx;
}
function get_each_context_1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[20] = list[i];
  child_ctx[24] = i;
  return child_ctx;
}
function create_each_block_1(key_1, ctx) {
  let div;
  let mounted;
  let dispose;
  function mouseenter_handler() {
    return ctx[12](ctx[22], ctx[24]);
  }
  function click_handler() {
    return ctx[13](ctx[22], ctx[24]);
  }
  const block = {
    key: key_1,
    first: null,
    c: function create() {
      div = element("div");
      attr_dev(div, "class", "table-generator-cell s-VU35bhriycJk");
      toggle_class(div, "active", ctx[0][ctx[22]][ctx[24]]);
      add_location(div, file$3, 43, 12, 1276);
      this.first = div;
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      if (!mounted) {
        dispose = [
          listen_dev(div, "mouseenter", mouseenter_handler, false, false, false),
          listen_dev(div, "click", click_handler, false, false, false)
        ];
        mounted = true;
      }
    },
    p: function update2(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 9) {
        toggle_class(div, "active", ctx[0][ctx[22]][ctx[24]]);
      }
    },
    d: function destroy(detaching) {
      if (detaching)
        detach_dev(div);
      mounted = false;
      run_all(dispose);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_each_block_1.name,
    type: "each",
    source: "(43:8) {#each {length: grid[1]} as _, j (j)}",
    ctx
  });
  return block;
}
function create_each_block$1(key_1, ctx) {
  let first;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let each_1_anchor;
  let each_value_1 = { length: ctx[3][1] };
  validate_each_argument(each_value_1);
  const get_key = (ctx2) => ctx2[24];
  validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
  for (let i = 0; i < each_value_1.length; i += 1) {
    let child_ctx = get_each_context_1(ctx, each_value_1, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
  }
  const block = {
    key: key_1,
    first: null,
    c: function create() {
      first = empty();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
      this.first = first;
    },
    m: function mount(target, anchor) {
      insert_dev(target, first, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(target, anchor);
      }
      insert_dev(target, each_1_anchor, anchor);
    },
    p: function update2(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 89) {
        each_value_1 = { length: ctx[3][1] };
        validate_each_argument(each_value_1);
        validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block_1, each_1_anchor, get_each_context_1);
      }
    },
    d: function destroy(detaching) {
      if (detaching)
        detach_dev(first);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d(detaching);
      }
      if (detaching)
        detach_dev(each_1_anchor);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_each_block$1.name,
    type: "each",
    source: "(42:4) {#each {length: grid[0]} as _, i (i)}",
    ctx
  });
  return block;
}
function create_fragment$5(ctx) {
  let div;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let mounted;
  let dispose;
  let each_value = { length: ctx[3][0] };
  validate_each_argument(each_value);
  const get_key = (ctx2) => ctx2[22];
  validate_each_keys(ctx, each_value, get_each_context$1, get_key);
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context$1(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
  }
  const block = {
    c: function create() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr_dev(div, "class", "table-container s-VU35bhriycJk");
      set_style(div, "grid-template-rows", ctx[1], false);
      set_style(div, "grid-template-columns", ctx[2], false);
      add_location(div, file$3, 39, 0, 1014);
    },
    l: function claim(nodes) {
      throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(div, null);
      }
      if (!mounted) {
        dispose = [
          listen_dev(div, "mouseleave", ctx[14], false, false, false),
          listen_dev(div, "blur", ctx[15], false, false, false)
        ];
        mounted = true;
      }
    },
    p: function update2(ctx2, [dirty]) {
      if (dirty & 89) {
        each_value = { length: ctx2[3][0] };
        validate_each_argument(each_value);
        validate_each_keys(ctx2, each_value, get_each_context$1, get_key);
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, div, destroy_block, create_each_block$1, null, get_each_context$1);
      }
      if (dirty & 2) {
        set_style(div, "grid-template-rows", ctx2[1], false);
      }
      if (dirty & 4) {
        set_style(div, "grid-template-columns", ctx2[2], false);
      }
    },
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching)
        detach_dev(div);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
      mounted = false;
      run_all(dispose);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$5.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}
function instance$5($$self, $$props, $$invalidate) {
  let col;
  let row;
  let is_active;
  let { $$slots: slots = {}, $$scope } = $$props;
  validate_slots("Table", slots, []);
  let { plugin } = $$props;
  let { rowNum = 8 } = $$props;
  let { colNum = 8 } = $$props;
  let { hoverTableEnd } = $$props;
  let { insertTable } = $$props;
  let grid = [rowNum, colNum];
  let start = [];
  let end = [];
  function hover(i, j) {
    start = [0, 0];
    end = [i, j];
    $$invalidate(7, hoverTableEnd = [i + 1, j + 1]);
    checkActive(end);
  }
  function unHover() {
    start = end = [-1, -1];
    setTimeout(
      () => {
        $$invalidate(7, hoverTableEnd = [0, 0]);
        checkActive(end);
      },
      1e3
    );
  }
  function click(i, j) {
    if (j === 0)
      return;
    insertTable([i + 1, j + 1]);
    plugin.hideTable();
  }
  function isInRange([i, j], [i2, j2]) {
    return (i - start[0]) * (i - i2) <= 0 && (j - start[1]) * (j - j2) <= 0;
  }
  function checkActive(end2) {
    $$invalidate(0, is_active = is_active.map((a, i) => a.map((_, j) => isInRange([i, j], end2))));
  }
  const writable_props = ["plugin", "rowNum", "colNum", "hoverTableEnd", "insertTable"];
  Object.keys($$props).forEach((key) => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
      console.warn(`<Table> was created with unknown prop '${key}'`);
  });
  const mouseenter_handler = (i, j) => hover(i, j);
  const click_handler = (i, j) => click(i, j);
  const mouseleave_handler = () => unHover();
  const blur_handler = () => unHover();
  $$self.$$set = ($$props2) => {
    if ("plugin" in $$props2)
      $$invalidate(8, plugin = $$props2.plugin);
    if ("rowNum" in $$props2)
      $$invalidate(9, rowNum = $$props2.rowNum);
    if ("colNum" in $$props2)
      $$invalidate(10, colNum = $$props2.colNum);
    if ("hoverTableEnd" in $$props2)
      $$invalidate(7, hoverTableEnd = $$props2.hoverTableEnd);
    if ("insertTable" in $$props2)
      $$invalidate(11, insertTable = $$props2.insertTable);
  };
  $$self.$capture_state = () => ({
    plugin,
    rowNum,
    colNum,
    hoverTableEnd,
    insertTable,
    grid,
    start,
    end,
    hover,
    unHover,
    click,
    isInRange,
    checkActive,
    is_active,
    row,
    col
  });
  $$self.$inject_state = ($$props2) => {
    if ("plugin" in $$props2)
      $$invalidate(8, plugin = $$props2.plugin);
    if ("rowNum" in $$props2)
      $$invalidate(9, rowNum = $$props2.rowNum);
    if ("colNum" in $$props2)
      $$invalidate(10, colNum = $$props2.colNum);
    if ("hoverTableEnd" in $$props2)
      $$invalidate(7, hoverTableEnd = $$props2.hoverTableEnd);
    if ("insertTable" in $$props2)
      $$invalidate(11, insertTable = $$props2.insertTable);
    if ("grid" in $$props2)
      $$invalidate(3, grid = $$props2.grid);
    if ("start" in $$props2)
      start = $$props2.start;
    if ("end" in $$props2)
      end = $$props2.end;
    if ("is_active" in $$props2)
      $$invalidate(0, is_active = $$props2.is_active);
    if ("row" in $$props2)
      $$invalidate(1, row = $$props2.row);
    if ("col" in $$props2)
      $$invalidate(2, col = $$props2.col);
  };
  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }
  $$invalidate(2, col = `repeat(${grid[1]}, 1fr)`);
  $$invalidate(1, row = `repeat(${grid[0]}, 1fr)`);
  $$invalidate(0, is_active = Array(grid[0]).fill(0).map((_) => Array(grid[1]).fill(false)));
  return [
    is_active,
    row,
    col,
    grid,
    hover,
    unHover,
    click,
    hoverTableEnd,
    plugin,
    rowNum,
    colNum,
    insertTable,
    mouseenter_handler,
    click_handler,
    mouseleave_handler,
    blur_handler
  ];
}
class Table extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$5, create_fragment$5, safe_not_equal, {
      plugin: 8,
      rowNum: 9,
      colNum: 10,
      hoverTableEnd: 7,
      insertTable: 11
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Table",
      options,
      id: create_fragment$5.name
    });
    const { ctx } = this.$$;
    const props = options.props || {};
    if (ctx[8] === void 0 && !("plugin" in props)) {
      console.warn("<Table> was created without expected prop 'plugin'");
    }
    if (ctx[7] === void 0 && !("hoverTableEnd" in props)) {
      console.warn("<Table> was created without expected prop 'hoverTableEnd'");
    }
    if (ctx[11] === void 0 && !("insertTable" in props)) {
      console.warn("<Table> was created without expected prop 'insertTable'");
    }
  }
  get plugin() {
    throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set plugin(value) {
    throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  get rowNum() {
    throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set rowNum(value) {
    throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  get colNum() {
    throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set colNum(value) {
    throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  get hoverTableEnd() {
    throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set hoverTableEnd(value) {
    throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  get insertTable() {
    throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set insertTable(value) {
    throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
}
const TableGeneratorComponent_svelte_svelte_type_style_lang = "";
const file$2 = "E:/obdev/.obsidian/plugins/Obsidian-Table-Generator/src/ui/basic/TableGeneratorComponent.svelte";
const get_sizeControls_slot_changes = (dirty) => ({});
const get_sizeControls_slot_context = (ctx) => ({});
const get_headerControls_slot_changes = (dirty) => ({});
const get_headerControls_slot_context = (ctx) => ({});
function create_fragment$4(ctx) {
  let div5;
  let div1;
  let div0;
  let t0;
  let t1;
  let t2;
  let table;
  let updating_hoverTableEnd;
  let t3;
  let div4;
  let div2;
  let t4;
  let input0;
  let t5;
  let div3;
  let t6;
  let input1;
  let t7;
  let t8;
  let button;
  let current;
  let mounted;
  let dispose;
  const headerControls_slot_template = ctx[8].headerControls;
  const headerControls_slot = create_slot(headerControls_slot_template, ctx, ctx[7], get_headerControls_slot_context);
  function table_hoverTableEnd_binding(value) {
    ctx[9](value);
  }
  let table_props = {
    rowNum: ctx[6].rowNum,
    colNum: ctx[6].colNum,
    insertTable: ctx[2],
    plugin: ctx[1]
  };
  if (ctx[3] !== void 0) {
    table_props.hoverTableEnd = ctx[3];
  }
  table = new Table({ props: table_props, $$inline: true });
  binding_callbacks.push(() => bind(table, "hoverTableEnd", table_hoverTableEnd_binding));
  const sizeControls_slot_template = ctx[8].sizeControls;
  const sizeControls_slot = create_slot(sizeControls_slot_template, ctx, ctx[7], get_sizeControls_slot_context);
  const block = {
    c: function create() {
      div5 = element("div");
      div1 = element("div");
      div0 = element("div");
      t0 = text(ctx[0]);
      t1 = space();
      if (headerControls_slot)
        headerControls_slot.c();
      t2 = space();
      create_component(table.$$.fragment);
      t3 = space();
      div4 = element("div");
      div2 = element("div");
      t4 = text("ROW:\r\n            ");
      input0 = element("input");
      t5 = space();
      div3 = element("div");
      t6 = text("COL:\r\n            ");
      input1 = element("input");
      t7 = space();
      if (sizeControls_slot)
        sizeControls_slot.c();
      t8 = space();
      button = element("button");
      button.textContent = "Insert";
      attr_dev(div0, "class", "H1 s-YxLKubgSvLDy");
      add_location(div0, file$2, 31, 8, 927);
      attr_dev(div1, "class", "table-generator-header s-YxLKubgSvLDy");
      add_location(div1, file$2, 30, 4, 881);
      attr_dev(input0, "class", "row-input s-YxLKubgSvLDy");
      add_location(input0, file$2, 41, 12, 1302);
      attr_dev(div2, "class", "input-table-generator-row s-YxLKubgSvLDy");
      add_location(div2, file$2, 39, 8, 1231);
      attr_dev(input1, "class", "col-input s-YxLKubgSvLDy");
      add_location(input1, file$2, 45, 12, 1445);
      attr_dev(div3, "class", "input-table-generator-col s-YxLKubgSvLDy");
      add_location(div3, file$2, 43, 8, 1374);
      attr_dev(div4, "class", "input-table-generator s-YxLKubgSvLDy");
      add_location(div4, file$2, 38, 4, 1186);
      attr_dev(button, "class", "s-YxLKubgSvLDy");
      add_location(button, file$2, 49, 4, 1564);
      attr_dev(div5, "class", "table-generator s-YxLKubgSvLDy");
      add_location(div5, file$2, 29, 0, 846);
    },
    l: function claim(nodes) {
      throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    },
    m: function mount(target, anchor) {
      insert_dev(target, div5, anchor);
      append_dev(div5, div1);
      append_dev(div1, div0);
      append_dev(div0, t0);
      append_dev(div1, t1);
      if (headerControls_slot) {
        headerControls_slot.m(div1, null);
      }
      append_dev(div5, t2);
      mount_component(table, div5, null);
      append_dev(div5, t3);
      append_dev(div5, div4);
      append_dev(div4, div2);
      append_dev(div2, t4);
      append_dev(div2, input0);
      set_input_value(input0, ctx[4]);
      append_dev(div4, t5);
      append_dev(div4, div3);
      append_dev(div3, t6);
      append_dev(div3, input1);
      set_input_value(input1, ctx[5]);
      append_dev(div5, t7);
      if (sizeControls_slot) {
        sizeControls_slot.m(div5, null);
      }
      append_dev(div5, t8);
      append_dev(div5, button);
      current = true;
      if (!mounted) {
        dispose = [
          listen_dev(input0, "input", ctx[10]),
          listen_dev(input1, "input", ctx[11]),
          listen_dev(button, "click", ctx[12], false, false, false)
        ];
        mounted = true;
      }
    },
    p: function update2(ctx2, [dirty]) {
      if (!current || dirty & 1)
        set_data_dev(t0, ctx2[0]);
      if (headerControls_slot) {
        if (headerControls_slot.p && (!current || dirty & 128)) {
          update_slot_base(
            headerControls_slot,
            headerControls_slot_template,
            ctx2,
            ctx2[7],
            !current ? get_all_dirty_from_scope(ctx2[7]) : get_slot_changes(headerControls_slot_template, ctx2[7], dirty, get_headerControls_slot_changes),
            get_headerControls_slot_context
          );
        }
      }
      const table_changes = {};
      if (dirty & 4)
        table_changes.insertTable = ctx2[2];
      if (dirty & 2)
        table_changes.plugin = ctx2[1];
      if (!updating_hoverTableEnd && dirty & 8) {
        updating_hoverTableEnd = true;
        table_changes.hoverTableEnd = ctx2[3];
        add_flush_callback(() => updating_hoverTableEnd = false);
      }
      table.$set(table_changes);
      if (dirty & 16 && input0.value !== ctx2[4]) {
        set_input_value(input0, ctx2[4]);
      }
      if (dirty & 32 && input1.value !== ctx2[5]) {
        set_input_value(input1, ctx2[5]);
      }
      if (sizeControls_slot) {
        if (sizeControls_slot.p && (!current || dirty & 128)) {
          update_slot_base(
            sizeControls_slot,
            sizeControls_slot_template,
            ctx2,
            ctx2[7],
            !current ? get_all_dirty_from_scope(ctx2[7]) : get_slot_changes(sizeControls_slot_template, ctx2[7], dirty, get_sizeControls_slot_changes),
            get_sizeControls_slot_context
          );
        }
      }
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(headerControls_slot, local);
      transition_in(table.$$.fragment, local);
      transition_in(sizeControls_slot, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(headerControls_slot, local);
      transition_out(table.$$.fragment, local);
      transition_out(sizeControls_slot, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching)
        detach_dev(div5);
      if (headerControls_slot)
        headerControls_slot.d(detaching);
      destroy_component(table);
      if (sizeControls_slot)
        sizeControls_slot.d(detaching);
      mounted = false;
      run_all(dispose);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$4.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}
function instance$4($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  validate_slots("TableGeneratorComponent", slots, ["headerControls", "sizeControls"]);
  var _a, _b;
  let { title } = $$props;
  let { plugin } = $$props;
  let { onInsert } = $$props;
  let hoverTableEnd;
  let gridRow;
  let gridCol;
  let settings = {
    rowNum: (_a = plugin === null || plugin === void 0 ? void 0 : plugin.settings.rowCount) !== null && _a !== void 0 ? _a : 8,
    colNum: (_b = plugin === null || plugin === void 0 ? void 0 : plugin.settings.columnCount) !== null && _b !== void 0 ? _b : 8
  };
  function setRowAndCol(end) {
    if (end.length === 0) {
      $$invalidate(4, gridRow = 0);
      $$invalidate(5, gridCol = 0);
      return;
    }
    if (!(hoverTableEnd[0] === 0 && hoverTableEnd[1] === 0)) {
      $$invalidate(4, gridRow = hoverTableEnd[0]);
      $$invalidate(5, gridCol = hoverTableEnd[1]);
    }
  }
  const writable_props = ["title", "plugin", "onInsert"];
  Object.keys($$props).forEach((key) => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
      console.warn(`<TableGeneratorComponent> was created with unknown prop '${key}'`);
  });
  function table_hoverTableEnd_binding(value) {
    hoverTableEnd = value;
    $$invalidate(3, hoverTableEnd);
  }
  function input0_input_handler() {
    gridRow = this.value;
    $$invalidate(4, gridRow);
  }
  function input1_input_handler() {
    gridCol = this.value;
    $$invalidate(5, gridCol);
  }
  const click_handler = () => {
    if (/^\d+$/.test(gridRow.toString()) && /^\d+$/.test(gridCol.toString())) {
      onInsert([gridRow, gridCol]);
    } else {
      new obsidian.Notice("Please enter a valid number");
    }
  };
  $$self.$$set = ($$props2) => {
    if ("title" in $$props2)
      $$invalidate(0, title = $$props2.title);
    if ("plugin" in $$props2)
      $$invalidate(1, plugin = $$props2.plugin);
    if ("onInsert" in $$props2)
      $$invalidate(2, onInsert = $$props2.onInsert);
    if ("$$scope" in $$props2)
      $$invalidate(7, $$scope = $$props2.$$scope);
  };
  $$self.$capture_state = () => ({
    _a,
    _b,
    Table,
    Notice: obsidian.Notice,
    title,
    plugin,
    onInsert,
    hoverTableEnd,
    gridRow,
    gridCol,
    settings,
    setRowAndCol
  });
  $$self.$inject_state = ($$props2) => {
    if ("_a" in $$props2)
      _a = $$props2._a;
    if ("_b" in $$props2)
      _b = $$props2._b;
    if ("title" in $$props2)
      $$invalidate(0, title = $$props2.title);
    if ("plugin" in $$props2)
      $$invalidate(1, plugin = $$props2.plugin);
    if ("onInsert" in $$props2)
      $$invalidate(2, onInsert = $$props2.onInsert);
    if ("hoverTableEnd" in $$props2)
      $$invalidate(3, hoverTableEnd = $$props2.hoverTableEnd);
    if ("gridRow" in $$props2)
      $$invalidate(4, gridRow = $$props2.gridRow);
    if ("gridCol" in $$props2)
      $$invalidate(5, gridCol = $$props2.gridCol);
    if ("settings" in $$props2)
      $$invalidate(6, settings = $$props2.settings);
  };
  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 8) {
      if (hoverTableEnd) {
        setRowAndCol(hoverTableEnd);
      }
    }
  };
  return [
    title,
    plugin,
    onInsert,
    hoverTableEnd,
    gridRow,
    gridCol,
    settings,
    $$scope,
    slots,
    table_hoverTableEnd_binding,
    input0_input_handler,
    input1_input_handler,
    click_handler
  ];
}
class TableGeneratorComponent extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$4, create_fragment$4, safe_not_equal, { title: 0, plugin: 1, onInsert: 2 });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "TableGeneratorComponent",
      options,
      id: create_fragment$4.name
    });
    const { ctx } = this.$$;
    const props = options.props || {};
    if (ctx[0] === void 0 && !("title" in props)) {
      console.warn("<TableGeneratorComponent> was created without expected prop 'title'");
    }
    if (ctx[1] === void 0 && !("plugin" in props)) {
      console.warn("<TableGeneratorComponent> was created without expected prop 'plugin'");
    }
    if (ctx[2] === void 0 && !("onInsert" in props)) {
      console.warn("<TableGeneratorComponent> was created without expected prop 'onInsert'");
    }
  }
  get title() {
    throw new Error("<TableGeneratorComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set title(value) {
    throw new Error("<TableGeneratorComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  get plugin() {
    throw new Error("<TableGeneratorComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set plugin(value) {
    throw new Error("<TableGeneratorComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  get onInsert() {
    throw new Error("<TableGeneratorComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set onInsert(value) {
    throw new Error("<TableGeneratorComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
}
const alignLineText = (align) => {
  switch (align) {
    case "left":
      return "|:-----";
    case "center":
      return "|:----:";
    case "right":
      return "|-----:";
    default:
      return "";
  }
};
const generateMarkdownTable = (selectedGrid, align) => {
  let table = "";
  let secondLine = "";
  let normalLine = "";
  const alignText = alignLineText(align);
  if (selectedGrid.length === 0)
    return table;
  for (let i = 0; i < Number(selectedGrid[1]); i++) {
    secondLine += alignText;
  }
  for (let i = 0; i < Number(selectedGrid[1]); i++) {
    normalLine += "|      ";
  }
  if (!selectedGrid[0]) {
    table = normalLine + "|\n" + secondLine + "|\n";
    return table;
  }
  for (let i = 0; i < Number(selectedGrid[0]) + 1; i++) {
    if (!i)
      table = table + normalLine + "|\n";
    if (i === 1)
      table = table + secondLine + "|\n";
    if (i > 1)
      table = table + normalLine + "|\n";
  }
  return table.trim();
};
function checkBlankLine(editor, line) {
  const getLine = editor.getLine(line);
  if (getLine.trim().length > 0)
    return false;
  return true;
}
const AlignItems_svelte_svelte_type_style_lang = "";
const file$1 = "E:/obdev/.obsidian/plugins/Obsidian-Table-Generator/src/ui/basic/AlignItems.svelte";
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[7] = list[i];
  child_ctx[8] = list;
  child_ctx[9] = i;
  return child_ctx;
}
function create_each_block(key_1, ctx) {
  let div;
  let alignment = ctx[7];
  let mounted;
  let dispose;
  const assign_div = () => ctx[4](div, alignment);
  const unassign_div = () => ctx[4](null, alignment);
  function click_handler() {
    return ctx[5](ctx[7]);
  }
  const block = {
    key: key_1,
    first: null,
    c: function create() {
      div = element("div");
      attr_dev(div, "class", "table-generator-align-icon s-XNB-qso0yOHJ");
      toggle_class(div, "active", ctx[0] === ctx[7]);
      add_location(div, file$1, 19, 8, 598);
      this.first = div;
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      assign_div();
      if (!mounted) {
        dispose = listen_dev(div, "click", click_handler, false, false, false);
        mounted = true;
      }
    },
    p: function update2(new_ctx, dirty) {
      ctx = new_ctx;
      if (alignment !== ctx[7]) {
        unassign_div();
        alignment = ctx[7];
        assign_div();
      }
      if (dirty & 5) {
        toggle_class(div, "active", ctx[0] === ctx[7]);
      }
    },
    d: function destroy(detaching) {
      if (detaching)
        detach_dev(div);
      unassign_div();
      mounted = false;
      dispose();
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_each_block.name,
    type: "each",
    source: "(19:4) {#each alignments as alignment (alignment)}",
    ctx
  });
  return block;
}
function create_fragment$3(ctx) {
  let div;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let each_value = ctx[2];
  validate_each_argument(each_value);
  const get_key = (ctx2) => ctx2[7];
  validate_each_keys(ctx, each_value, get_each_context, get_key);
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
  }
  const block = {
    c: function create() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr_dev(div, "class", "table-generator-align-group s-XNB-qso0yOHJ");
      add_location(div, file$1, 17, 0, 498);
    },
    l: function claim(nodes) {
      throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(div, null);
      }
    },
    p: function update2(ctx2, [dirty]) {
      if (dirty & 15) {
        each_value = ctx2[2];
        validate_each_argument(each_value);
        validate_each_keys(ctx2, each_value, get_each_context, get_key);
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, div, destroy_block, create_each_block, null, get_each_context);
      }
    },
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching)
        detach_dev(div);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$3.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}
function instance$3($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  validate_slots("AlignItems", slots, []);
  let { align = "left" } = $$props;
  const dispatch = createEventDispatcher();
  const alignments = ["left", "center", "right"];
  let refs = {};
  onMount(() => {
    obsidian.setIcon(refs["left"], "align-left");
    obsidian.setIcon(refs["center"], "align-center");
    obsidian.setIcon(refs["right"], "align-right");
  });
  function click(update2) {
    $$invalidate(0, align = update2);
    dispatch("update", align);
  }
  const writable_props = ["align"];
  Object.keys($$props).forEach((key) => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
      console.warn(`<AlignItems> was created with unknown prop '${key}'`);
  });
  function div_binding($$value, alignment) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      refs[alignment] = $$value;
      $$invalidate(1, refs);
    });
  }
  const click_handler = (alignment) => click(alignment);
  $$self.$$set = ($$props2) => {
    if ("align" in $$props2)
      $$invalidate(0, align = $$props2.align);
  };
  $$self.$capture_state = () => ({
    onMount,
    createEventDispatcher,
    setIcon: obsidian.setIcon,
    align,
    dispatch,
    alignments,
    refs,
    click
  });
  $$self.$inject_state = ($$props2) => {
    if ("align" in $$props2)
      $$invalidate(0, align = $$props2.align);
    if ("refs" in $$props2)
      $$invalidate(1, refs = $$props2.refs);
  };
  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }
  return [align, refs, alignments, click, div_binding, click_handler];
}
class AlignItems extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$3, create_fragment$3, safe_not_equal, { align: 0 });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "AlignItems",
      options,
      id: create_fragment$3.name
    });
  }
  get align() {
    throw new Error("<AlignItems>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set align(value) {
    throw new Error("<AlignItems>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
}
function create_headerControls_slot(ctx) {
  let alignitems;
  let current;
  alignitems = new AlignItems({
    props: {
      align: ctx[1],
      slot: "headerControls"
    },
    $$inline: true
  });
  alignitems.$on("update", ctx[2]);
  const block = {
    c: function create() {
      create_component(alignitems.$$.fragment);
    },
    m: function mount(target, anchor) {
      mount_component(alignitems, target, anchor);
      current = true;
    },
    p: function update2(ctx2, dirty) {
      const alignitems_changes = {};
      if (dirty & 2)
        alignitems_changes.align = ctx2[1];
      alignitems.$set(alignitems_changes);
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(alignitems.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(alignitems.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(alignitems, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_headerControls_slot.name,
    type: "slot",
    source: "(47:4) ",
    ctx
  });
  return block;
}
function create_fragment$2(ctx) {
  let tablegeneratorcomponent;
  let current;
  tablegeneratorcomponent = new TableGeneratorComponent({
    props: {
      title: "Table Generator",
      plugin: ctx[0],
      onInsert: ctx[3],
      $$slots: {
        headerControls: [create_headerControls_slot]
      },
      $$scope: { ctx }
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      create_component(tablegeneratorcomponent.$$.fragment);
    },
    l: function claim(nodes) {
      throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    },
    m: function mount(target, anchor) {
      mount_component(tablegeneratorcomponent, target, anchor);
      current = true;
    },
    p: function update2(ctx2, [dirty]) {
      const tablegeneratorcomponent_changes = {};
      if (dirty & 1)
        tablegeneratorcomponent_changes.plugin = ctx2[0];
      if (dirty & 66) {
        tablegeneratorcomponent_changes.$$scope = { dirty, ctx: ctx2 };
      }
      tablegeneratorcomponent.$set(tablegeneratorcomponent_changes);
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(tablegeneratorcomponent.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(tablegeneratorcomponent.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(tablegeneratorcomponent, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$2.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}
function instance$2($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  validate_slots("TableGenerator", slots, []);
  var _a;
  let { editor } = $$props;
  let { plugin } = $$props;
  let currentAlign = (_a = plugin === null || plugin === void 0 ? void 0 : plugin.settings.defaultAlignment) !== null && _a !== void 0 ? _a : "left";
  function handleAlignModeUpdate(event) {
    var _a2;
    return __awaiter(this, void 0, void 0, function* () {
      $$invalidate(1, currentAlign = event.detail);
      (_a2 = plugin === null || plugin === void 0 ? void 0 : plugin.settings) === null || _a2 === void 0 ? void 0 : _a2.defaultAlignment = currentAlign;
      yield plugin === null || plugin === void 0 ? void 0 : plugin.saveSettings();
    });
  }
  function insertTable(selectedGrid) {
    if (selectedGrid.length === 0 || selectedGrid[1] < 2)
      return;
    const basicTable = generateMarkdownTable(selectedGrid, currentAlign);
    let markdownTable = basicTable;
    const cursor = editor.getCursor("from");
    const line = editor.getLine(cursor.line);
    if (cursor.line !== 0 && line.trim().length !== 0) {
      markdownTable = "\n" + markdownTable;
    }
    if (cursor.line !== editor.lastLine() && !checkBlankLine(editor, cursor.line + 1)) {
      markdownTable = markdownTable + "\n";
    } else if (cursor.line === editor.lastLine()) {
      markdownTable = "\n" + markdownTable;
    }
    if (line.trim().length > 0) {
      editor.replaceRange(markdownTable, { line: cursor.line + 1, ch: 0 }, { line: cursor.line + 1, ch: 0 });
    } else {
      editor.replaceRange(markdownTable, { line: cursor.line, ch: 0 }, { line: cursor.line, ch: 0 });
    }
  }
  const writable_props = ["editor", "plugin"];
  Object.keys($$props).forEach((key) => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
      console.warn(`<TableGenerator> was created with unknown prop '${key}'`);
  });
  $$self.$$set = ($$props2) => {
    if ("editor" in $$props2)
      $$invalidate(4, editor = $$props2.editor);
    if ("plugin" in $$props2)
      $$invalidate(0, plugin = $$props2.plugin);
  };
  $$self.$capture_state = () => ({
    _a,
    __awaiter,
    TableGeneratorComponent,
    checkBlankLine,
    generateMarkdownTable,
    AlignItems,
    editor,
    plugin,
    currentAlign,
    handleAlignModeUpdate,
    insertTable
  });
  $$self.$inject_state = ($$props2) => {
    if ("_a" in $$props2)
      _a = $$props2._a;
    if ("editor" in $$props2)
      $$invalidate(4, editor = $$props2.editor);
    if ("plugin" in $$props2)
      $$invalidate(0, plugin = $$props2.plugin);
    if ("currentAlign" in $$props2)
      $$invalidate(1, currentAlign = $$props2.currentAlign);
  };
  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }
  return [plugin, currentAlign, handleAlignModeUpdate, insertTable, editor];
}
class TableGenerator extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$2, create_fragment$2, safe_not_equal, { editor: 4, plugin: 0 });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "TableGenerator",
      options,
      id: create_fragment$2.name
    });
    const { ctx } = this.$$;
    const props = options.props || {};
    if (ctx[4] === void 0 && !("editor" in props)) {
      console.warn("<TableGenerator> was created without expected prop 'editor'");
    }
    if (ctx[0] === void 0 && !("plugin" in props)) {
      console.warn("<TableGenerator> was created without expected prop 'plugin'");
    }
  }
  get editor() {
    throw new Error("<TableGenerator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set editor(value) {
    throw new Error("<TableGenerator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  get plugin() {
    throw new Error("<TableGenerator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set plugin(value) {
    throw new Error("<TableGenerator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
}
const tableGeneratorDefault = "";
function getLineHeight(editor, pos) {
  const lineInfo = editor.cm.state.doc.lineAt(pos);
  const lineDOM = editor.cm.domAtPos(lineInfo.from);
  return lineDOM.node.offsetHeight;
}
const random = (e) => {
  const t = [];
  for (let n = 0; n < e; n++) {
    t.push((16 * Math.random() | 0).toString(16));
  }
  return t.join("");
};
function reverseCalculation(n, t) {
  const r = t.scale;
  const cx = t.canvasRect.cx;
  const cy = t.canvasRect.cy;
  const x = t.x;
  const y = t.y;
  const eClientX = (n.x - x) * r + cx;
  const eClientY = (n.y - y) * r + cy;
  return {
    clientX: eClientX,
    clientY: eClientY
  };
}
function calculateEditor(editor, tableGeneratorBoard) {
  var _a, _b, _c, _d;
  if (!tableGeneratorBoard)
    return;
  const cursor = editor.getCursor("from");
  let coords;
  if (editor.cursorCoords) {
    coords = editor.cursorCoords(true, "window");
  } else if (editor.coordsAtPos) {
    const offset = editor.posToOffset(cursor);
    coords = (_c = (_b = (_a = editor.cm).coordsAtPos) == null ? void 0 : _b.call(_a, offset)) != null ? _c : editor.coordsAtPos(offset);
  } else {
    return;
  }
  const lineHeight = getLineHeight(editor, editor.posToOffset(cursor));
  const calculateTop = ((_d = obsidian.requireApiVersion("0.15.0") ? activeDocument : document) == null ? void 0 : _d.body.getBoundingClientRect().height) - (coords.top || 0) - (coords.height || lineHeight);
  return {
    top: calculateTop || 0,
    left: coords.left || 0,
    bottom: coords.bottom || 0,
    height: coords.height || lineHeight
  };
}
function around(obj, factories) {
  const removers = Object.keys(factories).map((key) => around1(obj, key, factories[key]));
  return removers.length === 1 ? removers[0] : function() {
    removers.forEach((r) => r());
  };
}
function around1(obj, method, createWrapper) {
  const original = obj[method], hadOwn = obj.hasOwnProperty(method);
  let current = createWrapper(original);
  if (original)
    Object.setPrototypeOf(current, original);
  Object.setPrototypeOf(wrapper, current);
  obj[method] = wrapper;
  return remove;
  function wrapper(...args) {
    if (current === original && obj[method] === wrapper)
      remove();
    return current.apply(this, args);
  }
  function remove() {
    if (obj[method] === wrapper) {
      if (hadOwn)
        obj[method] = original;
      else
        delete obj[method];
    }
    if (current === original)
      return;
    current = original;
    Object.setPrototypeOf(wrapper, original || Function);
  }
}
const SizeControls_svelte_svelte_type_style_lang = "";
const file = "E:/obdev/.obsidian/plugins/Obsidian-Table-Generator/src/ui/basic/SizeControls.svelte";
function create_fragment$1(ctx) {
  let div2;
  let div0;
  let t0;
  let input0;
  let t1;
  let div1;
  let t2;
  let input1;
  let mounted;
  let dispose;
  const block = {
    c: function create() {
      div2 = element("div");
      div0 = element("div");
      t0 = text("H:\r\n        ");
      input0 = element("input");
      t1 = space();
      div1 = element("div");
      t2 = text("W:\r\n        ");
      input1 = element("input");
      attr_dev(input0, "class", "height-input s-b7dfVi8Mj3e3");
      add_location(input0, file, 12, 8, 374);
      attr_dev(div0, "class", "input-table-generator-height s-b7dfVi8Mj3e3");
      add_location(div0, file, 10, 4, 310);
      attr_dev(input1, "class", "width-input s-b7dfVi8Mj3e3");
      add_location(input1, file, 16, 8, 503);
      attr_dev(div1, "class", "input-table-generator-width s-b7dfVi8Mj3e3");
      add_location(div1, file, 14, 4, 440);
      attr_dev(div2, "class", "input-table-generator s-b7dfVi8Mj3e3");
      add_location(div2, file, 9, 0, 269);
    },
    l: function claim(nodes) {
      throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    },
    m: function mount(target, anchor) {
      insert_dev(target, div2, anchor);
      append_dev(div2, div0);
      append_dev(div0, t0);
      append_dev(div0, input0);
      set_input_value(input0, ctx[0]);
      append_dev(div2, t1);
      append_dev(div2, div1);
      append_dev(div1, t2);
      append_dev(div1, input1);
      set_input_value(input1, ctx[1]);
      if (!mounted) {
        dispose = [
          listen_dev(input0, "input", ctx[2]),
          listen_dev(input1, "input", ctx[3])
        ];
        mounted = true;
      }
    },
    p: function update2(ctx2, [dirty]) {
      if (dirty & 1 && input0.value !== ctx2[0]) {
        set_input_value(input0, ctx2[0]);
      }
      if (dirty & 2 && input1.value !== ctx2[1]) {
        set_input_value(input1, ctx2[1]);
      }
    },
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching)
        detach_dev(div2);
      mounted = false;
      run_all(dispose);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$1.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}
function instance$1($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  validate_slots("SizeControls", slots, []);
  const dispatch = createEventDispatcher();
  let { height = 160 } = $$props;
  let { width = 160 } = $$props;
  const writable_props = ["height", "width"];
  Object.keys($$props).forEach((key) => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
      console.warn(`<SizeControls> was created with unknown prop '${key}'`);
  });
  function input0_input_handler() {
    height = this.value;
    $$invalidate(0, height);
  }
  function input1_input_handler() {
    width = this.value;
    $$invalidate(1, width);
  }
  $$self.$$set = ($$props2) => {
    if ("height" in $$props2)
      $$invalidate(0, height = $$props2.height);
    if ("width" in $$props2)
      $$invalidate(1, width = $$props2.width);
  };
  $$self.$capture_state = () => ({
    createEventDispatcher,
    dispatch,
    height,
    width
  });
  $$self.$inject_state = ($$props2) => {
    if ("height" in $$props2)
      $$invalidate(0, height = $$props2.height);
    if ("width" in $$props2)
      $$invalidate(1, width = $$props2.width);
  };
  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 3) {
      dispatch("sizeUpdate", { height, width });
    }
  };
  return [height, width, input0_input_handler, input1_input_handler];
}
class SizeControls extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$1, create_fragment$1, safe_not_equal, { height: 0, width: 1 });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "SizeControls",
      options,
      id: create_fragment$1.name
    });
  }
  get height() {
    throw new Error("<SizeControls>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set height(value) {
    throw new Error("<SizeControls>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  get width() {
    throw new Error("<SizeControls>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set width(value) {
    throw new Error("<SizeControls>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
}
const { console: console_1 } = globals;
function create_sizeControls_slot(ctx) {
  let sizecontrols;
  let current;
  sizecontrols = new SizeControls({
    props: {
      slot: "sizeControls",
      width: ctx[1],
      height: ctx[2]
    },
    $$inline: true
  });
  sizecontrols.$on("sizeUpdate", ctx[3]);
  const block = {
    c: function create() {
      create_component(sizecontrols.$$.fragment);
    },
    m: function mount(target, anchor) {
      mount_component(sizecontrols, target, anchor);
      current = true;
    },
    p: function update2(ctx2, dirty) {
      const sizecontrols_changes = {};
      if (dirty & 2)
        sizecontrols_changes.width = ctx2[1];
      if (dirty & 4)
        sizecontrols_changes.height = ctx2[2];
      sizecontrols.$set(sizecontrols_changes);
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(sizecontrols.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(sizecontrols.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(sizecontrols, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_sizeControls_slot.name,
    type: "slot",
    source: "(47:4) ",
    ctx
  });
  return block;
}
function create_fragment(ctx) {
  let tablegeneratorcomponent;
  let current;
  tablegeneratorcomponent = new TableGeneratorComponent({
    props: {
      title: "Card Generator",
      plugin: ctx[0],
      onInsert: ctx[4],
      $$slots: { sizeControls: [create_sizeControls_slot] },
      $$scope: { ctx }
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      create_component(tablegeneratorcomponent.$$.fragment);
    },
    l: function claim(nodes) {
      throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    },
    m: function mount(target, anchor) {
      mount_component(tablegeneratorcomponent, target, anchor);
      current = true;
    },
    p: function update2(ctx2, [dirty]) {
      const tablegeneratorcomponent_changes = {};
      if (dirty & 1)
        tablegeneratorcomponent_changes.plugin = ctx2[0];
      if (dirty & 134) {
        tablegeneratorcomponent_changes.$$scope = { dirty, ctx: ctx2 };
      }
      tablegeneratorcomponent.$set(tablegeneratorcomponent_changes);
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(tablegeneratorcomponent.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(tablegeneratorcomponent.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(tablegeneratorcomponent, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}
function instance($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  validate_slots("CardGenerator", slots, []);
  let { canvas } = $$props;
  let { coords } = $$props;
  let { plugin } = $$props;
  let width = plugin.settings.defaultCardWidth || 160;
  let height = plugin.settings.defaultCardHeight || 160;
  function handleSizeUpdate(event) {
    $$invalidate(2, height = parseInt(event.detail.height, 10));
    $$invalidate(1, width = parseInt(event.detail.width, 10));
    $$invalidate(0, plugin.settings.defaultCardHeight = height, plugin);
    $$invalidate(0, plugin.settings.defaultCardWidth = width, plugin);
    plugin.saveSettings();
  }
  function insertTable(selectedGrid) {
    return __awaiter(this, void 0, void 0, function* () {
      if (selectedGrid.length === 0 || selectedGrid[1] < 2)
        return;
      const canvasFile = yield plugin.app.vault.cachedRead(canvas.view.file);
      const canvasFileData = JSON.parse(canvasFile);
      console.log(selectedGrid);
      for (let i = 0; i < selectedGrid[0]; i++) {
        for (let j = 0; j < selectedGrid[1]; j++) {
          canvasFileData.nodes.push({
            id: random(16),
            x: coords.x + j * (width + 10) + 40,
            y: coords.y + i * (height + 10) + 40,
            width,
            height,
            type: "text",
            text: ""
          });
        }
      }
      console.log(canvasFileData);
      setTimeout(
        () => {
          canvas.setData(canvasFileData);
          canvas.requestSave();
        },
        100
      );
    });
  }
  const writable_props = ["canvas", "coords", "plugin"];
  Object.keys($$props).forEach((key) => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
      console_1.warn(`<CardGenerator> was created with unknown prop '${key}'`);
  });
  $$self.$$set = ($$props2) => {
    if ("canvas" in $$props2)
      $$invalidate(5, canvas = $$props2.canvas);
    if ("coords" in $$props2)
      $$invalidate(6, coords = $$props2.coords);
    if ("plugin" in $$props2)
      $$invalidate(0, plugin = $$props2.plugin);
  };
  $$self.$capture_state = () => ({
    __awaiter,
    random,
    TableGeneratorComponent,
    SizeControls,
    canvas,
    coords,
    plugin,
    width,
    height,
    handleSizeUpdate,
    insertTable
  });
  $$self.$inject_state = ($$props2) => {
    if ("canvas" in $$props2)
      $$invalidate(5, canvas = $$props2.canvas);
    if ("coords" in $$props2)
      $$invalidate(6, coords = $$props2.coords);
    if ("plugin" in $$props2)
      $$invalidate(0, plugin = $$props2.plugin);
    if ("width" in $$props2)
      $$invalidate(1, width = $$props2.width);
    if ("height" in $$props2)
      $$invalidate(2, height = $$props2.height);
  };
  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }
  return [plugin, width, height, handleSizeUpdate, insertTable, canvas, coords];
}
class CardGenerator extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, { canvas: 5, coords: 6, plugin: 0 });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "CardGenerator",
      options,
      id: create_fragment.name
    });
    const { ctx } = this.$$;
    const props = options.props || {};
    if (ctx[5] === void 0 && !("canvas" in props)) {
      console_1.warn("<CardGenerator> was created without expected prop 'canvas'");
    }
    if (ctx[6] === void 0 && !("coords" in props)) {
      console_1.warn("<CardGenerator> was created without expected prop 'coords'");
    }
    if (ctx[0] === void 0 && !("plugin" in props)) {
      console_1.warn("<CardGenerator> was created without expected prop 'plugin'");
    }
  }
  get canvas() {
    throw new Error("<CardGenerator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set canvas(value) {
    throw new Error("<CardGenerator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  get coords() {
    throw new Error("<CardGenerator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set coords(value) {
    throw new Error("<CardGenerator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  get plugin() {
    throw new Error("<CardGenerator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set plugin(value) {
    throw new Error("<CardGenerator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
}
function setTableGeneratorMenuPosition(tableGeneratorBoard, coords, displayMode) {
  if (!tableGeneratorBoard)
    return;
  setTimeout(() => {
    tableGeneratorBoard.style.display = "block";
    switch (displayMode) {
      case "canvas":
        tableGeneratorBoard.style.top = `${coords.top}px`;
        tableGeneratorBoard.style.left = `${coords.left}px`;
        break;
      case "editor":
        tableGeneratorBoard.style.transform = `translate(${coords.left}px,-${coords.top}px`;
        break;
    }
  });
}
function handleHideTableGeneratorMenu(evt, tableGeneratorEl) {
  var _a;
  const target = evt.target;
  if (!tableGeneratorEl || !target)
    return;
  if (target.classList.contains("table-generator-menu") || ((_a = target.parentElement) == null ? void 0 : _a.classList.contains("table-generator-menu")) || target.tagName == "BUTTON")
    return;
  if (tableGeneratorEl == null ? void 0 : tableGeneratorEl.contains(target))
    return;
  if (!document.body.contains(tableGeneratorEl))
    return;
  tableGeneratorEl.detach();
}
const DEFAULT_SETTINGS = {
  rowCount: 8,
  columnCount: 8,
  defaultAlignment: "left",
  defaultCardWidth: 160,
  defaultCardHeight: 160
};
class TableGeneratorPlugin extends obsidian.Plugin {
  constructor() {
    super(...arguments);
    __publicField(this, "tableGeneratorEl", null);
    __publicField(this, "tableGeneratorComponent");
    __publicField(this, "settings");
  }
  async onload() {
    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu, editor, view) => this.handleCreateTableGeneratorInMenu(menu, editor, view))
    );
    await this.registerSettings();
    this.registerDomEvent(window, "click", (evt) => handleHideTableGeneratorMenu(evt, this.tableGeneratorEl));
    if (obsidian.requireApiVersion("0.15.0"))
      this.registerTableGeneratorMenu();
    this.registerCommands();
    this.registerCanvasMenu();
  }
  hideTable() {
    var _a;
    (_a = this.tableGeneratorEl) == null ? void 0 : _a.detach();
  }
  handleCreateTableGeneratorInMenu(menu, editor, view) {
    menu.addItem((item) => {
      const itemDom = item.dom;
      itemDom.addClass("table-generator-menu");
      item.setTitle("Add Markdown Table").setIcon("table").setSection("action").onClick(async () => {
        this.createGeneratorMenu("table", { editor }, this);
        const coords = calculateEditor(editor, this.tableGeneratorEl);
        if (!coords)
          return;
        setTableGeneratorMenuPosition(this.tableGeneratorEl, coords, "editor");
      });
    });
  }
  createGeneratorMenu(type, context, plugin) {
    var _a;
    if (this.tableGeneratorEl)
      this.tableGeneratorEl.detach();
    this.tableGeneratorEl = (_a = obsidian.requireApiVersion("0.15.0") ? activeDocument : document) == null ? void 0 : _a.body.createEl("div", { cls: "table-generator-view" });
    this.tableGeneratorEl.hide();
    if (type === "table") {
      this.tableGeneratorComponent = new TableGenerator({
        target: this.tableGeneratorEl,
        props: { editor: context.editor, plugin }
      });
    } else if (type === "card") {
      this.tableGeneratorComponent = new CardGenerator({
        target: this.tableGeneratorEl,
        props: { canvas: context.canvas, coords: context.coords, plugin }
      });
    }
  }
  async registerSettings() {
    await this.loadSettings();
    this.addSettingTab(new TableGeneratorSettingTab(this.app, this));
    this.registerInterval(
      window.setTimeout(() => {
        this.saveSettings();
      }, 100)
    );
  }
  registerCanvasMenu() {
    const createCardTable = (canvas, e, t, a) => {
      const { top, left } = e.dom.getBoundingClientRect();
      const data = reverseCalculation(t, canvas);
      console.log(data);
      setTimeout(() => {
        this.createGeneratorMenu("card", { canvas, coords: t }, this);
        setTableGeneratorMenuPosition(this.tableGeneratorEl, { top, left, bottom: 0, height: 0 }, "canvas");
      }, 0);
    };
    const patchNode = () => {
      var _a;
      const canvasView = (_a = this.app.workspace.getLeavesOfType("canvas").first()) == null ? void 0 : _a.view;
      const canvas = canvasView == null ? void 0 : canvasView.canvas;
      if (!canvas)
        return false;
      const uninstaller = around(canvas.constructor.prototype, {
        showCreationMenu: (next) => function(e, t, a) {
          const result = next.call(this, e, t, a);
          e.addSeparator().addItem((item) => {
            item.setSection("create").setTitle("Add Card Table").setIcon("table").onClick(async () => {
              createCardTable(this, e, t);
            });
          });
          return result;
        }
      });
      this.register(uninstaller);
      console.log("Obsidian-Canvas-MindMap: canvas node patched");
      return true;
    };
    this.app.workspace.onLayoutReady(() => {
      if (!patchNode()) {
        const evt = this.app.workspace.on("layout-change", () => {
          patchNode() && this.app.workspace.offref(evt);
        });
        this.registerEvent(evt);
      }
    });
  }
  registerCommands() {
    this.addCommand({
      id: "create-table-genertator",
      name: "Create Table Generator",
      editorCallback: (editor, view) => {
        var _a;
        if ((_a = obsidian.requireApiVersion("0.15.0") ? activeDocument : document) == null ? void 0 : _a.body.contains(this.tableGeneratorEl))
          return;
        this.createGeneratorMenu("table", { editor }, this);
        const coords = calculateEditor(editor, this.tableGeneratorEl);
        if (!coords)
          return;
        setTableGeneratorMenuPosition(this.tableGeneratorEl, coords, "editor");
      }
    });
  }
  registerTableGeneratorMenu() {
    this.app.workspace.on("window-open", (leaf) => {
      this.registerDomEvent(leaf.doc, "click", (evt) => {
        var _a, _b;
        const target = evt.target;
        if (!this.tableGeneratorEl || !target)
          return;
        if (target.classList.contains("table-generator-menu") || ((_a = target.parentElement) == null ? void 0 : _a.classList.contains("table-generator-menu")) || target.tagName == "BUTTON")
          return;
        if ((_b = this.tableGeneratorEl) == null ? void 0 : _b.contains(target))
          return;
        if (!activeDocument.body.contains(this.tableGeneratorEl))
          return;
        this.tableGeneratorEl.detach();
      });
    });
  }
  onunload() {
    if (this.tableGeneratorEl) {
      this.tableGeneratorComponent.$destroy();
      this.tableGeneratorEl.detach();
    }
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
}
class TableGeneratorSettingTab extends obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    __publicField(this, "plugin");
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Table Generator" });
    let rowText;
    new obsidian.Setting(containerEl).setName("Row Count").setDesc("The number of rows in the table").addSlider(
      (slider) => slider.setLimits(2, 12, 1).setValue(this.plugin.settings.rowCount).onChange(async (value) => {
        rowText.innerText = ` ${value.toString()}`;
        this.plugin.settings.rowCount = value;
      })
    ).settingEl.createDiv("", (el) => {
      rowText = el;
      el.className = "table-generator-setting-text";
      el.innerText = ` ${this.plugin.settings.rowCount.toString()}`;
    });
    let columnText;
    new obsidian.Setting(containerEl).setName("Columns Count").setDesc("The number of columns in the table").addSlider(
      (slider) => slider.setLimits(2, 12, 1).setValue(this.plugin.settings.columnCount).onChange(async (value) => {
        columnText.innerText = ` ${value.toString()}`;
        this.plugin.settings.columnCount = value;
      })
    ).settingEl.createDiv("", (el) => {
      columnText = el;
      el.className = "table-generator-setting-text";
      el.innerText = ` ${this.plugin.settings.columnCount.toString()}`;
    });
    this.containerEl.createEl("h2", { text: "Say Thank You" });
    new obsidian.Setting(containerEl).setName("Donate").setDesc("If you like this plugin, consider donating to support continued development:").addButton((bt) => {
      bt.buttonEl.outerHTML = `<a href="https://www.buymeacoffee.com/boninall"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=boninall&button_colour=6495ED&font_colour=ffffff&font_family=Inter&outline_colour=000000&coffee_colour=FFDD00"></a>`;
    });
  }
}
module.exports = TableGeneratorPlugin;


/* nosourcemap */