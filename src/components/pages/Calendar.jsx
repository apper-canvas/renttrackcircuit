import { motion } from 'framer-motion';
import CalendarView from '../organisms/CalendarView';

const Calendar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-8 max-w-full overflow-hidden"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-gray-900">Calendar</h1>
        <p className="text-gray-600 mt-2">
          View item availability and rental schedules in calendar format.
        </p>
      </div>

      {/* Calendar View */}
      <CalendarView />
    </motion.div>
  );
};

export default Calendar;