import { Route } from '@angular/router';
import {ReviewsComponent} from "./reviews.component";
import {AddReviewComponent} from "./add-product/add-review.component";

export const productsRoutes: Route[] = [
    {
        path     : '',
        component: ReviewsComponent,
    },
    {
        path     : 'add',
        component: AddReviewComponent
    },
    {
        path     : 'update/:id',
        component: AddReviewComponent
    }
];
