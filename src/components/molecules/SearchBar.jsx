import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

const SearchBar = ({ 
  onSearch, 
  placeholder = 'Search...', 
  filters = [],
  onFilterChange,
  className = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm, activeFilters);
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...activeFilters, [filterName]: value };
    setActiveFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchTerm('');
    onSearch('', {});
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              icon="Search"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit" icon="Search">
            Search
          </Button>
        </div>
        
        {filters.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {filters.map((filter) => (
              <div key={filter.name} className="min-w-0 flex-1 sm:flex-initial sm:min-w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {filter.label}
                </label>
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={activeFilters[filter.name] || ''}
                  onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                >
                  <option value="">All {filter.label}</option>
                  {filter.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            
            {Object.keys(activeFilters).length > 0 && (
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  icon="X"
                >
                  Clear
                </Button>
              </div>
            )}
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default SearchBar;