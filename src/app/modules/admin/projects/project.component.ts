import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {finalize} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GenericService} from "../../../services/generic.service";


@Component({
    selector       : 'products',
    templateUrl    : './project.component.html',
    styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy
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
        private genericService: GenericService,
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
delete(){}
    ngOnDestroy(): void
    { }

}
