import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}
  private url = 'https://api.github.com/users/'


  //userInfo 
  getUser(githubUsername: string|number) {
    return this.http.get(
      `${this.url}${githubUsername}`
    );
  }

  // implement getRepos method by referring to the documentation. Add proper types for the return type and params
  getRepo(githubUsername: string|number, pageSize: number, pageNumber: number) {
    return this.http
      .get(`${this.url}${githubUsername}/repos?page=${pageNumber}&per_page=${pageSize}
    `);
  }

//this mehod use to get the language use in the repo code
getTopic(url: string): Observable<any[]> {
  return this.http.get<any[]>(url);
}

}
