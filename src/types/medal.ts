export interface Medal {
  code: string;
  gold: number;
  silver: number;
  bronze: number;
}

export interface MedalWithRanking extends Medal {
  total: number;
  rank: number;
}

export interface MedalTotals {
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

export type MedalType = "gold" | "silver" | "bronze" | "total";

export type MedalsApiResponse = {
  medals: Medal[];
};
