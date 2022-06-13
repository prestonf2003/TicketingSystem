import { Component, OnInit } from '@angular/core';
import { TodoDisplayComponent } from '../todo-display/todo-display.component';
import { Ticket } from '../ticket';
import { TicketService } from '../ticket.service';
import { Router } from '@angular/router';

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

  constructor(public ticketService: TicketService, private router: Router) { }

  ngOnInit(): void { // We call this to update page when user clicks login.
    this.currentUser= this.ticketService.currentUser;
    this.userID = "";
  }

  updateResolution(id: number, ticket: Ticket){
    ticket.resolution = this.resolution;
    ticket.resolvedUserId = this.ticketService.currentUser;
    ticket.isOpen = false;
    ticket.closeDate = new Date();
    
    this.ticketService.updateTicket(id, ticket).subscribe();

    this.resolution = "";
  }

  deleteTicket(id: number) {
    this.ticketService.deleteTicket(id).subscribe(() => this.router.navigateByUrl(``));
  }
}