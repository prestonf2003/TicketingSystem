import { Component, OnInit } from '@angular/core';
import { Ticket } from '../ticket';
import { TicketService } from '../ticket.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-display',
  templateUrl: './todo-display.component.html',
  styleUrls: ['./todo-display.component.css']
})
export class TodoDisplayComponent implements OnInit {
  tickets: Ticket[] = [];
  searchedTickets: Ticket[] = [];
  searchTerm: string = "";
  userID: string = "";
  currentUser: string = "";
  grabbedTicket: Ticket = new Ticket (0,"","","",false,false,"");
  
  
  constructor( private ticketService: TicketService, private router: Router ) {
    ticketService.showAllTickets().subscribe((response) => {
      this.tickets = response; // Populates both our arrays initially.
      this.searchedTickets = response; // We filter tickets to get this and use this as the array to display.
    });
  }

  searchTicketsByTitle(searchTerm: string): void {
    this.ticketService.searchTicketsByTitle(searchTerm).subscribe((response) => {
      this.searchedTickets = response;
    });
  }

  login(): void {
    this.currentUser = this.userID;
    this.userID = "";
  }
  
  ngOnInit(): void {
  }

  getTicket(t: Ticket){
    this.grabbedTicket = t;
    //Object.assign(this.ticketService.grabbedTicket, t);
    console.log(this.grabbedTicket);
    this.router.navigateByUrl(`/ticket-view/${t.id}`);
    
  }
}

