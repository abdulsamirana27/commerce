import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ContactUsService {
    user = JSON.parse(localStorage.getItem("user"));
    constructor(
        private http: HttpClient,
    ) {
    }

    getContactUs(req) {
        return this.http
            .post<any>(
                `${environment.apiUrl}/Span/api/ContactUs/v1/GetContactUs`,req);
    }
    getCompanyDetail(req) {
        return this.http
            .post<any>(
                `${environment.apiUrl}/Span/api/ContactUs/v1/GetCompanyDetail`,{});
    }
    ChangeStatusContactUs(req) {
        req["UserId"]=Number(this.user["UserId"])
        return this.http
            .post<any>(
                `${environment.apiUrl}/Span/api/ContactUs/v1/ChangeStatus`,req);
    }

    addContactUs(file,client) {
        var formData = new FormData();
        formData.append('ClientName', client.ClientName);
        formData.append('ShortReview', client.ShortReview);
        formData.append('DetailedReview', client.DetailedReview);
        formData.append('UserId', this.user["UserId"]);
        formData.append('File', file);
        return this.http.post<any>(`${environment.apiUrl}/Span/api/Review/v1/AddUpdateReview`,formData);
    }
    addCompanyDetail(CompanyDetail) {
        let req={
            User: {
                UserId:this.user["UserId"]
            },CompanyDetail:CompanyDetail};
        return this.http
            .post<any>(
                `${environment.apiUrl}/Span/api/ContactUs/v1/AddUpdateCompanyDetail`,req)
        // .pipe(map((res: any) => res));
    }
}
