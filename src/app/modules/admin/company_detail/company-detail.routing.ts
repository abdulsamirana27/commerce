import { Route } from '@angular/router';
import {AddCompanyDetailComponent} from "./add-company-detail/add-company-detail.component";

export const productsRoutes: Route[] = [
    {path: '', pathMatch : 'full', redirectTo: 'feature/add'},
    {path: 'feature', pathMatch : 'full', redirectTo: 'feature/add'},
    {
        path     : 'add',
        component: AddCompanyDetailComponent
    },

];
