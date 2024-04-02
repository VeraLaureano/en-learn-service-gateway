import sanitize from 'sanitize-html';

export const cleanXSS = (dirty: string): string => {
  return sanitize(dirty, {
    allowedTags: [],
    allowedAttributes: {},
  });
};