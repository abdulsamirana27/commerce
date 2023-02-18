import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Images} from "../../../../model/images.model";
import {finalize} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute,  Router} from "@angular/router";
import {environment} from "../../../../../environments/environment";
import {ContactUsService} from "../../../../services/contact-us.service";

@Component({
  selector: 'app-add-company-detail',
  templateUrl: './add-company-detail.component.html',
  styleUrls: ['./add-company-detail.component.scss']
})
export class AddCompanyDetailComponent implements OnInit {


    CompanyDetail:any;
    currentIndex: number = 0;
    baseUrl= environment.apiUrl+"/Span/Documents/";
    CompanyDetailForm: FormGroup;
    subDesc: FormGroup;
    images: Images[] = [];
    imageUrl: any[] = [];
    dataSource = new MatTableDataSource();
    @ViewChild('TABLE') table: ElementRef;
    //@ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('MatPaginator', {static: false}) paginator: MatPaginator;

    constructor( private dialog: MatDialog,
                 private _formBuilder:FormBuilder,
                 private fb:FormBuilder,
                 private  CompanyDetailService:ContactUsService,
                 private toastrService:ToastrService,
                 private spinner: NgxSpinnerService,
                 private route:ActivatedRoute,
                 private _router:Router,
    )
    { }


    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit(): void
    {
        this.createForm();
        this.getCompanyDetails();

    }
    getCompanyDetails() {
        this.spinner.show()
        this.CompanyDetailService.getCompanyDetail(this.CompanyDetailForm.value)
            .pipe(
                finalize(() => {
                    this.spinner.hide()
                })
            )
            .subscribe(baseResponse => {
                debugger
                if (baseResponse.Success) {
                    this.CompanyDetailForm.patchValue(baseResponse.CompanyDetail);
                }
            });
    }

    createForm(){
        this.CompanyDetailForm = this._formBuilder.group({
            Id:[null],
            Address: [null, [Validators.required]],
            SubAddress: [null, [Validators.required]],
            ContactNumber: [null, [Validators.required]],
            OfficeTiming: [null, [Validators.required]],
            Email: [null, [Validators.required]],
            ContactText: [null, [Validators.required]],
            FacebookLink: [null, [Validators.required]],
            LinkedInLink: [null, [Validators.required]],
            SkypeLink: [null, [Validators.required]],
            LatLng: [null, [Validators.required]],
            // LatLng: [null, [Validators.required,Validators.pattern(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/g)]],
        })
    }

    hasError(controlName: string, errorName: string): boolean {
        if(this.CompanyDetailForm.controls[controlName].touched)
        return this.CompanyDetailForm.controls[controlName].hasError(errorName);
    }
    onSubmit() {
        if (this.CompanyDetailForm.invalid) {
            for (const control of Object.keys(this.CompanyDetailForm.controls)) {
                this.CompanyDetailForm.controls[control].markAsTouched();
            }
            return;
        }

        this.CompanyDetail = Object.assign({},this.CompanyDetailForm.value)
        this.spinner.show();
        this.CompanyDetailService.addCompanyDetail(this.CompanyDetail)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.toastrService.success("Updated Successfully","Success")
                } else {
                    this.toastrService.error(baseResponse.Message, 'Error');
                }
            });

    }

    }
