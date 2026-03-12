export interface Faculty {
    id: number;
    employee_no?: string;
    department?: string;
    position?: string;
    user: { id: number; name: string; email: string; username: string };
}

export interface FacultyCreateRequest {
    name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    employee_no?: string;
    department?: string;
    position?: string;
}

export interface FacultyUpdateRequest {
    name: string;
    username: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    employee_no?: string;
    department?: string;
    position?: string;
}
