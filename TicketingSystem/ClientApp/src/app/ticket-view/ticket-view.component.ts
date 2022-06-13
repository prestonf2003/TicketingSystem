import { Component, OnInit } from '@angular/core';
import { TodoDisplayComponent } from '../todo-display/todo-display.component';
import { Ticket } from '../ticket';
import { TicketService } from '../ticket.service';
import { Router } from '@angular/router';
import { UserPermService } from '../user-perm.service';
import { UserPerm } from '../userperm';
@Component({
  selector: 'app-ticket-view',
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.css'],
  providers:[TodoDisplayComponent]
  
})
export class TicketViewComponent implements OnInit {
  userID: string = "";
  focusTicket = this.ticketService.ticket;
  currentUser: string = this.ticketService.currentUser;
  resolution: string = this.focusTicket.resolution;
  title: string = "";
  problemDescription = "";
  Users: UserPerm[] = [];

  constructor(public ticketService: TicketService, private router: Router, public userService: UserPermService) { 
    this.showAllUsers();
  }

  ngOnInit(): void { // We call this to update page when user clicks login.
    this.currentUser= this.ticketService.currentUser;
    this.userID = "";
  }

  updateResolution(id: number, ticket: Ticket){
    ticket.resolution = this.resolution;
    ticket.resolvedUserId = this.ticketService.currentUser;
    ticket.isOpen = false;
    ticket.closeDate = new Date((new Date().getTime() - 4 * 60 * 60 * 1000));
    // We subtract 4 hours to Date(), which prints the current time, but somehow jumps everything forward 4 hours when it gets to the db.
    
    this.ticketService.updateTicket(id, ticket).subscribe();

    this.resolution = "";
  }

  deleteTicket(id: number) {
    this.ticketService.deleteTicket(id).subscribe(() => this.router.navigateByUrl(``));
  }

  updateTicket(id: number, ticket: Ticket){
  ticket.title = this.title;
  ticket.problemDescription = this.problemDescription;
  this.ticketService.updateTicket(id, ticket).subscribe();
  }
  showAllUsers(): void {
    this.userService.showAllUsers().subscribe(
      (result) => {this.Users = result}
    )
  }

  validatePerm(): string {
    for (let i = 0; i < this.Users.length; i++) {
      if(this.Users[i].username === this.currentUser){
        this.userService.UserNow.username = this.currentUser;
        this.userService.UserNow.accessLevel = this.Users[i].accessLevel;
        console.log(this.userService.UserNow.username);
        console.log(this.userService.UserNow.accessLevel);
      }
    }
    return this.userService.UserNow.accessLevel;

    }

}