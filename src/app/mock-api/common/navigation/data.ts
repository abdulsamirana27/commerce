/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
            {
                id   : 'dashboard',
                title: 'Dashboard',
                type : 'basic',
                icon : 'heroicons_outline:home',
                link : '/dashboard'
            }, {
        id   : 'products',
        title: 'Products',
        type : 'basic',
        icon : 'heroicons_outline:shopping-bag',
            link : '/products'
    },
    {
        id   : 'projects',
        title: 'Projects',
        type : 'basic',
        icon : 'heroicons_outline:briefcase',
        link : '/projects'
    },
    {
        id   : 'ourClient',
        title: 'Our Client',
        type : 'basic',
        icon : 'heroicons_outline:users',
        link : '/clients'
    },
    {
        id   : 'about us',
        title: 'About Us',
        type : 'basic',
        icon : 'heroicons_outline:document-duplicate',
        link : '/about-us/add'
    },
    {
        id   : 'gallery',
        title: 'Gallery',
        type : 'basic',
        icon : 'heroicons_outline:photograph',
        link : '/gallery'
    },

    // {
    //     id   : 'users',
    //     title: 'User',
    //     type : 'basic',
    //     icon : 'heroicons_outline:users',
    //     link : '/users'
    // },

    {
        id   : 'reviews',
        title: 'Reviews',
        type : 'basic',
        icon : 'heroicons_outline:star',
        link : '/reviews'
    },
];
export const compactNavigation: FuseNavigationItem[] = [

];
export const futuristicNavigation: FuseNavigationItem[] = [

];
export const horizontalNavigation: FuseNavigationItem[] = [

];
