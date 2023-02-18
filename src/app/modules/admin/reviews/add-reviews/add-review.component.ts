import {Component,  OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
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

@Component({
  selector: 'app-add-company-detail',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.scss']
})
export class AddReviewComponent implements OnInit {
    Title="Add Review"
    height
    width
    currentIndex: number = 0;
    Review:any;
    baseUrl= environment.apiUrl+"/Span/Documents/";
    ReviewForm: FormGroup;
    subDesc: FormGroup;
    images: Images[] = [];
    imageUrl: any[] = [];

    constructor( private dialog: MatDialog,
                 private _formBuilder:FormBuilder,
                 private fb:FormBuilder,
                 private  genericService:GenericService,
                 private  reviewService:ReviewService,
                 private toastrService:ToastrService,
                 private spinner: NgxSpinnerService,
                 private route: ActivatedRoute,
                 private _router: Router,
    )
    { }

    ngOnInit(): void
    {debugger
        this.reviewForm();
        this.route.params.subscribe(
            params => {
               if(params['id']){
                   this.Title="Update Review"
                   this.ReviewForm.controls["Id"].setValue(params['id']);
                   this.getReview()
               }
            }
        )
    }

    reviewForm(){
        this.ReviewForm = this._formBuilder.group({
            Id:[null],
            ClientName: [null, [Validators.required]],
            ShortReview: [null, [Validators.required]],
            DetailedReview: [null, [Validators.required]],
            file:[null],
        })
    }

    onSelectFile(event) {
        debugger
        if (this.images.length < 1) {
            if (event.target.files && event.target.files[0]) {
                const Name = event.target.files[0].name.split('.').pop();
                if (Name != undefined) {
                    if (Name.toLowerCase() == 'jpg' || Name.toLowerCase() == 'jpeg' || Name.toLowerCase() == 'png') {
                        const reader = new FileReader();
                        reader.onload = (event: any) => {
                            var img = new Image();
                            img.onload = () => {
                                // const width = img.width;
                                // const height = img.height;
                                // if(height > width || height == width){
                                // this.toastrService.error('Only landscape images are allowed', 'Error');
                                // return;
                                // }else{
                                    this.imageUrl.push(event.target.result);

                                // }
                            };
                            // @ts-ignore
                            img.src = reader.result;
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
            this.toastrService.error('Maximum 1 Images is allowed', 'Error');
            return;
        }
    }

    hasError(controlName: string, errorName: string): boolean {
        debugger
        if(this.ReviewForm.controls[controlName].touched)
        return this.ReviewForm.controls[controlName].hasError(errorName);
    }

    ngOnDestroy(): void
    { }

    onReset() {

    }

    ifResetRequired() {
        this.ReviewForm.controls['file'].reset();
    }
    onSubmit() {
        if (this.ReviewForm.invalid) {
            for (const control of Object.keys(this.ReviewForm.controls)) {
                this.ReviewForm.controls[control].markAsTouched();
            }
            return;
        }

        if(this.images.length==0){
            this.toastrService.error("Attach atleast one image","Error")
            return
        }
        this.Review = Object.assign({},this.ReviewForm.value)
        this.spinner.show();
        this.reviewService.addReview(this.images[0].file,this.Review)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.toastrService.success("Uploaded Successfully","Success");
                    this._router.navigateByUrl("/reviews");
                } else {
                    this.toastrService.error(baseResponse.Message, 'Error');
                }
            });

    }

    removeImage(url, val: number) {
        debugger
        if (!url.includes('base64')) {
            let image:any = this.images.find(element => element.GalleryPath == url);
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
                        this.toastrService.success("Deleted successfully","Success")
                    } else {
                        this.toastrService.error("Something went wrong","Error")
                    }
                });
        } else {
            this.imageUrl.splice(val,1)
            this.images.splice(val, 1);
        }
        this.ifResetRequired()
    }
    getReview() {
        this.spinner.show()
        this.reviewService.getReviews(this.ReviewForm.value)
            .pipe(
                finalize(() => {
                    this.spinner.hide()
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.ReviewForm.patchValue(baseResponse.Reviews[0]);
                    baseResponse.Reviews?.forEach((element)=>{
                        let single = element;
                        if(single.ClientImage!="") {
                            single.ClientImage = this.baseUrl + element.ClientImage;
                            this.images.push(element);
                            this.imageUrl.push(single.ClientImage);
                        }
                    })
                }
            });
    }
    previewImg(url) {
        const dialogRef = this.dialog.open(ViewFileComponent, {
            width: '70%',
            height: '70%',
            data: {url: url}
        });
    }

}
