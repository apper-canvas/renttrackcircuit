import { motion } from 'framer-motion';

const SkeletonLoader = ({ type = 'card', count = 1, className = '' }) => {
  const skeletonAnimation = {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  };

  const CardSkeleton = () => (
    <motion.div
      animate={skeletonAnimation}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
    >
      <div className="animate-pulse">
        <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
        <div className="space-y-2">
          <div className="bg-gray-200 h-4 rounded w-3/4"></div>
          <div className="bg-gray-200 h-3 rounded w-1/2"></div>
          <div className="bg-gray-200 h-3 rounded w-2/3"></div>
        </div>
      </div>
    </motion.div>
  );

  const ListSkeleton = () => (
    <motion.div
      animate={skeletonAnimation}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
    >
      <div className="animate-pulse flex items-center space-x-4">
        <div className="bg-gray-200 w-16 h-20 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="bg-gray-200 h-4 rounded w-3/4"></div>
          <div className="bg-gray-200 h-3 rounded w-1/2"></div>
          <div className="bg-gray-200 h-3 rounded w-2/3"></div>
        </div>
      </div>
    </motion.div>
  );

  const StatsSkeleton = () => (
    <motion.div
      animate={skeletonAnimation}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    >
      <div className="animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="bg-gray-200 h-4 rounded w-1/2"></div>
            <div className="bg-gray-200 h-8 rounded w-3/4"></div>
          </div>
          <div className="bg-gray-200 w-12 h-12 rounded-lg"></div>
        </div>
      </div>
    </motion.div>
  );

  const getSkeletonComponent = () => {
    switch (type) {
      case 'card': return CardSkeleton;
      case 'list': return ListSkeleton;
      case 'stats': return StatsSkeleton;
      default: return CardSkeleton;
    }
  };

  const SkeletonComponent = getSkeletonComponent();

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </div>
  );
};

export default SkeletonLoader;