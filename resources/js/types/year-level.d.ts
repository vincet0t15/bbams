export interface YearLevel {
    id: number;
    name: string;
    description?: string;
}

export interface YearLevelCreateRequest {
    name: string;
    description?: string;
}
