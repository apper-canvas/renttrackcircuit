import { motion } from 'framer-motion';
import { format, isAfter } from 'date-fns';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';
import ApperIcon from '../ApperIcon';

const RentalCard = ({ rental, item, customer, onReturn, onView, className = '' }) => {
const isOverdue = rental.dueDate && rental.status === 'active' && isAfter(new Date(), new Date(rental.dueDate));
  
  const getStatusVariant = () => {
    if (isOverdue) return 'overdue';
    if (rental.status === 'active') return 'rented';
    return 'success';
  };

  const getStatusText = () => {
    if (isOverdue) return 'Overdue';
    if (rental.status === 'active') return 'Active';
    return 'Returned';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <img
            src={item?.photoUrl}
            alt={item?.name}
            className="w-16 h-20 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=600&fit=crop';
            }}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {item?.name || 'Unknown Item'}
              </h3>
              <p className="text-xs text-gray-500">
                {customer?.name || 'Unknown Customer'}
              </p>
            </div>
            <Badge variant={getStatusVariant()} size="sm">
              {getStatusText()}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
            <div>
              <span className="text-gray-500">Due:</span>
              <div className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
{rental.dueDate ? format(new Date(rental.dueDate), 'MMM dd, yyyy') : 'No due date'}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Total:</span>
              <div className="font-semibold text-primary">
                ${rental.totalPrice + (rental.lateFee || 0)}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {rental.status === 'active' && onReturn && (
              <Button
                size="sm"
                variant={isOverdue ? 'danger' : 'success'}
                icon="RotateCcw"
                onClick={() => onReturn(rental)}
              >
                Return
              </Button>
            )}
            {onView && (
              <Button
                size="sm"
                variant="secondary"
                icon="Eye"
                onClick={() => onView(rental)}
              >
                View
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RentalCard;