import { BC3_Info } from "../parse/bc3_JSON.types";

export function getHeaderInfo(lines: string[]): BC3_Info {
  let info: BC3_Info = {};

  lines.forEach(line => {
    const lineItems = line.split('|');
    if (lineItems[0] === 'V') {
      info.owner = lineItems[1];
      info.formatVersion = lineItems[2];
      info.fromSoftware = lineItems[3];
      info.headerId = lineItems[4]; //IDK what its their use for
      info.encoding = lineItems[5];

      info.comment = lineItems[6];
      info.typeInfo = lineItems[7];
      info.numberCertified = lineItems[8];
      info.dateCertified = lineItems[9];
      info.baseURL = lineItems[10];
    }

    if (lineItems[0] === 'K') {
      const decimals = lineItems[1].split(`\\`)
      const percentages = lineItems[2].split(`\\`)

      const rawCurrencies = lineItems[3].split('\\').filter(x => x.trim() !== '');
      const currenciesList = [];
      const BLOCK_SIZE = 13;

      for (let i = 0; i < rawCurrencies.length; i += BLOCK_SIZE) {
        if (i + 12 < rawCurrencies.length) {
          currenciesList.push({
            drc: parseInt(rawCurrencies[i]),
            dc: parseInt(rawCurrencies[i + 1]),
            dfs: parseInt(rawCurrencies[i + 2]),
            drs: parseInt(rawCurrencies[i + 3]),
            duo: parseInt(rawCurrencies[i + 4]),
            di: parseInt(rawCurrencies[i + 5]),
            des: parseInt(rawCurrencies[i + 6]),
            dn: parseInt(rawCurrencies[i + 7]),
            dd: parseInt(rawCurrencies[i + 8]),
            ds: parseInt(rawCurrencies[i + 9]),
            dsp: parseInt(rawCurrencies[i + 10]),
            dec: parseInt(rawCurrencies[i + 11]),
            currencyCode: rawCurrencies[i + 12]
          });
        }
      }

      info.params = {
        decimals: {
          dn: parseInt(decimals[0]),
          dd: parseInt(decimals[1]),
          ds: parseInt(decimals[2]),
          dr: parseInt(decimals[3]),
          di: parseInt(decimals[4]),
          dp: parseInt(decimals[5]),
          dc: parseInt(decimals[6]),
          dm: parseInt(decimals[7]),
          currency: decimals[8],
        },
        percentages: {
          indirectCost: parseFloat(percentages[0]),
          generalCost: parseFloat(percentages[1]),
          profit: parseFloat(percentages[2]),
          baja: parseFloat(percentages[3]),
          tax: parseFloat(percentages[4]),
        },
        currencies: currenciesList,
        n: lineItems[4] ? parseInt(lineItems[4]) : 0,
      }

    }
  })

  return info;
}
