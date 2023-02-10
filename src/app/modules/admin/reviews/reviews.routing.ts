import { Route } from '@angular/router';
import {ReviewsComponent} from "./reviews.component";
import {ProjectResolver} from "./reviews.resolvers";

export const reviewsRoutes: Route[] = [
    {
        path     : '',
        component: ReviewsComponent,
        resolve  : {
            data: ProjectResolver
        }
    }
];
