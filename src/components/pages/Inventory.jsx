import { motion } from 'framer-motion';
import InventoryGrid from '../organisms/InventoryGrid';

const Inventory = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-8 max-w-full overflow-hidden"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-gray-900">Inventory</h1>
        <p className="text-gray-600 mt-2">
          Manage your clothing rental inventory and track item availability.
        </p>
      </div>

      {/* Inventory Grid */}
      <InventoryGrid />
    </motion.div>
  );
};

export default Inventory;