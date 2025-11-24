import { Bc3RawData, BC3_Measurement } from "../../types/BC3.types";
import { cleanString } from "../Helpers";

export function parseMeasurements(lineItems: string[], measurements: Bc3RawData['measurements']) {
  const rawCode = lineItems[1];

  if (!measurements || !rawCode) return;

  const recordType = lineItems[0].toUpperCase();

  let parentCode: string | undefined;
  let childCode = rawCode;

  if (rawCode.includes('\\')) {
    const codes = rawCode.split('\\');
    parentCode = cleanString(codes[0]);
    childCode = codes[1].trim();
  }


  childCode = cleanString(childCode);
  const key = childCode;

  if (!key) return;

  const positions = lineItems[2]
    ? lineItems[2].split('\\')
      .map(x => x.trim())
      .filter(x => x !== '')
      .map(x => parseInt(x))
    : [];

  const parsedLines: BC3_Measurement['lines'] = [];

  if (lineItems[4]) {
    const childParts = lineItems[4].split('\\');

    for (let j = 0; j < childParts.length; j += 6) {
      if (j + 5 >= childParts.length) break;

      const commentRaw = childParts[j + 1]?.trim() || '';
      const commentParts = commentRaw.includes('#')
        ? commentRaw.split('#')
        : [commentRaw, undefined];

      const u = parseFloat(childParts[j + 2]);
      const l = parseFloat(childParts[j + 3]);
      const w = parseFloat(childParts[j + 4]);
      const h = parseFloat(childParts[j + 5]);

      if (childParts[j] || commentRaw || !isNaN(u)) {
        parsedLines.push({
          type: childParts[j]?.trim(),
          comment: commentParts[0],
          bimId: commentParts[1]?.trim(),
          units: isNaN(u) ? undefined : u,
          length: isNaN(l) ? undefined : l,
          width: isNaN(w) ? undefined : w,
          height: isNaN(h) ? undefined : h,
        });
      }
    }
  }

  if (recordType === 'N' && measurements[key]) {
    measurements[key].lines.push(...parsedLines);

    const newTotal = parseFloat(lineItems[3]);
    if (!isNaN(newTotal)) {
      measurements[key].total = newTotal;
    }
  }
  else {
    measurements[key] = {
      parentCode: parentCode,
      childCode: childCode,
      position: positions,
      total: parseFloat(lineItems[3]) || 0,
      lines: parsedLines,
      tag: lineItems[5]?.trim(),
    };
  }
}
