import { Bc3RawData, BC3_DecompositionChild } from "../../types/BC3.types";
import { cleanString } from "../Helpers";


export function parseDescomposition(lineItems: string[], decompositions: Bc3RawData['decompositions']) {
  const parentCode = cleanString(lineItems[1]);
  if (!parentCode) return;

  const content = lineItems[2];

  if (content) {
    const childParts = content.split('\\');
    const currentChilds: BC3_DecompositionChild[] = [];

    for (let j = 0; j < childParts.length; j += 3) {
      if (j + 2 >= childParts.length) break;

      const childCode = childParts[j]?.trim();

      if (!childCode) continue;

      currentChilds.push({
        code: childCode,
        factor: parseFloat(childParts[j + 1]) || 1.0,
        yield: parseFloat(childParts[j + 2]) || 1.0,
      });
    }

    if (currentChilds.length > 0) {
      if (!decompositions[parentCode]) {
        decompositions[parentCode] = [];
      }
      decompositions[parentCode]!.push(...currentChilds);
    }
  }
}
