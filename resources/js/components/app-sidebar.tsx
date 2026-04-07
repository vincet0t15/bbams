import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    CalendarDays,
    Trash2,
    LayoutGrid,
    Settings,
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
import { edit as editProfile } from '@/routes/profile';
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
                          },
                      ]
                    : []),
                ...(isAdmin
                    ? [
                          {
                              title: 'Attendance Logs',
                              href: '/attendance-logs',
                              icon: ClipboardList,
                          },
                      ]
                    : [
                          {
                              title: 'My Attendance Logs',
                              href: '/attendance-logs',
                              icon: ClipboardList,
                          },
                      ]),
                ...(isAdmin
                    ? [
                          {
                              title: 'DTR',
                              href: '/dtr',
                              icon: FileSpreadsheet,
                          },
                      ]
                    : [
                          {
                              title: 'My DTR',
                              href: '/my-dtr',
                              icon: FileSpreadsheet,
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
                              title: 'Courses',
                              href: courses.index.url(),
                              icon: BookOpen,
                          },
                          {
                              title: 'Year Levels',
                              href: yearLevels.index.url(),
                              icon: BookOpen,
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
                          },
                          {
                              title: 'Permissions & Roles',
                              href: '/roles',
                              icon: Shield,
                          },
                          {
                              title: 'Bin',
                              href: '/bin',
                              icon: Trash2,
                          },
                      ],
                  },
              ]
            : []),
        {
            title: 'Settings',
            children: [
                {
                    title: 'Profile',
                    href: editProfile(),
                    icon: Settings,
                },
            ],
        },
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
