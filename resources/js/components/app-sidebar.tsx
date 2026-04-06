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

    // Get user permissions
    const userPermissions = (props as any)?.auth?.permissions || [];

    // Permission checks
    const canViewEvents = userPermissions.includes('events.view');
    const canViewAttendanceLogs = userPermissions.includes(
        'attendance-logs.view',
    );
    const canViewDTR = userPermissions.includes('dtr.view');
    const canViewReports = userPermissions.includes('attendance-logs.view'); // Reports use same permission
    const canViewCourses = userPermissions.includes('courses.view');
    const canViewYearLevels = userPermissions.includes('year-levels.view');
    const canViewStudents = userPermissions.includes('students.view');
    const canViewFaculty = userPermissions.includes('faculties.view');
    const canViewStaff = userPermissions.includes('staff.view');
    const canViewAccounts = userPermissions.includes('accounts.view');
    const canManageRoles = userPermissions.includes('roles.manage');

    // Get the authenticated user's account type
    const accountType = (props as any)?.auth?.user?.account_type;

    // Determine if user is student, faculty, or staff
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
                ...(canViewEvents
                    ? [
                          {
                              title: 'Events',
                              href: '/events',
                              icon: CalendarDays,
                          },
                      ]
                    : []),
                ...(canViewAttendanceLogs
                    ? [
                          {
                              title: 'Attendance Logs',
                              href: '/attendance-logs',
                              icon: ClipboardList,
                          },
                      ]
                    : []),
                ...(canViewDTR
                    ? [
                          {
                              title: 'DTR',
                              href: '/dtr',
                              icon: FileSpreadsheet,
                          },
                      ]
                    : []),
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
                ...(canViewReports
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
        // Only show Academic Setup for users with permission and non-student/faculty/staff users
        ...(canViewCourses && !isRegularUser
            ? [
                  {
                      title: 'Academic Setup',
                      children: [
                          ...(canViewCourses
                              ? [
                                    {
                                        title: 'Courses',
                                        href: courses.index.url(),
                                        icon: BookOpen,
                                    },
                                ]
                              : []),
                          ...(canViewYearLevels
                              ? [
                                    {
                                        title: 'Year Levels',
                                        href: yearLevels.index.url(),
                                        icon: BookOpen,
                                    },
                                ]
                              : []),
                      ],
                  },
              ]
            : []),
        {
            title: 'Directory',
            children: [
                // Show Students only for non-student users with permission
                ...(!isStudent && canViewStudents
                    ? [
                          {
                              title: 'Students',
                              href: '/students',
                              icon: Users,
                          },
                      ]
                    : []),
                // Show Faculty only for non-faculty users with permission
                ...(!isFaculty && canViewFaculty
                    ? [
                          {
                              title: 'Faculty',
                              href: '/faculties',
                              icon: Users,
                          },
                      ]
                    : []),
                // Show Staff only for non-staff users with permission
                ...(!isStaff && canViewStaff
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
        // Only show Administration for users with permission and non-student/faculty/staff users
        ...(canViewAccounts && !isRegularUser
            ? [
                  {
                      title: 'Administration',
                      children: [
                          ...(canViewAccounts
                              ? [
                                    {
                                        title: 'Accounts',
                                        href: usersIndex.url(),
                                        icon: Users,
                                    },
                                ]
                              : []),
                          ...(canManageRoles
                              ? [
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
                                ]
                              : []),
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
