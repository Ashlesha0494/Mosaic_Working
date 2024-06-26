var __defProp = Object.defineProperty;
var __export = (target, all2) => {
  for (var name in all2)
    __defProp(target, name, { get: all2[name], enumerable: true });
};

// ../core/src/util/throttle.js
var NIL = {};
function throttle(callback, debounce = false) {
  let curr;
  let next;
  let pending = NIL;
  function invoke(event) {
    curr = callback(event).then(() => {
      if (next) {
        const { value } = next;
        next = null;
        invoke(value);
      } else {
        curr = null;
      }
    });
  }
  function enqueue(event) {
    next = { event };
  }
  function process(event) {
    curr ? enqueue(event) : invoke(event);
  }
  function delay(event) {
    if (pending !== event) {
      requestAnimationFrame(() => {
        const e = pending;
        pending = NIL;
        process(e);
      });
    }
    pending = event;
  }
  return debounce ? delay : process;
}

// ../core/src/MosaicClient.js
var MosaicClient = class {
  /**
   * Constructor.
   * @param {*} filterSelection An optional selection to interactively filter
   *  this client's data. If provided, a coordinator will re-query and update
   *  the client when the selection updates.
   */
  constructor(filterSelection) {
    this._filterBy = filterSelection;
    this._requestUpdate = throttle(() => this.requestQuery(), true);
    this._coordinator = null;
  }
  /**
   * Return this client's connected coordinator.
   */
  get coordinator() {
    return this._coordinator;
  }
  /**
   * Set this client's connected coordinator.
   */
  set coordinator(coordinator2) {
    this._coordinator = coordinator2;
  }
  /**
   * Return this client's filter selection.
   */
  get filterBy() {
    return this._filterBy;
  }
  /**
   * Return a boolean indicating if the client query can be indexed. Should
   * return true if changes to the filterBy selection does not change the
   * groupby domain of the client query.
   */
  get filterIndexable() {
    return true;
  }
  /**
   * Return an array of fields queried by this client.
   * @returns {object[]|null} The fields to retrieve info for.
   */
  fields() {
    return null;
  }
  /**
   * Called by the coordinator to set the field info for this client.
   * @param {*} info The field info result.
   * @returns {this}
   */
  fieldInfo(info) {
    return this;
  }
  /**
   * Return a query specifying the data needed by this client.
   * @param {*} [filter] The filtering criteria to apply in the query.
   * @returns {*} The client query
   */
  query(filter) {
    return null;
  }
  /**
   * Called by the coordinator to inform the client that a query is pending.
   * @returns {this}
   */
  queryPending() {
    return this;
  }
  /**
   * Called by the coordinator to return a query result.
   * @param {*} data The query result.
   * @returns {this}
   */
  queryResult(data) {
    return this;
  }
  /**
   * Called by the coordinator to report a query execution error.
   * @param {*} error
   * @returns {this}
   */
  queryError(error) {
    console.error(error);
    return this;
  }
  /**
   * Request the coordinator to execute a query for this client.
   * If an explicit query is not provided, the client query method will
   * be called, filtered by the current filterBy selection.
   */
  requestQuery(query) {
    const q = query || this.query(this.filterBy?.predicate(this));
    return this._coordinator.requestQuery(this, q);
  }
  /**
   * Request that the coordinator perform a throttled update of this client
   * using the default query. Unlike requestQuery, for which every call will
   * result in an executed query, multiple calls to requestUpdate may be
   * consolidated into a single update.
   */
  requestUpdate() {
    this._requestUpdate();
  }
  /**
   * Requests a client update.
   * For example to (re-)render an interface component.
   * 
   * @returns {this | Promise<any>}
   */
  update() {
    return this;
  }
};

// ../../node_modules/tslib/tslib.es6.mjs
function __rest(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
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
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m)
    return m.call(o);
  if (o && typeof o.length === "number")
    return {
      next: function() {
        if (o && i >= o.length)
          o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function verb(n) {
    if (g[n])
      i[n] = function(v) {
        return new Promise(function(a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length)
      resume(q[0][0], q[0][1]);
  }
}
function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function(e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function() {
    return this;
  }, i;
  function verb(n, f) {
    i[n] = o[n] ? function(v) {
      return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v;
    } : f;
  }
}
function __asyncValues(o) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v) {
      return new Promise(function(resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve({ value: v2, done: d });
    }, reject);
  }
}

// ../core/node_modules/apache-arrow/util/buffer.mjs
var buffer_exports = {};
__export(buffer_exports, {
  compareArrayLike: () => compareArrayLike,
  joinUint8Arrays: () => joinUint8Arrays,
  memcpy: () => memcpy,
  rebaseValueOffsets: () => rebaseValueOffsets,
  toArrayBufferView: () => toArrayBufferView,
  toArrayBufferViewAsyncIterator: () => toArrayBufferViewAsyncIterator,
  toArrayBufferViewIterator: () => toArrayBufferViewIterator,
  toBigInt64Array: () => toBigInt64Array,
  toBigUint64Array: () => toBigUint64Array,
  toFloat32Array: () => toFloat32Array,
  toFloat32ArrayAsyncIterator: () => toFloat32ArrayAsyncIterator,
  toFloat32ArrayIterator: () => toFloat32ArrayIterator,
  toFloat64Array: () => toFloat64Array,
  toFloat64ArrayAsyncIterator: () => toFloat64ArrayAsyncIterator,
  toFloat64ArrayIterator: () => toFloat64ArrayIterator,
  toInt16Array: () => toInt16Array,
  toInt16ArrayAsyncIterator: () => toInt16ArrayAsyncIterator,
  toInt16ArrayIterator: () => toInt16ArrayIterator,
  toInt32Array: () => toInt32Array,
  toInt32ArrayAsyncIterator: () => toInt32ArrayAsyncIterator,
  toInt32ArrayIterator: () => toInt32ArrayIterator,
  toInt8Array: () => toInt8Array,
  toInt8ArrayAsyncIterator: () => toInt8ArrayAsyncIterator,
  toInt8ArrayIterator: () => toInt8ArrayIterator,
  toUint16Array: () => toUint16Array,
  toUint16ArrayAsyncIterator: () => toUint16ArrayAsyncIterator,
  toUint16ArrayIterator: () => toUint16ArrayIterator,
  toUint32Array: () => toUint32Array,
  toUint32ArrayAsyncIterator: () => toUint32ArrayAsyncIterator,
  toUint32ArrayIterator: () => toUint32ArrayIterator,
  toUint8Array: () => toUint8Array,
  toUint8ArrayAsyncIterator: () => toUint8ArrayAsyncIterator,
  toUint8ArrayIterator: () => toUint8ArrayIterator,
  toUint8ClampedArray: () => toUint8ClampedArray,
  toUint8ClampedArrayAsyncIterator: () => toUint8ClampedArrayAsyncIterator,
  toUint8ClampedArrayIterator: () => toUint8ClampedArrayIterator
});

// ../core/node_modules/apache-arrow/util/utf8.mjs
var decoder = new TextDecoder("utf-8");
var decodeUtf8 = (buffer) => decoder.decode(buffer);
var encoder = new TextEncoder();
var encodeUtf8 = (value) => encoder.encode(value);

// ../core/node_modules/apache-arrow/util/compat.mjs
var isNumber = (x2) => typeof x2 === "number";
var isBoolean = (x2) => typeof x2 === "boolean";
var isFunction = (x2) => typeof x2 === "function";
var isObject = (x2) => x2 != null && Object(x2) === x2;
var isPromise = (x2) => {
  return isObject(x2) && isFunction(x2.then);
};
var isIterable = (x2) => {
  return isObject(x2) && isFunction(x2[Symbol.iterator]);
};
var isAsyncIterable = (x2) => {
  return isObject(x2) && isFunction(x2[Symbol.asyncIterator]);
};
var isArrowJSON = (x2) => {
  return isObject(x2) && isObject(x2["schema"]);
};
var isIteratorResult = (x2) => {
  return isObject(x2) && "done" in x2 && "value" in x2;
};
var isFileHandle = (x2) => {
  return isObject(x2) && isFunction(x2["stat"]) && isNumber(x2["fd"]);
};
var isFetchResponse = (x2) => {
  return isObject(x2) && isReadableDOMStream(x2["body"]);
};
var isReadableInterop = (x2) => "_getDOMStream" in x2 && "_getNodeStream" in x2;
var isWritableDOMStream = (x2) => {
  return isObject(x2) && isFunction(x2["abort"]) && isFunction(x2["getWriter"]) && !isReadableInterop(x2);
};
var isReadableDOMStream = (x2) => {
  return isObject(x2) && isFunction(x2["cancel"]) && isFunction(x2["getReader"]) && !isReadableInterop(x2);
};
var isWritableNodeStream = (x2) => {
  return isObject(x2) && isFunction(x2["end"]) && isFunction(x2["write"]) && isBoolean(x2["writable"]) && !isReadableInterop(x2);
};
var isReadableNodeStream = (x2) => {
  return isObject(x2) && isFunction(x2["read"]) && isFunction(x2["pipe"]) && isBoolean(x2["readable"]) && !isReadableInterop(x2);
};
var isFlatbuffersByteBuffer = (x2) => {
  return isObject(x2) && isFunction(x2["clear"]) && isFunction(x2["bytes"]) && isFunction(x2["position"]) && isFunction(x2["setPosition"]) && isFunction(x2["capacity"]) && isFunction(x2["getBufferIdentifier"]) && isFunction(x2["createLong"]);
};

// ../core/node_modules/apache-arrow/util/buffer.mjs
var SharedArrayBuf = typeof SharedArrayBuffer !== "undefined" ? SharedArrayBuffer : ArrayBuffer;
function collapseContiguousByteRanges(chunks) {
  const result = chunks[0] ? [chunks[0]] : [];
  let xOffset, yOffset, xLen, yLen;
  for (let x2, y2, i = 0, j = 0, n = chunks.length; ++i < n; ) {
    x2 = result[j];
    y2 = chunks[i];
    if (!x2 || !y2 || x2.buffer !== y2.buffer || y2.byteOffset < x2.byteOffset) {
      y2 && (result[++j] = y2);
      continue;
    }
    ({ byteOffset: xOffset, byteLength: xLen } = x2);
    ({ byteOffset: yOffset, byteLength: yLen } = y2);
    if (xOffset + xLen < yOffset || yOffset + yLen < xOffset) {
      y2 && (result[++j] = y2);
      continue;
    }
    result[j] = new Uint8Array(x2.buffer, xOffset, yOffset - xOffset + yLen);
  }
  return result;
}
function memcpy(target, source, targetByteOffset = 0, sourceByteLength = source.byteLength) {
  const targetByteLength = target.byteLength;
  const dst = new Uint8Array(target.buffer, target.byteOffset, targetByteLength);
  const src = new Uint8Array(source.buffer, source.byteOffset, Math.min(sourceByteLength, targetByteLength));
  dst.set(src, targetByteOffset);
  return target;
}
function joinUint8Arrays(chunks, size) {
  const result = collapseContiguousByteRanges(chunks);
  const byteLength = result.reduce((x2, b) => x2 + b.byteLength, 0);
  let source, sliced, buffer;
  let offset = 0, index = -1;
  const length2 = Math.min(size || Number.POSITIVE_INFINITY, byteLength);
  for (const n = result.length; ++index < n; ) {
    source = result[index];
    sliced = source.subarray(0, Math.min(source.length, length2 - offset));
    if (length2 <= offset + sliced.length) {
      if (sliced.length < source.length) {
        result[index] = source.subarray(sliced.length);
      } else if (sliced.length === source.length) {
        index++;
      }
      buffer ? memcpy(buffer, sliced, offset) : buffer = sliced;
      break;
    }
    memcpy(buffer || (buffer = new Uint8Array(length2)), sliced, offset);
    offset += sliced.length;
  }
  return [buffer || new Uint8Array(0), result.slice(index), byteLength - (buffer ? buffer.byteLength : 0)];
}
function toArrayBufferView(ArrayBufferViewCtor, input2) {
  let value = isIteratorResult(input2) ? input2.value : input2;
  if (value instanceof ArrayBufferViewCtor) {
    if (ArrayBufferViewCtor === Uint8Array) {
      return new ArrayBufferViewCtor(value.buffer, value.byteOffset, value.byteLength);
    }
    return value;
  }
  if (!value) {
    return new ArrayBufferViewCtor(0);
  }
  if (typeof value === "string") {
    value = encodeUtf8(value);
  }
  if (value instanceof ArrayBuffer) {
    return new ArrayBufferViewCtor(value);
  }
  if (value instanceof SharedArrayBuf) {
    return new ArrayBufferViewCtor(value);
  }
  if (isFlatbuffersByteBuffer(value)) {
    return toArrayBufferView(ArrayBufferViewCtor, value.bytes());
  }
  return !ArrayBuffer.isView(value) ? ArrayBufferViewCtor.from(value) : value.byteLength <= 0 ? new ArrayBufferViewCtor(0) : new ArrayBufferViewCtor(value.buffer, value.byteOffset, value.byteLength / ArrayBufferViewCtor.BYTES_PER_ELEMENT);
}
var toInt8Array = (input2) => toArrayBufferView(Int8Array, input2);
var toInt16Array = (input2) => toArrayBufferView(Int16Array, input2);
var toInt32Array = (input2) => toArrayBufferView(Int32Array, input2);
var toBigInt64Array = (input2) => toArrayBufferView(BigInt64Array, input2);
var toUint8Array = (input2) => toArrayBufferView(Uint8Array, input2);
var toUint16Array = (input2) => toArrayBufferView(Uint16Array, input2);
var toUint32Array = (input2) => toArrayBufferView(Uint32Array, input2);
var toBigUint64Array = (input2) => toArrayBufferView(BigUint64Array, input2);
var toFloat32Array = (input2) => toArrayBufferView(Float32Array, input2);
var toFloat64Array = (input2) => toArrayBufferView(Float64Array, input2);
var toUint8ClampedArray = (input2) => toArrayBufferView(Uint8ClampedArray, input2);
var pump = (iterator) => {
  iterator.next();
  return iterator;
};
function* toArrayBufferViewIterator(ArrayCtor, source) {
  const wrap = function* (x2) {
    yield x2;
  };
  const buffers = typeof source === "string" ? wrap(source) : ArrayBuffer.isView(source) ? wrap(source) : source instanceof ArrayBuffer ? wrap(source) : source instanceof SharedArrayBuf ? wrap(source) : !isIterable(source) ? wrap(source) : source;
  yield* pump(function* (it) {
    let r = null;
    do {
      r = it.next(yield toArrayBufferView(ArrayCtor, r));
    } while (!r.done);
  }(buffers[Symbol.iterator]()));
  return new ArrayCtor();
}
var toInt8ArrayIterator = (input2) => toArrayBufferViewIterator(Int8Array, input2);
var toInt16ArrayIterator = (input2) => toArrayBufferViewIterator(Int16Array, input2);
var toInt32ArrayIterator = (input2) => toArrayBufferViewIterator(Int32Array, input2);
var toUint8ArrayIterator = (input2) => toArrayBufferViewIterator(Uint8Array, input2);
var toUint16ArrayIterator = (input2) => toArrayBufferViewIterator(Uint16Array, input2);
var toUint32ArrayIterator = (input2) => toArrayBufferViewIterator(Uint32Array, input2);
var toFloat32ArrayIterator = (input2) => toArrayBufferViewIterator(Float32Array, input2);
var toFloat64ArrayIterator = (input2) => toArrayBufferViewIterator(Float64Array, input2);
var toUint8ClampedArrayIterator = (input2) => toArrayBufferViewIterator(Uint8ClampedArray, input2);
function toArrayBufferViewAsyncIterator(ArrayCtor, source) {
  return __asyncGenerator(this, arguments, function* toArrayBufferViewAsyncIterator_1() {
    if (isPromise(source)) {
      return yield __await(yield __await(yield* __asyncDelegator(__asyncValues(toArrayBufferViewAsyncIterator(ArrayCtor, yield __await(source))))));
    }
    const wrap = function(x2) {
      return __asyncGenerator(this, arguments, function* () {
        yield yield __await(yield __await(x2));
      });
    };
    const emit = function(source2) {
      return __asyncGenerator(this, arguments, function* () {
        yield __await(yield* __asyncDelegator(__asyncValues(pump(function* (it) {
          let r = null;
          do {
            r = it.next(yield r === null || r === void 0 ? void 0 : r.value);
          } while (!r.done);
        }(source2[Symbol.iterator]())))));
      });
    };
    const buffers = typeof source === "string" ? wrap(source) : ArrayBuffer.isView(source) ? wrap(source) : source instanceof ArrayBuffer ? wrap(source) : source instanceof SharedArrayBuf ? wrap(source) : isIterable(source) ? emit(source) : !isAsyncIterable(source) ? wrap(source) : source;
    yield __await(
      // otherwise if AsyncIterable, use it
      yield* __asyncDelegator(__asyncValues(pump(function(it) {
        return __asyncGenerator(this, arguments, function* () {
          let r = null;
          do {
            r = yield __await(it.next(yield yield __await(toArrayBufferView(ArrayCtor, r))));
          } while (!r.done);
        });
      }(buffers[Symbol.asyncIterator]()))))
    );
    return yield __await(new ArrayCtor());
  });
}
var toInt8ArrayAsyncIterator = (input2) => toArrayBufferViewAsyncIterator(Int8Array, input2);
var toInt16ArrayAsyncIterator = (input2) => toArrayBufferViewAsyncIterator(Int16Array, input2);
var toInt32ArrayAsyncIterator = (input2) => toArrayBufferViewAsyncIterator(Int32Array, input2);
var toUint8ArrayAsyncIterator = (input2) => toArrayBufferViewAsyncIterator(Uint8Array, input2);
var toUint16ArrayAsyncIterator = (input2) => toArrayBufferViewAsyncIterator(Uint16Array, input2);
var toUint32ArrayAsyncIterator = (input2) => toArrayBufferViewAsyncIterator(Uint32Array, input2);
var toFloat32ArrayAsyncIterator = (input2) => toArrayBufferViewAsyncIterator(Float32Array, input2);
var toFloat64ArrayAsyncIterator = (input2) => toArrayBufferViewAsyncIterator(Float64Array, input2);
var toUint8ClampedArrayAsyncIterator = (input2) => toArrayBufferViewAsyncIterator(Uint8ClampedArray, input2);
function rebaseValueOffsets(offset, length2, valueOffsets) {
  if (offset !== 0) {
    valueOffsets = valueOffsets.slice(0, length2);
    for (let i = -1, n = valueOffsets.length; ++i < n; ) {
      valueOffsets[i] += offset;
    }
  }
  return valueOffsets.subarray(0, length2);
}
function compareArrayLike(a, b) {
  let i = 0;
  const n = a.length;
  if (n !== b.length) {
    return false;
  }
  if (n > 0) {
    do {
      if (a[i] !== b[i]) {
        return false;
      }
    } while (++i < n);
  }
  return true;
}

// ../core/node_modules/apache-arrow/io/adapters.mjs
var adapters_default = {
  fromIterable(source) {
    return pump2(fromIterable(source));
  },
  fromAsyncIterable(source) {
    return pump2(fromAsyncIterable(source));
  },
  fromDOMStream(source) {
    return pump2(fromDOMStream(source));
  },
  fromNodeStream(stream) {
    return pump2(fromNodeStream(stream));
  },
  // @ts-ignore
  toDOMStream(source, options) {
    throw new Error(`"toDOMStream" not available in this environment`);
  },
  // @ts-ignore
  toNodeStream(source, options) {
    throw new Error(`"toNodeStream" not available in this environment`);
  }
};
var pump2 = (iterator) => {
  iterator.next();
  return iterator;
};
function* fromIterable(source) {
  let done, threw = false;
  let buffers = [], buffer;
  let cmd, size, bufferLength = 0;
  function byteRange() {
    if (cmd === "peek") {
      return joinUint8Arrays(buffers, size)[0];
    }
    [buffer, buffers, bufferLength] = joinUint8Arrays(buffers, size);
    return buffer;
  }
  ({ cmd, size } = (yield /* @__PURE__ */ (() => null)()) || { cmd: "read", size: 0 });
  const it = toUint8ArrayIterator(source)[Symbol.iterator]();
  try {
    do {
      ({ done, value: buffer } = Number.isNaN(size - bufferLength) ? it.next() : it.next(size - bufferLength));
      if (!done && buffer.byteLength > 0) {
        buffers.push(buffer);
        bufferLength += buffer.byteLength;
      }
      if (done || size <= bufferLength) {
        do {
          ({ cmd, size } = yield byteRange());
        } while (size < bufferLength);
      }
    } while (!done);
  } catch (e) {
    (threw = true) && typeof it.throw === "function" && it.throw(e);
  } finally {
    threw === false && typeof it.return === "function" && it.return(null);
  }
  return null;
}
function fromAsyncIterable(source) {
  return __asyncGenerator(this, arguments, function* fromAsyncIterable_1() {
    let done, threw = false;
    let buffers = [], buffer;
    let cmd, size, bufferLength = 0;
    function byteRange() {
      if (cmd === "peek") {
        return joinUint8Arrays(buffers, size)[0];
      }
      [buffer, buffers, bufferLength] = joinUint8Arrays(buffers, size);
      return buffer;
    }
    ({ cmd, size } = (yield yield __await(/* @__PURE__ */ (() => null)())) || { cmd: "read", size: 0 });
    const it = toUint8ArrayAsyncIterator(source)[Symbol.asyncIterator]();
    try {
      do {
        ({ done, value: buffer } = Number.isNaN(size - bufferLength) ? yield __await(it.next()) : yield __await(it.next(size - bufferLength)));
        if (!done && buffer.byteLength > 0) {
          buffers.push(buffer);
          bufferLength += buffer.byteLength;
        }
        if (done || size <= bufferLength) {
          do {
            ({ cmd, size } = yield yield __await(byteRange()));
          } while (size < bufferLength);
        }
      } while (!done);
    } catch (e) {
      (threw = true) && typeof it.throw === "function" && (yield __await(it.throw(e)));
    } finally {
      threw === false && typeof it.return === "function" && (yield __await(it.return(new Uint8Array(0))));
    }
    return yield __await(null);
  });
}
function fromDOMStream(source) {
  return __asyncGenerator(this, arguments, function* fromDOMStream_1() {
    let done = false, threw = false;
    let buffers = [], buffer;
    let cmd, size, bufferLength = 0;
    function byteRange() {
      if (cmd === "peek") {
        return joinUint8Arrays(buffers, size)[0];
      }
      [buffer, buffers, bufferLength] = joinUint8Arrays(buffers, size);
      return buffer;
    }
    ({ cmd, size } = (yield yield __await(/* @__PURE__ */ (() => null)())) || { cmd: "read", size: 0 });
    const it = new AdaptiveByteReader(source);
    try {
      do {
        ({ done, value: buffer } = Number.isNaN(size - bufferLength) ? yield __await(it["read"]()) : yield __await(it["read"](size - bufferLength)));
        if (!done && buffer.byteLength > 0) {
          buffers.push(toUint8Array(buffer));
          bufferLength += buffer.byteLength;
        }
        if (done || size <= bufferLength) {
          do {
            ({ cmd, size } = yield yield __await(byteRange()));
          } while (size < bufferLength);
        }
      } while (!done);
    } catch (e) {
      (threw = true) && (yield __await(it["cancel"](e)));
    } finally {
      threw === false ? yield __await(it["cancel"]()) : source["locked"] && it.releaseLock();
    }
    return yield __await(null);
  });
}
var AdaptiveByteReader = class {
  constructor(source) {
    this.source = source;
    this.reader = null;
    this.reader = this.source["getReader"]();
    this.reader["closed"].catch(() => {
    });
  }
  get closed() {
    return this.reader ? this.reader["closed"].catch(() => {
    }) : Promise.resolve();
  }
  releaseLock() {
    if (this.reader) {
      this.reader.releaseLock();
    }
    this.reader = null;
  }
  cancel(reason) {
    return __awaiter(this, void 0, void 0, function* () {
      const { reader, source } = this;
      reader && (yield reader["cancel"](reason).catch(() => {
      }));
      source && (source["locked"] && this.releaseLock());
    });
  }
  read(size) {
    return __awaiter(this, void 0, void 0, function* () {
      if (size === 0) {
        return { done: this.reader == null, value: new Uint8Array(0) };
      }
      const result = yield this.reader.read();
      !result.done && (result.value = toUint8Array(result));
      return result;
    });
  }
};
var onEvent = (stream, event) => {
  const handler = (_) => resolve([event, _]);
  let resolve;
  return [event, handler, new Promise((r) => (resolve = r) && stream["once"](event, handler))];
};
function fromNodeStream(stream) {
  return __asyncGenerator(this, arguments, function* fromNodeStream_1() {
    const events = [];
    let event = "error";
    let done = false, err = null;
    let cmd, size, bufferLength = 0;
    let buffers = [], buffer;
    function byteRange() {
      if (cmd === "peek") {
        return joinUint8Arrays(buffers, size)[0];
      }
      [buffer, buffers, bufferLength] = joinUint8Arrays(buffers, size);
      return buffer;
    }
    ({ cmd, size } = (yield yield __await(/* @__PURE__ */ (() => null)())) || { cmd: "read", size: 0 });
    if (stream["isTTY"]) {
      yield yield __await(new Uint8Array(0));
      return yield __await(null);
    }
    try {
      events[0] = onEvent(stream, "end");
      events[1] = onEvent(stream, "error");
      do {
        events[2] = onEvent(stream, "readable");
        [event, err] = yield __await(Promise.race(events.map((x2) => x2[2])));
        if (event === "error") {
          break;
        }
        if (!(done = event === "end")) {
          if (!Number.isFinite(size - bufferLength)) {
            buffer = toUint8Array(stream["read"]());
          } else {
            buffer = toUint8Array(stream["read"](size - bufferLength));
            if (buffer.byteLength < size - bufferLength) {
              buffer = toUint8Array(stream["read"]());
            }
          }
          if (buffer.byteLength > 0) {
            buffers.push(buffer);
            bufferLength += buffer.byteLength;
          }
        }
        if (done || size <= bufferLength) {
          do {
            ({ cmd, size } = yield yield __await(byteRange()));
          } while (size < bufferLength);
        }
      } while (!done);
    } finally {
      yield __await(cleanup(events, event === "error" ? err : null));
    }
    return yield __await(null);
    function cleanup(events2, err2) {
      buffer = buffers = null;
      return new Promise((resolve, reject) => {
        for (const [evt, fn] of events2) {
          stream["off"](evt, fn);
        }
        try {
          const destroy = stream["destroy"];
          destroy && destroy.call(stream, err2);
          err2 = void 0;
        } catch (e) {
          err2 = e || err2;
        } finally {
          err2 != null ? reject(err2) : resolve();
        }
      });
    }
  });
}

// ../core/node_modules/apache-arrow/fb/metadata-version.mjs
var MetadataVersion;
(function(MetadataVersion2) {
  MetadataVersion2[MetadataVersion2["V1"] = 0] = "V1";
  MetadataVersion2[MetadataVersion2["V2"] = 1] = "V2";
  MetadataVersion2[MetadataVersion2["V3"] = 2] = "V3";
  MetadataVersion2[MetadataVersion2["V4"] = 3] = "V4";
  MetadataVersion2[MetadataVersion2["V5"] = 4] = "V5";
})(MetadataVersion || (MetadataVersion = {}));

// ../core/node_modules/apache-arrow/fb/union-mode.mjs
var UnionMode;
(function(UnionMode2) {
  UnionMode2[UnionMode2["Sparse"] = 0] = "Sparse";
  UnionMode2[UnionMode2["Dense"] = 1] = "Dense";
})(UnionMode || (UnionMode = {}));

// ../core/node_modules/apache-arrow/fb/precision.mjs
var Precision;
(function(Precision2) {
  Precision2[Precision2["HALF"] = 0] = "HALF";
  Precision2[Precision2["SINGLE"] = 1] = "SINGLE";
  Precision2[Precision2["DOUBLE"] = 2] = "DOUBLE";
})(Precision || (Precision = {}));

// ../core/node_modules/apache-arrow/fb/date-unit.mjs
var DateUnit;
(function(DateUnit2) {
  DateUnit2[DateUnit2["DAY"] = 0] = "DAY";
  DateUnit2[DateUnit2["MILLISECOND"] = 1] = "MILLISECOND";
})(DateUnit || (DateUnit = {}));

// ../core/node_modules/apache-arrow/fb/time-unit.mjs
var TimeUnit;
(function(TimeUnit2) {
  TimeUnit2[TimeUnit2["SECOND"] = 0] = "SECOND";
  TimeUnit2[TimeUnit2["MILLISECOND"] = 1] = "MILLISECOND";
  TimeUnit2[TimeUnit2["MICROSECOND"] = 2] = "MICROSECOND";
  TimeUnit2[TimeUnit2["NANOSECOND"] = 3] = "NANOSECOND";
})(TimeUnit || (TimeUnit = {}));

// ../core/node_modules/apache-arrow/fb/interval-unit.mjs
var IntervalUnit;
(function(IntervalUnit2) {
  IntervalUnit2[IntervalUnit2["YEAR_MONTH"] = 0] = "YEAR_MONTH";
  IntervalUnit2[IntervalUnit2["DAY_TIME"] = 1] = "DAY_TIME";
  IntervalUnit2[IntervalUnit2["MONTH_DAY_NANO"] = 2] = "MONTH_DAY_NANO";
})(IntervalUnit || (IntervalUnit = {}));

// ../../node_modules/flatbuffers/mjs/constants.js
var SIZEOF_SHORT = 2;
var SIZEOF_INT = 4;
var FILE_IDENTIFIER_LENGTH = 4;
var SIZE_PREFIX_LENGTH = 4;

// ../../node_modules/flatbuffers/mjs/utils.js
var int32 = new Int32Array(2);
var float32 = new Float32Array(int32.buffer);
var float64 = new Float64Array(int32.buffer);
var isLittleEndian = new Uint16Array(new Uint8Array([1, 0]).buffer)[0] === 1;

// ../../node_modules/flatbuffers/mjs/encoding.js
var Encoding;
(function(Encoding2) {
  Encoding2[Encoding2["UTF8_BYTES"] = 1] = "UTF8_BYTES";
  Encoding2[Encoding2["UTF16_STRING"] = 2] = "UTF16_STRING";
})(Encoding || (Encoding = {}));

// ../../node_modules/flatbuffers/mjs/byte-buffer.js
var ByteBuffer = class _ByteBuffer {
  /**
   * Create a new ByteBuffer with a given array of bytes (`Uint8Array`)
   */
  constructor(bytes_) {
    this.bytes_ = bytes_;
    this.position_ = 0;
    this.text_decoder_ = new TextDecoder();
  }
  /**
   * Create and allocate a new ByteBuffer with a given size.
   */
  static allocate(byte_size) {
    return new _ByteBuffer(new Uint8Array(byte_size));
  }
  clear() {
    this.position_ = 0;
  }
  /**
   * Get the underlying `Uint8Array`.
   */
  bytes() {
    return this.bytes_;
  }
  /**
   * Get the buffer's position.
   */
  position() {
    return this.position_;
  }
  /**
   * Set the buffer's position.
   */
  setPosition(position) {
    this.position_ = position;
  }
  /**
   * Get the buffer's capacity.
   */
  capacity() {
    return this.bytes_.length;
  }
  readInt8(offset) {
    return this.readUint8(offset) << 24 >> 24;
  }
  readUint8(offset) {
    return this.bytes_[offset];
  }
  readInt16(offset) {
    return this.readUint16(offset) << 16 >> 16;
  }
  readUint16(offset) {
    return this.bytes_[offset] | this.bytes_[offset + 1] << 8;
  }
  readInt32(offset) {
    return this.bytes_[offset] | this.bytes_[offset + 1] << 8 | this.bytes_[offset + 2] << 16 | this.bytes_[offset + 3] << 24;
  }
  readUint32(offset) {
    return this.readInt32(offset) >>> 0;
  }
  readInt64(offset) {
    return BigInt.asIntN(64, BigInt(this.readUint32(offset)) + (BigInt(this.readUint32(offset + 4)) << BigInt(32)));
  }
  readUint64(offset) {
    return BigInt.asUintN(64, BigInt(this.readUint32(offset)) + (BigInt(this.readUint32(offset + 4)) << BigInt(32)));
  }
  readFloat32(offset) {
    int32[0] = this.readInt32(offset);
    return float32[0];
  }
  readFloat64(offset) {
    int32[isLittleEndian ? 0 : 1] = this.readInt32(offset);
    int32[isLittleEndian ? 1 : 0] = this.readInt32(offset + 4);
    return float64[0];
  }
  writeInt8(offset, value) {
    this.bytes_[offset] = value;
  }
  writeUint8(offset, value) {
    this.bytes_[offset] = value;
  }
  writeInt16(offset, value) {
    this.bytes_[offset] = value;
    this.bytes_[offset + 1] = value >> 8;
  }
  writeUint16(offset, value) {
    this.bytes_[offset] = value;
    this.bytes_[offset + 1] = value >> 8;
  }
  writeInt32(offset, value) {
    this.bytes_[offset] = value;
    this.bytes_[offset + 1] = value >> 8;
    this.bytes_[offset + 2] = value >> 16;
    this.bytes_[offset + 3] = value >> 24;
  }
  writeUint32(offset, value) {
    this.bytes_[offset] = value;
    this.bytes_[offset + 1] = value >> 8;
    this.bytes_[offset + 2] = value >> 16;
    this.bytes_[offset + 3] = value >> 24;
  }
  writeInt64(offset, value) {
    this.writeInt32(offset, Number(BigInt.asIntN(32, value)));
    this.writeInt32(offset + 4, Number(BigInt.asIntN(32, value >> BigInt(32))));
  }
  writeUint64(offset, value) {
    this.writeUint32(offset, Number(BigInt.asUintN(32, value)));
    this.writeUint32(offset + 4, Number(BigInt.asUintN(32, value >> BigInt(32))));
  }
  writeFloat32(offset, value) {
    float32[0] = value;
    this.writeInt32(offset, int32[0]);
  }
  writeFloat64(offset, value) {
    float64[0] = value;
    this.writeInt32(offset, int32[isLittleEndian ? 0 : 1]);
    this.writeInt32(offset + 4, int32[isLittleEndian ? 1 : 0]);
  }
  /**
   * Return the file identifier.   Behavior is undefined for FlatBuffers whose
   * schema does not include a file_identifier (likely points at padding or the
   * start of a the root vtable).
   */
  getBufferIdentifier() {
    if (this.bytes_.length < this.position_ + SIZEOF_INT + FILE_IDENTIFIER_LENGTH) {
      throw new Error("FlatBuffers: ByteBuffer is too short to contain an identifier.");
    }
    let result = "";
    for (let i = 0; i < FILE_IDENTIFIER_LENGTH; i++) {
      result += String.fromCharCode(this.readInt8(this.position_ + SIZEOF_INT + i));
    }
    return result;
  }
  /**
   * Look up a field in the vtable, return an offset into the object, or 0 if the
   * field is not present.
   */
  __offset(bb_pos, vtable_offset) {
    const vtable = bb_pos - this.readInt32(bb_pos);
    return vtable_offset < this.readInt16(vtable) ? this.readInt16(vtable + vtable_offset) : 0;
  }
  /**
   * Initialize any Table-derived type to point to the union at the given offset.
   */
  __union(t, offset) {
    t.bb_pos = offset + this.readInt32(offset);
    t.bb = this;
    return t;
  }
  /**
   * Create a JavaScript string from UTF-8 data stored inside the FlatBuffer.
   * This allocates a new string and converts to wide chars upon each access.
   *
   * To avoid the conversion to string, pass Encoding.UTF8_BYTES as the
   * "optionalEncoding" argument. This is useful for avoiding conversion when
   * the data will just be packaged back up in another FlatBuffer later on.
   *
   * @param offset
   * @param opt_encoding Defaults to UTF16_STRING
   */
  __string(offset, opt_encoding) {
    offset += this.readInt32(offset);
    const length2 = this.readInt32(offset);
    offset += SIZEOF_INT;
    const utf8bytes = this.bytes_.subarray(offset, offset + length2);
    if (opt_encoding === Encoding.UTF8_BYTES)
      return utf8bytes;
    else
      return this.text_decoder_.decode(utf8bytes);
  }
  /**
   * Handle unions that can contain string as its member, if a Table-derived type then initialize it,
   * if a string then return a new one
   *
   * WARNING: strings are immutable in JS so we can't change the string that the user gave us, this
   * makes the behaviour of __union_with_string different compared to __union
   */
  __union_with_string(o, offset) {
    if (typeof o === "string") {
      return this.__string(offset);
    }
    return this.__union(o, offset);
  }
  /**
   * Retrieve the relative offset stored at "offset"
   */
  __indirect(offset) {
    return offset + this.readInt32(offset);
  }
  /**
   * Get the start of data of a vector whose offset is stored at "offset" in this object.
   */
  __vector(offset) {
    return offset + this.readInt32(offset) + SIZEOF_INT;
  }
  /**
   * Get the length of a vector whose offset is stored at "offset" in this object.
   */
  __vector_len(offset) {
    return this.readInt32(offset + this.readInt32(offset));
  }
  __has_identifier(ident) {
    if (ident.length != FILE_IDENTIFIER_LENGTH) {
      throw new Error("FlatBuffers: file identifier must be length " + FILE_IDENTIFIER_LENGTH);
    }
    for (let i = 0; i < FILE_IDENTIFIER_LENGTH; i++) {
      if (ident.charCodeAt(i) != this.readInt8(this.position() + SIZEOF_INT + i)) {
        return false;
      }
    }
    return true;
  }
  /**
   * A helper function for generating list for obj api
   */
  createScalarList(listAccessor, listLength) {
    const ret = [];
    for (let i = 0; i < listLength; ++i) {
      const val = listAccessor(i);
      if (val !== null) {
        ret.push(val);
      }
    }
    return ret;
  }
  /**
   * A helper function for generating list for obj api
   * @param listAccessor function that accepts an index and return data at that index
   * @param listLength listLength
   * @param res result list
   */
  createObjList(listAccessor, listLength) {
    const ret = [];
    for (let i = 0; i < listLength; ++i) {
      const val = listAccessor(i);
      if (val !== null) {
        ret.push(val.unpack());
      }
    }
    return ret;
  }
};

// ../../node_modules/flatbuffers/mjs/builder.js
var Builder = class _Builder {
  /**
   * Create a FlatBufferBuilder.
   */
  constructor(opt_initial_size) {
    this.minalign = 1;
    this.vtable = null;
    this.vtable_in_use = 0;
    this.isNested = false;
    this.object_start = 0;
    this.vtables = [];
    this.vector_num_elems = 0;
    this.force_defaults = false;
    this.string_maps = null;
    this.text_encoder = new TextEncoder();
    let initial_size;
    if (!opt_initial_size) {
      initial_size = 1024;
    } else {
      initial_size = opt_initial_size;
    }
    this.bb = ByteBuffer.allocate(initial_size);
    this.space = initial_size;
  }
  clear() {
    this.bb.clear();
    this.space = this.bb.capacity();
    this.minalign = 1;
    this.vtable = null;
    this.vtable_in_use = 0;
    this.isNested = false;
    this.object_start = 0;
    this.vtables = [];
    this.vector_num_elems = 0;
    this.force_defaults = false;
    this.string_maps = null;
  }
  /**
   * In order to save space, fields that are set to their default value
   * don't get serialized into the buffer. Forcing defaults provides a
   * way to manually disable this optimization.
   *
   * @param forceDefaults true always serializes default values
   */
  forceDefaults(forceDefaults) {
    this.force_defaults = forceDefaults;
  }
  /**
   * Get the ByteBuffer representing the FlatBuffer. Only call this after you've
   * called finish(). The actual data starts at the ByteBuffer's current position,
   * not necessarily at 0.
   */
  dataBuffer() {
    return this.bb;
  }
  /**
   * Get the bytes representing the FlatBuffer. Only call this after you've
   * called finish().
   */
  asUint8Array() {
    return this.bb.bytes().subarray(this.bb.position(), this.bb.position() + this.offset());
  }
  /**
   * Prepare to write an element of `size` after `additional_bytes` have been
   * written, e.g. if you write a string, you need to align such the int length
   * field is aligned to 4 bytes, and the string data follows it directly. If all
   * you need to do is alignment, `additional_bytes` will be 0.
   *
   * @param size This is the of the new element to write
   * @param additional_bytes The padding size
   */
  prep(size, additional_bytes) {
    if (size > this.minalign) {
      this.minalign = size;
    }
    const align_size = ~(this.bb.capacity() - this.space + additional_bytes) + 1 & size - 1;
    while (this.space < align_size + size + additional_bytes) {
      const old_buf_size = this.bb.capacity();
      this.bb = _Builder.growByteBuffer(this.bb);
      this.space += this.bb.capacity() - old_buf_size;
    }
    this.pad(align_size);
  }
  pad(byte_size) {
    for (let i = 0; i < byte_size; i++) {
      this.bb.writeInt8(--this.space, 0);
    }
  }
  writeInt8(value) {
    this.bb.writeInt8(this.space -= 1, value);
  }
  writeInt16(value) {
    this.bb.writeInt16(this.space -= 2, value);
  }
  writeInt32(value) {
    this.bb.writeInt32(this.space -= 4, value);
  }
  writeInt64(value) {
    this.bb.writeInt64(this.space -= 8, value);
  }
  writeFloat32(value) {
    this.bb.writeFloat32(this.space -= 4, value);
  }
  writeFloat64(value) {
    this.bb.writeFloat64(this.space -= 8, value);
  }
  /**
   * Add an `int8` to the buffer, properly aligned, and grows the buffer (if necessary).
   * @param value The `int8` to add the buffer.
   */
  addInt8(value) {
    this.prep(1, 0);
    this.writeInt8(value);
  }
  /**
   * Add an `int16` to the buffer, properly aligned, and grows the buffer (if necessary).
   * @param value The `int16` to add the buffer.
   */
  addInt16(value) {
    this.prep(2, 0);
    this.writeInt16(value);
  }
  /**
   * Add an `int32` to the buffer, properly aligned, and grows the buffer (if necessary).
   * @param value The `int32` to add the buffer.
   */
  addInt32(value) {
    this.prep(4, 0);
    this.writeInt32(value);
  }
  /**
   * Add an `int64` to the buffer, properly aligned, and grows the buffer (if necessary).
   * @param value The `int64` to add the buffer.
   */
  addInt64(value) {
    this.prep(8, 0);
    this.writeInt64(value);
  }
  /**
   * Add a `float32` to the buffer, properly aligned, and grows the buffer (if necessary).
   * @param value The `float32` to add the buffer.
   */
  addFloat32(value) {
    this.prep(4, 0);
    this.writeFloat32(value);
  }
  /**
   * Add a `float64` to the buffer, properly aligned, and grows the buffer (if necessary).
   * @param value The `float64` to add the buffer.
   */
  addFloat64(value) {
    this.prep(8, 0);
    this.writeFloat64(value);
  }
  addFieldInt8(voffset, value, defaultValue) {
    if (this.force_defaults || value != defaultValue) {
      this.addInt8(value);
      this.slot(voffset);
    }
  }
  addFieldInt16(voffset, value, defaultValue) {
    if (this.force_defaults || value != defaultValue) {
      this.addInt16(value);
      this.slot(voffset);
    }
  }
  addFieldInt32(voffset, value, defaultValue) {
    if (this.force_defaults || value != defaultValue) {
      this.addInt32(value);
      this.slot(voffset);
    }
  }
  addFieldInt64(voffset, value, defaultValue) {
    if (this.force_defaults || value !== defaultValue) {
      this.addInt64(value);
      this.slot(voffset);
    }
  }
  addFieldFloat32(voffset, value, defaultValue) {
    if (this.force_defaults || value != defaultValue) {
      this.addFloat32(value);
      this.slot(voffset);
    }
  }
  addFieldFloat64(voffset, value, defaultValue) {
    if (this.force_defaults || value != defaultValue) {
      this.addFloat64(value);
      this.slot(voffset);
    }
  }
  addFieldOffset(voffset, value, defaultValue) {
    if (this.force_defaults || value != defaultValue) {
      this.addOffset(value);
      this.slot(voffset);
    }
  }
  /**
   * Structs are stored inline, so nothing additional is being added. `d` is always 0.
   */
  addFieldStruct(voffset, value, defaultValue) {
    if (value != defaultValue) {
      this.nested(value);
      this.slot(voffset);
    }
  }
  /**
   * Structures are always stored inline, they need to be created right
   * where they're used.  You'll get this assertion failure if you
   * created it elsewhere.
   */
  nested(obj) {
    if (obj != this.offset()) {
      throw new TypeError("FlatBuffers: struct must be serialized inline.");
    }
  }
  /**
   * Should not be creating any other object, string or vector
   * while an object is being constructed
   */
  notNested() {
    if (this.isNested) {
      throw new TypeError("FlatBuffers: object serialization must not be nested.");
    }
  }
  /**
   * Set the current vtable at `voffset` to the current location in the buffer.
   */
  slot(voffset) {
    if (this.vtable !== null)
      this.vtable[voffset] = this.offset();
  }
  /**
   * @returns Offset relative to the end of the buffer.
   */
  offset() {
    return this.bb.capacity() - this.space;
  }
  /**
   * Doubles the size of the backing ByteBuffer and copies the old data towards
   * the end of the new buffer (since we build the buffer backwards).
   *
   * @param bb The current buffer with the existing data
   * @returns A new byte buffer with the old data copied
   * to it. The data is located at the end of the buffer.
   *
   * uint8Array.set() formally takes {Array<number>|ArrayBufferView}, so to pass
   * it a uint8Array we need to suppress the type check:
   * @suppress {checkTypes}
   */
  static growByteBuffer(bb) {
    const old_buf_size = bb.capacity();
    if (old_buf_size & 3221225472) {
      throw new Error("FlatBuffers: cannot grow buffer beyond 2 gigabytes.");
    }
    const new_buf_size = old_buf_size << 1;
    const nbb = ByteBuffer.allocate(new_buf_size);
    nbb.setPosition(new_buf_size - old_buf_size);
    nbb.bytes().set(bb.bytes(), new_buf_size - old_buf_size);
    return nbb;
  }
  /**
   * Adds on offset, relative to where it will be written.
   *
   * @param offset The offset to add.
   */
  addOffset(offset) {
    this.prep(SIZEOF_INT, 0);
    this.writeInt32(this.offset() - offset + SIZEOF_INT);
  }
  /**
   * Start encoding a new object in the buffer.  Users will not usually need to
   * call this directly. The FlatBuffers compiler will generate helper methods
   * that call this method internally.
   */
  startObject(numfields) {
    this.notNested();
    if (this.vtable == null) {
      this.vtable = [];
    }
    this.vtable_in_use = numfields;
    for (let i = 0; i < numfields; i++) {
      this.vtable[i] = 0;
    }
    this.isNested = true;
    this.object_start = this.offset();
  }
  /**
   * Finish off writing the object that is under construction.
   *
   * @returns The offset to the object inside `dataBuffer`
   */
  endObject() {
    if (this.vtable == null || !this.isNested) {
      throw new Error("FlatBuffers: endObject called without startObject");
    }
    this.addInt32(0);
    const vtableloc = this.offset();
    let i = this.vtable_in_use - 1;
    for (; i >= 0 && this.vtable[i] == 0; i--) {
    }
    const trimmed_size = i + 1;
    for (; i >= 0; i--) {
      this.addInt16(this.vtable[i] != 0 ? vtableloc - this.vtable[i] : 0);
    }
    const standard_fields = 2;
    this.addInt16(vtableloc - this.object_start);
    const len = (trimmed_size + standard_fields) * SIZEOF_SHORT;
    this.addInt16(len);
    let existing_vtable = 0;
    const vt1 = this.space;
    outer_loop:
      for (i = 0; i < this.vtables.length; i++) {
        const vt2 = this.bb.capacity() - this.vtables[i];
        if (len == this.bb.readInt16(vt2)) {
          for (let j = SIZEOF_SHORT; j < len; j += SIZEOF_SHORT) {
            if (this.bb.readInt16(vt1 + j) != this.bb.readInt16(vt2 + j)) {
              continue outer_loop;
            }
          }
          existing_vtable = this.vtables[i];
          break;
        }
      }
    if (existing_vtable) {
      this.space = this.bb.capacity() - vtableloc;
      this.bb.writeInt32(this.space, existing_vtable - vtableloc);
    } else {
      this.vtables.push(this.offset());
      this.bb.writeInt32(this.bb.capacity() - vtableloc, this.offset() - vtableloc);
    }
    this.isNested = false;
    return vtableloc;
  }
  /**
   * Finalize a buffer, poiting to the given `root_table`.
   */
  finish(root_table, opt_file_identifier, opt_size_prefix) {
    const size_prefix = opt_size_prefix ? SIZE_PREFIX_LENGTH : 0;
    if (opt_file_identifier) {
      const file_identifier = opt_file_identifier;
      this.prep(this.minalign, SIZEOF_INT + FILE_IDENTIFIER_LENGTH + size_prefix);
      if (file_identifier.length != FILE_IDENTIFIER_LENGTH) {
        throw new TypeError("FlatBuffers: file identifier must be length " + FILE_IDENTIFIER_LENGTH);
      }
      for (let i = FILE_IDENTIFIER_LENGTH - 1; i >= 0; i--) {
        this.writeInt8(file_identifier.charCodeAt(i));
      }
    }
    this.prep(this.minalign, SIZEOF_INT + size_prefix);
    this.addOffset(root_table);
    if (size_prefix) {
      this.addInt32(this.bb.capacity() - this.space);
    }
    this.bb.setPosition(this.space);
  }
  /**
   * Finalize a size prefixed buffer, pointing to the given `root_table`.
   */
  finishSizePrefixed(root_table, opt_file_identifier) {
    this.finish(root_table, opt_file_identifier, true);
  }
  /**
   * This checks a required field has been set in a given table that has
   * just been constructed.
   */
  requiredField(table2, field) {
    const table_start = this.bb.capacity() - table2;
    const vtable_start = table_start - this.bb.readInt32(table_start);
    const ok = field < this.bb.readInt16(vtable_start) && this.bb.readInt16(vtable_start + field) != 0;
    if (!ok) {
      throw new TypeError("FlatBuffers: field " + field + " must be set");
    }
  }
  /**
   * Start a new array/vector of objects.  Users usually will not call
   * this directly. The FlatBuffers compiler will create a start/end
   * method for vector types in generated code.
   *
   * @param elem_size The size of each element in the array
   * @param num_elems The number of elements in the array
   * @param alignment The alignment of the array
   */
  startVector(elem_size, num_elems, alignment) {
    this.notNested();
    this.vector_num_elems = num_elems;
    this.prep(SIZEOF_INT, elem_size * num_elems);
    this.prep(alignment, elem_size * num_elems);
  }
  /**
   * Finish off the creation of an array and all its elements. The array must be
   * created with `startVector`.
   *
   * @returns The offset at which the newly created array
   * starts.
   */
  endVector() {
    this.writeInt32(this.vector_num_elems);
    return this.offset();
  }
  /**
   * Encode the string `s` in the buffer using UTF-8. If the string passed has
   * already been seen, we return the offset of the already written string
   *
   * @param s The string to encode
   * @return The offset in the buffer where the encoded string starts
   */
  createSharedString(s) {
    if (!s) {
      return 0;
    }
    if (!this.string_maps) {
      this.string_maps = /* @__PURE__ */ new Map();
    }
    if (this.string_maps.has(s)) {
      return this.string_maps.get(s);
    }
    const offset = this.createString(s);
    this.string_maps.set(s, offset);
    return offset;
  }
  /**
   * Encode the string `s` in the buffer using UTF-8. If a Uint8Array is passed
   * instead of a string, it is assumed to contain valid UTF-8 encoded data.
   *
   * @param s The string to encode
   * @return The offset in the buffer where the encoded string starts
   */
  createString(s) {
    if (s === null || s === void 0) {
      return 0;
    }
    let utf8;
    if (s instanceof Uint8Array) {
      utf8 = s;
    } else {
      utf8 = this.text_encoder.encode(s);
    }
    this.addInt8(0);
    this.startVector(1, utf8.length, 1);
    this.bb.setPosition(this.space -= utf8.length);
    for (let i = 0, offset = this.space, bytes = this.bb.bytes(); i < utf8.length; i++) {
      bytes[offset++] = utf8[i];
    }
    return this.endVector();
  }
  /**
   * A helper function to pack an object
   *
   * @returns offset of obj
   */
  createObjectOffset(obj) {
    if (obj === null) {
      return 0;
    }
    if (typeof obj === "string") {
      return this.createString(obj);
    } else {
      return obj.pack(this);
    }
  }
  /**
   * A helper function to pack a list of object
   *
   * @returns list of offsets of each non null object
   */
  createObjectOffsetList(list) {
    const ret = [];
    for (let i = 0; i < list.length; ++i) {
      const val = list[i];
      if (val !== null) {
        ret.push(this.createObjectOffset(val));
      } else {
        throw new TypeError("FlatBuffers: Argument for createObjectOffsetList cannot contain null.");
      }
    }
    return ret;
  }
  createStructOffsetList(list, startFunc) {
    startFunc(this, list.length);
    this.createObjectOffsetList(list.slice().reverse());
    return this.endVector();
  }
};

// ../core/node_modules/apache-arrow/fb/body-compression-method.mjs
var BodyCompressionMethod;
(function(BodyCompressionMethod2) {
  BodyCompressionMethod2[BodyCompressionMethod2["BUFFER"] = 0] = "BUFFER";
})(BodyCompressionMethod || (BodyCompressionMethod = {}));

// ../core/node_modules/apache-arrow/fb/compression-type.mjs
var CompressionType;
(function(CompressionType2) {
  CompressionType2[CompressionType2["LZ4_FRAME"] = 0] = "LZ4_FRAME";
  CompressionType2[CompressionType2["ZSTD"] = 1] = "ZSTD";
})(CompressionType || (CompressionType = {}));

// ../core/node_modules/apache-arrow/fb/body-compression.mjs
var BodyCompression = class _BodyCompression {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsBodyCompression(bb, obj) {
    return (obj || new _BodyCompression()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsBodyCompression(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _BodyCompression()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  /**
   * Compressor library.
   * For LZ4_FRAME, each compressed buffer must consist of a single frame.
   */
  codec() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.readInt8(this.bb_pos + offset) : CompressionType.LZ4_FRAME;
  }
  /**
   * Indicates the way the record batch body was compressed
   */
  method() {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? this.bb.readInt8(this.bb_pos + offset) : BodyCompressionMethod.BUFFER;
  }
  static startBodyCompression(builder) {
    builder.startObject(2);
  }
  static addCodec(builder, codec) {
    builder.addFieldInt8(0, codec, CompressionType.LZ4_FRAME);
  }
  static addMethod(builder, method) {
    builder.addFieldInt8(1, method, BodyCompressionMethod.BUFFER);
  }
  static endBodyCompression(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createBodyCompression(builder, codec, method) {
    _BodyCompression.startBodyCompression(builder);
    _BodyCompression.addCodec(builder, codec);
    _BodyCompression.addMethod(builder, method);
    return _BodyCompression.endBodyCompression(builder);
  }
};

// ../core/node_modules/apache-arrow/fb/buffer.mjs
var Buffer2 = class {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  /**
   * The relative offset into the shared memory page where the bytes for this
   * buffer starts
   */
  offset() {
    return this.bb.readInt64(this.bb_pos);
  }
  /**
   * The absolute length (in bytes) of the memory buffer. The memory is found
   * from offset (inclusive) to offset + length (non-inclusive). When building
   * messages using the encapsulated IPC message, padding bytes may be written
   * after a buffer, but such padding bytes do not need to be accounted for in
   * the size here.
   */
  length() {
    return this.bb.readInt64(this.bb_pos + 8);
  }
  static sizeOf() {
    return 16;
  }
  static createBuffer(builder, offset, length2) {
    builder.prep(8, 16);
    builder.writeInt64(BigInt(length2 !== null && length2 !== void 0 ? length2 : 0));
    builder.writeInt64(BigInt(offset !== null && offset !== void 0 ? offset : 0));
    return builder.offset();
  }
};

// ../core/node_modules/apache-arrow/fb/field-node.mjs
var FieldNode = class {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  /**
   * The number of value slots in the Arrow array at this level of a nested
   * tree
   */
  length() {
    return this.bb.readInt64(this.bb_pos);
  }
  /**
   * The number of observed nulls. Fields with null_count == 0 may choose not
   * to write their physical validity bitmap out as a materialized buffer,
   * instead setting the length of the bitmap buffer to 0.
   */
  nullCount() {
    return this.bb.readInt64(this.bb_pos + 8);
  }
  static sizeOf() {
    return 16;
  }
  static createFieldNode(builder, length2, null_count) {
    builder.prep(8, 16);
    builder.writeInt64(BigInt(null_count !== null && null_count !== void 0 ? null_count : 0));
    builder.writeInt64(BigInt(length2 !== null && length2 !== void 0 ? length2 : 0));
    return builder.offset();
  }
};

// ../core/node_modules/apache-arrow/fb/record-batch.mjs
var RecordBatch = class _RecordBatch {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsRecordBatch(bb, obj) {
    return (obj || new _RecordBatch()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsRecordBatch(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _RecordBatch()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  /**
   * number of records / rows. The arrays in the batch should all have this
   * length
   */
  length() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.readInt64(this.bb_pos + offset) : BigInt("0");
  }
  /**
   * Nodes correspond to the pre-ordered flattened logical schema
   */
  nodes(index, obj) {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? (obj || new FieldNode()).__init(this.bb.__vector(this.bb_pos + offset) + index * 16, this.bb) : null;
  }
  nodesLength() {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
  }
  /**
   * Buffers correspond to the pre-ordered flattened buffer tree
   *
   * The number of buffers appended to this list depends on the schema. For
   * example, most primitive arrays will have 2 buffers, 1 for the validity
   * bitmap and 1 for the values. For struct arrays, there will only be a
   * single buffer for the validity (nulls) bitmap
   */
  buffers(index, obj) {
    const offset = this.bb.__offset(this.bb_pos, 8);
    return offset ? (obj || new Buffer2()).__init(this.bb.__vector(this.bb_pos + offset) + index * 16, this.bb) : null;
  }
  buffersLength() {
    const offset = this.bb.__offset(this.bb_pos, 8);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
  }
  /**
   * Optional compression of the message body
   */
  compression(obj) {
    const offset = this.bb.__offset(this.bb_pos, 10);
    return offset ? (obj || new BodyCompression()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
  }
  static startRecordBatch(builder) {
    builder.startObject(4);
  }
  static addLength(builder, length2) {
    builder.addFieldInt64(0, length2, BigInt("0"));
  }
  static addNodes(builder, nodesOffset) {
    builder.addFieldOffset(1, nodesOffset, 0);
  }
  static startNodesVector(builder, numElems) {
    builder.startVector(16, numElems, 8);
  }
  static addBuffers(builder, buffersOffset) {
    builder.addFieldOffset(2, buffersOffset, 0);
  }
  static startBuffersVector(builder, numElems) {
    builder.startVector(16, numElems, 8);
  }
  static addCompression(builder, compressionOffset) {
    builder.addFieldOffset(3, compressionOffset, 0);
  }
  static endRecordBatch(builder) {
    const offset = builder.endObject();
    return offset;
  }
};

// ../core/node_modules/apache-arrow/fb/dictionary-batch.mjs
var DictionaryBatch = class _DictionaryBatch {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsDictionaryBatch(bb, obj) {
    return (obj || new _DictionaryBatch()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsDictionaryBatch(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _DictionaryBatch()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  id() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.readInt64(this.bb_pos + offset) : BigInt("0");
  }
  data(obj) {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? (obj || new RecordBatch()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
  }
  /**
   * If isDelta is true the values in the dictionary are to be appended to a
   * dictionary with the indicated id. If isDelta is false this dictionary
   * should replace the existing dictionary.
   */
  isDelta() {
    const offset = this.bb.__offset(this.bb_pos, 8);
    return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
  }
  static startDictionaryBatch(builder) {
    builder.startObject(3);
  }
  static addId(builder, id) {
    builder.addFieldInt64(0, id, BigInt("0"));
  }
  static addData(builder, dataOffset) {
    builder.addFieldOffset(1, dataOffset, 0);
  }
  static addIsDelta(builder, isDelta) {
    builder.addFieldInt8(2, +isDelta, 0);
  }
  static endDictionaryBatch(builder) {
    const offset = builder.endObject();
    return offset;
  }
};

// ../core/node_modules/apache-arrow/fb/endianness.mjs
var Endianness;
(function(Endianness2) {
  Endianness2[Endianness2["Little"] = 0] = "Little";
  Endianness2[Endianness2["Big"] = 1] = "Big";
})(Endianness || (Endianness = {}));

// ../core/node_modules/apache-arrow/fb/dictionary-kind.mjs
var DictionaryKind;
(function(DictionaryKind2) {
  DictionaryKind2[DictionaryKind2["DenseArray"] = 0] = "DenseArray";
})(DictionaryKind || (DictionaryKind = {}));

// ../core/node_modules/apache-arrow/fb/int.mjs
var Int = class _Int {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsInt(bb, obj) {
    return (obj || new _Int()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsInt(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _Int()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  bitWidth() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
  }
  isSigned() {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
  }
  static startInt(builder) {
    builder.startObject(2);
  }
  static addBitWidth(builder, bitWidth) {
    builder.addFieldInt32(0, bitWidth, 0);
  }
  static addIsSigned(builder, isSigned) {
    builder.addFieldInt8(1, +isSigned, 0);
  }
  static endInt(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createInt(builder, bitWidth, isSigned) {
    _Int.startInt(builder);
    _Int.addBitWidth(builder, bitWidth);
    _Int.addIsSigned(builder, isSigned);
    return _Int.endInt(builder);
  }
};

// ../core/node_modules/apache-arrow/fb/dictionary-encoding.mjs
var DictionaryEncoding = class _DictionaryEncoding {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsDictionaryEncoding(bb, obj) {
    return (obj || new _DictionaryEncoding()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsDictionaryEncoding(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _DictionaryEncoding()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  /**
   * The known dictionary id in the application where this data is used. In
   * the file or streaming formats, the dictionary ids are found in the
   * DictionaryBatch messages
   */
  id() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.readInt64(this.bb_pos + offset) : BigInt("0");
  }
  /**
   * The dictionary indices are constrained to be non-negative integers. If
   * this field is null, the indices must be signed int32. To maximize
   * cross-language compatibility and performance, implementations are
   * recommended to prefer signed integer types over unsigned integer types
   * and to avoid uint64 indices unless they are required by an application.
   */
  indexType(obj) {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? (obj || new Int()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
  }
  /**
   * By default, dictionaries are not ordered, or the order does not have
   * semantic meaning. In some statistical, applications, dictionary-encoding
   * is used to represent ordered categorical data, and we provide a way to
   * preserve that metadata here
   */
  isOrdered() {
    const offset = this.bb.__offset(this.bb_pos, 8);
    return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
  }
  dictionaryKind() {
    const offset = this.bb.__offset(this.bb_pos, 10);
    return offset ? this.bb.readInt16(this.bb_pos + offset) : DictionaryKind.DenseArray;
  }
  static startDictionaryEncoding(builder) {
    builder.startObject(4);
  }
  static addId(builder, id) {
    builder.addFieldInt64(0, id, BigInt("0"));
  }
  static addIndexType(builder, indexTypeOffset) {
    builder.addFieldOffset(1, indexTypeOffset, 0);
  }
  static addIsOrdered(builder, isOrdered) {
    builder.addFieldInt8(2, +isOrdered, 0);
  }
  static addDictionaryKind(builder, dictionaryKind) {
    builder.addFieldInt16(3, dictionaryKind, DictionaryKind.DenseArray);
  }
  static endDictionaryEncoding(builder) {
    const offset = builder.endObject();
    return offset;
  }
};

// ../core/node_modules/apache-arrow/fb/key-value.mjs
var KeyValue = class _KeyValue {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsKeyValue(bb, obj) {
    return (obj || new _KeyValue()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsKeyValue(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _KeyValue()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  key(optionalEncoding) {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
  }
  value(optionalEncoding) {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
  }
  static startKeyValue(builder) {
    builder.startObject(2);
  }
  static addKey(builder, keyOffset) {
    builder.addFieldOffset(0, keyOffset, 0);
  }
  static addValue(builder, valueOffset) {
    builder.addFieldOffset(1, valueOffset, 0);
  }
  static endKeyValue(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createKeyValue(builder, keyOffset, valueOffset) {
    _KeyValue.startKeyValue(builder);
    _KeyValue.addKey(builder, keyOffset);
    _KeyValue.addValue(builder, valueOffset);
    return _KeyValue.endKeyValue(builder);
  }
};

// ../core/node_modules/apache-arrow/fb/binary.mjs
var Binary = class _Binary {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsBinary(bb, obj) {
    return (obj || new _Binary()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsBinary(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _Binary()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static startBinary(builder) {
    builder.startObject(0);
  }
  static endBinary(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createBinary(builder) {
    _Binary.startBinary(builder);
    return _Binary.endBinary(builder);
  }
};

// ../core/node_modules/apache-arrow/fb/bool.mjs
var Bool = class _Bool {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsBool(bb, obj) {
    return (obj || new _Bool()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsBool(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _Bool()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static startBool(builder) {
    builder.startObject(0);
  }
  static endBool(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createBool(builder) {
    _Bool.startBool(builder);
    return _Bool.endBool(builder);
  }
};

// ../core/node_modules/apache-arrow/fb/date.mjs
var Date2 = class _Date {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsDate(bb, obj) {
    return (obj || new _Date()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsDate(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _Date()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  unit() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.readInt16(this.bb_pos + offset) : DateUnit.MILLISECOND;
  }
  static startDate(builder) {
    builder.startObject(1);
  }
  static addUnit(builder, unit) {
    builder.addFieldInt16(0, unit, DateUnit.MILLISECOND);
  }
  static endDate(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createDate(builder, unit) {
    _Date.startDate(builder);
    _Date.addUnit(builder, unit);
    return _Date.endDate(builder);
  }
};

// ../core/node_modules/apache-arrow/fb/decimal.mjs
var Decimal = class _Decimal {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsDecimal(bb, obj) {
    return (obj || new _Decimal()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsDecimal(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _Decimal()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  /**
   * Total number of decimal digits
   */
  precision() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
  }
  /**
   * Number of digits after the decimal point "."
   */
  scale() {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
  }
  /**
   * Number of bits per value. The only accepted widths are 128 and 256.
   * We use bitWidth for consistency with Int::bitWidth.
   */
  bitWidth() {
    const offset = this.bb.__offset(this.bb_pos, 8);
    return offset ? this.bb.readInt32(this.bb_pos + offset) : 128;
  }
  static startDecimal(builder) {
    builder.startObject(3);
  }
  static addPrecision(builder, precision) {
    builder.addFieldInt32(0, precision, 0);
  }
  static addScale(builder, scale) {
    builder.addFieldInt32(1, scale, 0);
  }
  static addBitWidth(builder, bitWidth) {
    builder.addFieldInt32(2, bitWidth, 128);
  }
  static endDecimal(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createDecimal(builder, precision, scale, bitWidth) {
    _Decimal.startDecimal(builder);
    _Decimal.addPrecision(builder, precision);
    _Decimal.addScale(builder, scale);
    _Decimal.addBitWidth(builder, bitWidth);
    return _Decimal.endDecimal(builder);
  }
};

// ../core/node_modules/apache-arrow/fb/duration.mjs
var Duration = class _Duration {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsDuration(bb, obj) {
    return (obj || new _Duration()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsDuration(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _Duration()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  unit() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.readInt16(this.bb_pos + offset) : TimeUnit.MILLISECOND;
  }
  static startDuration(builder) {
    builder.startObject(1);
  }
  static addUnit(builder, unit) {
    builder.addFieldInt16(0, unit, TimeUnit.MILLISECOND);
  }
  static endDuration(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createDuration(builder, unit) {
    _Duration.startDuration(builder);
    _Duration.addUnit(builder, unit);
    return _Duration.endDuration(builder);
  }
};

// ../core/node_modules/apache-arrow/fb/fixed-size-binary.mjs
var FixedSizeBinary = class _FixedSizeBinary {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsFixedSizeBinary(bb, obj) {
    return (obj || new _FixedSizeBinary()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsFixedSizeBinary(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _FixedSizeBinary()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  /**
   * Number of bytes per value
   */
  byteWidth() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
  }
  static startFixedSizeBinary(builder) {
    builder.startObject(1);
  }
  static addByteWidth(builder, byteWidth) {
    builder.addFieldInt32(0, byteWidth, 0);
  }
  static endFixedSizeBinary(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createFixedSizeBinary(builder, byteWidth) {
    _FixedSizeBinary.startFixedSizeBinary(builder);
    _FixedSizeBinary.addByteWidth(builder, byteWidth);
    return _FixedSizeBinary.endFixedSizeBinary(builder);
  }
};

// ../core/node_modules/apache-arrow/fb/fixed-size-list.mjs
var FixedSizeList = class _FixedSizeList {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsFixedSizeList(bb, obj) {
    return (obj || new _FixedSizeList()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsFixedSizeList(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _FixedSizeList()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  /**
   * Number of list items per value
   */
  listSize() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
  }
  static startFixedSizeList(builder) {
    builder.startObject(1);
  }
  static addListSize(builder, listSize) {
    builder.addFieldInt32(0, listSize, 0);
  }
  static endFixedSizeList(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createFixedSizeList(builder, listSize) {
    _FixedSizeList.startFixedSizeList(builder);
    _FixedSizeList.addListSize(builder, listSize);
    return _FixedSizeList.endFixedSizeList(builder);
  }
};

// ../core/node_modules/apache-arrow/fb/floating-point.mjs
var FloatingPoint = class _FloatingPoint {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsFloatingPoint(bb, obj) {
    return (obj || new _FloatingPoint()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsFloatingPoint(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _FloatingPoint()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  precision() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.readInt16(this.bb_pos + offset) : Precision.HALF;
  }
  static startFloatingPoint(builder) {
    builder.startObject(1);
  }
  static addPrecision(builder, precision) {
    builder.addFieldInt16(0, precision, Precision.HALF);
  }
  static endFloatingPoint(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createFloatingPoint(builder, precision) {
    _FloatingPoint.startFloatingPoint(builder);
    _FloatingPoint.addPrecision(builder, precision);
    return _FloatingPoint.endFloatingPoint(builder);
  }
};

// ../core/node_modules/apache-arrow/fb/interval.mjs
var Interval = class _Interval {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsInterval(bb, obj) {
    return (obj || new _Interval()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsInterval(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _Interval()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  unit() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.readInt16(this.bb_pos + offset) : IntervalUnit.YEAR_MONTH;
  }
  static startInterval(builder) {
    builder.startObject(1);
  }
  static addUnit(builder, unit) {
    builder.addFieldInt16(0, unit, IntervalUnit.YEAR_MONTH);
  }
  static endInterval(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createInterval(builder, unit) {
    _Interval.startInterval(builder);
    _Interval.addUnit(builder, unit);
    return _Interval.endInterval(builder);
  }
};

// ../core/node_modules/apache-arrow/fb/large-binary.mjs
var LargeBinary = class _LargeBinary {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsLargeBinary(bb, obj) {
    return (obj || new _LargeBinary()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsLargeBinary(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _LargeBinary()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static startLargeBinary(builder) {
    builder.startObject(0);
  }
  static endLargeBinary(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createLargeBinary(builder) {
    _LargeBinary.startLargeBinary(builder);
    return _LargeBinary.endLargeBinary(builder);
  }
};

// ../core/node_modules/apache-arrow/fb/large-utf8.mjs
var LargeUtf8 = class _LargeUtf8 {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsLargeUtf8(bb, obj) {
    return (obj || new _LargeUtf8()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsLargeUtf8(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _LargeUtf8()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static startLargeUtf8(builder) {
    builder.startObject(0);
  }
  static endLargeUtf8(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createLargeUtf8(builder) {
    _LargeUtf8.startLargeUtf8(builder);
    return _LargeUtf8.endLargeUtf8(builder);
  }
};

// ../core/node_modules/apache-arrow/fb/list.mjs
var List = class _List {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsList(bb, obj) {
    return (obj || new _List()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsList(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _List()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static startList(builder) {
    builder.startObject(0);
  }
  static endList(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createList(builder) {
    _List.startList(builder);
    return _List.endList(builder);
  }
};

// ../core/node_modules/apache-arrow/fb/map.mjs
var Map2 = class _Map {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsMap(bb, obj) {
    return (obj || new _Map()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsMap(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _Map()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  /**
   * Set to true if the keys within each value are sorted
   */
  keysSorted() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
  }
  static startMap(builder) {
    builder.startObject(1);
  }
  static addKeysSorted(builder, keysSorted) {
    builder.addFieldInt8(0, +keysSorted, 0);
  }
  static endMap(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createMap(builder, keysSorted) {
    _Map.startMap(builder);
    _Map.addKeysSorted(builder, keysSorted);
    return _Map.endMap(builder);
  }
};

// ../core/node_modules/apache-arrow/fb/null.mjs
var Null = class _Null {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsNull(bb, obj) {
    return (obj || new _Null()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsNull(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _Null()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static startNull(builder) {
    builder.startObject(0);
  }
  static endNull(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createNull(builder) {
    _Null.startNull(builder);
    return _Null.endNull(builder);
  }
};

// ../core/node_modules/apache-arrow/fb/struct-.mjs
var Struct_ = class _Struct_ {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsStruct_(bb, obj) {
    return (obj || new _Struct_()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsStruct_(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _Struct_()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static startStruct_(builder) {
    builder.startObject(0);
  }
  static endStruct_(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createStruct_(builder) {
    _Struct_.startStruct_(builder);
    return _Struct_.endStruct_(builder);
  }
};

// ../core/node_modules/apache-arrow/fb/time.mjs
var Time = class _Time {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsTime(bb, obj) {
    return (obj || new _Time()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsTime(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _Time()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  unit() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.readInt16(this.bb_pos + offset) : TimeUnit.MILLISECOND;
  }
  bitWidth() {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? this.bb.readInt32(this.bb_pos + offset) : 32;
  }
  static startTime(builder) {
    builder.startObject(2);
  }
  static addUnit(builder, unit) {
    builder.addFieldInt16(0, unit, TimeUnit.MILLISECOND);
  }
  static addBitWidth(builder, bitWidth) {
    builder.addFieldInt32(1, bitWidth, 32);
  }
  static endTime(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createTime(builder, unit, bitWidth) {
    _Time.startTime(builder);
    _Time.addUnit(builder, unit);
    _Time.addBitWidth(builder, bitWidth);
    return _Time.endTime(builder);
  }
};

// ../core/node_modules/apache-arrow/fb/timestamp.mjs
var Timestamp = class _Timestamp {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsTimestamp(bb, obj) {
    return (obj || new _Timestamp()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsTimestamp(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _Timestamp()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  unit() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.readInt16(this.bb_pos + offset) : TimeUnit.SECOND;
  }
  timezone(optionalEncoding) {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
  }
  static startTimestamp(builder) {
    builder.startObject(2);
  }
  static addUnit(builder, unit) {
    builder.addFieldInt16(0, unit, TimeUnit.SECOND);
  }
  static addTimezone(builder, timezoneOffset) {
    builder.addFieldOffset(1, timezoneOffset, 0);
  }
  static endTimestamp(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createTimestamp(builder, unit, timezoneOffset) {
    _Timestamp.startTimestamp(builder);
    _Timestamp.addUnit(builder, unit);
    _Timestamp.addTimezone(builder, timezoneOffset);
    return _Timestamp.endTimestamp(builder);
  }
};

// ../core/node_modules/apache-arrow/fb/union.mjs
var Union = class _Union {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsUnion(bb, obj) {
    return (obj || new _Union()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsUnion(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _Union()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  mode() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.readInt16(this.bb_pos + offset) : UnionMode.Sparse;
  }
  typeIds(index) {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? this.bb.readInt32(this.bb.__vector(this.bb_pos + offset) + index * 4) : 0;
  }
  typeIdsLength() {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
  }
  typeIdsArray() {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? new Int32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
  }
  static startUnion(builder) {
    builder.startObject(2);
  }
  static addMode(builder, mode2) {
    builder.addFieldInt16(0, mode2, UnionMode.Sparse);
  }
  static addTypeIds(builder, typeIdsOffset) {
    builder.addFieldOffset(1, typeIdsOffset, 0);
  }
  static createTypeIdsVector(builder, data) {
    builder.startVector(4, data.length, 4);
    for (let i = data.length - 1; i >= 0; i--) {
      builder.addInt32(data[i]);
    }
    return builder.endVector();
  }
  static startTypeIdsVector(builder, numElems) {
    builder.startVector(4, numElems, 4);
  }
  static endUnion(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createUnion(builder, mode2, typeIdsOffset) {
    _Union.startUnion(builder);
    _Union.addMode(builder, mode2);
    _Union.addTypeIds(builder, typeIdsOffset);
    return _Union.endUnion(builder);
  }
};

// ../core/node_modules/apache-arrow/fb/utf8.mjs
var Utf8 = class _Utf8 {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsUtf8(bb, obj) {
    return (obj || new _Utf8()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsUtf8(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _Utf8()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static startUtf8(builder) {
    builder.startObject(0);
  }
  static endUtf8(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static createUtf8(builder) {
    _Utf8.startUtf8(builder);
    return _Utf8.endUtf8(builder);
  }
};

// ../core/node_modules/apache-arrow/fb/type.mjs
var Type;
(function(Type3) {
  Type3[Type3["NONE"] = 0] = "NONE";
  Type3[Type3["Null"] = 1] = "Null";
  Type3[Type3["Int"] = 2] = "Int";
  Type3[Type3["FloatingPoint"] = 3] = "FloatingPoint";
  Type3[Type3["Binary"] = 4] = "Binary";
  Type3[Type3["Utf8"] = 5] = "Utf8";
  Type3[Type3["Bool"] = 6] = "Bool";
  Type3[Type3["Decimal"] = 7] = "Decimal";
  Type3[Type3["Date"] = 8] = "Date";
  Type3[Type3["Time"] = 9] = "Time";
  Type3[Type3["Timestamp"] = 10] = "Timestamp";
  Type3[Type3["Interval"] = 11] = "Interval";
  Type3[Type3["List"] = 12] = "List";
  Type3[Type3["Struct_"] = 13] = "Struct_";
  Type3[Type3["Union"] = 14] = "Union";
  Type3[Type3["FixedSizeBinary"] = 15] = "FixedSizeBinary";
  Type3[Type3["FixedSizeList"] = 16] = "FixedSizeList";
  Type3[Type3["Map"] = 17] = "Map";
  Type3[Type3["Duration"] = 18] = "Duration";
  Type3[Type3["LargeBinary"] = 19] = "LargeBinary";
  Type3[Type3["LargeUtf8"] = 20] = "LargeUtf8";
  Type3[Type3["LargeList"] = 21] = "LargeList";
  Type3[Type3["RunEndEncoded"] = 22] = "RunEndEncoded";
})(Type || (Type = {}));

// ../core/node_modules/apache-arrow/fb/field.mjs
var Field = class _Field {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsField(bb, obj) {
    return (obj || new _Field()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsField(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _Field()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  name(optionalEncoding) {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
  }
  /**
   * Whether or not this field can contain nulls. Should be true in general.
   */
  nullable() {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false;
  }
  typeType() {
    const offset = this.bb.__offset(this.bb_pos, 8);
    return offset ? this.bb.readUint8(this.bb_pos + offset) : Type.NONE;
  }
  /**
   * This is the type of the decoded value if the field is dictionary encoded.
   */
  type(obj) {
    const offset = this.bb.__offset(this.bb_pos, 10);
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null;
  }
  /**
   * Present only if the field is dictionary encoded.
   */
  dictionary(obj) {
    const offset = this.bb.__offset(this.bb_pos, 12);
    return offset ? (obj || new DictionaryEncoding()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
  }
  /**
   * children apply only to nested data types like Struct, List and Union. For
   * primitive types children will have length 0.
   */
  children(index, obj) {
    const offset = this.bb.__offset(this.bb_pos, 14);
    return offset ? (obj || new _Field()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
  }
  childrenLength() {
    const offset = this.bb.__offset(this.bb_pos, 14);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
  }
  /**
   * User-defined metadata
   */
  customMetadata(index, obj) {
    const offset = this.bb.__offset(this.bb_pos, 16);
    return offset ? (obj || new KeyValue()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
  }
  customMetadataLength() {
    const offset = this.bb.__offset(this.bb_pos, 16);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
  }
  static startField(builder) {
    builder.startObject(7);
  }
  static addName(builder, nameOffset) {
    builder.addFieldOffset(0, nameOffset, 0);
  }
  static addNullable(builder, nullable) {
    builder.addFieldInt8(1, +nullable, 0);
  }
  static addTypeType(builder, typeType) {
    builder.addFieldInt8(2, typeType, Type.NONE);
  }
  static addType(builder, typeOffset) {
    builder.addFieldOffset(3, typeOffset, 0);
  }
  static addDictionary(builder, dictionaryOffset) {
    builder.addFieldOffset(4, dictionaryOffset, 0);
  }
  static addChildren(builder, childrenOffset) {
    builder.addFieldOffset(5, childrenOffset, 0);
  }
  static createChildrenVector(builder, data) {
    builder.startVector(4, data.length, 4);
    for (let i = data.length - 1; i >= 0; i--) {
      builder.addOffset(data[i]);
    }
    return builder.endVector();
  }
  static startChildrenVector(builder, numElems) {
    builder.startVector(4, numElems, 4);
  }
  static addCustomMetadata(builder, customMetadataOffset) {
    builder.addFieldOffset(6, customMetadataOffset, 0);
  }
  static createCustomMetadataVector(builder, data) {
    builder.startVector(4, data.length, 4);
    for (let i = data.length - 1; i >= 0; i--) {
      builder.addOffset(data[i]);
    }
    return builder.endVector();
  }
  static startCustomMetadataVector(builder, numElems) {
    builder.startVector(4, numElems, 4);
  }
  static endField(builder) {
    const offset = builder.endObject();
    return offset;
  }
};

// ../core/node_modules/apache-arrow/fb/schema.mjs
var Schema = class _Schema {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsSchema(bb, obj) {
    return (obj || new _Schema()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsSchema(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _Schema()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  /**
   * endianness of the buffer
   * it is Little Endian by default
   * if endianness doesn't match the underlying system then the vectors need to be converted
   */
  endianness() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.readInt16(this.bb_pos + offset) : Endianness.Little;
  }
  fields(index, obj) {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? (obj || new Field()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
  }
  fieldsLength() {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
  }
  customMetadata(index, obj) {
    const offset = this.bb.__offset(this.bb_pos, 8);
    return offset ? (obj || new KeyValue()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
  }
  customMetadataLength() {
    const offset = this.bb.__offset(this.bb_pos, 8);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
  }
  /**
   * Features used in the stream/file.
   */
  features(index) {
    const offset = this.bb.__offset(this.bb_pos, 10);
    return offset ? this.bb.readInt64(this.bb.__vector(this.bb_pos + offset) + index * 8) : BigInt(0);
  }
  featuresLength() {
    const offset = this.bb.__offset(this.bb_pos, 10);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
  }
  static startSchema(builder) {
    builder.startObject(4);
  }
  static addEndianness(builder, endianness) {
    builder.addFieldInt16(0, endianness, Endianness.Little);
  }
  static addFields(builder, fieldsOffset) {
    builder.addFieldOffset(1, fieldsOffset, 0);
  }
  static createFieldsVector(builder, data) {
    builder.startVector(4, data.length, 4);
    for (let i = data.length - 1; i >= 0; i--) {
      builder.addOffset(data[i]);
    }
    return builder.endVector();
  }
  static startFieldsVector(builder, numElems) {
    builder.startVector(4, numElems, 4);
  }
  static addCustomMetadata(builder, customMetadataOffset) {
    builder.addFieldOffset(2, customMetadataOffset, 0);
  }
  static createCustomMetadataVector(builder, data) {
    builder.startVector(4, data.length, 4);
    for (let i = data.length - 1; i >= 0; i--) {
      builder.addOffset(data[i]);
    }
    return builder.endVector();
  }
  static startCustomMetadataVector(builder, numElems) {
    builder.startVector(4, numElems, 4);
  }
  static addFeatures(builder, featuresOffset) {
    builder.addFieldOffset(3, featuresOffset, 0);
  }
  static createFeaturesVector(builder, data) {
    builder.startVector(8, data.length, 8);
    for (let i = data.length - 1; i >= 0; i--) {
      builder.addInt64(data[i]);
    }
    return builder.endVector();
  }
  static startFeaturesVector(builder, numElems) {
    builder.startVector(8, numElems, 8);
  }
  static endSchema(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static finishSchemaBuffer(builder, offset) {
    builder.finish(offset);
  }
  static finishSizePrefixedSchemaBuffer(builder, offset) {
    builder.finish(offset, void 0, true);
  }
  static createSchema(builder, endianness, fieldsOffset, customMetadataOffset, featuresOffset) {
    _Schema.startSchema(builder);
    _Schema.addEndianness(builder, endianness);
    _Schema.addFields(builder, fieldsOffset);
    _Schema.addCustomMetadata(builder, customMetadataOffset);
    _Schema.addFeatures(builder, featuresOffset);
    return _Schema.endSchema(builder);
  }
};

// ../core/node_modules/apache-arrow/fb/message-header.mjs
var MessageHeader;
(function(MessageHeader2) {
  MessageHeader2[MessageHeader2["NONE"] = 0] = "NONE";
  MessageHeader2[MessageHeader2["Schema"] = 1] = "Schema";
  MessageHeader2[MessageHeader2["DictionaryBatch"] = 2] = "DictionaryBatch";
  MessageHeader2[MessageHeader2["RecordBatch"] = 3] = "RecordBatch";
  MessageHeader2[MessageHeader2["Tensor"] = 4] = "Tensor";
  MessageHeader2[MessageHeader2["SparseTensor"] = 5] = "SparseTensor";
})(MessageHeader || (MessageHeader = {}));

// ../core/node_modules/apache-arrow/enum.mjs
var Type2;
(function(Type3) {
  Type3[Type3["NONE"] = 0] = "NONE";
  Type3[Type3["Null"] = 1] = "Null";
  Type3[Type3["Int"] = 2] = "Int";
  Type3[Type3["Float"] = 3] = "Float";
  Type3[Type3["Binary"] = 4] = "Binary";
  Type3[Type3["Utf8"] = 5] = "Utf8";
  Type3[Type3["Bool"] = 6] = "Bool";
  Type3[Type3["Decimal"] = 7] = "Decimal";
  Type3[Type3["Date"] = 8] = "Date";
  Type3[Type3["Time"] = 9] = "Time";
  Type3[Type3["Timestamp"] = 10] = "Timestamp";
  Type3[Type3["Interval"] = 11] = "Interval";
  Type3[Type3["List"] = 12] = "List";
  Type3[Type3["Struct"] = 13] = "Struct";
  Type3[Type3["Union"] = 14] = "Union";
  Type3[Type3["FixedSizeBinary"] = 15] = "FixedSizeBinary";
  Type3[Type3["FixedSizeList"] = 16] = "FixedSizeList";
  Type3[Type3["Map"] = 17] = "Map";
  Type3[Type3["Duration"] = 18] = "Duration";
  Type3[Type3["LargeBinary"] = 19] = "LargeBinary";
  Type3[Type3["LargeUtf8"] = 20] = "LargeUtf8";
  Type3[Type3["Dictionary"] = -1] = "Dictionary";
  Type3[Type3["Int8"] = -2] = "Int8";
  Type3[Type3["Int16"] = -3] = "Int16";
  Type3[Type3["Int32"] = -4] = "Int32";
  Type3[Type3["Int64"] = -5] = "Int64";
  Type3[Type3["Uint8"] = -6] = "Uint8";
  Type3[Type3["Uint16"] = -7] = "Uint16";
  Type3[Type3["Uint32"] = -8] = "Uint32";
  Type3[Type3["Uint64"] = -9] = "Uint64";
  Type3[Type3["Float16"] = -10] = "Float16";
  Type3[Type3["Float32"] = -11] = "Float32";
  Type3[Type3["Float64"] = -12] = "Float64";
  Type3[Type3["DateDay"] = -13] = "DateDay";
  Type3[Type3["DateMillisecond"] = -14] = "DateMillisecond";
  Type3[Type3["TimestampSecond"] = -15] = "TimestampSecond";
  Type3[Type3["TimestampMillisecond"] = -16] = "TimestampMillisecond";
  Type3[Type3["TimestampMicrosecond"] = -17] = "TimestampMicrosecond";
  Type3[Type3["TimestampNanosecond"] = -18] = "TimestampNanosecond";
  Type3[Type3["TimeSecond"] = -19] = "TimeSecond";
  Type3[Type3["TimeMillisecond"] = -20] = "TimeMillisecond";
  Type3[Type3["TimeMicrosecond"] = -21] = "TimeMicrosecond";
  Type3[Type3["TimeNanosecond"] = -22] = "TimeNanosecond";
  Type3[Type3["DenseUnion"] = -23] = "DenseUnion";
  Type3[Type3["SparseUnion"] = -24] = "SparseUnion";
  Type3[Type3["IntervalDayTime"] = -25] = "IntervalDayTime";
  Type3[Type3["IntervalYearMonth"] = -26] = "IntervalYearMonth";
  Type3[Type3["DurationSecond"] = -27] = "DurationSecond";
  Type3[Type3["DurationMillisecond"] = -28] = "DurationMillisecond";
  Type3[Type3["DurationMicrosecond"] = -29] = "DurationMicrosecond";
  Type3[Type3["DurationNanosecond"] = -30] = "DurationNanosecond";
})(Type2 || (Type2 = {}));
var BufferType;
(function(BufferType2) {
  BufferType2[BufferType2["OFFSET"] = 0] = "OFFSET";
  BufferType2[BufferType2["DATA"] = 1] = "DATA";
  BufferType2[BufferType2["VALIDITY"] = 2] = "VALIDITY";
  BufferType2[BufferType2["TYPE"] = 3] = "TYPE";
})(BufferType || (BufferType = {}));

// ../core/node_modules/apache-arrow/util/vector.mjs
var vector_exports = {};
__export(vector_exports, {
  clampIndex: () => clampIndex,
  clampRange: () => clampRange,
  createElementComparator: () => createElementComparator
});

// ../core/node_modules/apache-arrow/util/pretty.mjs
var pretty_exports = {};
__export(pretty_exports, {
  valueToString: () => valueToString
});
var undf = void 0;
function valueToString(x2) {
  if (x2 === null) {
    return "null";
  }
  if (x2 === undf) {
    return "undefined";
  }
  switch (typeof x2) {
    case "number":
      return `${x2}`;
    case "bigint":
      return `${x2}`;
    case "string":
      return `"${x2}"`;
  }
  if (typeof x2[Symbol.toPrimitive] === "function") {
    return x2[Symbol.toPrimitive]("string");
  }
  if (ArrayBuffer.isView(x2)) {
    if (x2 instanceof BigInt64Array || x2 instanceof BigUint64Array) {
      return `[${[...x2].map((x3) => valueToString(x3))}]`;
    }
    return `[${x2}]`;
  }
  return ArrayBuffer.isView(x2) ? `[${x2}]` : JSON.stringify(x2, (_, y2) => typeof y2 === "bigint" ? `${y2}` : y2);
}

// ../core/node_modules/apache-arrow/util/bn.mjs
var bn_exports = {};
__export(bn_exports, {
  BN: () => BN,
  bigNumToBigInt: () => bigNumToBigInt,
  bigNumToString: () => bigNumToString,
  isArrowBigNumSymbol: () => isArrowBigNumSymbol
});
var isArrowBigNumSymbol = Symbol.for("isArrowBigNum");
function BigNum(x2, ...xs) {
  if (xs.length === 0) {
    return Object.setPrototypeOf(toArrayBufferView(this["TypedArray"], x2), this.constructor.prototype);
  }
  return Object.setPrototypeOf(new this["TypedArray"](x2, ...xs), this.constructor.prototype);
}
BigNum.prototype[isArrowBigNumSymbol] = true;
BigNum.prototype.toJSON = function() {
  return `"${bigNumToString(this)}"`;
};
BigNum.prototype.valueOf = function() {
  return bigNumToNumber(this);
};
BigNum.prototype.toString = function() {
  return bigNumToString(this);
};
BigNum.prototype[Symbol.toPrimitive] = function(hint = "default") {
  switch (hint) {
    case "number":
      return bigNumToNumber(this);
    case "string":
      return bigNumToString(this);
    case "default":
      return bigNumToBigInt(this);
  }
  return bigNumToString(this);
};
function SignedBigNum(...args) {
  return BigNum.apply(this, args);
}
function UnsignedBigNum(...args) {
  return BigNum.apply(this, args);
}
function DecimalBigNum(...args) {
  return BigNum.apply(this, args);
}
Object.setPrototypeOf(SignedBigNum.prototype, Object.create(Int32Array.prototype));
Object.setPrototypeOf(UnsignedBigNum.prototype, Object.create(Uint32Array.prototype));
Object.setPrototypeOf(DecimalBigNum.prototype, Object.create(Uint32Array.prototype));
Object.assign(SignedBigNum.prototype, BigNum.prototype, { "constructor": SignedBigNum, "signed": true, "TypedArray": Int32Array, "BigIntArray": BigInt64Array });
Object.assign(UnsignedBigNum.prototype, BigNum.prototype, { "constructor": UnsignedBigNum, "signed": false, "TypedArray": Uint32Array, "BigIntArray": BigUint64Array });
Object.assign(DecimalBigNum.prototype, BigNum.prototype, { "constructor": DecimalBigNum, "signed": true, "TypedArray": Uint32Array, "BigIntArray": BigUint64Array });
function bigNumToNumber(bn) {
  const { buffer, byteOffset, length: length2, "signed": signed } = bn;
  const words = new BigUint64Array(buffer, byteOffset, length2);
  const negative = signed && words.at(-1) & BigInt(1) << BigInt(63);
  let number = negative ? BigInt(1) : BigInt(0);
  let i = BigInt(0);
  if (!negative) {
    for (const word of words) {
      number += word * (BigInt(1) << BigInt(32) * i++);
    }
  } else {
    for (const word of words) {
      number += ~word * (BigInt(1) << BigInt(32) * i++);
    }
    number *= BigInt(-1);
  }
  return number;
}
var bigNumToString = (a) => {
  if (a.byteLength === 8) {
    const bigIntArray = new a["BigIntArray"](a.buffer, a.byteOffset, 1);
    return `${bigIntArray[0]}`;
  }
  if (!a["signed"]) {
    return unsignedBigNumToString(a);
  }
  let array = new Uint16Array(a.buffer, a.byteOffset, a.byteLength / 2);
  const highOrderWord = new Int16Array([array.at(-1)])[0];
  if (highOrderWord >= 0) {
    return unsignedBigNumToString(a);
  }
  array = array.slice();
  let carry = 1;
  for (let i = 0; i < array.length; i++) {
    const elem = array[i];
    const updated = ~elem + carry;
    array[i] = updated;
    carry &= elem === 0 ? 1 : 0;
  }
  const negated = unsignedBigNumToString(array);
  return `-${negated}`;
};
var bigNumToBigInt = (a) => {
  if (a.byteLength === 8) {
    const bigIntArray = new a["BigIntArray"](a.buffer, a.byteOffset, 1);
    return bigIntArray[0];
  } else {
    return bigNumToString(a);
  }
};
function unsignedBigNumToString(a) {
  let digits = "";
  const base64 = new Uint32Array(2);
  let base32 = new Uint16Array(a.buffer, a.byteOffset, a.byteLength / 2);
  const checks = new Uint32Array((base32 = new Uint16Array(base32).reverse()).buffer);
  let i = -1;
  const n = base32.length - 1;
  do {
    for (base64[0] = base32[i = 0]; i < n; ) {
      base32[i++] = base64[1] = base64[0] / 10;
      base64[0] = (base64[0] - base64[1] * 10 << 16) + base32[i];
    }
    base32[i] = base64[1] = base64[0] / 10;
    base64[0] = base64[0] - base64[1] * 10;
    digits = `${base64[0]}${digits}`;
  } while (checks[0] || checks[1] || checks[2] || checks[3]);
  return digits !== null && digits !== void 0 ? digits : `0`;
}
var BN = class _BN {
  /** @nocollapse */
  static new(num, isSigned) {
    switch (isSigned) {
      case true:
        return new SignedBigNum(num);
      case false:
        return new UnsignedBigNum(num);
    }
    switch (num.constructor) {
      case Int8Array:
      case Int16Array:
      case Int32Array:
      case BigInt64Array:
        return new SignedBigNum(num);
    }
    if (num.byteLength === 16) {
      return new DecimalBigNum(num);
    }
    return new UnsignedBigNum(num);
  }
  /** @nocollapse */
  static signed(num) {
    return new SignedBigNum(num);
  }
  /** @nocollapse */
  static unsigned(num) {
    return new UnsignedBigNum(num);
  }
  /** @nocollapse */
  static decimal(num) {
    return new DecimalBigNum(num);
  }
  constructor(num, isSigned) {
    return _BN.new(num, isSigned);
  }
};

// ../core/node_modules/apache-arrow/util/bigint.mjs
function bigIntToNumber(number) {
  if (typeof number === "bigint" && (number < Number.MIN_SAFE_INTEGER || number > Number.MAX_SAFE_INTEGER)) {
    throw new TypeError(`${number} is not safe to convert to a number.`);
  }
  return Number(number);
}

// ../core/node_modules/apache-arrow/type.mjs
var _a;
var _b;
var _c;
var _d;
var _e;
var _f;
var _g;
var _h;
var _j;
var _k;
var _l;
var _m;
var _o;
var _p;
var _q;
var _r;
var _s;
var _t;
var _u;
var _v;
var _w;
var _x;
var DataType = class _DataType {
  /** @nocollapse */
  static isNull(x2) {
    return (x2 === null || x2 === void 0 ? void 0 : x2.typeId) === Type2.Null;
  }
  /** @nocollapse */
  static isInt(x2) {
    return (x2 === null || x2 === void 0 ? void 0 : x2.typeId) === Type2.Int;
  }
  /** @nocollapse */
  static isFloat(x2) {
    return (x2 === null || x2 === void 0 ? void 0 : x2.typeId) === Type2.Float;
  }
  /** @nocollapse */
  static isBinary(x2) {
    return (x2 === null || x2 === void 0 ? void 0 : x2.typeId) === Type2.Binary;
  }
  /** @nocollapse */
  static isLargeBinary(x2) {
    return (x2 === null || x2 === void 0 ? void 0 : x2.typeId) === Type2.LargeBinary;
  }
  /** @nocollapse */
  static isUtf8(x2) {
    return (x2 === null || x2 === void 0 ? void 0 : x2.typeId) === Type2.Utf8;
  }
  /** @nocollapse */
  static isLargeUtf8(x2) {
    return (x2 === null || x2 === void 0 ? void 0 : x2.typeId) === Type2.LargeUtf8;
  }
  /** @nocollapse */
  static isBool(x2) {
    return (x2 === null || x2 === void 0 ? void 0 : x2.typeId) === Type2.Bool;
  }
  /** @nocollapse */
  static isDecimal(x2) {
    return (x2 === null || x2 === void 0 ? void 0 : x2.typeId) === Type2.Decimal;
  }
  /** @nocollapse */
  static isDate(x2) {
    return (x2 === null || x2 === void 0 ? void 0 : x2.typeId) === Type2.Date;
  }
  /** @nocollapse */
  static isTime(x2) {
    return (x2 === null || x2 === void 0 ? void 0 : x2.typeId) === Type2.Time;
  }
  /** @nocollapse */
  static isTimestamp(x2) {
    return (x2 === null || x2 === void 0 ? void 0 : x2.typeId) === Type2.Timestamp;
  }
  /** @nocollapse */
  static isInterval(x2) {
    return (x2 === null || x2 === void 0 ? void 0 : x2.typeId) === Type2.Interval;
  }
  /** @nocollapse */
  static isDuration(x2) {
    return (x2 === null || x2 === void 0 ? void 0 : x2.typeId) === Type2.Duration;
  }
  /** @nocollapse */
  static isList(x2) {
    return (x2 === null || x2 === void 0 ? void 0 : x2.typeId) === Type2.List;
  }
  /** @nocollapse */
  static isStruct(x2) {
    return (x2 === null || x2 === void 0 ? void 0 : x2.typeId) === Type2.Struct;
  }
  /** @nocollapse */
  static isUnion(x2) {
    return (x2 === null || x2 === void 0 ? void 0 : x2.typeId) === Type2.Union;
  }
  /** @nocollapse */
  static isFixedSizeBinary(x2) {
    return (x2 === null || x2 === void 0 ? void 0 : x2.typeId) === Type2.FixedSizeBinary;
  }
  /** @nocollapse */
  static isFixedSizeList(x2) {
    return (x2 === null || x2 === void 0 ? void 0 : x2.typeId) === Type2.FixedSizeList;
  }
  /** @nocollapse */
  static isMap(x2) {
    return (x2 === null || x2 === void 0 ? void 0 : x2.typeId) === Type2.Map;
  }
  /** @nocollapse */
  static isDictionary(x2) {
    return (x2 === null || x2 === void 0 ? void 0 : x2.typeId) === Type2.Dictionary;
  }
  /** @nocollapse */
  static isDenseUnion(x2) {
    return _DataType.isUnion(x2) && x2.mode === UnionMode.Dense;
  }
  /** @nocollapse */
  static isSparseUnion(x2) {
    return _DataType.isUnion(x2) && x2.mode === UnionMode.Sparse;
  }
  constructor(typeId) {
    this.typeId = typeId;
  }
};
_a = Symbol.toStringTag;
DataType[_a] = ((proto) => {
  proto.children = null;
  proto.ArrayType = Array;
  proto.OffsetArrayType = Int32Array;
  return proto[Symbol.toStringTag] = "DataType";
})(DataType.prototype);
var Null2 = class extends DataType {
  constructor() {
    super(Type2.Null);
  }
  toString() {
    return `Null`;
  }
};
_b = Symbol.toStringTag;
Null2[_b] = ((proto) => proto[Symbol.toStringTag] = "Null")(Null2.prototype);
var Int_ = class extends DataType {
  constructor(isSigned, bitWidth) {
    super(Type2.Int);
    this.isSigned = isSigned;
    this.bitWidth = bitWidth;
  }
  get ArrayType() {
    switch (this.bitWidth) {
      case 8:
        return this.isSigned ? Int8Array : Uint8Array;
      case 16:
        return this.isSigned ? Int16Array : Uint16Array;
      case 32:
        return this.isSigned ? Int32Array : Uint32Array;
      case 64:
        return this.isSigned ? BigInt64Array : BigUint64Array;
    }
    throw new Error(`Unrecognized ${this[Symbol.toStringTag]} type`);
  }
  toString() {
    return `${this.isSigned ? `I` : `Ui`}nt${this.bitWidth}`;
  }
};
_c = Symbol.toStringTag;
Int_[_c] = ((proto) => {
  proto.isSigned = null;
  proto.bitWidth = null;
  return proto[Symbol.toStringTag] = "Int";
})(Int_.prototype);
var Int8 = class extends Int_ {
  constructor() {
    super(true, 8);
  }
  get ArrayType() {
    return Int8Array;
  }
};
var Int16 = class extends Int_ {
  constructor() {
    super(true, 16);
  }
  get ArrayType() {
    return Int16Array;
  }
};
var Int32 = class extends Int_ {
  constructor() {
    super(true, 32);
  }
  get ArrayType() {
    return Int32Array;
  }
};
var Int64 = class extends Int_ {
  constructor() {
    super(true, 64);
  }
  get ArrayType() {
    return BigInt64Array;
  }
};
var Uint8 = class extends Int_ {
  constructor() {
    super(false, 8);
  }
  get ArrayType() {
    return Uint8Array;
  }
};
var Uint16 = class extends Int_ {
  constructor() {
    super(false, 16);
  }
  get ArrayType() {
    return Uint16Array;
  }
};
var Uint32 = class extends Int_ {
  constructor() {
    super(false, 32);
  }
  get ArrayType() {
    return Uint32Array;
  }
};
var Uint64 = class extends Int_ {
  constructor() {
    super(false, 64);
  }
  get ArrayType() {
    return BigUint64Array;
  }
};
Object.defineProperty(Int8.prototype, "ArrayType", { value: Int8Array });
Object.defineProperty(Int16.prototype, "ArrayType", { value: Int16Array });
Object.defineProperty(Int32.prototype, "ArrayType", { value: Int32Array });
Object.defineProperty(Int64.prototype, "ArrayType", { value: BigInt64Array });
Object.defineProperty(Uint8.prototype, "ArrayType", { value: Uint8Array });
Object.defineProperty(Uint16.prototype, "ArrayType", { value: Uint16Array });
Object.defineProperty(Uint32.prototype, "ArrayType", { value: Uint32Array });
Object.defineProperty(Uint64.prototype, "ArrayType", { value: BigUint64Array });
var Float = class extends DataType {
  constructor(precision) {
    super(Type2.Float);
    this.precision = precision;
  }
  get ArrayType() {
    switch (this.precision) {
      case Precision.HALF:
        return Uint16Array;
      case Precision.SINGLE:
        return Float32Array;
      case Precision.DOUBLE:
        return Float64Array;
    }
    throw new Error(`Unrecognized ${this[Symbol.toStringTag]} type`);
  }
  toString() {
    return `Float${this.precision << 5 || 16}`;
  }
};
_d = Symbol.toStringTag;
Float[_d] = ((proto) => {
  proto.precision = null;
  return proto[Symbol.toStringTag] = "Float";
})(Float.prototype);
var Float16 = class extends Float {
  constructor() {
    super(Precision.HALF);
  }
};
var Float32 = class extends Float {
  constructor() {
    super(Precision.SINGLE);
  }
};
var Float64 = class extends Float {
  constructor() {
    super(Precision.DOUBLE);
  }
};
Object.defineProperty(Float16.prototype, "ArrayType", { value: Uint16Array });
Object.defineProperty(Float32.prototype, "ArrayType", { value: Float32Array });
Object.defineProperty(Float64.prototype, "ArrayType", { value: Float64Array });
var Binary2 = class extends DataType {
  constructor() {
    super(Type2.Binary);
  }
  toString() {
    return `Binary`;
  }
};
_e = Symbol.toStringTag;
Binary2[_e] = ((proto) => {
  proto.ArrayType = Uint8Array;
  return proto[Symbol.toStringTag] = "Binary";
})(Binary2.prototype);
var LargeBinary2 = class extends DataType {
  constructor() {
    super(Type2.LargeBinary);
  }
  toString() {
    return `LargeBinary`;
  }
};
_f = Symbol.toStringTag;
LargeBinary2[_f] = ((proto) => {
  proto.ArrayType = Uint8Array;
  proto.OffsetArrayType = BigInt64Array;
  return proto[Symbol.toStringTag] = "LargeBinary";
})(LargeBinary2.prototype);
var Utf82 = class extends DataType {
  constructor() {
    super(Type2.Utf8);
  }
  toString() {
    return `Utf8`;
  }
};
_g = Symbol.toStringTag;
Utf82[_g] = ((proto) => {
  proto.ArrayType = Uint8Array;
  return proto[Symbol.toStringTag] = "Utf8";
})(Utf82.prototype);
var LargeUtf82 = class extends DataType {
  constructor() {
    super(Type2.LargeUtf8);
  }
  toString() {
    return `LargeUtf8`;
  }
};
_h = Symbol.toStringTag;
LargeUtf82[_h] = ((proto) => {
  proto.ArrayType = Uint8Array;
  proto.OffsetArrayType = BigInt64Array;
  return proto[Symbol.toStringTag] = "LargeUtf8";
})(LargeUtf82.prototype);
var Bool2 = class extends DataType {
  constructor() {
    super(Type2.Bool);
  }
  toString() {
    return `Bool`;
  }
};
_j = Symbol.toStringTag;
Bool2[_j] = ((proto) => {
  proto.ArrayType = Uint8Array;
  return proto[Symbol.toStringTag] = "Bool";
})(Bool2.prototype);
var Decimal2 = class extends DataType {
  constructor(scale, precision, bitWidth = 128) {
    super(Type2.Decimal);
    this.scale = scale;
    this.precision = precision;
    this.bitWidth = bitWidth;
  }
  toString() {
    return `Decimal[${this.precision}e${this.scale > 0 ? `+` : ``}${this.scale}]`;
  }
};
_k = Symbol.toStringTag;
Decimal2[_k] = ((proto) => {
  proto.scale = null;
  proto.precision = null;
  proto.ArrayType = Uint32Array;
  return proto[Symbol.toStringTag] = "Decimal";
})(Decimal2.prototype);
var Date_ = class extends DataType {
  constructor(unit) {
    super(Type2.Date);
    this.unit = unit;
  }
  toString() {
    return `Date${(this.unit + 1) * 32}<${DateUnit[this.unit]}>`;
  }
};
_l = Symbol.toStringTag;
Date_[_l] = ((proto) => {
  proto.unit = null;
  proto.ArrayType = Int32Array;
  return proto[Symbol.toStringTag] = "Date";
})(Date_.prototype);
var Time_ = class extends DataType {
  constructor(unit, bitWidth) {
    super(Type2.Time);
    this.unit = unit;
    this.bitWidth = bitWidth;
  }
  toString() {
    return `Time${this.bitWidth}<${TimeUnit[this.unit]}>`;
  }
  get ArrayType() {
    switch (this.bitWidth) {
      case 32:
        return Int32Array;
      case 64:
        return BigInt64Array;
    }
    throw new Error(`Unrecognized ${this[Symbol.toStringTag]} type`);
  }
};
_m = Symbol.toStringTag;
Time_[_m] = ((proto) => {
  proto.unit = null;
  proto.bitWidth = null;
  return proto[Symbol.toStringTag] = "Time";
})(Time_.prototype);
var Timestamp_ = class extends DataType {
  constructor(unit, timezone) {
    super(Type2.Timestamp);
    this.unit = unit;
    this.timezone = timezone;
  }
  toString() {
    return `Timestamp<${TimeUnit[this.unit]}${this.timezone ? `, ${this.timezone}` : ``}>`;
  }
};
_o = Symbol.toStringTag;
Timestamp_[_o] = ((proto) => {
  proto.unit = null;
  proto.timezone = null;
  proto.ArrayType = Int32Array;
  return proto[Symbol.toStringTag] = "Timestamp";
})(Timestamp_.prototype);
var Interval_ = class extends DataType {
  constructor(unit) {
    super(Type2.Interval);
    this.unit = unit;
  }
  toString() {
    return `Interval<${IntervalUnit[this.unit]}>`;
  }
};
_p = Symbol.toStringTag;
Interval_[_p] = ((proto) => {
  proto.unit = null;
  proto.ArrayType = Int32Array;
  return proto[Symbol.toStringTag] = "Interval";
})(Interval_.prototype);
var Duration2 = class extends DataType {
  constructor(unit) {
    super(Type2.Duration);
    this.unit = unit;
  }
  toString() {
    return `Duration<${TimeUnit[this.unit]}>`;
  }
};
_q = Symbol.toStringTag;
Duration2[_q] = ((proto) => {
  proto.unit = null;
  proto.ArrayType = BigInt64Array;
  return proto[Symbol.toStringTag] = "Duration";
})(Duration2.prototype);
var List2 = class extends DataType {
  constructor(child) {
    super(Type2.List);
    this.children = [child];
  }
  toString() {
    return `List<${this.valueType}>`;
  }
  get valueType() {
    return this.children[0].type;
  }
  get valueField() {
    return this.children[0];
  }
  get ArrayType() {
    return this.valueType.ArrayType;
  }
};
_r = Symbol.toStringTag;
List2[_r] = ((proto) => {
  proto.children = null;
  return proto[Symbol.toStringTag] = "List";
})(List2.prototype);
var Struct = class extends DataType {
  constructor(children) {
    super(Type2.Struct);
    this.children = children;
  }
  toString() {
    return `Struct<{${this.children.map((f) => `${f.name}:${f.type}`).join(`, `)}}>`;
  }
};
_s = Symbol.toStringTag;
Struct[_s] = ((proto) => {
  proto.children = null;
  return proto[Symbol.toStringTag] = "Struct";
})(Struct.prototype);
var Union_ = class extends DataType {
  constructor(mode2, typeIds, children) {
    super(Type2.Union);
    this.mode = mode2;
    this.children = children;
    this.typeIds = typeIds = Int32Array.from(typeIds);
    this.typeIdToChildIndex = typeIds.reduce((typeIdToChildIndex, typeId, idx) => (typeIdToChildIndex[typeId] = idx) && typeIdToChildIndex || typeIdToChildIndex, /* @__PURE__ */ Object.create(null));
  }
  toString() {
    return `${this[Symbol.toStringTag]}<${this.children.map((x2) => `${x2.type}`).join(` | `)}>`;
  }
};
_t = Symbol.toStringTag;
Union_[_t] = ((proto) => {
  proto.mode = null;
  proto.typeIds = null;
  proto.children = null;
  proto.typeIdToChildIndex = null;
  proto.ArrayType = Int8Array;
  return proto[Symbol.toStringTag] = "Union";
})(Union_.prototype);
var FixedSizeBinary2 = class extends DataType {
  constructor(byteWidth) {
    super(Type2.FixedSizeBinary);
    this.byteWidth = byteWidth;
  }
  toString() {
    return `FixedSizeBinary[${this.byteWidth}]`;
  }
};
_u = Symbol.toStringTag;
FixedSizeBinary2[_u] = ((proto) => {
  proto.byteWidth = null;
  proto.ArrayType = Uint8Array;
  return proto[Symbol.toStringTag] = "FixedSizeBinary";
})(FixedSizeBinary2.prototype);
var FixedSizeList2 = class extends DataType {
  constructor(listSize, child) {
    super(Type2.FixedSizeList);
    this.listSize = listSize;
    this.children = [child];
  }
  get valueType() {
    return this.children[0].type;
  }
  get valueField() {
    return this.children[0];
  }
  get ArrayType() {
    return this.valueType.ArrayType;
  }
  toString() {
    return `FixedSizeList[${this.listSize}]<${this.valueType}>`;
  }
};
_v = Symbol.toStringTag;
FixedSizeList2[_v] = ((proto) => {
  proto.children = null;
  proto.listSize = null;
  return proto[Symbol.toStringTag] = "FixedSizeList";
})(FixedSizeList2.prototype);
var Map_ = class extends DataType {
  constructor(entries, keysSorted = false) {
    var _y, _z, _0;
    super(Type2.Map);
    this.children = [entries];
    this.keysSorted = keysSorted;
    if (entries) {
      entries["name"] = "entries";
      if ((_y = entries === null || entries === void 0 ? void 0 : entries.type) === null || _y === void 0 ? void 0 : _y.children) {
        const key = (_z = entries === null || entries === void 0 ? void 0 : entries.type) === null || _z === void 0 ? void 0 : _z.children[0];
        if (key) {
          key["name"] = "key";
        }
        const val = (_0 = entries === null || entries === void 0 ? void 0 : entries.type) === null || _0 === void 0 ? void 0 : _0.children[1];
        if (val) {
          val["name"] = "value";
        }
      }
    }
  }
  get keyType() {
    return this.children[0].type.children[0].type;
  }
  get valueType() {
    return this.children[0].type.children[1].type;
  }
  get childType() {
    return this.children[0].type;
  }
  toString() {
    return `Map<{${this.children[0].type.children.map((f) => `${f.name}:${f.type}`).join(`, `)}}>`;
  }
};
_w = Symbol.toStringTag;
Map_[_w] = ((proto) => {
  proto.children = null;
  proto.keysSorted = null;
  return proto[Symbol.toStringTag] = "Map_";
})(Map_.prototype);
var getId = /* @__PURE__ */ ((atomicDictionaryId) => () => ++atomicDictionaryId)(-1);
var Dictionary = class extends DataType {
  constructor(dictionary, indices, id, isOrdered) {
    super(Type2.Dictionary);
    this.indices = indices;
    this.dictionary = dictionary;
    this.isOrdered = isOrdered || false;
    this.id = id == null ? getId() : bigIntToNumber(id);
  }
  get children() {
    return this.dictionary.children;
  }
  get valueType() {
    return this.dictionary;
  }
  get ArrayType() {
    return this.dictionary.ArrayType;
  }
  toString() {
    return `Dictionary<${this.indices}, ${this.dictionary}>`;
  }
};
_x = Symbol.toStringTag;
Dictionary[_x] = ((proto) => {
  proto.id = null;
  proto.indices = null;
  proto.isOrdered = null;
  proto.dictionary = null;
  return proto[Symbol.toStringTag] = "Dictionary";
})(Dictionary.prototype);
function strideForType(type) {
  const t = type;
  switch (type.typeId) {
    case Type2.Decimal:
      return type.bitWidth / 32;
    case Type2.Timestamp:
      return 2;
    case Type2.Date:
      return 1 + t.unit;
    case Type2.Interval:
      return 1 + t.unit;
    case Type2.FixedSizeList:
      return t.listSize;
    case Type2.FixedSizeBinary:
      return t.byteWidth;
    default:
      return 1;
  }
}

// ../core/node_modules/apache-arrow/visitor.mjs
var Visitor = class {
  visitMany(nodes, ...args) {
    return nodes.map((node, i) => this.visit(node, ...args.map((x2) => x2[i])));
  }
  visit(...args) {
    return this.getVisitFn(args[0], false).apply(this, args);
  }
  getVisitFn(node, throwIfNotFound = true) {
    return getVisitFn(this, node, throwIfNotFound);
  }
  getVisitFnByTypeId(typeId, throwIfNotFound = true) {
    return getVisitFnByTypeId(this, typeId, throwIfNotFound);
  }
  visitNull(_node, ..._args) {
    return null;
  }
  visitBool(_node, ..._args) {
    return null;
  }
  visitInt(_node, ..._args) {
    return null;
  }
  visitFloat(_node, ..._args) {
    return null;
  }
  visitUtf8(_node, ..._args) {
    return null;
  }
  visitLargeUtf8(_node, ..._args) {
    return null;
  }
  visitBinary(_node, ..._args) {
    return null;
  }
  visitLargeBinary(_node, ..._args) {
    return null;
  }
  visitFixedSizeBinary(_node, ..._args) {
    return null;
  }
  visitDate(_node, ..._args) {
    return null;
  }
  visitTimestamp(_node, ..._args) {
    return null;
  }
  visitTime(_node, ..._args) {
    return null;
  }
  visitDecimal(_node, ..._args) {
    return null;
  }
  visitList(_node, ..._args) {
    return null;
  }
  visitStruct(_node, ..._args) {
    return null;
  }
  visitUnion(_node, ..._args) {
    return null;
  }
  visitDictionary(_node, ..._args) {
    return null;
  }
  visitInterval(_node, ..._args) {
    return null;
  }
  visitDuration(_node, ..._args) {
    return null;
  }
  visitFixedSizeList(_node, ..._args) {
    return null;
  }
  visitMap(_node, ..._args) {
    return null;
  }
};
function getVisitFn(visitor, node, throwIfNotFound = true) {
  if (typeof node === "number") {
    return getVisitFnByTypeId(visitor, node, throwIfNotFound);
  }
  if (typeof node === "string" && node in Type2) {
    return getVisitFnByTypeId(visitor, Type2[node], throwIfNotFound);
  }
  if (node && node instanceof DataType) {
    return getVisitFnByTypeId(visitor, inferDType(node), throwIfNotFound);
  }
  if ((node === null || node === void 0 ? void 0 : node.type) && node.type instanceof DataType) {
    return getVisitFnByTypeId(visitor, inferDType(node.type), throwIfNotFound);
  }
  return getVisitFnByTypeId(visitor, Type2.NONE, throwIfNotFound);
}
function getVisitFnByTypeId(visitor, dtype, throwIfNotFound = true) {
  let fn = null;
  switch (dtype) {
    case Type2.Null:
      fn = visitor.visitNull;
      break;
    case Type2.Bool:
      fn = visitor.visitBool;
      break;
    case Type2.Int:
      fn = visitor.visitInt;
      break;
    case Type2.Int8:
      fn = visitor.visitInt8 || visitor.visitInt;
      break;
    case Type2.Int16:
      fn = visitor.visitInt16 || visitor.visitInt;
      break;
    case Type2.Int32:
      fn = visitor.visitInt32 || visitor.visitInt;
      break;
    case Type2.Int64:
      fn = visitor.visitInt64 || visitor.visitInt;
      break;
    case Type2.Uint8:
      fn = visitor.visitUint8 || visitor.visitInt;
      break;
    case Type2.Uint16:
      fn = visitor.visitUint16 || visitor.visitInt;
      break;
    case Type2.Uint32:
      fn = visitor.visitUint32 || visitor.visitInt;
      break;
    case Type2.Uint64:
      fn = visitor.visitUint64 || visitor.visitInt;
      break;
    case Type2.Float:
      fn = visitor.visitFloat;
      break;
    case Type2.Float16:
      fn = visitor.visitFloat16 || visitor.visitFloat;
      break;
    case Type2.Float32:
      fn = visitor.visitFloat32 || visitor.visitFloat;
      break;
    case Type2.Float64:
      fn = visitor.visitFloat64 || visitor.visitFloat;
      break;
    case Type2.Utf8:
      fn = visitor.visitUtf8;
      break;
    case Type2.LargeUtf8:
      fn = visitor.visitLargeUtf8;
      break;
    case Type2.Binary:
      fn = visitor.visitBinary;
      break;
    case Type2.LargeBinary:
      fn = visitor.visitLargeBinary;
      break;
    case Type2.FixedSizeBinary:
      fn = visitor.visitFixedSizeBinary;
      break;
    case Type2.Date:
      fn = visitor.visitDate;
      break;
    case Type2.DateDay:
      fn = visitor.visitDateDay || visitor.visitDate;
      break;
    case Type2.DateMillisecond:
      fn = visitor.visitDateMillisecond || visitor.visitDate;
      break;
    case Type2.Timestamp:
      fn = visitor.visitTimestamp;
      break;
    case Type2.TimestampSecond:
      fn = visitor.visitTimestampSecond || visitor.visitTimestamp;
      break;
    case Type2.TimestampMillisecond:
      fn = visitor.visitTimestampMillisecond || visitor.visitTimestamp;
      break;
    case Type2.TimestampMicrosecond:
      fn = visitor.visitTimestampMicrosecond || visitor.visitTimestamp;
      break;
    case Type2.TimestampNanosecond:
      fn = visitor.visitTimestampNanosecond || visitor.visitTimestamp;
      break;
    case Type2.Time:
      fn = visitor.visitTime;
      break;
    case Type2.TimeSecond:
      fn = visitor.visitTimeSecond || visitor.visitTime;
      break;
    case Type2.TimeMillisecond:
      fn = visitor.visitTimeMillisecond || visitor.visitTime;
      break;
    case Type2.TimeMicrosecond:
      fn = visitor.visitTimeMicrosecond || visitor.visitTime;
      break;
    case Type2.TimeNanosecond:
      fn = visitor.visitTimeNanosecond || visitor.visitTime;
      break;
    case Type2.Decimal:
      fn = visitor.visitDecimal;
      break;
    case Type2.List:
      fn = visitor.visitList;
      break;
    case Type2.Struct:
      fn = visitor.visitStruct;
      break;
    case Type2.Union:
      fn = visitor.visitUnion;
      break;
    case Type2.DenseUnion:
      fn = visitor.visitDenseUnion || visitor.visitUnion;
      break;
    case Type2.SparseUnion:
      fn = visitor.visitSparseUnion || visitor.visitUnion;
      break;
    case Type2.Dictionary:
      fn = visitor.visitDictionary;
      break;
    case Type2.Interval:
      fn = visitor.visitInterval;
      break;
    case Type2.IntervalDayTime:
      fn = visitor.visitIntervalDayTime || visitor.visitInterval;
      break;
    case Type2.IntervalYearMonth:
      fn = visitor.visitIntervalYearMonth || visitor.visitInterval;
      break;
    case Type2.Duration:
      fn = visitor.visitDuration;
      break;
    case Type2.DurationSecond:
      fn = visitor.visitDurationSecond || visitor.visitDuration;
      break;
    case Type2.DurationMillisecond:
      fn = visitor.visitDurationMillisecond || visitor.visitDuration;
      break;
    case Type2.DurationMicrosecond:
      fn = visitor.visitDurationMicrosecond || visitor.visitDuration;
      break;
    case Type2.DurationNanosecond:
      fn = visitor.visitDurationNanosecond || visitor.visitDuration;
      break;
    case Type2.FixedSizeList:
      fn = visitor.visitFixedSizeList;
      break;
    case Type2.Map:
      fn = visitor.visitMap;
      break;
  }
  if (typeof fn === "function")
    return fn;
  if (!throwIfNotFound)
    return () => null;
  throw new Error(`Unrecognized type '${Type2[dtype]}'`);
}
function inferDType(type) {
  switch (type.typeId) {
    case Type2.Null:
      return Type2.Null;
    case Type2.Int: {
      const { bitWidth, isSigned } = type;
      switch (bitWidth) {
        case 8:
          return isSigned ? Type2.Int8 : Type2.Uint8;
        case 16:
          return isSigned ? Type2.Int16 : Type2.Uint16;
        case 32:
          return isSigned ? Type2.Int32 : Type2.Uint32;
        case 64:
          return isSigned ? Type2.Int64 : Type2.Uint64;
      }
      return Type2.Int;
    }
    case Type2.Float:
      switch (type.precision) {
        case Precision.HALF:
          return Type2.Float16;
        case Precision.SINGLE:
          return Type2.Float32;
        case Precision.DOUBLE:
          return Type2.Float64;
      }
      return Type2.Float;
    case Type2.Binary:
      return Type2.Binary;
    case Type2.LargeBinary:
      return Type2.LargeBinary;
    case Type2.Utf8:
      return Type2.Utf8;
    case Type2.LargeUtf8:
      return Type2.LargeUtf8;
    case Type2.Bool:
      return Type2.Bool;
    case Type2.Decimal:
      return Type2.Decimal;
    case Type2.Time:
      switch (type.unit) {
        case TimeUnit.SECOND:
          return Type2.TimeSecond;
        case TimeUnit.MILLISECOND:
          return Type2.TimeMillisecond;
        case TimeUnit.MICROSECOND:
          return Type2.TimeMicrosecond;
        case TimeUnit.NANOSECOND:
          return Type2.TimeNanosecond;
      }
      return Type2.Time;
    case Type2.Timestamp:
      switch (type.unit) {
        case TimeUnit.SECOND:
          return Type2.TimestampSecond;
        case TimeUnit.MILLISECOND:
          return Type2.TimestampMillisecond;
        case TimeUnit.MICROSECOND:
          return Type2.TimestampMicrosecond;
        case TimeUnit.NANOSECOND:
          return Type2.TimestampNanosecond;
      }
      return Type2.Timestamp;
    case Type2.Date:
      switch (type.unit) {
        case DateUnit.DAY:
          return Type2.DateDay;
        case DateUnit.MILLISECOND:
          return Type2.DateMillisecond;
      }
      return Type2.Date;
    case Type2.Interval:
      switch (type.unit) {
        case IntervalUnit.DAY_TIME:
          return Type2.IntervalDayTime;
        case IntervalUnit.YEAR_MONTH:
          return Type2.IntervalYearMonth;
      }
      return Type2.Interval;
    case Type2.Duration:
      switch (type.unit) {
        case TimeUnit.SECOND:
          return Type2.DurationSecond;
        case TimeUnit.MILLISECOND:
          return Type2.DurationMillisecond;
        case TimeUnit.MICROSECOND:
          return Type2.DurationMicrosecond;
        case TimeUnit.NANOSECOND:
          return Type2.DurationNanosecond;
      }
      return Type2.Duration;
    case Type2.Map:
      return Type2.Map;
    case Type2.List:
      return Type2.List;
    case Type2.Struct:
      return Type2.Struct;
    case Type2.Union:
      switch (type.mode) {
        case UnionMode.Dense:
          return Type2.DenseUnion;
        case UnionMode.Sparse:
          return Type2.SparseUnion;
      }
      return Type2.Union;
    case Type2.FixedSizeBinary:
      return Type2.FixedSizeBinary;
    case Type2.FixedSizeList:
      return Type2.FixedSizeList;
    case Type2.Dictionary:
      return Type2.Dictionary;
  }
  throw new Error(`Unrecognized type '${Type2[type.typeId]}'`);
}
Visitor.prototype.visitInt8 = null;
Visitor.prototype.visitInt16 = null;
Visitor.prototype.visitInt32 = null;
Visitor.prototype.visitInt64 = null;
Visitor.prototype.visitUint8 = null;
Visitor.prototype.visitUint16 = null;
Visitor.prototype.visitUint32 = null;
Visitor.prototype.visitUint64 = null;
Visitor.prototype.visitFloat16 = null;
Visitor.prototype.visitFloat32 = null;
Visitor.prototype.visitFloat64 = null;
Visitor.prototype.visitDateDay = null;
Visitor.prototype.visitDateMillisecond = null;
Visitor.prototype.visitTimestampSecond = null;
Visitor.prototype.visitTimestampMillisecond = null;
Visitor.prototype.visitTimestampMicrosecond = null;
Visitor.prototype.visitTimestampNanosecond = null;
Visitor.prototype.visitTimeSecond = null;
Visitor.prototype.visitTimeMillisecond = null;
Visitor.prototype.visitTimeMicrosecond = null;
Visitor.prototype.visitTimeNanosecond = null;
Visitor.prototype.visitDenseUnion = null;
Visitor.prototype.visitSparseUnion = null;
Visitor.prototype.visitIntervalDayTime = null;
Visitor.prototype.visitIntervalYearMonth = null;
Visitor.prototype.visitDuration = null;
Visitor.prototype.visitDurationSecond = null;
Visitor.prototype.visitDurationMillisecond = null;
Visitor.prototype.visitDurationMicrosecond = null;
Visitor.prototype.visitDurationNanosecond = null;

// ../core/node_modules/apache-arrow/util/math.mjs
var math_exports = {};
__export(math_exports, {
  float64ToUint16: () => float64ToUint16,
  uint16ToFloat64: () => uint16ToFloat64
});
var f64 = new Float64Array(1);
var u32 = new Uint32Array(f64.buffer);
function uint16ToFloat64(h) {
  const expo = (h & 31744) >> 10;
  const sigf = (h & 1023) / 1024;
  const sign = Math.pow(-1, (h & 32768) >> 15);
  switch (expo) {
    case 31:
      return sign * (sigf ? Number.NaN : 1 / 0);
    case 0:
      return sign * (sigf ? 6103515625e-14 * sigf : 0);
  }
  return sign * Math.pow(2, expo - 15) * (1 + sigf);
}
function float64ToUint16(d) {
  if (d !== d) {
    return 32256;
  }
  f64[0] = d;
  const sign = (u32[1] & 2147483648) >> 16 & 65535;
  let expo = u32[1] & 2146435072, sigf = 0;
  if (expo >= 1089470464) {
    if (u32[0] > 0) {
      expo = 31744;
    } else {
      expo = (expo & 2080374784) >> 16;
      sigf = (u32[1] & 1048575) >> 10;
    }
  } else if (expo <= 1056964608) {
    sigf = 1048576 + (u32[1] & 1048575);
    sigf = 1048576 + (sigf << (expo >> 20) - 998) >> 21;
    expo = 0;
  } else {
    expo = expo - 1056964608 >> 10;
    sigf = (u32[1] & 1048575) + 512 >> 10;
  }
  return sign | expo | sigf & 65535;
}

// ../core/node_modules/apache-arrow/visitor/set.mjs
var SetVisitor = class extends Visitor {
};
function wrapSet(fn) {
  return (data, _1, _2) => {
    if (data.setValid(_1, _2 != null)) {
      return fn(data, _1, _2);
    }
  };
}
var setEpochMsToDays = (data, index, epochMs) => {
  data[index] = Math.trunc(epochMs / 864e5);
};
var setEpochMsToMillisecondsLong = (data, index, epochMs) => {
  data[index] = Math.trunc(epochMs % 4294967296);
  data[index + 1] = Math.trunc(epochMs / 4294967296);
};
var setEpochMsToMicrosecondsLong = (data, index, epochMs) => {
  data[index] = Math.trunc(epochMs * 1e3 % 4294967296);
  data[index + 1] = Math.trunc(epochMs * 1e3 / 4294967296);
};
var setEpochMsToNanosecondsLong = (data, index, epochMs) => {
  data[index] = Math.trunc(epochMs * 1e6 % 4294967296);
  data[index + 1] = Math.trunc(epochMs * 1e6 / 4294967296);
};
var setVariableWidthBytes = (values, valueOffsets, index, value) => {
  if (index + 1 < valueOffsets.length) {
    const x2 = bigIntToNumber(valueOffsets[index]);
    const y2 = bigIntToNumber(valueOffsets[index + 1]);
    values.set(value.subarray(0, y2 - x2), x2);
  }
};
var setBool = ({ offset, values }, index, val) => {
  const idx = offset + index;
  val ? values[idx >> 3] |= 1 << idx % 8 : values[idx >> 3] &= ~(1 << idx % 8);
};
var setInt = ({ values }, index, value) => {
  values[index] = value;
};
var setFloat = ({ values }, index, value) => {
  values[index] = value;
};
var setFloat16 = ({ values }, index, value) => {
  values[index] = float64ToUint16(value);
};
var setAnyFloat = (data, index, value) => {
  switch (data.type.precision) {
    case Precision.HALF:
      return setFloat16(data, index, value);
    case Precision.SINGLE:
    case Precision.DOUBLE:
      return setFloat(data, index, value);
  }
};
var setDateDay = ({ values }, index, value) => {
  setEpochMsToDays(values, index, value.valueOf());
};
var setDateMillisecond = ({ values }, index, value) => {
  setEpochMsToMillisecondsLong(values, index * 2, value.valueOf());
};
var setFixedSizeBinary = ({ stride, values }, index, value) => {
  values.set(value.subarray(0, stride), stride * index);
};
var setBinary = ({ values, valueOffsets }, index, value) => setVariableWidthBytes(values, valueOffsets, index, value);
var setUtf8 = ({ values, valueOffsets }, index, value) => setVariableWidthBytes(values, valueOffsets, index, encodeUtf8(value));
var setDate = (data, index, value) => {
  data.type.unit === DateUnit.DAY ? setDateDay(data, index, value) : setDateMillisecond(data, index, value);
};
var setTimestampSecond = ({ values }, index, value) => setEpochMsToMillisecondsLong(values, index * 2, value / 1e3);
var setTimestampMillisecond = ({ values }, index, value) => setEpochMsToMillisecondsLong(values, index * 2, value);
var setTimestampMicrosecond = ({ values }, index, value) => setEpochMsToMicrosecondsLong(values, index * 2, value);
var setTimestampNanosecond = ({ values }, index, value) => setEpochMsToNanosecondsLong(values, index * 2, value);
var setTimestamp = (data, index, value) => {
  switch (data.type.unit) {
    case TimeUnit.SECOND:
      return setTimestampSecond(data, index, value);
    case TimeUnit.MILLISECOND:
      return setTimestampMillisecond(data, index, value);
    case TimeUnit.MICROSECOND:
      return setTimestampMicrosecond(data, index, value);
    case TimeUnit.NANOSECOND:
      return setTimestampNanosecond(data, index, value);
  }
};
var setTimeSecond = ({ values }, index, value) => {
  values[index] = value;
};
var setTimeMillisecond = ({ values }, index, value) => {
  values[index] = value;
};
var setTimeMicrosecond = ({ values }, index, value) => {
  values[index] = value;
};
var setTimeNanosecond = ({ values }, index, value) => {
  values[index] = value;
};
var setTime = (data, index, value) => {
  switch (data.type.unit) {
    case TimeUnit.SECOND:
      return setTimeSecond(data, index, value);
    case TimeUnit.MILLISECOND:
      return setTimeMillisecond(data, index, value);
    case TimeUnit.MICROSECOND:
      return setTimeMicrosecond(data, index, value);
    case TimeUnit.NANOSECOND:
      return setTimeNanosecond(data, index, value);
  }
};
var setDecimal = ({ values, stride }, index, value) => {
  values.set(value.subarray(0, stride), stride * index);
};
var setList = (data, index, value) => {
  const values = data.children[0];
  const valueOffsets = data.valueOffsets;
  const set = instance.getVisitFn(values);
  if (Array.isArray(value)) {
    for (let idx = -1, itr = valueOffsets[index], end = valueOffsets[index + 1]; itr < end; ) {
      set(values, itr++, value[++idx]);
    }
  } else {
    for (let idx = -1, itr = valueOffsets[index], end = valueOffsets[index + 1]; itr < end; ) {
      set(values, itr++, value.get(++idx));
    }
  }
};
var setMap = (data, index, value) => {
  const values = data.children[0];
  const { valueOffsets } = data;
  const set = instance.getVisitFn(values);
  let { [index]: idx, [index + 1]: end } = valueOffsets;
  const entries = value instanceof Map ? value.entries() : Object.entries(value);
  for (const val of entries) {
    set(values, idx, val);
    if (++idx >= end)
      break;
  }
};
var _setStructArrayValue = (o, v) => (set, c, _, i) => c && set(c, o, v[i]);
var _setStructVectorValue = (o, v) => (set, c, _, i) => c && set(c, o, v.get(i));
var _setStructMapValue = (o, v) => (set, c, f, _) => c && set(c, o, v.get(f.name));
var _setStructObjectValue = (o, v) => (set, c, f, _) => c && set(c, o, v[f.name]);
var setStruct = (data, index, value) => {
  const childSetters = data.type.children.map((f) => instance.getVisitFn(f.type));
  const set = value instanceof Map ? _setStructMapValue(index, value) : value instanceof Vector ? _setStructVectorValue(index, value) : Array.isArray(value) ? _setStructArrayValue(index, value) : _setStructObjectValue(index, value);
  data.type.children.forEach((f, i) => set(childSetters[i], data.children[i], f, i));
};
var setUnion = (data, index, value) => {
  data.type.mode === UnionMode.Dense ? setDenseUnion(data, index, value) : setSparseUnion(data, index, value);
};
var setDenseUnion = (data, index, value) => {
  const childIndex = data.type.typeIdToChildIndex[data.typeIds[index]];
  const child = data.children[childIndex];
  instance.visit(child, data.valueOffsets[index], value);
};
var setSparseUnion = (data, index, value) => {
  const childIndex = data.type.typeIdToChildIndex[data.typeIds[index]];
  const child = data.children[childIndex];
  instance.visit(child, index, value);
};
var setDictionary = (data, index, value) => {
  var _a5;
  (_a5 = data.dictionary) === null || _a5 === void 0 ? void 0 : _a5.set(data.values[index], value);
};
var setIntervalValue = (data, index, value) => {
  data.type.unit === IntervalUnit.DAY_TIME ? setIntervalDayTime(data, index, value) : setIntervalYearMonth(data, index, value);
};
var setIntervalDayTime = ({ values }, index, value) => {
  values.set(value.subarray(0, 2), 2 * index);
};
var setIntervalYearMonth = ({ values }, index, value) => {
  values[index] = value[0] * 12 + value[1] % 12;
};
var setDurationSecond = ({ values }, index, value) => {
  values[index] = value;
};
var setDurationMillisecond = ({ values }, index, value) => {
  values[index] = value;
};
var setDurationMicrosecond = ({ values }, index, value) => {
  values[index] = value;
};
var setDurationNanosecond = ({ values }, index, value) => {
  values[index] = value;
};
var setDuration = (data, index, value) => {
  switch (data.type.unit) {
    case TimeUnit.SECOND:
      return setDurationSecond(data, index, value);
    case TimeUnit.MILLISECOND:
      return setDurationMillisecond(data, index, value);
    case TimeUnit.MICROSECOND:
      return setDurationMicrosecond(data, index, value);
    case TimeUnit.NANOSECOND:
      return setDurationNanosecond(data, index, value);
  }
};
var setFixedSizeList = (data, index, value) => {
  const { stride } = data;
  const child = data.children[0];
  const set = instance.getVisitFn(child);
  if (Array.isArray(value)) {
    for (let idx = -1, offset = index * stride; ++idx < stride; ) {
      set(child, offset + idx, value[idx]);
    }
  } else {
    for (let idx = -1, offset = index * stride; ++idx < stride; ) {
      set(child, offset + idx, value.get(idx));
    }
  }
};
SetVisitor.prototype.visitBool = wrapSet(setBool);
SetVisitor.prototype.visitInt = wrapSet(setInt);
SetVisitor.prototype.visitInt8 = wrapSet(setInt);
SetVisitor.prototype.visitInt16 = wrapSet(setInt);
SetVisitor.prototype.visitInt32 = wrapSet(setInt);
SetVisitor.prototype.visitInt64 = wrapSet(setInt);
SetVisitor.prototype.visitUint8 = wrapSet(setInt);
SetVisitor.prototype.visitUint16 = wrapSet(setInt);
SetVisitor.prototype.visitUint32 = wrapSet(setInt);
SetVisitor.prototype.visitUint64 = wrapSet(setInt);
SetVisitor.prototype.visitFloat = wrapSet(setAnyFloat);
SetVisitor.prototype.visitFloat16 = wrapSet(setFloat16);
SetVisitor.prototype.visitFloat32 = wrapSet(setFloat);
SetVisitor.prototype.visitFloat64 = wrapSet(setFloat);
SetVisitor.prototype.visitUtf8 = wrapSet(setUtf8);
SetVisitor.prototype.visitLargeUtf8 = wrapSet(setUtf8);
SetVisitor.prototype.visitBinary = wrapSet(setBinary);
SetVisitor.prototype.visitLargeBinary = wrapSet(setBinary);
SetVisitor.prototype.visitFixedSizeBinary = wrapSet(setFixedSizeBinary);
SetVisitor.prototype.visitDate = wrapSet(setDate);
SetVisitor.prototype.visitDateDay = wrapSet(setDateDay);
SetVisitor.prototype.visitDateMillisecond = wrapSet(setDateMillisecond);
SetVisitor.prototype.visitTimestamp = wrapSet(setTimestamp);
SetVisitor.prototype.visitTimestampSecond = wrapSet(setTimestampSecond);
SetVisitor.prototype.visitTimestampMillisecond = wrapSet(setTimestampMillisecond);
SetVisitor.prototype.visitTimestampMicrosecond = wrapSet(setTimestampMicrosecond);
SetVisitor.prototype.visitTimestampNanosecond = wrapSet(setTimestampNanosecond);
SetVisitor.prototype.visitTime = wrapSet(setTime);
SetVisitor.prototype.visitTimeSecond = wrapSet(setTimeSecond);
SetVisitor.prototype.visitTimeMillisecond = wrapSet(setTimeMillisecond);
SetVisitor.prototype.visitTimeMicrosecond = wrapSet(setTimeMicrosecond);
SetVisitor.prototype.visitTimeNanosecond = wrapSet(setTimeNanosecond);
SetVisitor.prototype.visitDecimal = wrapSet(setDecimal);
SetVisitor.prototype.visitList = wrapSet(setList);
SetVisitor.prototype.visitStruct = wrapSet(setStruct);
SetVisitor.prototype.visitUnion = wrapSet(setUnion);
SetVisitor.prototype.visitDenseUnion = wrapSet(setDenseUnion);
SetVisitor.prototype.visitSparseUnion = wrapSet(setSparseUnion);
SetVisitor.prototype.visitDictionary = wrapSet(setDictionary);
SetVisitor.prototype.visitInterval = wrapSet(setIntervalValue);
SetVisitor.prototype.visitIntervalDayTime = wrapSet(setIntervalDayTime);
SetVisitor.prototype.visitIntervalYearMonth = wrapSet(setIntervalYearMonth);
SetVisitor.prototype.visitDuration = wrapSet(setDuration);
SetVisitor.prototype.visitDurationSecond = wrapSet(setDurationSecond);
SetVisitor.prototype.visitDurationMillisecond = wrapSet(setDurationMillisecond);
SetVisitor.prototype.visitDurationMicrosecond = wrapSet(setDurationMicrosecond);
SetVisitor.prototype.visitDurationNanosecond = wrapSet(setDurationNanosecond);
SetVisitor.prototype.visitFixedSizeList = wrapSet(setFixedSizeList);
SetVisitor.prototype.visitMap = wrapSet(setMap);
var instance = new SetVisitor();

// ../core/node_modules/apache-arrow/row/struct.mjs
var kParent = Symbol.for("parent");
var kRowIndex = Symbol.for("rowIndex");
var StructRow = class {
  constructor(parent, rowIndex) {
    this[kParent] = parent;
    this[kRowIndex] = rowIndex;
    return new Proxy(this, new StructRowProxyHandler());
  }
  toArray() {
    return Object.values(this.toJSON());
  }
  toJSON() {
    const i = this[kRowIndex];
    const parent = this[kParent];
    const keys = parent.type.children;
    const json = {};
    for (let j = -1, n = keys.length; ++j < n; ) {
      json[keys[j].name] = instance2.visit(parent.children[j], i);
    }
    return json;
  }
  toString() {
    return `{${[...this].map(([key, val]) => `${valueToString(key)}: ${valueToString(val)}`).join(", ")}}`;
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.toString();
  }
  [Symbol.iterator]() {
    return new StructRowIterator(this[kParent], this[kRowIndex]);
  }
};
var StructRowIterator = class {
  constructor(data, rowIndex) {
    this.childIndex = 0;
    this.children = data.children;
    this.rowIndex = rowIndex;
    this.childFields = data.type.children;
    this.numChildren = this.childFields.length;
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    const i = this.childIndex;
    if (i < this.numChildren) {
      this.childIndex = i + 1;
      return {
        done: false,
        value: [
          this.childFields[i].name,
          instance2.visit(this.children[i], this.rowIndex)
        ]
      };
    }
    return { done: true, value: null };
  }
};
Object.defineProperties(StructRow.prototype, {
  [Symbol.toStringTag]: { enumerable: false, configurable: false, value: "Row" },
  [kParent]: { writable: true, enumerable: false, configurable: false, value: null },
  [kRowIndex]: { writable: true, enumerable: false, configurable: false, value: -1 }
});
var StructRowProxyHandler = class {
  isExtensible() {
    return false;
  }
  deleteProperty() {
    return false;
  }
  preventExtensions() {
    return true;
  }
  ownKeys(row) {
    return row[kParent].type.children.map((f) => f.name);
  }
  has(row, key) {
    return row[kParent].type.children.findIndex((f) => f.name === key) !== -1;
  }
  getOwnPropertyDescriptor(row, key) {
    if (row[kParent].type.children.findIndex((f) => f.name === key) !== -1) {
      return { writable: true, enumerable: true, configurable: true };
    }
    return;
  }
  get(row, key) {
    if (Reflect.has(row, key)) {
      return row[key];
    }
    const idx = row[kParent].type.children.findIndex((f) => f.name === key);
    if (idx !== -1) {
      const val = instance2.visit(row[kParent].children[idx], row[kRowIndex]);
      Reflect.set(row, key, val);
      return val;
    }
  }
  set(row, key, val) {
    const idx = row[kParent].type.children.findIndex((f) => f.name === key);
    if (idx !== -1) {
      instance.visit(row[kParent].children[idx], row[kRowIndex], val);
      return Reflect.set(row, key, val);
    } else if (Reflect.has(row, key) || typeof key === "symbol") {
      return Reflect.set(row, key, val);
    }
    return false;
  }
};

// ../core/node_modules/apache-arrow/visitor/get.mjs
var GetVisitor = class extends Visitor {
};
function wrapGet(fn) {
  return (data, _1) => data.getValid(_1) ? fn(data, _1) : null;
}
var epochDaysToMs = (data, index) => 864e5 * data[index];
var epochMillisecondsLongToMs = (data, index) => 4294967296 * data[index + 1] + (data[index] >>> 0);
var epochMicrosecondsLongToMs = (data, index) => 4294967296 * (data[index + 1] / 1e3) + (data[index] >>> 0) / 1e3;
var epochNanosecondsLongToMs = (data, index) => 4294967296 * (data[index + 1] / 1e6) + (data[index] >>> 0) / 1e6;
var epochMillisecondsToDate = (epochMs) => new Date(epochMs);
var epochDaysToDate = (data, index) => epochMillisecondsToDate(epochDaysToMs(data, index));
var epochMillisecondsLongToDate = (data, index) => epochMillisecondsToDate(epochMillisecondsLongToMs(data, index));
var getNull = (_data, _index) => null;
var getVariableWidthBytes = (values, valueOffsets, index) => {
  if (index + 1 >= valueOffsets.length) {
    return null;
  }
  const x2 = bigIntToNumber(valueOffsets[index]);
  const y2 = bigIntToNumber(valueOffsets[index + 1]);
  return values.subarray(x2, y2);
};
var getBool = ({ offset, values }, index) => {
  const idx = offset + index;
  const byte = values[idx >> 3];
  return (byte & 1 << idx % 8) !== 0;
};
var getDateDay = ({ values }, index) => epochDaysToDate(values, index);
var getDateMillisecond = ({ values }, index) => epochMillisecondsLongToDate(values, index * 2);
var getNumeric = ({ stride, values }, index) => values[stride * index];
var getFloat16 = ({ stride, values }, index) => uint16ToFloat64(values[stride * index]);
var getBigInts = ({ values }, index) => values[index];
var getFixedSizeBinary = ({ stride, values }, index) => values.subarray(stride * index, stride * (index + 1));
var getBinary = ({ values, valueOffsets }, index) => getVariableWidthBytes(values, valueOffsets, index);
var getUtf8 = ({ values, valueOffsets }, index) => {
  const bytes = getVariableWidthBytes(values, valueOffsets, index);
  return bytes !== null ? decodeUtf8(bytes) : null;
};
var getInt = ({ values }, index) => values[index];
var getFloat = ({ type, values }, index) => type.precision !== Precision.HALF ? values[index] : uint16ToFloat64(values[index]);
var getDate = (data, index) => data.type.unit === DateUnit.DAY ? getDateDay(data, index) : getDateMillisecond(data, index);
var getTimestampSecond = ({ values }, index) => 1e3 * epochMillisecondsLongToMs(values, index * 2);
var getTimestampMillisecond = ({ values }, index) => epochMillisecondsLongToMs(values, index * 2);
var getTimestampMicrosecond = ({ values }, index) => epochMicrosecondsLongToMs(values, index * 2);
var getTimestampNanosecond = ({ values }, index) => epochNanosecondsLongToMs(values, index * 2);
var getTimestamp = (data, index) => {
  switch (data.type.unit) {
    case TimeUnit.SECOND:
      return getTimestampSecond(data, index);
    case TimeUnit.MILLISECOND:
      return getTimestampMillisecond(data, index);
    case TimeUnit.MICROSECOND:
      return getTimestampMicrosecond(data, index);
    case TimeUnit.NANOSECOND:
      return getTimestampNanosecond(data, index);
  }
};
var getTimeSecond = ({ values }, index) => values[index];
var getTimeMillisecond = ({ values }, index) => values[index];
var getTimeMicrosecond = ({ values }, index) => values[index];
var getTimeNanosecond = ({ values }, index) => values[index];
var getTime = (data, index) => {
  switch (data.type.unit) {
    case TimeUnit.SECOND:
      return getTimeSecond(data, index);
    case TimeUnit.MILLISECOND:
      return getTimeMillisecond(data, index);
    case TimeUnit.MICROSECOND:
      return getTimeMicrosecond(data, index);
    case TimeUnit.NANOSECOND:
      return getTimeNanosecond(data, index);
  }
};
var getDecimal = ({ values, stride }, index) => BN.decimal(values.subarray(stride * index, stride * (index + 1)));
var getList = (data, index) => {
  const { valueOffsets, stride, children } = data;
  const { [index * stride]: begin, [index * stride + 1]: end } = valueOffsets;
  const child = children[0];
  const slice = child.slice(begin, end - begin);
  return new Vector([slice]);
};
var getMap = (data, index) => {
  const { valueOffsets, children } = data;
  const { [index]: begin, [index + 1]: end } = valueOffsets;
  const child = children[0];
  return new MapRow(child.slice(begin, end - begin));
};
var getStruct = (data, index) => {
  return new StructRow(data, index);
};
var getUnion = (data, index) => {
  return data.type.mode === UnionMode.Dense ? getDenseUnion(data, index) : getSparseUnion(data, index);
};
var getDenseUnion = (data, index) => {
  const childIndex = data.type.typeIdToChildIndex[data.typeIds[index]];
  const child = data.children[childIndex];
  return instance2.visit(child, data.valueOffsets[index]);
};
var getSparseUnion = (data, index) => {
  const childIndex = data.type.typeIdToChildIndex[data.typeIds[index]];
  const child = data.children[childIndex];
  return instance2.visit(child, index);
};
var getDictionary = (data, index) => {
  var _a5;
  return (_a5 = data.dictionary) === null || _a5 === void 0 ? void 0 : _a5.get(data.values[index]);
};
var getInterval = (data, index) => data.type.unit === IntervalUnit.DAY_TIME ? getIntervalDayTime(data, index) : getIntervalYearMonth(data, index);
var getIntervalDayTime = ({ values }, index) => values.subarray(2 * index, 2 * (index + 1));
var getIntervalYearMonth = ({ values }, index) => {
  const interval = values[index];
  const int32s = new Int32Array(2);
  int32s[0] = Math.trunc(interval / 12);
  int32s[1] = Math.trunc(interval % 12);
  return int32s;
};
var getDurationSecond = ({ values }, index) => values[index];
var getDurationMillisecond = ({ values }, index) => values[index];
var getDurationMicrosecond = ({ values }, index) => values[index];
var getDurationNanosecond = ({ values }, index) => values[index];
var getDuration = (data, index) => {
  switch (data.type.unit) {
    case TimeUnit.SECOND:
      return getDurationSecond(data, index);
    case TimeUnit.MILLISECOND:
      return getDurationMillisecond(data, index);
    case TimeUnit.MICROSECOND:
      return getDurationMicrosecond(data, index);
    case TimeUnit.NANOSECOND:
      return getDurationNanosecond(data, index);
  }
};
var getFixedSizeList = (data, index) => {
  const { stride, children } = data;
  const child = children[0];
  const slice = child.slice(index * stride, stride);
  return new Vector([slice]);
};
GetVisitor.prototype.visitNull = wrapGet(getNull);
GetVisitor.prototype.visitBool = wrapGet(getBool);
GetVisitor.prototype.visitInt = wrapGet(getInt);
GetVisitor.prototype.visitInt8 = wrapGet(getNumeric);
GetVisitor.prototype.visitInt16 = wrapGet(getNumeric);
GetVisitor.prototype.visitInt32 = wrapGet(getNumeric);
GetVisitor.prototype.visitInt64 = wrapGet(getBigInts);
GetVisitor.prototype.visitUint8 = wrapGet(getNumeric);
GetVisitor.prototype.visitUint16 = wrapGet(getNumeric);
GetVisitor.prototype.visitUint32 = wrapGet(getNumeric);
GetVisitor.prototype.visitUint64 = wrapGet(getBigInts);
GetVisitor.prototype.visitFloat = wrapGet(getFloat);
GetVisitor.prototype.visitFloat16 = wrapGet(getFloat16);
GetVisitor.prototype.visitFloat32 = wrapGet(getNumeric);
GetVisitor.prototype.visitFloat64 = wrapGet(getNumeric);
GetVisitor.prototype.visitUtf8 = wrapGet(getUtf8);
GetVisitor.prototype.visitLargeUtf8 = wrapGet(getUtf8);
GetVisitor.prototype.visitBinary = wrapGet(getBinary);
GetVisitor.prototype.visitLargeBinary = wrapGet(getBinary);
GetVisitor.prototype.visitFixedSizeBinary = wrapGet(getFixedSizeBinary);
GetVisitor.prototype.visitDate = wrapGet(getDate);
GetVisitor.prototype.visitDateDay = wrapGet(getDateDay);
GetVisitor.prototype.visitDateMillisecond = wrapGet(getDateMillisecond);
GetVisitor.prototype.visitTimestamp = wrapGet(getTimestamp);
GetVisitor.prototype.visitTimestampSecond = wrapGet(getTimestampSecond);
GetVisitor.prototype.visitTimestampMillisecond = wrapGet(getTimestampMillisecond);
GetVisitor.prototype.visitTimestampMicrosecond = wrapGet(getTimestampMicrosecond);
GetVisitor.prototype.visitTimestampNanosecond = wrapGet(getTimestampNanosecond);
GetVisitor.prototype.visitTime = wrapGet(getTime);
GetVisitor.prototype.visitTimeSecond = wrapGet(getTimeSecond);
GetVisitor.prototype.visitTimeMillisecond = wrapGet(getTimeMillisecond);
GetVisitor.prototype.visitTimeMicrosecond = wrapGet(getTimeMicrosecond);
GetVisitor.prototype.visitTimeNanosecond = wrapGet(getTimeNanosecond);
GetVisitor.prototype.visitDecimal = wrapGet(getDecimal);
GetVisitor.prototype.visitList = wrapGet(getList);
GetVisitor.prototype.visitStruct = wrapGet(getStruct);
GetVisitor.prototype.visitUnion = wrapGet(getUnion);
GetVisitor.prototype.visitDenseUnion = wrapGet(getDenseUnion);
GetVisitor.prototype.visitSparseUnion = wrapGet(getSparseUnion);
GetVisitor.prototype.visitDictionary = wrapGet(getDictionary);
GetVisitor.prototype.visitInterval = wrapGet(getInterval);
GetVisitor.prototype.visitIntervalDayTime = wrapGet(getIntervalDayTime);
GetVisitor.prototype.visitIntervalYearMonth = wrapGet(getIntervalYearMonth);
GetVisitor.prototype.visitDuration = wrapGet(getDuration);
GetVisitor.prototype.visitDurationSecond = wrapGet(getDurationSecond);
GetVisitor.prototype.visitDurationMillisecond = wrapGet(getDurationMillisecond);
GetVisitor.prototype.visitDurationMicrosecond = wrapGet(getDurationMicrosecond);
GetVisitor.prototype.visitDurationNanosecond = wrapGet(getDurationNanosecond);
GetVisitor.prototype.visitFixedSizeList = wrapGet(getFixedSizeList);
GetVisitor.prototype.visitMap = wrapGet(getMap);
var instance2 = new GetVisitor();

// ../core/node_modules/apache-arrow/row/map.mjs
var kKeys = Symbol.for("keys");
var kVals = Symbol.for("vals");
var MapRow = class {
  constructor(slice) {
    this[kKeys] = new Vector([slice.children[0]]).memoize();
    this[kVals] = slice.children[1];
    return new Proxy(this, new MapRowProxyHandler());
  }
  [Symbol.iterator]() {
    return new MapRowIterator(this[kKeys], this[kVals]);
  }
  get size() {
    return this[kKeys].length;
  }
  toArray() {
    return Object.values(this.toJSON());
  }
  toJSON() {
    const keys = this[kKeys];
    const vals = this[kVals];
    const json = {};
    for (let i = -1, n = keys.length; ++i < n; ) {
      json[keys.get(i)] = instance2.visit(vals, i);
    }
    return json;
  }
  toString() {
    return `{${[...this].map(([key, val]) => `${valueToString(key)}: ${valueToString(val)}`).join(", ")}}`;
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.toString();
  }
};
var MapRowIterator = class {
  constructor(keys, vals) {
    this.keys = keys;
    this.vals = vals;
    this.keyIndex = 0;
    this.numKeys = keys.length;
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    const i = this.keyIndex;
    if (i === this.numKeys) {
      return { done: true, value: null };
    }
    this.keyIndex++;
    return {
      done: false,
      value: [
        this.keys.get(i),
        instance2.visit(this.vals, i)
      ]
    };
  }
};
var MapRowProxyHandler = class {
  isExtensible() {
    return false;
  }
  deleteProperty() {
    return false;
  }
  preventExtensions() {
    return true;
  }
  ownKeys(row) {
    return row[kKeys].toArray().map(String);
  }
  has(row, key) {
    return row[kKeys].includes(key);
  }
  getOwnPropertyDescriptor(row, key) {
    const idx = row[kKeys].indexOf(key);
    if (idx !== -1) {
      return { writable: true, enumerable: true, configurable: true };
    }
    return;
  }
  get(row, key) {
    if (Reflect.has(row, key)) {
      return row[key];
    }
    const idx = row[kKeys].indexOf(key);
    if (idx !== -1) {
      const val = instance2.visit(Reflect.get(row, kVals), idx);
      Reflect.set(row, key, val);
      return val;
    }
  }
  set(row, key, val) {
    const idx = row[kKeys].indexOf(key);
    if (idx !== -1) {
      instance.visit(Reflect.get(row, kVals), idx, val);
      return Reflect.set(row, key, val);
    } else if (Reflect.has(row, key)) {
      return Reflect.set(row, key, val);
    }
    return false;
  }
};
Object.defineProperties(MapRow.prototype, {
  [Symbol.toStringTag]: { enumerable: false, configurable: false, value: "Row" },
  [kKeys]: { writable: true, enumerable: false, configurable: false, value: null },
  [kVals]: { writable: true, enumerable: false, configurable: false, value: null }
});

// ../core/node_modules/apache-arrow/util/vector.mjs
function clampIndex(source, index, then) {
  const length2 = source.length;
  const adjust = index > -1 ? index : length2 + index % length2;
  return then ? then(source, adjust) : adjust;
}
var tmp;
function clampRange(source, begin, end, then) {
  const { length: len = 0 } = source;
  let lhs = typeof begin !== "number" ? 0 : begin;
  let rhs = typeof end !== "number" ? len : end;
  lhs < 0 && (lhs = (lhs % len + len) % len);
  rhs < 0 && (rhs = (rhs % len + len) % len);
  rhs < lhs && (tmp = lhs, lhs = rhs, rhs = tmp);
  rhs > len && (rhs = len);
  return then ? then(source, lhs, rhs) : [lhs, rhs];
}
var isNaNFast = (value) => value !== value;
function createElementComparator(search2) {
  const typeofSearch = typeof search2;
  if (typeofSearch !== "object" || search2 === null) {
    if (isNaNFast(search2)) {
      return isNaNFast;
    }
    return (value) => value === search2;
  }
  if (search2 instanceof Date) {
    const valueOfSearch = search2.valueOf();
    return (value) => value instanceof Date ? value.valueOf() === valueOfSearch : false;
  }
  if (ArrayBuffer.isView(search2)) {
    return (value) => value ? compareArrayLike(search2, value) : false;
  }
  if (search2 instanceof Map) {
    return createMapComparator(search2);
  }
  if (Array.isArray(search2)) {
    return createArrayLikeComparator(search2);
  }
  if (search2 instanceof Vector) {
    return createVectorComparator(search2);
  }
  return createObjectComparator(search2, true);
}
function createArrayLikeComparator(lhs) {
  const comparators = [];
  for (let i = -1, n = lhs.length; ++i < n; ) {
    comparators[i] = createElementComparator(lhs[i]);
  }
  return createSubElementsComparator(comparators);
}
function createMapComparator(lhs) {
  let i = -1;
  const comparators = [];
  for (const v of lhs.values())
    comparators[++i] = createElementComparator(v);
  return createSubElementsComparator(comparators);
}
function createVectorComparator(lhs) {
  const comparators = [];
  for (let i = -1, n = lhs.length; ++i < n; ) {
    comparators[i] = createElementComparator(lhs.get(i));
  }
  return createSubElementsComparator(comparators);
}
function createObjectComparator(lhs, allowEmpty = false) {
  const keys = Object.keys(lhs);
  if (!allowEmpty && keys.length === 0) {
    return () => false;
  }
  const comparators = [];
  for (let i = -1, n = keys.length; ++i < n; ) {
    comparators[i] = createElementComparator(lhs[keys[i]]);
  }
  return createSubElementsComparator(comparators, keys);
}
function createSubElementsComparator(comparators, keys) {
  return (rhs) => {
    if (!rhs || typeof rhs !== "object") {
      return false;
    }
    switch (rhs.constructor) {
      case Array:
        return compareArray(comparators, rhs);
      case Map:
        return compareObject(comparators, rhs, rhs.keys());
      case MapRow:
      case StructRow:
      case Object:
      case void 0:
        return compareObject(comparators, rhs, keys || Object.keys(rhs));
    }
    return rhs instanceof Vector ? compareVector(comparators, rhs) : false;
  };
}
function compareArray(comparators, arr) {
  const n = comparators.length;
  if (arr.length !== n) {
    return false;
  }
  for (let i = -1; ++i < n; ) {
    if (!comparators[i](arr[i])) {
      return false;
    }
  }
  return true;
}
function compareVector(comparators, vec) {
  const n = comparators.length;
  if (vec.length !== n) {
    return false;
  }
  for (let i = -1; ++i < n; ) {
    if (!comparators[i](vec.get(i))) {
      return false;
    }
  }
  return true;
}
function compareObject(comparators, obj, keys) {
  const lKeyItr = keys[Symbol.iterator]();
  const rKeyItr = obj instanceof Map ? obj.keys() : Object.keys(obj)[Symbol.iterator]();
  const rValItr = obj instanceof Map ? obj.values() : Object.values(obj)[Symbol.iterator]();
  let i = 0;
  const n = comparators.length;
  let rVal = rValItr.next();
  let lKey = lKeyItr.next();
  let rKey = rKeyItr.next();
  for (; i < n && !lKey.done && !rKey.done && !rVal.done; ++i, lKey = lKeyItr.next(), rKey = rKeyItr.next(), rVal = rValItr.next()) {
    if (lKey.value !== rKey.value || !comparators[i](rVal.value)) {
      break;
    }
  }
  if (i === n && lKey.done && rKey.done && rVal.done) {
    return true;
  }
  lKeyItr.return && lKeyItr.return();
  rKeyItr.return && rKeyItr.return();
  rValItr.return && rValItr.return();
  return false;
}

// ../core/node_modules/apache-arrow/util/bit.mjs
var bit_exports = {};
__export(bit_exports, {
  BitIterator: () => BitIterator,
  getBit: () => getBit,
  getBool: () => getBool2,
  packBools: () => packBools,
  popcnt_array: () => popcnt_array,
  popcnt_bit_range: () => popcnt_bit_range,
  popcnt_uint32: () => popcnt_uint32,
  setBool: () => setBool2,
  truncateBitmap: () => truncateBitmap
});
function getBool2(_data, _index, byte, bit) {
  return (byte & 1 << bit) !== 0;
}
function getBit(_data, _index, byte, bit) {
  return (byte & 1 << bit) >> bit;
}
function setBool2(bytes, index, value) {
  return value ? !!(bytes[index >> 3] |= 1 << index % 8) || true : !(bytes[index >> 3] &= ~(1 << index % 8)) && false;
}
function truncateBitmap(offset, length2, bitmap) {
  const alignedSize = bitmap.byteLength + 7 & ~7;
  if (offset > 0 || bitmap.byteLength < alignedSize) {
    const bytes = new Uint8Array(alignedSize);
    bytes.set(offset % 8 === 0 ? bitmap.subarray(offset >> 3) : (
      // Otherwise iterate each bit from the offset and return a new one
      packBools(new BitIterator(bitmap, offset, length2, null, getBool2)).subarray(0, alignedSize)
    ));
    return bytes;
  }
  return bitmap;
}
function packBools(values) {
  const xs = [];
  let i = 0, bit = 0, byte = 0;
  for (const value of values) {
    value && (byte |= 1 << bit);
    if (++bit === 8) {
      xs[i++] = byte;
      byte = bit = 0;
    }
  }
  if (i === 0 || bit > 0) {
    xs[i++] = byte;
  }
  const b = new Uint8Array(xs.length + 7 & ~7);
  b.set(xs);
  return b;
}
var BitIterator = class {
  constructor(bytes, begin, length2, context, get) {
    this.bytes = bytes;
    this.length = length2;
    this.context = context;
    this.get = get;
    this.bit = begin % 8;
    this.byteIndex = begin >> 3;
    this.byte = bytes[this.byteIndex++];
    this.index = 0;
  }
  next() {
    if (this.index < this.length) {
      if (this.bit === 8) {
        this.bit = 0;
        this.byte = this.bytes[this.byteIndex++];
      }
      return {
        value: this.get(this.context, this.index++, this.byte, this.bit++)
      };
    }
    return { done: true, value: null };
  }
  [Symbol.iterator]() {
    return this;
  }
};
function popcnt_bit_range(data, lhs, rhs) {
  if (rhs - lhs <= 0) {
    return 0;
  }
  if (rhs - lhs < 8) {
    let sum2 = 0;
    for (const bit of new BitIterator(data, lhs, rhs - lhs, data, getBit)) {
      sum2 += bit;
    }
    return sum2;
  }
  const rhsInside = rhs >> 3 << 3;
  const lhsInside = lhs + (lhs % 8 === 0 ? 0 : 8 - lhs % 8);
  return (
    // Get the popcnt of bits between the left hand side, and the next highest multiple of 8
    popcnt_bit_range(data, lhs, lhsInside) + // Get the popcnt of bits between the right hand side, and the next lowest multiple of 8
    popcnt_bit_range(data, rhsInside, rhs) + // Get the popcnt of all bits between the left and right hand sides' multiples of 8
    popcnt_array(data, lhsInside >> 3, rhsInside - lhsInside >> 3)
  );
}
function popcnt_array(arr, byteOffset, byteLength) {
  let cnt = 0, pos = Math.trunc(byteOffset);
  const view = new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
  const len = byteLength === void 0 ? arr.byteLength : pos + byteLength;
  while (len - pos >= 4) {
    cnt += popcnt_uint32(view.getUint32(pos));
    pos += 4;
  }
  while (len - pos >= 2) {
    cnt += popcnt_uint32(view.getUint16(pos));
    pos += 2;
  }
  while (len - pos >= 1) {
    cnt += popcnt_uint32(view.getUint8(pos));
    pos += 1;
  }
  return cnt;
}
function popcnt_uint32(uint32) {
  let i = Math.trunc(uint32);
  i = i - (i >>> 1 & 1431655765);
  i = (i & 858993459) + (i >>> 2 & 858993459);
  return (i + (i >>> 4) & 252645135) * 16843009 >>> 24;
}

// ../core/node_modules/apache-arrow/data.mjs
var kUnknownNullCount = -1;
var Data = class _Data {
  get typeId() {
    return this.type.typeId;
  }
  get ArrayType() {
    return this.type.ArrayType;
  }
  get buffers() {
    return [this.valueOffsets, this.values, this.nullBitmap, this.typeIds];
  }
  get nullable() {
    if (this._nullCount !== 0) {
      const { type } = this;
      if (DataType.isSparseUnion(type)) {
        return this.children.some((child) => child.nullable);
      } else if (DataType.isDenseUnion(type)) {
        return this.children.some((child) => child.nullable);
      }
      return this.nullBitmap && this.nullBitmap.byteLength > 0;
    }
    return true;
  }
  get byteLength() {
    let byteLength = 0;
    const { valueOffsets, values, nullBitmap, typeIds } = this;
    valueOffsets && (byteLength += valueOffsets.byteLength);
    values && (byteLength += values.byteLength);
    nullBitmap && (byteLength += nullBitmap.byteLength);
    typeIds && (byteLength += typeIds.byteLength);
    return this.children.reduce((byteLength2, child) => byteLength2 + child.byteLength, byteLength);
  }
  get nullCount() {
    if (DataType.isUnion(this.type)) {
      return this.children.reduce((nullCount2, child) => nullCount2 + child.nullCount, 0);
    }
    let nullCount = this._nullCount;
    let nullBitmap;
    if (nullCount <= kUnknownNullCount && (nullBitmap = this.nullBitmap)) {
      this._nullCount = nullCount = this.length - popcnt_bit_range(nullBitmap, this.offset, this.offset + this.length);
    }
    return nullCount;
  }
  constructor(type, offset, length2, nullCount, buffers, children = [], dictionary) {
    this.type = type;
    this.children = children;
    this.dictionary = dictionary;
    this.offset = Math.floor(Math.max(offset || 0, 0));
    this.length = Math.floor(Math.max(length2 || 0, 0));
    this._nullCount = Math.floor(Math.max(nullCount || 0, -1));
    let buffer;
    if (buffers instanceof _Data) {
      this.stride = buffers.stride;
      this.values = buffers.values;
      this.typeIds = buffers.typeIds;
      this.nullBitmap = buffers.nullBitmap;
      this.valueOffsets = buffers.valueOffsets;
    } else {
      this.stride = strideForType(type);
      if (buffers) {
        (buffer = buffers[0]) && (this.valueOffsets = buffer);
        (buffer = buffers[1]) && (this.values = buffer);
        (buffer = buffers[2]) && (this.nullBitmap = buffer);
        (buffer = buffers[3]) && (this.typeIds = buffer);
      }
    }
  }
  getValid(index) {
    const { type } = this;
    if (DataType.isUnion(type)) {
      const union = type;
      const child = this.children[union.typeIdToChildIndex[this.typeIds[index]]];
      const indexInChild = union.mode === UnionMode.Dense ? this.valueOffsets[index] : index;
      return child.getValid(indexInChild);
    }
    if (this.nullable && this.nullCount > 0) {
      const pos = this.offset + index;
      const val = this.nullBitmap[pos >> 3];
      return (val & 1 << pos % 8) !== 0;
    }
    return true;
  }
  setValid(index, value) {
    let prev;
    const { type } = this;
    if (DataType.isUnion(type)) {
      const union = type;
      const child = this.children[union.typeIdToChildIndex[this.typeIds[index]]];
      const indexInChild = union.mode === UnionMode.Dense ? this.valueOffsets[index] : index;
      prev = child.getValid(indexInChild);
      child.setValid(indexInChild, value);
    } else {
      let { nullBitmap } = this;
      const { offset, length: length2 } = this;
      const idx = offset + index;
      const mask = 1 << idx % 8;
      const byteOffset = idx >> 3;
      if (!nullBitmap || nullBitmap.byteLength <= byteOffset) {
        nullBitmap = new Uint8Array((offset + length2 + 63 & ~63) >> 3).fill(255);
        if (this.nullCount > 0) {
          nullBitmap.set(truncateBitmap(offset, length2, this.nullBitmap), 0);
        }
        Object.assign(this, { nullBitmap, _nullCount: -1 });
      }
      const byte = nullBitmap[byteOffset];
      prev = (byte & mask) !== 0;
      value ? nullBitmap[byteOffset] = byte | mask : nullBitmap[byteOffset] = byte & ~mask;
    }
    if (prev !== !!value) {
      this._nullCount = this.nullCount + (value ? -1 : 1);
    }
    return value;
  }
  clone(type = this.type, offset = this.offset, length2 = this.length, nullCount = this._nullCount, buffers = this, children = this.children) {
    return new _Data(type, offset, length2, nullCount, buffers, children, this.dictionary);
  }
  slice(offset, length2) {
    const { stride, typeId, children } = this;
    const nullCount = +(this._nullCount === 0) - 1;
    const childStride = typeId === 16 ? stride : 1;
    const buffers = this._sliceBuffers(offset, length2, stride, typeId);
    return this.clone(
      this.type,
      this.offset + offset,
      length2,
      nullCount,
      buffers,
      // Don't slice children if we have value offsets (the variable-width types)
      children.length === 0 || this.valueOffsets ? children : this._sliceChildren(children, childStride * offset, childStride * length2)
    );
  }
  _changeLengthAndBackfillNullBitmap(newLength) {
    if (this.typeId === Type2.Null) {
      return this.clone(this.type, 0, newLength, 0);
    }
    const { length: length2, nullCount } = this;
    const bitmap = new Uint8Array((newLength + 63 & ~63) >> 3).fill(255, 0, length2 >> 3);
    bitmap[length2 >> 3] = (1 << length2 - (length2 & ~7)) - 1;
    if (nullCount > 0) {
      bitmap.set(truncateBitmap(this.offset, length2, this.nullBitmap), 0);
    }
    const buffers = this.buffers;
    buffers[BufferType.VALIDITY] = bitmap;
    return this.clone(this.type, 0, newLength, nullCount + (newLength - length2), buffers);
  }
  _sliceBuffers(offset, length2, stride, typeId) {
    let arr;
    const { buffers } = this;
    (arr = buffers[BufferType.TYPE]) && (buffers[BufferType.TYPE] = arr.subarray(offset, offset + length2));
    (arr = buffers[BufferType.OFFSET]) && (buffers[BufferType.OFFSET] = arr.subarray(offset, offset + length2 + 1)) || // Otherwise if no offsets, slice the data buffer. Don't slice the data vector for Booleans, since the offset goes by bits not bytes
    (arr = buffers[BufferType.DATA]) && (buffers[BufferType.DATA] = typeId === 6 ? arr : arr.subarray(stride * offset, stride * (offset + length2)));
    return buffers;
  }
  _sliceChildren(children, offset, length2) {
    return children.map((child) => child.slice(offset, length2));
  }
};
Data.prototype.children = Object.freeze([]);
var MakeDataVisitor = class _MakeDataVisitor extends Visitor {
  visit(props) {
    return this.getVisitFn(props["type"]).call(this, props);
  }
  visitNull(props) {
    const { ["type"]: type, ["offset"]: offset = 0, ["length"]: length2 = 0 } = props;
    return new Data(type, offset, length2, length2);
  }
  visitBool(props) {
    const { ["type"]: type, ["offset"]: offset = 0 } = props;
    const nullBitmap = toUint8Array(props["nullBitmap"]);
    const data = toArrayBufferView(type.ArrayType, props["data"]);
    const { ["length"]: length2 = data.length >> 3, ["nullCount"]: nullCount = props["nullBitmap"] ? -1 : 0 } = props;
    return new Data(type, offset, length2, nullCount, [void 0, data, nullBitmap]);
  }
  visitInt(props) {
    const { ["type"]: type, ["offset"]: offset = 0 } = props;
    const nullBitmap = toUint8Array(props["nullBitmap"]);
    const data = toArrayBufferView(type.ArrayType, props["data"]);
    const { ["length"]: length2 = data.length, ["nullCount"]: nullCount = props["nullBitmap"] ? -1 : 0 } = props;
    return new Data(type, offset, length2, nullCount, [void 0, data, nullBitmap]);
  }
  visitFloat(props) {
    const { ["type"]: type, ["offset"]: offset = 0 } = props;
    const nullBitmap = toUint8Array(props["nullBitmap"]);
    const data = toArrayBufferView(type.ArrayType, props["data"]);
    const { ["length"]: length2 = data.length, ["nullCount"]: nullCount = props["nullBitmap"] ? -1 : 0 } = props;
    return new Data(type, offset, length2, nullCount, [void 0, data, nullBitmap]);
  }
  visitUtf8(props) {
    const { ["type"]: type, ["offset"]: offset = 0 } = props;
    const data = toUint8Array(props["data"]);
    const nullBitmap = toUint8Array(props["nullBitmap"]);
    const valueOffsets = toInt32Array(props["valueOffsets"]);
    const { ["length"]: length2 = valueOffsets.length - 1, ["nullCount"]: nullCount = props["nullBitmap"] ? -1 : 0 } = props;
    return new Data(type, offset, length2, nullCount, [valueOffsets, data, nullBitmap]);
  }
  visitLargeUtf8(props) {
    const { ["type"]: type, ["offset"]: offset = 0 } = props;
    const data = toUint8Array(props["data"]);
    const nullBitmap = toUint8Array(props["nullBitmap"]);
    const valueOffsets = toBigInt64Array(props["valueOffsets"]);
    const { ["length"]: length2 = valueOffsets.length - 1, ["nullCount"]: nullCount = props["nullBitmap"] ? -1 : 0 } = props;
    return new Data(type, offset, length2, nullCount, [valueOffsets, data, nullBitmap]);
  }
  visitBinary(props) {
    const { ["type"]: type, ["offset"]: offset = 0 } = props;
    const data = toUint8Array(props["data"]);
    const nullBitmap = toUint8Array(props["nullBitmap"]);
    const valueOffsets = toInt32Array(props["valueOffsets"]);
    const { ["length"]: length2 = valueOffsets.length - 1, ["nullCount"]: nullCount = props["nullBitmap"] ? -1 : 0 } = props;
    return new Data(type, offset, length2, nullCount, [valueOffsets, data, nullBitmap]);
  }
  visitLargeBinary(props) {
    const { ["type"]: type, ["offset"]: offset = 0 } = props;
    const data = toUint8Array(props["data"]);
    const nullBitmap = toUint8Array(props["nullBitmap"]);
    const valueOffsets = toBigInt64Array(props["valueOffsets"]);
    const { ["length"]: length2 = valueOffsets.length - 1, ["nullCount"]: nullCount = props["nullBitmap"] ? -1 : 0 } = props;
    return new Data(type, offset, length2, nullCount, [valueOffsets, data, nullBitmap]);
  }
  visitFixedSizeBinary(props) {
    const { ["type"]: type, ["offset"]: offset = 0 } = props;
    const nullBitmap = toUint8Array(props["nullBitmap"]);
    const data = toArrayBufferView(type.ArrayType, props["data"]);
    const { ["length"]: length2 = data.length / strideForType(type), ["nullCount"]: nullCount = props["nullBitmap"] ? -1 : 0 } = props;
    return new Data(type, offset, length2, nullCount, [void 0, data, nullBitmap]);
  }
  visitDate(props) {
    const { ["type"]: type, ["offset"]: offset = 0 } = props;
    const nullBitmap = toUint8Array(props["nullBitmap"]);
    const data = toArrayBufferView(type.ArrayType, props["data"]);
    const { ["length"]: length2 = data.length / strideForType(type), ["nullCount"]: nullCount = props["nullBitmap"] ? -1 : 0 } = props;
    return new Data(type, offset, length2, nullCount, [void 0, data, nullBitmap]);
  }
  visitTimestamp(props) {
    const { ["type"]: type, ["offset"]: offset = 0 } = props;
    const nullBitmap = toUint8Array(props["nullBitmap"]);
    const data = toArrayBufferView(type.ArrayType, props["data"]);
    const { ["length"]: length2 = data.length / strideForType(type), ["nullCount"]: nullCount = props["nullBitmap"] ? -1 : 0 } = props;
    return new Data(type, offset, length2, nullCount, [void 0, data, nullBitmap]);
  }
  visitTime(props) {
    const { ["type"]: type, ["offset"]: offset = 0 } = props;
    const nullBitmap = toUint8Array(props["nullBitmap"]);
    const data = toArrayBufferView(type.ArrayType, props["data"]);
    const { ["length"]: length2 = data.length / strideForType(type), ["nullCount"]: nullCount = props["nullBitmap"] ? -1 : 0 } = props;
    return new Data(type, offset, length2, nullCount, [void 0, data, nullBitmap]);
  }
  visitDecimal(props) {
    const { ["type"]: type, ["offset"]: offset = 0 } = props;
    const nullBitmap = toUint8Array(props["nullBitmap"]);
    const data = toArrayBufferView(type.ArrayType, props["data"]);
    const { ["length"]: length2 = data.length / strideForType(type), ["nullCount"]: nullCount = props["nullBitmap"] ? -1 : 0 } = props;
    return new Data(type, offset, length2, nullCount, [void 0, data, nullBitmap]);
  }
  visitList(props) {
    const { ["type"]: type, ["offset"]: offset = 0, ["child"]: child } = props;
    const nullBitmap = toUint8Array(props["nullBitmap"]);
    const valueOffsets = toInt32Array(props["valueOffsets"]);
    const { ["length"]: length2 = valueOffsets.length - 1, ["nullCount"]: nullCount = props["nullBitmap"] ? -1 : 0 } = props;
    return new Data(type, offset, length2, nullCount, [valueOffsets, void 0, nullBitmap], [child]);
  }
  visitStruct(props) {
    const { ["type"]: type, ["offset"]: offset = 0, ["children"]: children = [] } = props;
    const nullBitmap = toUint8Array(props["nullBitmap"]);
    const { length: length2 = children.reduce((len, { length: length3 }) => Math.max(len, length3), 0), nullCount = props["nullBitmap"] ? -1 : 0 } = props;
    return new Data(type, offset, length2, nullCount, [void 0, void 0, nullBitmap], children);
  }
  visitUnion(props) {
    const { ["type"]: type, ["offset"]: offset = 0, ["children"]: children = [] } = props;
    const typeIds = toArrayBufferView(type.ArrayType, props["typeIds"]);
    const { ["length"]: length2 = typeIds.length, ["nullCount"]: nullCount = -1 } = props;
    if (DataType.isSparseUnion(type)) {
      return new Data(type, offset, length2, nullCount, [void 0, void 0, void 0, typeIds], children);
    }
    const valueOffsets = toInt32Array(props["valueOffsets"]);
    return new Data(type, offset, length2, nullCount, [valueOffsets, void 0, void 0, typeIds], children);
  }
  visitDictionary(props) {
    const { ["type"]: type, ["offset"]: offset = 0 } = props;
    const nullBitmap = toUint8Array(props["nullBitmap"]);
    const data = toArrayBufferView(type.indices.ArrayType, props["data"]);
    const { ["dictionary"]: dictionary = new Vector([new _MakeDataVisitor().visit({ type: type.dictionary })]) } = props;
    const { ["length"]: length2 = data.length, ["nullCount"]: nullCount = props["nullBitmap"] ? -1 : 0 } = props;
    return new Data(type, offset, length2, nullCount, [void 0, data, nullBitmap], [], dictionary);
  }
  visitInterval(props) {
    const { ["type"]: type, ["offset"]: offset = 0 } = props;
    const nullBitmap = toUint8Array(props["nullBitmap"]);
    const data = toArrayBufferView(type.ArrayType, props["data"]);
    const { ["length"]: length2 = data.length / strideForType(type), ["nullCount"]: nullCount = props["nullBitmap"] ? -1 : 0 } = props;
    return new Data(type, offset, length2, nullCount, [void 0, data, nullBitmap]);
  }
  visitDuration(props) {
    const { ["type"]: type, ["offset"]: offset = 0 } = props;
    const nullBitmap = toUint8Array(props["nullBitmap"]);
    const data = toArrayBufferView(type.ArrayType, props["data"]);
    const { ["length"]: length2 = data.length, ["nullCount"]: nullCount = props["nullBitmap"] ? -1 : 0 } = props;
    return new Data(type, offset, length2, nullCount, [void 0, data, nullBitmap]);
  }
  visitFixedSizeList(props) {
    const { ["type"]: type, ["offset"]: offset = 0, ["child"]: child = new _MakeDataVisitor().visit({ type: type.valueType }) } = props;
    const nullBitmap = toUint8Array(props["nullBitmap"]);
    const { ["length"]: length2 = child.length / strideForType(type), ["nullCount"]: nullCount = props["nullBitmap"] ? -1 : 0 } = props;
    return new Data(type, offset, length2, nullCount, [void 0, void 0, nullBitmap], [child]);
  }
  visitMap(props) {
    const { ["type"]: type, ["offset"]: offset = 0, ["child"]: child = new _MakeDataVisitor().visit({ type: type.childType }) } = props;
    const nullBitmap = toUint8Array(props["nullBitmap"]);
    const valueOffsets = toInt32Array(props["valueOffsets"]);
    const { ["length"]: length2 = valueOffsets.length - 1, ["nullCount"]: nullCount = props["nullBitmap"] ? -1 : 0 } = props;
    return new Data(type, offset, length2, nullCount, [valueOffsets, void 0, nullBitmap], [child]);
  }
};
var makeDataVisitor = new MakeDataVisitor();
function makeData(props) {
  return makeDataVisitor.visit(props);
}

// ../core/node_modules/apache-arrow/util/chunk.mjs
var ChunkedIterator = class {
  constructor(numChunks = 0, getChunkIterator) {
    this.numChunks = numChunks;
    this.getChunkIterator = getChunkIterator;
    this.chunkIndex = 0;
    this.chunkIterator = this.getChunkIterator(0);
  }
  next() {
    while (this.chunkIndex < this.numChunks) {
      const next = this.chunkIterator.next();
      if (!next.done) {
        return next;
      }
      if (++this.chunkIndex < this.numChunks) {
        this.chunkIterator = this.getChunkIterator(this.chunkIndex);
      }
    }
    return { done: true, value: null };
  }
  [Symbol.iterator]() {
    return this;
  }
};
function computeChunkNullable(chunks) {
  return chunks.some((chunk) => chunk.nullable);
}
function computeChunkNullCounts(chunks) {
  return chunks.reduce((nullCount, chunk) => nullCount + chunk.nullCount, 0);
}
function computeChunkOffsets(chunks) {
  return chunks.reduce((offsets, chunk, index) => {
    offsets[index + 1] = offsets[index] + chunk.length;
    return offsets;
  }, new Uint32Array(chunks.length + 1));
}
function sliceChunks(chunks, offsets, begin, end) {
  const slices = [];
  for (let i = -1, n = chunks.length; ++i < n; ) {
    const chunk = chunks[i];
    const offset = offsets[i];
    const { length: length2 } = chunk;
    if (offset >= end) {
      break;
    }
    if (begin >= offset + length2) {
      continue;
    }
    if (offset >= begin && offset + length2 <= end) {
      slices.push(chunk);
      continue;
    }
    const from = Math.max(0, begin - offset);
    const to = Math.min(end - offset, length2);
    slices.push(chunk.slice(from, to - from));
  }
  if (slices.length === 0) {
    slices.push(chunks[0].slice(0, 0));
  }
  return slices;
}
function binarySearch(chunks, offsets, idx, fn) {
  let lhs = 0, mid = 0, rhs = offsets.length - 1;
  do {
    if (lhs >= rhs - 1) {
      return idx < offsets[rhs] ? fn(chunks, lhs, idx - offsets[lhs]) : null;
    }
    mid = lhs + Math.trunc((rhs - lhs) * 0.5);
    idx < offsets[mid] ? rhs = mid : lhs = mid;
  } while (lhs < rhs);
}
function isChunkedValid(data, index) {
  return data.getValid(index);
}
function wrapChunkedCall1(fn) {
  function chunkedFn(chunks, i, j) {
    return fn(chunks[i], j);
  }
  return function(index) {
    const data = this.data;
    return binarySearch(data, this._offsets, index, chunkedFn);
  };
}
function wrapChunkedCall2(fn) {
  let _2;
  function chunkedFn(chunks, i, j) {
    return fn(chunks[i], j, _2);
  }
  return function(index, value) {
    const data = this.data;
    _2 = value;
    const result = binarySearch(data, this._offsets, index, chunkedFn);
    _2 = void 0;
    return result;
  };
}
function wrapChunkedIndexOf(indexOf) {
  let _1;
  function chunkedIndexOf(data, chunkIndex, fromIndex) {
    let begin = fromIndex, index = 0, total = 0;
    for (let i = chunkIndex - 1, n = data.length; ++i < n; ) {
      const chunk = data[i];
      if (~(index = indexOf(chunk, _1, begin))) {
        return total + index;
      }
      begin = 0;
      total += chunk.length;
    }
    return -1;
  }
  return function(element, offset) {
    _1 = element;
    const data = this.data;
    const result = typeof offset !== "number" ? chunkedIndexOf(data, 0, 0) : binarySearch(data, this._offsets, offset, chunkedIndexOf);
    _1 = void 0;
    return result;
  };
}

// ../core/node_modules/apache-arrow/visitor/indexof.mjs
var IndexOfVisitor = class extends Visitor {
};
function nullIndexOf(data, searchElement) {
  return searchElement === null && data.length > 0 ? 0 : -1;
}
function indexOfNull(data, fromIndex) {
  const { nullBitmap } = data;
  if (!nullBitmap || data.nullCount <= 0) {
    return -1;
  }
  let i = 0;
  for (const isValid of new BitIterator(nullBitmap, data.offset + (fromIndex || 0), data.length, nullBitmap, getBool2)) {
    if (!isValid) {
      return i;
    }
    ++i;
  }
  return -1;
}
function indexOfValue(data, searchElement, fromIndex) {
  if (searchElement === void 0) {
    return -1;
  }
  if (searchElement === null) {
    switch (data.typeId) {
      case Type2.Union:
        break;
      case Type2.Dictionary:
        break;
      default:
        return indexOfNull(data, fromIndex);
    }
  }
  const get = instance2.getVisitFn(data);
  const compare = createElementComparator(searchElement);
  for (let i = (fromIndex || 0) - 1, n = data.length; ++i < n; ) {
    if (compare(get(data, i))) {
      return i;
    }
  }
  return -1;
}
function indexOfUnion(data, searchElement, fromIndex) {
  const get = instance2.getVisitFn(data);
  const compare = createElementComparator(searchElement);
  for (let i = (fromIndex || 0) - 1, n = data.length; ++i < n; ) {
    if (compare(get(data, i))) {
      return i;
    }
  }
  return -1;
}
IndexOfVisitor.prototype.visitNull = nullIndexOf;
IndexOfVisitor.prototype.visitBool = indexOfValue;
IndexOfVisitor.prototype.visitInt = indexOfValue;
IndexOfVisitor.prototype.visitInt8 = indexOfValue;
IndexOfVisitor.prototype.visitInt16 = indexOfValue;
IndexOfVisitor.prototype.visitInt32 = indexOfValue;
IndexOfVisitor.prototype.visitInt64 = indexOfValue;
IndexOfVisitor.prototype.visitUint8 = indexOfValue;
IndexOfVisitor.prototype.visitUint16 = indexOfValue;
IndexOfVisitor.prototype.visitUint32 = indexOfValue;
IndexOfVisitor.prototype.visitUint64 = indexOfValue;
IndexOfVisitor.prototype.visitFloat = indexOfValue;
IndexOfVisitor.prototype.visitFloat16 = indexOfValue;
IndexOfVisitor.prototype.visitFloat32 = indexOfValue;
IndexOfVisitor.prototype.visitFloat64 = indexOfValue;
IndexOfVisitor.prototype.visitUtf8 = indexOfValue;
IndexOfVisitor.prototype.visitLargeUtf8 = indexOfValue;
IndexOfVisitor.prototype.visitBinary = indexOfValue;
IndexOfVisitor.prototype.visitLargeBinary = indexOfValue;
IndexOfVisitor.prototype.visitFixedSizeBinary = indexOfValue;
IndexOfVisitor.prototype.visitDate = indexOfValue;
IndexOfVisitor.prototype.visitDateDay = indexOfValue;
IndexOfVisitor.prototype.visitDateMillisecond = indexOfValue;
IndexOfVisitor.prototype.visitTimestamp = indexOfValue;
IndexOfVisitor.prototype.visitTimestampSecond = indexOfValue;
IndexOfVisitor.prototype.visitTimestampMillisecond = indexOfValue;
IndexOfVisitor.prototype.visitTimestampMicrosecond = indexOfValue;
IndexOfVisitor.prototype.visitTimestampNanosecond = indexOfValue;
IndexOfVisitor.prototype.visitTime = indexOfValue;
IndexOfVisitor.prototype.visitTimeSecond = indexOfValue;
IndexOfVisitor.prototype.visitTimeMillisecond = indexOfValue;
IndexOfVisitor.prototype.visitTimeMicrosecond = indexOfValue;
IndexOfVisitor.prototype.visitTimeNanosecond = indexOfValue;
IndexOfVisitor.prototype.visitDecimal = indexOfValue;
IndexOfVisitor.prototype.visitList = indexOfValue;
IndexOfVisitor.prototype.visitStruct = indexOfValue;
IndexOfVisitor.prototype.visitUnion = indexOfValue;
IndexOfVisitor.prototype.visitDenseUnion = indexOfUnion;
IndexOfVisitor.prototype.visitSparseUnion = indexOfUnion;
IndexOfVisitor.prototype.visitDictionary = indexOfValue;
IndexOfVisitor.prototype.visitInterval = indexOfValue;
IndexOfVisitor.prototype.visitIntervalDayTime = indexOfValue;
IndexOfVisitor.prototype.visitIntervalYearMonth = indexOfValue;
IndexOfVisitor.prototype.visitDuration = indexOfValue;
IndexOfVisitor.prototype.visitDurationSecond = indexOfValue;
IndexOfVisitor.prototype.visitDurationMillisecond = indexOfValue;
IndexOfVisitor.prototype.visitDurationMicrosecond = indexOfValue;
IndexOfVisitor.prototype.visitDurationNanosecond = indexOfValue;
IndexOfVisitor.prototype.visitFixedSizeList = indexOfValue;
IndexOfVisitor.prototype.visitMap = indexOfValue;
var instance3 = new IndexOfVisitor();

// ../core/node_modules/apache-arrow/visitor/iterator.mjs
var IteratorVisitor = class extends Visitor {
};
function vectorIterator(vector) {
  const { type } = vector;
  if (vector.nullCount === 0 && vector.stride === 1 && (type.typeId === Type2.Timestamp || type instanceof Int_ && type.bitWidth !== 64 || type instanceof Time_ && type.bitWidth !== 64 || type instanceof Float && type.precision !== Precision.HALF)) {
    return new ChunkedIterator(vector.data.length, (chunkIndex) => {
      const data = vector.data[chunkIndex];
      return data.values.subarray(0, data.length)[Symbol.iterator]();
    });
  }
  let offset = 0;
  return new ChunkedIterator(vector.data.length, (chunkIndex) => {
    const data = vector.data[chunkIndex];
    const length2 = data.length;
    const inner = vector.slice(offset, offset + length2);
    offset += length2;
    return new VectorIterator(inner);
  });
}
var VectorIterator = class {
  constructor(vector) {
    this.vector = vector;
    this.index = 0;
  }
  next() {
    if (this.index < this.vector.length) {
      return {
        value: this.vector.get(this.index++)
      };
    }
    return { done: true, value: null };
  }
  [Symbol.iterator]() {
    return this;
  }
};
IteratorVisitor.prototype.visitNull = vectorIterator;
IteratorVisitor.prototype.visitBool = vectorIterator;
IteratorVisitor.prototype.visitInt = vectorIterator;
IteratorVisitor.prototype.visitInt8 = vectorIterator;
IteratorVisitor.prototype.visitInt16 = vectorIterator;
IteratorVisitor.prototype.visitInt32 = vectorIterator;
IteratorVisitor.prototype.visitInt64 = vectorIterator;
IteratorVisitor.prototype.visitUint8 = vectorIterator;
IteratorVisitor.prototype.visitUint16 = vectorIterator;
IteratorVisitor.prototype.visitUint32 = vectorIterator;
IteratorVisitor.prototype.visitUint64 = vectorIterator;
IteratorVisitor.prototype.visitFloat = vectorIterator;
IteratorVisitor.prototype.visitFloat16 = vectorIterator;
IteratorVisitor.prototype.visitFloat32 = vectorIterator;
IteratorVisitor.prototype.visitFloat64 = vectorIterator;
IteratorVisitor.prototype.visitUtf8 = vectorIterator;
IteratorVisitor.prototype.visitLargeUtf8 = vectorIterator;
IteratorVisitor.prototype.visitBinary = vectorIterator;
IteratorVisitor.prototype.visitLargeBinary = vectorIterator;
IteratorVisitor.prototype.visitFixedSizeBinary = vectorIterator;
IteratorVisitor.prototype.visitDate = vectorIterator;
IteratorVisitor.prototype.visitDateDay = vectorIterator;
IteratorVisitor.prototype.visitDateMillisecond = vectorIterator;
IteratorVisitor.prototype.visitTimestamp = vectorIterator;
IteratorVisitor.prototype.visitTimestampSecond = vectorIterator;
IteratorVisitor.prototype.visitTimestampMillisecond = vectorIterator;
IteratorVisitor.prototype.visitTimestampMicrosecond = vectorIterator;
IteratorVisitor.prototype.visitTimestampNanosecond = vectorIterator;
IteratorVisitor.prototype.visitTime = vectorIterator;
IteratorVisitor.prototype.visitTimeSecond = vectorIterator;
IteratorVisitor.prototype.visitTimeMillisecond = vectorIterator;
IteratorVisitor.prototype.visitTimeMicrosecond = vectorIterator;
IteratorVisitor.prototype.visitTimeNanosecond = vectorIterator;
IteratorVisitor.prototype.visitDecimal = vectorIterator;
IteratorVisitor.prototype.visitList = vectorIterator;
IteratorVisitor.prototype.visitStruct = vectorIterator;
IteratorVisitor.prototype.visitUnion = vectorIterator;
IteratorVisitor.prototype.visitDenseUnion = vectorIterator;
IteratorVisitor.prototype.visitSparseUnion = vectorIterator;
IteratorVisitor.prototype.visitDictionary = vectorIterator;
IteratorVisitor.prototype.visitInterval = vectorIterator;
IteratorVisitor.prototype.visitIntervalDayTime = vectorIterator;
IteratorVisitor.prototype.visitIntervalYearMonth = vectorIterator;
IteratorVisitor.prototype.visitDuration = vectorIterator;
IteratorVisitor.prototype.visitDurationSecond = vectorIterator;
IteratorVisitor.prototype.visitDurationMillisecond = vectorIterator;
IteratorVisitor.prototype.visitDurationMicrosecond = vectorIterator;
IteratorVisitor.prototype.visitDurationNanosecond = vectorIterator;
IteratorVisitor.prototype.visitFixedSizeList = vectorIterator;
IteratorVisitor.prototype.visitMap = vectorIterator;
var instance4 = new IteratorVisitor();

// ../core/node_modules/apache-arrow/vector.mjs
var _a2;
var visitorsByTypeId = {};
var vectorPrototypesByTypeId = {};
var Vector = class _Vector {
  constructor(input2) {
    var _b2, _c2, _d2;
    const data = input2[0] instanceof _Vector ? input2.flatMap((x2) => x2.data) : input2;
    if (data.length === 0 || data.some((x2) => !(x2 instanceof Data))) {
      throw new TypeError("Vector constructor expects an Array of Data instances.");
    }
    const type = (_b2 = data[0]) === null || _b2 === void 0 ? void 0 : _b2.type;
    switch (data.length) {
      case 0:
        this._offsets = [0];
        break;
      case 1: {
        const { get, set, indexOf } = visitorsByTypeId[type.typeId];
        const unchunkedData = data[0];
        this.isValid = (index) => isChunkedValid(unchunkedData, index);
        this.get = (index) => get(unchunkedData, index);
        this.set = (index, value) => set(unchunkedData, index, value);
        this.indexOf = (index) => indexOf(unchunkedData, index);
        this._offsets = [0, unchunkedData.length];
        break;
      }
      default:
        Object.setPrototypeOf(this, vectorPrototypesByTypeId[type.typeId]);
        this._offsets = computeChunkOffsets(data);
        break;
    }
    this.data = data;
    this.type = type;
    this.stride = strideForType(type);
    this.numChildren = (_d2 = (_c2 = type.children) === null || _c2 === void 0 ? void 0 : _c2.length) !== null && _d2 !== void 0 ? _d2 : 0;
    this.length = this._offsets.at(-1);
  }
  /**
   * The aggregate size (in bytes) of this Vector's buffers and/or child Vectors.
   */
  get byteLength() {
    return this.data.reduce((byteLength, data) => byteLength + data.byteLength, 0);
  }
  /**
   * Whether this Vector's elements can contain null values.
   */
  get nullable() {
    return computeChunkNullable(this.data);
  }
  /**
   * The number of null elements in this Vector.
   */
  get nullCount() {
    return computeChunkNullCounts(this.data);
  }
  /**
   * The Array or TypedArray constructor used for the JS representation
   *  of the element's values in {@link Vector.prototype.toArray `toArray()`}.
   */
  get ArrayType() {
    return this.type.ArrayType;
  }
  /**
   * The name that should be printed when the Vector is logged in a message.
   */
  get [Symbol.toStringTag]() {
    return `${this.VectorName}<${this.type[Symbol.toStringTag]}>`;
  }
  /**
   * The name of this Vector.
   */
  get VectorName() {
    return `${Type2[this.type.typeId]}Vector`;
  }
  /**
   * Check whether an element is null.
   * @param index The index at which to read the validity bitmap.
   */
  // @ts-ignore
  isValid(index) {
    return false;
  }
  /**
   * Get an element value by position.
   * @param index The index of the element to read.
   */
  // @ts-ignore
  get(index) {
    return null;
  }
  /**
   * Set an element value by position.
   * @param index The index of the element to write.
   * @param value The value to set.
   */
  // @ts-ignore
  set(index, value) {
    return;
  }
  /**
   * Retrieve the index of the first occurrence of a value in an Vector.
   * @param element The value to locate in the Vector.
   * @param offset The index at which to begin the search. If offset is omitted, the search starts at index 0.
   */
  // @ts-ignore
  indexOf(element, offset) {
    return -1;
  }
  includes(element, offset) {
    return this.indexOf(element, offset) > -1;
  }
  /**
   * Iterator for the Vector's elements.
   */
  [Symbol.iterator]() {
    return instance4.visit(this);
  }
  /**
   * Combines two or more Vectors of the same type.
   * @param others Additional Vectors to add to the end of this Vector.
   */
  concat(...others) {
    return new _Vector(this.data.concat(others.flatMap((x2) => x2.data).flat(Number.POSITIVE_INFINITY)));
  }
  /**
   * Return a zero-copy sub-section of this Vector.
   * @param start The beginning of the specified portion of the Vector.
   * @param end The end of the specified portion of the Vector. This is exclusive of the element at the index 'end'.
   */
  slice(begin, end) {
    return new _Vector(clampRange(this, begin, end, ({ data, _offsets }, begin2, end2) => sliceChunks(data, _offsets, begin2, end2)));
  }
  toJSON() {
    return [...this];
  }
  /**
   * Return a JavaScript Array or TypedArray of the Vector's elements.
   *
   * @note If this Vector contains a single Data chunk and the Vector's type is a
   *  primitive numeric type corresponding to one of the JavaScript TypedArrays, this
   *  method returns a zero-copy slice of the underlying TypedArray values. If there's
   *  more than one chunk, the resulting TypedArray will be a copy of the data from each
   *  chunk's underlying TypedArray values.
   *
   * @returns An Array or TypedArray of the Vector's elements, based on the Vector's DataType.
   */
  toArray() {
    const { type, data, length: length2, stride, ArrayType } = this;
    switch (type.typeId) {
      case Type2.Int:
      case Type2.Float:
      case Type2.Decimal:
      case Type2.Time:
      case Type2.Timestamp:
        switch (data.length) {
          case 0:
            return new ArrayType();
          case 1:
            return data[0].values.subarray(0, length2 * stride);
          default:
            return data.reduce((memo, { values, length: chunk_length }) => {
              memo.array.set(values.subarray(0, chunk_length * stride), memo.offset);
              memo.offset += chunk_length * stride;
              return memo;
            }, { array: new ArrayType(length2 * stride), offset: 0 }).array;
        }
    }
    return [...this];
  }
  /**
   * Returns a string representation of the Vector.
   *
   * @returns A string representation of the Vector.
   */
  toString() {
    return `[${[...this].join(",")}]`;
  }
  /**
   * Returns a child Vector by name, or null if this Vector has no child with the given name.
   * @param name The name of the child to retrieve.
   */
  getChild(name) {
    var _b2;
    return this.getChildAt((_b2 = this.type.children) === null || _b2 === void 0 ? void 0 : _b2.findIndex((f) => f.name === name));
  }
  /**
   * Returns a child Vector by index, or null if this Vector has no child at the supplied index.
   * @param index The index of the child to retrieve.
   */
  getChildAt(index) {
    if (index > -1 && index < this.numChildren) {
      return new _Vector(this.data.map(({ children }) => children[index]));
    }
    return null;
  }
  get isMemoized() {
    if (DataType.isDictionary(this.type)) {
      return this.data[0].dictionary.isMemoized;
    }
    return false;
  }
  /**
   * Adds memoization to the Vector's {@link get} method. For dictionary
   * vectors, this method return a vector that memoizes only the dictionary
   * values.
   *
   * Memoization is very useful when decoding a value is expensive such as
   * Utf8. The memoization creates a cache of the size of the Vector and
   * therefore increases memory usage.
   *
   * @returns A new vector that memoizes calls to {@link get}.
   */
  memoize() {
    if (DataType.isDictionary(this.type)) {
      const dictionary = new MemoizedVector(this.data[0].dictionary);
      const newData = this.data.map((data) => {
        const cloned = data.clone();
        cloned.dictionary = dictionary;
        return cloned;
      });
      return new _Vector(newData);
    }
    return new MemoizedVector(this);
  }
  /**
   * Returns a vector without memoization of the {@link get} method. If this
   * vector is not memoized, this method returns this vector.
   *
   * @returns A new vector without memoization.
   */
  unmemoize() {
    if (DataType.isDictionary(this.type) && this.isMemoized) {
      const dictionary = this.data[0].dictionary.unmemoize();
      const newData = this.data.map((data) => {
        const newData2 = data.clone();
        newData2.dictionary = dictionary;
        return newData2;
      });
      return new _Vector(newData);
    }
    return this;
  }
};
_a2 = Symbol.toStringTag;
Vector[_a2] = ((proto) => {
  proto.type = DataType.prototype;
  proto.data = [];
  proto.length = 0;
  proto.stride = 1;
  proto.numChildren = 0;
  proto._offsets = new Uint32Array([0]);
  proto[Symbol.isConcatSpreadable] = true;
  const typeIds = Object.keys(Type2).map((T) => Type2[T]).filter((T) => typeof T === "number" && T !== Type2.NONE);
  for (const typeId of typeIds) {
    const get = instance2.getVisitFnByTypeId(typeId);
    const set = instance.getVisitFnByTypeId(typeId);
    const indexOf = instance3.getVisitFnByTypeId(typeId);
    visitorsByTypeId[typeId] = { get, set, indexOf };
    vectorPrototypesByTypeId[typeId] = Object.create(proto, {
      ["isValid"]: { value: wrapChunkedCall1(isChunkedValid) },
      ["get"]: { value: wrapChunkedCall1(instance2.getVisitFnByTypeId(typeId)) },
      ["set"]: { value: wrapChunkedCall2(instance.getVisitFnByTypeId(typeId)) },
      ["indexOf"]: { value: wrapChunkedIndexOf(instance3.getVisitFnByTypeId(typeId)) }
    });
  }
  return "Vector";
})(Vector.prototype);
var MemoizedVector = class _MemoizedVector extends Vector {
  constructor(vector) {
    super(vector.data);
    const get = this.get;
    const set = this.set;
    const slice = this.slice;
    const cache = new Array(this.length);
    Object.defineProperty(this, "get", {
      value(index) {
        const cachedValue = cache[index];
        if (cachedValue !== void 0) {
          return cachedValue;
        }
        const value = get.call(this, index);
        cache[index] = value;
        return value;
      }
    });
    Object.defineProperty(this, "set", {
      value(index, value) {
        set.call(this, index, value);
        cache[index] = value;
      }
    });
    Object.defineProperty(this, "slice", {
      value: (begin, end) => new _MemoizedVector(slice.call(this, begin, end))
    });
    Object.defineProperty(this, "isMemoized", { value: true });
    Object.defineProperty(this, "unmemoize", {
      value: () => new Vector(this.data)
    });
    Object.defineProperty(this, "memoize", {
      value: () => this
    });
  }
};

// ../core/node_modules/apache-arrow/builder/valid.mjs
function createIsValidFunction(nullValues) {
  if (!nullValues || nullValues.length <= 0) {
    return function isValid(value) {
      return true;
    };
  }
  let fnBody = "";
  const noNaNs = nullValues.filter((x2) => x2 === x2);
  if (noNaNs.length > 0) {
    fnBody = `
    switch (x) {${noNaNs.map((x2) => `
        case ${valueToCase(x2)}:`).join("")}
            return false;
    }`;
  }
  if (nullValues.length !== noNaNs.length) {
    fnBody = `if (x !== x) return false;
${fnBody}`;
  }
  return new Function(`x`, `${fnBody}
return true;`);
}
function valueToCase(x2) {
  if (typeof x2 !== "bigint") {
    return valueToString(x2);
  }
  return `${valueToString(x2)}n`;
}

// ../core/node_modules/apache-arrow/builder/buffer.mjs
function roundLengthUpToNearest64Bytes(len, BPE) {
  const bytesMinus1 = Math.ceil(len) * BPE - 1;
  return (bytesMinus1 - bytesMinus1 % 64 + 64 || 64) / BPE;
}
function resizeArray(arr, len = 0) {
  return arr.length >= len ? arr.subarray(0, len) : memcpy(new arr.constructor(len), arr, 0);
}
var BufferBuilder = class {
  constructor(bufferType, initialSize = 0, stride = 1) {
    this.length = Math.ceil(initialSize / stride);
    this.buffer = new bufferType(this.length);
    this.stride = stride;
    this.BYTES_PER_ELEMENT = bufferType.BYTES_PER_ELEMENT;
    this.ArrayType = bufferType;
  }
  get byteLength() {
    return Math.ceil(this.length * this.stride) * this.BYTES_PER_ELEMENT;
  }
  get reservedLength() {
    return this.buffer.length / this.stride;
  }
  get reservedByteLength() {
    return this.buffer.byteLength;
  }
  // @ts-ignore
  set(index, value) {
    return this;
  }
  append(value) {
    return this.set(this.length, value);
  }
  reserve(extra) {
    if (extra > 0) {
      this.length += extra;
      const stride = this.stride;
      const length2 = this.length * stride;
      const reserved = this.buffer.length;
      if (length2 >= reserved) {
        this._resize(reserved === 0 ? roundLengthUpToNearest64Bytes(length2 * 1, this.BYTES_PER_ELEMENT) : roundLengthUpToNearest64Bytes(length2 * 2, this.BYTES_PER_ELEMENT));
      }
    }
    return this;
  }
  flush(length2 = this.length) {
    length2 = roundLengthUpToNearest64Bytes(length2 * this.stride, this.BYTES_PER_ELEMENT);
    const array = resizeArray(this.buffer, length2);
    this.clear();
    return array;
  }
  clear() {
    this.length = 0;
    this.buffer = new this.ArrayType();
    return this;
  }
  _resize(newLength) {
    return this.buffer = resizeArray(this.buffer, newLength);
  }
};
var DataBufferBuilder = class extends BufferBuilder {
  last() {
    return this.get(this.length - 1);
  }
  get(index) {
    return this.buffer[index];
  }
  set(index, value) {
    this.reserve(index - this.length + 1);
    this.buffer[index * this.stride] = value;
    return this;
  }
};
var BitmapBufferBuilder = class extends DataBufferBuilder {
  constructor() {
    super(Uint8Array, 0, 1 / 8);
    this.numValid = 0;
  }
  get numInvalid() {
    return this.length - this.numValid;
  }
  get(idx) {
    return this.buffer[idx >> 3] >> idx % 8 & 1;
  }
  set(idx, val) {
    const { buffer } = this.reserve(idx - this.length + 1);
    const byte = idx >> 3, bit = idx % 8, cur = buffer[byte] >> bit & 1;
    val ? cur === 0 && (buffer[byte] |= 1 << bit, ++this.numValid) : cur === 1 && (buffer[byte] &= ~(1 << bit), --this.numValid);
    return this;
  }
  clear() {
    this.numValid = 0;
    return super.clear();
  }
};
var OffsetsBufferBuilder = class extends DataBufferBuilder {
  constructor(type) {
    super(type.OffsetArrayType, 1, 1);
  }
  append(value) {
    return this.set(this.length - 1, value);
  }
  set(index, value) {
    const offset = this.length - 1;
    const buffer = this.reserve(index - offset + 1).buffer;
    if (offset < index++ && offset >= 0) {
      buffer.fill(buffer[offset], offset, index);
    }
    buffer[index] = buffer[index - 1] + value;
    return this;
  }
  flush(length2 = this.length - 1) {
    if (length2 > this.length) {
      this.set(length2 - 1, this.BYTES_PER_ELEMENT > 4 ? BigInt(0) : 0);
    }
    return super.flush(length2 + 1);
  }
};

// ../core/node_modules/apache-arrow/builder.mjs
var Builder2 = class {
  /** @nocollapse */
  // @ts-ignore
  static throughNode(options) {
    throw new Error(`"throughNode" not available in this environment`);
  }
  /** @nocollapse */
  // @ts-ignore
  static throughDOM(options) {
    throw new Error(`"throughDOM" not available in this environment`);
  }
  /**
   * Construct a builder with the given Arrow DataType with optional null values,
   * which will be interpreted as "null" when set or appended to the `Builder`.
   * @param {{ type: T, nullValues?: any[] }} options A `BuilderOptions` object used to create this `Builder`.
   */
  constructor({ "type": type, "nullValues": nulls }) {
    this.length = 0;
    this.finished = false;
    this.type = type;
    this.children = [];
    this.nullValues = nulls;
    this.stride = strideForType(type);
    this._nulls = new BitmapBufferBuilder();
    if (nulls && nulls.length > 0) {
      this._isValid = createIsValidFunction(nulls);
    }
  }
  /**
   * Flush the `Builder` and return a `Vector<T>`.
   * @returns {Vector<T>} A `Vector<T>` of the flushed values.
   */
  toVector() {
    return new Vector([this.flush()]);
  }
  get ArrayType() {
    return this.type.ArrayType;
  }
  get nullCount() {
    return this._nulls.numInvalid;
  }
  get numChildren() {
    return this.children.length;
  }
  /**
   * @returns The aggregate length (in bytes) of the values that have been written.
   */
  get byteLength() {
    let size = 0;
    const { _offsets, _values, _nulls, _typeIds, children } = this;
    _offsets && (size += _offsets.byteLength);
    _values && (size += _values.byteLength);
    _nulls && (size += _nulls.byteLength);
    _typeIds && (size += _typeIds.byteLength);
    return children.reduce((size2, child) => size2 + child.byteLength, size);
  }
  /**
   * @returns The aggregate number of rows that have been reserved to write new values.
   */
  get reservedLength() {
    return this._nulls.reservedLength;
  }
  /**
   * @returns The aggregate length (in bytes) that has been reserved to write new values.
   */
  get reservedByteLength() {
    let size = 0;
    this._offsets && (size += this._offsets.reservedByteLength);
    this._values && (size += this._values.reservedByteLength);
    this._nulls && (size += this._nulls.reservedByteLength);
    this._typeIds && (size += this._typeIds.reservedByteLength);
    return this.children.reduce((size2, child) => size2 + child.reservedByteLength, size);
  }
  get valueOffsets() {
    return this._offsets ? this._offsets.buffer : null;
  }
  get values() {
    return this._values ? this._values.buffer : null;
  }
  get nullBitmap() {
    return this._nulls ? this._nulls.buffer : null;
  }
  get typeIds() {
    return this._typeIds ? this._typeIds.buffer : null;
  }
  /**
   * Appends a value (or null) to this `Builder`.
   * This is equivalent to `builder.set(builder.length, value)`.
   * @param {T['TValue'] | TNull } value The value to append.
   */
  append(value) {
    return this.set(this.length, value);
  }
  /**
   * Validates whether a value is valid (true), or null (false)
   * @param {T['TValue'] | TNull } value The value to compare against null the value representations
   */
  isValid(value) {
    return this._isValid(value);
  }
  /**
   * Write a value (or null-value sentinel) at the supplied index.
   * If the value matches one of the null-value representations, a 1-bit is
   * written to the null `BitmapBufferBuilder`. Otherwise, a 0 is written to
   * the null `BitmapBufferBuilder`, and the value is passed to
   * `Builder.prototype.setValue()`.
   * @param {number} index The index of the value to write.
   * @param {T['TValue'] | TNull } value The value to write at the supplied index.
   * @returns {this} The updated `Builder` instance.
   */
  set(index, value) {
    if (this.setValid(index, this.isValid(value))) {
      this.setValue(index, value);
    }
    return this;
  }
  /**
   * Write a value to the underlying buffers at the supplied index, bypassing
   * the null-value check. This is a low-level method that
   * @param {number} index
   * @param {T['TValue'] | TNull } value
   */
  setValue(index, value) {
    this._setValue(this, index, value);
  }
  setValid(index, valid) {
    this.length = this._nulls.set(index, +valid).length;
    return valid;
  }
  // @ts-ignore
  addChild(child, name = `${this.numChildren}`) {
    throw new Error(`Cannot append children to non-nested type "${this.type}"`);
  }
  /**
   * Retrieve the child `Builder` at the supplied `index`, or null if no child
   * exists at that index.
   * @param {number} index The index of the child `Builder` to retrieve.
   * @returns {Builder | null} The child Builder at the supplied index or null.
   */
  getChildAt(index) {
    return this.children[index] || null;
  }
  /**
   * Commit all the values that have been written to their underlying
   * ArrayBuffers, including any child Builders if applicable, and reset
   * the internal `Builder` state.
   * @returns A `Data<T>` of the buffers and children representing the values written.
   */
  flush() {
    let data;
    let typeIds;
    let nullBitmap;
    let valueOffsets;
    const { type, length: length2, nullCount, _typeIds, _offsets, _values, _nulls } = this;
    if (typeIds = _typeIds === null || _typeIds === void 0 ? void 0 : _typeIds.flush(length2)) {
      valueOffsets = _offsets === null || _offsets === void 0 ? void 0 : _offsets.flush(length2);
    } else if (valueOffsets = _offsets === null || _offsets === void 0 ? void 0 : _offsets.flush(length2)) {
      data = _values === null || _values === void 0 ? void 0 : _values.flush(_offsets.last());
    } else {
      data = _values === null || _values === void 0 ? void 0 : _values.flush(length2);
    }
    if (nullCount > 0) {
      nullBitmap = _nulls === null || _nulls === void 0 ? void 0 : _nulls.flush(length2);
    }
    const children = this.children.map((child) => child.flush());
    this.clear();
    return makeData({
      type,
      length: length2,
      nullCount,
      children,
      "child": children[0],
      data,
      typeIds,
      nullBitmap,
      valueOffsets
    });
  }
  /**
   * Finalize this `Builder`, and child builders if applicable.
   * @returns {this} The finalized `Builder` instance.
   */
  finish() {
    this.finished = true;
    for (const child of this.children)
      child.finish();
    return this;
  }
  /**
   * Clear this Builder's internal state, including child Builders if applicable, and reset the length to 0.
   * @returns {this} The cleared `Builder` instance.
   */
  clear() {
    var _a5, _b2, _c2, _d2;
    this.length = 0;
    (_a5 = this._nulls) === null || _a5 === void 0 ? void 0 : _a5.clear();
    (_b2 = this._values) === null || _b2 === void 0 ? void 0 : _b2.clear();
    (_c2 = this._offsets) === null || _c2 === void 0 ? void 0 : _c2.clear();
    (_d2 = this._typeIds) === null || _d2 === void 0 ? void 0 : _d2.clear();
    for (const child of this.children)
      child.clear();
    return this;
  }
};
Builder2.prototype.length = 1;
Builder2.prototype.stride = 1;
Builder2.prototype.children = null;
Builder2.prototype.finished = false;
Builder2.prototype.nullValues = null;
Builder2.prototype._isValid = () => true;
var FixedWidthBuilder = class extends Builder2 {
  constructor(opts) {
    super(opts);
    this._values = new DataBufferBuilder(this.ArrayType, 0, this.stride);
  }
  setValue(index, value) {
    const values = this._values;
    values.reserve(index - values.length + 1);
    return super.setValue(index, value);
  }
};
var VariableWidthBuilder = class extends Builder2 {
  constructor(opts) {
    super(opts);
    this._pendingLength = 0;
    this._offsets = new OffsetsBufferBuilder(opts.type);
  }
  setValue(index, value) {
    const pending = this._pending || (this._pending = /* @__PURE__ */ new Map());
    const current = pending.get(index);
    current && (this._pendingLength -= current.length);
    this._pendingLength += value instanceof MapRow ? value[kKeys].length : value.length;
    pending.set(index, value);
  }
  setValid(index, isValid) {
    if (!super.setValid(index, isValid)) {
      (this._pending || (this._pending = /* @__PURE__ */ new Map())).set(index, void 0);
      return false;
    }
    return true;
  }
  clear() {
    this._pendingLength = 0;
    this._pending = void 0;
    return super.clear();
  }
  flush() {
    this._flush();
    return super.flush();
  }
  finish() {
    this._flush();
    return super.finish();
  }
  _flush() {
    const pending = this._pending;
    const pendingLength = this._pendingLength;
    this._pendingLength = 0;
    this._pending = void 0;
    if (pending && pending.size > 0) {
      this._flushPending(pending, pendingLength);
    }
    return this;
  }
};

// ../core/node_modules/apache-arrow/fb/block.mjs
var Block = class {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  /**
   * Index to the start of the RecordBlock (note this is past the Message header)
   */
  offset() {
    return this.bb.readInt64(this.bb_pos);
  }
  /**
   * Length of the metadata
   */
  metaDataLength() {
    return this.bb.readInt32(this.bb_pos + 8);
  }
  /**
   * Length of the data (this is aligned so there can be a gap between this and
   * the metadata).
   */
  bodyLength() {
    return this.bb.readInt64(this.bb_pos + 16);
  }
  static sizeOf() {
    return 24;
  }
  static createBlock(builder, offset, metaDataLength, bodyLength) {
    builder.prep(8, 24);
    builder.writeInt64(BigInt(bodyLength !== null && bodyLength !== void 0 ? bodyLength : 0));
    builder.pad(4);
    builder.writeInt32(metaDataLength);
    builder.writeInt64(BigInt(offset !== null && offset !== void 0 ? offset : 0));
    return builder.offset();
  }
};

// ../core/node_modules/apache-arrow/fb/footer.mjs
var Footer = class _Footer {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsFooter(bb, obj) {
    return (obj || new _Footer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsFooter(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _Footer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  version() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.readInt16(this.bb_pos + offset) : MetadataVersion.V1;
  }
  schema(obj) {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? (obj || new Schema()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
  }
  dictionaries(index, obj) {
    const offset = this.bb.__offset(this.bb_pos, 8);
    return offset ? (obj || new Block()).__init(this.bb.__vector(this.bb_pos + offset) + index * 24, this.bb) : null;
  }
  dictionariesLength() {
    const offset = this.bb.__offset(this.bb_pos, 8);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
  }
  recordBatches(index, obj) {
    const offset = this.bb.__offset(this.bb_pos, 10);
    return offset ? (obj || new Block()).__init(this.bb.__vector(this.bb_pos + offset) + index * 24, this.bb) : null;
  }
  recordBatchesLength() {
    const offset = this.bb.__offset(this.bb_pos, 10);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
  }
  /**
   * User-defined metadata
   */
  customMetadata(index, obj) {
    const offset = this.bb.__offset(this.bb_pos, 12);
    return offset ? (obj || new KeyValue()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
  }
  customMetadataLength() {
    const offset = this.bb.__offset(this.bb_pos, 12);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
  }
  static startFooter(builder) {
    builder.startObject(5);
  }
  static addVersion(builder, version) {
    builder.addFieldInt16(0, version, MetadataVersion.V1);
  }
  static addSchema(builder, schemaOffset) {
    builder.addFieldOffset(1, schemaOffset, 0);
  }
  static addDictionaries(builder, dictionariesOffset) {
    builder.addFieldOffset(2, dictionariesOffset, 0);
  }
  static startDictionariesVector(builder, numElems) {
    builder.startVector(24, numElems, 8);
  }
  static addRecordBatches(builder, recordBatchesOffset) {
    builder.addFieldOffset(3, recordBatchesOffset, 0);
  }
  static startRecordBatchesVector(builder, numElems) {
    builder.startVector(24, numElems, 8);
  }
  static addCustomMetadata(builder, customMetadataOffset) {
    builder.addFieldOffset(4, customMetadataOffset, 0);
  }
  static createCustomMetadataVector(builder, data) {
    builder.startVector(4, data.length, 4);
    for (let i = data.length - 1; i >= 0; i--) {
      builder.addOffset(data[i]);
    }
    return builder.endVector();
  }
  static startCustomMetadataVector(builder, numElems) {
    builder.startVector(4, numElems, 4);
  }
  static endFooter(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static finishFooterBuffer(builder, offset) {
    builder.finish(offset);
  }
  static finishSizePrefixedFooterBuffer(builder, offset) {
    builder.finish(offset, void 0, true);
  }
};

// ../core/node_modules/apache-arrow/schema.mjs
var Schema2 = class _Schema {
  constructor(fields = [], metadata, dictionaries, metadataVersion = MetadataVersion.V5) {
    this.fields = fields || [];
    this.metadata = metadata || /* @__PURE__ */ new Map();
    if (!dictionaries) {
      dictionaries = generateDictionaryMap(fields);
    }
    this.dictionaries = dictionaries;
    this.metadataVersion = metadataVersion;
  }
  get [Symbol.toStringTag]() {
    return "Schema";
  }
  get names() {
    return this.fields.map((f) => f.name);
  }
  toString() {
    return `Schema<{ ${this.fields.map((f, i) => `${i}: ${f}`).join(", ")} }>`;
  }
  /**
   * Construct a new Schema containing only specified fields.
   *
   * @param fieldNames Names of fields to keep.
   * @returns A new Schema of fields matching the specified names.
   */
  select(fieldNames) {
    const names = new Set(fieldNames);
    const fields = this.fields.filter((f) => names.has(f.name));
    return new _Schema(fields, this.metadata);
  }
  /**
   * Construct a new Schema containing only fields at the specified indices.
   *
   * @param fieldIndices Indices of fields to keep.
   * @returns A new Schema of fields at the specified indices.
   */
  selectAt(fieldIndices) {
    const fields = fieldIndices.map((i) => this.fields[i]).filter(Boolean);
    return new _Schema(fields, this.metadata);
  }
  assign(...args) {
    const other = args[0] instanceof _Schema ? args[0] : Array.isArray(args[0]) ? new _Schema(args[0]) : new _Schema(args);
    const curFields = [...this.fields];
    const metadata = mergeMaps(mergeMaps(/* @__PURE__ */ new Map(), this.metadata), other.metadata);
    const newFields = other.fields.filter((f2) => {
      const i = curFields.findIndex((f) => f.name === f2.name);
      return ~i ? (curFields[i] = f2.clone({
        metadata: mergeMaps(mergeMaps(/* @__PURE__ */ new Map(), curFields[i].metadata), f2.metadata)
      })) && false : true;
    });
    const newDictionaries = generateDictionaryMap(newFields, /* @__PURE__ */ new Map());
    return new _Schema([...curFields, ...newFields], metadata, new Map([...this.dictionaries, ...newDictionaries]));
  }
};
Schema2.prototype.fields = null;
Schema2.prototype.metadata = null;
Schema2.prototype.dictionaries = null;
var Field2 = class _Field {
  /** @nocollapse */
  static new(...args) {
    let [name, type, nullable, metadata] = args;
    if (args[0] && typeof args[0] === "object") {
      ({ name } = args[0]);
      type === void 0 && (type = args[0].type);
      nullable === void 0 && (nullable = args[0].nullable);
      metadata === void 0 && (metadata = args[0].metadata);
    }
    return new _Field(`${name}`, type, nullable, metadata);
  }
  constructor(name, type, nullable = false, metadata) {
    this.name = name;
    this.type = type;
    this.nullable = nullable;
    this.metadata = metadata || /* @__PURE__ */ new Map();
  }
  get typeId() {
    return this.type.typeId;
  }
  get [Symbol.toStringTag]() {
    return "Field";
  }
  toString() {
    return `${this.name}: ${this.type}`;
  }
  clone(...args) {
    let [name, type, nullable, metadata] = args;
    !args[0] || typeof args[0] !== "object" ? [name = this.name, type = this.type, nullable = this.nullable, metadata = this.metadata] = args : { name = this.name, type = this.type, nullable = this.nullable, metadata = this.metadata } = args[0];
    return _Field.new(name, type, nullable, metadata);
  }
};
Field2.prototype.type = null;
Field2.prototype.name = null;
Field2.prototype.nullable = null;
Field2.prototype.metadata = null;
function mergeMaps(m1, m2) {
  return new Map([...m1 || /* @__PURE__ */ new Map(), ...m2 || /* @__PURE__ */ new Map()]);
}
function generateDictionaryMap(fields, dictionaries = /* @__PURE__ */ new Map()) {
  for (let i = -1, n = fields.length; ++i < n; ) {
    const field = fields[i];
    const type = field.type;
    if (DataType.isDictionary(type)) {
      if (!dictionaries.has(type.id)) {
        dictionaries.set(type.id, type.dictionary);
      } else if (dictionaries.get(type.id) !== type.dictionary) {
        throw new Error(`Cannot create Schema containing two different dictionaries with the same Id`);
      }
    }
    if (type.children && type.children.length > 0) {
      generateDictionaryMap(type.children, dictionaries);
    }
  }
  return dictionaries;
}

// ../core/node_modules/apache-arrow/ipc/metadata/file.mjs
var Builder3 = Builder;
var ByteBuffer2 = ByteBuffer;
var Footer_ = class {
  /** @nocollapse */
  static decode(buf) {
    buf = new ByteBuffer2(toUint8Array(buf));
    const footer = Footer.getRootAsFooter(buf);
    const schema = Schema2.decode(footer.schema(), /* @__PURE__ */ new Map(), footer.version());
    return new OffHeapFooter(schema, footer);
  }
  /** @nocollapse */
  static encode(footer) {
    const b = new Builder3();
    const schemaOffset = Schema2.encode(b, footer.schema);
    Footer.startRecordBatchesVector(b, footer.numRecordBatches);
    for (const rb of [...footer.recordBatches()].slice().reverse()) {
      FileBlock.encode(b, rb);
    }
    const recordBatchesOffset = b.endVector();
    Footer.startDictionariesVector(b, footer.numDictionaries);
    for (const db of [...footer.dictionaryBatches()].slice().reverse()) {
      FileBlock.encode(b, db);
    }
    const dictionaryBatchesOffset = b.endVector();
    Footer.startFooter(b);
    Footer.addSchema(b, schemaOffset);
    Footer.addVersion(b, MetadataVersion.V5);
    Footer.addRecordBatches(b, recordBatchesOffset);
    Footer.addDictionaries(b, dictionaryBatchesOffset);
    Footer.finishFooterBuffer(b, Footer.endFooter(b));
    return b.asUint8Array();
  }
  get numRecordBatches() {
    return this._recordBatches.length;
  }
  get numDictionaries() {
    return this._dictionaryBatches.length;
  }
  constructor(schema, version = MetadataVersion.V5, recordBatches, dictionaryBatches) {
    this.schema = schema;
    this.version = version;
    recordBatches && (this._recordBatches = recordBatches);
    dictionaryBatches && (this._dictionaryBatches = dictionaryBatches);
  }
  *recordBatches() {
    for (let block, i = -1, n = this.numRecordBatches; ++i < n; ) {
      if (block = this.getRecordBatch(i)) {
        yield block;
      }
    }
  }
  *dictionaryBatches() {
    for (let block, i = -1, n = this.numDictionaries; ++i < n; ) {
      if (block = this.getDictionaryBatch(i)) {
        yield block;
      }
    }
  }
  getRecordBatch(index) {
    return index >= 0 && index < this.numRecordBatches && this._recordBatches[index] || null;
  }
  getDictionaryBatch(index) {
    return index >= 0 && index < this.numDictionaries && this._dictionaryBatches[index] || null;
  }
};
var OffHeapFooter = class extends Footer_ {
  get numRecordBatches() {
    return this._footer.recordBatchesLength();
  }
  get numDictionaries() {
    return this._footer.dictionariesLength();
  }
  constructor(schema, _footer) {
    super(schema, _footer.version());
    this._footer = _footer;
  }
  getRecordBatch(index) {
    if (index >= 0 && index < this.numRecordBatches) {
      const fileBlock = this._footer.recordBatches(index);
      if (fileBlock) {
        return FileBlock.decode(fileBlock);
      }
    }
    return null;
  }
  getDictionaryBatch(index) {
    if (index >= 0 && index < this.numDictionaries) {
      const fileBlock = this._footer.dictionaries(index);
      if (fileBlock) {
        return FileBlock.decode(fileBlock);
      }
    }
    return null;
  }
};
var FileBlock = class _FileBlock {
  /** @nocollapse */
  static decode(block) {
    return new _FileBlock(block.metaDataLength(), block.bodyLength(), block.offset());
  }
  /** @nocollapse */
  static encode(b, fileBlock) {
    const { metaDataLength } = fileBlock;
    const offset = BigInt(fileBlock.offset);
    const bodyLength = BigInt(fileBlock.bodyLength);
    return Block.createBlock(b, offset, metaDataLength, bodyLength);
  }
  constructor(metaDataLength, bodyLength, offset) {
    this.metaDataLength = metaDataLength;
    this.offset = bigIntToNumber(offset);
    this.bodyLength = bigIntToNumber(bodyLength);
  }
};

// ../core/node_modules/apache-arrow/io/interfaces.mjs
var ITERATOR_DONE = Object.freeze({ done: true, value: void 0 });
var ArrowJSON = class {
  constructor(_json) {
    this._json = _json;
  }
  get schema() {
    return this._json["schema"];
  }
  get batches() {
    return this._json["batches"] || [];
  }
  get dictionaries() {
    return this._json["dictionaries"] || [];
  }
};
var ReadableInterop = class {
  tee() {
    return this._getDOMStream().tee();
  }
  pipe(writable, options) {
    return this._getNodeStream().pipe(writable, options);
  }
  pipeTo(writable, options) {
    return this._getDOMStream().pipeTo(writable, options);
  }
  pipeThrough(duplex, options) {
    return this._getDOMStream().pipeThrough(duplex, options);
  }
  _getDOMStream() {
    return this._DOMStream || (this._DOMStream = this.toDOMStream());
  }
  _getNodeStream() {
    return this._nodeStream || (this._nodeStream = this.toNodeStream());
  }
};
var AsyncQueue = class extends ReadableInterop {
  constructor() {
    super();
    this._values = [];
    this.resolvers = [];
    this._closedPromise = new Promise((r) => this._closedPromiseResolve = r);
  }
  get closed() {
    return this._closedPromise;
  }
  cancel(reason) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.return(reason);
    });
  }
  write(value) {
    if (this._ensureOpen()) {
      this.resolvers.length <= 0 ? this._values.push(value) : this.resolvers.shift().resolve({ done: false, value });
    }
  }
  abort(value) {
    if (this._closedPromiseResolve) {
      this.resolvers.length <= 0 ? this._error = { error: value } : this.resolvers.shift().reject({ done: true, value });
    }
  }
  close() {
    if (this._closedPromiseResolve) {
      const { resolvers } = this;
      while (resolvers.length > 0) {
        resolvers.shift().resolve(ITERATOR_DONE);
      }
      this._closedPromiseResolve();
      this._closedPromiseResolve = void 0;
    }
  }
  [Symbol.asyncIterator]() {
    return this;
  }
  toDOMStream(options) {
    return adapters_default.toDOMStream(this._closedPromiseResolve || this._error ? this : this._values, options);
  }
  toNodeStream(options) {
    return adapters_default.toNodeStream(this._closedPromiseResolve || this._error ? this : this._values, options);
  }
  throw(_) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.abort(_);
      return ITERATOR_DONE;
    });
  }
  return(_) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.close();
      return ITERATOR_DONE;
    });
  }
  read(size) {
    return __awaiter(this, void 0, void 0, function* () {
      return (yield this.next(size, "read")).value;
    });
  }
  peek(size) {
    return __awaiter(this, void 0, void 0, function* () {
      return (yield this.next(size, "peek")).value;
    });
  }
  next(..._args) {
    if (this._values.length > 0) {
      return Promise.resolve({ done: false, value: this._values.shift() });
    } else if (this._error) {
      return Promise.reject({ done: true, value: this._error.error });
    } else if (!this._closedPromiseResolve) {
      return Promise.resolve(ITERATOR_DONE);
    } else {
      return new Promise((resolve, reject) => {
        this.resolvers.push({ resolve, reject });
      });
    }
  }
  _ensureOpen() {
    if (this._closedPromiseResolve) {
      return true;
    }
    throw new Error(`AsyncQueue is closed`);
  }
};

// ../core/node_modules/apache-arrow/io/stream.mjs
var AsyncByteQueue = class extends AsyncQueue {
  write(value) {
    if ((value = toUint8Array(value)).byteLength > 0) {
      return super.write(value);
    }
  }
  toString(sync = false) {
    return sync ? decodeUtf8(this.toUint8Array(true)) : this.toUint8Array(false).then(decodeUtf8);
  }
  toUint8Array(sync = false) {
    return sync ? joinUint8Arrays(this._values)[0] : (() => __awaiter(this, void 0, void 0, function* () {
      var _a5, e_1, _b2, _c2;
      const buffers = [];
      let byteLength = 0;
      try {
        for (var _d2 = true, _e2 = __asyncValues(this), _f2; _f2 = yield _e2.next(), _a5 = _f2.done, !_a5; _d2 = true) {
          _c2 = _f2.value;
          _d2 = false;
          const chunk = _c2;
          buffers.push(chunk);
          byteLength += chunk.byteLength;
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (!_d2 && !_a5 && (_b2 = _e2.return))
            yield _b2.call(_e2);
        } finally {
          if (e_1)
            throw e_1.error;
        }
      }
      return joinUint8Arrays(buffers, byteLength)[0];
    }))();
  }
};
var ByteStream = class {
  constructor(source) {
    if (source) {
      this.source = new ByteStreamSource(adapters_default.fromIterable(source));
    }
  }
  [Symbol.iterator]() {
    return this;
  }
  next(value) {
    return this.source.next(value);
  }
  throw(value) {
    return this.source.throw(value);
  }
  return(value) {
    return this.source.return(value);
  }
  peek(size) {
    return this.source.peek(size);
  }
  read(size) {
    return this.source.read(size);
  }
};
var AsyncByteStream = class _AsyncByteStream {
  constructor(source) {
    if (source instanceof _AsyncByteStream) {
      this.source = source.source;
    } else if (source instanceof AsyncByteQueue) {
      this.source = new AsyncByteStreamSource(adapters_default.fromAsyncIterable(source));
    } else if (isReadableNodeStream(source)) {
      this.source = new AsyncByteStreamSource(adapters_default.fromNodeStream(source));
    } else if (isReadableDOMStream(source)) {
      this.source = new AsyncByteStreamSource(adapters_default.fromDOMStream(source));
    } else if (isFetchResponse(source)) {
      this.source = new AsyncByteStreamSource(adapters_default.fromDOMStream(source.body));
    } else if (isIterable(source)) {
      this.source = new AsyncByteStreamSource(adapters_default.fromIterable(source));
    } else if (isPromise(source)) {
      this.source = new AsyncByteStreamSource(adapters_default.fromAsyncIterable(source));
    } else if (isAsyncIterable(source)) {
      this.source = new AsyncByteStreamSource(adapters_default.fromAsyncIterable(source));
    }
  }
  [Symbol.asyncIterator]() {
    return this;
  }
  next(value) {
    return this.source.next(value);
  }
  throw(value) {
    return this.source.throw(value);
  }
  return(value) {
    return this.source.return(value);
  }
  get closed() {
    return this.source.closed;
  }
  cancel(reason) {
    return this.source.cancel(reason);
  }
  peek(size) {
    return this.source.peek(size);
  }
  read(size) {
    return this.source.read(size);
  }
};
var ByteStreamSource = class {
  constructor(source) {
    this.source = source;
  }
  cancel(reason) {
    this.return(reason);
  }
  peek(size) {
    return this.next(size, "peek").value;
  }
  read(size) {
    return this.next(size, "read").value;
  }
  next(size, cmd = "read") {
    return this.source.next({ cmd, size });
  }
  throw(value) {
    return Object.create(this.source.throw && this.source.throw(value) || ITERATOR_DONE);
  }
  return(value) {
    return Object.create(this.source.return && this.source.return(value) || ITERATOR_DONE);
  }
};
var AsyncByteStreamSource = class {
  constructor(source) {
    this.source = source;
    this._closedPromise = new Promise((r) => this._closedPromiseResolve = r);
  }
  cancel(reason) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.return(reason);
    });
  }
  get closed() {
    return this._closedPromise;
  }
  read(size) {
    return __awaiter(this, void 0, void 0, function* () {
      return (yield this.next(size, "read")).value;
    });
  }
  peek(size) {
    return __awaiter(this, void 0, void 0, function* () {
      return (yield this.next(size, "peek")).value;
    });
  }
  next(size, cmd = "read") {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.source.next({ cmd, size });
    });
  }
  throw(value) {
    return __awaiter(this, void 0, void 0, function* () {
      const result = this.source.throw && (yield this.source.throw(value)) || ITERATOR_DONE;
      this._closedPromiseResolve && this._closedPromiseResolve();
      this._closedPromiseResolve = void 0;
      return Object.create(result);
    });
  }
  return(value) {
    return __awaiter(this, void 0, void 0, function* () {
      const result = this.source.return && (yield this.source.return(value)) || ITERATOR_DONE;
      this._closedPromiseResolve && this._closedPromiseResolve();
      this._closedPromiseResolve = void 0;
      return Object.create(result);
    });
  }
};

// ../core/node_modules/apache-arrow/io/file.mjs
var RandomAccessFile = class extends ByteStream {
  constructor(buffer, byteLength) {
    super();
    this.position = 0;
    this.buffer = toUint8Array(buffer);
    this.size = byteLength === void 0 ? this.buffer.byteLength : byteLength;
  }
  readInt32(position) {
    const { buffer, byteOffset } = this.readAt(position, 4);
    return new DataView(buffer, byteOffset).getInt32(0, true);
  }
  seek(position) {
    this.position = Math.min(position, this.size);
    return position < this.size;
  }
  read(nBytes) {
    const { buffer, size, position } = this;
    if (buffer && position < size) {
      if (typeof nBytes !== "number") {
        nBytes = Number.POSITIVE_INFINITY;
      }
      this.position = Math.min(size, position + Math.min(size - position, nBytes));
      return buffer.subarray(position, this.position);
    }
    return null;
  }
  readAt(position, nBytes) {
    const buf = this.buffer;
    const end = Math.min(this.size, position + nBytes);
    return buf ? buf.subarray(position, end) : new Uint8Array(nBytes);
  }
  close() {
    this.buffer && (this.buffer = null);
  }
  throw(value) {
    this.close();
    return { done: true, value };
  }
  return(value) {
    this.close();
    return { done: true, value };
  }
};
var AsyncRandomAccessFile = class extends AsyncByteStream {
  constructor(file, byteLength) {
    super();
    this.position = 0;
    this._handle = file;
    if (typeof byteLength === "number") {
      this.size = byteLength;
    } else {
      this._pending = (() => __awaiter(this, void 0, void 0, function* () {
        this.size = (yield file.stat()).size;
        delete this._pending;
      }))();
    }
  }
  readInt32(position) {
    return __awaiter(this, void 0, void 0, function* () {
      const { buffer, byteOffset } = yield this.readAt(position, 4);
      return new DataView(buffer, byteOffset).getInt32(0, true);
    });
  }
  seek(position) {
    return __awaiter(this, void 0, void 0, function* () {
      this._pending && (yield this._pending);
      this.position = Math.min(position, this.size);
      return position < this.size;
    });
  }
  read(nBytes) {
    return __awaiter(this, void 0, void 0, function* () {
      this._pending && (yield this._pending);
      const { _handle: file, size, position } = this;
      if (file && position < size) {
        if (typeof nBytes !== "number") {
          nBytes = Number.POSITIVE_INFINITY;
        }
        let pos = position, offset = 0, bytesRead = 0;
        const end = Math.min(size, pos + Math.min(size - pos, nBytes));
        const buffer = new Uint8Array(Math.max(0, (this.position = end) - pos));
        while ((pos += bytesRead) < end && (offset += bytesRead) < buffer.byteLength) {
          ({ bytesRead } = yield file.read(buffer, offset, buffer.byteLength - offset, pos));
        }
        return buffer;
      }
      return null;
    });
  }
  readAt(position, nBytes) {
    return __awaiter(this, void 0, void 0, function* () {
      this._pending && (yield this._pending);
      const { _handle: file, size } = this;
      if (file && position + nBytes < size) {
        const end = Math.min(size, position + nBytes);
        const buffer = new Uint8Array(end - position);
        return (yield file.read(buffer, 0, nBytes, position)).buffer;
      }
      return new Uint8Array(nBytes);
    });
  }
  close() {
    return __awaiter(this, void 0, void 0, function* () {
      const f = this._handle;
      this._handle = null;
      f && (yield f.close());
    });
  }
  throw(value) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.close();
      return { done: true, value };
    });
  }
  return(value) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.close();
      return { done: true, value };
    });
  }
};

// ../core/node_modules/apache-arrow/util/int.mjs
var int_exports = {};
__export(int_exports, {
  BaseInt64: () => BaseInt64,
  Int128: () => Int128,
  Int64: () => Int642,
  Uint64: () => Uint642
});
var carryBit16 = 1 << 16;
function intAsHex(value) {
  if (value < 0) {
    value = 4294967295 + value + 1;
  }
  return `0x${value.toString(16)}`;
}
var kInt32DecimalDigits = 8;
var kPowersOfTen = [
  1,
  10,
  100,
  1e3,
  1e4,
  1e5,
  1e6,
  1e7,
  1e8
];
var BaseInt64 = class {
  constructor(buffer) {
    this.buffer = buffer;
  }
  high() {
    return this.buffer[1];
  }
  low() {
    return this.buffer[0];
  }
  _times(other) {
    const L = new Uint32Array([
      this.buffer[1] >>> 16,
      this.buffer[1] & 65535,
      this.buffer[0] >>> 16,
      this.buffer[0] & 65535
    ]);
    const R = new Uint32Array([
      other.buffer[1] >>> 16,
      other.buffer[1] & 65535,
      other.buffer[0] >>> 16,
      other.buffer[0] & 65535
    ]);
    let product2 = L[3] * R[3];
    this.buffer[0] = product2 & 65535;
    let sum2 = product2 >>> 16;
    product2 = L[2] * R[3];
    sum2 += product2;
    product2 = L[3] * R[2] >>> 0;
    sum2 += product2;
    this.buffer[0] += sum2 << 16;
    this.buffer[1] = sum2 >>> 0 < product2 ? carryBit16 : 0;
    this.buffer[1] += sum2 >>> 16;
    this.buffer[1] += L[1] * R[3] + L[2] * R[2] + L[3] * R[1];
    this.buffer[1] += L[0] * R[3] + L[1] * R[2] + L[2] * R[1] + L[3] * R[0] << 16;
    return this;
  }
  _plus(other) {
    const sum2 = this.buffer[0] + other.buffer[0] >>> 0;
    this.buffer[1] += other.buffer[1];
    if (sum2 < this.buffer[0] >>> 0) {
      ++this.buffer[1];
    }
    this.buffer[0] = sum2;
  }
  lessThan(other) {
    return this.buffer[1] < other.buffer[1] || this.buffer[1] === other.buffer[1] && this.buffer[0] < other.buffer[0];
  }
  equals(other) {
    return this.buffer[1] === other.buffer[1] && this.buffer[0] == other.buffer[0];
  }
  greaterThan(other) {
    return other.lessThan(this);
  }
  hex() {
    return `${intAsHex(this.buffer[1])} ${intAsHex(this.buffer[0])}`;
  }
};
var Uint642 = class _Uint64 extends BaseInt64 {
  times(other) {
    this._times(other);
    return this;
  }
  plus(other) {
    this._plus(other);
    return this;
  }
  /** @nocollapse */
  static from(val, out_buffer = new Uint32Array(2)) {
    return _Uint64.fromString(typeof val === "string" ? val : val.toString(), out_buffer);
  }
  /** @nocollapse */
  static fromNumber(num, out_buffer = new Uint32Array(2)) {
    return _Uint64.fromString(num.toString(), out_buffer);
  }
  /** @nocollapse */
  static fromString(str, out_buffer = new Uint32Array(2)) {
    const length2 = str.length;
    const out = new _Uint64(out_buffer);
    for (let posn = 0; posn < length2; ) {
      const group = kInt32DecimalDigits < length2 - posn ? kInt32DecimalDigits : length2 - posn;
      const chunk = new _Uint64(new Uint32Array([Number.parseInt(str.slice(posn, posn + group), 10), 0]));
      const multiple = new _Uint64(new Uint32Array([kPowersOfTen[group], 0]));
      out.times(multiple);
      out.plus(chunk);
      posn += group;
    }
    return out;
  }
  /** @nocollapse */
  static convertArray(values) {
    const data = new Uint32Array(values.length * 2);
    for (let i = -1, n = values.length; ++i < n; ) {
      _Uint64.from(values[i], new Uint32Array(data.buffer, data.byteOffset + 2 * i * 4, 2));
    }
    return data;
  }
  /** @nocollapse */
  static multiply(left, right) {
    const rtrn = new _Uint64(new Uint32Array(left.buffer));
    return rtrn.times(right);
  }
  /** @nocollapse */
  static add(left, right) {
    const rtrn = new _Uint64(new Uint32Array(left.buffer));
    return rtrn.plus(right);
  }
};
var Int642 = class _Int64 extends BaseInt64 {
  negate() {
    this.buffer[0] = ~this.buffer[0] + 1;
    this.buffer[1] = ~this.buffer[1];
    if (this.buffer[0] == 0) {
      ++this.buffer[1];
    }
    return this;
  }
  times(other) {
    this._times(other);
    return this;
  }
  plus(other) {
    this._plus(other);
    return this;
  }
  lessThan(other) {
    const this_high = this.buffer[1] << 0;
    const other_high = other.buffer[1] << 0;
    return this_high < other_high || this_high === other_high && this.buffer[0] < other.buffer[0];
  }
  /** @nocollapse */
  static from(val, out_buffer = new Uint32Array(2)) {
    return _Int64.fromString(typeof val === "string" ? val : val.toString(), out_buffer);
  }
  /** @nocollapse */
  static fromNumber(num, out_buffer = new Uint32Array(2)) {
    return _Int64.fromString(num.toString(), out_buffer);
  }
  /** @nocollapse */
  static fromString(str, out_buffer = new Uint32Array(2)) {
    const negate = str.startsWith("-");
    const length2 = str.length;
    const out = new _Int64(out_buffer);
    for (let posn = negate ? 1 : 0; posn < length2; ) {
      const group = kInt32DecimalDigits < length2 - posn ? kInt32DecimalDigits : length2 - posn;
      const chunk = new _Int64(new Uint32Array([Number.parseInt(str.slice(posn, posn + group), 10), 0]));
      const multiple = new _Int64(new Uint32Array([kPowersOfTen[group], 0]));
      out.times(multiple);
      out.plus(chunk);
      posn += group;
    }
    return negate ? out.negate() : out;
  }
  /** @nocollapse */
  static convertArray(values) {
    const data = new Uint32Array(values.length * 2);
    for (let i = -1, n = values.length; ++i < n; ) {
      _Int64.from(values[i], new Uint32Array(data.buffer, data.byteOffset + 2 * i * 4, 2));
    }
    return data;
  }
  /** @nocollapse */
  static multiply(left, right) {
    const rtrn = new _Int64(new Uint32Array(left.buffer));
    return rtrn.times(right);
  }
  /** @nocollapse */
  static add(left, right) {
    const rtrn = new _Int64(new Uint32Array(left.buffer));
    return rtrn.plus(right);
  }
};
var Int128 = class _Int128 {
  constructor(buffer) {
    this.buffer = buffer;
  }
  high() {
    return new Int642(new Uint32Array(this.buffer.buffer, this.buffer.byteOffset + 8, 2));
  }
  low() {
    return new Int642(new Uint32Array(this.buffer.buffer, this.buffer.byteOffset, 2));
  }
  negate() {
    this.buffer[0] = ~this.buffer[0] + 1;
    this.buffer[1] = ~this.buffer[1];
    this.buffer[2] = ~this.buffer[2];
    this.buffer[3] = ~this.buffer[3];
    if (this.buffer[0] == 0) {
      ++this.buffer[1];
    }
    if (this.buffer[1] == 0) {
      ++this.buffer[2];
    }
    if (this.buffer[2] == 0) {
      ++this.buffer[3];
    }
    return this;
  }
  times(other) {
    const L0 = new Uint642(new Uint32Array([this.buffer[3], 0]));
    const L1 = new Uint642(new Uint32Array([this.buffer[2], 0]));
    const L2 = new Uint642(new Uint32Array([this.buffer[1], 0]));
    const L3 = new Uint642(new Uint32Array([this.buffer[0], 0]));
    const R0 = new Uint642(new Uint32Array([other.buffer[3], 0]));
    const R1 = new Uint642(new Uint32Array([other.buffer[2], 0]));
    const R2 = new Uint642(new Uint32Array([other.buffer[1], 0]));
    const R3 = new Uint642(new Uint32Array([other.buffer[0], 0]));
    let product2 = Uint642.multiply(L3, R3);
    this.buffer[0] = product2.low();
    const sum2 = new Uint642(new Uint32Array([product2.high(), 0]));
    product2 = Uint642.multiply(L2, R3);
    sum2.plus(product2);
    product2 = Uint642.multiply(L3, R2);
    sum2.plus(product2);
    this.buffer[1] = sum2.low();
    this.buffer[3] = sum2.lessThan(product2) ? 1 : 0;
    this.buffer[2] = sum2.high();
    const high = new Uint642(new Uint32Array(this.buffer.buffer, this.buffer.byteOffset + 8, 2));
    high.plus(Uint642.multiply(L1, R3)).plus(Uint642.multiply(L2, R2)).plus(Uint642.multiply(L3, R1));
    this.buffer[3] += Uint642.multiply(L0, R3).plus(Uint642.multiply(L1, R2)).plus(Uint642.multiply(L2, R1)).plus(Uint642.multiply(L3, R0)).low();
    return this;
  }
  plus(other) {
    const sums = new Uint32Array(4);
    sums[3] = this.buffer[3] + other.buffer[3] >>> 0;
    sums[2] = this.buffer[2] + other.buffer[2] >>> 0;
    sums[1] = this.buffer[1] + other.buffer[1] >>> 0;
    sums[0] = this.buffer[0] + other.buffer[0] >>> 0;
    if (sums[0] < this.buffer[0] >>> 0) {
      ++sums[1];
    }
    if (sums[1] < this.buffer[1] >>> 0) {
      ++sums[2];
    }
    if (sums[2] < this.buffer[2] >>> 0) {
      ++sums[3];
    }
    this.buffer[3] = sums[3];
    this.buffer[2] = sums[2];
    this.buffer[1] = sums[1];
    this.buffer[0] = sums[0];
    return this;
  }
  hex() {
    return `${intAsHex(this.buffer[3])} ${intAsHex(this.buffer[2])} ${intAsHex(this.buffer[1])} ${intAsHex(this.buffer[0])}`;
  }
  /** @nocollapse */
  static multiply(left, right) {
    const rtrn = new _Int128(new Uint32Array(left.buffer));
    return rtrn.times(right);
  }
  /** @nocollapse */
  static add(left, right) {
    const rtrn = new _Int128(new Uint32Array(left.buffer));
    return rtrn.plus(right);
  }
  /** @nocollapse */
  static from(val, out_buffer = new Uint32Array(4)) {
    return _Int128.fromString(typeof val === "string" ? val : val.toString(), out_buffer);
  }
  /** @nocollapse */
  static fromNumber(num, out_buffer = new Uint32Array(4)) {
    return _Int128.fromString(num.toString(), out_buffer);
  }
  /** @nocollapse */
  static fromString(str, out_buffer = new Uint32Array(4)) {
    const negate = str.startsWith("-");
    const length2 = str.length;
    const out = new _Int128(out_buffer);
    for (let posn = negate ? 1 : 0; posn < length2; ) {
      const group = kInt32DecimalDigits < length2 - posn ? kInt32DecimalDigits : length2 - posn;
      const chunk = new _Int128(new Uint32Array([Number.parseInt(str.slice(posn, posn + group), 10), 0, 0, 0]));
      const multiple = new _Int128(new Uint32Array([kPowersOfTen[group], 0, 0, 0]));
      out.times(multiple);
      out.plus(chunk);
      posn += group;
    }
    return negate ? out.negate() : out;
  }
  /** @nocollapse */
  static convertArray(values) {
    const data = new Uint32Array(values.length * 4);
    for (let i = -1, n = values.length; ++i < n; ) {
      _Int128.from(values[i], new Uint32Array(data.buffer, data.byteOffset + 4 * 4 * i, 4));
    }
    return data;
  }
};

// ../core/node_modules/apache-arrow/visitor/vectorloader.mjs
var VectorLoader = class extends Visitor {
  constructor(bytes, nodes, buffers, dictionaries, metadataVersion = MetadataVersion.V5) {
    super();
    this.nodesIndex = -1;
    this.buffersIndex = -1;
    this.bytes = bytes;
    this.nodes = nodes;
    this.buffers = buffers;
    this.dictionaries = dictionaries;
    this.metadataVersion = metadataVersion;
  }
  visit(node) {
    return super.visit(node instanceof Field2 ? node.type : node);
  }
  visitNull(type, { length: length2 } = this.nextFieldNode()) {
    return makeData({ type, length: length2 });
  }
  visitBool(type, { length: length2, nullCount } = this.nextFieldNode()) {
    return makeData({ type, length: length2, nullCount, nullBitmap: this.readNullBitmap(type, nullCount), data: this.readData(type) });
  }
  visitInt(type, { length: length2, nullCount } = this.nextFieldNode()) {
    return makeData({ type, length: length2, nullCount, nullBitmap: this.readNullBitmap(type, nullCount), data: this.readData(type) });
  }
  visitFloat(type, { length: length2, nullCount } = this.nextFieldNode()) {
    return makeData({ type, length: length2, nullCount, nullBitmap: this.readNullBitmap(type, nullCount), data: this.readData(type) });
  }
  visitUtf8(type, { length: length2, nullCount } = this.nextFieldNode()) {
    return makeData({ type, length: length2, nullCount, nullBitmap: this.readNullBitmap(type, nullCount), valueOffsets: this.readOffsets(type), data: this.readData(type) });
  }
  visitLargeUtf8(type, { length: length2, nullCount } = this.nextFieldNode()) {
    return makeData({ type, length: length2, nullCount, nullBitmap: this.readNullBitmap(type, nullCount), valueOffsets: this.readOffsets(type), data: this.readData(type) });
  }
  visitBinary(type, { length: length2, nullCount } = this.nextFieldNode()) {
    return makeData({ type, length: length2, nullCount, nullBitmap: this.readNullBitmap(type, nullCount), valueOffsets: this.readOffsets(type), data: this.readData(type) });
  }
  visitLargeBinary(type, { length: length2, nullCount } = this.nextFieldNode()) {
    return makeData({ type, length: length2, nullCount, nullBitmap: this.readNullBitmap(type, nullCount), valueOffsets: this.readOffsets(type), data: this.readData(type) });
  }
  visitFixedSizeBinary(type, { length: length2, nullCount } = this.nextFieldNode()) {
    return makeData({ type, length: length2, nullCount, nullBitmap: this.readNullBitmap(type, nullCount), data: this.readData(type) });
  }
  visitDate(type, { length: length2, nullCount } = this.nextFieldNode()) {
    return makeData({ type, length: length2, nullCount, nullBitmap: this.readNullBitmap(type, nullCount), data: this.readData(type) });
  }
  visitTimestamp(type, { length: length2, nullCount } = this.nextFieldNode()) {
    return makeData({ type, length: length2, nullCount, nullBitmap: this.readNullBitmap(type, nullCount), data: this.readData(type) });
  }
  visitTime(type, { length: length2, nullCount } = this.nextFieldNode()) {
    return makeData({ type, length: length2, nullCount, nullBitmap: this.readNullBitmap(type, nullCount), data: this.readData(type) });
  }
  visitDecimal(type, { length: length2, nullCount } = this.nextFieldNode()) {
    return makeData({ type, length: length2, nullCount, nullBitmap: this.readNullBitmap(type, nullCount), data: this.readData(type) });
  }
  visitList(type, { length: length2, nullCount } = this.nextFieldNode()) {
    return makeData({ type, length: length2, nullCount, nullBitmap: this.readNullBitmap(type, nullCount), valueOffsets: this.readOffsets(type), "child": this.visit(type.children[0]) });
  }
  visitStruct(type, { length: length2, nullCount } = this.nextFieldNode()) {
    return makeData({ type, length: length2, nullCount, nullBitmap: this.readNullBitmap(type, nullCount), children: this.visitMany(type.children) });
  }
  visitUnion(type, { length: length2, nullCount } = this.nextFieldNode()) {
    if (this.metadataVersion < MetadataVersion.V5) {
      this.readNullBitmap(type, nullCount);
    }
    return type.mode === UnionMode.Sparse ? this.visitSparseUnion(type, { length: length2, nullCount }) : this.visitDenseUnion(type, { length: length2, nullCount });
  }
  visitDenseUnion(type, { length: length2, nullCount } = this.nextFieldNode()) {
    return makeData({ type, length: length2, nullCount, typeIds: this.readTypeIds(type), valueOffsets: this.readOffsets(type), children: this.visitMany(type.children) });
  }
  visitSparseUnion(type, { length: length2, nullCount } = this.nextFieldNode()) {
    return makeData({ type, length: length2, nullCount, typeIds: this.readTypeIds(type), children: this.visitMany(type.children) });
  }
  visitDictionary(type, { length: length2, nullCount } = this.nextFieldNode()) {
    return makeData({ type, length: length2, nullCount, nullBitmap: this.readNullBitmap(type, nullCount), data: this.readData(type.indices), dictionary: this.readDictionary(type) });
  }
  visitInterval(type, { length: length2, nullCount } = this.nextFieldNode()) {
    return makeData({ type, length: length2, nullCount, nullBitmap: this.readNullBitmap(type, nullCount), data: this.readData(type) });
  }
  visitDuration(type, { length: length2, nullCount } = this.nextFieldNode()) {
    return makeData({ type, length: length2, nullCount, nullBitmap: this.readNullBitmap(type, nullCount), data: this.readData(type) });
  }
  visitFixedSizeList(type, { length: length2, nullCount } = this.nextFieldNode()) {
    return makeData({ type, length: length2, nullCount, nullBitmap: this.readNullBitmap(type, nullCount), "child": this.visit(type.children[0]) });
  }
  visitMap(type, { length: length2, nullCount } = this.nextFieldNode()) {
    return makeData({ type, length: length2, nullCount, nullBitmap: this.readNullBitmap(type, nullCount), valueOffsets: this.readOffsets(type), "child": this.visit(type.children[0]) });
  }
  nextFieldNode() {
    return this.nodes[++this.nodesIndex];
  }
  nextBufferRange() {
    return this.buffers[++this.buffersIndex];
  }
  readNullBitmap(type, nullCount, buffer = this.nextBufferRange()) {
    return nullCount > 0 && this.readData(type, buffer) || new Uint8Array(0);
  }
  readOffsets(type, buffer) {
    return this.readData(type, buffer);
  }
  readTypeIds(type, buffer) {
    return this.readData(type, buffer);
  }
  readData(_type, { length: length2, offset } = this.nextBufferRange()) {
    return this.bytes.subarray(offset, offset + length2);
  }
  readDictionary(type) {
    return this.dictionaries.get(type.id);
  }
};
var JSONVectorLoader = class extends VectorLoader {
  constructor(sources, nodes, buffers, dictionaries, metadataVersion) {
    super(new Uint8Array(0), nodes, buffers, dictionaries, metadataVersion);
    this.sources = sources;
  }
  readNullBitmap(_type, nullCount, { offset } = this.nextBufferRange()) {
    return nullCount <= 0 ? new Uint8Array(0) : packBools(this.sources[offset]);
  }
  readOffsets(_type, { offset } = this.nextBufferRange()) {
    return toArrayBufferView(Uint8Array, toArrayBufferView(_type.OffsetArrayType, this.sources[offset]));
  }
  readTypeIds(type, { offset } = this.nextBufferRange()) {
    return toArrayBufferView(Uint8Array, toArrayBufferView(type.ArrayType, this.sources[offset]));
  }
  readData(type, { offset } = this.nextBufferRange()) {
    const { sources } = this;
    if (DataType.isTimestamp(type)) {
      return toArrayBufferView(Uint8Array, Int642.convertArray(sources[offset]));
    } else if ((DataType.isInt(type) || DataType.isTime(type)) && type.bitWidth === 64 || DataType.isDuration(type)) {
      return toArrayBufferView(Uint8Array, Int642.convertArray(sources[offset]));
    } else if (DataType.isDate(type) && type.unit === DateUnit.MILLISECOND) {
      return toArrayBufferView(Uint8Array, Int642.convertArray(sources[offset]));
    } else if (DataType.isDecimal(type)) {
      return toArrayBufferView(Uint8Array, Int128.convertArray(sources[offset]));
    } else if (DataType.isBinary(type) || DataType.isLargeBinary(type) || DataType.isFixedSizeBinary(type)) {
      return binaryDataFromJSON(sources[offset]);
    } else if (DataType.isBool(type)) {
      return packBools(sources[offset]);
    } else if (DataType.isUtf8(type) || DataType.isLargeUtf8(type)) {
      return encodeUtf8(sources[offset].join(""));
    }
    return toArrayBufferView(Uint8Array, toArrayBufferView(type.ArrayType, sources[offset].map((x2) => +x2)));
  }
};
function binaryDataFromJSON(values) {
  const joined = values.join("");
  const data = new Uint8Array(joined.length / 2);
  for (let i = 0; i < joined.length; i += 2) {
    data[i >> 1] = Number.parseInt(joined.slice(i, i + 2), 16);
  }
  return data;
}

// ../core/node_modules/apache-arrow/builder/binary.mjs
var BinaryBuilder = class extends VariableWidthBuilder {
  constructor(opts) {
    super(opts);
    this._values = new BufferBuilder(Uint8Array);
  }
  get byteLength() {
    let size = this._pendingLength + this.length * 4;
    this._offsets && (size += this._offsets.byteLength);
    this._values && (size += this._values.byteLength);
    this._nulls && (size += this._nulls.byteLength);
    return size;
  }
  setValue(index, value) {
    return super.setValue(index, toUint8Array(value));
  }
  _flushPending(pending, pendingLength) {
    const offsets = this._offsets;
    const data = this._values.reserve(pendingLength).buffer;
    let offset = 0;
    for (const [index, value] of pending) {
      if (value === void 0) {
        offsets.set(index, 0);
      } else {
        const length2 = value.length;
        data.set(value, offset);
        offsets.set(index, length2);
        offset += length2;
      }
    }
  }
};

// ../core/node_modules/apache-arrow/builder/largebinary.mjs
var LargeBinaryBuilder = class extends VariableWidthBuilder {
  constructor(opts) {
    super(opts);
    this._values = new BufferBuilder(Uint8Array);
  }
  get byteLength() {
    let size = this._pendingLength + this.length * 4;
    this._offsets && (size += this._offsets.byteLength);
    this._values && (size += this._values.byteLength);
    this._nulls && (size += this._nulls.byteLength);
    return size;
  }
  setValue(index, value) {
    return super.setValue(index, toUint8Array(value));
  }
  _flushPending(pending, pendingLength) {
    const offsets = this._offsets;
    const data = this._values.reserve(pendingLength).buffer;
    let offset = 0;
    for (const [index, value] of pending) {
      if (value === void 0) {
        offsets.set(index, BigInt(0));
      } else {
        const length2 = value.length;
        data.set(value, offset);
        offsets.set(index, BigInt(length2));
        offset += length2;
      }
    }
  }
};

// ../core/node_modules/apache-arrow/builder/bool.mjs
var BoolBuilder = class extends Builder2 {
  constructor(options) {
    super(options);
    this._values = new BitmapBufferBuilder();
  }
  setValue(index, value) {
    this._values.set(index, +value);
  }
};

// ../core/node_modules/apache-arrow/builder/date.mjs
var DateBuilder = class extends FixedWidthBuilder {
};
DateBuilder.prototype._setValue = setDate;
var DateDayBuilder = class extends DateBuilder {
};
DateDayBuilder.prototype._setValue = setDateDay;
var DateMillisecondBuilder = class extends DateBuilder {
};
DateMillisecondBuilder.prototype._setValue = setDateMillisecond;

// ../core/node_modules/apache-arrow/builder/decimal.mjs
var DecimalBuilder = class extends FixedWidthBuilder {
};
DecimalBuilder.prototype._setValue = setDecimal;

// ../core/node_modules/apache-arrow/builder/dictionary.mjs
var DictionaryBuilder = class extends Builder2 {
  constructor({ "type": type, "nullValues": nulls, "dictionaryHashFunction": hashFn }) {
    super({ type: new Dictionary(type.dictionary, type.indices, type.id, type.isOrdered) });
    this._nulls = null;
    this._dictionaryOffset = 0;
    this._keysToIndices = /* @__PURE__ */ Object.create(null);
    this.indices = makeBuilder({ "type": this.type.indices, "nullValues": nulls });
    this.dictionary = makeBuilder({ "type": this.type.dictionary, "nullValues": null });
    if (typeof hashFn === "function") {
      this.valueToKey = hashFn;
    }
  }
  get values() {
    return this.indices.values;
  }
  get nullCount() {
    return this.indices.nullCount;
  }
  get nullBitmap() {
    return this.indices.nullBitmap;
  }
  get byteLength() {
    return this.indices.byteLength + this.dictionary.byteLength;
  }
  get reservedLength() {
    return this.indices.reservedLength + this.dictionary.reservedLength;
  }
  get reservedByteLength() {
    return this.indices.reservedByteLength + this.dictionary.reservedByteLength;
  }
  isValid(value) {
    return this.indices.isValid(value);
  }
  setValid(index, valid) {
    const indices = this.indices;
    valid = indices.setValid(index, valid);
    this.length = indices.length;
    return valid;
  }
  setValue(index, value) {
    const keysToIndices = this._keysToIndices;
    const key = this.valueToKey(value);
    let idx = keysToIndices[key];
    if (idx === void 0) {
      keysToIndices[key] = idx = this._dictionaryOffset + this.dictionary.append(value).length - 1;
    }
    return this.indices.setValue(index, idx);
  }
  flush() {
    const type = this.type;
    const prev = this._dictionary;
    const curr = this.dictionary.toVector();
    const data = this.indices.flush().clone(type);
    data.dictionary = prev ? prev.concat(curr) : curr;
    this.finished || (this._dictionaryOffset += curr.length);
    this._dictionary = data.dictionary;
    this.clear();
    return data;
  }
  finish() {
    this.indices.finish();
    this.dictionary.finish();
    this._dictionaryOffset = 0;
    this._keysToIndices = /* @__PURE__ */ Object.create(null);
    return super.finish();
  }
  clear() {
    this.indices.clear();
    this.dictionary.clear();
    return super.clear();
  }
  valueToKey(val) {
    return typeof val === "string" ? val : `${val}`;
  }
};

// ../core/node_modules/apache-arrow/builder/fixedsizebinary.mjs
var FixedSizeBinaryBuilder = class extends FixedWidthBuilder {
};
FixedSizeBinaryBuilder.prototype._setValue = setFixedSizeBinary;

// ../core/node_modules/apache-arrow/builder/fixedsizelist.mjs
var FixedSizeListBuilder = class extends Builder2 {
  setValue(index, value) {
    const [child] = this.children;
    const start = index * this.stride;
    for (let i = -1, n = value.length; ++i < n; ) {
      child.set(start + i, value[i]);
    }
  }
  addChild(child, name = "0") {
    if (this.numChildren > 0) {
      throw new Error("FixedSizeListBuilder can only have one child.");
    }
    const childIndex = this.children.push(child);
    this.type = new FixedSizeList2(this.type.listSize, new Field2(name, child.type, true));
    return childIndex;
  }
};

// ../core/node_modules/apache-arrow/builder/float.mjs
var FloatBuilder = class extends FixedWidthBuilder {
  setValue(index, value) {
    this._values.set(index, value);
  }
};
var Float16Builder = class extends FloatBuilder {
  setValue(index, value) {
    super.setValue(index, float64ToUint16(value));
  }
};
var Float32Builder = class extends FloatBuilder {
};
var Float64Builder = class extends FloatBuilder {
};

// ../core/node_modules/apache-arrow/builder/interval.mjs
var IntervalBuilder = class extends FixedWidthBuilder {
};
IntervalBuilder.prototype._setValue = setIntervalValue;
var IntervalDayTimeBuilder = class extends IntervalBuilder {
};
IntervalDayTimeBuilder.prototype._setValue = setIntervalDayTime;
var IntervalYearMonthBuilder = class extends IntervalBuilder {
};
IntervalYearMonthBuilder.prototype._setValue = setIntervalYearMonth;

// ../core/node_modules/apache-arrow/builder/duration.mjs
var DurationBuilder = class extends FixedWidthBuilder {
};
DurationBuilder.prototype._setValue = setDuration;
var DurationSecondBuilder = class extends DurationBuilder {
};
DurationSecondBuilder.prototype._setValue = setDurationSecond;
var DurationMillisecondBuilder = class extends DurationBuilder {
};
DurationMillisecondBuilder.prototype._setValue = setDurationMillisecond;
var DurationMicrosecondBuilder = class extends DurationBuilder {
};
DurationMicrosecondBuilder.prototype._setValue = setDurationMicrosecond;
var DurationNanosecondBuilder = class extends DurationBuilder {
};
DurationNanosecondBuilder.prototype._setValue = setDurationNanosecond;

// ../core/node_modules/apache-arrow/builder/int.mjs
var IntBuilder = class extends FixedWidthBuilder {
  setValue(index, value) {
    this._values.set(index, value);
  }
};
var Int8Builder = class extends IntBuilder {
};
var Int16Builder = class extends IntBuilder {
};
var Int32Builder = class extends IntBuilder {
};
var Int64Builder = class extends IntBuilder {
};
var Uint8Builder = class extends IntBuilder {
};
var Uint16Builder = class extends IntBuilder {
};
var Uint32Builder = class extends IntBuilder {
};
var Uint64Builder = class extends IntBuilder {
};

// ../core/node_modules/apache-arrow/builder/list.mjs
var ListBuilder = class extends VariableWidthBuilder {
  constructor(opts) {
    super(opts);
    this._offsets = new OffsetsBufferBuilder(opts.type);
  }
  addChild(child, name = "0") {
    if (this.numChildren > 0) {
      throw new Error("ListBuilder can only have one child.");
    }
    this.children[this.numChildren] = child;
    this.type = new List2(new Field2(name, child.type, true));
    return this.numChildren - 1;
  }
  _flushPending(pending) {
    const offsets = this._offsets;
    const [child] = this.children;
    for (const [index, value] of pending) {
      if (typeof value === "undefined") {
        offsets.set(index, 0);
      } else {
        const v = value;
        const n = v.length;
        const start = offsets.set(index, n).buffer[index];
        for (let i = -1; ++i < n; ) {
          child.set(start + i, v[i]);
        }
      }
    }
  }
};

// ../core/node_modules/apache-arrow/builder/map.mjs
var MapBuilder = class extends VariableWidthBuilder {
  set(index, value) {
    return super.set(index, value);
  }
  setValue(index, value) {
    const row = value instanceof Map ? value : new Map(Object.entries(value));
    const pending = this._pending || (this._pending = /* @__PURE__ */ new Map());
    const current = pending.get(index);
    current && (this._pendingLength -= current.size);
    this._pendingLength += row.size;
    pending.set(index, row);
  }
  addChild(child, name = `${this.numChildren}`) {
    if (this.numChildren > 0) {
      throw new Error("ListBuilder can only have one child.");
    }
    this.children[this.numChildren] = child;
    this.type = new Map_(new Field2(name, child.type, true), this.type.keysSorted);
    return this.numChildren - 1;
  }
  _flushPending(pending) {
    const offsets = this._offsets;
    const [child] = this.children;
    for (const [index, value] of pending) {
      if (value === void 0) {
        offsets.set(index, 0);
      } else {
        let { [index]: idx, [index + 1]: end } = offsets.set(index, value.size).buffer;
        for (const val of value.entries()) {
          child.set(idx, val);
          if (++idx >= end)
            break;
        }
      }
    }
  }
};

// ../core/node_modules/apache-arrow/builder/null.mjs
var NullBuilder = class extends Builder2 {
  // @ts-ignore
  setValue(index, value) {
  }
  setValid(index, valid) {
    this.length = Math.max(index + 1, this.length);
    return valid;
  }
};

// ../core/node_modules/apache-arrow/builder/struct.mjs
var StructBuilder = class extends Builder2 {
  setValue(index, value) {
    const { children, type } = this;
    switch (Array.isArray(value) || value.constructor) {
      case true:
        return type.children.forEach((_, i) => children[i].set(index, value[i]));
      case Map:
        return type.children.forEach((f, i) => children[i].set(index, value.get(f.name)));
      default:
        return type.children.forEach((f, i) => children[i].set(index, value[f.name]));
    }
  }
  /** @inheritdoc */
  setValid(index, valid) {
    if (!super.setValid(index, valid)) {
      this.children.forEach((child) => child.setValid(index, valid));
    }
    return valid;
  }
  addChild(child, name = `${this.numChildren}`) {
    const childIndex = this.children.push(child);
    this.type = new Struct([...this.type.children, new Field2(name, child.type, true)]);
    return childIndex;
  }
};

// ../core/node_modules/apache-arrow/builder/timestamp.mjs
var TimestampBuilder = class extends FixedWidthBuilder {
};
TimestampBuilder.prototype._setValue = setTimestamp;
var TimestampSecondBuilder = class extends TimestampBuilder {
};
TimestampSecondBuilder.prototype._setValue = setTimestampSecond;
var TimestampMillisecondBuilder = class extends TimestampBuilder {
};
TimestampMillisecondBuilder.prototype._setValue = setTimestampMillisecond;
var TimestampMicrosecondBuilder = class extends TimestampBuilder {
};
TimestampMicrosecondBuilder.prototype._setValue = setTimestampMicrosecond;
var TimestampNanosecondBuilder = class extends TimestampBuilder {
};
TimestampNanosecondBuilder.prototype._setValue = setTimestampNanosecond;

// ../core/node_modules/apache-arrow/builder/time.mjs
var TimeBuilder = class extends FixedWidthBuilder {
};
TimeBuilder.prototype._setValue = setTime;
var TimeSecondBuilder = class extends TimeBuilder {
};
TimeSecondBuilder.prototype._setValue = setTimeSecond;
var TimeMillisecondBuilder = class extends TimeBuilder {
};
TimeMillisecondBuilder.prototype._setValue = setTimeMillisecond;
var TimeMicrosecondBuilder = class extends TimeBuilder {
};
TimeMicrosecondBuilder.prototype._setValue = setTimeMicrosecond;
var TimeNanosecondBuilder = class extends TimeBuilder {
};
TimeNanosecondBuilder.prototype._setValue = setTimeNanosecond;

// ../core/node_modules/apache-arrow/builder/union.mjs
var UnionBuilder = class extends Builder2 {
  constructor(options) {
    super(options);
    this._typeIds = new DataBufferBuilder(Int8Array, 0, 1);
    if (typeof options["valueToChildTypeId"] === "function") {
      this._valueToChildTypeId = options["valueToChildTypeId"];
    }
  }
  get typeIdToChildIndex() {
    return this.type.typeIdToChildIndex;
  }
  append(value, childTypeId) {
    return this.set(this.length, value, childTypeId);
  }
  set(index, value, childTypeId) {
    if (childTypeId === void 0) {
      childTypeId = this._valueToChildTypeId(this, value, index);
    }
    this.setValue(index, value, childTypeId);
    return this;
  }
  setValue(index, value, childTypeId) {
    this._typeIds.set(index, childTypeId);
    const childIndex = this.type.typeIdToChildIndex[childTypeId];
    const child = this.children[childIndex];
    child === null || child === void 0 ? void 0 : child.set(index, value);
  }
  addChild(child, name = `${this.children.length}`) {
    const childTypeId = this.children.push(child);
    const { type: { children, mode: mode2, typeIds } } = this;
    const fields = [...children, new Field2(name, child.type)];
    this.type = new Union_(mode2, [...typeIds, childTypeId], fields);
    return childTypeId;
  }
  /** @ignore */
  // @ts-ignore
  _valueToChildTypeId(builder, value, offset) {
    throw new Error(`Cannot map UnionBuilder value to child typeId. Pass the \`childTypeId\` as the second argument to unionBuilder.append(), or supply a \`valueToChildTypeId\` function as part of the UnionBuilder constructor options.`);
  }
};
var SparseUnionBuilder = class extends UnionBuilder {
};
var DenseUnionBuilder = class extends UnionBuilder {
  constructor(options) {
    super(options);
    this._offsets = new DataBufferBuilder(Int32Array);
  }
  /** @ignore */
  setValue(index, value, childTypeId) {
    const id = this._typeIds.set(index, childTypeId).buffer[index];
    const child = this.getChildAt(this.type.typeIdToChildIndex[id]);
    const denseIndex = this._offsets.set(index, child.length).buffer[index];
    child === null || child === void 0 ? void 0 : child.set(denseIndex, value);
  }
};

// ../core/node_modules/apache-arrow/builder/utf8.mjs
var Utf8Builder = class extends VariableWidthBuilder {
  constructor(opts) {
    super(opts);
    this._values = new BufferBuilder(Uint8Array);
  }
  get byteLength() {
    let size = this._pendingLength + this.length * 4;
    this._offsets && (size += this._offsets.byteLength);
    this._values && (size += this._values.byteLength);
    this._nulls && (size += this._nulls.byteLength);
    return size;
  }
  setValue(index, value) {
    return super.setValue(index, encodeUtf8(value));
  }
  // @ts-ignore
  _flushPending(pending, pendingLength) {
  }
};
Utf8Builder.prototype._flushPending = BinaryBuilder.prototype._flushPending;

// ../core/node_modules/apache-arrow/builder/largeutf8.mjs
var LargeUtf8Builder = class extends VariableWidthBuilder {
  constructor(opts) {
    super(opts);
    this._values = new BufferBuilder(Uint8Array);
  }
  get byteLength() {
    let size = this._pendingLength + this.length * 4;
    this._offsets && (size += this._offsets.byteLength);
    this._values && (size += this._values.byteLength);
    this._nulls && (size += this._nulls.byteLength);
    return size;
  }
  setValue(index, value) {
    return super.setValue(index, encodeUtf8(value));
  }
  // @ts-ignore
  _flushPending(pending, pendingLength) {
  }
};
LargeUtf8Builder.prototype._flushPending = LargeBinaryBuilder.prototype._flushPending;

// ../core/node_modules/apache-arrow/visitor/builderctor.mjs
var GetBuilderCtor = class extends Visitor {
  visitNull() {
    return NullBuilder;
  }
  visitBool() {
    return BoolBuilder;
  }
  visitInt() {
    return IntBuilder;
  }
  visitInt8() {
    return Int8Builder;
  }
  visitInt16() {
    return Int16Builder;
  }
  visitInt32() {
    return Int32Builder;
  }
  visitInt64() {
    return Int64Builder;
  }
  visitUint8() {
    return Uint8Builder;
  }
  visitUint16() {
    return Uint16Builder;
  }
  visitUint32() {
    return Uint32Builder;
  }
  visitUint64() {
    return Uint64Builder;
  }
  visitFloat() {
    return FloatBuilder;
  }
  visitFloat16() {
    return Float16Builder;
  }
  visitFloat32() {
    return Float32Builder;
  }
  visitFloat64() {
    return Float64Builder;
  }
  visitUtf8() {
    return Utf8Builder;
  }
  visitLargeUtf8() {
    return LargeUtf8Builder;
  }
  visitBinary() {
    return BinaryBuilder;
  }
  visitLargeBinary() {
    return LargeBinaryBuilder;
  }
  visitFixedSizeBinary() {
    return FixedSizeBinaryBuilder;
  }
  visitDate() {
    return DateBuilder;
  }
  visitDateDay() {
    return DateDayBuilder;
  }
  visitDateMillisecond() {
    return DateMillisecondBuilder;
  }
  visitTimestamp() {
    return TimestampBuilder;
  }
  visitTimestampSecond() {
    return TimestampSecondBuilder;
  }
  visitTimestampMillisecond() {
    return TimestampMillisecondBuilder;
  }
  visitTimestampMicrosecond() {
    return TimestampMicrosecondBuilder;
  }
  visitTimestampNanosecond() {
    return TimestampNanosecondBuilder;
  }
  visitTime() {
    return TimeBuilder;
  }
  visitTimeSecond() {
    return TimeSecondBuilder;
  }
  visitTimeMillisecond() {
    return TimeMillisecondBuilder;
  }
  visitTimeMicrosecond() {
    return TimeMicrosecondBuilder;
  }
  visitTimeNanosecond() {
    return TimeNanosecondBuilder;
  }
  visitDecimal() {
    return DecimalBuilder;
  }
  visitList() {
    return ListBuilder;
  }
  visitStruct() {
    return StructBuilder;
  }
  visitUnion() {
    return UnionBuilder;
  }
  visitDenseUnion() {
    return DenseUnionBuilder;
  }
  visitSparseUnion() {
    return SparseUnionBuilder;
  }
  visitDictionary() {
    return DictionaryBuilder;
  }
  visitInterval() {
    return IntervalBuilder;
  }
  visitIntervalDayTime() {
    return IntervalDayTimeBuilder;
  }
  visitIntervalYearMonth() {
    return IntervalYearMonthBuilder;
  }
  visitDuration() {
    return DurationBuilder;
  }
  visitDurationSecond() {
    return DurationSecondBuilder;
  }
  visitDurationMillisecond() {
    return DurationMillisecondBuilder;
  }
  visitDurationMicrosecond() {
    return DurationMicrosecondBuilder;
  }
  visitDurationNanosecond() {
    return DurationNanosecondBuilder;
  }
  visitFixedSizeList() {
    return FixedSizeListBuilder;
  }
  visitMap() {
    return MapBuilder;
  }
};
var instance5 = new GetBuilderCtor();

// ../core/node_modules/apache-arrow/visitor/typecomparator.mjs
var TypeComparator = class extends Visitor {
  compareSchemas(schema, other) {
    return schema === other || other instanceof schema.constructor && this.compareManyFields(schema.fields, other.fields);
  }
  compareManyFields(fields, others) {
    return fields === others || Array.isArray(fields) && Array.isArray(others) && fields.length === others.length && fields.every((f, i) => this.compareFields(f, others[i]));
  }
  compareFields(field, other) {
    return field === other || other instanceof field.constructor && field.name === other.name && field.nullable === other.nullable && this.visit(field.type, other.type);
  }
};
function compareConstructor(type, other) {
  return other instanceof type.constructor;
}
function compareAny(type, other) {
  return type === other || compareConstructor(type, other);
}
function compareInt(type, other) {
  return type === other || compareConstructor(type, other) && type.bitWidth === other.bitWidth && type.isSigned === other.isSigned;
}
function compareFloat(type, other) {
  return type === other || compareConstructor(type, other) && type.precision === other.precision;
}
function compareFixedSizeBinary(type, other) {
  return type === other || compareConstructor(type, other) && type.byteWidth === other.byteWidth;
}
function compareDate(type, other) {
  return type === other || compareConstructor(type, other) && type.unit === other.unit;
}
function compareTimestamp(type, other) {
  return type === other || compareConstructor(type, other) && type.unit === other.unit && type.timezone === other.timezone;
}
function compareTime(type, other) {
  return type === other || compareConstructor(type, other) && type.unit === other.unit && type.bitWidth === other.bitWidth;
}
function compareList(type, other) {
  return type === other || compareConstructor(type, other) && type.children.length === other.children.length && instance6.compareManyFields(type.children, other.children);
}
function compareStruct(type, other) {
  return type === other || compareConstructor(type, other) && type.children.length === other.children.length && instance6.compareManyFields(type.children, other.children);
}
function compareUnion(type, other) {
  return type === other || compareConstructor(type, other) && type.mode === other.mode && type.typeIds.every((x2, i) => x2 === other.typeIds[i]) && instance6.compareManyFields(type.children, other.children);
}
function compareDictionary(type, other) {
  return type === other || compareConstructor(type, other) && type.id === other.id && type.isOrdered === other.isOrdered && instance6.visit(type.indices, other.indices) && instance6.visit(type.dictionary, other.dictionary);
}
function compareInterval(type, other) {
  return type === other || compareConstructor(type, other) && type.unit === other.unit;
}
function compareDuration(type, other) {
  return type === other || compareConstructor(type, other) && type.unit === other.unit;
}
function compareFixedSizeList(type, other) {
  return type === other || compareConstructor(type, other) && type.listSize === other.listSize && type.children.length === other.children.length && instance6.compareManyFields(type.children, other.children);
}
function compareMap(type, other) {
  return type === other || compareConstructor(type, other) && type.keysSorted === other.keysSorted && type.children.length === other.children.length && instance6.compareManyFields(type.children, other.children);
}
TypeComparator.prototype.visitNull = compareAny;
TypeComparator.prototype.visitBool = compareAny;
TypeComparator.prototype.visitInt = compareInt;
TypeComparator.prototype.visitInt8 = compareInt;
TypeComparator.prototype.visitInt16 = compareInt;
TypeComparator.prototype.visitInt32 = compareInt;
TypeComparator.prototype.visitInt64 = compareInt;
TypeComparator.prototype.visitUint8 = compareInt;
TypeComparator.prototype.visitUint16 = compareInt;
TypeComparator.prototype.visitUint32 = compareInt;
TypeComparator.prototype.visitUint64 = compareInt;
TypeComparator.prototype.visitFloat = compareFloat;
TypeComparator.prototype.visitFloat16 = compareFloat;
TypeComparator.prototype.visitFloat32 = compareFloat;
TypeComparator.prototype.visitFloat64 = compareFloat;
TypeComparator.prototype.visitUtf8 = compareAny;
TypeComparator.prototype.visitLargeUtf8 = compareAny;
TypeComparator.prototype.visitBinary = compareAny;
TypeComparator.prototype.visitLargeBinary = compareAny;
TypeComparator.prototype.visitFixedSizeBinary = compareFixedSizeBinary;
TypeComparator.prototype.visitDate = compareDate;
TypeComparator.prototype.visitDateDay = compareDate;
TypeComparator.prototype.visitDateMillisecond = compareDate;
TypeComparator.prototype.visitTimestamp = compareTimestamp;
TypeComparator.prototype.visitTimestampSecond = compareTimestamp;
TypeComparator.prototype.visitTimestampMillisecond = compareTimestamp;
TypeComparator.prototype.visitTimestampMicrosecond = compareTimestamp;
TypeComparator.prototype.visitTimestampNanosecond = compareTimestamp;
TypeComparator.prototype.visitTime = compareTime;
TypeComparator.prototype.visitTimeSecond = compareTime;
TypeComparator.prototype.visitTimeMillisecond = compareTime;
TypeComparator.prototype.visitTimeMicrosecond = compareTime;
TypeComparator.prototype.visitTimeNanosecond = compareTime;
TypeComparator.prototype.visitDecimal = compareAny;
TypeComparator.prototype.visitList = compareList;
TypeComparator.prototype.visitStruct = compareStruct;
TypeComparator.prototype.visitUnion = compareUnion;
TypeComparator.prototype.visitDenseUnion = compareUnion;
TypeComparator.prototype.visitSparseUnion = compareUnion;
TypeComparator.prototype.visitDictionary = compareDictionary;
TypeComparator.prototype.visitInterval = compareInterval;
TypeComparator.prototype.visitIntervalDayTime = compareInterval;
TypeComparator.prototype.visitIntervalYearMonth = compareInterval;
TypeComparator.prototype.visitDuration = compareDuration;
TypeComparator.prototype.visitDurationSecond = compareDuration;
TypeComparator.prototype.visitDurationMillisecond = compareDuration;
TypeComparator.prototype.visitDurationMicrosecond = compareDuration;
TypeComparator.prototype.visitDurationNanosecond = compareDuration;
TypeComparator.prototype.visitFixedSizeList = compareFixedSizeList;
TypeComparator.prototype.visitMap = compareMap;
var instance6 = new TypeComparator();
function compareSchemas(schema, other) {
  return instance6.compareSchemas(schema, other);
}
function compareFields(field, other) {
  return instance6.compareFields(field, other);
}
function compareTypes(type, other) {
  return instance6.visit(type, other);
}

// ../core/node_modules/apache-arrow/factories.mjs
function makeBuilder(options) {
  const type = options.type;
  const builder = new (instance5.getVisitFn(type)())(options);
  if (type.children && type.children.length > 0) {
    const children = options["children"] || [];
    const defaultOptions = { "nullValues": options["nullValues"] };
    const getChildOptions = Array.isArray(children) ? (_, i) => children[i] || defaultOptions : ({ name }) => children[name] || defaultOptions;
    for (const [index, field] of type.children.entries()) {
      const { type: type2 } = field;
      const opts = getChildOptions(field, index);
      builder.children.push(makeBuilder(Object.assign(Object.assign({}, opts), { type: type2 })));
    }
  }
  return builder;
}

// ../core/node_modules/apache-arrow/util/recordbatch.mjs
function distributeVectorsIntoRecordBatches(schema, vecs) {
  return uniformlyDistributeChunksAcrossRecordBatches(schema, vecs.map((v) => v.data.concat()));
}
function uniformlyDistributeChunksAcrossRecordBatches(schema, cols) {
  const fields = [...schema.fields];
  const batches = [];
  const memo = { numBatches: cols.reduce((n, c) => Math.max(n, c.length), 0) };
  let numBatches = 0, batchLength = 0;
  let i = -1;
  const numColumns = cols.length;
  let child, children = [];
  while (memo.numBatches-- > 0) {
    for (batchLength = Number.POSITIVE_INFINITY, i = -1; ++i < numColumns; ) {
      children[i] = child = cols[i].shift();
      batchLength = Math.min(batchLength, child ? child.length : batchLength);
    }
    if (Number.isFinite(batchLength)) {
      children = distributeChildren(fields, batchLength, children, cols, memo);
      if (batchLength > 0) {
        batches[numBatches++] = makeData({
          type: new Struct(fields),
          length: batchLength,
          nullCount: 0,
          children: children.slice()
        });
      }
    }
  }
  return [
    schema = schema.assign(fields),
    batches.map((data) => new RecordBatch2(schema, data))
  ];
}
function distributeChildren(fields, batchLength, children, columns, memo) {
  var _a5;
  const nullBitmapSize = (batchLength + 63 & ~63) >> 3;
  for (let i = -1, n = columns.length; ++i < n; ) {
    const child = children[i];
    const length2 = child === null || child === void 0 ? void 0 : child.length;
    if (length2 >= batchLength) {
      if (length2 === batchLength) {
        children[i] = child;
      } else {
        children[i] = child.slice(0, batchLength);
        memo.numBatches = Math.max(memo.numBatches, columns[i].unshift(child.slice(batchLength, length2 - batchLength)));
      }
    } else {
      const field = fields[i];
      fields[i] = field.clone({ nullable: true });
      children[i] = (_a5 = child === null || child === void 0 ? void 0 : child._changeLengthAndBackfillNullBitmap(batchLength)) !== null && _a5 !== void 0 ? _a5 : makeData({
        type: field.type,
        length: batchLength,
        nullCount: batchLength,
        nullBitmap: new Uint8Array(nullBitmapSize)
      });
    }
  }
  return children;
}

// ../core/node_modules/apache-arrow/table.mjs
var _a3;
var Table = class _Table {
  constructor(...args) {
    var _b2, _c2;
    if (args.length === 0) {
      this.batches = [];
      this.schema = new Schema2([]);
      this._offsets = [0];
      return this;
    }
    let schema;
    let offsets;
    if (args[0] instanceof Schema2) {
      schema = args.shift();
    }
    if (args.at(-1) instanceof Uint32Array) {
      offsets = args.pop();
    }
    const unwrap = (x2) => {
      if (x2) {
        if (x2 instanceof RecordBatch2) {
          return [x2];
        } else if (x2 instanceof _Table) {
          return x2.batches;
        } else if (x2 instanceof Data) {
          if (x2.type instanceof Struct) {
            return [new RecordBatch2(new Schema2(x2.type.children), x2)];
          }
        } else if (Array.isArray(x2)) {
          return x2.flatMap((v) => unwrap(v));
        } else if (typeof x2[Symbol.iterator] === "function") {
          return [...x2].flatMap((v) => unwrap(v));
        } else if (typeof x2 === "object") {
          const keys = Object.keys(x2);
          const vecs = keys.map((k) => new Vector([x2[k]]));
          const batchSchema = schema !== null && schema !== void 0 ? schema : new Schema2(keys.map((k, i) => new Field2(String(k), vecs[i].type, vecs[i].nullable)));
          const [, batches2] = distributeVectorsIntoRecordBatches(batchSchema, vecs);
          return batches2.length === 0 ? [new RecordBatch2(x2)] : batches2;
        }
      }
      return [];
    };
    const batches = args.flatMap((v) => unwrap(v));
    schema = (_c2 = schema !== null && schema !== void 0 ? schema : (_b2 = batches[0]) === null || _b2 === void 0 ? void 0 : _b2.schema) !== null && _c2 !== void 0 ? _c2 : new Schema2([]);
    if (!(schema instanceof Schema2)) {
      throw new TypeError("Table constructor expects a [Schema, RecordBatch[]] pair.");
    }
    for (const batch of batches) {
      if (!(batch instanceof RecordBatch2)) {
        throw new TypeError("Table constructor expects a [Schema, RecordBatch[]] pair.");
      }
      if (!compareSchemas(schema, batch.schema)) {
        throw new TypeError("Table and inner RecordBatch schemas must be equivalent.");
      }
    }
    this.schema = schema;
    this.batches = batches;
    this._offsets = offsets !== null && offsets !== void 0 ? offsets : computeChunkOffsets(this.data);
  }
  /**
   * The contiguous {@link RecordBatch `RecordBatch`} chunks of the Table rows.
   */
  get data() {
    return this.batches.map(({ data }) => data);
  }
  /**
   * The number of columns in this Table.
   */
  get numCols() {
    return this.schema.fields.length;
  }
  /**
   * The number of rows in this Table.
   */
  get numRows() {
    return this.data.reduce((numRows, data) => numRows + data.length, 0);
  }
  /**
   * The number of null rows in this Table.
   */
  get nullCount() {
    if (this._nullCount === -1) {
      this._nullCount = computeChunkNullCounts(this.data);
    }
    return this._nullCount;
  }
  /**
   * Check whether an element is null.
   *
   * @param index The index at which to read the validity bitmap.
   */
  // @ts-ignore
  isValid(index) {
    return false;
  }
  /**
   * Get an element value by position.
   *
   * @param index The index of the element to read.
   */
  // @ts-ignore
  get(index) {
    return null;
  }
  /**
   * Set an element value by position.
   *
   * @param index The index of the element to write.
   * @param value The value to set.
   */
  // @ts-ignore
  set(index, value) {
    return;
  }
  /**
   * Retrieve the index of the first occurrence of a value in an Vector.
   *
   * @param element The value to locate in the Vector.
   * @param offset The index at which to begin the search. If offset is omitted, the search starts at index 0.
   */
  // @ts-ignore
  indexOf(element, offset) {
    return -1;
  }
  /**
   * Iterator for rows in this Table.
   */
  [Symbol.iterator]() {
    if (this.batches.length > 0) {
      return instance4.visit(new Vector(this.data));
    }
    return new Array(0)[Symbol.iterator]();
  }
  /**
   * Return a JavaScript Array of the Table rows.
   *
   * @returns An Array of Table rows.
   */
  toArray() {
    return [...this];
  }
  /**
   * Returns a string representation of the Table rows.
   *
   * @returns A string representation of the Table rows.
   */
  toString() {
    return `[
  ${this.toArray().join(",\n  ")}
]`;
  }
  /**
   * Combines two or more Tables of the same schema.
   *
   * @param others Additional Tables to add to the end of this Tables.
   */
  concat(...others) {
    const schema = this.schema;
    const data = this.data.concat(others.flatMap(({ data: data2 }) => data2));
    return new _Table(schema, data.map((data2) => new RecordBatch2(schema, data2)));
  }
  /**
   * Return a zero-copy sub-section of this Table.
   *
   * @param begin The beginning of the specified portion of the Table.
   * @param end The end of the specified portion of the Table. This is exclusive of the element at the index 'end'.
   */
  slice(begin, end) {
    const schema = this.schema;
    [begin, end] = clampRange({ length: this.numRows }, begin, end);
    const data = sliceChunks(this.data, this._offsets, begin, end);
    return new _Table(schema, data.map((chunk) => new RecordBatch2(schema, chunk)));
  }
  /**
   * Returns a child Vector by name, or null if this Vector has no child with the given name.
   *
   * @param name The name of the child to retrieve.
   */
  getChild(name) {
    return this.getChildAt(this.schema.fields.findIndex((f) => f.name === name));
  }
  /**
   * Returns a child Vector by index, or null if this Vector has no child at the supplied index.
   *
   * @param index The index of the child to retrieve.
   */
  getChildAt(index) {
    if (index > -1 && index < this.schema.fields.length) {
      const data = this.data.map((data2) => data2.children[index]);
      if (data.length === 0) {
        const { type } = this.schema.fields[index];
        const empty = makeData({ type, length: 0, nullCount: 0 });
        data.push(empty._changeLengthAndBackfillNullBitmap(this.numRows));
      }
      return new Vector(data);
    }
    return null;
  }
  /**
   * Sets a child Vector by name.
   *
   * @param name The name of the child to overwrite.
   * @returns A new Table with the supplied child for the specified name.
   */
  setChild(name, child) {
    var _b2;
    return this.setChildAt((_b2 = this.schema.fields) === null || _b2 === void 0 ? void 0 : _b2.findIndex((f) => f.name === name), child);
  }
  setChildAt(index, child) {
    let schema = this.schema;
    let batches = [...this.batches];
    if (index > -1 && index < this.numCols) {
      if (!child) {
        child = new Vector([makeData({ type: new Null2(), length: this.numRows })]);
      }
      const fields = schema.fields.slice();
      const field = fields[index].clone({ type: child.type });
      const children = this.schema.fields.map((_, i) => this.getChildAt(i));
      [fields[index], children[index]] = [field, child];
      [schema, batches] = distributeVectorsIntoRecordBatches(schema, children);
    }
    return new _Table(schema, batches);
  }
  /**
   * Construct a new Table containing only specified columns.
   *
   * @param columnNames Names of columns to keep.
   * @returns A new Table of columns matching the specified names.
   */
  select(columnNames) {
    const nameToIndex = this.schema.fields.reduce((m, f, i) => m.set(f.name, i), /* @__PURE__ */ new Map());
    return this.selectAt(columnNames.map((columnName) => nameToIndex.get(columnName)).filter((x2) => x2 > -1));
  }
  /**
   * Construct a new Table containing only columns at the specified indices.
   *
   * @param columnIndices Indices of columns to keep.
   * @returns A new Table of columns at the specified indices.
   */
  selectAt(columnIndices) {
    const schema = this.schema.selectAt(columnIndices);
    const data = this.batches.map((batch) => batch.selectAt(columnIndices));
    return new _Table(schema, data);
  }
  assign(other) {
    const fields = this.schema.fields;
    const [indices, oldToNew] = other.schema.fields.reduce((memo, f2, newIdx) => {
      const [indices2, oldToNew2] = memo;
      const i = fields.findIndex((f) => f.name === f2.name);
      ~i ? oldToNew2[i] = newIdx : indices2.push(newIdx);
      return memo;
    }, [[], []]);
    const schema = this.schema.assign(other.schema);
    const columns = [
      ...fields.map((_, i) => [i, oldToNew[i]]).map(([i, j]) => j === void 0 ? this.getChildAt(i) : other.getChildAt(j)),
      ...indices.map((i) => other.getChildAt(i))
    ].filter(Boolean);
    return new _Table(...distributeVectorsIntoRecordBatches(schema, columns));
  }
};
_a3 = Symbol.toStringTag;
Table[_a3] = ((proto) => {
  proto.schema = null;
  proto.batches = [];
  proto._offsets = new Uint32Array([0]);
  proto._nullCount = -1;
  proto[Symbol.isConcatSpreadable] = true;
  proto["isValid"] = wrapChunkedCall1(isChunkedValid);
  proto["get"] = wrapChunkedCall1(instance2.getVisitFn(Type2.Struct));
  proto["set"] = wrapChunkedCall2(instance.getVisitFn(Type2.Struct));
  proto["indexOf"] = wrapChunkedIndexOf(instance3.getVisitFn(Type2.Struct));
  return "Table";
})(Table.prototype);

// ../core/node_modules/apache-arrow/recordbatch.mjs
var _a4;
var RecordBatch2 = class _RecordBatch {
  constructor(...args) {
    switch (args.length) {
      case 2: {
        [this.schema] = args;
        if (!(this.schema instanceof Schema2)) {
          throw new TypeError("RecordBatch constructor expects a [Schema, Data] pair.");
        }
        [
          ,
          this.data = makeData({
            nullCount: 0,
            type: new Struct(this.schema.fields),
            children: this.schema.fields.map((f) => makeData({ type: f.type, nullCount: 0 }))
          })
        ] = args;
        if (!(this.data instanceof Data)) {
          throw new TypeError("RecordBatch constructor expects a [Schema, Data] pair.");
        }
        [this.schema, this.data] = ensureSameLengthData(this.schema, this.data.children);
        break;
      }
      case 1: {
        const [obj] = args;
        const { fields, children, length: length2 } = Object.keys(obj).reduce((memo, name, i) => {
          memo.children[i] = obj[name];
          memo.length = Math.max(memo.length, obj[name].length);
          memo.fields[i] = Field2.new({ name, type: obj[name].type, nullable: true });
          return memo;
        }, {
          length: 0,
          fields: new Array(),
          children: new Array()
        });
        const schema = new Schema2(fields);
        const data = makeData({ type: new Struct(fields), length: length2, children, nullCount: 0 });
        [this.schema, this.data] = ensureSameLengthData(schema, data.children, length2);
        break;
      }
      default:
        throw new TypeError("RecordBatch constructor expects an Object mapping names to child Data, or a [Schema, Data] pair.");
    }
  }
  get dictionaries() {
    return this._dictionaries || (this._dictionaries = collectDictionaries(this.schema.fields, this.data.children));
  }
  /**
   * The number of columns in this RecordBatch.
   */
  get numCols() {
    return this.schema.fields.length;
  }
  /**
   * The number of rows in this RecordBatch.
   */
  get numRows() {
    return this.data.length;
  }
  /**
   * The number of null rows in this RecordBatch.
   */
  get nullCount() {
    return this.data.nullCount;
  }
  /**
   * Check whether an element is null.
   * @param index The index at which to read the validity bitmap.
   */
  isValid(index) {
    return this.data.getValid(index);
  }
  /**
   * Get a row by position.
   * @param index The index of the element to read.
   */
  get(index) {
    return instance2.visit(this.data, index);
  }
  /**
   * Set a row by position.
   * @param index The index of the element to write.
   * @param value The value to set.
   */
  set(index, value) {
    return instance.visit(this.data, index, value);
  }
  /**
   * Retrieve the index of the first occurrence of a row in an RecordBatch.
   * @param element The row to locate in the RecordBatch.
   * @param offset The index at which to begin the search. If offset is omitted, the search starts at index 0.
   */
  indexOf(element, offset) {
    return instance3.visit(this.data, element, offset);
  }
  /**
   * Iterator for rows in this RecordBatch.
   */
  [Symbol.iterator]() {
    return instance4.visit(new Vector([this.data]));
  }
  /**
   * Return a JavaScript Array of the RecordBatch rows.
   * @returns An Array of RecordBatch rows.
   */
  toArray() {
    return [...this];
  }
  /**
   * Combines two or more RecordBatch of the same schema.
   * @param others Additional RecordBatch to add to the end of this RecordBatch.
   */
  concat(...others) {
    return new Table(this.schema, [this, ...others]);
  }
  /**
   * Return a zero-copy sub-section of this RecordBatch.
   * @param start The beginning of the specified portion of the RecordBatch.
   * @param end The end of the specified portion of the RecordBatch. This is exclusive of the element at the index 'end'.
   */
  slice(begin, end) {
    const [slice] = new Vector([this.data]).slice(begin, end).data;
    return new _RecordBatch(this.schema, slice);
  }
  /**
   * Returns a child Vector by name, or null if this Vector has no child with the given name.
   * @param name The name of the child to retrieve.
   */
  getChild(name) {
    var _b2;
    return this.getChildAt((_b2 = this.schema.fields) === null || _b2 === void 0 ? void 0 : _b2.findIndex((f) => f.name === name));
  }
  /**
   * Returns a child Vector by index, or null if this Vector has no child at the supplied index.
   * @param index The index of the child to retrieve.
   */
  getChildAt(index) {
    if (index > -1 && index < this.schema.fields.length) {
      return new Vector([this.data.children[index]]);
    }
    return null;
  }
  /**
   * Sets a child Vector by name.
   * @param name The name of the child to overwrite.
   * @returns A new RecordBatch with the new child for the specified name.
   */
  setChild(name, child) {
    var _b2;
    return this.setChildAt((_b2 = this.schema.fields) === null || _b2 === void 0 ? void 0 : _b2.findIndex((f) => f.name === name), child);
  }
  setChildAt(index, child) {
    let schema = this.schema;
    let data = this.data;
    if (index > -1 && index < this.numCols) {
      if (!child) {
        child = new Vector([makeData({ type: new Null2(), length: this.numRows })]);
      }
      const fields = schema.fields.slice();
      const children = data.children.slice();
      const field = fields[index].clone({ type: child.type });
      [fields[index], children[index]] = [field, child.data[0]];
      schema = new Schema2(fields, new Map(this.schema.metadata));
      data = makeData({ type: new Struct(fields), children });
    }
    return new _RecordBatch(schema, data);
  }
  /**
   * Construct a new RecordBatch containing only specified columns.
   *
   * @param columnNames Names of columns to keep.
   * @returns A new RecordBatch of columns matching the specified names.
   */
  select(columnNames) {
    const schema = this.schema.select(columnNames);
    const type = new Struct(schema.fields);
    const children = [];
    for (const name of columnNames) {
      const index = this.schema.fields.findIndex((f) => f.name === name);
      if (~index) {
        children[index] = this.data.children[index];
      }
    }
    return new _RecordBatch(schema, makeData({ type, length: this.numRows, children }));
  }
  /**
   * Construct a new RecordBatch containing only columns at the specified indices.
   *
   * @param columnIndices Indices of columns to keep.
   * @returns A new RecordBatch of columns matching at the specified indices.
   */
  selectAt(columnIndices) {
    const schema = this.schema.selectAt(columnIndices);
    const children = columnIndices.map((i) => this.data.children[i]).filter(Boolean);
    const subset = makeData({ type: new Struct(schema.fields), length: this.numRows, children });
    return new _RecordBatch(schema, subset);
  }
};
_a4 = Symbol.toStringTag;
RecordBatch2[_a4] = ((proto) => {
  proto._nullCount = -1;
  proto[Symbol.isConcatSpreadable] = true;
  return "RecordBatch";
})(RecordBatch2.prototype);
function ensureSameLengthData(schema, chunks, maxLength = chunks.reduce((max2, col) => Math.max(max2, col.length), 0)) {
  var _b2;
  const fields = [...schema.fields];
  const children = [...chunks];
  const nullBitmapSize = (maxLength + 63 & ~63) >> 3;
  for (const [idx, field] of schema.fields.entries()) {
    const chunk = chunks[idx];
    if (!chunk || chunk.length !== maxLength) {
      fields[idx] = field.clone({ nullable: true });
      children[idx] = (_b2 = chunk === null || chunk === void 0 ? void 0 : chunk._changeLengthAndBackfillNullBitmap(maxLength)) !== null && _b2 !== void 0 ? _b2 : makeData({
        type: field.type,
        length: maxLength,
        nullCount: maxLength,
        nullBitmap: new Uint8Array(nullBitmapSize)
      });
    }
  }
  return [
    schema.assign(fields),
    makeData({ type: new Struct(fields), length: maxLength, children })
  ];
}
function collectDictionaries(fields, children, dictionaries = /* @__PURE__ */ new Map()) {
  var _b2, _c2;
  if (((_b2 = fields === null || fields === void 0 ? void 0 : fields.length) !== null && _b2 !== void 0 ? _b2 : 0) > 0 && (fields === null || fields === void 0 ? void 0 : fields.length) === (children === null || children === void 0 ? void 0 : children.length)) {
    for (let i = -1, n = fields.length; ++i < n; ) {
      const { type } = fields[i];
      const data = children[i];
      for (const next of [data, ...((_c2 = data === null || data === void 0 ? void 0 : data.dictionary) === null || _c2 === void 0 ? void 0 : _c2.data) || []]) {
        collectDictionaries(type.children, next === null || next === void 0 ? void 0 : next.children, dictionaries);
      }
      if (DataType.isDictionary(type)) {
        const { id } = type;
        if (!dictionaries.has(id)) {
          if (data === null || data === void 0 ? void 0 : data.dictionary) {
            dictionaries.set(id, data.dictionary);
          }
        } else if (dictionaries.get(id) !== data.dictionary) {
          throw new Error(`Cannot create Schema containing two different dictionaries with the same Id`);
        }
      }
    }
  }
  return dictionaries;
}
var _InternalEmptyPlaceholderRecordBatch = class extends RecordBatch2 {
  constructor(schema) {
    const children = schema.fields.map((f) => makeData({ type: f.type }));
    const data = makeData({ type: new Struct(schema.fields), nullCount: 0, children });
    super(schema, data);
  }
};

// ../core/node_modules/apache-arrow/fb/message.mjs
var Message = class _Message {
  constructor() {
    this.bb = null;
    this.bb_pos = 0;
  }
  __init(i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
  }
  static getRootAsMessage(bb, obj) {
    return (obj || new _Message()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  static getSizePrefixedRootAsMessage(bb, obj) {
    bb.setPosition(bb.position() + SIZE_PREFIX_LENGTH);
    return (obj || new _Message()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
  }
  version() {
    const offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.readInt16(this.bb_pos + offset) : MetadataVersion.V1;
  }
  headerType() {
    const offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? this.bb.readUint8(this.bb_pos + offset) : MessageHeader.NONE;
  }
  header(obj) {
    const offset = this.bb.__offset(this.bb_pos, 8);
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null;
  }
  bodyLength() {
    const offset = this.bb.__offset(this.bb_pos, 10);
    return offset ? this.bb.readInt64(this.bb_pos + offset) : BigInt("0");
  }
  customMetadata(index, obj) {
    const offset = this.bb.__offset(this.bb_pos, 12);
    return offset ? (obj || new KeyValue()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
  }
  customMetadataLength() {
    const offset = this.bb.__offset(this.bb_pos, 12);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
  }
  static startMessage(builder) {
    builder.startObject(5);
  }
  static addVersion(builder, version) {
    builder.addFieldInt16(0, version, MetadataVersion.V1);
  }
  static addHeaderType(builder, headerType) {
    builder.addFieldInt8(1, headerType, MessageHeader.NONE);
  }
  static addHeader(builder, headerOffset) {
    builder.addFieldOffset(2, headerOffset, 0);
  }
  static addBodyLength(builder, bodyLength) {
    builder.addFieldInt64(3, bodyLength, BigInt("0"));
  }
  static addCustomMetadata(builder, customMetadataOffset) {
    builder.addFieldOffset(4, customMetadataOffset, 0);
  }
  static createCustomMetadataVector(builder, data) {
    builder.startVector(4, data.length, 4);
    for (let i = data.length - 1; i >= 0; i--) {
      builder.addOffset(data[i]);
    }
    return builder.endVector();
  }
  static startCustomMetadataVector(builder, numElems) {
    builder.startVector(4, numElems, 4);
  }
  static endMessage(builder) {
    const offset = builder.endObject();
    return offset;
  }
  static finishMessageBuffer(builder, offset) {
    builder.finish(offset);
  }
  static finishSizePrefixedMessageBuffer(builder, offset) {
    builder.finish(offset, void 0, true);
  }
  static createMessage(builder, version, headerType, headerOffset, bodyLength, customMetadataOffset) {
    _Message.startMessage(builder);
    _Message.addVersion(builder, version);
    _Message.addHeaderType(builder, headerType);
    _Message.addHeader(builder, headerOffset);
    _Message.addBodyLength(builder, bodyLength);
    _Message.addCustomMetadata(builder, customMetadataOffset);
    return _Message.endMessage(builder);
  }
};

// ../core/node_modules/apache-arrow/visitor/typeassembler.mjs
var TypeAssembler = class extends Visitor {
  visit(node, builder) {
    return node == null || builder == null ? void 0 : super.visit(node, builder);
  }
  visitNull(_node, b) {
    Null.startNull(b);
    return Null.endNull(b);
  }
  visitInt(node, b) {
    Int.startInt(b);
    Int.addBitWidth(b, node.bitWidth);
    Int.addIsSigned(b, node.isSigned);
    return Int.endInt(b);
  }
  visitFloat(node, b) {
    FloatingPoint.startFloatingPoint(b);
    FloatingPoint.addPrecision(b, node.precision);
    return FloatingPoint.endFloatingPoint(b);
  }
  visitBinary(_node, b) {
    Binary.startBinary(b);
    return Binary.endBinary(b);
  }
  visitLargeBinary(_node, b) {
    LargeBinary.startLargeBinary(b);
    return LargeBinary.endLargeBinary(b);
  }
  visitBool(_node, b) {
    Bool.startBool(b);
    return Bool.endBool(b);
  }
  visitUtf8(_node, b) {
    Utf8.startUtf8(b);
    return Utf8.endUtf8(b);
  }
  visitLargeUtf8(_node, b) {
    LargeUtf8.startLargeUtf8(b);
    return LargeUtf8.endLargeUtf8(b);
  }
  visitDecimal(node, b) {
    Decimal.startDecimal(b);
    Decimal.addScale(b, node.scale);
    Decimal.addPrecision(b, node.precision);
    Decimal.addBitWidth(b, node.bitWidth);
    return Decimal.endDecimal(b);
  }
  visitDate(node, b) {
    Date2.startDate(b);
    Date2.addUnit(b, node.unit);
    return Date2.endDate(b);
  }
  visitTime(node, b) {
    Time.startTime(b);
    Time.addUnit(b, node.unit);
    Time.addBitWidth(b, node.bitWidth);
    return Time.endTime(b);
  }
  visitTimestamp(node, b) {
    const timezone = node.timezone && b.createString(node.timezone) || void 0;
    Timestamp.startTimestamp(b);
    Timestamp.addUnit(b, node.unit);
    if (timezone !== void 0) {
      Timestamp.addTimezone(b, timezone);
    }
    return Timestamp.endTimestamp(b);
  }
  visitInterval(node, b) {
    Interval.startInterval(b);
    Interval.addUnit(b, node.unit);
    return Interval.endInterval(b);
  }
  visitDuration(node, b) {
    Duration.startDuration(b);
    Duration.addUnit(b, node.unit);
    return Duration.endDuration(b);
  }
  visitList(_node, b) {
    List.startList(b);
    return List.endList(b);
  }
  visitStruct(_node, b) {
    Struct_.startStruct_(b);
    return Struct_.endStruct_(b);
  }
  visitUnion(node, b) {
    Union.startTypeIdsVector(b, node.typeIds.length);
    const typeIds = Union.createTypeIdsVector(b, node.typeIds);
    Union.startUnion(b);
    Union.addMode(b, node.mode);
    Union.addTypeIds(b, typeIds);
    return Union.endUnion(b);
  }
  visitDictionary(node, b) {
    const indexType = this.visit(node.indices, b);
    DictionaryEncoding.startDictionaryEncoding(b);
    DictionaryEncoding.addId(b, BigInt(node.id));
    DictionaryEncoding.addIsOrdered(b, node.isOrdered);
    if (indexType !== void 0) {
      DictionaryEncoding.addIndexType(b, indexType);
    }
    return DictionaryEncoding.endDictionaryEncoding(b);
  }
  visitFixedSizeBinary(node, b) {
    FixedSizeBinary.startFixedSizeBinary(b);
    FixedSizeBinary.addByteWidth(b, node.byteWidth);
    return FixedSizeBinary.endFixedSizeBinary(b);
  }
  visitFixedSizeList(node, b) {
    FixedSizeList.startFixedSizeList(b);
    FixedSizeList.addListSize(b, node.listSize);
    return FixedSizeList.endFixedSizeList(b);
  }
  visitMap(node, b) {
    Map2.startMap(b);
    Map2.addKeysSorted(b, node.keysSorted);
    return Map2.endMap(b);
  }
};
var instance7 = new TypeAssembler();

// ../core/node_modules/apache-arrow/ipc/metadata/json.mjs
function schemaFromJSON(_schema, dictionaries = /* @__PURE__ */ new Map()) {
  return new Schema2(schemaFieldsFromJSON(_schema, dictionaries), customMetadataFromJSON(_schema["metadata"]), dictionaries);
}
function recordBatchFromJSON(b) {
  return new RecordBatch3(b["count"], fieldNodesFromJSON(b["columns"]), buffersFromJSON(b["columns"]));
}
function dictionaryBatchFromJSON(b) {
  return new DictionaryBatch2(recordBatchFromJSON(b["data"]), b["id"], b["isDelta"]);
}
function schemaFieldsFromJSON(_schema, dictionaries) {
  return (_schema["fields"] || []).filter(Boolean).map((f) => Field2.fromJSON(f, dictionaries));
}
function fieldChildrenFromJSON(_field, dictionaries) {
  return (_field["children"] || []).filter(Boolean).map((f) => Field2.fromJSON(f, dictionaries));
}
function fieldNodesFromJSON(xs) {
  return (xs || []).reduce((fieldNodes, column2) => [
    ...fieldNodes,
    new FieldNode2(column2["count"], nullCountFromJSON(column2["VALIDITY"])),
    ...fieldNodesFromJSON(column2["children"])
  ], []);
}
function buffersFromJSON(xs, buffers = []) {
  for (let i = -1, n = (xs || []).length; ++i < n; ) {
    const column2 = xs[i];
    column2["VALIDITY"] && buffers.push(new BufferRegion(buffers.length, column2["VALIDITY"].length));
    column2["TYPE_ID"] && buffers.push(new BufferRegion(buffers.length, column2["TYPE_ID"].length));
    column2["OFFSET"] && buffers.push(new BufferRegion(buffers.length, column2["OFFSET"].length));
    column2["DATA"] && buffers.push(new BufferRegion(buffers.length, column2["DATA"].length));
    buffers = buffersFromJSON(column2["children"], buffers);
  }
  return buffers;
}
function nullCountFromJSON(validity) {
  return (validity || []).reduce((sum2, val) => sum2 + +(val === 0), 0);
}
function fieldFromJSON(_field, dictionaries) {
  let id;
  let keys;
  let field;
  let dictMeta;
  let type;
  let dictType;
  if (!dictionaries || !(dictMeta = _field["dictionary"])) {
    type = typeFromJSON(_field, fieldChildrenFromJSON(_field, dictionaries));
    field = new Field2(_field["name"], type, _field["nullable"], customMetadataFromJSON(_field["metadata"]));
  } else if (!dictionaries.has(id = dictMeta["id"])) {
    keys = (keys = dictMeta["indexType"]) ? indexTypeFromJSON(keys) : new Int32();
    dictionaries.set(id, type = typeFromJSON(_field, fieldChildrenFromJSON(_field, dictionaries)));
    dictType = new Dictionary(type, keys, id, dictMeta["isOrdered"]);
    field = new Field2(_field["name"], dictType, _field["nullable"], customMetadataFromJSON(_field["metadata"]));
  } else {
    keys = (keys = dictMeta["indexType"]) ? indexTypeFromJSON(keys) : new Int32();
    dictType = new Dictionary(dictionaries.get(id), keys, id, dictMeta["isOrdered"]);
    field = new Field2(_field["name"], dictType, _field["nullable"], customMetadataFromJSON(_field["metadata"]));
  }
  return field || null;
}
function customMetadataFromJSON(metadata = []) {
  return new Map(metadata.map(({ key, value }) => [key, value]));
}
function indexTypeFromJSON(_type) {
  return new Int_(_type["isSigned"], _type["bitWidth"]);
}
function typeFromJSON(f, children) {
  const typeId = f["type"]["name"];
  switch (typeId) {
    case "NONE":
      return new Null2();
    case "null":
      return new Null2();
    case "binary":
      return new Binary2();
    case "largebinary":
      return new LargeBinary2();
    case "utf8":
      return new Utf82();
    case "largeutf8":
      return new LargeUtf82();
    case "bool":
      return new Bool2();
    case "list":
      return new List2((children || [])[0]);
    case "struct":
      return new Struct(children || []);
    case "struct_":
      return new Struct(children || []);
  }
  switch (typeId) {
    case "int": {
      const t = f["type"];
      return new Int_(t["isSigned"], t["bitWidth"]);
    }
    case "floatingpoint": {
      const t = f["type"];
      return new Float(Precision[t["precision"]]);
    }
    case "decimal": {
      const t = f["type"];
      return new Decimal2(t["scale"], t["precision"], t["bitWidth"]);
    }
    case "date": {
      const t = f["type"];
      return new Date_(DateUnit[t["unit"]]);
    }
    case "time": {
      const t = f["type"];
      return new Time_(TimeUnit[t["unit"]], t["bitWidth"]);
    }
    case "timestamp": {
      const t = f["type"];
      return new Timestamp_(TimeUnit[t["unit"]], t["timezone"]);
    }
    case "interval": {
      const t = f["type"];
      return new Interval_(IntervalUnit[t["unit"]]);
    }
    case "duration": {
      const t = f["type"];
      return new Duration2(TimeUnit[t["unit"]]);
    }
    case "union": {
      const t = f["type"];
      const [m, ...ms] = (t["mode"] + "").toLowerCase();
      const mode2 = m.toUpperCase() + ms.join("");
      return new Union_(UnionMode[mode2], t["typeIds"] || [], children || []);
    }
    case "fixedsizebinary": {
      const t = f["type"];
      return new FixedSizeBinary2(t["byteWidth"]);
    }
    case "fixedsizelist": {
      const t = f["type"];
      return new FixedSizeList2(t["listSize"], (children || [])[0]);
    }
    case "map": {
      const t = f["type"];
      return new Map_((children || [])[0], t["keysSorted"]);
    }
  }
  throw new Error(`Unrecognized type: "${typeId}"`);
}

// ../core/node_modules/apache-arrow/ipc/metadata/message.mjs
var Builder4 = Builder;
var ByteBuffer3 = ByteBuffer;
var Message2 = class _Message {
  /** @nocollapse */
  static fromJSON(msg, headerType) {
    const message = new _Message(0, MetadataVersion.V5, headerType);
    message._createHeader = messageHeaderFromJSON(msg, headerType);
    return message;
  }
  /** @nocollapse */
  static decode(buf) {
    buf = new ByteBuffer3(toUint8Array(buf));
    const _message = Message.getRootAsMessage(buf);
    const bodyLength = _message.bodyLength();
    const version = _message.version();
    const headerType = _message.headerType();
    const message = new _Message(bodyLength, version, headerType);
    message._createHeader = decodeMessageHeader(_message, headerType);
    return message;
  }
  /** @nocollapse */
  static encode(message) {
    const b = new Builder4();
    let headerOffset = -1;
    if (message.isSchema()) {
      headerOffset = Schema2.encode(b, message.header());
    } else if (message.isRecordBatch()) {
      headerOffset = RecordBatch3.encode(b, message.header());
    } else if (message.isDictionaryBatch()) {
      headerOffset = DictionaryBatch2.encode(b, message.header());
    }
    Message.startMessage(b);
    Message.addVersion(b, MetadataVersion.V5);
    Message.addHeader(b, headerOffset);
    Message.addHeaderType(b, message.headerType);
    Message.addBodyLength(b, BigInt(message.bodyLength));
    Message.finishMessageBuffer(b, Message.endMessage(b));
    return b.asUint8Array();
  }
  /** @nocollapse */
  static from(header, bodyLength = 0) {
    if (header instanceof Schema2) {
      return new _Message(0, MetadataVersion.V5, MessageHeader.Schema, header);
    }
    if (header instanceof RecordBatch3) {
      return new _Message(bodyLength, MetadataVersion.V5, MessageHeader.RecordBatch, header);
    }
    if (header instanceof DictionaryBatch2) {
      return new _Message(bodyLength, MetadataVersion.V5, MessageHeader.DictionaryBatch, header);
    }
    throw new Error(`Unrecognized Message header: ${header}`);
  }
  get type() {
    return this.headerType;
  }
  get version() {
    return this._version;
  }
  get headerType() {
    return this._headerType;
  }
  get bodyLength() {
    return this._bodyLength;
  }
  header() {
    return this._createHeader();
  }
  isSchema() {
    return this.headerType === MessageHeader.Schema;
  }
  isRecordBatch() {
    return this.headerType === MessageHeader.RecordBatch;
  }
  isDictionaryBatch() {
    return this.headerType === MessageHeader.DictionaryBatch;
  }
  constructor(bodyLength, version, headerType, header) {
    this._version = version;
    this._headerType = headerType;
    this.body = new Uint8Array(0);
    header && (this._createHeader = () => header);
    this._bodyLength = bigIntToNumber(bodyLength);
  }
};
var RecordBatch3 = class {
  get nodes() {
    return this._nodes;
  }
  get length() {
    return this._length;
  }
  get buffers() {
    return this._buffers;
  }
  constructor(length2, nodes, buffers) {
    this._nodes = nodes;
    this._buffers = buffers;
    this._length = bigIntToNumber(length2);
  }
};
var DictionaryBatch2 = class {
  get id() {
    return this._id;
  }
  get data() {
    return this._data;
  }
  get isDelta() {
    return this._isDelta;
  }
  get length() {
    return this.data.length;
  }
  get nodes() {
    return this.data.nodes;
  }
  get buffers() {
    return this.data.buffers;
  }
  constructor(data, id, isDelta = false) {
    this._data = data;
    this._isDelta = isDelta;
    this._id = bigIntToNumber(id);
  }
};
var BufferRegion = class {
  constructor(offset, length2) {
    this.offset = bigIntToNumber(offset);
    this.length = bigIntToNumber(length2);
  }
};
var FieldNode2 = class {
  constructor(length2, nullCount) {
    this.length = bigIntToNumber(length2);
    this.nullCount = bigIntToNumber(nullCount);
  }
};
function messageHeaderFromJSON(message, type) {
  return () => {
    switch (type) {
      case MessageHeader.Schema:
        return Schema2.fromJSON(message);
      case MessageHeader.RecordBatch:
        return RecordBatch3.fromJSON(message);
      case MessageHeader.DictionaryBatch:
        return DictionaryBatch2.fromJSON(message);
    }
    throw new Error(`Unrecognized Message type: { name: ${MessageHeader[type]}, type: ${type} }`);
  };
}
function decodeMessageHeader(message, type) {
  return () => {
    switch (type) {
      case MessageHeader.Schema:
        return Schema2.decode(message.header(new Schema()), /* @__PURE__ */ new Map(), message.version());
      case MessageHeader.RecordBatch:
        return RecordBatch3.decode(message.header(new RecordBatch()), message.version());
      case MessageHeader.DictionaryBatch:
        return DictionaryBatch2.decode(message.header(new DictionaryBatch()), message.version());
    }
    throw new Error(`Unrecognized Message type: { name: ${MessageHeader[type]}, type: ${type} }`);
  };
}
Field2["encode"] = encodeField;
Field2["decode"] = decodeField;
Field2["fromJSON"] = fieldFromJSON;
Schema2["encode"] = encodeSchema;
Schema2["decode"] = decodeSchema;
Schema2["fromJSON"] = schemaFromJSON;
RecordBatch3["encode"] = encodeRecordBatch;
RecordBatch3["decode"] = decodeRecordBatch;
RecordBatch3["fromJSON"] = recordBatchFromJSON;
DictionaryBatch2["encode"] = encodeDictionaryBatch;
DictionaryBatch2["decode"] = decodeDictionaryBatch;
DictionaryBatch2["fromJSON"] = dictionaryBatchFromJSON;
FieldNode2["encode"] = encodeFieldNode;
FieldNode2["decode"] = decodeFieldNode;
BufferRegion["encode"] = encodeBufferRegion;
BufferRegion["decode"] = decodeBufferRegion;
function decodeSchema(_schema, dictionaries = /* @__PURE__ */ new Map(), version = MetadataVersion.V5) {
  const fields = decodeSchemaFields(_schema, dictionaries);
  return new Schema2(fields, decodeCustomMetadata(_schema), dictionaries, version);
}
function decodeRecordBatch(batch, version = MetadataVersion.V5) {
  if (batch.compression() !== null) {
    throw new Error("Record batch compression not implemented");
  }
  return new RecordBatch3(batch.length(), decodeFieldNodes(batch), decodeBuffers(batch, version));
}
function decodeDictionaryBatch(batch, version = MetadataVersion.V5) {
  return new DictionaryBatch2(RecordBatch3.decode(batch.data(), version), batch.id(), batch.isDelta());
}
function decodeBufferRegion(b) {
  return new BufferRegion(b.offset(), b.length());
}
function decodeFieldNode(f) {
  return new FieldNode2(f.length(), f.nullCount());
}
function decodeFieldNodes(batch) {
  const nodes = [];
  for (let f, i = -1, j = -1, n = batch.nodesLength(); ++i < n; ) {
    if (f = batch.nodes(i)) {
      nodes[++j] = FieldNode2.decode(f);
    }
  }
  return nodes;
}
function decodeBuffers(batch, version) {
  const bufferRegions = [];
  for (let b, i = -1, j = -1, n = batch.buffersLength(); ++i < n; ) {
    if (b = batch.buffers(i)) {
      if (version < MetadataVersion.V4) {
        b.bb_pos += 8 * (i + 1);
      }
      bufferRegions[++j] = BufferRegion.decode(b);
    }
  }
  return bufferRegions;
}
function decodeSchemaFields(schema, dictionaries) {
  const fields = [];
  for (let f, i = -1, j = -1, n = schema.fieldsLength(); ++i < n; ) {
    if (f = schema.fields(i)) {
      fields[++j] = Field2.decode(f, dictionaries);
    }
  }
  return fields;
}
function decodeFieldChildren(field, dictionaries) {
  const children = [];
  for (let f, i = -1, j = -1, n = field.childrenLength(); ++i < n; ) {
    if (f = field.children(i)) {
      children[++j] = Field2.decode(f, dictionaries);
    }
  }
  return children;
}
function decodeField(f, dictionaries) {
  let id;
  let field;
  let type;
  let keys;
  let dictType;
  let dictMeta;
  if (!dictionaries || !(dictMeta = f.dictionary())) {
    type = decodeFieldType(f, decodeFieldChildren(f, dictionaries));
    field = new Field2(f.name(), type, f.nullable(), decodeCustomMetadata(f));
  } else if (!dictionaries.has(id = bigIntToNumber(dictMeta.id()))) {
    keys = (keys = dictMeta.indexType()) ? decodeIndexType(keys) : new Int32();
    dictionaries.set(id, type = decodeFieldType(f, decodeFieldChildren(f, dictionaries)));
    dictType = new Dictionary(type, keys, id, dictMeta.isOrdered());
    field = new Field2(f.name(), dictType, f.nullable(), decodeCustomMetadata(f));
  } else {
    keys = (keys = dictMeta.indexType()) ? decodeIndexType(keys) : new Int32();
    dictType = new Dictionary(dictionaries.get(id), keys, id, dictMeta.isOrdered());
    field = new Field2(f.name(), dictType, f.nullable(), decodeCustomMetadata(f));
  }
  return field || null;
}
function decodeCustomMetadata(parent) {
  const data = /* @__PURE__ */ new Map();
  if (parent) {
    for (let entry, key, i = -1, n = Math.trunc(parent.customMetadataLength()); ++i < n; ) {
      if ((entry = parent.customMetadata(i)) && (key = entry.key()) != null) {
        data.set(key, entry.value());
      }
    }
  }
  return data;
}
function decodeIndexType(_type) {
  return new Int_(_type.isSigned(), _type.bitWidth());
}
function decodeFieldType(f, children) {
  const typeId = f.typeType();
  switch (typeId) {
    case Type["NONE"]:
      return new Null2();
    case Type["Null"]:
      return new Null2();
    case Type["Binary"]:
      return new Binary2();
    case Type["LargeBinary"]:
      return new LargeBinary2();
    case Type["Utf8"]:
      return new Utf82();
    case Type["LargeUtf8"]:
      return new LargeUtf82();
    case Type["Bool"]:
      return new Bool2();
    case Type["List"]:
      return new List2((children || [])[0]);
    case Type["Struct_"]:
      return new Struct(children || []);
  }
  switch (typeId) {
    case Type["Int"]: {
      const t = f.type(new Int());
      return new Int_(t.isSigned(), t.bitWidth());
    }
    case Type["FloatingPoint"]: {
      const t = f.type(new FloatingPoint());
      return new Float(t.precision());
    }
    case Type["Decimal"]: {
      const t = f.type(new Decimal());
      return new Decimal2(t.scale(), t.precision(), t.bitWidth());
    }
    case Type["Date"]: {
      const t = f.type(new Date2());
      return new Date_(t.unit());
    }
    case Type["Time"]: {
      const t = f.type(new Time());
      return new Time_(t.unit(), t.bitWidth());
    }
    case Type["Timestamp"]: {
      const t = f.type(new Timestamp());
      return new Timestamp_(t.unit(), t.timezone());
    }
    case Type["Interval"]: {
      const t = f.type(new Interval());
      return new Interval_(t.unit());
    }
    case Type["Duration"]: {
      const t = f.type(new Duration());
      return new Duration2(t.unit());
    }
    case Type["Union"]: {
      const t = f.type(new Union());
      return new Union_(t.mode(), t.typeIdsArray() || [], children || []);
    }
    case Type["FixedSizeBinary"]: {
      const t = f.type(new FixedSizeBinary());
      return new FixedSizeBinary2(t.byteWidth());
    }
    case Type["FixedSizeList"]: {
      const t = f.type(new FixedSizeList());
      return new FixedSizeList2(t.listSize(), (children || [])[0]);
    }
    case Type["Map"]: {
      const t = f.type(new Map2());
      return new Map_((children || [])[0], t.keysSorted());
    }
  }
  throw new Error(`Unrecognized type: "${Type[typeId]}" (${typeId})`);
}
function encodeSchema(b, schema) {
  const fieldOffsets = schema.fields.map((f) => Field2.encode(b, f));
  Schema.startFieldsVector(b, fieldOffsets.length);
  const fieldsVectorOffset = Schema.createFieldsVector(b, fieldOffsets);
  const metadataOffset = !(schema.metadata && schema.metadata.size > 0) ? -1 : Schema.createCustomMetadataVector(b, [...schema.metadata].map(([k, v]) => {
    const key = b.createString(`${k}`);
    const val = b.createString(`${v}`);
    KeyValue.startKeyValue(b);
    KeyValue.addKey(b, key);
    KeyValue.addValue(b, val);
    return KeyValue.endKeyValue(b);
  }));
  Schema.startSchema(b);
  Schema.addFields(b, fieldsVectorOffset);
  Schema.addEndianness(b, platformIsLittleEndian ? Endianness.Little : Endianness.Big);
  if (metadataOffset !== -1) {
    Schema.addCustomMetadata(b, metadataOffset);
  }
  return Schema.endSchema(b);
}
function encodeField(b, field) {
  let nameOffset = -1;
  let typeOffset = -1;
  let dictionaryOffset = -1;
  const type = field.type;
  let typeId = field.typeId;
  if (!DataType.isDictionary(type)) {
    typeOffset = instance7.visit(type, b);
  } else {
    typeId = type.dictionary.typeId;
    dictionaryOffset = instance7.visit(type, b);
    typeOffset = instance7.visit(type.dictionary, b);
  }
  const childOffsets = (type.children || []).map((f) => Field2.encode(b, f));
  const childrenVectorOffset = Field.createChildrenVector(b, childOffsets);
  const metadataOffset = !(field.metadata && field.metadata.size > 0) ? -1 : Field.createCustomMetadataVector(b, [...field.metadata].map(([k, v]) => {
    const key = b.createString(`${k}`);
    const val = b.createString(`${v}`);
    KeyValue.startKeyValue(b);
    KeyValue.addKey(b, key);
    KeyValue.addValue(b, val);
    return KeyValue.endKeyValue(b);
  }));
  if (field.name) {
    nameOffset = b.createString(field.name);
  }
  Field.startField(b);
  Field.addType(b, typeOffset);
  Field.addTypeType(b, typeId);
  Field.addChildren(b, childrenVectorOffset);
  Field.addNullable(b, !!field.nullable);
  if (nameOffset !== -1) {
    Field.addName(b, nameOffset);
  }
  if (dictionaryOffset !== -1) {
    Field.addDictionary(b, dictionaryOffset);
  }
  if (metadataOffset !== -1) {
    Field.addCustomMetadata(b, metadataOffset);
  }
  return Field.endField(b);
}
function encodeRecordBatch(b, recordBatch) {
  const nodes = recordBatch.nodes || [];
  const buffers = recordBatch.buffers || [];
  RecordBatch.startNodesVector(b, nodes.length);
  for (const n of nodes.slice().reverse())
    FieldNode2.encode(b, n);
  const nodesVectorOffset = b.endVector();
  RecordBatch.startBuffersVector(b, buffers.length);
  for (const b_ of buffers.slice().reverse())
    BufferRegion.encode(b, b_);
  const buffersVectorOffset = b.endVector();
  RecordBatch.startRecordBatch(b);
  RecordBatch.addLength(b, BigInt(recordBatch.length));
  RecordBatch.addNodes(b, nodesVectorOffset);
  RecordBatch.addBuffers(b, buffersVectorOffset);
  return RecordBatch.endRecordBatch(b);
}
function encodeDictionaryBatch(b, dictionaryBatch) {
  const dataOffset = RecordBatch3.encode(b, dictionaryBatch.data);
  DictionaryBatch.startDictionaryBatch(b);
  DictionaryBatch.addId(b, BigInt(dictionaryBatch.id));
  DictionaryBatch.addIsDelta(b, dictionaryBatch.isDelta);
  DictionaryBatch.addData(b, dataOffset);
  return DictionaryBatch.endDictionaryBatch(b);
}
function encodeFieldNode(b, node) {
  return FieldNode.createFieldNode(b, BigInt(node.length), BigInt(node.nullCount));
}
function encodeBufferRegion(b, node) {
  return Buffer2.createBuffer(b, BigInt(node.offset), BigInt(node.length));
}
var platformIsLittleEndian = (() => {
  const buffer = new ArrayBuffer(2);
  new DataView(buffer).setInt16(
    0,
    256,
    true
    /* littleEndian */
  );
  return new Int16Array(buffer)[0] === 256;
})();

// ../core/node_modules/apache-arrow/ipc/message.mjs
var invalidMessageType = (type) => `Expected ${MessageHeader[type]} Message in stream, but was null or length 0.`;
var nullMessage = (type) => `Header pointer of flatbuffer-encoded ${MessageHeader[type]} Message is null or length 0.`;
var invalidMessageMetadata = (expected, actual) => `Expected to read ${expected} metadata bytes, but only read ${actual}.`;
var invalidMessageBodyLength = (expected, actual) => `Expected to read ${expected} bytes for message body, but only read ${actual}.`;
var MessageReader = class {
  constructor(source) {
    this.source = source instanceof ByteStream ? source : new ByteStream(source);
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    let r;
    if ((r = this.readMetadataLength()).done) {
      return ITERATOR_DONE;
    }
    if (r.value === -1 && (r = this.readMetadataLength()).done) {
      return ITERATOR_DONE;
    }
    if ((r = this.readMetadata(r.value)).done) {
      return ITERATOR_DONE;
    }
    return r;
  }
  throw(value) {
    return this.source.throw(value);
  }
  return(value) {
    return this.source.return(value);
  }
  readMessage(type) {
    let r;
    if ((r = this.next()).done) {
      return null;
    }
    if (type != null && r.value.headerType !== type) {
      throw new Error(invalidMessageType(type));
    }
    return r.value;
  }
  readMessageBody(bodyLength) {
    if (bodyLength <= 0) {
      return new Uint8Array(0);
    }
    const buf = toUint8Array(this.source.read(bodyLength));
    if (buf.byteLength < bodyLength) {
      throw new Error(invalidMessageBodyLength(bodyLength, buf.byteLength));
    }
    return (
      /* 1. */
      buf.byteOffset % 8 === 0 && /* 2. */
      buf.byteOffset + buf.byteLength <= buf.buffer.byteLength ? buf : buf.slice()
    );
  }
  readSchema(throwIfNull = false) {
    const type = MessageHeader.Schema;
    const message = this.readMessage(type);
    const schema = message === null || message === void 0 ? void 0 : message.header();
    if (throwIfNull && !schema) {
      throw new Error(nullMessage(type));
    }
    return schema;
  }
  readMetadataLength() {
    const buf = this.source.read(PADDING);
    const bb = buf && new ByteBuffer(buf);
    const len = (bb === null || bb === void 0 ? void 0 : bb.readInt32(0)) || 0;
    return { done: len === 0, value: len };
  }
  readMetadata(metadataLength) {
    const buf = this.source.read(metadataLength);
    if (!buf) {
      return ITERATOR_DONE;
    }
    if (buf.byteLength < metadataLength) {
      throw new Error(invalidMessageMetadata(metadataLength, buf.byteLength));
    }
    return { done: false, value: Message2.decode(buf) };
  }
};
var AsyncMessageReader = class {
  constructor(source, byteLength) {
    this.source = source instanceof AsyncByteStream ? source : isFileHandle(source) ? new AsyncRandomAccessFile(source, byteLength) : new AsyncByteStream(source);
  }
  [Symbol.asyncIterator]() {
    return this;
  }
  next() {
    return __awaiter(this, void 0, void 0, function* () {
      let r;
      if ((r = yield this.readMetadataLength()).done) {
        return ITERATOR_DONE;
      }
      if (r.value === -1 && (r = yield this.readMetadataLength()).done) {
        return ITERATOR_DONE;
      }
      if ((r = yield this.readMetadata(r.value)).done) {
        return ITERATOR_DONE;
      }
      return r;
    });
  }
  throw(value) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.source.throw(value);
    });
  }
  return(value) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.source.return(value);
    });
  }
  readMessage(type) {
    return __awaiter(this, void 0, void 0, function* () {
      let r;
      if ((r = yield this.next()).done) {
        return null;
      }
      if (type != null && r.value.headerType !== type) {
        throw new Error(invalidMessageType(type));
      }
      return r.value;
    });
  }
  readMessageBody(bodyLength) {
    return __awaiter(this, void 0, void 0, function* () {
      if (bodyLength <= 0) {
        return new Uint8Array(0);
      }
      const buf = toUint8Array(yield this.source.read(bodyLength));
      if (buf.byteLength < bodyLength) {
        throw new Error(invalidMessageBodyLength(bodyLength, buf.byteLength));
      }
      return (
        /* 1. */
        buf.byteOffset % 8 === 0 && /* 2. */
        buf.byteOffset + buf.byteLength <= buf.buffer.byteLength ? buf : buf.slice()
      );
    });
  }
  readSchema(throwIfNull = false) {
    return __awaiter(this, void 0, void 0, function* () {
      const type = MessageHeader.Schema;
      const message = yield this.readMessage(type);
      const schema = message === null || message === void 0 ? void 0 : message.header();
      if (throwIfNull && !schema) {
        throw new Error(nullMessage(type));
      }
      return schema;
    });
  }
  readMetadataLength() {
    return __awaiter(this, void 0, void 0, function* () {
      const buf = yield this.source.read(PADDING);
      const bb = buf && new ByteBuffer(buf);
      const len = (bb === null || bb === void 0 ? void 0 : bb.readInt32(0)) || 0;
      return { done: len === 0, value: len };
    });
  }
  readMetadata(metadataLength) {
    return __awaiter(this, void 0, void 0, function* () {
      const buf = yield this.source.read(metadataLength);
      if (!buf) {
        return ITERATOR_DONE;
      }
      if (buf.byteLength < metadataLength) {
        throw new Error(invalidMessageMetadata(metadataLength, buf.byteLength));
      }
      return { done: false, value: Message2.decode(buf) };
    });
  }
};
var JSONMessageReader = class extends MessageReader {
  constructor(source) {
    super(new Uint8Array(0));
    this._schema = false;
    this._body = [];
    this._batchIndex = 0;
    this._dictionaryIndex = 0;
    this._json = source instanceof ArrowJSON ? source : new ArrowJSON(source);
  }
  next() {
    const { _json } = this;
    if (!this._schema) {
      this._schema = true;
      const message = Message2.fromJSON(_json.schema, MessageHeader.Schema);
      return { done: false, value: message };
    }
    if (this._dictionaryIndex < _json.dictionaries.length) {
      const batch = _json.dictionaries[this._dictionaryIndex++];
      this._body = batch["data"]["columns"];
      const message = Message2.fromJSON(batch, MessageHeader.DictionaryBatch);
      return { done: false, value: message };
    }
    if (this._batchIndex < _json.batches.length) {
      const batch = _json.batches[this._batchIndex++];
      this._body = batch["columns"];
      const message = Message2.fromJSON(batch, MessageHeader.RecordBatch);
      return { done: false, value: message };
    }
    this._body = [];
    return ITERATOR_DONE;
  }
  readMessageBody(_bodyLength) {
    return flattenDataSources(this._body);
    function flattenDataSources(xs) {
      return (xs || []).reduce((buffers, column2) => [
        ...buffers,
        ...column2["VALIDITY"] && [column2["VALIDITY"]] || [],
        ...column2["TYPE_ID"] && [column2["TYPE_ID"]] || [],
        ...column2["OFFSET"] && [column2["OFFSET"]] || [],
        ...column2["DATA"] && [column2["DATA"]] || [],
        ...flattenDataSources(column2["children"])
      ], []);
    }
  }
  readMessage(type) {
    let r;
    if ((r = this.next()).done) {
      return null;
    }
    if (type != null && r.value.headerType !== type) {
      throw new Error(invalidMessageType(type));
    }
    return r.value;
  }
  readSchema() {
    const type = MessageHeader.Schema;
    const message = this.readMessage(type);
    const schema = message === null || message === void 0 ? void 0 : message.header();
    if (!message || !schema) {
      throw new Error(nullMessage(type));
    }
    return schema;
  }
};
var PADDING = 4;
var MAGIC_STR = "ARROW1";
var MAGIC = new Uint8Array(MAGIC_STR.length);
for (let i = 0; i < MAGIC_STR.length; i += 1) {
  MAGIC[i] = MAGIC_STR.codePointAt(i);
}
function checkForMagicArrowString(buffer, index = 0) {
  for (let i = -1, n = MAGIC.length; ++i < n; ) {
    if (MAGIC[i] !== buffer[index + i]) {
      return false;
    }
  }
  return true;
}
var magicLength = MAGIC.length;
var magicAndPadding = magicLength + PADDING;
var magicX2AndPadding = magicLength * 2 + PADDING;

// ../core/node_modules/apache-arrow/ipc/reader.mjs
var RecordBatchReader = class _RecordBatchReader extends ReadableInterop {
  constructor(impl) {
    super();
    this._impl = impl;
  }
  get closed() {
    return this._impl.closed;
  }
  get schema() {
    return this._impl.schema;
  }
  get autoDestroy() {
    return this._impl.autoDestroy;
  }
  get dictionaries() {
    return this._impl.dictionaries;
  }
  get numDictionaries() {
    return this._impl.numDictionaries;
  }
  get numRecordBatches() {
    return this._impl.numRecordBatches;
  }
  get footer() {
    return this._impl.isFile() ? this._impl.footer : null;
  }
  isSync() {
    return this._impl.isSync();
  }
  isAsync() {
    return this._impl.isAsync();
  }
  isFile() {
    return this._impl.isFile();
  }
  isStream() {
    return this._impl.isStream();
  }
  next() {
    return this._impl.next();
  }
  throw(value) {
    return this._impl.throw(value);
  }
  return(value) {
    return this._impl.return(value);
  }
  cancel() {
    return this._impl.cancel();
  }
  reset(schema) {
    this._impl.reset(schema);
    this._DOMStream = void 0;
    this._nodeStream = void 0;
    return this;
  }
  open(options) {
    const opening = this._impl.open(options);
    return isPromise(opening) ? opening.then(() => this) : this;
  }
  readRecordBatch(index) {
    return this._impl.isFile() ? this._impl.readRecordBatch(index) : null;
  }
  [Symbol.iterator]() {
    return this._impl[Symbol.iterator]();
  }
  [Symbol.asyncIterator]() {
    return this._impl[Symbol.asyncIterator]();
  }
  toDOMStream() {
    return adapters_default.toDOMStream(this.isSync() ? { [Symbol.iterator]: () => this } : { [Symbol.asyncIterator]: () => this });
  }
  toNodeStream() {
    return adapters_default.toNodeStream(this.isSync() ? { [Symbol.iterator]: () => this } : { [Symbol.asyncIterator]: () => this }, { objectMode: true });
  }
  /** @nocollapse */
  // @ts-ignore
  static throughNode(options) {
    throw new Error(`"throughNode" not available in this environment`);
  }
  /** @nocollapse */
  static throughDOM(writableStrategy, readableStrategy) {
    throw new Error(`"throughDOM" not available in this environment`);
  }
  /** @nocollapse */
  static from(source) {
    if (source instanceof _RecordBatchReader) {
      return source;
    } else if (isArrowJSON(source)) {
      return fromArrowJSON(source);
    } else if (isFileHandle(source)) {
      return fromFileHandle(source);
    } else if (isPromise(source)) {
      return (() => __awaiter(this, void 0, void 0, function* () {
        return yield _RecordBatchReader.from(yield source);
      }))();
    } else if (isFetchResponse(source) || isReadableDOMStream(source) || isReadableNodeStream(source) || isAsyncIterable(source)) {
      return fromAsyncByteStream(new AsyncByteStream(source));
    }
    return fromByteStream(new ByteStream(source));
  }
  /** @nocollapse */
  static readAll(source) {
    if (source instanceof _RecordBatchReader) {
      return source.isSync() ? readAllSync(source) : readAllAsync(source);
    } else if (isArrowJSON(source) || ArrayBuffer.isView(source) || isIterable(source) || isIteratorResult(source)) {
      return readAllSync(source);
    }
    return readAllAsync(source);
  }
};
var RecordBatchStreamReader = class extends RecordBatchReader {
  constructor(_impl) {
    super(_impl);
    this._impl = _impl;
  }
  readAll() {
    return [...this];
  }
  [Symbol.iterator]() {
    return this._impl[Symbol.iterator]();
  }
  [Symbol.asyncIterator]() {
    return __asyncGenerator(this, arguments, function* _a5() {
      yield __await(yield* __asyncDelegator(__asyncValues(this[Symbol.iterator]())));
    });
  }
};
var AsyncRecordBatchStreamReader = class extends RecordBatchReader {
  constructor(_impl) {
    super(_impl);
    this._impl = _impl;
  }
  readAll() {
    var _a5, e_1, _b2, _c2;
    return __awaiter(this, void 0, void 0, function* () {
      const batches = new Array();
      try {
        for (var _d2 = true, _e2 = __asyncValues(this), _f2; _f2 = yield _e2.next(), _a5 = _f2.done, !_a5; _d2 = true) {
          _c2 = _f2.value;
          _d2 = false;
          const batch = _c2;
          batches.push(batch);
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (!_d2 && !_a5 && (_b2 = _e2.return))
            yield _b2.call(_e2);
        } finally {
          if (e_1)
            throw e_1.error;
        }
      }
      return batches;
    });
  }
  [Symbol.iterator]() {
    throw new Error(`AsyncRecordBatchStreamReader is not Iterable`);
  }
  [Symbol.asyncIterator]() {
    return this._impl[Symbol.asyncIterator]();
  }
};
var RecordBatchFileReader = class extends RecordBatchStreamReader {
  constructor(_impl) {
    super(_impl);
    this._impl = _impl;
  }
};
var AsyncRecordBatchFileReader = class extends AsyncRecordBatchStreamReader {
  constructor(_impl) {
    super(_impl);
    this._impl = _impl;
  }
};
var RecordBatchReaderImpl = class {
  get numDictionaries() {
    return this._dictionaryIndex;
  }
  get numRecordBatches() {
    return this._recordBatchIndex;
  }
  constructor(dictionaries = /* @__PURE__ */ new Map()) {
    this.closed = false;
    this.autoDestroy = true;
    this._dictionaryIndex = 0;
    this._recordBatchIndex = 0;
    this.dictionaries = dictionaries;
  }
  isSync() {
    return false;
  }
  isAsync() {
    return false;
  }
  isFile() {
    return false;
  }
  isStream() {
    return false;
  }
  reset(schema) {
    this._dictionaryIndex = 0;
    this._recordBatchIndex = 0;
    this.schema = schema;
    this.dictionaries = /* @__PURE__ */ new Map();
    return this;
  }
  _loadRecordBatch(header, body) {
    const children = this._loadVectors(header, body, this.schema.fields);
    const data = makeData({ type: new Struct(this.schema.fields), length: header.length, children });
    return new RecordBatch2(this.schema, data);
  }
  _loadDictionaryBatch(header, body) {
    const { id, isDelta } = header;
    const { dictionaries, schema } = this;
    const dictionary = dictionaries.get(id);
    if (isDelta || !dictionary) {
      const type = schema.dictionaries.get(id);
      const data = this._loadVectors(header.data, body, [type]);
      return (dictionary && isDelta ? dictionary.concat(new Vector(data)) : new Vector(data)).memoize();
    }
    return dictionary.memoize();
  }
  _loadVectors(header, body, types) {
    return new VectorLoader(body, header.nodes, header.buffers, this.dictionaries, this.schema.metadataVersion).visitMany(types);
  }
};
var RecordBatchStreamReaderImpl = class extends RecordBatchReaderImpl {
  constructor(source, dictionaries) {
    super(dictionaries);
    this._reader = !isArrowJSON(source) ? new MessageReader(this._handle = source) : new JSONMessageReader(this._handle = source);
  }
  isSync() {
    return true;
  }
  isStream() {
    return true;
  }
  [Symbol.iterator]() {
    return this;
  }
  cancel() {
    if (!this.closed && (this.closed = true)) {
      this.reset()._reader.return();
      this._reader = null;
      this.dictionaries = null;
    }
  }
  open(options) {
    if (!this.closed) {
      this.autoDestroy = shouldAutoDestroy(this, options);
      if (!(this.schema || (this.schema = this._reader.readSchema()))) {
        this.cancel();
      }
    }
    return this;
  }
  throw(value) {
    if (!this.closed && this.autoDestroy && (this.closed = true)) {
      return this.reset()._reader.throw(value);
    }
    return ITERATOR_DONE;
  }
  return(value) {
    if (!this.closed && this.autoDestroy && (this.closed = true)) {
      return this.reset()._reader.return(value);
    }
    return ITERATOR_DONE;
  }
  next() {
    if (this.closed) {
      return ITERATOR_DONE;
    }
    let message;
    const { _reader: reader } = this;
    while (message = this._readNextMessageAndValidate()) {
      if (message.isSchema()) {
        this.reset(message.header());
      } else if (message.isRecordBatch()) {
        this._recordBatchIndex++;
        const header = message.header();
        const buffer = reader.readMessageBody(message.bodyLength);
        const recordBatch = this._loadRecordBatch(header, buffer);
        return { done: false, value: recordBatch };
      } else if (message.isDictionaryBatch()) {
        this._dictionaryIndex++;
        const header = message.header();
        const buffer = reader.readMessageBody(message.bodyLength);
        const vector = this._loadDictionaryBatch(header, buffer);
        this.dictionaries.set(header.id, vector);
      }
    }
    if (this.schema && this._recordBatchIndex === 0) {
      this._recordBatchIndex++;
      return { done: false, value: new _InternalEmptyPlaceholderRecordBatch(this.schema) };
    }
    return this.return();
  }
  _readNextMessageAndValidate(type) {
    return this._reader.readMessage(type);
  }
};
var AsyncRecordBatchStreamReaderImpl = class extends RecordBatchReaderImpl {
  constructor(source, dictionaries) {
    super(dictionaries);
    this._reader = new AsyncMessageReader(this._handle = source);
  }
  isAsync() {
    return true;
  }
  isStream() {
    return true;
  }
  [Symbol.asyncIterator]() {
    return this;
  }
  cancel() {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this.closed && (this.closed = true)) {
        yield this.reset()._reader.return();
        this._reader = null;
        this.dictionaries = null;
      }
    });
  }
  open(options) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this.closed) {
        this.autoDestroy = shouldAutoDestroy(this, options);
        if (!(this.schema || (this.schema = yield this._reader.readSchema()))) {
          yield this.cancel();
        }
      }
      return this;
    });
  }
  throw(value) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this.closed && this.autoDestroy && (this.closed = true)) {
        return yield this.reset()._reader.throw(value);
      }
      return ITERATOR_DONE;
    });
  }
  return(value) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this.closed && this.autoDestroy && (this.closed = true)) {
        return yield this.reset()._reader.return(value);
      }
      return ITERATOR_DONE;
    });
  }
  next() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.closed) {
        return ITERATOR_DONE;
      }
      let message;
      const { _reader: reader } = this;
      while (message = yield this._readNextMessageAndValidate()) {
        if (message.isSchema()) {
          yield this.reset(message.header());
        } else if (message.isRecordBatch()) {
          this._recordBatchIndex++;
          const header = message.header();
          const buffer = yield reader.readMessageBody(message.bodyLength);
          const recordBatch = this._loadRecordBatch(header, buffer);
          return { done: false, value: recordBatch };
        } else if (message.isDictionaryBatch()) {
          this._dictionaryIndex++;
          const header = message.header();
          const buffer = yield reader.readMessageBody(message.bodyLength);
          const vector = this._loadDictionaryBatch(header, buffer);
          this.dictionaries.set(header.id, vector);
        }
      }
      if (this.schema && this._recordBatchIndex === 0) {
        this._recordBatchIndex++;
        return { done: false, value: new _InternalEmptyPlaceholderRecordBatch(this.schema) };
      }
      return yield this.return();
    });
  }
  _readNextMessageAndValidate(type) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this._reader.readMessage(type);
    });
  }
};
var RecordBatchFileReaderImpl = class extends RecordBatchStreamReaderImpl {
  get footer() {
    return this._footer;
  }
  get numDictionaries() {
    return this._footer ? this._footer.numDictionaries : 0;
  }
  get numRecordBatches() {
    return this._footer ? this._footer.numRecordBatches : 0;
  }
  constructor(source, dictionaries) {
    super(source instanceof RandomAccessFile ? source : new RandomAccessFile(source), dictionaries);
  }
  isSync() {
    return true;
  }
  isFile() {
    return true;
  }
  open(options) {
    if (!this.closed && !this._footer) {
      this.schema = (this._footer = this._readFooter()).schema;
      for (const block of this._footer.dictionaryBatches()) {
        block && this._readDictionaryBatch(this._dictionaryIndex++);
      }
    }
    return super.open(options);
  }
  readRecordBatch(index) {
    var _a5;
    if (this.closed) {
      return null;
    }
    if (!this._footer) {
      this.open();
    }
    const block = (_a5 = this._footer) === null || _a5 === void 0 ? void 0 : _a5.getRecordBatch(index);
    if (block && this._handle.seek(block.offset)) {
      const message = this._reader.readMessage(MessageHeader.RecordBatch);
      if (message === null || message === void 0 ? void 0 : message.isRecordBatch()) {
        const header = message.header();
        const buffer = this._reader.readMessageBody(message.bodyLength);
        const recordBatch = this._loadRecordBatch(header, buffer);
        return recordBatch;
      }
    }
    return null;
  }
  _readDictionaryBatch(index) {
    var _a5;
    const block = (_a5 = this._footer) === null || _a5 === void 0 ? void 0 : _a5.getDictionaryBatch(index);
    if (block && this._handle.seek(block.offset)) {
      const message = this._reader.readMessage(MessageHeader.DictionaryBatch);
      if (message === null || message === void 0 ? void 0 : message.isDictionaryBatch()) {
        const header = message.header();
        const buffer = this._reader.readMessageBody(message.bodyLength);
        const vector = this._loadDictionaryBatch(header, buffer);
        this.dictionaries.set(header.id, vector);
      }
    }
  }
  _readFooter() {
    const { _handle } = this;
    const offset = _handle.size - magicAndPadding;
    const length2 = _handle.readInt32(offset);
    const buffer = _handle.readAt(offset - length2, length2);
    return Footer_.decode(buffer);
  }
  _readNextMessageAndValidate(type) {
    var _a5;
    if (!this._footer) {
      this.open();
    }
    if (this._footer && this._recordBatchIndex < this.numRecordBatches) {
      const block = (_a5 = this._footer) === null || _a5 === void 0 ? void 0 : _a5.getRecordBatch(this._recordBatchIndex);
      if (block && this._handle.seek(block.offset)) {
        return this._reader.readMessage(type);
      }
    }
    return null;
  }
};
var AsyncRecordBatchFileReaderImpl = class extends AsyncRecordBatchStreamReaderImpl {
  get footer() {
    return this._footer;
  }
  get numDictionaries() {
    return this._footer ? this._footer.numDictionaries : 0;
  }
  get numRecordBatches() {
    return this._footer ? this._footer.numRecordBatches : 0;
  }
  constructor(source, ...rest) {
    const byteLength = typeof rest[0] !== "number" ? rest.shift() : void 0;
    const dictionaries = rest[0] instanceof Map ? rest.shift() : void 0;
    super(source instanceof AsyncRandomAccessFile ? source : new AsyncRandomAccessFile(source, byteLength), dictionaries);
  }
  isFile() {
    return true;
  }
  isAsync() {
    return true;
  }
  open(options) {
    const _super = Object.create(null, {
      open: { get: () => super.open }
    });
    return __awaiter(this, void 0, void 0, function* () {
      if (!this.closed && !this._footer) {
        this.schema = (this._footer = yield this._readFooter()).schema;
        for (const block of this._footer.dictionaryBatches()) {
          block && (yield this._readDictionaryBatch(this._dictionaryIndex++));
        }
      }
      return yield _super.open.call(this, options);
    });
  }
  readRecordBatch(index) {
    var _a5;
    return __awaiter(this, void 0, void 0, function* () {
      if (this.closed) {
        return null;
      }
      if (!this._footer) {
        yield this.open();
      }
      const block = (_a5 = this._footer) === null || _a5 === void 0 ? void 0 : _a5.getRecordBatch(index);
      if (block && (yield this._handle.seek(block.offset))) {
        const message = yield this._reader.readMessage(MessageHeader.RecordBatch);
        if (message === null || message === void 0 ? void 0 : message.isRecordBatch()) {
          const header = message.header();
          const buffer = yield this._reader.readMessageBody(message.bodyLength);
          const recordBatch = this._loadRecordBatch(header, buffer);
          return recordBatch;
        }
      }
      return null;
    });
  }
  _readDictionaryBatch(index) {
    var _a5;
    return __awaiter(this, void 0, void 0, function* () {
      const block = (_a5 = this._footer) === null || _a5 === void 0 ? void 0 : _a5.getDictionaryBatch(index);
      if (block && (yield this._handle.seek(block.offset))) {
        const message = yield this._reader.readMessage(MessageHeader.DictionaryBatch);
        if (message === null || message === void 0 ? void 0 : message.isDictionaryBatch()) {
          const header = message.header();
          const buffer = yield this._reader.readMessageBody(message.bodyLength);
          const vector = this._loadDictionaryBatch(header, buffer);
          this.dictionaries.set(header.id, vector);
        }
      }
    });
  }
  _readFooter() {
    return __awaiter(this, void 0, void 0, function* () {
      const { _handle } = this;
      _handle._pending && (yield _handle._pending);
      const offset = _handle.size - magicAndPadding;
      const length2 = yield _handle.readInt32(offset);
      const buffer = yield _handle.readAt(offset - length2, length2);
      return Footer_.decode(buffer);
    });
  }
  _readNextMessageAndValidate(type) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this._footer) {
        yield this.open();
      }
      if (this._footer && this._recordBatchIndex < this.numRecordBatches) {
        const block = this._footer.getRecordBatch(this._recordBatchIndex);
        if (block && (yield this._handle.seek(block.offset))) {
          return yield this._reader.readMessage(type);
        }
      }
      return null;
    });
  }
};
var RecordBatchJSONReaderImpl = class extends RecordBatchStreamReaderImpl {
  constructor(source, dictionaries) {
    super(source, dictionaries);
  }
  _loadVectors(header, body, types) {
    return new JSONVectorLoader(body, header.nodes, header.buffers, this.dictionaries, this.schema.metadataVersion).visitMany(types);
  }
};
function shouldAutoDestroy(self, options) {
  return options && typeof options["autoDestroy"] === "boolean" ? options["autoDestroy"] : self["autoDestroy"];
}
function* readAllSync(source) {
  const reader = RecordBatchReader.from(source);
  try {
    if (!reader.open({ autoDestroy: false }).closed) {
      do {
        yield reader;
      } while (!reader.reset().open().closed);
    }
  } finally {
    reader.cancel();
  }
}
function readAllAsync(source) {
  return __asyncGenerator(this, arguments, function* readAllAsync_1() {
    const reader = yield __await(RecordBatchReader.from(source));
    try {
      if (!(yield __await(reader.open({ autoDestroy: false }))).closed) {
        do {
          yield yield __await(reader);
        } while (!(yield __await(reader.reset().open())).closed);
      }
    } finally {
      yield __await(reader.cancel());
    }
  });
}
function fromArrowJSON(source) {
  return new RecordBatchStreamReader(new RecordBatchJSONReaderImpl(source));
}
function fromByteStream(source) {
  const bytes = source.peek(magicLength + 7 & ~7);
  return bytes && bytes.byteLength >= 4 ? !checkForMagicArrowString(bytes) ? new RecordBatchStreamReader(new RecordBatchStreamReaderImpl(source)) : new RecordBatchFileReader(new RecordBatchFileReaderImpl(source.read())) : new RecordBatchStreamReader(new RecordBatchStreamReaderImpl(function* () {
  }()));
}
function fromAsyncByteStream(source) {
  return __awaiter(this, void 0, void 0, function* () {
    const bytes = yield source.peek(magicLength + 7 & ~7);
    return bytes && bytes.byteLength >= 4 ? !checkForMagicArrowString(bytes) ? new AsyncRecordBatchStreamReader(new AsyncRecordBatchStreamReaderImpl(source)) : new RecordBatchFileReader(new RecordBatchFileReaderImpl(yield source.read())) : new AsyncRecordBatchStreamReader(new AsyncRecordBatchStreamReaderImpl(function() {
      return __asyncGenerator(this, arguments, function* () {
      });
    }()));
  });
}
function fromFileHandle(source) {
  return __awaiter(this, void 0, void 0, function* () {
    const { size } = yield source.stat();
    const file = new AsyncRandomAccessFile(source, size);
    if (size >= magicX2AndPadding && checkForMagicArrowString(yield file.readAt(0, magicLength + 7 & ~7))) {
      return new AsyncRecordBatchFileReader(new AsyncRecordBatchFileReaderImpl(file));
    }
    return new AsyncRecordBatchStreamReader(new AsyncRecordBatchStreamReaderImpl(file));
  });
}

// ../core/node_modules/apache-arrow/visitor/vectorassembler.mjs
var VectorAssembler = class _VectorAssembler extends Visitor {
  /** @nocollapse */
  static assemble(...args) {
    const unwrap = (nodes) => nodes.flatMap((node) => Array.isArray(node) ? unwrap(node) : node instanceof RecordBatch2 ? node.data.children : node.data);
    const assembler = new _VectorAssembler();
    assembler.visitMany(unwrap(args));
    return assembler;
  }
  constructor() {
    super();
    this._byteLength = 0;
    this._nodes = [];
    this._buffers = [];
    this._bufferRegions = [];
  }
  visit(data) {
    if (data instanceof Vector) {
      this.visitMany(data.data);
      return this;
    }
    const { type } = data;
    if (!DataType.isDictionary(type)) {
      const { length: length2 } = data;
      if (length2 > 2147483647) {
        throw new RangeError("Cannot write arrays larger than 2^31 - 1 in length");
      }
      if (DataType.isUnion(type)) {
        this.nodes.push(new FieldNode2(length2, 0));
      } else {
        const { nullCount } = data;
        if (!DataType.isNull(type)) {
          addBuffer.call(this, nullCount <= 0 ? new Uint8Array(0) : truncateBitmap(data.offset, length2, data.nullBitmap));
        }
        this.nodes.push(new FieldNode2(length2, nullCount));
      }
    }
    return super.visit(data);
  }
  visitNull(_null) {
    return this;
  }
  visitDictionary(data) {
    return this.visit(data.clone(data.type.indices));
  }
  get nodes() {
    return this._nodes;
  }
  get buffers() {
    return this._buffers;
  }
  get byteLength() {
    return this._byteLength;
  }
  get bufferRegions() {
    return this._bufferRegions;
  }
};
function addBuffer(values) {
  const byteLength = values.byteLength + 7 & ~7;
  this.buffers.push(values);
  this.bufferRegions.push(new BufferRegion(this._byteLength, byteLength));
  this._byteLength += byteLength;
  return this;
}
function assembleUnion(data) {
  var _a5;
  const { type, length: length2, typeIds, valueOffsets } = data;
  addBuffer.call(this, typeIds);
  if (type.mode === UnionMode.Sparse) {
    return assembleNestedVector.call(this, data);
  } else if (type.mode === UnionMode.Dense) {
    if (data.offset <= 0) {
      addBuffer.call(this, valueOffsets);
      return assembleNestedVector.call(this, data);
    } else {
      const shiftedOffsets = new Int32Array(length2);
      const childOffsets = /* @__PURE__ */ Object.create(null);
      const childLengths = /* @__PURE__ */ Object.create(null);
      for (let typeId, shift, index = -1; ++index < length2; ) {
        if ((typeId = typeIds[index]) === void 0) {
          continue;
        }
        if ((shift = childOffsets[typeId]) === void 0) {
          shift = childOffsets[typeId] = valueOffsets[index];
        }
        shiftedOffsets[index] = valueOffsets[index] - shift;
        childLengths[typeId] = ((_a5 = childLengths[typeId]) !== null && _a5 !== void 0 ? _a5 : 0) + 1;
      }
      addBuffer.call(this, shiftedOffsets);
      this.visitMany(data.children.map((child, childIndex) => {
        const typeId = type.typeIds[childIndex];
        const childOffset = childOffsets[typeId];
        const childLength = childLengths[typeId];
        return child.slice(childOffset, Math.min(length2, childLength));
      }));
    }
  }
  return this;
}
function assembleBoolVector(data) {
  let values;
  if (data.nullCount >= data.length) {
    return addBuffer.call(this, new Uint8Array(0));
  } else if ((values = data.values) instanceof Uint8Array) {
    return addBuffer.call(this, truncateBitmap(data.offset, data.length, values));
  }
  return addBuffer.call(this, packBools(data.values));
}
function assembleFlatVector(data) {
  return addBuffer.call(this, data.values.subarray(0, data.length * data.stride));
}
function assembleFlatListVector(data) {
  const { length: length2, values, valueOffsets } = data;
  const begin = bigIntToNumber(valueOffsets[0]);
  const end = bigIntToNumber(valueOffsets[length2]);
  const byteLength = Math.min(end - begin, values.byteLength - begin);
  addBuffer.call(this, rebaseValueOffsets(-begin, length2 + 1, valueOffsets));
  addBuffer.call(this, values.subarray(begin, begin + byteLength));
  return this;
}
function assembleListVector(data) {
  const { length: length2, valueOffsets } = data;
  if (valueOffsets) {
    const { [0]: begin, [length2]: end } = valueOffsets;
    addBuffer.call(this, rebaseValueOffsets(-begin, length2 + 1, valueOffsets));
    return this.visit(data.children[0].slice(begin, end - begin));
  }
  return this.visit(data.children[0]);
}
function assembleNestedVector(data) {
  return this.visitMany(data.type.children.map((_, i) => data.children[i]).filter(Boolean))[0];
}
VectorAssembler.prototype.visitBool = assembleBoolVector;
VectorAssembler.prototype.visitInt = assembleFlatVector;
VectorAssembler.prototype.visitFloat = assembleFlatVector;
VectorAssembler.prototype.visitUtf8 = assembleFlatListVector;
VectorAssembler.prototype.visitLargeUtf8 = assembleFlatListVector;
VectorAssembler.prototype.visitBinary = assembleFlatListVector;
VectorAssembler.prototype.visitLargeBinary = assembleFlatListVector;
VectorAssembler.prototype.visitFixedSizeBinary = assembleFlatVector;
VectorAssembler.prototype.visitDate = assembleFlatVector;
VectorAssembler.prototype.visitTimestamp = assembleFlatVector;
VectorAssembler.prototype.visitTime = assembleFlatVector;
VectorAssembler.prototype.visitDecimal = assembleFlatVector;
VectorAssembler.prototype.visitList = assembleListVector;
VectorAssembler.prototype.visitStruct = assembleNestedVector;
VectorAssembler.prototype.visitUnion = assembleUnion;
VectorAssembler.prototype.visitInterval = assembleFlatVector;
VectorAssembler.prototype.visitDuration = assembleFlatVector;
VectorAssembler.prototype.visitFixedSizeList = assembleListVector;
VectorAssembler.prototype.visitMap = assembleListVector;

// ../core/node_modules/apache-arrow/ipc/writer.mjs
var RecordBatchWriter = class extends ReadableInterop {
  /** @nocollapse */
  // @ts-ignore
  static throughNode(options) {
    throw new Error(`"throughNode" not available in this environment`);
  }
  /** @nocollapse */
  static throughDOM(writableStrategy, readableStrategy) {
    throw new Error(`"throughDOM" not available in this environment`);
  }
  constructor(options) {
    super();
    this._position = 0;
    this._started = false;
    this._sink = new AsyncByteQueue();
    this._schema = null;
    this._dictionaryBlocks = [];
    this._recordBatchBlocks = [];
    this._dictionaryDeltaOffsets = /* @__PURE__ */ new Map();
    isObject(options) || (options = { autoDestroy: true, writeLegacyIpcFormat: false });
    this._autoDestroy = typeof options.autoDestroy === "boolean" ? options.autoDestroy : true;
    this._writeLegacyIpcFormat = typeof options.writeLegacyIpcFormat === "boolean" ? options.writeLegacyIpcFormat : false;
  }
  toString(sync = false) {
    return this._sink.toString(sync);
  }
  toUint8Array(sync = false) {
    return this._sink.toUint8Array(sync);
  }
  writeAll(input2) {
    if (isPromise(input2)) {
      return input2.then((x2) => this.writeAll(x2));
    } else if (isAsyncIterable(input2)) {
      return writeAllAsync(this, input2);
    }
    return writeAll(this, input2);
  }
  get closed() {
    return this._sink.closed;
  }
  [Symbol.asyncIterator]() {
    return this._sink[Symbol.asyncIterator]();
  }
  toDOMStream(options) {
    return this._sink.toDOMStream(options);
  }
  toNodeStream(options) {
    return this._sink.toNodeStream(options);
  }
  close() {
    return this.reset()._sink.close();
  }
  abort(reason) {
    return this.reset()._sink.abort(reason);
  }
  finish() {
    this._autoDestroy ? this.close() : this.reset(this._sink, this._schema);
    return this;
  }
  reset(sink = this._sink, schema = null) {
    if (sink === this._sink || sink instanceof AsyncByteQueue) {
      this._sink = sink;
    } else {
      this._sink = new AsyncByteQueue();
      if (sink && isWritableDOMStream(sink)) {
        this.toDOMStream({ type: "bytes" }).pipeTo(sink);
      } else if (sink && isWritableNodeStream(sink)) {
        this.toNodeStream({ objectMode: false }).pipe(sink);
      }
    }
    if (this._started && this._schema) {
      this._writeFooter(this._schema);
    }
    this._started = false;
    this._dictionaryBlocks = [];
    this._recordBatchBlocks = [];
    this._dictionaryDeltaOffsets = /* @__PURE__ */ new Map();
    if (!schema || !compareSchemas(schema, this._schema)) {
      if (schema == null) {
        this._position = 0;
        this._schema = null;
      } else {
        this._started = true;
        this._schema = schema;
        this._writeSchema(schema);
      }
    }
    return this;
  }
  write(payload) {
    let schema = null;
    if (!this._sink) {
      throw new Error(`RecordBatchWriter is closed`);
    } else if (payload == null) {
      return this.finish() && void 0;
    } else if (payload instanceof Table && !(schema = payload.schema)) {
      return this.finish() && void 0;
    } else if (payload instanceof RecordBatch2 && !(schema = payload.schema)) {
      return this.finish() && void 0;
    }
    if (schema && !compareSchemas(schema, this._schema)) {
      if (this._started && this._autoDestroy) {
        return this.close();
      }
      this.reset(this._sink, schema);
    }
    if (payload instanceof RecordBatch2) {
      if (!(payload instanceof _InternalEmptyPlaceholderRecordBatch)) {
        this._writeRecordBatch(payload);
      }
    } else if (payload instanceof Table) {
      this.writeAll(payload.batches);
    } else if (isIterable(payload)) {
      this.writeAll(payload);
    }
  }
  _writeMessage(message, alignment = 8) {
    const a = alignment - 1;
    const buffer = Message2.encode(message);
    const flatbufferSize = buffer.byteLength;
    const prefixSize = !this._writeLegacyIpcFormat ? 8 : 4;
    const alignedSize = flatbufferSize + prefixSize + a & ~a;
    const nPaddingBytes = alignedSize - flatbufferSize - prefixSize;
    if (message.headerType === MessageHeader.RecordBatch) {
      this._recordBatchBlocks.push(new FileBlock(alignedSize, message.bodyLength, this._position));
    } else if (message.headerType === MessageHeader.DictionaryBatch) {
      this._dictionaryBlocks.push(new FileBlock(alignedSize, message.bodyLength, this._position));
    }
    if (!this._writeLegacyIpcFormat) {
      this._write(Int32Array.of(-1));
    }
    this._write(Int32Array.of(alignedSize - prefixSize));
    if (flatbufferSize > 0) {
      this._write(buffer);
    }
    return this._writePadding(nPaddingBytes);
  }
  _write(chunk) {
    if (this._started) {
      const buffer = toUint8Array(chunk);
      if (buffer && buffer.byteLength > 0) {
        this._sink.write(buffer);
        this._position += buffer.byteLength;
      }
    }
    return this;
  }
  _writeSchema(schema) {
    return this._writeMessage(Message2.from(schema));
  }
  // @ts-ignore
  _writeFooter(schema) {
    return this._writeLegacyIpcFormat ? this._write(Int32Array.of(0)) : this._write(Int32Array.of(-1, 0));
  }
  _writeMagic() {
    return this._write(MAGIC);
  }
  _writePadding(nBytes) {
    return nBytes > 0 ? this._write(new Uint8Array(nBytes)) : this;
  }
  _writeRecordBatch(batch) {
    const { byteLength, nodes, bufferRegions, buffers } = VectorAssembler.assemble(batch);
    const recordBatch = new RecordBatch3(batch.numRows, nodes, bufferRegions);
    const message = Message2.from(recordBatch, byteLength);
    return this._writeDictionaries(batch)._writeMessage(message)._writeBodyBuffers(buffers);
  }
  _writeDictionaryBatch(dictionary, id, isDelta = false) {
    this._dictionaryDeltaOffsets.set(id, dictionary.length + (this._dictionaryDeltaOffsets.get(id) || 0));
    const { byteLength, nodes, bufferRegions, buffers } = VectorAssembler.assemble(new Vector([dictionary]));
    const recordBatch = new RecordBatch3(dictionary.length, nodes, bufferRegions);
    const dictionaryBatch = new DictionaryBatch2(recordBatch, id, isDelta);
    const message = Message2.from(dictionaryBatch, byteLength);
    return this._writeMessage(message)._writeBodyBuffers(buffers);
  }
  _writeBodyBuffers(buffers) {
    let buffer;
    let size, padding;
    for (let i = -1, n = buffers.length; ++i < n; ) {
      if ((buffer = buffers[i]) && (size = buffer.byteLength) > 0) {
        this._write(buffer);
        if ((padding = (size + 7 & ~7) - size) > 0) {
          this._writePadding(padding);
        }
      }
    }
    return this;
  }
  _writeDictionaries(batch) {
    for (let [id, dictionary] of batch.dictionaries) {
      let offset = this._dictionaryDeltaOffsets.get(id) || 0;
      if (offset === 0 || (dictionary = dictionary === null || dictionary === void 0 ? void 0 : dictionary.slice(offset)).length > 0) {
        for (const data of dictionary.data) {
          this._writeDictionaryBatch(data, id, offset > 0);
          offset += data.length;
        }
      }
    }
    return this;
  }
};
var RecordBatchStreamWriter = class _RecordBatchStreamWriter extends RecordBatchWriter {
  /** @nocollapse */
  static writeAll(input2, options) {
    const writer = new _RecordBatchStreamWriter(options);
    if (isPromise(input2)) {
      return input2.then((x2) => writer.writeAll(x2));
    } else if (isAsyncIterable(input2)) {
      return writeAllAsync(writer, input2);
    }
    return writeAll(writer, input2);
  }
};
var RecordBatchFileWriter = class _RecordBatchFileWriter extends RecordBatchWriter {
  /** @nocollapse */
  static writeAll(input2) {
    const writer = new _RecordBatchFileWriter();
    if (isPromise(input2)) {
      return input2.then((x2) => writer.writeAll(x2));
    } else if (isAsyncIterable(input2)) {
      return writeAllAsync(writer, input2);
    }
    return writeAll(writer, input2);
  }
  constructor() {
    super();
    this._autoDestroy = true;
  }
  // @ts-ignore
  _writeSchema(schema) {
    return this._writeMagic()._writePadding(2);
  }
  _writeFooter(schema) {
    const buffer = Footer_.encode(new Footer_(schema, MetadataVersion.V5, this._recordBatchBlocks, this._dictionaryBlocks));
    return super._writeFooter(schema)._write(buffer)._write(Int32Array.of(buffer.byteLength))._writeMagic();
  }
};
function writeAll(writer, input2) {
  let chunks = input2;
  if (input2 instanceof Table) {
    chunks = input2.batches;
    writer.reset(void 0, input2.schema);
  }
  for (const batch of chunks) {
    writer.write(batch);
  }
  return writer.finish();
}
function writeAllAsync(writer, batches) {
  var _a5, batches_1, batches_1_1;
  var _b2, e_1, _c2, _d2;
  return __awaiter(this, void 0, void 0, function* () {
    try {
      for (_a5 = true, batches_1 = __asyncValues(batches); batches_1_1 = yield batches_1.next(), _b2 = batches_1_1.done, !_b2; _a5 = true) {
        _d2 = batches_1_1.value;
        _a5 = false;
        const batch = _d2;
        writer.write(batch);
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (!_a5 && !_b2 && (_c2 = batches_1.return))
          yield _c2.call(batches_1);
      } finally {
        if (e_1)
          throw e_1.error;
      }
    }
    return writer.finish();
  });
}

// ../core/node_modules/apache-arrow/io/whatwg/iterable.mjs
function toDOMStream(source, options) {
  if (isAsyncIterable(source)) {
    return asyncIterableAsReadableDOMStream(source, options);
  }
  if (isIterable(source)) {
    return iterableAsReadableDOMStream(source, options);
  }
  throw new Error(`toDOMStream() must be called with an Iterable or AsyncIterable`);
}
function iterableAsReadableDOMStream(source, options) {
  let it = null;
  const bm = (options === null || options === void 0 ? void 0 : options.type) === "bytes" || false;
  const hwm = (options === null || options === void 0 ? void 0 : options.highWaterMark) || Math.pow(2, 24);
  return new ReadableStream(Object.assign(Object.assign({}, options), {
    start(controller) {
      next(controller, it || (it = source[Symbol.iterator]()));
    },
    pull(controller) {
      it ? next(controller, it) : controller.close();
    },
    cancel() {
      ((it === null || it === void 0 ? void 0 : it.return) && it.return() || true) && (it = null);
    }
  }), Object.assign({ highWaterMark: bm ? hwm : void 0 }, options));
  function next(controller, it2) {
    let buf;
    let r = null;
    let size = controller.desiredSize || null;
    while (!(r = it2.next(bm ? size : null)).done) {
      if (ArrayBuffer.isView(r.value) && (buf = toUint8Array(r.value))) {
        size != null && bm && (size = size - buf.byteLength + 1);
        r.value = buf;
      }
      controller.enqueue(r.value);
      if (size != null && --size <= 0) {
        return;
      }
    }
    controller.close();
  }
}
function asyncIterableAsReadableDOMStream(source, options) {
  let it = null;
  const bm = (options === null || options === void 0 ? void 0 : options.type) === "bytes" || false;
  const hwm = (options === null || options === void 0 ? void 0 : options.highWaterMark) || Math.pow(2, 24);
  return new ReadableStream(Object.assign(Object.assign({}, options), {
    start(controller) {
      return __awaiter(this, void 0, void 0, function* () {
        yield next(controller, it || (it = source[Symbol.asyncIterator]()));
      });
    },
    pull(controller) {
      return __awaiter(this, void 0, void 0, function* () {
        it ? yield next(controller, it) : controller.close();
      });
    },
    cancel() {
      return __awaiter(this, void 0, void 0, function* () {
        ((it === null || it === void 0 ? void 0 : it.return) && (yield it.return()) || true) && (it = null);
      });
    }
  }), Object.assign({ highWaterMark: bm ? hwm : void 0 }, options));
  function next(controller, it2) {
    return __awaiter(this, void 0, void 0, function* () {
      let buf;
      let r = null;
      let size = controller.desiredSize || null;
      while (!(r = yield it2.next(bm ? size : null)).done) {
        if (ArrayBuffer.isView(r.value) && (buf = toUint8Array(r.value))) {
          size != null && bm && (size = size - buf.byteLength + 1);
          r.value = buf;
        }
        controller.enqueue(r.value);
        if (size != null && --size <= 0) {
          return;
        }
      }
      controller.close();
    });
  }
}

// ../core/node_modules/apache-arrow/io/whatwg/builder.mjs
function builderThroughDOMStream(options) {
  return new BuilderTransform(options);
}
var BuilderTransform = class {
  constructor(options) {
    this._numChunks = 0;
    this._finished = false;
    this._bufferedSize = 0;
    const { ["readableStrategy"]: readableStrategy, ["writableStrategy"]: writableStrategy, ["queueingStrategy"]: queueingStrategy = "count" } = options, builderOptions = __rest(options, ["readableStrategy", "writableStrategy", "queueingStrategy"]);
    this._controller = null;
    this._builder = makeBuilder(builderOptions);
    this._getSize = queueingStrategy !== "bytes" ? chunkLength : chunkByteLength;
    const { ["highWaterMark"]: readableHighWaterMark = queueingStrategy === "bytes" ? Math.pow(2, 14) : 1e3 } = Object.assign({}, readableStrategy);
    const { ["highWaterMark"]: writableHighWaterMark = queueingStrategy === "bytes" ? Math.pow(2, 14) : 1e3 } = Object.assign({}, writableStrategy);
    this["readable"] = new ReadableStream({
      ["cancel"]: () => {
        this._builder.clear();
      },
      ["pull"]: (c) => {
        this._maybeFlush(this._builder, this._controller = c);
      },
      ["start"]: (c) => {
        this._maybeFlush(this._builder, this._controller = c);
      }
    }, {
      "highWaterMark": readableHighWaterMark,
      "size": queueingStrategy !== "bytes" ? chunkLength : chunkByteLength
    });
    this["writable"] = new WritableStream({
      ["abort"]: () => {
        this._builder.clear();
      },
      ["write"]: () => {
        this._maybeFlush(this._builder, this._controller);
      },
      ["close"]: () => {
        this._maybeFlush(this._builder.finish(), this._controller);
      }
    }, {
      "highWaterMark": writableHighWaterMark,
      "size": (value) => this._writeValueAndReturnChunkSize(value)
    });
  }
  _writeValueAndReturnChunkSize(value) {
    const bufferedSize = this._bufferedSize;
    this._bufferedSize = this._getSize(this._builder.append(value));
    return this._bufferedSize - bufferedSize;
  }
  _maybeFlush(builder, controller) {
    if (controller == null) {
      return;
    }
    if (this._bufferedSize >= controller.desiredSize) {
      ++this._numChunks && this._enqueue(controller, builder.toVector());
    }
    if (builder.finished) {
      if (builder.length > 0 || this._numChunks === 0) {
        ++this._numChunks && this._enqueue(controller, builder.toVector());
      }
      if (!this._finished && (this._finished = true)) {
        this._enqueue(controller, null);
      }
    }
  }
  _enqueue(controller, chunk) {
    this._bufferedSize = 0;
    this._controller = null;
    chunk == null ? controller.close() : controller.enqueue(chunk);
  }
};
var chunkLength = (chunk) => {
  var _a5;
  return (_a5 = chunk === null || chunk === void 0 ? void 0 : chunk.length) !== null && _a5 !== void 0 ? _a5 : 0;
};
var chunkByteLength = (chunk) => {
  var _a5;
  return (_a5 = chunk === null || chunk === void 0 ? void 0 : chunk.byteLength) !== null && _a5 !== void 0 ? _a5 : 0;
};

// ../core/node_modules/apache-arrow/io/whatwg/reader.mjs
function recordBatchReaderThroughDOMStream(writableStrategy, readableStrategy) {
  const queue = new AsyncByteQueue();
  let reader = null;
  const readable = new ReadableStream({
    cancel() {
      return __awaiter(this, void 0, void 0, function* () {
        yield queue.close();
      });
    },
    start(controller) {
      return __awaiter(this, void 0, void 0, function* () {
        yield next(controller, reader || (reader = yield open()));
      });
    },
    pull(controller) {
      return __awaiter(this, void 0, void 0, function* () {
        reader ? yield next(controller, reader) : controller.close();
      });
    }
  });
  return { writable: new WritableStream(queue, Object.assign({ "highWaterMark": Math.pow(2, 14) }, writableStrategy)), readable };
  function open() {
    return __awaiter(this, void 0, void 0, function* () {
      return yield (yield RecordBatchReader.from(queue)).open(readableStrategy);
    });
  }
  function next(controller, reader2) {
    return __awaiter(this, void 0, void 0, function* () {
      let size = controller.desiredSize;
      let r = null;
      while (!(r = yield reader2.next()).done) {
        controller.enqueue(r.value);
        if (size != null && --size <= 0) {
          return;
        }
      }
      controller.close();
    });
  }
}

// ../core/node_modules/apache-arrow/io/whatwg/writer.mjs
function recordBatchWriterThroughDOMStream(writableStrategy, readableStrategy) {
  const writer = new this(writableStrategy);
  const reader = new AsyncByteStream(writer);
  const readable = new ReadableStream({
    // type: 'bytes',
    cancel() {
      return __awaiter(this, void 0, void 0, function* () {
        yield reader.cancel();
      });
    },
    pull(controller) {
      return __awaiter(this, void 0, void 0, function* () {
        yield next(controller);
      });
    },
    start(controller) {
      return __awaiter(this, void 0, void 0, function* () {
        yield next(controller);
      });
    }
  }, Object.assign({ "highWaterMark": Math.pow(2, 14) }, readableStrategy));
  return { writable: new WritableStream(writer, writableStrategy), readable };
  function next(controller) {
    return __awaiter(this, void 0, void 0, function* () {
      let buf = null;
      let size = controller.desiredSize;
      while (buf = yield reader.read(size || null)) {
        controller.enqueue(buf);
        if (size != null && (size -= buf.byteLength) <= 0) {
          return;
        }
      }
      controller.close();
    });
  }
}

// ../core/node_modules/apache-arrow/ipc/serialization.mjs
function tableFromIPC(input2) {
  const reader = RecordBatchReader.from(input2);
  if (isPromise(reader)) {
    return reader.then((reader2) => tableFromIPC(reader2));
  }
  if (reader.isAsync()) {
    return reader.readAll().then((xs) => new Table(xs));
  }
  return new Table(reader.readAll());
}

// ../core/node_modules/apache-arrow/Arrow.mjs
var util = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, bn_exports), int_exports), bit_exports), math_exports), buffer_exports), vector_exports), pretty_exports), {
  compareSchemas,
  compareFields,
  compareTypes
});

// ../core/node_modules/apache-arrow/Arrow.dom.mjs
adapters_default.toDOMStream = toDOMStream;
Builder2["throughDOM"] = builderThroughDOMStream;
RecordBatchReader["throughDOM"] = recordBatchReaderThroughDOMStream;
RecordBatchFileReader["throughDOM"] = recordBatchReaderThroughDOMStream;
RecordBatchStreamReader["throughDOM"] = recordBatchReaderThroughDOMStream;
RecordBatchWriter["throughDOM"] = recordBatchWriterThroughDOMStream;
RecordBatchFileWriter["throughDOM"] = recordBatchWriterThroughDOMStream;
RecordBatchStreamWriter["throughDOM"] = recordBatchWriterThroughDOMStream;

// ../core/src/connectors/socket.js
function socketConnector(uri = "ws://localhost:3000/") {
  const queue = [];
  let connected = false;
  let request = null;
  let ws;
  const events = {
    open() {
      connected = true;
      next();
    },
    close() {
      connected = false;
      request = null;
      ws = null;
      while (queue.length) {
        queue.shift().reject("Socket closed");
      }
    },
    error(event) {
      if (request) {
        const { reject } = request;
        request = null;
        next();
        reject(event);
      } else {
        console.error("WebSocket error: ", event);
      }
    },
    message({ data }) {
      if (request) {
        const { query, resolve, reject } = request;
        request = null;
        next();
        if (typeof data === "string") {
          const json = JSON.parse(data);
          json.error ? reject(json.error) : resolve(json);
        } else if (query.type === "exec") {
          resolve();
        } else if (query.type === "arrow") {
          resolve(tableFromIPC(data.arrayBuffer()));
        } else {
          throw new Error(`Unexpected socket data: ${data}`);
        }
      } else {
        console.log("WebSocket message: ", data);
      }
    }
  };
  function init() {
    ws = new WebSocket(uri);
    for (const type in events) {
      ws.addEventListener(type, events[type]);
    }
  }
  function enqueue(query, resolve, reject) {
    if (ws == null)
      init();
    queue.push({ query, resolve, reject });
    if (connected && !request)
      next();
  }
  function next() {
    if (queue.length) {
      request = queue.shift();
      ws.send(JSON.stringify(request.query));
    }
  }
  return {
    get connected() {
      return connected;
    },
    query(query) {
      return new Promise(
        (resolve, reject) => enqueue(query, resolve, reject)
      );
    }
  };
}

// ../sql/src/ref.js
var Ref = class {
  /**
   * Create a new Ref instance.
   * @param {string|Ref|null} table The table name.
   * @param {string|null} [column] The column name.
   */
  constructor(table2, column2) {
    if (table2)
      this.table = String(table2);
    if (column2)
      this.column = column2;
  }
  /**
   * Get the list of referenced columns. Either a single element array
   * if column is non-null, otherwise an empty array.
   */
  get columns() {
    return this.column ? [this.column] : [];
  }
  /**
   * Generate a SQL string for this reference.
   * @returns {string} The SQL string.
   */
  toString() {
    const { table: table2, column: column2 } = this;
    if (column2) {
      const col = column2.startsWith("*") ? column2 : `"${column2}"`;
      return `${table2 ? `${quoteTableName(table2)}.` : ""}${col}`;
    } else {
      return table2 ? quoteTableName(table2) : "NULL";
    }
  }
};
function quoteTableName(table2) {
  const pieces = table2.split(".");
  return pieces.map((p) => `"${p}"`).join(".");
}
function isColumnRefFor(ref, name) {
  return ref instanceof Ref && ref.column === name;
}
function asColumn(value) {
  return typeof value === "string" ? column(value) : value;
}
function asRelation(value) {
  return typeof value === "string" ? relation(value) : value;
}
function relation(name) {
  return new Ref(name);
}
function column(table2, column2 = null) {
  if (arguments.length === 1) {
    column2 = table2;
    table2 = null;
  }
  return new Ref(table2, column2);
}

// ../sql/src/to-sql.js
function literalToSQL(value) {
  switch (typeof value) {
    case "boolean":
      return value ? "TRUE" : "FALSE";
    case "string":
      return `'${value}'`;
    case "number":
      return Number.isFinite(value) ? String(value) : "NULL";
    default:
      if (value == null) {
        return "NULL";
      } else if (value instanceof Date) {
        const ts = +value;
        if (Number.isNaN(ts))
          return "NULL";
        const y2 = value.getUTCFullYear();
        const m = value.getUTCMonth();
        const d = value.getUTCDate();
        return ts === Date.UTC(y2, m, d) ? `MAKE_DATE(${y2}, ${m + 1}, ${d})` : `EPOCH_MS(${ts})`;
      } else if (value instanceof RegExp) {
        return `'${value.source}'`;
      } else {
        return String(value);
      }
  }
}

// ../sql/src/expression.js
var isParamLike = (value) => typeof value?.addEventListener === "function";
function isSQLExpression(value) {
  return value instanceof SQLExpression;
}
var SQLExpression = class {
  /**
   * Create a new SQL expression instance.
   * @param {(string | ParamLike | SQLExpression | import('./ref.js').Ref)[]} parts The parts of the expression.
   * @param {string[]} [columns=[]] The column dependencies
   * @param {object} [props] Additional properties for this expression.
   */
  constructor(parts, columns, props) {
    this._expr = Array.isArray(parts) ? parts : [parts];
    this._deps = columns || [];
    this.annotate(props);
    const params = this._expr.filter((part) => isParamLike(part));
    if (params.length > 0) {
      this._params = Array.from(new Set(params));
      this._params.forEach((param) => {
        param.addEventListener("value", () => update(this, this.map?.get("value")));
      });
    } else {
      this.addEventListener = void 0;
    }
  }
  /**
   * A reference to this expression.
   * Provides compatibility with param-like objects.
   */
  get value() {
    return this;
  }
  /**
   * The column dependencies of this expression.
   * @returns {string[]} The columns dependencies.
   */
  get columns() {
    const { _params, _deps } = this;
    if (_params) {
      const pset = new Set(_params.flatMap((p) => {
        const cols = p.value?.columns;
        return Array.isArray(cols) ? cols : [];
      }));
      if (pset.size) {
        const set = new Set(_deps);
        pset.forEach((col) => set.add(col));
        return Array.from(set);
      }
    }
    return _deps;
  }
  /**
   * The first column dependency in this expression, or undefined if none.
   * @returns {string} The first column dependency.
   */
  get column() {
    return this._deps.length ? this._deps[0] : this.columns[0];
  }
  /**
   * Annotate this expression instance with additional properties.
   * @param {object[]} [props] One or more objects with properties to add.
   * @returns {this} This SQL expression.
   */
  annotate(...props) {
    return Object.assign(this, ...props);
  }
  /**
   * Generate a SQL code string corresponding to this expression.
   * @returns {string} A SQL code string.
   */
  toString() {
    return this._expr.map((p) => isParamLike(p) && !isSQLExpression(p) ? literalToSQL(p.value) : p).join("");
  }
  /**
   * Add an event listener callback for the provided event type.
   * @param {string} type The event type to listen for (for example, "value").
   * @param {(a: SQLExpression) => Promise?} callback The callback function to
   *  invoke upon updates. A callback may optionally return a Promise that
   *  upstream listeners may await before proceeding.
   */
  addEventListener(type, callback) {
    const map = this.map || (this.map = /* @__PURE__ */ new Map());
    const set = map.get(type) || (map.set(type, /* @__PURE__ */ new Set()), map.get(type));
    set.add(callback);
  }
};
function update(expr, callbacks) {
  if (callbacks?.size) {
    return Promise.allSettled(Array.from(callbacks, (fn) => fn(expr)));
  }
}
function parseSQL(strings, exprs) {
  const spans = [strings[0]];
  const cols = /* @__PURE__ */ new Set();
  const n = exprs.length;
  for (let i = 0, k = 0; i < n; ) {
    const e = exprs[i];
    if (isParamLike(e)) {
      spans[++k] = e;
    } else {
      if (Array.isArray(e?.columns)) {
        e.columns.forEach((col) => cols.add(col));
      }
      spans[k] += typeof e === "string" ? e : literalToSQL(e);
    }
    const s = strings[++i];
    if (isParamLike(spans[k])) {
      spans[++k] = s;
    } else {
      spans[k] += s;
    }
  }
  return { spans, cols: Array.from(cols) };
}
function sql(strings, ...exprs) {
  const { spans, cols } = parseSQL(strings, exprs);
  return new SQLExpression(spans, cols);
}

// ../sql/src/desc.js
function desc(expr) {
  const e = asColumn(expr);
  return sql`${e} DESC NULLS LAST`.annotate({ label: e?.label, desc: true });
}

// ../sql/src/literal.js
var literal = (value) => ({
  value,
  toString: () => literalToSQL(value)
});

// ../sql/src/operators.js
function visit(callback) {
  callback(this.op, this);
  this.children?.forEach((v) => v.visit(callback));
}
function logical(op, clauses) {
  const children = clauses.filter((x2) => x2 != null).map(asColumn);
  const strings = children.map((c, i) => i ? ` ${op} ` : "");
  if (children.length === 1) {
    strings.push("");
  } else if (children.length > 1) {
    strings[0] = "(";
    strings.push(")");
  }
  return sql(strings, ...children).annotate({ op, children, visit });
}
var and = (...clauses) => logical("AND", clauses.flat());
var or = (...clauses) => logical("OR", clauses.flat());
var unaryOp = (op) => (a) => sql`(${op} ${asColumn(a)})`.annotate({ op, a, visit });
var not = unaryOp("NOT");
var unaryPostOp = (op) => (a) => sql`(${asColumn(a)} ${op})`.annotate({ op, a, visit });
var isNull = unaryPostOp("IS NULL");
var isNotNull = unaryPostOp("IS NOT NULL");
var binaryOp = (op) => (a, b) => sql`(${asColumn(a)} ${op} ${asColumn(b)})`.annotate({ op, a, b, visit });
var eq = binaryOp("=");
var neq = binaryOp("<>");
var lt = binaryOp("<");
var gt = binaryOp(">");
var lte = binaryOp("<=");
var gte = binaryOp(">=");
var isDistinct = binaryOp("IS DISTINCT FROM");
var isNotDistinct = binaryOp("IS NOT DISTINCT FROM");
function rangeOp(op, a, range, exclusive) {
  a = asColumn(a);
  const prefix2 = op.startsWith("NOT ") ? "NOT " : "";
  const expr = !range ? sql`` : exclusive ? sql`${prefix2}(${range[0]} <= ${a} AND ${a} < ${range[1]})` : sql`(${a} ${op} ${range[0]} AND ${range[1]})`;
  return expr.annotate({ op, visit, field: a, range });
}
var isBetween = (a, range, exclusive) => rangeOp("BETWEEN", a, range, exclusive);

// ../sql/src/repeat.js
function repeat(length2, str) {
  return Array.from({ length: length2 }, () => str);
}

// ../sql/src/functions.js
function functionCall(op, type) {
  return (...values) => {
    const args = values.map(asColumn);
    const cast2 = type ? `::${type}` : "";
    const expr = args.length ? sql([`${op}(`, ...repeat(args.length - 1, ", "), `)${cast2}`], ...args) : sql`${op}()${cast2}`;
    return expr.annotate({ func: op, args });
  };
}
var regexp_matches = functionCall("REGEXP_MATCHES");
var contains = functionCall("CONTAINS");
var prefix = functionCall("PREFIX");
var suffix = functionCall("SUFFIX");
var lower = functionCall("LOWER");
var upper = functionCall("UPPER");
var length = functionCall("LENGTH");
var isNaN2 = functionCall("ISNAN");
var isFinite = functionCall("ISFINITE");
var isInfinite = functionCall("ISINF");

// ../sql/src/windows.js
var WindowFunction = class _WindowFunction extends SQLExpression {
  /**
   * Create a new WindowFunction instance.
   * @param {string} op The window operation indicator.
   * @param {*} func The window function expression.
   * @param {*} [type] The SQL data type to cast to.
   * @param {string} [name] The window definition name.
   * @param {*} [group] Grouping (partition by) expressions.
   * @param {*} [order] Sorting (order by) expressions.
   * @param {*} [frame] The window frame definition.
   */
  constructor(op, func, type, name, group = "", order = "", frame = "") {
    let expr;
    const noWindowParams = !(group || order || frame);
    if (name && noWindowParams) {
      expr = name ? sql`${func} OVER "${name}"` : sql`${func} OVER ()`;
    } else {
      const s1 = group && order ? " " : "";
      const s2 = (group || order) && frame ? " " : "";
      expr = sql`${func} OVER (${name ? `"${name}" ` : ""}${group}${s1}${order}${s2}${frame})`;
    }
    if (type) {
      expr = sql`(${expr})::${type}`;
    }
    const { _expr, _deps } = expr;
    super(_expr, _deps);
    this.window = op;
    this.func = func;
    this.type = type;
    this.name = name;
    this.group = group;
    this.order = order;
    this.frame = frame;
  }
  get basis() {
    return this.column;
  }
  get label() {
    const { func } = this;
    return func.label ?? func.toString();
  }
  /**
   * Return an updated window function over a named window definition.
   * @param {string} name The window definition name.
   * @returns {WindowFunction} A new window function.
   */
  over(name) {
    const { window: op, func, type, group, order, frame } = this;
    return new _WindowFunction(op, func, type, name, group, order, frame);
  }
  /**
   * Return an updated window function with the given partitioning.
   * @param {*} expr The grouping (partition by) criteria for the window function.
   * @returns {WindowFunction} A new window function.
   */
  partitionby(...expr) {
    const exprs = expr.flat().filter((x2) => x2).map(asColumn);
    const group = sql(
      ["PARTITION BY ", repeat(exprs.length - 1, ", "), ""],
      ...exprs
    );
    const { window: op, func, type, name, order, frame } = this;
    return new _WindowFunction(op, func, type, name, group, order, frame);
  }
  /**
   * Return an updated window function with the given ordering.
   * @param {*} expr The sorting (order by) criteria for the window function.
   * @returns {WindowFunction} A new window function.
   */
  orderby(...expr) {
    const exprs = expr.flat().filter((x2) => x2).map(asColumn);
    const order = sql(
      ["ORDER BY ", repeat(exprs.length - 1, ", "), ""],
      ...exprs
    );
    const { window: op, func, type, name, group, frame } = this;
    return new _WindowFunction(op, func, type, name, group, order, frame);
  }
  /**
   * Return an updated window function with the given rows frame.
   * @param {(number|null)[] | import('./expression.js').ParamLike} expr The row-based window frame.
   * @returns {WindowFunction} A new window function.
   */
  rows(expr) {
    const frame = windowFrame("ROWS", expr);
    const { window: op, func, type, name, group, order } = this;
    return new _WindowFunction(op, func, type, name, group, order, frame);
  }
  /**
   * Return an updated window function with the given range frame.
   * @param {(number|null)[] | import('./expression.js').ParamLike} expr The range-based window frame.
   * @returns {WindowFunction} A new window function.
   */
  range(expr) {
    const frame = windowFrame("RANGE", expr);
    const { window: op, func, type, name, group, order } = this;
    return new _WindowFunction(op, func, type, name, group, order, frame);
  }
};
function windowFrame(type, frame) {
  if (isParamLike(frame)) {
    const expr = sql`${frame}`;
    expr.toString = () => `${type} ${frameToSQL(frame.value)}`;
    return expr;
  }
  return `${type} ${frameToSQL(frame)}`;
}
function frameToSQL(frame) {
  const [prev, next] = frame;
  const a = prev === 0 ? "CURRENT ROW" : Number.isFinite(prev) ? `${Math.abs(prev)} PRECEDING` : "UNBOUNDED PRECEDING";
  const b = next === 0 ? "CURRENT ROW" : Number.isFinite(next) ? `${Math.abs(next)} FOLLOWING` : "UNBOUNDED FOLLOWING";
  return `BETWEEN ${a} AND ${b}`;
}
function winf(op, type) {
  return (...values) => {
    const func = functionCall(op)(...values);
    return new WindowFunction(op, func, type);
  };
}
var row_number = winf("ROW_NUMBER", "INTEGER");
var rank = winf("RANK", "INTEGER");
var dense_rank = winf("DENSE_RANK", "INTEGER");
var percent_rank = winf("PERCENT_RANK");
var cume_dist = winf("CUME_DIST");
var ntile = winf("NTILE");
var lag = winf("LAG");
var lead = winf("LEAD");
var first_value = winf("FIRST_VALUE");
var last_value = winf("LAST_VALUE");
var nth_value = winf("NTH_VALUE");

// ../sql/src/aggregates.js
var AggregateFunction = class _AggregateFunction extends SQLExpression {
  /**
   * Create a new AggregateFunction instance.
   * @param {*} op The aggregate operation.
   * @param {*} [args] The aggregate function arguments.
   * @param {*} [type] The SQL data type to cast to.
   * @param {boolean} [isDistinct] Flag indicating if this is a distinct value aggregate.
   * @param {*} [filter] Filtering expression to apply prior to aggregation.
   */
  constructor(op, args, type, isDistinct2, filter) {
    args = (args || []).map(asColumn);
    const { strings, exprs } = aggExpr(op, args, type, isDistinct2, filter);
    const { spans, cols } = parseSQL(strings, exprs);
    super(spans, cols);
    this.aggregate = op;
    this.args = args;
    this.type = type;
    this.isDistinct = isDistinct2;
    this.filter = filter;
  }
  get basis() {
    return this.column;
  }
  get label() {
    const { aggregate: op, args, isDistinct: isDistinct2 } = this;
    const dist = isDistinct2 ? "DISTINCT" + (args.length ? " " : "") : "";
    const tail = args.length ? `(${dist}${args.map(unquoted).join(", ")})` : "";
    return `${op.toLowerCase()}${tail}`;
  }
  /**
   * Return a new derived aggregate function over distinct values.
   * @returns {AggregateFunction} A new aggregate function.
   */
  distinct() {
    const { aggregate: op, args, type, filter } = this;
    return new _AggregateFunction(op, args, type, true, filter);
  }
  /**
   * Return a new derived aggregate function that filters values.
   * @param {*} filter The filter expresion.
   * @returns {AggregateFunction} A new aggregate function.
   */
  where(filter) {
    const { aggregate: op, args, type, isDistinct: isDistinct2 } = this;
    return new _AggregateFunction(op, args, type, isDistinct2, filter);
  }
  /**
   * Return a new window function over this aggregate.
   * @returns {WindowFunction} A new aggregate function.
   */
  window() {
    const { aggregate: op, args, type, isDistinct: isDistinct2 } = this;
    const func = new _AggregateFunction(op, args, null, isDistinct2);
    return new WindowFunction(op, func, type);
  }
  /**
   * Return a window function over this aggregate with the given partitioning.
   * @param {*} expr The grouping (partition by) criteria for the window function.
   * @returns {WindowFunction} A new window function.
   */
  partitionby(...expr) {
    return this.window().partitionby(...expr);
  }
  /**
   * Return a window function over this aggregate with the given ordering.
   * @param {*} expr The sorting (order by) criteria for the window function.
   * @returns {WindowFunction} A new window function.
   */
  orderby(...expr) {
    return this.window().orderby(...expr);
  }
  /**
   * Return a window function over this aggregate with the given row frame.
   * @param {(number|null)[] | import('./expression.js').ParamLike} frame The row-based window frame.
   * @returns {WindowFunction} A new window function.
   */
  rows(frame) {
    return this.window().rows(frame);
  }
  /**
   * Return a window function over this aggregate with the given range frame.
   * @param {(number|null)[] | import('./expression.js').ParamLike} frame The range-based window frame.
   * @returns {WindowFunction} A new window function.
   */
  range(frame) {
    return this.window().range(frame);
  }
};
function aggExpr(op, args, type, isDistinct2, filter) {
  const close = `)${type ? `::${type}` : ""}`;
  let strings = [`${op}(${isDistinct2 ? "DISTINCT " : ""}`];
  let exprs = [];
  if (args.length) {
    strings = strings.concat([
      ...repeat(args.length - 1, ", "),
      `${close}${filter ? " FILTER (WHERE " : ""}`,
      ...filter ? [")"] : []
    ]);
    exprs = [...args, ...filter ? [filter] : []];
  } else {
    strings[0] += "*" + close;
  }
  return { exprs, strings };
}
function unquoted(value) {
  const s = literalToSQL(value);
  return s && s.startsWith('"') && s.endsWith('"') ? s.slice(1, -1) : s;
}
function aggf(op, type) {
  return (...args) => new AggregateFunction(op, args, type);
}
var count = aggf("COUNT", "INTEGER");
var avg = aggf("AVG");
var mean = aggf("AVG");
var mad = aggf("MAD");
var max = aggf("MAX");
var min = aggf("MIN");
var sum = aggf("SUM", "DOUBLE");
var product = aggf("PRODUCT");
var median = aggf("MEDIAN");
var quantile = aggf("QUANTILE");
var mode = aggf("MODE");
var variance = aggf("VARIANCE");
var stddev = aggf("STDDEV");
var skewness = aggf("SKEWNESS");
var kurtosis = aggf("KURTOSIS");
var entropy = aggf("ENTROPY");
var varPop = aggf("VAR_POP");
var stddevPop = aggf("STDDEV_POP");
var corr = aggf("CORR");
var covarPop = aggf("COVAR_POP");
var regrIntercept = aggf("REGR_INTERCEPT");
var regrSlope = aggf("REGR_SLOPE");
var regrCount = aggf("REGR_COUNT");
var regrR2 = aggf("REGR_R2");
var regrSYY = aggf("REGR_SYY");
var regrSXX = aggf("REGR_SXX");
var regrSXY = aggf("REGR_SXY");
var regrAvgX = aggf("REGR_AVGX");
var regrAvgY = aggf("REGR_AVGY");
var first = aggf("FIRST");
var last = aggf("LAST");
var argmin = aggf("ARG_MIN");
var argmax = aggf("ARG_MAX");
var stringAgg = aggf("STRING_AGG");
var arrayAgg = aggf("ARRAY_AGG");

// ../sql/src/datetime.js
var epoch_ms = (expr) => {
  return sql`epoch_ms(${asColumn(expr)})`;
};

// ../sql/src/spatial.js
var geojson = functionCall("ST_AsGeoJSON");
var x = functionCall("ST_X");
var y = functionCall("ST_Y");
var centroid = functionCall("ST_CENTROID");

// ../sql/src/Query.js
var Query = class _Query {
  static select(...expr) {
    return new _Query().select(...expr);
  }
  static from(...expr) {
    return new _Query().from(...expr);
  }
  static with(...expr) {
    return new _Query().with(...expr);
  }
  static union(...queries) {
    return new SetOperation("UNION", queries.flat());
  }
  static unionAll(...queries) {
    return new SetOperation("UNION ALL", queries.flat());
  }
  static intersect(...queries) {
    return new SetOperation("INTERSECT", queries.flat());
  }
  static except(...queries) {
    return new SetOperation("EXCEPT", queries.flat());
  }
  static describe(query) {
    const q = query.clone();
    const { clone, toString } = q;
    return Object.assign(q, {
      describe: true,
      clone: () => _Query.describe(clone.call(q)),
      toString: () => `DESCRIBE ${toString.call(q)}`
    });
  }
  constructor() {
    this.query = {
      with: [],
      select: [],
      from: [],
      where: [],
      groupby: [],
      having: [],
      window: [],
      qualify: [],
      orderby: []
    };
    this.cteFor = null;
  }
  clone() {
    const q = new _Query();
    q.query = { ...this.query };
    return q;
  }
  /**
   * Retrieve current WITH common table expressions (CTEs).
   * @returns {any[]}
   */
  /**
  * Add WITH common table expressions (CTEs).
  * @param  {...any} expr Expressions to add.
  * @returns {this}
  */
  with(...expr) {
    const { query } = this;
    if (expr.length === 0) {
      return query.with;
    } else {
      const list = [];
      const add = (as, q) => {
        const query2 = q.clone();
        query2.cteFor = this;
        list.push({ as, query: query2 });
      };
      expr.flat().forEach((e) => {
        if (e == null) {
        } else if (e.as && e.query) {
          add(e.as, e.query);
        } else {
          for (const as in e) {
            add(as, e[as]);
          }
        }
      });
      query.with = query.with.concat(list);
      return this;
    }
  }
  /**
   * Retrieve current SELECT expressions.
   * @returns {any[]}
   */
  /**
  * Add SELECT expressions.
  * @param {...any} expr Expressions to add.
  * @returns {this}
  */
  select(...expr) {
    const { query } = this;
    if (expr.length === 0) {
      return query.select;
    } else {
      const list = [];
      for (const e of expr.flat()) {
        if (e == null) {
        } else if (typeof e === "string") {
          list.push({ as: e, expr: asColumn(e) });
        } else if (e instanceof Ref) {
          list.push({ as: e.column, expr: e });
        } else if (Array.isArray(e)) {
          list.push({ as: e[0], expr: e[1] });
        } else {
          for (const as in e) {
            list.push({ as: unquote(as), expr: asColumn(e[as]) });
          }
        }
      }
      query.select = query.select.concat(list);
      return this;
    }
  }
  $select(...expr) {
    this.query.select = [];
    return this.select(...expr);
  }
  distinct(value = true) {
    this.query.distinct = !!value;
    return this;
  }
  /**
   * Retrieve current from expressions.
   * @returns {any[]}
   */
  /**
  * Provide table from expressions.
  * @param  {...any} expr
  * @returns {this}
  */
  from(...expr) {
    const { query } = this;
    if (expr.length === 0) {
      return query.from;
    } else {
      const list = [];
      expr.flat().forEach((e) => {
        if (e == null) {
        } else if (typeof e === "string") {
          list.push({ as: e, from: asRelation(e) });
        } else if (e instanceof Ref) {
          list.push({ as: e.table, from: e });
        } else if (isQuery(e) || isSQLExpression(e)) {
          list.push({ from: e });
        } else if (Array.isArray(e)) {
          list.push({ as: unquote(e[0]), from: asRelation(e[1]) });
        } else {
          for (const as in e) {
            list.push({ as: unquote(as), from: asRelation(e[as]) });
          }
        }
      });
      query.from = query.from.concat(list);
      return this;
    }
  }
  $from(...expr) {
    this.query.from = [];
    return this.from(...expr);
  }
  /**
   * Retrieve current SAMPLE settings.
   * @returns {any[]}
   */
  /**
  * Set SAMPLE settings.
  * @param {number|object} value The percentage or number of rows to sample.
  * @param {string} [method] The sampling method to use.
  * @returns {this}
  */
  sample(value, method) {
    const { query } = this;
    if (arguments.length === 0) {
      return query.sample;
    } else {
      let spec = value;
      if (typeof value === "number") {
        spec = value > 0 && value < 1 ? { perc: 100 * value, method } : { rows: Math.round(value), method };
      }
      query.sample = spec;
      return this;
    }
  }
  /**
   * Retrieve current WHERE expressions.
   * @returns {any[]}
   */
  /**
  * Add WHERE expressions.
  * @param  {...any} expr Expressions to add.
  * @returns {this}
  */
  where(...expr) {
    const { query } = this;
    if (expr.length === 0) {
      return query.where;
    } else {
      query.where = query.where.concat(
        expr.flat().filter((x2) => x2)
      );
      return this;
    }
  }
  $where(...expr) {
    this.query.where = [];
    return this.where(...expr);
  }
  /**
   * Retrieve current GROUP BY expressions.
   * @returns {any[]}
   */
  /**
  * Add GROUP BY expressions.
  * @param  {...any} expr Expressions to add.
  * @returns {this}
  */
  groupby(...expr) {
    const { query } = this;
    if (expr.length === 0) {
      return query.groupby;
    } else {
      query.groupby = query.groupby.concat(
        expr.flat().filter((x2) => x2).map(asColumn)
      );
      return this;
    }
  }
  $groupby(...expr) {
    this.query.groupby = [];
    return this.groupby(...expr);
  }
  /**
   * Retrieve current HAVING expressions.
   * @returns {any[]}
   */
  /**
  * Add HAVING expressions.
  * @param  {...any} expr Expressions to add.
  * @returns {this}
  */
  having(...expr) {
    const { query } = this;
    if (expr.length === 0) {
      return query.having;
    } else {
      query.having = query.having.concat(
        expr.flat().filter((x2) => x2)
      );
      return this;
    }
  }
  /**
   * Retrieve current WINDOW definitions.
   * @returns {any[]}
   */
  /**
  * Add WINDOW definitions.
  * @param  {...any} expr Expressions to add.
  * @returns {this}
  */
  window(...expr) {
    const { query } = this;
    if (expr.length === 0) {
      return query.window;
    } else {
      const list = [];
      expr.flat().forEach((e) => {
        if (e == null) {
        } else {
          for (const as in e) {
            list.push({ as: unquote(as), expr: e[as] });
          }
        }
      });
      query.window = query.window.concat(list);
      return this;
    }
  }
  /**
   * Retrieve current QUALIFY expressions.
   * @returns {any[]}
   */
  /**
  * Add QUALIFY expressions.
  * @param  {...any} expr Expressions to add.
  * @returns {this}
  */
  qualify(...expr) {
    const { query } = this;
    if (expr.length === 0) {
      return query.qualify;
    } else {
      query.qualify = query.qualify.concat(
        expr.flat().filter((x2) => x2)
      );
      return this;
    }
  }
  /**
   * Retrieve current ORDER BY expressions.
   * @returns {any[]}
   */
  /**
  * Add ORDER BY expressions.
  * @param  {...any} expr Expressions to add.
  * @returns {this}
  */
  orderby(...expr) {
    const { query } = this;
    if (expr.length === 0) {
      return query.orderby;
    } else {
      query.orderby = query.orderby.concat(
        expr.flat().filter((x2) => x2).map(asColumn)
      );
      return this;
    }
  }
  /**
   * Retrieve current LIMIT value.
   * @returns {number|null}
   */
  /**
  * Set the query result LIMIT.
  * @param {number} value The limit value.
  * @returns {this}
  */
  limit(value) {
    const { query } = this;
    if (arguments.length === 0) {
      return query.limit;
    } else {
      query.limit = Number.isFinite(value) ? value : void 0;
      return this;
    }
  }
  /**
   * Retrieve current OFFSET value.
   * @returns {number|null}
   */
  /**
  * Set the query result OFFSET.
  * @param {number} value The offset value.
  * @returns {this}
  */
  offset(value) {
    const { query } = this;
    if (arguments.length === 0) {
      return query.offset;
    } else {
      query.offset = Number.isFinite(value) ? value : void 0;
      return this;
    }
  }
  get subqueries() {
    const { query, cteFor } = this;
    const ctes = (cteFor?.query || query).with;
    const cte = ctes?.reduce((o, { as, query: query2 }) => (o[as] = query2, o), {});
    const q = [];
    query.from.forEach(({ from }) => {
      if (isQuery(from)) {
        q.push(from);
      } else if (cte[from.table]) {
        const sub = cte[from.table];
        q.push(sub);
      }
    });
    return q;
  }
  toString() {
    const {
      with: cte,
      select,
      distinct: distinct2,
      from,
      sample,
      where,
      groupby,
      having,
      window,
      qualify,
      orderby,
      limit,
      offset
    } = this.query;
    const sql2 = [];
    if (cte.length) {
      const list = cte.map(({ as, query }) => `"${as}" AS (${query})`);
      sql2.push(`WITH ${list.join(", ")}`);
    }
    const sels = select.map(
      ({ as, expr }) => isColumnRefFor(expr, as) && !expr.table ? `${expr}` : `${expr} AS "${as}"`
    );
    sql2.push(`SELECT${distinct2 ? " DISTINCT" : ""} ${sels.join(", ")}`);
    if (from.length) {
      const rels = from.map(({ as, from: from2 }) => {
        const rel = isQuery(from2) ? `(${from2})` : `${from2}`;
        return !as || as === from2.table ? rel : `${rel} AS "${as}"`;
      });
      sql2.push(`FROM ${rels.join(", ")}`);
    }
    if (where.length) {
      const clauses = where.map(String).filter((x2) => x2).join(" AND ");
      if (clauses)
        sql2.push(`WHERE ${clauses}`);
    }
    if (sample) {
      const { rows, perc, method, seed } = sample;
      const size = rows ? `${rows} ROWS` : `${perc} PERCENT`;
      const how = method ? ` (${method}${seed != null ? `, ${seed}` : ""})` : "";
      sql2.push(`USING SAMPLE ${size}${how}`);
    }
    if (groupby.length) {
      sql2.push(`GROUP BY ${groupby.join(", ")}`);
    }
    if (having.length) {
      const clauses = having.map(String).filter((x2) => x2).join(" AND ");
      if (clauses)
        sql2.push(`HAVING ${clauses}`);
    }
    if (window.length) {
      const windows = window.map(({ as, expr }) => `"${as}" AS (${expr})`);
      sql2.push(`WINDOW ${windows.join(", ")}`);
    }
    if (qualify.length) {
      const clauses = qualify.map(String).filter((x2) => x2).join(" AND ");
      if (clauses)
        sql2.push(`QUALIFY ${clauses}`);
    }
    if (orderby.length) {
      sql2.push(`ORDER BY ${orderby.join(", ")}`);
    }
    if (Number.isFinite(limit)) {
      sql2.push(`LIMIT ${limit}`);
    }
    if (Number.isFinite(offset)) {
      sql2.push(`OFFSET ${offset}`);
    }
    return sql2.join(" ");
  }
};
var SetOperation = class _SetOperation {
  constructor(op, queries) {
    this.op = op;
    this.queries = queries.map((q) => q.clone());
    this.query = { orderby: [] };
    this.cteFor = null;
  }
  clone() {
    const q = new _SetOperation(this.op, this.queries);
    q.query = { ...this.query };
    return q;
  }
  orderby(...expr) {
    const { query } = this;
    if (expr.length === 0) {
      return query.orderby;
    } else {
      query.orderby = query.orderby.concat(
        expr.flat().filter((x2) => x2).map(asColumn)
      );
      return this;
    }
  }
  limit(value) {
    const { query } = this;
    if (arguments.length === 0) {
      return query.limit;
    } else {
      query.limit = Number.isFinite(value) ? value : void 0;
      return this;
    }
  }
  offset(value) {
    const { query } = this;
    if (arguments.length === 0) {
      return query.offset;
    } else {
      query.offset = Number.isFinite(value) ? value : void 0;
      return this;
    }
  }
  get subqueries() {
    const { queries, cteFor } = this;
    if (cteFor)
      queries.forEach((q) => q.cteFor = cteFor);
    return queries;
  }
  toString() {
    const { op, queries, query: { orderby, limit, offset } } = this;
    const sql2 = [queries.join(` ${op} `)];
    if (orderby.length) {
      sql2.push(`ORDER BY ${orderby.join(", ")}`);
    }
    if (Number.isFinite(limit)) {
      sql2.push(`LIMIT ${limit}`);
    }
    if (Number.isFinite(offset)) {
      sql2.push(`OFFSET ${offset}`);
    }
    return sql2.join(" ");
  }
};
function isQuery(value) {
  return value instanceof Query || value instanceof SetOperation;
}
function isDescribeQuery(value) {
  return isQuery(value) && value.describe;
}
function unquote(s) {
  return isDoubleQuoted(s) ? s.slice(1, -1) : s;
}
function isDoubleQuoted(s) {
  return s[0] === '"' && s[s.length - 1] === '"';
}

// ../sql/src/scales.js
var identity = (x2) => x2;
function scaleLinear() {
  return {
    apply: identity,
    invert: identity,
    sqlApply: asColumn,
    sqlInvert: identity
  };
}
function scaleLog({ base = null } = {}) {
  if (base == null || base === Math.E) {
    return {
      apply: Math.log,
      invert: Math.exp,
      sqlApply: (c) => sql`LN(${asColumn(c)})`,
      sqlInvert: (c) => sql`EXP(${c})`
    };
  } else if (base === 10) {
    return {
      apply: Math.log10,
      invert: (x2) => Math.pow(10, x2),
      sqlApply: (c) => sql`LOG(${asColumn(c)})`,
      sqlInvert: (c) => sql`POW(10, ${c})`
    };
  } else {
    const b = +base;
    return {
      apply: (x2) => Math.log(x2) / Math.log(b),
      invert: (x2) => Math.pow(b, x2),
      sqlApply: (c) => sql`LN(${asColumn(c)}) / LN(${b})`,
      sqlInvert: (c) => sql`POW(${b}, ${c})`
    };
  }
}
function scaleSymlog({ constant = 1 } = {}) {
  const _ = +constant;
  return {
    apply: (x2) => Math.sign(x2) * Math.log1p(Math.abs(x2)),
    invert: (x2) => Math.sign(x2) * Math.exp(Math.abs(x2) - _),
    sqlApply: (c) => (c = asColumn(c), sql`SIGN(${c}) * LN(${_} + ABS(${c}))`),
    sqlInvert: (c) => sql`SIGN(${c}) * (EXP(ABS(${c})) - ${_})`
  };
}
function scaleSqrt() {
  return {
    apply: (x2) => Math.sign(x2) * Math.sqrt(Math.abs(x2)),
    invert: (x2) => Math.sign(x2) * x2 * x2,
    sqlApply: (c) => (c = asColumn(c), sql`SIGN(${c}) * SQRT(ABS(${c}))`),
    sqlInvert: (c) => sql`SIGN(${c}) * (${c}) ** 2`
  };
}
function scalePow({ exponent = 1 } = {}) {
  const e = +exponent;
  return {
    apply: (x2) => Math.sign(x2) * Math.pow(Math.abs(x2), e),
    invert: (x2) => Math.sign(x2) * Math.pow(Math.abs(x2), 1 / e),
    sqlApply: (c) => (c = asColumn(c), sql`SIGN(${c}) * POW(ABS(${c}), ${e})`),
    sqlInvert: (c) => sql`SIGN(${c}) * POW(ABS(${c}), 1/${e})`
  };
}
function scaleTime() {
  return {
    apply: (x2) => +x2,
    invert: (x2) => new Date(x2),
    sqlApply: (c) => c instanceof Date ? +c : epoch_ms(asColumn(c)),
    sqlInvert: identity
  };
}
var scales = {
  linear: scaleLinear,
  log: scaleLog,
  symlog: scaleSymlog,
  sqrt: scaleSqrt,
  pow: scalePow,
  time: scaleTime,
  utc: scaleTime
};
function scaleTransform(options) {
  const scale = scales[options.type];
  return scale ? { ...options, ...scale(options) } : null;
}

// ../sql/src/load/create.js
function create(name, query, {
  replace = false,
  temp = true,
  view = false
} = {}) {
  return "CREATE" + (replace ? " OR REPLACE " : " ") + (temp ? "TEMP " : "") + (view ? "VIEW" : "TABLE") + (replace ? " " : " IF NOT EXISTS ") + name + " AS " + query;
}

// ../core/src/util/hash.js
function fnv_hash(v) {
  let a = 2166136261;
  for (let i = 0, n = v.length; i < n; ++i) {
    const c = v.charCodeAt(i);
    const d = c & 65280;
    if (d)
      a = fnv_multiply(a ^ d >> 8);
    a = fnv_multiply(a ^ c & 255);
  }
  return fnv_mix(a);
}
function fnv_multiply(a) {
  return a + (a << 1) + (a << 4) + (a << 7) + (a << 8) + (a << 24);
}
function fnv_mix(a) {
  a += a << 13;
  a ^= a >>> 7;
  a += a << 3;
  a ^= a >>> 17;
  a += a << 5;
  return a & 4294967295;
}

// ../core/src/DataCubeIndexer.js
var DataCubeIndexer = class {
  /**
   *
   * @param {import('./Coordinator.js').Coordinator} mc a Mosaic coordinator
   * @param {*} options Options hash to configure the data cube indexes and pass selections to the coordinator.
   */
  constructor(mc, { selection, temp = true }) {
    this.mc = mc;
    this.selection = selection;
    this.temp = temp;
    this.reset();
  }
  reset() {
    this.enabled = false;
    this.clients = null;
    this.indices = null;
    this.activeView = null;
  }
  clear() {
    if (this.indices) {
      this.mc.cancel(Array.from(this.indices.values(), (index) => index.result));
      this.indices = null;
    }
  }
  index(clients, active) {
    if (this.clients !== clients) {
      const cols = Array.from(clients, getIndexColumns);
      const from = cols[0]?.from;
      this.enabled = cols.every((c) => c && c.from === from);
      this.clients = clients;
      this.activeView = null;
      this.clear();
    }
    if (!this.enabled)
      return false;
    active = active || this.selection.active;
    const { source } = active;
    if (source && source === this.activeView?.source)
      return true;
    this.clear();
    if (!source)
      return false;
    const activeView = this.activeView = getActiveView(active);
    if (!activeView)
      return false;
    this.mc.logger().warn("DATA CUBE INDEX CONSTRUCTION");
    const sel = this.selection.remove(source);
    const indices = this.indices = /* @__PURE__ */ new Map();
    const { mc, temp } = this;
    for (const client of clients) {
      if (sel.skip(client, active))
        continue;
      const index = getIndexColumns(client);
      const query = client.query(sel.predicate(client)).select({ ...activeView.columns, ...index.count }).groupby(Object.keys(activeView.columns));
      const [subq] = query.subqueries;
      if (subq) {
        const cols = Object.values(activeView.columns).map((c) => c.columns[0]);
        subqueryPushdown(subq, cols);
      }
      const order = query.orderby();
      query.query.orderby = [];
      const sql2 = query.toString();
      const id = (fnv_hash(sql2) >>> 0).toString(16);
      const table2 = `cube_index_${id}`;
      const result = mc.exec(create(table2, sql2, { temp }));
      indices.set(client, { table: table2, result, order, ...index });
    }
  }
  async update() {
    const { clients, selection, activeView } = this;
    const filter = activeView.predicate(selection.active.predicate);
    return Promise.all(
      Array.from(clients).map((client) => this.updateClient(client, filter))
    );
  }
  async updateClient(client, filter) {
    const index = this.indices.get(client);
    if (!index)
      return;
    if (!filter) {
      filter = this.activeView.predicate(this.selection.active.predicate);
    }
    const { table: table2, dims, aggr, order = [] } = index;
    const query = Query.select(dims, aggr).from(table2).groupby(dims).where(filter).orderby(order);
    return this.mc.updateClient(client, query);
  }
};
function getActiveView(clause) {
  const { source, schema } = clause;
  let columns = clause.predicate?.columns;
  if (!schema || !columns)
    return null;
  const { type, scales: scales2, pixelSize = 1 } = schema;
  let predicate;
  if (type === "interval" && scales2) {
    const bins = scales2.map((s) => binInterval(s, pixelSize));
    if (bins.some((b) => b == null))
      return null;
    if (bins.length === 1) {
      predicate = (p) => p ? isBetween("active0", p.range.map(bins[0])) : [];
      columns = { active0: bins[0](clause.predicate.field) };
    } else {
      predicate = (p) => p ? and(p.children.map(({ range }, i) => isBetween(`active${i}`, range.map(bins[i])))) : [];
      columns = Object.fromEntries(
        clause.predicate.children.map((p, i) => [`active${i}`, bins[i](p.field)])
      );
    }
  } else if (type === "point") {
    predicate = (x2) => x2;
    columns = Object.fromEntries(columns.map((col) => [col.toString(), col]));
  } else {
    return null;
  }
  return { source, columns, predicate };
}
function binInterval(scale, pixelSize) {
  const { apply, sqlApply } = scaleTransform(scale);
  if (apply) {
    const { domain, range } = scale;
    const lo = apply(Math.min(...domain));
    const hi = apply(Math.max(...domain));
    const a = Math.abs(range[1] - range[0]) / (hi - lo) / pixelSize;
    const s = pixelSize === 1 ? "" : `${pixelSize}::INTEGER * `;
    return (value) => sql`${s}FLOOR(${a}::DOUBLE * (${sqlApply(value)} - ${lo}::DOUBLE))::INTEGER`;
  }
}
var NO_INDEX = { from: NaN };
function getIndexColumns(client) {
  if (!client.filterIndexable)
    return NO_INDEX;
  const q = client.query();
  const from = getBaseTable(q);
  if (!from || !q.groupby)
    return NO_INDEX;
  const g = new Set(q.groupby().map((c) => c.column));
  const aggr = [];
  const dims = [];
  let count2;
  for (const { as, expr: { aggregate } } of q.select()) {
    switch (aggregate?.toUpperCase?.()) {
      case "COUNT":
      case "SUM":
        aggr.push({ [as]: sql`SUM("${as}")::DOUBLE` });
        break;
      case "AVG":
        count2 = "_count_";
        aggr.push({ [as]: sql`(SUM("${as}" * ${count2}) / SUM(${count2}))::DOUBLE` });
        break;
      case "MAX":
        aggr.push({ [as]: sql`MAX("${as}")` });
        break;
      case "MIN":
        aggr.push({ [as]: sql`MIN("${as}")` });
        break;
      default:
        if (g.has(as))
          dims.push(as);
        else
          return null;
    }
  }
  return {
    aggr,
    dims,
    count: count2 ? { [count2]: sql`COUNT(*)` } : {},
    from
  };
}
function getBaseTable(query) {
  const subq = query.subqueries;
  if (query.select) {
    const from = query.from();
    if (!from.length)
      return void 0;
    if (subq.length === 0)
      return from[0].from.table;
  }
  const base = getBaseTable(subq[0]);
  for (let i = 1; i < subq.length; ++i) {
    const from = getBaseTable(subq[i]);
    if (from === void 0)
      continue;
    if (from !== base)
      return NaN;
  }
  return base;
}
function subqueryPushdown(query, cols) {
  const memo = /* @__PURE__ */ new Set();
  const pushdown = (q) => {
    if (memo.has(q))
      return;
    memo.add(q);
    if (q.select && q.from().length) {
      q.select(cols);
    }
    q.subqueries.forEach(pushdown);
  };
  pushdown(query);
}

// ../core/src/FilterGroup.js
var FilterGroup = class {
  /**
   * @param {import('./Coordinator.js').Coordinator} coordinator The Mosaic coordinator.
   * @param {*} selection The shared filter selection.
   * @param {*} index Boolean flag or options hash for data cube indexer.
   *  Falsy values disable indexing.
   */
  constructor(coordinator2, selection, index = true) {
    this.mc = coordinator2;
    this.selection = selection;
    this.clients = /* @__PURE__ */ new Set();
    this.indexer = index ? new DataCubeIndexer(this.mc, { ...index, selection }) : null;
    const { value, activate } = this.handlers = {
      value: () => this.update(),
      activate: (clause) => this.indexer?.index(this.clients, clause)
    };
    selection.addEventListener("value", value);
    selection.addEventListener("activate", activate);
  }
  finalize() {
    const { value, activate } = this.handlers;
    this.selection.removeEventListener("value", value);
    this.selection.removeEventListener("activate", activate);
  }
  reset() {
    this.indexer?.reset();
  }
  add(client) {
    (this.clients = new Set(this.clients)).add(client);
    return this;
  }
  remove(client) {
    if (this.clients.has(client)) {
      (this.clients = new Set(this.clients)).delete(client);
    }
    return this;
  }
  update() {
    const { mc, indexer, clients, selection } = this;
    return indexer?.index(clients) ? indexer.update() : defaultUpdate(mc, clients, selection);
  }
};
function defaultUpdate(mc, clients, selection) {
  return Promise.all(Array.from(clients).map((client) => {
    const filter = selection.predicate(client);
    if (filter != null) {
      return mc.updateClient(client, client.query(filter));
    }
  }));
}

// ../core/src/util/query-result.js
function queryResult() {
  let resolve;
  let reject;
  const p = new Promise((r, e) => {
    resolve = r;
    reject = e;
  });
  return Object.assign(p, {
    fulfill: (value) => (resolve(value), p),
    reject: (err) => (reject(err), p)
  });
}

// ../core/src/QueryConsolidator.js
function wait(callback) {
  const method = typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : typeof setImmediate !== "undefined" ? setImmediate : setTimeout;
  return method(callback);
}
function consolidator(enqueue, cache, record) {
  let pending = [];
  let id = 0;
  function run() {
    const groups = entryGroups(pending, cache);
    pending = [];
    id = 0;
    for (const group of groups) {
      consolidate(group, enqueue, record);
      processResults(group, cache);
    }
  }
  return {
    add(entry, priority) {
      if (entry.request.type === "arrow") {
        id = id || wait(() => run());
        pending.push({ entry, priority, index: pending.length });
      } else {
        enqueue(entry, priority);
      }
    }
  };
}
function entryGroups(entries, cache) {
  const groups = [];
  const groupMap = /* @__PURE__ */ new Map();
  for (const query of entries) {
    const { entry: { request } } = query;
    const key = consolidationKey(request.query, cache);
    if (!groupMap.has(key)) {
      const list = [];
      groups.push(list);
      groupMap.set(key, list);
    }
    groupMap.get(key).push(query);
  }
  return groups;
}
function consolidationKey(query, cache) {
  const sql2 = `${query}`;
  if (query instanceof Query && !cache.get(sql2)) {
    if (
      // @ts-ignore
      query.orderby().length || query.where().length || // @ts-ignore
      query.qualify().length || query.having().length
    ) {
      return sql2;
    }
    const q = query.clone().$select("*");
    const groupby = query.groupby();
    if (groupby.length) {
      const map = {};
      query.select().forEach(({ as, expr }) => map[as] = expr);
      q.$groupby(groupby.map((e) => e instanceof Ref && map[e.column] || e));
    }
    return `${q}`;
  } else {
    return sql2;
  }
}
function consolidate(group, enqueue, record) {
  if (shouldConsolidate(group)) {
    enqueue({
      request: {
        type: "arrow",
        cache: false,
        record: false,
        query: group.query = consolidatedQuery(group, record)
      },
      result: group.result = queryResult()
    });
  } else {
    for (const { entry, priority } of group) {
      enqueue(entry, priority);
    }
  }
}
function shouldConsolidate(group) {
  if (group.length > 1) {
    const sql2 = `${group[0].entry.request.query}`;
    for (let i = 1; i < group.length; ++i) {
      if (sql2 !== `${group[i].entry.request.query}`) {
        return true;
      }
    }
  }
  return false;
}
function consolidatedQuery(group, record) {
  const maps = group.maps = [];
  const fields = /* @__PURE__ */ new Map();
  for (const item of group) {
    const { query: query2 } = item.entry.request;
    const fieldMap = [];
    maps.push(fieldMap);
    for (const { as, expr } of query2.select()) {
      const e = `${expr}`;
      if (!fields.has(e)) {
        fields.set(e, [`col${fields.size}`, expr]);
      }
      const [name] = fields.get(e);
      fieldMap.push([name, as]);
    }
    record(`${query2}`);
  }
  const query = group[0].entry.request.query.clone();
  const groupby = query.groupby();
  if (groupby.length) {
    const map = {};
    group.maps[0].forEach(([name, as]) => map[as] = name);
    query.$groupby(groupby.map((e) => e instanceof Ref && map[e.column] || e));
  }
  return query.$select(Array.from(fields.values()));
}
async function processResults(group, cache) {
  const { maps, query, result } = group;
  if (!maps)
    return;
  let data;
  try {
    data = await result;
  } catch (err) {
    for (const { entry } of group) {
      entry.result.reject(err);
    }
    return;
  }
  const describe = isDescribeQuery(query);
  group.forEach(({ entry }, index) => {
    const { request, result: result2 } = entry;
    const map = maps[index];
    const extract = describe && map ? filterResult(data, map) : map ? projectResult(data, map) : data;
    if (request.cache) {
      cache.set(String(request.query), extract);
    }
    result2.fulfill(extract);
  });
}
function projectResult(data, map) {
  const cols = {};
  for (const [name, as] of map) {
    cols[as] = data.getChild(name);
  }
  return new data.constructor(cols);
}
function filterResult(data, map) {
  const lookup = new Map(map);
  const result = [];
  for (const d of data) {
    if (lookup.has(d.column_name)) {
      result.push({ ...d, column_name: lookup.get(d.column_name) });
    }
  }
  return result;
}

// ../core/src/util/cache.js
var requestIdle = typeof requestIdleCallback !== "undefined" ? requestIdleCallback : setTimeout;
var voidCache = () => ({
  get: () => void 0,
  set: (key, value) => value,
  clear: () => {
  }
});
function lruCache({
  max: max2 = 1e3,
  // max entries
  ttl = 3 * 60 * 60 * 1e3
  // time-to-live, default 3 hours
} = {}) {
  let cache = /* @__PURE__ */ new Map();
  function evict() {
    const expire = performance.now() - ttl;
    let lruKey = null;
    let lruLast = Infinity;
    for (const [key, value] of cache) {
      const { last: last2 } = value;
      if (last2 < lruLast) {
        lruKey = key;
        lruLast = last2;
      }
      if (expire > last2) {
        cache.delete(key);
      }
    }
    if (lruKey) {
      cache.delete(lruKey);
    }
  }
  return {
    get(key) {
      const entry = cache.get(key);
      if (entry) {
        entry.last = performance.now();
        return entry.value;
      }
    },
    set(key, value) {
      cache.set(key, { last: performance.now(), value });
      if (cache.size > max2)
        requestIdle(evict);
      return value;
    },
    clear() {
      cache = /* @__PURE__ */ new Map();
    }
  };
}

// ../core/src/util/priority-queue.js
function priorityQueue(ranks) {
  const queue = Array.from(
    { length: ranks },
    () => ({ head: null, tail: null })
  );
  return {
    /**
     * Indicate if the queue is empty.
     * @returns [boolean] true if empty, false otherwise.
     */
    isEmpty() {
      return queue.every((list) => !list.head);
    },
    /**
     * Insert an item into the queue with a given priority rank.
     * @param {*} item The item to add.
     * @param {number} rank The integer priority rank.
     *  Priority ranks are integers starting at zero.
     *  Lower ranks indicate higher priority.
     */
    insert(item, rank2) {
      const list = queue[rank2];
      if (!list) {
        throw new Error(`Invalid queue priority rank: ${rank2}`);
      }
      const node = { item, next: null };
      if (list.head === null) {
        list.head = list.tail = node;
      } else {
        list.tail = list.tail.next = node;
      }
    },
    /**
     * Remove a set of items from the queue, regardless of priority rank.
     * If a provided item is not in the queue it will be ignored.
     * @param {(item: *) => boolean} test A predicate function to test
     * 	if an item should be removed (true to drop, false to keep).
     */
    remove(test) {
      for (const list of queue) {
        let { head, tail } = list;
        for (let prev = null, curr = head; curr; prev = curr, curr = curr.next) {
          if (test(curr.item)) {
            if (curr === head) {
              head = curr.next;
            } else {
              prev.next = curr.next;
            }
            if (curr === tail)
              tail = prev || head;
          }
        }
        list.head = head;
        list.tail = tail;
      }
    },
    /**
     * Remove and return the next highest priority item.
     * @returns {*} The next item in the queue,
     *  or undefined if this queue is empty.
     */
    next() {
      for (const list of queue) {
        const { head } = list;
        if (head !== null) {
          list.head = head.next;
          if (list.tail === head) {
            list.tail = null;
          }
          return head.item;
        }
      }
    }
  };
}

// ../core/src/QueryManager.js
var Priority = { High: 0, Normal: 1, Low: 2 };
function QueryManager() {
  const queue = priorityQueue(3);
  let db;
  let clientCache;
  let logger;
  let recorders = [];
  let pending = null;
  let consolidate2;
  function next() {
    if (pending || queue.isEmpty())
      return;
    const { request, result } = queue.next();
    pending = submit(request, result);
    pending.finally(() => {
      pending = null;
      next();
    });
  }
  function enqueue(entry, priority = Priority.Normal) {
    queue.insert(entry, priority);
    next();
  }
  function recordQuery(sql2) {
    if (recorders.length && sql2) {
      recorders.forEach((rec) => rec.add(sql2));
    }
  }
  async function submit(request, result) {
    try {
      const { query, type, cache = false, record = true, options } = request;
      const sql2 = query ? `${query}` : null;
      if (record) {
        recordQuery(sql2);
      }
      if (cache) {
        const cached = clientCache.get(sql2);
        if (cached) {
          logger.debug("Cache");
          result.fulfill(cached);
          return;
        }
      }
      const t0 = performance.now();
      const data = await db.query({ type, sql: sql2, ...options });
      if (cache)
        clientCache.set(sql2, data);
      logger.debug(`Request: ${(performance.now() - t0).toFixed(1)}`);
      result.fulfill(data);
    } catch (err) {
      result.reject(err);
    }
  }
  return {
    cache(value) {
      return value !== void 0 ? clientCache = value === true ? lruCache() : value || voidCache() : clientCache;
    },
    logger(value) {
      return value ? logger = value : logger;
    },
    connector(connector) {
      return connector ? db = connector : db;
    },
    consolidate(flag) {
      if (flag && !consolidate2) {
        consolidate2 = consolidator(enqueue, clientCache, recordQuery);
      } else if (!flag && consolidate2) {
        consolidate2 = null;
      }
    },
    request(request, priority = Priority.Normal) {
      const result = queryResult();
      const entry = { request, result };
      if (consolidate2) {
        consolidate2.add(entry, priority);
      } else {
        enqueue(entry, priority);
      }
      return result;
    },
    cancel(requests) {
      const set = new Set(requests);
      queue.remove(({ result }) => set.has(result));
    },
    clear() {
      queue.remove(({ result }) => {
        result.reject("Cleared");
        return true;
      });
    },
    record() {
      let state = [];
      const recorder = {
        add(query) {
          state.push(query);
        },
        reset() {
          state = [];
        },
        snapshot() {
          return state.slice();
        },
        stop() {
          recorders = recorders.filter((x2) => x2 !== recorder);
          return state;
        }
      };
      recorders.push(recorder);
      return recorder;
    }
  };
}

// ../core/src/util/js-type.js
function jsType(type) {
  switch (type) {
    case "BIGINT":
    case "HUGEINT":
    case "INTEGER":
    case "SMALLINT":
    case "TINYINT":
    case "UBIGINT":
    case "UINTEGER":
    case "USMALLINT":
    case "UTINYINT":
    case "DOUBLE":
    case "FLOAT":
    case "REAL":
      return "number";
    case "DATE":
    case "TIMESTAMP":
    case "TIMESTAMPTZ":
    case "TIMESTAMP WITH TIME ZONE":
    case "TIME":
    case "TIMESTAMP_NS":
      return "date";
    case "BOOLEAN":
      return "boolean";
    case "VARCHAR":
    case "UUID":
      return "string";
    case "ARRAY":
    case "LIST":
      return "array";
    case "BLOB":
    case "STRUCT":
    case "MAP":
    case "GEOMETRY":
      return "object";
    default:
      if (type.startsWith("DECIMAL")) {
        return "number";
      } else if (type.startsWith("STRUCT") || type.startsWith("MAP")) {
        return "object";
      } else if (type.endsWith("]")) {
        return "array";
      }
      throw new Error(`Unsupported type: ${type}`);
  }
}

// ../core/src/util/convert-arrow.js
function convertArrowValue(type) {
  if (DataType.isTimestamp(type)) {
    return (v) => v == null ? v : new Date(v);
  }
  if (DataType.isInt(type) && type.bitWidth >= 64) {
    return (v) => v == null ? v : Number(v);
  }
  if (DataType.isDecimal(type)) {
    const scale = 1 / Math.pow(10, type.scale);
    return (v) => v == null ? v : decimalToNumber(v, scale);
  }
  return (v) => v;
}
var BASE32 = Array.from(
  { length: 8 },
  (_, i) => Math.pow(2, i * 32)
);
function decimalToNumber(v, scale) {
  const n = v.length;
  let x2 = 0;
  if (v.signed && (v[n - 1] | 0) < 0) {
    for (let i = 0; i < n; ++i) {
      x2 += ~v[i] * BASE32[i];
    }
    x2 = -(x2 + 1);
  } else {
    for (let i = 0; i < n; ++i) {
      x2 += v[i] * BASE32[i];
    }
  }
  return x2 * scale;
}

// ../core/src/util/field-info.js
var Count = "count";
var Nulls = "nulls";
var Max = "max";
var Min = "min";
var Distinct = "distinct";
var statMap = {
  [Count]: count,
  [Distinct]: (column2) => count(column2).distinct(),
  [Max]: max,
  [Min]: min,
  [Nulls]: (column2) => count().where(isNull(column2))
};
function summarize(table2, column2, stats) {
  return Query.from(table2).select(Array.from(stats, (s) => [s, statMap[s](column2)]));
}
async function queryFieldInfo(mc, fields) {
  if (fields.length === 1 && `${fields[0].column}` === "*") {
    return getTableInfo(mc, fields[0].table);
  } else {
    return (await Promise.all(fields.map((f) => getFieldInfo(mc, f)))).filter((x2) => x2);
  }
}
async function getFieldInfo(mc, { table: table2, column: column2, stats }) {
  const q = Query.from({ source: table2 }).select({ column: column2 }).groupby(column2.aggregate ? sql`ALL` : []);
  const [desc2] = Array.from(await mc.query(Query.describe(q)));
  const info = {
    table: table2,
    column: `${column2}`,
    sqlType: desc2.column_type,
    type: jsType(desc2.column_type),
    nullable: desc2.null === "YES"
  };
  if (!(stats?.length || stats?.size))
    return info;
  const result = await mc.query(
    summarize(table2, column2, stats),
    { persist: true }
  );
  for (let i = 0; i < result.numCols; ++i) {
    const { name } = result.schema.fields[i];
    const child = result.getChildAt(i);
    const convert = convertArrowValue(child.type);
    info[name] = convert(child.get(0));
  }
  return info;
}
async function getTableInfo(mc, table2) {
  const result = await mc.query(`DESCRIBE ${asRelation(table2)}`);
  return Array.from(result).map((desc2) => ({
    table: table2,
    column: desc2.column_name,
    sqlType: desc2.column_type,
    type: jsType(desc2.column_type),
    nullable: desc2.null === "YES"
  }));
}

// ../core/src/util/void-logger.js
function voidLogger() {
  return {
    debug() {
    },
    info() {
    },
    log() {
    },
    warn() {
    },
    error() {
    }
  };
}

// ../core/src/Coordinator.js
var _instance;
function coordinator(instance8) {
  if (instance8) {
    _instance = instance8;
  } else if (_instance == null) {
    _instance = new Coordinator();
  }
  return _instance;
}
var Coordinator = class {
  constructor(db = socketConnector(), options = {}) {
    const {
      logger = console,
      manager = QueryManager()
    } = options;
    this.manager = manager;
    this.logger(logger);
    this.configure(options);
    this.databaseConnector(db);
    this.clear();
  }
  logger(logger) {
    if (arguments.length) {
      this._logger = logger || voidLogger();
      this.manager.logger(this._logger);
    }
    return this._logger;
  }
  /**
   * Set configuration options for this coordinator.
   * @param {object} [options] Configration options.
   * @param {boolean} [options.cache=true] Boolean flag to enable/disable query caching.
   * @param {boolean} [options.consolidate=true] Boolean flag to enable/disable query consolidation.
   * @param {boolean|object} [options.indexes=true] Boolean flag to enable/disable
   *  automatic data cube indexes or an index options object.
   */
  configure({ cache = true, consolidate: consolidate2 = true, indexes = true } = {}) {
    this.manager.cache(cache);
    this.manager.consolidate(consolidate2);
    this.indexes = indexes;
  }
  clear({ clients = true, cache = true } = {}) {
    this.manager.clear();
    if (clients) {
      this.clients?.forEach((client) => this.disconnect(client));
      this.filterGroups?.forEach((group) => group.finalize());
      this.clients = /* @__PURE__ */ new Set();
      this.filterGroups = /* @__PURE__ */ new Map();
    }
    if (cache)
      this.manager.cache().clear();
  }
  databaseConnector(db) {
    return this.manager.connector(db);
  }
  // -- Query Management ----
  cancel(requests) {
    this.manager.cancel(requests);
  }
  exec(query, { priority = Priority.Normal } = {}) {
    query = Array.isArray(query) ? query.join(";\n") : query;
    return this.manager.request({ type: "exec", query }, priority);
  }
  query(query, {
    type = "arrow",
    cache = true,
    priority = Priority.Normal,
    ...options
  } = {}) {
    return this.manager.request({ type, query, cache, options }, priority);
  }
  prefetch(query, options = {}) {
    return this.query(query, { ...options, cache: true, priority: Priority.Low });
  }
  createBundle(name, queries, priority = Priority.Low) {
    const options = { name, queries };
    return this.manager.request({ type: "create-bundle", options }, priority);
  }
  loadBundle(name, priority = Priority.High) {
    const options = { name };
    return this.manager.request({ type: "load-bundle", options }, priority);
  }
  // -- Client Management ----
  updateClient(client, query, priority = Priority.Normal) {
    client.queryPending();
    return this.query(query, { priority }).then(
      (data) => client.queryResult(data).update(),
      (err) => {
        client.queryError(err);
        this._logger.error(err);
      }
    );
  }
  requestQuery(client, query) {
    this.filterGroups.get(client.filterBy)?.reset();
    return query ? this.updateClient(client, query) : client.update();
  }
  /**
   * Connect a client to the coordinator.
   * @param {import('./MosaicClient.js').MosaicClient} client the client to disconnect
   */
  async connect(client) {
    const { clients, filterGroups, indexes } = this;
    if (clients.has(client)) {
      throw new Error("Client already connected.");
    }
    clients.add(client);
    client.coordinator = this;
    const fields = client.fields();
    if (fields?.length) {
      client.fieldInfo(await queryFieldInfo(this, fields));
    }
    const filter = client.filterBy;
    if (filter) {
      if (filterGroups.has(filter)) {
        filterGroups.get(filter).add(client);
      } else {
        const group = new FilterGroup(this, filter, indexes);
        filterGroups.set(filter, group.add(client));
      }
    }
    client.requestQuery();
  }
  /**
   * Disconnect a client from the coordinator.
   *
   * @param {import('./MosaicClient.js').MosaicClient} client the client to disconnect
   */
  disconnect(client) {
    const { clients, filterGroups } = this;
    if (!clients.has(client))
      return;
    clients.delete(client);
    filterGroups.get(client.filterBy)?.remove(client);
    client.coordinator = null;
  }
};

// ../core/src/util/AsyncDispatch.js
var AsyncDispatch = class {
  /**
   * Create a new asynchronous dispatcher instance.
   */
  constructor() {
    this._callbacks = /* @__PURE__ */ new Map();
  }
  /**
   * Add an event listener callback for the provided event type.
   * @param {string} type The event type.
   * @param {(value: *) => void | Promise} callback The event handler
   *  callback function to add. If the callback has already been
   *  added for the event type, this method has no effect.
   */
  addEventListener(type, callback) {
    if (!this._callbacks.has(type)) {
      this._callbacks.set(type, {
        callbacks: /* @__PURE__ */ new Set(),
        pending: null,
        queue: new DispatchQueue()
      });
    }
    const entry = this._callbacks.get(type);
    entry.callbacks.add(callback);
  }
  /**
   * Remove an event listener callback for the provided event type.
   * @param {string} type The event type.
   * @param {(value: *) => void | Promise} callback The event handler
   *  callback function to remove.
   */
  removeEventListener(type, callback) {
    const entry = this._callbacks.get(type);
    if (entry) {
      entry.callbacks.delete(callback);
    }
  }
  /**
   * Lifecycle method that returns the event value to emit.
   * This default implementation simply returns the input value as-is.
   * Subclasses may override this method to implement custom transformations
   * prior to emitting an event value to all listeners.
   * @param {string} type The event type.
   * @param {*} value The event value.
   * @returns The (possibly transformed) event value to emit.
   */
  willEmit(type, value) {
    return value;
  }
  /**
   * Lifecycle method that returns a filter function for updating the
   * queue of unemitted event values prior to enqueueing a new value.
   * This default implementation simply returns null, indicating that
   * any other unemitted event values should be dropped (that is, all
   * queued events are filtered)
   * @param {string} type The event type.
   * @param {*} value The new event value that will be enqueued.
   * @returns {(value: *) => boolean|null} A dispatch queue filter
   *  function, or null if all unemitted event values should be filtered.
   */
  emitQueueFilter(type, value) {
    return null;
  }
  /**
   * Cancel all unemitted event values for the given event type.
   * @param {string} type The event type.
   */
  cancel(type) {
    const entry = this._callbacks.get(type);
    entry?.queue.clear();
  }
  /**
   * Emit an event value to listeners for the given event type.
   * If a previous emit has not yet resolved, the event value
   * will be queued to be emitted later.
   * The actual event value given to listeners will be the result
   * of passing the input value through the emitValue() method.
   * @param {string} type The event type.
   * @param {*} value The event value.
   */
  emit(type, value) {
    const entry = this._callbacks.get(type) || {};
    if (entry.pending) {
      entry.queue.enqueue(value, this.emitQueueFilter(type, value));
    } else {
      const event = this.willEmit(type, value);
      const { callbacks, queue } = entry;
      if (callbacks?.size) {
        const promise = Promise.allSettled(Array.from(callbacks, (callback) => callback(event))).then(() => {
          entry.pending = null;
          if (!queue.isEmpty()) {
            this.emit(type, queue.dequeue());
          }
        });
        entry.pending = promise;
      }
    }
  }
};
var DispatchQueue = class {
  /**
   * Create a new dispatch queue instance.
   */
  constructor() {
    this.clear();
  }
  /**
   * Clear the queue state of all event values.
   */
  clear() {
    this.next = null;
  }
  /**
   * Indicate if the queue is empty.
   * @returns {boolean} True if queue is empty, false otherwise.
   */
  isEmpty() {
    return !this.next;
  }
  /**
   * Add a new value to the queue, and optionally filter the
   * current queue content in response.
   * @param {*} value The value to add.
   * @param {(value: *) => boolean} [filter] An optional filter
   *  function to apply to existing queue content. If unspecified
   *  or falsy, all previously queued values are removed. Otherwise,
   *  the provided function is applied to all queue entries. The
   *  entry is retained if the filter function returns a truthy value,
   *  otherwise the entry is removed.
   */
  enqueue(value, filter) {
    const tail = { value };
    if (filter && this.next) {
      let curr = this;
      while (curr.next) {
        if (filter(curr.next.value)) {
          curr = curr.next;
        } else {
          curr.next = curr.next.next;
        }
      }
      curr.next = tail;
    } else {
      this.next = tail;
    }
  }
  /**
   * Remove and return the next queued event value.
   * @returns {*} The next event value in the queue.
   */
  dequeue() {
    const { next } = this;
    this.next = next?.next;
    return next?.value;
  }
};

// ../core/src/util/distinct.js
function distinct(a, b) {
  return a === b ? false : a instanceof Date && b instanceof Date ? +a !== +b : Array.isArray(a) && Array.isArray(b) ? distinctArray(a, b) : true;
}
function distinctArray(a, b) {
  if (a.length !== b.length)
    return true;
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i])
      return true;
  }
  return false;
}

// ../core/src/Param.js
function isParam(x2) {
  return x2 instanceof Param;
}
var Param = class _Param extends AsyncDispatch {
  /**
   * Create a new Param instance.
   * @param {*} value The initial value of the Param.
   */
  constructor(value) {
    super();
    this._value = value;
  }
  /**
   * Create a new Param instance with the given initial value.
   * @param {*} value The initial value of the Param.
   * @returns {Param} The new Param instance.
   */
  static value(value) {
    return new _Param(value);
  }
  /**
   * Create a new Param instance over an array of initial values,
   * which may contain nested Params.
   * @param {*} values The initial values of the Param.
   * @returns {Param} The new Param instance.
   */
  static array(values) {
    if (values.some((v) => isParam(v))) {
      const p = new _Param();
      const update2 = () => {
        p.update(values.map((v) => isParam(v) ? v.value : v));
      };
      update2();
      values.forEach((v) => isParam(v) ? v.addEventListener("value", update2) : 0);
      return p;
    }
    return new _Param(values);
  }
  /**
   * The current value of the Param.
   */
  get value() {
    return this._value;
  }
  /**
   * Update the Param value
   * @param {*} value The new value of the Param.
   * @param {object} [options] The update options.
   * @param {boolean} [options.force] A boolean flag indicating if the Param
   *  should emit a 'value' event even if the internal value is unchanged.
   * @returns {this} This Param instance.
   */
  update(value, { force } = {}) {
    const shouldEmit = distinct(this._value, value) || force;
    if (shouldEmit) {
      this.emit("value", value);
    } else {
      this.cancel("value");
    }
    return this;
  }
  /**
   * Upon value-typed updates, sets the current value to the input value
   * immediately prior to the event value being emitted to listeners.
   * @param {string} type The event type.
   * @param {*} value The input event value.
   * @returns {*} The input event value.
   */
  willEmit(type, value) {
    if (type === "value") {
      this._value = value;
    }
    return value;
  }
};

// ../core/src/Selection.js
function isSelection(x2) {
  return x2 instanceof Selection;
}
var Selection = class _Selection extends Param {
  /**
   * Create a new Selection instance with an
   * intersect (conjunction) resolution strategy.
   * @param {object} [options] The selection options.
   * @param {boolean} [options.cross=false] Boolean flag indicating
   *  cross-filtered resolution. If true, selection clauses will not
   *  be applied to the clients they are associated with.
   * @returns {Selection} The new Selection instance.
   */
  static intersect({ cross = false } = {}) {
    return new _Selection(new SelectionResolver({ cross }));
  }
  /**
   * Create a new Selection instance with a
   * union (disjunction) resolution strategy.
   * @param {object} [options] The selection options.
   * @param {boolean} [options.cross=false] Boolean flag indicating
   *  cross-filtered resolution. If true, selection clauses will not
   *  be applied to the clients they are associated with.
   * @returns {Selection} The new Selection instance.
   */
  static union({ cross = false } = {}) {
    return new _Selection(new SelectionResolver({ cross, union: true }));
  }
  /**
   * Create a new Selection instance with a singular resolution strategy
   * that keeps only the most recent selection clause.
   * @param {object} [options] The selection options.
   * @param {boolean} [options.cross=false] Boolean flag indicating
   *  cross-filtered resolution. If true, selection clauses will not
   *  be applied to the clients they are associated with.
   * @returns {Selection} The new Selection instance.
   */
  static single({ cross = false } = {}) {
    return new _Selection(new SelectionResolver({ cross, single: true }));
  }
  /**
   * Create a new Selection instance with a
   * cross-filtered intersect resolution strategy.
   * @returns {Selection} The new Selection instance.
   */
  static crossfilter() {
    return new _Selection(new SelectionResolver({ cross: true }));
  }
  /**
   * Create a new Selection instance.
   * @param {SelectionResolver} resolver The selection resolution
   *  strategy to apply.
   */
  constructor(resolver = new SelectionResolver()) {
    super([]);
    this._resolved = this._value;
    this._resolver = resolver;
  }
  /**
   * Create a cloned copy of this Selection instance.
   * @returns {Selection} A clone of this selection.
   */
  clone() {
    const s = new _Selection(this._resolver);
    s._value = s._resolved = this._value;
    return s;
  }
  /**
   * Create a clone of this Selection with clauses corresponding
   * to the provided source removed.
   * @param {*} source The clause source to remove.
   * @returns {Selection} A cloned and updated Selection.
   */
  remove(source) {
    const s = this.clone();
    s._value = s._resolved = s._resolver.resolve(this._resolved, { source });
    s._value.active = { source };
    return s;
  }
  /**
   * The current active (most recently updated) selection clause.
   */
  get active() {
    return this.clauses.active;
  }
  /**
   * The value corresponding to the current active selection clause.
   * This method ensures compatibility where a normal Param is expected.
   */
  get value() {
    return this.active?.value;
  }
  /**
   * The current array of selection clauses.
   */
  get clauses() {
    return super.value;
  }
  /**
   * Indicate if this selection has a single resolution strategy.
   */
  get single() {
    return this._resolver.single;
  }
  /**
   * Emit an activate event with the given selection clause.
   * @param {*} clause The clause repesenting the potential activation.
   */
  activate(clause) {
    this.emit("activate", clause);
  }
  /**
   * Update the selection with a new selection clause.
   * @param {*} clause The selection clause to add.
   * @returns {this} This Selection instance.
   */
  update(clause) {
    this._resolved = this._resolver.resolve(this._resolved, clause, true);
    this._resolved.active = clause;
    return super.update(this._resolved);
  }
  /**
   * Upon value-typed updates, sets the current clause list to the
   * input value and returns the active clause value.
   * @param {string} type The event type.
   * @param {*} value The input event value.
   * @returns {*} For value-typed events, returns the active clause
   *  values. Otherwise returns the input event value as-is.
   */
  willEmit(type, value) {
    if (type === "value") {
      this._value = value;
      return this.value;
    }
    return value;
  }
  /**
   * Upon value-typed updates, returns a dispatch queue filter function.
   * The return value depends on the selection resolution strategy.
   * @param {string} type The event type.
   * @param {*} value The new event value that will be enqueued.
   * @returns {(value: *) => boolean|null} For value-typed events,
   *  returns a dispatch queue filter function. Otherwise returns null.
   */
  emitQueueFilter(type, value) {
    return type === "value" ? this._resolver.queueFilter(value) : null;
  }
  /**
   * Indicates if a selection clause should not be applied to a given client.
   * The return value depends on the selection resolution strategy.
   * @param {*} client The selection clause.
   * @param {*} clause The client to test.
   * @returns True if the client should be skipped, false otherwise.
   */
  skip(client, clause) {
    return this._resolver.skip(client, clause);
  }
  /**
   * Return a selection query predicate for the given client.
   * @param {*} client The client whose data may be filtered.
   * @param {boolean} [noSkip=false] Disable skipping of active
   *  cross-filtered sources. If set true, the source of the active
   *  clause in a cross-filtered selection will not be skipped.
   * @returns {*} The query predicate for filtering client data,
   *  based on the current state of this selection.
   */
  predicate(client, noSkip = false) {
    const { clauses } = this;
    const active = noSkip ? null : clauses.active;
    return this._resolver.predicate(clauses, active, client);
  }
};
var SelectionResolver = class {
  /**
   * Create a new selection resolved instance.
   * @param {object} [options] The resolution strategy options.
   * @param {boolean} [options.union=false] Boolean flag to indicate a union strategy.
   *  If false, an intersection strategy is used.
   * @param {boolean} [options.cross=false] Boolean flag to indicate cross-filtering.
   * @param {boolean} [options.single=false] Boolean flag to indicate single clauses only.
   */
  constructor({ union, cross, single } = {}) {
    this.union = !!union;
    this.cross = !!cross;
    this.single = !!single;
  }
  /**
   * Resolve a list of selection clauses according to the resolution strategy.
   * @param {*[]} clauseList An array of selection clauses.
   * @param {*} clause A new selection clause to add.
   * @returns {*[]} An updated array of selection clauses.
   */
  resolve(clauseList, clause, reset = false) {
    const { source, predicate } = clause;
    const filtered = clauseList.filter((c) => source !== c.source);
    const clauses = this.single ? [] : filtered;
    if (this.single && reset)
      filtered.forEach((c) => c.source?.reset?.());
    if (predicate)
      clauses.push(clause);
    return clauses;
  }
  /**
   * Indicates if a selection clause should not be applied to a given client.
   * The return value depends on the resolution strategy.
   * @param {*} client The selection clause.
   * @param {*} clause The client to test.
   * @returns True if the client should be skipped, false otherwise.
   */
  skip(client, clause) {
    return this.cross && clause?.clients?.has(client);
  }
  /**
   * Return a selection query predicate for the given client.
   * @param {*[]} clauseList An array of selection clauses.
   * @param {*} active The current active selection clause.
   * @param {*} client The client whose data may be filtered.
   * @returns {*} The query predicate for filtering client data,
   *  based on the current state of this selection.
   */
  predicate(clauseList, active, client) {
    const { union } = this;
    if (this.skip(client, active))
      return void 0;
    const predicates = clauseList.filter((clause) => !this.skip(client, clause)).map((clause) => clause.predicate);
    return union && predicates.length > 1 ? or(predicates) : predicates;
  }
  /**
   * Returns a filter function for queued selection updates.
   * @param {*} value The new event value that will be enqueued.
   * @returns {(value: *) => boolean|null} A dispatch queue filter
   *  function, or null if all unemitted event values should be filtered.
   */
  queueFilter(value) {
    if (this.cross) {
      const source = value.active?.source;
      return (clauses) => clauses.active?.source !== source;
    }
    return null;
  }
};

// src/input.js
function input(InputClass, options) {
  const input2 = new InputClass(options);
  coordinator().connect(input2);
  return input2.element;
}

// src/Menu.js
var isObject2 = (v) => {
  return v && typeof v === "object" && !Array.isArray(v);
};
var menu = (options) => input(Menu, options);
var Menu = class extends MosaicClient {
  /**
   * Create a new Menu instance.
   * @param {object} options Options object
   */
  constructor({
    element,
    filterBy,
    from,
    column: column2,
    label = column2,
    format: format2 = (x2) => x2,
    // TODO
    options,
    value,
    as
  } = {}) {
    super(filterBy);
    this.from = from;
    this.column = column2;
    this.selection = as;
    this.format = format2;
    this.element = element ?? document.createElement("div");
    this.element.setAttribute("class", "input");
    this.element.value = this;
    const lab = document.createElement("label");
    lab.innerText = label || column2;
    this.element.appendChild(lab);
    this.select = document.createElement("select");
    if (options) {
      this.data = options.map((value2) => isObject2(value2) ? value2 : { value: value2 });
      this.update();
    }
    value = value ?? this.selection?.value ?? this.data?.[0]?.value;
    if (this.selection?.value === void 0)
      this.publish(value);
    this.element.appendChild(this.select);
    if (this.selection) {
      this.select.addEventListener("input", () => {
        this.publish(this.selectedValue() ?? null);
      });
      if (!isSelection(this.selection)) {
        this.selection.addEventListener("value", (value2) => {
          if (value2 !== this.select.value) {
            this.selectedValue(value2);
          }
        });
      }
    }
  }
  selectedValue(value) {
    if (arguments.length === 0) {
      const index = this.select.selectedIndex;
      return this.data[index].value;
    } else {
      const index = this.data?.findIndex((opt) => opt.value === value);
      if (index >= 0) {
        this.select.selectedIndex = index;
      } else {
        this.select.value = String(value);
      }
    }
  }
  reset() {
    this.select.selectedIndex = this.from ? 0 : -1;
  }
  publish(value) {
    const { selection, column: column2 } = this;
    if (isSelection(selection)) {
      selection.update({
        source: this,
        schema: { type: "point" },
        value,
        predicate: value !== "" && value !== void 0 ? eq(column2, literal(value)) : null
      });
    } else if (isParam(selection)) {
      selection.update(value);
    }
  }
  query(filter = []) {
    const { from, column: column2 } = this;
    if (!from)
      return null;
    return Query.from(from).select({ value: column2 }).distinct().where(filter).orderby(column2);
  }
  queryResult(data) {
    this.data = [{ value: "", label: "All" }, ...data];
    return this;
  }
  update() {
    const { data, format: format2, select } = this;
    select.replaceChildren();
    for (const { value, label } of data) {
      const opt = document.createElement("option");
      opt.setAttribute("value", value);
      opt.innerText = label ?? format2(value);
      this.select.appendChild(opt);
    }
    if (this.selection) {
      this.selectedValue(this.selection?.value ?? "");
    }
    return this;
  }
};

// src/Search.js
var FUNCTIONS = { contains, prefix, suffix, regexp: regexp_matches };
var _id = 0;
var search = (options) => input(Search, options);
var Search = class extends MosaicClient {
  /**
   * Create a new Search instance.
   * @param {object} options Options object
   */
  constructor({
    element,
    filterBy,
    from,
    column: column2,
    label,
    type = "contains",
    as
  } = {}) {
    super(filterBy);
    this.id = "search_" + ++_id;
    this.type = type;
    this.from = from;
    this.column = column2;
    this.selection = as;
    this.element = element ?? document.createElement("div");
    this.element.setAttribute("class", "input");
    this.element.value = this;
    if (label) {
      const lab = document.createElement("label");
      lab.setAttribute("for", this.id);
      lab.innerText = label;
      this.element.appendChild(lab);
    }
    this.searchbox = document.createElement("input");
    this.searchbox.setAttribute("id", this.id);
    this.searchbox.setAttribute("type", "text");
    this.searchbox.setAttribute("placeholder", "Query");
    this.element.appendChild(this.searchbox);
    if (this.selection) {
      this.searchbox.addEventListener("input", () => {
        this.publish(this.searchbox.value || null);
      });
      if (!isSelection(this.selection)) {
        this.selection.addEventListener("value", (value) => {
          if (value !== this.searchbox.value) {
            this.searchbox.value = value;
          }
        });
      }
    }
  }
  reset() {
    this.searchbox.value = "";
  }
  publish(value) {
    const { selection, column: column2, type } = this;
    if (isSelection(selection)) {
      selection.update({
        source: this,
        schema: { type },
        value,
        predicate: value ? FUNCTIONS[type](column2, literal(value)) : null
      });
    } else if (isParam(selection)) {
      selection.update(value);
    }
  }
  query(filter = []) {
    const { from, column: column2 } = this;
    if (!from)
      return null;
    return Query.from(from).select({ list: column2 }).distinct().where(filter);
  }
  queryResult(data) {
    this.data = data;
    return this;
  }
  update() {
    const list = document.createElement("datalist");
    const id = `${this.id}_list`;
    list.setAttribute("id", id);
    for (const d of this.data) {
      const opt = document.createElement("option");
      opt.setAttribute("value", d.list);
      list.append(opt);
    }
    if (this.datalist)
      this.datalist.remove();
    this.element.appendChild(this.datalist = list);
    this.searchbox.setAttribute("list", id);
    return this;
  }
};

// src/Slider.js
var _id2 = 0;
var slider = (options) => input(Slider, options);
var Slider = class extends MosaicClient {
  /**
   * Create a new Slider instance.
   * @param {object} options Options object
   */
  constructor({
    element,
    filterBy,
    as,
    min: min2,
    max: max2,
    step,
    from,
    column: column2,
    label = column2,
    value = as?.value,
    width
  } = {}) {
    super(filterBy);
    this.id = "slider_" + ++_id2;
    this.from = from;
    this.column = column2 || "value";
    this.selection = as;
    this.min = min2;
    this.max = max2;
    this.step = step;
    this.element = element || document.createElement("div");
    this.element.setAttribute("class", "input");
    this.element.value = this;
    if (label) {
      const lab = document.createElement("label");
      lab.setAttribute("for", this.id);
      lab.innerText = label;
      this.element.appendChild(lab);
    }
    this.slider = document.createElement("input");
    this.slider.setAttribute("id", this.id);
    this.slider.setAttribute("type", "range");
    if (width != null)
      this.slider.style.width = `${+width}px`;
    if (min2 != null)
      this.slider.setAttribute("min", min2);
    if (max2 != null)
      this.slider.setAttribute("max", max2);
    if (step != null)
      this.slider.setAttribute("step", step);
    if (value != null) {
      this.slider.setAttribute("value", value);
      if (this.selection?.value === void 0)
        this.publish(value);
    }
    this.element.appendChild(this.slider);
    if (this.selection) {
      this.slider.addEventListener("input", () => {
        this.publish(+this.slider.value);
      });
      if (!isSelection(this.selection)) {
        this.selection.addEventListener("value", (value2) => {
          if (value2 !== +this.slider.value) {
            this.slider.value = value2;
          }
        });
      }
    }
  }
  query(filter = []) {
    const { from, column: column2 } = this;
    if (!from || this.min != null && this.max != null)
      return null;
    return Query.select({ min: min(column2), max: max(column2) }).from(from).where(filter);
  }
  queryResult(data) {
    const { min: min2, max: max2 } = Array.from(data)[0];
    if (this.min == null)
      this.slider.setAttribute("min", min2);
    if (this.max == null)
      this.slider.setAttribute("max", max2);
    if (this.step == null)
      this.slider.setAttribute("step", String((max2 - min2) / 500));
    return this;
  }
  publish(value) {
    const { selection, column: column2 } = this;
    if (isSelection(selection)) {
      selection.update({
        source: this,
        schema: { type: "point" },
        value,
        predicate: eq(column2, literal(value))
      });
    } else if (isParam(this.selection)) {
      selection.update(value);
    }
  }
};

// ../../node_modules/isoformat/src/format.js
function format(date, fallback) {
  if (!(date instanceof Date))
    date = /* @__PURE__ */ new Date(+date);
  if (isNaN(date))
    return typeof fallback === "function" ? fallback(date) : fallback;
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  const milliseconds = date.getUTCMilliseconds();
  return `${formatYear(date.getUTCFullYear(), 4)}-${pad(date.getUTCMonth() + 1, 2)}-${pad(date.getUTCDate(), 2)}${hours || minutes || seconds || milliseconds ? `T${pad(hours, 2)}:${pad(minutes, 2)}${seconds || milliseconds ? `:${pad(seconds, 2)}${milliseconds ? `.${pad(milliseconds, 3)}` : ``}` : ``}Z` : ``}`;
}
function formatYear(year) {
  return year < 0 ? `-${pad(-year, 6)}` : year > 9999 ? `+${pad(year, 6)}` : pad(year, 4);
}
function pad(value, width) {
  return `${value}`.padStart(width, "0");
}

// src/util/format.js
var formatLocaleAuto = localize((locale) => {
  const formatNumber2 = formatLocaleNumber(locale);
  return (value) => value == null ? "" : typeof value === "number" ? formatNumber2(value) : value instanceof Date ? formatDate(value) : `${value}`;
});
var formatLocaleNumber = localize((locale) => {
  return (value) => value === 0 ? "0" : value.toLocaleString(locale);
});
var formatAuto = formatLocaleAuto();
var formatNumber = formatLocaleNumber();
function formatDate(date) {
  return format(date, "Invalid Date");
}
function localize(f) {
  let key = null;
  let value;
  return (locale = "en") => locale === key ? value : value = f(key = locale);
}

// src/Table.js
var _id3 = -1;
var table = (options) => input(Table2, options);
var Table2 = class extends MosaicClient {
  /**
   * Create a new Table instance.
   * @param {object} options Options object
   */
  constructor({
    element,
    filterBy,
    from,
    columns = ["*"],
    align = {},
    format: format2,
    width,
    maxWidth,
    height = 500,
    rowBatch = 100
  } = {}) {
    super(filterBy);
    this.id = `table-${++_id3}`;
    this.from = from;
    this.columns = columns;
    this.format = format2;
    this.align = align;
    this.widths = typeof width === "object" ? width : {};
    this.offset = 0;
    this.limit = +rowBatch;
    this.pending = false;
    this.sortHeader = null;
    this.sortColumn = null;
    this.sortDesc = false;
    this.element = element || document.createElement("div");
    this.element.setAttribute("id", this.id);
    this.element.value = this;
    if (typeof width === "number")
      this.element.style.width = `${width}px`;
    if (maxWidth)
      this.element.style.maxWidth = `${maxWidth}px`;
    this.element.style.maxHeight = `${height}px`;
    this.element.style.overflow = "auto";
    let prevScrollTop = -1;
    this.element.addEventListener("scroll", (evt) => {
      const { pending, loaded } = this;
      const { scrollHeight, scrollTop, clientHeight } = evt.target;
      const back = scrollTop < prevScrollTop;
      prevScrollTop = scrollTop;
      if (back || pending || loaded)
        return;
      if (scrollHeight - scrollTop < 2 * clientHeight) {
        this.pending = true;
        this.requestData(this.offset + this.limit);
      }
    });
    this.tbl = document.createElement("table");
    this.element.appendChild(this.tbl);
    this.head = document.createElement("thead");
    this.tbl.appendChild(this.head);
    this.body = document.createElement("tbody");
    this.tbl.appendChild(this.body);
    this.style = document.createElement("style");
    this.element.appendChild(this.style);
  }
  requestData(offset = 0) {
    this.offset = offset;
    const query = this.query(this.filterBy?.predicate(this));
    this.requestQuery(query);
    coordinator().prefetch(query.clone().offset(offset + this.limit));
  }
  fields() {
    return this.columns.map((name) => column(this.from, name));
  }
  fieldInfo(info) {
    this.schema = info;
    const thead = this.head;
    thead.innerHTML = "";
    const tr = document.createElement("tr");
    for (const { column: column2 } of info) {
      const th = document.createElement("th");
      th.addEventListener("click", (evt) => this.sort(evt, column2));
      th.appendChild(document.createElement("span"));
      th.appendChild(document.createTextNode(column2));
      tr.appendChild(th);
    }
    thead.appendChild(tr);
    this.formats = formatof(this.format, info);
    this.style.innerText = tableCSS(
      this.id,
      alignof(this.align, info),
      widthof(this.widths, info)
    );
    return this;
  }
  query(filter = []) {
    const { from, limit, offset, schema, sortColumn, sortDesc } = this;
    return Query.from(from).select(schema.map((s) => s.column)).where(filter).orderby(sortColumn ? sortDesc ? desc(sortColumn) : sortColumn : []).limit(limit).offset(offset);
  }
  queryResult(data) {
    if (!this.pending) {
      this.loaded = false;
      this.body.replaceChildren();
    }
    this.data = data;
    return this;
  }
  update() {
    const { body, formats, data, schema, limit } = this;
    const nf = schema.length;
    let count2 = 0;
    for (const row of data) {
      ++count2;
      const tr = document.createElement("tr");
      for (let i = 0; i < nf; ++i) {
        const value = row[schema[i].column];
        const td = document.createElement("td");
        td.innerText = value == null ? "" : formats[i](value);
        tr.appendChild(td);
      }
      body.appendChild(tr);
    }
    if (count2 < limit) {
      this.loaded = true;
    }
    this.pending = false;
    return this;
  }
  sort(event, column2) {
    if (column2 === this.sortColumn) {
      this.sortDesc = !this.sortDesc;
    } else {
      this.sortColumn = column2;
      this.sortDesc = false;
    }
    const th = event.currentTarget;
    const currentHeader = this.sortHeader;
    if (currentHeader === th && event.metaKey) {
      currentHeader.firstChild.textContent = "";
      this.sortHeader = null;
      this.sortColumn = null;
    } else {
      if (currentHeader)
        currentHeader.firstChild.textContent = "";
      this.sortHeader = th;
      th.firstChild.textContent = this.sortDesc ? "\u25BE" : "\u25B4";
    }
    this.requestData();
  }
};
function formatof(base = {}, schema, locale) {
  return schema.map(({ column: column2, type }) => {
    if (column2 in base) {
      return base[column2];
    } else {
      switch (type) {
        case "number":
          return formatLocaleNumber(locale);
        case "date":
          return formatDate;
        default:
          return formatLocaleAuto(locale);
      }
    }
  });
}
function alignof(base = {}, schema) {
  return schema.map(({ column: column2, type }) => {
    if (column2 in base) {
      return base[column2];
    } else if (type === "number") {
      return "right";
    } else {
      return "left";
    }
  });
}
function widthof(base = {}, schema) {
  return schema.map(({ column: column2 }) => base[column2]);
}
function tableCSS(id, aligns, widths) {
  const styles = [];
  aligns.forEach((a, i) => {
    const w = +widths[i];
    if (a !== "left" || w) {
      const align = a !== "left" ? `text-align:${a};` : "";
      const width = w ? `width:${w}px;max-width:${w}px;` : "";
      styles.push(`#${id} tr>:nth-child(${i + 1}) {${align}${width}}`);
    }
  });
  return styles.join(" ");
}
export {
  Menu,
  Search,
  Slider,
  Table2 as Table,
  menu,
  search,
  slider,
  table
};
