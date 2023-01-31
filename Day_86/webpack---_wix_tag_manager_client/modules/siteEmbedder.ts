import { eventNames, publishEvent } from './events';
import { createTagCallBack, runCallback } from '../utils/callbackUtils';
import { buildNode } from '../dom-manipulation/nodeBuilder';
import { parseEmbedData } from '../dom-manipulation/domContentParser';
import {
  NodeToRender,
  Position,
  SiteEmbededTag,
  PageInfo,
  SiteTag,
} from '../types';
import { addLoadedTag, addLoadErrorTag, setLoading } from './stateCache';
import { filterTagsByPageID, getSiteTagsFromSiteEmbed } from './tags';
import { SHOULD_RENDER_TAGS_PER_PAGE_SPEC } from '../consts/consts';
import { isExperimentOpen } from '../utils/experiments';

/**
 *  Iterate through the embeds collection and apply them to the DOM
 *  Keep a reference to any nodes that need to be reapplied for removal
 *  Keep a reference to any embeds that should be reapplied to re-apply them
 * @param tags - tags list from tag-manager-server.
 * @param pageInfo - represent that page information to load the tags list on .
 * @param experiments - map of experiments for A/B testing and gradually releases.
 */
function applySiteEmbeds(
  tags: SiteEmbededTag[],
  pageInfo: PageInfo,
  experiments: Record<string, string>,
) {
  const tagsWithoutEmbeddedNodes: SiteEmbededTag[] = tags.filter(
    (tag) => !tag.embeddedNodes,
  );
  const shouldRenderTagsPerPage: boolean = isExperimentOpen(
    experiments,
    SHOULD_RENDER_TAGS_PER_PAGE_SPEC,
  );
  const tagsToEmbed: SiteEmbededTag[] = shouldRenderTagsPerPage
    ? filterTagsByPageID(tagsWithoutEmbeddedNodes, pageInfo)
    : tagsWithoutEmbeddedNodes;

  const loadingTags: SiteTag[] = getSiteTagsFromSiteEmbed(tagsToEmbed);
  setLoading(loadingTags);
  publishEvent(eventNames.TAGS_LOADING, window as any, loadingTags);

  tagsToEmbed.forEach((siteEmbed: SiteEmbededTag) => {
    const tag = siteEmbed.tag;
    const nodesToEmbed = parseEmbedData(tag.content);
    const embedLocation =
      tag.position && tag.position !== Position.HEAD
        ? document.body
        : document.head;

    const embeddedNodes = createSiteEmbed(
      nodesToEmbed,
      {
        onload: createTagCallBack(
          eventNames.TAG_LOADED,
          tag.name,
          tag,
          addLoadedTag,
        ),
        onerror: createTagCallBack(
          eventNames.TAG_LOAD_ERROR,
          tag.name,
          tag,
          addLoadErrorTag,
        ),
      },
      embedLocation,
      tag.position === Position.BODY_START,
    );

    siteEmbed.embeddedNodes = embeddedNodes;
  });
}

/**
 *
 * @param renderingInput - an Array of DOM Nodes to render
 * @param callbacks - { onloaded, onerror } - methods to notify when load has been completed for all nodes or failed for some
 * @param parentNode - the node to embed in
 * @param before - if to embed in the beginning of the body
 */
function createSiteEmbed(
  renderingInput: NodeToRender[],
  callbacks: {
    onload?: Function;
    onerror?: Function;
  },
  parentNode: HTMLElement,
  before: boolean,
) {
  const resultNodes: any = [];
  let counters = 0;

  const onload = () => {
    counters = counters - 1;
    if (counters >= 0) {
      runCallback(callbacks.onload, {});
    }
  };
  const onerror = () => {
    counters = counters - 1;
    if (counters >= 0) {
      runCallback(callbacks.onerror, { error: true });
    }
  };
  const firstChild = parentNode.firstChild; // captured so all nodes are inserted before it
  renderingInput.forEach((node: NodeToRender) => {
    if (node.tag === 'SCRIPT') {
      counters = counters + 1;
    }
    const resultNode = buildNode(node, { onload, onerror });
    resultNodes.push(resultNode);
    if (before) {
      parentNode.insertBefore(resultNode, firstChild);
    } else {
      parentNode.appendChild(resultNode);
    }
  });
  if (counters === 0) {
    runCallback(callbacks.onload, {}, true);
  }
  return resultNodes;
}

export { applySiteEmbeds };
