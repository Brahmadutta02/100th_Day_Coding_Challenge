export const wixGuard = '<span class="wixGuard">&#8203;</span>';

export const startTagRegex = `<([-A-Za-z0-9_?:]+)((?:\\s+(?:x:)?[-A-Za-z0-9_]+(?:\\s*=\\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\\s]+))?)*)\\s*(/?)>`;
export const endTagRegex = `</([-A-Za-z0-9_?:]+)[^>]*>`;
export const endBlockTagRegex = `</(h[1-6]|p)[^>]*>`;

export const wixCodeName = '$w.Text';

export const TestIds = {
  richTextElement: 'richTextElement',
  containerElement: 'containerElement',
  screenReaderPrefixElement: 'screenReaderPrefixElement',
  screenReaderSuffixElement: 'screenReaderSuffixElement',
} as const;
