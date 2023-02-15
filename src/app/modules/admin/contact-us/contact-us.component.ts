import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {finalize} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ReviewService} from "../../../services/review.service";
import {ContactUsService} from "../../../services/contact-us.service";
import {AddContactUsComponent} from "./add-contact-us/add-contact-us.component";
import {ToastrService} from "ngx-toastr";


@Component({
    selector       : 'reviews',
    templateUrl    : './contact-us.component.html',
    styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit, OnDestroy
{
    ContactUsForm: FormGroup;
    ContactUs:any;
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
        private dialog: MatDialog,
        private contactUsService: ContactUsService,
        private spinner: NgxSpinnerService,
        private _formBuilder:FormBuilder,
        private toastrService:ToastrService
                 )
    { }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit(): void
    {
        this.createForm()
        this.getContactUs();

    }

    createForm(){
        this.ContactUsForm = this._formBuilder.group({
            Id: [null],
        })
    }

    getContactUs() {
        this.spinner.show()
        this.contactUsService.getContactUs(this.ContactUsForm.value)
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

    openNotification(notification){
        debugger
        const dialogRef = this.dialog.open(AddContactUsComponent, {
            width: '70%',
            height: '70%',
            data: notification
        });
    }

    ngOnDestroy(): void
    { }

    delete() {

    }
    changeStatus(data) {
        this.spinner.show();
        data.ResponseStatus=1;
        this.contactUsService.ChangeStatusContactUs(data)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    debugger
                    this.toastrService.success("Status Changed Successfully","Success");

                } else {
                    this.toastrService.error(baseResponse.Message, 'Error');
                }
            });

    }
    update() {

    }
}
