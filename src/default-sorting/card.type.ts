export interface ICard {
  _id: string;
  name: string;
  type: string;
  alternateArt?: boolean;
  monsterType: string[];
  race: string;
  atk?: number;
  def?: number;
  description: string;
  handtrap?: boolean;
  floodgate?: boolean;
  linkArrows: any[];
  obtain: IObtain[];
  popRank: number;
  deckTypes: string[];
  __v: number;
  isUpdated?: boolean;
  konamiID: any;
  gameId: any;
  rarity: string;
  release: string;
  mostUsedDeckTypes: string[];
  imageHash?: string;
  level?: number;
  linkRating?: number;
  attribute?: string;
  ocgRelease?: string;
  ocgBanStatus?: string;
  banStatus?: string;
  tcgBanStatus?: string;
  tcgRelease?: string;
}

export interface IObtain {
  source: ISource;
  amount: number;
  type: string;
}

export interface ISource {
  _id: string;
  type: string;
  name: string;
}
