import { motion } from 'framer-motion';
import CustomersList from '../organisms/CustomersList';

const Customers = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-8 max-w-full overflow-hidden"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-2">
          Manage your customer database and view rental history.
        </p>
      </div>

      {/* Customers List */}
      <CustomersList />
    </motion.div>
  );
};

export default Customers;