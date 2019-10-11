import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../model/category';
import { Observable, of } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import 'rxjs/add/operator/map';
@Injectable({
  providedIn: 'root'
})

export class CategoryService {

  uri = 'http://localhost:3200';

  constructor(private http: HttpClient) { }

  public getCategories(): Observable<boolean> {
    return this.http.get<boolean>(`${this.uri}/get`)
      .pipe(catchError(this.handleError<boolean>('get_categories'))
      );
  }
  
  public loadCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.uri}/load`)
      .pipe(catchError(this.handleError<Category[]>('get_categories', []))
      );
  }

  /*public getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.uri}/get`)
      .pipe(catchError(this.handleError<Category[]>('get_categories',[]))
      );
  }*/
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption


      // Let the app keep running by returning an empty result.
      return of(result);
    };
  }

}
