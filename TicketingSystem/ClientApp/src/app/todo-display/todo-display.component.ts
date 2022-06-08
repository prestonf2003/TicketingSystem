import { Component, OnInit } from '@angular/core';
import { Ticket } from '../ticket';
import { TicketService } from '../ticket.service';
import { Favorite } from '../favorite';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-display',
  templateUrl: './todo-display.component.html',
  styleUrls: ['./todo-display.component.css']
})
export class TodoDisplayComponent implements OnInit {
  tickets: Ticket[] = [];
  currentUser: string = this.ticketService.currentUser;
  searchedTickets: Ticket[] = [];
  favorites: Favorite[] = [];
  newFavorite: Favorite = new Favorite(-1, "user here", -1);
  searchTerm: string = "";
  userID: string = "";
  grabbedTicket: Ticket = new Ticket (0,"","","","",false,"");
  

  constructor( private ticketService: TicketService, private router: Router, ) {
    this.showAllTickets();
    this.showAllFavorites();
  }

  showAllTickets(): void {
    this.ticketService.showAllTickets().subscribe((response) => {
      this.tickets = response; // Populates both our arrays initially.
      this.searchedTickets = response; // We filter tickets to get this and use this as the array to display.
    });
  }

  showAllFavorites(): void {
    this.ticketService.showFavorites().subscribe((response) => {
      this.favorites = response;
    });
  }

  createFavorite(ticketID: number): void {
    this.newFavorite = new Favorite (undefined!, this.ticketService.currentUser, ticketID);
    console.log("added at " + this.favorites.indexOf(this.newFavorite));
    this.favorites.push(this.newFavorite);
    this.ticketService.createFavorite(this.newFavorite).subscribe();
  }
  deleteFavorite(ticketID: number): void {
    this.favorites.forEach(favorite => {
      if (favorite.id === ticketID && favorite.userId === this.ticketService.currentUser) {
        console.log("deleted at " + this.favorites.indexOf(favorite));
        this.favorites.splice(this.favorites.indexOf(favorite), 1);
        this.ticketService.deleteFavorite(favorite.pkId).subscribe();
      }
    });
  }

  isFavorited(ticketID: number): boolean {
    let foundFav: Favorite = new Favorite(-1, "user here", -1);
    

    this.favorites.forEach(favorite => {
      if (favorite.id === ticketID && favorite.userId === this.currentUser) {
        foundFav = favorite;
      }
    });

    if (foundFav.pkId !== -1) {
      return true;
    }
    return false;
  }

  searchTicketsByTitle(searchTerm: string): void {
    let searchByFaves: any = document.getElementById("favSearchCheckBox") ?? false; // This starts hidden, so we default to false to avoid errors before user login.
    let searchByStatus: any = document.getElementById("openStatusSearchCheckBox");
    
    this.ticketService.searchTicketsByTitle(searchTerm).subscribe((response) => {
      this.searchedTickets = response;
      
      if (searchByFaves.checked) { //searchByFaves.checked is a bool
        this.searchForFavorites();
      }
  
      if (searchByStatus.checked) {
        this.searchByOpenStatus();
      }
    });
  }

  searchByOpenStatus(): void {
    let newSearched: Ticket[] = [];

    this.searchedTickets.forEach((ticket) => {
      if (ticket.isOpen === true) { // Used to tell display what tickets should be shown.
        newSearched.push(ticket);
      }
    });

    this.searchedTickets = newSearched;
  }

  searchForFavorites(): void {
    let newSearched: Ticket[] = [];

    this.searchedTickets.forEach((ticket) => {
      if (this.isFavorited(ticket.id)) { // Used to tell display what tickets should be shown.
        newSearched.push(ticket);
      }
    });

    this.searchedTickets = newSearched;
  }

  login(): void {
    this.userID = this.userID.toLowerCase();
    this.ticketService.currentUser = this.userID[0].toUpperCase() + this.userID.slice(1);
    this.currentUser = this.ticketService.currentUser;
    this.userID = "";
  }

  logout(): void {
    this.ticketService.currentUser = "";
    this.currentUser = this.ticketService.currentUser;
  }

  swapTicketOpenStatus(id: number, ticket: Ticket, openStatus: boolean): void {
    ticket.isOpen = openStatus;
    
    if (openStatus === false) {
      ticket.resolvedUserId = this.currentUser;
    }
    else {
      ticket.resolvedUserId = "";
    }
    
    this.ticketService.updateTicket(id, ticket).subscribe();
  }

  deleteTicket(id: number) {
    this.searchTicketsByTitle(this.searchTerm);

    this.ticketService.deleteTicket(id).subscribe();
    
    this.searchTicketsByTitle(this.searchTerm);
  }
  
  ngOnInit(): void {
  }

  getTicket(t: Ticket){
    this.grabbedTicket = t;
    //Object.assign(this.ticketService.grabbedTicket, t);
    console.log(this.grabbedTicket);
    this.router.navigateByUrl(`/ticket-view/${t.id}`);
  }
  resolveTicket(id: number, ticket: Ticket, resolution: string): void {
    

    if(ticket.isOpen === true){
      this.ticketService.addResolution(id, ticket, resolution).subscribe();
    }
    else{
      ticket.resolution = "This Ticket has not been resolved yet.";
    }
  }
}