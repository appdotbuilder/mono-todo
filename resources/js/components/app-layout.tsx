import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { LogOut, User } from 'lucide-react';
import { router } from '@inertiajs/react';

interface AppLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function AppLayout({ children, title = 'Tasks' }: AppLayoutProps) {
    const { auth } = usePage<SharedData>().props;

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-white">
                {/* Header */}
                <header className="border-b border-gray-200 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center">
                                <Link 
                                    href={route('tasks.index')} 
                                    className="text-xl font-light text-black hover:text-gray-700 transition-colors"
                                >
                                    Tasks
                                </Link>
                            </div>
                            
                            {auth.user && (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-600 flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        {auth.user.name}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main>
                    {children}
                </main>
            </div>
        </>
    );
}