import { Route } from '@angular/router';
import {AboutUsComponent} from "./about-us.component";
import {AddAboutUsComponent} from "./add-about-us/add-about-us.component";

export const productsRoutes: Route[] = [
    {
        path     : '',
        component: AboutUsComponent,
    },
    {
        path     : 'add',
        component: AddAboutUsComponent
    },
    {
        path     : 'update/:id',
        component: AddAboutUsComponent
    }
];
