export interface Course {
    id: number;
    name: string;
    code: string;
    description: string;
    created_by: number;

}
export interface CourseCreateRequest {
    name: string;
    code: string;
    description?: string;
}
