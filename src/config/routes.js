import Dashboard from '@/components/pages/Dashboard';
import Inventory from '@/components/pages/Inventory';
import ActiveRentals from '@/components/pages/ActiveRentals';
import Calendar from '@/components/pages/Calendar';
import Customers from '@/components/pages/Customers';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  inventory: {
    id: 'inventory',
    label: 'Inventory',
    path: '/inventory',
    icon: 'Package',
    component: Inventory
  },
  activeRentals: {
    id: 'activeRentals',
    label: 'Active Rentals',
    path: '/rentals',
    icon: 'Clock',
    component: ActiveRentals
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
    component: Calendar
  },
  customers: {
    id: 'customers',
    label: 'Customers',
    path: '/customers',
    icon: 'Users',
    component: Customers
  }
};

export const routeArray = Object.values(routes);
export default routes;