import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import {ToastrService} from "ngx-toastr";

@Injectable()
export class HttpResponseHandler {
  constructor(
    private router: Router,
    private toastrService: ToastrService
  ) {}
  public onCatch(response: any, source: Observable<any>): Observable<any> {
    switch (response.status) {
      case 400:
        this.handleBadRequest(response);
        break;

      case 401:
        this.handleUnauthorized(response);
        break;

      case 403:
        this.handleForbidden();
        break;

      case 404:
        this.handleNotFound(response);
        break;

      case 500:
        this.handleServerError();
        break;

      default:
        break;
    }

    return throwError(response);
  }

  private handleBadRequest(responseBody: any): void {
    if (responseBody._body) {
      try {
        const bodyParsed = responseBody.json();
        this.handleErrorMessages(bodyParsed);
      } catch (error) {
        this.handleServerError();
      }
    } else {
      this.handleServerError();
    }
  }
  private handleUnauthorized(responseBody: any): void {
    localStorage.clear();
    // logout
    this.router.navigate(['/sign-in']);
  }
  private handleForbidden(): void {
    console.log('ServerError403');
    this.router.navigate(['/sign-in']);
  }

  private handleNotFound(responseBody: any): void {

      const message = 'ServerError404',
      title = 'Issue';
      this.showNotificationError(title, message);
  }

  private handleServerError(): void {
    const message = 'ServerError500',
      title = 'Issue';
    this.showNotificationError(title, message);
  }
  private handleErrorMessages(response: any): void {
    if (!response) {
      return;
    }

    for (const key of Object.keys(response)) {
      if (Array.isArray(response[key])) {
        response[key].forEach((value:any) =>
          this.showNotificationError('Error', value)
        );
      } else {
        this.showNotificationError('Error',response[key]);
      }
    }
  }
  private showNotificationError(title: string, message: string): void {
    console.log(title,message);
    this.toastrService.error(message, 'Error');
  }
}
