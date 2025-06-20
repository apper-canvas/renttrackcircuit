import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  trend = null,
  trendDirection = 'up',
  color = 'primary',
  className = '' 
}) => {
  const colors = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200'
  };

  const iconColors = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    success: 'text-green-700 bg-green-100',
    warning: 'text-amber-700 bg-amber-100',
    danger: 'text-red-700 bg-red-100'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 truncate">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <div className={`flex items-center text-sm ${
                trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <ApperIcon 
                  name={trendDirection === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                  className="w-4 h-4 mr-1" 
                />
                {trend}
              </div>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-lg ${iconColors[color]}`}>
          <ApperIcon name={icon} className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;