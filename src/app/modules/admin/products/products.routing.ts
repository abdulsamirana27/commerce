import { Route } from '@angular/router';
import {ProductsComponent} from "./products.component";
import {AddProductComponent} from "./add-product/add-product.component";

export const productsRoutes: Route[] = [
    {
        path     : '',
        component: ProductsComponent,
    },
    {
        path     : 'add',
        component: AddProductComponent
    },
    {
        path     : 'update/:id',
        component: AddProductComponent
    }
];
