import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';

const ErrorState = ({ 
  message = 'Something went wrong',
  onRetry,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops!</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{message}</p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" icon="RotateCcw">
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;