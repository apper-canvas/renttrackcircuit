import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatsCard from '../molecules/StatsCard';
import SkeletonLoader from '../molecules/SkeletonLoader';
import ErrorState from '../molecules/ErrorState';
import inventoryService from '../../services/api/inventoryService';
import rentalService from '../../services/api/rentalService';
import customerService from '../../services/api/customerService';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    availableItems: 0,
    activeRentals: 0,
    totalCustomers: 0,
    monthlyRevenue: 0,
    overdueRentals: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [items, rentals, customers] = await Promise.all([
        inventoryService.getAll(),
        rentalService.getAll(),
        customerService.getAll()
      ]);

      const availableItems = items.filter(item => item.status === 'available');
      const activeRentals = rentals.filter(rental => rental.status === 'active');
      const overdueRentals = rentals.filter(rental => {
        return rental.status === 'active' && new Date(rental.dueDate) < new Date();
      });

      // Calculate monthly revenue (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = rentals
.filter(rental => {
          const rentalDate = new Date(rental.start_date);
          return rentalDate.getMonth() === currentMonth &&
                 rentalDate.getFullYear() === currentYear;
        })
.reduce((sum, rental) => sum + rental.total_price + (rental.late_fee || 0), 0);

      setStats({
        totalItems: items.length,
        availableItems: availableItems.length,
        activeRentals: activeRentals.length,
        totalCustomers: customers.length,
        monthlyRevenue,
        overdueRentals: overdueRentals.length
      });
    } catch (err) {
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonLoader type="stats" count={6} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadStats} />;
  }

  const statsData = [
    {
      title: 'Total Items',
      value: stats.totalItems,
      icon: 'Package',
      color: 'primary'
    },
    {
      title: 'Available Items',
      value: stats.availableItems,
      icon: 'CheckCircle',
      color: 'success'
    },
    {
      title: 'Active Rentals',
      value: stats.activeRentals,
      icon: 'Clock',
      color: 'secondary'
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: 'Users',
      color: 'primary'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: 'DollarSign',
      color: 'success'
    },
    {
      title: 'Overdue Items',
      value: stats.overdueRentals,
      icon: 'AlertTriangle',
      color: stats.overdueRentals > 0 ? 'danger' : 'success'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatsCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;