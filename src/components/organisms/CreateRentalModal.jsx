import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, addDays } from 'date-fns';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import ApperIcon from '../ApperIcon';
import rentalService from '../../services/api/rentalService';
import customerService from '../../services/api/customerService';
import inventoryService from '../../services/api/inventoryService';

const CreateRentalModal = ({ item, onClose, onSuccess }) => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [rentalDays, setRentalDays] = useState(3);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [customersLoading, setCustomersLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const result = await customerService.getAll();
      setCustomers(result);
    } catch (err) {
      toast.error('Failed to load customers');
    } finally {
      setCustomersLoading(false);
    }
  };

  const handleCustomerSearch = async (searchTerm) => {
    setCustomerSearch(searchTerm);
    if (searchTerm.length > 2) {
      try {
        const results = await customerService.search(searchTerm);
        setCustomers(results);
      } catch (err) {
        toast.error('Customer search failed');
      }
    } else if (searchTerm === '') {
      loadCustomers();
    }
  };

  const handleCreateCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      toast.error('Please fill in all required customer fields');
      return;
    }

    try {
      const customer = await customerService.create(newCustomer);
      setSelectedCustomer(customer);
      setShowCustomerForm(false);
      setNewCustomer({ name: '', email: '', phone: '', address: '' });
      toast.success('Customer created successfully!');
    } catch (err) {
      toast.error('Failed to create customer');
    }
  };

  const handleCreateRental = async () => {
    if (!selectedCustomer) {
      toast.error('Please select a customer');
      return;
    }

    if (rentalDays < 1) {
      toast.error('Rental period must be at least 1 day');
      return;
    }

    setLoading(true);
    
    try {
      const startDate = new Date();
      const dueDate = addDays(startDate, rentalDays);
      
      const rentalData = {
        customerId: selectedCustomer.Id,
        itemId: item.Id,
startDate: startDate.toISOString(),
        dueDate: dueDate.toISOString(),
        totalPrice: item.rental_price * rentalDays,
        notes: notes
      };

      await rentalService.create(rentalData);
      
      // Update item status to rented
      await inventoryService.update(item.Id, { status: 'rented' });
      
      // Increment customer rental count
      await customerService.incrementRentalCount(selectedCustomer.Id);
      
      onSuccess();
    } catch (err) {
      toast.error('Failed to create rental');
    } finally {
      setLoading(false);
    }
  };

const filteredCustomers = customers.filter(customer =>
    (customer.name ?? '').toLowerCase().includes(customerSearch.toLowerCase()) ||
    (customer.email ?? '').toLowerCase().includes(customerSearch.toLowerCase()) ||
    (customer.phone ?? '').includes(customerSearch)
);

  const totalPrice = item.rental_price * rentalDays;
  const dueDate = addDays(new Date(), rentalDays);
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
              <h2 className="text-xl font-bold text-gray-900">Create New Rental</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            {/* Item Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-4">
                <img
                  src={item.photoUrl}
                  alt={item.name}
                  className="w-20 h-24 object-cover rounded-lg"
                />
                <div>
<h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.sku} • {item.size} • {item.brand}</p>
                  <p className="text-lg font-bold text-primary">${item.rental_price}/day</p>
                </div>
              </div>
            </div>

            {/* Customer Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Customer
              </label>
              
              {!showCustomerForm ? (
                <div className="space-y-4">
                  <Input
                    icon="Search"
                    placeholder="Search customers by name, email, or phone..."
                    value={customerSearch}
                    onChange={(e) => handleCustomerSearch(e.target.value)}
                  />
                  
                  {selectedCustomer ? (
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{selectedCustomer.name}</h4>
                          <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
                          <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                        </div>
                        <button
                          onClick={() => setSelectedCustomer(null)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <ApperIcon name="X" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {customersLoading ? (
                        <p className="text-gray-500">Loading customers...</p>
                      ) : filteredCustomers.length > 0 ? (
                        <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                          {filteredCustomers.slice(0, 5).map((customer) => (
                            <button
                              key={customer.Id}
                              onClick={() => setSelectedCustomer(customer)}
                              className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-900">{customer.name}</div>
                              <div className="text-sm text-gray-600">{customer.email}</div>
                            </button>
                          ))}
                        </div>
                      ) : customerSearch ? (
                        <p className="text-gray-500">No customers found</p>
                      ) : null}
                    </div>
                  )}
                  
                  <Button
                    variant="secondary"
                    onClick={() => setShowCustomerForm(true)}
                    icon="Plus"
                  >
                    Add New Customer
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">New Customer</h4>
                    <button
                      onClick={() => setShowCustomerForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <ApperIcon name="X" className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Name *"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    />
                    <Input
                      label="Email *"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    />
                    <Input
                      label="Phone *"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    />
                    <Input
                      label="Address"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                    />
                  </div>
                  
                  <Button onClick={handleCreateCustomer} icon="Plus">
                    Create Customer
                  </Button>
                </div>
              )}
            </div>

            {/* Rental Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rental Period (days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={rentalDays}
                  onChange={(e) => setRentalDays(parseInt(e.target.value) || 1)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="text"
                  value={format(dueDate, 'MMM dd, yyyy')}
                  readOnly
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-600"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Add any special instructions or notes..."
              />
            </div>

            {/* Total */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-primary">${totalPrice}</span>
</div>
              <p className="text-sm text-gray-600 mt-1">
                ${item.rental_price} × {rentalDays} day{rentalDays !== 1 ? 's' : ''}
              </p>
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
                onClick={handleCreateRental}
                loading={loading}
                disabled={!selectedCustomer || loading}
                className="flex-1"
              >
                Create Rental
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateRentalModal;