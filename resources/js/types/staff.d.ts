export interface Staff {
    id: number;
    employee_no?: string;
    department?: string;
    position?: string;
    user: { id: number; name: string; email: string; username: string };
}

export interface StaffCreateRequest {
    user_id: number;
    employee_no?: string;
    department?: string;
    position?: string;
}
