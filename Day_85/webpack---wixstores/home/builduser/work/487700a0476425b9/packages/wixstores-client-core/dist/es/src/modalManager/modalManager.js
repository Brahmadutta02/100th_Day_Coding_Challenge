import {
    __awaiter,
    __generator
} from "tslib";
import {
    restoreFocus,
    storeFocus
} from 'a11y-focus-store';
import _ from 'lodash';
import {
    aModalUrl
} from './modalUrlBuilder';
var maxHeight = 660;
var ModalManager = /** @class */ (function() {
    function ModalManager(openModalObj, baseDomain, instance) {
        this.openModalObj = openModalObj;
        this.instance = instance;
        this.urlBuilder = aModalUrl().withBaseDomain(baseDomain);
        this.urlBuilder.build();
    }
    ModalManager.prototype.openModal = function(_a) {
        var modalName = _a.modalName,
            width = _a.width,
            _b = _a.modalData,
            modalData = _b === void 0 ? null : _b,
            _c = _a.useBareTheme,
            useBareTheme = _c === void 0 ? true : _c;
        return __awaiter(this, void 0, void 0, function() {
            var popupUrl, data;
            return __generator(this, function(_d) {
                switch (_d.label) {
                    case 0:
                        typeof document !== 'undefined' && storeFocus();
                        popupUrl = this.urlBuilder
                            .withModalName(modalName)
                            .withModalData(modalData)
                            .withInstance(this.instance)
                            .build();
                        return [4 /*yield*/ , this.openModalObj.openModal(popupUrl, width, maxHeight, useBareTheme)];
                    case 1:
                        data = _d.sent();
                        typeof document !== 'undefined' && restoreFocus();
                        return [2 /*return*/ , data];
                }
            });
        });
    };
    ModalManager.prototype.openSetPaymentMethod = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                return [2 /*return*/ , this.openModal({
                    modalName: 'setPaymentMethod',
                    width: 600
                })];
            });
        });
    };
    ModalManager.prototype.openChangeRegion = function(modalData) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                return [2 /*return*/ , this.openModal({
                    modalName: 'changeRegion',
                    width: 500,
                    modalData: {
                        existingRegion: {
                            country: modalData.country,
                            subdivision: modalData.subdivision,
                            zipCode: modalData.zipCode,
                        },
                        destinationCompletionList: modalData.destinationCompletionList,
                    },
                })];
            });
        });
    };
    ModalManager.prototype.openSetShippingMethod = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                return [2 /*return*/ , this.openModal({
                    modalName: 'setShippingMethod',
                    width: 600
                })];
            });
        });
    };
    ModalManager.prototype.openUpgradeToPremium = function(modalData) {
        return __awaiter(this, void 0, void 0, function() {
            var data, modalMetaData;
            return __generator(this, function(_a) {
                data = _.omitBy(modalData, _.isNil);
                modalMetaData = {
                    modalName: 'upgradeToPremium',
                    width: 600,
                };
                if (!_.isEmpty(data)) {
                    modalMetaData.modalData = data;
                }
                return [2 /*return*/ , this.openModal(modalMetaData)];
            });
        });
    };
    ModalManager.prototype.openNotInLiveSite = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                return [2 /*return*/ , this.openModal({
                    modalName: 'notInLiveSite',
                    width: 600
                })];
            });
        });
    };
    ModalManager.prototype.openNoOnlinePayments = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                return [2 /*return*/ , this.openModal({
                    modalName: 'noOnlinePayments',
                    width: 580,
                })];
            });
        });
    };
    ModalManager.prototype.openSubscriptions = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                return [2 /*return*/ , this.openModal({
                    modalName: 'subscriptions',
                    width: 375
                })];
            });
        });
    };
    ModalManager.prototype.openUpgradeSubscriptions = function(modalData) {
        return __awaiter(this, void 0, void 0, function() {
            var data;
            return __generator(this, function(_a) {
                data = _.omitBy(modalData, _.isNil);
                return [2 /*return*/ , this.openModal({
                    modalName: 'highArpuSubscriptions',
                    width: 600,
                    modalData: data,
                })];
            });
        });
    };
    ModalManager.prototype.openCantShipToDestination = function(modalData) {
        return __awaiter(this, void 0, void 0, function() {
            var data;
            return __generator(this, function(_a) {
                data = _.omitBy(modalData, _.isNil);
                return [2 /*return*/ , this.openModal({
                    modalName: 'deliveryError',
                    width: 460,
                    modalData: {
                        deliveryError: data
                    }
                })];
            });
        });
    };
    ModalManager.prototype.openPaypalError = function(modalData) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                return [2 /*return*/ , this.openModal({
                    modalName: 'paypalError',
                    width: 460,
                    modalData: {
                        paypalError: modalData
                    }
                })];
            });
        });
    };
    ModalManager.prototype.openErrorWithPaymentMethod = function(modalData) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                return [2 /*return*/ , this.openModal({
                    modalName: 'paymentError',
                    width: 536,
                    modalData: {
                        paymentError: modalData
                    }
                })];
            });
        });
    };
    ModalManager.prototype.openStartFastFlowError = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                return [2 /*return*/ , this.openModal({
                    modalName: 'startFastFlowError',
                    width: 460
                })];
            });
        });
    };
    return ModalManager;
}());
export {
    ModalManager
};
//# sourceMappingURL=modalManager.js.map