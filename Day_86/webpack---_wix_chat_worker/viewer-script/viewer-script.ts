import * as generateToChat from '../chat-apis/generateToChat';
import { chatApiPublic } from '../chat-apis/chatApiPublic';
import { chatApiInternal } from '../chat-apis/chatApiInternal';

export const chatApi = {
  ...chatApiPublic,
  ...chatApiInternal,
};

const pageReadyImpl = ($w) => {};

export const createControllers = (controllerConfigs) =>
  controllerConfigs.map(() =>
    Promise.resolve({
      pageReady: pageReadyImpl,
      exports: () => chatApi,
    }),
  );

export const initAppForPage = ({ instance }, { pubSub }) =>
  generateToChat.initAppForPage({ instance }, { pubSub });
