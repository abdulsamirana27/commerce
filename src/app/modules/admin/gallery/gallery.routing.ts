import { Route } from '@angular/router';
import {GalleryComponent} from "./gallery.component";
import {AddGalleryComponent} from "./add-gallery/add-gallery.component";

export const productsRoutes: Route[] = [
    {
        path     : '',
        component: GalleryComponent,
    },
    {
        path     : 'add',
        component: AddGalleryComponent
    },
    {
        path     : 'update/:id',
        component: AddGalleryComponent
    }
];
