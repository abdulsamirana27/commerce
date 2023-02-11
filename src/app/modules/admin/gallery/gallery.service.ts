import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class GalleryService{

    constructor(private _httpClient: HttpClient)
    {
    }
    getGallery(value) {
       let req = {
           Gallery:value,
           Pagination: {
               Limit: 10,
               Offset: 0
           }
       }
        return this._httpClient
            .post<any>(
                `${environment.apiUrl}/Span/api/Gallery/v1/GetGalleryData`,req)
        // .pipe(map((res: any) => res));
    }
    deleteSingleGallery(value) {
        let req = {
            Gallery:value,
            Pagination: {
                Limit: 10,
                Offset: 0
            }
        }
        return this._httpClient
            .post<any>(
                `${environment.apiUrl}/Span/api/Gallery/v1/GetGalleryData`,req)
        // .pipe(map((res: any) => res));
    }

}
