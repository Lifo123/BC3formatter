import { Bc3RawData, BC3_Residual } from "../../types/BC3.types";
import { cleanString } from "../Helpers";

export function parseResiduals(lineItems: string[], residuals: Bc3RawData['residuals']) {
  const parentCode = cleanString(lineItems[1]);

  if (!residuals || !parentCode) return;

  if (!residuals[parentCode]) {
    residuals[parentCode] = [];
  }

  for (let j = 2; j < lineItems.length; j++) {
    const field = lineItems[j];
    if (!field || field.trim() === '') continue;

    const subParts = field.split('\\');

    if (subParts.length >= 2) {
      const type = parseInt(subParts[0]);
      const childCode = subParts[1]?.trim();

      if (!childCode) continue;

      const props: BC3_Residual['props'] = {};

      for (let k = 2; k < subParts.length; k += 3) {
        const propName = subParts[k]?.trim();
        if (!propName) continue;

        const valRaw = subParts[k + 1]?.trim();
        const unit = subParts[k + 2]?.trim();

        const valNum = parseFloat(valRaw);

        props[propName] = {
          value: isNaN(valNum) ? valRaw : valNum,
          unit: unit || undefined
        };
      }

      residuals[parentCode].push({
        type: isNaN(type) ? 0 : type,
        code: childCode,
        props: props
      });
    }
  }
}
