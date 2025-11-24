const CLEAN_REGEX = /[^a-zA-Z0-9.\-_$#%&]/g;

export function cleanString(str: string | undefined): string {
  return str ? str.trim().replace(CLEAN_REGEX, '') : '';
};
