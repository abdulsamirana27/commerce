import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
    selector       : 'users',
    templateUrl    : './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy, AfterViewInit
{
    displayedColumns: string[] =
        [
            'name',
            'email',
            'number',
            'date',
            'active',
            'action',
        ];
    dataSource = new MatTableDataSource();
    @ViewChild('TABLE') table: ElementRef;
    //@ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('MatPaginator', {static: false}) paginator: MatPaginator;

    constructor()
    {}

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit(): void
    {}

    ngOnDestroy(): void
    { }

    delete() {

    }

    update() {

    }
}
