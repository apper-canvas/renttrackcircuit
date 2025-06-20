import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import SearchBar from '../molecules/SearchBar';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import ApperIcon from '../ApperIcon';
import SkeletonLoader from '../molecules/SkeletonLoader';
import EmptyState from '../molecules/EmptyState';
import ErrorState from '../molecules/ErrorState';
import customerService from '../../services/api/customerService';
import rentalService from '../../services/api/rentalService';

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customerRentals, setCustomerRentals] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [allCustomers, allRentals] = await Promise.all([
        customerService.getAll(),
        rentalService.getAll()
      ]);

      // Group rentals by customer
      const rentalsMap = {};
      allRentals.forEach(rental => {
        if (!rentalsMap[rental.customerId]) {
          rentalsMap[rental.customerId] = [];
        }
        rentalsMap[rental.customerId].push(rental);
      });

      setCustomers(allCustomers);
      setFilteredCustomers(allCustomers);
      setCustomerRentals(rentalsMap);
    } catch (err) {
      setError(err.message || 'Failed to load customers');
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchTerm) => {
    if (!searchTerm) {
      setFilteredCustomers(customers);
      return;
    }

    try {
      const results = await customerService.search(searchTerm);
      setFilteredCustomers(results);
    } catch (err) {
      toast.error('Search failed');
    }
  };

  const getCustomerStats = (customer) => {
    const rentals = customerRentals[customer.Id] || [];
    const activeRentals = rentals.filter(r => r.status === 'active').length;
    const totalSpent = rentals.reduce((sum, r) => sum + r.totalPrice + (r.lateFee || 0), 0);
    
    return {
      activeRentals,
      totalSpent,
      totalRentals: rentals.length
    };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
        <SkeletonLoader type="list" count={5} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadCustomers} />;
  }

  if (filteredCustomers.length === 0 && customers.length === 0) {
    return (
      <EmptyState
        icon="Users"
        title="No customers yet"
        description="Start by adding your first customer when creating a rental."
      />
    );
  }

  return (
    <div className="space-y-6">
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search customers by name, email, or phone..."
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Customers ({filteredCustomers.length})
          </h2>
          <p className="text-sm text-gray-500">
            Manage your customer database
          </p>
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <EmptyState
          icon="Search"
          title="No customers found"
          description="Try adjusting your search criteria."
        />
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rentals
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer, index) => {
                  const stats = getCustomerStats(customer);
                  
                  return (
                    <motion.tr
                      key={customer.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {customer.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {customer.Id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.email}</div>
                        <div className="text-sm text-gray-500">{customer.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(customer.joinDate), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {stats.totalRentals}
                        </div>
                        {stats.activeRentals > 0 && (
                          <div className="text-xs text-primary">
                            {stats.activeRentals} active
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ${stats.totalSpent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {stats.activeRentals > 0 ? (
                          <Badge variant="rented" size="sm">
                            Active Rental
                          </Badge>
                        ) : (
                          <Badge variant="available" size="sm">
                            Available
                          </Badge>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Detail Modal would go here */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          rentals={customerRentals[selectedCustomer.Id] || []}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};

// Simple Customer Detail Modal
const CustomerDetailModal = ({ customer, rentals, onClose }) => {
  const activeRentals = rentals.filter(r => r.status === 'active');
  const totalSpent = rentals.reduce((sum, r) => sum + r.totalPrice + (r.lateFee || 0), 0);

  return (
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
            <h2 className="text-xl font-bold text-gray-900">Customer Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span>
                  <div className="font-medium">{customer.name}</div>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <div className="font-medium">{customer.email}</div>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <div className="font-medium">{customer.phone}</div>
                </div>
                <div>
                  <span className="text-gray-500">Address:</span>
                  <div className="font-medium">{customer.address}</div>
                </div>
                <div>
                  <span className="text-gray-500">Member Since:</span>
                  <div className="font-medium">{format(new Date(customer.joinDate), 'MMM dd, yyyy')}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Rental Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-primary">{rentals.length}</div>
                  <div className="text-sm text-gray-600">Total Rentals</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-green-600">${totalSpent}</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
              </div>

              {activeRentals.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Active Rentals</h4>
                  <div className="space-y-2">
                    {activeRentals.map((rental) => (
                      <div key={rental.Id} className="p-2 bg-primary/10 rounded text-sm">
                        Due: {format(new Date(rental.dueDate), 'MMM dd, yyyy')}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CustomersList;