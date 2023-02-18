// Reference
// https://stackblitz.com/edit/angular-nested-formarray-dynamic-forms-3giycy?file=src%2Fapp%2Fapp.component.ts,src%2Fapp%2Fapp.component.html,src%2Fapp%2Fapp.module.ts

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Images} from "../../../../model/images.model";
import {finalize} from "rxjs/operators";
import {ProductService} from "../../../../services/product.service";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute,  Router} from "@angular/router";
import {GenericService} from "../../../../services/generic.service";
import {environment} from "../../../../../environments/environment";
import {ViewFileComponent} from "../../../../shared/SharedComponent/view-file/view-file.component";
import {FeaturesService} from "../../../../services/features.service";

@Component({
  selector: 'app-add-company-detail',
  templateUrl: './add-features.component.html',
  styleUrls: ['./add-features.component.scss']
})
export class AddFeaturesComponent implements OnInit {

    currentIndex: number = 0;
    baseUrl = environment.apiUrl + "/Span/Documents/";
    subDesc: FormGroup;
    ProductDetailForm: FormGroup;
    Feature: any;
    images: Images[] = [];
    imageUrl: any[] = [];
    Icon: Images[] = [];
    IconUrl: any[] = [];
    featureForm: FormGroup;
    dataSource = new MatTableDataSource();
    @ViewChild('TABLE') table: ElementRef;
    //@ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('MatPaginator', {static: false}) paginator: MatPaginator;

    constructor(private dialog: MatDialog,
                private _formBuilder: FormBuilder,
                private fb: FormBuilder,
                private featuresService: FeaturesService,
                private toastrService: ToastrService,
                private spinner: NgxSpinnerService,
                private route: ActivatedRoute,
                private _router: Router,
                private genericService: GenericService
    ) {
    }


    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit(): void {
        this.createform()
        this.getFeature();

    }

    getFeature() {
        this.spinner.show()
        this.featuresService.getFeature(this.featureForm.value)
            .pipe(
                finalize(() => {
                    this.spinner.hide()
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    // debugger
                    // this.featureForm.patchValue(baseResponse.Products[0]);
                    // baseResponse?.Products[0]?.ProductDetails?.forEach((element) => {
                    //     // this.ProductDetails().push(this.newProductDetails(element.Title, element.Description));
                    // })
                    // baseResponse.Products[0]?.GalleryDetails?.forEach((element) => {
                    //     let single = element;
                    //     single.GalleryPath = this.baseUrl + element.GalleryPath;
                    //     this.images.push(element);
                    //     this.imageUrl.push(single.GalleryPath);
                    // })
                }
            });
    }

    onSelectFile(event) {
        if (this.images.length < 1) {
            if (event.target.files && event.target.files[0]) {
                const Name = event.target.files[0].name.split('.').pop();
                if (Name != undefined) {
                    if (Name.toLowerCase() == 'jpg' || Name.toLowerCase() == 'jpeg' || Name.toLowerCase() == 'png') {
                        const reader = new FileReader();
                        reader.onload = (event: any) => {
                            this.imageUrl.push(event.target.result);
                        };
                        reader.readAsDataURL(event.target.files[0]);
                        const imgFile = new Images();
                        imgFile.file = Object.assign(event.target.files[0]);
                        this.images.push(imgFile);
                    } else {
                        this.toastrService.error('Only jpeg,jpg and png files are allowed', 'Error');
                        return;
                    }
                }
            }
        } else {
            this.toastrService.error('Maximum 1 Image is allowed', 'Error');
            return;
        }
    }

    onSelectIcon(event) {
        if (this.Icon.length < 1) {
            if (event.target.files && event.target.files[0]) {
                const Name = event.target.files[0].name.split('.').pop();
                if (Name != undefined) {
                    if (Name.toLowerCase() == 'jpg' || Name.toLowerCase() == 'jpeg' || Name.toLowerCase() == 'png') {
                        const reader = new FileReader();
                        reader.onload = (event: any) => {
                            this.IconUrl.push(event.target.result);
                        };
                        reader.readAsDataURL(event.target.files[0]);
                        const imgFile = new Images();
                        imgFile.file = Object.assign(event.target.files[0]);
                        this.Icon.push(imgFile);
                    } else {
                        this.toastrService.error('Only jpeg,jpg and png files are allowed', 'Error');
                        return;
                    }
                }
            }
        } else {
            this.toastrService.error('Maximum 1 Image is allowed', 'Error');
            return;
        }
    }

    hasError(controlName: string, errorName: string): boolean {
        if (this.featureForm.controls[controlName].touched)
            return this.featureForm.controls[controlName].hasError(errorName);
    }

    ifResetRequired() {
        this.featureForm.controls['file'].reset();
    }

    onSubmit() {
        if (this.featureForm.invalid) {
            for (const control of Object.keys(this.featureForm.controls)) {
                this.featureForm.controls[control].markAsTouched();
            }
            return;
        }
        if (this.images.length == 0) {
            this.toastrService.error("Attach atleast one image", "Error")
            return
        }
        this.Feature = Object.assign({}, this.featureForm.value)
        this.spinner.show();
        this.featuresService.addFeature(this.Feature)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.Feature["Id"] = baseResponse.Feature.Id;
                    this.SaveMedia()
                } else {
                    this.toastrService.error(baseResponse.Message, 'Error');
                }
            });

    }

    removeIcon(url, val: number) {
        debugger
        if (!url.includes('base64')) {
            let image: any = this.Icon.find(element => element.GalleryPath == url);
            this.spinner.show();
            this.genericService
                .DeleteMedia(image['Id'])
                .pipe(finalize(() => {
                    this.spinner.hide();
                }))
                .subscribe((baseResponse) => {
                    if (baseResponse.Success) {
                        this.Icon.splice(val, 1);
                        this.IconUrl.splice(val, 1);
                        this.toastrService.success("Deleted successfully", "Success")
                    } else {
                        this.toastrService.error("Something went wrong", "Error")
                    }
                });
        } else {
            this.IconUrl.splice(val, 1)
            this.Icon.splice(val, 1);
        }
        this.ifResetRequired()
    }

    removeImage(url, val: number) {
        debugger
        if (!url.includes('base64')) {
            let image: any = this.images.find(element => element.GalleryPath == url);
            this.spinner.show();
            this.genericService
                .DeleteMedia(image['Id'])
                .pipe(finalize(() => {
                    this.spinner.hide();
                }))
                .subscribe((baseResponse) => {
                    if (baseResponse.Success) {
                        this.images.splice(val, 1);
                        this.imageUrl.splice(val, 1);
                        this.toastrService.success("Deleted successfully", "Success")
                    } else {
                        this.toastrService.error("Something went wrong", "Error")
                    }
                });
        } else {
            this.imageUrl.splice(val, 1)
            this.images.splice(val, 1);
        }
        this.ifResetRequired()
    }

    SaveMedia() {


        if (this.currentIndex < this.images.length) {
            if (this.images[this.currentIndex].GalleryPath == undefined) {
                this.genericService
                    .SaveMedia(this.images[this.currentIndex].file, {LinkedId: this.Feature.Id, Type: 3})
                    .pipe(finalize(() => {
                        // this.spinner.hide();
                    }))
                    .subscribe((baseResponse) => {
                        if (baseResponse.Success) {
                            this.currentIndex++;
                            this.SaveMedia();
                        } else {
                            this.spinner.hide();
                            // this.layoutUtilsService.alertElement(
                            //     '',
                            //     baseResponse.Message,
                            //     baseResponse.Code = null
                            // );
                        }
                    });
            } else {
                this.currentIndex++;
                this.SaveMedia();
            }
        } else {
            this.spinner.hide()
            this.toastrService.success("Uploaded Successfully", "Success");
        }
    }

    previewImg(url) {
        const dialogRef = this.dialog.open(ViewFileComponent, {
            width: '70%',
            height: '70%',
            data: {url: url}
        });
    }

    //example

    createform(){
        this.featureForm = this.fb.group({
            Id:'',
            Headings: this.fb.array([]),
        });
    }

    headings(): FormArray {
        return this.featureForm.get('Headings') as FormArray;
    }

    newHeading(Title=''): FormGroup {
        return this.fb.group({
            Title: Title,
            Details: this.fb.array([]),
        });
    }

    addHeading() {
        this.headings().push(this.newHeading());
    }

    removeHeading(empIndex: number) {
        this.headings().removeAt(empIndex);
    }

    HeadingDetails(empIndex: number): FormArray {
        return this.headings().at(empIndex).get('Details') as FormArray;
    }

    newDetail(Detail=''): FormGroup {
        return this.fb.group({
            Detail: Detail,
        });
    }

    addHeadingDetail(empIndex: number) {
        this.HeadingDetails(empIndex).push(this.newDetail());
    }

    removeHeadinDetail(empIndex: number, skillIndex: number) {
        this.HeadingDetails(empIndex).removeAt(skillIndex);
    }

    patchData() {
        const sam = {
            "Id": "",
            "Headings": [
                {
                    "Title": "Title 1",
                    "Details": [
                        {
                            "Detail": "detail 1 for title 1"
                        },
                        {
                            "Detail": "detail 2 for title 1"
                        },
                        {
                            "Detail": "detail 3 for title 1"
                        }
                    ]
                },
                {
                    "Title": "Title 2",
                    "Details": [
                        {
                            "Detail": "detail 1 for title 2"
                        },
                        {
                            "Detail": "detail 2 for title 2"
                        },
                        {
                            "Detail": "detail 3 for title 1"
                        }
                    ]
                }
            ]
        }

        sam.Headings.forEach((element,index)=>{
            this.headings().push(this.newHeading(element.Title));
            element.Details.forEach((element2)=>{
                this.HeadingDetails(index).push(this.newDetail(element2.Detail));
            })
        })
    }
}
