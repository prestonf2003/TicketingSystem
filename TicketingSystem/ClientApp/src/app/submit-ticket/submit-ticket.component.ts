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
  title: string = "";
  problemDescription: string = "";
  
  constructor( public ticketService: TicketService ) { }

  createTicket(): void {
    let newTicket: Ticket = new Ticket(undefined!, this.ticketService.currentUser, this.title, "", false, true, this.problemDescription);

    this.ticketService.createTicket(newTicket).subscribe();
    this.title = "";
    this.problemDescription = "";
  }

  login(): void {
    this.userID = this.userID.toLowerCase();
    this.ticketService.currentUser = this.userID[0].toUpperCase() + this.userID.slice(1);
    this.userID = "";
  }

  logout(): void {
    this.ticketService.currentUser = "";
  }

  ngOnInit(): void {
  }
}