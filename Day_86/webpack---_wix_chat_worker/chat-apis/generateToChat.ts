import { transformMessage } from '@wix/wix-chat-transform-bo-events/dist/lib/transform-message';
import type { MessageDirectionServer } from '@wix/wix-chat-transform-bo-events';

const uuidv4 = require('uuid/v4');

const context: any = {};

export const callbackEventWithTransformMessage = (
  requestName: string,
  callback: Function,
  transformMessageType: MessageDirectionServer,
) => {
  context.pubSub.subscribe(requestName, ({ data }) =>
    callback(transformMessage(data, transformMessageType)),
  );
};

export const callbackEvent = (
  requestName: string,
  callback: Function,
  eventType: string,
) => {
  context.pubSub.subscribe(requestName, (data) => callback(eventType, data));
};

export const requestWithResult = (
  requestName: string,
  param: object,
  resultName: string,
) => {
  return request(requestName, param).then((results: any) =>
    results ? results[resultName] : null,
  );
};

let setPageIsReady;

const isPageReady = new Promise((resolve) => {
  setPageIsReady = resolve;
});

export const request = (requestName, param) => {
  const requestId = uuidv4();
  const responseName = `${requestName}Response.${requestId}`;

  return new Promise(async (resolve, reject) => {
    await isPageReady;
    context.pubSub.subscribe(
      responseName,
      ({ data: { success, results } = { success: false, results: {} } }) => {
        context.pubSub.unsubscribe(responseName);
        success ? resolve(results) : reject(new Error('request failed'));
      },
    );
    context.pubSub.publish(
      requestName,
      { requestId: String(requestId), ...param },
      false,
    );
  });
};

export const initAppForPage = ({ instance }, { pubSub }) => {
  context.pubSub = pubSub;
  pubSub.subscribe('ChatWidget.isReady', () => setPageIsReady(), true);
  return Promise.resolve();
};
