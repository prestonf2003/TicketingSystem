import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
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

  showAllFavorites(): void { // This could possibly be bettered by instead filtering allFavorites for favorites done by currentUser.
    this.ticketService.showFavorites().subscribe((allFavories) => { // that would allow us to search through a smaller array and not need to constantly call showAllFavorites.
      this.favorites = allFavories;
    });
  }

  createFavorite(ticketID: number): void {
    this.newFavorite = new Favorite (undefined!, this.ticketService.currentUser, ticketID); // undefined! is to avoid a type error, when the DB gets the request, it inserts its own pkId.

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

  isFavorited(ticketID: number): boolean { // used to tell if the current user favorited a ticket.
    for (let i = 0; i < this.favorites.length; i++) { // iterates through all favorites in the db, and returns true if a ticket is favorited and it's favorited by the current user.
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

    this.ticketService.deleteTicket(id).subscribe(() => {
      this.searchedTickets.splice(this.searchedTickets.indexOf(toDelete), 1);
    });
  }
  
  ngOnInit(): void { // We call this to update page when user clicks login.
    this.currentUser= this.ticketService.currentUser;
    this.userID = "";
  }

  getTicket(ticket: Ticket) { 
    // We use this to pass ticket to our Ticket Service and redirect to ticket-view, which pulls the passed ticket down from ticket service to display data.
    this.ticketService.ticket = ticket;
    this.router.navigateByUrl(`/ticket-view`);
  }

  timeBetween(ticket: Ticket): string {
    let timeString: string = "";
    
    if (ticket.closeDate !== null) {
      this.timeBetweenOpenClose = new Date(ticket.closeDate).getTime() - new Date(ticket.openDate).getTime(); // gives milliseconds between dates
    }
    else  {
      this.timeBetweenOpenClose = new Date().getTime() - new Date(ticket.openDate).getTime(); // gives milliseconds between now and the open date.
    }
    
    if (this.timeBetweenOpenClose/(1000*60*60*24) >= 1) { // adds days to the string and formats
      timeString += Math.trunc(this.timeBetweenOpenClose/(1000*60*60*24)) + " day";
      
      if(Math.trunc(this.timeBetweenOpenClose/(1000*60*60*24)) >= 2) { // checks if day should be plural
        timeString += "s";
      }

      this.timeBetweenOpenClose %= 1000*60*60*24; // converts to remaining hours

      if (this.timeBetweenOpenClose >= 1000) { // checks if there's more data to add. Since we don't care for ms, we check for any data greater than or equal to 1 second.
        timeString += ", ";
      }
      else {
        timeString += ".";
      }
    }
    
    if (this.timeBetweenOpenClose/(1000*60*60) >= 1) { // adds hours to the string and formats
      timeString += Math.trunc(this.timeBetweenOpenClose/(1000*60*60)) + " hour";
    
      if(Math.trunc(this.timeBetweenOpenClose/(1000*60*60)) >= 2) {
        timeString += "s";
      }

      this.timeBetweenOpenClose %= 1000*60*60 // to remaining minutes
      
      if (this.timeBetweenOpenClose >= 1000) {
        timeString += ", ";
      }
      else {
        timeString += ".";
      }
    }

    if (this.timeBetweenOpenClose/(1000*60) >= 1) { // adds minutes to the string and formats
      timeString += Math.trunc(this.timeBetweenOpenClose/(1000*60)) + " minute";
      
      if(Math.trunc(this.timeBetweenOpenClose/(1000*60)) >= 2) {
        timeString += "s";
      }

      this.timeBetweenOpenClose %= 1000*60; // to remaining seconds

      if (this.timeBetweenOpenClose >= 1000) {
        timeString += ", ";
      }
      else {
        timeString += ".";
      }
    }

    if (this.timeBetweenOpenClose/1000 >= 1) { // adds seconds to the string and formats
      timeString += Math.trunc(this.timeBetweenOpenClose/1000) + " second"; 
      
      if(Math.trunc(this.timeBetweenOpenClose/1000) >= 2) { // we don't go past seconds, so we only need to format
        timeString += "s.";
      }
      else {
        timeString += ".";
      }
    }

    if (timeString === "") { // Sometimes after submitting a ticket the page can load before 1 second passes, so not would display for the "Opened for: " row.
      return "0 seconds."; // For that case we want to show something, so we show this.
    }

    return timeString;
  }
}