"use strict";
(function () {
    'use strict';
    if (typeof window === 'undefined' || window.__MSEC_MSBOT)
        return;
    var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var uid = 0;
    var bots = [];
    var pointer = { x: -9999, y: -9999, t: 0 };
    var focusPt = null;
    var three3d = null;
    var extra3d = [];
    function markup(id) {
        var D = 'var(--msbot-dark,#0B2A4A)', A = 'var(--msbot-acc,#E8A33D)', E = 'var(--msbot-eye,#FFB547)';
        var H = 'var(--msbot-hi,#3D6594)', DP = 'var(--msbot-deep,#05162A)', AH = 'var(--msbot-acc-hi,#F8D08C)', AD = 'var(--msbot-acc-deep,#8A5A1E)';
        function f(c) { return ' style="fill:' + c + '"'; }
        function st(c) { return ' style="stop-color:' + c + '"'; }
        var B = 'url(#b' + id + ')', J = 'url(#j' + id + ')';
        function finger(x, y) { return '<rect x="' + x + '" y="' + y + '" width="2.1" height="5.6" rx="1.05" fill="' + B + '"/><circle cx="' + (x + 1.05) + '" cy="' + (y + 2.6) + '" r=".75" fill="' + J + '"/>'; }
        function hand(cx, y) {
            return '<rect x="' + (cx - 4.6) + '" y="' + y + '" width="9.2" height="2.4" rx="1.1" fill="' + J + '"/>' +
                '<rect x="' + (cx - 4.4) + '" y="' + (y + 2) + '" width="8.8" height="6" rx="2.6" fill="' + B + '"/>' +
                finger(cx - 4.4, y + 7) + finger(cx - 2.2, y + 7.4) + finger(cx, y + 7.4) + finger(cx + 2.2, y + 7) +
                '<rect x="' + (cx + 3.6) + '" y="' + (y + 3.5) + '" width="2" height="5" rx="1" fill="' + B + '" transform="rotate(-28 ' + (cx + 4.6) + ' ' + (y + 4) + ')"/>';
        }
        return '<svg viewBox="0 0 120 142" width="100%" height="100%" aria-hidden="true" focusable="false" overflow="visible">' +
            '<defs>' +
            '<radialGradient id="h' + id + '" cx="34%" cy="24%" r="85%"><stop offset="0"' + st(H) + '/><stop offset=".55"' + st(D) + '/><stop offset="1"' + st(DP) + '/></radialGradient>' +
            '<linearGradient id="b' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0"' + st(H) + '/><stop offset=".5"' + st(D) + '/><stop offset="1"' + st(DP) + '/></linearGradient>' +
            '<radialGradient id="j' + id + '" cx="35%" cy="30%" r="75%"><stop offset="0"' + st(AH) + '/><stop offset=".55"' + st(A) + '/><stop offset="1"' + st(AD) + '/></radialGradient>' +
            '<linearGradient id="m' + id + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7D8A9C"/><stop offset=".45" stop-color="#E8EDF3"/><stop offset="1" stop-color="#6F7C8E"/></linearGradient>' +
            '<radialGradient id="v' + id + '" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="#3E250E"/><stop offset=".6" stop-color="#170D05"/><stop offset="1" stop-color="#060302"/></radialGradient>' +
            '<radialGradient id="s' + id + '" cx="35%" cy="25%" r="90%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="#CDD4DD"/><stop offset="1" stop-color="#77828F"/></radialGradient>' +
            '<filter id="g' + id + '" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
            '<linearGradient id="f' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".3"' + st(E) + '/><stop offset="1"' + st(A) + ' stop-opacity="0"/></linearGradient>' +
            '<clipPath id="c' + id + '"><rect x="28" y="24" width="64" height="38" rx="18"/></clipPath>' +
            '</defs>' +
            '<ellipse class="shadow" cx="60" cy="139.5" rx="24" ry="3.4"' + f(D) + ' opacity=".22"/>' +
            '<g class="confetti" opacity="0"><rect x="16" y="18" width="5" height="5"' + f(A) + '/><rect x="98" y="14" width="5" height="5"' + f(E) + '/><rect x="10" y="44" width="4" height="4"' + f(E) + '/><rect x="106" y="38" width="4" height="4"' + f(A) + '/><rect x="34" y="2" width="4" height="4" fill="#1E7D4F"/><rect x="88" y="0" width="4" height="4"' + f(A) + '/></g>' +
            '<g class="zzz" opacity="0" font-family="Arial,sans-serif" font-weight="900"' + f(E) + '><text x="94" y="14" font-size="10">z</text><text x="102" y="4" font-size="13">Z</text></g>' +
            '<g transform="translate(120 0) scale(-1 1)"><g class="root">' +
            '<g class="flames" opacity="0"><path d="M42.5 138q7.5 18 15 0z" fill="url(#f' + id + ')"/><path d="M62.5 138q7.5 18 15 0z" fill="url(#f' + id + ')"/></g>' +
            '<g class="cape" opacity="0"><path d="M39 77h42l13 52q-34 11-68 0z"' + f(D) + ' style="stroke:' + A + '" stroke-width="1.5" stroke-linejoin="round"/><path d="M48 80l-12 46M72 80l12 46M60 80v50" stroke="#FFFFFF" stroke-width=".8" opacity=".15"/></g>' +
            '<g class="legs">' +
            '<circle cx="50.5" cy="108.5" r="4.2" fill="' + J + '"/><circle cx="69.5" cy="108.5" r="4.2" fill="' + J + '"/>' +
            '<rect x="45" y="110" width="11" height="11" rx="5" fill="' + B + '"/><rect x="64" y="110" width="11" height="11" rx="5" fill="' + B + '"/>' +
            '<circle cx="50.5" cy="122.5" r="4.4" fill="' + J + '"/><circle cx="69.5" cy="122.5" r="4.4" fill="' + J + '"/>' +
            '<path d="M45.2 125h10.6l.7 8h-12z" fill="' + B + '"/><path d="M64.2 125h10.6l.7 8h-12z" fill="' + B + '"/>' +
            '<rect x="44.8" y="132" width="11.6" height="2" rx="1" fill="' + J + '"/><rect x="63.6" y="132" width="11.6" height="2" rx="1" fill="' + J + '"/>' +
            '<path d="M42 133h17q3.5 0 3.5 3.5v1.5H39v-1q0-4 3-4z" fill="' + J + '"/><path d="M61 133h17q3.5 0 3.5 3.5v1.5H58v-1q0-4 3-4z" fill="' + J + '"/>' +
            '<path d="M40 134.5q3-1.5 7 0v3H40z" fill="' + B + '"/><path d="M59 134.5q3-1.5 7 0v3H59z" fill="' + B + '"/>' +
            '<rect x="38.5" y="137.6" width="24.5" height="2.4" rx="1.2" fill="#14181F"/><rect x="57.5" y="137.6" width="24.5" height="2.4" rx="1.2" fill="#14181F"/></g>' +
            '<g class="armR">' +
            '<rect x="85.5" y="84" width="7" height="13" rx="3.5" fill="' + B + '"/>' +
            '<g class="foreR"><path d="M85.6 100h6.8l.9 9.5h-8.6z" fill="' + B + '"/>' + hand(89, 108.6) +
            '<g class="phone" opacity="0"><rect x="84" y="104" width="10" height="17" rx="2.4" fill="#0A0705" stroke="#B4BFCD" stroke-width=".8"/><rect x="85.4" y="106" width="7.2" height="12" rx="1.2"' + f(E) + ' opacity=".8"/></g></g>' +
            '<circle cx="89" cy="98.5" r="4.4" fill="' + J + '"/>' +
            '<circle cx="89" cy="81" r="7.6" fill="' + B + '"/><path d="M82 85.5a7.6 7.6 0 0 0 14 0" fill="none" style="stroke:' + A + '" stroke-width="1.6" opacity=".9"/><path d="M84 77.5a6 6 0 0 1 9-1.5" stroke="#FFFFFF" stroke-width="1.5" fill="none" opacity=".35" stroke-linecap="round"/></g>' +
            '<g class="body">' +
            '<rect x="54" y="63" width="12" height="13" rx="3" fill="' + J + '"/><rect x="53" y="68" width="14" height="1.4" rx=".7"' + f(DP) + ' opacity=".5"/>' +
            '<path d="M39 74h42q8.5 0 7.6 8.4l-1.8 10.4q-1 5.2-7 5.2H40.2q-6 0-7-5.2l-1.8-10.4Q30.5 74 39 74z" fill="' + B + '"/>' +
            '<path d="M42 78.5q18-3.4 36 0" stroke="#FFFFFF" stroke-width="1.4" fill="none" opacity=".35" stroke-linecap="round"/>' +
            '<path d="M36 90q24 6 48 0" stroke="#000" stroke-width=".7" fill="none" opacity=".25"/>' +
            '<path d="M53 80h14v6c0 5-3.6 8-7 10-3.4-2-7-5-7-10z" fill="' + J + '"/>' +
            '<path class="chest" d="M55 82h10v4.4c0 3.6-2.6 5.8-5 7.2-2.4-1.4-5-3.6-5-7.2z"' + f(E) + ' filter="url(#g' + id + ')"/>' +
            '<circle class="core" cx="60" cy="86" r="2" fill="none"/>' +
            '<path d="M42.5 98h35l-1.6 7.5h-31.8z" fill="#12202F"/><path d="M43.5 99.8h33M44 102h32M44.6 104.2h30.8" stroke="#2C3A4C" stroke-width="1.1"/><rect x="42" y="103.6" width="36" height="1.8" rx=".9" fill="' + J + '"/>' +
            '<path d="M43 105h34q2 0 2 2.2v1.6q0 2.8-3 2.8H44q-3 0-3-2.8v-1.6q0-2.2 2-2.2z" fill="' + B + '"/>' +
            '<g class="suit" opacity="0"><path d="M41 76h15l4 22-15-1q-4-8-4-21z"' + f(D) + '/><path d="M79 76H64l-4 22 15-1q4-8 4-21z"' + f(D) + '/><path d="M56 76l4 5 4-5z" fill="#FFFFFF"/><path d="M58.3 80h3.4l1.6 3.5-1.8 12h-3l-1.8-12z"' + f(A) + '/></g></g>' +
            '<g class="armL">' +
            '<circle cx="31" cy="81" r="7.6" fill="' + B + '"/><path d="M24 85.5a7.6 7.6 0 0 0 14 0" fill="none" style="stroke:' + A + '" stroke-width="1.6" opacity=".9"/><path d="M26 77.5a6 6 0 0 1 9-1.5" stroke="#FFFFFF" stroke-width="1.5" fill="none" opacity=".35" stroke-linecap="round"/>' +
            '<rect x="27.5" y="84" width="7" height="13" rx="3.5" fill="' + B + '"/>' +
            '<g class="foreL"><path d="M27.6 100h6.8l.9 9.5h-8.6z" fill="' + B + '"/>' + hand(31, 108.6) +
            '<g class="pshield" display="none"><path d="M10 92h31v14c0 11-9 17.6-15.5 21.4C19 123.6 10 117 10 106z" style="fill:' + A + '"/>' +
            '<path d="M12 94h27v12c0 9.6-7.8 15.4-13.5 18.8C19.8 121.4 12 115.6 12 106z" fill="url(#s' + id + ')"/>' +
            '<path d="M15 97h21v9c0 7.3-6 11.8-10.5 14.4C21 117.8 15 113.3 15 106z" fill="none" stroke="#FFFFFF" stroke-width=".9" opacity=".55"/>' +
            '<path d="M13.5 95.5h11v27c-6-3.8-11-9-11-16.5z" fill="#FFFFFF" opacity=".18"/>' +
            '<text class="emb" x="25.5" y="112.5" transform="translate(51 0) scale(-1 1)" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="10" fill="#5A6472" style="stroke:' + A + '" stroke-width=".55" paint-order="stroke">MC</text></g></g>' +
            '<circle cx="31" cy="98.5" r="4.4" fill="' + J + '"/></g>' +
            '<g class="tablet" opacity="0"><rect x="42" y="84" width="36" height="24" rx="3"' + f(E) + ' opacity=".18" style="stroke:' + E + '" stroke-width="1.2"/><path d="M47 90h20M47 94h26M47 98h16M47 102h22" style="stroke:' + E + '" stroke-width="1.4" stroke-linecap="round" opacity=".9"/></g>' +
            '<g class="kbd" opacity="0"><path d="M30 113h60l6 10H24z"' + f(E) + ' opacity=".2" style="stroke:' + E + '" stroke-width="1"/><path d="M33 116.5h54M31 120h58M44 113v10M56 113v10M68 113v10M80 113v10" style="stroke:' + E + '" stroke-width=".7" opacity=".7"/></g>' +
            '<g class="waves" opacity="0" fill="none" style="stroke:' + E + '" stroke-width="2" stroke-linecap="round"><path d="M110 34q4 6 0 12"/><path d="M114 30q7 10 0 20"/></g>' +
            '<g class="holo" opacity="0"><path d="M-18 66h32v17c0 14-10 22-16 26-6-4-16-12-16-26z" fill="#00F0FF" fill-opacity=".14" stroke="#00F0FF" stroke-width="1.3"/><path d="M-14 70h24v13c0 10-7.5 16.5-12 19.5-4.5-3-12-9.5-12-19.5z" fill="none" stroke="#9FFCFF" stroke-width=".6" opacity=".8"/><text x="-2" y="90" transform="translate(-4 0) scale(-1 1)" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="11" fill="#00F0FF" fill-opacity=".6" stroke="#9FFCFF" stroke-width=".5" filter="url(#g' + id + ')">MC</text></g>' +
            '<g class="head">' +
            '<path d="M18 33L15.5 6M102 33l2.5-27" stroke="' + B + '" stroke-width="2.2" stroke-linecap="round"/>' +
            '<circle class="tip" cx="15.3" cy="5" r="2.6"' + f(A) + ' filter="url(#g' + id + ')"/><circle class="tip" cx="104.7" cy="5" r="2.6"' + f(A) + ' filter="url(#g' + id + ')"/>' +
            '<rect x="12.5" y="31" width="10" height="22" rx="5" fill="' + B + '"/><rect x="97.5" y="31" width="10" height="22" rx="5" fill="' + B + '"/>' +
            '<circle cx="18" cy="42" r="6.2" fill="' + J + '"/><circle cx="18" cy="42" r="3.4" fill="' + B + '"/><circle cx="102" cy="42" r="6.2" fill="' + J + '"/><circle cx="102" cy="42" r="3.4" fill="' + B + '"/>' +
            '<rect x="20" y="11" width="80" height="60" rx="30" fill="url(#h' + id + ')"/>' +
            '<path d="M38 16q22-9 44 0" stroke="#000" stroke-width=".8" fill="none" opacity=".3"/><path d="M30 22q8-7 18-9" stroke="#FFFFFF" stroke-width="2.2" fill="none" opacity=".28" stroke-linecap="round"/>' +
            '<path d="M27 64q33 9 66 0" stroke="#000" stroke-width=".7" fill="none" opacity=".25"/><rect x="51" y="14.5" width="18" height="4" rx="2"' + f(E) + ' filter="url(#g' + id + ')"/>' +
            '<g class="face"><rect x="24.5" y="20.5" width="71" height="45" rx="21.5" fill="' + J + '"/><rect x="47" y="61" width="26" height="9" rx="4" fill="' + J + '"/><path d="M53 63.5v4M57 63.5v4M61 63.5v4M65 63.5v4" stroke="#12202F" stroke-width="1.1" stroke-linecap="round"/><rect x="28" y="24" width="64" height="38" rx="18" fill="url(#v' + id + ')"/>' +
            '<ellipse cx="60" cy="43" rx="27" ry="15"' + f(E) + ' opacity=".1"/>' +
            '<path d="M34 31c6-4.5 17-6 26-5" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".22"/>' +
            '<g clip-path="url(#c' + id + ')"><rect class="scan" x="27" y="25" width="66" height="2.6"' + f(E) + ' opacity="0" filter="url(#g' + id + ')"/></g>' +
            '<g class="eyes" filter="url(#g' + id + ')"><circle cx="48" cy="40" r="8.6" fill="none" style="stroke:' + E + '" stroke-width="1.5" opacity=".75"/><circle cx="72" cy="40" r="8.6" fill="none" style="stroke:' + E + '" stroke-width="1.5" opacity=".75"/><ellipse class="eye" cx="48" cy="40" rx="6.2" ry="7.4"' + f(E) + '/><ellipse class="eye" cx="72" cy="40" rx="6.2" ry="7.4"' + f(E) + '/></g>' +
            '<g class="glasses" opacity="0"><rect x="35" y="33" width="24" height="14" rx="6" fill="#04070C" stroke="#C9D2DE" stroke-width="1.2"/><rect x="61" y="33" width="24" height="14" rx="6" fill="#04070C" stroke="#C9D2DE" stroke-width="1.2"/><path d="M59 38h2" stroke="#C9D2DE" stroke-width="1.6"/></g>' +
            '<path class="mouth" d="M53 50q7 4.5 14 0" style="stroke:' + E + '" stroke-width="2.4" stroke-linecap="round" fill="none" filter="url(#g' + id + ')"/></g>' +
            '</g>' +
            '</g></g></svg>';
    }
    var MOUTH = { normal: "M53 50q7 4.5 14 0", happy: "M51 49q9 7 18 0", yay: "M50 48q10 9 20 0", think: "M55 51h10", scan: "M55 51h10",
        listen: "M55 50q5 3 10 0", point: "M53 50q7 4 14 0", call: "M53 50q7 4.5 14 0", code: "M55 51h10", read: "M55 50q5 2 10 0", throw: "M51 49q9 7 18 0", pro: "M52 49q8 5 16 0", cool: "M51 48q9 8 18 0", heroland: "M54 51h12", herocross: "M53 50q7 3 14 0", heroshield: "M54 51q6 2 12 0", hero: "M51 49q9 6 18 0", dizzy: "M53 51q3.5-3 7 0t7 0", error: "M54 52q6-3 12 0", help: "M54 51q6 2 12 0", wow: "M57.5 51a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0", sleep: "M56 51q4 2 8 0" };
    function Bot(host, opts) {
        this.host = host;
        opts = opts || {};
        host.innerHTML = markup("m" + (uid++));
        var q = function (s) { return host.querySelector(s); };
        this.root = q(".root");
        this.head = q(".head");
        this.face = q(".face");
        this.eyesG = q(".eyes");
        this.eyes = host.querySelectorAll(".eye");
        this.mouth = q(".mouth");
        this.armR = q(".armR");
        this.armL = q(".armL");
        this.foreR = q(".foreR");
        this.foreL = q(".foreL");
        this.emb = q(".emb");
        this.body = q(".body");
        var tps = host.querySelectorAll(".tip");
        this.tip = { setAttribute: function (k, v) { for (var i = 0; i < tps.length; i++)
                tps[i].setAttribute(k, v); } };
        this.chest = q(".chest");
        this.core = q(".core");
        this.shadow = q(".shadow");
        this.scan = q(".scan");
        this.flames = q(".flames");
        this.holo = q(".holo");
        this.cape = q(".cape");
        this.suit = q(".suit");
        this.phone = q(".phone");
        this.tablet = q(".tablet");
        this.kbd = q(".kbd");
        this.waves = q(".waves");
        this.glasses = q(".glasses");
        this.flying = false;
        this.spin0 = -1;
        this.confetti = q(".confetti");
        this.zzz = q(".zzz");
        this.hx = 0;
        this.hy = 0;
        this.mood = "normal";
        this.moodUntil = 0;
        this.mood0 = 0;
        this.blinkAt = performance.now() + 1500 + Math.random() * 2000;
        this.wave0 = -1;
        this.waveDur = 0;
        this.jump0 = -1;
        this.range = opts.range || 260;
        bots.push(this);
    }
    Bot.prototype.wave = function (ms) { this.wave0 = performance.now(); this.waveDur = ms || 1300; };
    Bot.prototype.jump = function () { if (!reduced)
        this.jump0 = performance.now(); };
    Bot.prototype.setMood = function (m, ms) {
        this.mood = m;
        this.mood0 = performance.now();
        this.moodUntil = ms ? performance.now() + ms : 0;
        var c = (m === "error" || m === "help") ? "var(--msbot-acc,#E8A33D)" : "var(--msbot-eye,#5FD4FF)";
        for (var i = 0; i < this.eyes.length; i++)
            this.eyes[i].style.fill = c;
        this.mouth.style.stroke = c;
        this.mouth.style.fill = m === "wow" ? c : "none";
        this.mouth.setAttribute("d", MOUTH[m] || MOUTH.normal);
    };
    Bot.prototype.tick = function (t) {
        if (this.moodUntil && t > this.moodUntil) {
            this.moodUntil = 0;
            this.setMood("normal");
        }
        var r = this.host.getBoundingClientRect();
        if (!r.width)
            return;
        var m = this.mood, cx = r.left + r.width / 2, cy = r.top + r.height * .35;
        var p = focusPt || pointer, tx = 0, ty = 0;
        var dist = Math.hypot(p.x - cx, p.y - cy);
        if (!reduced) {
            var far = !focusPt && (t - pointer.t > 5000 || dist > this.range * 1.9);
            if (far) {
                tx = Math.sin(t / 2300) * .35;
                ty = Math.sin(t / 3100) * .2;
            }
            else {
                tx = Math.max(-1, Math.min(1, (p.x - cx) / this.range));
                ty = Math.max(-1, Math.min(1, (p.y - cy) / this.range));
            }
        }
        if (m === "think" || m === "scan") {
            tx = Math.sin(t / 500) * .3;
            ty = -.7;
        }
        if (m === "sleep") {
            tx = 0;
            ty = .6;
        }
        if (m === "read" || m === "code") {
            ty = .55;
            tx *= .3;
        }
        this.hx += (tx - this.hx) * .12;
        this.hy += (ty - this.hy) * .12;
        var breath = reduced ? 0 : Math.sin(t / (m === "sleep" ? 1200 : 650)) * (m === "sleep" ? 1.8 : 1.1);
        var tilt = 0;
        if (m === "think" || m === "scan")
            tilt = 8;
        if (m === "listen")
            tilt = -7;
        if (m === "sleep")
            tilt = 7;
        if (m === "error" && !reduced)
            tilt = Math.sin((t - this.mood0) / 70) * 5 * Math.max(0, 1 - (t - this.mood0) / 600);
        var jy = 0, sq = 1;
        if (this.jump0 >= 0) {
            var jp = (t - this.jump0) / 480;
            if (jp >= 1) {
                this.jump0 = -1;
            }
            else {
                jy = -Math.sin(Math.PI * jp) * 13;
                sq = 1 - .35 * Math.sin(Math.PI * jp);
            }
        }
        if ((m === "help" || m === "yay") && !reduced)
            jy += -Math.abs(Math.sin(t / 170)) * 3;
        if (m === "wow" && !reduced) {
            var wp0 = (t - this.mood0) / 300;
            if (wp0 < 1)
                jy += -Math.sin(Math.PI * wp0) * 6;
        }
        var rot = 0;
        if (this.spin0 >= 0) {
            var sp0 = (t - this.spin0) / 750;
            if (sp0 >= 1)
                this.spin0 = -1;
            else
                rot = 360 * (1 - Math.pow(1 - sp0, 3));
        }
        if (this.flying) {
            jy += Math.sin(t / 90) * 1.2;
        }
        if (m === "heroland")
            jy += 7;
        this.root.setAttribute("transform", "translate(0 " + jy.toFixed(2) + ") rotate(" + rot.toFixed(1) + " 60 80)");
        if (this.flying) {
            var fs = .75 + Math.random() * .5;
            this.flames.setAttribute("opacity", "1");
            this.flames.setAttribute("transform", "translate(0 135) scale(1 " + fs.toFixed(2) + ") translate(0 -135)");
        }
        else
            this.flames.setAttribute("opacity", "0");
        this.shadow.setAttribute("rx", (26 * sq).toFixed(2));
        this.body.setAttribute("transform", "translate(0 " + (breath * .4).toFixed(2) + ")");
        this.head.setAttribute("transform", "translate(" + (-this.hx * 3).toFixed(2) + " " + (this.hy * 2 + breath).toFixed(2) + ") rotate(" + (-this.hx * 9 + tilt).toFixed(2) + " 60 66)");
        this.face.setAttribute("transform", "translate(" + (-this.hx * 6).toFixed(2) + " " + (this.hy * 4).toFixed(2) + ")");
        this.eyesG.setAttribute("transform", "translate(" + (-this.hx * 2.5).toFixed(2) + " " + (this.hy * 2).toFixed(2) + ")");
        var ry = 7, rx = 6, cyE = 40;
        if (m === "happy" || m === "yay") {
            ry = 3.2;
            cyE = 38.5;
        }
        if (m === "listen") {
            ry = 8;
            rx = 6.5;
        }
        if (m === "wow") {
            ry = 8.5;
            rx = 7;
        }
        if (m === "error" || m === "help") {
            ry = 5.5;
        }
        if (m === "sleep") {
            ry = .9;
            cyE = 42;
        }
        if (m === "dizzy") {
            ry = 4;
            rx = 4;
        }
        if (m === "code") {
            ry = 5;
        }
        if (m === "read") {
            ry = 5.5;
            cyE = 42;
        }
        if (m === "call") {
            ry = 6;
        }
        if (m !== "sleep" && t > this.blinkAt) {
            var bp = (t - this.blinkAt) / 150;
            if (bp >= 1) {
                this.blinkAt = t + (Math.random() < .2 ? 220 : 2400 + Math.random() * 3200);
            }
            else {
                ry *= 1 - Math.sin(Math.PI * bp) * .9;
            }
        }
        for (var i = 0; i < this.eyes.length; i++) {
            this.eyes[i].setAttribute("ry", ry.toFixed(2));
            this.eyes[i].setAttribute("rx", rx);
            this.eyes[i].setAttribute("cy", cyE);
        }
        if (m === "scan") {
            var sy = 27 + ((t - this.mood0) / 900 % 1) * 30;
            this.scan.setAttribute("y", sy.toFixed(1));
            this.scan.setAttribute("opacity", ".85");
        }
        else
            this.scan.setAttribute("opacity", "0");
        var a = breath * 1.5, aL = -breath * 1.2, eR = -8, eL = 18;
        if (m === "yay") {
            a = -150 + Math.sin(t / 120) * 10;
            aL = 115 + Math.sin(t / 120) * 10;
            eR = -10;
            eL = 10;
        }
        if (m === "help") {
            aL = 62 + Math.sin(t / 300) * 4;
            eL = -25;
        }
        if (m === "error") {
            aL = -8;
            eL = 28;
        }
        if (m === "listen") {
            eR = -30;
        }
        if (m === "think" || m === "scan") {
            a = -25;
            eR = -105;
        }
        if (m === "sleep") {
            a = 6;
            aL = -6;
            eR = 0;
            eL = 6;
        }
        if (this.wave0 >= 0) {
            var wp = (t - this.wave0) / this.waveDur;
            if (wp >= 1) {
                this.wave0 = -1;
            }
            else {
                var env = Math.min(1, wp * 5, (1 - wp) * 5);
                var osc = Math.sin((t - this.wave0) / 95);
                a = -env * 135;
                eR = -env * (25 + osc * 30);
            }
        }
        var dt = t - this.mood0;
        if (m === "call") {
            a = -165;
            eR = 5;
        }
        if (m === "code") {
            a = 15;
            eR = 72 + Math.sin(t / 55) * 12;
            aL = -15;
            eL = -72 + Math.sin(t / 55 + 1.6) * 12;
        }
        if (m === "read") {
            a = 14;
            eR = 62;
            aL = -14;
            eL = -62;
        }
        if (m === "throw") {
            var tp = Math.min(1, dt / 420), ez = tp < 1 ? 1 - Math.pow(1 - tp, 3) : 1;
            a = -170 + ez * 140;
            eR = -70 + ez * 70;
        }
        if (m === "hero") {
            a = -32;
            eR = 105;
            aL = 32;
            eL = -105;
        }
        if (m === "heroland") {
            a = -12;
            eR = -8;
            aL = 45;
            eL = -20;
        }
        if (m === "herocross") {
            a = 38;
            eR = 85;
            aL = -38;
            eL = -85;
        }
        if (m === "heroshield") {
            a = -35;
            eR = -30;
            aL = 135;
            eL = -25;
        }
        if (m === "point") {
            a = -92;
            eR = -12;
        }
        if (this.flying) {
            a = -168;
            eR = -4;
            aL = 20;
            eL = 30;
        }
        var heroOn = this.flying || m.indexOf("hero") === 0;
        this.cape.setAttribute("opacity", heroOn ? "1" : "0");
        if (heroOn)
            this.cape.setAttribute("transform", "translate(60 77) skewX(" + (Math.sin(t / 180) * (this.flying ? 14 : 5)).toFixed(1) + ") scale(1 " + (this.flying ? .85 : 1) + ") translate(-60 -77)");
        this.suit.setAttribute("opacity", m === "pro" ? "1" : "0");
        this.glasses.setAttribute("opacity", m === "cool" ? "1" : "0");
        this.phone.setAttribute("opacity", m === "call" ? "1" : "0");
        this.waves.setAttribute("opacity", m === "call" ? (.4 + .6 * Math.abs(Math.sin(t / 260))).toFixed(2) : "0");
        this.tablet.setAttribute("opacity", m === "read" ? "1" : "0");
        this.holo.setAttribute("opacity", (m === "help" || m === "error" || m === "heroshield" || m === "scan") ? (.8 + .2 * Math.sin(t / 90)).toFixed(2) : "0");
        this.kbd.setAttribute("opacity", m === "code" ? (.75 + .25 * Math.sin(t / 90)).toFixed(2) : "0");
        this.armR.setAttribute("transform", "rotate(" + a.toFixed(2) + " 89 81)");
        this.foreR.setAttribute("transform", "rotate(" + eR.toFixed(2) + " 89 98)");
        this.armL.setAttribute("transform", "rotate(" + aL.toFixed(2) + " 31 81)");
        this.foreL.setAttribute("transform", "rotate(" + eL.toFixed(2) + " 31 98)");
        var sp = (m === "error" || m === "help") ? 140 : ((m === "think" || m === "scan") ? 200 : (m === "listen" ? 350 : 700));
        this.tip.setAttribute("opacity", m === "sleep" ? ".25" : (.55 + .45 * Math.sin(t / sp)).toFixed(2));
        this.chest.setAttribute("opacity", (.55 + .45 * Math.sin(t / 900)).toFixed(2));
        this.core.setAttribute("r", (2.2 + .5 * Math.sin(t / (m === "scan" ? 150 : 900))).toFixed(2));
        if (m === "yay") {
            var cp = ((t - this.mood0) / 1400) % 1;
            this.confetti.setAttribute("opacity", (1 - cp).toFixed(2));
            this.confetti.setAttribute("transform", "translate(0 " + (-cp * 10).toFixed(1) + ")");
        }
        else
            this.confetti.setAttribute("opacity", "0");
        if (m === "sleep") {
            var zp = ((t - this.mood0) / 2000) % 1;
            this.zzz.setAttribute("opacity", (Math.sin(Math.PI * zp)).toFixed(2));
            this.zzz.setAttribute("transform", "translate(" + (zp * 4).toFixed(1) + " " + (-zp * 6).toFixed(1) + ")");
        }
        else
            this.zzz.setAttribute("opacity", "0");
    };
    var THEMES = {
        msec: { name: "M-SEC", dark: "#0B2A4A", acc: "#E8A33D", eye: "#FFB547", emblem: "MC" },
        portfolio: { name: "Portfolio", dark: "#0C0D14", acc: "#6366F1", eye: "#22D3EE", emblem: "OM" },
        malaika: { name: "Malaika Ranch", dark: "#23402C", acc: "#D9A441", eye: "#F5CB6E", emblem: "MR" },
        pos: { name: "POS Pro", dark: "#102A43", acc: "#2BB673", eye: "#6EE7A8", emblem: "POS" }
    };
    var currentTheme = THEMES.msec;
    var extra3d = [];
    function shade(hex, amt) {
        var n = parseInt(hex.slice(1), 16), rgb = [n >> 16, (n >> 8) & 255, n & 255].map(function (v) { return Math.round(amt > 0 ? v + (255 - v) * amt : v * (1 + amt)); });
        return "#" + rgb.map(function (v) { return ("0" + v.toString(16)).slice(-2); }).join("");
    }
    function applyTheme(key) {
        var th = THEMES[key];
        currentTheme = th;
        var r = document.documentElement.style;
        r.setProperty("--msbot-dark", th.dark);
        r.setProperty("--msbot-acc", th.acc);
        r.setProperty("--msbot-eye", th.eye);
        r.setProperty("--msbot-hi", shade(th.dark, .28));
        r.setProperty("--msbot-deep", shade(th.dark, -.55));
        r.setProperty("--msbot-acc-hi", shade(th.acc, .45));
        r.setProperty("--msbot-acc-deep", shade(th.acc, -.45));
        bots.forEach(function (b) {
            if (b.emb) {
                b.emb.textContent = th.emblem;
                b.emb.setAttribute("font-size", th.emblem.length > 2 ? 7.5 : (th.emblem.length > 1 ? 10 : 12));
            }
            if (b.setMood)
                b.setMood(b.mood, b.moodUntil ? Math.max(1, b.moodUntil - performance.now()) : 0);
        });
        if (three3d)
            three3d.applyTheme(th);
        extra3d.forEach(function (b) { if (b.applyTheme)
            b.applyTheme(th); });
    }
    var fpsWatch = { t0: 0, n: 0, slow: 0 };
    function loop(t) {
        var i;
        for (i = 0; i < bots.length; i++)
            bots[i].tick(t);
        if (three3d)
            three3d.tick(t);
        for (var j = 0; j < extra3d.length; j++)
            extra3d[j].tick(t);
        if (three3d && !reduced) {
            if (!fpsWatch.t0) {
                fpsWatch.t0 = t;
                fpsWatch.n = 0;
            }
            fpsWatch.n += 1;
            if (t - fpsWatch.t0 >= 1000) {
                var fps = fpsWatch.n * 1000 / (t - fpsWatch.t0);
                fpsWatch.slow = fps < 40 ? fpsWatch.slow + 1 : 0;
                if (fpsWatch.slow >= 3 && typeof fallback3d === 'function')
                    fallback3d();
                fpsWatch.t0 = t;
                fpsWatch.n = 0;
            }
        }
        else if (!three3d) {
            fpsWatch.t0 = 0;
            fpsWatch.slow = 0;
        }
        requestAnimationFrame(loop);
    }
    function mark(e) { pointer.x = e.clientX; pointer.y = e.clientY; pointer.t = performance.now(); }
    addEventListener("pointermove", mark, { passive: true });
    addEventListener("pointerdown", mark, { passive: true });
    function fieldPt(el) { var r = el.getBoundingClientRect(); return { x: r.left + Math.min(r.width - 10, 20 + (el.value || "").length * 8), y: r.top + r.height / 2 }; }
    document.addEventListener("focusin", function (e) { var el = e.target; if (el.matches && el.matches("input,textarea,select"))
        focusPt = fieldPt(el); });
    document.addEventListener("focusout", function () { focusPt = null; pointer.t = performance.now(); });
    var CAT = [], BYID = {};
    var FAMS = { field: "Champs de formulaire", auth: "Connexion et compte", nav: "Navigation", pointer: "Souris et toucher", keys: "Clavier",
        idle: "Attention et inactivité", env: "Appareil et réseau", chat: "Discussion", shop: "Boutique et caisse", moment: "Moments et réussites" };
    function B(id, fam, mood, fx, fr, live, quiet) { var e = { id: id, fam: fam, mood: mood, fx: fx || "", fr: fr || "", live: !!live, quiet: !!quiet }; CAT.push(e); BYID[id] = e; }
    var FIELDS = [
        ["email", "e-mail", "Il manque votre e-mail.", "Cet e-mail semble incomplet : il faut la forme nom@entreprise.cd."],
        ["password", "mot de passe", "Le mot de passe est obligatoire.", "Ce mot de passe ne respecte pas les règles demandées."],
        ["tel", "téléphone", "Indiquez un numéro de téléphone.", "Le numéro doit compter 9 à 15 chiffres, par exemple +243 81 234 5678."],
        ["url", "site web", "Indiquez l'adresse du site.", "Une adresse web commence par https://."],
        ["number", "nombre", "Indiquez un nombre.", "Ce nombre sort de la plage autorisée."],
        ["date", "date", "Choisissez une date.", "Cette date n'est pas valide."],
        ["text", "texte", "Ce champ est obligatoire.", "Le texte est trop court."],
        ["textarea", "message", "Décrivez votre besoin en quelques mots.", "Encore un petit effort : 20 caractères minimum."],
        ["select", "liste", "Choisissez une option dans la liste.", "Cette option n'est pas disponible."],
        ["checkbox", "case à cocher", "Cochez la case pour continuer.", "Cette case doit être cochée."],
        ["file", "fichier", "Ajoutez le fichier demandé.", "Ce fichier n'est pas accepté : un PDF de moins de 5 Mo, s'il vous plaît."]
    ];
    FIELDS.forEach(function (f) {
        B("field." + f[0] + ".focus", "field", "listen", "", "Premier clic dans le champ " + f[1] + " : MSBot écoute.", true, true);
        B("field." + f[0] + ".empty", "field", "error", "flyto", f[2], true);
        B("field." + f[0] + ".format", "field", "error", "flyto", f[3], true);
        B("field." + f[0] + ".fixed", "field", "happy", "sparkle", "C'est corrigé, merci !", true);
        B("field." + f[0] + ".valid", "field", "happy", "", "Champ " + f[1] + " valide.", true, true);
    });
    [
        ["auth.login.success", "yay", "confetti+hero", "Connexion réussie. Bon retour parmi nous !", 1],
        ["auth.login.fail1", "error", "shake", "Identifiants incorrects. Vérifiez l'e-mail et le mot de passe.", 1],
        ["auth.login.fail2", "error", "flyto", "Toujours pas. Attention aux majuscules et aux espaces en trop.", 1],
        ["auth.login.fail3", "help", "flyto+shield", "Trois essais ratés. Voulez-vous de l'aide ou réinitialiser le mot de passe ?", 1],
        ["auth.capslock.on", "wow", "", "Attention : les majuscules sont verrouillées.", 1],
        ["auth.capslock.off", "happy", "", "Majuscules désactivées.", 1, 1],
        ["auth.reveal.show", "wow", "", "Mot de passe visible : vérifiez que personne ne regarde votre écran.", 1],
        ["auth.reveal.hide", "happy", "shield", "Mot de passe masqué.", 1, 1],
        ["auth.logout", "happy", "wave", "Vous êtes déconnecté. À bientôt !", 1],
        ["auth.password.weak", "error", "", "Mot de passe faible : ajoutez des chiffres et des majuscules.", 1],
        ["auth.password.medium", "listen", "", "Pas mal. Encore un peu plus long ?", 1, 1],
        ["auth.password.strong", "yay", "shield", "Excellent mot de passe. Votre compte est bien protégé.", 1],
        ["auth.confirm.mismatch", "error", "flyto", "Les deux mots de passe ne correspondent pas.", 1],
        ["auth.confirm.match", "happy", "sparkle", "Les mots de passe correspondent.", 1],
        ["auth.signup.success", "yay", "confetti+roll", "Compte créé. Bienvenue !", 1],
        ["auth.session.expired", "help", "tele", "Votre session a expiré. Reconnectez-vous pour continuer.", 0],
        ["auth.2fa.asked", "listen", "scan", "Saisissez le code reçu par SMS ou dans votre application.", 0],
        ["auth.2fa.wrong", "error", "shake", "Ce code est incorrect ou expiré.", 0],
        ["auth.reset.sent", "happy", "rocket", "Le lien de réinitialisation est parti. Regardez votre boîte de réception.", 0],
        ["auth.account.locked", "help", "shield", "Compte bloqué après trop d'essais. Réessayez dans 15 minutes ou contactez le support.", 0]
    ].forEach(function (x) { B(x[0], "auth", x[1], x[2], x[3], x[4], x[5]); });
    [
        ["nav.welcome.morning", "happy", "flyin", "Bonjour ! Je suis MSBot. Une question ? Cliquez sur moi.", 1],
        ["nav.welcome.afternoon", "happy", "flyin", "Bon après-midi ! Je suis MSBot, l'assistant de M-SEC.", 1],
        ["nav.welcome.evening", "happy", "flyin", "Bonsoir ! Je suis MSBot. Je reste là si besoin.", 1],
        ["nav.welcome.night", "happy", "flyin", "Vous travaillez tard ! MSBot veille avec vous.", 1],
        ["nav.visit.first", "happy", "", "Première visite : bienvenue chez M-SEC.", 1, 1],
        ["nav.visit.return", "happy", "wave", "Content de vous revoir !", 1],
        ["nav.scroll.25", "listen", "", "Lecture commencée.", 1, 1],
        ["nav.scroll.50", "happy", "", "À mi-page.", 1, 1],
        ["nav.scroll.75", "happy", "", "Presque au bout.", 1, 1],
        ["nav.scroll.100", "yay", "sparkle", "Vous avez tout lu ! Une question sur ce que vous avez vu ?", 1],
        ["nav.scroll.top", "happy", "rocket", "Retour en haut de la page.", 1, 1],
        ["nav.scroll.fast", "wow", "", "Vous cherchez quelque chose ? Je peux vous l'indiquer.", 1],
        ["nav.scroll.back", "listen", "", "Vous remontez : besoin de retrouver une information ?", 1, 1],
        ["nav.section.connexion", "listen", "", "Section connexion.", 1, 1],
        ["nav.section.formulaire", "listen", "", "Je peux vous aider à remplir ce formulaire.", 1],
        ["nav.section.boutique", "happy", "", "Bienvenue dans la boutique.", 1, 1],
        ["nav.section.bibliotheque", "scan", "", "Voici tout ce que je sais faire.", 1, 1],
        ["nav.anchor", "happy", "tele", "Je vous emmène à la bonne section.", 1, 1],
        ["nav.external", "wave", "", "Ce lien s'ouvre dans un nouvel onglet.", 1, 1],
        ["nav.404", "help", "tele", "Cette page n'existe pas. Je vous ramène à l'accueil ?", 0],
        ["nav.reload", "wow", "", "Page rechargée.", 1, 1],
        ["nav.read.long", "happy", "", "Vous lisez attentivement. Voulez-vous un résumé ?", 0]
    ].forEach(function (x) { B(x[0], "nav", x[1], x[2], x[3], x[4], x[5]); });
    [
        ["pointer.hover", "happy", "", "Salut ! Vous pouvez me demander quelque chose.", 1],
        ["pointer.hover.long", "happy", "wave", "Je ne mords pas : cliquez pour discuter !", 1],
        ["pointer.click", "happy", "jump", "Ouverture de la discussion.", 1, 1],
        ["pointer.dblclick", "yay", "roll", "Wouhou !", 1],
        ["pointer.tripleclick", "hero", "hero", "MSBot, gardien de vos données !", 1],
        ["pointer.pet", "happy", "sparkle", "Hihi, ça chatouille !", 1],
        ["pointer.circle", "dizzy", "", "Vous me donnez le tournis…", 1],
        ["pointer.drag", "wow", "", "Hop, je change de place.", 1, 1],
        ["pointer.rage", "help", "flyto", "Ça ne réagit pas comme prévu ? Dites-moi ce que vous cherchez.", 1],
        ["pointer.deadclick", "listen", "", "Cet élément n'est pas cliquable. Je peux vous orienter.", 1],
        ["pointer.exit", "help", "wave", "Avant de partir : une question à laquelle je peux répondre ?", 1],
        ["pointer.fast", "wow", "", "Whoa, quelle vitesse !", 1, 1],
        ["pointer.rightclick", "listen", "", "Clic droit repéré.", 1, 1],
        ["pointer.select", "listen", "", "Texte sélectionné : je peux l'expliquer si besoin.", 1],
        ["pointer.copy", "happy", "sparkle", "Copié !", 1],
        ["pointer.paste", "listen", "", "Texte collé dans le champ.", 1, 1],
        ["pointer.cta", "happy", "", "Bon choix : c'est par ici.", 1, 1],
        ["pointer.whatsapp", "happy", "", "Ce bouton ouvre WhatsApp avec votre commande pré-remplie.", 0],
        ["pointer.price", "listen", "", "Une question sur ce prix ?", 0],
        ["contact.call", "call", "", "J'appelle M-SEC… Sur le site, votre téléphone compose le numéro.", 1],
        ["contact.mail", "throw", "plane", "Je prépare votre e-mail : l'avion en papier décolle !", 1],
        ["contact.linkedin", "pro", "sparkle", "Costume enfilé : direction LinkedIn !", 1],
        ["contact.whatsapp", "call", "", "On passe sur WhatsApp : je vous ouvre la conversation.", 1],
        ["contact.hover.phone", "call", "", "Cliquez pour appeler M-SEC.", 1],
        ["intent.quote", "yay", "confetti", "Super, un projet ! Je vous accompagne pour le devis.", 1],
        ["intent.services", "happy", "sparkle", "Bon choix de service. Une question dessus ?", 1],
        ["intent.quote.form", "yay", "", "Vous préparez un devis : j'adore ça !", 1],
        ["nav.blog", "read", "", "Bonne lecture ! Je lis avec vous.", 1]
    ].forEach(function (x) { B(x[0], "pointer", x[1], x[2], x[3], x[4], x[5]); });
    [
        ["keys.tab", "listen", "", "Navigation au clavier : MSBot suit le champ actif.", 1, 1],
        ["keys.escape", "happy", "", "Échap : fermé.", 1, 1],
        ["keys.fast", "wow", "", "Vous tapez vite !", 1, 1],
        ["keys.hesitate", "listen", "", "Vous hésitez ? Je peux vous suggérer une formulation.", 1],
        ["keys.pause", "listen", "", "Prenez votre temps.", 1, 1],
        ["keys.help", "happy", "wave", "Raccourci : appuyez sur « ? » à tout moment pour m'appeler.", 1],
        ["keys.find", "scan", "", "Vous cherchez un mot ? Demandez-le-moi directement.", 1],
        ["keys.enter", "happy", "", "Validé avec Entrée.", 1, 1],
        ["keys.konami", "hero", "hero+confetti", "Code secret ! Mode super-héros activé.", 1],
        ["keys.shortcut.chat", "happy", "jump", "Alt + M ouvre la discussion.", 1, 1]
    ].forEach(function (x) { B(x[0], "keys", x[1], x[2], x[3], x[4], x[5]); });
    [
        ["idle.look", "normal", "", "Personne ne bouge : MSBot regarde autour de lui.", 1, 1],
        ["idle.invite", "help", "wave", "Vous cherchez quelque chose ? Je peux vous orienter vers le bon service.", 1],
        ["idle.sleep", "sleep", "", "MSBot s'assoupit…", 1, 1],
        ["idle.wake", "wow", "jump", "Oh ! Vous revoilà.", 1],
        ["idle.tab.hidden", "sleep", "", "Onglet en arrière-plan : animations en pause.", 1, 1],
        ["idle.tab.back", "happy", "wave", "Re-bonjour !", 1, 1],
        ["idle.tab.backlong", "happy", "flyin", "Bon retour ! On reprend où vous en étiez ?", 1],
        ["idle.blur", "listen", "", "Fenêtre en arrière-plan.", 1, 1],
        ["idle.focus", "happy", "", "Fenêtre revenue.", 1, 1],
        ["idle.frozen", "help", "shield", "Rien ne se passe ? La page fonctionne, je peux vous guider.", 0]
    ].forEach(function (x) { B(x[0], "idle", x[1], x[2], x[3], x[4], x[5]); });
    [
        ["env.offline", "error", "shield", "Connexion perdue. Vos saisies sont gardées, je préviens dès le retour du réseau.", 1],
        ["env.online", "yay", "sparkle", "Connexion rétablie !", 1],
        ["env.slow", "listen", "scan", "Le réseau est lent : patience, ça charge.", 0],
        ["env.loading.long", "scan", "scan", "Chargement plus long que prévu…", 0],
        ["env.loading.done", "happy", "", "Chargé.", 0, 1],
        ["env.mobile", "happy", "tele", "Format téléphone : je me fais plus petit.", 1, 1],
        ["env.desktop", "happy", "tele", "Grand écran.", 1, 1],
        ["env.orientation", "wow", "", "Rotation de l'écran.", 1, 1],
        ["env.theme.dark", "wow", "tele", "Mode sombre : vision nocturne activée.", 1],
        ["env.theme.light", "cool", "sparkle", "Que de lumière ! Lunettes de soleil de rigueur.", 1],
        ["env.reducedmotion", "normal", "", "Animations réduites à la demande de votre appareil.", 1, 1],
        ["env.lowpower", "sleep", "", "Appareil peu puissant : animations allégées.", 0, 1]
    ].forEach(function (x) { B(x[0], "env", x[1], x[2], x[3], x[4], x[5]); });
    [
        ["chat.open", "happy", "jump+wave", "Bonjour !", 1, 1],
        ["chat.close", "happy", "wave", "Merci d'avoir choisi M-SEC. À très bientôt !", 1],
        ["chat.reopen", "happy", "", "Re-bonjour !", 1, 1],
        ["chat.typing", "listen", "", "Le visiteur écrit.", 1, 1],
        ["chat.send", "scan", "", "Question envoyée.", 1, 1],
        ["chat.answer", "happy", "", "Réponse trouvée.", 1, 1],
        ["chat.unknown", "listen", "", "Question non comprise : MSBot demande de reformuler.", 1, 1],
        ["chat.suggestion", "happy", "", "Suggestion choisie.", 1, 1],
        ["chat.like", "yay", "sparkle", "Merci pour votre retour !", 1],
        ["chat.dislike", "listen", "", "Merci, je transmets pour m'améliorer.", 1],
        ["chat.copy", "happy", "sparkle", "Réponse copiée.", 0, 1],
        ["chat.first", "happy", "", "Premier message de la visite.", 1, 1],
        ["chat.long", "scan", "scan", "Réponse détaillée en préparation…", 0, 1],
        ["chat.link", "happy", "", "La réponse contient un lien utile.", 0, 1],
        ["chat.provider.error", "error", "glitch", "Petit souci technique. Réessayez dans un instant.", 0],
        ["chat.ratelimit", "sleep", "", "Beaucoup de questions d'un coup : je reprends dans une minute.", 0],
        ["chat.quota", "sleep", "", "Assistant en pause pour aujourd'hui. Écrivez-nous sur WhatsApp.", 0],
        ["chat.lead", "yay", "confetti", "Vos coordonnées sont transmises : un conseiller vous recontacte.", 0],
        ["chat.handoff", "wave", "rocket", "Je vous mets en relation avec un membre de l'équipe M-SEC.", 1],
        ["chat.coding", "code", "morse", "MSBot tape votre message au télégraphe.", 1, 1]
    ].forEach(function (x) { B(x[0], "chat", x[1], x[2], x[3], x[4], x[5]); });
    [
        ["shop.cart.add", "yay", "fly-cart", "Ajouté au panier !", 1],
        ["shop.cart.add.many", "yay", "confetti", "Beau panier !", 1],
        ["shop.cart.remove", "listen", "", "Retiré du panier.", 0, 1],
        ["shop.cart.empty", "listen", "", "Votre panier est vide.", 0],
        ["shop.out.click", "help", "", "Ce produit est en rupture. Je vous préviens dès son retour ?", 1],
        ["shop.search.found", "happy", "", "Résultats trouvés.", 1, 1],
        ["shop.search.none", "help", "scan", "Aucun résultat. Essayez un autre mot, ou demandez-moi.", 1],
        ["shop.promo.valid", "yay", "confetti", "Code promo appliqué !", 1],
        ["shop.promo.invalid", "error", "shake", "Ce code promo n'est pas valide.", 1],
        ["shop.checkout.start", "happy", "", "Commande en cours.", 0, 1],
        ["shop.order.whatsapp", "yay", "rocket", "Commande prête : WhatsApp s'ouvre avec votre panier.", 0],
        ["shop.filter", "scan", "", "Filtre appliqué.", 0, 1],
        ["pos.sale.done", "yay", "sparkle", "Vente enregistrée.", 0],
        ["pos.sale.offline", "listen", "shield", "Vente enregistrée hors ligne : elle sera synchronisée.", 0],
        ["pos.sync.done", "happy", "sparkle", "Synchronisation terminée.", 0],
        ["pos.sync.fail", "error", "glitch", "Synchronisation impossible. Nouvelle tentative automatique.", 0],
        ["pos.drawer.closed", "yay", "confetti", "Caisse clôturée. Bonne fin de journée !", 0],
        ["pos.scan.ok", "happy", "scan", "Article scanné.", 0, 1],
        ["pos.scan.fail", "error", "", "Code-barres non reconnu.", 0],
        ["pos.stock.low", "help", "shield", "Stock bas sur un article.", 0],
        ["pos.subscription.expiring", "help", "", "Votre abonnement expire bientôt.", 0]
    ].forEach(function (x) { B(x[0], "shop", x[1], x[2], x[3], x[4], x[5]); });
    [
        ["moment.form.success", "yay", "confetti+hero", "Demande envoyée ! L'équipe M-SEC vous répond rapidement.", 1],
        ["moment.form.errors3", "help", "flyto", "Besoin d'un coup de main ? Pas de souci, je suis là pour vous accompagner !", 1],
        ["moment.session.long", "happy", "wave", "Merci pour votre temps sur le site !", 1],
        ["moment.newyear", "yay", "confetti", "Bonne année !", 1],
        ["moment.independence", "yay", "confetti", "Joyeuse fête de l'Indépendance !", 1],
        ["moment.christmas", "yay", "confetti", "Joyeux Noël !", 1],
        ["moment.download", "happy", "rocket", "Téléchargement lancé.", 0, 1],
        ["moment.newsletter", "yay", "confetti", "Inscription confirmée.", 0],
        ["moment.video", "listen", "", "Bonne vidéo !", 0, 1],
        ["moment.mail.sent", "throw", "plane", "E-mail envoyé ! L'avion en papier est parti.", 1],
        ["moment.entrance", "heroland", "shatter", "MSBot entre en scène !", 1, 1]
    ].forEach(function (x) { B(x[0], "moment", x[1], x[2], x[3], x[4], x[5]); });
    var bubble = null, bubbleTimer = 0;
    function injectStyles() {
        if (document.getElementById('msbot-fx-style'))
            return;
        var s = document.createElement('style');
        s.id = 'msbot-fx-style';
        s.textContent = '.msbot-bubble{position:fixed;z-index:2147483000;right:18px;bottom:94px;max-width:min(20rem,calc(100vw - 2rem));padding:.7rem .85rem;border-radius:1rem;background:rgba(11,42,74,.92);color:#fff;font:500 14px/1.35 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.28);backdrop-filter:blur(14px) saturate(140%);-webkit-backdrop-filter:blur(14px) saturate(140%);animation:msbot-bub .22s ease-out}' +
            '.msbot-bubble .acts{display:flex;gap:.4rem;margin-top:.5rem}.msbot-bubble button{border:0;border-radius:.6rem;padding:.35rem .6rem;background:#E8A33D;color:#101820;font:600 12px system-ui;cursor:pointer}' +
            '.msbot-fx{position:fixed;z-index:2147483000;pointer-events:none;width:6px;height:6px;border-radius:2px}' +
            '@keyframes msbot-bub{from{opacity:0;transform:translateY(6px) scale(.96)}to{opacity:1;transform:none}}' +
            '@media (prefers-reduced-motion: reduce){.msbot-bubble{animation:none}}';
        document.head.appendChild(s);
    }
    function say(text, ms, acts) {
        if (!text)
            return;
        var h0 = document.querySelector('msec-assistant'), pn0 = h0 && h0.shadowRoot && h0.shadowRoot.getElementById('panel');
        if (pn0 && !pn0.hidden)
            return;
        injectStyles();
        hideBubble();
        bubble = document.createElement('div');
        bubble.className = 'msbot-bubble';
        bubble.setAttribute('role', 'status');
        var p = document.createElement('div');
        p.textContent = text;
        bubble.appendChild(p);
        if (acts && acts.length) {
            var box = document.createElement('div');
            box.className = 'acts';
            acts.forEach(function (a) {
                var b = document.createElement('button');
                b.type = 'button';
                b.textContent = a.label;
                b.addEventListener('click', function () { hideBubble(); if (a.fn)
                    a.fn(); });
                box.appendChild(b);
            });
            bubble.appendChild(box);
        }
        document.body.appendChild(bubble);
        try {
            var host = document.querySelector('msec-assistant');
            var lan = host && host.shadowRoot && host.shadowRoot.getElementById('launcher');
            if (lan) {
                var r = lan.getBoundingClientRect();
                bubble.style.bottom = Math.max(8, Math.round(window.innerHeight - r.top + 10)) + 'px';
                bubble.style.right = Math.max(8, Math.round(window.innerWidth - r.right)) + 'px';
            }
            bubble.style.pointerEvents = 'none';
            var btns = bubble.querySelectorAll('button');
            for (var k = 0; k < btns.length; k++)
                btns[k].style.pointerEvents = 'auto';
        }
        catch (e) { }
        clearTimeout(bubbleTimer);
        bubbleTimer = setTimeout(hideBubble, ms || 4200);
    }
    function hideBubble() { if (bubble) {
        bubble.remove();
        bubble = null;
    } }
    function hostRect(bot) { return bot ? bot.host.getBoundingClientRect() : { left: innerWidth - 90, top: innerHeight - 120, width: 60, height: 60 }; }
    function confetti(bot) {
        if (reduced)
            return;
        var r = hostRect(bot), cx = r.left + r.width / 2, cy = r.top + r.height * .3;
        var colors = ['#E8A33D', '#5FD4FF', '#FFFFFF', '#2BB673', '#C9A46A'];
        for (var i = 0; i < 26; i += 1) {
            var d = document.createElement('span');
            d.className = 'msbot-fx';
            d.style.left = cx + 'px';
            d.style.top = cy + 'px';
            d.style.background = colors[i % colors.length];
            document.body.appendChild(d);
            var a = -Math.PI / 2 + (Math.random() - .5) * 2.2, v = 90 + Math.random() * 150;
            var dx = Math.cos(a) * v, dy = Math.sin(a) * v;
            var an = d.animate([
                { transform: 'translate(0,0) rotate(0)', opacity: 1 },
                { transform: 'translate(' + dx.toFixed(0) + 'px,' + (dy + 150).toFixed(0) + 'px) rotate(' + (Math.random() * 540).toFixed(0) + 'deg)', opacity: 0 }
            ], { duration: 900 + Math.random() * 500, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' });
            an.onfinish = function () { d.remove(); };
        }
    }
    function sparkle(bot) {
        if (reduced)
            return;
        var r = hostRect(bot), cx = r.left + r.width / 2, cy = r.top + r.height * .4;
        for (var i = 0; i < 10; i += 1) {
            var d = document.createElement('span');
            d.className = 'msbot-fx';
            d.style.left = cx + 'px';
            d.style.top = cy + 'px';
            d.style.background = '#FFE9B8';
            document.body.appendChild(d);
            var a = Math.random() * Math.PI * 2, dist = 30 + Math.random() * 40;
            var an = d.animate([
                { transform: 'translate(0,0) scale(.4)', opacity: 1 },
                { transform: 'translate(' + (Math.cos(a) * dist).toFixed(0) + 'px,' + (Math.sin(a) * dist).toFixed(0) + 'px) scale(1)', opacity: 0 }
            ], { duration: 620, easing: 'ease-out', fill: 'forwards' });
            an.onfinish = function () { d.remove(); };
        }
    }
    function ring(bot) {
        if (reduced)
            return;
        var r = hostRect(bot), d = document.createElement('span');
        d.className = 'msbot-fx';
        d.style.left = (r.left + r.width / 2) + 'px';
        d.style.top = (r.top + r.height * .6) + 'px';
        d.style.width = '20px';
        d.style.height = '20px';
        d.style.borderRadius = '50%';
        d.style.border = '2px solid #00F0FF';
        d.style.background = 'transparent';
        document.body.appendChild(d);
        var an = d.animate([{ transform: 'scale(.3)', opacity: .9 }, { transform: 'scale(4)', opacity: 0 }], { duration: 700, easing: 'ease-out', fill: 'forwards' });
        an.onfinish = function () { d.remove(); };
    }
    function plane(bot) {
        if (reduced)
            return;
        var r = hostRect(bot), d = document.createElement('span');
        d.className = 'msbot-fx';
        d.style.left = (r.left + r.width / 2) + 'px';
        d.style.top = (r.top + r.height * .4) + 'px';
        d.style.width = '0';
        d.style.height = '0';
        d.style.borderLeft = '9px solid transparent';
        d.style.borderRight = '9px solid transparent';
        d.style.borderBottom = '14px solid #E8A33D';
        document.body.appendChild(d);
        var an = d.animate([
            { transform: 'translate(0,0) rotate(0)', opacity: 1 },
            { transform: 'translate(' + (innerWidth * .35).toFixed(0) + 'px,-' + (innerHeight * .35).toFixed(0) + 'px) rotate(35deg)', opacity: 0 }
        ], { duration: 1500, easing: 'cubic-bezier(.3,.7,.2,1)', fill: 'forwards' });
        an.onfinish = function () { d.remove(); };
    }
    function morse(bot) {
        if (reduced)
            return;
        var r = hostRect(bot), cx = r.left + r.width / 2, cy = r.top - 6;
        for (var i = 0; i < 7; i += 1) {
            var dash = i % 3 === 1;
            var d = document.createElement('span');
            d.className = 'msbot-fx';
            d.style.left = (cx - 30 + i * 9) + 'px';
            d.style.top = cy + 'px';
            d.style.width = dash ? '7px' : '3px';
            d.style.height = '3px';
            d.style.borderRadius = '2px';
            d.style.background = '#FFB547';
            d.style.opacity = '0';
            document.body.appendChild(d);
            var an = d.animate([{ opacity: 0, transform: 'translateY(0)' }, { opacity: 1, transform: 'translateY(-14px)' }, { opacity: 0, transform: 'translateY(-24px)' }], { duration: 500, delay: i * 120, fill: 'forwards' });
            an.onfinish = function () { d.remove(); };
        }
    }
    function shatter(bot) {
        if (reduced)
            return;
        var r = hostRect(bot), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        for (var i = 0; i < 16; i += 1) {
            var d = document.createElement('span');
            d.className = 'msbot-fx';
            d.style.left = cx + 'px';
            d.style.top = cy + 'px';
            d.style.width = (4 + Math.random() * 5).toFixed(0) + 'px';
            d.style.height = (7 + Math.random() * 6).toFixed(0) + 'px';
            d.style.background = i % 3 === 0 ? '#E8A33D' : 'rgba(160,190,220,.75)';
            d.style.clipPath = 'polygon(15% 0,100% 30%,70% 100%,0 65%)';
            document.body.appendChild(d);
            var a = Math.random() * Math.PI * 2, v = 60 + Math.random() * 110;
            var an = d.animate([
                { transform: 'translate(0,0) rotate(0)', opacity: .95 },
                { transform: 'translate(' + (Math.cos(a) * v).toFixed(0) + 'px,' + (Math.sin(a) * v + 80).toFixed(0) + 'px) rotate(' + (Math.random() * 360).toFixed(0) + 'deg)', opacity: 0 }
            ], { duration: 850 + Math.random() * 450, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' });
            an.onfinish = function () { d.remove(); };
        }
    }
    function tele(bot) {
        if (reduced || !bot || !bot.host)
            return;
        bot.host.animate([{ opacity: 1 }, { opacity: .25 }, { opacity: 1 }, { opacity: .45 }, { opacity: 1 }], { duration: 520, easing: 'steps(1,end)' });
    }
    var last = {}, fired = 0;
    function emit(id, ctx) {
        var e = BYID[id];
        if (!e)
            return false;
        var t = (window.performance || Date).now();
        var cd = (ctx && ctx.force) ? 0 : (e.quiet ? 1500 : 4000);
        if (last[id] && t - last[id] < cd)
            return false;
        last[id] = t;
        fired += 1;
        var bot = bots[bots.length - 1] || null;
        if (bot) {
            var fx = e.fx || '';
            if (fx.indexOf('confetti') >= 0) {
                bot.setMood('yay', 2200);
                confetti(bot);
            }
            else if (fx.indexOf('hero') >= 0) {
                bot.setMood('hero', 2600);
                bot.jump();
            }
            else if (e.mood)
                bot.setMood(e.mood, e.mood === 'sleep' ? 0 : 1800);
            if (fx.indexOf('wave') >= 0)
                bot.wave(1300);
            if (fx.indexOf('jump') >= 0)
                bot.jump();
            if (fx.indexOf('sparkle') >= 0)
                sparkle(bot);
            if (fx.indexOf('shield') >= 0)
                ring(bot);
            if (fx.indexOf('plane') >= 0)
                plane(bot);
            if (fx.indexOf('morse') >= 0)
                morse(bot);
            if (fx.indexOf('shatter') >= 0)
                shatter(bot);
            if (fx.indexOf('tele') >= 0)
                tele(bot);
        }
        if (!e.quiet && e.fr)
            say(e.fr, (ctx && ctx.acts) ? 12000 : 4200, ctx && ctx.acts);
        var ev;
        try {
            ev = new CustomEvent('msbot:event', { detail: { id: id, el: ctx && ctx.el || null } });
        }
        catch (err) {
            ev = document.createEvent('CustomEvent');
            ev.initCustomEvent('msbot:event', true, true, { id: id, el: ctx && ctx.el || null });
        }
        document.dispatchEvent(ev);
        return true;
    }
    function Bot3D(host) {
        var T = THREE, w = host.clientWidth || 220, h = host.clientHeight || 256, self = this;
        var renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
        renderer.setSize(w, h);
        renderer.outputEncoding = T.sRGBEncoding;
        renderer.toneMapping = T.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.08;
        host.appendChild(renderer.domElement);
        var scene = new T.Scene(), cam = new T.PerspectiveCamera(30, w / h, .1, 100);
        cam.position.set(0, .95, 10.6);
        cam.lookAt(0, .9, 0);
        function lin(c) { return new T.Color(c).convertSRGBToLinear(); }
        this.lin = lin;
        function V2(a) { return a.map(function (p) { return new T.Vector2(p[0], p[1]); }); }
        function lathe(pts, seg) { return new T.LatheGeometry(V2(pts), seg || 48); }
        function mesh(g, m) { return new T.Mesh(g, m); }
        var pm = new T.PMREMGenerator(renderer), env = new T.Scene();
        env.add(new T.Mesh(new T.SphereGeometry(20, 32, 16), new T.MeshBasicMaterial({ color: 0xc4ccd6, side: T.BackSide })));
        function panel(x, y, z, sw, sh, c) { var m = new T.Mesh(new T.PlaneGeometry(sw, sh), new T.MeshBasicMaterial({ color: c, side: T.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m); }
        panel(0, 13, 4, 16, 6, 0xffffff);
        panel(11, 4, 9, 6, 9, 0xffffff);
        panel(-12, 3, 6, 5, 10, 0xffffff);
        panel(0, -7, -12, 14, 4, 0x6f8299);
        panel(-6, 8, -10, 8, 4, 0xffffff);
        scene.environment = pm.fromScene(env, 0.02).texture;
        scene.add(new T.HemisphereLight(0xffffff, 0x8090a6, .3));
        var key = new T.DirectionalLight(0xffffff, 1.2);
        key.position.set(3, 6, 7);
        scene.add(key);
        var fill = new T.DirectionalLight(0xffffff, .35);
        fill.position.set(-6, 2, 5);
        scene.add(fill);
        var rimL = new T.DirectionalLight(0xffffff, .65);
        rimL.position.set(-4, 4, -6);
        scene.add(rimL);
        var HOLO = 0x00F0FF;
        var navy = new T.MeshPhysicalMaterial({ color: lin(currentTheme.dark), metalness: .35, roughness: .3, clearcoat: 1, clearcoatRoughness: .07, envMapIntensity: .7 });
        var bronze = new T.MeshPhysicalMaterial({ color: lin(currentTheme.acc), metalness: .9, roughness: .32, clearcoat: .35, clearcoatRoughness: .2 });
        var ink = new T.MeshStandardMaterial({ color: 0x12202F, metalness: .2, roughness: .5, envMapIntensity: .35 });
        var rubber = new T.MeshStandardMaterial({ color: 0x14181f, metalness: 0, roughness: .85 });
        var shoeM = new T.MeshPhysicalMaterial({ color: lin(shade(currentTheme.acc, -.2)), metalness: .3, roughness: .42, clearcoat: .5, envMapIntensity: .6 });
        var amberM = new T.MeshStandardMaterial({ color: lin(currentTheme.acc), emissive: lin(currentTheme.eye), emissiveIntensity: 1.1, roughness: .3 });
        var glowM = new T.MeshBasicMaterial({ color: lin(currentTheme.eye) });
        var smoke = new T.MeshPhysicalMaterial({ color: 0x020304, metalness: 0, roughness: .16, clearcoat: 1, clearcoatRoughness: .03, envMapIntensity: .22, emissive: lin(currentTheme.eye), emissiveIntensity: .025 });
        var holoM = new T.MeshBasicMaterial({ color: 0x00C8E0, transparent: true, opacity: .2, depthWrite: false, side: T.DoubleSide });
        var holoLine = new T.LineBasicMaterial({ color: 0x00B8D4, transparent: true, opacity: .95, depthWrite: false });
        var root = new T.Group();
        root.scale.x = -1;
        scene.add(root);
        function rrect(wd, ht, r) { var s = new T.Shape(), x = -wd / 2, y = -ht / 2; s.moveTo(x + r, y); s.lineTo(x + wd - r, y); s.quadraticCurveTo(x + wd, y, x + wd, y + r); s.lineTo(x + wd, y + ht - r); s.quadraticCurveTo(x + wd, y + ht, x + wd - r, y + ht); s.lineTo(x + r, y + ht); s.quadraticCurveTo(x, y + ht, x, y + ht - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }
        function hinge(len, r) {
            var g = new T.Group();
            var ax = mesh(new T.CylinderGeometry(r, r, len, 24), ink);
            ax.rotation.z = Math.PI / 2;
            g.add(ax);
            [-1, 1].forEach(function (s) { var cap = mesh(new T.CylinderGeometry(r * .75, r * .75, .025, 24), bronze); cap.rotation.z = Math.PI / 2; cap.position.x = s * len / 2; g.add(cap); });
            return g;
        }
        [-.34, .34].forEach(function (x) {
            var hip = mesh(new T.SphereGeometry(.165, 28, 20), bronze);
            hip.position.set(x, -.06, 0);
            root.add(hip);
            var th = mesh(lathe([[0, 0], [.17, 0], [.215, .12], [.215, .3], [.18, .4], [0, .4]], 36), navy);
            th.position.set(x, -.52, 0);
            root.add(th);
            var band = mesh(new T.TorusGeometry(.205, .018, 8, 36), bronze);
            band.rotation.x = Math.PI / 2;
            band.position.set(x, -.38, 0);
            root.add(band);
            var kh = hinge(.4, .085);
            kh.position.set(x, -.6, -.02);
            root.add(kh);
            var cap = mesh(new T.SphereGeometry(.17, 28, 18, 0, Math.PI * 2, 0, Math.PI * .55), navy);
            cap.rotation.x = Math.PI / 2;
            cap.scale.set(1, .8, 1);
            cap.position.set(x, -.6, .06);
            root.add(cap);
            var sh = mesh(lathe([[0, 0], [.26, 0], [.27, .05], [.24, .22], [.19, .38], [0, .38]], 36), navy);
            sh.position.set(x, -.98, 0);
            root.add(sh);
            var up = mesh(new T.SphereGeometry(1, 40, 22, 0, Math.PI * 2, 0, Math.PI / 2), shoeM);
            up.scale.set(.3, .24, .46);
            up.position.set(x, -1.1, .08);
            root.add(up);
            var toe = mesh(new T.SphereGeometry(1, 32, 18, 0, Math.PI * 2, 0, Math.PI / 2), navy);
            toe.scale.set(.24, .15, .22);
            toe.position.set(x, -1.1, .3);
            root.add(toe);
            var cuff = mesh(new T.TorusGeometry(.25, .035, 10, 40), shoeM);
            cuff.rotation.x = Math.PI / 2;
            cuff.position.set(x, -.96, 0);
            root.add(cuff);
            var dot = mesh(new T.CylinderGeometry(.05, .05, .03, 20), bronze);
            dot.rotation.z = Math.PI / 2;
            dot.position.set(x + (x > 0 ? .29 : -.29), -1.0, .05);
            root.add(dot);
            var sole = mesh(new T.CylinderGeometry(1, 1, .08, 40), rubber);
            sole.scale.set(.32, 1, .49);
            sole.position.set(x, -1.135, .09);
            root.add(sole);
        });
        var pel = mesh(lathe([[0, -.12], [.34, -.14], [.5, -.03], [.53, .08], [.48, .16], [0, .16]]), navy);
        pel.scale.set(1.08, 1, .8);
        root.add(pel);
        var belt = mesh(new T.TorusGeometry(.47, .03, 10, 48), bronze);
        belt.rotation.x = Math.PI / 2;
        belt.scale.set(1.06, .8, 1);
        belt.position.y = .17;
        root.add(belt);
        var core = mesh(new T.CylinderGeometry(.36, .38, .3, 36), ink);
        core.position.y = .33;
        core.scale.set(1.05, 1, .8);
        root.add(core);
        [.23, .31, .39].forEach(function (y) { var rb = mesh(new T.TorusGeometry(.39, .028, 10, 40), ink); rb.rotation.x = Math.PI / 2; rb.scale.set(1.05, .8, 1); rb.position.y = y; root.add(rb); });
        function warpTorso(g, widen) { var p = g.attributes.position; for (var i = 0; i < p.count; i++) {
            var y = p.getY(i);
            p.setX(i, p.getX(i) * (1 + widen * y));
            if (y < -.6)
                p.setY(i, -.6 + (y + .6) * .5);
        } g.computeVertexNormals(); return g; }
        var torso = mesh(warpTorso(new T.SphereGeometry(1, 56, 40), .24), navy);
        torso.scale.set(.74, .5, .56);
        torso.position.y = .8;
        root.add(torso);
        var plate = mesh(warpTorso(new T.SphereGeometry(1, 48, 32, Math.PI / 2 - .85, 1.7, .55, 1.25), .24), navy);
        plate.scale.set(.765, .52, .6);
        plate.position.y = .8;
        root.add(plate);
        var collar = mesh(new T.TorusGeometry(.26, .04, 10, 40), bronze);
        collar.rotation.x = Math.PI / 2;
        collar.position.y = 1.21;
        root.add(collar);
        var neck = mesh(lathe([[0, 1.18], [.19, 1.18], [.17, 1.28], [.19, 1.4], [0, 1.4]], 32), ink);
        root.add(neck);
        [1.24, 1.31].forEach(function (y) { var nr = mesh(new T.TorusGeometry(.185, .012, 8, 32), bronze); nr.rotation.x = Math.PI / 2; nr.position.y = y; root.add(nr); });
        function shieldShape(k) { var s = new T.Shape(); s.moveTo(-.5 * k, .62 * k); s.quadraticCurveTo(0, .7 * k, .5 * k, .62 * k); s.lineTo(.5 * k, .1 * k); s.quadraticCurveTo(.48 * k, -.5 * k, 0, -.82 * k); s.quadraticCurveTo(-.48 * k, -.5 * k, -.5 * k, .1 * k); s.lineTo(-.5 * k, .62 * k); return s; }
        var badgeFrame = mesh(new T.ExtrudeGeometry(shieldShape(.2), { depth: .02, bevelEnabled: true, bevelThickness: .012, bevelSize: .012, bevelSegments: 2 }), bronze);
        badgeFrame.position.set(0, .93, .56);
        badgeFrame.rotation.x = -.18;
        root.add(badgeFrame);
        var badge = mesh(new T.ExtrudeGeometry(shieldShape(.16), { depth: .02, bevelEnabled: true, bevelThickness: .01, bevelSize: .01, bevelSegments: 2 }), amberM);
        badge.position.set(0, .935, .585);
        badge.rotation.x = -.18;
        root.add(badge);
        var lc = document.createElement("canvas");
        lc.width = 256;
        lc.height = 80;
        var lx = lc.getContext("2d"), ltex = new T.CanvasTexture(lc);
        ltex.encoding = T.sRGBEncoding;
        function drawLabel(txt) {
            lx.clearRect(0, 0, 256, 80);
            lx.fillStyle = "#12202F";
            lx.beginPath();
            lx.moveTo(14, 4);
            lx.lineTo(242, 4);
            lx.quadraticCurveTo(252, 4, 252, 14);
            lx.lineTo(252, 66);
            lx.quadraticCurveTo(252, 76, 242, 76);
            lx.lineTo(14, 76);
            lx.quadraticCurveTo(4, 76, 4, 66);
            lx.lineTo(4, 14);
            lx.quadraticCurveTo(4, 4, 14, 4);
            lx.fill();
            lx.strokeStyle = "rgba(255,255,255,.5)";
            lx.lineWidth = 3;
            lx.stroke();
            lx.fillStyle = "#E8EDF3";
            lx.font = "800 44px Arial, sans-serif";
            lx.textAlign = "center";
            lx.textBaseline = "middle";
            lx.fillText(String(txt).toUpperCase().slice(0, 10), 128, 42);
            ltex.needsUpdate = true;
        }
        drawLabel("MSBot");
        var label = mesh(new T.PlaneGeometry(.3, .094), new T.MeshBasicMaterial({ map: ltex, transparent: true }));
        label.position.set(.36, .9, .5);
        label.rotation.set(-.15, .45, 0);
        label.scale.x = -1;
        root.add(label);
        this.setLabel = function (n) { drawLabel(n); };
        [-1, 1].forEach(function (s) { for (var v = 0; v < 3; v++) {
            var vent = mesh(new T.BoxGeometry(.2, .025, .02), bronze);
            vent.position.set(s * .22, .95 - v * .06, -.53);
            root.add(vent);
        } });
        function makeHand() {
            var hand = new T.Group();
            var palm = mesh(new T.BoxGeometry(.2, .17, .09), navy);
            palm.position.y = -.1;
            hand.add(palm);
            var pr = mesh(new T.SphereGeometry(1, 20, 14), navy);
            pr.scale.set(.1, .09, .05);
            pr.position.set(0, -.1, .03);
            hand.add(pr);
            var fingers = [];
            [[-.062, 0], [.062, 1], [0, 2]].forEach(function (d) {
                var fx = d[0], i = d[1], L = i === 2 ? 1.05 : .95;
                var g1 = new T.Group();
                g1.position.set(fx, -.2, 0);
                hand.add(g1);
                var p0 = mesh(new T.SphereGeometry(.03, 14, 10), bronze);
                g1.add(p0);
                var s1 = mesh(new T.BoxGeometry(.05, .085 * L, .05), navy);
                s1.position.y = -.05 * L;
                g1.add(s1);
                var g2 = new T.Group();
                g2.position.y = -.1 * L;
                g1.add(g2);
                var p1 = mesh(new T.SphereGeometry(.026, 14, 10), bronze);
                g2.add(p1);
                var s2 = mesh(new T.BoxGeometry(.046, .07 * L, .046), navy);
                s2.position.y = -.042 * L;
                g2.add(s2);
                var g3 = new T.Group();
                g3.position.y = -.085 * L;
                g2.add(g3);
                var p2 = mesh(new T.SphereGeometry(.023, 12, 10), bronze);
                g3.add(p2);
                var pad = mesh(new T.SphereGeometry(1, 16, 12), navy);
                pad.scale.set(.026, .042, .026);
                pad.position.y = -.04 * L;
                g3.add(pad);
                fingers.push({ g1: g1, g2: g2, g3: g3, i: i });
            });
            var th = new T.Group();
            th.position.set(.11, -.1, .04);
            th.rotation.z = .9;
            hand.add(th);
            var tp0 = mesh(new T.SphereGeometry(.03, 14, 10), bronze);
            th.add(tp0);
            var t1 = mesh(new T.BoxGeometry(.05, .075, .05), navy);
            t1.position.y = -.045;
            th.add(t1);
            var t2 = new T.Group();
            t2.position.y = -.085;
            th.add(t2);
            var tp1 = mesh(new T.SphereGeometry(.025, 12, 10), bronze);
            t2.add(tp1);
            var tpad = mesh(new T.SphereGeometry(1, 16, 12), navy);
            tpad.scale.set(.026, .04, .026);
            tpad.position.y = -.038;
            t2.add(tpad);
            hand.userData = { fingers: fingers, thumb: th, thumb2: t2 };
            return hand;
        }
        function arm(side) {
            var sh = new T.Group();
            sh.position.set(side * .93, 1.0, 0);
            root.add(sh);
            var ball = mesh(new T.SphereGeometry(.17, 28, 20), bronze);
            sh.add(ball);
            var paul = mesh(new T.SphereGeometry(.27, 36, 24, 0, Math.PI * 2, 0, Math.PI * .58), navy);
            paul.position.y = .02;
            paul.scale.set(1, .9, 1);
            sh.add(paul);
            var trim = mesh(new T.TorusGeometry(.245, .022, 8, 40), bronze);
            trim.rotation.x = Math.PI / 2;
            trim.position.y = -.06;
            sh.add(trim);
            var up = mesh(lathe([[0, 0], [.12, 0], [.145, .1], [.145, .3], [.125, .38], [0, .38]], 32), navy);
            up.position.y = -.6;
            sh.add(up);
            var ub = mesh(new T.TorusGeometry(.14, .018, 8, 32), bronze);
            ub.rotation.x = Math.PI / 2;
            ub.position.y = -.4;
            sh.add(ub);
            var el = new T.Group();
            el.position.y = -.64;
            sh.add(el);
            var eh = hinge(.28, .09);
            el.add(eh);
            var ej = mesh(new T.SphereGeometry(.1, 20, 16), ink);
            el.add(ej);
            var fo = mesh(lathe([[0, 0], [.155, 0], [.175, .08], [.17, .25], [.125, .36], [0, .36]], 32), navy);
            fo.position.y = -.43;
            el.add(fo);
            var cuff = mesh(new T.TorusGeometry(.16, .035, 10, 32), bronze);
            cuff.rotation.x = Math.PI / 2;
            cuff.position.y = -.43;
            el.add(cuff);
            var hand = makeHand();
            hand.position.y = -.47;
            el.add(hand);
            return { sh: sh, el: el, hand: hand };
        }
        var R_ = arm(1), L_ = arm(-1);
        var armR = R_.sh, armL = L_.sh, elR = R_.el, elL = L_.el;
        var head = new T.Group();
        head.position.y = 1.95;
        root.add(head);
        var HS = [1.0, .95, .97];
        var shell = mesh(new T.SphereGeometry(.95, 64, 48), navy);
        shell.scale.set(HS[0], HS[1], HS[2]);
        head.add(shell);
        function onSphere(u, v, R) { return new T.Vector3(R * Math.sin(u) * Math.cos(v), R * Math.sin(v), R * Math.cos(u) * Math.cos(v)); }
        var VU = .86, VV = .42, VN = 3.6, VY = -.04;
        function superR(a) { var c = Math.abs(Math.cos(a)), s = Math.abs(Math.sin(a)); return Math.pow(Math.pow(c, VN) + Math.pow(s, VN), -1 / VN); }
        function patch(scale, R) {
            var g = new T.PlaneGeometry(2, 2, 40, 40), p = g.attributes.position;
            for (var i = 0; i < p.count; i++) {
                var s0 = p.getX(i), t0 = p.getY(i), m0 = Math.max(Math.abs(s0), Math.abs(t0)), px = 0, py = 0;
                if (m0 > 0) {
                    var a0 = Math.atan2(t0, s0), rb = superR(a0);
                    px = Math.cos(a0) * rb * m0 * scale;
                    py = Math.sin(a0) * rb * m0 * scale;
                }
                var q = onSphere(px * VU, py * VV + VY, R);
                p.setXYZ(i, q.x, q.y, q.z);
            }
            g.computeVertexNormals();
            return g;
        }
        var frame = mesh(patch(1.22, .958), bronze);
        frame.scale.set(HS[0], HS[1], HS[2]);
        head.add(frame);
        var visor = mesh(patch(1.0, .966), smoke);
        visor.scale.set(HS[0], HS[1], HS[2]);
        head.add(visor);
        var bar = mesh(new T.ExtrudeGeometry(rrect(.34, .07, .035), { depth: .02, bevelEnabled: true, bevelThickness: .01, bevelSize: .01, bevelSegments: 2 }), amberM);
        var bp = onSphere(0, .5, .93);
        bar.position.set(0, bp.y * HS[1], bp.z * HS[2]);
        bar.rotation.x = -.5;
        head.add(bar);
        for (var vs = -2; vs <= 2; vs++) {
            var sl = mesh(new T.BoxGeometry(.022, .08, .03), ink);
            var sp = onSphere(vs * .075, -.56, .955);
            sl.position.set(sp.x, sp.y * HS[1], sp.z * HS[2]);
            sl.rotation.set(.55, vs * .075, 0);
            head.add(sl);
        }
        var eyes = [];
        [-.31, .31].forEach(function (u) {
            var eg = new T.Group();
            var p0 = onSphere(u, -.02, .985);
            eg.position.set(p0.x * HS[0], p0.y * HS[1], p0.z * HS[2]);
            eg.rotation.y = u;
            var ring = mesh(new T.TorusGeometry(.145, .03, 12, 40), glowM);
            ring.scale.set(1, 1 / 1.2, 1);
            eg.add(ring);
            var disc = mesh(new T.SphereGeometry(.1, 24, 16), glowM);
            disc.scale.set(1, 1 / 1.2, .25);
            eg.add(disc);
            head.add(eg);
            eyes.push(eg);
        });
        var mouth = mesh(new T.TorusGeometry(.075, .016, 8, 28, Math.PI), glowM);
        var mp = onSphere(0, -.24, .975);
        mouth.position.set(0, mp.y * HS[1], mp.z * HS[2]);
        mouth.rotation.set(.25, 0, Math.PI);
        head.add(mouth);
        [-1, 1].forEach(function (s) {
            var er = mesh(new T.TorusGeometry(.17, .04, 14, 40), bronze);
            er.rotation.y = Math.PI / 2;
            er.position.set(s * .935, -.02, 0);
            head.add(er);
            var ec = mesh(new T.CylinderGeometry(.16, .18, .12, 36), navy);
            ec.rotation.z = Math.PI / 2;
            ec.position.set(s * .98, -.02, 0);
            head.add(ec);
            var ed = mesh(new T.TorusGeometry(.08, .012, 8, 24), bronze);
            ed.rotation.y = Math.PI / 2;
            ed.position.set(s * 1.045, -.02, 0);
            head.add(ed);
            var an = mesh(new T.CylinderGeometry(.016, .022, .5, 10), ink);
            an.position.set(s * .52, .98, -.05);
            an.rotation.z = -s * .12;
            head.add(an);
            var ab = mesh(new T.CylinderGeometry(.045, .05, .08, 16), navy);
            ab.position.set(s * .49, .76, -.05);
            head.add(ab);
            var tp = mesh(new T.SphereGeometry(.045, 16, 12), amberM);
            tp.position.set(s * .55, 1.24, -.05);
            head.add(tp);
            for (var v = 0; v < 3; v++) {
                var hv = mesh(new T.BoxGeometry(.03, .14, .02), bronze);
                var hp = onSphere(s * (2.35 + v * .12), .25, .95);
                hv.position.set(hp.x, hp.y * HS[1], hp.z * HS[2]);
                hv.rotation.y = s * (2.35 + v * .12);
                head.add(hv);
            }
        });
        var holo = new T.Group();
        holo.position.set(-1.75, .55, .55);
        holo.rotation.y = .35;
        holo.visible = false;
        root.add(holo);
        var hsh = mesh(new T.ShapeGeometry(shieldShape(1.15)), holoM);
        holo.add(hsh);
        function outline(k) { var pts = shieldShape(k).getPoints(60).map(function (p) { return new T.Vector3(p.x, p.y, .01); }); return new T.LineLoop(new T.BufferGeometry().setFromPoints(pts), holoLine); }
        holo.add(outline(1.15));
        holo.add(outline(1.0));
        holo.add(outline(.72));
        var hc = document.createElement("canvas");
        hc.width = hc.height = 256;
        var hx = hc.getContext("2d"), htex = new T.CanvasTexture(hc);
        function drawHolo(txt) {
            hx.clearRect(0, 0, 256, 256);
            hx.font = "900 " + (txt.length > 2 ? 92 : 132) + "px Arial Black, Arial, sans-serif";
            hx.textAlign = "center";
            hx.textBaseline = "middle";
            hx.shadowColor = "#00F0FF";
            hx.shadowBlur = 18;
            hx.strokeStyle = "#9ffcff";
            hx.lineWidth = 5;
            hx.strokeText(txt, 128, 132);
            hx.fillStyle = "rgba(0,240,255,.55)";
            hx.fillText(txt, 128, 132);
            htex.needsUpdate = true;
        }
        drawHolo(currentTheme.emblem);
        var hlab = mesh(new T.PlaneGeometry(.95, .95), new T.MeshBasicMaterial({ map: htex, transparent: true, blending: T.AdditiveBlending, depthWrite: false }));
        hlab.position.z = .02;
        hlab.scale.x = -1;
        holo.add(hlab);
        var arcs = new T.LineSegments(new T.BufferGeometry(), holoLine);
        holo.add(arcs);
        function newArcs() {
            var v = [];
            for (var a = 0; a < 4; a++) {
                var pts = shieldShape(1.15).getPoints(60), st = Math.floor(Math.random() * 55), x = pts[st].x, y = pts[st].y;
                for (var k = 0; k < 5; k++) {
                    var nx = x + (Math.random() - .5) * .18, ny = y + (Math.random() - .5) * .18;
                    v.push(x, y, .02, nx, ny, .02);
                    x = nx;
                    y = ny;
                }
            }
            arcs.geometry.dispose();
            arcs.geometry = new T.BufferGeometry();
            arcs.geometry.setAttribute("position", new T.Float32BufferAttribute(v, 3));
        }
        newArcs();
        var thinkRing = new T.Group();
        thinkRing.position.y = 1.42;
        thinkRing.visible = false;
        head.add(thinkRing);
        for (var q = 0; q < 12; q++) {
            var seg = mesh(new T.BoxGeometry(.09, .02, .04), new T.MeshBasicMaterial({ color: HOLO, transparent: true, opacity: .2 + .8 * q / 12, blending: T.AdditiveBlending, depthWrite: false }));
            seg.position.set(Math.cos(q / 12 * Math.PI * 2) * .32, 0, Math.sin(q / 12 * Math.PI * 2) * .32);
            seg.rotation.y = -q / 12 * Math.PI * 2;
            thinkRing.add(seg);
        }
        var beam = mesh(new T.ConeGeometry(.45, 1.5, 40, 1, true), new T.MeshBasicMaterial({ color: HOLO, transparent: true, opacity: .12, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }));
        beam.rotation.z = -Math.PI / 2;
        beam.position.set(-1.25, -.02, .55);
        beam.rotation.y = .35;
        beam.visible = false;
        head.add(beam);
        var rimS = holo;
        var tip = null;
        var shadow = mesh(new T.CircleGeometry(1.05, 48), new T.MeshBasicMaterial({ color: 0x0b2a4a, transparent: true, opacity: .16 }));
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = -1.18;
        scene.add(shadow);
        this.applyTheme = function (th) {
            navy.color.copy(lin(th.dark));
            bronze.color.copy(lin(th.acc));
            shoeM.color.copy(lin(shade(th.acc, -.2)));
            amberM.color.copy(lin(th.acc));
            amberM.emissive.copy(lin(th.eye));
            glowM.color.copy(lin(th.eye));
            drawHolo(th.emblem);
            shadow.material.color.copy(lin(th.dark));
        };
        var holoAcc = new T.MeshBasicMaterial({ color: HOLO, transparent: true, opacity: .3, blending: T.AdditiveBlending, depthWrite: false });
        var blackM = new T.MeshStandardMaterial({ color: 0x05070c, roughness: .1, metalness: .6 });
        var capeM = new T.MeshPhysicalMaterial({ color: lin(currentTheme.dark), roughness: .55, side: T.DoubleSide });
        var cape = mesh(new T.PlaneGeometry(1.7, 2.2, 6, 6), capeM);
        cape.position.set(0, .2, -.62);
        cape.rotation.x = .18;
        cape.visible = false;
        root.add(cape);
        var flames = [];
        [-.34, .34].forEach(function (x) { var fl = mesh(new T.ConeGeometry(.17, .65, 16), new T.MeshBasicMaterial({ color: HOLO, transparent: true, opacity: .85, blending: T.AdditiveBlending })); fl.rotation.x = Math.PI; fl.position.set(x, -1.52, .05); fl.visible = false; root.add(fl); flames.push(fl); });
        var phone = mesh(new T.BoxGeometry(.2, .36, .06), blackM);
        phone.position.set(0, -.62, .14);
        phone.visible = false;
        elR.add(phone);
        var tablet = mesh(new T.BoxGeometry(.95, .62, .03), holoAcc);
        tablet.position.set(0, .6, 1.0);
        tablet.rotation.x = -.4;
        tablet.visible = false;
        root.add(tablet);
        var kbd = mesh(new T.BoxGeometry(1.5, .04, .5), holoAcc);
        kbd.position.set(0, -.1, .95);
        kbd.visible = false;
        root.add(kbd);
        var tie = new T.Group();
        tie.visible = false;
        root.add(tie);
        var tieM = mesh(new T.BoxGeometry(.12, .42, .04), amberM);
        tieM.position.set(0, .66, .6);
        tie.add(tieM);
        [-.24, .24].forEach(function (x) { var lap = mesh(new T.BoxGeometry(.3, .55, .05), navy); lap.position.set(x, .74, .56); lap.rotation.z = x > 0 ? .35 : -.35; tie.add(lap); });
        var glasses = new T.Group();
        glasses.visible = false;
        head.add(glasses);
        [-.31, .31].forEach(function (u) {
            var p0 = onSphere(u, -.02, 1.0);
            var fr = mesh(new T.TorusGeometry(.17, .012, 8, 32), bronze);
            fr.position.set(p0.x, p0.y * HS[1], p0.z * HS[2] + .03);
            fr.rotation.y = u;
            glasses.add(fr);
            var ln = mesh(new T.CircleGeometry(.16, 32), holoAcc);
            ln.position.copy(fr.position);
            ln.rotation.y = u;
            glasses.add(ln);
        });
        this.applyTheme(currentTheme);
        this.acc = { cape: cape, flames: flames, phone: phone, tablet: tablet, kbd: kbd, tie: tie, glasses: glasses };
        this.hands = { R: R_.hand, L: L_.hand };
        this.flying = false;
        this.spin0 = -1;
        var lastArc = 0;
        this.onTick = function (t, m) {
            var showHolo = m === "error" || m === "help" || m === "heroshield" || m === "scan";
            holo.visible = showHolo;
            if (showHolo) {
                holoM.opacity = .17 + .06 * Math.sin(t / 90) + (Math.random() < .04 ? .1 : 0);
                if (t - lastArc > 140) {
                    lastArc = t;
                    newArcs();
                }
                holo.position.y = .55 + Math.sin(t / 500) * .03;
            }
            thinkRing.visible = m === "think" || m === "scan";
            if (thinkRing.visible)
                thinkRing.rotation.y = t / 300;
            beam.visible = m === "scan";
            if (beam.visible)
                beam.material.opacity = .08 + .05 * Math.sin(t / 120);
            amberM.emissiveIntensity = m === "sleep" ? .15 : (1.0 + .25 * Math.sin(t / 700));
        };
        this.r = { renderer: renderer, scene: scene, cam: cam, root: root, head: head, armR: armR, armL: armL, elR: elR, elL: elL, eyes: eyes, mouth: mouth, tip: tip, shadow: shadow, host: host, glowM: glowM, amberM: amberM, rimS: rimS };
        this.mood = "normal";
        this.moodUntil = 0;
        this.mood0 = 0;
        this.hx = 0;
        this.hy = 0;
        this.wave0 = -1;
        this.waveDur = 0;
        this.jump0 = -1;
        this.blinkAt = performance.now() + 1500;
        this.ro = window.ResizeObserver ? new ResizeObserver(function () { var W = host.clientWidth, H = host.clientHeight; if (W && H) {
            renderer.setSize(W, H);
            cam.aspect = W / H;
            cam.updateProjectionMatrix();
        } }) : null;
        if (this.ro)
            this.ro.observe(host);
    }
    Bot3D.prototype.wave = Bot.prototype.wave;
    Bot3D.prototype.jump = Bot.prototype.jump;
    Bot3D.prototype.setMood = function (m, ms) {
        this.mood = m;
        this.mood0 = performance.now();
        this.moodUntil = ms ? performance.now() + ms : 0;
        this.r.glowM.color.copy(this.lin((m === "error" || m === "help") ? currentTheme.acc : currentTheme.eye));
    };
    Bot3D.prototype.tick = function (t) {
        var R = this.r;
        if (R.host.hidden)
            return;
        if (this.moodUntil && t > this.moodUntil) {
            this.moodUntil = 0;
            this.setMood("normal");
        }
        var m = this.mood, rect = R.host.getBoundingClientRect(), cx = rect.left + rect.width / 2, cy = rect.top + rect.height * .3;
        var p = focusPt || pointer, tx = 0, ty = 0, dist = Math.hypot(p.x - cx, p.y - cy);
        if (!reduced) {
            if (!focusPt && (t - pointer.t > 5000 || dist > 800)) {
                tx = Math.sin(t / 2300) * .35;
                ty = Math.sin(t / 3100) * .2;
            }
            else {
                tx = Math.max(-1, Math.min(1, (p.x - cx) / 420));
                ty = Math.max(-1, Math.min(1, (p.y - cy) / 420));
            }
        }
        if (m === "think" || m === "scan") {
            tx = Math.sin(t / 500) * .3;
            ty = -.7;
        }
        if (m === "sleep") {
            tx = 0;
            ty = .7;
        }
        this.hx += (tx - this.hx) * .1;
        this.hy += (ty - this.hy) * .1;
        var breath = reduced ? 0 : Math.sin(t / (m === "sleep" ? 1200 : 650));
        var tilt = (m === "think" || m === "scan") ? .15 : (m === "listen" ? -.14 : (m === "sleep" ? .12 : 0));
        if (m === "error" && !reduced)
            tilt = Math.sin((t - this.mood0) / 70) * .1 * Math.max(0, 1 - (t - this.mood0) / 600);
        R.head.rotation.y = -this.hx * .6;
        R.head.rotation.x = this.hy * .35;
        R.head.rotation.z = this.hx * .08 - tilt;
        R.head.position.y = 1.95 + breath * .025;
        var jy = 0;
        if (this.jump0 >= 0) {
            var jp = (t - this.jump0) / 480;
            if (jp >= 1)
                this.jump0 = -1;
            else
                jy = Math.sin(Math.PI * jp) * .5;
        }
        if ((m === "help" || m === "yay") && !reduced)
            jy += Math.abs(Math.sin(t / 170)) * .12;
        R.root.position.y = jy;
        R.root.rotation.y = this.hx * .15;
        R.shadow.scale.setScalar(1 - jy * .5);
        var sy = 1.2;
        if (m === "happy" || m === "yay" || m === "cool" || m === "throw" || m === "pro")
            sy = .45;
        if (m === "code" || m === "read")
            sy = .8;
        if (m === "listen" || m === "wow")
            sy = 1.5;
        if (m === "sleep")
            sy = .12;
        if (m === "error" || m === "help")
            sy = .9;
        if (m !== "sleep" && t > this.blinkAt) {
            var bp = (t - this.blinkAt) / 150;
            if (bp >= 1)
                this.blinkAt = t + 2400 + Math.random() * 3200;
            else
                sy *= 1 - Math.sin(Math.PI * bp) * .9;
        }
        R.eyes.forEach(function (e) { e.scale.y = sy; });
        R.mouth.scale.set(m === "wow" ? .5 : 1, (m === "think" || m === "scan" || m === "sleep") ? .15 : (m === "yay" ? 1.4 : 1), 1);
        var a = breath * .03 + .12, aL = -breath * .03 - .14, eR = .22, eL = -.3, xL = -.28;
        if (m === "yay") {
            a = 2.6 + Math.sin(t / 120) * .15;
            aL = -.35;
            eR = .2;
            eL = -.4;
            xL = -.3;
        }
        if (m === "help" || m === "error") {
            aL = -1.3 + Math.sin(t / 300) * .05;
            eL = -.35;
            xL = -.45;
        }
        if (m === "think" || m === "scan") {
            a = .4;
            eR = 1.9;
        }
        var xR = 0, exR = 0, exL = 0, dt = t - this.mood0, X = this.acc;
        if (m === "call") {
            a = 2.5;
            eR = 1.9;
        }
        if (m === "code") {
            a = .1;
            xR = -1.1;
            exR = -.5 + Math.sin(t / 55) * .25;
            aL = -.1;
            xL = -1.1;
            exL = -.5 + Math.sin(t / 55 + 1.6) * .25;
            eL = 0;
            eR = 0;
        }
        if (m === "read") {
            a = .1;
            xR = -1.0;
            exR = -.7;
            aL = -.1;
            xL = -1.0;
            exL = -.7;
            eR = 0;
            eL = 0;
        }
        if (m === "throw") {
            var tp = Math.min(1, dt / 420), ez = 1 - Math.pow(1 - tp, 3);
            xR = -2.8 + ez * 3.4;
            a = .2;
            eR = 0;
        }
        if (m === "hero") {
            a = .55;
            eR = -1.7;
            aL = -.55;
            eL = 1.7;
            xL = 0;
        }
        if (m === "heroland") {
            a = .25;
            xR = -.5;
            eR = 0;
            aL = -.9;
            xL = 0;
        }
        if (m === "herocross") {
            a = .15;
            xR = -1.35;
            eR = 1.5;
            aL = -.15;
            xL = -1.35;
            eL = -1.5;
        }
        if (m === "heroshield") {
            aL = -1.45;
            eL = -.2;
            xL = -.6;
            a = .6;
            eR = -1.6;
        }
        if (m === "point") {
            a = 1.45;
            xR = -.7;
            eR = .15;
        }
        if (this.flying) {
            a = 3.0;
            eR = 0;
            aL = -.3;
        }
        if (this.wave0 >= 0) {
            var wp = (t - this.wave0) / this.waveDur;
            if (wp >= 1)
                this.wave0 = -1;
            else {
                var env = Math.min(1, wp * 5, (1 - wp) * 5);
                a = env * 1.05;
                eR = env * (2.0 + Math.sin((t - this.wave0) / 110) * .3);
                xR = 0;
            }
        }
        R.armR.rotation.z = a;
        R.armL.rotation.z = aL;
        R.elR.rotation.z = eR;
        R.elL.rotation.z = eL;
        R.armL.rotation.x = xL;
        R.armR.rotation.x = xR;
        R.elR.rotation.x = exR;
        R.elL.rotation.x = exL;
        var curl = .35, curlL = (m === "help" || m === "error" || m === "heroshield" || m === "scan") ? 0 : .35, pointing = m === "point";
        if (this.wave0 >= 0 || m === "yay" || m === "help")
            curl = 0;
        if (m === "hero" || m === "herocross" || m === "heroland" || this.flying)
            curl = 1.35;
        if (m === "call")
            curl = 1.0;
        if (m === "code")
            curl = .25 + .2 * Math.sin(t / 55);
        if (m === "read")
            curl = .5;
        function setHand(hd, c, pt) { hd.userData.fingers.forEach(function (f, i) { var cc = (pt && i === 1) ? 0 : c; f.g1.rotation.x = cc * .8; f.g2.rotation.x = cc * 1.1; if (f.g3)
            f.g3.rotation.x = cc * .9; f.g1.rotation.z = (i - 1.5) * .1 * (1 - Math.min(1, cc)); }); hd.userData.thumb.rotation.x = c * .5; if (hd.userData.thumb2)
            hd.userData.thumb2.rotation.x = c * .8; }
        setHand(this.hands.R, curl, pointing);
        setHand(this.hands.L, curlL, false);
        var heroOn = this.flying || m.indexOf("hero") === 0;
        X.cape.visible = heroOn;
        if (heroOn) {
            X.cape.rotation.x = (this.flying ? .9 : .18) + Math.sin(t / 180) * .08;
        }
        var fly = !!this.flying;
        X.flames.forEach(function (f) { f.visible = fly; f.scale.y = .7 + Math.random() * .6; });
        X.phone.visible = m === "call";
        X.tablet.visible = m === "read";
        X.kbd.visible = m === "code";
        X.tie.visible = m === "pro";
        X.glasses.visible = m === "cool";
        if (m === "heroland") {
            R.root.position.y -= .3;
            R.root.rotation.x = .2;
        }
        else
            R.root.rotation.x = fly ? .35 : 0;
        if (this.spin0 >= 0) {
            var sp = (t - this.spin0) / 750;
            if (sp >= 1)
                this.spin0 = -1;
            else
                R.root.rotation.y += Math.PI * 2 * (1 - Math.pow(1 - sp, 3));
        }
        R.rimS.visible = (m === "error" || m === "help" || m === "scan");
        R.amberM.emissiveIntensity = m === "sleep" ? .1 : (.45 + .35 * Math.sin(t / ((m === "error" || m === "help") ? 140 : 700)));
        if (this.onTick)
            this.onTick(t, m);
        R.renderer.render(R.scene, R.cam);
    };
    function can3d() {
        if (reduced)
            return false;
        try {
            var c = navigator.connection || {};
            if (c.saveData)
                return false;
            if (/^(slow-)?2g$|^3g$/.test(c.effectiveType || ''))
                return false;
            if ((navigator.hardwareConcurrency || 2) < 4)
                return false;
            if ((navigator.deviceMemory || 2) < 4)
                return false;
            var ua = navigator.userAgent || '';
            if (ua.indexOf('Android 7') !== -1 || ua.indexOf('Android 8') !== -1)
                return false;
            var cv = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (cv.getContext('webgl') || cv.getContext('experimental-webgl')));
        }
        catch (err) {
            return false;
        }
    }
    function fallback3d() {
        var b = three3d;
        if (!b)
            return;
        var host = b.r && b.r.host;
        var opts = (host && host.__msbotOpts) || {};
        var i = bots.indexOf(b);
        if (i >= 0)
            bots.splice(i, 1);
        if (b.r && b.r.renderer && b.r.renderer.dispose) {
            try {
                b.r.renderer.dispose();
            }
            catch (e2) { }
        }
        three3d = null;
        fpsWatch.t0 = 0;
        fpsWatch.slow = 0;
        if (host) {
            host.innerHTML = '';
            var svgBot = new Bot(host, { range: opts.range || 280 });
            svgBot.botName = opts.name || 'MSBot';
            svgBot.setMood('normal');
        }
    }
    function start3d(host, svgBot, opts) {
        if (!window.THREE || three3d)
            return;
        try {
            var i = bots.indexOf(svgBot);
            if (i >= 0)
                bots.splice(i, 1);
            host.innerHTML = '';
            window.__MSEC_MSBOT_3D_STATE = 'construct';
            var b3 = new Bot3D(host);
            window.__MSEC_MSBOT_3D_STATE = 'ok';
            b3.botName = opts.name || 'MSBot';
            three3d = b3;
            bots.push(b3);
            b3.setMood('normal');
            var cv = b3.r && b3.r.renderer && b3.r.renderer.domElement;
            if (cv)
                cv.addEventListener('webglcontextlost', function (ev) { ev.preventDefault(); fallback3d(); }, false);
        }
        catch (err) {
            window.__MSEC_MSBOT_3D_ERROR = err && err.message ? err.message : String(err);
            three3d = null;
            host.innerHTML = '';
            var s = new Bot(host, { range: opts.range || 280 });
            s.botName = opts.name || 'MSBot';
            s.setMood('normal');
        }
    }
    function load3d(host, svgBot, opts) {
        if (window.THREE) {
            start3d(host, svgBot, opts);
            return;
        }
        var sc = document.createElement('script');
        sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        sc.async = true;
        sc.onload = function () { start3d(host, svgBot, opts); };
        sc.onerror = function () { };
        document.head.appendChild(sc);
    }
    function mount(host, opts) {
        if (!host)
            return null;
        opts = opts || {};
        applyTheme(opts.theme || 'msec');
        host.__msbotOpts = opts;
        var bot = new Bot(host, { range: opts.range || 280 });
        bot.botName = opts.name || 'MSBot';
        host.setAttribute('role', 'img');
        host.setAttribute('aria-label', bot.botName + ', mascotte M-SEC');
        bot.setMood('normal');
        if (opts.render === '3d' || (opts.render !== 'light' && can3d()))
            load3d(host, bot, opts);
        return bot;
    }
    function setName(n) {
        var name = (n || '').trim().slice(0, 16) || 'MSBot';
        for (var i = 0; i < bots.length; i += 1) {
            bots[i].botName = name;
            bots[i].host.setAttribute('aria-label', name + ', mascotte M-SEC');
        }
        return name;
    }
    function setTheme(host, key) { applyTheme(key); }
    function setPalette(p) {
        p = p || {};
        var th = { name: 'custom', dark: p.dark || '#0B2A4A', acc: p.accent || '#E8A33D', eye: p.eye || '#FFB547', emblem: (p.emblem || 'MC').slice(0, 3) };
        THEMES.custom = th;
        applyTheme('custom');
    }
    var api = {
        version: '6.0',
        mount: mount,
        emit: emit,
        setName: setName,
        setTheme: setTheme,
        setPalette: setPalette,
        say: say,
        mountPoint: function () { return bots[bots.length - 1] || null; },
        catalog: CAT,
        get fired() { return fired; }
    };
    window.MSBot = window.MICO = api;
    window.__MSEC_MSBOT = api;
    if (!window.__MSEC_MSBOT_LOOP) {
        window.__MSEC_MSBOT_LOOP = true;
        requestAnimationFrame(loop);
    }
})();
