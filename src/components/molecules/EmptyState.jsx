import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';

const EmptyState = ({ 
  icon = 'Package', 
  title, 
  description, 
  actionLabel, 
  onAction,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="mx-auto mb-4"
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name={icon} className="w-8 h-8 text-gray-400" />
        </div>
      </motion.div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} icon="Plus">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;