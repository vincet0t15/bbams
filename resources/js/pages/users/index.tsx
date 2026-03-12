import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, User } from '@/types';
import type { PaginatedDataResponse } from '@/types/pagination';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accounts',
        href: '/users',
    },
];

interface Props {
    userList: PaginatedDataResponse<User>;
}
export default function UsersIndex({ userList }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Accounts" />
            <div className="p-4">Accounts ({userList.total})</div>
        </AppLayout>
    );
}
