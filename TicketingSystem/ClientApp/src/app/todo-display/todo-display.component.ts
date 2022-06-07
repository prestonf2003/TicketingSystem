import { Component, OnInit } from '@angular/core';
import { Ticket } from '../ticket';
import { TicketService } from '../ticket.service';
import { FormsModule } from '@angular/forms';
import { Favorite } from '../favorite';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-display',
  templateUrl: './todo-display.component.html',
  styleUrls: ['./todo-display.component.css']
})
export class TodoDisplayComponent implements OnInit {
  tickets: Ticket[] = [];
  searchedTickets: Ticket[] = [];
  favorites: Favorite[] = [];
  newFavorite: Favorite = new Favorite(-1, "user here", -1);
  searchTerm: string = "";
  userID: string = "";
  currentUser: string = "";
  grabbedTicket: Ticket = new Ticket (0,"","","",false,false,"");
  

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
    this.newFavorite = new Favorite (undefined!, this.currentUser, ticketID);
    
    this.showAllFavorites(); // We need to do this method call before and after subscribing for some reason.

    this.ticketService.createFavorite(this.newFavorite).subscribe();

    this.showAllFavorites();
  }

  deleteFavorite(ticketID: number): void {
    this.showAllFavorites();

    this.favorites.forEach(favorite => {
      if (favorite.id === ticketID && favorite.userId === this.currentUser) {
        this.ticketService.deleteFavorite(favorite.pkId).subscribe();
      }
    });
    
    this.showAllFavorites();
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
    let searchByFaves: any = document.getElementById("favSearchCheckBox");
    let searchByStatus: any = document.getElementById("openStatusSearchCheckBox");
    
    this.ticketService.searchTicketsByTitle(searchTerm).subscribe((response) => {
      this.searchedTickets = response;
      
      if (searchByFaves.checked === true) {
        this.searchFavoritesByTitle();
      }
  
      if (searchByStatus.checked === true) {
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

  searchFavoritesByTitle(): void {
    let newSearched: Ticket[] = [];

    this.searchedTickets.forEach((ticket) => {
      if (this.isFavorited(ticket.id)) { // Used to tell display what tickets should be shown.
        newSearched.push(ticket);
      }
    });

    this.searchedTickets = newSearched;
  }

  login(): void {
    this.currentUser = this.userID.toLowerCase();
    this.userID = "";
  }

  logout(): void {
    this.currentUser = "";
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

