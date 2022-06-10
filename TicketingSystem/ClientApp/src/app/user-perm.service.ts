import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserPerm } from './userperm';

@Injectable({
  providedIn: 'root'
})
export class UserPermService {
urlRoot: string;
UserNow: UserPerm = new UserPerm("", "");
headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8'); // We don't need headers or requestOption, but it makes console less bad.
  requestOptions: Object = {
    headers: this.headers,
    responseType: 'text'
  };
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) { 
    this.urlRoot = baseUrl;
  }
  showAllUsers(): Observable <UserPerm[]> {
    return this.http.get<UserPerm[]>(this.urlRoot + "userperm/ShowAllUsers/");
    
  }
  createNewUser(u: UserPerm): Observable<UserPerm> {
    return this.http.put<UserPerm>(this.urlRoot + "userperm/CreateNewUser/", u);
  }
  deleteUser(username: string): Observable<UserPerm> {
    return this.http.delete<UserPerm>(this.urlRoot + "userperm/DeleteUser/" + username, this.requestOptions);
  }
  updateUser(username: string, u: UserPerm): Observable<UserPerm>{
    return this.http.post<UserPerm>(this.urlRoot + "userperm/UpdateUser/" + username, u);
  }

}
