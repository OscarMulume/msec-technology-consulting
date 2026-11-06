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
        portfolio: { name: "Portfolio", dark: "#1B2440", acc: "#C9A46A", eye: "#EFD29C", emblem: "OM" },
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
        bots.forEach(function (b) { b.emb.textContent = th.emblem; b.emb.setAttribute("font-size", th.emblem.length > 2 ? 7.5 : (th.emblem.length > 1 ? 10 : 12)); b.setMood(b.mood, b.moodUntil ? Math.max(1, b.moodUntil - performance.now()) : 0); });
        if (three3d)
            three3d.applyTheme(th);
        extra3d.forEach(function (b) { b.applyTheme(th); });
    }
    function loop(t) { for (var i = 0; i < bots.length; i++)
        bots[i].tick(t); if (three3d)
        three3d.tick(t); for (var j = 0; j < extra3d.length; j++)
        extra3d[j].tick(t); requestAnimationFrame(loop); }
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
    function mount(host, opts) {
        if (!host)
            return null;
        opts = opts || {};
        applyTheme(opts.theme || 'msec');
        var bot = new Bot(host, { range: opts.range || 280 });
        bot.botName = opts.name || 'MSBot';
        host.setAttribute('role', 'img');
        host.setAttribute('aria-label', bot.botName + ', mascotte M-SEC');
        bot.setMood('normal');
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
    var api = {
        version: '6.0',
        mount: mount,
        emit: emit,
        setName: setName,
        setTheme: setTheme,
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

"use strict";
(() => {
    'use strict';
    if (customElements.get('msec-assistant'))
        return;
    const DEFAULT_ENDPOINT = 'https://cinzlzdfddvcjhmvnbtp.supabase.co/functions/v1/assistant';
    const CONTACT_EMAIL = 'oscarmulume1612@gmail.com';
    const MAX_CHARS = 1500;
    const MAX_HISTORY = 20;
    const REQUEST_TIMEOUT_MS = 30000;
    const I18N = {
        fr: {
            open: "Ouvrir l'assistant M-SEC",
            close: "Fermer l'assistant",
            title: 'Assistant M-SEC',
            subtitle: "Réponses à partir des informations publiées sur M-SEC et Oscar Mulume. Un assistant IA peut se tromper.",
            welcome: "Bonjour ! Je peux vous renseigner sur M-SEC, les services d'Oscar Mulume, ses projets et ses badges. Que souhaitez-vous savoir ?",
            suggestions: ['Quels services propose M-SEC ?', "Quels sont les badges d'Oscar ?", 'Où en est POS Pro ?'],
            placeholder: 'Votre question…',
            send: 'Envoyer',
            thinking: "L'assistant réfléchit…",
            quote: 'Demander un devis',
            quoteTitle: 'Demande de contact',
            quoteIntro: 'Laissez vos coordonnées : Oscar vous répondra. Rien n’est envoyé tant que vous n’appuyez pas sur « Envoyer la demande ».',
            name: 'Votre nom',
            contact: 'E-mail ou numéro WhatsApp',
            need: 'Votre besoin',
            submit: 'Envoyer la demande',
            cancel: 'Retour au chat',
            sending: 'Envoi en cours…',
            leadOk: 'Votre demande a bien été enregistrée. Oscar vous répondra.',
            leadError: `Votre demande n’a PAS pu être enregistrée. Écrivez à ${CONTACT_EMAIL}.`,
            fieldsRequired: 'Merci de remplir les trois champs.',
            networkError: `L’assistant est momentanément indisponible. Écrivez à ${CONTACT_EMAIL} ou utilisez le formulaire de contact du site.`,
            you: 'Vous',
            assistant: 'Assistant',
        },
        en: {
            open: 'Open the M-SEC assistant',
            close: 'Close the assistant',
            title: 'M-SEC assistant',
            subtitle: 'Answers come from the information published about M-SEC and Oscar Mulume. An AI assistant can make mistakes.',
            welcome: "Hello! I can tell you about M-SEC, Oscar Mulume's services, projects and badges. What would you like to know?",
            suggestions: ['What services does M-SEC offer?', "What are Oscar's badges?", 'Where is POS Pro at?'],
            placeholder: 'Your question…',
            send: 'Send',
            thinking: 'The assistant is thinking…',
            quote: 'Request a quote',
            quoteTitle: 'Contact request',
            quoteIntro: 'Leave your details and Oscar will reply. Nothing is sent until you press “Send request”.',
            name: 'Your name',
            contact: 'Email or WhatsApp number',
            need: 'Your need',
            submit: 'Send request',
            cancel: 'Back to chat',
            sending: 'Sending…',
            leadOk: 'Your request has been saved. Oscar will reply.',
            leadError: `Your request could NOT be saved. Email ${CONTACT_EMAIL}.`,
            fieldsRequired: 'Please fill in all three fields.',
            networkError: `The assistant is temporarily unavailable. Email ${CONTACT_EMAIL} or use the contact form on the site.`,
            you: 'You',
            assistant: 'Assistant',
        },
    };
    const APPS = {
        msec: {
            accent: '#07727f',
            quote: true,
            title: { fr: 'Assistant M-SEC', en: 'M-SEC assistant' },
            subtitle: null,
            welcome: null,
            suggestions: null,
        },
        portfolio: {
            accent: '#3b4cca',
            quote: true,
            title: { fr: 'Assistant du portfolio', en: 'Portfolio assistant' },
            subtitle: { fr: 'Réponses à partir des informations publiées sur Oscar Mulume. Un assistant IA peut se tromper.', en: 'Answers come from the information published about Oscar Mulume. An AI assistant can make mistakes.' },
            welcome: { fr: "Bonjour ! Je peux vous parler du parcours d'Oscar Mulume, de ses projets et de ses badges. Que souhaitez-vous savoir ?", en: "Hello! I can tell you about Oscar Mulume's background, projects and badges. What would you like to know?" },
            suggestions: { fr: ['Qui est Oscar Mulume ?', 'Quels sont ses projets ?', 'Quels badges a-t-il ?'], en: ['Who is Oscar Mulume?', 'What are his projects?', 'What badges does he have?'] },
        },
        malaika: {
            accent: '#8a4b12',
            quote: false,
            title: { fr: 'Conseiller Malaika Ranch', en: 'Malaika Ranch advisor' },
            subtitle: { fr: 'Produits, prix et disponibilité lus sur la boutique. Un assistant IA peut se tromper : confirmez sur WhatsApp.', en: 'Products, prices and availability come from the shop. An AI assistant can make mistakes: confirm on WhatsApp.' },
            welcome: { fr: 'Bonjour ! Je peux vous aider à choisir des produits de Malaika Ranch et à passer commande. Que cherchez-vous ?', en: 'Hello! I can help you choose Malaika Ranch products and place an order. What are you looking for?' },
            suggestions: { fr: ['Quels produits sont disponibles ?', 'Comment commander ?', 'Quelles zones livrez-vous ?'], en: ['Which products are available?', 'How do I order?', 'Which areas do you deliver to?'] },
        },
        pos: {
            accent: '#0b5ed7',
            quote: false,
            title: { fr: 'Aide caisse POS Pro', en: 'POS Pro help' },
            subtitle: { fr: "Aide à l'utilisation de POS Pro. L'assistant ne voit aucune donnée de vente. Un assistant IA peut se tromper.", en: 'Help for using POS Pro. The assistant sees no sales data. An AI assistant can make mistakes.' },
            welcome: { fr: 'Bonjour ! Je peux vous expliquer comment utiliser POS Pro : encaisser, clôturer la caisse, synchroniser, abonnement.', en: 'Hello! I can explain how to use POS Pro: taking payments, closing the till, syncing, subscription.' },
            suggestions: { fr: ['Comment encaisser une vente ?', 'Comment clôturer la caisse ?', 'Comment synchroniser ?'], en: ['How do I take a payment?', 'How do I close the till?', 'How do I sync?'] },
        },
    };
    const OFFLINE_TEXT = {
        fr: 'Vous êtes hors ligne : je réponds avec la FAQ intégrée (sans IA). Reconnectez-vous pour poser une question libre.',
        en: 'You are offline: I answer from the built-in FAQ (no AI). Reconnect to ask a free-form question.',
    };
    const OFFLINE_NO_MATCH = {
        fr: "Hors ligne : je n'ai pas de réponse intégrée à cette question. Reconnectez-vous et réessayez.",
        en: 'Offline: I have no built-in answer to this question. Reconnect and try again.',
    };
    function parseHex(value) {
        const m = /^#([0-9a-f]{6})$/i.exec(String(value || '').trim());
        return m ? [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16)] : null;
    }
    function toHex(rgb) {
        return '#' + rgb.map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')).join('');
    }
    function luminance(rgb) {
        const lin = rgb.map((c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
        return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
    }
    function contrast(a, b) {
        const la = luminance(a);
        const lb = luminance(b);
        return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
    }
    function mix(rgb, target, amount) {
        return rgb.map((c, i) => c + (target[i] - c) * amount);
    }
    function ensureContrast(rgb, background, minimum, towards) {
        let color = rgb;
        for (let step = 0; step < 20 && contrast(color, background) < minimum; step += 1)
            color = mix(color, towards, 0.08);
        return color;
    }
    function themeVars(accentHex, dark) {
        const base = parseHex(accentHex) || parseHex('#07727f');
        const bg = dark ? [16, 28, 34] : [255, 255, 255];
        const accent = dark ? ensureContrast(base, bg, 4.5, [255, 255, 255]) : ensureContrast(base, bg, 4.5, [0, 0, 0]);
        const text = contrast(accent, [255, 255, 255]) >= contrast(accent, [0, 0, 0]) ? [255, 255, 255] : [0, 0, 0];
        return { accent: toHex(accent), contrast: toHex(text) };
    }
    const STYLE = `
    :host {
      --a-bg: #ffffff; --a-bg-soft: #eef2f5; --a-text: #10161d; --a-muted: #4c5a68;
      --a-border: rgba(16,22,29,.18); --a-accent: #07727f; --a-accent-contrast: #ffffff;
      --a-user: #07727f; --a-user-text: #ffffff; --a-danger: #b42318; --a-ok: #087a55;
      --a-shadow: 0 18px 50px rgba(16,35,45,.22);
      all: initial; position: fixed; z-index: 2147483000;
      right: 1rem;
      bottom: var(--msec-assistant-bottom, 1rem);
      right: max(1rem, env(safe-area-inset-right));
      bottom: calc(var(--msec-assistant-bottom, 1rem) + env(safe-area-inset-bottom, 0px));
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 15px; line-height: 1.45; color: var(--a-text);
    }
    :host([data-theme="dark"]) {
      --a-bg: #101c22; --a-bg-soft: #0b151a; --a-text: #f1f6f7; --a-muted: #b5c2c7;
      --a-border: rgba(229,244,247,.28); --a-accent: #4fd1c5; --a-accent-contrast: #042024;
      --a-user: #4fd1c5; --a-user-text: #042024; --a-danger: #ff9b90; --a-ok: #57d6a4;
      --a-shadow: 0 22px 60px rgba(0,0,0,.5);
    }
    *, *::before, *::after { box-sizing: border-box; }
    [hidden] { display: none !important; }
    button, input, textarea { font: inherit; color: inherit; }
    button { cursor: pointer; }
    :focus-visible { outline: 3px solid var(--a-accent); outline-offset: 2px; }
    .launcher {
      display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
      min-width: 3.25rem; min-height: 3.25rem; padding: .25rem .9rem .25rem .3rem; border-radius: 999px; border: 1px solid var(--a-border);
      background: var(--a-accent); color: var(--a-accent-contrast); font-weight: 600; box-shadow: var(--a-shadow);
      transition: transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s;
    }
    .launcher:hover { transform: translateY(-2px) scale(1.03); }
    .launcher svg { width: 1.4rem; height: 1.4rem; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
    .msbot-stage { display: block; width: 2.75rem; height: 2.75rem; flex: none; }
    .msbot-stage svg { width: 100%; height: 100%; }
    .launcher .msbot-label { font-size: .85rem; letter-spacing: .01em; }
    @media (prefers-reduced-motion: reduce) { .launcher, .launcher:hover { transition: none; transform: none; } }
    .panel {
      position: absolute; right: 0; bottom: 4rem; width: 20rem; max-width: calc(100vw - 2rem);
      height: 30rem; max-height: calc(100vh - 9rem); display: flex; flex-direction: column; overflow: hidden;
      background: var(--a-bg); border: 1px solid var(--a-border); border-radius: 1.25rem; box-shadow: var(--a-shadow);
    }
    @supports (width: min(1px, 2px)) { .panel { width: min(24rem, calc(100vw - 2rem)); height: min(34rem, calc(100vh - 9rem)); } }
    @supports (height: 1dvh) { .panel { max-height: calc(100dvh - 9rem); } }
    .logo { width: 2rem; height: 2rem; flex: none; border-radius: .5rem; object-fit: contain; }
    .actions { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; }
    a.order { display: inline-flex; align-items: center; min-height: 2.75rem; padding: 0 1rem; border-radius: .75rem; background: var(--a-accent); color: var(--a-accent-contrast); font-weight: 600; text-decoration: none; }
    header { display: flex; align-items: flex-start; gap: .5rem; padding: .85rem 1rem; border-bottom: 1px solid var(--a-border); }
    header div { flex: 1; min-width: 0; }
    header h2 { margin: 0; font-size: 1rem; }
    header p { margin: .15rem 0 0; font-size: .75rem; color: var(--a-muted); }
    .icon-btn { width: 2.75rem; height: 2.75rem; flex: none; border: 0; border-radius: .75rem; background: transparent; font-size: 1.4rem; line-height: 1; }
    .icon-btn:hover { background: var(--a-bg-soft); }
    .log { flex: 1; overflow-y: auto; padding: .85rem 1rem; display: flex; flex-direction: column; gap: .6rem; }
    .msg { max-width: 92%; padding: .55rem .8rem; border-radius: 1rem; background: var(--a-bg-soft); white-space: pre-wrap; overflow-wrap: anywhere; }
    .msg.user { align-self: flex-end; background: var(--a-user); color: var(--a-user-text); }
    .msg.error { border: 1px solid var(--a-danger); }
    .msg a { color: inherit; text-decoration: underline; }
    .msg .who { display: block; font-size: .7rem; opacity: .75; margin-bottom: .1rem; }
    .chips { display: flex; flex-wrap: wrap; gap: .4rem; }
    .chip { min-height: 2.75rem; padding: 0 .85rem; border: 1px solid var(--a-border); border-radius: 999px; background: var(--a-bg); }
    .chip:hover { background: var(--a-bg-soft); }
    .thinking { align-self: flex-start; display: inline-flex; align-items: center; gap: .35rem; padding: .55rem .8rem; border-radius: 1rem; background: var(--a-bg-soft); color: var(--a-muted); font-size: .85rem; }
    .dots { display: inline-flex; gap: .2rem; }
    .dots i { width: .45rem; height: .45rem; border-radius: 50%; background: var(--a-accent); animation: bounce 1.1s infinite ease-in-out; }
    .dots i:nth-child(2) { animation-delay: .15s; } .dots i:nth-child(3) { animation-delay: .3s; }
    @keyframes bounce { 0%, 80%, 100% { transform: scale(.55); opacity: .45; } 40% { transform: scale(1); opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { .dots i { animation: none; opacity: .8; } }
    footer { padding: .6rem .75rem .75rem; border-top: 1px solid var(--a-border); display: flex; flex-direction: column; gap: .5rem; }
    .row { display: flex; gap: .5rem; align-items: flex-end; }
    textarea, input { width: 100%; padding: .6rem .7rem; border: 1px solid var(--a-border); border-radius: .75rem; background: var(--a-bg); min-height: 2.75rem; }
    textarea { resize: none; max-height: 6rem; }
    .primary { min-height: 2.75rem; padding: 0 1rem; border: 0; border-radius: .75rem; background: var(--a-accent); color: var(--a-accent-contrast); font-weight: 600; }
    .primary:disabled { opacity: .55; cursor: default; }
    .link-btn { align-self: flex-start; min-height: 2.75rem; padding: 0 .25rem; border: 0; background: transparent; color: var(--a-accent); font-weight: 600; text-decoration: underline; }
    form.lead { display: flex; flex-direction: column; gap: .6rem; padding: .85rem 1rem; overflow-y: auto; flex: 1; }
    form.lead p { margin: 0; font-size: .85rem; color: var(--a-muted); }
    form.lead label { display: flex; flex-direction: column; gap: .2rem; font-size: .85rem; font-weight: 600; }
    form.lead textarea { max-height: none; min-height: 5rem; }
    .status { min-height: 1.2rem; font-size: .85rem; }
    .status.error { color: var(--a-danger); } .status.ok { color: var(--a-ok); }
    .vh { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  `;
    const BUBBLE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.5-4.6A8 8 0 1 1 21 12Z"/><path d="M9 11h6M9 14h4"/></svg>';
    function appendRich(parent, text) {
        const pattern = /\[([^\]]{1,120})\]\((https:\/\/[^\s)]+)\)|(https:\/\/[^\s<>)\]]+[^\s<>)\].,;:!?])/g;
        let last = 0;
        let match;
        while ((match = pattern.exec(text)) !== null) {
            if (match.index > last)
                parent.append(text.slice(last, match.index));
            const link = document.createElement('a');
            link.href = match[2] || match[3];
            link.textContent = match[1] || match[3];
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            parent.append(link);
            last = pattern.lastIndex;
        }
        if (last < text.length)
            parent.append(text.slice(last));
    }
    function el(tag, props = {}, children = []) {
        const node = document.createElement(tag);
        for (const [key, value] of Object.entries(props)) {
            if (key === 'text')
                node.textContent = value;
            else if (key === 'class')
                node.className = value;
            else
                node.setAttribute(key, value);
        }
        for (const child of children)
            node.append(child);
        return node;
    }
    class MsecAssistant extends HTMLElement {
        constructor() {
            super();
            this.history = [];
            this.busy = false;
            this.built = false;
        }
        connectedCallback() {
            if (this.built)
                return;
            this.built = true;
            this.lang = (this.getAttribute('lang') || document.documentElement.lang || 'fr').toLowerCase().startsWith('en') ? 'en' : 'fr';
            this.t = Object.assign({}, I18N[this.lang]);
            const appName = (this.getAttribute('app') || 'msec').toLowerCase();
            this.app = APPS[appName] ? appName : 'msec';
            const profile = APPS[this.app];
            if (profile.title)
                this.t.title = profile.title[this.lang];
            if (profile.subtitle)
                this.t.subtitle = profile.subtitle[this.lang];
            if (profile.welcome)
                this.t.welcome = profile.welcome[this.lang];
            if (profile.suggestions)
                this.t.suggestions = profile.suggestions[this.lang];
            if (this.getAttribute('title'))
                this.t.title = this.getAttribute('title').slice(0, 60);
            if (this.getAttribute('welcome'))
                this.t.welcome = this.getAttribute('welcome').slice(0, 300);
            if (this.app !== 'msec' || this.getAttribute('title'))
                this.t.open = (this.lang === 'en' ? 'Open: ' : 'Ouvrir : ') + this.t.title;
            this.accentValue = parseHex(this.getAttribute('accent')) ? this.getAttribute('accent') : profile.accent;
            this.showQuote = profile.quote;
            this.endpoint = this.getAttribute('endpoint') || DEFAULT_ENDPOINT;
            this.root = this.attachShadow({ mode: 'open' });
            this.build();
            this.syncTheme();
            this.mountMsbot();
            this.wireMsbot();
            new MutationObserver(() => this.syncTheme()).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
            if (window.matchMedia) {
                const query = window.matchMedia('(prefers-color-scheme: dark)');
                if (query.addEventListener)
                    query.addEventListener('change', () => this.syncTheme());
            }
            if (document.querySelector('.whatsapp-float'))
                this.style.setProperty('--msec-assistant-bottom', '5.25rem');
        }
        syncTheme() {
            const theme = document.documentElement.getAttribute('data-theme');
            let dark = theme === 'dark' || theme === 'high-contrast';
            if (!theme && window.matchMedia)
                dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setAttribute('data-theme', dark ? 'dark' : 'light');
            const vars = themeVars(this.accentValue, dark);
            this.style.setProperty('--a-accent', vars.accent);
            this.style.setProperty('--a-accent-contrast', vars.contrast);
            this.style.setProperty('--a-user', vars.accent);
            this.style.setProperty('--a-user-text', vars.contrast);
            if (window.MSBot && this.lastDark !== dark) {
                const first = this.lastDark === undefined;
                this.lastDark = dark;
                if (!first)
                    window.MSBot.emit(dark ? 'env.theme.dark' : 'env.theme.light', { force: true });
            }
        }
        mountMsbot() {
            const api = window.MSBot;
            if (!api || !this.botStage)
                return;
            const name = (this.getAttribute('bot-name') || 'MSBot').slice(0, 16);
            this.bot = api.mount(this.botStage, { theme: this.app, name, range: 300 });
            if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
                api.emit('env.mobile', { force: true });
        }
        wireMsbot() {
            const api = window.MSBot;
            if (!api)
                return;
            this.errorCount = 0;
            this.lastError = { el: null, at: 0 };
            let hoverTimer = 0;
            this.launcher.addEventListener('pointerenter', () => {
                api.emit('pointer.hover');
                clearTimeout(hoverTimer);
                hoverTimer = setTimeout(() => api.emit('pointer.hover.long'), 3000);
            });
            this.launcher.addEventListener('pointerleave', () => clearTimeout(hoverTimer));
            this.launcher.addEventListener('click', () => api.emit('pointer.click'));
            const fieldType = (node) => {
                if (!node || !node.matches)
                    return '';
                const tag = node.tagName.toLowerCase();
                if (tag === 'textarea')
                    return 'textarea';
                if (tag === 'select')
                    return 'select';
                const type = (node.getAttribute('type') || 'text').toLowerCase();
                return ['email', 'tel', 'url', 'number', 'date', 'checkbox', 'file', 'password'].includes(type) ? type : 'text';
            };
            const countError = (el) => {
                const at = Date.now();
                if (this.lastError.el === el && at - this.lastError.at < 1500)
                    return;
                this.lastError = { el, at };
                this.errorCount += 1;
                const type = fieldType(el);
                if (type)
                    api.emit('field.' + type + '.format', { el, force: true });
                if (this.errorCount >= 3) {
                    this.errorCount = 0;
                    api.emit('moment.form.errors3', { el, force: true });
                    this.flyTo(el);
                }
            };
            document.addEventListener('invalid', (event) => {
                const el = event.target;
                if (el && el.matches && el.matches('input,textarea,select'))
                    countError(el);
            }, true);
            document.addEventListener('blur', (event) => {
                const el = event.target;
                if (!el || !el.matches || !el.matches('input,textarea,select'))
                    return;
                if (el.hasAttribute('required') && !el.checkValidity())
                    countError(el);
            }, true);
            document.addEventListener('focusin', (event) => {
                const el = event.target;
                const type = fieldType(el);
                if (type)
                    api.emit('field.' + type + '.focus');
            });
            document.addEventListener('click', (event) => {
                const node = event.target && event.target.closest ? event.target : null;
                const el = node && node.closest('a[href^="tel:"],a[href*="wa.me"],a[href*="whatsapp"],[data-msbot]');
                if (!el)
                    return;
                const href = el.getAttribute('href') || '';
                const key = el.getAttribute('data-msbot') || (href.indexOf('tel:') === 0 ? 'call' : 'whatsapp');
                const map = {
                    quote: 'intent.quote', services: 'intent.services', blog: 'nav.blog', call: 'contact.call',
                    mail: 'contact.mail', linkedin: 'contact.linkedin', whatsapp: 'contact.whatsapp',
                };
                if (map[key])
                    api.emit(map[key], { force: true });
            }, true);
            document.addEventListener('pointerenter', (event) => {
                const el = event.target;
                if (!el || !el.getAttribute)
                    return;
                const tip = el.getAttribute('data-msbot-tip');
                if (tip && api.say)
                    api.say(tip, 3000);
            }, true);
            document.addEventListener('copy', () => api.emit('pointer.copy'));
            document.addEventListener('paste', () => api.emit('pointer.paste'));
            document.addEventListener('keydown', (event) => {
                if (event.altKey && !event.ctrlKey && !event.metaKey && String(event.key).toLowerCase() === 'm') {
                    event.preventDefault();
                    this.setOpen(this.panel.hidden);
                }
            });
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
                api.emit('env.reducedmotion', { force: true });
        }
        flyTo(el) {
            if (!el || !el.getBoundingClientRect || !window.matchMedia)
                return;
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
                return;
            const target = el.getBoundingClientRect();
            const self = this.getBoundingClientRect();
            const dx = Math.round(target.left - self.left - 8);
            const dy = Math.round(target.top - self.top - 8);
            this.style.transition = 'transform .65s cubic-bezier(.45,0,.2,1)';
            this.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
            clearTimeout(this.flyTimer);
            this.flyTimer = setTimeout(() => { this.style.transform = ''; }, 5200);
        }
        build() {
            const t = this.t;
            const style = el('style');
            style.textContent = STYLE;
            this.launcher = el('button', { class: 'launcher', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'panel', 'aria-label': t.open, id: 'launcher' });
            const botName = (this.getAttribute('bot-name') || 'MSBot').slice(0, 16);
            this.botStage = el('span', { class: 'msbot-stage', id: 'msbot' });
            this.launcher.append(this.botStage, el('span', { class: 'msbot-label', text: botName }));
            this.launcher.addEventListener('click', () => this.toggle());
            this.closeBtn = el('button', { class: 'icon-btn', type: 'button', 'aria-label': t.close, id: 'close', text: '×' });
            this.closeBtn.addEventListener('click', () => this.setOpen(false));
            const headerItems = [];
            const logoUrl = this.getAttribute('logo');
            if (logoUrl && /^https:\/\//.test(logoUrl))
                headerItems.push(el('img', { class: 'logo', src: logoUrl, alt: '', width: '32', height: '32' }));
            headerItems.push(el('div', {}, [el('h2', { text: t.title, id: 'title' }), el('p', { text: t.subtitle })]), this.closeBtn);
            const header = el('header', {}, headerItems);
            this.log = el('div', { class: 'log', role: 'log', 'aria-live': 'polite', 'aria-relevant': 'additions', id: 'log' });
            this.addMessage('assistant', t.welcome);
            this.chips = el('div', { class: 'chips', id: 'chips' });
            for (const text of t.suggestions) {
                const chip = el('button', { class: 'chip', type: 'button', text });
                chip.addEventListener('click', () => this.send(text));
                this.chips.append(chip);
            }
            this.log.append(this.chips);
            this.input = el('textarea', { rows: '1', maxlength: String(MAX_CHARS), placeholder: t.placeholder, 'aria-label': t.placeholder, id: 'input' });
            this.input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    this.send(this.input.value);
                }
            });
            this.sendBtn = el('button', { class: 'primary', type: 'button', text: t.send, id: 'send' });
            this.sendBtn.addEventListener('click', () => this.send(this.input.value));
            this.quoteBtn = el('button', { class: 'link-btn', type: 'button', text: t.quote, id: 'quote' });
            this.quoteBtn.addEventListener('click', () => this.showLead(true));
            this.actions = el('div', { class: 'actions', id: 'actions' });
            if (this.showQuote)
                this.actions.append(this.quoteBtn);
            this.footer = el('footer', {}, [el('div', { class: 'row' }, [this.input, this.sendBtn]), this.actions]);
            this.refreshOrderAction();
            this.leadForm = this.buildLeadForm();
            this.leadForm.hidden = true;
            this.panel = el('section', { class: 'panel', id: 'panel', role: 'dialog', 'aria-labelledby': 'title', 'aria-modal': 'false' }, [header, this.log, this.footer, this.leadForm]);
            this.panel.hidden = true;
            this.panel.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    event.stopPropagation();
                    this.setOpen(false);
                }
            });
            this.root.append(style, this.panel, this.launcher);
        }
        buildLeadForm() {
            const t = this.t;
            const field = (id, label, node) => el('label', { for: id }, [el('span', { text: label }), node]);
            this.leadName = el('input', { id: 'lead-name', type: 'text', autocomplete: 'name', maxlength: '120', required: '' });
            this.leadContact = el('input', { id: 'lead-contact', type: 'text', autocomplete: 'email', maxlength: '254', required: '' });
            this.leadNeed = el('textarea', { id: 'lead-need', maxlength: String(MAX_CHARS), required: '' });
            this.leadStatus = el('div', { class: 'status', role: 'status', 'aria-live': 'polite', id: 'lead-status' });
            this.leadSubmit = el('button', { class: 'primary', type: 'submit', id: 'lead-submit', text: t.submit });
            const back = el('button', { class: 'link-btn', type: 'button', id: 'lead-cancel', text: t.cancel });
            back.addEventListener('click', () => this.showLead(false));
            const form = el('form', { class: 'lead', id: 'lead', novalidate: '' }, [
                el('h3', { text: t.quoteTitle }),
                el('p', { text: t.quoteIntro }),
                field('lead-name', t.name, this.leadName),
                field('lead-contact', t.contact, this.leadContact),
                field('lead-need', t.need, this.leadNeed),
                this.leadStatus,
                this.leadSubmit,
                back,
            ]);
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                this.submitLead();
            });
            return form;
        }
        refreshOrderAction() {
            if (!this.actions)
                return;
            const old = this.actions.querySelector('a.order');
            if (old)
                old.remove();
            const action = this._orderAction;
            if (!action || typeof action.href !== 'function')
                return;
            const link = el('a', { class: 'order', id: 'order-action', target: '_blank', rel: 'noopener noreferrer', href: '#', text: (action.label && action.label[this.lang]) || '' });
            link.addEventListener('click', () => {
                let url = '';
                try {
                    url = String(action.href() || '');
                }
                catch (e) {
                    url = '';
                }
                if (/^https:\/\//.test(url))
                    link.href = url;
                else
                    link.removeAttribute('href');
            });
            this.actions.prepend(link);
        }
        set orderAction(value) { this._orderAction = value; this.refreshOrderAction(); }
        get orderAction() { return this._orderAction; }
        faqAnswer(text) {
            const fold = (value) => String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const words = fold(text);
            let best = null;
            let bestScore = 0;
            for (const entry of this.faq || []) {
                let score = 0;
                for (const keyword of entry.keywords || []) {
                    const k = fold(keyword);
                    if (k && words.indexOf(k) !== -1)
                        score += 1;
                }
                if (score > bestScore) {
                    best = entry;
                    bestScore = score;
                }
            }
            const answer = best && best.answer && best.answer[this.lang];
            return answer ? OFFLINE_TEXT[this.lang] + '\n\n' + answer : OFFLINE_NO_MATCH[this.lang];
        }
        toggle() {
            this.setOpen(this.panel.hidden);
        }
        setOpen(open) {
            this.panel.hidden = !open;
            this.launcher.setAttribute('aria-expanded', String(open));
            if (window.MSBot)
                window.MSBot.emit(open ? (this.openedOnce ? 'chat.reopen' : 'chat.open') : 'chat.close', { force: true });
            if (open)
                this.openedOnce = true;
            if (open) {
                (this.leadForm.hidden ? this.input : this.leadName).focus();
            }
            else {
                this.launcher.focus();
            }
        }
        showLead(show) {
            this.leadForm.hidden = !show;
            this.log.hidden = show;
            this.footer.hidden = show;
            (show ? this.leadName : this.input).focus();
        }
        addMessage(role, text, isError = false) {
            const bubble = el('div', { class: `msg ${role}${isError ? ' error' : ''}` });
            bubble.append(el('span', { class: 'who', text: role === 'user' ? this.t.you : this.t.assistant }));
            appendRich(bubble, text);
            if (this.chips && this.chips.parentNode === this.log)
                this.log.insertBefore(bubble, this.chips);
            else
                this.log.append(bubble);
            this.log.scrollTop = this.log.scrollHeight;
            return bubble;
        }
        setThinking(on) {
            if (on) {
                this.thinkingNode = el('div', { class: 'thinking', id: 'thinking' }, [
                    el('span', { class: 'dots', 'aria-hidden': 'true' }, [el('i'), el('i'), el('i')]),
                    el('span', { text: this.t.thinking }),
                ]);
                this.log.append(this.thinkingNode);
                this.log.scrollTop = this.log.scrollHeight;
            }
            else if (this.thinkingNode) {
                this.thinkingNode.remove();
                this.thinkingNode = null;
            }
        }
        async post(payload) {
            const controller = typeof AbortController === 'function' ? new AbortController() : null;
            const timer = setTimeout(() => { if (controller)
                controller.abort(); }, REQUEST_TIMEOUT_MS);
            try {
                const headers = { 'Content-Type': 'application/json' };
                if (typeof this.tokenProvider === 'function') {
                    let token = null;
                    try {
                        token = await this.tokenProvider();
                    }
                    catch (e) {
                        token = null;
                    }
                    if (token)
                        headers['X-Assistant-Token'] = String(token);
                }
                const response = await fetch(this.endpoint, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload),
                    signal: controller ? controller.signal : undefined,
                });
                let data = null;
                try {
                    data = await response.json();
                }
                catch (e) {
                    data = null;
                }
                return { ok: response.ok, status: response.status, data };
            }
            finally {
                clearTimeout(timer);
            }
        }
        async send(raw) {
            const text = String(raw || '').trim();
            if (!text || this.busy)
                return;
            if (this.chips) {
                this.chips.remove();
                this.chips = null;
            }
            this.busy = true;
            this.sendBtn.disabled = true;
            this.input.value = '';
            this.addMessage('user', text);
            this.history.push({ role: 'user', content: text.slice(0, MAX_CHARS) });
            this.history = this.history.slice(-MAX_HISTORY);
            this.setThinking(true);
            if (this.faq && typeof navigator !== 'undefined' && navigator.onLine === false) {
                this.setThinking(false);
                this.addMessage('assistant', this.faqAnswer(text));
                this.history.pop();
                this.busy = false;
                this.sendBtn.disabled = false;
                this.input.focus();
                return;
            }
            try {
                const result = await this.post({ app: this.app, lang: this.lang, messages: this.history });
                this.setThinking(false);
                if (result.ok && result.data && typeof result.data.reply === 'string') {
                    this.addMessage('assistant', result.data.reply);
                    this.history.push({ role: 'assistant', content: result.data.reply.slice(0, MAX_CHARS) });
                    this.history = this.history.slice(-MAX_HISTORY);
                }
                else {
                    const message = result.data && typeof result.data.message === 'string' ? result.data.message : this.t.networkError;
                    this.addMessage('assistant', message, true);
                    this.history.pop();
                }
            }
            catch (e) {
                this.setThinking(false);
                this.addMessage('assistant', this.faq ? this.faqAnswer(text) : this.t.networkError, !this.faq);
                this.history.pop();
            }
            finally {
                this.busy = false;
                this.sendBtn.disabled = false;
                this.input.focus();
            }
        }
        setLeadStatus(text, kind) {
            this.leadStatus.textContent = text;
            this.leadStatus.className = `status ${kind || ''}`;
        }
        async submitLead() {
            const name = this.leadName.value.trim();
            const contact = this.leadContact.value.trim();
            const need = this.leadNeed.value.trim();
            if (!name || !contact || !need) {
                this.setLeadStatus(this.t.fieldsRequired, 'error');
                return;
            }
            this.leadSubmit.disabled = true;
            this.setLeadStatus(this.t.sending, '');
            try {
                const result = await this.post({ action: 'lead', app: this.app, lang: this.lang, lead: { name, contact, need, page: location.href } });
                if (result.ok && result.data && result.data.ok === true) {
                    this.setLeadStatus(this.t.leadOk, 'ok');
                    this.leadName.value = '';
                    this.leadContact.value = '';
                    this.leadNeed.value = '';
                }
                else {
                    const message = result.data && typeof result.data.message === 'string' ? result.data.message : this.t.leadError;
                    this.setLeadStatus(message, 'error');
                }
            }
            catch (e) {
                this.setLeadStatus(this.t.leadError, 'error');
            }
            finally {
                this.leadSubmit.disabled = false;
            }
        }
    }
    customElements.define('msec-assistant', MsecAssistant);
})();
