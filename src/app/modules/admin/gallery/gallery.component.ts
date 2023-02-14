import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {finalize} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ViewFileComponent} from "../../../shared/SharedComponent/view-file/view-file.component";
import {GalleryService} from "./gallery.service";
import { environment } from 'environments/environment';
import {ToastrService} from "ngx-toastr";
import {GenericService} from "../../../services/generic.service";


@Component({
    selector       : 'gallery',
    templateUrl    : './gallery.component.html',
    styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnDestroy
{
    GalleryForm: FormGroup;
    imageUrl: any[] = [];
    visible: any = true;
    baseUrl= environment.apiUrl+"/Span/Documents/";
    dataSource = new MatTableDataSource();
    @ViewChild('TABLE') table: ElementRef;
    //@ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('MatPaginator', {static: false}) paginator: MatPaginator;

    constructor(
        private dialogRef: MatDialog,
        private toastrService:ToastrService,
        private spinner: NgxSpinnerService,
        private _formBuilder:FormBuilder,
        private dialog: MatDialog,
        private galleryService: GalleryService,
        private genericService: GenericService,
                 )
    { }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit(): void
    {  this.createForm();
        this.getGellery();


    }
    createForm(){
        this.GalleryForm = this._formBuilder.group({
            Type: [4],
        })
    }

    getGellery() {
        this.spinner.show()
        this.galleryService.getGallery(this.GalleryForm.value)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                   this.imageUrl = baseResponse.GalleryData;
                    // this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
                } else {
                    // this.layoutUtilsService.alertElement("", baseResponse.Message);
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

    removeImage(val,id) {
        debugger
        this.spinner.show()
        this.genericService.DeleteMedia(id)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.imageUrl.splice(val, 1);
                    this.toastrService.success("Deleted Successfully","Success")
                } else {
                    this.toastrService.error("Something went wrong","Error")
                }
            });
    }


    // deleteData(id: string, val: number, isVideo: boolean) {
    //
    //     this.spinner.show();
    //     this._loanutilization
    //         .DeleteMedia(id)
    //         .pipe(finalize(() => {
    //             this.spinner.hide();
    //         }))
    //         .subscribe((baseResponse) => {
    //             if (baseResponse.Success) {
    //
    //                 this.isEmpty = true;
    //
    //                     this.images.splice(val, 1);
    //                     this.imageUrl.splice(val, 1);
    //
    //
    //             } else {
    //                 this.layoutUtilsService.alertElement(
    //                     '',
    //                     baseResponse.Message,
    //                     baseResponse.Code = null
    //                 );
    //             }
    //         });
    //
    // }
    ngOnDestroy(): void
    { }

}
