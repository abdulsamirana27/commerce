import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Images} from "../../../../model/images.model";
import {finalize} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import { GenericService } from 'app/services/generic.service';
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../../../environments/environment";
import {ViewFileComponent} from "../../../../shared/SharedComponent/view-file/view-file.component";
import {ClientsService} from "../../../../services/clients.service";
import {ReviewService} from "../../../../services/review.service";
import {ContactUsService} from "../../../../services/contact-us.service";

@Component({
  selector: 'app-add-company-detail',
  templateUrl: './add-contact-us.component.html',
  styleUrls: ['./add-contact-us.component.scss']
})
export class AddContactUsComponent implements OnInit {
    Title="Contact Us"
    height
    width
    currentIndex: number = 0;
    ContactUs:any;
    baseUrl= environment.apiUrl+"/Span/Documents/";
    ContactUsForm: FormGroup;
    subDesc: FormGroup;
    images: Images[] = [];
    imageUrl: any[] = [];

    constructor(
        public dialogRef: MatDialogRef<AddContactUsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialog: MatDialog,
                 private _formBuilder:FormBuilder,
                 private fb:FormBuilder,
                 private  genericService:GenericService,
                 private  reviewService:ReviewService,
                 private  contactUsService:ContactUsService,
                 private toastrService:ToastrService,
                 private spinner: NgxSpinnerService,
                 private route: ActivatedRoute,
                 private _router: Router,
    )
    { }

    ngOnInit(): void
    {
        this.reviewForm();
        this.ContactUsForm.patchValue(this.data);
    }

    reviewForm(){
        this.ContactUsForm = this._formBuilder.group({
            Id:[null],
            Name:[null],
            Email:[null],
            PhoneNumber:[null],
            Address:[null],
            Message:[null],
            ResponseStatus: [null],
            file:[null],
        })
    }

    hasError(controlName: string, errorName: string): boolean {
        if(this.ContactUsForm.controls[controlName].touched)
        return this.ContactUsForm.controls[controlName].hasError(errorName);
    }

    ngOnDestroy(): void
    { }

    onReset() {

    }

    ifResetRequired() {
        this.ContactUsForm.controls['file'].reset();
    }
    onSubmit() {
        this.ContactUs = Object.assign({},this.ContactUsForm.value)
        this.spinner.show();
        this.ContactUs.ResponseStatus=1;
        this.contactUsService.ChangeStatusContactUs(this.ContactUs)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.toastrService.success("Status Changed Successfully","Success");
                    this.dialogRef.close();
                } else {
                    this.toastrService.error(baseResponse.Message, 'Error');
                }
            });

    }

    onClose() {
        this.dialogRef.close()
    }

}
