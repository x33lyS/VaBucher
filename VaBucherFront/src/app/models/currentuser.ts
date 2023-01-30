export class CurrentUser {
    id!: number;
    firstname!: string;
    lastname!: string;
    location: string | null | undefined;
    search: string | null | undefined;
    role!: number;
    cv: string | null | undefined;
    email!: string;
    phone: string | null | undefined;
}
