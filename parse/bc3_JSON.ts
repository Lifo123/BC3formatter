import fs from 'node:fs';
import path from 'node:path';
import { BC3_Concept, BC3_Info, Bc3RawData } from './bc3_JSON.types';
import { getConcepts, getHeaderInfo } from '../utils';

const filePath = path.resolve('./TEST/Edificio_directBIM5D.bc3');
const buffer = fs.readFileSync(filePath);

function parseBC3(buffer?: Uint8Array) {
  const decoder = new TextDecoder('windows-1252');
  const content = decoder.decode(buffer);

  const lines = content.split('~').slice(1);
  const data: Bc3RawData = {
    info: {},
    concepts: {},
    decompositions: {},
    texts: {},
    measurements: {},

    technicalInfo: {},
    residuals: {},
    attachments: {},
  };

  data.info = getHeaderInfo(lines.slice(0, 2));

  const conceptRes = getConcepts(lines.slice(2, lines.length - 1));

  data.concepts = conceptRes.concepts;
  data.decompositions = conceptRes.decompositions;
  data.texts = conceptRes.texts;
  data.measurements = conceptRes.measurements;

  data.technicalInfo = conceptRes.technicalInfo;
  data.residuals = conceptRes.residuals;
  data.attachments = conceptRes.attachments;

  return data
}

function timeExe(fn: () => void) {
  const start = performance.now();
  fn();
  const end = performance.now();

  // Usamos toFixed(3) para ver microsegundos
  console.log(`Execution time: ${(end - start).toFixed(3)} ms`);

}

timeExe(() => parseBC3(buffer));
