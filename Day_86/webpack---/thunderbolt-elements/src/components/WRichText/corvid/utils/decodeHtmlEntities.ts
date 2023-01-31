/// <reference lib="webworker" />

import namedReferenceRegex from './namedReferenceRegex';
import htmlEntitiesMap from './htmlEntitiesMap';
import numericEntitiesMap from './numericEntitiesMap';

const HE_URL = 'https://static.parastorage.com/unpkg/he@1.2.0/he.js';
const ENTITY_START = '&';
const ENTITY_END = ';';

function codePointToSymbol(codePoint: number) {
  let output = '';

  const numericEntities: Record<number, any> = numericEntitiesMap;

  if (codePoint in numericEntitiesMap) {
    return numericEntities[codePoint];
  }

  if (codePoint > 0xffff) {
    codePoint -= 0x10000;
    output += String.fromCharCode(((codePoint >>> 10) & 0x3ff) | 0xd800);
    codePoint = 0xdc00 | (codePoint & 0x3ff);
  }

  return output + String.fromCharCode(codePoint);
}

function getEntities(str: string) {
  const result = [];
  let buffer = [];
  let include = false;

  for (const char of str) {
    if (include && char !== ENTITY_END) {
      buffer.push(char);
    }

    if (char === ENTITY_START) {
      include = true;
    }

    if (char === ENTITY_END) {
      result.push(buffer.join(''));
      include = false;
      buffer = [];
    }
  }

  return result;
}

export const decode = (rawText: string): string => {
  if (!rawText) {
    return rawText;
  }

  if (self.he) {
    return self.he.decode(rawText);
  }

  const entities = getEntities(rawText);
  const canConvert = entities.every(
    entity => entity in htmlEntitiesMap || entity[0] === '#',
  );

  if (canConvert) {
    return rawText.replace(namedReferenceRegex, ($0, $1, $2, $3) => {
      const htmlEntities: Record<string, any> = htmlEntitiesMap;

      if ($1) {
        return htmlEntities[$1];
      }

      if ($2) {
        return codePointToSymbol(parseInt($2, 10));
      }

      if ($3) {
        return codePointToSymbol(parseInt($3, 16));
      }

      return $0;
    });
  }

  self.importScripts(HE_URL);

  return decode(rawText);
};
