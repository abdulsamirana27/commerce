import { Route } from '@angular/router';
import {ContactUsComponent} from "./contact-us.component";
import {AddContactUsComponent} from "./add-contact-us/add-contact-us.component";

export const productsRoutes: Route[] = [
    {
        path     : '',
        component: ContactUsComponent,
    },
    {
        path     : 'add',
        component: AddContactUsComponent
    },
    {
        path     : 'detail/:id',
        component: AddContactUsComponent
    }
];
