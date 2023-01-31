import { runCallback } from '../utils/callbackUtils';
import { NodeToRender } from '../types';

function buildNode(
  nodeInfo: NodeToRender,
  callbacks: {
    onload?: Function;
    onerror?: Function;
  },
) {
  let node: HTMLElement | Node;
  if (nodeInfo.nodeType === Node.TEXT_NODE) {
    node = document.createTextNode(nodeInfo.content);
  } else if (nodeInfo.nodeType === Node.COMMENT_NODE) {
    node = document.createComment(nodeInfo.content);
  } else {
    node = document.createElement(nodeInfo.tag);
    if (nodeInfo && nodeInfo.attributes instanceof NamedNodeMap) {
      Array.prototype.forEach.call(nodeInfo.attributes, (attr: any) => {
        setAttribute(node, attr.name, attr.value);
      });
    } else if (typeof nodeInfo.attributes === 'object') {
      Object.keys(nodeInfo.attributes).forEach((key: string) => {
        if (typeof nodeInfo.attributes[key] !== void 0) {
          setAttribute(node, key, nodeInfo.attributes[key]);
        }
      });
    }

    if (nodeInfo.tag === 'SCRIPT') {
      enhanceScript(node, nodeInfo.content, callbacks);
    } else if (nodeInfo.children && nodeInfo.children.length > 0) {
      nodeInfo.children.forEach((childNode) => {
        const renderedChild = buildNode(childNode, callbacks);
        node.appendChild(renderedChild);
      });
    }
  }
  return node;
}

function enhanceScript(
  script: HTMLScriptElement | any,
  content: string = '',
  callbacks: {
    onload?: Function;
    onerror?: Function;
  },
) {
  if (content) {
    script.src = createUrlBlob(content);
  }
  script.addEventListener(
    'load',
    () => {
      runCallback(callbacks && callbacks.onload, null);
    },
    false,
  );
  script.addEventListener(
    'error',
    () => {
      runCallback(callbacks && callbacks.onerror, null);
    },
    false,
  );
}

function setAttribute(
  node: HTMLElement | HTMLScriptElement | any,
  key: string,
  value: any,
) {
  node.setAttribute(key, value);
}

function createUrlBlob(content: string) {
  const blob = new Blob([content], {
    type: 'text/javascript;charset=utf-8',
  });
  return URL.createObjectURL(blob);
}

export { buildNode };
