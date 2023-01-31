export function isExperimentOpen(
  experiments: Record<string, string>,
  spec: string,
): boolean {
  return experiments && experiments[spec] === 'true';
}
