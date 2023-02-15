export interface Notification
{
    id: string;
    icon?: string;
    image?: string;
    title?: string;
    description?: string;
    time: string;
    link?: string;
    useRouter?: boolean;
    read: boolean;
//custom
    Id:string;
    Name:string;
    Message:string;
    ResponseStatus:string;
}
