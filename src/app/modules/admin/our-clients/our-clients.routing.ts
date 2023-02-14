import { Route } from '@angular/router';
import {OurClientsComponent} from "./our-clients.component";
import {AddClientComponent} from "./add-product/add-client.component";

export const productsRoutes: Route[] = [
    {
        path     : '',
        component: OurClientsComponent,
    },
    {
        path     : 'add',
        component: AddClientComponent
    },
    {
        path     : 'update/:id',
        component: AddClientComponent
    }
];
