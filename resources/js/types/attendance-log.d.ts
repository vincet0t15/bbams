export interface AttendanceLog {
    id: number;
    date_time: string | null;
    check_type: number | null;
    check_type_label: string;
    user: {
        id: number;
        name: string;
        email: string;
        username: string;
        role: string | null;
    } | null;
    event: {
        id: number;
        title: string | null;
    } | null;
}
