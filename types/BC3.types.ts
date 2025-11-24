import { BC3_Currency } from "./General.types";

export type BC3_ConceptData = {
  code: string;
  unit?: string;
  summary?: string;
  price?: number;
  date?: string;
  type?: number;
  typeSigla?: string;

  //Information
  aliases?: string[];
  prices?: number[];
  dates?: string[];

  //Booleans
  isChapter?: boolean;
  hasDecomposition?: boolean;
  hasMeasurements?: boolean;
  hasTechnicalInfo?: boolean;
  hasResiduals?: boolean;
  hasAttachments?: boolean;
}

export type BC3_DecompositionChild = {
  code: string;
  factor: number;
  yield: number;
  percentCode?: string;
}

export type BC3_MeasurementLine = {
  type?: string;
  comment?: string;
  units?: number;
  length?: number;
  width?: number;
  height?: number;
  bimId?: string;
}

export type BC3_Measurement = {
  parentCode?: string;
  childCode: string;
  position?: number[];
  total: number;
  lines: BC3_MeasurementLine[];
  tag?: string;
}

export type BC3_TechInfo = {
  ref?: Record<string, {
    summary?: string;
    unit?: string;
  }>;
  values?: Record<string, Record<string, number | string>>
}

export type BC3_Residual = {
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

// ~[V, K]
export interface BC3_Info {
  owner?: string;
  formatVersion?: string;
  fromSoftware?: string;
  encoding?: string;

  typeInfo?: string;
  numberCertified?: string;
  dateCertified?: string;
  baseURL?: string;

  headers?: string[];
  labels?: string[];
  comments?: string[];

  params?: {
    decimals: Record<string, {
      dn: number;
      dd: number;
      ds: number;
      dr: number;
      di: number;
      dp: number;
      dc: number;
      dm: number;
      currency: BC3_Currency;
    }>;
    percentages: {
      indirectCost?: number;
      generalCost?: number;
      profit?: number;
      baja?: number;
      tax?: number;
    };
    currencies?: Record<string, {
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
    }>;
    n: number;
  };
}

export type Bc3RawData = {
  info: BC3_Info;

  concepts: Record<string, BC3_ConceptData>;
  decompositions: Record<string, BC3_DecompositionChild[]>;

  texts: Record<string, string>;
  parametrics: Record<string, string>;
  measurements: Record<string, BC3_Measurement>;

  technicalInfo?: BC3_TechInfo;
  residuals?: Record<string, BC3_Residual[]>;
  attachments?: Record<string, BC3_Attachment[]>;
}
