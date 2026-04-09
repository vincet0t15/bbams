import { Head, router, useForm } from '@inertiajs/react';
import Pagination from '@/components/paginationData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import users from '@/routes/users';
import type { BreadcrumbItem } from '@/types';
import type { FilterProps } from '@/types/filter';
import type { PaginatedDataResponse } from '@/types/pagination';

type AccountRow = {
    id: number;
    name: string;
    username: string;
    email: string;
    is_active: boolean;
    account_type: string;
};

type Props = {
    userList: PaginatedDataResponse<AccountRow>;
    filters: FilterProps;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accounts',
        href: users.index.url(),
    },
];

export default function AccountsIndex({ userList, filters }: Props) {
    const { data, setData } = useForm({
        search: filters.search || '',
    });

    const buildQuery = (values: { search: string }) => {
        const query: Record<string, string> = {};

        if (values.search) {
            query.search = values.search;
        }

        return Object.keys(query).length ? query : undefined;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Accounts" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                        Accounts ({userList.total})
                    </div>

                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Search..."
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key !== 'Enter') {
                                    return;
                                }

                                router.get(
                                    users.index.url(),
                                    buildQuery(data),
                                    {
                                        preserveState: true,
                                        preserveScroll: true,
                                    },
                                );
                            }}
                        />
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.get(
                                    users.index.url(),
                                    buildQuery(data),
                                    {
                                        preserveScroll: true,
                                        preserveState: true,
                                    },
                                )
                            }
                        >
                            Search
                        </Button>
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="font-bold text-primary">
                                    Name
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Username
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Email
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Status
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Account Type
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userList.data.length ? (
                                userList.data.map((user) => (
                                    <TableRow key={user.id} className="text-sm">
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    user.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {user.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {user.account_type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant={
                                                        user.is_active
                                                            ? 'outline'
                                                            : 'default'
                                                    }
                                                    onClick={() =>
                                                        router.put(
                                                            users.toggleStatus.url(
                                                                user.id,
                                                            ),
                                                            {},
                                                            {
                                                                preserveScroll: true,
                                                                preserveState: true,
                                                            },
                                                        )
                                                    }
                                                >
                                                    {user.is_active
                                                        ? 'Deactivate'
                                                        : 'Activate'}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="py-3 text-center text-gray-500"
                                    >
                                        No accounts found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div>
                    <Pagination data={userList} />
                </div>
            </div>
        </AppLayout>
    );
}
