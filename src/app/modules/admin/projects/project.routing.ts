import { Route } from '@angular/router';
import {ProjectComponent} from "./project.component";
import {AddProjectComponent} from "./add-product/add-project.component";

export const productsRoutes: Route[] = [
    {
        path     : '',
        component: ProjectComponent,
    },
    {
        path     : 'add',
        component: AddProjectComponent
    },
    {
        path     : 'update/:id',
        component: AddProjectComponent
    }
];
