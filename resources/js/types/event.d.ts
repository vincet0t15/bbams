export interface Event {
    id: number;
    title: string;
    location: string | null;
    description: string | null;
    start_at: string | null;
    end_at: string | null;
    created_by: number | null;
}

export interface EventUpsertRequest {
    title: string;
    location?: string;
    description?: string;
    start_at: string;
    end_at?: string;
}
