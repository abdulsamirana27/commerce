import { Route } from '@angular/router';
import {AddFeaturesComponent} from "./add-features/add-features.component";

export const productsRoutes: Route[] = [
    {path: '', pathMatch : 'full', redirectTo: 'feature/add'},
    {path: 'feature', pathMatch : 'full', redirectTo: 'feature/add'},
    {
        path     : 'add',
        component: AddFeaturesComponent
    },

];
