var g = Object.defineProperty,
  v = (n, a) => {
    for (var r in a) g(n, r, { get: a[r], enumerable: !0 });
  };
function l(n) {
  for (var a = [], r = 1; r < arguments.length; r++) a[r - 1] = arguments[r];
  var e = Array.from(typeof n == 'string' ? [n] : n);
  e[e.length - 1] = e[e.length - 1].replace(/\r?\n([\t ]*)$/, '');
  var o = e.reduce(function (t, u) {
    var d = u.match(/\n([\t ]+|(?!\s).)/g);
    return d
      ? t.concat(
          d.map(function (c) {
            var s, p;
            return (p =
              (s = c.match(/[\t ]/g)) === null || s === void 0
                ? void 0
                : s.length) !== null && p !== void 0
              ? p
              : 0;
          })
        )
      : t;
  }, []);
  if (o.length) {
    var i = new RegExp(
      `
[	 ]{` +
        Math.min.apply(Math, o) +
        '}',
      'g'
    );
    e = e.map(function (t) {
      return t.replace(
        i,
        `
`
      );
    });
  }
  e[0] = e[0].replace(/^\r?\n/, '');
  var f = e[0];
  return (
    a.forEach(function (t, u) {
      var d = f.match(/(?:^|\n)( *)$/),
        c = d ? d[1] : '',
        s = t;
      (typeof t == 'string' &&
        t.includes(`
`) &&
        (s = String(t)
          .split(
            `
`
          )
          .map(function (p, h) {
            return h === 0 ? p : '' + c + p;
          }).join(`
`)),
        (f += s + e[u + 1]));
    }),
    f
  );
}
const { simulatePageLoad: _, simulateDOMContentLoaded: m } =
    __STORYBOOK_MODULE_PREVIEW_API__,
  { global: y } = __STORYBOOK_MODULE_GLOBAL__;
var O = {};
v(O, { parameters: () => b, render: () => M, renderToCanvas: () => T });
var { Node: L } = y,
  M = (n, a) => {
    let { id: r, component: e } = a;
    if (typeof e == 'string') {
      let o = e;
      return (
        Object.keys(n).forEach(i => {
          o = o.replace(`{{${i}}}`, n[i]);
        }),
        o
      );
    }
    if (e instanceof HTMLElement) {
      let o = e.cloneNode(!0);
      return (
        Object.keys(n).forEach(i => {
          o.setAttribute(
            i,
            typeof n[i] == 'string' ? n[i] : JSON.stringify(n[i])
          );
        }),
        o
      );
    }
    if (typeof e == 'function') return e(n, a);
    throw (
      console.warn(l`
    Storybook's HTML renderer only supports rendering DOM elements and strings.
    Received: ${e}
  `),
      new Error(`Unable to render story ${r}`)
    );
  };
function T(
  { storyFn: n, kind: a, name: r, showMain: e, showError: o, forceRemount: i },
  f
) {
  let t = n();
  if ((e(), typeof t == 'string')) ((f.innerHTML = t), _(f));
  else if (t instanceof L) {
    if (f.firstChild === t && i === !1) return;
    ((f.innerHTML = ''), f.appendChild(t), m());
  } else
    o({
      title: `Expecting an HTML snippet or DOM node from the story: "${r}" of "${a}".`,
      description: l`
        Did you forget to return the HTML snippet from the story?
        Use "() => <your snippet or node>" or when defining the story.
      `,
    });
}
var b = { renderer: 'html' };
export { b as parameters, M as render, T as renderToCanvas };
