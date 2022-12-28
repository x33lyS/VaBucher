export class User {
    id!: number;
    firstName!: string;
    lastName!: string;
    password!: string;
    location: string | null | undefined;
    search: string | null | undefined;
    role!: number;
    cv: string | null | undefined;
    email!: string;
    phone: string | null | undefined;
}
