export type VinylRecordResponse = {
  id: string;
  name: string;
  authorName: string;
  description: string;
  price: number;
  image: string;
  avgscore: number;
  review:
    | {
        id: string;
        comment: string;
        score: number;
        createdAt: Date;
      }
    | {};
};
