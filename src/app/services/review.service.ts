import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ReviewService {
    user = JSON.parse(localStorage.getItem("user"));
    constructor(
        private http: HttpClient,
    ) {
    }

    getReviews(req) {
        return this.http
            .post<any>(
                `${environment.apiUrl}/Span/api/Review/v1/GetReviews`,req);
    }


    addReview(file,client) {
        debugger
        var formData = new FormData();
        formData.append('ClientName', client.ClientName);
        formData.append('ShortReview', client.ShortReview);
        formData.append('DetailedReview', client.DetailedReview);
        formData.append('UserId', this.user["UserId"]);
        formData.append('File', file);
        return this.http.post<any>(`${environment.apiUrl}/Span/api/Review/v1/AddUpdateReview`,formData);
    }

}
