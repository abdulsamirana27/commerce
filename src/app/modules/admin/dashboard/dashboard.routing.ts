import { Route } from '@angular/router';
import {DashboardComponent} from "./dashboard.component";
import {AddDashboardComponent} from "./add-product/add-dashboard.component";

export const productsRoutes: Route[] = [
    {
        path     : '',
        component: DashboardComponent,
    },
    {
        path     : 'add',
        component: AddDashboardComponent
    },
    {
        path     : 'update/:id',
        component: AddDashboardComponent
    }
];
