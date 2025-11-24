import { Bc3RawData, BC3_ConceptData } from '../../types/BC3.types';

export type BC3_FlatNode = BC3_ConceptData & {
  level: number;
  hasChildren: boolean;
  parentId?: string;
};

export function getFlatTree(data: Bc3RawData): BC3_FlatNode[] {
  const result: BC3_FlatNode[] = [];
  const rootCode = data.info.rootCode;

  if (!rootCode || !data.concepts[rootCode]) {
    return [];
  }

  const traverse = (code: string, level: number, parentId?: string) => {
    const concept = data.concepts[code];
    if (!concept) return;

    const childrenDecomps = data.decompositions[code];
    const hasChildren = !!(childrenDecomps && childrenDecomps.length > 0);

    result.push({
      ...concept,
      level,
      hasChildren,
      parentId
    });

    if (hasChildren) {
      for (const childDecomp of childrenDecomps!) {
        const childConcept = data.concepts[childDecomp.code];

        if (childConcept) {
            traverse(childDecomp.code, level + 1, code);
        }
      }
    }
  };

  traverse(rootCode, 0);

  return result;
}
