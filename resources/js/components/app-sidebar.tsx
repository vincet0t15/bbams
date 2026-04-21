import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    CalendarDays,
    Trash2,
    LayoutGrid,
    Shield,
    Users,
    ClipboardList,
    FileSpreadsheet,
    FileText,
    ListOrdered,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import courses from '@/routes/courses';
import { index as usersIndex } from '@/routes/users';
import yearLevels from '@/routes/year-levels';
import type { NavGroup } from '@/types';

export function AppSidebar() {
    const { props } = usePage();

    // Get user account type
    const accountType = (props as any)?.auth?.user?.account_type;

    // Check if user is admin
    const isAdmin = accountType === 'admin';

    // Check if user is student, faculty, or staff
    const isStudent = accountType === 'student';
    const isFaculty = accountType === 'faculty';
    const isStaff = accountType === 'staff';
    const isRegularUser = isStudent || isFaculty || isStaff;

    const mainNavItems: NavGroup[] = [
        {
            title: 'Overview',
            children: [
                {
                    title: 'Dashboard',
                    href: dashboard(),
                    icon: LayoutGrid,
                    color: 'text-sky-500',
                },
            ],
        },
        {
            title: 'Attendance',
            children: [
                ...(isAdmin
                    ? [
                          {
                              title: 'Events',
                              href: '/events',
                              icon: CalendarDays,
                              color: 'text-amber-500',
                          },
                      ]
                    : []),
                ...(isAdmin
                    ? [
                          {
                              title: 'Attendance Logs',
                              href: '/attendance-logs',
                              icon: ClipboardList,
                              color: 'text-emerald-500',
                          },
                      ]
                    : [
                          {
                              title: 'My Attendance Logs',
                              href: '/attendance-logs',
                              icon: ClipboardList,
                              color: 'text-emerald-500',
                          },
                      ]),
                ...(isAdmin
                    ? [
                          {
                              title: 'DTR',
                              href: '/dtr',
                              icon: FileSpreadsheet,
                              color: 'text-cyan-500',
                          },
                      ]
                    : [
                          {
                              title: 'My DTR',
                              href: '/my-dtr',
                              icon: FileSpreadsheet,
                              color: 'text-cyan-500',
                          },
                      ]),
            ],
        },
        {
            title: 'Reports',
            children: [
                // {
                //     title: 'Attendance Report',
                //     href: '/reports/attendance',
                //     icon: FileText,
                // },
                ...(isAdmin
                    ? [
                          {
                              title: 'Attendance Count',
                              href: '/reports/attendance-count',
                              icon: ListOrdered,
                              color: 'text-indigo-500',
                          },
                      ]
                    : []),
            ],
        },
        // Only show Academic Setup for admin users
        ...(isAdmin
            ? [
                  {
                      title: 'Academic Setup',
                      children: [
                          {
                              title: 'Programs',
                              href: courses.index.url(),
                              icon: BookOpen,
                              color: 'text-amber-500',
                          },
                          {
                              title: 'Year Levels',
                              href: yearLevels.index.url(),
                              icon: BookOpen,
                              color: 'text-amber-500',
                          },
                      ],
                  },
              ]
            : []),
        {
            title: 'Directory',
            children: [
                // Show Students only for admin users
                ...(isAdmin
                    ? [
                          {
                              title: 'Students',
                              href: '/students',
                              icon: Users,
                              color: 'text-emerald-500',
                          },
                      ]
                    : []),
                // Show Faculty only for admin users
                ...(isAdmin
                    ? [
                          {
                              title: 'Faculty',
                              href: '/faculties',
                              icon: Users,
                              color: 'text-amber-500',
                          },
                      ]
                    : []),
                // Show Staff only for admin users
                ...(isAdmin
                    ? [
                          {
                              title: 'Staff',
                              href: '/staff',
                              icon: Users,
                              color: 'text-cyan-500',
                          },
                      ]
                    : []),
            ],
        },
        // Only show Administration for admin users
        ...(isAdmin
            ? [
                  {
                      title: 'Administration',
                      children: [
                          {
                              title: 'Accounts',
                              href: usersIndex.url(),
                              icon: Users,
                              color: 'text-violet-500',
                          },
                          {
                              title: 'Bin',
                              href: '/bin',
                              icon: Trash2,
                              color: 'text-rose-500',
                          },
                      ],
                  },
              ]
            : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <div className="relative flex h-full w-full flex-col overflow-hidden rounded-sm">
                <div className="relative z-10 flex h-full w-full flex-col">
                    <SidebarHeader>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    size="lg"
                                    className="h-auto py-3"
                                    asChild
                                >
                                    <Link href={dashboard()} prefetch>
                                        <AppLogo />
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarHeader>

                    <SidebarContent>
                        <NavMain items={mainNavItems} />
                    </SidebarContent>

                    <SidebarFooter>
                        <NavUser />
                    </SidebarFooter>
                </div>
            </div>
        </Sidebar>
    );
}
