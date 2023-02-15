import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
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

@Component({
  selector: 'app-add-about-us',
  templateUrl: './add-about-us.component.html',
  styleUrls: ['./add-about-us.component.scss']
})
export class AddAboutUsComponent implements OnInit {

    currentIndex: number = 0;
    baseUrl= environment.apiUrl+"/Span/Documents/";
    AboutUsForm: FormGroup;
    subDesc: FormGroup;
    ProductDetailForm: FormGroup;
    images: Images[] = [];
    imageUrl: any[] = [];
    dataSource = new MatTableDataSource();
    @ViewChild('TABLE') table: ElementRef;
    //@ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('MatPaginator', {static: false}) paginator: MatPaginator;

    constructor( private dialog: MatDialog,
                 private _formBuilder:FormBuilder,
                 private fb:FormBuilder,
                 private  productService:ProductService,
                 private toastrService:ToastrService,
                 private spinner: NgxSpinnerService,
                 private route:ActivatedRoute,
                 private _router:Router,
                 private genericService:GenericService
    )
    { }


    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit(): void
    {
        this.createForm();
        this.ProductDetailsForm();
        this.getProducts();

    }
    getProducts() {
        this.spinner.show()
        this.productService.getProducts(this.AboutUsForm.value)
            .pipe(
                finalize(() => {
                    this.spinner.hide()
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    debugger
                    this.AboutUsForm.patchValue(baseResponse.Products[0]);
                    baseResponse?.Products[0]?.ProductDetails?.forEach((element)=>{
                        this.ProductDetails().push(this.newProductDetails(element.Title,element.Description));
                    })
                    baseResponse.Products[0]?.GalleryDetails?.forEach((element)=>{
                        let single = element;
                        single.GalleryPath=this.baseUrl+element.GalleryPath;
                        this.images.push(element);
                        this.imageUrl.push(single.GalleryPath);
                    })
                }
            });
    }

    createForm(){
        this.AboutUsForm = this._formBuilder.group({
            Id:[null],
            Name: [null, [Validators.required]],
            ShortDescription: [null, [Validators.required]],
            LongDescription: [null, [Validators.required]],
            file: [null],
            Type: [3],
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
        if(this.AboutUsForm.controls[controlName].touched)
        return this.AboutUsForm.controls[controlName].hasError(errorName);
    }

    ifResetRequired() {
        this.AboutUsForm.controls['file'].reset();
    }
    Product:any;
    onSubmit() {
        if (this.AboutUsForm.invalid) {
            for (const control of Object.keys(this.AboutUsForm.controls)) {
                this.AboutUsForm.controls[control].markAsTouched();
            }
            return;
        }
        if(this.images.length==0){
            this.toastrService.error("Attach atleast one image","Error")
            return
        }
        this.Product = Object.assign({},this.AboutUsForm.value)
        // if(!(this.ProductDetailForm.get('Title')==null || this.ProductDetailForm.get('Description')==null))
        this.Product["ProductDetails"]=Object.assign(this.ProductDetailForm.value.ProductDetails)
        this.spinner.show();
        this.productService.addProducts(this.Product)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.Product["Id"] = baseResponse.Product.Id;
                    this.SaveMedia()
                } else {
                    this.toastrService.error(baseResponse.Message, 'Error');
                }
            });

    }
//Add sub-description

    ProductDetails(): FormArray {
        return this.ProductDetailForm.get('ProductDetails') as FormArray;
    }

    newProductDetails(Title='',Description=''): FormGroup {
        return this.fb.group({
            Title: Title,
            Description: Description,
        });
    }

    addProductDetails() {
        this.ProductDetails().push(this.newProductDetails());
    }

    removeProductDetails(empIndex: number) {
        this.ProductDetails().removeAt(empIndex);
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
            this.images.splice(val, 1);;
        }
        this.ifResetRequired()
    }
    SaveMedia()
    {


        if (this.currentIndex < this.images.length) {
            if (this.images[this.currentIndex].GalleryPath == undefined) {
                this.genericService
                    .SaveMedia(this.images[this.currentIndex].file, {LinkedId:this.Product.Id,Type:3})
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
