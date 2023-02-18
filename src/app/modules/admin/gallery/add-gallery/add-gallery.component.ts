import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Images} from "../../../../model/images.model";
import {finalize} from "rxjs/operators";
import {ProductService} from "../../../../services/product.service";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {GalleryService} from "../gallery.service";
import {GenericService} from "../../../../services/generic.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-company-detail',
  templateUrl: './add-gallery.component.html',
  styleUrls: ['./add-gallery.component.scss']
})
export class AddGalleryComponent implements OnInit {

    Product:any;
    ProductForm: FormGroup;
    subDesc: FormGroup;
    ProductDetailForm: FormGroup;
    images: Images[] = [];
    imageUrl: any[] = [];
    currentIndex: number = 0;
    dataSource = new MatTableDataSource();
    @ViewChild('TABLE') table: ElementRef;
    //@ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('MatPaginator', {static: false}) paginator: MatPaginator;

    constructor( private dialogRef: MatDialog,
                 private _formBuilder:FormBuilder,
                 private fb:FormBuilder,
                 private  productService:ProductService,
                 private toastrService:ToastrService,
                 private spinner: NgxSpinnerService,
                 private galleryService:GalleryService,
                 private genericService:GenericService,
                 private _router:Router
    )
    { }


    ngOnInit(): void
    {
        this.review();
        this.ProductDetailsForm();

    }


    review(){
        this.ProductForm = this._formBuilder.group({
            Name: [null, [Validators.required]],
            ShortDescription: [null, [Validators.required]],
            LongDescription: [null, [Validators.required]],
            file: [null],
        })
    }

    ProductDetailsForm(){
        this.ProductDetailForm = this.fb.group({
            ProductDetails: this.fb.array([]),
        });
    }

    onSelectFile(event) {
        if (this.images.length < 10) {
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
            this.toastrService.error('Maximum 10 Images are allowed', 'Error');
            return;
        }
    }

    hasError(controlName: string, errorName: string): boolean {
        if(this.ProductForm.controls[controlName].touched)
        return this.ProductForm.controls[controlName].hasError(errorName);
    }

    ngOnDestroy(): void
    { }

    onReset() {

    }

    ifResetRequired() {
        this.ProductForm.controls['file'].reset();
    }

    removeImage(url, val: number) {
        this.imageUrl.splice(val,1);
        this.ifResetRequired()
    }


    onSubmit()
        {
            if(this.images.length==0){
                this.toastrService.error("Attach atleast one image","Error")
                return
            }

            if (this.currentIndex < this.images.length) {
                if (this.images[this.currentIndex].GalleryPath == undefined) {
                    this.genericService
                        .SaveMedia(this.images[this.currentIndex].file, {LinkedId:0,Type:4})
                        .pipe(finalize(() => {
                            // this.spinner.hide();
                        }))
                        .subscribe((baseResponse) => {
                            if (baseResponse.Success) {
                                this.currentIndex++;
                                this.onSubmit();
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
                    this.onSubmit();
                }
            } else {
                this.spinner.hide()
                this.toastrService.success("Uploaded Successfully","Success");
                this._router.navigateByUrl("/gallery");
            }
        }
}
