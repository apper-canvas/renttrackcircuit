import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../atoms/Button';
import ApperIcon from '../ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center min-h-screen bg-gray-50 p-6"
    >
      <div className="text-center max-w-md">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Shirt" className="w-12 h-12 text-white" />
          </div>
        </motion.div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        
        <div className="space-y-4">
          <Button onClick={() => navigate('/')} icon="Home">
            Go to Dashboard
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => navigate(-1)} 
            icon="ArrowLeft"
          >
            Go Back
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;