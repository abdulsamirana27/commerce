import { Route } from '@angular/router';
import {DashboardComponent} from "./dashboard.component";
import {ProjectResolver} from "./dashboard.resolvers";

export const dashboardRoutes: Route[] = [
    {
        path     : '',
        component: DashboardComponent,
        resolve  : {
            data: ProjectResolver
        }
    }
];
