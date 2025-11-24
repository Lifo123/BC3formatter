import type { Bc3RawData } from "../../types/BC3.types";
import { cleanString, parseList, parseNumberList } from "../Helpers/index";


export function parseConcepts(lineItems: string[], concepts: Bc3RawData['concepts']) {
  const rawCodes = parseList(lineItems[1]);
  if (rawCodes.length === 0) return;

  const mainCodeRaw = rawCodes[0];
  const codeKey = cleanString(mainCodeRaw);
  const aliases = rawCodes.slice(1);

  const isChapter = mainCodeRaw.endsWith('#');

  const prices = parseNumberList(lineItems[4]);
  const dates = parseList(lineItems[5]);
  const currentPrice = prices.length > 0 ? prices[prices.length - 1] : 0;
  const currentDate = dates.length > 0 ? dates[dates.length - 1] : undefined;

  concepts[codeKey] = {
    code: codeKey,
    aliases: aliases.length > 0 ? aliases : undefined,

    unit: lineItems[2]?.trim(),
    summary: lineItems[3]?.trim(),

    price: currentPrice,
    prices: prices.length > 1 ? prices : undefined,

    date: currentDate,
    dates: dates.length > 1 ? dates : undefined,

    type: parseInt(lineItems[6]) || 0,
    typeSigla: lineItems[7]?.trim(),

    isChapter,
  };
}
