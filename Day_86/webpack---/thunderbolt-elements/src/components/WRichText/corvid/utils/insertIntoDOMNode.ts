import parser from '@wix/neat-html-parser';

function buildHtmlFromTagStack(tagStack: Array<any>, textInTheMiddle: string) {
  let openTags = '';
  let closingTags = '';

  for (const { tagName, props } of tagStack) {
    openTags += props ? `<${tagName} ${props}>` : `<${tagName}>`;
    closingTags = `</${tagName}>${closingTags}`;
  }

  return openTags + textInTheMiddle + closingTags;
}

export function insertContentInHtml(html: string, content: string) {
  const tagStack: Array<any> = [];
  let stop = false;

  parser.parseFragment(html, {
    onText: () => {
      stop = true;
    },
    onOpenTag: (tag: any) => {
      if (tag.tagName === 'span' && tag.props === 'class="wixGuard"') {
        stop = true;
      }
      if (!stop) {
        tagStack.push(tag);
      }
    },
    onClosingTag: () => {
      if (!stop) {
        // if we are here than tag is empty
        tagStack.pop();
      }
    },
  });

  return buildHtmlFromTagStack(tagStack, content);
}

const MARKER_TAG_NAME = 'span';
const MARKER_ATTRIBUTE = 'data-attr-richtext-marker="true"';

export function wrapWithRichTextMarker(html: string) {
  return `<${MARKER_TAG_NAME} ${MARKER_ATTRIBUTE}>${html}</${MARKER_TAG_NAME}>`;
}

export function hasRichTextMarker(html: string) {
  return html.includes(MARKER_ATTRIBUTE);
}

function getTag(tag: any) {
  const props = tag.props ? ` ${tag.props}` : '';
  return `<${tag.tagName}${props}>`;
}

export function insertContentInMarker(html: string, content: string) {
  const context = parseRichTextMarker(html);

  if (!context.withMarker) {
    return html;
  }

  return `${context.before}${wrapWithRichTextMarker(content)}${context.after}`;
}

export function getMarkerContent(html: string) {
  const context = parseRichTextMarker(html);
  return context.marker;
}

export function parseRichTextMarker(html: string) {
  let markerStarted = false;
  let markerFinished = false;

  const context = {
    before: '',
    marker: '',
    after: '',
    withMarker: false,
  };

  const stack: Array<string> = [];

  parser.parseFragment(html, {
    onText: (text: string) => {
      if (markerStarted) {
        context.marker += text;
      } else if (markerFinished) {
        context.after += text;
      } else {
        context.before += text;
      }
    },
    onOpenTag: (tag: any) => {
      const symbol = getTag(tag);

      if (markerStarted) {
        // stack opened tags to detect whenever marker tag is closed
        stack.push(tag.tagName);
        context.marker += symbol;
      }

      if (
        !markerFinished &&
        tag.tagName === MARKER_TAG_NAME &&
        tag.props === MARKER_ATTRIBUTE
      ) {
        context.withMarker = true;
        markerStarted = true;
      }

      if (!markerStarted) {
        if (markerFinished) {
          context.after += symbol;
        } else {
          context.before += symbol;
        }
      }
    },
    onClosingTag: (tag: any) => {
      const symbol = `</${tag.tagName}>`;

      if (markerStarted) {
        // check if closing tag is a marker
        if (stack.length === 0 && tag.tagName === MARKER_TAG_NAME) {
          markerFinished = true;
          markerStarted = false;
        } else {
          context.marker += symbol;
          stack.pop();
        }
      } else if (markerFinished) {
        context.after += symbol;
      } else {
        context.before += symbol;
      }
    },
  });

  return context;
}
