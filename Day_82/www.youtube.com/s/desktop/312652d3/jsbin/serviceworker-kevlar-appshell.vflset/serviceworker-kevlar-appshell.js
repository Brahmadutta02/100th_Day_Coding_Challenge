/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';
var q, aa = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
    if (a == Array.prototype || a == Object.prototype) return a;
    a[b] = c.value;
    return a
};

function ba(a) {
    a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
    for (var b = 0; b < a.length; ++b) {
        var c = a[b];
        if (c && c.Math == Math) return c
    }
    throw Error("Cannot find global object");
}
var ca = ba(this);

function da(a, b) {
    if (b) a: {
        var c = ca;a = a.split(".");
        for (var d = 0; d < a.length - 1; d++) {
            var e = a[d];
            if (!(e in c)) break a;
            c = c[e]
        }
        a = a[a.length - 1];d = c[a];b = b(d);b != d && null != b && aa(c, a, {
            configurable: !0,
            writable: !0,
            value: b
        })
    }
}

function ea(a) {
    function b(d) {
        return a.next(d)
    }

    function c(d) {
        return a.throw(d)
    }
    return new Promise(function(d, e) {
        function f(g) {
            g.done ? d(g.value) : Promise.resolve(g.value).then(b, c).then(f, e)
        }
        f(a.next())
    })
}

function r(a) {
    return ea(a())
}

function fa(a, b) {
    a instanceof String && (a += "");
    var c = 0,
        d = !1,
        e = {
            next: function() {
                if (!d && c < a.length) {
                    var f = c++;
                    return {
                        value: b(f, a[f]),
                        done: !1
                    }
                }
                d = !0;
                return {
                    done: !0,
                    value: void 0
                }
            }
        };
    e[Symbol.iterator] = function() {
        return e
    };
    return e
}
da("Array.prototype.values", function(a) {
    return a ? a : function() {
        return fa(this, function(b, c) {
            return c
        })
    }
});
da("Object.entries", function(a) {
    return a ? a : function(b) {
        var c = [],
            d;
        for (d in b) Object.prototype.hasOwnProperty.call(b, d) && c.push([d, b[d]]);
        return c
    }
});
da("Array.prototype.includes", function(a) {
    return a ? a : function(b, c) {
        var d = this;
        d instanceof String && (d = String(d));
        var e = d.length;
        c = c || 0;
        for (0 > c && (c = Math.max(c + e, 0)); c < e; c++) {
            var f = d[c];
            if (f === b || Object.is(f, b)) return !0
        }
        return !1
    }
});
da("Object.values", function(a) {
    return a ? a : function(b) {
        var c = [],
            d;
        for (d in b) Object.prototype.hasOwnProperty.call(b, d) && c.push(b[d]);
        return c
    }
});
da("String.prototype.matchAll", function(a) {
    return a ? a : function(b) {
        if (b instanceof RegExp && !b.global) throw new TypeError("RegExp passed into String.prototype.matchAll() must have global tag.");
        var c = new RegExp(b, b instanceof RegExp ? void 0 : "g"),
            d = this,
            e = !1,
            f = {
                next: function() {
                    if (e) return {
                        value: void 0,
                        done: !0
                    };
                    var g = c.exec(d);
                    if (!g) return e = !0, {
                        value: void 0,
                        done: !0
                    };
                    "" === g[0] && (c.lastIndex += 1);
                    return {
                        value: g,
                        done: !1
                    }
                }
            };
        f[Symbol.iterator] = function() {
            return f
        };
        return f
    }
});
da("Promise.prototype.finally", function(a) {
    return a ? a : function(b) {
        return this.then(function(c) {
            return Promise.resolve(b()).then(function() {
                return c
            })
        }, function(c) {
            return Promise.resolve(b()).then(function() {
                throw c;
            })
        })
    }
});
var u = this || self;

function v(a, b, c) {
    a = a.split(".");
    c = c || u;
    a[0] in c || "undefined" == typeof c.execScript || c.execScript("var " + a[0]);
    for (var d; a.length && (d = a.shift());) a.length || void 0 === b ? c[d] && c[d] !== Object.prototype[d] ? c = c[d] : c = c[d] = {} : c[d] = b
}

function y(a, b) {
    a = a.split(".");
    b = b || u;
    for (var c = 0; c < a.length; c++)
        if (b = b[a[c]], null == b) return null;
    return b
}

function ha(a) {
    var b = typeof a;
    b = "object" != b ? b : a ? Array.isArray(a) ? "array" : b : "null";
    return "array" == b || "object" == b && "number" == typeof a.length
}

function ia(a) {
    var b = typeof a;
    return "object" == b && null != a || "function" == b
}

function ka(a, b, c) {
    return a.call.apply(a.bind, arguments)
}

function la(a, b, c) {
    if (!a) throw Error();
    if (2 < arguments.length) {
        var d = Array.prototype.slice.call(arguments, 2);
        return function() {
            var e = Array.prototype.slice.call(arguments);
            Array.prototype.unshift.apply(e, d);
            return a.apply(b, e)
        }
    }
    return function() {
        return a.apply(b, arguments)
    }
}

function ma(a, b, c) {
    Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? ma = ka : ma = la;
    return ma.apply(null, arguments)
}

function na(a, b) {
    function c() {}
    c.prototype = b.prototype;
    a.eb = b.prototype;
    a.prototype = new c;
    a.prototype.constructor = a;
    a.Ob = function(d, e, f) {
        for (var g = Array(arguments.length - 2), h = 2; h < arguments.length; h++) g[h - 2] = arguments[h];
        return b.prototype[e].apply(d, g)
    }
};

function oa(a, b) {
    if (Error.captureStackTrace) Error.captureStackTrace(this, oa);
    else {
        const c = Error().stack;
        c && (this.stack = c)
    }
    a && (this.message = String(a));
    void 0 !== b && (this.cause = b)
}
na(oa, Error);
oa.prototype.name = "CustomError";

function pa() {};

function qa(a, b) {
    Array.prototype.forEach.call(a, b, void 0)
}

function ra(a, b) {
    return Array.prototype.map.call(a, b, void 0)
}

function sa(a, b) {
    b = Array.prototype.indexOf.call(a, b, void 0);
    0 <= b && Array.prototype.splice.call(a, b, 1)
}

function ta(a, b) {
    for (let c = 1; c < arguments.length; c++) {
        const d = arguments[c];
        if (ha(d)) {
            const e = a.length || 0,
                f = d.length || 0;
            a.length = e + f;
            for (let g = 0; g < f; g++) a[e + g] = d[g]
        } else a.push(d)
    }
};

function ua(a) {
    var b = va;
    for (const c in b)
        if (a.call(void 0, b[c], c, b)) return c
}

function wa(a) {
    for (const b in a) return !1;
    return !0
}

function xa(a) {
    if (!a || "object" !== typeof a) return a;
    if ("function" === typeof a.clone) return a.clone();
    if ("undefined" !== typeof Map && a instanceof Map) return new Map(a);
    if ("undefined" !== typeof Set && a instanceof Set) return new Set(a);
    if (a instanceof Date) return new Date(a.getTime());
    const b = Array.isArray(a) ? [] : "function" !== typeof ArrayBuffer || "function" !== typeof ArrayBuffer.isView || !ArrayBuffer.isView(a) || a instanceof DataView ? {} : new a.constructor(a.length);
    for (const c in a) b[c] = xa(a[c]);
    return b
}
const ya = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");

function za(a, b) {
    let c, d;
    for (let e = 1; e < arguments.length; e++) {
        d = arguments[e];
        for (c in d) a[c] = d[c];
        for (let f = 0; f < ya.length; f++) c = ya[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
};

function Aa() {}

function Ba(a) {
    return new Aa(Ca, a)
}
var Ca = {};
Ba("");
var Da = String.prototype.trim ? function(a) {
    return a.trim()
} : function(a) {
    return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]
};

function Ea() {
    var a = u.navigator;
    return a && (a = a.userAgent) ? a : ""
}

function z(a) {
    return -1 != Ea().indexOf(a)
};

function Fa() {
    return (z("Chrome") || z("CriOS")) && !z("Edge") || z("Silk")
};
var Ga = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");

function Ha(a) {
    return a ? decodeURI(a) : a
}

function Ia(a, b, c) {
    if (Array.isArray(b))
        for (var d = 0; d < b.length; d++) Ia(a, String(b[d]), c);
    else null != b && c.push(a + ("" === b ? "" : "=" + encodeURIComponent(String(b))))
}

function Ja(a) {
    var b = [],
        c;
    for (c in a) Ia(c, a[c], b);
    return b.join("&")
};

function Ka() {
    throw Error("Invalid UTF8");
}

function La(a, b) {
    b = String.fromCharCode.apply(null, b);
    return null == a ? b : a + b
}
let Ma = void 0,
    Na;
const Oa = "undefined" !== typeof TextDecoder;

function Pa(a) {
    u.setTimeout(() => {
        throw a;
    }, 0)
};
!z("Android") || Fa();
Fa();
var Qa = z("Safari") && !(Fa() || z("Coast") || z("Opera") || z("Edge") || z("Edg/") || z("OPR") || z("Firefox") || z("FxiOS") || z("Silk") || z("Android")) && !(z("iPhone") && !z("iPod") && !z("iPad") || z("iPad") || z("iPod"));
var Ra = {},
    Sa = null;

function Ta(a, b) {
    void 0 === b && (b = 0);
    Ua();
    b = Ra[b];
    const c = Array(Math.floor(a.length / 3)),
        d = b[64] || "";
    let e = 0,
        f = 0;
    for (; e < a.length - 2; e += 3) {
        var g = a[e],
            h = a[e + 1],
            k = a[e + 2],
            l = b[g >> 2];
        g = b[(g & 3) << 4 | h >> 4];
        h = b[(h & 15) << 2 | k >> 6];
        k = b[k & 63];
        c[f++] = "" + l + g + h + k
    }
    l = 0;
    k = d;
    switch (a.length - e) {
        case 2:
            l = a[e + 1], k = b[(l & 15) << 2] || d;
        case 1:
            a = a[e], c[f] = "" + b[a >> 2] + b[(a & 3) << 4 | l >> 4] + k + d
    }
    return c.join("")
}

function Va(a) {
    var b = a.length,
        c = 3 * b / 4;
    c % 3 ? c = Math.floor(c) : -1 != "=.".indexOf(a[b - 1]) && (c = -1 != "=.".indexOf(a[b - 2]) ? c - 2 : c - 1);
    var d = new Uint8Array(c),
        e = 0;
    Wa(a, function(f) {
        d[e++] = f
    });
    return e !== c ? d.subarray(0, e) : d
}

function Wa(a, b) {
    function c(k) {
        for (; d < a.length;) {
            var l = a.charAt(d++),
                m = Sa[l];
            if (null != m) return m;
            if (!/^[\s\xa0]*$/.test(l)) throw Error("Unknown base64 encoding at char: " + l);
        }
        return k
    }
    Ua();
    for (var d = 0;;) {
        var e = c(-1),
            f = c(0),
            g = c(64),
            h = c(64);
        if (64 === h && -1 === e) break;
        b(e << 2 | f >> 4);
        64 != g && (b(f << 4 & 240 | g >> 2), 64 != h && b(g << 6 & 192 | h))
    }
}

function Ua() {
    if (!Sa) {
        Sa = {};
        for (var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""), b = ["+/=", "+/", "-_=", "-_.", "-_"], c = 0; 5 > c; c++) {
            var d = a.concat(b[c].split(""));
            Ra[c] = d;
            for (var e = 0; e < d.length; e++) {
                var f = d[e];
                void 0 === Sa[f] && (Sa[f] = e)
            }
        }
    }
};
var Xa = "undefined" !== typeof Uint8Array;

function Ya(a) {
    return Xa && null != a && a instanceof Uint8Array
}
let $a;
var ab = {};
let bb;

function cb(a) {
    if (a !== ab) throw Error("illegal external caller");
}

function db() {
    return bb || (bb = new eb(null, ab))
}

function fb(a) {
    cb(ab);
    var b = a.W;
    b = null == b || Ya(b) ? b : "string" === typeof b ? Va(b) : null;
    return null == b ? b : a.W = b
}
var eb = class {
    constructor(a, b) {
        cb(b);
        this.W = a;
        if (null != a && 0 === a.length) throw Error("ByteString should be constructed with non-empty values");
    }
    ya() {
        return null == this.W
    }
    sizeBytes() {
        const a = fb(this);
        return a ? a.length : 0
    }
};
const gb = "function" === typeof Symbol && "symbol" === typeof Symbol() ? Symbol() : void 0;

function hb(a, b) {
    if (gb) return a[gb] |= b;
    if (void 0 !== a.G) return a.G |= b;
    Object.defineProperties(a, {
        G: {
            value: b,
            configurable: !0,
            writable: !0,
            enumerable: !1
        }
    });
    return b
}

function ib(a, b) {
    gb ? a[gb] && (a[gb] &= ~b) : void 0 !== a.G && (a.G &= ~b)
}

function A(a) {
    let b;
    gb ? b = a[gb] : b = a.G;
    return null == b ? 0 : b
}

function jb(a, b) {
    gb ? a[gb] = b : void 0 !== a.G ? a.G = b : Object.defineProperties(a, {
        G: {
            value: b,
            configurable: !0,
            writable: !0,
            enumerable: !1
        }
    })
}

function kb(a) {
    hb(a, 1);
    return a
}

function lb(a) {
    return !!(A(a) & 2)
}

function mb(a, b) {
    jb(b, (a | 0) & -51)
}

function nb(a, b) {
    jb(b, (a | 18) & -41)
};
var ob = {};

function pb(a) {
    return null !== a && "object" === typeof a && !Array.isArray(a) && a.constructor === Object
}
let qb;
var rb;
const sb = [];
jb(sb, 23);
rb = Object.freeze(sb);

function tb(a) {
    if (lb(a.s)) throw Error("Cannot mutate an immutable Message");
}

function ub(a) {
    var b = a.length;
    (b = b ? a[b - 1] : void 0) && pb(b) ? b.g = 1 : a.push({
        g: 1
    })
};

function vb(a) {
    return a.displayName || a.name || "unknown type name"
}

function wb(a, b) {
    if (!(a instanceof b)) throw Error(`Expected instanceof ${vb(b)} but got ${a&&vb(a.constructor)}`);
    return a
};

function xb(a) {
    const b = a.l + a.N;
    return a.C || (a.C = a.s[b] = {})
}

function B(a, b, c) {
    return -1 === b ? null : b >= a.l ? a.C ? a.C[b] : void 0 : c && a.C && (c = a.C[b], null != c) ? c : a.s[b + a.N]
}

function C(a, b, c, d) {
    tb(a);
    return yb(a, b, c, d)
}

function yb(a, b, c, d) {
    a.m && (a.m = void 0);
    if (b >= a.l || d) return xb(a)[b] = c, a;
    a.s[b + a.N] = c;
    (c = a.C) && b in c && delete c[b];
    return a
}

function zb(a, b, c, d, e) {
    let f = B(a, b, d);
    Array.isArray(f) || (f = rb);
    const g = A(f);
    g & 1 || kb(f);
    if (e) g & 2 || hb(f, 2), c & 1 || Object.freeze(f);
    else {
        e = !(c & 2);
        const h = g & 2;
        c & 1 || !h ? e && g & 16 && !h && ib(f, 16) : (f = kb(Array.prototype.slice.call(f)), yb(a, b, f, d))
    }
    return f
}

function Ab(a, b, c, d) {
    tb(a);
    (c = Bb(a, c)) && c !== b && null != d && yb(a, c, void 0, !1);
    return yb(a, b, d)
}

function Bb(a, b) {
    let c = 0;
    for (let d = 0; d < b.length; d++) {
        const e = b[d];
        null != B(a, e) && (0 !== c && yb(a, c, void 0, !1), c = e)
    }
    return c
}

function Cb(a, b, c) {
    var d = B(a, c, !1); {
        let f = !1;
        var e = null == d || "object" !== typeof d || (f = Array.isArray(d)) || d.ka !== ob ? f ? new b(d) : void 0 : d
    }
    e !== d && null != e && (yb(a, c, e, !1), hb(e.s, A(a.s) & 18));
    b = e;
    if (null == b) return b;
    lb(a.s) || (d = Db(b), d !== b && (b = d, yb(a, c, b, !1)));
    return b
}

function Eb(a, b, c, d, e) {
    a.i || (a.i = {});
    var f = a.i[c],
        g = zb(a, c, 3, void 0, e);
    if (!f) {
        var h = g;
        f = [];
        var k = !!(A(a.s) & 16);
        g = lb(h);
        const t = h;
        !e && g && (h = Array.prototype.slice.call(h));
        var l = g;
        let n = 0;
        for (; n < h.length; n++) {
            var m = h[n];
            m = Array.isArray(m) ? new b(m) : void 0;
            if (void 0 === m) continue;
            var p = m.s;
            const x = A(p);
            let w = x;
            g && (w |= 2);
            k && (w |= 16);
            w != x && jb(p, w);
            p = w;
            l = l || !!(2 & p);
            f.push(m)
        }
        a.i[c] = f;
        k = A(h);
        b = k | 33;
        b = l ? b & -9 : b | 8;
        k != b && (l = h, Object.isFrozen(l) && (l = Array.prototype.slice.call(l)), jb(l, b), h = l);
        t !== h && yb(a, c, h);
        (e ||
            d && g) && hb(f, 2);
        d && Object.freeze(f);
        return f
    }
    e || (e = Object.isFrozen(f), d && !e ? Object.freeze(f) : !d && e && (f = Array.prototype.slice.call(f), a.i[c] = f));
    return f
}

function Fb(a, b, c) {
    var d = lb(a.s);
    b = Eb(a, b, c, d, d);
    a = zb(a, c, 3, void 0, d);
    if (!(d || A(a) & 8)) {
        for (d = 0; d < b.length; d++) {
            c = b[d];
            const e = Db(c);
            c !== e && (b[d] = e, a[d] = e.s)
        }
        hb(a, 8)
    }
    return b
}

function D(a, b, c, d) {
    tb(a);
    null != d ? wb(d, b) : d = void 0;
    return yb(a, c, d)
}

function Gb(a, b, c, d, e) {
    tb(a);
    null != e ? wb(e, b) : e = void 0;
    Ab(a, c, d, e)
}

function Hb(a, b, c, d) {
    tb(a);
    const e = Eb(a, c, b, !1, !1);
    c = null != d ? wb(d, c) : new c;
    a = zb(a, b, 2, void 0, !1);
    e.push(c);
    a.push(c.s);
    c.I() && ib(a, 8);
    return c
}

function Ib(a, b) {
    a = B(a, b);
    return null == a ? "" : a
};
let Jb;

function Kb(a) {
    switch (typeof a) {
        case "number":
            return isFinite(a) ? a : String(a);
        case "object":
            if (a)
                if (Array.isArray(a)) {
                    if (0 !== (A(a) & 128)) return a = Array.prototype.slice.call(a), ub(a), a
                } else {
                    if (Ya(a)) return Ta(a);
                    if (a instanceof eb) {
                        const b = a.W;
                        return null == b ? "" : "string" === typeof b ? b : a.W = Ta(b)
                    }
                }
    }
    return a
};

function Lb(a, b, c, d) {
    if (null != a) {
        if (Array.isArray(a)) a = Mb(a, b, c, void 0 !== d);
        else if (pb(a)) {
            const e = {};
            for (let f in a) e[f] = Lb(a[f], b, c, d);
            a = e
        } else a = b(a, d);
        return a
    }
}

function Mb(a, b, c, d) {
    const e = A(a);
    d = d ? !!(e & 16) : void 0;
    a = Array.prototype.slice.call(a);
    for (let f = 0; f < a.length; f++) a[f] = Lb(a[f], b, c, d);
    c(e, a);
    return a
}

function Nb(a) {
    return a.ka === ob ? a.toJSON() : Kb(a)
}

function Ob(a, b) {
    a & 128 && ub(b)
};

function Pb(a, b, c = nb) {
    if (null != a) {
        if (Xa && a instanceof Uint8Array) return a.length ? new eb(new Uint8Array(a), ab) : db();
        if (Array.isArray(a)) {
            const d = A(a);
            if (d & 2) return a;
            if (b && !(d & 32) && (d & 16 || 0 === d)) return jb(a, d | 2), a;
            a = Mb(a, Pb, d & 4 ? nb : c, !0);
            b = A(a);
            b & 4 && b & 2 && Object.freeze(a);
            return a
        }
        return a.ka === ob ? Qb(a) : a
    }
}

function Rb(a, b, c, d, e, f, g) {
    if (a = a.i && a.i[c]) {
        d = 0 < a.length ? a[0].constructor : void 0;
        f = A(a);
        f & 2 || (a = ra(a, Qb), nb(f, a), Object.freeze(a));
        tb(b);
        g = null == a ? rb : kb([]);
        if (null != a) {
            f = !!a.length;
            for (let h = 0; h < a.length; h++) {
                const k = a[h];
                wb(k, d);
                f = f && !lb(k.s);
                g[h] = k.s
            }
            d = g;
            f = (f ? 8 : 0) | 1;
            g = A(d);
            (g & f) !== f && (Object.isFrozen(d) && (d = Array.prototype.slice.call(d)), jb(d, g | f));
            g = d;
            b.i || (b.i = {});
            b.i[c] = a
        } else b.i && (b.i[c] = void 0);
        yb(b, c, g, e)
    } else C(b, c, Pb(d, f, g), e)
}

function Qb(a) {
    if (lb(a.s)) return a;
    a = Sb(a, !0);
    hb(a.s, 2);
    return a
}

function Sb(a, b) {
    var c = a.s,
        d = [];
    hb(d, 16);
    var e = a.constructor.h;
    e && d.push(e);
    e = a.C;
    if (e) {
        d.length = c.length;
        d.fill(void 0, d.length, c.length);
        var f = {};
        d[d.length - 1] = f
    }
    0 !== (A(c) & 128) && ub(d);
    b = b || a.I() ? nb : mb;
    f = a.constructor;
    Jb = d;
    d = new f(d);
    Jb = void 0;
    a.Z && (d.Z = a.Z.slice());
    f = !!(A(c) & 16);
    var g = e ? c.length - 1 : c.length;
    for (let h = 0; h < g; h++) Rb(a, d, h - a.N, c[h], !1, f, b);
    if (e)
        for (const h in e) c = e[h], g = +h, Number.isNaN(g), Rb(a, d, g, c, !0, f, b);
    return d
}

function Db(a) {
    if (!lb(a.s)) return a;
    const b = Sb(a, !1);
    b.m = a;
    return b
};

function Tb(a) {
    qb = !0;
    try {
        return JSON.stringify(a.toJSON(), Ub)
    } finally {
        qb = !1
    }
}
var F = class {
    constructor(a, b, c) {
        null == a && (a = Jb);
        Jb = void 0;
        var d = this.constructor.i || 0,
            e = 0 < d,
            f = this.constructor.h,
            g = !1;
        if (null == a) {
            a = f ? [f] : [];
            var h = 48;
            var k = !0;
            e && (d = 0, h |= 128);
            jb(a, h)
        } else {
            if (!Array.isArray(a)) throw Error();
            if (f && f !== a[0]) throw Error();
            let l = h = hb(a, 0);
            if (k = 0 !== (16 & l))(g = 0 !== (32 & l)) || (l |= 32);
            if (e)
                if (128 & l) d = 0;
                else {
                    if (0 < a.length) {
                        const m = a[a.length - 1];
                        if (pb(m) && "g" in m) {
                            d = 0;
                            l |= 128;
                            delete m.g;
                            let p = !0;
                            for (let t in m) {
                                p = !1;
                                break
                            }
                            p && a.pop()
                        }
                    }
                }
            else if (128 & l) throw Error();
            h !== l && jb(a, l)
        }
        this.N =
            (f ? 0 : -1) - d;
        this.i = void 0;
        this.s = a;
        a: {
            f = this.s.length;d = f - 1;
            if (f && (f = this.s[d], pb(f))) {
                this.C = f;
                this.l = d - this.N;
                break a
            }
            void 0 !== b && -1 < b ? (this.l = Math.max(b, d + 1 - this.N), this.C = void 0) : this.l = Number.MAX_VALUE
        }
        if (!e && this.C && "g" in this.C) throw Error('Unexpected "g" flag in sparse object of message that is not a group type.');
        if (c) {
            b = k && !g && !0;
            e = this.l;
            let l;
            for (k = 0; k < c.length; k++) g = c[k], g < e ? (g += this.N, (d = a[g]) ? Vb(d, b) : a[g] = rb) : (l || (l = xb(this)), (d = l[g]) ? Vb(d, b) : l[g] = rb)
        }
    }
    toJSON() {
        const a = Wb(this.s);
        return qb ?
            a : Mb(a, Nb, Ob)
    }
    clone() {
        return Sb(this, !1)
    }
    I() {
        return lb(this.s)
    }
};

function Vb(a, b) {
    if (Array.isArray(a)) {
        var c = A(a),
            d = 1;
        !b || c & 2 || (d |= 16);
        (c & d) !== d && jb(a, c | d)
    }
}
F.prototype.ka = ob;

function Ub(a, b) {
    return Kb(b)
}

function Wb(a) {
    let b, c = a.length,
        d = !1;
    for (let g = a.length; g--;) {
        let h = a[g];
        if (Array.isArray(h)) {
            var e = h;
            Array.isArray(h) && A(h) & 1 && !h.length ? h = null : h = Wb(h);
            h != e && (d = !0)
        } else if (g === a.length - 1 && pb(h)) {
            a: {
                var f = h;e = {};
                let k = !1;
                for (let l in f) {
                    let m = f[l];
                    if (Array.isArray(m)) {
                        let p = m;
                        Array.isArray(m) && A(m) & 1 && !m.length ? m = null : m = Wb(m);
                        m != p && (k = !0)
                    }
                    null != m ? e[l] = m : k = !0
                }
                if (k) {
                    for (let l in e) {
                        f = e;
                        break a
                    }
                    f = null
                }
            }
            f != h && (d = !0);c--;
            continue
        }
        null == h && c == g + 1 ? (d = !0, c--) : d && (b || (b = Array.prototype.slice.call(a, 0, c),
            mb(A(a), b)), b[g] = h)
    }
    if (!d) return a;
    b || (b = Array.prototype.slice.call(a, 0, c), mb(A(a), b));
    f && b.push(f);
    return b
};

function Xb(a, b) {
    return Error(`Invalid wire type: ${a} (at position ${b})`)
}

function Yb() {
    return Error("Failed to read varint, encoding is invalid.")
}

function Zb(a, b) {
    return Error(`Tried to read past the end of the data ${b} > ${a}`)
};

function $b(a) {
    if ("string" === typeof a) return {
        buffer: Va(a),
        I: !1
    };
    if (Array.isArray(a)) return {
        buffer: new Uint8Array(a),
        I: !1
    };
    if (a.constructor === Uint8Array) return {
        buffer: a,
        I: !1
    };
    if (a.constructor === ArrayBuffer) return {
        buffer: new Uint8Array(a),
        I: !1
    };
    if (a.constructor === eb) return {
        buffer: fb(a) || $a || ($a = new Uint8Array(0)),
        I: !0
    };
    if (a instanceof Uint8Array) return {
        buffer: new Uint8Array(a.buffer, a.byteOffset, a.byteLength),
        I: !1
    };
    throw Error("Type not convertible to a Uint8Array, expected a Uint8Array, an ArrayBuffer, a base64 encoded string, a ByteString or an Array of numbers");
};
const ac = "function" === typeof Uint8Array.prototype.slice;

function bc(a, b) {
    a.h = b;
    if (b > a.i) throw Zb(a.i, b);
}

function cc(a) {
    const b = a.j;
    let c = a.h,
        d = b[c++],
        e = d & 127;
    if (d & 128 && (d = b[c++], e |= (d & 127) << 7, d & 128 && (d = b[c++], e |= (d & 127) << 14, d & 128 && (d = b[c++], e |= (d & 127) << 21, d & 128 && (d = b[c++], e |= d << 28, d & 128 && b[c++] & 128 && b[c++] & 128 && b[c++] & 128 && b[c++] & 128 && b[c++] & 128))))) throw Yb();
    bc(a, c);
    return e
}

function dc(a, b) {
    if (0 > b) throw Error(`Tried to read a negative byte length: ${b}`);
    const c = a.h,
        d = c + b;
    if (d > a.i) throw Zb(b, a.i - c);
    a.h = d;
    return c
}
var ec = class {
        constructor(a) {
            this.j = null;
            this.m = !1;
            this.h = this.i = this.l = 0;
            this.init(a, void 0, void 0, void 0)
        }
        init(a, b, c, {
            fa: d = !1
        } = {}) {
            this.fa = d;
            a && (a = $b(a), this.j = a.buffer, this.m = a.I, this.l = b || 0, this.i = void 0 !== c ? this.l + c : this.j.length, this.h = this.l)
        }
        clear() {
            this.j = null;
            this.m = !1;
            this.h = this.i = this.l = 0;
            this.fa = !1
        }
        reset() {
            this.h = this.l
        }
        advance(a) {
            bc(this, this.h + a)
        }
    },
    fc = [];

function gc(a) {
    var b = a.h;
    if (b.h == b.i) return !1;
    a.j = a.h.h;
    var c = cc(a.h) >>> 0;
    b = c >>> 3;
    c &= 7;
    if (!(0 <= c && 5 >= c)) throw Xb(c, a.j);
    if (1 > b) throw Error(`Invalid field number: ${b} (at position ${a.j})`);
    a.l = b;
    a.i = c;
    return !0
}

function hc(a) {
    switch (a.i) {
        case 0:
            if (0 != a.i) hc(a);
            else a: {
                a = a.h;
                var b = a.h;
                const c = b + 10,
                    d = a.j;
                for (; b < c;)
                    if (0 === (d[b++] & 128)) {
                        bc(a, b);
                        break a
                    }
                throw Yb();
            }
            break;
        case 1:
            a.h.advance(8);
            break;
        case 2:
            2 != a.i ? hc(a) : (b = cc(a.h) >>> 0, a.h.advance(b));
            break;
        case 5:
            a.h.advance(4);
            break;
        case 3:
            b = a.l;
            do {
                if (!gc(a)) throw Error("Unmatched start-group tag: stream EOF");
                if (4 == a.i) {
                    if (a.l != b) throw Error("Unmatched end-group tag");
                    break
                }
                hc(a)
            } while (1);
            break;
        default:
            throw Xb(a.i, a.j);
    }
}
var ic = class {
        constructor(a) {
            if (fc.length) {
                const b = fc.pop();
                b.init(a, void 0, void 0, void 0);
                a = b
            } else a = new ec(a);
            this.h = a;
            this.j = this.h.h;
            this.i = this.l = -1;
            ({
                X: a = !1
            } = {});
            this.X = a
        }
        reset() {
            this.h.reset();
            this.j = this.h.h;
            this.i = this.l = -1
        }
        advance(a) {
            this.h.advance(a)
        }
    },
    jc = [];
const kc = Symbol();

function lc(a, b, c) {
    return a[kc] || (a[kc] = (d, e) => b(d, e, c))
}

function mc(a) {
    let b = a[kc];
    if (!b) {
        const c = nc(a);
        b = (d, e) => oc(d, e, c);
        a[kc] = b
    }
    return b
}

function pc(a) {
    var b = a.Pb;
    if (b) return mc(b);
    if (b = a.Zb) return lc(a.Qa.ga, b, a.Yb)
}

function qc(a) {
    const b = pc(a),
        c = a.Qa,
        d = a.hc.ca;
    return b ? (e, f) => d(e, f, c, b) : (e, f) => d(e, f, c)
}

function rc(a, b) {
    let c = a[b];
    "function" == typeof c && 0 === c.length && (c = c(), a[b] = c);
    return Array.isArray(c) && (sc in c || tc in c || 0 < c.length && "function" == typeof c[0]) ? c : void 0
}
const tc = Symbol(),
    sc = Symbol();

function uc(a, b) {
    a[0] = b
}

function vc(a, b, c, d) {
    const e = c.ca;
    a[b] = d ? (f, g, h) => e(f, g, h, d) : e
}

function wc(a, b, c, d, e) {
    const f = c.ca,
        g = mc(d),
        h = nc(d).ga;
    a[b] = (k, l, m) => f(k, l, m, h, g, e)
}

function xc(a, b, c, d, e, f, g) {
    const h = c.ca,
        k = lc(d, e, f);
    a[b] = (l, m, p) => h(l, m, p, d, k, g)
}

function nc(a) {
    var b = a[sc];
    if (b) return b;
    b = a[sc] = {};
    var c = uc,
        d = vc,
        e = wc,
        f = xc;
    b.ga = a[0];
    let g = 1;
    if (a.length > g && "number" !== typeof a[g]) {
        var h = a[g++];
        c(b, h)
    }
    for (; g < a.length;) {
        c = a[g++];
        for (var k = g + 1; k < a.length && "number" !== typeof a[k];) k++;
        h = a[g++];
        k -= g;
        switch (k) {
            case 0:
                d(b, c, h);
                break;
            case 1:
                (k = rc(a, g)) ? (g++, e(b, c, h, k)) : d(b, c, h, a[g++]);
                break;
            case 2:
                k = b;
                var l = g++;
                l = rc(a, l);
                e(k, c, h, l, a[g++]);
                break;
            case 3:
                f(b, c, h, a[g++], a[g++], a[g++]);
                break;
            case 4:
                f(b, c, h, a[g++], a[g++], a[g++], a[g++]);
                break;
            default:
                throw Error("unexpected number of binary field arguments: " +
                    k);
        }
    }
    sc in a && tc in a && (a.length = 0);
    return b
}

function oc(a, b, c) {
    for (; gc(b) && 4 != b.i;) {
        var d = b.l,
            e = c[d];
        if (!e) {
            var f = c[0];
            f && (f = f[d]) && (e = c[d] = qc(f))
        }
        if (!e || !e(b, a, d))
            if (f = b, d = a, e = f.j, hc(f), !f.X) {
                var g = f.h.h - e;
                f.h.h = e;
                a: {
                    f = f.h;e = g;
                    if (0 == e) {
                        e = db();
                        break a
                    }
                    const h = dc(f, e);f.fa && f.m ? e = f.j.subarray(h, h + e) : (f = f.j, g = h, e = h + e, e = g === e ? $a || ($a = new Uint8Array(0)) : ac ? f.slice(g, e) : new Uint8Array(f.subarray(g, e)));e = 0 == e.length ? db() : new eb(e, ab)
                }(f = d.Z) ? f.push(e) : d.Z = [e]
            }
    }
    return a
}

function yc(a, b) {
    return {
        ca: a,
        qc: b
    }
}
var zc = yc(function(a, b, c) {
        if (2 !== a.i) return !1;
        var d = cc(a.h) >>> 0;
        a = a.h;
        var e = dc(a, d);
        a = a.j;
        if (Oa) {
            var f = a,
                g;
            (g = Na) || (g = Na = new TextDecoder("utf-8", {
                fatal: !0
            }));
            a = e + d;
            f = 0 === e && a === f.length ? f : f.subarray(e, a);
            try {
                var h = g.decode(f)
            } catch (l) {
                if (void 0 === Ma) {
                    try {
                        g.decode(new Uint8Array([128]))
                    } catch (m) {}
                    try {
                        g.decode(new Uint8Array([97])), Ma = !0
                    } catch (m) {
                        Ma = !1
                    }
                }!Ma && (Na = void 0);
                throw l;
            }
        } else {
            h = e;
            d = h + d;
            e = [];
            let l = null;
            let m;
            for (; h < d;) {
                var k = a[h++];
                128 > k ? e.push(k) : 224 > k ? h >= d ? Ka() : (m = a[h++], 194 > k || 128 !== (m & 192) ?
                    (h--, Ka()) : e.push((k & 31) << 6 | m & 63)) : 240 > k ? h >= d - 1 ? Ka() : (m = a[h++], 128 !== (m & 192) || 224 === k && 160 > m || 237 === k && 160 <= m || 128 !== ((f = a[h++]) & 192) ? (h--, Ka()) : e.push((k & 15) << 12 | (m & 63) << 6 | f & 63)) : 244 >= k ? h >= d - 2 ? Ka() : (m = a[h++], 128 !== (m & 192) || 0 !== (k << 28) + (m - 144) >> 30 || 128 !== ((f = a[h++]) & 192) || 128 !== ((g = a[h++]) & 192) ? (h--, Ka()) : (k = (k & 7) << 18 | (m & 63) << 12 | (f & 63) << 6 | g & 63, k -= 65536, e.push((k >> 10 & 1023) + 55296, (k & 1023) + 56320))) : Ka();
                8192 <= e.length && (l = La(l, e), e.length = 0)
            }
            h = La(l, e)
        }
        C(b, c, h);
        return !0
    }, function(a, b, c) {
        a.i(c, B(b, c))
    }),
    Ac = yc(function(a, b, c, d, e) {
        if (2 !== a.i) return !1;
        b = Hb(b, c, d);
        c = a.h.i;
        d = cc(a.h) >>> 0;
        const f = a.h.h + d;
        let g = f - c;
        0 >= g && (a.h.i = f, e(b, a, void 0, void 0, void 0), g = f - a.h.h);
        if (g) throw Error("Message parsing ended unexpectedly. Expected to read " + `${d} bytes, instead read ${d-g} bytes, either the ` + "data ended unexpectedly or the message misreported its own length");
        a.h.h = f;
        a.h.i = c;
        return !0
    }, function(a, b, c, d, e) {
        a.h(c, Fb(b, d, c), e)
    });
Ba("csi.gstatic.com");
Ba("googleads.g.doubleclick.net");
Ba("partner.googleadservices.com");
Ba("pubads.g.doubleclick.net");
Ba("securepubads.g.doubleclick.net");
Ba("tpc.googlesyndication.com");

function Bc(a, b) {
    this.x = void 0 !== a ? a : 0;
    this.y = void 0 !== b ? b : 0
}
Bc.prototype.clone = function() {
    return new Bc(this.x, this.y)
};
Bc.prototype.ceil = function() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this
};
Bc.prototype.floor = function() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this
};
Bc.prototype.round = function() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this
};

function Cc(a, b) {
    for (var c = 0; a;) {
        if (b(a)) return a;
        a = a.parentNode;
        c++
    }
    return null
};

function Dc(a) {
    var b = y("window.location.href");
    null == a && (a = 'Unknown Error of type "null/undefined"');
    if ("string" === typeof a) return {
        message: a,
        name: "Unknown error",
        lineNumber: "Not available",
        fileName: b,
        stack: "Not available"
    };
    var c = !1;
    try {
        var d = a.lineNumber || a.line || "Not available"
    } catch (g) {
        d = "Not available", c = !0
    }
    try {
        var e = a.fileName || a.filename || a.sourceURL || u.$googDebugFname || b
    } catch (g) {
        e = "Not available", c = !0
    }
    b = Ec(a);
    if (!(!c && a.lineNumber && a.fileName && a.stack && a.message && a.name)) {
        c = a.message;
        if (null ==
            c) {
            if (a.constructor && a.constructor instanceof Function) {
                if (a.constructor.name) c = a.constructor.name;
                else if (c = a.constructor, Fc[c]) c = Fc[c];
                else {
                    c = String(c);
                    if (!Fc[c]) {
                        var f = /function\s+([^\(]+)/m.exec(c);
                        Fc[c] = f ? f[1] : "[Anonymous]"
                    }
                    c = Fc[c]
                }
                c = 'Unknown Error of type "' + c + '"'
            } else c = "Unknown Error of unknown type";
            "function" === typeof a.toString && Object.prototype.toString !== a.toString && (c += ": " + a.toString())
        }
        return {
            message: c,
            name: a.name || "UnknownError",
            lineNumber: d,
            fileName: e,
            stack: b || "Not available"
        }
    }
    a.stack =
        b;
    return {
        message: a.message,
        name: a.name,
        lineNumber: a.lineNumber,
        fileName: a.fileName,
        stack: a.stack
    }
}

function Ec(a, b) {
    b || (b = {});
    b[Gc(a)] = !0;
    var c = a.stack || "";
    (a = a.cause) && !b[Gc(a)] && (c += "\nCaused by: ", a.stack && 0 == a.stack.indexOf(a.toString()) || (c += "string" === typeof a ? a : a.message + "\n"), c += Ec(a, b));
    return c
}

function Gc(a) {
    var b = "";
    "function" === typeof a.toString && (b = "" + a);
    return b + a.stack
}
var Fc = {};

function Hc(a) {
    if (!a) return "";
    if (/^about:(?:blank|srcdoc)$/.test(a)) return window.origin || "";
    a = a.split("#")[0].split("?")[0];
    a = a.toLowerCase();
    0 == a.indexOf("//") && (a = window.location.protocol + a);
    /^[\w\-]*:\/\//.test(a) || (a = window.location.href);
    var b = a.substring(a.indexOf("://") + 3),
        c = b.indexOf("/"); - 1 != c && (b = b.substring(0, c));
    c = a.substring(0, a.indexOf("://"));
    if (!c) throw Error("URI is missing protocol: " + a);
    if ("http" !== c && "https" !== c && "chrome-extension" !== c && "moz-extension" !== c && "file" !== c && "android-app" !==
        c && "chrome-search" !== c && "chrome-untrusted" !== c && "chrome" !== c && "app" !== c && "devtools" !== c) throw Error("Invalid URI scheme in origin: " + c);
    a = "";
    var d = b.indexOf(":");
    if (-1 != d) {
        var e = b.substring(d + 1);
        b = b.substring(0, d);
        if ("http" === c && "80" !== e || "https" === c && "443" !== e) a = ":" + e
    }
    return c + "://" + b + a
};
var Ic = "client_dev_domain client_dev_regex_map client_dev_root_url client_rollout_override expflag forcedCapability jsfeat jsmode mods".split(" "),
    Jc = [...Ic, "client_dev_set_cookie"];

function Kc() {
    function a() {
        e[0] = 1732584193;
        e[1] = 4023233417;
        e[2] = 2562383102;
        e[3] = 271733878;
        e[4] = 3285377520;
        m = l = 0
    }

    function b(p) {
        for (var t = g, n = 0; 64 > n; n += 4) t[n / 4] = p[n] << 24 | p[n + 1] << 16 | p[n + 2] << 8 | p[n + 3];
        for (n = 16; 80 > n; n++) p = t[n - 3] ^ t[n - 8] ^ t[n - 14] ^ t[n - 16], t[n] = (p << 1 | p >>> 31) & 4294967295;
        p = e[0];
        var x = e[1],
            w = e[2],
            E = e[3],
            Za = e[4];
        for (n = 0; 80 > n; n++) {
            if (40 > n)
                if (20 > n) {
                    var L = E ^ x & (w ^ E);
                    var ja = 1518500249
                } else L = x ^ w ^ E, ja = 1859775393;
            else 60 > n ? (L = x & w | E & (x | w), ja = 2400959708) : (L = x ^ w ^ E, ja = 3395469782);
            L = ((p << 5 | p >>> 27) & 4294967295) + L + Za + ja + t[n] & 4294967295;
            Za = E;
            E = w;
            w = (x << 30 | x >>> 2) & 4294967295;
            x = p;
            p = L
        }
        e[0] = e[0] + p & 4294967295;
        e[1] = e[1] + x & 4294967295;
        e[2] = e[2] + w & 4294967295;
        e[3] = e[3] + E & 4294967295;
        e[4] = e[4] + Za & 4294967295
    }

    function c(p, t) {
        if ("string" === typeof p) {
            p = unescape(encodeURIComponent(p));
            for (var n = [], x = 0, w = p.length; x < w; ++x) n.push(p.charCodeAt(x));
            p = n
        }
        t || (t = p.length);
        n = 0;
        if (0 == l)
            for (; n + 64 < t;) b(p.slice(n, n + 64)), n += 64, m += 64;
        for (; n < t;)
            if (f[l++] = p[n++], m++, 64 == l)
                for (l = 0, b(f); n + 64 < t;) b(p.slice(n, n + 64)), n += 64, m += 64
    }

    function d() {
        var p = [],
            t = 8 * m;
        56 > l ? c(h, 56 - l) : c(h, 64 - (l - 56));
        for (var n = 63; 56 <= n; n--) f[n] = t & 255, t >>>= 8;
        b(f);
        for (n = t = 0; 5 > n; n++)
            for (var x = 24; 0 <= x; x -= 8) p[t++] = e[n] >> x & 255;
        return p
    }
    for (var e = [], f = [], g = [], h = [128], k = 1; 64 > k; ++k) h[k] = 0;
    var l, m;
    a();
    return {
        reset: a,
        update: c,
        digest: d,
        Oa: function() {
            for (var p = d(), t = "", n = 0; n < p.length; n++) t += "0123456789ABCDEF".charAt(Math.floor(p[n] / 16)) + "0123456789ABCDEF".charAt(p[n] % 16);
            return t
        }
    }
};

function Lc(a, b, c) {
    var d = String(u.location.href);
    return d && a && b ? [b, Mc(Hc(d), a, c || null)].join(" ") : null
}

function Mc(a, b, c) {
    var d = [],
        e = [];
    if (1 == (Array.isArray(c) ? 2 : 1)) return e = [b, a], qa(d, function(h) {
        e.push(h)
    }), Nc(e.join(" "));
    var f = [],
        g = [];
    qa(c, function(h) {
        g.push(h.key);
        f.push(h.value)
    });
    c = Math.floor((new Date).getTime() / 1E3);
    e = 0 == f.length ? [c, b, a] : [f.join(":"), c, b, a];
    qa(d, function(h) {
        e.push(h)
    });
    a = Nc(e.join(" "));
    a = [c, a];
    0 == g.length || a.push(g.join(""));
    return a.join("_")
}

function Nc(a) {
    var b = Kc();
    b.update(a);
    return b.Oa().toLowerCase()
};
const Oc = {};

function Pc() {
    this.h = document || {
        cookie: ""
    }
}
q = Pc.prototype;
q.isEnabled = function() {
    if (!u.navigator.cookieEnabled) return !1;
    if (!this.ya()) return !0;
    this.set("TESTCOOKIESENABLED", "1", {
        za: 60
    });
    if ("1" !== this.get("TESTCOOKIESENABLED")) return !1;
    this.remove("TESTCOOKIESENABLED");
    return !0
};
q.set = function(a, b, c) {
    let d, e, f, g = !1,
        h;
    "object" === typeof c && (h = c.lc, g = c.mc || !1, f = c.domain || void 0, e = c.path || void 0, d = c.za);
    if (/[;=\s]/.test(a)) throw Error('Invalid cookie name "' + a + '"');
    if (/[;\r\n]/.test(b)) throw Error('Invalid cookie value "' + b + '"');
    void 0 === d && (d = -1);
    this.h.cookie = a + "=" + b + (f ? ";domain=" + f : "") + (e ? ";path=" + e : "") + (0 > d ? "" : 0 == d ? ";expires=" + (new Date(1970, 1, 1)).toUTCString() : ";expires=" + (new Date(Date.now() + 1E3 * d)).toUTCString()) + (g ? ";secure" : "") + (null != h ? ";samesite=" + h : "")
};
q.get = function(a, b) {
    const c = a + "=",
        d = (this.h.cookie || "").split(";");
    for (let e = 0, f; e < d.length; e++) {
        f = Da(d[e]);
        if (0 == f.lastIndexOf(c, 0)) return f.slice(c.length);
        if (f == a) return ""
    }
    return b
};
q.remove = function(a, b, c) {
    const d = void 0 !== this.get(a);
    this.set(a, "", {
        za: 0,
        path: b,
        domain: c
    });
    return d
};
q.ya = function() {
    return !this.h.cookie
};
q.clear = function() {
    var a = (this.h.cookie || "").split(";");
    const b = [],
        c = [];
    let d, e;
    for (let f = 0; f < a.length; f++) e = Da(a[f]), d = e.indexOf("="), -1 == d ? (b.push(""), c.push(e)) : (b.push(e.substring(0, d)), c.push(e.substring(d + 1)));
    for (a = b.length - 1; 0 <= a; a--) this.remove(b[a])
};

function Qc() {
    return !!Oc.FPA_SAMESITE_PHASE2_MOD || !1
}

function Rc(a, b, c, d) {
    (a = u[a]) || (a = (new Pc).get(b));
    return a ? Lc(a, c, d) : null
};
"undefined" !== typeof TextDecoder && new TextDecoder;
"undefined" !== typeof TextEncoder && new TextEncoder;

function Sc() {
    this.j = this.j;
    this.l = this.l
}
Sc.prototype.j = !1;
Sc.prototype.dispose = function() {
    this.j || (this.j = !0, this.Y())
};
Sc.prototype.Y = function() {
    if (this.l)
        for (; this.l.length;) this.l.shift()()
};
const Tc = self;

function Uc(a, b) {
    a.l(b);
    100 > a.i && (a.i++, b.next = a.h, a.h = b)
}
class Vc {
    constructor(a, b) {
        this.j = a;
        this.l = b;
        this.i = 0;
        this.h = null
    }
    get() {
        let a;
        0 < this.i ? (this.i--, a = this.h, this.h = a.next, a.next = null) : a = this.j();
        return a
    }
};
class Wc {
    constructor() {
        this.i = this.h = null
    }
    add(a, b) {
        const c = Xc.get();
        c.set(a, b);
        this.i ? this.i.next = c : this.h = c;
        this.i = c
    }
    remove() {
        let a = null;
        this.h && (a = this.h, this.h = this.h.next, this.h || (this.i = null), a.next = null);
        return a
    }
}
var Xc = new Vc(() => new Yc, a => a.reset());
class Yc {
    constructor() {
        this.next = this.scope = this.h = null
    }
    set(a, b) {
        this.h = a;
        this.scope = b;
        this.next = null
    }
    reset() {
        this.next = this.scope = this.h = null
    }
};
let Zc, $c = !1,
    ad = new Wc,
    cd = (a, b) => {
        Zc || bd();
        $c || (Zc(), $c = !0);
        ad.add(a, b)
    },
    bd = () => {
        const a = u.Promise.resolve(void 0);
        Zc = () => {
            a.then(dd)
        }
    };
var dd = () => {
    let a;
    for (; a = ad.remove();) {
        try {
            a.h.call(a.scope)
        } catch (b) {
            Pa(b)
        }
        Uc(Xc, a)
    }
    $c = !1
};
class ed {
    constructor() {
        this.promise = new Promise(a => {
            this.resolve = a
        })
    }
};

function G(a) {
    this.h = 0;
    this.v = void 0;
    this.l = this.i = this.j = null;
    this.m = this.u = !1;
    if (a != pa) try {
        var b = this;
        a.call(void 0, function(c) {
            fd(b, 2, c)
        }, function(c) {
            fd(b, 3, c)
        })
    } catch (c) {
        fd(this, 3, c)
    }
}

function gd() {
    this.next = this.context = this.i = this.j = this.h = null;
    this.l = !1
}
gd.prototype.reset = function() {
    this.context = this.i = this.j = this.h = null;
    this.l = !1
};
var hd = new Vc(function() {
    return new gd
}, function(a) {
    a.reset()
});

function id(a, b, c) {
    var d = hd.get();
    d.j = a;
    d.i = b;
    d.context = c;
    return d
}

function jd(a) {
    if (a instanceof G) return a;
    var b = new G(pa);
    fd(b, 2, a);
    return b
}
G.prototype.then = function(a, b, c) {
    return kd(this, "function" === typeof a ? a : null, "function" === typeof b ? b : null, c)
};
G.prototype.$goog_Thenable = !0;
q = G.prototype;
q.hb = function(a, b) {
    return kd(this, null, a, b)
};
q.catch = G.prototype.hb;
q.cancel = function(a) {
    if (0 == this.h) {
        var b = new ld(a);
        cd(function() {
            md(this, b)
        }, this)
    }
};

function md(a, b) {
    if (0 == a.h)
        if (a.j) {
            var c = a.j;
            if (c.i) {
                for (var d = 0, e = null, f = null, g = c.i; g && (g.l || (d++, g.h == a && (e = g), !(e && 1 < d))); g = g.next) e || (f = g);
                e && (0 == c.h && 1 == d ? md(c, b) : (f ? (d = f, d.next == c.l && (c.l = d), d.next = d.next.next) : nd(c), od(c, e, 3, b)))
            }
            a.j = null
        } else fd(a, 3, b)
}

function pd(a, b) {
    a.i || 2 != a.h && 3 != a.h || qd(a);
    a.l ? a.l.next = b : a.i = b;
    a.l = b
}

function kd(a, b, c, d) {
    var e = id(null, null, null);
    e.h = new G(function(f, g) {
        e.j = b ? function(h) {
            try {
                var k = b.call(d, h);
                f(k)
            } catch (l) {
                g(l)
            }
        } : f;
        e.i = c ? function(h) {
            try {
                var k = c.call(d, h);
                void 0 === k && h instanceof ld ? g(h) : f(k)
            } catch (l) {
                g(l)
            }
        } : g
    });
    e.h.j = a;
    pd(a, e);
    return e.h
}
q.ib = function(a) {
    this.h = 0;
    fd(this, 2, a)
};
q.jb = function(a) {
    this.h = 0;
    fd(this, 3, a)
};

function fd(a, b, c) {
    if (0 == a.h) {
        a === c && (b = 3, c = new TypeError("Promise cannot resolve to itself"));
        a.h = 1;
        a: {
            var d = c,
                e = a.ib,
                f = a.jb;
            if (d instanceof G) {
                pd(d, id(e || pa, f || null, a));
                var g = !0
            } else {
                if (d) try {
                    var h = !!d.$goog_Thenable
                } catch (l) {
                    h = !1
                } else h = !1;
                if (h) d.then(e, f, a), g = !0;
                else {
                    if (ia(d)) try {
                        var k = d.then;
                        if ("function" === typeof k) {
                            rd(d, k, e, f, a);
                            g = !0;
                            break a
                        }
                    } catch (l) {
                        f.call(a, l);
                        g = !0;
                        break a
                    }
                    g = !1
                }
            }
        }
        g || (a.v = c, a.h = b, a.j = null, qd(a), 3 != b || c instanceof ld || sd(a, c))
    }
}

function rd(a, b, c, d, e) {
    function f(k) {
        h || (h = !0, d.call(e, k))
    }

    function g(k) {
        h || (h = !0, c.call(e, k))
    }
    var h = !1;
    try {
        b.call(a, g, f)
    } catch (k) {
        f(k)
    }
}

function qd(a) {
    a.u || (a.u = !0, cd(a.Pa, a))
}

function nd(a) {
    var b = null;
    a.i && (b = a.i, a.i = b.next, b.next = null);
    a.i || (a.l = null);
    return b
}
q.Pa = function() {
    for (var a; a = nd(this);) od(this, a, this.h, this.v);
    this.u = !1
};

function od(a, b, c, d) {
    if (3 == c && b.i && !b.l)
        for (; a && a.m; a = a.j) a.m = !1;
    if (b.h) b.h.j = null, td(b, c, d);
    else try {
        b.l ? b.j.call(b.context) : td(b, c, d)
    } catch (e) {
        ud.call(null, e)
    }
    Uc(hd, b)
}

function td(a, b, c) {
    2 == b ? a.j.call(a.context, c) : a.i && a.i.call(a.context, c)
}

function sd(a, b) {
    a.m = !0;
    cd(function() {
        a.m && ud.call(null, b)
    })
}
var ud = Pa;

function ld(a) {
    oa.call(this, a)
}
na(ld, oa);
ld.prototype.name = "cancel";

function H(a) {
    Sc.call(this);
    this.v = 1;
    this.m = [];
    this.u = 0;
    this.h = [];
    this.i = {};
    this.D = !!a
}
na(H, Sc);
q = H.prototype;
q.Ia = function(a, b, c) {
    var d = this.i[a];
    d || (d = this.i[a] = []);
    var e = this.v;
    this.h[e] = a;
    this.h[e + 1] = b;
    this.h[e + 2] = c;
    this.v = e + 3;
    d.push(e);
    return e
};
q.na = function(a) {
    var b = this.h[a];
    if (b) {
        var c = this.i[b];
        0 != this.u ? (this.m.push(a), this.h[a + 1] = () => {}) : (c && sa(c, a), delete this.h[a], delete this.h[a + 1], delete this.h[a + 2])
    }
    return !!b
};
q.la = function(a, b) {
    var c = this.i[a];
    if (c) {
        for (var d = Array(arguments.length - 1), e = 1, f = arguments.length; e < f; e++) d[e - 1] = arguments[e];
        if (this.D)
            for (e = 0; e < c.length; e++) {
                var g = c[e];
                vd(this.h[g + 1], this.h[g + 2], d)
            } else {
                this.u++;
                try {
                    for (e = 0, f = c.length; e < f && !this.j; e++) g = c[e], this.h[g + 1].apply(this.h[g + 2], d)
                } finally {
                    if (this.u--, 0 < this.m.length && 0 == this.u)
                        for (; c = this.m.pop();) this.na(c)
                }
            }
        return 0 != e
    }
    return !1
};

function vd(a, b, c) {
    cd(function() {
        a.apply(b, c)
    })
}
q.clear = function(a) {
    if (a) {
        var b = this.i[a];
        b && (b.forEach(this.na, this), delete this.i[a])
    } else this.h.length = 0, this.i = {}
};
q.Y = function() {
    H.eb.Y.call(this);
    this.clear();
    this.m.length = 0
};
/*

 (The MIT License)

 Copyright (C) 2014 by Vitaly Puzrin

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 -----------------------------------------------------------------------------
 Ported from zlib, which is under the following license
 https://github.com/madler/zlib/blob/master/zlib.h

 zlib.h -- interface of the 'zlib' general purpose compression library
   version 1.2.8, April 28th, 2013
   Copyright (C) 1995-2013 Jean-loup Gailly and Mark Adler
   This software is provided 'as-is', without any express or implied
   warranty.  In no event will the authors be held liable for any damages
   arising from the use of this software.
   Permission is granted to anyone to use this software for any purpose,
   including commercial applications, and to alter it and redistribute it
   freely, subject to the following restrictions:
   1. The origin of this software must not be misrepresented; you must not
      claim that you wrote the original software. If you use this software
      in a product, an acknowledgment in the product documentation would be
      appreciated but is not required.
   2. Altered source versions must be plainly marked as such, and must not be
      misrepresented as being the original software.
   3. This notice may not be removed or altered from any source distribution.
   Jean-loup Gailly        Mark Adler
   jloup@gzip.org          madler@alumni.caltech.edu
   The data format used by the zlib library is described by RFCs (Request for
   Comments) 1950 to 1952 in the files http://tools.ietf.org/html/rfc1950
   (zlib format), rfc1951 (deflate format) and rfc1952 (gzip format).
*/
let I = {};
var wd = "undefined" !== typeof Uint8Array && "undefined" !== typeof Uint16Array && "undefined" !== typeof Int32Array;
I.assign = function(a) {
    for (var b = Array.prototype.slice.call(arguments, 1); b.length;) {
        var c = b.shift();
        if (c) {
            if ("object" !== typeof c) throw new TypeError(c + "must be non-object");
            for (var d in c) Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d])
        }
    }
    return a
};
I.oc = function(a, b) {
    if (a.length === b) return a;
    if (a.subarray) return a.subarray(0, b);
    a.length = b;
    return a
};
var xd = {
        La: function(a, b, c, d, e) {
            if (b.subarray && a.subarray) a.set(b.subarray(c, c + d), e);
            else
                for (var f = 0; f < d; f++) a[e + f] = b[c + f]
        },
        Ra: function(a) {
            var b, c;
            var d = c = 0;
            for (b = a.length; d < b; d++) c += a[d].length;
            var e = new Uint8Array(c);
            d = c = 0;
            for (b = a.length; d < b; d++) {
                var f = a[d];
                e.set(f, c);
                c += f.length
            }
            return e
        }
    },
    yd = {
        La: function(a, b, c, d, e) {
            for (var f = 0; f < d; f++) a[e + f] = b[c + f]
        },
        Ra: function(a) {
            return [].concat.apply([], a)
        }
    };
I.cb = function() {
    wd ? (I.oa = Uint8Array, I.Ea = Uint16Array, I.Fa = Int32Array, I.assign(I, xd)) : (I.oa = Array, I.Ea = Array, I.Fa = Array, I.assign(I, yd))
};
I.cb();
try {
    new Uint8Array(1)
} catch (a) {}
for (var zd = new I.oa(256), Ad = 0; 256 > Ad; Ad++) zd[Ad] = 252 <= Ad ? 6 : 248 <= Ad ? 5 : 240 <= Ad ? 4 : 224 <= Ad ? 3 : 192 <= Ad ? 2 : 1;
zd[254] = zd[254] = 1;

function Bd(a) {
    for (var b = a.length; 0 <= --b;) a[b] = 0
}
Bd(Array(576));
Bd(Array(60));
Bd(Array(512));
Bd(Array(256));
Bd(Array(29));
Bd(Array(30));
/*

Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com
Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/
var Cd = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
var Dd = class {
    constructor(a) {
        this.name = a
    }
};
var Ed = new Dd("rawColdConfigGroup");
var Fd = new Dd("rawHotConfigGroup");
var Gd = class extends F {
    constructor(a) {
        super(a)
    }
};
var Id = class extends F {
        constructor(a) {
            super(a)
        }
        getKey() {
            return Ib(this, 1)
        }
        R() {
            return Ib(this, 2 === Bb(this, Hd) ? 2 : -1)
        }
    },
    Hd = [2, 3, 4, 5, 6];
var Jd = class extends F {
    constructor(a) {
        super(a)
    }
};
var Ld = class extends F {
        constructor(a) {
            super(a, -1, Kd)
        }
    },
    Kd = [2];
var Nd = class extends F {
        constructor(a) {
            super(a, -1, Md)
        }
        getPlayerType() {
            return B(this, 36)
        }
        setHomeGroupInfo(a) {
            return D(this, Ld, 81, a)
        }
        clearLocationPlayabilityToken() {
            return C(this, 89, void 0, !1)
        }
    },
    Md = [9, 66, 24, 32, 86, 100, 101];
var Pd = class extends F {
        constructor(a) {
            super(a, -1, Od)
        }
    },
    Od = [15, 26, 28];
var Rd = class extends F {
        constructor(a) {
            super(a, -1, Qd)
        }
    },
    Qd = [5];
var Sd = class extends F {
    constructor(a) {
        super(a)
    }
};
var Ud = class extends F {
        constructor(a) {
            super(a, -1, Td)
        }
        setSafetyMode(a) {
            return C(this, 5, a)
        }
    },
    Td = [12];
var Wd = class extends F {
        constructor(a) {
            super(a, -1, Vd)
        }
        j(a) {
            return D(this, Nd, 1, a)
        }
    },
    Vd = [12];
var Yd = class extends F {
        constructor(a) {
            super(a, -1, Xd)
        }
    },
    Zd = class extends F {
        constructor(a) {
            super(a)
        }
        getKey() {
            return Ib(this, 1)
        }
        R() {
            return Ib(this, 2)
        }
    },
    Xd = [4, 5];
var $d = class extends F {
    constructor(a) {
        super(a)
    }
};
var ae = class extends F {
        constructor(a) {
            super(a)
        }
    },
    be = [2, 3, 4];
var ce = class extends F {
    constructor(a) {
        super(a)
    }
};
var de = class extends F {
    constructor(a) {
        super(a)
    }
};
var ee = class extends F {
    constructor(a) {
        super(a)
    }
};
var ge = class extends F {
        constructor(a) {
            super(a, -1, fe)
        }
    },
    fe = [10, 17];
var he = class extends F {
    constructor(a) {
        super(a)
    }
};
var J = class extends F {
    constructor(a) {
        super(a)
    }
};
var ie = class extends F {
    constructor(a) {
        super(a)
    }
};
var je = class extends F {
    constructor(a) {
        super(a)
    }
};
var le = class extends F {
        constructor(a) {
            super(a, -1, ke)
        }
        getVideoData() {
            return Cb(this, je, 15)
        }
    },
    ke = [4];

function me(a, b) {
    return D(a, J, 1, b)
}
var ne = class extends F {
    constructor(a) {
        super(a)
    }
    h(a) {
        return C(this, 2, a)
    }
};

function oe(a, b) {
    D(a, J, 1, b)
}
var pe = class extends F {
    constructor(a) {
        super(a)
    }
};

function qe(a, b) {
    return D(a, J, 2, b)
}
var se = class extends F {
        constructor(a) {
            super(a, -1, re)
        }
        h(a) {
            return C(this, 1, a)
        }
    },
    re = [3];
var te = class extends F {
    constructor(a) {
        super(a)
    }
    h(a) {
        return C(this, 1, a)
    }
};
var ue = class extends F {
    constructor(a) {
        super(a)
    }
    h(a) {
        return C(this, 1, a)
    }
};
var ve = class extends F {
    constructor(a) {
        super(a)
    }
    h(a) {
        return C(this, 1, a)
    }
};
var we = class extends F {
    constructor(a) {
        super(a)
    }
    h(a) {
        return C(this, 1, a)
    }
};
var xe = class extends F {
    constructor(a) {
        super(a)
    }
};
var ye = class extends F {
    constructor(a) {
        super(a)
    }
};
var ze = class extends F {
        constructor(a) {
            super(a, 459)
        }
    },
    Ae = [23, 24, 11, 6, 7, 5, 2, 3, 13, 20, 21, 22, 28, 32, 37, 229, 241, 45, 59, 225, 288, 72, 73, 78, 208, 156, 202, 215, 74, 76, 79, 80, 111, 85, 91, 97, 100, 102, 105, 119, 126, 127, 136, 146, 148, 151, 157, 158, 159, 163, 164, 168, 444, 176, 222, 383, 177, 178, 179, 458, 411, 184, 188, 189, 190, 191, 193, 194, 195, 196, 197, 198, 199, 200, 201, 402, 320, 203, 204, 205, 206, 258, 259, 260, 261, 327, 209, 219, 226, 227, 232, 233, 234, 240, 244, 247, 248, 249, 251, 256, 257, 266, 254, 255, 270, 272, 278, 291, 293, 300, 304, 308, 309, 310, 311, 313, 314, 319, 321,
        323, 324, 328, 330, 331, 332, 334, 337, 338, 340, 344, 348, 350, 351, 352, 353, 354, 355, 356, 357, 358, 361, 363, 364, 368, 369, 370, 373, 374, 375, 378, 380, 381, 388, 389, 403, 410, 412, 429, 413, 414, 415, 416, 417, 418, 430, 423, 424, 425, 426, 427, 431, 117, 439, 441, 448
    ];
var Be = {
    Fb: 0,
    qb: 1,
    wb: 2,
    xb: 4,
    Cb: 8,
    yb: 16,
    zb: 32,
    Eb: 64,
    Db: 128,
    sb: 256,
    ub: 512,
    Bb: 1024,
    tb: 2048,
    vb: 4096,
    rb: 8192,
    Ab: 16384
};
var Ce = class extends F {
    constructor(a) {
        super(a)
    }
};
var Ee = class extends F {
        constructor(a) {
            super(a)
        }
        setVideoId(a) {
            return Ab(this, 1, De, a)
        }
        getPlaylistId() {
            var a = 2 === Bb(this, De) ? 2 : -1;
            return B(this, a)
        }
    },
    De = [1, 2];
var Ge = class extends F {
        constructor() {
            super(void 0, -1, Fe)
        }
    },
    Fe = [3];
var He = new Dd("recordNotificationInteractionsEndpoint");
var Ie = ["notification/convert_endpoint_to_url"],
    Je = ["notification/record_interactions"],
    Ke = ["notification_registration/set_registration"];
const Le = u.window;
let Me, Ne;
const Oe = (null == Le ? void 0 : null == (Me = Le.yt) ? void 0 : Me.config_) || (null == Le ? void 0 : null == (Ne = Le.ytcfg) ? void 0 : Ne.data_) || {};
v("yt.config_", Oe);

function K(...a) {
    a = arguments;
    1 < a.length ? Oe[a[0]] = a[1] : 1 === a.length && Object.assign(Oe, a[0])
}

function M(a, b) {
    return a in Oe ? Oe[a] : b
}

function Pe() {
    return M("LATEST_ECATCHER_SERVICE_TRACKING_PARAMS")
}

function Qe() {
    const a = Oe.EXPERIMENT_FLAGS;
    return a ? a.web_disable_gel_stp_ecatcher_killswitch : void 0
};

function N(a) {
    a = Re(a);
    return "string" === typeof a && "false" === a ? !1 : !!a
}

function Se(a, b) {
    a = Re(a);
    return void 0 === a && void 0 !== b ? b : Number(a || 0)
}

function Te() {
    return M("EXPERIMENTS_TOKEN", "")
}

function Re(a) {
    const b = M("EXPERIMENTS_FORCED_FLAGS", {}) || {};
    return void 0 !== b[a] ? b[a] : M("EXPERIMENT_FLAGS", {})[a]
}

function Ue() {
    const a = [],
        b = M("EXPERIMENTS_FORCED_FLAGS", {});
    for (var c of Object.keys(b)) a.push({
        key: c,
        value: String(b[c])
    });
    c = M("EXPERIMENT_FLAGS", {});
    for (const d of Object.keys(c)) d.startsWith("force_") && void 0 === b[d] && a.push({
        key: d,
        value: String(c[d])
    });
    return a
};
const Ve = [];

function We(a) {
    Ve.forEach(b => b(a))
}

function Xe(a) {
    return a && window.yterr ? function() {
        try {
            return a.apply(this, arguments)
        } catch (b) {
            Ye(b)
        }
    } : a
}

function Ye(a) {
    var b = y("yt.logging.errors.log");
    b ? b(a, "ERROR", void 0, void 0, void 0) : (b = M("ERRORS", []), b.push([a, "ERROR", void 0, void 0, void 0]), K("ERRORS", b));
    We(a)
}

function Ze(a) {
    var b = y("yt.logging.errors.log");
    b ? b(a, "WARNING", void 0, void 0, void 0) : (b = M("ERRORS", []), b.push([a, "WARNING", void 0, void 0, void 0]), K("ERRORS", b))
};
const $e = /^[\w.]*$/,
    af = {
        q: !0,
        search_query: !0
    };

function bf(a, b) {
    b = a.split(b);
    const c = {};
    for (let f = 0, g = b.length; f < g; f++) {
        const h = b[f].split("=");
        if (1 == h.length && h[0] || 2 == h.length) try {
            const k = cf(h[0] || ""),
                l = cf(h[1] || "");
            k in c ? Array.isArray(c[k]) ? ta(c[k], l) : c[k] = [c[k], l] : c[k] = l
        } catch (k) {
            var d = k,
                e = h[0];
            const l = String(bf);
            d.args = [{
                key: e,
                value: h[1],
                query: a,
                method: df == l ? "unchanged" : l
            }];
            af.hasOwnProperty(e) || Ze(d)
        }
    }
    return c
}
const df = String(bf);

function ef(a) {
    "?" == a.charAt(0) && (a = a.substr(1));
    return bf(a, "&")
}

function ff(a, b, c) {
    var d = a.split("#", 2);
    a = d[0];
    d = 1 < d.length ? "#" + d[1] : "";
    var e = a.split("?", 2);
    a = e[0];
    e = ef(e[1] || "");
    for (var f in b) !c && null !== e && f in e || (e[f] = b[f]);
    b = a;
    a = Ja(e);
    a ? (c = b.indexOf("#"), 0 > c && (c = b.length), f = b.indexOf("?"), 0 > f || f > c ? (f = c, e = "") : e = b.substring(f + 1, c), b = [b.slice(0, f), e, b.slice(c)], c = b[1], b[1] = a ? c ? c + "&" + a : a : c, a = b[0] + (b[1] ? "?" + b[1] : "") + b[2]) : a = b;
    return a + d
}

function gf(a) {
    if (!b) var b = window.location.href;
    const c = a.match(Ga)[1] || null,
        d = Ha(a.match(Ga)[3] || null);
    c && d ? (a = a.match(Ga), b = b.match(Ga), a = a[3] == b[3] && a[1] == b[1] && a[4] == b[4]) : a = d ? Ha(b.match(Ga)[3] || null) == d && (Number(b.match(Ga)[4] || null) || null) == (Number(a.match(Ga)[4] || null) || null) : !0;
    return a
}

function cf(a) {
    return a && a.match($e) ? a : decodeURIComponent(a.replace(/\+/g, " "))
};

function hf(a, b) {
    "function" === typeof a && (a = Xe(a));
    return window.setTimeout(a, b)
};
[...Ic];
let jf = !1;

function kf(a, b) {
    const c = {
        method: b.method || "GET",
        credentials: "same-origin"
    };
    b.headers && (c.headers = b.headers);
    a = lf(a, b);
    const d = mf(a, b);
    d && (c.body = d);
    b.withCredentials && (c.credentials = "include");
    const e = b.context || u;
    let f = !1,
        g;
    fetch(a, c).then(h => {
        if (!f) {
            f = !0;
            g && window.clearTimeout(g);
            var k = h.ok,
                l = m => {
                    m = m || {};
                    k ? b.onSuccess && b.onSuccess.call(e, m, h) : b.onError && b.onError.call(e, m, h);
                    b.onFinish && b.onFinish.call(e, m, h)
                };
            "JSON" == (b.format || "JSON") && (k || 400 <= h.status && 500 > h.status) ? h.json().then(l, function() {
                l(null)
            }): l(null)
        }
    }).catch(() => {
        b.onError && b.onError.call(e, {}, {})
    });
    a = b.timeout || 0;
    b.onFetchTimeout && 0 < a && (g = hf(() => {
        f || (f = !0, window.clearTimeout(g), b.onFetchTimeout.call(b.context || u))
    }, a))
}

function lf(a, b) {
    b.includeDomain && (a = document.location.protocol + "//" + document.location.hostname + (document.location.port ? ":" + document.location.port : "") + a);
    const c = M("XSRF_FIELD_NAME");
    if (b = b.urlParams) b[c] && delete b[c], a = ff(a, b || {}, !0);
    return a
}

function mf(a, b) {
    const c = M("XSRF_FIELD_NAME"),
        d = M("XSRF_TOKEN");
    var e = b.postBody || "",
        f = b.postParams;
    var g = M("XSRF_FIELD_NAME");
    let h;
    b.headers && (h = b.headers["Content-Type"]);
    b.excludeXsrf || Ha(a.match(Ga)[3] || null) && !b.withCredentials && Ha(a.match(Ga)[3] || null) != document.location.hostname || "POST" != b.method || h && "application/x-www-form-urlencoded" != h || b.postParams && b.postParams[g] || (f || (f = {}), f[c] = d);
    (N("ajax_parse_query_data_only_when_filled") && f && 0 < Object.keys(f).length || f) && "string" === typeof e && (e =
        ef(e), za(e, f), e = b.postBodyFormat && "JSON" == b.postBodyFormat ? JSON.stringify(e) : Ja(e));
    f = e || f && !wa(f);
    !jf && f && "POST" != b.method && (jf = !0, Ye(Error("AJAX request with postData should use POST")));
    return e
};
const nf = [{
    ja: a => `Cannot read property '${a.key}'`,
    ba: {
        Error: [{
            A: /(Permission denied) to access property "([^']+)"/,
            groups: ["reason", "key"]
        }],
        TypeError: [{
            A: /Cannot read property '([^']+)' of (null|undefined)/,
            groups: ["key", "value"]
        }, {
            A: /\u65e0\u6cd5\u83b7\u53d6\u672a\u5b9a\u4e49\u6216 (null|undefined) \u5f15\u7528\u7684\u5c5e\u6027\u201c([^\u201d]+)\u201d/,
            groups: ["value", "key"]
        }, {
            A: /\uc815\uc758\ub418\uc9c0 \uc54a\uc74c \ub610\ub294 (null|undefined) \ucc38\uc870\uc778 '([^']+)' \uc18d\uc131\uc744 \uac00\uc838\uc62c \uc218 \uc5c6\uc2b5\ub2c8\ub2e4./,
            groups: ["value", "key"]
        }, {
            A: /No se puede obtener la propiedad '([^']+)' de referencia nula o sin definir/,
            groups: ["key"]
        }, {
            A: /Unable to get property '([^']+)' of (undefined or null) reference/,
            groups: ["key", "value"]
        }, {
            A: /(null) is not an object \(evaluating '(?:([^.]+)\.)?([^']+)'\)/,
            groups: ["value", "base", "key"]
        }]
    }
}, {
    ja: a => `Cannot call '${a.key}'`,
    ba: {
        TypeError: [{
                A: /(?:([^ ]+)?\.)?([^ ]+) is not a function/,
                groups: ["base", "key"]
            }, {
                A: /([^ ]+) called on (null or undefined)/,
                groups: ["key", "value"]
            }, {
                A: /Object (.*) has no method '([^ ]+)'/,
                groups: ["base", "key"]
            }, {
                A: /Object doesn't support property or method '([^ ]+)'/,
                groups: ["key"]
            }, {
                A: /\u30aa\u30d6\u30b8\u30a7\u30af\u30c8\u306f '([^']+)' \u30d7\u30ed\u30d1\u30c6\u30a3\u307e\u305f\u306f\u30e1\u30bd\u30c3\u30c9\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u307e\u305b\u3093/,
                groups: ["key"]
            },
            {
                A: /\uac1c\uccb4\uac00 '([^']+)' \uc18d\uc131\uc774\ub098 \uba54\uc11c\ub4dc\ub97c \uc9c0\uc6d0\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4./,
                groups: ["key"]
            }
        ]
    }
}, {
    ja: a => `${a.key} is not defined`,
    ba: {
        ReferenceError: [{
            A: /(.*) is not defined/,
            groups: ["key"]
        }, {
            A: /Can't find variable: (.*)/,
            groups: ["key"]
        }]
    }
}];
var pf = {
    J: [],
    H: [{
        callback: of ,
        weight: 500
    }]
};

function of (a) {
    if ("JavaException" === a.name) return !0;
    a = a.stack;
    return a.includes("chrome://") || a.includes("chrome-extension://") || a.includes("moz-extension://")
};

function qf() {
    if (!rf) {
        var a = rf = new sf;
        a.J.length = 0;
        a.H.length = 0;
        tf(a, pf)
    }
    return rf
}

function tf(a, b) {
    b.J && a.J.push.apply(a.J, b.J);
    b.H && a.H.push.apply(a.H, b.H)
}
var sf = class {
        constructor() {
            this.H = [];
            this.J = []
        }
    },
    rf;
const uf = new H;

function vf(a) {
    const b = a.length;
    let c = 0;
    const d = () => a.charCodeAt(c++);
    do {
        var e = wf(d);
        if (Infinity === e) break;
        const f = e >> 3;
        switch (e & 7) {
            case 0:
                e = wf(d);
                if (2 === f) return e;
                break;
            case 1:
                if (2 === f) return;
                c += 8;
                break;
            case 2:
                e = wf(d);
                if (2 === f) return a.substr(c, e);
                c += e;
                break;
            case 5:
                if (2 === f) return;
                c += 4;
                break;
            default:
                return
        }
    } while (c < b)
}

function wf(a) {
    let b = a(),
        c = b & 127;
    if (128 > b) return c;
    b = a();
    c |= (b & 127) << 7;
    if (128 > b) return c;
    b = a();
    c |= (b & 127) << 14;
    if (128 > b) return c;
    b = a();
    return 128 > b ? c | (b & 127) << 21 : Infinity
};

function xf(a, b, c, d) {
    if (a)
        if (Array.isArray(a)) {
            var e = d;
            for (d = 0; d < a.length && !(a[d] && (e += yf(d, a[d], b, c), 500 < e)); d++);
            d = e
        } else if ("object" === typeof a)
        for (e in a) {
            if (a[e]) {
                var f = e;
                var g = a[e],
                    h = b,
                    k = c;
                f = "string" !== typeof g || "clickTrackingParams" !== f && "trackingParams" !== f ? 0 : (g = vf(atob(g.replace(/-/g, "+").replace(/_/g, "/")))) ? yf(`${f}.ve`, g, h, k) : 0;
                d += f;
                d += yf(e, a[e], b, c);
                if (500 < d) break
            }
        } else c[b] = zf(a), d += c[b].length;
    else c[b] = zf(a), d += c[b].length;
    return d
}

function yf(a, b, c, d) {
    c += `.${a}`;
    a = zf(b);
    d[c] = a;
    return c.length + a.length
}

function zf(a) {
    try {
        return ("string" === typeof a ? a : String(JSON.stringify(a))).substr(0, 500)
    } catch (b) {
        return `unable to serialize ${typeof a} (${b.message})`
    }
};

function Af() {
    Bf.h || (Bf.h = new Bf);
    return Bf.h
}

function Cf(a, b) {
    a = {};
    var c = [],
        d = Hc(String(u.location.href));
    var e = [];
    var f = u.__SAPISID || u.__APISID || u.__3PSAPISID || u.__OVERRIDE_SID;
    Qc() && (f = f || u.__1PSAPISID);
    if (f) var g = !0;
    else g = new Pc, f = g.get("SAPISID") || g.get("APISID") || g.get("__Secure-3PAPISID") || g.get("SID") || g.get("OSID"), Qc() && (f = f || g.get("__Secure-1PAPISID")), g = !!f;
    g && (f = (g = d = 0 == d.indexOf("https:") || 0 == d.indexOf("chrome-extension:") || 0 == d.indexOf("moz-extension:")) ? u.__SAPISID : u.__APISID, f || (f = new Pc, f = f.get(g ? "SAPISID" : "APISID") || f.get("__Secure-3PAPISID")),
        (g = f ? Lc(f, g ? "SAPISIDHASH" : "APISIDHASH", c) : null) && e.push(g), d && Qc() && ((d = Rc("__1PSAPISID", "__Secure-1PAPISID", "SAPISID1PHASH", c)) && e.push(d), (c = Rc("__3PSAPISID", "__Secure-3PAPISID", "SAPISID3PHASH", c)) && e.push(c)));
    if (e = 0 == e.length ? null : e.join(" ")) a.Authorization = e, e = b = null == b ? void 0 : b.sessionIndex, void 0 === e && (e = Number(M("SESSION_INDEX", 0)), e = isNaN(e) ? 0 : e), N("voice_search_auth_header_removal") || (a["X-Goog-AuthUser"] = e.toString()), "INNERTUBE_HOST_OVERRIDE" in Oe || (a["X-Origin"] = window.location.origin),
        void 0 === b && "DELEGATED_SESSION_ID" in Oe && (a["X-Goog-PageId"] = M("DELEGATED_SESSION_ID"));
    return a
}
var Bf = class {
    constructor() {
        this.fb = !0
    }
};
var Df = {
    identityType: "UNAUTHENTICATED_IDENTITY_TYPE_UNKNOWN"
};
v("ytglobal.prefsUserPrefsPrefs_", y("ytglobal.prefsUserPrefsPrefs_") || {});
var Ff = class {
    h(a, b) {
        Ef(a, 1, b)
    }
};

function Ef(a, b, c) {
    void 0 !== c && Number.isNaN(Number(c)) && (c = void 0);
    const d = y("yt.scheduler.instance.addJob");
    return d ? d(a, b, c) : void 0 === c ? (a(), NaN) : hf(a, c || 0)
}
var Gf = class extends Ff {
    i(a) {
        if (void 0 === a || !Number.isNaN(Number(a))) {
            var b = y("yt.scheduler.instance.cancelJob");
            b ? b(a) : window.clearTimeout(a)
        }
    }
    start() {
        const a = y("yt.scheduler.instance.start");
        a && a()
    }
};
Gf.h || (Gf.h = new Gf);
var Hf = Gf.h;
var O = class extends Error {
    constructor(a, ...b) {
        super(a);
        this.args = [...b]
    }
};

function If() {
    if (void 0 !== M("DATASYNC_ID")) return M("DATASYNC_ID");
    throw new O("Datasync ID not set", "unknown");
};
const Jf = [];
let Kf, Lf = !1;

function Mf(a) {
    Lf || (Kf ? Kf.handleError(a) : (Jf.push({
        type: "ERROR",
        payload: a
    }), 10 < Jf.length && Jf.shift()))
}

function Nf(a, b) {
    Lf || (Kf ? Kf.aa(a, b) : (Jf.push({
        type: "EVENT",
        eventType: a,
        payload: b
    }), 10 < Jf.length && Jf.shift()))
};

function Of(a) {
    if (0 <= a.indexOf(":")) throw Error("Database name cannot contain ':'");
}

function Pf(a) {
    return a.substr(0, a.indexOf(":")) || a
};
const Qf = {
        AUTH_INVALID: "No user identifier specified.",
        EXPLICIT_ABORT: "Transaction was explicitly aborted.",
        IDB_NOT_SUPPORTED: "IndexedDB is not supported.",
        MISSING_INDEX: "Index not created.",
        MISSING_OBJECT_STORES: "Object stores not created.",
        DB_DELETED_BY_MISSING_OBJECT_STORES: "Database is deleted because expected object stores were not created.",
        DB_REOPENED_BY_MISSING_OBJECT_STORES: "Database is reopened because expected object stores were not created.",
        UNKNOWN_ABORT: "Transaction was aborted for unknown reasons.",
        QUOTA_EXCEEDED: "The current transaction exceeded its quota limitations.",
        QUOTA_MAYBE_EXCEEDED: "The current transaction may have failed because of exceeding quota limitations.",
        EXECUTE_TRANSACTION_ON_CLOSED_DB: "Can't start a transaction on a closed database",
        INCOMPATIBLE_DB_VERSION: "The binary is incompatible with the database version"
    },
    Rf = {
        AUTH_INVALID: "ERROR",
        EXECUTE_TRANSACTION_ON_CLOSED_DB: "WARNING",
        EXPLICIT_ABORT: "IGNORED",
        IDB_NOT_SUPPORTED: "ERROR",
        MISSING_INDEX: "WARNING",
        MISSING_OBJECT_STORES: "ERROR",
        DB_DELETED_BY_MISSING_OBJECT_STORES: "WARNING",
        DB_REOPENED_BY_MISSING_OBJECT_STORES: "WARNING",
        QUOTA_EXCEEDED: "WARNING",
        QUOTA_MAYBE_EXCEEDED: "WARNING",
        UNKNOWN_ABORT: "WARNING",
        INCOMPATIBLE_DB_VERSION: "WARNING"
    },
    Sf = {
        AUTH_INVALID: !1,
        EXECUTE_TRANSACTION_ON_CLOSED_DB: !1,
        EXPLICIT_ABORT: !1,
        IDB_NOT_SUPPORTED: !1,
        MISSING_INDEX: !1,
        MISSING_OBJECT_STORES: !1,
        DB_DELETED_BY_MISSING_OBJECT_STORES: !1,
        DB_REOPENED_BY_MISSING_OBJECT_STORES: !1,
        QUOTA_EXCEEDED: !1,
        QUOTA_MAYBE_EXCEEDED: !0,
        UNKNOWN_ABORT: !0,
        INCOMPATIBLE_DB_VERSION: !1
    };
var P = class extends O {
        constructor(a, b = {}, c = Qf[a], d = Rf[a], e = Sf[a]) {
            super(c, Object.assign({}, {
                name: "YtIdbKnownError",
                isSw: void 0 === self.document,
                isIframe: self !== self.top,
                type: a
            }, b));
            this.type = a;
            this.message = c;
            this.level = d;
            this.h = e;
            Object.setPrototypeOf(this, P.prototype)
        }
    },
    Tf = class extends P {
        constructor(a, b) {
            super("MISSING_OBJECT_STORES", {
                expectedObjectStores: b,
                foundObjectStores: a
            }, Qf.MISSING_OBJECT_STORES);
            Object.setPrototypeOf(this, Tf.prototype)
        }
    },
    Uf = class extends Error {
        constructor(a, b) {
            super();
            this.index =
                a;
            this.objectStore = b;
            Object.setPrototypeOf(this, Uf.prototype)
        }
    };
const Vf = ["The database connection is closing", "Can't start a transaction on a closed database", "A mutation operation was attempted on a database that did not allow mutations"];

function Wf(a, b, c, d) {
    b = Pf(b);
    let e;
    e = a instanceof Error ? a : Error(`Unexpected error: ${a}`);
    if (e instanceof P) return e;
    a = {
        objectStoreNames: c,
        dbName: b,
        dbVersion: d
    };
    if ("QuotaExceededError" === e.name) return new P("QUOTA_EXCEEDED", a);
    if (Qa && "UnknownError" === e.name) return new P("QUOTA_MAYBE_EXCEEDED", a);
    if (e instanceof Uf) return new P("MISSING_INDEX", Object.assign({}, a, {
        objectStore: e.objectStore,
        index: e.index
    }));
    if ("InvalidStateError" === e.name && Vf.some(f => e.message.includes(f))) return new P("EXECUTE_TRANSACTION_ON_CLOSED_DB",
        a);
    if ("AbortError" === e.name) return new P("UNKNOWN_ABORT", a, e.message);
    e.args = [Object.assign({}, a, {
        name: "IdbError",
        bc: e.name
    })];
    e.level = "WARNING";
    return e
}

function Xf(a, b, c) {
    return new P("IDB_NOT_SUPPORTED", {
        context: {
            caller: a,
            publicName: b,
            version: c,
            hasSucceededOnce: void 0
        }
    })
};

function Yf(a) {
    if (!a) throw Error();
    throw a;
}

function Zf(a) {
    return a
}
var $f = class {
    constructor(a) {
        this.h = a
    }
};

function ag(a, b, c, d, e) {
    try {
        if ("FULFILLED" !== a.state.status) throw Error("calling handleResolve before the promise is fulfilled.");
        const f = c(a.state.value);
        f instanceof bg ? cg(a, b, f, d, e) : d(f)
    } catch (f) {
        e(f)
    }
}

function dg(a, b, c, d, e) {
    try {
        if ("REJECTED" !== a.state.status) throw Error("calling handleReject before the promise is rejected.");
        const f = c(a.state.reason);
        f instanceof bg ? cg(a, b, f, d, e) : d(f)
    } catch (f) {
        e(f)
    }
}

function cg(a, b, c, d, e) {
    b === c ? e(new TypeError("Circular promise chain detected.")) : c.then(f => {
        f instanceof bg ? cg(a, b, f, d, e) : d(f)
    }, f => {
        e(f)
    })
}
var bg = class {
    constructor(a) {
        this.state = {
            status: "PENDING"
        };
        this.h = [];
        this.i = [];
        a = a.h;
        const b = d => {
                if ("PENDING" === this.state.status) {
                    this.state = {
                        status: "FULFILLED",
                        value: d
                    };
                    for (const e of this.h) e()
                }
            },
            c = d => {
                if ("PENDING" === this.state.status) {
                    this.state = {
                        status: "REJECTED",
                        reason: d
                    };
                    for (const e of this.i) e()
                }
            };
        try {
            a(b, c)
        } catch (d) {
            c(d)
        }
    }
    static all(a) {
        return new bg(new $f((b, c) => {
            const d = [];
            let e = a.length;
            0 === e && b(d);
            for (let f = 0; f < a.length; ++f) bg.resolve(a[f]).then(g => {
                d[f] = g;
                e--;
                0 === e && b(d)
            }).catch(g => {
                c(g)
            })
        }))
    }
    static resolve(a) {
        return new bg(new $f((b, c) => {
            a instanceof bg ? a.then(b, c) : b(a)
        }))
    }
    then(a, b) {
        const c = null != a ? a : Zf,
            d = null != b ? b : Yf;
        return new bg(new $f((e, f) => {
            "PENDING" === this.state.status ? (this.h.push(() => {
                ag(this, this, c, e, f)
            }), this.i.push(() => {
                dg(this, this, d, e, f)
            })) : "FULFILLED" === this.state.status ? ag(this, this, c, e, f) : "REJECTED" === this.state.status && dg(this, this, d, e, f)
        }))
    } catch (a) {
        return this.then(void 0, a)
    }
};

function eg(a, b, c) {
    const d = () => {
            try {
                a.removeEventListener("success", e), a.removeEventListener("error", f)
            } catch (g) {}
        },
        e = () => {
            b(a.result);
            d()
        },
        f = () => {
            c(a.error);
            d()
        };
    a.addEventListener("success", e);
    a.addEventListener("error", f)
}

function fg(a) {
    return new Promise((b, c) => {
        eg(a, b, c)
    })
}

function Q(a) {
    return new bg(new $f((b, c) => {
        eg(a, b, c)
    }))
};

function gg(a, b) {
    return new bg(new $f((c, d) => {
        const e = () => {
            const f = a ? b(a) : null;
            f ? f.then(g => {
                a = g;
                e()
            }, d) : c()
        };
        e()
    }))
};
const hg = window;
var R = hg.ytcsi && hg.ytcsi.now ? hg.ytcsi.now : hg.performance && hg.performance.timing && hg.performance.now && hg.performance.timing.navigationStart ? () => hg.performance.timing.navigationStart + hg.performance.now() : () => (new Date).getTime();

function S(a, b, c, d) {
    return r(function*() {
        const e = {
            mode: "readonly",
            F: !1,
            tag: "IDB_TRANSACTION_TAG_UNKNOWN"
        };
        "string" === typeof c ? e.mode = c : Object.assign(e, c);
        a.transactionCount++;
        const f = e.F ? 3 : 1;
        let g = 0,
            h;
        for (; !h;) {
            g++;
            const l = Math.round(R());
            try {
                const m = a.h.transaction(b, e.mode);
                var k = d;
                const p = new ig(m),
                    t = yield jg(p, k), n = Math.round(R());
                kg(a, l, n, g, void 0, b.join(), e);
                return t
            } catch (m) {
                k = Math.round(R());
                const p = Wf(m, a.h.name, b.join(), a.h.version);
                if (p instanceof P && !p.h || g >= f) kg(a, l, k, g, p, b.join(), e),
                    h = p
            }
        }
        return Promise.reject(h)
    })
}

function lg(a, b, c) {
    a = a.h.createObjectStore(b, c);
    return new mg(a)
}

function ng(a, b, c, d) {
    return S(a, [b], {
        mode: "readwrite",
        F: !0
    }, e => {
        e = e.objectStore(b);
        return Q(e.h.put(c, d))
    })
}

function kg(a, b, c, d, e, f, g) {
    b = c - b;
    e ? (e instanceof P && ("QUOTA_EXCEEDED" === e.type || "QUOTA_MAYBE_EXCEEDED" === e.type) && Nf("QUOTA_EXCEEDED", {
        dbName: Pf(a.h.name),
        objectStoreNames: f,
        transactionCount: a.transactionCount,
        transactionMode: g.mode
    }), e instanceof P && "UNKNOWN_ABORT" === e.type && (c -= a.j, 0 > c && c >= Math.pow(2, 31) && (c = 0), Nf("TRANSACTION_UNEXPECTEDLY_ABORTED", {
        objectStoreNames: f,
        transactionDuration: b,
        transactionCount: a.transactionCount,
        dbDuration: c
    }), a.i = !0), og(a, !1, d, f, b, g.tag), Mf(e)) : og(a, !0, d, f, b, g.tag)
}

function og(a, b, c, d, e, f = "IDB_TRANSACTION_TAG_UNKNOWN") {
    Nf("TRANSACTION_ENDED", {
        objectStoreNames: d,
        connectionHasUnknownAbortedTransaction: a.i,
        duration: e,
        isSuccessful: b,
        tryCount: c,
        tag: f
    })
}
var pg = class {
    constructor(a, b) {
        this.h = a;
        this.options = b;
        this.transactionCount = 0;
        this.j = Math.round(R());
        this.i = !1
    }
    add(a, b, c) {
        return S(this, [a], {
            mode: "readwrite",
            F: !0
        }, d => d.objectStore(a).add(b, c))
    }
    clear(a) {
        return S(this, [a], {
            mode: "readwrite",
            F: !0
        }, b => b.objectStore(a).clear())
    }
    close() {
        this.h.close();
        let a;
        (null == (a = this.options) ? 0 : a.closed) && this.options.closed()
    }
    count(a, b) {
        return S(this, [a], {
            mode: "readonly",
            F: !0
        }, c => c.objectStore(a).count(b))
    }
    delete(a, b) {
        return S(this, [a], {
            mode: "readwrite",
            F: !0
        }, c => c.objectStore(a).delete(b))
    }
    get(a, b) {
        return S(this, [a], {
            mode: "readonly",
            F: !0
        }, c => c.objectStore(a).get(b))
    }
    objectStoreNames() {
        return Array.from(this.h.objectStoreNames)
    }
    getName() {
        return this.h.name
    }
};

function qg(a, b, c) {
    a = a.h.openCursor(b.query, b.direction);
    return rg(a).then(d => gg(d, c))
}

function sg(a, b) {
    return qg(a, {
        query: b
    }, c => c.delete().then(() => c.continue())).then(() => {})
}
var mg = class {
    constructor(a) {
        this.h = a
    }
    add(a, b) {
        return Q(this.h.add(a, b))
    }
    autoIncrement() {
        return this.h.autoIncrement
    }
    clear() {
        return Q(this.h.clear()).then(() => {})
    }
    count(a) {
        return Q(this.h.count(a))
    }
    delete(a) {
        return a instanceof IDBKeyRange ? sg(this, a) : Q(this.h.delete(a))
    }
    get(a) {
        return Q(this.h.get(a))
    }
    index(a) {
        try {
            return new tg(this.h.index(a))
        } catch (b) {
            if (b instanceof Error && "NotFoundError" === b.name) throw new Uf(a, this.h.name);
            throw b;
        }
    }
    getName() {
        return this.h.name
    }
    keyPath() {
        return this.h.keyPath
    }
};

function jg(a, b) {
    const c = new Promise((d, e) => {
        try {
            b(a).then(f => {
                d(f)
            }).catch(e)
        } catch (f) {
            e(f), a.abort()
        }
    });
    return Promise.all([c, a.done]).then(([d]) => d)
}
var ig = class {
    constructor(a) {
        this.h = a;
        this.j = new Map;
        this.i = !1;
        this.done = new Promise((b, c) => {
            this.h.addEventListener("complete", () => {
                b()
            });
            this.h.addEventListener("error", d => {
                d.currentTarget === d.target && c(this.h.error)
            });
            this.h.addEventListener("abort", () => {
                var d = this.h.error;
                if (d) c(d);
                else if (!this.i) {
                    d = P;
                    var e = this.h.objectStoreNames;
                    const f = [];
                    for (let g = 0; g < e.length; g++) {
                        const h = e.item(g);
                        if (null === h) throw Error("Invariant: item in DOMStringList is null");
                        f.push(h)
                    }
                    d = new d("UNKNOWN_ABORT", {
                        objectStoreNames: f.join(),
                        dbName: this.h.db.name,
                        mode: this.h.mode
                    });
                    c(d)
                }
            })
        })
    }
    abort() {
        this.h.abort();
        this.i = !0;
        throw new P("EXPLICIT_ABORT");
    }
    objectStore(a) {
        a = this.h.objectStore(a);
        let b = this.j.get(a);
        b || (b = new mg(a), this.j.set(a, b));
        return b
    }
};

function ug(a, b, c) {
    const {
        query: d = null,
        direction: e = "next"
    } = b;
    a = a.h.openCursor(d, e);
    return rg(a).then(f => gg(f, c))
}
var tg = class {
    constructor(a) {
        this.h = a
    }
    count(a) {
        return Q(this.h.count(a))
    }
    delete(a) {
        return ug(this, {
            query: a
        }, b => b.delete().then(() => b.continue()))
    }
    get(a) {
        return Q(this.h.get(a))
    }
    getKey(a) {
        return Q(this.h.getKey(a))
    }
    keyPath() {
        return this.h.keyPath
    }
    unique() {
        return this.h.unique
    }
};

function rg(a) {
    return Q(a).then(b => b ? new vg(a, b) : null)
}
var vg = class {
    constructor(a, b) {
        this.request = a;
        this.cursor = b
    }
    advance(a) {
        this.cursor.advance(a);
        return rg(this.request)
    }
    continue (a) {
        this.cursor.continue(a);
        return rg(this.request)
    }
    delete() {
        return Q(this.cursor.delete()).then(() => {})
    }
    getKey() {
        return this.cursor.key
    }
    R() {
        return this.cursor.value
    }
    update(a) {
        return Q(this.cursor.update(a))
    }
};

function wg(a, b, c) {
    return new Promise((d, e) => {
        let f;
        f = void 0 !== b ? self.indexedDB.open(a, b) : self.indexedDB.open(a);
        const g = c.Ma,
            h = c.blocking,
            k = c.gb,
            l = c.upgrade,
            m = c.closed;
        let p;
        const t = () => {
            p || (p = new pg(f.result, {
                closed: m
            }));
            return p
        };
        f.addEventListener("upgradeneeded", n => {
            try {
                if (null === n.newVersion) throw Error("Invariant: newVersion on IDbVersionChangeEvent is null");
                if (null === f.transaction) throw Error("Invariant: transaction on IDbOpenDbRequest is null");
                n.dataLoss && "none" !== n.dataLoss && Nf("IDB_DATA_CORRUPTED", {
                    reason: n.dataLossMessage || "unknown reason",
                    dbName: Pf(a)
                });
                const x = t(),
                    w = new ig(f.transaction);
                l && l(x, E => n.oldVersion < E && n.newVersion >= E, w);
                w.done.catch(E => {
                    e(E)
                })
            } catch (x) {
                e(x)
            }
        });
        f.addEventListener("success", () => {
            const n = f.result;
            h && n.addEventListener("versionchange", () => {
                h(t())
            });
            n.addEventListener("close", () => {
                Nf("IDB_UNEXPECTEDLY_CLOSED", {
                    dbName: Pf(a),
                    dbVersion: n.version
                });
                k && k()
            });
            d(t())
        });
        f.addEventListener("error", () => {
            e(f.error)
        });
        g && f.addEventListener("blocked", () => {
            g()
        })
    })
}

function xg(a, b, c = {}) {
    return wg(a, b, c)
}

function yg(a, b = {}) {
    return r(function*() {
        try {
            const c = self.indexedDB.deleteDatabase(a),
                d = b.Ma;
            d && c.addEventListener("blocked", () => {
                d()
            });
            yield fg(c)
        } catch (c) {
            throw Wf(c, a, "", -1);
        }
    })
};

function zg(a, b) {
    return new P("INCOMPATIBLE_DB_VERSION", {
        dbName: a.name,
        oldVersion: a.options.version,
        newVersion: b
    })
}

function Ag(a, b) {
    if (!b) throw Xf("openWithToken", Pf(a.name));
    return a.open()
}
var Bg = class {
    constructor(a, b) {
        this.name = a;
        this.options = b;
        this.j = !0;
        this.m = this.l = 0
    }
    i(a, b, c = {}) {
        return xg(a, b, c)
    }
    delete(a = {}) {
        return yg(this.name, a)
    }
    open() {
        if (!this.j) throw zg(this);
        if (this.h) return this.h;
        let a;
        const b = () => {
                this.h === a && (this.h = void 0)
            },
            c = {
                blocking: e => {
                    e.close()
                },
                closed: b,
                gb: b,
                upgrade: this.options.upgrade
            },
            d = () => {
                const e = this;
                return r(function*() {
                    var f, g = null != (f = Error().stack) ? f : "";
                    try {
                        const k = yield e.i(e.name, e.options.version, c);
                        f = k;
                        var h = e.options;
                        const l = [];
                        for (const m of Object.keys(h.P)) {
                            const {
                                O: p,
                                ic: t = Number.MAX_VALUE
                            } = h.P[m];
                            !(f.h.version >= p) || f.h.version >= t || f.h.objectStoreNames.contains(m) || l.push(m)
                        }
                        if (0 !== l.length) {
                            const m = Object.keys(e.options.P),
                                p = k.objectStoreNames();
                            if (e.m < Se("ytidb_reopen_db_retries", 0)) return e.m++, k.close(), Mf(new P("DB_REOPENED_BY_MISSING_OBJECT_STORES", {
                                dbName: e.name,
                                expectedObjectStores: m,
                                foundObjectStores: p
                            })), d();
                            if (e.l < Se("ytidb_remake_db_retries", 1)) return e.l++, yield e.delete(), Mf(new P("DB_DELETED_BY_MISSING_OBJECT_STORES", {
                                dbName: e.name,
                                expectedObjectStores: m,
                                foundObjectStores: p
                            })), d();
                            throw new Tf(p, m);
                        }
                        return k
                    } catch (k) {
                        if (k instanceof DOMException ? "VersionError" === k.name : "DOMError" in self && k instanceof DOMError ? "VersionError" === k.name : k instanceof Object && "message" in k && "An attempt was made to open a database using a lower version than the existing version." ===
                            k.message) {
                            g = yield e.i(e.name, void 0, Object.assign({}, c, {
                                upgrade: void 0
                            }));
                            h = g.h.version;
                            if (void 0 !== e.options.version && h > e.options.version + 1) throw g.close(), e.j = !1, zg(e, h);
                            return g
                        }
                        b();
                        k instanceof Error && !N("ytidb_async_stack_killswitch") && (k.stack = `${k.stack}\n${g.substring(g.indexOf("\n")+1)}`);
                        let l;
                        throw Wf(k, e.name, "", null != (l = e.options.version) ? l : -1);
                    }
                })
            };
        return this.h = a = d()
    }
};
const Cg = new Bg("YtIdbMeta", {
    P: {
        databases: {
            O: 1
        }
    },
    upgrade(a, b) {
        b(1) && lg(a, "databases", {
            keyPath: "actualName"
        })
    }
});

function Dg(a, b) {
    return r(function*() {
        return S(yield Ag(Cg, b), ["databases"], {
            F: !0,
            mode: "readwrite"
        }, c => {
            const d = c.objectStore("databases");
            return d.get(a.actualName).then(e => {
                if (e ? a.actualName !== e.actualName || a.publicName !== e.publicName || a.userIdentifier !== e.userIdentifier : 1) return Q(d.h.put(a, void 0)).then(() => {})
            })
        })
    })
}

function Eg(a, b) {
    return r(function*() {
        if (a) return (yield Ag(Cg, b)).delete("databases", a)
    })
};
let Fg;
const Gg = new class {
    constructor() {}
}(new class {
    constructor() {}
});

function Hg() {
    return r(function*() {
        return !0
    })
}

function Ig() {
    if (void 0 !== Fg) return Fg;
    Lf = !0;
    return Fg = Hg().then(a => {
        Lf = !1;
        return a
    })
}

function Jg() {
    return y("ytglobal.idbToken_") || void 0
}

function Kg() {
    const a = Jg();
    return a ? Promise.resolve(a) : Ig().then(b => {
        (b = b ? Gg : void 0) && v("ytglobal.idbToken_", b);
        return b
    })
};
new ed;

function Lg(a) {
    try {
        If();
        var b = !0
    } catch (c) {
        b = !1
    }
    if (!b) throw a = new P("AUTH_INVALID", {
        dbName: a
    }), Mf(a), a;
    b = If();
    return {
        actualName: `${a}:${b}`,
        publicName: a,
        userIdentifier: b
    }
}

function Mg(a, b, c, d) {
    return r(function*() {
        var e, f = null != (e = Error().stack) ? e : "";
        e = yield Kg();
        if (!e) throw e = Xf("openDbImpl", a, b), N("ytidb_async_stack_killswitch") || (e.stack = `${e.stack}\n${f.substring(f.indexOf("\n")+1)}`), Mf(e), e;
        Of(a);
        f = c ? {
            actualName: a,
            publicName: a,
            userIdentifier: void 0
        } : Lg(a);
        try {
            return yield Dg(f, e), yield xg(f.actualName, b, d)
        } catch (g) {
            try {
                yield Eg(f.actualName, e)
            } catch (h) {}
            throw g;
        }
    })
}

function Ng(a, b, c = {}) {
    return Mg(a, b, !1, c)
}

function Og(a, b, c = {}) {
    return Mg(a, b, !0, c)
}

function Pg(a, b = {}) {
    return r(function*() {
        const c = yield Kg();
        if (c) {
            Of(a);
            var d = Lg(a);
            yield yg(d.actualName, b);
            yield Eg(d.actualName, c)
        }
    })
}

function Qg(a, b = {}) {
    return r(function*() {
        const c = yield Kg();
        c && (Of(a), yield yg(a, b), yield Eg(a, c))
    })
};

function Rg(a, b) {
    let c;
    return () => {
        c || (c = new Sg(a, b));
        return c
    }
}
var Sg = class extends Bg {
    constructor(a, b) {
        super(a, b);
        this.options = b;
        Of(a)
    }
    i(a, b, c = {}) {
        return (this.options.ea ? Og : Ng)(a, b, Object.assign({}, c))
    }
    delete(a = {}) {
        return (this.options.ea ? Qg : Pg)(this.name, a)
    }
};

function Tg(a, b) {
    return Rg(a, b)
};
var Ug = Tg("ytGcfConfig", {
    P: {
        coldConfigStore: {
            O: 1
        },
        hotConfigStore: {
            O: 1
        }
    },
    ea: !1,
    upgrade(a, b) {
        b(1) && (lg(a, "hotConfigStore", {
            keyPath: "key",
            autoIncrement: !0
        }).h.createIndex("hotTimestampIndex", "timestamp", {
            unique: !1
        }), lg(a, "coldConfigStore", {
            keyPath: "key",
            autoIncrement: !0
        }).h.createIndex("coldTimestampIndex", "timestamp", {
            unique: !1
        }))
    },
    version: 1
});

function Vg(a) {
    return Ag(Ug(), a)
}

function Wg(a, b, c) {
    return r(function*() {
        const d = {
                config: a,
                hashData: b,
                timestamp: R()
            },
            e = yield Vg(c);
        yield e.clear("hotConfigStore");
        return yield ng(e, "hotConfigStore", d)
    })
}

function Xg(a, b, c, d) {
    return r(function*() {
        const e = {
                config: a,
                hashData: b,
                configData: c,
                timestamp: R()
            },
            f = yield Vg(d);
        yield f.clear("coldConfigStore");
        return yield ng(f, "coldConfigStore", e)
    })
}

function Yg(a) {
    return r(function*() {
        let b = void 0;
        yield S(yield Vg(a), ["coldConfigStore"], {
            mode: "readwrite",
            F: !0
        }, c => ug(c.objectStore("coldConfigStore").index("coldTimestampIndex"), {
            direction: "prev"
        }, d => {
            b = d.R()
        }));
        return b
    })
}

function Zg(a) {
    return r(function*() {
        let b = void 0;
        yield S(yield Vg(a), ["hotConfigStore"], {
            mode: "readwrite",
            F: !0
        }, c => ug(c.objectStore("hotConfigStore").index("hotTimestampIndex"), {
            direction: "prev"
        }, d => {
            b = d.R()
        }));
        return b
    })
};

function $g(a, b, c) {
    return r(function*() {
        if (N("update_log_event_config")) {
            c && (a.i = c, v("yt.gcf.config.hotConfigGroup", a.i));
            a.hotHashData = b;
            v("yt.gcf.config.hotHashData", a.hotHashData);
            const d = Jg();
            if (d) {
                if (!c) {
                    let e;
                    c = null == (e = yield Zg(d)) ? void 0 : e.config
                }
                yield Wg(c, b, d)
            }
        }
    })
}

function ah(a, b, c) {
    return r(function*() {
        if (N("update_log_event_config")) {
            a.coldHashData = b;
            v("yt.gcf.config.coldHashData", a.coldHashData);
            const d = Jg();
            if (d) {
                if (!c) {
                    let e;
                    c = null == (e = yield Yg(d)) ? void 0 : e.config
                }
                c && (yield Xg(c, b, c.configData, d))
            }
        }
    })
}
var bh = class {
    constructor() {
        this.h = 0
    }
};

function ch() {
    return "INNERTUBE_API_KEY" in Oe && "INNERTUBE_API_VERSION" in Oe
}

function dh() {
    return {
        innertubeApiKey: M("INNERTUBE_API_KEY"),
        innertubeApiVersion: M("INNERTUBE_API_VERSION"),
        ha: M("INNERTUBE_CONTEXT_CLIENT_CONFIG_INFO"),
        Ta: M("INNERTUBE_CONTEXT_CLIENT_NAME", "WEB"),
        Ua: M("INNERTUBE_CONTEXT_CLIENT_NAME", 1),
        innertubeContextClientVersion: M("INNERTUBE_CONTEXT_CLIENT_VERSION"),
        va: M("INNERTUBE_CONTEXT_HL"),
        ta: M("INNERTUBE_CONTEXT_GL"),
        Va: M("INNERTUBE_HOST_OVERRIDE") || "",
        Xa: !!M("INNERTUBE_USE_THIRD_PARTY_AUTH", !1),
        Wa: !!M("INNERTUBE_OMIT_API_KEY_WHEN_AUTH_HEADER_IS_PRESENT", !1),
        appInstallData: M("SERIALIZED_CLIENT_CONFIG_DATA")
    }
}

function eh(a) {
    const b = {
        client: {
            hl: a.va,
            gl: a.ta,
            clientName: a.Ta,
            clientVersion: a.innertubeContextClientVersion,
            configInfo: a.ha
        }
    };
    navigator.userAgent && (b.client.userAgent = String(navigator.userAgent));
    var c = u.devicePixelRatio;
    c && 1 != c && (b.client.screenDensityFloat = String(c));
    c = Te();
    "" !== c && (b.client.experimentsToken = c);
    c = Ue();
    0 < c.length && (b.request = {
        internalExperimentFlags: c
    });
    N("enable_third_party_info") && fh(void 0, b);
    gh(a, void 0, b);
    N("start_sending_config_hash") && hh(void 0, b);
    M("DELEGATED_SESSION_ID") &&
        !N("pageid_as_header_web") && (b.user = {
            onBehalfOfUser: M("DELEGATED_SESSION_ID")
        });
    a = Object;
    c = a.assign;
    var d = b.client,
        e = M("DEVICE", "");
    const f = {};
    for (const [g, h] of Object.entries(ef(e))) {
        e = g;
        const k = h;
        "cbrand" === e ? f.deviceMake = k : "cmodel" === e ? f.deviceModel = k : "cbr" === e ? f.browserName = k : "cbrver" === e ? f.browserVersion = k : "cos" === e ? f.osName = k : "cosver" === e ? f.osVersion = k : "cplatform" === e && (f.platform = k)
    }
    b.client = c.call(a, d, f);
    return b
}

function ih(a) {
    const b = new Wd,
        c = new Nd;
    C(c, 1, a.va);
    C(c, 2, a.ta);
    C(c, 16, a.Ua);
    C(c, 17, a.innertubeContextClientVersion);
    if (a.ha) {
        var d = a.ha,
            e = new Jd;
        d.coldConfigData && C(e, 1, d.coldConfigData);
        d.appInstallData && C(e, 6, d.appInstallData);
        d.coldHashData && C(e, 3, d.coldHashData);
        d.hotHashData && C(e, 5, d.hotHashData);
        D(c, Jd, 62, e)
    }
    if ((d = u.devicePixelRatio) && 1 != d) {
        if (null != d && "number" !== typeof d) throw Error(`Value of float/double field must be a number|null|undefined, found ${typeof d}: ${d}`);
        C(c, 65, d)
    }
    d = Te();
    "" !==
    d && C(c, 54, d);
    d = Ue();
    if (0 < d.length) {
        e = new Pd;
        for (let f = 0; f < d.length; f++) {
            const g = new Id;
            C(g, 1, d[f].key);
            Ab(g, 2, Hd, d[f].value);
            Hb(e, 15, Id, g)
        }
        D(b, Pd, 5, e)
    }
    N("enable_third_party_info") && fh(b);
    gh(a, c);
    N("start_sending_config_hash") && hh(c);
    M("DELEGATED_SESSION_ID") && !N("pageid_as_header_web") && (a = new Ud, C(a, 3, M("DELEGATED_SESSION_ID")));
    a = M("DEVICE", "");
    for (const [f, g] of Object.entries(ef(a))) a = f, d = g, "cbrand" === a ? C(c, 12, d) : "cmodel" === a ? C(c, 13, d) : "cbr" === a ? C(c, 87, d) : "cbrver" === a ? C(c, 88, d) : "cos" === a ? C(c, 18,
        d) : "cosver" === a ? C(c, 19, d) : "cplatform" === a && C(c, 42, d);
    b.j(c);
    return b
}

function fh(a, b) {
    const c = y("yt.embedded_player.embed_url");
    c && (a ? (b = Cb(a, Rd, 7) || new Rd, C(b, 4, c), D(a, Rd, 7, b)) : b && (b.thirdParty = {
        embedUrl: c
    }))
}

function gh(a, b, c) {
    if (a.appInstallData)
        if (b) {
            let d;
            c = null != (d = Cb(b, Jd, 62)) ? d : new Jd;
            C(c, 6, a.appInstallData);
            D(b, Jd, 62, c)
        } else c && (c.client.configInfo = c.client.configInfo || {}, c.client.configInfo.appInstallData = a.appInstallData)
}

function jh(a, b, c = {}) {
    let d = {};
    M("EOM_VISITOR_DATA") ? d = {
        "X-Goog-EOM-Visitor-Id": M("EOM_VISITOR_DATA")
    } : d = {
        "X-Goog-Visitor-Id": c.visitorData || M("VISITOR_DATA", "")
    };
    if (b && b.includes("www.youtube-nocookie.com")) return d;
    b = c.Nb || M("AUTHORIZATION");
    b || (a ? b = `Bearer ${y("gapi.auth.getToken")().Mb}` : (a = Cf(Af()), N("pageid_as_header_web") || delete a["X-Goog-PageId"], d = Object.assign({}, d, a)));
    b && (d.Authorization = b);
    return d
}

function hh(a, b) {
    bh.h || (bh.h = new bh);
    var c = bh.h;
    var d = R() - c.h;
    0 !== c.h && d < Se("send_config_hash_timer") ? c = void 0 : (c.h = R(), c = {
        coldConfigData: y("yt.gcf.config.coldConfigData"),
        hotHashData: y("yt.gcf.config.hotHashData"),
        coldHashData: y("yt.gcf.config.coldHashData")
    });
    var e = c;
    if (e && (c = e.coldConfigData, d = e.coldHashData, e = e.hotHashData, c && d && e))
        if (a) {
            let f;
            b = null != (f = Cb(a, Jd, 62)) ? f : new Jd;
            C(b, 1, c);
            C(b, 3, d);
            C(b, 5, e);
            D(a, Jd, 62, b)
        } else b && (b.client.configInfo = b.client.configInfo || {}, b.client.configInfo.coldConfigData =
            c, b.client.configInfo.coldHashData = d, b.client.configInfo.hotHashData = e)
};

function kh(a) {
    this.version = 1;
    this.args = a
};

function lh() {
    var a = mh;
    this.topic = "screen-created";
    this.h = a
}
lh.prototype.toString = function() {
    return this.topic
};
const nh = y("ytPubsub2Pubsub2Instance") || new H;
H.prototype.subscribe = H.prototype.Ia;
H.prototype.unsubscribeByKey = H.prototype.na;
H.prototype.publish = H.prototype.la;
H.prototype.clear = H.prototype.clear;
v("ytPubsub2Pubsub2Instance", nh);
const oh = y("ytPubsub2Pubsub2SubscribedKeys") || {};
v("ytPubsub2Pubsub2SubscribedKeys", oh);
const ph = y("ytPubsub2Pubsub2TopicToKeys") || {};
v("ytPubsub2Pubsub2TopicToKeys", ph);
const qh = y("ytPubsub2Pubsub2IsAsync") || {};
v("ytPubsub2Pubsub2IsAsync", qh);
v("ytPubsub2Pubsub2SkipSubKey", null);

function rh(a) {
    var b = sh;
    const c = th();
    c && c.publish.call(c, b.toString(), b, a)
}

function uh(a) {
    var b = sh;
    const c = th();
    if (!c) return 0;
    const d = c.subscribe(b.toString(), (e, f) => {
        var g = y("ytPubsub2Pubsub2SkipSubKey");
        g && g == d || (g = () => {
            if (oh[d]) try {
                if (f && b instanceof lh && b != e) try {
                    var h = b.h,
                        k = f;
                    if (!k.args || !k.version) throw Error("yt.pubsub2.Data.deserialize(): serializedData is incomplete.");
                    try {
                        if (!h.Ba) {
                            const n = new h;
                            h.Ba = n.version
                        }
                        var l = h.Ba
                    } catch (n) {}
                    if (!l || k.version != l) throw Error("yt.pubsub2.Data.deserialize(): serializedData version is incompatible.");
                    try {
                        l = Reflect;
                        var m = l.construct; {
                            var p = k.args;
                            const n = p.length;
                            if (0 < n) {
                                const x = Array(n);
                                for (k = 0; k < n; k++) x[k] = p[k];
                                var t = x
                            } else t = []
                        }
                        f = m.call(l, h, t)
                    } catch (n) {
                        throw n.message = "yt.pubsub2.Data.deserialize(): " + n.message, n;
                    }
                } catch (n) {
                    throw n.message = "yt.pubsub2.pubsub2 cross-binary conversion error for " + b.toString() + ": " + n.message, n;
                }
                a.call(window, f)
            } catch (n) {
                Ye(n)
            }
        }, qh[b.toString()] ? y("yt.scheduler.instance") ? Hf.h(g) : hf(g, 0) : g())
    });
    oh[d] = !0;
    ph[b.toString()] || (ph[b.toString()] = []);
    ph[b.toString()].push(d);
    return d
}

function vh() {
    var a = wh;
    const b = uh(function(c) {
        a.apply(void 0, arguments);
        zh(b)
    });
    return b
}

function zh(a) {
    const b = th();
    b && ("number" === typeof a && (a = [a]), qa(a, c => {
        b.unsubscribeByKey(c);
        delete oh[c]
    }))
}

function th() {
    return y("ytPubsub2Pubsub2Instance")
};
const Ah = ["client.name", "client.version"];

function Bh(a) {
    if (!a.errorMetadata || !a.errorMetadata.kvPairs) return a;
    a.errorMetadata.kvPairs = a.errorMetadata.kvPairs.filter(b => b.key ? Ah.includes(b.key) : !1);
    return a
};
var Ch = Tg("ServiceWorkerLogsDatabase", {
    P: {
        SWHealthLog: {
            O: 1
        }
    },
    ea: !0,
    upgrade: (a, b) => {
        b(1) && lg(a, "SWHealthLog", {
            keyPath: "id",
            autoIncrement: !0
        }).h.createIndex("swHealthNewRequest", ["interface", "timestamp"], {
            unique: !1
        })
    },
    version: 1
});

function Dh(a, b) {
    return r(function*() {
        var c = yield Ag(Ch(), b), d = M("INNERTUBE_CONTEXT_CLIENT_NAME", 0);
        const e = Object.assign({}, a);
        e.clientError && (e.clientError = Bh(e.clientError));
        e.interface = d;
        return ng(c, "SWHealthLog", e)
    })
};
v("ytNetworklessLoggingInitializationOptions", u.ytNetworklessLoggingInitializationOptions || {
    isNwlInitialized: !1
});

function Eh(a, b, c) {
    !M("VISITOR_DATA") && .01 > Math.random() && Ze(new O("Missing VISITOR_DATA when sending innertube request.", "log_event", b, c));
    if (!a.isReady()) throw a = new O("innertube xhrclient not ready", "log_event", b, c), Ye(a), a;
    b = {
        headers: c.headers || {},
        method: "POST",
        postParams: b,
        postBody: c.postBody,
        postBodyFormat: c.postBodyFormat || "JSON",
        onTimeout: () => {
            c.onTimeout()
        },
        onFetchTimeout: c.onTimeout,
        onSuccess: (k, l) => {
            if (c.onSuccess) c.onSuccess(l)
        },
        onFetchSuccess: k => {
            if (c.onSuccess) c.onSuccess(k)
        },
        onError: (k, l) => {
            if (c.onError) c.onError(l)
        },
        onFetchError: k => {
            if (c.onError) c.onError(k)
        },
        timeout: c.timeout,
        withCredentials: !0,
        compress: c.compress
    };
    b.headers["Content-Type"] || (b.headers["Content-Type"] = "application/json");
    let d = "";
    var e = a.config_.Va;
    e && (d = e);
    var f = a.config_.Xa || !1;
    e = jh(f, d, c);
    Object.assign(b.headers, e);
    (e = b.headers.Authorization) && !d && f && (b.headers["x-origin"] = window.location.origin);
    f = `/${"youtubei"}/${a.config_.innertubeApiVersion}/${"log_event"}`;
    let g = {
            alt: "json"
        },
        h = a.config_.Wa && e;
    h = h && e.startsWith("Bearer");
    h || (g.key = a.config_.innertubeApiKey);
    a = ff(`${d}${f}`, g || {}, !0);
    try {
        kf(a, b)
    } catch (k) {
        if ("InvalidAccessError" == k.name) Ze(Error("An extension is blocking network request."));
        else throw k;
    }
}
class Fh {
    constructor(a) {
        this.config_ = null;
        a ? this.config_ = a : ch() && (this.config_ = dh())
    }
    isReady() {
        !this.config_ && ch() && (this.config_ = dh());
        return !!this.config_
    }
};
let Gh = 0;
v("ytDomDomGetNextId", y("ytDomDomGetNextId") || (() => ++Gh));
const Hh = {
    stopImmediatePropagation: 1,
    stopPropagation: 1,
    preventMouseEvent: 1,
    preventManipulation: 1,
    preventDefault: 1,
    layerX: 1,
    layerY: 1,
    screenX: 1,
    screenY: 1,
    scale: 1,
    rotation: 1,
    webkitMovementX: 1,
    webkitMovementY: 1
};

function Ih(a) {
    if (document.body && document.documentElement) {
        const b = document.body.scrollTop + document.documentElement.scrollTop;
        a.h = a.clientX + (document.body.scrollLeft + document.documentElement.scrollLeft);
        a.i = a.clientY + b
    }
}
class Jh {
    constructor(a) {
        this.type = "";
        this.state = this.source = this.data = this.currentTarget = this.relatedTarget = this.target = null;
        this.charCode = this.keyCode = 0;
        this.metaKey = this.shiftKey = this.ctrlKey = this.altKey = !1;
        this.clientY = this.clientX = 0;
        this.changedTouches = this.touches = null;
        try {
            if (a = a || window.event) {
                this.event = a;
                for (let d in a) d in Hh || (this[d] = a[d]);
                var b = a.target || a.srcElement;
                b && 3 == b.nodeType && (b = b.parentNode);
                this.target = b;
                var c = a.relatedTarget;
                if (c) try {
                    c = c.nodeName ? c : null
                } catch (d) {
                    c = null
                } else "mouseover" ==
                    this.type ? c = a.fromElement : "mouseout" == this.type && (c = a.toElement);
                this.relatedTarget = c;
                this.clientX = void 0 != a.clientX ? a.clientX : a.pageX;
                this.clientY = void 0 != a.clientY ? a.clientY : a.pageY;
                this.keyCode = a.keyCode ? a.keyCode : a.which;
                this.charCode = a.charCode || ("keypress" == this.type ? this.keyCode : 0);
                this.altKey = a.altKey;
                this.ctrlKey = a.ctrlKey;
                this.shiftKey = a.shiftKey;
                this.metaKey = a.metaKey;
                this.h = a.pageX;
                this.i = a.pageY
            }
        } catch (d) {}
    }
    preventDefault() {
        this.event && (this.event.returnValue = !1, this.event.preventDefault &&
            this.event.preventDefault())
    }
    stopPropagation() {
        this.event && (this.event.cancelBubble = !0, this.event.stopPropagation && this.event.stopPropagation())
    }
    stopImmediatePropagation() {
        this.event && (this.event.cancelBubble = !0, this.event.stopImmediatePropagation && this.event.stopImmediatePropagation())
    }
};
const va = u.ytEventsEventsListeners || {};
v("ytEventsEventsListeners", va);
const Kh = u.ytEventsEventsCounter || {
    count: 0
};
v("ytEventsEventsCounter", Kh);

function Lh(a, b, c, d = {}) {
    a.addEventListener && ("mouseenter" != b || "onmouseenter" in document ? "mouseleave" != b || "onmouseenter" in document ? "mousewheel" == b && "MozBoxSizing" in document.documentElement.style && (b = "MozMousePixelScroll") : b = "mouseout" : b = "mouseover");
    return ua(e => {
        const f = "boolean" === typeof e[4] && e[4] == !!d;
        var g;
        if (g = ia(e[4]) && ia(d)) a: {
            g = e[4];
            for (const h in g)
                if (!(h in d) || g[h] !== d[h]) {
                    g = !1;
                    break a
                }
            for (const h in d)
                if (!(h in g)) {
                    g = !1;
                    break a
                }
            g = !0
        }
        return !!e.length && e[0] == a && e[1] == b && e[2] == c && (f || g)
    })
}
const Mh = function(a) {
    let b = !1,
        c;
    return function() {
        b || (c = a(), b = !0);
        return c
    }
}(function() {
    let a = !1;
    try {
        const b = Object.defineProperty({}, "capture", {
            get: function() {
                a = !0
            }
        });
        window.addEventListener("test", null, b)
    } catch (b) {}
    return a
});

function Nh(a, b, c, d = {}) {
    if (!a || !a.addEventListener && !a.attachEvent) return "";
    let e = Lh(a, b, c, d);
    if (e) return e;
    e = ++Kh.count + "";
    const f = !("mouseenter" != b && "mouseleave" != b || !a.addEventListener || "onmouseenter" in document);
    let g;
    g = f ? h => {
        h = new Jh(h);
        if (!Cc(h.relatedTarget, k => k == a)) return h.currentTarget = a, h.type = b, c.call(a, h)
    } : h => {
        h = new Jh(h);
        h.currentTarget = a;
        return c.call(a, h)
    };
    g = Xe(g);
    a.addEventListener ? ("mouseenter" == b && f ? b = "mouseover" : "mouseleave" == b && f ? b = "mouseout" : "mousewheel" == b && "MozBoxSizing" in document.documentElement.style && (b = "MozMousePixelScroll"), Mh() || "boolean" === typeof d ? a.addEventListener(b, g, d) : a.addEventListener(b, g, !!d.capture)) : a.attachEvent(`on${b}`, g);
    va[e] = [a, b, c, g, d];
    return e
}

function Oh(a) {
    a && ("string" == typeof a && (a = [a]), qa(a, b => {
        if (b in va) {
            var c = va[b];
            const d = c[0],
                e = c[1],
                f = c[3];
            c = c[4];
            d.removeEventListener ? Mh() || "boolean" === typeof c ? d.removeEventListener(e, f, c) : d.removeEventListener(e, f, !!c.capture) : d.detachEvent && d.detachEvent(`on${e}`, f);
            delete va[b]
        }
    }))
};

function Ph(a) {
    this.V = a;
    this.h = null;
    this.u = 0;
    this.D = null;
    this.v = 0;
    this.i = [];
    for (a = 0; 4 > a; a++) this.i.push(0);
    this.m = 0;
    this.Da = Nh(window, "mousemove", ma(this.Ga, this));
    a = ma(this.Ca, this);
    "function" === typeof a && (a = Xe(a));
    this.Ha = window.setInterval(a, 25)
}
na(Ph, Sc);
Ph.prototype.Ga = function(a) {
    void 0 === a.h && Ih(a);
    var b = a.h;
    void 0 === a.i && Ih(a);
    this.h = new Bc(b, a.i)
};
Ph.prototype.Ca = function() {
    if (this.h) {
        var a = R();
        if (0 != this.u) {
            var b = this.D,
                c = this.h,
                d = b.x - c.x;
            b = b.y - c.y;
            d = Math.sqrt(d * d + b * b) / (a - this.u);
            this.i[this.m] = .5 < Math.abs((d - this.v) / this.v) ? 1 : 0;
            for (c = b = 0; 4 > c; c++) b += this.i[c] || 0;
            3 <= b && this.V();
            this.v = d
        }
        this.u = a;
        this.D = this.h;
        this.m = (this.m + 1) % 4
    }
};
Ph.prototype.Y = function() {
    window.clearInterval(this.Ha);
    Oh(this.Da)
};
const Qh = {};

function Rh() {
    var {
        ec: a = !1,
        Ub: b = !0
    } = {};
    if (null == y("_lact", window)) {
        var c = parseInt(M("LACT"), 10);
        c = isFinite(c) ? Date.now() - Math.max(c, 0) : -1;
        v("_lact", c, window);
        v("_fact", c, window); - 1 == c && Sh();
        Nh(document, "keydown", Sh);
        Nh(document, "keyup", Sh);
        Nh(document, "mousedown", Sh);
        Nh(document, "mouseup", Sh);
        a ? Nh(window, "touchmove", () => {
            Th("touchmove", 200)
        }, {
            passive: !0
        }) : (Nh(window, "resize", () => {
            Th("resize", 200)
        }), b && Nh(window, "scroll", () => {
            Th("scroll", 200)
        }));
        new Ph(() => {
            Th("mouse", 100)
        });
        Nh(document, "touchstart", Sh, {
            passive: !0
        });
        Nh(document, "touchend", Sh, {
            passive: !0
        })
    }
}

function Th(a, b) {
    Qh[a] || (Qh[a] = !0, Hf.h(() => {
        Sh();
        Qh[a] = !1
    }, b))
}

function Sh() {
    null == y("_lact", window) && Rh();
    var a = Date.now();
    v("_lact", a, window); - 1 == y("_fact", window) && v("_fact", a, window);
    (a = y("ytglobal.ytUtilActivityCallback_")) && a()
}

function Uh() {
    const a = y("_lact", window);
    return null == a ? -1 : Math.max(Date.now() - a, 0)
};
u.ytPubsubPubsubInstance || new H;
var Vh = Symbol("injectionDeps"),
    Wh = class {
        constructor() {
            this.name = "INNERTUBE_TRANSPORT_TOKEN"
        }
        toString() {
            return `InjectionToken(${this.name})`
        }
    };

function Xh(a) {
    var b = {
        ab: Yh,
        Aa: Zh.h
    };
    a.i.set(b.ab, b)
}

function $h(a, b, c) {
    if (-1 < c.indexOf(b)) throw Error(`Deps cycle for: ${b}`);
    if (a.h.has(b)) return a.h.get(b);
    if (!a.i.has(b)) throw Error(`No provider for: ${b}`);
    const d = a.i.get(b);
    c.push(b);
    if (d.Aa) var e = d.Aa;
    else if (d.lb) e = d[Vh] ? ai(a, d[Vh], c) : [], e = d.lb(...e);
    else if (d.kb) {
        e = d.kb;
        const f = e[Vh] ? ai(a, e[Vh], c) : [];
        e = new e(...f)
    } else throw Error(`Could not resolve providers for: ${b}`);
    c.pop();
    d.pc || a.h.set(b, e);
    return e
}

function ai(a, b, c) {
    return b ? b.map(d => $h(a, d, c)) : []
}
var bi = class {
    constructor() {
        this.i = new Map;
        this.h = new Map
    }
    resolve(a) {
        return $h(this, a, [])
    }
};
let ci;

function di() {
    ci || (ci = new bi);
    return ci
};

function ei(a, b) {
    const c = fi(b);
    if (a.h[c]) return a.h[c];
    const d = Object.keys(a.store) || [];
    if (1 >= d.length && fi(b) === d[0]) return d;
    const e = [];
    for (let g = 0; g < d.length; g++) {
        const h = d[g].split("/");
        if (gi(b.auth, h[0])) {
            var f = b.isJspb;
            gi(void 0 === f ? "undefined" : f ? "true" : "false", h[1]) && gi(b.cttAuthInfo, h[2]) && e.push(d[g])
        }
    }
    return a.h[c] = e
}

function gi(a, b) {
    return void 0 === a || "undefined" === a ? !0 : a === b
}
var hi = class {
    constructor() {
        this.store = {};
        this.h = {}
    }
    storePayload(a, b) {
        a = fi(a);
        this.store[a] ? this.store[a].push(b) : (this.h = {}, this.store[a] = [b]);
        return a
    }
    extractMatchingEntries(a) {
        a = ei(this, a);
        const b = [];
        for (let c = 0; c < a.length; c++) this.store[a[c]] && (b.push(...this.store[a[c]]), delete this.store[a[c]]);
        return b
    }
    getSequenceCount(a) {
        a = ei(this, a);
        let b = 0;
        for (let c = 0; c < a.length; c++) b += this.store[a[c]].length || 0;
        return b
    }
};
hi.prototype.getSequenceCount = hi.prototype.getSequenceCount;
hi.prototype.extractMatchingEntries = hi.prototype.extractMatchingEntries;
hi.prototype.storePayload = hi.prototype.storePayload;

function fi(a) {
    return [void 0 === a.auth ? "undefined" : a.auth, void 0 === a.isJspb ? "undefined" : a.isJspb, void 0 === a.cttAuthInfo ? "undefined" : a.cttAuthInfo].join("/")
};

function ii(a, b) {
    if (a) return a[b.name]
};
const ji = Se("initial_gel_batch_timeout", 2E3),
    ki = Se("gel_queue_timeout_max_ms", 6E4),
    li = Math.pow(2, 16) - 1;
let T = void 0;
class mi {
    constructor() {
        this.j = this.h = this.i = 0
    }
}
const ni = new mi,
    oi = new mi;
let pi, qi = !0;
const ri = u.ytLoggingTransportGELQueue_ || new Map,
    si = u.ytLoggingTransportGELProtoQueue_ || new Map,
    ti = u.ytLoggingTransportTokensToCttTargetIds_ || {},
    ui = u.ytLoggingTransportTokensToJspbCttTargetIds_ || {};
let vi = {};

function wi() {
    let a = y("yt.logging.ims");
    a || (a = new hi, v("yt.logging.ims", a));
    return a
}

function xi(a, b) {
    N("web_all_payloads_via_jspb") && Ze(new O("transport.log called for JSON in JSPB only experiment"));
    if ("log_event" === a.endpoint) {
        var c = yi(a);
        if (N("use_new_in_memory_storage")) {
            vi[c] = !0;
            var d = {
                cttAuthInfo: c,
                isJspb: !1
            };
            wi().storePayload(d, a.payload);
            zi(b, [], c, !1, d)
        } else d = ri.get(c) || [], ri.set(c, d), d.push(a.payload), zi(b, d, c)
    }
}

function Ai(a, b) {
    if ("log_event" === a.endpoint) {
        var c = yi(a, !0);
        if (N("use_new_in_memory_storage")) {
            vi[c] = !0;
            var d = {
                cttAuthInfo: c,
                isJspb: !0
            };
            wi().storePayload(d, a.payload.toJSON());
            zi(b, [], c, !0, d)
        } else d = si.get(c) || [], si.set(c, d), a = a.payload.toJSON(), d.push(a), zi(b, d, c, !0)
    }
}

function zi(a, b, c, d = !1, e) {
    a && (T = new a);
    a = Se("tvhtml5_logging_max_batch_ads_fork") || Se("tvhtml5_logging_max_batch") || Se("web_logging_max_batch") || 100;
    const f = R(),
        g = d ? oi.j : ni.j;
    b = b.length;
    e && (b = wi().getSequenceCount(e));
    b >= a ? pi || (pi = Bi(() => {
        Ci({
            writeThenSend: !0
        }, N("flush_only_full_queue") ? c : void 0, d);
        pi = void 0
    }, 0)) : 10 <= f - g && (Di(d), d ? oi.j = f : ni.j = f)
}

function Ei(a, b) {
    N("web_all_payloads_via_jspb") && Ze(new O("transport.logIsolatedGelPayload called in JSPB only experiment"));
    if ("log_event" === a.endpoint) {
        var c = yi(a),
            d = new Map;
        d.set(c, [a.payload]);
        b && (T = new b);
        return new G((e, f) => {
            T && T.isReady() ? Fi(d, T, e, f, {
                bypassNetworkless: !0
            }, !0) : e()
        })
    }
}

function Gi(a, b) {
    if ("log_event" === a.endpoint) {
        var c = yi(a, !0),
            d = new Map;
        d.set(c, [a.payload.toJSON()]);
        b && (T = new b);
        return new G(e => {
            T && T.isReady() ? Hi(d, T, e, {
                bypassNetworkless: !0
            }, !0) : e()
        })
    }
}

function yi(a, b = !1) {
    var c = "";
    if (a.dangerousLogToVisitorSession) c = "visitorOnlyApprovedKey";
    else if (a.cttAuthInfo) {
        if (b) {
            b = a.cttAuthInfo.token;
            c = a.cttAuthInfo;
            const d = new Ee;
            c.videoId ? d.setVideoId(c.videoId) : c.playlistId && Ab(d, 2, De, c.playlistId);
            ui[b] = d
        } else b = a.cttAuthInfo, c = {}, b.videoId ? c.videoId = b.videoId : b.playlistId && (c.playlistId = b.playlistId), ti[a.cttAuthInfo.token] = c;
        c = a.cttAuthInfo.token
    }
    return c
}

function Ci(a = {}, b, c = !1) {
    !c && N("web_all_payloads_via_jspb") && Ze(new O("transport.flushLogs called for JSON in JSPB only experiment"));
    new G((d, e) => {
        c ? (Ii(oi.i), Ii(oi.h), oi.h = 0) : (Ii(ni.i), Ii(ni.h), ni.h = 0);
        T && T.isReady() ? N("use_new_in_memory_storage") ? Ji(d, e, a, b, c) : Ki(d, e, a, b, c) : (Di(c), d())
    })
}

function Ji(a, b, c = {}, d, e = !1) {
    var f = T,
        g = new Map;
    const h = new Map;
    if (void 0 !== d) e ? (b = wi().extractMatchingEntries({
        isJspb: e,
        cttAuthInfo: d
    }), g.set(d, b), Hi(g, f, a, c)) : (g = wi().extractMatchingEntries({
        isJspb: e,
        cttAuthInfo: d
    }), h.set(d, g), Fi(h, f, a, b, c));
    else if (e) {
        for (const k of Object.keys(vi)) b = wi().extractMatchingEntries({
            isJspb: !0,
            cttAuthInfo: k
        }), 0 < b.length && g.set(k, b), delete vi[k];
        Hi(g, f, a, c)
    } else {
        for (const k of Object.keys(vi)) d = wi().extractMatchingEntries({
            isJspb: !1,
            cttAuthInfo: k
        }), 0 < d.length && h.set(k,
            d), delete vi[k];
        Fi(h, f, a, b, c)
    }
}

function Ki(a, b, c = {}, d, e = !1) {
    var f = T;
    if (void 0 !== d)
        if (e) b = new Map, e = si.get(d) || [], b.set(d, e), Hi(b, f, a, c), si.delete(d);
        else {
            e = new Map;
            const g = ri.get(d) || [];
            e.set(d, g);
            Fi(e, f, a, b, c);
            ri.delete(d)
        }
    else e ? (Hi(si, f, a, c), si.clear()) : (Fi(ri, f, a, b, c), ri.clear())
}

function Di(a = !1) {
    if (N("web_gel_timeout_cap") && (!a && !ni.h || a && !oi.h)) {
        var b = Bi(() => {
            Ci({
                writeThenSend: !0
            }, void 0, a)
        }, ki);
        a ? oi.h = b : ni.h = b
    }
    Ii(a ? oi.i : ni.i);
    b = M("LOGGING_BATCH_TIMEOUT", Se("web_gel_debounce_ms", 1E4));
    N("shorten_initial_gel_batch_timeout") && qi && (b = ji);
    b = Bi(() => {
        Ci({
            writeThenSend: !0
        }, void 0, a)
    }, b);
    a ? oi.i = b : ni.i = b
}

function Fi(a, b, c, d, e = {}, f) {
    const g = Math.round(R());
    let h = a.size;
    for (const [l, m] of a) {
        a = l;
        var k = m;
        const p = xa({
            context: eh(b.config_ || dh())
        });
        if (!ha(k) && !N("throw_err_when_logevent_malformed_killswitch")) {
            d();
            break
        }
        p.events = k;
        (k = ti[a]) && Li(p, a, k);
        delete ti[a];
        const t = "visitorOnlyApprovedKey" === a;
        Mi(p, g, t);
        Ni(e);
        const n = E => {
            N("update_log_event_config") && Hf.h(() => r(function*() {
                yield Oi(E)
            }));
            h--;
            h || c()
        };
        let x = 0;
        const w = () => {
            x++;
            if (e.bypassNetworkless && 1 === x) try {
                Eh(b, p, Pi({
                    writeThenSend: !0
                }, t, n, w, f)), qi = !1
            } catch (E) {
                Ye(E), d()
            }
            h--;
            h || c()
        };
        try {
            Eh(b, p, Pi(e, t, n, w, f)), qi = !1
        } catch (E) {
            Ye(E), d()
        }
    }
}

function Hi(a, b, c, d = {}, e) {
    const f = Math.round(R());
    let g = a.size;
    var h = new Map([...a]);
    for (const [m] of h) {
        var k = m,
            l = a.get(k);
        h = new Ge;
        const p = ih(b.config_ || dh());
        D(h, Wd, 1, p);
        l = l ? Qi(l) : [];
        for (const t of l) Hb(h, 3, ze, t);
        (l = ui[k]) && Ri(h, k, l);
        delete ui[k];
        k = "visitorOnlyApprovedKey" === k;
        Si(h, f, k);
        Ni(d);
        h = Tb(h);
        k = Pi(d, k, t => {
            N("update_log_event_config") && Hf.h(() => r(function*() {
                yield Oi(t)
            }));
            g--;
            g || c()
        }, () => {
            g--;
            g || c()
        }, e);
        k.headers["Content-Type"] = "application/json+protobuf";
        k.postBodyFormat = "JSPB";
        k.postBody = h;
        Eh(b, "", k);
        qi = !1
    }
}

function Ni(a) {
    N("always_send_and_write") && (a.writeThenSend = !1)
}

function Pi(a, b, c, d, e) {
    a = {
        retry: !0,
        onSuccess: c,
        onError: d,
        ac: a,
        dangerousLogToVisitorSession: b,
        Qb: !!e,
        headers: {},
        postBodyFormat: "",
        postBody: "",
        compress: N("compress_gel")
    };
    Ti() && (a.headers["X-Goog-Request-Time"] = JSON.stringify(Math.round(R())));
    return a
}

function Mi(a, b, c) {
    Ti() || (a.requestTimeMs = String(b));
    N("unsplit_gel_payloads_in_logs") && (a.unsplitGelPayloadsInLogs = !0);
    !c && (b = M("EVENT_ID")) && (c = Ui(), a.serializedClientEventId = {
        serializedEventId: b,
        clientCounter: String(c)
    })
}

function Si(a, b, c) {
    Ti() || C(a, 2, b);
    if (!c && (b = M("EVENT_ID"))) {
        c = Ui();
        const d = new Ce;
        C(d, 1, b);
        C(d, 2, c);
        D(a, Ce, 5, d)
    }
}

function Ui() {
    let a = M("BATCH_CLIENT_COUNTER") || 0;
    a || (a = Math.floor(Math.random() * li / 2));
    a++;
    a > li && (a = 1);
    K("BATCH_CLIENT_COUNTER", a);
    return a
}

function Li(a, b, c) {
    let d;
    if (c.videoId) d = "VIDEO";
    else if (c.playlistId) d = "PLAYLIST";
    else return;
    a.credentialTransferTokenTargetId = c;
    a.context = a.context || {};
    a.context.user = a.context.user || {};
    a.context.user.credentialTransferTokens = [{
        token: b,
        scope: d
    }]
}

function Ri(a, b, c) {
    var d = 1 === Bb(c, De) ? 1 : -1;
    if (B(c, d)) d = 1;
    else if (c.getPlaylistId()) d = 2;
    else return;
    D(a, Ee, 4, c);
    a = Cb(a, Wd, 1) || new Wd;
    c = Cb(a, Ud, 3) || new Ud;
    const e = new Sd;
    C(e, 2, b);
    C(e, 1, d);
    Hb(c, 12, Sd, e);
    D(a, Ud, 3, c)
}

function Qi(a) {
    const b = [];
    for (let c = 0; c < a.length; c++) try {
        b.push(new ze(a[c]))
    } catch (d) {
        Ye(new O("Transport failed to deserialize " + String(a[c])))
    }
    return b
}

function Ti() {
    return N("use_request_time_ms_header") || N("lr_use_request_time_ms_header")
}

function Bi(a, b) {
    var c;
    N("transport_use_scheduler") ? c = Ef(a, 0, b) : c = hf(a, b);
    return c
}

function Ii(a) {
    N("transport_use_scheduler") ? Hf.i(a) : window.clearTimeout(a)
}

function Oi(a) {
    return r(function*() {
        var b, c = null == a ? void 0 : null == (b = a.responseContext) ? void 0 : b.globalConfigGroup;
        b = ii(c, Fd);
        const d = null == c ? void 0 : c.hotHashData,
            e = ii(c, Ed);
        c = null == c ? void 0 : c.coldHashData;
        const f = di().resolve(bh);
        d && (b ? yield $g(f, d, b): yield $g(f, d));
        c && (e ? yield ah(f, c, e): yield ah(f, c))
    })
};
const Vi = u.ytLoggingGelSequenceIdObj_ || {};

function Wi(a, b, c, d = {}) {
    const e = {},
        f = Math.round(d.timestamp || R());
    e.eventTimeMs = f < Number.MAX_SAFE_INTEGER ? f : 0;
    e[a] = b;
    N("enable_unknown_lact_fix_on_html5") && Rh();
    a = Uh();
    e.context = {
        lastActivityMs: String(d.timestamp || !isFinite(a) ? -1 : a)
    };
    N("log_sequence_info_on_gel_web") && d.sequenceGroup && (a = e.context, b = d.sequenceGroup, b = {
        index: Xi(b),
        groupKey: b
    }, a.sequence = b, d.endOfSequence && delete Vi[d.sequenceGroup]);
    (d.sendIsolatedPayload ? Ei : xi)({
            endpoint: "log_event",
            payload: e,
            cttAuthInfo: d.cttAuthInfo,
            dangerousLogToVisitorSession: d.dangerousLogToVisitorSession
        },
        c)
}

function Yi(a = !1) {
    Ci(void 0, void 0, a)
}

function Xi(a) {
    Vi[a] = a in Vi ? Vi[a] + 1 : 0;
    return Vi[a]
};
let Zi = Fh;

function U(a, b, c = {}) {
    let d = Zi;
    M("ytLoggingEventsDefaultDisabled", !1) && Zi === Fh && (d = null);
    N("web_all_payloads_via_jspb") && Ze(new O("Logs should be translated to JSPB but are sent as JSON instead", a));
    Wi(a, b, d, c)
};
const $i = u.ytLoggingGelSequenceIdObj_ || {};

function aj(a, b, c = {}) {
    var d = Math.round(c.timestamp || R());
    C(a, 1, d < Number.MAX_SAFE_INTEGER ? d : 0);
    var e = Uh();
    d = new ye;
    C(d, 1, c.timestamp || !isFinite(e) ? -1 : e);
    if (N("log_sequence_info_on_gel_web") && c.sequenceGroup) {
        e = c.sequenceGroup;
        const f = Xi(e),
            g = new xe;
        C(g, 2, f);
        C(g, 1, e);
        D(d, xe, 3, g);
        c.endOfSequence && delete $i[c.sequenceGroup]
    }
    D(a, ye, 33, d);
    (c.sendIsolatedPayload ? Gi : Ai)({
        endpoint: "log_event",
        payload: a,
        cttAuthInfo: c.cttAuthInfo,
        dangerousLogToVisitorSession: c.dangerousLogToVisitorSession
    }, b)
};

function bj(a, b = {}) {
    let c = !1;
    M("ytLoggingEventsDefaultDisabled", !1) && (c = !0);
    aj(a, c ? null : Fh, b)
};

function cj(a, b, c) {
    const d = new ze;
    Gb(d, ve, 72, Ae, a);
    c ? aj(d, c, b) : bj(d, b)
}

function dj(a, b, c) {
    const d = new ze;
    Gb(d, ue, 73, Ae, a);
    c ? aj(d, c, b) : bj(d, b)
}

function ej(a, b, c) {
    const d = new ze;
    Gb(d, te, 78, Ae, a);
    c ? aj(d, c, b) : bj(d, b)
}

function fj(a, b, c) {
    const d = new ze;
    Gb(d, we, 208, Ae, a);
    c ? aj(d, c, b) : bj(d, b)
}

function gj(a, b, c) {
    const d = new ze;
    Gb(d, ne, 156, Ae, a);
    c ? aj(d, c, b) : bj(d, b)
}

function hj(a, b, c) {
    const d = new ze;
    Gb(d, se, 215, Ae, a);
    c ? aj(d, c, b) : bj(d, b)
};
var ij = new Set,
    jj = 0,
    kj = 0,
    lj = 0,
    mj = [];
const nj = ["PhantomJS", "Googlebot", "TO STOP THIS SECURITY SCAN go/scan"];

function oj(a) {
    pj(a)
}

function qj(a) {
    pj(a, "WARNING")
}

function pj(a, b = "ERROR") {
    var c = {};
    c.name = M("INNERTUBE_CONTEXT_CLIENT_NAME", 1);
    c.version = M("INNERTUBE_CONTEXT_CLIENT_VERSION");
    rj(a, c || {}, b)
}

function rj(a, b, c = "ERROR") {
    if (a) {
        a.hasOwnProperty("level") && a.level && (c = a.level);
        if (N("console_log_js_exceptions")) {
            var d = [];
            d.push(`Name: ${a.name}`);
            d.push(`Message: ${a.message}`);
            a.hasOwnProperty("params") && d.push(`Error Params: ${JSON.stringify(a.params)}`);
            a.hasOwnProperty("args") && d.push(`Error args: ${JSON.stringify(a.args)}`);
            d.push(`File name: ${a.fileName}`);
            d.push(`Stacktrace: ${a.stack}`);
            window.console.log(d.join("\n"), a)
        }
        if (!(5 <= jj)) {
            d = mj;
            var e = Dc(a);
            const E = e.message || "Unknown Error",
                Za = e.name || "UnknownError";
            var f = e.stack || a.i || "Not available";
            if (f.startsWith(`${Za}: ${E}`)) {
                var g = f.split("\n");
                g.shift();
                f = g.join("\n")
            }
            g = e.lineNumber || "Not available";
            e = e.fileName || "Not available";
            let L = 0;
            if (a.hasOwnProperty("args") && a.args && a.args.length)
                for (var h = 0; h < a.args.length && !(L = xf(a.args[h], `params.${h}`, b, L), 500 <= L); h++);
            else if (a.hasOwnProperty("params") && a.params) {
                const ja = a.params;
                if ("object" === typeof a.params)
                    for (h in ja) {
                        if (!ja[h]) continue;
                        const xh = `params.${h}`,
                            yh = zf(ja[h]);
                        b[xh] =
                            yh;
                        L += xh.length + yh.length;
                        if (500 < L) break
                    } else b.params = zf(ja)
            }
            if (d.length)
                for (h = 0; h < d.length && !(L = xf(d[h], `params.context.${h}`, b, L), 500 <= L); h++);
            navigator.vendor && !b.hasOwnProperty("vendor") && (b["device.vendor"] = navigator.vendor);
            b = {
                message: E,
                name: Za,
                lineNumber: g,
                fileName: e,
                stack: f,
                params: b,
                sampleWeight: 1
            };
            d = Number(a.columnNumber);
            isNaN(d) || (b.lineNumber = `${b.lineNumber}:${d}`);
            if ("IGNORED" === a.level) var k = 0;
            else a: {
                a = qf();d = b;
                for (k of a.J)
                    if (d.message && d.message.match(k.Ya)) {
                        k = k.weight;
                        break a
                    }
                for (var l of a.H)
                    if (l.callback(d)) {
                        k =
                            l.weight;
                        break a
                    }
                k = 1
            }
            b.sampleWeight = k;
            k = b;
            for (var m of nf)
                if (m.ba[k.name]) {
                    l = m.ba[k.name];
                    for (var p of l)
                        if (l = k.message.match(p.A)) {
                            k.params["params.error.original"] = l[0];
                            a = p.groups;
                            b = {};
                            for (d = 0; d < a.length; d++) b[a[d]] = l[d + 1], k.params[`params.error.${a[d]}`] = l[d + 1];
                            k.message = m.ja(b);
                            break
                        }
                }
            k.params || (k.params = {});
            m = qf();
            k.params["params.errorServiceSignature"] = `msg=${m.J.length}&cb=${m.H.length}`;
            k.params["params.serviceWorker"] = "true";
            u.document && u.document.querySelectorAll && (k.params["params.fscripts"] =
                String(document.querySelectorAll("script:not([nonce])").length));
            Ba("sample").constructor !== Aa && (k.params["params.fconst"] = "true");
            window.yterr && "function" === typeof window.yterr && window.yterr(k);
            if (0 !== k.sampleWeight && !ij.has(k.message)) {
                "ERROR" === c ? (uf.la("handleError", k), N("record_app_crashed_web") && 0 === lj && 1 === k.sampleWeight && (lj++, N("errors_via_jspb") ? (m = new he, C(m, 1, 1), N("report_client_error_with_app_crash_ks") || (l = new ce, C(l, 1, k.message), p = new de, D(p, ce, 3, l), l = new ee, D(l, de, 5, p), p = new ge, D(p,
                    ee, 9, l), D(m, ge, 4, p)), p = new ze, Gb(p, he, 20, Ae, m), bj(p)) : (m = {
                    appCrashType: "APP_CRASH_TYPE_BREAKPAD"
                }, N("report_client_error_with_app_crash_ks") || (m.systemHealth = {
                    crashData: {
                        clientError: {
                            logMessage: {
                                message: k.message
                            }
                        }
                    }
                }), U("appCrashed", m))), kj++) : "WARNING" === c && uf.la("handleWarning", k);
                a: {
                    if (N("errors_via_jspb")) {
                        if (sj()) var t = void 0;
                        else {
                            m = new $d;
                            C(m, 1, k.stack);
                            k.fileName && C(m, 4, k.fileName);
                            var n = k.lineNumber && k.lineNumber.split ? k.lineNumber.split(":") : [];
                            0 !== n.length && (1 !== n.length || isNaN(Number(n[0])) ?
                                2 !== n.length || isNaN(Number(n[0])) || isNaN(Number(n[1])) || (C(m, 2, Number(n[0])), C(m, 3, Number(n[1]))) : C(m, 2, Number(n[0])));
                            n = new ce;
                            C(n, 1, k.message);
                            C(n, 3, k.name);
                            C(n, 6, k.sampleWeight);
                            "ERROR" === c ? C(n, 2, 2) : "WARNING" === c ? C(n, 2, 1) : C(n, 2, 0);
                            var x = new ae;
                            C(x, 1, !0);
                            Gb(x, $d, 3, be, m);
                            m = new Yd;
                            C(m, 3, window.location.href);
                            p = M("FEXP_EXPERIMENTS", []);
                            for (b = 0; b < p.length; b++) l = m, a = p[b], tb(l), zb(l, 5, 2, !1, !1).push(a);
                            p = Pe();
                            if (!Qe() && p)
                                for (var w of Object.keys(p)) l = new Zd, C(l, 1, w), C(l, 2, String(p[w])), Hb(m, 4, Zd, l);
                            if (w =
                                k.params)
                                for (t of Object.keys(w)) p = new Zd, C(p, 1, `client.${t}`), C(p, 2, String(w[t])), Hb(m, 4, Zd, p);
                            w = M("SERVER_NAME");
                            t = M("SERVER_VERSION");
                            w && t && (p = new Zd, C(p, 1, "server.name"), C(p, 2, w), Hb(m, 4, Zd, p), w = new Zd, C(w, 1, "server.version"), C(w, 2, t), Hb(m, 4, Zd, w));
                            t = new de;
                            D(t, Yd, 1, m);
                            D(t, ae, 2, x);
                            D(t, ce, 3, n)
                        }
                        if (!t) break a;
                        w = new ze;
                        Gb(w, de, 163, Ae, t);
                        bj(w)
                    } else {
                        if (sj()) t = void 0;
                        else {
                            w = {
                                stackTrace: k.stack
                            };
                            k.fileName && (w.filename = k.fileName);
                            t = k.lineNumber && k.lineNumber.split ? k.lineNumber.split(":") : [];
                            0 !== t.length &&
                                (1 !== t.length || isNaN(Number(t[0])) ? 2 !== t.length || isNaN(Number(t[0])) || isNaN(Number(t[1])) || (w.lineNumber = Number(t[0]), w.columnNumber = Number(t[1])) : w.lineNumber = Number(t[0]));
                            t = {
                                level: "ERROR_LEVEL_UNKNOWN",
                                message: k.message,
                                errorClassName: k.name,
                                sampleWeight: k.sampleWeight
                            };
                            "ERROR" === c ? t.level = "ERROR_LEVEL_ERROR" : "WARNING" === c && (t.level = "ERROR_LEVEL_WARNNING");
                            w = {
                                isObfuscated: !0,
                                browserStackInfo: w
                            };
                            m = {
                                pageUrl: window.location.href,
                                kvPairs: []
                            };
                            M("FEXP_EXPERIMENTS") && (m.experimentIds = M("FEXP_EXPERIMENTS"));
                            p = Pe();
                            if (!Qe() && p)
                                for (x of Object.keys(p)) m.kvPairs.push({
                                    key: x,
                                    value: String(p[x])
                                });
                            if (x = k.params)
                                for (n of Object.keys(x)) m.kvPairs.push({
                                    key: `client.${n}`,
                                    value: String(x[n])
                                });
                            n = M("SERVER_NAME");
                            x = M("SERVER_VERSION");
                            n && x && (m.kvPairs.push({
                                key: "server.name",
                                value: n
                            }), m.kvPairs.push({
                                key: "server.version",
                                value: x
                            }));
                            t = {
                                errorMetadata: m,
                                stackTrace: w,
                                logMessage: t
                            }
                        }
                        if (!t) break a;
                        U("clientError", t)
                    }
                    if ("ERROR" === c || N("errors_flush_gel_always_killswitch")) b: {
                        if (N("web_fp_via_jspb") && (Yi(!0), !N("web_fp_via_jspb_and_json"))) break b;
                        Yi()
                    }
                }
                try {
                    ij.add(k.message)
                } catch (ja) {}
                jj++
            }
        }
    }
}

function sj() {
    for (const a of nj) {
        const b = Ea();
        if (b && 0 <= b.toLowerCase().indexOf(a.toLowerCase())) return !0
    }
    return !1
}

function tj(a, ...b) {
    a.args || (a.args = []);
    a.args.push(...b)
};
let uj = Date.now().toString();

function vj() {
    const a = Array(16);
    for (var b = 0; 16 > b; b++) {
        var c = Date.now();
        for (let d = 0; d < c % 23; d++) a[b] = Math.random();
        a[b] = Math.floor(256 * Math.random())
    }
    if (uj)
        for (b = 1, c = 0; c < uj.length; c++) a[b % 16] = a[b % 16] ^ a[(b - 1) % 16] / 4 ^ uj.charCodeAt(c), b++;
    return a
}

function wj() {
    if (window.crypto && window.crypto.getRandomValues) try {
        const a = Array(16),
            b = new Uint8Array(16);
        window.crypto.getRandomValues(b);
        for (let c = 0; c < a.length; c++) a[c] = b[c];
        return a
    } catch (a) {}
    return vj()
};

function xj(a = !0) {
    a = a ? wj() : vj();
    const b = [];
    for (let c = 0; c < a.length; c++) b.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(a[c] & 63));
    return b.join("")
};
let yj = 1;

function V(a) {
    return new zj({
        trackingParams: a
    })
}

function Aj(a) {
    const b = yj++;
    return new zj({
        veType: a,
        veCounter: b,
        elementIndex: void 0,
        dataElement: void 0,
        youtubeData: void 0,
        jspbYoutubeData: void 0
    })
}
var zj = class {
    constructor(a) {
        this.o = a
    }
    getAsJson() {
        const a = {};
        void 0 !== this.o.trackingParams ? a.trackingParams = this.o.trackingParams : (a.veType = this.o.veType, void 0 !== this.o.veCounter && (a.veCounter = this.o.veCounter), void 0 !== this.o.elementIndex && (a.elementIndex = this.o.elementIndex));
        void 0 !== this.o.dataElement && (a.dataElement = this.o.dataElement.getAsJson());
        void 0 !== this.o.youtubeData && (a.youtubeData = this.o.youtubeData);
        return a
    }
    getAsJspb() {
        const a = new J;
        if (void 0 !== this.o.trackingParams) {
            var b = this.o.trackingParams;
            if (null != b)
                if ("string" === typeof b) b = b ? new eb(b, ab) : db();
                else if (b.constructor !== eb)
                if (Ya(b)) b = b.length ? new eb(new Uint8Array(b), ab) : db();
                else throw Error();
            C(a, 1, b)
        } else void 0 !== this.o.veType && C(a, 2, this.o.veType), void 0 !== this.o.veCounter && C(a, 6, this.o.veCounter), void 0 !== this.o.elementIndex && C(a, 3, this.o.elementIndex);
        void 0 !== this.o.dataElement && (b = this.o.dataElement.getAsJspb(), D(a, J, 7, b));
        void 0 !== this.o.youtubeData && D(a, Gd, 8, this.o.jspbYoutubeData);
        return a
    }
    toString() {
        return JSON.stringify(this.getAsJson())
    }
    isClientVe() {
        return !this.o.trackingParams &&
            !!this.o.veType
    }
};
let Bj = u.ytLoggingDocDocumentNonce_;
if (!Bj) {
    const a = wj(),
        b = [];
    for (let c = 0; c < a.length; c++) b.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(a[c] & 63));
    Bj = b.join("")
}
var Cj = Bj;
var Dj = {
    ob: 0,
    mb: 1,
    nb: 2,
    Gb: 3,
    pb: 4,
    Lb: 5,
    Hb: 6,
    Kb: 7,
    Ib: 8,
    Jb: 9,
    0: "DEFAULT",
    1: "CHAT",
    2: "CONVERSATIONS",
    3: "MINIPLAYER",
    4: "DIALOG",
    5: "VOZ",
    6: "MUSIC_WATCH_TABS",
    7: "SHARE",
    8: "PUSH_NOTIFICATIONS",
    9: "RICH_GRID_WATCH"
};

function Ej(a = 0) {
    return 0 === a ? "client-screen-nonce" : `${"client-screen-nonce"}.${a}`
}

function Fj(a = 0) {
    return 0 === a ? "ROOT_VE_TYPE" : `${"ROOT_VE_TYPE"}.${a}`
}

function Gj(a = 0) {
    return M(Fj(a))
}

function Hj(a = 0) {
    return (a = Gj(a)) ? new zj({
        veType: a,
        youtubeData: void 0,
        jspbYoutubeData: void 0
    }) : null
}

function Ij() {
    let a = M("csn-to-ctt-auth-info");
    a || (a = {}, K("csn-to-ctt-auth-info", a));
    return a
}

function W(a = 0) {
    a = M(Ej(a));
    if (!a && !M("USE_CSN_FALLBACK", !0)) return null;
    a || (a = "UNDEFINED_CSN");
    return a ? a : null
}

function Jj(a) {
    for (const b of Object.values(Dj))
        if (W(b) === a) return !0;
    return !1
}

function Kj(a, b, c) {
    const d = Ij();
    (c = W(c)) && delete d[c];
    b && (d[a] = b)
}

function Lj(a) {
    return Ij()[a]
}

function Mj(a, b, c = 0, d) {
    if (a !== M(Ej(c)) || b !== M(Fj(c)))
        if (Kj(a, d, c), K(Ej(c), a), K(Fj(c), b), b = () => {
                setTimeout(() => {
                    if (a)
                        if (N("web_time_via_jspb")) {
                            var e = new ie;
                            C(e, 1, Cj);
                            C(e, 2, a);
                            const f = new ze;
                            Gb(f, ie, 111, Ae, e);
                            bj(f)
                        } else U("foregroundHeartbeatScreenAssociated", {
                            clientDocumentNonce: Cj,
                            clientScreenNonce: a
                        })
                }, 0)
            }, "requestAnimationFrame" in window) try {
            window.requestAnimationFrame(b)
        } catch (e) {
            b()
        } else b()
};
class mh extends kh {
    constructor(a) {
        super(arguments);
        this.csn = a
    }
}
const sh = new lh,
    Nj = [];
let Pj = Oj,
    Qj = 0;

function Rj(a, b, c, d, e, f, g) {
    const h = Pj();
    var k = new zj({
        veType: b,
        youtubeData: f,
        jspbYoutubeData: void 0
    });
    f = {
        sequenceGroup: h
    };
    e && (f.cttAuthInfo = e);
    e = () => {
        qj(new O("newScreen() parent element does not have a VE - rootVe", b))
    };
    N("il_via_jspb") ? (k = me((new ne).h(h), k.getAsJspb()), c && c.visualElement ? (e = new pe, c.clientScreenNonce && C(e, 2, c.clientScreenNonce), oe(e, c.visualElement.getAsJspb()), g && C(e, 4, Be[g]), D(k, pe, 5, e)) : c && e(), d && C(k, 3, d), gj(k, f, a)) : (k = {
        csn: h,
        pageVe: k.getAsJson()
    }, c && c.visualElement ? (k.implicitGesture = {
        parentCsn: c.clientScreenNonce,
        gesturedVe: c.visualElement.getAsJson()
    }, g && (k.implicitGesture.gestureType = g)) : c && e(), d && (k.cloneCsn = d), a ? Wi("screenCreated", k, a, f) : U("screenCreated", k, f));
    rh(new mh(h));
    return h
}

function Sj(a, b, c, d) {
    const e = d.filter(g => {
            g.csn !== b ? (g.csn = b, g = !0) : g = !1;
            return g
        }),
        f = {
            cttAuthInfo: Lj(b) || void 0,
            sequenceGroup: b
        };
    for (const g of d) d = g.getAsJson(), (wa(d) || !d.trackingParams && !d.veType) && qj(Error("Child VE logged with no data"));
    if (N("il_via_jspb")) {
        const g = qe((new se).h(b), c.getAsJspb());
        ra(e, h => {
            h = h.getAsJspb();
            Hb(g, 3, J, h)
        });
        "UNDEFINED_CSN" === b ? X("visualElementAttached", f, void 0, g) : hj(g, f, a)
    } else c = {
        csn: b,
        parentVe: c.getAsJson(),
        childVes: ra(e, g => g.getAsJson())
    }, "UNDEFINED_CSN" === b ? X("visualElementAttached", f, c) : a ? Wi("visualElementAttached", c, a, f) : U("visualElementAttached", c, f)
}

function Tj(a, b, c, d, e, f) {
    Uj(a, b, c, e, f)
}

function Uj(a, b, c, d, e) {
    const f = {
        cttAuthInfo: Lj(b) || void 0,
        sequenceGroup: b
    };
    N("il_via_jspb") ? (d = (new ve).h(b), c = c.getAsJspb(), c = D(d, J, 2, c), c = C(c, 4, 1), e && D(c, le, 3, e), "UNDEFINED_CSN" === b ? X("visualElementShown", f, void 0, c) : cj(c, f, a)) : (e = {
        csn: b,
        ve: c.getAsJson(),
        eventType: 1
    }, d && (e.clientData = d), "UNDEFINED_CSN" === b ? X("visualElementShown", f, e) : a ? Wi("visualElementShown", e, a, f) : U("visualElementShown", e, f))
}

function Vj(a, b, c) {
    const d = {
        cttAuthInfo: Lj(b) || void 0,
        sequenceGroup: b
    };
    if (N("il_via_jspb")) {
        var e = (new ue).h(b);
        c = c.getAsJspb();
        e = D(e, J, 2, c);
        e = C(e, 4, 2);
        "UNDEFINED_CSN" === b ? X("visualElementHidden", d, void 0, e) : dj(e, d, a)
    } else e = {
        csn: b,
        ve: c.getAsJson(),
        eventType: 2
    }, "UNDEFINED_CSN" === b ? X("visualElementHidden", d, e) : a ? Wi("visualElementHidden", e, a, d) : U("visualElementHidden", e, d)
}

function Wj(a, b, c, d, e) {
    const f = {
        cttAuthInfo: Lj(b) || void 0,
        sequenceGroup: b
    };
    N("il_via_jspb") ? (d = (new ve).h(b), c = c.getAsJspb(), c = D(d, J, 2, c), c = C(c, 4, 4), e && D(c, le, 3, e), "UNDEFINED_CSN" === b ? X("visualElementShown", f, void 0, c) : cj(c, f, a)) : (e = {
        csn: b,
        ve: c.getAsJson(),
        eventType: 4
    }, d && (e.clientData = d), "UNDEFINED_CSN" === b ? X("visualElementShown", f, e) : a ? Wi("visualElementShown", e, a, f) : U("visualElementShown", e, f))
}

function Xj(a, b, c, d = !1) {
    var e = d ? 16 : 8;
    const f = {
        cttAuthInfo: Lj(b) || void 0,
        sequenceGroup: b,
        endOfSequence: d
    };
    N("il_via_jspb") ? (e = (new ue).h(b), c = c.getAsJspb(), c = D(e, J, 2, c), C(c, 4, d ? 16 : 8), "UNDEFINED_CSN" === b ? X("visualElementHidden", f, void 0, c) : dj(c, f, a)) : (d = {
        csn: b,
        ve: c.getAsJson(),
        eventType: e
    }, "UNDEFINED_CSN" === b ? X("visualElementHidden", f, d) : a ? Wi("visualElementHidden", d, a, f) : U("visualElementHidden", d, f))
}

function Yj(a, b, c, d) {
    const e = {
        cttAuthInfo: Lj(b) || void 0,
        sequenceGroup: b
    };
    N("il_via_jspb") ? (d = (new te).h(b), c = c.getAsJspb(), c = D(d, J, 2, c), C(c, 4, Be.INTERACTION_LOGGING_GESTURE_TYPE_GENERIC_CLICK), "UNDEFINED_CSN" === b ? X("visualElementGestured", e, void 0, c) : ej(c, e, a)) : (c = {
        csn: b,
        ve: c.getAsJson(),
        gestureType: "INTERACTION_LOGGING_GESTURE_TYPE_GENERIC_CLICK"
    }, d && (c.clientData = d), "UNDEFINED_CSN" === b ? X("visualElementGestured", e, c) : a ? Wi("visualElementGestured", c, a, e) : U("visualElementGestured", c, e))
}

function Oj() {
    if (N("enable_web_96_bit_csn")) var a = xj();
    else if (N("enable_web_96_bit_csn_no_crypto")) a = xj(!1);
    else {
        a = Math.random() + "";
        for (var b = [], c = 0, d = 0; d < a.length; d++) {
            var e = a.charCodeAt(d);
            255 < e && (b[c++] = e & 255, e >>= 8);
            b[c++] = e
        }
        a = Ta(b, 3)
    }
    return a
}

function X(a, b, c, d) {
    Nj.push({
        T: a,
        payload: c,
        L: d,
        options: b
    });
    Qj || (Qj = vh())
}

function wh(a) {
    if (Nj) {
        for (const b of Nj)
            if (N("il_via_jspb") && b.L) switch (b.L.h(a.csn), b.T) {
                case "screenCreated":
                    gj(b.L, b.options);
                    break;
                case "visualElementAttached":
                    hj(b.L, b.options);
                    break;
                case "visualElementShown":
                    cj(b.L, b.options);
                    break;
                case "visualElementHidden":
                    dj(b.L, b.options);
                    break;
                case "visualElementGestured":
                    ej(b.L, b.options);
                    break;
                case "visualElementStateChanged":
                    fj(b.L, b.options);
                    break;
                default:
                    qj(new O("flushQueue unable to map payloadName to JSPB setter"))
            } else b.payload && (b.payload.csn =
                a.csn, U(b.T, b.payload, b.options));
        Nj.length = 0
    }
    Qj = 0
};

function Y() {
    Zj.h || (Zj.h = new Zj);
    return Zj.h
}

function ak(a, b, c) {
    const d = W(c);
    return null === a.csn || d === a.csn || c ? d : (a = new O("VisibilityLogger called before newScreen", {
        caller: b.tagName,
        previous_csn: a.csn,
        current_csn: d
    }), qj(a), null)
}

function bk(a) {
    return Math.floor(Number(a.data && a.data.loggingDirectives && a.data.loggingDirectives.visibility && a.data.loggingDirectives.visibility.types || "")) || 1
}
var Zj = class {
    constructor() {
        this.u = new Set;
        this.m = new Set;
        this.i = new Map;
        this.client = void 0;
        this.csn = null
    }
    j(a) {
        this.client = a
    }
    v() {
        this.clear();
        this.csn = W()
    }
    clear() {
        this.u.clear();
        this.m.clear();
        this.i.clear();
        this.csn = null
    }
    V(a, b, c) {
        var d = this.l(a),
            e = a.visualElement ? a.visualElement : d;
        b = this.u.has(e);
        const f = this.i.get(e);
        this.u.add(e);
        this.i.set(e, !0);
        a.S && !b && a.S();
        if (d || a.visualElement)
            if (c = ak(this, a, c))
                if (e = !(!a.data || !a.data.loggingDirectives), bk(a) || e) {
                    d = a.visualElement ? a.visualElement : V(d);
                    var g =
                        a.wa,
                        h = a.xa;
                    e || b ? this.h(a, 4) ? f || Wj(this.client, c, d, g, h) : this.h(a, 1) && !b && Uj(this.client, c, d, g, h) : Uj(this.client, c, d, g, h)
                }
    }
    D(a, b, c) {
        var d = this.l(a);
        const e = a.visualElement ? a.visualElement : d;
        b = this.m.has(e);
        const f = this.i.get(e);
        this.m.add(e);
        this.i.set(e, !1);
        if (!1 === f) return !0;
        if (!d && !a.visualElement) return !1;
        c = ak(this, a, c);
        if (!c || !bk(a) && a.data && a.data.loggingDirectives) return !1;
        d = a.visualElement ? a.visualElement : V(d);
        this.h(a, 8) ? Xj(this.client, c, d) : this.h(a, 2) && !b && Vj(this.client, c, d);
        return !0
    }
    l(a) {
        let b,
            c, d;
        return N("il_use_view_model_logging_context") && (null == (b = a.data) ? 0 : null == (c = b.context) ? 0 : null == (d = c.loggingContext) ? 0 : d.loggingDirectives) ? a.data.context.loggingContext.loggingDirectives.trackingParams || "" : a.data && a.data.loggingDirectives ? a.data.loggingDirectives.trackingParams || "" : a.M && a.M.trackingParams ? a.M.trackingParams : a.data && a.data.trackingParams || ""
    }
    h(a, b) {
        return !!(bk(a) & b)
    }
};

function ck() {
    dk.h || (dk.h = new dk);
    return dk.h
}

function ek() {
    var a = ck();
    N("safe_logging_library_killswitch") ? (a.clear(), a.csn = W()) : Xe(Y().v).bind(Y())()
}

function fk(a, b) {
    if (!N("safe_logging_library_killswitch")) return Xe(Y().l).bind(Y())(b);
    let c, d, e;
    return N("il_use_view_model_logging_context") && (null == (c = b.data) ? 0 : null == (d = c.context) ? 0 : null == (e = d.loggingContext) ? 0 : e.loggingDirectives) ? b.data.context.loggingContext.loggingDirectives.trackingParams || "" : b.data && b.data.loggingDirectives ? b.data.loggingDirectives.trackingParams || "" : b.M && b.M.trackingParams ? b.M.trackingParams : b.data && b.data.trackingParams || ""
}

function gk(a) {
    return Math.floor(Number(a.data && a.data.loggingDirectives && a.data.loggingDirectives.visibility && a.data.loggingDirectives.visibility.types || "")) || 1
}

function hk(a, b, c) {
    return N("safe_logging_library_killswitch") ? !!(gk(b) & c) : Xe(Y().h).bind(Y())(b, c)
}
var dk = class {
    constructor() {
        this.l = new Set;
        this.i = new Set;
        this.h = new Map;
        this.client = void 0;
        this.csn = null
    }
    j(a) {
        N("safe_logging_library_killswitch") ? this.client = a : Xe(Y().j).bind(Y())(a)
    }
    clear() {
        N("safe_logging_library_killswitch") ? (this.l.clear(), this.i.clear(), this.h.clear(), this.csn = null) : Xe(Y().clear).bind(Y())()
    }
};

function ik(a) {
    return N("use_ts_visibilitylogger") ? fk(ck(), a) : N("il_use_view_model_logging_context") && a.data && a.data.context && a.data.context.loggingContext && a.data.context.loggingContext.loggingDirectives ? a.data.context.loggingContext.loggingDirectives || "" : a.data && a.data.loggingDirectives ? a.data.loggingDirectives.trackingParams || "" : a.M && a.M.trackingParams ? a.M.trackingParams : a.data && a.data.trackingParams || ""
}

function jk(a) {
    return parseInt(a.data && a.data.loggingDirectives && a.data.loggingDirectives.visibility && a.data.loggingDirectives.visibility.types || "", 10) || 1
}

function kk(a, b) {
    return N("use_ts_visibilitylogger") ? hk(ck(), a, b) : !!(jk(a) & b)
}

function lk(a, b) {
    if (N("use_ts_visibilitylogger"))
        if (a = ck(), N("safe_logging_library_killswitch")) {
            var c = fk(0, b),
                d = b.visualElement ? b.visualElement : c,
                e = a.l.has(d),
                f = a.h.get(d);
            a.l.add(d);
            a.h.set(d, !0);
            b.S && !e && b.S();
            if (c || b.visualElement)
                if (d = W(8)) {
                    var g = !(!b.data || !b.data.loggingDirectives);
                    if (gk(b) || g) {
                        c = b.visualElement ? b.visualElement : V(c);
                        var h = b.wa,
                            k = b.xa;
                        g || e ? hk(0, b, 4) ? f || Wj(a.client, d, c, h, k) : hk(0, b, 1) && !e && Uj(a.client, d, c, h, k) : Uj(a.client, d, c, h, k)
                    }
                }
        } else Xe(Y().V).bind(Y())(b, void 0, 8);
    else if (c =
        ik(b), d = b.visualElement ? b.visualElement : c, e = a.m.has(d), f = a.i.get(d), a.m.add(d), a.i.set(d, !0), b.S && !e && b.S(), c || b.visualElement)
        if (d = W(8))
            if (g = !(!b.data || !b.data.loggingDirectives), jk(b) || g) c = b.visualElement ? b.visualElement : V(c), h = b.wa, k = b.xa, g || e ? kk(b, 4) ? f || Wj(a.h, d, c, h, k) : kk(b, 1) && !e && Uj(a.h, d, c, h, k) : Uj(a.h, d, c, h, k)
}

function mk(a, b) {
    if (N("use_ts_visibilitylogger"))
        if (a = ck(), N("safe_logging_library_killswitch")) {
            var c = fk(0, b),
                d = b.visualElement ? b.visualElement : c,
                e = a.i.has(d),
                f = a.h.get(d);
            a.i.add(d);
            a.h.set(d, !1);
            !1 !== f && (c || b.visualElement) && (!(d = W(8)) || !gk(b) && b.data && b.data.loggingDirectives || (c = b.visualElement ? b.visualElement : V(c), hk(0, b, 8) ? Xj(a.client, d, c) : hk(0, b, 2) && !e && Vj(a.client, d, c)))
        } else Xe(Y().D).bind(Y())(b, void 0, 8);
    else c = ik(b), d = b.visualElement ? b.visualElement : c, e = a.l.has(d), f = a.i.get(d), a.l.add(d),
        a.i.set(d, !1), !1 !== f && (c || b.visualElement) && (!(d = W(8)) || !jk(b) && b.data && b.data.loggingDirectives || (c = b.visualElement ? b.visualElement : V(c), kk(b, 8) ? Xj(a.h, d, c) : kk(b, 2) && !e && Vj(a.h, d, c)))
}
class nk {
    constructor() {
        this.m = new Set;
        this.l = new Set;
        this.i = new Map;
        this.h = void 0
    }
    j(a) {
        N("use_ts_visibilitylogger") ? ck().j(a) : this.h = a
    }
    clear() {
        N("use_ts_visibilitylogger") ? ck().clear() : (this.m.clear(), this.l.clear(), this.i.clear())
    }
}(function() {
    var a = nk;
    a.ia = void 0;
    a.B = function() {
        return a.ia ? a.ia : a.ia = new a
    }
})();
var ok = a => self.btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(a)))).replace(/\+/g, "-").replace(/\//g, "_");
var pk = ["notifications_register", "notifications_check_registration"];
let qk = null;

function Z(a, b) {
    const c = {};
    c.key = a;
    c.value = b;
    return rk().then(d => new Promise((e, f) => {
        try {
            const g = d.transaction("swpushnotificationsstore", "readwrite").objectStore("swpushnotificationsstore").put(c);
            g.onsuccess = () => {
                e()
            };
            g.onerror = () => {
                f()
            }
        } catch (g) {
            f(g)
        }
    }))
}

function sk() {
    return Z("IndexedDBCheck", "testing IndexedDB").then(() => tk("IndexedDBCheck")).then(a => "testing IndexedDB" === a ? Promise.resolve() : Promise.reject()).then(() => !0).catch(() => !1)
}

function tk(a) {
    const b = new O("Error accessing DB");
    return rk().then(c => new Promise((d, e) => {
        try {
            const f = c.transaction("swpushnotificationsstore").objectStore("swpushnotificationsstore").get(a);
            f.onsuccess = () => {
                const g = f.result;
                d(g ? g.value : null)
            };
            f.onerror = () => {
                b.params = {
                    key: a,
                    source: "onerror"
                };
                e(b)
            }
        } catch (f) {
            b.params = {
                key: a,
                thrownError: String(f)
            }, e(b)
        }
    }), () => null)
}

function rk() {
    return qk ? Promise.resolve(qk) : new Promise((a, b) => {
        const c = self.indexedDB.open("swpushnotificationsdb");
        c.onerror = b;
        c.onsuccess = () => {
            const d = c.result;
            if (d.objectStoreNames.contains("swpushnotificationsstore")) qk = d, a(qk);
            else return self.indexedDB.deleteDatabase("swpushnotificationsdb"), rk()
        };
        c.onupgradeneeded = uk
    })
}

function uk(a) {
    a = a.target.result;
    a.objectStoreNames.contains("swpushnotificationsstore") && a.deleteObjectStore("swpushnotificationsstore");
    a.createObjectStore("swpushnotificationsstore", {
        keyPath: "key"
    })
};
const vk = {
    WEB_UNPLUGGED: "^unplugged/",
    WEB_UNPLUGGED_ONBOARDING: "^unplugged/",
    WEB_UNPLUGGED_OPS: "^unplugged/",
    WEB_UNPLUGGED_PUBLIC: "^unplugged/",
    WEB_CREATOR: "^creator/",
    WEB_KIDS: "^kids/",
    WEB_EXPERIMENTS: "^experiments/",
    WEB_MUSIC: "^music/",
    WEB_REMIX: "^music/",
    WEB_MUSIC_EMBEDDED_PLAYER: "^music/",
    WEB_MUSIC_EMBEDDED_PLAYER: "^main_app/|^sfv/"
};

function wk(a) {
    if (1 === a.length) return a[0];
    var b = vk.UNKNOWN_INTERFACE;
    if (b) {
        b = new RegExp(b);
        for (var c of a)
            if (b.exec(c)) return c
    }
    const d = [];
    Object.entries(vk).forEach(([e, f]) => {
        "UNKNOWN_INTERFACE" !== e && d.push(f)
    });
    c = new RegExp(d.join("|"));
    a.sort((e, f) => e.length - f.length);
    for (const e of a)
        if (!c.exec(e)) return e;
    return a[0]
}

function xk(a) {
    return `/youtubei/v1/${wk(a)}`
};
v("ytLoggingLatencyUsageStats_", u.ytLoggingLatencyUsageStats_ || {});
const yk = window;
class zk {
    constructor() {
        this.timing = {};
        this.clearResourceTimings = () => {};
        this.webkitClearResourceTimings = () => {};
        this.mozClearResourceTimings = () => {};
        this.msClearResourceTimings = () => {};
        this.oClearResourceTimings = () => {}
    }
}
var Ak = yk.performance || yk.mozPerformance || yk.msPerformance || yk.webkitPerformance || new zk;
ma(Ak.clearResourceTimings || Ak.webkitClearResourceTimings || Ak.mozClearResourceTimings || Ak.msClearResourceTimings || Ak.oClearResourceTimings || pa, Ak);

function Bk(a, b) {
    N("safe_logging_library_killswitch") ? Uj(void 0, a, b) : Xe(Tj)(void 0, a, b, void 0, void 0, void 0)
};

function Ck() {
    Dk.h || (Dk.h = new Dk);
    return Dk.h
}

function Ek(a, b, c = {}) {
    a.i.add(c.layer || 0);
    a.l = () => {
        Fk(a, b, c);
        const d = Hj(c.layer);
        if (d) {
            for (const e of a.u) Gk(a, e[0], e[1] || d, c.layer);
            for (const e of a.v) Hk(a, e[0], e[1])
        }
    };
    W(c.layer) || a.l();
    if (c.sa)
        for (const d of c.sa) Ik(a, d, c.layer);
    else pj(Error("Delayed screen needs a data promise."))
}

function Fk(a, b, c = {}) {
    var d = void 0;
    c.layer || (c.layer = 0);
    d = void 0 !== c.Za ? c.Za : c.layer;
    const e = W(d);
    d = Hj(d);
    let f;
    d && (void 0 !== c.parentCsn ? f = {
        clientScreenNonce: c.parentCsn,
        visualElement: d
    } : e && "UNDEFINED_CSN" !== e && (f = {
        clientScreenNonce: e,
        visualElement: d
    }));
    let g;
    const h = M("EVENT_ID");
    "UNDEFINED_CSN" === e && h && (g = {
        servletData: {
            serializedServletEventId: h
        }
    });
    let k;
    try {
        k = Rj(a.client, b, f, c.ra, c.cttAuthInfo, g, c.Vb)
    } catch (p) {
        tj(p, {
            kc: b,
            rootVe: d,
            dc: void 0,
            Tb: e,
            cc: f,
            ra: c.ra
        });
        pj(p);
        return
    }
    Mj(k, b, c.layer, c.cttAuthInfo);
    e && "UNDEFINED_CSN" !== e && d && !Jj(e) && Xj(a.client, e, d, !0);
    a.h[a.h.length - 1] && !a.h[a.h.length - 1].csn && (a.h[a.h.length - 1].csn = k || "");
    ek();
    const l = Hj(c.layer);
    e && "UNDEFINED_CSN" !== e && l && (N("web_mark_root_visible") || N("music_web_mark_root_visible")) && Bk(k, l);
    a.i.delete(c.layer || 0);
    a.l = void 0;
    let m;
    null == (m = a.V.get(c.layer)) || m.forEach((p, t) => {
        p ? Gk(a, t, p, c.layer) : l && Gk(a, t, l, c.layer)
    });
    Jk(a)
}

function Kk(a) {
    var b = 28631,
        c = {
            layer: 8
        };
    [28631].includes(b) || (qj(new O("createClientScreen() called with a non-page VE", b)), b = 83769);
    c.isHistoryNavigation || a.h.push({
        rootVe: b,
        key: c.key || ""
    });
    a.u = [];
    a.v = [];
    c.sa ? Ek(a, b, c) : Fk(a, b, c)
}

function Ik(a, b, c = 0) {
    b.then(d => {
        a.i.has(c) && a.l && a.l();
        const e = W(c),
            f = Hj(c);
        if (e && f) {
            var g;
            (null == d ? 0 : null == (g = d.response) ? 0 : g.trackingParams) && Sj(a.client, e, f, [V(d.response.trackingParams)]);
            var h;
            (null == d ? 0 : null == (h = d.playerResponse) ? 0 : h.trackingParams) && Sj(a.client, e, f, [V(d.playerResponse.trackingParams)])
        }
    })
}

function Gk(a, b, c, d = 0) {
    if (a.i.has(d)) a.u.push([b, c]);
    else {
        var e = W(d);
        c = c || Hj(d);
        e && c && Sj(a.client, e, c, [b])
    }
}

function Lk(a, b, c = 0) {
    (c = W(c)) && Yj(a.client, c, b)
}

function Mk(a, b, c, d = 0) {
    if (!b) return !1;
    d = W(d);
    if (!d) return !1;
    Yj(a.client, d, V(b), c);
    return !0
}

function Nk(a, b) {
    const c = b.Sa && b.Sa();
    b.visualElement ? Lk(a, b.visualElement, c) : (b = fk(ck(), b), Mk(a, b, void 0, c))
}

function Hk(a, b, c, d = 0) {
    const e = W(d);
    d = b || Hj(d);
    e && d && (a = a.client, b = {
        cttAuthInfo: Lj(e) || void 0,
        sequenceGroup: e
    }, N("il_via_jspb") ? (c = new we, c.h(e), d = d.getAsJspb(), D(c, J, 2, d), "UNDEFINED_CSN" === e ? X("visualElementStateChanged", b, void 0, c) : fj(c, b, a)) : (c = {
        csn: e,
        ve: d.getAsJson(),
        clientData: c
    }, "UNDEFINED_CSN" === e ? X("visualElementStateChanged", b, c) : a ? Wi("visualElementStateChanged", c, a, b) : U("visualElementStateChanged", c, b)))
}

function Jk(a) {
    for (var b = 0; b < a.m.length; b++) {
        var c = a.m[b];
        try {
            c()
        } catch (d) {
            pj(d)
        }
    }
    a.m.length = 0;
    for (b = 0; b < a.D.length; b++) {
        c = a.D[b];
        try {
            c()
        } catch (d) {
            pj(d)
        }
    }
}
var Dk = class {
    constructor() {
        this.u = [];
        this.v = [];
        this.h = [];
        this.m = [];
        this.D = [];
        this.i = new Set;
        this.V = new Map
    }
    j(a) {
        this.client = a
    }
    clickCommand(a, b, c = 0) {
        return Mk(this, a.clickTrackingParams, b, c)
    }
    visualElementStateChanged(a, b, c = 0) {
        0 === c && this.i.has(c) ? this.v.push([a, b]) : Hk(this, a, b, c)
    }
};
var Ok = class extends F {
    constructor(a) {
        super(a)
    }
};
var Pk = class extends F {
    constructor(a) {
        super(a)
    }
};
Pk.h = "yt.sw.adr";

function Qk(a) {
    return r(function*() {
        var b = yield u.fetch(a.i);
        if (200 !== b.status) return Promise.reject("Server error when retrieving AmbientData");
        b = yield b.text();
        if (!b.startsWith(")]}'\n")) return Promise.reject("Incorrect JSPB formatting");
        a: {
            b = JSON.parse(b.substring(5));
            for (let c = 0; c < b.length; c++)
                if (b[c][0] === (new Pk).constructor.h) {
                    b = new Pk(b[c]);
                    break a
                }
            b = null
        }
        return b ? b : Promise.reject("AmbientData missing from response")
    })
}

function Rk(a = !1) {
    const b = Sk.h;
    return r(function*() {
        if (a || !b.h) b.h = Qk(b).then(b.j).catch(c => {
            delete b.h;
            pj(c)
        });
        return b.h
    })
}
var Sk = class {
    constructor() {
        this.i = Tk("/sw.js_data")
    }
    j(a) {
        const b = Cb(a, Ok, 2);
        if (b) {
            const c = B(b, 5);
            c && (u.__SAPISID = c);
            null != B(b, 10) ? K("EOM_VISITOR_DATA", B(b, 10)) : null != B(b, 7) && K("VISITOR_DATA", B(b, 7));
            null != B(b, 4) && K("SESSION_INDEX", String(B(b, 4)));
            null != B(b, 8) && K("DELEGATED_SESSION_ID", B(b, 8))
        }
        return a
    }
};

function Uk(a, b) {
    b.encryptedTokenJarContents && (a.h[b.encryptedTokenJarContents] = b, "string" === typeof b.expirationSeconds && setTimeout(() => {
        delete a.h[b.encryptedTokenJarContents]
    }, 1E3 * Number(b.expirationSeconds)))
}
var Vk = class {
    constructor() {
        this.h = {}
    }
    handleResponse(a, b) {
        if (!b) throw Error("request needs to be passed into ConsistencyService");
        let c, d;
        b = (null == (c = b.K.context) ? void 0 : null == (d = c.request) ? void 0 : d.consistencyTokenJars) || [];
        let e;
        if (a = null == (e = a.responseContext) ? void 0 : e.consistencyTokenJar) {
            for (const f of b) delete this.h[f.encryptedTokenJarContents];
            Uk(this, a)
        }
    }
};

function Wk() {
    var a = M("INNERTUBE_CONTEXT");
    if (!a) return pj(Error("Error: No InnerTubeContext shell provided in ytconfig.")), {};
    a = xa(a);
    N("web_no_tracking_params_in_shell_killswitch") || delete a.clickTracking;
    a.client || (a.client = {});
    var b = a.client;
    b.utcOffsetMinutes = -Math.floor((new Date).getTimezoneOffset());
    var c = Te();
    c ? b.experimentsToken = c : delete b.experimentsToken;
    Vk.h || (Vk.h = new Vk);
    b = Vk.h.h;
    c = [];
    let d = 0;
    for (const e in b) c[d++] = b[e];
    a.request = Object.assign({}, a.request, {
        consistencyTokenJars: c
    });
    a.user = Object.assign({}, a.user);
    return a
};

function Xk(a) {
    var b = a;
    if (a = M("INNERTUBE_HOST_OVERRIDE")) {
        a = String(a);
        var c = String,
            d = b.match(Ga);
        b = d[5];
        var e = d[6];
        d = d[7];
        var f = "";
        b && (f += b);
        e && (f += "?" + e);
        d && (f += "#" + d);
        b = a + c(f)
    }
    return b
};
var Yk = class {};
const Zk = {
    GET_DATASYNC_IDS: function(a) {
        return () => new a
    }(class extends Yk {})
};
const $k = ["type.googleapis.com/youtube.api.pfiinnertube.YoutubeApiInnertube.BrowseResponse"];

function al(a) {
    var b = {
            Sb: {}
        },
        c = Af();
    if (void 0 !== Zh.h) {
        const d = Zh.h;
        a = [b !== d.m, a !== d.l, c !== d.j, !1, !1, void 0 !== d.i];
        if (a.some(e => e)) throw new O("InnerTubeTransportService is already initialized", a);
    } else Zh.h = new Zh(b, a, c)
}

function bl(a, b) {
    return r(function*() {
        var c, d = {
            sessionIndex: null == a ? void 0 : null == (c = a.qa) ? void 0 : c.sessionIndex
        };
        c = yield jd(Cf(0, d));
        return Promise.resolve(Object.assign({}, cl(b), c))
    })
}

function dl(a, b, c) {
    return r(function*() {
        var d;
        if (null == b ? 0 : null == (d = b.K) ? 0 : d.context)
            for (const m of []) m.fc(b.K.context);
        var e;
        if (null == (e = a.i) ? 0 : e.nc(b.input, b.K)) return yield a.i.Xb(b.input, b.K);
        var f;
        if ((d = null == (f = b.config) ? void 0 : f.jc) && a.h.has(d) && N("web_memoize_inflight_requests")) var g = a.h.get(d);
        else {
            f = JSON.stringify(b.K);
            let m;
            e = null != (m = null == (g = b.U) ? void 0 : g.headers) ? m : {};
            b.U = Object.assign({}, b.U, {
                headers: Object.assign({}, e, c)
            });
            g = Object.assign({}, b.U);
            "POST" === b.U.method && (g = Object.assign({},
                g, {
                    body: f
                }));
            g = a.l.fetch(b.input, g, b.config);
            d && a.h.set(d, g)
        }
        g = yield g;
        var h;
        let k;
        if (g && "error" in g && (null == (h = g) ? 0 : null == (k = h.error) ? 0 : k.details)) {
            h = g.error.details;
            for (const m of h)(h = m["@type"]) && -1 < $k.indexOf(h) && (delete m["@type"], g = m)
        }
        d && a.h.has(d) && a.h.delete(d);
        let l;
        !g && (null == (l = a.i) ? 0 : l.Rb(b.input, b.K)) && (g = yield a.i.Wb(b.input, b.K));
        return g || void 0
    })
}

function el(a, b, c) {
    var d = {
        qa: {
            identity: Df
        }
    };
    b.context || (b.context = Wk());
    return new G(e => r(function*() {
        var f = Xk(c);
        f = gf(f) ? "same-origin" : "cors";
        if (a.j.fb) {
            var g, h = null == d ? void 0 : null == (g = d.qa) ? void 0 : g.sessionIndex;
            g = Cf(0, {
                sessionIndex: h
            });
            f = Object.assign({}, cl(f), g)
        } else f = yield bl(d, f);
        g = Xk(c);
        h = {};
        M("INNERTUBE_OMIT_API_KEY_WHEN_AUTH_HEADER_IS_PRESENT") && (null == f ? 0 : f.Authorization) || (h.key = M("INNERTUBE_API_KEY"));
        N("json_condensed_response") && (h.prettyPrint = "false");
        g = ff(g, h || {}, !1);
        h = {
            method: "POST",
            mode: gf(g) ? "same-origin" : "cors",
            credentials: gf(g) ? "same-origin" : "include"
        };
        var k = {};
        const l = {};
        for (const m of Object.keys(k)) k[m] && (l[m] = k[m]);
        0 < Object.keys(l).length && (h.headers = l);
        e(dl(a, {
            input: g,
            U: h,
            K: b,
            config: d
        }, f))
    }))
}

function cl(a) {
    const b = {
        "Content-Type": "application/json"
    };
    M("EOM_VISITOR_DATA") ? b["X-Goog-EOM-Visitor-Id"] = M("EOM_VISITOR_DATA") : M("VISITOR_DATA") && (b["X-Goog-Visitor-Id"] = M("VISITOR_DATA"));
    b["X-Youtube-Bootstrap-Logged-In"] = M("LOGGED_IN", !1);
    "cors" !== a && ((a = M("INNERTUBE_CONTEXT_CLIENT_NAME")) && (b["X-Youtube-Client-Name"] = a), (a = M("INNERTUBE_CONTEXT_CLIENT_VERSION")) && (b["X-Youtube-Client-Version"] = a), (a = M("CHROME_CONNECTED_HEADER")) && (b["X-Youtube-Chrome-Connected"] = a), (a = M("DOMAIN_ADMIN_STATE")) &&
        (b["X-Youtube-Domain-Admin-State"] = a));
    return b
}
var Zh = class {
    constructor(a, b, c) {
        this.m = a;
        this.l = b;
        this.j = c;
        this.i = void 0;
        this.h = new Map;
        a.ma || (a.ma = {});
        a.ma = Object.assign({}, Zk, a.ma)
    }
};
var Yh = new Wh;
let fl;

function gl() {
    if (!fl) {
        const a = di();
        al({
            fetch: (b, c) => jd(fetch(new Request(b, c)))
        });
        Xh(a);
        fl = a.resolve(Yh)
    }
    return fl
};

function hl(a) {
    return r(function*() {
        yield il();
        qj(a)
    })
}

function jl(a) {
    return r(function*() {
        yield il();
        pj(a)
    })
}

function kl(a) {
    r(function*() {
        var b = yield Kg();
        b ? yield Dh(a, b): (yield Rk(), b = {
            timestamp: a.timestamp
        }, b = a.appShellAssetLoadReport ? {
            T: "appShellAssetLoadReport",
            payload: a.appShellAssetLoadReport,
            options: b
        } : a.clientError ? {
            T: "clientError",
            payload: a.clientError,
            options: b
        } : void 0, b && U(b.T, b.payload))
    })
}

function il() {
    return r(function*() {
        try {
            yield Rk()
        } catch (a) {}
    })
};
const ll = {
        granted: "GRANTED",
        denied: "DENIED",
        unknown: "UNKNOWN"
    },
    ml = RegExp("^(?:[a-z]+:)?//", "i");

function nl(a) {
    var b = a.data;
    a = b.type;
    b = b.data;
    "notifications_register" === a ? (Z("IDToken", b), ol()) : "notifications_check_registration" === a && pl(b)
}

function ql() {
    return self.clients.matchAll({
        type: "window",
        includeUncontrolled: !0
    }).then(a => {
        if (a)
            for (const b of a) b.postMessage({
                type: "update_unseen_notifications_count_signal"
            })
    })
}

function rl(a) {
    const b = [];
    a.forEach(c => {
        b.push({
            key: c.key,
            value: c.value
        })
    });
    return b
}

function sl(a) {
    return r(function*() {
        const b = rl(a.payload.chrome.extraUrlParams),
            c = {
                recipientId: a.recipientId,
                endpoint: a.payload.chrome.endpoint,
                extraUrlParams: b
            },
            d = xk(Ie);
        return tl().then(e => el(e, c, d).then(f => {
            f.json().then(g => g && g.endpointUrl ? ul(a, g.endpointUrl) : Promise.resolve()).catch(g => {
                jl(g);
                Promise.reject(g)
            })
        }))
    })
}

function vl(a, b) {
    var c = W(8);
    if (null == c || !b) return a;
    a = ml.test(a) ? new URL(a) : new URL(a, self.registration.scope);
    a.searchParams.set("parentCsn", c);
    a.searchParams.set("parentTrackingParams", b);
    return a.toString()
}

function ul(a, b) {
    a.deviceId && Z("DeviceId", a.deviceId);
    a.timestampSec && Z("TimestampLowerBound", a.timestampSec);
    const c = a.payload.chrome,
        d = Ck();
    Kk(d);
    var e;
    const f = null == (e = c.postedEndpoint) ? void 0 : e.clickTrackingParams;
    e = c.title;
    const g = {
        body: c.body,
        icon: c.iconUrl,
        data: {
            nav: vl(b, f),
            id: c.notificationId,
            attributionTag: c.attributionTag,
            clickEndpoint: c.clickEndpoint,
            postedEndpoint: c.postedEndpoint,
            clickTrackingParams: f,
            isDismissed: !0
        },
        tag: c.notificationTag || c.title + c.body + c.iconUrl,
        requireInteraction: !0
    };
    return self.registration.showNotification(e, g).then(() => {
        var h;
        (null == (h = g.data) ? 0 : h.postedEndpoint) && wl(g.data.postedEndpoint);
        let k;
        if (null == (k = g.data) ? 0 : k.clickTrackingParams) h = V(g.data.clickTrackingParams), Gk(d, h, void 0, 8), h = {
            da: 8,
            visualElement: h
        }, lk(nk.B(), h);
        xl(a.displayCap)
    }).catch(() => {})
}

function wl(a) {
    if (!ii(a, He)) return Promise.reject();
    const b = {
            serializedRecordNotificationInteractionsRequest: ii(a, He).serializedInteractionsRequest
        },
        c = xk(Je);
    return tl().then(d => el(d, b, c)).then(d => d)
}

function xl(a) {
    -1 !== a && self.registration.getNotifications().then(b => {
        for (let d = 0; d < b.length - a; d++) {
            b[d].data.isDismissed = !1;
            b[d].close();
            let e;
            if (null == (e = b[d].data) ? 0 : e.clickTrackingParams) {
                let f;
                var c = V(null == (f = b[d].data) ? void 0 : f.clickTrackingParams);
                const g = {
                        da: 8,
                        visualElement: c
                    },
                    h = Aj(82046),
                    k = Ck();
                Gk(k, h, c, 8);
                c = {
                    da: 8,
                    visualElement: h
                };
                lk(nk.B(), c);
                Nk(k, c);
                mk(nk.B(), g)
            }
        }
    })
}

function pl(a) {
    const b = [yl(a), tk("RegistrationTimestamp").then(zl), Al(), Bl(), Cl()];
    Promise.all(b).catch(() => {
        Z("IDToken", a);
        ol();
        return Promise.resolve()
    })
}

function zl(a) {
    return 9E7 >= Date.now() - (a || 0) ? Promise.resolve() : Promise.reject()
}

function yl(a) {
    return tk("IDToken").then(b => a === b ? Promise.resolve() : Promise.reject())
}

function Al() {
    return tk("Permission").then(a => Notification.permission === a ? Promise.resolve() : Promise.reject())
}

function Bl() {
    return tk("Endpoint").then(a => Dl().then(b => a === b ? Promise.resolve() : Promise.reject()))
}

function Cl() {
    return tk("application_server_key").then(a => El().then(b => a === b ? Promise.resolve() : Promise.reject()))
}

function Fl() {
    var a = Notification.permission;
    if (ll[a]) return ll[a]
}

function ol() {
    Z("RegistrationTimestamp", 0);
    Promise.all([Dl(), Gl(), Hl(), El()]).then(([a, b, c, d]) => {
        b = b ? ok(b) : null;
        c = c ? ok(c) : null;
        d = d ? Ta(new Uint8Array(d), 4) : null;
        Il(a, b, c, d)
    }).catch(() => {
        Il()
    })
}

function Il(a = null, b = null, c = null, d = null) {
    sk().then(e => {
        e && (Z("Endpoint", a), Z("P256dhKey", b), Z("AuthKey", c), Z("application_server_key", d), Z("Permission", Notification.permission), Promise.all([tk("DeviceId"), tk("NotificationsDisabled")]).then(([f, g]) => {
            if (null != f) var h = f;
            else {
                f = [];
                var k;
                h = h || Cd.length;
                for (k = 0; 256 > k; k++) f[k] = Cd[0 | Math.random() * h];
                h = f.join("")
            }
            Jl(h, null != a ? a : void 0, null != b ? b : void 0, null != c ? c : void 0, null != d ? d : void 0, null != g ? g : void 0)
        }))
    })
}

function Jl(a, b, c, d, e, f) {
    r(function*() {
        const g = {
                notificationRegistration: {
                    chromeRegistration: {
                        deviceId: a,
                        pushParams: {
                            applicationServerKey: e,
                            authKey: d,
                            p256dhKey: c,
                            browserEndpoint: b
                        },
                        notificationsDisabledInApp: f,
                        permission: Fl()
                    }
                }
            },
            h = xk(Ke);
        return tl().then(k => el(k, g, h).then(() => {
            Z("DeviceId", a);
            Z("RegistrationTimestamp", Date.now());
            Z("TimestampLowerBound", Date.now())
        }, l => {
            hl(l)
        }))
    })
}

function Dl() {
    return self.registration.pushManager.getSubscription().then(a => a ? Promise.resolve(a.endpoint) : Promise.resolve(null))
}

function Gl() {
    return self.registration.pushManager.getSubscription().then(a => a && a.getKey ? Promise.resolve(a.getKey("p256dh")) : Promise.resolve(null))
}

function Hl() {
    return self.registration.pushManager.getSubscription().then(a => a && a.getKey ? Promise.resolve(a.getKey("auth")) : Promise.resolve(null))
}

function El() {
    return self.registration.pushManager.getSubscription().then(a => a ? Promise.resolve(a.options.applicationServerKey) : Promise.resolve(null))
}

function tl() {
    return r(function*() {
        try {
            return yield Rk(!0), gl()
        } catch (a) {
            return yield hl(a), Promise.reject(a)
        }
    })
};
let Kl = self.location.origin + "/";

function Tk(a) {
    let b = "undefined" !== typeof ServiceWorkerGlobalScope && self instanceof ServiceWorkerGlobalScope ? Tc.registration.scope : Kl;
    b.endsWith("/") && (b = b.slice(0, -1));
    return b + a
};
let Ll = void 0;

function Ml(a) {
    return r(function*() {
        Ll || (Ll = yield a.open("yt-appshell-assets"));
        return Ll
    })
}

function Nl(a, b) {
    return r(function*() {
        const c = yield Ml(a), d = b.map(e => Ol(c, e));
        return Promise.all(d)
    })
}

function Pl(a, b) {
    return r(function*() {
        let c;
        try {
            c = yield a.match(b, {
                cacheName: "yt-appshell-assets"
            })
        } catch (d) {}
        return c
    })
}

function Ql(a, b) {
    return r(function*() {
        const c = yield Ml(a), d = (yield c.keys()).filter(e => !b.includes(e.url)).map(e => c.delete(e));
        return Promise.all(d)
    })
}

function Rl(a, b, c) {
    return r(function*() {
        yield(yield Ml(a)).put(b, c)
    })
}

function Sl(a, b) {
    r(function*() {
        yield(yield Ml(a)).delete(b)
    })
}

function Ol(a, b) {
    return r(function*() {
        return (yield a.match(b)) ? Promise.resolve() : a.add(b)
    })
};
var Tl = Tg("yt-serviceworker-metadata", {
    P: {
        auth: {
            O: 1
        },
        ["resource-manifest-assets"]: {
            O: 2
        }
    },
    ea: !0,
    upgrade(a, b) {
        b(1) && lg(a, "resource-manifest-assets");
        b(2) && lg(a, "auth")
    },
    version: 2
});
let Ul = null;

function Vl(a) {
    return Ag(Tl(), a)
}

function Wl(a, b) {
    return r(function*() {
        yield S(yield Vl(a.token), ["resource-manifest-assets"], "readwrite", c => {
            const d = c.objectStore("resource-manifest-assets"),
                e = Date.now();
            return Q(d.h.put(b, e)).then(() => {
                Ul = e;
                let f = !0;
                return qg(d, {
                    query: IDBKeyRange.bound(0, Date.now()),
                    direction: "prev"
                }, g => f ? (f = !1, g.advance(5)) : d.delete(g.getKey()).then(() => g.continue()))
            })
        })
    })
}

function Xl(a, b) {
    return r(function*() {
        let c = !1,
            d = 0;
        yield S(yield Vl(a.token), ["resource-manifest-assets"], "readonly", e => qg(e.objectStore("resource-manifest-assets"), {
            query: IDBKeyRange.bound(0, Date.now()),
            direction: "prev"
        }, f => {
            if (f.R().includes(b)) c = !0;
            else return d += 1, f.continue()
        }));
        return c ? d : -1
    })
}

function Yl(a) {
    return r(function*() {
        Ul || (yield S(yield Vl(a.token), ["resource-manifest-assets"], "readonly", b => qg(b.objectStore("resource-manifest-assets"), {
            query: IDBKeyRange.bound(0, Date.now()),
            direction: "prev"
        }, c => {
            Ul = c.getKey()
        })));
        return Ul
    })
}
var Zl = class {
    constructor(a) {
        this.token = a
    }
    static B() {
        return r(function*() {
            const a = yield Kg();
            if (a) return Zl.h || (Zl.h = new Zl(a)), Zl.h
        })
    }
};

function $l(a, b) {
    return r(function*() {
        yield ng(yield Vl(a.token), "auth", b, "shell_identifier_key")
    })
}

function am(a) {
    return r(function*() {
        return (yield(yield Vl(a.token)).get("auth", "shell_identifier_key")) || ""
    })
}

function bm(a) {
    return r(function*() {
        yield(yield Vl(a.token)).clear("auth")
    })
}
var cm = class {
    constructor(a) {
        this.token = a
    }
    static B() {
        return r(function*() {
            const a = yield Kg();
            if (a) return cm.h || (cm.h = new cm(a)), cm.h
        })
    }
};

function dm() {
    r(function*() {
        const a = yield cm.B();
        a && (yield bm(a))
    })
};
var em = class extends F {
    constructor(a) {
        super(a)
    }
};

function fm(a) {
    a: {
        var b = gm;
        if (jc.length) {
            const e = jc.pop();
            var {
                X: c = !1
            } = {};
            e.X = c;
            e.h.init(a, void 0, void 0, void 0);
            a = e
        } else a = new ic(a);
        try {
            const e = nc(b);
            var d = oc(new e.ga, a, e);
            break a
        } finally {
            b = a, b.h.clear(), b.l = -1, b.i = -1, 100 > jc.length && jc.push(b)
        }
        d = void 0
    }
    return d
}
var hm = [1],
    gm = [class extends F {
        constructor(a) {
            super(a, -1, hm)
        }
    }, 1, Ac, [em, 1, zc]];

function im(a) {
    return r(function*() {
        const b = a.headers.get("X-Resource-Manifest");
        return b ? Promise.resolve(jm(b)) : Promise.reject(Error("No resource manifest header"))
    })
}

function jm(a) {
    return Fb(fm(decodeURIComponent(a)), em, 1).reduce((b, c) => {
        (c = B(c, 1)) && b.push(c);
        return b
    }, [])
};

function km(a) {
    return r(function*() {
        const b = yield Rk();
        if (b && null != B(b, 3)) {
            var c = yield cm.B();
            c && (c = yield am(c), B(b, 3) !== c && (Sl(a.caches, a.h), dm()))
        }
    })
}

function lm(a) {
    return r(function*() {
        let b, c;
        try {
            c = yield mm(a.i), b = yield im(c), yield Nl(a.caches, b)
        } catch (d) {
            return Promise.reject(d)
        }
        try {
            yield nm(), yield Rl(a.caches, a.h, c)
        } catch (d) {
            return Promise.reject(d)
        }
        if (b) try {
            yield om(a, b, a.h)
        } catch (d) {}
        return Promise.resolve()
    })
}

function pm(a) {
    return r(function*() {
        yield km(a);
        return lm(a)
    })
}

function mm(a) {
    return r(function*() {
        try {
            return yield u.fetch(new Request(a))
        } catch (b) {
            return Promise.reject(b)
        }
    })
}

function nm() {
    return r(function*() {
        var a = yield Rk();
        let b;
        a && null != B(a, 3) && (b = B(a, 3));
        return b ? (a = yield cm.B()) ? Promise.resolve($l(a, b)) : Promise.reject(Error("Could not get AuthMonitor instance")) : Promise.reject(Error("Could not get datasync ID"))
    })
}

function om(a, b, c) {
    return r(function*() {
        const d = yield Zl.B();
        if (d) try {
            yield Wl(d, b)
        } catch (e) {
            yield hl(e)
        }
        b.push(c);
        try {
            yield Ql(a.caches, b)
        } catch (e) {
            yield hl(e)
        }
        return Promise.resolve()
    })
}

function qm(a, b) {
    return r(function*() {
        return Pl(a.caches, b)
    })
}

function rm(a) {
    return r(function*() {
        return Pl(a.caches, a.h)
    })
}
var sm = class {
    constructor() {
        var a = self.caches;
        let b = Tk("/app_shell");
        N("service_worker_forward_exp_params") && (b += self.location.search);
        var c = Tk("/app_shell_home");
        this.caches = a;
        this.i = b;
        this.h = c
    }
};
var tm = class {
    constructor() {
        const a = this;
        this.stream = new ReadableStream({
            start(b) {
                a.close = () => void b.close();
                a.h = c => {
                    const d = c.getReader();
                    return d.read().then(function h({
                        done: f,
                        value: g
                    }) {
                        if (f) return Promise.resolve();
                        b.enqueue(g);
                        return d.read().then(h)
                    })
                };
                a.i = () => {
                    const c = (new TextEncoder).encode("<script>if (window.fetchInitialData) { window.fetchInitialData(); } else { window.getInitialData = undefined; }\x3c/script>");
                    b.enqueue(c)
                }
            }
        })
    }
};

function um(a, b) {
    return r(function*() {
        const c = b.request,
            d = yield qm(a.h, c.url);
        if (d) return kl({
            appShellAssetLoadReport: {
                assetPath: c.url,
                cacheHit: !0
            },
            timestamp: R()
        }), d;
        vm(c);
        return wm(b)
    })
}

function xm(a, b) {
    return r(function*() {
        const c = yield ym(b);
        if (c.response && (c.response.ok || "opaqueredirect" === c.response.type || 429 === c.response.status || 303 === c.response.status || 300 <= c.response.status && 400 > c.response.status)) return c.response;
        const d = yield rm(a.h);
        if (d) return zm(a), Am(d, b);
        Bm(a);
        return c.response ? c.response : Promise.reject(c.error)
    })
}

function Cm(a, b) {
    b = new URL(b);
    if (!a.config.pa.includes(b.pathname)) return !1;
    if (!b.search) return !0;
    for (const c of a.config.Ka)
        if (a = b.searchParams.get(c.key), void 0 === c.value || a === c.value)
            if (b.searchParams.delete(c.key), !b.search) return !0;
    return !1
}

function Dm(a, b) {
    return r(function*() {
        const c = yield rm(a.h);
        if (!c) return Bm(a), wm(b);
        zm(a);
        var d;
        a: {
            if (c.headers && (d = c.headers.get("date")) && (d = Date.parse(d), !isNaN(d))) {
                d = Math.round(R() - d);
                break a
            }
            d = -1
        }
        if (!(-1 < d && 7 <= d / 864E5)) return Am(c, b);
        d = yield ym(b);
        return d.response && d.response.ok ? d.response : Am(c, b)
    })
}

function wm(a) {
    return Promise.resolve(a.preloadResponse).then(b => b && !Em(b) ? b : u.fetch(a.request))
}

function vm(a) {
    const b = {
        assetPath: a.url,
        cacheHit: !1
    };
    Zl.B().then(c => {
        if (c) {
            var d = Yl(c).then(e => {
                e && (b.currentAppBundleTimestampSec = String(Math.floor(e / 1E3)))
            });
            c = Xl(c, a.url).then(e => {
                b.appBundleVersionDiffCount = e
            });
            Promise.all([d, c]).catch(e => {
                hl(e)
            }).finally(() => {
                kl({
                    appShellAssetLoadReport: b,
                    timestamp: R()
                })
            })
        } else kl({
            appShellAssetLoadReport: b,
            timestamp: R()
        })
    })
}

function zm(a) {
    kl({
        appShellAssetLoadReport: {
            assetPath: a.h.h,
            cacheHit: !0
        },
        timestamp: R()
    })
}

function Bm(a) {
    kl({
        appShellAssetLoadReport: {
            assetPath: a.h.h,
            cacheHit: !1
        },
        timestamp: R()
    })
}

function Am(a, b) {
    if (!N("sw_nav_preload_pbj")) return a;
    const c = new tm,
        d = c.h(a.body);
    Promise.resolve(b.preloadResponse).then(e => {
        if (!e || !Em(e)) throw Error("no pbj preload response available");
        d.then(() => c.h(e.body)).then(() => void c.close())
    }).catch(() => {
        d.then(() => {
            c.i();
            c.close()
        })
    });
    return new Response(c.stream, {
        status: a.status,
        statusText: a.statusText,
        headers: a.headers
    })
}

function ym(a) {
    return r(function*() {
        try {
            return {
                response: yield wm(a)
            }
        } catch (b) {
            return {
                error: b
            }
        }
    })
}

function Em(a) {
    return "pbj" === a.headers.get("x-navigation-preload-response-type")
}
var Nm = class {
    constructor() {
        var a = Fm;
        var b = {
            Na: Gm,
            bb: Hm([Im, /\/signin/, /\/logout/]),
            pa: ["/", "/feed/downloads"],
            Ka: Jm([{
                key: "feature",
                value: "ytca"
            }]),
            Ja: Km(N("kevlar_sw_app_wide_fallback") ? Lm : Mm)
        };
        this.h = a;
        this.config = b
    }
};
const Om = /^\/$/,
    Mm = [Om, /^\/feed\/downloads$/],
    Lm = [Om, /^\/feed\/\w*/, /^\/results$/, /^\/playlist$/, /^\/watch$/, /^\/channel\/\w*/];

function Km(a) {
    return new RegExp(a.map(b => b.source).join("|"))
}
const Pm = /^https:\/\/([\w-]*\.)*youtube\.com.*/;

function Hm(a) {
    a = Km(a);
    return new RegExp(`${Pm.source}(${a.source})`)
}
const Qm = Km([/\.css$/, /\.js$/, /\.ico$/, /\/ytmweb\/_\/js\//, /\/ytmweb\/_\/ss\//, /\/kabuki\/_\/js\//, /\/kabuki\/_\/ss\//, /\/ytmainappweb\/_\/ss\//]),
    Gm = new RegExp(`${Pm.source}(${Qm.source})`),
    Im = /purge_shell=1/;

function Jm(a = []) {
    const b = [];
    for (const c of Jc) b.push({
        key: c
    });
    for (const c of a) b.push(c);
    return b
}
Hm([Im]);
Jm();
var Sm = class {
    constructor() {
        var a = Fm,
            b = Rm;
        this.h = self;
        this.i = a;
        this.m = b;
        this.D = pk
    }
    init() {
        this.h.oninstall = this.u.bind(this);
        this.h.onactivate = this.j.bind(this);
        this.h.onfetch = this.l.bind(this);
        this.h.onmessage = this.v.bind(this)
    }
    u(a) {
        this.h.skipWaiting();
        const b = pm(this.i).catch(c => {
            hl(c);
            return Promise.resolve()
        });
        a.waitUntil(b)
    }
    j(a) {
        const b = [this.h.clients.claim()],
            c = this.h.registration;
        c.navigationPreload && (b.push(c.navigationPreload.enable()), N("sw_nav_preload_pbj") && b.push(c.navigationPreload.setHeaderValue("pbj")));
        a.waitUntil(Promise.all(b))
    }
    l(a) {
        const b = this;
        return r(function*() {
            var c = b.m,
                d = !!b.h.registration.navigationPreload;
            const e = a.request;
            if (c.config.bb.test(e.url)) Sk.h && (delete Sk.h.h, u.__SAPISID = void 0, K("VISITOR_DATA", void 0), K("SESSION_INDEX", void 0), K("DELEGATED_SESSION_ID", void 0)), d = a.respondWith,
                c = c.h, Sl(c.caches, c.h), dm(), c = wm(a), d.call(a, c);
            else if (c.config.Na.test(e.url)) a.respondWith(um(c, a));
            else if ("navigate" === e.mode) {
                const f = new URL(e.url),
                    g = c.config.pa;
                (!N("sw_nav_request_network_first") && g.includes(f.pathname) ? 0 : c.config.Ja.test(f.pathname)) ? a.respondWith(xm(c, a)): Cm(c, e.url) ? a.respondWith(Dm(c, a)) : d && a.respondWith(wm(a))
            }
        })
    }
    v(a) {
        const b = a.data;
        this.D.includes(b.type) ? nl(a) : "refresh_shell" === b.type && lm(this.i).catch(c => {
            hl(c)
        })
    }
};
var Tm = class {
    static B() {
        let a = y("ytglobal.storage_");
        a || (a = new Tm, v("ytglobal.storage_", a));
        return a
    }
    estimate() {
        return r(function*() {
            const a = navigator;
            let b;
            if (null == (b = a.storage) ? 0 : b.estimate) return a.storage.estimate();
            let c;
            if (null == (c = a.webkitTemporaryStorage) ? 0 : c.queryUsageAndQuota) return Um()
        })
    }
};

function Um() {
    const a = navigator;
    return new Promise((b, c) => {
        let d;
        null != (d = a.webkitTemporaryStorage) && d.queryUsageAndQuota ? a.webkitTemporaryStorage.queryUsageAndQuota((e, f) => {
            b({
                usage: e,
                quota: f
            })
        }, e => {
            c(e)
        }) : c(Error("webkitTemporaryStorage is not supported."))
    })
}
v("ytglobal.storageClass_", Tm);

function Vm(a, b) {
    Tm.B().estimate().then(c => {
        c = Object.assign({}, b, {
            isSw: void 0 === self.document,
            isIframe: self !== self.top,
            deviceStorageUsageMbytes: Wm(null == c ? void 0 : c.usage),
            deviceStorageQuotaMbytes: Wm(null == c ? void 0 : c.quota)
        });
        a.h("idbQuotaExceeded", c)
    })
}
class Xm {
    constructor() {
        var a = Ym;
        this.handleError = Zm;
        this.h = a;
        this.i = !1;
        void 0 === self.document || self.addEventListener("beforeunload", () => {
            this.i = !0
        });
        this.j = Math.random() <= Se("ytidb_transaction_ended_event_rate_limit_session", .2)
    }
    aa(a, b) {
        switch (a) {
            case "IDB_DATA_CORRUPTED":
                N("idb_data_corrupted_killswitch") || this.h("idbDataCorrupted", b);
                break;
            case "IDB_UNEXPECTEDLY_CLOSED":
                this.h("idbUnexpectedlyClosed", b);
                break;
            case "IS_SUPPORTED_COMPLETED":
                N("idb_is_supported_completed_killswitch") || this.h("idbIsSupportedCompleted", b);
                break;
            case "QUOTA_EXCEEDED":
                Vm(this, b);
                break;
            case "TRANSACTION_ENDED":
                this.j && Math.random() <= Se("ytidb_transaction_ended_event_rate_limit_transaction",
                    .1) && this.h("idbTransactionEnded", b);
                break;
            case "TRANSACTION_UNEXPECTEDLY_ABORTED":
                a = Object.assign({}, b, {
                    hasWindowUnloaded: this.i
                }), this.h("idbTransactionAborted", a)
        }
    }
}

function Wm(a) {
    return "undefined" === typeof a ? "-1" : String(Math.ceil(a / 1048576))
};
tf(qf(), {
    J: [{
        Ya: /Failed to fetch/,
        weight: 500
    }],
    H: []
});
var {
    handleError: Zm = oj,
    aa: Ym = U
} = {
    handleError: jl,
    aa: function(a, b) {
        return r(function*() {
            yield il();
            U(a, b)
        })
    }
};
for (Kf = new Xm; 0 < Jf.length;) {
    const a = Jf.shift();
    switch (a.type) {
        case "ERROR":
            Kf.handleError(a.payload);
            break;
        case "EVENT":
            Kf.aa(a.eventType, a.payload)
    }
}
Sk.h = new Sk;
self.onnotificationclick = function(a) {
    a.notification.close();
    const b = a.notification.data;
    b.isDismissed = !1;
    const c = self.clients.matchAll({
        type: "window",
        includeUncontrolled: !0
    });
    c.then(d => {
        a: {
            var e = b.nav;
            for (const f of d)
                if (f.url === e) {
                    f.focus();
                    break a
                }
            self.clients.openWindow(e)
        }
    });
    a.waitUntil(c);
    a.waitUntil(wl(b.clickEndpoint))
};
self.onnotificationclose = function(a) {
    var b = a.notification.data;
    if (null == b ? 0 : b.clickTrackingParams) {
        var c = V(b.clickTrackingParams);
        a = {
            da: 8,
            visualElement: c
        };
        if (b.isDismissed) {
            const d = Aj(74726);
            b = Ck();
            Gk(b, d, c, 8);
            c = {
                da: 8,
                visualElement: d
            };
            lk(nk.B(), c);
            Nk(b, c)
        }
        mk(nk.B(), a)
    }
};
self.onpush = function(a) {
    a.waitUntil(tk("NotificationsDisabled").then(b => {
        if (b) return Promise.resolve();
        if (a.data && a.data.text().length) try {
            return sl(a.data.json())
        } catch (c) {
            return Promise.resolve(c.message)
        }
        return Promise.resolve()
    }));
    a.waitUntil(ql())
};
self.onpushsubscriptionchange = function() {
    ol()
};
const Fm = new sm,
    Rm = new Nm;
(new Sm).init();