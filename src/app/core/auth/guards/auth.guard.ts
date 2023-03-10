import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate
{
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can activate
     *
     * @param route
     * @param state
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
    {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(redirectUrl);
    }

    /**
     * Can activate child
     *
     * @param childRoute
     * @param state
     */
    // canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    // {
    //     debugger
    //     const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
    //
    //     return this._check(redirectUrl);
    // }

    /**
     * Can load
     *
     * @param route
     * @param segments
     */
    // canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean
    // {
    //     return this._check('/');
    // }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Check the authenticated status
     *
     * @param redirectURL
     * @private
     */
    private _check(redirectURL: string): Observable<boolean>
    {
        debugger
        // Check the authentication status
        return this._authService.check()
                   .pipe(
                       switchMap((authenticated) => {

                           // If the user is not authenticated...
                           if ( !authenticated )
                           {
                               debugger
                               // Redirect to the sign-in page
                               this._router.navigate(['sign-in'], {queryParams: {redirectURL}});

                               // Prevent the access
                               return of(false);
                           }

                           // Allow the access
                           return of(true);
                       })
                   );



        //
        // if (redirectURL.includes('/') && !(localStorage.getItem("user"))){
        //      this._router.navigateByUrl("/sign-in");
        //     return of(true);
        // }
        //
        // if (redirectURL.includes('/') && (localStorage.getItem("user"))){
        //     this._router.navigateByUrl("/products");
        //     return of(true);
        // }
        //
        // if(localStorage.getItem("user")){
        //     if (redirectURL.includes('sign-in')) {
        //         // this._router.navigateByUrl("/products");
        //         return of(false);
        //     }
        //     return of(true);
        // }
        //
        // return of(false);

    }
}
