import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ProductService {

    constructor(
        private http: HttpClient,
    ) {
    }

    getProducts(value) {

        return this.http
            .post<any>(
                `${environment.apiUrl}/Span/api/Product/v1/GetProducts`,value)
            // .pipe(map((res: any) => res));
    }


    addProducts(product) {
       let req={
           "User": {
               "UserId": "1"
           },Product:product};
        return this.http
            .post<any>(
                `${environment.apiUrl}/Span/api/Product/v1/AddUpdateProduct`,req)
        // .pipe(map((res: any) => res));
    }

}
