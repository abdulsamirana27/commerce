import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ClientsService {
    user = JSON.parse(localStorage.getItem("user"));
    constructor(
        private http: HttpClient,
    ) {
    }

    getClients(req) {
        debugger
        return this.http
            .post<any>(
                `${environment.apiUrl}/Span/api/OurClient/v1/GetClients`,req);
    }

    addClient(file,client) {
        debugger
        var formData = new FormData();
        formData.append('ClientName', client.ClientName);
        formData.append('UserId', this.user["UserId"]);
        formData.append('File', file);
        return this.http.post<any>(`${environment.apiUrl}/Span/api/OurClient/v1/AddUpdateClient`,formData);
    }
    deleteClient(value) {
        return this.http
            .post<any>(
                `${environment.apiUrl}/Span/api/OurClient/v1/DeleteClient`,value)
        // .pipe(map((res: any) => res));
    }

}
