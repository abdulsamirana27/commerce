import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {Images} from "../../../../model/images.model";
import {finalize} from "rxjs/operators";
import {ProductService} from "../../../../services/product.service";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import { GenericService } from 'app/services/generic.service';
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../../../environments/environment";
import {ViewFileComponent} from "../../../../shared/SharedComponent/view-file/view-file.component";

@Component({
  selector: 'app-add-about-us',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
    Title="Add Products"
    height
    width
    currentIndex: number = 0;
    Product:any;
    baseUrl= environment.apiUrl+"/Span/Documents/";
    ProductForm: FormGroup;
    subDesc: FormGroup;
    ProductDetailForm: FormGroup;
    images: Images[] = [];
    imageUrl: any[] = [];
    @ViewChild('TABLE') table: ElementRef;
    //@ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('MatPaginator', {static: false}) paginator: MatPaginator;

    constructor( private dialog: MatDialog,
                 private _formBuilder:FormBuilder,
                 private fb:FormBuilder,
                 private  productService:ProductService,
                 private  genericService:GenericService,
                 private toastrService:ToastrService,
                 private spinner: NgxSpinnerService,
                 private route: ActivatedRoute,
                 private _router: Router,
    )
    { }

    ngOnInit(): void
    {
        this.productForm();
        this.ProductDetailsForm();
        this.route.params.subscribe(
            params => {
               if(params['id']){
                   this.Title="Update Products"
                   this.ProductForm.controls["Id"].setValue(params['id']);
                   this.getProducts()
               }
            }
        )


    }

    productForm(){
        this.ProductForm = this._formBuilder.group({
            Id:[null],
            Name: [null, [Validators.required]],
            ShortDescription: [null, [Validators.required]],
            LongDescription: [null, [Validators.required]],
            file: [null],
            Type: [2],
        })
    }

    ProductDetailsForm(){
        this.ProductDetailForm = this.fb.group({
            ProductDetails: this.fb.array([]),
        });
    }

    onSelectFile(event) {
        debugger
        if (this.images.length < 10) {
            if (event.target.files && event.target.files[0]) {
                const Name = event.target.files[0].name.split('.').pop();
                if (Name != undefined) {
                    if (Name.toLowerCase() == 'jpg' || Name.toLowerCase() == 'jpeg' || Name.toLowerCase() == 'png') {
                        const reader = new FileReader();
                        reader.onload = (event: any) => {
                            var img = new Image();
                            img.onload = () => {
                                const width = img.width;
                                const height = img.height;
                                if(height > width || height == width){
                                this.toastrService.error('Only landscape images are allowed', 'Error');
                                return;
                                }else{
                                    this.imageUrl.push(event.target.result);
                                }
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
    onSubmit() {
        if (this.ProductForm.invalid) {
            for (const control of Object.keys(this.ProductForm.controls)) {
                this.ProductForm.controls[control].markAsTouched();
            }
            return;
        }
        if(this.images.length==0){
            this.toastrService.error("Attach atleast one image","Error")
            return
        }
        debugger
        this.Product = Object.assign({},this.ProductForm.value)
        this.spinner.show();
        this.productService.addProducts(this.Product)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    debugger
                    this.Product["Id"] = baseResponse.Product.Id;
                    this.SaveMedia()
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
        }
        this.ifResetRequired()
    }
    getProducts() {
        this.spinner.show()
        this.productService.getProducts(this.ProductForm.value)
            .pipe(
                finalize(() => {
                    this.spinner.hide()
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    debugger
                    this.ProductForm.patchValue(baseResponse.Products[0]);
                    this.ProductDetailForm.patchValue(baseResponse.Products[0].ProductDetails);
                    baseResponse.Products[0]?.GalleryDetails?.forEach((element)=>{
                        let single = element;
                        single.GalleryPath=this.baseUrl+element.GalleryPath;
                        this.images.push(element);
                        this.imageUrl.push(single.GalleryPath);
                    })
                }
            });
    }
    SaveMedia()
    {

        if (this.currentIndex < this.images.length) {
            if (this.images[this.currentIndex].GalleryPath == undefined) {
                this.genericService
                    .SaveMedia(this.images[this.currentIndex].file, {LinkedId:this.Product.Id,Type:2})
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
            this.toastrService.success("Uploaded Successfully","Success");
            this._router.navigateByUrl("/products");
        }
    }

    previewImg(url) {
        const dialogRef = this.dialog.open(ViewFileComponent, {
            width: '70%',
            height: '70%',
            data: {url: url}
        });
    }

}
