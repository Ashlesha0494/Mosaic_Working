// src/ref.js
var Ref = class {
  /**
   * Create a new Ref instance.
   * @param {string|Ref|null} table The table name.
   * @param {string|null} [column] The column name.
   */
  constructor(table, column2) {
    if (table)
      this.table = String(table);
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
    const { table, column: column2 } = this;
    if (column2) {
      const col = column2.startsWith("*") ? column2 : `"${column2}"`;
      return `${table ? `${quoteTableName(table)}.` : ""}${col}`;
    } else {
      return table ? quoteTableName(table) : "NULL";
    }
  }
};
function quoteTableName(table) {
  const pieces = table.split(".");
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
function column(table, column2 = null) {
  if (arguments.length === 1) {
    column2 = table;
    table = null;
  }
  return new Ref(table, column2);
}
function all(table) {
  return new Ref(table, "*");
}

// src/to-sql.js
function toSQL(value) {
  return typeof value === "string" ? `"${value}"` : literalToSQL(value);
}
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

// src/expression.js
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

// src/desc.js
function desc(expr) {
  const e = asColumn(expr);
  return sql`${e} DESC NULLS LAST`.annotate({ label: e?.label, desc: true });
}

// src/literal.js
var literal = (value) => ({
  value,
  toString: () => literalToSQL(value)
});

// src/operators.js
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
var isNotBetween = (a, range, exclusive) => rangeOp("NOT BETWEEN", a, range, exclusive);

// src/repeat.js
function repeat(length2, str) {
  return Array.from({ length: length2 }, () => str);
}

// src/functions.js
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
var isNaN = functionCall("ISNAN");
var isFinite = functionCall("ISFINITE");
var isInfinite = functionCall("ISINF");

// src/windows.js
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

// src/aggregates.js
function agg(strings, ...exprs) {
  return sql(strings, ...exprs).annotate({ aggregate: true });
}
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

// src/cast.js
function cast(expr, type) {
  const arg = asColumn(expr);
  const e = sql`CAST(${arg} AS ${type})`;
  Object.defineProperty(e, "label", {
    enumerable: true,
    get() {
      return expr.label;
    }
  });
  Object.defineProperty(e, "aggregate", {
    enumerable: true,
    get() {
      return expr.aggregate || false;
    }
  });
  return e;
}
var castDouble = (expr) => cast(expr, "DOUBLE");
var castInteger = (expr) => cast(expr, "INTEGER");

// src/datetime.js
var epoch_ms = (expr) => {
  return sql`epoch_ms(${asColumn(expr)})`;
};
var dateMonth = (expr) => {
  const d = asColumn(expr);
  return sql`MAKE_DATE(2012, MONTH(${d}), 1)`.annotate({ label: "month" });
};
var dateMonthDay = (expr) => {
  const d = asColumn(expr);
  return sql`MAKE_DATE(2012, MONTH(${d}), DAY(${d}))`.annotate({ label: "date" });
};
var dateDay = (expr) => {
  const d = asColumn(expr);
  return sql`MAKE_DATE(2012, 1, DAY(${d}))`.annotate({ label: "date" });
};

// src/spatial.js
var geojson = functionCall("ST_AsGeoJSON");
var x = functionCall("ST_X");
var y = functionCall("ST_Y");
var centroid = functionCall("ST_CENTROID");
var centroidX = (geom) => x(centroid(geom));
var centroidY = (geom) => y(centroid(geom));

// src/Query.js
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
      distinct,
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
    sql2.push(`SELECT${distinct ? " DISTINCT" : ""} ${sels.join(", ")}`);
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

// src/scales.js
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

// src/load/create.js
function create(name, query, {
  replace = false,
  temp = true,
  view = false
} = {}) {
  return "CREATE" + (replace ? " OR REPLACE " : " ") + (temp ? "TEMP " : "") + (view ? "VIEW" : "TABLE") + (replace ? " " : " IF NOT EXISTS ") + name + " AS " + query;
}

// src/load/extension.js
function loadExtension(name) {
  return `INSTALL ${name}; LOAD ${name}`;
}

// src/load/sql-from.js
function sqlFrom(data, {
  columns = Object.keys(data?.[0] || {})
} = {}) {
  let keys = [];
  if (Array.isArray(columns)) {
    keys = columns;
    columns = keys.reduce((m, k) => (m[k] = k, m), {});
  } else if (columns) {
    keys = Object.keys(columns);
  }
  if (!keys.length) {
    throw new Error("Can not create table from empty column set.");
  }
  const subq = [];
  for (const datum of data) {
    const sel = keys.map((k) => `${literalToSQL(datum[k])} AS "${columns[k]}"`);
    subq.push(`(SELECT ${sel.join(", ")})`);
  }
  return subq.join(" UNION ALL ");
}

// src/load/load.js
function load(method, tableName, fileName, options = {}, defaults = {}) {
  const { select = ["*"], where, view, temp, replace, ...file } = options;
  const params = parameters({ ...defaults, ...file });
  const read = `${method}('${fileName}'${params ? ", " + params : ""})`;
  const filter = where ? ` WHERE ${where}` : "";
  const query = `SELECT ${select.join(", ")} FROM ${read}${filter}`;
  return create(tableName, query, { view, temp, replace });
}
function loadCSV(tableName, fileName, options) {
  return load("read_csv", tableName, fileName, options, { auto_detect: true, sample_size: -1 });
}
function loadJSON(tableName, fileName, options) {
  return load("read_json", tableName, fileName, options, { auto_detect: true, json_format: "auto" });
}
function loadParquet(tableName, fileName, options) {
  return load("read_parquet", tableName, fileName, options);
}
function loadSpatial(tableName, fileName, options = {}) {
  const { options: opt, ...rest } = options;
  if (opt) {
    const open = Array.isArray(opt) ? opt.join(", ") : typeof opt === "string" ? opt : Object.entries(opt).map(([key, value]) => `${key}=${value}`).join(", ");
    Object.assign(rest, { open_options: open.toUpperCase() });
  }
  return load("st_read", tableName, fileName, rest);
}
function loadObjects(tableName, data, options = {}) {
  const { select = ["*"], ...opt } = options;
  const values = sqlFrom(data);
  const query = select.length === 1 && select[0] === "*" ? values : `SELECT ${select} FROM ${values}`;
  return create(tableName, query, opt);
}
function parameters(options) {
  return Object.entries(options).map(([key, value]) => `${key}=${toDuckDBValue(value)}`).join(", ");
}
function toDuckDBValue(value) {
  switch (typeof value) {
    case "boolean":
      return String(value);
    case "string":
      return `'${value}'`;
    case "undefined":
    case "object":
      if (value == null) {
        return "NULL";
      } else if (Array.isArray(value)) {
        return "[" + value.map((v) => toDuckDBValue(v)).join(", ") + "]";
      } else {
        return "{" + Object.entries(value).map(([k, v]) => `'${k}': ${toDuckDBValue(v)}`).join(", ") + "}";
      }
    default:
      return value;
  }
}
export {
  Query,
  Ref,
  agg,
  all,
  and,
  argmax,
  argmin,
  arrayAgg,
  asColumn,
  asRelation,
  avg,
  cast,
  castDouble,
  castInteger,
  centroid,
  centroidX,
  centroidY,
  column,
  contains,
  corr,
  count,
  covarPop,
  create,
  cume_dist,
  dateDay,
  dateMonth,
  dateMonthDay,
  dense_rank,
  desc,
  entropy,
  epoch_ms,
  eq,
  first,
  first_value,
  geojson,
  gt,
  gte,
  isBetween,
  isDescribeQuery,
  isDistinct,
  isFinite,
  isInfinite,
  isNaN,
  isNotBetween,
  isNotDistinct,
  isNotNull,
  isNull,
  isParamLike,
  isQuery,
  isSQLExpression,
  kurtosis,
  lag,
  last,
  last_value,
  lead,
  length,
  literal,
  literalToSQL,
  loadCSV,
  loadExtension,
  loadJSON,
  loadObjects,
  loadParquet,
  loadSpatial,
  lower,
  lt,
  lte,
  mad,
  max,
  mean,
  median,
  min,
  mode,
  neq,
  not,
  nth_value,
  ntile,
  or,
  percent_rank,
  prefix,
  product,
  quantile,
  rank,
  regexp_matches,
  regrAvgX,
  regrAvgY,
  regrCount,
  regrIntercept,
  regrR2,
  regrSXX,
  regrSXY,
  regrSYY,
  regrSlope,
  relation,
  row_number,
  scaleTransform,
  skewness,
  sql,
  stddev,
  stddevPop,
  stringAgg,
  suffix,
  sum,
  toSQL,
  upper,
  varPop,
  variance,
  x,
  y
};
