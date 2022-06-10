import { Component, OnInit } from '@angular/core';
import { Ticket } from '../ticket';
import { TicketService } from '../ticket.service';
import { Router } from '@angular/router';
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
  
  constructor( public ticketService: TicketService, private router: Router ) { }

  createTicket(): void {
    let newTicket: Ticket = new Ticket(undefined!, this.currentUser, this.title, "", "", true, this.problemDescription, undefined!, undefined!);

    this.ticketService.createTicket(newTicket).subscribe( () => this.router.navigateByUrl(``));
    this.title = "";
    this.problemDescription = "";
  }

  ngOnInit(): void { // We call this to update page when user clicks login/out.
    this.currentUser= this.ticketService.currentUser;
    this.userID = "";
  }
}