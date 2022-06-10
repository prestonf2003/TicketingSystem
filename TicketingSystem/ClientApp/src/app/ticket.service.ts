import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Favorite } from './favorite';
import { Ticket } from './ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  urlRoot: string;
  currentUser: string = ""; 
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8'); // We don't need headers or requestOption, but it makes console less bad.
  requestOptions: Object = {
    headers: this.headers,
    responseType: 'text'
  };
  ticket!: Ticket;

  constructor (private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.urlRoot = baseUrl;
  }
  showAllTickets(): Observable <Ticket[]> {
    return this.http.get<Ticket[]>(this.urlRoot + "ticket/ShowAllTickets")
  }

  searchTicketsByTitle(searchTerm: string): Observable <Ticket[]> {
    if (searchTerm === "") {
      return this.showAllTickets(); // The URL doesn't like null searches and search bar doesn't work right without this.
    }

    return this.http.get<Ticket[]>(this.urlRoot + "ticket/SearchTicketsByTitle/" + searchTerm);
  }

  searchTicketById(id: number): Observable<Ticket>{
    return this.http.get<Ticket>(this.urlRoot + "ticket/GetTicketById/" + id);
  }

  createTicket(t: Ticket): Observable<Ticket> {
    console.log(t.id);
    return this.http.put<Ticket>(this.urlRoot + "ticket/CreateNewTicket" ,t, this.requestOptions); // this.requestOptions is to avoid all the red status: 200 errors that don't matter.
  }

  deleteTicket(id: number): Observable<Ticket> {
    return this.http.delete<Ticket>(this.urlRoot + "ticket/DeleteTicket/" + id, this.requestOptions);
  }

  updateTicket(id: number, t: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(this.urlRoot + "ticket/UpdateTicket/" + id, t, this.requestOptions);
  }

  showFavorites(): Observable <Favorite[]> {
    return this.http.get<Favorite[]>(this.urlRoot + "favorite/ShowAllFavorites");
  }

  createFavorite(f: Favorite): Observable<Favorite> {
    return this.http.put<Favorite>(this.urlRoot + "favorite/CreateNewFavorite/", f, this.requestOptions);
  }

  deleteFavorite(id: number): Observable<Favorite> {
    return this.http.delete<Favorite>(this.urlRoot + "favorite/DeleteFavorite/" + id, this.requestOptions);
  }

  addResolution(id: number, ticket: Ticket, resolution: string ): Observable<Ticket> { // maybe delete resolution, probably not needed anymore
    return this.http.post<Ticket>(this.urlRoot + "ticket/AddResolution/" + id, ticket);
  }

  swapTicketOpenStatus(id: number, ticket: Ticket, openStatus: boolean): void {
    ticket.isOpen = openStatus;
    
    if (openStatus === false) {
      ticket.resolvedUserId = this.currentUser;
    }
    else {
      ticket.resolvedUserId = "";
      ticket.closeDate = new Date();
      ticket.openDate = new Date(Date());
    }
    
    this.updateTicket(id, ticket).subscribe();
  }

  login(userID: string): void {
    userID = userID.toLowerCase();
    this.currentUser = userID[0].toUpperCase() + userID.slice(1);
  }

  logout(): void {
    this.currentUser = "";
  }
}
