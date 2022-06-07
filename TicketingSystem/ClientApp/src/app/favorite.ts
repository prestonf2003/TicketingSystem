export class Favorite{
    pkId: number;
    userId: string;
    id: number;

  constructor(pkId: number, userId: string, id: number) {
      this.pkId = pkId;
      this.userId = userId;
      this.id = id;
    }
}
