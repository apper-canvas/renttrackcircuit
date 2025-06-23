import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import RentalCard from "@/components/molecules/RentalCard";
import SkeletonLoader from "@/components/molecules/SkeletonLoader";
import EmptyState from "@/components/molecules/EmptyState";
import ErrorState from "@/components/molecules/ErrorState";
import ReturnProcessModal from "@/components/organisms/ReturnProcessModal";
import rentalService from "@/services/api/rentalService";
import inventoryService from "@/services/api/inventoryService";
import customerService from "@/services/api/customerService";
const ActiveRentalsList = () => {
  const [rentals, setRentals] = useState([]);
  const [items, setItems] = useState({});
  const [customers, setCustomers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRental, setSelectedRental] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);

  useEffect(() => {
    loadActiveRentals();
  }, []);

  const loadActiveRentals = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [activeRentals, allItems, allCustomers] = await Promise.all([
        rentalService.getActiveRentals(),
        inventoryService.getAll(),
        customerService.getAll()
      ]);

      // Create lookup objects for items and customers
      const itemsMap = {};
      allItems.forEach(item => {
        itemsMap[item.Id] = item;
      });

      const customersMap = {};
      allCustomers.forEach(customer => {
        customersMap[customer.Id] = customer;
      });

      setRentals(activeRentals);
      setItems(itemsMap);
      setCustomers(customersMap);
    } catch (err) {
      setError(err.message || 'Failed to load active rentals');
      toast.error('Failed to load active rentals');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnItem = (rental) => {
    setSelectedRental(rental);
    setShowReturnModal(true);
  };

  const handleReturnProcessed = () => {
    setShowReturnModal(false);
    setSelectedRental(null);
    loadActiveRentals(); // Refresh the list
    toast.success('Item returned successfully!');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonLoader type="list" count={5} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadActiveRentals} />;
  }

  if (rentals.length === 0) {
    return (
      <EmptyState
        icon="Clock"
        title="No active rentals"
        description="All items are currently available. New rentals will appear here."
      />
    );
  }

  // Separate overdue and regular rentals
  const currentDate = new Date();
  const overdueRentals = rentals.filter(rental => 
    new Date(rental.dueDate) < currentDate
  );
  const regularRentals = rentals.filter(rental => 
    new Date(rental.dueDate) >= currentDate
  );

  return (
    <div className="space-y-6">
      {overdueRentals.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-red-600">
              Overdue Rentals ({overdueRentals.length})
            </h3>
          </div>
          <div className="space-y-4">
            {overdueRentals.map((rental, index) => (
              <motion.div
                key={rental.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
transition={{ delay: index * 0.1 }}
              >
                <RentalCard
                  rental={rental}
                  item={items[rental.item_id]}
                  customer={customers[rental.customer_id]}
                  onReturn={handleReturnItem}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {regularRentals.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900">
              Active Rentals ({regularRentals.length})
            </h3>
          </div>
          <div className="space-y-4">
            {regularRentals.map((rental, index) => (
              <motion.div
                key={rental.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
transition={{ delay: index * 0.1 }}
              >
                <RentalCard
                  rental={rental}
                  item={items[rental.item_id]}
                  customer={customers[rental.customer_id]}
                  onReturn={handleReturnItem}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

{/* Return Process Modal */}
      {showReturnModal && selectedRental && (
        <ReturnProcessModal
          rental={selectedRental}
          item={items[selectedRental.item_id]}
          customer={customers[selectedRental.customer_id]}
          onClose={() => {
            setShowReturnModal(false);
            setSelectedRental(null);
          }}
          onSuccess={handleReturnProcessed}
        />
      )}
    </div>
  );
};

export default ActiveRentalsList;