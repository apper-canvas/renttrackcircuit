import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { toast } from 'react-toastify';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import ApperIcon from '../ApperIcon';
import SkeletonLoader from '../molecules/SkeletonLoader';
import ErrorState from '../molecules/ErrorState';
import rentalService from '../../services/api/rentalService';
import inventoryService from '../../services/api/inventoryService';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rentals, setRentals] = useState([]);
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCalendarData();
  }, [currentDate]);

  const loadCalendarData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [allRentals, allItems] = await Promise.all([
        rentalService.getAll(),
        inventoryService.getAll()
      ]);

      // Create items lookup
      const itemsMap = {};
      allItems.forEach(item => {
        itemsMap[item.Id] = item;
      });

      setRentals(allRentals);
      setItems(itemsMap);
    } catch (err) {
      setError(err.message || 'Failed to load calendar data');
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getRentalsForDay = (date) => {
    return rentals.filter(rental => {
      const startDate = new Date(rental.startDate);
      const dueDate = new Date(rental.dueDate);
      
      return date >= startDate && date <= dueDate;
    });
  };

  const getReturnsDueOnDay = (date) => {
    return rentals.filter(rental => {
      return isSameDay(new Date(rental.dueDate), date) && rental.status === 'active';
    });
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
        <SkeletonLoader type="card" count={1} className="h-96" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadCalendarData} />;
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <p className="text-sm text-gray-500">
            Item availability and rental calendar
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            icon="ChevronLeft"
            onClick={() => navigateMonth('prev')}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon="ChevronRight"
            iconPosition="right"
            onClick={() => navigateMonth('next')}
          />
        </div>
      </div>

      {/* Calendar Legend */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-sm text-gray-700">Active Rental</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Return Due</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Available</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <motion.div
        key={currentDate.toISOString()}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white border border-gray-200 rounded-lg overflow-hidden"
      >
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const dayRentals = getRentalsForDay(day);
            const returnsDue = getReturnsDueOnDay(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div
                key={day.toISOString()}
                className={`min-h-24 p-2 border-b border-r border-gray-100 ${
                  isToday ? 'bg-primary/5' : ''
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? 'text-primary' : 'text-gray-900'
                }`}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1">
                  {/* Active Rentals */}
                  {dayRentals.slice(0, 2).map((rental) => (
                    <div
                      key={rental.Id}
                      className="text-xs p-1 bg-primary/10 text-primary rounded truncate"
                      title={`${items[rental.itemId]?.name} - Active Rental`}
                    >
                      {items[rental.itemId]?.name}
                    </div>
                  ))}
                  
                  {/* Returns Due */}
                  {returnsDue.slice(0, 2).map((rental) => (
                    <div
                      key={`return-${rental.Id}`}
                      className="text-xs p-1 bg-red-100 text-red-700 rounded truncate"
                      title={`${items[rental.itemId]?.name} - Return Due`}
                    >
                      <ApperIcon name="RotateCcw" className="w-3 h-3 inline mr-1" />
                      {items[rental.itemId]?.name}
                    </div>
                  ))}
                  
                  {/* Show count if more items */}
                  {(dayRentals.length + returnsDue.length) > 2 && (
                    <div className="text-xs text-gray-500">
                      +{(dayRentals.length + returnsDue.length) - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Calendar Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ApperIcon name="Calendar" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {rentals.filter(r => r.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active Rentals</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <ApperIcon name="AlertTriangle" className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {rentals.filter(r => r.status === 'active' && new Date(r.dueDate) < new Date()).length}
              </div>
              <div className="text-sm text-gray-600">Overdue Returns</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {Object.values(items).filter(item => item.status === 'available').length}
              </div>
              <div className="text-sm text-gray-600">Available Items</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;