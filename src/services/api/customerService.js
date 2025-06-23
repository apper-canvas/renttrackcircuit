const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const customerService = {
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
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "address" } },
          { field: { Name: "join_date" } },
          { field: { Name: "total_rentals" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('Customer1', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching customers:", error);
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
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "address" } },
          { field: { Name: "join_date" } },
          { field: { Name: "total_rentals" } }
        ]
      };
      
      const response = await apperClient.getRecordById('Customer1', parseInt(id, 10), params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching customer:", error);
      throw error;
    }
  },

  async create(customerData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
          join_date: new Date().toISOString(),
          total_rentals: 0
        }]
      };
      
      const response = await apperClient.createRecord('Customer1', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create customer');
        }
        
        return successfulRecords[0].data;
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  },

  async update(id, customerData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id, 10),
          Name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
          total_rentals: customerData.total_rentals
        }]
      };
      
      const response = await apperClient.updateRecord('Customer1', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || 'Failed to update customer');
        }
        
        return successfulUpdates[0].data;
      }
    } catch (error) {
      console.error("Error updating customer:", error);
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
      
      const response = await apperClient.deleteRecord('Customer1', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting customer:", error);
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
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "address" } },
          { field: { Name: "join_date" } },
          { field: { Name: "total_rentals" } }
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
                fieldName: "email",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "phone",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            }
          ]
        }]
      };
      
      const response = await apperClient.fetchRecords('Customer1', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching customers:", error);
      throw error;
    }
  },

  async incrementRentalCount(id) {
    try {
      // Get current customer data
      const customer = await this.getById(id);
      const newCount = (customer.total_rentals || 0) + 1;
      
      // Update with new count
      return await this.update(id, {
        name: customer.Name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        total_rentals: newCount
      });
    } catch (error) {
      console.error("Error incrementing rental count:", error);
      throw error;
    }
  }
};

export default customerService;