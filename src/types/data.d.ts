export interface Data {
  Framework: string;
  Stars: string;
  Released: string;
}

interface Country {
  name: string;
  continent: string;
  income: number;
  population: number;
  life_exp: number;
}

export interface GapminderData {
  countries: Country[];
  year: number;
}
