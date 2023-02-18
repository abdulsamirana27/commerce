import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class FeaturesService {
    user = JSON.parse(localStorage.getItem("user"));
    constructor(
        private http: HttpClient,
    ) {
    }

    getFeature(req) {
        return this.http
            .post<any>(
                `${environment.apiUrl}/Span/api/Review/v1/GetReviews`,{});
    }

    addFeature(Feature) {
        let req={
            User: {
                UserId:this.user["UserId"]
            },Feature:Feature};
        debugger
        return this.http
            .post<any>(`${environment.apiUrl}/Span/api/Product/v1/AddUpdateFeature`,req)
        // .pipe(map((res: any) => res));
    }

    addFeatureIcon(file,client) {
        debugger
        var formData = new FormData();
        formData.append('UserId', this.user["UserId"]);
        formData.append('File', file);
        return this.http.post<any>(`${environment.apiUrl}/Span/api/Product/v1/AddFeatureIcon`,formData);
    }




}
