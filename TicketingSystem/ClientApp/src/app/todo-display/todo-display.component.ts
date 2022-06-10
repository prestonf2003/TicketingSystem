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
  currentUser: string = this.ticketService.currentUser;
  searchedTickets: Ticket[] = [];
  favorites: Favorite[] = [];
  newFavorite: Favorite = new Favorite(-1, "user here", -1);
  searchTerm: string = "";
  userID: string = "";
  timeBetweenOpenClose: number = -1;

  constructor( public ticketService: TicketService, private router: Router ) {
    this.showAllTickets();
    this.showAllFavorites();
  }

  showAllTickets(): void {
    this.ticketService.showAllTickets().subscribe((allTickets) => {
      this.searchedTickets = allTickets; // We filter tickets to get this and use this as the array to display.
    });
  }

  showAllFavorites(): void {
    this.ticketService.showFavorites().subscribe((allFavories) => {
      this.favorites = allFavories;
    });
  }

  createFavorite(ticketID: number): void {
    this.newFavorite = new Favorite (undefined!, this.ticketService.currentUser, ticketID);

    this.ticketService.createFavorite(this.newFavorite).subscribe(() => {
      this.showAllFavorites(); // To update the new favorite with the correct pkId.
      // This must be called inside subscribe() as .subscribe runs at the very end of the function, no matter what.
    });
  }

  deleteFavorite(ticketID: number): void {
    let foundFav: Favorite = this.favorites.find(favorite => 
      favorite.id === ticketID && favorite.userId === this.currentUser
    )!; // The "!" at the end is to tell typescript that this will not be undefined. Without it, we get a type error saying it could be undefined.

    this.ticketService.deleteFavorite(foundFav.pkId).subscribe(() => {
      this.favorites.splice(this.favorites.indexOf(foundFav), 1); // splice(index, 1) removes the element from the array at index.
    });
  }

  isFavorited(ticketID: number): boolean {
    for (let i = 0; i < this.favorites.length; i++) {
      if (this.favorites[i].id === ticketID && this.favorites[i].userId === this.currentUser) {
        return true;
      }
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

    newSearched = this.searchedTickets.filter(ticket => 
      ticket.isOpen // ticket.isOpen is a bool
    );

    this.searchedTickets = newSearched;
  }

  searchForFavorites(): void {
    let newSearched: Ticket[] = [];

    newSearched = this.searchedTickets.filter(ticket => 
      this.isFavorited(ticket.id)
    );

    this.searchedTickets = newSearched;
  }

  deleteTicket(id: number) {
    let toDelete: Ticket = this.searchedTickets.find(ticket =>
      ticket.id === id
    )!;

    this.ticketService.deleteTicket(id).subscribe(() =>{
      this.searchedTickets.splice(this.searchedTickets.indexOf(toDelete), 1);
    });
  }
  
  ngOnInit(): void { // We call this to update page when user clicks login.
    this.currentUser= this.ticketService.currentUser;
    this.userID = "";
  }

  getTicket(ticket: Ticket){
    this.ticketService.ticket = ticket;
    this.router.navigateByUrl(`/ticket-view`);
  }
  
  resolveTicket(id: number, ticket: Ticket, resolution: string): void {
    if(ticket.isOpen === true){
      this.ticketService.addResolution(id, ticket, resolution).subscribe();
    }
    else{
      ticket.resolution = "This Ticket has not been resolved yet.";
    }
  }

  timeBetween(ticket: Ticket): string {
    let timeString: string = "";
    this.timeBetweenOpenClose = new Date(ticket.closeDate).getTime() - new Date(ticket.openDate).getTime(); // gives milliseconds
    this.timeBetweenOpenClose = this.timeBetweenOpenClose / 1000; // to seconds
    this.timeBetweenOpenClose = this.timeBetweenOpenClose / 60; // to minutes
    this.timeBetweenOpenClose = this.timeBetweenOpenClose / 60; // to hours
    this.timeBetweenOpenClose = this.timeBetweenOpenClose / 24; // To days

    if (this.timeBetweenOpenClose >= 1) {
      timeString += Math.trunc(this.timeBetweenOpenClose) + " days ";
      this.timeBetweenOpenClose = this.timeBetweenOpenClose - Math.trunc(this.timeBetweenOpenClose);
      this.timeBetweenOpenClose = this.timeBetweenOpenClose * 24 // Converts back to hours
    }
    
    if (this.timeBetweenOpenClose >= 1) {
      timeString += Math.trunc(this.timeBetweenOpenClose) + " hours ";
      this.timeBetweenOpenClose = this.timeBetweenOpenClose - Math.trunc(this.timeBetweenOpenClose);
      this.timeBetweenOpenClose = this.timeBetweenOpenClose * 60 // Converts back to minutes
    }

    if (this.timeBetweenOpenClose >= 1) {
      timeString += Math.trunc(this.timeBetweenOpenClose) + " minutes ";
      this.timeBetweenOpenClose = this.timeBetweenOpenClose - Math.trunc(this.timeBetweenOpenClose);
      this.timeBetweenOpenClose = this.timeBetweenOpenClose * 60 // Converts back to seconds
    }

    if (this.timeBetweenOpenClose >= 1) {
      timeString += Math.trunc(this.timeBetweenOpenClose) + " seconds";
    }


    console.log(this.timeBetweenOpenClose);

    return timeString;
  }
}