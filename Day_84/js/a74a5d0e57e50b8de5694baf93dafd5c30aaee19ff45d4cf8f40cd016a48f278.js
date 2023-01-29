! function() {
    "use strict";
    var e;
    const n = "undefined" != typeof window ? null === (e = window.navigator) || void 0 === e ? void 0 : e.userAgent : void 0;
    const t = !(!n || (o = n, !o.match(/AppleWebKit\//) || o.match(/Chrome\//) || o.match(/Chromium\//)));
    var o;
    ! function() {
        const e = document.querySelectorAll("video");
        if (!e.length) return;
        (function() {
            if (document.querySelector("template#playPauseButton")) return;
            const e = '\n<div class="playPauseButton">\n<svg class="playSvg" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.248 4.212l11.05 6.574c.694.412.91 1.29.483 1.961-.121.19-.287.35-.483.467l-11.05 6.574c-.694.413-1.602.204-2.03-.467A1.39 1.39 0 0 1 6 18.574V5.426C6 4.638 6.66 4 7.475 4c.273 0 .54.073.773.212z" fill="currentColor"/></svg>\n<svg class="pauseSvg" style="display: none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="7" y="5" width="3" height="14" rx="1.5" fill="currentColor"/><rect x="14" y="5" width="3" height="14" rx="1.5" fill="currentColor"/></svg>\n</div>\n'.trim(),
                n = "\n  .playPauseButton {\n    cursor: pointer;\n    position: absolute;\n    top: calc(50% - 24px);\n    left: calc(50% - 24px);\n    width: 48px;\n    height: 48px;\n    border-radius: 100%;\n    background: rgba(17,23,29,.4);\n    transition: opacity 0.2s ease-out;\n    color: white;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n  }\n".trim(),
                t = document.createElement("template");
            t.id = "playPauseButton", t.innerHTML = e, document.body.appendChild(t);
            const o = document.createElement("style");
            o.innerHTML = n, document.body.appendChild(o)
        })(),
        function() {
            if (document.querySelector("template#seekBar")) return;
            const e = '\n<div class="videoSeek">\n  <div class="videoSeekBarContainer">\n    <div class="videoSeekBar">\n      <div class="videoSeekBarCurrent"></div>\n    </div>\n    <input class="videoSeekInput" type="range" min="0" max="100" step="any" value="0">\n  </div>\n  <div class="soundButton">\n    <svg class="soundOnSvg" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 5.102L8.778 8.35a2.5 2.5 0 0 1-1.643.616H4.5v6.065h2.632a2.5 2.5 0 0 1 1.644.617l3.724 3.25V5.102zM14 19.998c0 .858-1.01 1.318-1.658.753L7.79 16.778a1 1 0 0 0-.658-.247H4a1 1 0 0 1-1-1V8.466a1 1 0 0 1 1-1h3.135a1 1 0 0 0 .657-.246l4.55-3.971C12.99 2.684 14 3.143 14 4.002v15.996zM15.25 7a.75.75 0 0 1 .75-.75 5.75 5.75 0 0 1 0 11.5.75.75 0 0 1 0-1.5 4.25 4.25 0 0 0 0-8.5.75.75 0 0 1-.75-.75zM16 9.25a.75.75 0 0 0 0 1.5 1.25 1.25 0 1 1 0 2.5.75.75 0 0 0 0 1.5 2.75 2.75 0 1 0 0-5.5z" fill="currentColor"/></svg>\n    <svg class="soundMutedSvg" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="a" fill="#fff"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.5 5.08l-3.742 3.171a2.5 2.5 0 01-.243.182L15.5 12.4V5.08zm1.5 8.814V4.002a1 1 0 00-1.646-.763l-4.566 3.868a1 1 0 01-.398.206L6.53 3.468a.75.75 0 10-1.06 1.063l14 13.94a.75.75 0 101.06-1.063L17 13.894zM6.293 7.637l1.208 1.207H7.5v5.8h2.642a2.5 2.5 0 011.616.593l3.742 3.17v-1.564l1.5 1.5v1.143a1 1 0 01-1.646.763l-4.566-3.868a1 1 0 00-.646-.237H7a1 1 0 01-1-1v-6.8c0-.276.112-.526.293-.707z"/></mask><path fill-rule="evenodd" clip-rule="evenodd" d="M15.5 5.08l-3.742 3.171a2.5 2.5 0 01-.243.182L15.5 12.4V5.08zm1.5 8.814V4.002a1 1 0 00-1.646-.763l-4.566 3.868a1 1 0 01-.398.206L6.53 3.468a.75.75 0 10-1.06 1.063l14 13.94a.75.75 0 101.06-1.063L17 13.894zM6.293 7.637l1.208 1.207H7.5v5.8h2.642a2.5 2.5 0 011.616.593l3.742 3.17v-1.564l1.5 1.5v1.143a1 1 0 01-1.646.763l-4.566-3.868a1 1 0 00-.646-.237H7a1 1 0 01-1-1v-6.8c0-.276.112-.526.293-.707z" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" mask="url(#a)"/></svg>\n  </div>\n</div>\n'.trim(),
                n = "\n  .videoSeek {\n    position: absolute;\n    bottom: 0;\n    left: 0;\n    width: 100%;\n    padding: 0;\n    box-sizing: border-box;\n    background: linear-gradient(0, rgba(17,23,29,.4) 0%, transparent 100%);\n    color: white;\n    transition: opacity 0.2s ease-out;\n    opacity: 0;\n    display: flex;\n    flex-direction: row;\n    justify-content: space-between;\n    align-items: center;\n  }\n\n  .soundButton {\n    flex-grow: 0;\n    flex-shrink: 0;\n    margin-right: 24px;\n    cursor: pointer;\n  }\n\n  .soundOnSvg,\n  .soundMutedSvg {\n    color: white;\n  }\n  \n  .soundMutedSvg {\n    display: none;\n  }\n\n  .videoSeekBarContainer {\n    position: relative;\n    flex-grow: 1;\n  }\n\n  .videoSeekBar {\n    position: absolute;\n    top: calc(50% - 2px);\n    left: 22px;\n    right: 22px;\n    height: 4px;\n    background: rgba(255, 255, 255, 0.4);\n    border-radius: 4px;\n  }\n\n  .videoSeekBarCurrent {\n    position: absolute;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    background: white;\n    border-radius: 4px;\n  }\n\n  .videoSeekInput {\n    position: relative;\n    display: block;\n    box-sizing: border-box;\n    margin: 0;\n    width: 100%;\n    height: 100%;\n    padding: 16px 8px;\n    -webkit-appearance: none;\n    -moz-appearance: none;\n    appearance: none;\n    background: none;\n    direction: ltr;\n  }\n\n  .videoSeekInput:hover {\n    cursor: pointer;\n  }\n\n  .videoSeekInput:active {\n    cursor: grabbing;\n  }\n\n  /* chrome, safari */\n  .videoSeekInput::-webkit-slider-thumb {\n    -webkit-appearance: none;\n    appearance: none;\n    box-sizing: border-box;\n    width: 40px;\n    height: 40px;\n    border: 14px solid transparent;\n    border-radius: 100%;\n    background-clip: content-box;\n    background-color: white;\n    filter: drop-shadow(0 0 1px black);\n    opacity: 1;\n  }\n\n  .videoSeekInput:active::-webkit-slider-thumb {\n    transform: scale(1.25);\n  }\n\n  /* firefox */\n  .videoSeekInput::-moz-focus-outer {\n    border: none;\n  }\n\n  .videoSeekInput::-moz-range-thumb {\n    -moz-appearance: none;\n    appearance: none;\n    box-sizing: border-box;\n    width: 40px;\n    height: 40px;\n    border: 14px solid transparent;\n    border-radius: 100%;\n    background-clip: content-box;\n    background-color: white;\n    filter: drop-shadow(0 0 1px black);\n    opacity: 1;\n  }\n\n  .videoSeekInput:active::-moz-range-thumb {\n    transform: scale(1.25);\n  }\n".trim(),
                t = document.createElement("template");
            t.id = "seekBar", t.innerHTML = e, document.body.appendChild(t);
            const o = document.createElement("style");
            o.innerHTML = n, document.body.appendChild(o)
        }();
        const n = [],
            o = new IntersectionObserver((e => {
                e.forEach((e => {
                    if (!e.isIntersecting) return;
                    const n = e.target;
                    o.unobserve(n), n.play()
                }))
            }));
        e.forEach((e => {
            if (!e.controls && !e.dataset.trimStartUs && !e.dataset.trimEndUs) return;
            const r = {},
                {
                    maybeResetVideoProgress: a,
                    videoStart: i
                } = function(e, n) {
                    const o = e.dataset.trimStartUs,
                        r = e.dataset.trimEndUs,
                        a = null != o ? parseFloat(o) / 1e6 : 0;
                    let i = null != r ? parseFloat(r) / 1e6 : void 0;
                    e.loop && a > 0 && (e.dataset.loop = "true", e.loop = !1);
                    e.addEventListener("timeupdate", (() => {
                        const n = e.currentTime;
                        let o;
                        null != i && n >= i - (t ? .25 : 0) ? e.loop || e.dataset.loop ? (o = a, e.play()) : e.pause() : n < a && (o = a), null != o && n !== o && (e.currentTime = o)
                    }));
                    const l = () => {
                        var t;
                        isNaN(e.duration) || (null == i && (i = e.duration), null === (t = n.updateDuration) || void 0 === t || t.call(n, a, i))
                    };
                    e.addEventListener("durationchange", l), e.addEventListener("loadedmetadata", l), l();
                    return {
                        maybeResetVideoProgress: () => {
                            null != i && e.currentTime >= i && (e.currentTime = a)
                        },
                        videoStart: a
                    }
                }(e, r);
            if (e.autoplay && (e.autoplay = !1, e.paused || e.pause(), o.observe(e)), function(e, n) {
                    e.currentTime = n;
                    const o = n > 0 ? n : .01;
                    e.src = `${e.src}#t=${o}`, t && n > 0 && (e.style.opacity = "0", e.addEventListener("seeked", (() => {
                        e.style.opacity = "1"
                    }), {
                        once: !0
                    }))
                }(e, i), !e.controls) return;
            let l = e;
            for (; null != l && null != l.parentElement && (l = l.parentElement, "100%" !== l.style.width || "100%" !== l.style.height || "svg" === l.tagName.toLowerCase()););
            l.parentElement && "section" === l.parentElement.tagName.toLowerCase() && (l = l.parentElement);
            const {
                onResizeCallback: s
            } = function(e, n, t, o, r) {
                "relative" !== e.style.position && "absolute" !== e.style.position && (e.style.position = "relative");
                n.controls = !1;
                const {
                    seekBar: a,
                    updateDuration: i
                } = function(e) {
                    const n = document.querySelector("template#seekBar");
                    if (null == n) throw new Error("template does not exist");
                    const t = n.content.firstChild.cloneNode(!0);
                    t.addEventListener("click", (e => e.stopPropagation()));
                    const o = t.querySelector("input");
                    let r = 0,
                        a = 100;
                    const i = (e, n) => {
                        r = e, a = n, o.min = e.toString(), o.max = n.toString()
                    };
                    i(r, a), o.addEventListener("input", (n => {
                        const t = parseFloat(n.target.value);
                        e.currentTime = t
                    }));
                    const l = t.querySelector(".videoSeekBarCurrent");
                    return e.addEventListener("timeupdate", (() => {
                        o.value = e.currentTime.toString();
                        const n = a - r,
                            t = Math.min((e.currentTime - r) / n * 100, 100);
                        l.style.width = `${t}%`
                    })), {
                        seekBar: t,
                        updateDuration: i
                    }
                }(n);
                r.updateDuration = i, e.appendChild(a),
                    function(e, n) {
                        const t = n.querySelector(".soundButton"),
                            o = t.querySelector(".soundOnSvg"),
                            r = t.querySelector(".soundMutedSvg");

                        function a() {
                            const n = e.muted || 0 === e.volume;
                            o.style.display = n ? "none" : "block", r.style.display = n ? "block" : "none"
                        }
                        e.addEventListener("volumechange", a), a(), t.addEventListener("click", (() => {
                            e.muted ? e.muted = !1 : e.volume = e.volume > 0 ? 0 : 1
                        }))
                    }(n, a);
                const {
                    playButton: l,
                    playPause: s
                } = function(e, n) {
                    let t = !1;
                    const o = async o => {
                            if (!t) {
                                t = !0, o.stopPropagation();
                                try {
                                    e.paused ? (n(), e.muted && (e.muted = !1), await e.play()) : e.pause()
                                } finally {
                                    t = !1
                                }
                            }
                        },
                        r = document.querySelector("template#playPauseButton");
                    if (null == r) throw new Error("template does not exist");
                    const a = r.content.firstChild.cloneNode(!0);
                    return a.addEventListener("click", o), {
                        playButton: a,
                        playPause: o
                    }
                }(n, t);
                e.appendChild(l);
                const d = l.querySelector(".pauseSvg"),
                    c = l.querySelector(".playSvg"),
                    u = () => {
                        l.style.opacity = "0", d.style.display = "block", c.style.display = "none"
                    },
                    p = () => {
                        l.style.opacity = "1", d.style.display = "none", c.style.display = "block"
                    };
                n.addEventListener("play", u), n.addEventListener("pause", p), n.paused ? p() : u();
                const v = () => {
                        n.paused || (l.style.opacity = "1"), a.style.opacity = "1"
                    },
                    m = () => {
                        n.paused || (l.style.opacity = "0"), a.style.opacity = "0"
                    };
                e.addEventListener("mouseenter", v), e.addEventListener("mouseover", v), e.addEventListener("mousemove", v), e.addEventListener("mouseleave", m), e.addEventListener("mouseout", m), e.addEventListener("click", s);
                return {
                    onResizeCallback: () => {
                        const n = e.clientWidth > 100 && e.clientHeight > 100;
                        l.style.visibility = n ? "visible" : "hidden", a.style.visibility = n ? "visible" : "hidden"
                    },
                    videoStart: o
                }
            }(l, e, a, i, r);
            n.push(s)
        })), window.addEventListener("resize", (() => {
            n.forEach((e => e()))
        }))
    }()
}();