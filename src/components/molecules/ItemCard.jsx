import { motion } from 'framer-motion';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';
import ApperIcon from '../ApperIcon';

const ItemCard = ({ item, onSelect, onRent, onEdit, className = '' }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'available': return 'available';
      case 'rented': return 'rented';
      case 'maintenance': return 'maintenance';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return 'CheckCircle';
      case 'rented': return 'Clock';
      case 'maintenance': return 'Wrench';
      default: return 'Circle';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer ${className}`}
      onClick={() => onSelect?.(item)}
    >
      <div className="aspect-w-3 aspect-h-4 bg-gray-100">
        <img
          src={item.photoUrl}
          alt={item.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=600&fit=crop';
          }}
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h3>
            <p className="text-xs text-gray-500">{item.sku}</p>
          </div>
          <Badge variant={getStatusVariant(item.status)} size="sm">
            <ApperIcon name={getStatusIcon(item.status)} className="w-3 h-3 mr-1" />
            {item.status}
          </Badge>
        </div>
        
        <div className="space-y-1 text-xs text-gray-600 mb-3">
          <div className="flex justify-between">
            <span>Size:</span>
            <span className="font-medium">{item.size}</span>
          </div>
          <div className="flex justify-between">
            <span>Brand:</span>
            <span className="font-medium truncate ml-2">{item.brand}</span>
          </div>
          <div className="flex justify-between">
            <span>Rental:</span>
            <span className="font-semibold text-primary">${item.rentalPrice}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {item.status === 'available' && onRent && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRent(item);
              }}
              className="flex-1"
            >
              Rent
            </Button>
          )}
          {onEdit && (
            <Button
              size="sm"
              variant="secondary"
              icon="Edit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className={!onRent || item.status !== 'available' ? 'flex-1' : ''}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;