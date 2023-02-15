import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {finalize} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ReviewService} from "../../../services/review.service";
import {ContactUsService} from "../../../services/contact-us.service";


@Component({
    selector       : 'reviews',
    templateUrl    : './contact-us.component.html',
    styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit, OnDestroy
{
    ReviewForm: FormGroup;
    products:any;
    displayedColumns: string[] =
        [
            'index',
            'Name',
            'Email',
            'PhoneNumber',
            'Address',
            'Message',
            'ResponseStatus',
            'action',
        ];
    dataSource = new MatTableDataSource();
    @ViewChild('TABLE') table: ElementRef;
    //@ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('MatPaginator', {static: false}) paginator: MatPaginator;

    constructor(
        private dialogRef: MatDialog,
        private contactUsService: ContactUsService,
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
        this.getReview();

    }

    createForm(){
        this.ReviewForm = this._formBuilder.group({
            Id: [null],
        })
    }

    getReview() {
        this.spinner.show()
        this.contactUsService.getContactUs(this.ReviewForm.value)
            .pipe(
                finalize(() => {
                    this.spinner.hide()
                })
            ).subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.dataSource = baseResponse.Contactus;
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
