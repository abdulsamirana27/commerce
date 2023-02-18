import { Route } from '@angular/router';
import {OurServicesComponent} from "./our-services.component";
import {AddOurServicesComponent} from "./add-product/add-our-services.component";

export const productsRoutes: Route[] = [
    {
        path     : '',
        component: OurServicesComponent,
    },
    {
        path     : 'add',
        component: AddOurServicesComponent
    },
    {
        path     : 'update/:id',
        component: AddOurServicesComponent
    }
];
