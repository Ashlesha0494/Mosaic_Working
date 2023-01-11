import { Ref, expr } from '../../sql/index.js';

class BinTransform extends Ref {
  constructor(column, options) {
    super(undefined, column);
    this.options = options;
  }

  transform(stats) {
    const { column, options } = this;
    const { min, max } = stats.find(s => s.column === column);
    const b = bins(min, max, options);
    const delta = `(${column} - ${b.min})`;
    const alpha = `${(b.max - b.min) / b.steps}::DOUBLE`;
    const off = options.offset ? '1 + ' : '';
    const e = expr(
      `${min} + ${alpha} * (${off}FLOOR(${delta} / ${alpha}))`,
      [column]
    );
    return e;
  }
}

export default function(column, options) {
  return new BinTransform(column, options);
}

export function bins(min, max, options) {
  let { steps = 25, minstep = 0, nice = true } = options;

  if (nice !== false) {
    // use span to determine step size
    const span = max - min;
    const maxb = steps;
    const logb = Math.LN10;
    const level = Math.ceil(Math.log(maxb) / logb);
    let step = Math.max(
      minstep,
      Math.pow(10, Math.round(Math.log(span) / logb) - level)
    );

    // increase step size if too many bins
    while (Math.ceil(span / step) > maxb) { step *= 10; }

    // decrease step size if allowed
    const div = [5, 2];
    let v;
    for (let i = 0, n = div.length; i < n; ++i) {
      v = step / div[i];
      if (v >= minstep && span / v <= maxb) step = v;
    }

    v = Math.log(step);
    const precision = v >= 0 ? 0 : ~~(-v / logb) + 1;
    const eps = Math.pow(10, -precision - 1);
    v = Math.floor(min / step + eps) * step;
    min = min < v ? v - step : v;
    max = Math.ceil(max / step) * step;
    steps = Math.round((max - min) / step);
  }

  return { min, max, steps };
}
