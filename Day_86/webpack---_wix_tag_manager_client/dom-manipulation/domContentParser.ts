import { NodeToRender } from '../types';

/**
 * Parses the embed content to be able to attach it to the DOM and make it run
 * @param content
 */
function parseEmbedData(content: string | any): NodeToRender[] {
  const toRender: NodeToRender[] = [];
  const div = document.createElement('DIV');
  div.innerHTML = content;
  Array.prototype.forEach.call(div.childNodes, (node) => {
    const nodeData = extractNodeData(node);
    toRender.push(nodeData);
  });
  return toRender;
}

function extractNodeData(node: HTMLElement | any): NodeToRender {
  const nodeType = node.nodeType;
  const domContent = node.innerHTML || node.textContent || node.nodeValue;
  const children: NodeToRender[] = [];

  if (node.hasChildNodes()) {
    Array.prototype.forEach.call(node.childNodes, (childNode) => {
      children.push(extractNodeData(childNode));
    });
  }
  return {
    nodeType,
    tag: node.nodeName,
    attributes: node.attributes,
    content: domContent,
    children,
  };
}

export { parseEmbedData };
