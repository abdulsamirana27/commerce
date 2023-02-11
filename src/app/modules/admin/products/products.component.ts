import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {AddReviewComponent} from "../reviews/add-review/add-review.component";
import {MatDialog} from "@angular/material/dialog";
import {ProductService} from "../../../services/product.service";
import {finalize} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
    selector       : 'products',
    templateUrl    : './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy
{
    ProductForm: FormGroup;
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
        private spinner: NgxSpinnerService,
        private _formBuilder:FormBuilder,
                 )
    { }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit(): void
    {
        this.createForm()
        this.getProducts();

    }

    createForm(){
        this.ProductForm = this._formBuilder.group({
            Type: [1],
            Name: [null],
        })
    }

    getProducts() {
        this.spinner.show()
        this.productService.getProducts(this.ProductForm.value)
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
