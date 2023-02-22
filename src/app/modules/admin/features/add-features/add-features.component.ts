// Reference
// https://stackblitz.com/edit/angular-nested-formarray-dynamic-forms-3giycy?file=src%2Fapp%2Fapp.component.ts,src%2Fapp%2Fapp.component.html,src%2Fapp%2Fapp.module.ts

import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-add-company-detail',
  templateUrl: './add-features.component.html',
  styleUrls: ['./add-features.component.scss']
})
export class AddFeaturesComponent implements OnInit {
noImage= "https://media.istockphoto.com/id/1357365823/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=PM_optEhHBTZkuJQLlCjLz-v3zzxp-1mpNQZsdjrbns="
    currentIndex: number = 0;
    baseUrl = environment.apiUrl + "/Span/Documents/";
    subDesc: FormGroup;
    ProductDetailForm: FormGroup;
    Feature: any;

    mainIcon: Images[] = [];
    mainIconUrl: any[] = [];

    images: Images[] = [];
    imageUrl: any[] = [];
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
                private changeDetectorRef: ChangeDetectorRef,
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
clearForm(){
        debugger

    this.featureForm.reset();
}
    Heading
    getFeature(val=false) {
        this.spinner.show()
        this.featuresService.getFeature(this.featureForm.value)
            .pipe(
                finalize(() => {
                    this.spinner.hide()
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    debugger
                    if(!val) {
                        this.imageUrl=[];
                        this.images=[];
                        this.mainIconUrl=[];
                        this.mainIcon=[];
                        this.featureForm.patchValue(baseResponse.Features[0]);
                        this.mainIconUrl[0] = this.baseUrl + baseResponse.Features[0].MainIcon;
                        this.mainIcon[0] = baseResponse.Features[0];
                        this.headings().controls.splice(0, this.headings().length);
                        baseResponse.Features[0]?.Headings?.forEach((element, index) => {
                            // this.images.push(element.Icon == "" ? this.noImage : element.Icon);
                            this.imageUrl.push(element.Icon == "" ? this.noImage : this.baseUrl + element.Icon)
                            this.headings().push(this.newHeading(element.Id, element.FeatureId, element.Title, element.Icon));
                            element.Details.forEach((element2) => {
                                this.HeadingDetails(index).push(this.newDetail(element2.Detail));
                            })
                        })
                    }

                    if(val){
                        debugger
                        // {MainIcon:this.baseUrl+baseResponse.Features[0].MainIcon};
                        this.Heading = [...baseResponse.Features[0].Headings];
                        this.SaveMedia();
                    }
                }
            });
    }

    onSelectFile(event,index) {
            if (event.target.files && event.target.files[0]) {
                const Name = event.target.files[0].name.split('.').pop();
                if (Name != undefined) {
                    if (Name.toLowerCase() == 'jpg' || Name.toLowerCase() == 'jpeg' || Name.toLowerCase() == 'png') {
                        const reader = new FileReader();
                        reader.onload = (event: any) => {
                            this.imageUrl[index]=event.target.result;
                        };
                        reader.readAsDataURL(event.target.files[0]);
                        const imgFile = new Images();
                        imgFile.file = Object.assign(event.target.files[0]);
                        this.images[index]=imgFile;
                    } else {
                        this.toastrService.error('Only jpeg,jpg and png files are allowed', 'Error');
                        return;
                    }
                }
            }

    }

    onSelectIcon(event) {
            if (event.target.files && event.target.files[0]) {
                const Name = event.target.files[0].name.split('.').pop();
                if (Name != undefined) {
                    if (Name.toLowerCase() == 'jpg' || Name.toLowerCase() == 'jpeg' || Name.toLowerCase() == 'png') {
                        const reader = new FileReader();
                        reader.onload = (event: any) => {
                            this.mainIconUrl[0]=event.target.result;
                        };
                        reader.readAsDataURL(event.target.files[0]);
                        const imgFile = new Images();
                        imgFile.file = Object.assign(event.target.files[0]);
                        this.mainIcon[0]=imgFile;
                    } else {
                        this.toastrService.error('Only jpeg,jpg and png files are allowed', 'Error');
                        return;
                    }
                }
            }
    }

    hasError(controlName: string, errorName: string): boolean {
        if (this.featureForm.controls[controlName].touched)
            return this.featureForm.controls[controlName].hasError(errorName);
    }

    ifResetRequired(index=0) {
        debugger// @ts-ignore
        if(this.featureForm?.controls?.Headings?.length) {
            // @ts-ignore
            this.featureForm.controls.Headings.controls[index].controls.file.reset();
        }
    }

    onSubmit() {
        debugger
        // if (this.featureForm.invalid) {
        //     for (const control of Object.keys(this.featureForm.controls)) {
        //         this.featureForm.controls[control].markAsTouched();
        //     }
        //     return;
        // }

        // @ts-ignore
        if (this.featureForm.controls.Headings.length != 5) {
            this.toastrService.error("Minimum 5 headings are required", "Error")
            return
        }

        if (this.mainIconUrl.length != 1) {
            this.toastrService.error("Attach Main Icon", "Error")
            return
        }

        var count = 0;
        this.imageUrl.forEach((x)=>{
            if(x!=this.noImage && x!=""){
                count++;
            }
        })
        // @ts-ignore
        if (count != this.featureForm.controls.Headings.length) {
            this.toastrService.error("Attach Icons", "Error")
            return
        }

        this.Feature = Object.assign({}, this.featureForm.value)

        this.spinner.show();

            debugger
            if (this.mainIconUrl[0].includes('base64')) {
                debugger
                this.featuresService
                 .SaveMedia(this.mainIcon[0].file, {Id: this.featureForm.controls["Id"].value==""?0:this.featureForm.controls["Id"].value,mainIcon:1})
                    .pipe(finalize(() => {
                        // this.spinner.hide();
                    }))
                    .subscribe((baseResponse) => {
                        if (baseResponse.Success) {
                            this.featureForm.controls["Id"].setValue(baseResponse.Feature.Id);
                            this.saveFeature();
                        } else {
                            this.spinner.hide();
                            // this.layoutUtilsService.alertElement(
                            //     '',
                            //     baseResponse.Message,
                            //     baseResponse.Code = null
                            // );
                        }
                    });
            }else{
                this.saveFeature();
            }



    }
    saveFeature(){
        this.Feature = Object.assign({}, this.featureForm.value)
        this.featuresService.addFeature(this.Feature)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.getFeature(true)
                } else {
                    this.toastrService.error(baseResponse.Message, 'Error');
                }
            });
    }

    removeIcon(url, val: number) {
        debugger
        // if (!url.includes('base64')) {
        //     let image: any = this.images.find(element => element.GalleryPath == url);
        //     this.spinner.show();
        //     this.genericService
        //         .DeleteMedia(image['Id'])
        //         .pipe(finalize(() => {
        //             this.spinner.hide();
        //         }))
        //         .subscribe((baseResponse) => {
        //             if (baseResponse.Success) {
        //                 this.images.splice(val, 1);
        //                 this.imageUrl.splice(val, 1);
        //                 this.toastrService.success("Deleted successfully", "Success")
        //             } else {
        //                 this.toastrService.error("Something went wrong", "Error")
        //             }
        //         });
        // } else {
            this.mainIconUrl.splice(val, 1)
            this.mainIcon.splice(val, 1);
        // }
        this.ifResetRequired(val)
    }

    removeImage(url, val: number) {
        debugger
        // if (!url.includes('base64')) {
        //     let image: any = this.images.find(element => element.GalleryPath == url);
        //     this.spinner.show();
        //     this.genericService
        //         .DeleteMedia(image['Id'])
        //         .pipe(finalize(() => {
        //             this.spinner.hide();
        //         }))
        //         .subscribe((baseResponse) => {
        //             if (baseResponse.Success) {
        //                 this.images.splice(val, 1);
        //                 this.imageUrl.splice(val, 1);
        //                 this.toastrService.success("Deleted successfully", "Success")
        //             } else {
        //                 this.toastrService.error("Something went wrong", "Error")
        //             }
        //         });
        // } else {
            this.imageUrl[val]=this.noImage;
            this.images.splice(val, 1);
        // }
        this.ifResetRequired(val)
    }

    SaveMedia() {


        if (this.currentIndex < this.images.length) {
            debugger
            // if (this.images[this.currentIndex].GalleryPath == undefined) {
                if (this.images[this.currentIndex].file!=undefined){
                this.featuresService
                    .SaveMedia(this.images[this.currentIndex].file, {Id: this.Heading[this.currentIndex].Id,mainIcon:0})
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
            this.currentIndex = 0;
            this.spinner.hide();
            this.toastrService.success("Uploaded Successfully", "Success");
            this.getFeature();
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
            Id:null,
            MainIcon:null,
            Headings: this.fb.array([]),
        });
    }

    headings(): FormArray {
        return this.featureForm.get('Headings') as FormArray;
    }

    newHeading(Id=null,FeatureId=null,Title=null,Icon=null): FormGroup {
        return this.fb.group({
            Id:Id,
            FeatureId:FeatureId,
            Title: Title,
            file:null,
            Icon:Icon,
            Details: this.fb.array([]),
        });
    }

    addHeading() {
        // @ts-ignore
        if (this.featureForm.controls.Headings.length == 5) {
            this.toastrService.error("Maximum 5 headings are required", "Error")
            return
        }

        this.headings().push(this.newHeading());
    }

    removeHeading(empIndex: number) {
        this.headings().removeAt(empIndex);
        this.imageUrl.splice(empIndex,1);
        this.images.splice(empIndex,1);
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

    drop(event: CdkDragDrop<string[]>) {
        debugger
        // @ts-ignore
        if(this.featureForm.controls["Headings"]?.controls.length>1) {
            moveItemInArray(this.featureForm.value.Headings, event.previousIndex, event.currentIndex);
            // @ts-ignore
            moveItemInArray(this.featureForm.controls["Headings"]?.controls, event.previousIndex, event.currentIndex);
        }

        const fix = this.featureForm.value.Headings;
        // fix.forEach((element,index)=>{
        //     this.headings().push(this.newHeading(element.Title));
        //     element.Details.forEach((element2)=>{
        //         this.HeadingDetails(index).push(this.newDetail(element2.Detail));
        //     })
        // })
        // this.changeDetectorRef.detectChanges();
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
