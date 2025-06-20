import { motion } from 'framer-motion';
import ActiveRentalsList from '../organisms/ActiveRentalsList';

const ActiveRentals = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-8 max-w-full overflow-hidden"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-gray-900">Active Rentals</h1>
        <p className="text-gray-600 mt-2">
          Track current rentals, process returns, and manage due dates.
        </p>
      </div>

      {/* Active Rentals List */}
      <ActiveRentalsList />
    </motion.div>
  );
};

export default ActiveRentals;