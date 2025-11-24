import { BC3_Info } from "../../types/BC3.types";
import { BC3_Currency } from "../../types/General.types";
import { parseList } from "../Helpers";

export function parseHeader(lineItems: string[], info: BC3_Info) {
  const recordType = lineItems[0].toUpperCase();

  switch (recordType) {
    case 'V':
      info.owner = lineItems[1];
      info.formatVersion = lineItems[2];
      info.fromSoftware = lineItems[3];

      const rawLabels = parseList(lineItems[4]);
      if (rawLabels.length > 0) {
        info.headers = [rawLabels[0]];
        info.labels = rawLabels.slice(1);
      }

      info.encoding = lineItems[5];
      info.comments = parseList(lineItems[6]);
      info.typeInfo = lineItems[7];
      info.numberCertified = lineItems[8];
      info.dateCertified = lineItems[9];
      info.baseURL = lineItems[10];
      break;
    case 'K':
      const rawDecimals = parseList(lineItems[1]);
      const decimalsRecord: NonNullable<BC3_Info['params']>['decimals'] = {};

      const DEC_BLOCK_SIZE = 9;
      for (let i = 0; i < rawDecimals.length; i += DEC_BLOCK_SIZE) {
        if (i + 8 < rawDecimals.length) {
          const currencyKey = rawDecimals[i + 8].trim() || 'DEFAULT';

          decimalsRecord[currencyKey] = {
            dn: parseInt(rawDecimals[i + 0]) || 0,
            dd: parseInt(rawDecimals[i + 1]) || 0,
            ds: parseInt(rawDecimals[i + 2]) || 0,
            dr: parseInt(rawDecimals[i + 3]) || 0,
            di: parseInt(rawDecimals[i + 4]) || 0,
            dp: parseInt(rawDecimals[i + 5]) || 0,
            dc: parseInt(rawDecimals[i + 6]) || 0,
            dm: parseInt(rawDecimals[i + 7]) || 0,
            currency: currencyKey as BC3_Currency
          };
        }
      }

      const percentagesParts = lineItems[2]?.split('\\') || [];
      const rawCurrencies = parseList(lineItems[3]);
      const currenciesRecord: NonNullable<BC3_Info['params']>['currencies'] = {};

      const CUR_BLOCK_SIZE = 13;
      for (let i = 0; i < rawCurrencies.length; i += CUR_BLOCK_SIZE) {
        if (i + 12 < rawCurrencies.length) {
          const currencyCode = rawCurrencies[i + 12].trim();
          if (currencyCode) {
            currenciesRecord[currencyCode] = {
              drc: parseInt(rawCurrencies[i + 0]) || 0,
              dc: parseInt(rawCurrencies[i + 1]) || 0,
              dfs: parseInt(rawCurrencies[i + 2]) || 0,
              drs: parseInt(rawCurrencies[i + 3]) || 0,
              duo: parseInt(rawCurrencies[i + 4]) || 0,
              di: parseInt(rawCurrencies[i + 5]) || 0,
              des: parseInt(rawCurrencies[i + 6]) || 0,
              dn: parseInt(rawCurrencies[i + 7]) || 0,
              dd: parseInt(rawCurrencies[i + 8]) || 0,
              ds: parseInt(rawCurrencies[i + 9]) || 0,
              dsp: parseInt(rawCurrencies[i + 10]) || 0,
              dec: parseInt(rawCurrencies[i + 11]) || 0,
              currency: currencyCode as BC3_Currency
            };
          }
        }
      }

      info.params = {
        decimals: decimalsRecord,
        percentages: {
          indirectCost: parseFloat(percentagesParts[0]) || 0,
          generalCost: parseFloat(percentagesParts[1]) || 0,
          profit: parseFloat(percentagesParts[2]) || 0,
          baja: parseFloat(percentagesParts[3]) || 0,
          tax: parseFloat(percentagesParts[4]) || 0,
        },
        currencies: currenciesRecord,
        n: lineItems[4] ? parseInt(lineItems[4]) : 0,
      };
      break;
  }
}


