import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import {MatPaginatorModule} from "@angular/material/paginator";
import {GalleryComponent} from "./gallery.component";
import {productsRoutes} from "./gallery.routing";
import {AddGalleryComponent} from "./add-gallery/add-gallery.component";
import {AngularImageViewerModule} from "@hreimer/angular-image-viewer";
import {ViewFileComponent} from "../../../shared/SharedComponent/add-review/view-file.component";

@NgModule({
    declarations: [
        GalleryComponent,
        AddGalleryComponent
    ],
    imports: [
        RouterModule.forChild(productsRoutes),
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSidenavModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        NgApexchartsModule,
        TranslocoModule,
        SharedModule,
        MatPaginatorModule,

    ]
})
export class GalleryModule
{
}
