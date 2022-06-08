import { Component, OnInit } from '@angular/core';
import { TodoDisplayComponent } from '../todo-display/todo-display.component';
import { Ticket } from '../ticket';
import { provideRoutes } from '@angular/router';
import { TicketService } from '../ticket.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ticket-view',
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.css'],
  providers: [TicketService]
})
export class TicketViewComponent implements OnInit {
ticketID: number = 0;
focusTicket = new Ticket (0,"","","","",true,"");
  constructor(private ticketService: TicketService) {
    
    this.ticketService.searchTicketById(this.getId()).subscribe((response) => {
      this.focusTicket = response;
    });
   }

  ngOnInit(): void {
  }

searchTicketsByID(): void {
    this.ticketService.searchTicketById(this.getId()).subscribe((response) => {
      this.focusTicket = response;
    });
  }


  getId(): number {
    var pathArray = window.location.pathname.split('/');
    this.ticketID = parseInt(pathArray[2]);
    return this.ticketID;
  }
}
