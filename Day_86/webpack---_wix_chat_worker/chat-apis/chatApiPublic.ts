import { transformChatroom } from '@wix/wix-chat-transform-bo-events/dist/lib/transform-chatroom';
import * as generateToChat from './generateToChat';
import { MessageDirectionServer } from '@wix/wix-chat-transform-bo-events/dist/lib/types/public-types';

const validateParamTypeOrChannelExists = (
  { type = '', channelId = '' },
  functionName,
) => {
  const paramIsEmpty = type === '' && channelId === '';
  const typeIsValid = ['Business', 'Focused', ''].includes(type);
  if (paramIsEmpty || !typeIsValid) {
    throw new Error(
      `${functionName} expect to get valid type (Business / Focused) or channelId`,
    );
  }
  return;
};

const onMessageReceived = (callback) => {
  generateToChat.callbackEventWithTransformMessage(
    'ChatWidget.onMessageReceived',
    callback,
    MessageDirectionServer.BusinessToCustomer,
  );
};

const onMessageSent = (callback) => {
  generateToChat.callbackEventWithTransformMessage(
    'ChatWidget.onMessageSent',
    callback,
    MessageDirectionServer.CustomerToBusiness,
  );
  return;
};

const onMinimize = (callback) =>
  generateToChat.callbackEvent(
    'ChatWidget.onWidgetCollapsed',
    callback,
    'Collapsed',
  );

const onMaximize = (callback) =>
  generateToChat.callbackEvent('ChatWidget.onWidgetExpand', callback, 'Expand');

const sendMessage = ({ messageText, channelId = null }) =>
  generateToChat.request('ChatWidget.sendMessage', {
    message: messageText,
    chatroom: channelId,
  });

const maximize = () => generateToChat.request('ChatWidget.expandWidget', {});

const minimize = () => generateToChat.request('ChatWidget.collapseWidget', {});

const focusChannel = async ({ channelId = '', type = '' } = {}) => {
  validateParamTypeOrChannelExists({ type, channelId }, 'focusChannel');
  return generateToChat.request('ChatWidget.focusChannel', { type, channelId });
};

const getChannelList = async () => {
  const listOfServerChatroomsDTO = await generateToChat.requestWithResult(
    'ChatWidget.getChatState',
    {},
    'chatrooms',
  );
  const listOfApiChatroomsDTO = listOfServerChatroomsDTO.map((chatroom) =>
    transformChatroom(chatroom._chatroom),
  );
  return listOfApiChatroomsDTO;
};

const maximized = () =>
  generateToChat.requestWithResult(
    'ChatWidget.getChatState',
    {},
    'isWidgetExpanded',
  );

const getChannel = async ({ type = '', channelId = '' } = {}) => {
  validateParamTypeOrChannelExists({ type, channelId }, 'getChannel');
  const serverChatroomDTO: any = await generateToChat.request(
    'ChatWidget.getChannel',
    { type, channelId },
  );
  const apiChatroomDTO = transformChatroom(serverChatroomDTO.channel);
  return apiChatroomDTO;
};

const startChannel = ({ type = '', userId = '' } = {}) =>
  generateToChat.requestWithResult(
    'ChatWidget.startChannel',
    {
      type,
      userId,
    },
    'channelId',
  );

export const chatApiPublic = {
  onMessageReceived,
  onMessageSent,
  onMinimize,
  onMaximize,
  sendMessage,
  maximize,
  minimize,
  focusChannel,
  getChannelList,
  maximized,
  getChannel,
  startChannel,
};
