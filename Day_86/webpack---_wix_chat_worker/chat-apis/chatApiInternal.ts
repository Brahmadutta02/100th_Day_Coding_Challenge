import * as generateToChat from './generateToChat';
import { MessageDirectionServer } from '@wix/wix-chat-transform-bo-events/dist/lib/types/public-types';

const onMessage = (callback) => {
  generateToChat.callbackEventWithTransformMessage(
    'ChatWidget.onMessageReceived',
    callback,
    MessageDirectionServer.BusinessToCustomer,
  );
  generateToChat.callbackEventWithTransformMessage(
    'ChatWidget.onMessageSent',
    callback,
    MessageDirectionServer.CustomerToBusiness,
  );
  return;
};

const isMembersChatEnabled = () =>
  generateToChat.requestWithResult(
    'ChatWidget.getChatSettings',
    {},
    'isSocialChat',
  );

const isBusinessChatEnabled = () =>
  generateToChat.requestWithResult(
    'ChatWidget.getChatSettings',
    {},
    'isBusinessChat',
  );

const isWidgetAvailable = () =>
  generateToChat.requestWithResult(
    'ChatWidget.getChatState',
    {},
    'isWidgetAvailable',
  );

const startPrivateChat = (userId) =>
  generateToChat.request('ChatWidget.startPrivateChat', {
    userId,
  });

export const chatApiInternal = {
  onMessage,
  isMembersChatEnabled,
  isBusinessChatEnabled,
  isWidgetAvailable,
  startPrivateChat,
};
