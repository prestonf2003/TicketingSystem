export class Ticket{
    id: number;
    openedUserId: string;
    title: string;
    resolvedUserId: string;
    resolution: string;
    isOpen: boolean;
    problemDescription: string;
    openDate: Date;
    closeDate: Date;

    constructor(id: number, openedUserID: string, title: string, 
      resolvedUserId: string, resolution: string, isOpen: boolean,
      problemDescription: string, openDate: Date, closeDate: Date) {
            this.id = id;
            this.openedUserId = openedUserID;
            this.title = title;
            this.resolvedUserId = resolvedUserId;
            this.resolution = resolution;
            this.isOpen = isOpen;
            this.problemDescription = problemDescription;
            this.openDate = openDate;
            this.closeDate = closeDate;
        }
}
