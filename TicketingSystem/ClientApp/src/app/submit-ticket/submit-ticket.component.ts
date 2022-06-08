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
  currentUser: string = "";
  title: string = "";
  problemDescription: string = "";
  
  constructor( private ticketService: TicketService ) { }

  createTicket(): void {
    let newTicket: Ticket = new Ticket(undefined!, this.currentUser, this.title, "", false, true, this.problemDescription);

    this.ticketService.createTicket(newTicket).subscribe();
  }

  login(): void {
    this.userID = this.userID.toLowerCase();
    this.currentUser = this.userID[0].toUpperCase() + this.userID.slice(1);
    this.userID = "";
  }

  logout(): void {
    this.currentUser = "";
  }

  ngOnInit(): void {
  }
}
