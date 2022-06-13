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
    console.log(ticket.closeDate);
    if (ticket.closeDate !== null) {
      this.timeBetweenOpenClose = new Date(ticket.closeDate).getTime() - new Date(ticket.openDate).getTime(); // gives milliseconds between dates
    }
    else  {
      this.timeBetweenOpenClose = (new Date().getTime() + 4 * 60 * 60 * 1000) - new Date(ticket.openDate).getTime(); // gives milliseconds between now and the open date.
      // The  "+ 4 * 60 * 60 * 1000" is to add 4 hours to the close date. This is because of SYSDATETIME for the DB uses a TZ different from EST.
      // If we had more time we would change TZ for the DB, but right now it's possible to post a ticket late night on 06/13/22 and have it show up on the view as 06/14/22.
    }

    this.timeBetweenOpenClose = Math.trunc(this.timeBetweenOpenClose * 1000)/1000; // This deletes the millisecond data, which we don't use and could screw up result.
    

    if (this.timeBetweenOpenClose/(1000*60*60*24) >= 1) {
      timeString += Math.trunc(this.timeBetweenOpenClose/(1000*60*60*24)) + " day";
      
      if(Math.trunc(this.timeBetweenOpenClose/(1000*60*60*24)) >= 2) { // checks if day should be plural
        timeString += "s";
      }

      this.timeBetweenOpenClose %= 1000*60*60*24; // converts to remaining hours

      if (this.timeBetweenOpenClose > 0) { // checks if there's more data to add (TODO: 1 day and 1 millisecond would screw this up)
        timeString += ", ";
      }
      else {
        timeString += ".";
      }
    }
    
    if (this.timeBetweenOpenClose/(1000*60*60) >= 1) {
      timeString += Math.trunc(this.timeBetweenOpenClose/(1000*60*60)) + " hour";
    
      if(Math.trunc(this.timeBetweenOpenClose/(1000*60*60)) >= 2) {
        timeString += "s";
      }

      this.timeBetweenOpenClose %= 1000*60*60 // to remaining minutes
      
      if (this.timeBetweenOpenClose > 0) {
        timeString += ", ";
      }
      else {
        timeString += ".";
      }
    }

    if (this.timeBetweenOpenClose/(1000*60) >= 1) {
      timeString += Math.trunc(this.timeBetweenOpenClose/(1000*60)) + " minute";
      
      if(Math.trunc(this.timeBetweenOpenClose/(1000*60)) >= 2) {
        timeString += "s";
      }

      this.timeBetweenOpenClose %= 1000*60; // to remaining seconds

      if (this.timeBetweenOpenClose > 0) {
        timeString += ", ";
      }
      else {
        timeString += ".";
      }
    }

    if (this.timeBetweenOpenClose >= 1) {
      timeString += Math.trunc(this.timeBetweenOpenClose/1000) + " second"; // we don't go past seconds
      
      if(Math.trunc(this.timeBetweenOpenClose/1000) >= 2) {
        timeString += "s.";
      }
      else {
        timeString += ".";
      }
    }

    return timeString;
  }
}