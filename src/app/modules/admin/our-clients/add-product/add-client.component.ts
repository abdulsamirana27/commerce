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
import {ViewFileComponent} from "../../../../shared/SharedComponent/add-review/view-file.component";
import {ClientsService} from "../../../../services/clients.service";

@Component({
  selector: 'app-add-about-us',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {
    Title="Add Client"
    height
    width
    currentIndex: number = 0;
    Client:any;
    baseUrl= environment.apiUrl+"/Span/Documents/";
    ClientForm: FormGroup;
    subDesc: FormGroup;
    images: Images[] = [];
    imageUrl: any[] = [];

    constructor( private dialog: MatDialog,
                 private _formBuilder:FormBuilder,
                 private fb:FormBuilder,
                 private  clientsService:ClientsService,
                 private  genericService:GenericService,
                 private toastrService:ToastrService,
                 private spinner: NgxSpinnerService,
                 private route: ActivatedRoute,
                 private _router: Router,
    )
    { }

    ngOnInit(): void
    {
        this.clientForm();
        this.route.params.subscribe(
            params => {
               if(params['id']){
                   this.Title="Update Client"
                   this.ClientForm.controls["Id"].setValue(params['id']);
                   this.getProducts()
               }
            }
        )
    }

    clientForm(){
        this.ClientForm = this._formBuilder.group({
            Id:[null],
            Name: [null, [Validators.required]],
            Type: [2],
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
            this.toastrService.error('Maximum 1 Images is allowed', 'Error');
            return;
        }
    }

    hasError(controlName: string, errorName: string): boolean {
        if(this.ClientForm.touched)
        return this.ClientForm.controls[controlName].hasError(errorName);
    }

    ngOnDestroy(): void
    { }

    onReset() {

    }

    ifResetRequired() {
        this.ClientForm.controls['file'].reset();
    }
    onSubmit() {
        if (this.ClientForm.invalid) {
            for (const control of Object.keys(this.ClientForm.controls)) {
                this.ClientForm.controls[control].markAsTouched();
            }
            return;
        }

        if(this.images.length==0){
            this.toastrService.error("Attach atleast one image","Error")
            return
        }
        this.Client = Object.assign({},this.ClientForm.value)
        this.spinner.show();
        this.clientsService.addClient(this.images[0],this.Client)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    debugger
                    this.Client["Id"] = baseResponse.Client.Id;
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
        this.clientsService.getClients(this.ClientForm.value)
            .pipe(
                finalize(() => {
                    this.spinner.hide()
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.ClientForm.patchValue(baseResponse.Products[0]);
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
                    .SaveMedia(this.images[this.currentIndex].file, {LinkedId:this.Client.Id,Type:2})
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
            this._router.navigateByUrl("/clients");
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
