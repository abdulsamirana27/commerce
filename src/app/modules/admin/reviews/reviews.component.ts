import { Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AddReviewComponent} from "./add-review/add-review.component";


@Component({
    selector       : 'reviews',
    templateUrl    : './reviews.component.html',
    styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit, OnDestroy
{
    data:any;
stars:any;

    constructor( private dialogRef: MatDialog,)
    { }

    ngOnInit(): void
    {}

    ngOnDestroy(): void
    {}

    onAddReview() {
        const dialog = this.dialogRef.open(AddReviewComponent, {
            width: '50%',
            //data: user
        })
        dialog.afterClosed().pipe().subscribe(value => {

            if (!value) {

            }
        })
    }
}
