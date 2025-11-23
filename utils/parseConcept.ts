import { validRegisterType } from ".";
import { BC3_Concept, BC3_Decomp, BC3_Measurement, BC3_TechInfo } from "../parse/bc3_JSON.types";


export function getConcepts(lines: string[]): BC3_Concept {
  let concepts: BC3_Concept = {
    concepts: {},
    decompositions: {},
    texts: {},
    measurements: {},

    technicalInfo: {},
    residuals: {},
    attachments: {},
  }

  for (let i = 0; i < lines.length; i++) {
    const lineItems = lines[i].split('|');
    const recordType = lineItems[0].toUpperCase();

    if (!validRegisterType.test(recordType)) continue;

    if (recordType === 'C') {
      const { codeId, conceptData } = C(lineItems);
      concepts.concepts[codeId] = conceptData;
    }

    if (recordType === 'D' || recordType === 'Y') {
      const { parentCode, childs } = DY(lineItems);
      if (parentCode && childs && childs.length > 0) {

        if (concepts.decompositions[parentCode]) {
          concepts.decompositions[parentCode]!.push(...childs);
        } else {
          concepts.decompositions[parentCode] = childs;
        }
      }
    }

    if (recordType === 'T' || recordType === 'P') {
      const { conceptId, text } = TP(lineItems);
      if (concepts.texts) {
        concepts.texts[conceptId] = text;
      }
    }

    if (recordType === 'M' || recordType === 'N') {
      const { key, data } = MN(lineItems);

      if (concepts.measurements && key) {
        concepts.measurements[key] = data[key];

        if (recordType === 'N') {
          concepts.measurements[key]!.lines?.push(...data[key].lines || []);
        }
      }
    }

    //Not yet
    if (/[LQJ]/.test(recordType)) {
      LQJ(lineItems);
    }

    if (recordType === 'X') {
      const { values, ref, isRef, conceptId } = X(lineItems);

      if (concepts.technicalInfo) {
        if (isRef && ref) {
          concepts.technicalInfo.ref = {
            ...concepts.technicalInfo.ref,
            ...ref
          };
        }

        if (!isRef && values && conceptId) {
          const existingProps = concepts.technicalInfo.values?.[conceptId] || {};
          const newProps = values[conceptId];

          concepts.technicalInfo.values = {
            ...concepts.technicalInfo.values,
            [conceptId]: { ...existingProps, ...newProps }
          };
        }
      }
    }

    if (recordType === 'R') {

    }

    if (recordType === 'F' || recordType === 'G') {

    }

  }

  return { ...concepts };
}

// [C]
function C(lineItems: string[]) {
  return {
    codeId: lineItems[1].replace(/[^a-zA-Z0-9.]/g, '').trim(),
    conceptData: {
      code: lineItems[1].trim(),
      unit: lineItems[2]?.trim(),
      summary: lineItems[3]?.trim(),
      price: parseFloat(lineItems[4]) || 0,
      date: lineItems[5]?.trim().replace(/\\/, ''),
      type: parseInt(lineItems[6]) || 0,
      typeSigla: lineItems[7]?.trim(),
    }
  }
}

// [D, Y]
function DY(lineItems: string[]) {
  const childList: BC3_Decomp['childs'] = [];

  if (lineItems.length > 2 && lineItems[2]) {
    const parts = lineItems[2].split('\\');

    for (let i = 0; i < parts.length; i += 3) {
      const childCode = parts[i]?.trim();

      if (!childCode) continue;

      childList.push({
        code: childCode,
        factor: parseFloat(parts[i + 1]) || 1.0,
        yield: parseFloat(parts[i + 2]) || 1.0,
      });
    }
  }

  return {
    parentCode: lineItems[1].trim().replace(/[^a-zA-Z0-9.]/g, ''),
    childs: childList
  };
}

// [T, P] no DLL
function TP(lineItems: string[]) {
  return {
    conceptId: lineItems[1].trim().replace(/[^a-zA-Z0-9.]/g, ''),
    text: lineItems[2]?.trim(),
  }
}

// [M, N]
function MN(lineItems: string[]) {
  let measurements: BC3_Concept['measurements'] = {};
  const measurementId = lineItems[1].replace(/\\/, '').trim();

  const codes = lineItems[1].split('\\');
  const positions = lineItems[2]
    ? lineItems[2].split('\\')
      .map(x => x.trim())
      .filter(x => x !== '')
      .map(x => parseInt(x))
    : [];

  let lines: BC3_Measurement['lines'] = [];

  if (lineItems[4]) {
    const parts = lineItems[4].split('\\');

    for (let i = 0; i < parts.length; i += 6) {
      if (i + 5 < parts.length) {
        const commentParts = parts[i + 1]?.trim().split('#');

        lines.push({
          type: parts[i]?.trim(),
          comment: commentParts[0],
          units: parseInt(parts[i + 2]) || undefined,
          length: parseFloat(parts[i + 3]) || undefined,
          height: parseFloat(parts[i + 4]) || undefined,
          width: parseFloat(parts[i + 5]) || undefined,
          bimId: commentParts[1] || '',
        });
      }
    }
  }

  measurements[measurementId] = {
    parentCode: codes[0],
    childCode: codes[1],
    position: positions,
    total: parseFloat(lineItems[3]) || 0,
    lines,
    tag: lineItems[5]?.trim(),
  }

  return {
    key: measurementId,
    data: measurements
  }
}

// [L, Q, J]
function LQJ(lineItems: string[]) {
  return null
}

// [X]
function X(lineItems: string[]) {
  const rawCode = lineItems[1]?.trim();
  const conceptId = rawCode ? rawCode.replace(/[^a-zA-Z0-9.]/g, '') : '';

  const isRef = conceptId === '';

  let ref: BC3_TechInfo['ref'] = {};
  let values: BC3_TechInfo['values'] = {};

  if (lineItems[2]) {
    const parts = lineItems[2].split('\\');

    if (isRef) {
      for (let i = 0; i < parts.length; i += 3) {
        const techId = parts[i]?.trim();
        if (techId) {
          ref[techId] = {
            summary: parts[i + 1]?.trim(),
            unit: parts[i + 2]?.trim(),
          };
        }
      }
    } else {
      if (!values[conceptId]) {
        values[conceptId] = {};
      }

      for (let i = 0; i < parts.length; i += 2) {
        const techId = parts[i]?.trim();
        if (techId) {
          values[conceptId][techId] = parseFloat(parts[i + 1]) || 0;
        }
      }
    }
  }

  return { ref, values, conceptId, isRef };
}

// [R]
function R(lineItems: string[]) {
  return null
}

// [F, G]
function FG(lineItems: string[]) {
  return null
}
