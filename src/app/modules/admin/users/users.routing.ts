import { Route } from '@angular/router';
import {UsersComponent} from "./users.component";
import {ProjectResolver} from "./users.resolvers";

export const usersRoutes: Route[] = [
    {
        path     : '',
        component: UsersComponent,
        resolve  : {
            data: ProjectResolver
        }
    }
];
