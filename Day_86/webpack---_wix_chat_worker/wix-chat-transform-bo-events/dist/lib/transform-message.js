"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.transformMessage = void 0;
var public_types_1 = require("./types/public-types");
var transformDirectionDTO = function(directionServer) {
    return directionServer === public_types_1.MessageDirectionServer.CustomerToBusiness ? 'VisitorToBusiness' : 'BusinessToVisitor';
};
var transformMessage = function(message, directionParam) {
    var textMessage = (message.data && message.data[0] && message.data[0].data.text) || undefined;
    var rawPayload = (message.metadata) || undefined;
    var direction = transformDirectionDTO(directionParam);
    var type = textMessage ? 'TEXT' : undefined;
    var summary = message.summary,
        chatroomId = message.chatroomId;
    var participantId = message.sender.userId;
    var metadata = {};
    if (rawPayload) {
        metadata = Object.keys(rawPayload).reduce(function(acc, key) {
            try {
                acc[key] = JSON.parse(rawPayload[key]);
            } catch (_a) {
                acc[key] = rawPayload[key];
            }
            return acc;
        }, {});
    }
    var payload = {
        text: textMessage
    };
    var createdDate = message.createdAt ? new Date(message.createdAt) : undefined;
    // TODO: Deprecation elements
    var sender = {
        //This isn't strictly correct, because OneApp messages are always from 'user' even when they're from members
        //In chat platform we refer to "Visitor" as ALL types of users that are not business use: Anonymous visitor, Contact and Member
        role: (message.sender.type === 'user' ? 'Admin' : 'Visitor'),
        id: message.sender.userId
    };
    return {
        channelId: chatroomId,
        sequence: message.sequence,
        type: type,
        summary: summary,
        participantId: participantId,
        createdDate: createdDate,
        metadata: metadata,
        payload: payload,
        direction: direction,
        sender: sender,
    };
};
exports.transformMessage = transformMessage;
//# sourceMappingURL=transform-message.js.map