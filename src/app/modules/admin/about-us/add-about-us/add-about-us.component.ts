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

@Component({
  selector: 'app-add-about-us',
  templateUrl: './add-about-us.component.html',
  styleUrls: ['./add-about-us.component.scss']
})
export class AddAboutUsComponent implements OnInit {
    ProductForm: FormGroup;
    subDesc: FormGroup;
    ProductDetailForm: FormGroup;
    images: Images[] = [];
    imageUrl: any[] = [];
    dataSource = new MatTableDataSource();
    @ViewChild('TABLE') table: ElementRef;
    //@ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('MatPaginator', {static: false}) paginator: MatPaginator;

    constructor( private dialogRef: MatDialog,
                 private _formBuilder:FormBuilder,
                 private fb:FormBuilder,
                 private  productService:ProductService,
                 private toastrService:ToastrService,
                 private spinner: NgxSpinnerService
    )
    { }


    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit(): void
    {
        this.review();
        this.ProductDetailsForm();
        this.addProductDetails();

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
        if(this.ProductForm.touched)
        return this.ProductForm.controls[controlName].hasError(errorName);
    }

    ngOnDestroy(): void
    { }

    onReset() {

    }

    ifResetRequired() {
        this.ProductForm.controls['file'].reset();
    }
    Product:any;
    onSubmit() {
        // if (this.ProductForm.invalid) {
        //     for (const control of Object.keys(this.ProductForm.controls)) {
        //         this.ProductForm.controls[control].markAsTouched();
        //     }
        //     return;
        // }
        debugger
        this.Product = Object.assign({},this.ProductForm.value)
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
                    this.dataSource = baseResponse.Products;
                    this.toastrService.success(baseResponse.Message, 'Success');
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

    patch() {
        const sam = {
            ProductDetails: [
                {
                    sub_title: 'sam',
                    sub_description: 'sam',
                },
                {
                    sub_title: 'sssss',
                    sub_description: 'sam',
                },
                {
                    sub_title: 'sssss',
                    sub_description: 'sam',
                },
            ],
        };
        sam.ProductDetails.forEach((element)=>{
            this.ProductDetails().push(this.newProductDetails(element.sub_title,element.sub_description));
        })

    }

}
