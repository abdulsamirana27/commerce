import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { HttpResponseHandler } from './handle-error.service';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import {REQUESTTYPE} from "../../modules/models/requestType.enum";

@Injectable()
export class DataService {
  constructor(
    private httpClient: HttpClient,
    private responseHandler: HttpResponseHandler,
    private spinner: NgxSpinnerService
  ) {}


  public genericService<T>(callType: REQUESTTYPE, controlerActionName: string, data: any = '') {
    let apiUrl = environment.apiUrl + controlerActionName;
    if (callType && controlerActionName) {
        this.spinner.show();
      if (callType == REQUESTTYPE.POST) {
        return this.httpClient
          .post<T>(apiUrl, data)
          .pipe( finalize(() =>{this.spinner.hide();}),catchError((err, source) => this.responseHandler.onCatch(err, source)));
      }else {
          this.spinner.hide();
        throw 'Invalid Type or Controller Name';
      }
    } else {
       throw 'Invalid Type or Controller Name';
    }
  }

}
