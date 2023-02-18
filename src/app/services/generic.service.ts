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
     user = JSON.parse(localStorage.getItem("user"));

    SaveMedia(file, Data) {
        debugger
        var formData = new FormData();

        formData.append('LinkedId', Data.LinkedId);
        formData.append('Type', Data.Type);
        formData.append('UserId', this.user["UserId"]);
        formData.append('File', file);
        return this.http.post<any>(`${environment.apiUrl}/Span/api/Gallery/v1/AddGalleryData`,formData);
    }

    DeleteMedia(Id) {
        debugger
        let req = {
            Id:Id,
            UserId:this.user["UserId"]
        }
        return this.http
            .post<any>(
                `${environment.apiUrl}/Span/api/Gallery/v1/DeleteGalleryData`,req)
        // .pipe(map((res: any) => res));
    }
    getProducts(value) {

        return this.http
            .post<any>(
                `${environment.apiUrl}/Span/api/Product/v1/GetProducts`,value)
        // .pipe(map((res: any) => res));
    }


    addProducts(product) {
        let req={
            User: {
                UserId:this.user["UserId"]
            },Product:product};
        return this.http
            .post<any>(
                `${environment.apiUrl}/Span/api/Product/v1/AddUpdateProduct`,req)
        // .pipe(map((res: any) => res));
    }

    deleteProducts(value) {
        debugger
        return this.http
            .post<any>(
                `${environment.apiUrl}/Span/api/Product/v1/DeleteProduct`,value)
        // .pipe(map((res: any) => res));
    }



}
