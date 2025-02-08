export interface User {
  id: string;
  email: string;
  name: string;
  role: 'producer';
  salaryCost: number;
}

export interface UserInput {
  email: string;
  name: string;
  salaryCost: number;
}