import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Users, 
  DollarSign, 
  MessageSquare, 
  Ticket, 
  Settings,
  BarChart
} from 'lucide-react';

export const Sidebar = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  const navigation = [
    { name: 'Dashboard', icon: Home, href: '/dashboard' },
    { name: 'Transactions', icon: DollarSign, href: '/dashboard/transactions' },
    { name: 'Messages', icon: MessageSquare, href: '/dashboard/messages' },
    { name: 'Support', icon: Ticket, href: '/dashboard/support' },
    ...(isAdmin ? [
      { name: 'Users', icon: Users, href: '/admin/users' },
      { name: 'Analytics', icon: BarChart, href: '/admin/analytics' },
    ] : []),
    { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-white text-xl font-bold">AdminDash</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <item.icon
                    className="mr-3 h-5 w-5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};