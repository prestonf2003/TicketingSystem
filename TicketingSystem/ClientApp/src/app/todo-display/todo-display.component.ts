import { Component, OnInit } from '@angular/core';
import { Ticket } from '../ticket';
import { TicketService } from '../ticket.service';
import { FormsModule } from '@angular/forms';

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
  
  constructor( private ticketService: TicketService ) {
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

}
