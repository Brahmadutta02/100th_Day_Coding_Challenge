(function(g) {
    var window = this;
    'use strict';
    var mjb = function(a) {
            return a
        },
        njb = function(a) {
            return a
        },
        ojb = function(a, b, c) {
            g.Xf(a);
            var d = g.bg(a, c);
            b = g.og(g.gda(d, b, !0));
            d !== b && g.cg(a, c, b);
            return b
        },
        pjb = function(a, b) {
            this.u = a >>> 0;
            this.j = b >>> 0
        },
        rjb = function(a) {
            if (!a) return qjb || (qjb = new pjb(0, 0));
            if (!/^\d+$/.test(a)) return null;
            g.Eda(a);
            return new pjb(g.Lg, g.Mg)
        },
        sjb = function(a, b, c) {
            null != c && ("string" === typeof c && rjb(c), g.gh(a, b, 1), "number" === typeof c ? (a = a.j, b = c >>> 0, c = Math.floor((c - b) / 4294967296) >>> 0, g.Lg = b, g.Mg = c, g.eh(a, g.Lg), g.eh(a, g.Mg)) : (c = rjb(c), a = a.j, b = c.j, g.eh(a, c.u), g.eh(a, b)))
        },
        tjb = function(a, b, c) {
            b = g.kda(b, c);
            null != b && (g.gh(a, c, 0), a.j.j.push(b ? 1 : 0))
        },
        ujb = function(a, b, c, d, e) {
            b = g.pg(b, d, c);
            null != b && (c = g.Sda(a, c), e(b, a), g.Tda(a, c))
        },
        wjb = function(a) {
            g.J.call(this, a, -1, vjb)
        },
        xjb = function(a) {
            g.J.call(this, a)
        },
        yjb = function(a) {
            g.J.call(this, a)
        },
        zjb = function(a) {
            g.J.call(this, a)
        },
        Ajb = function(a) {
            g.J.call(this, a)
        },
        Z7 = function(a) {
            g.zj(a, "zx", Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ g.Qa()).toString(36));
            return a
        },
        $7 = function(a, b, c) {
            Array.isArray(c) || (c = [String(c)]);
            g.Cga(a.u, b, c)
        },
        Bjb = function(a) {
            if (a instanceof g.km) return a;
            if ("function" == typeof a.Zj) return a.Zj(!1);
            if (g.Ja(a)) {
                var b = 0,
                    c = new g.km;
                c.next = function() {
                    for (;;) {
                        if (b >= a.length) return g.F2;
                        if (b in a) return g.lm(a[b++]);
                        b++
                    }
                };
                return c
            }
            throw Error("Not implemented");
        },
        Cjb = function(a, b, c) {
            if (g.Ja(a)) g.Eb(a, b, c);
            else
                for (a = Bjb(a);;) {
                    var d = a.next();
                    if (d.done) break;
                    b.call(c, d.value, void 0, a)
                }
        },
        Djb = function(a, b) {
            var c = [];
            Cjb(b, function(d) {
                try {
                    var e = g.Lo.prototype.u.call(this, d, !0)
                } catch (f) {
                    if ("Storage: Invalid value was encountered" == f) return;
                    throw f;
                }
                void 0 === e ? c.push(d) : g.jla(e) && c.push(d)
            }, a);
            return c
        },
        Ejb = function(a, b) {
            Djb(a, b).forEach(function(c) {
                g.Lo.prototype.remove.call(this, c)
            }, a)
        },
        Fjb = function(a) {
            if (a.oa) {
                if (a.oa.locationOverrideToken) return {
                    locationOverrideToken: a.oa.locationOverrideToken
                };
                if (null != a.oa.latitudeE7 && null != a.oa.longitudeE7) return {
                    latitudeE7: a.oa.latitudeE7,
                    longitudeE7: a.oa.longitudeE7
                }
            }
            return null
        },
        Gjb = function(a, b) {
            g.jb(a, b) || a.push(b)
        },
        Hjb = function(a) {
            var b = 0,
                c;
            for (c in a) b++;
            return b
        },
        Ijb = function(a, b) {
            return g.Rc(a, b)
        },
        Jjb = function(a) {
            try {
                return g.Da.JSON.parse(a)
            } catch (b) {}
            a = String(a);
            if (/^\s*$/.test(a) ? 0 : /^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/(?:"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)[\s\u2028\u2029]*(?=:|,|]|}|$)/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""))) try {
                return eval("(" + a + ")")
            } catch (b) {}
            throw Error("Invalid JSON string: " + a);
        },
        a8 = function(a) {
            if (g.Da.JSON) try {
                return g.Da.JSON.parse(a)
            } catch (b) {}
            return Jjb(a)
        },
        Kjb = function(a, b, c, d) {
            var e = new g.rj(null);
            a && g.sj(e, a);
            b && g.tj(e, b);
            c && g.uj(e, c);
            d && (e.B = d);
            return e
        },
        b8 = function(a, b) {
            g.tz[a] = !0;
            var c = g.rz();
            c && c.publish.apply(c, arguments);
            g.tz[a] = !1
        },
        c8 = function(a) {
            this.name = this.id = "";
            this.clientName = "UNKNOWN_INTERFACE";
            this.app = "";
            this.type = "REMOTE_CONTROL";
            this.obfuscatedGaiaId = this.avatar = this.username = "";
            this.capabilities = new Set;
            this.compatibleSenderThemes = new Set;
            this.experiments = new Set;
            this.theme = "u";
            new g.ko;
            this.model = this.brand = "";
            this.year = 0;
            this.chipset = this.osVersion = this.os = "";
            this.mdxDialServerType = "MDX_DIAL_SERVER_TYPE_UNKNOWN";
            a && (this.id = a.id || a.name, this.name = a.name, this.clientName = a.clientName ? a.clientName.toUpperCase() : "UNKNOWN_INTERFACE", this.app = a.app, this.type =
                a.type || "REMOTE_CONTROL", this.username = a.user || "", this.avatar = a.userAvatarUri || "", this.obfuscatedGaiaId = a.obfuscatedGaiaId || "", this.theme = a.theme || "u", Ljb(this, a.capabilities || ""), Mjb(this, a.compatibleSenderThemes || ""), Njb(this, a.experiments || ""), this.brand = a.brand || "", this.model = a.model || "", this.year = a.year || 0, this.os = a.os || "", this.osVersion = a.osVersion || "", this.chipset = a.chipset || "", this.mdxDialServerType = a.mdxDialServerType || "MDX_DIAL_SERVER_TYPE_UNKNOWN", a = a.deviceInfo) && (a = JSON.parse(a), this.brand =
                a.brand || "", this.model = a.model || "", this.year = a.year || 0, this.os = a.os || "", this.osVersion = a.osVersion || "", this.chipset = a.chipset || "", this.clientName = a.clientName ? a.clientName.toUpperCase() : "UNKNOWN_INTERFACE", this.mdxDialServerType = a.mdxDialServerType || "MDX_DIAL_SERVER_TYPE_UNKNOWN")
        },
        Ljb = function(a, b) {
            a.capabilities.clear();
            g.pm(b.split(","), g.Pa(Ijb, Ojb)).forEach(function(c) {
                a.capabilities.add(c)
            })
        },
        Mjb = function(a, b) {
            a.compatibleSenderThemes.clear();
            g.pm(b.split(","), g.Pa(Ijb, Pjb)).forEach(function(c) {
                a.compatibleSenderThemes.add(c)
            })
        },
        Njb = function(a, b) {
            a.experiments.clear();
            b.split(",").forEach(function(c) {
                a.experiments.add(c)
            })
        },
        d8 = function(a) {
            a = a || {};
            this.name = a.name || "";
            this.id = a.id || a.screenId || "";
            this.token = a.token || a.loungeToken || "";
            this.uuid = a.uuid || a.dialId || "";
            this.idType = a.screenIdType || "normal"
        },
        e8 = function(a, b) {
            return !!b && (a.id == b || a.uuid == b)
        },
        Qjb = function(a) {
            return {
                name: a.name,
                screenId: a.id,
                loungeToken: a.token,
                dialId: a.uuid,
                screenIdType: a.idType
            }
        },
        Rjb = function(a) {
            return new d8(a)
        },
        Sjb = function(a) {
            return Array.isArray(a) ? g.Gg(a, Rjb) : []
        },
        f8 = function(a) {
            return a ? '{name:"' + a.name + '",id:' + a.id.substr(0, 6) + "..,token:" + ((a.token ? ".." + a.token.slice(-6) : "-") + ",uuid:" + (a.uuid ? ".." + a.uuid.slice(-6) : "-") + ",idType:" + a.idType + "}") : "null"
        },
        Tjb = function(a) {
            return Array.isArray(a) ? "[" + g.Gg(a, f8).join(",") + "]" : "null"
        },
        Ujb = function() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,
                function(a) {
                    var b = 16 * Math.random() | 0;
                    return ("x" == a ? b : b & 3 | 8).toString(16)
                })
        },
        Vjb = function(a) {
            return g.Gg(a, function(b) {
                return {
                    key: b.id,
                    name: b.name
                }
            })
        },
        Wjb = function(a, b) {
            return g.gb(a, function(c) {
                return c || b ? !c != !b ? !1 : c.id == b.id : !0
            })
        },
        g8 = function(a, b) {
            return g.gb(a, function(c) {
                return e8(c, b)
            })
        },
        Xjb = function() {
            var a = (0, g.cB)();
            a && Ejb(a, a.j.Zj(!0))
        },
        h8 = function() {
            var a = g.fB("yt-remote-connected-devices") || [];
            g.Bb(a);
            return a
        },
        Yjb = function(a) {
            if (g.nb(a)) return [];
            var b = a[0].indexOf("#"),
                c = -1 == b ? a[0] : a[0].substring(0, b);
            return g.Gg(a, function(d, e) {
                return 0 == e ? d : d.substring(c.length)
            })
        },
        Zjb = function(a) {
            g.eB("yt-remote-connected-devices", a, 86400)
        },
        i8 = function() {
            if ($jb) return $jb;
            var a = g.fB("yt-remote-device-id");
            a || (a = Ujb(), g.eB("yt-remote-device-id", a, 31536E3));
            for (var b = h8(), c = 1, d = a; g.jb(b, d);) c++, d = a + "#" + c;
            return $jb = d
        },
        akb = function() {
            var a = h8(),
                b = i8();
            g.hB() && g.Db(a, b);
            a = Yjb(a);
            if (g.nb(a)) try {
                g.hw("remote_sid")
            } catch (c) {} else try {
                g.fw("remote_sid", a.join(","), -1)
            } catch (c) {}
        },
        bkb = function() {
            return g.fB("yt-remote-session-browser-channel")
        },
        ckb = function() {
            return g.fB("yt-remote-local-screens") || []
        },
        dkb = function() {
            g.eB("yt-remote-lounge-token-expiration", !0, 86400)
        },
        ekb = function(a) {
            5 < a.length && (a = a.slice(a.length - 5));
            var b = g.Gg(ckb(), function(d) {
                    return d.loungeToken
                }),
                c = g.Gg(a, function(d) {
                    return d.loungeToken
                });
            g.Hk(c, function(d) {
                return !g.jb(b, d)
            }) && dkb();
            g.eB("yt-remote-local-screens", a, 31536E3)
        },
        j8 = function(a) {
            a || (g.gB("yt-remote-session-screen-id"), g.gB("yt-remote-session-video-id"));
            akb();
            a = h8();
            g.pb(a, i8());
            Zjb(a)
        },
        fkb = function() {
            if (!k8) {
                var a = g.Uo();
                a && (k8 = new g.Io(a))
            }
        },
        gkb = function() {
            fkb();
            return k8 ? !!k8.get("yt-remote-use-staging-server") : !1
        },
        hkb = function() {
            var a = window.navigator.userAgent.match(/Chrome\/([0-9]+)/);
            return a ? parseInt(a[1], 10) : 0
        },
        ikb = function(a) {
            return !!document.currentScript && (-1 != document.currentScript.src.indexOf("?" + a) || -1 != document.currentScript.src.indexOf("&" + a))
        },
        jkb = function() {
            return "function" == typeof window.__onGCastApiAvailable ? window.__onGCastApiAvailable : null
        },
        l8 = function(a) {
            a.length ? kkb(a.shift(), function() {
                l8(a)
            }) : lkb()
        },
        mkb = function(a) {
            return "chrome-extension://" + a + "/cast_sender.js"
        },
        kkb = function(a, b, c) {
            var d = document.createElement("script");
            d.onerror = b;
            c && (d.onload = c);
            g.Qi(d, g.Gd(a));
            (document.head || document.documentElement).appendChild(d)
        },
        nkb = function() {
            var a = hkb(),
                b = [];
            if (1 < a) {
                var c = a - 1;
                b.push("//www.gstatic.com/eureka/clank/" + a + "/cast_sender.js");
                b.push("//www.gstatic.com/eureka/clank/" + c + "/cast_sender.js")
            }
            return b
        },
        lkb = function() {
            var a = jkb();
            a && a(!1, "No cast extension found")
        },
        pkb = function() {
            if (okb) {
                var a = 2,
                    b = jkb(),
                    c = function() {
                        a--;
                        0 == a && b && b(!0)
                    };
                window.__onGCastApiAvailable = c;
                kkb("//www.gstatic.com/cast/sdk/libs/sender/1.0/cast_framework.js", lkb, c)
            }
        },
        qkb = function() {
            pkb();
            var a = nkb();
            a.push("//www.gstatic.com/eureka/clank/cast_sender.js");
            l8(a)
        },
        skb = function() {
            pkb();
            var a = nkb();
            a.push.apply(a, g.u(rkb.map(mkb)));
            a.push("//www.gstatic.com/eureka/clank/cast_sender.js");
            l8(a)
        },
        tkb = function() {
            this.j = m8();
            this.j.On("/client_streamz/youtube/living_room/mdx/channel/opened", {
                Vg: 3,
                Ug: "channel_type"
            })
        },
        ukb = function(a, b) {
            a.j.un("/client_streamz/youtube/living_room/mdx/channel/opened", b)
        },
        vkb = function() {
            this.j = m8();
            this.j.On("/client_streamz/youtube/living_room/mdx/channel/closed", {
                Vg: 3,
                Ug: "channel_type"
            })
        },
        wkb = function(a, b) {
            a.j.un("/client_streamz/youtube/living_room/mdx/channel/closed", b)
        },
        xkb = function() {
            this.j = m8();
            this.j.On("/client_streamz/youtube/living_room/mdx/channel/message_received", {
                Vg: 3,
                Ug: "channel_type"
            })
        },
        ykb = function(a, b) {
            a.j.un("/client_streamz/youtube/living_room/mdx/channel/message_received", b)
        },
        zkb = function() {
            this.j = m8();
            this.j.On("/client_streamz/youtube/living_room/mdx/channel/error", {
                Vg: 3,
                Ug: "channel_type"
            })
        },
        Akb = function(a, b) {
            a.j.un("/client_streamz/youtube/living_room/mdx/channel/error", b)
        },
        Bkb = function() {
            this.j = m8();
            this.j.On("/client_streamz/youtube/living_room/mdx/browser_channel/pending_maps")
        },
        Ckb = function() {
            this.j = m8();
            this.j.On("/client_streamz/youtube/living_room/mdx/browser_channel/undelivered_maps")
        },
        n8 = function(a, b, c) {
            g.C.call(this);
            this.I = null != c ? (0, g.Oa)(a, c) : a;
            this.wi = b;
            this.D = (0, g.Oa)(this.nY, this);
            this.j = !1;
            this.u = 0;
            this.B = this.Fc = null;
            this.C = []
        },
        o8 = function(a, b, c) {
            g.C.call(this);
            this.C = null != c ? a.bind(c) : a;
            this.wi = b;
            this.B = null;
            this.j = !1;
            this.u = 0;
            this.Fc = null
        },
        Dkb = function(a) {
            a.Fc = g.sf(function() {
                a.Fc = null;
                a.j && !a.u && (a.j = !1, Dkb(a))
            }, a.wi);
            var b = a.B;
            a.B = null;
            a.C.apply(null, b)
        },
        p8 = function() {},
        Ekb = function() {
            g.cb.call(this, "p")
        },
        Fkb = function() {
            g.cb.call(this, "o")
        },
        Hkb = function() {
            return Gkb = Gkb || new g.nd
        },
        Ikb = function(a) {
            g.cb.call(this, "serverreachability", a)
        },
        q8 = function(a) {
            var b = Hkb();
            b.dispatchEvent(new Ikb(b, a))
        },
        Jkb = function(a) {
            g.cb.call(this, "statevent", a)
        },
        r8 = function(a) {
            var b = Hkb();
            b.dispatchEvent(new Jkb(b, a))
        },
        Kkb = function(a, b, c, d) {
            g.cb.call(this, "timingevent", a);
            this.size = b;
            this.Ly = d
        },
        s8 = function(a, b) {
            if ("function" !== typeof a) throw Error("Fn must not be null and must be a function");
            return g.Da.setTimeout(function() {
                a()
            }, b)
        },
        Lkb = function() {},
        t8 = function(a, b, c, d) {
            this.D = a;
            this.C = b;
            this.Hc = c;
            this.Bc = d || 1;
            this.gb = new g.Ej(this);
            this.Gb = 45E3;
            a = g.eI ? 125 : void 0;
            this.ob = new g.rf(a);
            this.Ma = null;
            this.B = !1;
            this.T = this.Wa = this.J = this.Qa = this.ya = this.Tb = this.Z = null;
            this.oa = [];
            this.j = null;
            this.ea = 0;
            this.I = this.Aa = null;
            this.Rb = -1;
            this.Ka = !1;
            this.wb = 0;
            this.Ya = null;
            this.xc = this.Va = this.hc = this.Ba = !1;
            this.u = new Mkb
        },
        Mkb = function() {
            this.B = null;
            this.j = "";
            this.u = !1
        },
        Okb = function(a, b, c) {
            a.Qa = 1;
            a.J = Z7(b.clone());
            a.T = c;
            a.Ba = !0;
            Nkb(a, null)
        },
        Nkb = function(a, b) {
            a.ya = Date.now();
            u8(a);
            a.Wa = a.J.clone();
            $7(a.Wa, "t", a.Bc);
            a.ea = 0;
            var c = a.D.Qa;
            a.u = new Mkb;
            a.j = Pkb(a.D, c ? b : null, !a.T);
            0 < a.wb && (a.Ya = new o8((0, g.Oa)(a.oP, a, a.j), a.wb));
            a.gb.Pa(a.j, "readystatechange", a.qY);
            b = a.Ma ? g.Xc(a.Ma) : {};
            a.T ? (a.Aa || (a.Aa = "POST"), b["Content-Type"] = "application/x-www-form-urlencoded", a.j.send(a.Wa, a.Aa, a.T, b)) : (a.Aa = "GET", a.j.send(a.Wa, a.Aa, null, b));
            q8(1)
        },
        Qkb = function(a) {
            return a.j ? "GET" == a.Aa && 2 != a.Qa && a.D.ue : !1
        },
        Ukb = function(a, b, c) {
            for (var d = !0, e; !a.Ka && a.ea < c.length;)
                if (e = Rkb(a, c), e == v8) {
                    4 ==
                        b && (a.I = 4, r8(14), d = !1);
                    break
                } else if (e == Skb) {
                a.I = 4;
                r8(15);
                d = !1;
                break
            } else Tkb(a, e);
            Qkb(a) && e != v8 && e != Skb && (a.u.j = "", a.ea = 0);
            4 != b || 0 != c.length || a.u.u || (a.I = 1, r8(16), d = !1);
            a.B = a.B && d;
            d ? 0 < c.length && !a.xc && (a.xc = !0, a.D.gM(a)) : (w8(a), x8(a))
        },
        Rkb = function(a, b) {
            var c = a.ea,
                d = b.indexOf("\n", c);
            if (-1 == d) return v8;
            c = Number(b.substring(c, d));
            if (isNaN(c)) return Skb;
            d += 1;
            if (d + c > b.length) return v8;
            b = b.slice(d, d + c);
            a.ea = d + c;
            return b
        },
        u8 = function(a) {
            a.Tb = Date.now() + a.Gb;
            Vkb(a, a.Gb)
        },
        Vkb = function(a, b) {
            if (null != a.Z) throw Error("WatchDog timer not null");
            a.Z = s8((0, g.Oa)(a.oY, a), b)
        },
        y8 = function(a) {
            a.Z && (g.Da.clearTimeout(a.Z), a.Z = null)
        },
        x8 = function(a) {
            a.D.Jg() || a.Ka || Wkb(a.D, a)
        },
        w8 = function(a) {
            y8(a);
            g.$a(a.Ya);
            a.Ya = null;
            a.ob.stop();
            a.gb.Cg();
            if (a.j) {
                var b = a.j;
                a.j = null;
                b.abort();
                b.dispose()
            }
        },
        Tkb = function(a, b) {
            try {
                var c = a.D;
                if (0 != c.hh && (c.j == a || Xkb(c.u, a)))
                    if (!a.Va && Xkb(c.u, a) && 3 == c.hh) {
                        try {
                            var d = c.Af.j.parse(b)
                        } catch (z) {
                            d = null
                        }
                        if (Array.isArray(d) && 3 == d.length) {
                            var e = d;
                            if (0 == e[0]) a: {
                                if (!c.T) {
                                    if (c.j)
                                        if (c.j.ya + 3E3 < a.ya) z8(c), A8(c);
                                        else break a;
                                    Ykb(c);
                                    r8(18)
                                }
                            }
                            else c.Wd = e[1], 0 < c.Wd - c.Va && 37500 > e[2] && c.ob && 0 == c.oa && !c.ea && (c.ea = s8((0, g.Oa)(c.rY, c), 6E3));
                            if (1 >= Zkb(c.u) && c.Yc) {
                                try {
                                    c.Yc()
                                } catch (z) {}
                                c.Yc = void 0
                            }
                        } else B8(c, 11)
                    } else if ((a.Va || c.j == a) && z8(c), !g.Kb(b))
                    for (e = c.Af.j.parse(b), b = 0; b < e.length; b++) {
                        var f = e[b];
                        c.Va = f[0];
                        f = f[1];
                        if (2 == c.hh)
                            if ("c" == f[0]) {
                                c.C = f[1];
                                c.xc = f[2];
                                var h = f[3];
                                null != h && (c.pP = h);
                                var l = f[5];
                                null != l && "number" === typeof l && 0 < l && (c.Wa = 1.5 * l);
                                d = c;
                                var m = a.DK();
                                if (m) {
                                    var n = g.ii(m, "X-Client-Wire-Protocol");
                                    if (n) {
                                        var p = d.u;
                                        !p.j && (g.Nb(n, "spdy") || g.Nb(n, "quic") || g.Nb(n, "h2")) && (p.C = p.D, p.j = new Set, p.u && ($kb(p, p.u), p.u = null))
                                    }
                                    if (d.Ba) {
                                        var q = g.ii(m, "X-HTTP-Session-Id");
                                        q && (d.Yd = q, g.zj(d.Ma, d.Ba, q))
                                    }
                                }
                                c.hh = 3;
                                c.D && c.D.vP();
                                c.Nc && (c.Vd = Date.now() - a.ya);
                                d = c;
                                var r = a;
                                d.zd = alb(d, d.Qa ? d.xc : null, d.Bc);
                                if (r.Va) {
                                    blb(d.u,
                                        r);
                                    var v = r,
                                        x = d.Wa;
                                    x && v.setTimeout(x);
                                    v.Z && (y8(v), u8(v));
                                    d.j = r
                                } else clb(d);
                                0 < c.B.length && C8(c)
                            } else "stop" != f[0] && "close" != f[0] || B8(c, 7);
                        else 3 == c.hh && ("stop" == f[0] || "close" == f[0] ? "stop" == f[0] ? B8(c, 7) : c.disconnect() : "noop" != f[0] && c.D && c.D.uP(f), c.oa = 0)
                    }
                q8(4)
            } catch (z) {}
        },
        dlb = function(a, b) {
            this.j = a;
            this.map = b;
            this.context = null
        },
        elb = function(a) {
            this.D = a || 10;
            g.Da.PerformanceNavigationTiming ? (a = g.Da.performance.getEntriesByType("navigation"), a = 0 < a.length && ("hq" == a[0].nextHopProtocol || "h2" == a[0].nextHopProtocol)) : a = !!(g.Da.chrome && g.Da.chrome.loadTimes && g.Da.chrome.loadTimes() && g.Da.chrome.loadTimes().wasFetchedViaSpdy);
            this.C = a ? this.D : 1;
            this.j = null;
            1 < this.C && (this.j = new Set);
            this.u = null;
            this.B = []
        },
        flb = function(a) {
            return a.u ? !0 : a.j ? a.j.size >= a.C : !1
        },
        Zkb = function(a) {
            return a.u ? 1 : a.j ? a.j.size : 0
        },
        Xkb = function(a, b) {
            return a.u ? a.u == b : a.j ? a.j.has(b) : !1
        },
        $kb =
        function(a, b) {
            a.j ? a.j.add(b) : a.u = b
        },
        blb = function(a, b) {
            a.u && a.u == b ? a.u = null : a.j && a.j.has(b) && a.j.delete(b)
        },
        glb = function(a) {
            if (null != a.u) return a.B.concat(a.u.oa);
            if (null != a.j && 0 !== a.j.size) {
                var b = a.B;
                a = g.t(a.j.values());
                for (var c = a.next(); !c.done; c = a.next()) b = b.concat(c.value.oa);
                return b
            }
            return g.tb(a.B)
        },
        hlb = function(a, b) {
            var c = new Lkb;
            if (g.Da.Image) {
                var d = new Image;
                d.onload = g.Pa(D8, c, d, "TestLoadImage: loaded", !0, b);
                d.onerror = g.Pa(D8, c, d, "TestLoadImage: error", !1, b);
                d.onabort = g.Pa(D8, c, d, "TestLoadImage: abort", !1, b);
                d.ontimeout = g.Pa(D8, c, d, "TestLoadImage: timeout", !1, b);
                g.Da.setTimeout(function() {
                    if (d.ontimeout) d.ontimeout()
                }, 1E4);
                d.src = a
            } else b(!1)
        },
        D8 = function(a, b, c, d, e) {
            try {
                b.onload = null, b.onerror = null, b.onabort = null, b.ontimeout = null, e(d)
            } catch (f) {}
        },
        ilb = function() {
            this.j = new p8
        },
        jlb = function(a, b, c) {
            var d = c || "";
            try {
                g.qj(a, function(e, f) {
                    var h = e;
                    g.La(e) && (h = g.Ih(e));
                    b.push(d + f + "=" + encodeURIComponent(h))
                })
            } catch (e) {
                throw b.push(d + "type=" + encodeURIComponent("_badmap")), e;
            }
        },
        E8 = function(a, b, c) {
            return c && c.V1 ? c.V1[a] || b : b
        },
        klb = function(a) {
            this.B = [];
            this.xc = this.zd = this.Ma = this.Bc = this.j = this.Yd = this.Ba = this.Ka = this.J = this.Tb = this.Z = null;
            this.rf = this.Ya = 0;
            this.nf = E8("failFast", !1, a);
            this.ob = this.ea = this.T = this.I = this.D = null;
            this.Hc = !0;
            this.Wd = this.Va = -1;
            this.hc = this.oa = this.ya = 0;
            this.mf = E8("baseRetryDelayMs", 5E3, a);
            this.Tf = E8("retryDelaySeedMs", 1E4, a);
            this.qf = E8("forwardChannelMaxRetries", 2, a);
            this.Hd = E8("forwardChannelRequestTimeoutMs", 2E4, a);
            this.Xd = a && a.pdb || void 0;
            this.ue = a && a.ndb || !1;
            this.Wa = void 0;
            this.Qa = a && a.Y6 || !1;
            this.C = "";
            this.u = new elb(a &&
                a.fbb);
            this.Af = new ilb;
            this.Gb = a && a.ubb || !1;
            this.wb = a && a.mbb || !1;
            this.Gb && this.wb && (this.wb = !1);
            this.Uf = a && a.Zab || !1;
            a && a.wbb && (this.Hc = !1);
            this.Nc = !this.Gb && this.Hc && a && a.kbb || !1;
            this.Yc = void 0;
            this.Vd = 0;
            this.gb = !1;
            this.Rb = this.Aa = null
        },
        A8 = function(a) {
            a.j && (llb(a), a.j.cancel(), a.j = null)
        },
        mlb = function(a) {
            A8(a);
            a.T && (g.Da.clearTimeout(a.T), a.T = null);
            z8(a);
            a.u.cancel();
            a.I && ("number" === typeof a.I && g.Da.clearTimeout(a.I), a.I = null)
        },
        C8 = function(a) {
            flb(a.u) || a.I || (a.I = !0, g.gf(a.rP, a), a.ya = 0)
        },
        olb = function(a, b) {
            if (Zkb(a.u) >= a.u.C - (a.I ? 1 : 0)) return !1;
            if (a.I) return a.B = b.oa.concat(a.B), !0;
            if (1 == a.hh || 2 == a.hh || a.ya >= (a.nf ? 0 : a.qf)) return !1;
            a.I = s8((0, g.Oa)(a.rP, a, b), nlb(a, a.ya));
            a.ya++;
            return !0
        },
        qlb = function(a, b) {
            var c;
            b ? c = b.Hc : c = a.Ya++;
            var d = a.Ma.clone();
            g.zj(d, "SID", a.C);
            g.zj(d, "RID", c);
            g.zj(d, "AID", a.Va);
            F8(a, d);
            a.J && a.Z && g.Dj(d, a.J, a.Z);
            c = new t8(a, a.C, c, a.ya + 1);
            null === a.J && (c.Ma = a.Z);
            b && (a.B = b.oa.concat(a.B));
            b = plb(a, c, 1E3);
            c.setTimeout(Math.round(.5 * a.Hd) + Math.round(.5 * a.Hd * Math.random()));
            $kb(a.u, c);
            Okb(c, d, b)
        },
        F8 = function(a, b) {
            a.Ka && g.Ic(a.Ka, function(c, d) {
                g.zj(b, d, c)
            });
            a.D && g.qj({}, function(c, d) {
                g.zj(b, d, c)
            })
        },
        plb = function(a, b, c) {
            c = Math.min(a.B.length, c);
            var d = a.D ? (0, g.Oa)(a.D.sY, a.D, a) : null;
            a: for (var e = a.B, f = -1;;) {
                var h = ["count=" + c]; - 1 == f ? 0 < c ? (f = e[0].j, h.push("ofs=" + f)) : f = 0 : h.push("ofs=" + f);
                for (var l = !0, m = 0; m < c; m++) {
                    var n = e[m].j,
                        p = e[m].map;
                    n -= f;
                    if (0 > n) f = Math.max(0, e[m].j - 100), l = !1;
                    else try {
                        jlb(p, h, "req" + n + "_")
                    } catch (q) {
                        d && d(p)
                    }
                }
                if (l) {
                    d = h.join("&");
                    break a
                }
            }
            a = a.B.splice(0, c);
            b.oa = a;
            return d
        },
        clb = function(a) {
            a.j || a.T || (a.hc = 1, g.gf(a.qP, a), a.oa = 0)
        },
        Ykb = function(a) {
            if (a.j || a.T || 3 <= a.oa) return !1;
            a.hc++;
            a.T = s8((0, g.Oa)(a.qP, a), nlb(a, a.oa));
            a.oa++;
            return !0
        },
        llb = function(a) {
            null != a.Aa && (g.Da.clearTimeout(a.Aa), a.Aa = null)
        },
        rlb = function(a) {
            a.j = new t8(a, a.C, "rpc", a.hc);
            null === a.J && (a.j.Ma = a.Z);
            a.j.wb = 0;
            var b = a.zd.clone();
            g.zj(b, "RID", "rpc");
            g.zj(b, "SID", a.C);
            g.zj(b, "CI", a.ob ? "0" : "1");
            g.zj(b, "AID", a.Va);
            g.zj(b, "TYPE", "xmlhttp");
            F8(a, b);
            a.J && a.Z && g.Dj(b, a.J, a.Z);
            a.Wa && a.j.setTimeout(a.Wa);
            var c = a.j;
            a = a.xc;
            c.Qa = 1;
            c.J = Z7(b.clone());
            c.T = null;
            c.Ba = !0;
            Nkb(c, a)
        },
        z8 = function(a) {
            null != a.ea && (g.Da.clearTimeout(a.ea), a.ea = null)
        },
        Wkb = function(a, b) {
            var c = null;
            if (a.j == b) {
                z8(a);
                llb(a);
                a.j = null;
                var d = 2
            } else if (Xkb(a.u, b)) c = b.oa, blb(a.u, b), d = 1;
            else return;
            if (0 != a.hh)
                if (b.B)
                    if (1 == d) {
                        c = b.T ? b.T.length : 0;
                        b = Date.now() - b.ya;
                        var e = a.ya;
                        d = Hkb();
                        d.dispatchEvent(new Kkb(d, c, b, e));
                        C8(a)
                    } else clb(a);
            else {
                var f = b.Rb;
                e = b.getLastError();
                if (3 == e || 0 == e && 0 < f || !(1 == d && olb(a, b) || 2 == d && Ykb(a))) switch (c && 0 < c.length && (b = a.u, b.B = b.B.concat(c)), e) {
                    case 1:
                        B8(a, 5);
                        break;
                    case 4:
                        B8(a, 10);
                        break;
                    case 3:
                        B8(a, 6);
                        break;
                    default:
                        B8(a, 2)
                }
            }
        },
        nlb = function(a, b) {
            var c = a.mf + Math.floor(Math.random() *
                a.Tf);
            a.isActive() || (c *= 2);
            return c * b
        },
        B8 = function(a, b) {
            if (2 == b) {
                var c = null;
                a.D && (c = null);
                var d = (0, g.Oa)(a.e7, a);
                c || (c = new g.rj("//www.google.com/images/cleardot.gif"), g.Da.location && "http" == g.Da.location.protocol || g.sj(c, "https"), Z7(c));
                hlb(c.toString(), d)
            } else r8(2);
            a.hh = 0;
            a.D && a.D.tP(b);
            slb(a);
            mlb(a)
        },
        slb = function(a) {
            a.hh = 0;
            a.Rb = [];
            if (a.D) {
                var b = glb(a.u);
                if (0 != b.length || 0 != a.B.length) g.vb(a.Rb, b), g.vb(a.Rb, a.B), a.u.B.length = 0, g.tb(a.B), a.B.length = 0;
                a.D.sP()
            }
        },
        tlb = function(a) {
            if (0 == a.hh) return a.Rb;
            var b = [];
            g.vb(b, glb(a.u));
            g.vb(b, a.B);
            return b
        },
        alb = function(a, b, c) {
            var d = g.Aj(c);
            "" != d.j ? (b && g.tj(d, b + "." + d.j), g.uj(d, d.C)) : (d = g.Da.location, d = Kjb(d.protocol, b ? b + "." + d.hostname : d.hostname, +d.port, c));
            b = a.Ba;
            c = a.Yd;
            b && c && g.zj(d, b, c);
            g.zj(d, "VER", a.pP);
            F8(a, d);
            return d
        },
        Pkb = function(a, b, c) {
            if (b && !a.Qa) throw Error("Can't create secondary domain capable XhrIo object.");
            b = c && a.ue && !a.Xd ? new g.bi(new g.mj({
                eW: !0
            })) : new g.bi(a.Xd);
            b.J = a.Qa;
            return b
        },
        ulb = function() {},
        vlb = function() {
            if (g.Fe && !g.Bc(10)) throw Error("Environmental error: no available transport.");
        },
        H8 = function(a, b) {
            g.nd.call(this);
            this.j = new klb(b);
            this.I = a;
            this.u = b && b.J2 || null;
            a = b && b.I2 || null;
            b && b.ebb && (a ? a["X-Client-Protocol"] = "webchannel" : a = {
                "X-Client-Protocol": "webchannel"
            });
            this.j.Z = a;
            a = b && b.fcb || null;
            b && b.JT && (a ? a["X-WebChannel-Content-Type"] = b.JT : a = {
                "X-WebChannel-Content-Type": b.JT
            });
            b && b.uR && (a ? a["X-WebChannel-Client-Profile"] = b.uR : a = {
                "X-WebChannel-Client-Profile": b.uR
            });
            this.j.Tb = a;
            (a = b && b.dcb) && !g.Kb(a) && (this.j.J = a);
            this.J = b && b.Y6 || !1;
            this.D = b && b.Qcb || !1;
            (b = b && b.R1) && !g.Kb(b) && (this.j.Ba = b, g.Pc(this.u, b) && g.Uc(this.u,
                b));
            this.C = new G8(this)
        },
        wlb = function(a) {
            Ekb.call(this);
            a.__headers__ && (this.headers = a.__headers__, this.statusCode = a.__status__, delete a.__headers__, delete a.__status__);
            var b = a.__sm__;
            b ? this.data = (this.metadataKey = g.Mc(b)) ? g.Vc(b, this.metadataKey) : b : this.data = a
        },
        xlb = function(a) {
            Fkb.call(this);
            this.status = 1;
            this.errorCode = a
        },
        G8 = function(a) {
            this.j = a
        },
        ylb = function(a, b) {
            this.u = a;
            this.j = b
        },
        zlb = function(a) {
            return tlb(a.j).map(function(b) {
                b = b.map;
                "__data__" in b && (b = b.__data__, b = a.u.D ? Jjb(b) : b);
                return b
            })
        },
        I8 = function(a, b) {
            if ("function" !== typeof a) throw Error("Fn must not be null and must be a function");
            return g.Da.setTimeout(function() {
                a()
            }, b)
        },
        K8 = function(a) {
            J8.dispatchEvent(new Alb(J8, a))
        },
        Alb = function(a) {
            g.cb.call(this, "statevent", a)
        },
        L8 = function(a, b, c, d) {
            this.j = a;
            this.C = b;
            this.J = c;
            this.I = d || 1;
            this.u = 45E3;
            this.B = new g.Ej(this);
            this.D = new g.rf;
            this.D.setInterval(250)
        },
        Clb = function(a, b, c) {
            a.pw = 1;
            a.Iq = Z7(b.clone());
            a.wt = c;
            a.Ba = !0;
            Blb(a, null)
        },
        Dlb = function(a, b, c, d, e) {
            a.pw = 1;
            a.Iq = Z7(b.clone());
            a.wt = null;
            a.Ba = c;
            e && (a.MV = !1);
            Blb(a, d)
        },
        Blb = function(a, b) {
            a.ow = Date.now();
            M8(a);
            a.Kq = a.Iq.clone();
            $7(a.Kq, "t", a.I);
            a.tD = 0;
            a.Ji = a.j.TH(a.j.Kz() ? b : null);
            0 < a.RH && (a.rD = new o8((0, g.Oa)(a.wP, a, a.Ji), a.RH));
            a.B.Pa(a.Ji, "readystatechange", a.uY);
            b = a.vt ? g.Xc(a.vt) : {};
            a.wt ? (a.sD = "POST", b["Content-Type"] = "application/x-www-form-urlencoded", a.Ji.send(a.Kq, a.sD, a.wt, b)) : (a.sD = "GET", a.MV && !g.Cc && (b.Connection = "close"), a.Ji.send(a.Kq, a.sD, null, b));
            a.j.Mm(1)
        },
        Glb = function(a, b) {
            var c = a.tD,
                d = b.indexOf("\n", c);
            if (-1 == d) return Elb;
            c = Number(b.substring(c, d));
            if (isNaN(c)) return Flb;
            d += 1;
            if (d + c > b.length) return Elb;
            b = b.slice(d, d + c);
            a.tD = d + c;
            return b
        },
        Ilb = function(a, b) {
            a.ow = Date.now();
            M8(a);
            var c = b ? window.location.hostname : "";
            a.Kq = a.Iq.clone();
            g.zj(a.Kq, "DOMAIN", c);
            g.zj(a.Kq, "t", a.I);
            try {
                a.cn = new ActiveXObject("htmlfile")
            } catch (m) {
                N8(a);
                a.Jq = 7;
                K8(22);
                O8(a);
                return
            }
            var d = "<html><body>";
            if (b) {
                var e = "";
                for (b = 0; b < c.length; b++) {
                    var f = c.charAt(b);
                    if ("<" == f) f = e + "\\x3c";
                    else if (">" == f) f = e + "\\x3e";
                    else {
                        if (f in P8) f = P8[f];
                        else if (f in Hlb) f = P8[f] = Hlb[f];
                        else {
                            var h = f.charCodeAt(0);
                            if (31 < h && 127 > h) var l = f;
                            else {
                                if (256 > h) {
                                    if (l = "\\x", 16 > h || 256 < h) l += "0"
                                } else l = "\\u", 4096 > h && (l += "0");
                                l += h.toString(16).toUpperCase()
                            }
                            f =
                                P8[f] = l
                        }
                        f = e + f
                    }
                    e = f
                }
                d += '<script>document.domain="' + e + '"\x3c/script>'
            }
            d += "</body></html>";
            g.Dd("b/12014412");
            c = g.Wd(d);
            a.cn.open();
            a.cn.write(g.Vd(c));
            a.cn.close();
            a.cn.parentWindow.m = (0, g.Oa)(a.I5, a);
            a.cn.parentWindow.d = (0, g.Oa)(a.PU, a, !0);
            a.cn.parentWindow.rpcClose = (0, g.Oa)(a.PU, a, !1);
            c = a.cn.createElement("DIV");
            a.cn.parentWindow.document.body.appendChild(c);
            d = g.Od(a.Kq.toString());
            d = g.oe(g.Kd(d));
            g.Dd("b/12014412");
            d = g.Wd('<iframe src="' + d + '"></iframe>');
            g.Xba(c, d);
            a.j.Mm(1)
        },
        M8 = function(a) {
            a.SH =
                Date.now() + a.u;
            Jlb(a, a.u)
        },
        Jlb = function(a, b) {
            if (null != a.qw) throw Error("WatchDog timer not null");
            a.qw = I8((0, g.Oa)(a.tY, a), b)
        },
        Klb = function(a) {
            a.qw && (g.Da.clearTimeout(a.qw), a.qw = null)
        },
        O8 = function(a) {
            a.j.Jg() || a.ut || a.j.uD(a)
        },
        N8 = function(a) {
            Klb(a);
            g.$a(a.rD);
            a.rD = null;
            a.D.stop();
            a.B.Cg();
            if (a.Ji) {
                var b = a.Ji;
                a.Ji = null;
                b.abort();
                b.dispose()
            }
            a.cn && (a.cn = null)
        },
        Llb = function(a, b) {
            try {
                a.j.xP(a, b), a.j.Mm(4)
            } catch (c) {}
        },
        Nlb = function(a, b, c, d, e) {
            if (0 == d) c(!1);
            else {
                var f = e || 0;
                d--;
                Mlb(a, b, function(h) {
                    h ? c(!0) : g.Da.setTimeout(function() {
                        Nlb(a, b, c, d, f)
                    }, f)
                })
            }
        },
        Mlb = function(a, b, c) {
            var d = new Image;
            d.onload = function() {
                try {
                    Q8(d), c(!0)
                } catch (e) {}
            };
            d.onerror = function() {
                try {
                    Q8(d), c(!1)
                } catch (e) {}
            };
            d.onabort = function() {
                try {
                    Q8(d), c(!1)
                } catch (e) {}
            };
            d.ontimeout = function() {
                try {
                    Q8(d), c(!1)
                } catch (e) {}
            };
            g.Da.setTimeout(function() {
                if (d.ontimeout) d.ontimeout()
            }, b);
            d.src = a
        },
        Q8 = function(a) {
            a.onload = null;
            a.onerror = null;
            a.onabort = null;
            a.ontimeout = null
        },
        Olb = function(a) {
            this.j = a;
            this.u = new p8
        },
        Plb = function(a) {
            var b = R8(a.j, a.fA, "/mail/images/cleardot.gif");
            Z7(b);
            Nlb(b.toString(), 5E3, (0, g.Oa)(a.U_, a), 3, 2E3);
            a.Mm(1)
        },
        Qlb = function(a) {
            var b = a.j.Z;
            if (null != b) K8(5), b ? (K8(11), S8(a.j, a, !1)) : (K8(12), S8(a.j, a, !0));
            else if (a.jj = new L8(a), a.jj.vt = a.UH, b = a.j, b = R8(b, b.Kz() ? a.Jz : null, a.VH), K8(5), !g.Fe || g.Bc(10)) $7(b, "TYPE", "xmlhttp"), Dlb(a.jj, b, !1, a.Jz, !1);
            else {
                $7(b, "TYPE", "html");
                var c = a.jj;
                a = !!a.Jz;
                c.pw = 3;
                c.Iq = Z7(b.clone());
                Ilb(c, a)
            }
        },
        Rlb = function(a, b, c) {
            this.j = 1;
            this.u = [];
            this.B = [];
            this.D = new p8;
            this.T = a || null;
            this.Z = null != b ? b : null;
            this.J = c || !1
        },
        Slb = function(a, b) {
            this.j = a;
            this.map = b;
            this.context = null
        },
        Tlb = function(a, b, c, d) {
            g.cb.call(this, "timingevent", a);
            this.size = b;
            this.Ly = d
        },
        Ulb = function(a) {
            g.cb.call(this, "serverreachability", a)
        },
        Wlb = function(a) {
            a.vY(1, 0);
            a.vD = R8(a, null, a.WH);
            Vlb(a)
        },
        Xlb = function(a) {
            a.Yq && (a.Yq.abort(), a.Yq = null);
            a.rg && (a.rg.cancel(), a.rg = null);
            a.hp && (g.Da.clearTimeout(a.hp), a.hp = null);
            T8(a);
            a.vj && (a.vj.cancel(), a.vj = null);
            a.Lq && (g.Da.clearTimeout(a.Lq), a.Lq = null)
        },
        Ylb = function(a, b) {
            if (0 == a.j) throw Error("Invalid operation: sending map when state is closed");
            a.u.push(new Slb(a.wY++, b));
            2 != a.j && 3 != a.j || Vlb(a)
        },
        Zlb = function(a) {
            var b = 0;
            a.rg && b++;
            a.vj && b++;
            return b
        },
        Vlb = function(a) {
            a.vj || a.Lq || (a.Lq = I8((0, g.Oa)(a.BP, a), 0), a.ww = 0)
        },
        bmb = function(a, b) {
            if (1 == a.j) {
                if (!b) {
                    a.Mz = Math.floor(1E5 * Math.random());
                    b = a.Mz++;
                    var c = new L8(a, "", b);
                    c.vt = a.pn;
                    var d = $lb(a),
                        e = a.vD.clone();
                    g.zj(e, "RID", b);
                    g.zj(e, "CVER", "1");
                    U8(a, e);
                    Clb(c, e, d);
                    a.vj = c;
                    a.j = 2
                }
            } else 3 == a.j && (b ? amb(a, b) : 0 == a.u.length || a.vj || amb(a))
        },
        amb = function(a, b) {
            if (b)
                if (6 < a.xt) {
                    a.u = a.B.concat(a.u);
                    a.B.length = 0;
                    var c = a.Mz - 1;
                    b = $lb(a)
                } else c = b.J, b = b.wt;
            else c = a.Mz++, b = $lb(a);
            var d = a.vD.clone();
            g.zj(d, "SID", a.C);
            g.zj(d, "RID", c);
            g.zj(d, "AID", a.xw);
            U8(a, d);
            c = new L8(a, a.C, c, a.ww + 1);
            c.vt = a.pn;
            c.setTimeout(1E4 + Math.round(1E4 * Math.random()));
            a.vj = c;
            Clb(c, d, b)
        },
        U8 = function(a, b) {
            a.Wh && (a = a.Wh.FP()) && g.Ic(a, function(c, d) {
                g.zj(b, d, c)
            })
        },
        $lb = function(a) {
            var b = Math.min(a.u.length, 1E3),
                c = ["count=" + b];
            if (6 < a.xt && 0 < b) {
                var d = a.u[0].j;
                c.push("ofs=" + d)
            } else d = 0;
            for (var e = {}, f = 0; f < b; e = {
                    Vv: e.Vv
                }, f++) {
                e.Vv = a.u[f].j;
                var h = a.u[f].map;
                e.Vv = 6 >= a.xt ? f : e.Vv - d;
                try {
                    g.Ic(h, function(l) {
                        return function(m, n) {
                            c.push("req" + l.Vv + "_" + n + "=" + encodeURIComponent(m))
                        }
                    }(e))
                } catch (l) {
                    c.push("req" + e.Vv + "_type=" + encodeURIComponent("_badmap"))
                }
            }
            a.B = a.B.concat(a.u.splice(0, b));
            return c.join("&")
        },
        cmb = function(a) {
            a.rg || a.hp || (a.I = 1, a.hp = I8((0, g.Oa)(a.AP, a), 0), a.uw = 0)
        },
        emb = function(a) {
            if (a.rg || a.hp || 3 <= a.uw) return !1;
            a.I++;
            a.hp = I8((0, g.Oa)(a.AP, a), dmb(a, a.uw));
            a.uw++;
            return !0
        },
        S8 = function(a, b, c) {
            a.lH = c;
            a.qn = b.gp;
            a.J || Wlb(a)
        },
        T8 = function(a) {
            null != a.zt && (g.Da.clearTimeout(a.zt), a.zt = null)
        },
        dmb = function(a, b) {
            var c = 5E3 + Math.floor(1E4 * Math.random());
            a.isActive() || (c *= 2);
            return c * b
        },
        V8 = function(a, b) {
            if (2 == b || 9 == b) {
                var c = null;
                a.Wh && (c = null);
                var d = (0, g.Oa)(a.d7, a);
                c || (c = new g.rj("//www.google.com/images/cleardot.gif"), Z7(c));
                Mlb(c.toString(), 1E4, d)
            } else K8(2);
            fmb(a, b)
        },
        fmb = function(a, b) {
            a.j = 0;
            a.Wh && a.Wh.CP(b);
            gmb(a);
            Xlb(a)
        },
        gmb = function(a) {
            a.j = 0;
            a.qn = -1;
            if (a.Wh)
                if (0 == a.B.length && 0 == a.u.length) a.Wh.XH();
                else {
                    var b = g.tb(a.B),
                        c = g.tb(a.u);
                    a.B.length = 0;
                    a.u.length = 0;
                    a.Wh.XH(b, c)
                }
        },
        R8 = function(a, b, c) {
            var d = g.Aj(c);
            if ("" != d.j) b && g.tj(d, b + "." + d.j), g.uj(d, d.C);
            else {
                var e = window.location;
                d = Kjb(e.protocol, b ? b + "." + e.hostname : e.hostname, +e.port, c)
            }
            a.Lz && g.Ic(a.Lz, function(f, h) {
                g.zj(d, h, f)
            });
            g.zj(d, "VER", a.xt);
            U8(a, d);
            return d
        },
        hmb = function() {},
        imb = function() {
            this.j = [];
            this.u = []
        },
        jmb = function(a) {
            g.cb.call(this, "channelMessage");
            this.message = a
        },
        kmb = function(a) {
            g.cb.call(this, "channelError");
            this.error = a
        },
        lmb = function(a, b) {
            this.action = a;
            this.params = b || {}
        },
        W8 = function(a, b) {
            g.C.call(this);
            this.j = new g.Tn(this.A5, 0, this);
            g.E(this, this.j);
            this.wi = 5E3;
            this.u = 0;
            if ("function" === typeof a) b && (a = (0, g.Oa)(a, b));
            else if (a && "function" === typeof a.handleEvent) a = (0, g.Oa)(a.handleEvent, a);
            else throw Error("Invalid listener argument");
            this.B = a
        },
        mmb = function() {},
        m8 = function() {
            if (!X8) {
                X8 = new g.uf(new mmb);
                var a = g.xv("client_streamz_web_flush_count", -1); - 1 !== a && (X8.C = a)
            }
            return X8
        },
        nmb = function(a, b, c, d, e) {
            c = void 0 === c ? !1 : c;
            d = void 0 === d ? function() {
                return ""
            } : d;
            e = void 0 === e ? !1 : e;
            this.ya = a;
            this.J = b;
            this.B = new g.Ho;
            this.u = new W8(this.B6, this);
            this.j = null;
            this.ea = !1;
            this.I = null;
            this.Z = "";
            this.T = this.D = 0;
            this.C = [];
            this.Qa = c;
            this.oa = d;
            this.Va = e;
            this.Ma = new tkb;
            this.Aa = new vkb;
            this.Ka = new xkb;
            this.Ba = new zkb;
            this.Ya = new Bkb;
            this.Wa = new Ckb
        },
        omb = function(a) {
            if (a.j) {
                var b = a.oa(),
                    c = a.j.pn || {};
                b ? c["x-youtube-lounge-xsrf-token"] = b : delete c["x-youtube-lounge-xsrf-token"];
                a.j.pn = c
            }
        },
        Y8 = function(a) {
            this.port = this.domain = "";
            this.j = "/api/lounge";
            this.u = !0;
            a = a || document.location.href;
            var b = Number(g.Qh(4, a)) || "";
            b && (this.port = ":" + b);
            this.domain = g.Rh(a) || "";
            a = g.Vb();
            0 <= a.search("MSIE") && (a = a.match(/MSIE ([\d.]+)/)[1], 0 > g.Ub(a, "10.0") && (this.u = !1))
        },
        Z8 = function(a, b) {
            var c = a.j;
            a.u && (c = "https://" + a.domain + a.port + a.j);
            return g.Yh(c + b, {})
        },
        pmb = function(a, b, c, d, e) {
            a = {
                format: "JSON",
                method: "POST",
                context: a,
                timeout: 5E3,
                withCredentials: !1,
                onSuccess: g.Pa(a.C, d, !0),
                onError: g.Pa(a.B, e),
                onTimeout: g.Pa(a.D, e)
            };
            c && (a.postParams = c, a.headers = {
                "Content-Type": "application/x-www-form-urlencoded"
            });
            return g.Wv(b, a)
        },
        qmb = function(a, b) {
            g.nd.call(this);
            var c = this;
            this.qd = a();
            this.qd.subscribe("handlerOpened", this.AY, this);
            this.qd.subscribe("handlerClosed", this.yY, this);
            this.qd.subscribe("handlerError", function(d, e) {
                c.onError(e)
            });
            this.qd.subscribe("handlerMessage", this.zY, this);
            this.j = b
        },
        rmb = function(a, b, c) {
            var d = this;
            c = void 0 === c ? function() {
                return ""
            } : c;
            var e = void 0 === e ? new vlb : e;
            var f = void 0 === f ? new g.Ho : f;
            this.pathPrefix = a;
            this.j = b;
            this.ya = c;
            this.D = f;
            this.T = null;
            this.Z = this.J = 0;
            this.channel = null;
            this.I = 0;
            this.B = new W8(function() {
                d.B.isActive();
                var h;
                0 === (null == (h = d.channel) ? void 0 : Zkb((new ylb(h, h.j)).j.u)) && d.connect(d.T, d.J)
            });
            this.C = {};
            this.u = {};
            this.ea = !1;
            this.logger = null;
            this.oa = [];
            this.yg = void 0;
            this.Ma = new tkb;
            this.Aa = new vkb;
            this.Ka = new xkb;
            this.Ba = new zkb
        },
        smb = function(a) {
            g.fd(a.channel, "m", function() {
                a.I = 3;
                a.B.reset();
                a.T = null;
                a.J = 0;
                for (var b = g.t(a.oa), c = b.next(); !c.done; c = b.next()) c = c.value, a.channel && a.channel.send(c);
                a.oa = [];
                a.ma("webChannelOpened");
                ukb(a.Ma, "WEB_CHANNEL")
            });
            g.fd(a.channel, "n", function() {
                a.I = 0;
                a.B.isActive() || a.ma("webChannelClosed");
                var b, c = null == (b = a.channel) ? void 0 : zlb(new ylb(b, b.j));
                c && (a.oa = [].concat(g.u(c)));
                wkb(a.Aa, "WEB_CHANNEL")
            });
            g.fd(a.channel, "p", function(b) {
                var c = b.data;
                "gracefulReconnect" === c[0] ? (a.B.start(), a.channel && a.channel.close()) : a.ma("webChannelMessage", new lmb(c[0], c[1]));
                a.yg = b.statusCode;
                ykb(a.Ka, "WEB_CHANNEL")
            });
            g.fd(a.channel, "o", function() {
                401 === a.yg || a.B.start();
                a.ma("webChannelError");
                Akb(a.Ba, "WEB_CHANNEL")
            })
        },
        tmb = function(a) {
            var b = a.ya();
            b ? a.C["x-youtube-lounge-xsrf-token"] = b : delete a.C["x-youtube-lounge-xsrf-token"]
        },
        umb = function(a) {
            g.nd.call(this);
            this.j = a();
            this.j.subscribe("webChannelOpened", this.DY, this);
            this.j.subscribe("webChannelClosed", this.BY, this);
            this.j.subscribe("webChannelError", this.onError, this);
            this.j.subscribe("webChannelMessage", this.CY, this)
        },
        vmb = function(a, b, c, d, e) {
            function f() {
                return new nmb(Z8(a, "/bc"), b, !1, c, d)
            }
            c = void 0 === c ? function() {
                return ""
            } : c;
            return g.wv("enable_mdx_web_channel_desktop") ? new umb(function() {
                return new rmb(Z8(a, "/wc"), b, c)
            }) : new qmb(f, e)
        },
        zmb = function() {
            var a = wmb;
            xmb();
            $8.push(a);
            ymb()
        },
        a9 = function(a, b) {
            xmb();
            var c = Amb(a, String(b));
            g.nb($8) ? Bmb(c) : (ymb(), g.Eb($8, function(d) {
                d(c)
            }))
        },
        b9 = function(a) {
            a9("CP", a)
        },
        xmb = function() {
            $8 || ($8 = g.Ga("yt.mdx.remote.debug.handlers_") || [], g.Ea("yt.mdx.remote.debug.handlers_", $8))
        },
        Bmb = function(a) {
            var b = (c9 + 1) % 50;
            c9 = b;
            d9[b] = a;
            e9 || (e9 = 49 == b)
        },
        ymb = function() {
            var a = $8;
            if (d9[0]) {
                var b = e9 ? c9 : -1;
                do {
                    b = (b + 1) % 50;
                    var c = d9[b];
                    g.Eb(a, function(d) {
                        d(c)
                    })
                } while (b != c9);
                d9 = Array(50);
                c9 = -1;
                e9 = !1
            }
        },
        Amb = function(a, b) {
            var c = (Date.now() - Cmb) / 1E3;
            c.toFixed && (c = c.toFixed(3));
            var d = [];
            d.push("[", c + "s", "] ");
            d.push("[", "yt.mdx.remote", "] ");
            d.push(a + ": " + b, "\n");
            return d.join("")
        },
        f9 = function(a) {
            g.QB.call(this);
            this.I = a;
            this.screens = []
        },
        Dmb = function(a, b) {
            var c = a.get(b.uuid) || a.get(b.id);
            if (c) return a = c.name, c.id = b.id || c.id, c.name = b.name, c.token = b.token, c.uuid = b.uuid || c.uuid, c.name != a;
            a.screens.push(b);
            return !0
        },
        Emb = function(a, b) {
            var c = a.screens.length != b.length;
            a.screens = g.pm(a.screens, function(f) {
                return !!Wjb(b, f)
            });
            for (var d = 0, e = b.length; d < e; d++) c = Dmb(a, b[d]) || c;
            return c
        },
        Fmb = function(a, b) {
            var c = a.screens.length;
            a.screens = g.pm(a.screens, function(d) {
                return !(d || b ? !d != !b ? 0 : d.id == b.id : 1)
            });
            return a.screens.length < c
        },
        Gmb = function(a, b, c, d, e) {
            g.QB.call(this);
            this.B = a;
            this.J = b;
            this.C = c;
            this.I = d;
            this.D = e;
            this.u = 0;
            this.j = null;
            this.Fc = NaN
        },
        h9 = function(a) {
            f9.call(this, "LocalScreenService");
            this.u = a;
            this.j = NaN;
            g9(this);
            this.info("Initializing with " + Tjb(this.screens))
        },
        Hmb = function(a) {
            if (a.screens.length) {
                var b = g.Gg(a.screens, function(d) {
                        return d.id
                    }),
                    c = Z8(a.u, "/pairing/get_lounge_token_batch");
                pmb(a.u, c, {
                    screen_ids: b.join(",")
                }, (0, g.Oa)(a.q1, a), (0, g.Oa)(a.o1, a))
            }
        },
        g9 = function(a) {
            if (g.wv("deprecate_pair_servlet_enabled")) return Emb(a, []);
            var b = Sjb(ckb());
            b = g.pm(b, function(c) {
                return !c.uuid
            });
            return Emb(a, b)
        },
        i9 = function(a, b) {
            ekb(g.Gg(a.screens, Qjb));
            b && dkb()
        },
        Jmb = function(a, b) {
            g.QB.call(this);
            this.I = b;
            b = (b = g.fB("yt-remote-online-screen-ids") || "") ? b.split(",") : [];
            for (var c = {}, d = this.I(), e = d.length, f = 0; f < e; ++f) {
                var h = d[f].id;
                c[h] = g.jb(b, h)
            }
            this.j = c;
            this.D = a;
            this.B = this.C = NaN;
            this.u = null;
            Imb("Initialized with " + g.Ih(this.j))
        },
        Kmb = function(a, b, c) {
            var d = Z8(a.D, "/pairing/get_screen_availability");
            pmb(a.D, d, {
                lounge_token: b.token
            }, (0, g.Oa)(function(e) {
                e = e.screens || [];
                for (var f = e.length, h = 0; h < f; ++h)
                    if (e[h].loungeToken == b.token) {
                        c("online" == e[h].status);
                        return
                    }
                c(!1)
            }, a), (0, g.Oa)(function() {
                c(!1)
            }, a))
        },
        Mmb = function(a, b) {
            a: if (Hjb(b) != Hjb(a.j)) var c = !1;
                else {
                    c = g.Oc(b);
                    for (var d = c.length, e = 0; e < d; ++e)
                        if (!a.j[c[e]]) {
                            c = !1;
                            break a
                        }
                    c = !0
                }c || (Imb("Updated online screens: " + g.Ih(a.j)), a.j = b, a.ma("screenChange"));Lmb(a)
        },
        j9 = function(a) {
            isNaN(a.B) || g.Tv(a.B);
            a.B = g.Rv((0, g.Oa)(a.iN, a), 0 < a.C && a.C < g.Qa() ? 2E4 : 1E4)
        },
        Imb = function(a) {
            a9("OnlineScreenService", a)
        },
        Nmb = function(a) {
            var b = {};
            g.Eb(a.I(), function(c) {
                c.token ? b[c.token] = c.id : this.Kf("Requesting availability of screen w/o lounge token.")
            });
            return b
        },
        Lmb = function(a) {
            a = g.Oc(g.Jc(a.j, function(b) {
                return b
            }));
            g.Bb(a);
            a.length ? g.eB("yt-remote-online-screen-ids", a.join(","), 60) : g.gB("yt-remote-online-screen-ids")
        },
        k9 = function(a, b) {
            b = void 0 === b ? !1 : b;
            f9.call(this, "ScreenService");
            this.C = a;
            this.J = b;
            this.j = this.u = null;
            this.B = [];
            this.D = {};
            Omb(this)
        },
        Qmb = function(a, b, c, d, e, f) {
            a.info("getAutomaticScreenByIds " + c + " / " + b);
            c || (c = a.D[b]);
            var h = a.hk(),
                l = c ? g8(h, c) : null;
            c && (a.J || l) || (l = g8(h, b));
            if (l) {
                l.uuid = b;
                var m = l9(a, l);
                Kmb(a.j, m, function(n) {
                    e(n ? m : null)
                })
            } else c ? Pmb(a, c, (0, g.Oa)(function(n) {
                var p = l9(this, new d8({
                    name: d,
                    screenId: c,
                    loungeToken: n,
                    dialId: b || ""
                }));
                Kmb(this.j, p, function(q) {
                    e(q ? p : null)
                })
            }, a), f) : e(null)
        },
        Rmb = function(a, b) {
            for (var c = a.screens.length, d = 0; d < c; ++d)
                if (a.screens[d].name == b) return a.screens[d];
            return null
        },
        Smb = function(a, b, c) {
            Kmb(a.j, b, c)
        },
        Pmb = function(a, b, c, d) {
            a.info("requestLoungeToken_ for " + b);
            var e = {
                postParams: {
                    screen_ids: b
                },
                method: "POST",
                context: a,
                onSuccess: function(f, h) {
                    f = h && h.screens || [];
                    f[0] && f[0].screenId == b ? c(f[0].loungeToken) : d(Error("Missing lounge token in token response"))
                },
                onError: function() {
                    d(Error("Request screen lounge token failed"))
                }
            };
            g.Wv(Z8(a.C, "/pairing/get_lounge_token_batch"), e)
        },
        Tmb = function(a) {
            a.screens = a.u.hk();
            var b = a.D,
                c = {},
                d;
            for (d in b) c[b[d]] = d;
            b = a.screens.length;
            for (d = 0; d < b; ++d) {
                var e = a.screens[d];
                e.uuid = c[e.id] || ""
            }
            a.info("Updated manual screens: " + Tjb(a.screens))
        },
        Omb = function(a) {
            Umb(a);
            a.u = new h9(a.C);
            a.u.subscribe("screenChange", (0, g.Oa)(a.C1, a));
            Tmb(a);
            a.J || (a.B = Sjb(g.fB("yt-remote-automatic-screen-cache") || []));
            Umb(a);
            a.info("Initializing automatic screens: " + Tjb(a.B));
            a.j = new Jmb(a.C, (0, g.Oa)(a.hk, a, !0));
            a.j.subscribe("screenChange", (0, g.Oa)(function() {
                this.ma("onlineScreenChange")
            }, a))
        },
        l9 = function(a, b) {
            var c = a.get(b.id);
            c ? (c.uuid = b.uuid, b = c) : ((c = g8(a.B, b.uuid)) ? (c.id = b.id, c.token = b.token, b = c) : a.B.push(b), a.J || Vmb(a));
            Umb(a);
            a.D[b.uuid] = b.id;
            g.eB("yt-remote-device-id-map", a.D, 31536E3);
            return b
        },
        Vmb = function(a) {
            a = g.pm(a.B, function(b) {
                return "shortLived" != b.idType
            });
            g.eB("yt-remote-automatic-screen-cache", g.Gg(a, Qjb))
        },
        Umb = function(a) {
            a.D = g.fB("yt-remote-device-id-map") || {}
        },
        m9 = function(a, b, c) {
            g.QB.call(this);
            this.Ba = c;
            this.B = a;
            this.j = b;
            this.C = null
        },
        n9 = function(a, b) {
            a.C = b;
            a.ma("sessionScreen", a.C)
        },
        Wmb = function(a, b) {
            a.C && (a.C.token = b, l9(a.B, a.C));
            a.ma("sessionScreen", a.C)
        },
        o9 = function(a, b) {
            a9(a.Ba, b)
        },
        p9 = function(a, b, c) {
            m9.call(this, a, b, "CastSession");
            var d = this;
            this.config_ = c;
            this.u = null;
            this.oa = (0, g.Oa)(this.IY, this);
            this.Aa = (0, g.Oa)(this.T5, this);
            this.ea = g.Rv(function() {
                Xmb(d, null)
            }, 12E4);
            this.J = this.D = this.I = this.T = 0;
            this.ya = !1;
            this.Z = "unknown"
        },
        Zmb = function(a, b) {
            g.Tv(a.J);
            a.J = 0;
            0 == b ? Ymb(a) : a.J = g.Rv(function() {
                Ymb(a)
            }, b)
        },
        Ymb = function(a) {
            $mb(a, "getLoungeToken");
            g.Tv(a.D);
            a.D = g.Rv(function() {
                anb(a, null)
            }, 3E4)
        },
        $mb = function(a, b) {
            a.info("sendYoutubeMessage_: " + b + " " + g.Ih());
            var c = {};
            c.type = b;
            a.u ? a.u.sendMessage("urn:x-cast:com.google.youtube.mdx", c, function() {}, (0, g.Oa)(function() {
                o9(this, "Failed to send message: " + b + ".")
            }, a)) : o9(a, "Sending yt message without session: " + g.Ih(c))
        },
        bnb = function(a, b) {
            b ? (a.info("onConnectedScreenId_: Received screenId: " + b), a.getScreen() && a.getScreen().id == b || a.tS(b, function(c) {
                n9(a, c)
            }, function() {
                return a.Wi()
            }, 5)) : a.Wi(Error("Waiting for session status timed out."))
        },
        dnb = function(a, b, c) {
            a.info("onConnectedScreenData_: Received screenData: " +
                JSON.stringify(b));
            var d = new d8(b);
            cnb(a, d, function(e) {
                e ? (a.ya = !0, l9(a.B, d), n9(a, d), a.Z = "unknown", Zmb(a, c)) : (g.Bv(Error("CastSession, RemoteScreen from screenData: " + JSON.stringify(b) + " is not online.")), a.Wi())
            }, 5)
        },
        Xmb = function(a, b) {
            g.Tv(a.ea);
            a.ea = 0;
            b ? a.config_.enableCastLoungeToken && b.loungeToken ? b.deviceId ? a.getScreen() && a.getScreen().uuid == b.deviceId || (b.loungeTokenRefreshIntervalMs ? dnb(a, {
                name: a.j.friendlyName,
                screenId: b.screenId,
                loungeToken: b.loungeToken,
                dialId: b.deviceId,
                screenIdType: "shortLived"
            }, b.loungeTokenRefreshIntervalMs) : (g.Bv(Error("No loungeTokenRefreshIntervalMs presents in mdxSessionStatusData: " + JSON.stringify(b) + ".")), bnb(a, b.screenId))) : (g.Bv(Error("No device id presents in mdxSessionStatusData: " + JSON.stringify(b) +
                ".")), bnb(a, b.screenId)) : bnb(a, b.screenId) : a.Wi(Error("Waiting for session status timed out."))
        },
        anb = function(a, b) {
            g.Tv(a.D);
            a.D = 0;
            var c = null;
            if (b)
                if (b.loungeToken) {
                    var d;
                    (null == (d = a.getScreen()) ? void 0 : d.token) == b.loungeToken && (c = "staleLoungeToken")
                } else c = "missingLoungeToken";
            else c = "noLoungeTokenResponse";
            c ? (a.info("Did not receive a new lounge token in onLoungeToken_ with data: " + (JSON.stringify(b) + ", error: " + c)), a.Z = c, Zmb(a, 3E4)) : (Wmb(a, b.loungeToken), a.ya = !1, a.Z = "unknown", Zmb(a, b.loungeTokenRefreshIntervalMs))
        },
        cnb = function(a, b, c, d) {
            g.Tv(a.I);
            a.I = 0;
            Smb(a.B, b, function(e) {
                e || 0 > d ? c(e) : a.I = g.Rv(function() {
                    cnb(a, b, c, d - 1)
                }, 300)
            })
        },
        enb = function(a) {
            g.Tv(a.T);
            a.T = 0;
            g.Tv(a.I);
            a.I = 0;
            g.Tv(a.ea);
            a.ea = 0;
            g.Tv(a.D);
            a.D = 0;
            g.Tv(a.J);
            a.J = 0
        },
        q9 = function(a, b, c, d) {
            m9.call(this, a, b, "DialSession");
            this.config_ = d;
            this.u = this.T = null;
            this.Aa = "";
            this.Qa = c;
            this.Ma = null;
            this.ea = function() {};
            this.Z = NaN;
            this.Ka = (0, g.Oa)(this.JY, this);
            this.D = function() {};
            this.J = this.I = 0;
            this.oa = !1;
            this.ya = "unknown"
        },
        r9 = function(a) {
            var b;
            return !!(a.config_.enableDialLoungeToken && (null == (b = a.u) ? 0 : b.getDialAppInfo))
        },
        fnb = function(a) {
            a.D = a.B.HP(a.Aa, a.j.label, a.j.friendlyName, r9(a), function(b, c) {
                a.D = function() {};
                a.oa = !0;
                n9(a, b);
                "shortLived" == b.idType && 0 < c && s9(a, c)
            }, function(b) {
                a.D = function() {};
                a.Wi(b)
            })
        },
        gnb = function(a) {
            var b = {};
            b.pairingCode = a.Aa;
            b.theme = a.Qa;
            gkb() && (b.env_useStageMdx = 1);
            return g.Wh(b)
        },
        hnb = function(a) {
            return new Promise(function(b) {
                a.Aa = Ujb();
                if (a.Ma) {
                    var c = new chrome.cast.DialLaunchResponse(!0, gnb(a));
                    b(c);
                    fnb(a)
                } else a.ea = function() {
                    g.Tv(a.Z);
                    a.ea = function() {};
                    a.Z = NaN;
                    var d = new chrome.cast.DialLaunchResponse(!0, gnb(a));
                    b(d);
                    fnb(a)
                }, a.Z = g.Rv(function() {
                    a.ea()
                }, 100)
            })
        },
        jnb = function(a, b, c) {
            a.info("initOnConnectedScreenDataPromise_: Received screenData: " + JSON.stringify(b));
            var d = new d8(b);
            return (new Promise(function(e) {
                inb(a, d, function(f) {
                    f ? (a.oa = !0, l9(a.B, d), n9(a, d), s9(a, c)) : g.Bv(Error("DialSession, RemoteScreen from screenData: " + JSON.stringify(b) + " is not online."));
                    e(f)
                }, 5)
            })).then(function(e) {
                return e ? new chrome.cast.DialLaunchResponse(!1) : hnb(a)
            })
        },
        knb = function(a, b) {
            var c = a.T.receiver.label,
                d = a.j.friendlyName;
            return (new Promise(function(e) {
                Qmb(a.B, c, b, d, function(f) {
                    f && f.token && n9(a, f);
                    e(f)
                }, function(f) {
                    o9(a, "Failed to get DIAL screen: " + f);
                    e(null)
                })
            })).then(function(e) {
                return e && e.token ? new chrome.cast.DialLaunchResponse(!1) : hnb(a)
            })
        },
        inb = function(a, b, c, d) {
            g.Tv(a.I);
            a.I = 0;
            Smb(a.B, b, function(e) {
                e || 0 > d ? c(e) : a.I = g.Rv(function() {
                    inb(a, b, c, d - 1)
                }, 300)
            })
        },
        s9 = function(a, b) {
            a.info("getDialAppInfoWithTimeout_ " + b);
            r9(a) && (g.Tv(a.J), a.J = 0, 0 == b ? lnb(a) : a.J = g.Rv(function() {
                lnb(a)
            }, b))
        },
        lnb = function(a) {
            r9(a) && a.u.getDialAppInfo(function(b) {
                a.info("getDialAppInfo dialLaunchData: " + JSON.stringify(b));
                b = b.extraData || {};
                var c = null;
                if (b.loungeToken) {
                    var d;
                    (null == (d = a.getScreen()) ? void 0 : d.token) == b.loungeToken && (c = "staleLoungeToken")
                } else c = "missingLoungeToken";
                c ? (a.ya = c, s9(a, 3E4)) : (a.oa = !1, a.ya = "unknown", Wmb(a, b.loungeToken), s9(a, b.loungeTokenRefreshIntervalMs))
            }, function(b) {
                a.info("getDialAppInfo error: " + b);
                a.ya = "noLoungeTokenResponse";
                s9(a, 3E4)
            })
        },
        mnb = function(a) {
            g.Tv(a.I);
            a.I = 0;
            g.Tv(a.J);
            a.J = 0;
            a.D();
            a.D = function() {};
            g.Tv(a.Z)
        },
        t9 = function(a, b) {
            m9.call(this, a, b, "ManualSession");
            this.u = g.Rv((0, g.Oa)(this.Yx, this, null), 150)
        },
        u9 = function(a, b) {
            g.QB.call(this);
            this.config_ = b;
            this.u = a;
            this.T = b.appId || "233637DE";
            this.C = b.theme || "cl";
            this.Z = b.disableCastApi || !1;
            this.I = b.forceMirroring || !1;
            this.j = null;
            this.J = !1;
            this.B = [];
            this.D = (0, g.Oa)(this.O4, this)
        },
        nnb = function(a, b) {
            return b ? g.gb(a.B, function(c) {
                return e8(b, c.label)
            }, a) : null
        },
        v9 = function(a) {
            a9("Controller", a)
        },
        wmb = function(a) {
            window.chrome && chrome.cast && chrome.cast.logMessage && chrome.cast.logMessage(a)
        },
        w9 = function(a) {
            return a.J || !!a.B.length || !!a.j
        },
        x9 = function(a, b, c) {
            b != a.j && (g.$a(a.j), (a.j = b) ? (c ? a.ma("yt-remote-cast2-receiver-resumed",
                b.j) : a.ma("yt-remote-cast2-receiver-selected", b.j), b.subscribe("sessionScreen", (0, g.Oa)(a.NU, a, b)), b.subscribe("sessionFailed", function() {
                return onb(a, b)
            }), b.getScreen() ? a.ma("yt-remote-cast2-session-change", b.getScreen()) : c && a.j.Yx(null)) : a.ma("yt-remote-cast2-session-change", null))
        },
        onb = function(a, b) {
            a.j == b && a.ma("yt-remote-cast2-session-failed")
        },
        pnb = function(a) {
            var b = a.u.GP(),
                c = a.j && a.j.j;
            a = g.Gg(b, function(d) {
                c && e8(d, c.label) && (c = null);
                var e = d.uuid ? d.uuid : d.id,
                    f = nnb(this, d);
                f ? (f.label = e, f.friendlyName = d.name) : (f = new chrome.cast.Receiver(e, d.name), f.receiverType = chrome.cast.ReceiverType.CUSTOM);
                return f
            }, a);
            c && (c.receiverType != chrome.cast.ReceiverType.CUSTOM && (c = new chrome.cast.Receiver(c.label, c.friendlyName), c.receiverType = chrome.cast.ReceiverType.CUSTOM), a.push(c));
            return a
        },
        wnb = function(a, b, c, d) {
            d.disableCastApi ? y9("Cannot initialize because disabled by Mdx config.") : qnb() ? rnb(b, d) && (snb(!0), window.chrome && chrome.cast && chrome.cast.isAvailable ? tnb(a, c) : (window.__onGCastApiAvailable = function(e, f) {
                e ? tnb(a, c) : (z9("Failed to load cast API: " + f), unb(!1), snb(!1), g.gB("yt-remote-cast-available"), g.gB("yt-remote-cast-receiver"),
                    vnb(), c(!1))
            }, d.loadCastApiSetupScript ? g.iB("https://www.gstatic.com/cv/js/sender/v1/cast_sender.js") : 0 <= window.navigator.userAgent.indexOf("Android") && 0 <= window.navigator.userAgent.indexOf("Chrome/") && window.navigator.presentation ? 60 <= hkb() && qkb() : !window.chrome || !window.navigator.presentation || 0 <= window.navigator.userAgent.indexOf("Edge") ? lkb() : 89 <= hkb() ? skb() : (pkb(), l8(rkb.map(mkb))))) : y9("Cannot initialize because not running Chrome")
        },
        vnb = function() {
            y9("dispose");
            var a = A9();
            a && a.dispose();
            g.Ea("yt.mdx.remote.cloudview.instance_", null);
            xnb(!1);
            g.wz(ynb);
            ynb.length = 0
        },
        B9 = function() {
            return !!g.fB("yt-remote-cast-installed")
        },
        znb = function() {
            var a = g.fB("yt-remote-cast-receiver");
            return a ? a.friendlyName : null
        },
        Anb = function() {
            y9("clearCurrentReceiver");
            g.gB("yt-remote-cast-receiver")
        },
        Bnb = function() {
            return B9() ? A9() ? A9().getCastSession() : (z9("getCastSelector: Cast is not initialized."), null) : (z9("getCastSelector: Cast API is not installed!"), null)
        },
        Cnb = function() {
            B9() ? A9() ? C9() ? (y9("Requesting cast selector."), A9().requestSession()) : (y9("Wait for cast API to be ready to request the session."), ynb.push(g.vz("yt-remote-cast2-api-ready", Cnb))) : z9("requestCastSelector: Cast is not initialized.") : z9("requestCastSelector: Cast API is not installed!")
        },
        D9 = function(a, b) {
            C9() ? A9().setConnectedScreenStatus(a, b) : z9("setConnectedScreenStatus called before ready.")
        },
        qnb = function() {
            var a = 0 <= g.Vb().search(/ (CrMo|Chrome|CriOS)\//);
            return g.KF || a
        },
        Dnb = function(a, b) {
            A9().init(a, b)
        },
        rnb = function(a, b) {
            var c = !1;
            A9() || (a = new u9(a, b), a.subscribe("yt-remote-cast2-availability-change", function(d) {
                g.eB("yt-remote-cast-available", d);
                b8("yt-remote-cast2-availability-change", d)
            }), a.subscribe("yt-remote-cast2-receiver-selected", function(d) {
                y9("onReceiverSelected: " + d.friendlyName);
                g.eB("yt-remote-cast-receiver", d);
                b8("yt-remote-cast2-receiver-selected", d)
            }), a.subscribe("yt-remote-cast2-receiver-resumed", function(d) {
                y9("onReceiverResumed: " + d.friendlyName);
                g.eB("yt-remote-cast-receiver", d);
                b8("yt-remote-cast2-receiver-resumed", d)
            }), a.subscribe("yt-remote-cast2-session-change", function(d) {
                y9("onSessionChange: " + f8(d));
                d || g.gB("yt-remote-cast-receiver");
                b8("yt-remote-cast2-session-change", d)
            }), g.Ea("yt.mdx.remote.cloudview.instance_", a), c = !0);
            y9("cloudview.createSingleton_: " + c);
            return c
        },
        A9 = function() {
            return g.Ga("yt.mdx.remote.cloudview.instance_")
        },
        tnb = function(a, b) {
            unb(!0);
            snb(!1);
            Dnb(a, function(c) {
                c ? (xnb(!0), g.xz("yt-remote-cast2-api-ready")) : (z9("Failed to initialize cast API."), unb(!1), g.gB("yt-remote-cast-available"), g.gB("yt-remote-cast-receiver"), vnb());
                b(c)
            })
        },
        y9 = function(a) {
            a9("cloudview", a)
        },
        z9 = function(a) {
            a9("cloudview", a)
        },
        unb = function(a) {
            y9("setCastInstalled_ " + a);
            g.eB("yt-remote-cast-installed", a)
        },
        C9 = function() {
            return !!g.Ga("yt.mdx.remote.cloudview.apiReady_")
        },
        xnb = function(a) {
            y9("setApiReady_ " + a);
            g.Ea("yt.mdx.remote.cloudview.apiReady_", a)
        },
        snb = function(a) {
            g.Ea("yt.mdx.remote.cloudview.initializing_", a)
        },
        E9 = function(a) {
            this.index = -1;
            this.videoId = this.listId = "";
            this.volume = this.playerState = -1;
            this.muted = !1;
            this.audioTrackId = null;
            this.I = this.J = 0;
            this.trackData = null;
            this.hasNext = this.uo = !1;
            this.T = this.D = this.j = this.C = 0;
            this.B = NaN;
            this.u = !1;
            this.reset(a)
        },
        Enb = function(a) {
            a.audioTrackId = null;
            a.trackData = null;
            a.playerState = -1;
            a.uo = !1;
            a.hasNext = !1;
            a.J = 0;
            a.I = g.Qa();
            a.C = 0;
            a.j = 0;
            a.D = 0;
            a.T = 0;
            a.B = NaN;
            a.u = !1
        },
        F9 = function(a) {
            return a.Zc() ? (g.Qa() - a.I) / 1E3 : 0
        },
        G9 = function(a, b) {
            a.J = b;
            a.I = g.Qa()
        },
        H9 = function(a) {
            switch (a.playerState) {
                case 1:
                case 1081:
                    return (g.Qa() - a.I) / 1E3 + a.J;
                case -1E3:
                    return 0
            }
            return a.J
        },
        I9 = function(a, b, c) {
            var d = a.videoId;
            a.videoId = b;
            a.index = c;
            b != d && Enb(a)
        },
        Fnb = function(a) {
            var b = {};
            b.index = a.index;
            b.listId = a.listId;
            b.videoId = a.videoId;
            b.playerState = a.playerState;
            b.volume = a.volume;
            b.muted = a.muted;
            b.audioTrackId = a.audioTrackId;
            b.trackData = g.Yc(a.trackData);
            b.hasPrevious = a.uo;
            b.hasNext = a.hasNext;
            b.playerTime = a.J;
            b.playerTimeAt = a.I;
            b.seekableStart = a.C;
            b.seekableEnd = a.j;
            b.duration = a.D;
            b.loadedTime = a.T;
            b.liveIngestionTime = a.B;
            return b
        },
        K9 = function(a, b) {
            g.QB.call(this);
            this.B = 0;
            this.C = a;
            this.I = [];
            this.D = new imb;
            this.u = this.j = null;
            this.Z = (0, g.Oa)(this.E3, this);
            this.J = (0, g.Oa)(this.UB, this);
            this.T = (0, g.Oa)(this.D3, this);
            this.ea = (0, g.Oa)(this.F3, this);
            var c = 0;
            a ? (c = a.getProxyState(), 3 != c && (a.subscribe("proxyStateChange", this.EN, this), Gnb(this))) : c = 3;
            0 != c && (b ? this.EN(c) : g.Rv((0, g.Oa)(function() {
                this.EN(c)
            }, this), 0));
            (a = Bnb()) && J9(this, a);
            this.subscribe("yt-remote-cast2-session-change", this.ea)
        },
        L9 = function(a) {
            return new E9(a.C.getPlayerContextData())
        },
        Gnb = function(a) {
            g.Eb("nowAutoplaying autoplayDismissed remotePlayerChange remoteQueueChange autoplayModeChange autoplayUpNext previousNextChange multiStateLoopEnabled loopModeChange".split(" "), function(b) {
                this.I.push(this.C.subscribe(b, g.Pa(this.M4, b), this))
            }, a)
        },
        Hnb = function(a) {
            g.Eb(a.I, function(b) {
                this.C.unsubscribeByKey(b)
            }, a);
            a.I.length = 0
        },
        M9 = function(a) {
            return 1 == a.getState()
        },
        N9 = function(a, b) {
            var c = a.D;
            50 > c.j.length + c.u.length && a.D.u.push(b)
        },
        Inb = function(a, b, c) {
            var d = L9(a);
            G9(d, c); - 1E3 != d.playerState && (d.playerState = b);
            O9(a, d)
        },
        P9 = function(a, b, c) {
            a.C.sendMessage(b, c)
        },
        O9 = function(a, b) {
            Hnb(a);
            a.C.setPlayerContextData(Fnb(b));
            Gnb(a)
        },
        J9 = function(a, b) {
            a.u && (a.u.removeUpdateListener(a.Z), a.u.removeMediaListener(a.J), a.UB(null));
            a.u = b;
            a.u && (b9("Setting cast session: " + a.u.sessionId), a.u.addUpdateListener(a.Z), a.u.addMediaListener(a.J), a.u.media.length && a.UB(a.u.media[0]))
        },
        Jnb = function(a) {
            var b = a.j.media,
                c = a.j.customData;
            if (b && c) {
                var d = L9(a);
                b.contentId != d.videoId && b9("Cast changing video to: " + b.contentId);
                d.videoId = b.contentId;
                d.playerState = c.playerState;
                G9(d, a.j.getEstimatedTime());
                O9(a, d)
            } else b9("No cast media video. Ignoring state update.")
        },
        Q9 = function(a, b, c) {
            return (0, g.Oa)(function(d) {
                this.Kf("Failed to " + b + " with cast v2 channel. Error code: " + d.code);
                d.code != chrome.cast.ErrorCode.TIMEOUT && (this.Kf("Retrying " + b + " using MDx browser channel."), P9(this, b, c))
            }, a)
        },
        T9 = function(a, b, c, d) {
            d = void 0 === d ? !1 : d;
            g.QB.call(this);
            var e = this;
            this.I = NaN;
            this.Aa = !1;
            this.Z = this.T = this.oa = this.ya = NaN;
            this.ea = [];
            this.D = this.J = this.C = this.j = this.u = null;
            this.Ma = a;
            this.Ka = d;
            this.ea.push(g.bz(window, "beforeunload", function() {
                e.sx(2)
            }));
            this.B = [];
            this.j = new E9;
            this.Qa = b.id;
            this.Ba = b.idType;
            this.u = vmb(this.Ma, c, this.LP, "shortLived" == this.Ba, this.Qa);
            this.u.Pa("channelOpened", function() {
                Knb(e)
            });
            this.u.Pa("channelClosed", function() {
                R9("Channel closed");
                isNaN(e.I) ? j8(!0) : j8();
                e.dispose()
            });
            this.u.Pa("channelError", function(f) {
                j8();
                isNaN(e.ZA()) ? (1 == f && "shortLived" == e.Ba && e.ma("browserChannelAuthError", f), R9("Channel error: " + f + " without reconnection"), e.dispose()) : (e.Aa = !0, R9("Channel error: " + f + " with reconnection in " + e.ZA() + " ms"), S9(e, 2))
            });
            this.u.Pa("channelMessage", function(f) {
                Lnb(e, f)
            });
            this.u.xq(b.token);
            this.subscribe("remoteQueueChange", function() {
                var f = e.j.videoId;
                g.hB() && g.eB("yt-remote-session-video-id", f)
            })
        },
        Mnb = function(a) {
            return g.gb(a.B, function(b) {
                return "LOUNGE_SCREEN" == b.type
            })
        },
        R9 = function(a) {
            a9("conn", a)
        },
        S9 = function(a, b) {
            a.ma("proxyStateChange", b)
        },
        Nnb = function(a) {
            a.I = g.Rv(function() {
                R9("Connecting timeout");
                a.sx(1)
            }, 2E4)
        },
        Onb = function(a) {
            g.Tv(a.I);
            a.I = NaN
        },
        Pnb = function(a) {
            g.Tv(a.ya);
            a.ya = NaN
        },
        Rnb = function(a) {
            Qnb(a);
            a.oa = g.Rv(function() {
                U9(a, "getNowPlaying")
            }, 2E4)
        },
        Qnb = function(a) {
            g.Tv(a.oa);
            a.oa = NaN
        },
        Knb = function(a) {
            R9("Channel opened");
            a.Aa && (a.Aa = !1, Pnb(a), a.ya = g.Rv(function() {
                R9("Timing out waiting for a screen.");
                a.sx(1)
            }, 15E3))
        },
        Tnb = function(a, b) {
            var c = null;
            if (b) {
                var d = Mnb(a);
                d && (c = {
                    clientName: d.clientName,
                    deviceMake: d.brand,
                    deviceModel: d.model,
                    osVersion: d.osVersion
                })
            }
            g.Ea("yt.mdx.remote.remoteClient_", c);
            b && (Onb(a), Pnb(a));
            c = a.u.Nx() && isNaN(a.I);
            b == c ? b && (S9(a, 1), U9(a, "getSubtitlesTrack")) : b ? (a.rS() && a.j.reset(), S9(a, 1), U9(a, "getNowPlaying"), Snb(a)) : a.sx(1)
        },
        Unb = function(a, b) {
            var c = b.params.videoId;
            delete b.params.videoId;
            c == a.j.videoId && (g.Tc(b.params) ? a.j.trackData = null : a.j.trackData = b.params, a.ma("remotePlayerChange"))
        },
        Vnb = function(a, b, c) {
            var d = b.params.videoId || b.params.video_id,
                e = parseInt(b.params.currentIndex, 10);
            a.j.listId = b.params.listId || a.j.listId;
            I9(a.j, d, e);
            a.ma("remoteQueueChange", c)
        },
        Xnb = function(a, b) {
            b.params = b.params || {};
            Vnb(a, b, "NOW_PLAYING_MAY_CHANGE");
            Wnb(a, b);
            a.ma("autoplayDismissed")
        },
        Wnb = function(a, b) {
            var c = parseInt(b.params.currentTime || b.params.current_time, 10);
            G9(a.j, isNaN(c) ? 0 : c);
            c = parseInt(b.params.state, 10);
            c = isNaN(c) ? -1 : c; - 1 == c && -1E3 == a.j.playerState && (c = -1E3);
            a.j.playerState = c;
            c = Number(b.params.loadedTime);
            a.j.T = isNaN(c) ? 0 : c;
            a.j.Gk(Number(b.params.duration));
            c = a.j;
            var d = Number(b.params.liveIngestionTime);
            c.B = d;
            c.u = isNaN(d) ? !1 : !0;
            c = a.j;
            d = Number(b.params.seekableStartTime);
            b = Number(b.params.seekableEndTime);
            c.C = isNaN(d) ? 0 : d;
            c.j = isNaN(b) ? 0 : b;
            1 == a.j.playerState ? Rnb(a) : Qnb(a);
            a.ma("remotePlayerChange")
        },
        Ynb = function(a, b) {
            if (-1E3 != a.j.playerState) {
                var c =
                    1085;
                switch (parseInt(b.params.adState, 10)) {
                    case 1:
                        c = 1081;
                        break;
                    case 2:
                        c = 1084;
                        break;
                    case 0:
                        c = 1083
                }
                a.j.playerState = c;
                b = parseInt(b.params.currentTime, 10);
                G9(a.j, isNaN(b) ? 0 : b);
                a.ma("remotePlayerChange")
            }
        },
        Znb = function(a, b) {
            var c = "true" == b.params.muted;
            a.j.volume = parseInt(b.params.volume, 10);
            a.j.muted = c;
            a.ma("remotePlayerChange")
        },
        $nb = function(a, b) {
            a.J = b.params.videoId;
            a.ma("nowAutoplaying", parseInt(b.params.timeout, 10))
        },
        aob = function(a, b) {
            a.J = b.params.videoId || null;
            a.ma("autoplayUpNext", a.J)
        },
        bob = function(a, b) {
            a.D = b.params.autoplayMode;
            a.ma("autoplayModeChange", a.D);
            "DISABLED" == a.D && a.ma("autoplayDismissed")
        },
        cob = function(a, b) {
            var c = "true" == b.params.hasNext;
            a.j.uo = "true" == b.params.hasPrevious;
            a.j.hasNext = c;
            a.ma("previousNextChange")
        },
        Lnb = function(a, b) {
            b = b.message;
            b.params ? R9("Received: action=" + b.action + ", params=" + g.Ih(b.params)) : R9("Received: action=" + b.action + " {}");
            switch (b.action) {
                case "loungeStatus":
                    b = a8(b.params.devices);
                    a.B = g.Gg(b, function(d) {
                        return new c8(d)
                    });
                    b = !!g.gb(a.B, function(d) {
                        return "LOUNGE_SCREEN" == d.type
                    });
                    Tnb(a, b);
                    b = a.gT("mlm");
                    a.ma("multiStateLoopEnabled", b);
                    break;
                case "loungeScreenDisconnected":
                    g.qb(a.B, function(d) {
                        return "LOUNGE_SCREEN" == d.type
                    });
                    Tnb(a, !1);
                    break;
                case "remoteConnected":
                    var c = new c8(a8(b.params.device));
                    g.gb(a.B, function(d) {
                        return d.equals(c)
                    }) || Gjb(a.B, c);
                    break;
                case "remoteDisconnected":
                    c = new c8(a8(b.params.device));
                    g.qb(a.B, function(d) {
                        return d.equals(c)
                    });
                    break;
                case "gracefulDisconnect":
                    break;
                case "playlistModified":
                    Vnb(a, b, "QUEUE_MODIFIED");
                    break;
                case "nowPlaying":
                    Xnb(a, b);
                    break;
                case "onStateChange":
                    Wnb(a, b);
                    break;
                case "onAdStateChange":
                    Ynb(a, b);
                    break;
                case "onVolumeChanged":
                    Znb(a, b);
                    break;
                case "onSubtitlesTrackChanged":
                    Unb(a, b);
                    break;
                case "nowAutoplaying":
                    $nb(a, b);
                    break;
                case "autoplayDismissed":
                    a.ma("autoplayDismissed");
                    break;
                case "autoplayUpNext":
                    aob(a, b);
                    break;
                case "onAutoplayModeChanged":
                    bob(a, b);
                    break;
                case "onHasPreviousNextChanged":
                    cob(a, b);
                    break;
                case "requestAssistedSignIn":
                    a.ma("assistedSignInRequested", b.params.authCode);
                    break;
                case "onLoopModeChanged":
                    a.ma("loopModeChange", b.params.loopMode);
                    break;
                default:
                    R9("Unrecognized action: " + b.action)
            }
        },
        Snb = function(a) {
            g.Tv(a.Z);
            a.Z = g.Rv(function() {
                a.sx(1)
            }, 864E5)
        },
        U9 = function(a, b, c) {
            c ? R9("Sending: action=" + b + ", params=" + g.Ih(c)) : R9("Sending: action=" + b);
            a.u.sendMessage(b, c)
        },
        dob = function(a) {
            f9.call(this, "ScreenServiceProxy");
            this.Ig = a;
            this.j = [];
            this.j.push(this.Ig.$_s("screenChange", (0, g.Oa)(this.OY, this)));
            this.j.push(this.Ig.$_s("onlineScreenChange", (0, g.Oa)(this.u4, this)))
        },
        iob = function(a, b) {
            fkb();
            if (!k8 || !k8.get("yt-remote-disable-remote-module-for-dev")) {
                b = g.L("MDX_CONFIG") || b;
                Xjb();
                akb();
                V9 || (V9 = new Y8(b ? b.loungeApiHost : void 0), gkb() && (V9.j = "/api/loungedev"));
                W9 || (W9 = g.Ga("yt.mdx.remote.deferredProxies_") || [], g.Ea("yt.mdx.remote.deferredProxies_", W9));
                eob();
                var c = X9();
                if (!c) {
                    var d = new k9(V9, b ? b.disableAutomaticScreenCache || !1 : !1);
                    g.Ea("yt.mdx.remote.screenService_", d);
                    c = X9();
                    var e = {};
                    b && (e = {
                        appId: b.appId,
                        disableDial: b.disableDial,
                        theme: b.theme,
                        loadCastApiSetupScript: b.loadCastApiSetupScript,
                        disableCastApi: b.disableCastApi,
                        enableDialLoungeToken: b.enableDialLoungeToken,
                        enableCastLoungeToken: b.enableCastLoungeToken,
                        forceMirroring: b.forceMirroring
                    });
                    g.Ea("yt.mdx.remote.enableConnectWithInitialState_", b ? b.enableConnectWithInitialState || !1 : !1);
                    wnb(a, d, function(f) {
                        f ? Y9() && D9(Y9(), "YouTube TV") : d.subscribe("onlineScreenChange", function() {
                            b8("yt-remote-receiver-availability-change")
                        })
                    }, e)
                }
                b && !g.Ga("yt.mdx.remote.initialized_") && (g.Ea("yt.mdx.remote.initialized_", !0), Z9("Initializing: " + g.Ih(b)),
                    $9.push(g.vz("yt-remote-cast2-api-ready", function() {
                        b8("yt-remote-api-ready")
                    })), $9.push(g.vz("yt-remote-cast2-availability-change", function() {
                        b8("yt-remote-receiver-availability-change")
                    })), $9.push(g.vz("yt-remote-cast2-receiver-selected", function() {
                        a$(null);
                        b8("yt-remote-auto-connect", "cast-selector-receiver")
                    })), $9.push(g.vz("yt-remote-cast2-receiver-resumed", function() {
                        b8("yt-remote-receiver-resumed", "cast-selector-receiver")
                    })), $9.push(g.vz("yt-remote-cast2-session-change", fob)), $9.push(g.vz("yt-remote-connection-change", function(f) {
                        f ? D9(Y9(), "YouTube TV") : b$() || (D9(null, null), Anb())
                    })), $9.push(g.vz("yt-remote-cast2-session-failed", function() {
                        b8("yt-remote-connection-failed")
                    })), a = gob(), b.isAuto && (a.id += "#dial"), e = b.capabilities || [], g.wv("desktop_enable_autoplay") &&
                    e.push("atp"), 0 < e.length && (a.capabilities = e), a.name = b.device, a.app = b.app, (b = b.theme) && (a.theme = b), Z9(" -- with channel params: " + g.Ih(a)), a ? (g.eB("yt-remote-session-app", a.app), g.eB("yt-remote-session-name", a.name)) : (g.gB("yt-remote-session-app"), g.gB("yt-remote-session-name")), g.Ea("yt.mdx.remote.channelParams_", a), c.start(), Y9() || hob())
            }
        },
        job = function() {
            var a = X9().Ig.$_gos();
            var b = c$();
            b && d$() && (Wjb(a, b) || a.push(b));
            return Vjb(a)
        },
        lob = function() {
            var a = kob();
            !a && B9() && znb() && (a = {
                key: "cast-selector-receiver",
                name: znb()
            });
            return a
        },
        kob = function() {
            var a = job(),
                b = c$();
            b || (b = b$());
            return g.gb(a, function(c) {
                return b && e8(b, c.key) ? !0 : !1
            })
        },
        c$ = function() {
            var a = Y9();
            if (!a) return null;
            var b = X9().hk();
            return g8(b, a)
        },
        fob = function(a) {
            Z9("remote.onCastSessionChange_: " + f8(a));
            if (a) {
                var b = c$();
                if (b && b.id == a.id) {
                    if (D9(b.id, "YouTube TV"), "shortLived" == a.idType && (a = a.token)) e$ && (e$.token = a), (b = d$()) && b.xq(a)
                } else b && f$(), g$(a, 1)
            } else d$() && f$()
        },
        f$ = function() {
            C9() ? A9().stopSession() : z9("stopSession called before API ready.");
            var a = d$();
            a && (a.disconnect(1), mob(null))
        },
        nob = function() {
            var a = d$();
            return !!a && 3 != a.getProxyState()
        },
        Z9 = function(a) {
            a9("remote", a)
        },
        X9 = function() {
            if (!oob) {
                var a = g.Ga("yt.mdx.remote.screenService_");
                oob = a ? new dob(a) : null
            }
            return oob
        },
        Y9 = function() {
            return g.Ga("yt.mdx.remote.currentScreenId_")
        },
        pob = function(a) {
            g.Ea("yt.mdx.remote.currentScreenId_", a)
        },
        qob = function() {
            return g.Ga("yt.mdx.remote.connectData_")
        },
        a$ = function(a) {
            g.Ea("yt.mdx.remote.connectData_", a)
        },
        d$ = function() {
            return g.Ga("yt.mdx.remote.connection_")
        },
        mob = function(a) {
            var b = d$();
            a$(null);
            a || pob("");
            g.Ea("yt.mdx.remote.connection_", a);
            W9 && (g.Eb(W9, function(c) {
                c(a)
            }), W9.length = 0);
            b && !a ? b8("yt-remote-connection-change", !1) : !b && a && b8("yt-remote-connection-change", !0)
        },
        b$ = function() {
            var a = g.hB();
            if (!a) return null;
            var b = X9();
            if (!b) return null;
            b = b.hk();
            return g8(b, a)
        },
        g$ = function(a, b) {
            Y9();
            c$() && c$();
            if (h$) e$ = a;
            else {
                pob(a.id);
                var c = g.Ga("yt.mdx.remote.enableConnectWithInitialState_") || !1;
                a = new T9(V9, a, gob(), c);
                a.connect(b, qob());
                a.subscribe("beforeDisconnect", function(d) {
                    b8("yt-remote-before-disconnect", d)
                });
                a.subscribe("beforeDispose", function() {
                    d$() && (d$(), mob(null))
                });
                a.subscribe("browserChannelAuthError", function() {
                    var d = c$();
                    d && "shortLived" == d.idType && (C9() ? A9().handleBrowserChannelAuthError() : z9("refreshLoungeToken called before API ready."))
                });
                mob(a)
            }
        },
        hob = function() {
            var a = b$();
            a ? (Z9("Resume connection to: " + f8(a)), g$(a, 0)) : (j8(), Anb(), Z9("Skipping connecting because no session screen found."))
        },
        eob = function() {
            var a = gob();
            if (g.Tc(a)) {
                a = i8();
                var b = g.fB("yt-remote-session-name") || "",
                    c = g.fB("yt-remote-session-app") || "";
                a = {
                    device: "REMOTE_CONTROL",
                    id: a,
                    name: b,
                    app: c,
                    mdxVersion: 3
                };
                g.Ea("yt.mdx.remote.channelParams_", a)
            }
        },
        gob = function() {
            return g.Ga("yt.mdx.remote.channelParams_") || {}
        },
        tob = function(a, b, c) {
            g.C.call(this);
            var d = this;
            this.module = a;
            this.F = b;
            this.zc = c;
            this.events = new g.HF(this);
            this.Z = this.events.N(this.F, "onVolumeChange", function(e) {
                rob(d, e)
            });
            this.C = !1;
            this.D = new g.TL(64);
            this.j = new g.Tn(this.aW, 500, this);
            this.u = new g.Tn(this.bW, 1E3, this);
            this.J = new n8(this.x7, 0, this);
            this.B = {};
            this.T = new g.Tn(this.RW, 1E3, this);
            this.I = new o8(this.seekTo, 1E3, this);
            g.E(this, this.events);
            this.events.N(b, "onCaptionsTrackListChanged", this.e4);
            this.events.N(b, "captionschanged", this.B3);
            this.events.N(b, "captionssettingschanged", this.kW);
            this.events.N(b, "videoplayerreset", this.cG);
            this.events.N(b, "mdxautoplaycancel", function() {
                d.zc.JR()
            });
            b.S("enable_mdx_video_play_directly") && this.events.N(b, "videodatachange", function() {
                sob(d.module) || i$(d) || j$(d, 0)
            });
            a = this.zc;
            a.isDisposed();
            a.subscribe("proxyStateChange", this.KU, this);
            a.subscribe("remotePlayerChange", this.YB, this);
            a.subscribe("remoteQueueChange", this.cG, this);
            a.subscribe("previousNextChange", this.HU, this);
            a.subscribe("nowAutoplaying", this.BU, this);
            a.subscribe("autoplayDismissed", this.eU, this);
            g.E(this, this.j);
            g.E(this, this.u);
            g.E(this, this.J);
            g.E(this, this.T);
            g.E(this, this.I);
            this.kW();
            this.cG();
            this.YB()
        },
        rob = function(a, b) {
            if (i$(a)) {
                a.zc.unsubscribe("remotePlayerChange", a.YB, a);
                var c = Math.round(b.volume);
                b = !!b.muted;
                var d = L9(a.zc);
                if (c !== d.volume || b !== d.muted) a.zc.setVolume(c, b), a.T.start();
                a.zc.subscribe("remotePlayerChange", a.YB, a)
            }
        },
        uob = function(a) {
            a.vc(0);
            a.j.stop();
            a.lc(new g.TL(64))
        },
        vob = function(a, b) {
            if (i$(a) && !a.C) {
                var c = null;
                b && (c = {
                    style: a.F.getSubtitlesUserSettings()
                }, g.Zc(c, b));
                a.zc.KP(a.F.getVideoData(1).videoId, c);
                a.B = L9(a.zc).trackData
            }
        },
        j$ = function(a, b) {
            var c = a.F.getPlaylist();
            if (null == c ? 0 : c.listId) {
                var d = c.index;
                var e = c.listId.toString()
            }
            c = a.F.getVideoData(1);
            a.zc.playVideo(c.videoId, b, d, e, c.playerParams, c.Aa, Fjb(c));
            a.lc(new g.TL(1))
        },
        wob = function(a, b) {
            if (b) {
                var c = a.F.getOption("captions", "tracklist", {
                    XS: 1
                });
                c && c.length ? (a.F.setOption("captions", "track", b), a.C = !1) : (a.F.loadModule("captions"), a.C = !0)
            } else a.F.setOption("captions", "track", {})
        },
        i$ = function(a) {
            return L9(a.zc).videoId === a.F.getVideoData(1).videoId
        },
        k$ = function() {
            g.T.call(this, {
                G: "div",
                K: "ytp-mdx-popup-dialog",
                X: {
                    role: "dialog"
                },
                W: [{
                    G: "div",
                    K: "ytp-mdx-popup-dialog-inner-content",
                    W: [{
                        G: "div",
                        K: "ytp-mdx-popup-title",
                        qa: "You're signed out"
                    }, {
                        G: "div",
                        K: "ytp-mdx-popup-description",
                        qa: "Videos you watch may be added to the TV's watch history and influence TV recommendations. To avoid this, cancel and sign in to YouTube on your computer."
                    }, {
                        G: "div",
                        K: "ytp-mdx-privacy-popup-buttons",
                        W: [{
                            G: "button",
                            Ga: ["ytp-button", "ytp-mdx-privacy-popup-cancel"],
                            qa: "Cancel"
                        }, {
                            G: "button",
                            Ga: ["ytp-button",
                                "ytp-mdx-privacy-popup-confirm"
                            ],
                            qa: "Confirm"
                        }]
                    }]
                }]
            });
            this.j = new g.PN(this, 250);
            this.cancelButton = this.Ea("ytp-mdx-privacy-popup-cancel");
            this.confirmButton = this.Ea("ytp-mdx-privacy-popup-confirm");
            g.E(this, this.j);
            this.N(this.cancelButton, "click", this.u);
            this.N(this.confirmButton, "click", this.B)
        },
        l$ = function(a) {
            g.T.call(this, {
                G: "div",
                K: "ytp-remote",
                W: [{
                    G: "div",
                    K: "ytp-remote-display-status",
                    W: [{
                        G: "div",
                        K: "ytp-remote-display-status-icon",
                        W: [g.fFa()]
                    }, {
                        G: "div",
                        K: "ytp-remote-display-status-text",
                        qa: "{{statustext}}"
                    }]
                }]
            });
            this.api = a;
            this.j = new g.PN(this, 250);
            g.E(this, this.j);
            this.N(a, "presentingplayerstatechange", this.onStateChange);
            this.Ec(a.Fb())
        },
        m$ = function(a, b) {
            g.hU.call(this, "Play on", 1, a, b);
            this.F = a;
            this.Ks = {};
            this.N(a, "onMdxReceiversChange", this.B);
            this.N(a, "presentingplayerstatechange", this.B);
            this.B()
        },
        xob = function(a) {
            g.RQ.call(this, a);
            this.Fo = {
                key: Ujb(),
                name: "This computer"
            };
            this.bl = null;
            this.subscriptions = [];
            this.QM = this.zc = null;
            this.Ks = [this.Fo];
            this.ir = this.Fo;
            this.Pd = new g.TL(64);
            this.sT = 0;
            this.ph = -1;
            this.jC = !1;
            this.hC = this.Hy = null;
            if (!g.KH(this.player.V()) && !g.LH(this.player.V())) {
                a = this.player;
                var b = g.WP(a);
                b && (b = b.xm()) && (b = new m$(a, b), g.E(this, b));
                b = new l$(a);
                g.E(this, b);
                g.iQ(a, b.element, 4);
                this.Hy = new k$;
                g.E(this, this.Hy);
                g.iQ(a, this.Hy.element, 4);
                this.jC = !!b$()
            }
        },
        n$ = function(a) {
            a.hC && (a.player.removeEventListener("presentingplayerstatechange",
                a.hC), a.hC = null)
        },
        yob = function(a, b, c) {
            a.Pd = c;
            a.player.ma("presentingplayerstatechange", new g.lL(c, b))
        },
        o$ = function(a, b) {
            if (b.key !== a.ir.key)
                if (b.key === a.Fo.key) f$();
                else if (sob(a) && zob(a), a.ir = b, !a.player.V().S("disable_mdx_connection_in_mdx_module_for_music_web") || !g.LH(a.player.V())) {
                var c = a.player.getPlaylistId();
                var d = a.player.getVideoData(1);
                var e = d.videoId;
                if (!c && !e || (2 === a.player.getAppState() || 1 === a.player.getAppState()) && a.player.V().S("should_clear_video_data_on_player_cued_unstarted")) d = null;
                else {
                    var f = a.player.getPlaylist();
                    if (f) {
                        var h = [];
                        for (var l = 0; l < f.length; l++) h[l] = g.MQ(f, l).videoId
                    } else h = [e];
                    f = a.player.getCurrentTime(1);
                    a = {
                        videoIds: h,
                        listId: c,
                        videoId: e,
                        playerParams: d.playerParams,
                        clickTrackingParams: d.Aa,
                        index: Math.max(a.player.getPlaylistIndex(), 0),
                        currentTime: 0 === f ? void 0 : f
                    };
                    (d = Fjb(d)) && (a.locationInfo = d);
                    d = a
                }
                Z9("Connecting to: " + g.Ih(b));
                "cast-selector-receiver" == b.key ? (a$(d || null), b = d || null, C9() ? A9().setLaunchParams(b) : z9("setLaunchParams called before ready.")) : !d && nob() && Y9() == b.key ? b8("yt-remote-connection-change", !0) : (f$(), a$(d || null), d = X9().hk(), (b = g8(d, b.key)) && g$(b, 1))
            }
        },
        sob = function(a) {
            var b;
            (b = !a.player.V().S("mdx_enable_privacy_disclosure_ui")) || (b = ((b = g.L("PLAYER_CONFIG")) && b.args && void 0 !== b.args.authuser ? !0 : !(!g.L("SESSION_INDEX") && !g.L("LOGGED_IN"))) || a.jC || !a.Hy);
            return b ? !1 : g.aI(a.player.V()) || g.dI(a.player.V())
        },
        zob = function(a) {
            a.player.Fb().Zc() ? a.player.pauseVideo() : (a.hC = function(b) {
                !a.jC && g.nL(b, 8) && (a.player.pauseVideo(), n$(a))
            }, a.player.addEventListener("presentingplayerstatechange", a.hC));
            a.Hy && a.Hy.Rc();
            d$() || (h$ = !0)
        };
    g.Zq.prototype.Dr = g.ba(1, function() {
        return g.bg(this, 6)
    });
    g.Ng.prototype.yD = g.ba(0, function() {
        var a = g.Tg(this);
        return 4294967296 * g.Tg(this) + (a >>> 0)
    });
    var qjb, Aob = g.rh(function(a, b, c) {
            if (1 !== a.u) return !1;
            g.H(b, c, g.Ug(a.j));
            return !0
        }, g.sh),
        Bob = g.rh(function(a, b, c, d) {
            if (1 !== a.u) return !1;
            g.ng(b, c, d, g.Ug(a.j));
            return !0
        }, g.sh),
        Cob = g.rh(function(a, b, c) {
            if (0 !== a.u) return !1;
            g.H(b, c, g.Pg(a.j));
            return !0
        }, g.th),
        Dob = g.rh(function(a, b, c, d) {
            if (0 !== a.u) return !1;
            g.ng(b, c, d, g.Pg(a.j));
            return !0
        }, g.th),
        Eob = g.rh(function(a, b, c, d) {
            if (0 !== a.u) return !1;
            g.ng(b, c, d, g.Sg(a.j));
            return !0
        }, g.uh),
        Fob = g.rh(function(a, b, c) {
            if (1 !== a.u) return !1;
            g.H(b, c, a.j.yD());
            return !0
        }, function(a, b, c) {
            sjb(a, c, g.bg(b, c))
        }),
        Gob = g.rh(function(a, b, c) {
            if (1 !== a.u && 2 !== a.u) return !1;
            b = g.fg(b, c, 0, !1, g.Sf(b.Ve));
            if (2 == a.u) {
                c = g.Ng.prototype.yD;
                var d = g.Sg(a.j) >>> 0;
                for (d = a.j.j + d; a.j.j < d;) b.push(c.call(a.j))
            } else b.push(a.j.yD());
            return !0
        }, function(a, b, c) {
            b = g.ig(b, c, mjb);
            if (null != b)
                for (var d = 0; d < b.length; d++) sjb(a, c, b[d])
        }),
        Hob = g.rh(function(a, b, c) {
            if (0 !== a.u) return !1;
            g.H(b, c, g.Vg(a.j));
            return !0
        }, tjb),
        Iob = g.rh(function(a, b, c, d) {
            if (0 !== a.u) return !1;
            g.ng(b, c, d, g.Vg(a.j));
            return !0
        }, tjb),
        Job = g.rh(function(a, b, c) {
            if (2 !== a.u) return !1;
            a = g.bh(a);
            g.lg(b, c, a);
            return !0
        }, function(a, b, c) {
            b = g.ig(b, c, njb, !1);
            if (null != b)
                for (var d = 0; d < b.length; d++) {
                    var e = b[d];
                    null != e && g.hh(a, c, g.Qca(e))
                }
        }),
        Kob = g.rh(function(a, b, c, d) {
            if (2 !== a.u) return !1;
            g.ng(b, c, d, g.bh(a));
            return !0
        }, g.nea),
        Lob = g.rh(function(a, b, c, d, e) {
            if (2 !== a.u) return !1;
            g.Zg(a, ojb(b, d, c), e);
            return !0
        }, ujb),
        Mob = g.rh(function(a, b, c, d, e, f) {
            if (2 !== a.u) return !1;
            (f = g.mg(b, f)) && f !== c && g.H(b, f, void 0, !1);
            b = ojb(b, d, c);
            g.Zg(a, b, e);
            return !0
        }, ujb),
        vjb = [1];
    g.w(wjb, g.J);
    g.w(xjb, g.J);
    var Nob = [wjb, 1, g.A2, [xjb, 1, Aob, 2, Cob]];
    g.w(yjb, g.J);
    g.w(zjb, g.J);
    g.w(Ajb, g.J);
    var Oob = [1, 2],
        Pob = [g.wh, 1, g.z2, 5, Fob, 2, Lob, [yjb, 1, Mob, [zjb, 1, g.z2, 2, g.z2, 3, Hob], Oob, 2, Mob, [Ajb, 1, g.z2, 2, g.z2, 3, g.e5a, 4, Hob], Oob], 3, Job, 6, Gob, 4, g.A2, [g.xh, 1, g.A2, [g.yh, 1, Kob, g.Bh, 2, Eob, g.Bh, 3, Iob, g.Bh], 2, Lob, [g.zh, 1, Dob, g.Ah, 2, Bob, g.Ah, 3, Mob, Nob, g.Ah]]],
        Hlb = {
            "\x00": "\\0",
            "\b": "\\b",
            "\f": "\\f",
            "\n": "\\n",
            "\r": "\\r",
            "\t": "\\t",
            "\v": "\\x0B",
            '"': '\\"',
            "\\": "\\\\",
            "<": "\\u003C"
        },
        P8 = {
            "'": "\\'"
        },
        Ojb = {
            ega: "atp",
            oYa: "ska",
            uUa: "que",
            wLa: "mus",
            nYa: "sus",
            Kxa: "dsp",
            UVa: "seq",
            aKa: "mic",
            pqa: "dpa",
            rha: "cds",
            lLa: "mlm",
            kqa: "dsdtr",
            zMa: "ntb"
        },
        Pjb = {
            r_: "u",
            CLASSIC: "cl",
            VZ: "k",
            MX: "i",
            wX: "cr",
            d_: "m",
            GX: "g",
            GQ: "up"
        };
    c8.prototype.equals = function(a) {
        return a ? this.id == a.id : !1
    };
    var k8, $jb = "",
        okb = ikb("loadCastFramework") || ikb("loadCastApplicationFramework"),
        rkb = ["pkedcjkdefgpdelpbcmbmeomcjbeemfm", "enhhojjnijigcajfphajepfemndkmdlo"];
    g.Ra(n8, g.C);
    g.k = n8.prototype;
    g.k.mY = function(a) {
        this.C = arguments;
        this.j = !1;
        this.Fc ? this.B = g.Qa() + this.wi : this.Fc = g.sf(this.D, this.wi)
    };
    g.k.stop = function() {
        this.Fc && (g.Da.clearTimeout(this.Fc), this.Fc = null);
        this.B = null;
        this.j = !1;
        this.C = []
    };
    g.k.pause = function() {
        ++this.u
    };
    g.k.resume = function() {
        this.u && (--this.u, !this.u && this.j && (this.j = !1, this.I.apply(null, this.C)))
    };
    g.k.ra = function() {
        this.stop();
        n8.xf.ra.call(this)
    };
    g.k.nY = function() {
        this.Fc && (g.Da.clearTimeout(this.Fc), this.Fc = null);
        this.B ? (this.Fc = g.sf(this.D, this.B - g.Qa()), this.B = null) : this.u ? this.j = !0 : (this.j = !1, this.I.apply(null, this.C))
    };
    g.w(o8, g.C);
    g.k = o8.prototype;
    g.k.QH = function(a) {
        this.B = arguments;
        this.Fc || this.u ? this.j = !0 : Dkb(this)
    };
    g.k.stop = function() {
        this.Fc && (g.Da.clearTimeout(this.Fc), this.Fc = null, this.j = !1, this.B = null)
    };
    g.k.pause = function() {
        this.u++
    };
    g.k.resume = function() {
        this.u--;
        this.u || !this.j || this.Fc || (this.j = !1, Dkb(this))
    };
    g.k.ra = function() {
        g.C.prototype.ra.call(this);
        this.stop()
    };
    p8.prototype.stringify = function(a) {
        return g.Da.JSON.stringify(a, void 0)
    };
    p8.prototype.parse = function(a) {
        return g.Da.JSON.parse(a, void 0)
    };
    g.Ra(Ekb, g.cb);
    g.Ra(Fkb, g.cb);
    var Gkb = null;
    g.Ra(Ikb, g.cb);
    g.Ra(Jkb, g.cb);
    g.Ra(Kkb, g.cb);
    Lkb.prototype.info = function() {};
    Lkb.prototype.warning = function() {};
    var Skb = {},
        v8 = {};
    g.k = t8.prototype;
    g.k.setTimeout = function(a) {
        this.Gb = a
    };
    g.k.qY = function(a) {
        a = a.target;
        var b = this.Ya;
        b && 3 == g.ei(a) ? b.QH() : this.oP(a)
    };
    g.k.oP = function(a) {
        try {
            if (a == this.j) a: {
                var b = g.ei(this.j),
                    c = this.j.u,
                    d = this.j.getStatus();
                if (!(3 > b) && (3 != b || g.eI || this.j && (this.u.u || g.gi(this.j) || g.hi(this.j)))) {
                    this.Ka || 4 != b || 7 == c || (8 == c || 0 >= d ? q8(3) : q8(2));
                    y8(this);
                    var e = this.j.getStatus();
                    this.Rb = e;
                    b: if (Qkb(this)) {
                        var f = g.hi(this.j);
                        a = "";
                        var h = f.length,
                            l = 4 == g.ei(this.j);
                        if (!this.u.B) {
                            if ("undefined" === typeof TextDecoder) {
                                w8(this);
                                x8(this);
                                var m = "";
                                break b
                            }
                            this.u.B = new g.Da.TextDecoder
                        }
                        for (c = 0; c < h; c++) this.u.u = !0, a += this.u.B.decode(f[c], {
                            stream: l &&
                                c == h - 1
                        });
                        f.splice(0, h);
                        this.u.j += a;
                        this.ea = 0;
                        m = this.u.j
                    } else m = g.gi(this.j);
                    if (this.B = 200 == e) {
                        if (this.hc && !this.Va) {
                            b: {
                                if (this.j) {
                                    var n = g.ii(this.j, "X-HTTP-Initial-Response");
                                    if (n && !g.Kb(n)) {
                                        var p = n;
                                        break b
                                    }
                                }
                                p = null
                            }
                            if (e = p) this.Va = !0,
                            Tkb(this, e);
                            else {
                                this.B = !1;
                                this.I = 3;
                                r8(12);
                                w8(this);
                                x8(this);
                                break a
                            }
                        }
                        this.Ba ? (Ukb(this, b, m), g.eI && this.B && 3 == b && (this.gb.Pa(this.ob, "tick", this.pY), this.ob.start())) : Tkb(this, m);
                        4 == b && w8(this);
                        this.B && !this.Ka && (4 == b ? Wkb(this.D, this) : (this.B = !1, u8(this)))
                    } else g.bfa(this.j),
                        400 == e && 0 < m.indexOf("Unknown SID") ? (this.I = 3, r8(12)) : (this.I = 0, r8(13)), w8(this), x8(this)
                }
            }
        } catch (q) {} finally {}
    };
    g.k.pY = function() {
        if (this.j) {
            var a = g.ei(this.j),
                b = g.gi(this.j);
            this.ea < b.length && (y8(this), Ukb(this, a, b), this.B && 4 != a && u8(this))
        }
    };
    g.k.cancel = function() {
        this.Ka = !0;
        w8(this)
    };
    g.k.oY = function() {
        this.Z = null;
        var a = Date.now();
        0 <= a - this.Tb ? (2 != this.Qa && (q8(3), r8(17)), w8(this), this.I = 2, x8(this)) : Vkb(this, this.Tb - a)
    };
    g.k.getLastError = function() {
        return this.I
    };
    g.k.DK = function() {
        return this.j
    };
    elb.prototype.cancel = function() {
        this.B = glb(this);
        if (this.u) this.u.cancel(), this.u = null;
        else if (this.j && 0 !== this.j.size) {
            for (var a = g.t(this.j.values()), b = a.next(); !b.done; b = a.next()) b.value.cancel();
            this.j.clear()
        }
    };
    g.k = klb.prototype;
    g.k.pP = 8;
    g.k.hh = 1;
    g.k.connect = function(a, b, c, d) {
        r8(0);
        this.Bc = a;
        this.Ka = b || {};
        c && void 0 !== d && (this.Ka.OSID = c, this.Ka.OAID = d);
        this.ob = this.Hc;
        this.Ma = alb(this, null, this.Bc);
        C8(this)
    };
    g.k.disconnect = function() {
        mlb(this);
        if (3 == this.hh) {
            var a = this.Ya++,
                b = this.Ma.clone();
            g.zj(b, "SID", this.C);
            g.zj(b, "RID", a);
            g.zj(b, "TYPE", "terminate");
            F8(this, b);
            a = new t8(this, this.C, a);
            a.Qa = 2;
            a.J = Z7(b.clone());
            b = !1;
            g.Da.navigator && g.Da.navigator.sendBeacon && (b = g.Da.navigator.sendBeacon(a.J.toString(), ""));
            !b && g.Da.Image && ((new Image).src = a.J, b = !0);
            b || (a.j = Pkb(a.D, null), a.j.send(a.J));
            a.ya = Date.now();
            u8(a)
        }
        slb(this)
    };
    g.k.Jg = function() {
        return 0 == this.hh
    };
    g.k.getState = function() {
        return this.hh
    };
    g.k.rP = function(a) {
        if (this.I)
            if (this.I = null, 1 == this.hh) {
                if (!a) {
                    this.Ya = Math.floor(1E5 * Math.random());
                    a = this.Ya++;
                    var b = new t8(this, "", a),
                        c = this.Z;
                    this.Tb && (c ? (c = g.Xc(c), g.Zc(c, this.Tb)) : c = this.Tb);
                    null !== this.J || this.wb || (b.Ma = c, c = null);
                    var d;
                    if (this.Gb) a: {
                        for (var e = d = 0; e < this.B.length; e++) {
                            b: {
                                var f = this.B[e];
                                if ("__data__" in f.map && (f = f.map.__data__, "string" === typeof f)) {
                                    f = f.length;
                                    break b
                                }
                                f = void 0
                            }
                            if (void 0 === f) break;d += f;
                            if (4096 < d) {
                                d = e;
                                break a
                            }
                            if (4096 === d || e === this.B.length - 1) {
                                d = e + 1;
                                break a
                            }
                        }
                        d =
                        1E3
                    }
                    else d = 1E3;
                    d = plb(this, b, d);
                    e = this.Ma.clone();
                    g.zj(e, "RID", a);
                    g.zj(e, "CVER", 22);
                    this.Ba && g.zj(e, "X-HTTP-Session-Id", this.Ba);
                    F8(this, e);
                    c && (this.wb ? d = "headers=" + g.me(g.Dga(c)) + "&" + d : this.J && g.Dj(e, this.J, c));
                    $kb(this.u, b);
                    this.Uf && g.zj(e, "TYPE", "init");
                    this.Gb ? (g.zj(e, "$req", d), g.zj(e, "SID", "null"), b.hc = !0, Okb(b, e, null)) : Okb(b, e, d);
                    this.hh = 2
                }
            } else 3 == this.hh && (a ? qlb(this, a) : 0 == this.B.length || flb(this.u) || qlb(this))
    };
    g.k.qP = function() {
        this.T = null;
        rlb(this);
        if (this.Nc && !(this.gb || null == this.j || 0 >= this.Vd)) {
            var a = 2 * this.Vd;
            this.Aa = s8((0, g.Oa)(this.A3, this), a)
        }
    };
    g.k.A3 = function() {
        this.Aa && (this.Aa = null, this.ob = !1, this.gb = !0, r8(10), A8(this), rlb(this))
    };
    g.k.gM = function(a) {
        this.j == a && this.Nc && !this.gb && (llb(this), this.gb = !0, r8(11))
    };
    g.k.rY = function() {
        null != this.ea && (this.ea = null, A8(this), Ykb(this), r8(19))
    };
    g.k.e7 = function(a) {
        a ? r8(2) : r8(1)
    };
    g.k.isActive = function() {
        return !!this.D && this.D.isActive(this)
    };
    g.k = ulb.prototype;
    g.k.vP = function() {};
    g.k.uP = function() {};
    g.k.tP = function() {};
    g.k.sP = function() {};
    g.k.isActive = function() {
        return !0
    };
    g.k.sY = function() {};
    g.Ra(H8, g.nd);
    H8.prototype.open = function() {
        this.j.D = this.C;
        this.J && (this.j.Qa = !0);
        this.j.connect(this.I, this.u || void 0)
    };
    H8.prototype.close = function() {
        this.j.disconnect()
    };
    H8.prototype.send = function(a) {
        var b = this.j;
        if ("string" === typeof a) {
            var c = {};
            c.__data__ = a;
            a = c
        } else this.D && (c = {}, c.__data__ = g.Ih(a), a = c);
        b.B.push(new dlb(b.rf++, a));
        3 == b.hh && C8(b)
    };
    H8.prototype.ra = function() {
        this.j.D = null;
        delete this.C;
        this.j.disconnect();
        delete this.j;
        H8.xf.ra.call(this)
    };
    g.Ra(wlb, Ekb);
    g.Ra(xlb, Fkb);
    g.Ra(G8, ulb);
    G8.prototype.vP = function() {
        this.j.dispatchEvent("m")
    };
    G8.prototype.uP = function(a) {
        this.j.dispatchEvent(new wlb(a))
    };
    G8.prototype.tP = function(a) {
        this.j.dispatchEvent(new xlb(a))
    };
    G8.prototype.sP = function() {
        this.j.dispatchEvent("n")
    };
    var J8 = new g.nd;
    g.w(Alb, g.cb);
    g.k = L8.prototype;
    g.k.vt = null;
    g.k.fp = !1;
    g.k.qw = null;
    g.k.SH = null;
    g.k.ow = null;
    g.k.pw = null;
    g.k.Iq = null;
    g.k.Kq = null;
    g.k.wt = null;
    g.k.Ji = null;
    g.k.tD = 0;
    g.k.cn = null;
    g.k.sD = null;
    g.k.Jq = null;
    g.k.Iz = -1;
    g.k.MV = !0;
    g.k.ut = !1;
    g.k.RH = 0;
    g.k.rD = null;
    var Flb = {},
        Elb = {};
    g.k = L8.prototype;
    g.k.setTimeout = function(a) {
        this.u = a
    };
    g.k.uY = function(a) {
        a = a.target;
        var b = this.rD;
        b && 3 == g.ei(a) ? b.QH() : this.wP(a)
    };
    g.k.wP = function(a) {
        try {
            if (a == this.Ji) a: {
                var b = g.ei(this.Ji),
                    c = this.Ji.u,
                    d = this.Ji.getStatus();
                if (g.Fe && !g.Bc(10) || g.Cc && !g.Ac("420+")) {
                    if (4 > b) break a
                } else if (3 > b || 3 == b && !g.gi(this.Ji)) break a;this.ut || 4 != b || 7 == c || (8 == c || 0 >= d ? this.j.Mm(3) : this.j.Mm(2));Klb(this);
                var e = this.Ji.getStatus();this.Iz = e;
                var f = g.gi(this.Ji);
                if (this.fp = 200 == e) {
                    4 == b && N8(this);
                    if (this.Ba) {
                        for (a = !0; !this.ut && this.tD < f.length;) {
                            var h = Glb(this, f);
                            if (h == Elb) {
                                4 == b && (this.Jq = 4, K8(15), a = !1);
                                break
                            } else if (h == Flb) {
                                this.Jq = 4;
                                K8(16);
                                a = !1;
                                break
                            } else Llb(this, h)
                        }
                        4 == b && 0 == f.length && (this.Jq = 1, K8(17), a = !1);
                        this.fp = this.fp && a;
                        a || (N8(this), O8(this))
                    } else Llb(this, f);
                    this.fp && !this.ut && (4 == b ? this.j.uD(this) : (this.fp = !1, M8(this)))
                } else 400 == e && 0 < f.indexOf("Unknown SID") ? (this.Jq = 3, K8(13)) : (this.Jq = 0, K8(14)),
                N8(this),
                O8(this)
            }
        } catch (l) {} finally {}
    };
    g.k.I5 = function(a) {
        I8((0, g.Oa)(this.H5, this, a), 0)
    };
    g.k.H5 = function(a) {
        this.ut || (Klb(this), Llb(this, a), M8(this))
    };
    g.k.PU = function(a) {
        I8((0, g.Oa)(this.G5, this, a), 0)
    };
    g.k.G5 = function(a) {
        this.ut || (N8(this), this.fp = a, this.j.uD(this), this.j.Mm(4))
    };
    g.k.cancel = function() {
        this.ut = !0;
        N8(this)
    };
    g.k.tY = function() {
        this.qw = null;
        var a = Date.now();
        0 <= a - this.SH ? (2 != this.pw && this.j.Mm(3), N8(this), this.Jq = 2, K8(18), O8(this)) : Jlb(this, this.SH - a)
    };
    g.k.getLastError = function() {
        return this.Jq
    };
    g.k = Olb.prototype;
    g.k.UH = null;
    g.k.jj = null;
    g.k.zG = !1;
    g.k.cW = null;
    g.k.AE = null;
    g.k.yL = null;
    g.k.VH = null;
    g.k.Yk = null;
    g.k.gp = -1;
    g.k.Jz = null;
    g.k.fA = null;
    g.k.connect = function(a) {
        this.VH = a;
        a = R8(this.j, null, this.VH);
        K8(3);
        this.cW = Date.now();
        var b = this.j.T;
        null != b ? (this.Jz = b[0], (this.fA = b[1]) ? (this.Yk = 1, Plb(this)) : (this.Yk = 2, Qlb(this))) : ($7(a, "MODE", "init"), this.jj = new L8(this), this.jj.vt = this.UH, Dlb(this.jj, a, !1, null, !0), this.Yk = 0)
    };
    g.k.U_ = function(a) {
        if (a) this.Yk = 2, Qlb(this);
        else {
            K8(4);
            var b = this.j;
            b.qn = b.Yq.gp;
            V8(b, 9)
        }
        a && this.Mm(2)
    };
    g.k.TH = function(a) {
        return this.j.TH(a)
    };
    g.k.abort = function() {
        this.jj && (this.jj.cancel(), this.jj = null);
        this.gp = -1
    };
    g.k.Jg = function() {
        return !1
    };
    g.k.xP = function(a, b) {
        this.gp = a.Iz;
        if (0 == this.Yk)
            if (b) {
                try {
                    var c = this.u.parse(b)
                } catch (d) {
                    a = this.j;
                    a.qn = this.gp;
                    V8(a, 2);
                    return
                }
                this.Jz = c[0];
                this.fA = c[1]
            } else a = this.j, a.qn = this.gp, V8(a, 2);
        else if (2 == this.Yk)
            if (this.zG) K8(7), this.yL = Date.now();
            else if ("11111" == b) {
            if (K8(6), this.zG = !0, this.AE = Date.now(), a = this.AE - this.cW, !g.Fe || g.Bc(10) || 500 > a) this.gp = 200, this.jj.cancel(), K8(12), S8(this.j, this, !0)
        } else K8(8), this.AE = this.yL = Date.now(), this.zG = !1
    };
    g.k.uD = function() {
        this.gp = this.jj.Iz;
        if (this.jj.fp) 0 == this.Yk ? this.fA ? (this.Yk = 1, Plb(this)) : (this.Yk = 2, Qlb(this)) : 2 == this.Yk && ((!g.Fe || g.Bc(10) ? !this.zG : 200 > this.yL - this.AE) ? (K8(11), S8(this.j, this, !1)) : (K8(12), S8(this.j, this, !0)));
        else {
            0 == this.Yk ? K8(9) : 2 == this.Yk && K8(10);
            var a = this.j;
            this.jj.getLastError();
            a.qn = this.gp;
            V8(a, 2)
        }
    };
    g.k.Kz = function() {
        return this.j.Kz()
    };
    g.k.isActive = function() {
        return this.j.isActive()
    };
    g.k.Mm = function(a) {
        this.j.Mm(a)
    };
    g.k = Rlb.prototype;
    g.k.pn = null;
    g.k.Lz = null;
    g.k.vj = null;
    g.k.rg = null;
    g.k.WH = null;
    g.k.vD = null;
    g.k.yP = null;
    g.k.wD = null;
    g.k.Mz = 0;
    g.k.wY = 0;
    g.k.Wh = null;
    g.k.Lq = null;
    g.k.hp = null;
    g.k.zt = null;
    g.k.Yq = null;
    g.k.lH = null;
    g.k.xw = -1;
    g.k.zP = -1;
    g.k.qn = -1;
    g.k.ww = 0;
    g.k.uw = 0;
    g.k.xt = 8;
    g.Ra(Tlb, g.cb);
    g.Ra(Ulb, g.cb);
    g.k = Rlb.prototype;
    g.k.connect = function(a, b, c, d, e) {
        K8(0);
        this.WH = b;
        this.Lz = c || {};
        d && void 0 !== e && (this.Lz.OSID = d, this.Lz.OAID = e);
        this.J ? (I8((0, g.Oa)(this.wR, this, a), 100), Wlb(this)) : this.wR(a)
    };
    g.k.disconnect = function() {
        Xlb(this);
        if (3 == this.j) {
            var a = this.Mz++,
                b = this.vD.clone();
            g.zj(b, "SID", this.C);
            g.zj(b, "RID", a);
            g.zj(b, "TYPE", "terminate");
            U8(this, b);
            a = new L8(this, this.C, a);
            a.pw = 2;
            a.Iq = Z7(b.clone());
            (new Image).src = a.Iq.toString();
            a.ow = Date.now();
            M8(a)
        }
        gmb(this)
    };
    g.k.wR = function(a) {
        this.Yq = new Olb(this);
        this.Yq.UH = this.pn;
        this.Yq.u = this.D;
        this.Yq.connect(a)
    };
    g.k.Jg = function() {
        return 0 == this.j
    };
    g.k.getState = function() {
        return this.j
    };
    g.k.BP = function(a) {
        this.Lq = null;
        bmb(this, a)
    };
    g.k.AP = function() {
        this.hp = null;
        this.rg = new L8(this, this.C, "rpc", this.I);
        this.rg.vt = this.pn;
        this.rg.RH = 0;
        var a = this.yP.clone();
        g.zj(a, "RID", "rpc");
        g.zj(a, "SID", this.C);
        g.zj(a, "CI", this.lH ? "0" : "1");
        g.zj(a, "AID", this.xw);
        U8(this, a);
        if (!g.Fe || g.Bc(10)) g.zj(a, "TYPE", "xmlhttp"), Dlb(this.rg, a, !0, this.wD, !1);
        else {
            g.zj(a, "TYPE", "html");
            var b = this.rg,
                c = !!this.wD;
            b.pw = 3;
            b.Iq = Z7(a.clone());
            Ilb(b, c)
        }
    };
    g.k.xP = function(a, b) {
        if (0 != this.j && (this.rg == a || this.vj == a))
            if (this.qn = a.Iz, this.vj == a && 3 == this.j)
                if (7 < this.xt) {
                    try {
                        var c = this.D.parse(b)
                    } catch (d) {
                        c = null
                    }
                    if (Array.isArray(c) && 3 == c.length)
                        if (a = c, 0 == a[0]) a: {
                            if (!this.hp) {
                                if (this.rg)
                                    if (this.rg.ow + 3E3 < this.vj.ow) T8(this), this.rg.cancel(), this.rg = null;
                                    else break a;
                                emb(this);
                                K8(19)
                            }
                        }
                    else this.zP = a[1], 0 < this.zP - this.xw && 37500 > a[2] && this.lH && 0 == this.uw && !this.zt && (this.zt = I8((0, g.Oa)(this.xY, this), 6E3));
                    else V8(this, 11)
                } else null != b && V8(this, 11);
        else if (this.rg ==
            a && T8(this), !g.Kb(b))
            for (a = this.D.parse(b), b = 0; b < a.length; b++) c = a[b], this.xw = c[0], c = c[1], 2 == this.j ? "c" == c[0] ? (this.C = c[1], this.wD = c[2], c = c[3], null != c ? this.xt = c : this.xt = 6, this.j = 3, this.Wh && this.Wh.EP(), this.yP = R8(this, this.Kz() ? this.wD : null, this.WH), cmb(this)) : "stop" == c[0] && V8(this, 7) : 3 == this.j && ("stop" == c[0] ? V8(this, 7) : "noop" != c[0] && this.Wh && this.Wh.DP(c), this.uw = 0)
    };
    g.k.xY = function() {
        null != this.zt && (this.zt = null, this.rg.cancel(), this.rg = null, emb(this), K8(20))
    };
    g.k.uD = function(a) {
        if (this.rg == a) {
            T8(this);
            this.rg = null;
            var b = 2
        } else if (this.vj == a) this.vj = null, b = 1;
        else return;
        this.qn = a.Iz;
        if (0 != this.j)
            if (a.fp)
                if (1 == b) {
                    b = Date.now() - a.ow;
                    var c = J8;
                    c.dispatchEvent(new Tlb(c, a.wt ? a.wt.length : 0, b, this.ww));
                    Vlb(this);
                    this.B.length = 0
                } else cmb(this);
        else {
            c = a.getLastError();
            var d;
            if (!(d = 3 == c || 7 == c || 0 == c && 0 < this.qn)) {
                if (d = 1 == b) this.vj || this.Lq || 1 == this.j || 2 <= this.ww ? d = !1 : (this.Lq = I8((0, g.Oa)(this.BP, this, a), dmb(this, this.ww)), this.ww++, d = !0);
                d = !(d || 2 == b && emb(this))
            }
            if (d) switch (c) {
                case 1:
                    V8(this,
                        5);
                    break;
                case 4:
                    V8(this, 10);
                    break;
                case 3:
                    V8(this, 6);
                    break;
                case 7:
                    V8(this, 12);
                    break;
                default:
                    V8(this, 2)
            }
        }
    };
    g.k.vY = function(a) {
        if (!g.jb(arguments, this.j)) throw Error("Unexpected channel state: " + this.j);
    };
    g.k.d7 = function(a) {
        a ? K8(2) : (K8(1), fmb(this, 8))
    };
    g.k.TH = function(a) {
        if (a) throw Error("Can't create secondary domain capable XhrIo object.");
        a = new g.bi;
        a.J = !1;
        return a
    };
    g.k.isActive = function() {
        return !!this.Wh && this.Wh.isActive(this)
    };
    g.k.Mm = function(a) {
        var b = J8;
        b.dispatchEvent(new Ulb(b, a))
    };
    g.k.Kz = function() {
        return !(!g.Fe || g.Bc(10))
    };
    g.k = hmb.prototype;
    g.k.EP = function() {};
    g.k.DP = function() {};
    g.k.CP = function() {};
    g.k.XH = function() {};
    g.k.FP = function() {
        return {}
    };
    g.k.isActive = function() {
        return !0
    };
    g.k = imb.prototype;
    g.k.isEmpty = function() {
        return 0 === this.j.length && 0 === this.u.length
    };
    g.k.clear = function() {
        this.j = [];
        this.u = []
    };
    g.k.contains = function(a) {
        return g.jb(this.j, a) || g.jb(this.u, a)
    };
    g.k.remove = function(a) {
        var b = this.j;
        var c = (0, g.K4a)(b, a);
        0 <= c ? (g.ob(b, c), b = !0) : b = !1;
        return b || g.pb(this.u, a)
    };
    g.k.vl = function() {
        for (var a = [], b = this.j.length - 1; 0 <= b; --b) a.push(this.j[b]);
        var c = this.u.length;
        for (b = 0; b < c; ++b) a.push(this.u[b]);
        return a
    };
    g.w(jmb, g.cb);
    g.w(kmb, g.cb);
    g.Ra(W8, g.C);
    g.k = W8.prototype;
    g.k.A5 = function() {
        this.wi = Math.min(3E5, 2 * this.wi);
        this.B();
        this.u && this.start()
    };
    g.k.start = function() {
        var a = this.wi + 15E3 * Math.random();
        g.Un(this.j, a);
        this.u = Date.now() + a
    };
    g.k.stop = function() {
        this.j.stop();
        this.u = 0
    };
    g.k.isActive = function() {
        return this.j.isActive()
    };
    g.k.reset = function() {
        this.j.stop();
        this.wi = 5E3
    };
    mmb.prototype.flush = function(a, b) {
        a = void 0 === a ? [] : a;
        b = void 0 === b ? !1 : b;
        if (g.wv("enable_client_streamz_web")) {
            a = g.t(a);
            for (var c = a.next(); !c.done; c = a.next()) c = g.vea(c.value), c = {
                serializedIncrementBatch: g.Cf(g.qh(c, Pob))
            }, g.hx("streamzIncremented", c, {
                sendIsolatedPayload: b
            })
        }
    };
    var X8;
    g.Ra(nmb, hmb);
    g.k = nmb.prototype;
    g.k.subscribe = function(a, b, c) {
        return this.B.subscribe(a, b, c)
    };
    g.k.unsubscribe = function(a, b, c) {
        return this.B.unsubscribe(a, b, c)
    };
    g.k.Ah = function(a) {
        return this.B.Ah(a)
    };
    g.k.ma = function(a, b) {
        return this.B.ma.apply(this.B, arguments)
    };
    g.k.dispose = function() {
        this.ea || (this.ea = !0, g.$a(this.B), this.disconnect(), g.$a(this.u), this.u = null, this.oa = function() {
            return ""
        })
    };
    g.k.isDisposed = function() {
        return this.ea
    };
    g.k.connect = function(a, b, c) {
        if (!this.j || 2 != this.j.getState()) {
            this.Z = "";
            this.u.stop();
            this.I = a || null;
            this.D = b || 0;
            a = this.ya + "/test";
            b = this.ya + "/bind";
            var d = new Rlb(c ? c.firstTestResults : null, c ? c.secondTestResults : null, this.Qa),
                e = this.j;
            e && (e.Wh = null);
            d.Wh = this;
            this.j = d;
            omb(this);
            if (this.j) {
                d = g.L("ID_TOKEN");
                var f = this.j.pn || {};
                d ? f["x-youtube-identity-token"] = d : delete f["x-youtube-identity-token"];
                this.j.pn = f
            }
            e ? (3 != e.getState() && 0 == Zlb(e) || e.getState(), this.j.connect(a, b, this.J, e.C, e.xw)) : c ? this.j.connect(a,
                b, this.J, c.sessionId, c.arrayId) : this.j.connect(a, b, this.J)
        }
    };
    g.k.disconnect = function(a) {
        this.T = a || 0;
        this.u.stop();
        omb(this);
        this.j && (3 == this.j.getState() && bmb(this.j), this.j.disconnect());
        this.T = 0
    };
    g.k.sendMessage = function(a, b) {
        a = {
            _sc: a
        };
        b && g.Zc(a, b);
        this.u.isActive() || 2 == (this.j ? this.j.getState() : 0) ? this.C.push(a) : this.Nx() && (omb(this), Ylb(this.j, a))
    };
    g.k.EP = function() {
        this.u.reset();
        this.I = null;
        this.D = 0;
        if (this.C.length) {
            var a = this.C;
            this.C = [];
            for (var b = 0, c = a.length; b < c; ++b) Ylb(this.j, a[b])
        }
        this.ma("handlerOpened");
        ukb(this.Ma, "BROWSER_CHANNEL")
    };
    g.k.CP = function(a) {
        var b = 2 == a && 401 == this.j.qn;
        4 == a || b || this.u.start();
        this.ma("handlerError", a, b);
        Akb(this.Ba, "BROWSER_CHANNEL")
    };
    g.k.XH = function(a, b) {
        if (!this.u.isActive()) this.ma("handlerClosed");
        else if (b)
            for (var c = 0, d = b.length; c < d; ++c) {
                var e = b[c].map;
                e && this.C.push(e)
            }
        wkb(this.Aa, "BROWSER_CHANNEL");
        a && this.Ya.j.aI("/client_streamz/youtube/living_room/mdx/browser_channel/pending_maps", a.length);
        b && this.Wa.j.aI("/client_streamz/youtube/living_room/mdx/browser_channel/undelivered_maps", b.length)
    };
    g.k.FP = function() {
        var a = {
            v: 2
        };
        this.Z && (a.gsessionid = this.Z);
        0 != this.D && (a.ui = "" + this.D);
        0 != this.T && (a.ui = "" + this.T);
        this.I && g.Zc(a, this.I);
        return a
    };
    g.k.DP = function(a) {
        "S" == a[0] ? this.Z = a[1] : "gracefulReconnect" == a[0] ? (this.u.start(), this.j.disconnect()) : this.ma("handlerMessage", new lmb(a[0], a[1]));
        ykb(this.Ka, "BROWSER_CHANNEL")
    };
    g.k.Nx = function() {
        return !!this.j && 3 == this.j.getState()
    };
    g.k.xq = function(a) {
        (this.J.loungeIdToken = a) || this.u.stop();
        if (this.Va && this.j) {
            var b = this.j.pn || {};
            a ? b["X-YouTube-LoungeId-Token"] = a : delete b["X-YouTube-LoungeId-Token"];
            this.j.pn = b
        }
    };
    g.k.Dr = function() {
        return this.J.id
    };
    g.k.Mr = function() {
        return this.u.isActive() ? this.u.u - Date.now() : NaN
    };
    g.k.yv = function() {
        var a = this.u;
        g.Vn(a.j);
        a.start()
    };
    g.k.B6 = function() {
        this.u.isActive();
        0 == Zlb(this.j) && this.connect(this.I, this.D)
    };
    Y8.prototype.C = function(a, b, c, d) {
        b ? a(d) : a({
            text: c.responseText
        })
    };
    Y8.prototype.B = function(a, b) {
        a(Error("Request error: " + b.status))
    };
    Y8.prototype.D = function(a) {
        a(Error("request timed out"))
    };
    g.w(qmb, g.nd);
    g.k = qmb.prototype;
    g.k.connect = function(a, b, c) {
        this.qd.connect(a, b, c)
    };
    g.k.disconnect = function(a) {
        this.qd.disconnect(a)
    };
    g.k.yv = function() {
        this.qd.yv()
    };
    g.k.Dr = function() {
        return this.qd.Dr()
    };
    g.k.Mr = function() {
        return this.qd.Mr()
    };
    g.k.Nx = function() {
        return this.qd.Nx()
    };
    g.k.AY = function() {
        this.dispatchEvent("channelOpened");
        var a = this.qd,
            b = this.j;
        g.eB("yt-remote-session-browser-channel", {
            firstTestResults: [""],
            secondTestResults: !a.j.lH,
            sessionId: a.j.C,
            arrayId: a.j.xw
        });
        g.eB("yt-remote-session-screen-id", b);
        a = h8();
        b = i8();
        g.jb(a, b) || a.push(b);
        Zjb(a);
        akb()
    };
    g.k.yY = function() {
        this.dispatchEvent("channelClosed")
    };
    g.k.zY = function(a) {
        this.dispatchEvent(new jmb(a))
    };
    g.k.onError = function(a) {
        this.dispatchEvent(new kmb(a ? 1 : 0))
    };
    g.k.sendMessage = function(a, b) {
        this.qd.sendMessage(a, b)
    };
    g.k.xq = function(a) {
        this.qd.xq(a)
    };
    g.k.dispose = function() {
        this.qd.dispose()
    };
    g.k = rmb.prototype;
    g.k.connect = function(a, b) {
        a = void 0 === a ? {} : a;
        b = void 0 === b ? 0 : b;
        2 !== this.I && (this.B.stop(), this.T = a, this.J = b, tmb(this), (a = g.L("ID_TOKEN")) ? this.C["x-youtube-identity-token"] = a : delete this.C["x-youtube-identity-token"], this.j && (this.u.device = this.j.device, this.u.name = this.j.name, this.u.app = this.j.app, this.u.id = this.j.id, this.j.E2 && (this.u.mdxVersion = "" + this.j.E2), this.j.theme && (this.u.theme = this.j.theme), this.j.capabilities && (this.u.capabilities = this.j.capabilities), this.j.n0 && (this.u.cst = this.j.n0)),
            0 !== this.J ? this.u.ui = "" + this.J : delete this.u.ui, Object.assign(this.u, this.T), this.channel = new H8(this.pathPrefix, {
                R1: "gsessionid",
                I2: this.C,
                J2: this.u
            }), this.channel.open(), this.I = 2, smb(this))
    };
    g.k.disconnect = function(a) {
        this.Z = void 0 === a ? 0 : a;
        this.B.stop();
        tmb(this);
        this.channel && (0 !== this.Z ? this.u.ui = "" + this.Z : delete this.u.ui, this.channel.close());
        this.Z = 0
    };
    g.k.Mr = function() {
        return this.B.isActive() ? this.B.u - Date.now() : NaN
    };
    g.k.yv = function() {
        var a = this.B;
        g.Vn(a.j);
        a.start()
    };
    g.k.sendMessage = function(a, b) {
        this.channel && (tmb(this), a = Object.assign({}, {
            _sc: a
        }, b), this.channel.send(a))
    };
    g.k.xq = function(a) {
        a || this.B.stop();
        a ? this.C["X-YouTube-LoungeId-Token"] = a : delete this.C["X-YouTube-LoungeId-Token"]
    };
    g.k.Dr = function() {
        return this.j ? this.j.id : ""
    };
    g.k.ma = function(a) {
        return this.D.ma.apply(this.D, [a].concat(g.u(g.xa.apply(1, arguments))))
    };
    g.k.subscribe = function(a, b, c) {
        return this.D.subscribe(a, b, c)
    };
    g.k.unsubscribe = function(a, b, c) {
        return this.D.unsubscribe(a, b, c)
    };
    g.k.Ah = function(a) {
        return this.D.Ah(a)
    };
    g.k.dispose = function() {
        this.ea || (this.ea = !0, g.$a(this.D), this.disconnect(), g.$a(this.B), this.ya = function() {
            return ""
        })
    };
    g.k.isDisposed = function() {
        return this.ea
    };
    g.w(umb, g.nd);
    g.k = umb.prototype;
    g.k.connect = function(a, b) {
        this.j.connect(a, b)
    };
    g.k.disconnect = function(a) {
        this.j.disconnect(a)
    };
    g.k.yv = function() {
        this.j.yv()
    };
    g.k.Dr = function() {
        return this.j.Dr()
    };
    g.k.Mr = function() {
        return this.j.Mr()
    };
    g.k.Nx = function() {
        return 3 === this.j.I
    };
    g.k.DY = function() {
        this.dispatchEvent("channelOpened")
    };
    g.k.BY = function() {
        this.dispatchEvent("channelClosed")
    };
    g.k.CY = function(a) {
        this.dispatchEvent(new jmb(a))
    };
    g.k.onError = function() {
        this.dispatchEvent(new kmb(401 === this.j.yg ? 1 : 0))
    };
    g.k.sendMessage = function(a, b) {
        this.j.sendMessage(a, b)
    };
    g.k.xq = function(a) {
        this.j.xq(a)
    };
    g.k.dispose = function() {
        this.j.dispose()
    };
    var Cmb = Date.now(),
        $8 = null,
        d9 = Array(50),
        c9 = -1,
        e9 = !1;
    g.Ra(f9, g.QB);
    f9.prototype.hk = function() {
        return this.screens
    };
    f9.prototype.contains = function(a) {
        return !!Wjb(this.screens, a)
    };
    f9.prototype.get = function(a) {
        return a ? g8(this.screens, a) : null
    };
    f9.prototype.info = function(a) {
        a9(this.I, a)
    };
    g.w(Gmb, g.QB);
    g.k = Gmb.prototype;
    g.k.start = function() {
        !this.j && isNaN(this.Fc) && this.cV()
    };
    g.k.stop = function() {
        this.j && (this.j.abort(), this.j = null);
        isNaN(this.Fc) || (g.Tv(this.Fc), this.Fc = NaN)
    };
    g.k.ra = function() {
        this.stop();
        g.QB.prototype.ra.call(this)
    };
    g.k.cV = function() {
        this.Fc = NaN;
        this.j = g.Wv(Z8(this.B, "/pairing/get_screen"), {
            method: "POST",
            postParams: {
                pairing_code: this.J
            },
            timeout: 5E3,
            onSuccess: (0, g.Oa)(this.FY, this),
            onError: (0, g.Oa)(this.EY, this),
            onTimeout: (0, g.Oa)(this.GY, this)
        })
    };
    g.k.FY = function(a, b) {
        this.j = null;
        a = b.screen || {};
        a.dialId = this.C;
        a.name = this.I;
        b = -1;
        this.D && a.shortLivedLoungeToken && a.shortLivedLoungeToken.value && a.shortLivedLoungeToken.refreshIntervalMs && (a.screenIdType = "shortLived", a.loungeToken = a.shortLivedLoungeToken.value, b = a.shortLivedLoungeToken.refreshIntervalMs);
        this.ma("pairingComplete", new d8(a), b)
    };
    g.k.EY = function(a) {
        this.j = null;
        a.status && 404 == a.status ? this.u >= Qob.length ? this.ma("pairingFailed", Error("DIAL polling timed out")) : (a = Qob[this.u], this.Fc = g.Rv((0, g.Oa)(this.cV, this), a), this.u++) : this.ma("pairingFailed", Error("Server error " + a.status))
    };
    g.k.GY = function() {
        this.j = null;
        this.ma("pairingFailed", Error("Server not responding"))
    };
    var Qob = [2E3, 2E3, 1E3, 1E3, 1E3, 2E3, 2E3, 5E3, 5E3, 1E4];
    g.Ra(h9, f9);
    g.k = h9.prototype;
    g.k.start = function() {
        g9(this) && this.ma("screenChange");
        !g.fB("yt-remote-lounge-token-expiration") && Hmb(this);
        g.Tv(this.j);
        this.j = g.Rv((0, g.Oa)(this.start, this), 1E4)
    };
    g.k.add = function(a, b) {
        g9(this);
        Dmb(this, a);
        i9(this, !1);
        this.ma("screenChange");
        b(a);
        a.token || Hmb(this)
    };
    g.k.remove = function(a, b) {
        var c = g9(this);
        Fmb(this, a) && (i9(this, !1), c = !0);
        b(a);
        c && this.ma("screenChange")
    };
    g.k.kH = function(a, b, c, d) {
        var e = g9(this),
            f = this.get(a.id);
        f ? (f.name != b && (f.name = b, i9(this, !1), e = !0), c(a)) : d(Error("no such local screen."));
        e && this.ma("screenChange")
    };
    g.k.ra = function() {
        g.Tv(this.j);
        h9.xf.ra.call(this)
    };
    g.k.q1 = function(a) {
        g9(this);
        var b = this.screens.length;
        a = a && a.screens || [];
        for (var c = 0, d = a.length; c < d; ++c) {
            var e = a[c],
                f = this.get(e.screenId);
            f && (f.token = e.loungeToken, --b)
        }
        i9(this, !b);
        b && a9(this.I, "Missed " + b + " lounge tokens.")
    };
    g.k.o1 = function(a) {
        a9(this.I, "Requesting lounge tokens failed: " + a)
    };
    g.w(Jmb, g.QB);
    g.k = Jmb.prototype;
    g.k.start = function() {
        var a = parseInt(g.fB("yt-remote-fast-check-period") || "0", 10);
        (this.C = g.Qa() - 144E5 < a ? 0 : a) ? j9(this): (this.C = g.Qa() + 3E5, g.eB("yt-remote-fast-check-period", this.C), this.iN())
    };
    g.k.isEmpty = function() {
        return g.Tc(this.j)
    };
    g.k.update = function() {
        Imb("Updating availability on schedule.");
        var a = this.I(),
            b = g.Jc(this.j, function(c, d) {
                return c && !!g8(a, d)
            }, this);
        Mmb(this, b)
    };
    g.k.ra = function() {
        g.Tv(this.B);
        this.B = NaN;
        this.u && (this.u.abort(), this.u = null);
        g.QB.prototype.ra.call(this)
    };
    g.k.iN = function() {
        g.Tv(this.B);
        this.B = NaN;
        this.u && this.u.abort();
        var a = Nmb(this);
        if (Hjb(a)) {
            var b = Z8(this.D, "/pairing/get_screen_availability");
            this.u = pmb(this.D, b, {
                lounge_token: g.Oc(a).join(",")
            }, (0, g.Oa)(this.g5, this, a), (0, g.Oa)(this.f5, this))
        } else Mmb(this, {}), j9(this)
    };
    g.k.g5 = function(a, b) {
        this.u = null;
        var c = g.Oc(Nmb(this));
        if (g.Cb(c, g.Oc(a))) {
            b = b.screens || [];
            c = {};
            for (var d = b.length, e = 0; e < d; ++e) c[a[b[e].loungeToken]] = "online" == b[e].status;
            Mmb(this, c);
            j9(this)
        } else this.Kf("Changing Screen set during request."), this.iN()
    };
    g.k.f5 = function(a) {
        this.Kf("Screen availability failed: " + a);
        this.u = null;
        j9(this)
    };
    g.k.Kf = function(a) {
        a9("OnlineScreenService", a)
    };
    g.Ra(k9, f9);
    g.k = k9.prototype;
    g.k.start = function() {
        this.u.start();
        this.j.start();
        this.screens.length && (this.ma("screenChange"), this.j.isEmpty() || this.ma("onlineScreenChange"))
    };
    g.k.add = function(a, b, c) {
        this.u.add(a, b, c)
    };
    g.k.remove = function(a, b, c) {
        this.u.remove(a, b, c);
        this.j.update()
    };
    g.k.kH = function(a, b, c, d) {
        this.u.contains(a) ? this.u.kH(a, b, c, d) : (a = "Updating name of unknown screen: " + a.name, a9(this.I, a), d(Error(a)))
    };
    g.k.hk = function(a) {
        return a ? this.screens : g.rb(this.screens, g.pm(this.B, function(b) {
            return !this.contains(b)
        }, this))
    };
    g.k.GP = function() {
        return g.pm(this.hk(!0), function(a) {
            return !!this.j.j[a.id]
        }, this)
    };
    g.k.HP = function(a, b, c, d, e, f) {
        var h = this;
        this.info("getDialScreenByPairingCode " + a + " / " + b);
        var l = new Gmb(this.C, a, b, c, d);
        l.subscribe("pairingComplete", function(m, n) {
            g.$a(l);
            e(l9(h, m), n)
        });
        l.subscribe("pairingFailed", function(m) {
            g.$a(l);
            f(m)
        });
        l.start();
        return (0, g.Oa)(l.stop, l)
    };
    g.k.HY = function(a, b, c, d) {
        g.Wv(Z8(this.C, "/pairing/get_screen"), {
            method: "POST",
            postParams: {
                pairing_code: a
            },
            timeout: 5E3,
            onSuccess: (0, g.Oa)(function(e, f) {
                e = new d8(f.screen || {});
                if (!e.name || Rmb(this, e.name)) {
                    a: {
                        f = e.name;
                        for (var h = 2, l = b(f, h); Rmb(this, l);) {
                            h++;
                            if (20 < h) break a;
                            l = b(f, h)
                        }
                        f = l
                    }
                    e.name = f
                }
                c(l9(this, e))
            }, this),
            onError: (0, g.Oa)(function(e) {
                d(Error("pairing request failed: " + e.status))
            }, this),
            onTimeout: (0, g.Oa)(function() {
                d(Error("pairing request timed out."))
            }, this)
        })
    };
    g.k.ra = function() {
        g.$a(this.u);
        g.$a(this.j);
        k9.xf.ra.call(this)
    };
    g.k.C1 = function() {
        Tmb(this);
        this.ma("screenChange");
        this.j.update()
    };
    k9.prototype.dispose = k9.prototype.dispose;
    g.Ra(m9, g.QB);
    g.k = m9.prototype;
    g.k.getScreen = function() {
        return this.C
    };
    g.k.Wi = function(a) {
        this.isDisposed() || (a && (o9(this, "" + a), this.ma("sessionFailed")), this.C = null, this.ma("sessionScreen", null))
    };
    g.k.info = function(a) {
        a9(this.Ba, a)
    };
    g.k.IP = function() {
        return null
    };
    g.k.CN = function(a) {
        var b = this.j;
        a ? (b.displayStatus = new chrome.cast.ReceiverDisplayStatus(a, []), b.displayStatus.showStop = !0) : b.displayStatus = null;
        chrome.cast.setReceiverDisplayStatus(b, (0, g.Oa)(function() {
            this.info("Updated receiver status for " + b.friendlyName + ": " + a)
        }, this), (0, g.Oa)(function() {
            o9(this, "Failed to update receiver status for: " + b.friendlyName)
        }, this))
    };
    g.k.ra = function() {
        this.CN("");
        m9.xf.ra.call(this)
    };
    g.w(p9, m9);
    g.k = p9.prototype;
    g.k.BN = function(a) {
        if (this.u) {
            if (this.u == a) return;
            o9(this, "Overriding cast session with new session object");
            enb(this);
            this.ya = !1;
            this.Z = "unknown";
            this.u.removeUpdateListener(this.oa);
            this.u.removeMessageListener("urn:x-cast:com.google.youtube.mdx", this.Aa)
        }
        this.u = a;
        this.u.addUpdateListener(this.oa);
        this.u.addMessageListener("urn:x-cast:com.google.youtube.mdx", this.Aa);
        $mb(this, "getMdxSessionStatus")
    };
    g.k.Yx = function(a) {
        this.info("launchWithParams no-op for Cast: " + g.Ih(a))
    };
    g.k.stop = function() {
        this.u ? this.u.stop((0, g.Oa)(function() {
            this.Wi()
        }, this), (0, g.Oa)(function() {
            this.Wi(Error("Failed to stop receiver app."))
        }, this)) : this.Wi(Error("Stopping cast device without session."))
    };
    g.k.CN = function() {};
    g.k.ra = function() {
        this.info("disposeInternal");
        enb(this);
        this.u && (this.u.removeUpdateListener(this.oa), this.u.removeMessageListener("urn:x-cast:com.google.youtube.mdx", this.Aa));
        this.u = null;
        m9.prototype.ra.call(this)
    };
    g.k.T5 = function(a, b) {
        if (!this.isDisposed())
            if (b)
                if (b = a8(b), g.La(b)) switch (a = "" + b.type, b = b.data || {}, this.info("onYoutubeMessage_: " + a + " " + g.Ih(b)), a) {
                    case "mdxSessionStatus":
                        Xmb(this, b);
                        break;
                    case "loungeToken":
                        anb(this, b);
                        break;
                    default:
                        o9(this, "Unknown youtube message: " + a)
                } else o9(this, "Unable to parse message.");
                else o9(this, "No data in message.")
    };
    g.k.tS = function(a, b, c, d) {
        g.Tv(this.T);
        this.T = 0;
        Qmb(this.B, this.j.label, a, this.j.friendlyName, (0, g.Oa)(function(e) {
            e ? b(e) : 0 <= d ? (o9(this, "Screen " + a + " appears to be offline. " + d + " retries left."), this.T = g.Rv((0, g.Oa)(this.tS, this, a, b, c, d - 1), 300)) : c(Error("Unable to fetch screen."))
        }, this), c)
    };
    g.k.IP = function() {
        return this.u
    };
    g.k.IY = function(a) {
        this.isDisposed() || a || (o9(this, "Cast session died."), this.Wi())
    };
    g.w(q9, m9);
    g.k = q9.prototype;
    g.k.BN = function(a) {
        this.u = a;
        this.u.addUpdateListener(this.Ka)
    };
    g.k.Yx = function(a) {
        this.Ma = a;
        this.ea()
    };
    g.k.stop = function() {
        mnb(this);
        this.u ? this.u.stop((0, g.Oa)(this.Wi, this, null), (0, g.Oa)(this.Wi, this, "Failed to stop DIAL device.")) : this.Wi()
    };
    g.k.ra = function() {
        mnb(this);
        this.u && this.u.removeUpdateListener(this.Ka);
        this.u = null;
        m9.prototype.ra.call(this)
    };
    g.k.JY = function(a) {
        this.isDisposed() || a || (o9(this, "DIAL session died."), this.D(), this.D = function() {}, this.Wi())
    };
    g.w(t9, m9);
    t9.prototype.stop = function() {
        this.Wi()
    };
    t9.prototype.BN = function() {};
    t9.prototype.Yx = function() {
        g.Tv(this.u);
        this.u = NaN;
        var a = g8(this.B.hk(), this.j.label);
        a ? n9(this, a) : this.Wi(Error("No such screen"))
    };
    t9.prototype.ra = function() {
        g.Tv(this.u);
        this.u = NaN;
        m9.prototype.ra.call(this)
    };
    g.w(u9, g.QB);
    g.k = u9.prototype;
    g.k.init = function(a, b) {
        chrome.cast.timeout.requestSession = 3E4;
        var c = new chrome.cast.SessionRequest(this.T, [chrome.cast.Capability.AUDIO_OUT]);
        this.Z || (c.dialRequest = new chrome.cast.DialRequest("YouTube"));
        var d = chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED;
        a = a || this.I ? chrome.cast.DefaultActionPolicy.CAST_THIS_TAB : chrome.cast.DefaultActionPolicy.CREATE_SESSION;
        var e = (0, g.Oa)(this.R4, this);
        c = new chrome.cast.ApiConfig(c, (0, g.Oa)(this.LU, this), e, d, a);
        c.customDialLaunchCallback = (0, g.Oa)(this.N3, this);
        chrome.cast.initialize(c, (0, g.Oa)(function() {
            this.isDisposed() || (chrome.cast.addReceiverActionListener(this.D), zmb(), this.u.subscribe("onlineScreenChange", (0, g.Oa)(this.JP, this)), this.B = pnb(this), chrome.cast.setCustomReceivers(this.B, function() {}, (0, g.Oa)(function(f) {
                this.Kf("Failed to set initial custom receivers: " + g.Ih(f))
            }, this)), this.ma("yt-remote-cast2-availability-change", w9(this)), b(!0))
        }, this), (0, g.Oa)(function(f) {
            this.Kf("Failed to initialize API: " + g.Ih(f));
            b(!1)
        }, this))
    };
    g.k.G6 = function(a, b) {
        v9("Setting connected screen ID: " + a + " -> " + b);
        if (this.j) {
            var c = this.j.getScreen();
            if (!a || c && c.id != a) v9("Unsetting old screen status: " + this.j.j.friendlyName), x9(this, null)
        }
        if (a && b) {
            if (!this.j) {
                c = g8(this.u.hk(), a);
                if (!c) {
                    v9("setConnectedScreenStatus: Unknown screen.");
                    return
                }
                if ("shortLived" == c.idType) {
                    v9("setConnectedScreenStatus: Screen with id type to be short lived.");
                    return
                }
                a = nnb(this, c);
                a || (v9("setConnectedScreenStatus: Connected receiver not custom..."), a = new chrome.cast.Receiver(c.uuid ?
                    c.uuid : c.id, c.name), a.receiverType = chrome.cast.ReceiverType.CUSTOM, this.B.push(a), chrome.cast.setCustomReceivers(this.B, function() {}, (0, g.Oa)(function(d) {
                    this.Kf("Failed to set initial custom receivers: " + g.Ih(d))
                }, this)));
                v9("setConnectedScreenStatus: new active receiver: " + a.friendlyName);
                x9(this, new t9(this.u, a), !0)
            }
            this.j.CN(b)
        } else v9("setConnectedScreenStatus: no screen.")
    };
    g.k.H6 = function(a) {
        this.isDisposed() ? this.Kf("Setting connection data on disposed cast v2") : this.j ? this.j.Yx(a) : this.Kf("Setting connection data without a session")
    };
    g.k.LY = function() {
        this.isDisposed() ? this.Kf("Stopping session on disposed cast v2") : this.j ? (this.j.stop(), x9(this, null)) : v9("Stopping non-existing session")
    };
    g.k.requestSession = function() {
        chrome.cast.requestSession((0, g.Oa)(this.LU, this), (0, g.Oa)(this.j5, this))
    };
    g.k.ra = function() {
        this.u.unsubscribe("onlineScreenChange", (0, g.Oa)(this.JP, this));
        window.chrome && chrome.cast && chrome.cast.removeReceiverActionListener(this.D);
        var a = wmb,
            b = g.Ga("yt.mdx.remote.debug.handlers_");
        g.pb(b || [], a);
        g.$a(this.j);
        g.QB.prototype.ra.call(this)
    };
    g.k.Kf = function(a) {
        a9("Controller", a)
    };
    g.k.NU = function(a, b) {
        this.j == a && (b || x9(this, null), this.ma("yt-remote-cast2-session-change", b))
    };
    g.k.O4 = function(a, b) {
        if (!this.isDisposed())
            if (a) switch (a.friendlyName = chrome.cast.unescape(a.friendlyName), v9("onReceiverAction_ " + a.label + " / " + a.friendlyName + "-- " + b), b) {
                case chrome.cast.ReceiverAction.CAST:
                    if (this.j)
                        if (this.j.j.label != a.label) v9("onReceiverAction_: Stopping active receiver: " + this.j.j.friendlyName), this.j.stop();
                        else {
                            v9("onReceiverAction_: Casting to active receiver.");
                            this.j.getScreen() && this.ma("yt-remote-cast2-session-change", this.j.getScreen());
                            break
                        }
                    switch (a.receiverType) {
                        case chrome.cast.ReceiverType.CUSTOM:
                            x9(this,
                                new t9(this.u, a));
                            break;
                        case chrome.cast.ReceiverType.DIAL:
                            x9(this, new q9(this.u, a, this.C, this.config_));
                            break;
                        case chrome.cast.ReceiverType.CAST:
                            x9(this, new p9(this.u, a, this.config_));
                            break;
                        default:
                            this.Kf("Unknown receiver type: " + a.receiverType)
                    }
                    break;
                case chrome.cast.ReceiverAction.STOP:
                    this.j && this.j.j.label == a.label ? this.j.stop() : this.Kf("Stopping receiver w/o session: " + a.friendlyName)
            } else this.Kf("onReceiverAction_ called without receiver.")
    };
    g.k.N3 = function(a) {
        if (this.isDisposed()) return Promise.reject(Error("disposed"));
        var b = a.receiver;
        b.receiverType != chrome.cast.ReceiverType.DIAL && (this.Kf("Not DIAL receiver: " + b.friendlyName), b.receiverType = chrome.cast.ReceiverType.DIAL);
        var c = this.j ? this.j.j : null;
        if (!c || c.label != b.label) return this.Kf("Receiving DIAL launch request for non-clicked DIAL receiver: " + b.friendlyName), Promise.reject(Error("illegal DIAL launch"));
        if (c && c.label == b.label && c.receiverType != chrome.cast.ReceiverType.DIAL) {
            if (this.j.getScreen()) return v9("Reselecting dial screen."),
                this.ma("yt-remote-cast2-session-change", this.j.getScreen()), Promise.resolve(new chrome.cast.DialLaunchResponse(!1));
            this.Kf('Changing CAST intent from "' + c.receiverType + '" to "dial" for ' + b.friendlyName);
            x9(this, new q9(this.u, b, this.C, this.config_))
        }
        b = this.j;
        b.T = a;
        b.T.appState == chrome.cast.DialAppState.RUNNING ? (a = b.T.extraData || {}, c = a.screenId || null, r9(b) && a.loungeToken ? a.loungeTokenRefreshIntervalMs ? a = jnb(b, {
            name: b.j.friendlyName,
            screenId: a.screenId,
            loungeToken: a.loungeToken,
            dialId: b.T.receiver.label,
            screenIdType: "shortLived"
        }, a.loungeTokenRefreshIntervalMs) : (g.Bv(Error("No loungeTokenRefreshIntervalMs presents in additionalData: " + JSON.stringify(a) + ".")), a = knb(b, c)) : a = knb(b, c)) : a = hnb(b);
        return a
    };
    g.k.LU = function(a) {
        var b = this;
        if (!this.isDisposed() && !this.I) {
            v9("New cast session ID: " + a.sessionId);
            var c = a.receiver;
            if (c.receiverType != chrome.cast.ReceiverType.CUSTOM) {
                if (!this.j)
                    if (c.receiverType == chrome.cast.ReceiverType.CAST) v9("Got resumed cast session before resumed mdx connection."), c.friendlyName = chrome.cast.unescape(c.friendlyName), x9(this, new p9(this.u, c, this.config_), !0);
                    else {
                        this.Kf("Got non-cast session without previous mdx receiver event, or mdx resume.");
                        return
                    }
                var d = this.j.j,
                    e = g8(this.u.hk(),
                        d.label);
                e && e8(e, c.label) && d.receiverType != chrome.cast.ReceiverType.CAST && c.receiverType == chrome.cast.ReceiverType.CAST && (v9("onSessionEstablished_: manual to cast session change " + c.friendlyName), g.$a(this.j), this.j = new p9(this.u, c, this.config_), this.j.subscribe("sessionScreen", (0, g.Oa)(this.NU, this, this.j)), this.j.subscribe("sessionFailed", function() {
                    return onb(b, b.j)
                }), this.j.Yx(null));
                this.j.BN(a)
            }
        }
    };
    g.k.KY = function() {
        return this.j ? this.j.IP() : null
    };
    g.k.j5 = function(a) {
        this.isDisposed() || (this.Kf("Failed to estabilish a session: " + g.Ih(a)), a.code != chrome.cast.ErrorCode.CANCEL && x9(this, null), this.ma("yt-remote-cast2-session-failed"))
    };
    g.k.R4 = function(a) {
        v9("Receiver availability updated: " + a);
        if (!this.isDisposed()) {
            var b = w9(this);
            this.J = a == chrome.cast.ReceiverAvailability.AVAILABLE;
            w9(this) != b && this.ma("yt-remote-cast2-availability-change", w9(this))
        }
    };
    g.k.JP = function() {
        this.isDisposed() || (this.B = pnb(this), v9("Updating custom receivers: " + g.Ih(this.B)), chrome.cast.setCustomReceivers(this.B, function() {}, (0, g.Oa)(function() {
            this.Kf("Failed to set custom receivers.")
        }, this)), this.ma("yt-remote-cast2-availability-change", w9(this)))
    };
    u9.prototype.setLaunchParams = u9.prototype.H6;
    u9.prototype.setConnectedScreenStatus = u9.prototype.G6;
    u9.prototype.stopSession = u9.prototype.LY;
    u9.prototype.getCastSession = u9.prototype.KY;
    u9.prototype.requestSession = u9.prototype.requestSession;
    u9.prototype.init = u9.prototype.init;
    u9.prototype.dispose = u9.prototype.dispose;
    var ynb = [];
    g.k = E9.prototype;
    g.k.reset = function(a) {
        this.listId = "";
        this.index = -1;
        this.videoId = "";
        Enb(this);
        this.volume = -1;
        this.muted = !1;
        a && (this.index = a.index, this.listId = a.listId, this.videoId = a.videoId, this.playerState = a.playerState, this.volume = a.volume, this.muted = a.muted, this.audioTrackId = a.audioTrackId, this.trackData = a.trackData, this.uo = a.hasPrevious, this.hasNext = a.hasNext, this.J = a.playerTime, this.I = a.playerTimeAt, this.C = a.seekableStart, this.j = a.seekableEnd, this.D = a.duration, this.T = a.loadedTime, this.B = a.liveIngestionTime, this.u = !isNaN(this.B))
    };
    g.k.Zc = function() {
        return 1 == this.playerState
    };
    g.k.isAdPlaying = function() {
        return 1081 == this.playerState
    };
    g.k.Gk = function(a) {
        this.D = isNaN(a) ? 0 : a
    };
    g.k.getDuration = function() {
        return this.u ? this.D + F9(this) : this.D
    };
    g.k.clone = function() {
        return new E9(Fnb(this))
    };
    g.w(K9, g.QB);
    g.k = K9.prototype;
    g.k.getState = function() {
        return this.B
    };
    g.k.Mr = function() {
        return this.C.getReconnectTimeout()
    };
    g.k.yv = function() {
        this.C.reconnect()
    };
    g.k.play = function() {
        M9(this) ? (this.j ? this.j.play(null, g.ud, Q9(this, "play")) : P9(this, "play"), Inb(this, 1, H9(L9(this))), this.ma("remotePlayerChange")) : N9(this, this.play)
    };
    g.k.pause = function() {
        M9(this) ? (this.j ? this.j.pause(null, g.ud, Q9(this, "pause")) : P9(this, "pause"), Inb(this, 2, H9(L9(this))), this.ma("remotePlayerChange")) : N9(this, this.pause)
    };
    g.k.seekTo = function(a) {
        if (M9(this)) {
            if (this.j) {
                var b = L9(this),
                    c = new chrome.cast.media.SeekRequest;
                c.currentTime = a;
                b.Zc() || 3 == b.playerState ? c.resumeState = chrome.cast.media.ResumeState.PLAYBACK_START : c.resumeState = chrome.cast.media.ResumeState.PLAYBACK_PAUSE;
                this.j.seek(c, g.ud, Q9(this, "seekTo", {
                    newTime: a
                }))
            } else P9(this, "seekTo", {
                newTime: a
            });
            Inb(this, 3, a);
            this.ma("remotePlayerChange")
        } else N9(this, g.Pa(this.seekTo, a))
    };
    g.k.stop = function() {
        if (M9(this)) {
            this.j ? this.j.stop(null, g.ud, Q9(this, "stopVideo")) : P9(this, "stopVideo");
            var a = L9(this);
            a.index = -1;
            a.videoId = "";
            Enb(a);
            O9(this, a);
            this.ma("remotePlayerChange")
        } else N9(this, this.stop)
    };
    g.k.setVolume = function(a, b) {
        if (M9(this)) {
            var c = L9(this);
            if (this.u) {
                if (c.volume != a) {
                    var d = Math.round(a) / 100;
                    this.u.setReceiverVolumeLevel(d, (0, g.Oa)(function() {
                        b9("set receiver volume: " + d)
                    }, this), (0, g.Oa)(function() {
                        this.Kf("failed to set receiver volume.")
                    }, this))
                }
                c.muted != b && this.u.setReceiverMuted(b, (0, g.Oa)(function() {
                    b9("set receiver muted: " + b)
                }, this), (0, g.Oa)(function() {
                    this.Kf("failed to set receiver muted.")
                }, this))
            } else {
                var e = {
                    volume: a,
                    muted: b
                }; - 1 != c.volume && (e.delta = a - c.volume);
                P9(this, "setVolume", e)
            }
            c.muted = b;
            c.volume = a;
            O9(this, c)
        } else N9(this, g.Pa(this.setVolume, a, b))
    };
    g.k.KP = function(a, b) {
        if (M9(this)) {
            var c = L9(this);
            a = {
                videoId: a
            };
            b && (c.trackData = {
                trackName: b.name,
                languageCode: b.languageCode,
                sourceLanguageCode: b.translationLanguage ? b.translationLanguage.languageCode : "",
                languageName: b.languageName,
                kind: b.kind
            }, a.style = g.Ih(b.style), g.Zc(a, c.trackData));
            P9(this, "setSubtitlesTrack", a);
            O9(this, c)
        } else N9(this, g.Pa(this.KP, a, b))
    };
    g.k.setAudioTrack = function(a, b) {
        M9(this) ? (b = b.getLanguageInfo().getId(), P9(this, "setAudioTrack", {
            videoId: a,
            audioTrackId: b
        }), a = L9(this), a.audioTrackId = b, O9(this, a)) : N9(this, g.Pa(this.setAudioTrack, a, b))
    };
    g.k.playVideo = function(a, b, c, d, e, f, h) {
        d = void 0 === d ? null : d;
        e = void 0 === e ? null : e;
        f = void 0 === f ? null : f;
        h = void 0 === h ? null : h;
        var l = L9(this),
            m = {
                videoId: a
            };
        void 0 !== c && (m.currentIndex = c);
        I9(l, a, c || 0);
        void 0 !== b && (G9(l, b), m.currentTime = b);
        d && (m.listId = d);
        e && (m.playerParams = e);
        f && (m.clickTrackingParams = f);
        h && (m.locationInfo = g.Ih(h));
        P9(this, "setPlaylist", m);
        d || O9(this, l)
    };
    g.k.rG = function(a, b) {
        if (M9(this)) {
            if (a && b) {
                var c = L9(this);
                I9(c, a, b);
                O9(this, c)
            }
            P9(this, "previous")
        } else N9(this, g.Pa(this.rG, a, b))
    };
    g.k.nextVideo = function(a, b) {
        if (M9(this)) {
            if (a && b) {
                var c = L9(this);
                I9(c, a, b);
                O9(this, c)
            }
            P9(this, "next")
        } else N9(this, g.Pa(this.nextVideo, a, b))
    };
    g.k.Zw = function() {
        if (M9(this)) {
            P9(this, "clearPlaylist");
            var a = L9(this);
            a.reset();
            O9(this, a);
            this.ma("remotePlayerChange")
        } else N9(this, this.Zw)
    };
    g.k.JR = function() {
        M9(this) ? P9(this, "dismissAutoplay") : N9(this, this.JR)
    };
    g.k.dispose = function() {
        if (3 != this.B) {
            var a = this.B;
            this.B = 3;
            this.ma("proxyStateChange", a, this.B)
        }
        g.QB.prototype.dispose.call(this)
    };
    g.k.ra = function() {
        Hnb(this);
        this.C = null;
        this.D.clear();
        J9(this, null);
        g.QB.prototype.ra.call(this)
    };
    g.k.EN = function(a) {
        if ((a != this.B || 2 == a) && 3 != this.B && 0 != a) {
            var b = this.B;
            this.B = a;
            this.ma("proxyStateChange", b, a);
            if (1 == a)
                for (; !this.D.isEmpty();) b = a = this.D, 0 === b.j.length && (b.j = b.u, b.j.reverse(), b.u = []), a.j.pop().apply(this);
            else 3 == a && this.dispose()
        }
    };
    g.k.M4 = function(a, b) {
        this.ma(a, b)
    };
    g.k.E3 = function(a) {
        if (!a) this.UB(null), J9(this, null);
        else if (this.u.receiver.volume) {
            a = this.u.receiver.volume;
            var b = L9(this),
                c = Math.round(100 * a.level || 0);
            if (b.volume != c || b.muted != a.muted) b9("Cast volume update: " + a.level + (a.muted ? " muted" : "")), b.volume = c, b.muted = !!a.muted, O9(this, b)
        }
    };
    g.k.UB = function(a) {
        b9("Cast media: " + !!a);
        this.j && this.j.removeUpdateListener(this.T);
        if (this.j = a) this.j.addUpdateListener(this.T), Jnb(this), this.ma("remotePlayerChange")
    };
    g.k.D3 = function(a) {
        a ? (Jnb(this), this.ma("remotePlayerChange")) : this.UB(null)
    };
    g.k.gO = function() {
        P9(this, "sendDebugCommand", {
            debugCommand: "stats4nerds "
        })
    };
    g.k.F3 = function() {
        var a = Bnb();
        a && J9(this, a)
    };
    g.k.Kf = function(a) {
        a9("CP", a)
    };
    g.w(T9, g.QB);
    g.k = T9.prototype;
    g.k.connect = function(a, b) {
        if (b) {
            var c = b.listId,
                d = b.videoId,
                e = b.videoIds,
                f = b.playerParams,
                h = b.clickTrackingParams,
                l = b.index,
                m = {
                    videoId: d
                },
                n = b.currentTime,
                p = b.locationInfo;
            b = b.loopMode;
            void 0 !== n && (m.currentTime = 5 >= n ? 0 : n);
            f && (m.playerParams = f);
            p && (m.locationInfo = p);
            h && (m.clickTrackingParams = h);
            c && (m.listId = c);
            e && 0 < e.length && (m.videoIds = e.join(","));
            void 0 !== l && (m.currentIndex = l);
            this.Ka && (m.loopMode = b || "LOOP_MODE_OFF");
            c && (this.j.listId = c);
            this.j.videoId = d;
            this.j.index = l || 0;
            this.j.state = 3;
            G9(this.j,
                n);
            this.D = "UNSUPPORTED";
            c = this.Ka ? "setInitialState" : "setPlaylist";
            R9("Connecting with " + c + " and params: " + g.Ih(m));
            this.u.connect({
                method: c,
                params: g.Ih(m)
            }, a, bkb())
        } else R9("Connecting without params"), this.u.connect({}, a, bkb());
        Nnb(this)
    };
    g.k.xq = function(a) {
        this.u.xq(a)
    };
    g.k.dispose = function() {
        this.isDisposed() || (g.Ea("yt.mdx.remote.remoteClient_", null), this.ma("beforeDispose"), S9(this, 3));
        g.QB.prototype.dispose.call(this)
    };
    g.k.ra = function() {
        Onb(this);
        Qnb(this);
        Pnb(this);
        g.Tv(this.T);
        this.T = NaN;
        g.Tv(this.Z);
        this.Z = NaN;
        this.C = null;
        g.cz(this.ea);
        this.ea.length = 0;
        this.u.dispose();
        g.QB.prototype.ra.call(this);
        this.D = this.J = this.B = this.j = this.u = null
    };
    g.k.gT = function(a) {
        if (!this.B || 0 === this.B.length) return !1;
        for (var b = g.t(this.B), c = b.next(); !c.done; c = b.next())
            if (!c.value.capabilities.has(a)) return !1;
        return !0
    };
    g.k.b1 = function() {
        var a = 3;
        this.isDisposed() || (a = 0, isNaN(this.ZA()) ? this.u.Nx() && isNaN(this.I) && (a = 1) : a = 2);
        return a
    };
    g.k.sx = function(a) {
        R9("Disconnecting with " + a);
        g.Ea("yt.mdx.remote.remoteClient_", null);
        Onb(this);
        this.ma("beforeDisconnect", a);
        1 == a && j8();
        this.u.disconnect(a);
        this.dispose()
    };
    g.k.Y0 = function() {
        var a = this.j;
        this.C && (a = this.j.clone(), I9(a, this.C, a.index));
        return Fnb(a)
    };
    g.k.I6 = function(a) {
        var b = this,
            c = new E9(a);
        c.videoId && c.videoId != this.j.videoId && (this.C = c.videoId, g.Tv(this.T), this.T = g.Rv(function() {
            if (b.C) {
                var e = b.C;
                b.C = null;
                b.j.videoId != e && U9(b, "getNowPlaying")
            }
        }, 5E3));
        var d = [];
        this.j.listId == c.listId && this.j.videoId == c.videoId && this.j.index == c.index || d.push("remoteQueueChange");
        this.j.playerState == c.playerState && this.j.volume == c.volume && this.j.muted == c.muted && H9(this.j) == H9(c) && g.Ih(this.j.trackData) == g.Ih(c.trackData) || d.push("remotePlayerChange");
        this.j.reset(a);
        g.Eb(d, function(e) {
            this.ma(e)
        }, this)
    };
    g.k.rS = function() {
        var a = this.u.Dr(),
            b = g.gb(this.B, function(c) {
                return "REMOTE_CONTROL" == c.type && c.id != a
            });
        return b ? b.id : ""
    };
    g.k.ZA = function() {
        return this.u.Mr()
    };
    g.k.T0 = function() {
        return this.D || "UNSUPPORTED"
    };
    g.k.U0 = function() {
        return this.J || ""
    };
    g.k.MY = function() {
        !isNaN(this.ZA()) && this.u.yv()
    };
    g.k.F6 = function(a, b) {
        U9(this, a, b);
        Snb(this)
    };
    g.k.LP = function() {
        var a = g.gw("SID", "") || "",
            b = g.gw("SAPISID", "") || "",
            c = g.gw("__Secure-3PAPISID", "") || "";
        if (!a && !b && !c) return "";
        a = g.Cf(g.Bf(a), 2);
        b = g.Cf(g.Bf(b), 2);
        c = g.Cf(g.Bf(c), 2);
        return g.Cf(g.Bf(a + "," + b + "," + c), 2)
    };
    T9.prototype.subscribe = T9.prototype.subscribe;
    T9.prototype.unsubscribeByKey = T9.prototype.Ah;
    T9.prototype.getProxyState = T9.prototype.b1;
    T9.prototype.disconnect = T9.prototype.sx;
    T9.prototype.getPlayerContextData = T9.prototype.Y0;
    T9.prototype.setPlayerContextData = T9.prototype.I6;
    T9.prototype.getOtherConnectedRemoteId = T9.prototype.rS;
    T9.prototype.getReconnectTimeout = T9.prototype.ZA;
    T9.prototype.getAutoplayMode = T9.prototype.T0;
    T9.prototype.getAutoplayVideoId = T9.prototype.U0;
    T9.prototype.reconnect = T9.prototype.MY;
    T9.prototype.sendMessage = T9.prototype.F6;
    T9.prototype.getXsrfToken = T9.prototype.LP;
    T9.prototype.isCapabilitySupportedOnConnectedDevices = T9.prototype.gT;
    g.w(dob, f9);
    g.k = dob.prototype;
    g.k.hk = function(a) {
        return this.Ig.$_gs(a)
    };
    g.k.contains = function(a) {
        return !!this.Ig.$_c(a)
    };
    g.k.get = function(a) {
        return this.Ig.$_g(a)
    };
    g.k.start = function() {
        this.Ig.$_st()
    };
    g.k.add = function(a, b, c) {
        this.Ig.$_a(a, b, c)
    };
    g.k.remove = function(a, b, c) {
        this.Ig.$_r(a, b, c)
    };
    g.k.kH = function(a, b, c, d) {
        this.Ig.$_un(a, b, c, d)
    };
    g.k.ra = function() {
        for (var a = 0, b = this.j.length; a < b; ++a) this.Ig.$_ubk(this.j[a]);
        this.j.length = 0;
        this.Ig = null;
        f9.prototype.ra.call(this)
    };
    g.k.OY = function() {
        this.ma("screenChange")
    };
    g.k.u4 = function() {
        this.ma("onlineScreenChange")
    };
    k9.prototype.$_st = k9.prototype.start;
    k9.prototype.$_gspc = k9.prototype.HY;
    k9.prototype.$_gsppc = k9.prototype.HP;
    k9.prototype.$_c = k9.prototype.contains;
    k9.prototype.$_g = k9.prototype.get;
    k9.prototype.$_a = k9.prototype.add;
    k9.prototype.$_un = k9.prototype.kH;
    k9.prototype.$_r = k9.prototype.remove;
    k9.prototype.$_gs = k9.prototype.hk;
    k9.prototype.$_gos = k9.prototype.GP;
    k9.prototype.$_s = k9.prototype.subscribe;
    k9.prototype.$_ubk = k9.prototype.Ah;
    var e$ = null,
        h$ = !1,
        V9 = null,
        W9 = null,
        oob = null,
        $9 = [];
    g.w(tob, g.C);
    g.k = tob.prototype;
    g.k.ra = function() {
        g.C.prototype.ra.call(this);
        this.j.stop();
        this.u.stop();
        this.J.stop();
        var a = this.zc;
        a.unsubscribe("proxyStateChange", this.KU, this);
        a.unsubscribe("remotePlayerChange", this.YB, this);
        a.unsubscribe("remoteQueueChange", this.cG, this);
        a.unsubscribe("previousNextChange", this.HU, this);
        a.unsubscribe("nowAutoplaying", this.BU, this);
        a.unsubscribe("autoplayDismissed", this.eU, this);
        this.zc = this.module = null
    };
    g.k.lk = function(a) {
        var b = g.xa.apply(1, arguments);
        if (2 != this.zc.B)
            if (i$(this)) {
                if (!L9(this.zc).isAdPlaying() || "control_seek" !== a) switch (a) {
                    case "control_toggle_play_pause":
                        L9(this.zc).Zc() ? this.zc.pause() : this.zc.play();
                        break;
                    case "control_play":
                        this.zc.play();
                        break;
                    case "control_pause":
                        this.zc.pause();
                        break;
                    case "control_seek":
                        this.I.QH(b[0], b[1]);
                        break;
                    case "control_subtitles_set_track":
                        vob(this, b[0]);
                        break;
                    case "control_set_audio_track":
                        this.setAudioTrack(b[0])
                }
            } else switch (a) {
                case "control_toggle_play_pause":
                case "control_play":
                case "control_pause":
                    b =
                        this.F.getCurrentTime();
                    j$(this, 0 === b ? void 0 : b);
                    break;
                case "control_seek":
                    j$(this, b[0]);
                    break;
                case "control_subtitles_set_track":
                    vob(this, b[0]);
                    break;
                case "control_set_audio_track":
                    this.setAudioTrack(b[0])
            }
    };
    g.k.B3 = function(a) {
        this.J.mY(a)
    };
    g.k.x7 = function(a) {
        this.lk("control_subtitles_set_track", g.Tc(a) ? null : a)
    };
    g.k.kW = function() {
        var a = this.F.getOption("captions", "track");
        g.Tc(a) || vob(this, a)
    };
    g.k.vc = function(a) {
        this.module.vc(a, this.F.getVideoData().lengthSeconds)
    };
    g.k.e4 = function() {
        g.Tc(this.B) || wob(this, this.B);
        this.C = !1
    };
    g.k.KU = function(a, b) {
        this.u.stop();
        2 === b && this.bW()
    };
    g.k.YB = function() {
        if (i$(this)) {
            this.j.stop();
            var a = L9(this.zc);
            switch (a.playerState) {
                case 1080:
                case 1081:
                case 1084:
                case 1085:
                    this.module.ph = 1;
                    break;
                case 1082:
                case 1083:
                    this.module.ph = 0;
                    break;
                default:
                    this.module.ph = -1
            }
            switch (a.playerState) {
                case 1081:
                case 1:
                    this.lc(new g.TL(8));
                    this.aW();
                    break;
                case 1085:
                case 3:
                    this.lc(new g.TL(9));
                    break;
                case 1083:
                case 0:
                    this.lc(new g.TL(2));
                    this.I.stop();
                    this.vc(this.F.getVideoData().lengthSeconds);
                    break;
                case 1084:
                    this.lc(new g.TL(4));
                    break;
                case 2:
                    this.lc(new g.TL(4));
                    this.vc(H9(a));
                    break;
                case -1:
                    this.lc(new g.TL(64));
                    break;
                case -1E3:
                    this.lc(new g.TL(128, {
                        errorCode: "mdx.remoteerror",
                        errorMessage: "This video is not available for remote playback.",
                        wE: 2
                    }))
            }
            a = L9(this.zc).trackData;
            var b = this.B;
            (a || b ? a && b && a.trackName == b.trackName && a.languageCode == b.languageCode && a.languageName == b.languageName && a.kind == b.kind : 1) || (this.B = a, wob(this, a));
            a = L9(this.zc); - 1 === a.volume || Math.round(this.F.getVolume()) === a.volume && this.F.isMuted() === a.muted || this.T.isActive() || this.RW()
        } else uob(this)
    };
    g.k.HU = function() {
        this.F.ma("mdxpreviousnextchange")
    };
    g.k.cG = function() {
        i$(this) || uob(this)
    };
    g.k.BU = function(a) {
        isNaN(a) || this.F.ma("mdxnowautoplaying", a)
    };
    g.k.eU = function() {
        this.F.ma("mdxautoplaycanceled")
    };
    g.k.setAudioTrack = function(a) {
        i$(this) && this.zc.setAudioTrack(this.F.getVideoData(1).videoId, a)
    };
    g.k.seekTo = function(a, b) {
        -1 === L9(this.zc).playerState ? j$(this, a) : b && this.zc.seekTo(a)
    };
    g.k.RW = function() {
        var a = this;
        if (i$(this)) {
            var b = L9(this.zc);
            this.events.Gc(this.Z);
            b.muted ? this.F.mute() : this.F.unMute();
            this.F.setVolume(b.volume);
            this.Z = this.events.N(this.F, "onVolumeChange", function(c) {
                rob(a, c)
            })
        }
    };
    g.k.aW = function() {
        this.j.stop();
        if (!this.zc.isDisposed()) {
            var a = L9(this.zc);
            a.Zc() && this.lc(new g.TL(8));
            this.vc(H9(a));
            this.j.start()
        }
    };
    g.k.bW = function() {
        this.u.stop();
        this.j.stop();
        var a = this.zc.Mr();
        2 == this.zc.B && !isNaN(a) && this.u.start()
    };
    g.k.lc = function(a) {
        this.u.stop();
        var b = this.D;
        if (!g.YL(b, a)) {
            var c = g.S(a, 2);
            c !== g.S(this.D, 2) && this.F.Sy(c);
            this.D = a;
            yob(this.module, b, a)
        }
    };
    g.w(k$, g.T);
    k$.prototype.Rc = function() {
        this.j.show()
    };
    k$.prototype.zb = function() {
        this.j.hide()
    };
    k$.prototype.u = function() {
        b8("mdx-privacy-popup-cancel");
        this.zb()
    };
    k$.prototype.B = function() {
        b8("mdx-privacy-popup-confirm");
        this.zb()
    };
    g.w(l$, g.T);
    l$.prototype.onStateChange = function(a) {
        this.Ec(a.state)
    };
    l$.prototype.Ec = function(a) {
        if (3 === this.api.getPresentingPlayerType()) {
            var b = {
                RECEIVER_NAME: this.api.getOption("remote", "currentReceiver").name
            };
            a = g.S(a, 128) ? g.BL("Error on $RECEIVER_NAME", b) : a.Zc() || g.ZL(a) ? g.BL("Playing on $RECEIVER_NAME", b) : g.BL("Connected to $RECEIVER_NAME", b);
            this.updateValue("statustext", a);
            this.j.show()
        } else this.j.hide()
    };
    g.w(m$, g.hU);
    m$.prototype.B = function() {
        var a = this.F.getOption("remote", "receivers");
        a && 1 < a.length && !this.F.getOption("remote", "quickCast") ? (this.Ks = g.Fb(a, this.j, this), g.iU(this, g.Gg(a, this.j)), a = this.F.getOption("remote", "currentReceiver"), a = this.j(a), this.options[a] && this.lj(a), this.enable(!0)) : this.enable(!1)
    };
    m$.prototype.j = function(a) {
        return a.key
    };
    m$.prototype.al = function(a) {
        return "cast-selector-receiver" === a ? "Cast..." : this.Ks[a].name
    };
    m$.prototype.Qg = function(a) {
        g.hU.prototype.Qg.call(this, a);
        this.F.setOption("remote", "currentReceiver", this.Ks[a]);
        this.qb.zb()
    };
    g.w(xob, g.RQ);
    g.k = xob.prototype;
    g.k.create = function() {
        var a = this.player.V(),
            b = g.IH(a);
        a = {
            device: "Desktop",
            app: "youtube-desktop",
            loadCastApiSetupScript: a.S("mdx_load_cast_api_bootstrap_script"),
            enableDialLoungeToken: a.S("enable_dial_short_lived_lounge_token"),
            enableCastLoungeToken: a.S("enable_cast_short_lived_lounge_token")
        };
        iob(b, a);
        this.subscriptions.push(g.vz("yt-remote-before-disconnect", this.z3, this));
        this.subscriptions.push(g.vz("yt-remote-connection-change", this.S4, this));
        this.subscriptions.push(g.vz("yt-remote-receiver-availability-change", this.JU,
            this));
        this.subscriptions.push(g.vz("yt-remote-auto-connect", this.Q4, this));
        this.subscriptions.push(g.vz("yt-remote-receiver-resumed", this.P4, this));
        this.subscriptions.push(g.vz("mdx-privacy-popup-confirm", this.h6, this));
        this.subscriptions.push(g.vz("mdx-privacy-popup-cancel", this.g6, this));
        this.JU()
    };
    g.k.load = function() {
        this.player.cancelPlayback();
        g.RQ.prototype.load.call(this);
        this.bl = new tob(this, this.player, this.zc);
        var a = (a = qob()) ? a.currentTime : 0;
        var b = nob() ? new K9(d$(), void 0) : null;
        0 == a && b && (a = H9(L9(b)));
        0 !== a && this.vc(a);
        yob(this, this.Pd, this.Pd);
        this.player.No(6)
    };
    g.k.unload = function() {
        this.player.ma("mdxautoplaycanceled");
        this.ir = this.Fo;
        g.ab(this.bl, this.zc);
        this.zc = this.bl = null;
        g.RQ.prototype.unload.call(this);
        this.player.No(5);
        n$(this)
    };
    g.k.ra = function() {
        g.wz(this.subscriptions);
        g.RQ.prototype.ra.call(this)
    };
    g.k.Ho = function(a) {
        var b = g.xa.apply(1, arguments);
        this.loaded && this.bl.lk.apply(this.bl, [a].concat(g.u(b)))
    };
    g.k.getAdState = function() {
        return this.ph
    };
    g.k.uo = function() {
        return this.zc ? L9(this.zc).uo : !1
    };
    g.k.hasNext = function() {
        return this.zc ? L9(this.zc).hasNext : !1
    };
    g.k.vc = function(a, b) {
        this.sT = a || 0;
        this.player.ma("progresssync", a, b);
        this.player.Oa("onVideoProgress", a || 0)
    };
    g.k.getCurrentTime = function() {
        return this.sT
    };
    g.k.getProgressState = function() {
        var a = L9(this.zc),
            b = this.player.getVideoData();
        return {
            airingStart: 0,
            airingEnd: 0,
            allowSeeking: !a.isAdPlaying() && this.player.oh(),
            clipEnd: b.clipEnd,
            clipStart: b.clipStart,
            current: this.getCurrentTime(),
            displayedStart: -1,
            duration: a.getDuration(),
            ingestionTime: a.u ? a.B + F9(a) : a.B,
            isAtLiveHead: 1 >= (a.u ? a.j + F9(a) : a.j) - this.getCurrentTime(),
            loaded: a.T,
            seekableEnd: a.u ? a.j + F9(a) : a.j,
            seekableStart: 0 < a.C ? a.C + F9(a) : a.C,
            offset: 0
        }
    };
    g.k.nextVideo = function() {
        this.zc && this.zc.nextVideo()
    };
    g.k.rG = function() {
        this.zc && this.zc.rG()
    };
    g.k.z3 = function(a) {
        1 === a && (this.QM = this.zc ? L9(this.zc) : null)
    };
    g.k.S4 = function() {
        var a = nob() ? new K9(d$(), void 0) : null;
        if (a) {
            var b = this.ir;
            this.loaded && this.unload();
            this.zc = a;
            this.QM = null;
            b.key !== this.Fo.key && (this.ir = b, this.load())
        } else g.$a(this.zc), this.zc = null, this.loaded && (this.unload(), (a = this.QM) && a.videoId === this.player.getVideoData().videoId && this.player.cueVideoById(a.videoId, H9(a)));
        this.player.ma("videodatachange", "newdata", this.player.getVideoData(), 3)
    };
    g.k.JU = function() {
        var a = [this.Fo],
            b = a.concat,
            c = job();
        B9() && g.fB("yt-remote-cast-available") && c.push({
            key: "cast-selector-receiver",
            name: "Cast..."
        });
        this.Ks = b.call(a, c);
        a = lob() || this.Fo;
        o$(this, a);
        this.player.Oa("onMdxReceiversChange")
    };
    g.k.Q4 = function() {
        var a = lob();
        o$(this, a)
    };
    g.k.P4 = function() {
        this.ir = lob()
    };
    g.k.h6 = function() {
        this.jC = !0;
        n$(this);
        h$ = !1;
        e$ && g$(e$, 1);
        e$ = null
    };
    g.k.g6 = function() {
        this.jC = !1;
        n$(this);
        o$(this, this.Fo);
        this.ir = this.Fo;
        h$ = !1;
        e$ = null;
        this.player.playVideo()
    };
    g.k.kh = function(a, b) {
        switch (a) {
            case "casting":
                return this.loaded;
            case "receivers":
                return this.Ks;
            case "currentReceiver":
                return b && ("cast-selector-receiver" === b.key ? Cnb() : o$(this, b)), this.loaded ? this.ir : this.Fo;
            case "quickCast":
                return 2 === this.Ks.length && "cast-selector-receiver" === this.Ks[1].key ? (b && Cnb(), !0) : !1
        }
    };
    g.k.gO = function() {
        this.zc.gO()
    };
    g.k.Ik = function() {
        return !1
    };
    g.k.getOptions = function() {
        return ["casting", "receivers", "currentReceiver", "quickCast"]
    };
    g.QQ("remote", xob);
})(_yt_player);