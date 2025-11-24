import type { Bc3RawData } from '../types/BC3.types';
import {
  parseHeader,
  parseConcepts,
  parseDescomposition,
  parseTexts,
  parseMeasurements,
  parseTechnicalInfo,
  parseResiduals,
  parseAttachments,
  parseParametrics
} from '../utils/bc3_JSON/index';

/**
 * @param buffer
 * @returns { Bc3RawData }
 * * @example
 * function onFileChange = async (file) => {
 *    const buffer = await file.arrayBuffer();
 *    const data = parseBC3(new Uint8Array(buffer));
 * };
 */

export function parseBC3(buffer: Uint8Array) {
  const decoder = new TextDecoder('windows-1252');
  const content = decoder.decode(buffer);

  const data: Bc3RawData = {
    info: {},
    concepts: {},
    decompositions: {},
    texts: {},
    parametrics: {},
    measurements: {},

    technicalInfo: { ref: {}, values: {} },
    residuals: {},
    attachments: {},
  };

  const records = content.split('~');

  for (let i = 0; i < records.length; i++) {
    const record = records[i];

    if (!record || record.trim() === '') continue;

    const lineItems = record.split('|');
    const recordType = lineItems[0].trim().toUpperCase();

    switch (recordType) {
      case 'V':
      case 'K':
        parseHeader(lineItems, data.info);
        break;
      case 'C':
        parseConcepts(lineItems, data.concepts);
        break;
      case 'D':
      case 'Y':
        parseDescomposition(lineItems, data.decompositions, data.info);
        break;
      case 'T':
        parseTexts(lineItems, data.texts);
        break;
      case 'P':
        parseParametrics(lineItems, data.parametrics);
        break;
      case 'M':
      case 'N':
        parseMeasurements(lineItems, data.measurements);
        break;

      case 'X':
        parseTechnicalInfo(lineItems, data.technicalInfo);
        break;
      case 'R':
        parseResiduals(lineItems, data.residuals);
        break;
      case 'F':
      case 'G':
        parseAttachments(lineItems, data.attachments);
        break;

      default:
        break;
    }
  }

  for (const code in data.concepts) {
    const concept = data.concepts[code];

    concept.hasDecomposition = !!data.decompositions[code];
    concept.hasMeasurements = !!data.measurements[code];
    concept.hasTechnicalInfo = !!data.technicalInfo?.values?.[code];
    concept.hasResiduals = !!data.residuals?.[code];
    concept.hasAttachments = !!data.attachments?.[code];
  }

  return data
}


