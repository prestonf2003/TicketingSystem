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
    return this.http.put<Ticket>(this.urlRoot + "ticket/CreateNewTicket" ,t);
  }

  deleteTicket(id: number): Observable<Ticket> {
    return this.http.delete<Ticket>(this.urlRoot + "ticket/DeleteTicket/" + id);
  }

  updateTicket(id: number, t: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(this.urlRoot + "ticket/UpdateTicket/" + id ,t);
  }

  showFavorites(): Observable <Favorite[]> {
    return this.http.get<Favorite[]>(this.urlRoot + "favorite/ShowAllFavorites");
  }

  createFavorite(f: Favorite): Observable<Favorite> {
    return this.http.put<Favorite>(this.urlRoot + "favorite/CreateNewFavorite/", f);
  }

  deleteFavorite(id: number): Observable<Favorite> {
    return this.http.delete<Favorite>(this.urlRoot + "favorite/DeleteFavorite/" + id);
  }
  addResolution(id: number, ticket: Ticket, resolution: string ): Observable<Ticket> {
    return this.http.post<Ticket>(this.urlRoot + "ticket/AddResolution/" + id, ticket);
  }

}
