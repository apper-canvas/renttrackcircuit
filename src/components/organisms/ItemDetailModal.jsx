import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';
import ApperIcon from '../ApperIcon';
import SkeletonLoader from '../molecules/SkeletonLoader';
import rentalService from '../../services/api/rentalService';
import customerService from '../../services/api/customerService';

const ItemDetailModal = ({ item, onClose }) => {
  const [rentalHistory, setRentalHistory] = useState([]);
  const [customers, setCustomers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRentalHistory();
  }, [item.Id]);

  const loadRentalHistory = async () => {
    setLoading(true);
    
    try {
      const [allRentals, allCustomers] = await Promise.all([
        rentalService.getAll(),
        customerService.getAll()
      ]);

      // Filter rentals for this item
      const itemRentals = allRentals.filter(rental => rental.itemId === item.Id);
      
      // Create customer lookup
      const customersMap = {};
      allCustomers.forEach(customer => {
        customersMap[customer.Id] = customer;
      });

      setRentalHistory(itemRentals);
      setCustomers(customersMap);
    } catch (err) {
      console.error('Failed to load rental history:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'available': return 'available';
      case 'rented': return 'rented';
      case 'maintenance': return 'maintenance';
      default: return 'default';
    }
  };

  const totalEarnings = rentalHistory.reduce((sum, rental) => 
    sum + rental.totalPrice + (rental.lateFee || 0), 0
  );

  const totalRentals = rentalHistory.length;
  const currentRental = rentalHistory.find(rental => rental.status === 'active');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Item Details</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Item Information */}
              <div>
                <div className="aspect-w-3 aspect-h-4 mb-4">
                  <img
                    src={item.photoUrl}
                    alt={item.name}
                    className="w-full h-80 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=600&fit=crop';
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{item.name}</h3>
                  <Badge variant={getStatusVariant(item.status)} size="lg">
                    {item.status}
                  </Badge>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">SKU:</span>
                    <span className="font-medium">{item.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Size:</span>
                    <span className="font-medium">{item.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Color:</span>
                    <span className="font-medium">{item.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Brand:</span>
                    <span className="font-medium">{item.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Condition:</span>
                    <span className="font-medium capitalize">{item.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Purchase Price:</span>
                    <span className="font-medium">${item.purchasePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Rental Price:</span>
                    <span className="font-semibold text-primary">${item.rentalPrice}/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date Added:</span>
                    <span className="font-medium">{format(new Date(item.dateAdded), 'MMM dd, yyyy')}</span>
                  </div>
                </div>

                {/* Current Rental Info */}
                {currentRental && (
                  <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">Currently Rented</h4>
                    <div className="text-sm space-y-1">
                      <div>Customer: {customers[currentRental.customerId]?.name}</div>
                      <div>Due: {format(new Date(currentRental.dueDate), 'MMM dd, yyyy')}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Statistics & Rental History */}
              <div>
                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">{totalRentals}</div>
                    <div className="text-sm text-gray-600">Total Rentals</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">${totalEarnings}</div>
                    <div className="text-sm text-gray-600">Total Earnings</div>
                  </div>
                </div>

                {/* Rental History */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Rental History</h4>
                  
                  {loading ? (
                    <SkeletonLoader type="list" count={3} />
                  ) : rentalHistory.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {rentalHistory
                        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                        .map((rental) => (
                          <div
                            key={rental.Id}
                            className="p-3 border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">
                                {customers[rental.customerId]?.name || 'Unknown Customer'}
                              </span>
                              <Badge 
                                variant={rental.status === 'active' ? 'rented' : 'success'}
                                size="sm"
                              >
                                {rental.status}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div className="flex justify-between">
                                <span>Period:</span>
                                <span>
                                  {format(new Date(rental.startDate), 'MMM dd')} - 
                                  {format(new Date(rental.dueDate), 'MMM dd, yyyy')}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Amount:</span>
                                <span className="font-medium">
                                  ${rental.totalPrice + (rental.lateFee || 0)}
                                </span>
                              </div>
                              {rental.notes && (
                                <div className="text-gray-500 text-xs mt-1">
                                  {rental.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <ApperIcon name="Clock" className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>No rental history yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end">
              <Button onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ItemDetailModal;