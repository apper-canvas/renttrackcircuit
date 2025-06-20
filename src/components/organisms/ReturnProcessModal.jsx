import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, differenceInDays } from 'date-fns';
import Button from '../atoms/Button';
import ApperIcon from '../ApperIcon';
import rentalService from '../../services/api/rentalService';
import inventoryService from '../../services/api/inventoryService';

const ReturnProcessModal = ({ rental, item, customer, onClose, onSuccess }) => {
  const [condition, setCondition] = useState('excellent');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const returnDate = new Date();
  const dueDate = new Date(rental.dueDate);
  const isOverdue = returnDate > dueDate;
  const daysLate = isOverdue ? differenceInDays(returnDate, dueDate) : 0;
  const lateFee = daysLate * 15; // $15 per day late fee
  const totalAmount = rental.totalPrice + lateFee;

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent', description: 'No visible wear or damage' },
    { value: 'good', label: 'Good', description: 'Minor wear but no damage' },
    { value: 'fair', label: 'Fair', description: 'Noticeable wear or minor damage' },
    { value: 'poor', label: 'Poor', description: 'Significant damage requiring repair' }
  ];

  const handleProcessReturn = async () => {
    setLoading(true);
    
    try {
      // Process the return
      await rentalService.processReturn(rental.Id, {
        condition,
        notes: notes || 'Item returned'
      });
      
      // Update item status back to available (or maintenance if condition is poor)
      const newStatus = condition === 'poor' ? 'maintenance' : 'available';
      await inventoryService.update(rental.itemId, { 
        status: newStatus,
        condition: condition 
      });
      
      onSuccess();
    } catch (err) {
      toast.error('Failed to process return');
    } finally {
      setLoading(false);
    }
  };

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
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Process Return</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            {/* Rental Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={item?.photoUrl}
                  alt={item?.name}
                  className="w-20 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item?.name}</h3>
                  <p className="text-sm text-gray-600">{item?.sku} • {item?.size}</p>
                  <p className="text-sm text-gray-600">Customer: {customer?.name}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Rental Date:</span>
                  <div className="font-medium">{format(new Date(rental.startDate), 'MMM dd, yyyy')}</div>
                </div>
                <div>
                  <span className="text-gray-500">Due Date:</span>
                  <div className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                    {format(dueDate, 'MMM dd, yyyy')}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Return Date:</span>
                  <div className="font-medium">{format(returnDate, 'MMM dd, yyyy')}</div>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <div className={`font-medium ${isOverdue ? 'text-red-600' : 'text-green-600'}`}>
                    {isOverdue ? `${daysLate} day${daysLate !== 1 ? 's' : ''} late` : 'On time'}
                  </div>
                </div>
              </div>
            </div>

            {/* Condition Assessment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Item Condition
              </label>
              <div className="space-y-3">
                {conditionOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                      condition === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="condition"
                      value={option.value}
                      checked={condition === option.value}
                      onChange={(e) => setCondition(e.target.value)}
                      className="mt-1 mr-3 text-primary focus:ring-primary"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Return Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Add any notes about the item condition or return process..."
              />
            </div>

            {/* Payment Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Payment Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Rental Fee:</span>
                  <span>${rental.totalPrice}</span>
                </div>
                {isOverdue && (
                  <div className="flex justify-between text-red-600">
                    <span>Late Fee ({daysLate} day{daysLate !== 1 ? 's' : ''}):</span>
                    <span>${lateFee}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-primary">${totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <Button
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleProcessReturn}
                loading={loading}
                className="flex-1"
              >
                Process Return
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReturnProcessModal;