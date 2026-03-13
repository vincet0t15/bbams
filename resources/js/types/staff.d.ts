export interface Staff {
    id: number;
    employee_no?: string;
    department?: string;
    position?: string;
    user: { id: number; name: string; email: string; username: string };
}

export interface StaffCreateRequest {
    last_name?: string;
    first_name?: string;
    middle_name?: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    employee_no?: string;
    department?: string;
    position?: string;
}

export interface StaffUpdateRequest {
    name: string;
    username: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    employee_no?: string;
    department?: string;
    position?: string;
}
