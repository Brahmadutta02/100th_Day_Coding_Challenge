"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.transformChatroom = void 0;
var transform_message_1 = require("./transform-message");
var public_types_1 = require("./types/public-types");
var transformChatroom = function(chatroom) {
    var id = chatroom.id,
        lastMessage = chatroom.lastMessage,
        name = chatroom.name,
        initials = chatroom.initials,
        businessContext = chatroom.businessContext;
    var image = chatroom.thumbnail || '';
    var message = (0, transform_message_1.transformMessage)(lastMessage, public_types_1.MessageDirectionServer.CustomerToBusiness);
    var displayData = businessContext ? {
        image: image,
        name: name,
        initials: initials
    } : {
        image: image,
        name: name
    };
    return {
        id: id,
        displayData: displayData,
        messages: [message],
    };
};
exports.transformChatroom = transformChatroom;
//# sourceMappingURL=transform-chatroom.js.map