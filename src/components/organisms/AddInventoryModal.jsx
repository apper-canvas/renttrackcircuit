import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Badge from '../atoms/Badge';
import ApperIcon from '../ApperIcon';
import inventoryService from '../../services/api/inventoryService';

const AddInventoryModal = ({ onClose, onSuccess }) => {
const [formData, setFormData] = useState({
    name: '',
    sku: '',
    brand: '',
    category: '',
    size: '',
    color: '',
    description: '',
    condition: 'excellent',
    dailyRate: '',
    weeklyRate: '',
    monthlyRate: '',
    status: 'available',
    imageUrl: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    'Evening Wear',
    'Formal Wear',
    'Cocktail Wear',
    'Business Wear'
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const conditions = ['excellent', 'good', 'fair'];
  const statuses = ['available', 'rented', 'maintenance'];

const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.size) {
      newErrors.size = 'Size is required';
    }

    if (!formData.color.trim()) {
      newErrors.color = 'Color is required';
    }

    if (formData.imageUrl && formData.imageUrl.trim()) {
      const urlPattern = /^https?:\/\/.+/i;
      if (!urlPattern.test(formData.imageUrl.trim())) {
        newErrors.imageUrl = 'Please enter a valid URL (must start with http:// or https://)';
      }
    }

    if (!formData.dailyRate || isNaN(formData.dailyRate) || parseFloat(formData.dailyRate) <= 0) {
      newErrors.dailyRate = 'Valid daily rate is required';
    }

    if (!formData.weeklyRate || isNaN(formData.weeklyRate) || parseFloat(formData.weeklyRate) <= 0) {
      newErrors.weeklyRate = 'Valid weekly rate is required';
    }

    if (!formData.monthlyRate || isNaN(formData.monthlyRate) || parseFloat(formData.monthlyRate) <= 0) {
      newErrors.monthlyRate = 'Valid monthly rate is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);

try {
      const itemData = {
        ...formData,
        dailyRate: parseFloat(formData.dailyRate),
        weeklyRate: parseFloat(formData.weeklyRate),
        monthlyRate: parseFloat(formData.monthlyRate),
        images: formData.imageUrl.trim() ? [formData.imageUrl.trim()] : 
                formData.images.length > 0 ? formData.images : [
                  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop&crop=faces'
                ]
      };

      await inventoryService.create(itemData);
      toast.success('Inventory item created successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error creating inventory item:', error);
      toast.error(error.message || 'Failed to create inventory item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Plus" className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add New Inventory Item</h2>
                <p className="text-sm text-gray-500">Create a new item for your rental inventory</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Item Name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={errors.name}
                    placeholder="Enter item name"
                    required
                  />
                  <Input
                    label="SKU"
                    type="text"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    error={errors.sku}
                    placeholder="Enter SKU"
                    required
                  />
<Input
                    label="Brand"
                    type="text"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    error={errors.brand}
                    placeholder="Enter brand name"
                    required
                  />
                  <Input
                    label="Color"
                    type="text"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    error={errors.color}
                    placeholder="Enter color"
                    required
                  />
                </div>
                <div className="mt-4">
                  <Input
                    label="Image URL"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    error={errors.imageUrl}
                    placeholder="https://example.com/image.jpg"
                    icon="Image"
                  />
                </div>
              </div>

              {/* Category and Size */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Category & Size</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                        errors.category ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.size}
                      onChange={(e) => handleInputChange('size', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                        errors.size ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select size</option>
                      {sizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                    {errors.size && (
                      <p className="mt-1 text-sm text-red-600">{errors.size}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter item description"
                />
              </div>

              {/* Condition and Status */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Condition & Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition
                    </label>
                    <select
                      value={formData.condition}
                      onChange={(e) => handleInputChange('condition', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      {conditions.map(condition => (
                        <option key={condition} value={condition}>
                          {condition.charAt(0).toUpperCase() + condition.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Daily Rate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.dailyRate}
                    onChange={(e) => handleInputChange('dailyRate', e.target.value)}
                    error={errors.dailyRate}
                    placeholder="0.00"
                    required
                    prefix="$"
                  />
                  <Input
                    label="Weekly Rate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.weeklyRate}
                    onChange={(e) => handleInputChange('weeklyRate', e.target.value)}
                    error={errors.weeklyRate}
                    placeholder="0.00"
                    required
                    prefix="$"
                  />
                  <Input
                    label="Monthly Rate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.monthlyRate}
                    onChange={(e) => handleInputChange('monthlyRate', e.target.value)}
                    error={errors.monthlyRate}
                    placeholder="0.00"
                    required
                    prefix="$"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Item'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddInventoryModal;