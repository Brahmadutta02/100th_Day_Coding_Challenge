const viewerScript = require('./viewer-script');

module.exports = {
    createControllers: viewerScript.createControllers,
    initAppForPage: viewerScript.initAppForPage,
    exports: viewerScript.chatApi,
};