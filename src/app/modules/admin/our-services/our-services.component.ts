import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {ProductService} from "../../../services/product.service";
import {finalize} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GenericService} from "../../../services/generic.service";
import {ToastrService} from "ngx-toastr";


@Component({
    selector       : 'products',
    templateUrl    : './our-services.component.html',
    styleUrls: ['./our-services.component.scss']
})
export class OurServicesComponent implements OnInit, OnDestroy
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
        private genericService:GenericService,
        private toastrService:ToastrService,
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
            Type: [6],
            Name: [null],
        })
    }

    getProducts() {
        this.spinner.show()
        this.genericService.getProducts(this.ProductForm.value)
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

    delete(data) {
        debugger
        this.spinner.show()
        this.genericService.deleteProducts(data)
            .pipe(
                finalize(() => {
                    this.spinner.hide()
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.toastrService.success("Deleted successfully","Success")
                    this.getProducts()
                } else {
                    this.toastrService.error("Something went wrong","Error")
                }
            });
    }

    update() {

    }
}
