import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {finalize} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ReviewService} from "../../../services/review.service";
import {ToastrService} from "ngx-toastr";


@Component({
    selector       : 'reviews',
    templateUrl    : './reviews.component.html',
    styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit, OnDestroy
{
    ReviewForm: FormGroup;
    products:any;
    displayedColumns: string[] =
        [
            'index',
            'ClientName',
            'ShortReview',
            'DetailedReview',
            'action',
        ];
    dataSource;
    @ViewChild('TABLE') table: ElementRef;
    //@ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('MatPaginator', {static: false}) paginator: MatPaginator;

    constructor(
        private dialogRef: MatDialog,
        private reviewService: ReviewService,
        private toastrService: ToastrService,
        private spinner: NgxSpinnerService,
        private _formBuilder:FormBuilder,
                 )
    { }

    // ngAfterViewInit(): void {
    //     this.dataSource.paginator = this.paginator;
    // }

    ngOnInit(): void
    {
        this.createForm()
        this.getReview();

    }

    createForm(){
        this.ReviewForm = this._formBuilder.group({
            ClientName: [null],
        })
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
                    this.dataSource = baseResponse.Reviews;
                }else{
                    this.dataSource=[];
                }
            });
    }

    ngOnDestroy(): void
    { }

    delete(data) {
        debugger
        this.spinner.show()
        this.reviewService.deleteReview(data)
            .pipe(
                finalize(() => {
                    this.spinner.hide()
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.toastrService.success("Deleted successfully","Success")
                    this.getReview()
                } else {

                    this.toastrService.error("Something went wrong","Error")
                }
            });
    }

    update() {

    }
}
