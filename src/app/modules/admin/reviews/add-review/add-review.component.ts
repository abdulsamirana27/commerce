import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.scss']
})
export class AddReviewComponent implements OnInit {
    addReviewForm: FormGroup;

  constructor(
      private dialogRef: MatDialogRef<AddReviewComponent>,
      private _formBuilder:FormBuilder) { }

  ngOnInit(): void {
      this.review();
  }

    onClose() {
        this.dialogRef.close(true);
    }

    review(){
        this.addReviewForm = this._formBuilder.group({
            QUESTIONS: ['', [Validators.required]],
            QUES_SEQUENCE: ['', [Validators.required]],
        })
    }

    onReset() {

    }

    onSubmit() {

    }
}
