export class Ticket{
    id: number;
    openedUserId: string;
    title: string;
    resolvedUserId: string;
    isFavorited: boolean;
    isOpen: boolean;
    problemDescription: string;

    constructor(id: number, openedUserID: string, title: string, 
        resolvedUserId: string, isFavorited: boolean, isOpen: boolean, problemDescription: string){
            this.id = id;
            this.openedUserId = openedUserID;
            this.title = title;
            this.resolvedUserId = resolvedUserId;
            this.isFavorited = isFavorited;
            this.isOpen = isOpen;
            this.problemDescription = problemDescription;
        }
}