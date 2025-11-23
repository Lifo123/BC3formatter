type BC3_Currency = 'EUR' | 'USD' | 'PEN' | 'JPY' | 'GBP' | 'CAD' | 'AUD' | 'CLP' | 'MXN' | 'BRL' | 'RUB' | 'CNY' | string;

type BC3_Row_Concept = {
  code: string;
  unit?: string;
  summary?: string;
  price?: number;
  date?: string;
  type?: number;
  typeSigla?: string;
}

export type BC3_Decomp = {
  parentCode?: string;
  childs?: {
    code: string;
    factor?: number;
    yield?: number;
  }[]
}

export type BC3_Measurement = {
  parentCode?: string;
  childCode: string;
  position?: number[];

  total: number;

  lines: {
    type?: string;
    comment?: string;
    units?: number;
    length?: number;
    height?: number;
    width?: number;
    bimId?: string;
  }[];
  tag?: string;
}

export type BC3_TechInfo = {
  ref?: Record<string, {
    summary?: string;
    unit?: string;
  }>;
  values?: Record<string, Record<string, number | string>>
}

export type BC3_Residuals = {
  type?: number;
  code?: string;
  props?: Record<string, {
    value: number | string;
    unit?: string;
  }>;
}

export type BC3_Attachment = {
  type?: number;
  fileName?: string;
  description?: string;
  url?: string;
}

// ~[C, D, Y, T, P, L, Q, J, X...]
export interface BC3_Concept {
  concepts: Record<string, BC3_Row_Concept>; // ~C
  decompositions: Record<string, BC3_Decomp['childs']>; // ~D, ~Y
  texts?: Record<string, string>; // ~T, ~P
  measurements?: Record<string, BC3_Measurement>; // ~M, ~N

  // (Modern FIEBDC)
  technicalInfo?: BC3_TechInfo; // ~X
  residuals?: Record<string, BC3_Residuals[]>; // ~R
  attachments?: Record<string, BC3_Attachment[]>; // ~F, ~G
}

// ~[V, K]
export interface BC3_Info {
  owner?: string;
  formatVersion?: string;
  fromSoftware?: string;
  headerId?: string;
  encoding?: string;

  comment?: string;
  typeInfo?: string;
  numberCertified?: string;
  dateCertified?: string;
  baseURL?: string;

  params?: {
    decimals: {
      dn: number;
      dd: number;
      ds: number;
      dr: number;
      di: number;
      dp: number;
      dc: number;
      dm: number;
      currency: BC3_Currency;
    };
    percentages: {
      indirectCost?: number;
      generalCost?: number;
      profit?: number;
      baja?: number;
      tax?: number;
    };
    currencies?: {
      drc?: number;
      dc?: number;
      dfs?: number;
      drs?: number;
      duo?: number;
      di?: number;
      des?: number;
      dn?: number;
      dd?: number;
      ds?: number;
      dsp?: number;
      dec?: number;
      currency?: BC3_Currency
    }[];
    n: number;
  };
}

export type Bc3RawData = {
  info: BC3_Info;
} & BC3_Concept;
