const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const rentalService = {
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
          { field: { Name: "customer_id" } },
          { field: { Name: "item_id" } },
          { field: { Name: "start_date" } },
          { field: { Name: "due_date" } },
          { field: { Name: "return_date" } },
          { field: { Name: "total_price" } },
          { field: { Name: "late_fee" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('rental', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching rentals:", error);
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
          { field: { Name: "customer_id" } },
          { field: { Name: "item_id" } },
          { field: { Name: "start_date" } },
          { field: { Name: "due_date" } },
          { field: { Name: "return_date" } },
          { field: { Name: "total_price" } },
          { field: { Name: "late_fee" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } }
        ]
      };
      
      const response = await apperClient.getRecordById('rental', parseInt(id, 10), params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching rental:", error);
      throw error;
    }
  },

  async create(rentalData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: `Rental for ${rentalData.customerId}`,
          customer_id: parseInt(rentalData.customerId),
          item_id: parseInt(rentalData.itemId),
          start_date: rentalData.startDate,
          due_date: rentalData.dueDate,
          return_date: null,
          total_price: parseFloat(rentalData.totalPrice),
          late_fee: 0,
          status: 'active',
          notes: rentalData.notes || ''
        }]
      };
      
      const response = await apperClient.createRecord('rental', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create rental');
        }
        
        return successfulRecords[0].data;
      }
    } catch (error) {
      console.error("Error creating rental:", error);
      throw error;
    }
  },

  async update(id, rentalData) {
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
      
      if (rentalData.Name !== undefined) updateData.Name = rentalData.Name;
      if (rentalData.customer_id !== undefined) updateData.customer_id = parseInt(rentalData.customer_id);
      if (rentalData.item_id !== undefined) updateData.item_id = parseInt(rentalData.item_id);
      if (rentalData.start_date !== undefined) updateData.start_date = rentalData.start_date;
      if (rentalData.due_date !== undefined) updateData.due_date = rentalData.due_date;
      if (rentalData.return_date !== undefined) updateData.return_date = rentalData.return_date;
      if (rentalData.total_price !== undefined) updateData.total_price = parseFloat(rentalData.total_price);
      if (rentalData.late_fee !== undefined) updateData.late_fee = parseFloat(rentalData.late_fee);
      if (rentalData.status !== undefined) updateData.status = rentalData.status;
      if (rentalData.notes !== undefined) updateData.notes = rentalData.notes;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('rental', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || 'Failed to update rental');
        }
        
        return successfulUpdates[0].data;
      }
    } catch (error) {
      console.error("Error updating rental:", error);
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
      
      const response = await apperClient.deleteRecord('rental', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting rental:", error);
      throw error;
    }
  },

  async getActiveRentals() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "customer_id" } },
          { field: { Name: "item_id" } },
          { field: { Name: "start_date" } },
          { field: { Name: "due_date" } },
          { field: { Name: "total_price" } },
          { field: { Name: "late_fee" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } }
        ],
        where: [{
          FieldName: "status",
          Operator: "EqualTo",
          Values: ["active"]
        }]
      };
      
      const response = await apperClient.fetchRecords('rental', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching active rentals:", error);
      throw error;
    }
  },

  async getOverdueRentals() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "customer_id" } },
          { field: { Name: "item_id" } },
          { field: { Name: "start_date" } },
          { field: { Name: "due_date" } },
          { field: { Name: "total_price" } },
          { field: { Name: "late_fee" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } }
        ],
        whereGroups: [{
          operator: "AND",
          subGroups: [
            {
              conditions: [{
                fieldName: "status",
                operator: "EqualTo",
                values: ["active"]
              }],
              operator: "AND"
            },
            {
              conditions: [{
                fieldName: "due_date",
                operator: "LessThan",
                values: [new Date().toISOString()]
              }],
              operator: "AND"
            }
          ]
        }]
      };
      
      const response = await apperClient.fetchRecords('rental', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching overdue rentals:", error);
      throw error;
    }
  },

  async processReturn(id, returnData) {
    try {
      const rental = await this.getById(id);
      const returnDate = new Date();
      const dueDate = new Date(rental.due_date);
      
      // Calculate late fee if overdue
      let lateFee = 0;
      if (returnDate > dueDate) {
        const daysLate = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
        lateFee = daysLate * 15; // $15 per day late fee
      }
      
      return await this.update(id, {
        status: 'returned',
        return_date: returnDate.toISOString(),
        late_fee: lateFee,
        notes: returnData.notes || rental.notes
      });
    } catch (error) {
      console.error("Error processing return:", error);
      throw error;
    }
  }
};

export default rentalService;