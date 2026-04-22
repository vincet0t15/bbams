export interface Faculty {
    id: number;
    employee_no?: string;
    department?: string;
    position?: string;
    user: {
        id: number;
        name: string;
        email: string;
        username: string;
        last_name?: string | null;
        first_name?: string | null;
        middle_name?: string | null;
        extension_name?: string | null;
        security_question?: string | null;
        security_answer?: string | null;
    };
}

export interface FacultyCreateRequest {
    last_name?: string;
    first_name?: string;
    middle_name?: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    security_question?: string;
    security_answer?: string;
    employee_no?: string;
    department?: string;
    position?: string;
}

export interface FacultyUpdateRequest {
    name: string;
    last_name?: string;
    first_name?: string;
    middle_name?: string;
    extension_name?: string;
    security_question?: string;
    security_answer?: string;
    username: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    employee_no?: string;
    department?: string;
    position?: string;
}
