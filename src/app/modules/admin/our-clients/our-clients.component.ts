import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {finalize} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ClientsService} from "../../../services/clients.service";


@Component({
    selector       : 'our-clients',
    templateUrl    : './our-clients.component.html',
    styleUrls: ['./our-clients.component.scss']
})
export class OurClientsComponent implements OnInit, OnDestroy
{
    ClientForm: FormGroup;
    products:any;
    displayedColumns: string[] =
        [
            'index',
            'Name',
            'action',
        ];
    dataSource = new MatTableDataSource();
    @ViewChild('TABLE') table: ElementRef;
    //@ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('MatPaginator', {static: false}) paginator: MatPaginator;

    constructor(
        private dialogRef: MatDialog,
        private clientsService: ClientsService,
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
        this.getClients();

    }

    createForm(){
        this.ClientForm = this._formBuilder.group({
            Type: [2],
            Name: [null],
        })
    }

    getClients() {
        this.spinner.show()
        this.clientsService.getClients(this.ClientForm.value)
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
