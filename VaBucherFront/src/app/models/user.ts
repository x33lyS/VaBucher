export class User {
    id!: number;
    firstname!: string;
    lastname!: string;
    password!: string;
    location: string | null | undefined;
    domain: string | null | undefined;
    jobtype: string | null | undefined;
    role!: number;
    cv: string | null | undefined;
    email!: string;
    phone: string | null | undefined;
    state = "";
}
