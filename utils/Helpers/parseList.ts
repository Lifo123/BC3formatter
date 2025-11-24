export function parseList(field: string | undefined): string[] {
  if (!field) return [];
  return field.split('\\').map(s => s.trim()).filter(s => s !== '');
}


export function parseNumberList(field: string | undefined): number[] {
  return parseList(field).map(s => parseFloat(s) || 0);
}
