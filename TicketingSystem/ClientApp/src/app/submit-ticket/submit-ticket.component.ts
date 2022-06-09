import { Component, OnInit } from '@angular/core';
import { Ticket } from '../ticket';
import { TicketService } from '../ticket.service';

@Component({
  selector: 'app-submit-ticket',
  templateUrl: './submit-ticket.component.html',
  styleUrls: ['./submit-ticket.component.css']
})
export class SubmitTicketComponent implements OnInit {
  userID: string = "";
  currentUser: string = this.ticketService.currentUser;
  title: string = "";
  problemDescription: string = "";
  
  constructor( public ticketService: TicketService ) { }

  createTicket(): void {
    let newTicket: Ticket = new Ticket(undefined!, this.currentUser, this.title, "", "", true, this.problemDescription);

    this.ticketService.createTicket(newTicket).subscribe();
    this.title = "";
    this.problemDescription = "";
  }

  ngOnInit(): void { // We call this to update page when user clicks login/out.
    this.currentUser= this.ticketService.currentUser;
    this.userID = "";
  }
}