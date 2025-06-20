import customerData from '../mockData/customers.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let customers = [...customerData];

export const customerService = {
  async getAll() {
    await delay(300);
    return [...customers];
  },

  async getById(id) {
    await delay(200);
    const customer = customers.find(customer => customer.Id === parseInt(id, 10));
    if (!customer) {
      throw new Error('Customer not found');
    }
    return { ...customer };
  },

  async create(customerData) {
    await delay(400);
    const maxId = customers.length > 0 ? Math.max(...customers.map(customer => customer.Id)) : 0;
    const newCustomer = {
      ...customerData,
      Id: maxId + 1,
      joinDate: new Date().toISOString(),
      totalRentals: 0
    };
    customers.push(newCustomer);
    return { ...newCustomer };
  },

  async update(id, customerData) {
    await delay(300);
    const index = customers.findIndex(customer => customer.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Customer not found');
    }
    
    const updatedCustomer = {
      ...customers[index],
      ...customerData,
      Id: customers[index].Id // Prevent Id modification
    };
    customers[index] = updatedCustomer;
    return { ...updatedCustomer };
  },

  async delete(id) {
    await delay(300);
    const index = customers.findIndex(customer => customer.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Customer not found');
    }
    
    const deletedCustomer = customers[index];
    customers.splice(index, 1);
    return { ...deletedCustomer };
  },

  async search(query) {
    await delay(300);
    const searchTerm = query.toLowerCase();
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm) ||
      customer.phone.includes(searchTerm)
    ).map(customer => ({ ...customer }));
  },

  async incrementRentalCount(id) {
    await delay(200);
    const index = customers.findIndex(customer => customer.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Customer not found');
    }
    
    customers[index].totalRentals += 1;
    return { ...customers[index] };
  }
};

export default customerService;