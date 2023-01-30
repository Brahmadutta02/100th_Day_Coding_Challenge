"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.reportPhaseStarted = void 0;
var _window = window;

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function sendBI(evid, extra) {
    if (extra === void 0) {
        extra = '';
    }
    var _a = _window.fedops.data,
        site = _a.site,
        rollout = _a.rollout,
        fleetConfig = _a.fleetConfig,
        requestUrl = _a.requestUrl,
        frogOnUserDomain = _a.frogOnUserDomain;
    if (requestUrl.includes('suppressbi=true')) {
        return;
    }
    var fedOpsAppName = site.isResponsive ? 'thunderbolt-responsive' : 'thunderbolt';
    var isDACRollout = rollout.isDACRollout,
        siteAssetsVersionsRollout = rollout.siteAssetsVersionsRollout;
    var is_dac_rollout = isDACRollout ? 1 : 0;
    var is_sav_rollout = siteAssetsVersionsRollout ? 1 : 0;
    var is_rollout = fleetConfig.code === 0 || fleetConfig.code === 1 ? fleetConfig.code : null;
    var pageVisibilty = document.visibilityState;
    var types = {
        WixSite: 1,
        UGC: 2,
        Template: 3,
    };
    var siteType = site.siteType;
    var st = types[siteType] || 0;
    var frog = frogOnUserDomain ? site.externalBaseUrl.replace(/^https?:\/\//, '') + '/_frog' : '//frog.wix.com';
    var url = frog +
        '/bolt-performance?src=72&evid=' +
        evid +
        '&appName=' +
        fedOpsAppName +
        '&is_rollout=' +
        is_rollout +
        '&is_sav_rollout=' +
        is_sav_rollout +
        '&is_dac_rollout=' +
        is_dac_rollout +
        '&dc=' +
        site.dc +
        '&msid=' +
        site.metaSiteId +
        '&session_id=' +
        site.sessionId +
        '&vsi=' +
        uuidv4() +
        '&pv=' +
        pageVisibilty +
        '&v=' +
        _window.thunderboltVersion +
        '&url=' +
        requestUrl +
        '&st=' +
        st +
        extra;
    // send beacon the old way:
    new Image().src = url;
}

function reportPhaseStarted(phase) {
    var evid = 28;
    var ts = Date.now() - _window.initialTimestamps.initialTimestamp;
    var duration = Date.now() - ts;
    sendBI(evid, "&name=".concat(phase, "&duration=").concat(duration));
}
exports.reportPhaseStarted = reportPhaseStarted;
//# sourceMappingURL=reportPhaseStarted.js.map