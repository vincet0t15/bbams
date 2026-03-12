export interface YearLevel {
    id: number;
    name: string;
    description?: string;
    course: { id: number; name: string; code: string };
}

export interface YearLevelCreateRequest {
    course_id: number;
    name: string;
    description?: string;
}
