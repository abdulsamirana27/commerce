import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {ProductService} from "../../../services/product.service";
import {finalize} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";


@Component({
    selector       : 'about-us',
    templateUrl    : './about-us.component.html',
    styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit, OnDestroy
{
    products:any;
    displayedColumns: string[] =
        [
            'index',
            'Name',
            'ShortDescription',
            'action',
        ];
    dataSource = new MatTableDataSource();
    @ViewChild('TABLE') table: ElementRef;
    //@ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('MatPaginator', {static: false}) paginator: MatPaginator;

    constructor(
        private dialogRef: MatDialog,
        private productService: ProductService,
        private spinner: NgxSpinnerService
                 )
    { }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit(): void
    {
        this.getProducts();
    }

    getProducts(value=null) {
        this.spinner.show()
        this.productService.getProducts(value)
            .pipe(
                finalize(() => {
                    this.spinner.hide()
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.dataSource = baseResponse.Products;
                    // this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
                } else {
                    // this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            });
    }

    ngOnDestroy(): void
    { }

    delete() {

    }

    update() {

    }
}
