import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import {finalize} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../core/user/user.service";

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    styleUrls:['sign-in.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignInComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _userService: UserService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private toastrService:ToastrService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.signInForm = this._formBuilder.group({
            UserName     : ['admin123', [Validators.required]],
            Password  : ['12345678', Validators.required],
            rememberMe: ['']
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void
    {
        // Return if the form is invalid
        if ( this.signInForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.Login(this.signInForm.value)
            .pipe(
                finalize(() => {
                    // this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {
                debugger
                if (baseResponse.Success) {
                    debugger
                    this._authService.accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzYwMDgyMDcsImlzcyI6IkZ1c2UiLCJleHAiOjE2NzY2MTMwMDd9.v3iGpBajnEJaj-V_c-0uqMOqmE5fLApDAswnIh-IOSA";
                    this._authService._authenticated = true;
                    localStorage.setItem("user",JSON.stringify(baseResponse.User))
                    this._userService.user = baseResponse.User;
                    // const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

                    // Navigate to the redirect url
                    this._router.navigateByUrl("/products");
                    this.toastrService.success(baseResponse.Message, 'Success');
                } else {

                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    // this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'Wrong email or password'
                    };

                    // Show the alert
                    this.showAlert = true;
                    this.toastrService.error(baseResponse.Message, 'Error');
                }
            },(res)=>{
                this.signInForm.enable();

                // Reset the form
                // this.signInNgForm.resetForm();

                // Set the alert
                this.alert = {
                    type   : 'error',
                    message: 'Something Went Wrong'
                };

                // Show the alert
                this.showAlert = true;
            });


    }
}
