import { motion } from 'framer-motion';
import DashboardStats from '../organisms/DashboardStats';
import ActiveRentalsList from '../organisms/ActiveRentalsList';

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-8 max-w-full overflow-hidden"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to RentTrack Pro. Here's your business overview.
        </p>
      </div>

      {/* Statistics Cards */}
      <DashboardStats />

      {/* Active Rentals Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-gray-900">
            Active Rentals
          </h2>
        </div>
        <ActiveRentalsList />
      </div>
    </motion.div>
  );
};

export default Dashboard;