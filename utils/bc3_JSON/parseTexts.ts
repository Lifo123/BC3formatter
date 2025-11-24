import { Bc3RawData } from "../../types/BC3.types";
import { cleanString } from "../Helpers";

// ~[T]
export function parseTexts(lineItems: string[], texts: Bc3RawData['texts']) {
  const conceptId = cleanString(lineItems[1]);
  if (!conceptId || !texts) return;

  texts[conceptId] = lineItems[2]?.trim();
}
