import { Route } from '@angular/router';
import {ProductsComponent} from "./products.component";
import {ProjectResolver} from "./products.resolvers";
import {AddProductComponent} from "./add-product/add-product.component";

export const productsRoutes: Route[] = [
    {
        path     : '',
        component: ProductsComponent,
        resolve  : {
            data: ProjectResolver
        }
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
