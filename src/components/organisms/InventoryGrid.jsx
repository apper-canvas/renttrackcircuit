import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ItemCard from '../molecules/ItemCard';
import SearchBar from '../molecules/SearchBar';
import SkeletonLoader from '../molecules/SkeletonLoader';
import EmptyState from '../molecules/EmptyState';
import ErrorState from '../molecules/ErrorState';
import CreateRentalModal from './CreateRentalModal';
import ItemDetailModal from './ItemDetailModal';
import inventoryService from '../../services/api/inventoryService';

const InventoryGrid = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await inventoryService.getAll();
      setItems(result);
      setFilteredItems(result);
    } catch (err) {
      setError(err.message || 'Failed to load inventory');
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchTerm, filters) => {
    if (!searchTerm && Object.keys(filters).length === 0) {
      setFilteredItems(items);
      return;
    }

    try {
      let results = [...items];
      
      if (searchTerm) {
        results = await inventoryService.search(searchTerm);
      }
      
      // Apply filters
      if (filters.category) {
        results = results.filter(item => item.category === filters.category);
      }
      if (filters.size) {
        results = results.filter(item => item.size === filters.size);
      }
      if (filters.status) {
        results = results.filter(item => item.status === filters.status);
      }
      
      setFilteredItems(results);
    } catch (err) {
      toast.error('Search failed');
    }
  };

  const handleRentItem = (item) => {
    setSelectedItem(item);
    setShowRentalModal(true);
  };

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleRentalCreated = () => {
    setShowRentalModal(false);
    setSelectedItem(null);
    loadItems(); // Refresh to update item status
    toast.success('Rental created successfully!');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <SkeletonLoader type="card" count={8} />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadItems} />;
  }

  const searchFilters = [
    {
      name: 'category',
      label: 'Category',
      options: [
        { value: 'Evening Wear', label: 'Evening Wear' },
        { value: 'Formal Wear', label: 'Formal Wear' },
        { value: 'Cocktail Wear', label: 'Cocktail Wear' },
        { value: 'Business Wear', label: 'Business Wear' }
      ]
    },
    {
      name: 'size',
      label: 'Size',
      options: [
        { value: 'XS', label: 'XS' },
        { value: 'S', label: 'S' },
        { value: 'M', label: 'M' },
        { value: 'L', label: 'L' },
        { value: 'XL', label: 'XL' }
      ]
    },
    {
      name: 'status',
      label: 'Status',
      options: [
        { value: 'available', label: 'Available' },
        { value: 'rented', label: 'Rented' },
        { value: 'maintenance', label: 'Maintenance' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search items by name, SKU, brand..."
        filters={searchFilters}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Inventory Items ({filteredItems.length})
          </h2>
          <p className="text-sm text-gray-500">
            Manage your clothing rental inventory
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm12-2H4a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V4a3 3 0 00-3-3z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 000 2h14a1 1 0 100-2H3zm0 4a1 1 0 000 2h14a1 1 0 100-2H3zm0 4a1 1 0 000 2h14a1 1 0 100-2H3z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <EmptyState
          icon="Package"
          title="No items found"
          description="Try adjusting your search criteria or add new inventory items."
        />
      ) : (
        <motion.div
          layout
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.Id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ItemCard
                item={item}
                onSelect={handleViewItem}
                onRent={handleRentItem}
                className={viewMode === 'list' ? 'flex items-center p-4' : ''}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modals */}
      {showRentalModal && selectedItem && (
        <CreateRentalModal
          item={selectedItem}
          onClose={() => {
            setShowRentalModal(false);
            setSelectedItem(null);
          }}
          onSuccess={handleRentalCreated}
        />
      )}

      {showDetailModal && selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
};

export default InventoryGrid;