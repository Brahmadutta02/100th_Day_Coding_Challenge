! function(e) {
    "use strict";

    function t(e, t) {
        let s;
        return (...o) => {
            clearTimeout(s), s = setTimeout((() => {
                e(...o)
            }), t)
        }
    }
    const s = [{
        name: "CodeSandbox",
        schemes: ["http://codesandbox.io/*", "https://codesandbox.io/*"].map(o)
    }, {
        name: "Typeform",
        schemes: ["http://*.typeform.com/*", "https://*.typeform.com/*"].map(o)
    }, {
        name: "Tally Forms",
        schemes: ["http://tally.so/*", "https://tally.so/*"].map(o)
    }, {
        name: "Flourish",
        schemes: ["https?://public.flourish.studio/*"].map(o)
    }, {
        name: "Flourish App",
        schemes: ["https?://(app.flourish.studio|flourish-user-preview.com)/api/canva/embed/(visualisation|story)/[0-9]+/[A-Za-z0-9_-]{64}/"].map(o)
    }, {
        name: "Google Forms",
        schemes: ["https?://docs.google.com/forms/*", "https?://forms.gle/*"].map(o)
    }, {
        name: "Google Docs",
        schemes: ["https?://docs.google.com/document/*"].map(o)
    }, {
        name: "Google Sheets",
        schemes: ["https?://docs.google.com/spreadsheets/*"].map(o)
    }, {
        name: "Google Slides",
        schemes: ["https?://docs.google.com/presentation/*"].map(o)
    }];

    function o(e) {
        const t = e.replace(/[.]/g, "\\.").replace(/[*]/g, ".*");
        return new RegExp(`^${t}$`)
    }

    function i(e) {
        return s.some((t => t.schemes.some((t => t.test(e)))))
    }
    const n = new Map,
        a = new Map,
        c = new Map,
        r = () => document.querySelectorAll('[id^="embed-"]');

    function h(e, t) {
        e.contentWindow && (! function(e) {
            const t = e.clientWidth,
                s = e.clientHeight,
                o = t / s;
            a.set(e, {
                width: t,
                height: s,
                contentHeight: s,
                aspectRatio: o
            })
        }(t), n.set(e.contentWindow, t), 1 === n.size && window.addEventListener("message", l))
    }

    function l(e) {
        const s = e.source,
            o = n.get(s);
        if (!o || "https://cdn.iframe.ly" !== e.origin) return;
        const a = function(e) {
            const t = "string" == typeof e ? JSON.parse(e) : e,
                {
                    method: s,
                    url: o
                } = t;
            if ("resize" === s) {
                return parseFloat(t.height) ? {
                    type: "height",
                    height: t.height,
                    url: o
                } : void 0
            }
            if ("setIframelyEmbedData" === s || "setIframelyWidgetSize" === s) {
                const {
                    data: e
                } = t;
                if (e && e.media) {
                    const t = parseFloat(e.media["aspect-ratio"]),
                        s = parseFloat(e.media.height);
                    if (t) return {
                        type: "aspectRatio",
                        aspectRatio: t,
                        url: o
                    };
                    if (s) return {
                        type: "height",
                        height: s,
                        url: o
                    }
                }
            }
        }(e.data);
        if (null == a) return;
        i(a.url) || ("aspectRatio" === a.type ? p(a, o) : function(e, s, o) {
            let i = c.get(o);
            i || (i = t((e => {
                p(e, s), c.delete(o)
            }), 300));
            c.set(o, i), i(e)
        }(a, o, s))
    }

    function p(e, t) {
        const s = a.get(t);
        if (null == s) return;
        let o;
        switch (e.type) {
            case "height":
                o = e.height;
                break;
            case "aspectRatio":
                o = s.width / e.aspectRatio;
                break;
            default:
                return
        }
        const i = t.querySelector("div");
        if (n = o, c = s.contentHeight, Math.abs(n - c) < 5 || null == i) return;
        var n, c;
        const {
            height: r,
            aspectRatio: h
        } = s, l = r / o, p = o * h;
        t.style.overflow = "hidden", t.style.position = "relative", i.style.height = `${o}px`, i.style.width = `${p}px`, i.style.transform = `scale(${l})`, i.style.position = "absolute", i.style.transformOrigin = "0px 0px", a.set(t, { ...s,
            contentHeight: o
        })
    }
    r().forEach((e => {
        const t = e.querySelector("iframe"),
            s = document.createElement("div");
        null != t && (e.replaceChildren(), s.appendChild(t), e.appendChild(s), h(t, e))
    })), window.addEventListener("resize", t((() => {
        r().forEach((e => {
            const t = e.querySelector("div");
            if (t) {
                t.style.width = "100%", t.style.height = "100%", t.style.transform = "scale(1)";
                const s = e.clientWidth,
                    o = e.clientHeight,
                    i = s / o;
                a.set(e, {
                    width: s,
                    height: o,
                    contentHeight: o,
                    aspectRatio: i
                })
            }
        }))
    }), 300)), e.checkFreeformResizing = i, Object.defineProperty(e, "__esModule", {
        value: !0
    })
}({});