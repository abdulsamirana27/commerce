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

    getClients(id) {
        return this.http
            .get<any>(
                `${environment.apiUrl}/Span/api/OurClient/v1/GetClients`);
    }


    addClient(file,client) {
        debugger
        var formData = new FormData();
        formData.append('ClientName', client.Name);
        formData.append('UserId', this.user["UserId"]);
        formData.append('File', file);
        return this.http.post<any>(`${environment.apiUrl}/Span/api/OurClient/v1/AddUpdateClient`,formData);
    }

}
