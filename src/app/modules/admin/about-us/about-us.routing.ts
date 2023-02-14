import { Route } from '@angular/router';
import {AddAboutUsComponent} from "./add-about-us/add-about-us.component";

export const productsRoutes: Route[] = [
    {path: '', pathMatch : 'full', redirectTo: 'about-us/add'},
    {
        path     : 'add',
        component: AddAboutUsComponent
    },

];
