import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {fromEvent} from "rxjs";

@Component({
  selector: 'app-view-file',
  templateUrl: './view-file.component.html',
  styleUrls: ['./view-file.component.scss']
})
export class ViewFileComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<ViewFileComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {

    }
url
    ngOnInit() {
        this.url =  this.data
    }

    onClose() {
    this.dialogRef.close()
    }
}
