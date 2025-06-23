const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const inventoryService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "sku" } },
          { field: { Name: "category" } },
          { field: { Name: "size" } },
          { field: { Name: "color" } },
          { field: { Name: "brand" } },
          { field: { Name: "purchase_price" } },
          { field: { Name: "rental_price" } },
          { field: { Name: "status" } },
          { field: { Name: "condition" } },
          { field: { Name: "photo_url" } },
          { field: { Name: "date_added" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('inventory_item', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching inventory:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "sku" } },
          { field: { Name: "category" } },
          { field: { Name: "size" } },
          { field: { Name: "color" } },
          { field: { Name: "brand" } },
          { field: { Name: "purchase_price" } },
          { field: { Name: "rental_price" } },
          { field: { Name: "status" } },
          { field: { Name: "condition" } },
          { field: { Name: "photo_url" } },
          { field: { Name: "date_added" } }
        ]
      };
      
      const response = await apperClient.getRecordById('inventory_item', parseInt(id, 10), params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching item:", error);
      throw error;
    }
  },

  async create(itemData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: itemData.name,
          sku: itemData.sku,
          category: itemData.category,
          size: itemData.size,
          color: itemData.color,
          brand: itemData.brand,
          purchase_price: parseFloat(itemData.purchasePrice || itemData.purchase_price || 0),
          rental_price: parseFloat(itemData.rentalPrice || itemData.rental_price || 0),
          status: itemData.status || 'available',
          condition: itemData.condition || 'excellent',
          photo_url: itemData.photoUrl || itemData.photo_url || '',
          date_added: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('inventory_item', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create item');
        }
        
        return successfulRecords[0].data;
      }
    } catch (error) {
      console.error("Error creating item:", error);
      throw error;
    }
  },

  async update(id, itemData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields that are being updated
      const updateData = {
        Id: parseInt(id, 10)
      };
      
      if (itemData.name !== undefined) updateData.Name = itemData.name;
      if (itemData.sku !== undefined) updateData.sku = itemData.sku;
      if (itemData.category !== undefined) updateData.category = itemData.category;
      if (itemData.size !== undefined) updateData.size = itemData.size;
      if (itemData.color !== undefined) updateData.color = itemData.color;
      if (itemData.brand !== undefined) updateData.brand = itemData.brand;
      if (itemData.purchase_price !== undefined) updateData.purchase_price = parseFloat(itemData.purchase_price);
      if (itemData.rental_price !== undefined) updateData.rental_price = parseFloat(itemData.rental_price);
      if (itemData.status !== undefined) updateData.status = itemData.status;
      if (itemData.condition !== undefined) updateData.condition = itemData.condition;
      if (itemData.photo_url !== undefined) updateData.photo_url = itemData.photo_url;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('inventory_item', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || 'Failed to update item');
        }
        
        return successfulUpdates[0].data;
      }
    } catch (error) {
      console.error("Error updating item:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id, 10)]
      };
      
      const response = await apperClient.deleteRecord('inventory_item', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting item:", error);
      throw error;
    }
  },

  async getByCategory(category) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "sku" } },
          { field: { Name: "category" } },
          { field: { Name: "size" } },
          { field: { Name: "color" } },
          { field: { Name: "brand" } },
          { field: { Name: "rental_price" } },
          { field: { Name: "status" } },
          { field: { Name: "photo_url" } }
        ],
        where: [{
          FieldName: "category",
          Operator: "EqualTo",
          Values: [category]
        }]
      };
      
      const response = await apperClient.fetchRecords('inventory_item', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching items by category:", error);
      throw error;
    }
  },

  async getByStatus(status) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "sku" } },
          { field: { Name: "category" } },
          { field: { Name: "size" } },
          { field: { Name: "color" } },
          { field: { Name: "brand" } },
          { field: { Name: "rental_price" } },
          { field: { Name: "status" } },
          { field: { Name: "photo_url" } }
        ],
        where: [{
          FieldName: "status",
          Operator: "EqualTo",
          Values: [status]
        }]
      };
      
      const response = await apperClient.fetchRecords('inventory_item', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching items by status:", error);
      throw error;
    }
  },

  async search(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "sku" } },
          { field: { Name: "category" } },
          { field: { Name: "size" } },
          { field: { Name: "color" } },
          { field: { Name: "brand" } },
          { field: { Name: "rental_price" } },
          { field: { Name: "status" } },
          { field: { Name: "photo_url" } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [{
                fieldName: "Name",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "sku",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "brand",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "category",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            }
          ]
        }]
      };
      
      const response = await apperClient.fetchRecords('inventory_item', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching items:", error);
      throw error;
    }
  }
};

export default inventoryService;