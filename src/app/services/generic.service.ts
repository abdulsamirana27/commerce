import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';
import {UserService} from "../core/user/user.service";

@Injectable({
    providedIn: 'root',
})
export class GenericService {

    constructor(
        private http: HttpClient,
        private _userService:UserService,
    ) {
    }

    SaveMedia(file, Data) {
        debugger
        var formData = new FormData();
       let user = JSON.parse(localStorage.getItem("user"));
        formData.append('LinkedId', Data.LinkedId);
        formData.append('Type', Data.Type);
        formData.append('UserId', user["UserId"]);
        formData.append('File', file);
        return this.http.post<any>(`${environment.apiUrl}/Span/api/Gallery/v1/AddGalleryData`,formData);
    }



}
