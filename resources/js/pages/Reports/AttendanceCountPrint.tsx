import PrintFooter from '@/components/print-footer';
import { Button } from '@/components/ui/button';
import { Head } from '@inertiajs/react';
import { Printer } from 'lucide-react';

interface User {
    id: number;
    name: string;
    username: string;
    role: string | null;
}

interface AttendanceRow {
    user: User;
    total_in: number;
    total_out: number;
    days_present: number;
    events: (string | null)[];
}

interface Summary {
    total_users: number;
    total_in: number;
    total_out: number;
    total_days_present: number;
}

interface AttendanceCountPrintProps {
    data: AttendanceRow[];
    summary: {
        all: Summary;
        student: Summary;
        faculty: Summary;
        staff: Summary;
    };
    filters: {
        search?: string;
        event_id?: string;
        start_date?: string;
        end_date?: string;
        role?: string;
        course_id?: string;
    };
    events: { id: number; title: string | null }[];
    courses: { id: number; name: string; code: string | null }[];
}

const ROLES = {
    student: 'Student',
    faculty: 'Faculty',
    staff: 'Staff',
};

export default function AttendanceCountPrint({
    data,
    summary,
    filters,
    events,
    courses,
}: AttendanceCountPrintProps) {
    const currentDate = new Date().toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const getRoleLabel = () => {
        if (filters.role && filters.role !== 'all') {
            return `${ROLES[filters.role as keyof typeof ROLES]} Attendance`;
        }
        return 'All Users Attendance';
    };

    const getEventLabel = () => {
        if (filters.event_id && filters.event_id !== 'all') {
            const event = events.find((e) => String(e.id) === filters.event_id);
            return event?.title || `Event #${filters.event_id}`;
        }
        return 'All Events';
    };

    const getDateRangeLabel = () => {
        if (filters.start_date && filters.end_date) {
            const start = new Date(filters.start_date).toLocaleDateString(
                'en-PH',
            );
            const end = new Date(filters.end_date).toLocaleDateString('en-PH');
            return `${start} - ${end}`;
        } else if (filters.start_date) {
            return `From ${new Date(filters.start_date).toLocaleDateString('en-PH')}`;
        } else if (filters.end_date) {
            return `Until ${new Date(filters.end_date).toLocaleDateString('en-PH')}`;
        }
        return 'All Dates';
    };

    const getCourseLabel = () => {
        if (
            filters.role === 'student' &&
            filters.course_id &&
            filters.course_id !== 'all'
        ) {
            const course = courses.find(
                (c) => String(c.id) === filters.course_id,
            );
            return course?.name || `Course #${filters.course_id}`;
        }
        return null;
    };

    const getSummaryForRole = () => {
        if (filters.role && filters.role !== 'all') {
            return summary[filters.role as keyof typeof summary];
        }
        return summary.all;
    };

    const activeSummary = getSummaryForRole();

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="attendance-count-print mx-auto min-h-screen bg-white p-4 font-sans text-[11px] leading-[1.3] text-black print:max-w-none print:p-0">
            <Head title="Attendance Count Report - Print" />

            <div className="mb-4 flex justify-end print:hidden">
                <Button onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Report
                </Button>
            </div>

            <div className="mx-auto w-[12in] print:w-full">
                <table className="w-full border-0">
                    <thead className="hidden print:table-header-group">
                        <tr>
                            <td>
                                <div className="h-[9mm]"></div>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                {/* Header */}
                                <div className="mb-5 text-center">
                                    <h2
                                        className="m-0 text-[16px] font-bold uppercase"
                                        style={{
                                            fontFamily:
                                                '"Old English Text MT", "Times New Roman", serif',
                                        }}
                                    >
                                        ATTENDANCE COUNT REPORT
                                    </h2>
                                    <p className="m-[5px_0] text-[12px]">
                                        {getRoleLabel()}
                                    </p>
                                    <p className="m-0 text-[11px]">
                                        Event: {getEventLabel()} • Period:{' '}
                                        {getDateRangeLabel()}
                                    </p>
                                    {getCourseLabel() && (
                                        <p className="m-0 text-[11px]">
                                            Program: {getCourseLabel()}
                                        </p>
                                    )}
                                    <p className="m-0 text-[10px] text-gray-500">
                                        Generated: {currentDate}
                                    </p>
                                </div>

                                {/* Summary Table */}
                                <table className="mb-6 w-full border-collapse border border-black">
                                    <tbody>
                                        <tr>
                                            <td className="border border-black p-2 font-bold">
                                                Total Users
                                            </td>
                                            <td className="border border-black p-2 text-right">
                                                {activeSummary.total_users}
                                            </td>
                                            <td className="border border-black p-2 font-bold">
                                                Total Days Present
                                            </td>
                                            <td className="border border-black p-2 text-right">
                                                {
                                                    activeSummary.total_days_present
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-black p-2 font-bold">
                                                Total IN
                                            </td>
                                            <td className="border border-black p-2 text-right">
                                                {activeSummary.total_in}
                                            </td>
                                            <td className="border border-black p-2 font-bold">
                                                Total OUT
                                            </td>
                                            <td className="border border-black p-2 text-right">
                                                {activeSummary.total_out}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Attendance Data Table */}
                                {data.length > 0 ? (
                                    <table className="w-full border-collapse border border-black">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="w-10 border border-black px-2 py-1 text-left text-[10px] font-semibold">
                                                    #
                                                </th>
                                                <th className="border border-black px-2 py-1 text-left text-[10px] font-semibold">
                                                    Name
                                                </th>
                                                <th className="border border-black px-2 py-1 text-left text-[10px] font-semibold">
                                                    Username
                                                </th>
                                                <th className="border border-black px-2 py-1 text-left text-[10px] font-semibold">
                                                    Role
                                                </th>
                                                <th className="w-16 border border-black px-2 py-1 text-center text-[10px] font-semibold">
                                                    IN
                                                </th>
                                                <th className="w-16 border border-black px-2 py-1 text-center text-[10px] font-semibold">
                                                    OUT
                                                </th>
                                                <th className="w-20 border border-black px-2 py-1 text-center text-[10px] font-semibold">
                                                    Days Present
                                                </th>
                                                <th className="border border-black px-2 py-1 text-left text-[10px] font-semibold">
                                                    Events
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((row, index) => (
                                                <tr key={row.user.id}>
                                                    <td className="border border-black px-2 py-1 text-center text-[10px]">
                                                        {index + 1}
                                                    </td>
                                                    <td className="border border-black px-2 py-1 text-[10px] font-medium uppercase">
                                                        {row.user.name}
                                                    </td>
                                                    <td className="border border-black px-2 py-1 text-[10px]">
                                                        {row.user.username}
                                                    </td>
                                                    <td className="border border-black px-2 py-1 text-[10px]">
                                                        {row.user.role || '-'}
                                                    </td>
                                                    <td className="border border-black px-2 py-1 text-center text-[10px] font-medium text-blue-600">
                                                        {row.total_in}
                                                    </td>
                                                    <td className="border border-black px-2 py-1 text-center text-[10px] font-medium text-green-600">
                                                        {row.total_out}
                                                    </td>
                                                    <td className="border border-black px-2 py-1 text-center text-[10px]">
                                                        {row.days_present}
                                                    </td>
                                                    <td className="border border-black px-2 py-1 text-[10px]">
                                                        {row.events
                                                            .filter(Boolean)
                                                            .join(', ') || '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="bg-gray-100 font-bold">
                                                <td
                                                    className="border border-black px-2 py-1 text-[10px] uppercase"
                                                    colSpan={4}
                                                >
                                                    TOTAL
                                                </td>
                                                <td className="border border-black px-2 py-1 text-center text-[10px] text-blue-600">
                                                    {activeSummary.total_in}
                                                </td>
                                                <td className="border border-black px-2 py-1 text-center text-[10px] text-green-600">
                                                    {activeSummary.total_out}
                                                </td>
                                                <td className="border border-black px-2 py-1 text-center text-[10px]">
                                                    {
                                                        activeSummary.total_days_present
                                                    }
                                                </td>
                                                <td className="border border-black px-2 py-1 text-[10px]"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="py-12 text-center text-[11px]">
                                        No attendance data found for the
                                        selected filters
                                    </div>
                                )}

                                {/* Footer */}
                                <PrintFooter />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

