// lib/builders.ts
export type Builder = {
  username: string;
  role: string;
  image: string;
  weight: number;
  points: number;
  followers?: number; 
};

export const builders: Builder[] = [
  {
    username: "angelinevivian_",
    role: "Indonesia country lead",
    image: "angelina.jpg",
    weight: 1,
    points: 5,
  },
  {
    username: "0x_fokki",
    role: "Base me developer",
    image: "fooki.jpg",
    weight: 2,
    points: 4,
  },
  {
    username: "jessepollak",
    role: "Base builder",
    image: "jesse.jpg",
    weight: 5,
    points: 13,
  },
  {
    username: "KeonHD_X",
    role: "Grow me developer",
    image: "keon.avif",
    weight: 2,
    points: 4,
  },
  {
    username: "_charlienoyes",
    role: "Dev relations lead",
    image: "charli.jpg",
    weight: 1,
    points: 6,
  },
  {
    username: "dwr",
    role: "Farcaster co-founder",
    image: "dwr.jpg",
    weight: 1,
    points: 7,
  },
];