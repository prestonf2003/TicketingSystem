export class UserPerm{
   username: string;
   accessLevel: string;
   
   constructor(username: string, accessLevel: string){
       this.username = username;
       this.accessLevel = accessLevel;
   }
}