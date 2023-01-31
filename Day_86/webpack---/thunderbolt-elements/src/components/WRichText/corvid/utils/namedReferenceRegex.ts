import htmlEntitiesMap from './htmlEntitiesMap';

const namedReferences = Object.keys(htmlEntitiesMap).sort(
  (a, b) => b.length - a.length,
);

export default new RegExp(
  `&(${namedReferences.join('|')});|&#([0-9]+);|&#[xX]([a-fA-F0-9]+);`,
  'g',
);
