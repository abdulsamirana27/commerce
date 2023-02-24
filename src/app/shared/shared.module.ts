    import { NgModule } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { FormsModule, ReactiveFormsModule } from '@angular/forms';
    import {MatFormFieldModule} from "@angular/material/form-field";
    import {MatButtonModule} from "@angular/material/button";
    import {MatInputModule} from "@angular/material/input";
    import {MatIconModule} from "@angular/material/icon";
    import {AlphabetOnlyDirective} from "./directives/alphabet-only.directive";
    import {AlphaNumericFieldDirective} from "./directives/alpha-numeric-field.directive";
    import {NumberOnlyDirective} from "./directives/number-only.directive";
    import {DataService} from "./generic-service/data.service";
    import {HttpResponseHandler} from "./generic-service/handle-error.service";
    import {NgDirectivesModule } from "ng-directives";
    import {ViewFileComponent} from "./SharedComponent/view-file/view-file.component";
    import {MatCheckboxModule} from "@angular/material/checkbox";

    @NgModule({
        declarations:
            [
                AlphabetOnlyDirective,
                NumberOnlyDirective,
                AlphaNumericFieldDirective,
                ViewFileComponent,
            ]
        ,
        imports: [
            CommonModule,
            FormsModule,
            ReactiveFormsModule,
            MatFormFieldModule,
            MatIconModule,
            MatInputModule,
            MatButtonModule,
            NgDirectivesModule,
            MatCheckboxModule
        ],
        exports: [
            CommonModule,
            FormsModule,
            ReactiveFormsModule,
            MatFormFieldModule,
            MatIconModule,
            MatInputModule,
            MatButtonModule,
            NgDirectivesModule,
            NumberOnlyDirective,
            AlphaNumericFieldDirective,
            MatCheckboxModule

        ],
        providers:[DataService,HttpResponseHandler]
    })
    export class SharedModule
    {
    }
