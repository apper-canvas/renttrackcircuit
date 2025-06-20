import { forwardRef } from 'react';
import ApperIcon from '../ApperIcon';

const Input = forwardRef(({ 
  label, 
  type = 'text', 
  error, 
  icon, 
  iconPosition = 'left',
  className = '',
  ...props 
}, ref) => {
  const hasIcon = !!icon;
  const hasError = !!error;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {hasIcon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            block w-full px-3 py-2 border rounded-lg shadow-sm text-sm
            transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0
            ${hasIcon && iconPosition === 'left' ? 'pl-10' : ''}
            ${hasIcon && iconPosition === 'right' ? 'pr-10' : ''}
            ${hasError 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-gray-300 focus:border-primary focus:ring-primary/20'
            }
            ${className}
          `}
          {...props}
        />
        {hasIcon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      {hasError && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;