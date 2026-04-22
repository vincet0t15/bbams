export interface Student {
    id: number;
    student_no?: string;
    section?: string;
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
    course?: { id: number; name: string; code: string } | null;
    year_level?: { id: number; name: string } | null;
}

export interface StudentCreateRequest {
    last_name?: string;
    first_name?: string;
    middle_name?: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    security_question?: string;
    security_answer?: string;
    student_no?: string;
    course_id?: number | null;
    year_level_id?: number | null;
    section?: string;
}

export interface StudentUpdateRequest {
    name?: string;
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
    student_no?: string;
    course_id?: number | null;
    year_level_id?: number | null;
    section?: string;
}
