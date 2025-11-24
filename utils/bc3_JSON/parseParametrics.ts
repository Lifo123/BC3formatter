import { Bc3RawData } from "../../types/BC3.types";
import { cleanString } from "../Helpers";

// ~[P]
export function parseParametrics(
  lineItems: string[],
  parametrics: Bc3RawData['parametrics']
) {
  let conceptId = cleanString(lineItems[1]);
  if (conceptId === '') {
    conceptId = '@@GLOBAL';
  }

  const scriptContent = lineItems[2]?.trim();
  if (scriptContent && parametrics) {
    parametrics[conceptId] = scriptContent;
  }
}
