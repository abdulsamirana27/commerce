import { Route } from '@angular/router';
import {ContactUsComponent} from "./contact-us.component";
import {AddContactUsComponent} from "./add-product/add-contact-us.component";

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
        path     : 'update/:id',
        component: AddContactUsComponent
    }
];
