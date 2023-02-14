import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {ProductService} from "../../../services/product.service";
import {finalize} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";
import {FormBuilder, FormGroup} from "@angular/forms";


@Component({
    selector       : 'about-us',
    templateUrl    : './about-us.component.html',
    styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit, OnDestroy
{
    products:any;
    aboutUsForm: FormGroup
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
        private fb: FormBuilder,
        private spinner: NgxSpinnerService
                 )
    { }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    createForm(){
        this.aboutUsForm = this.fb.group({
            Name:[null]
        })
    }

    ngOnInit(): void
    {
        this.getProducts();
        this.createForm()
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
