import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AboutUsService
{
    constructor(private _httpClient: HttpClient)
    {
    }

}
