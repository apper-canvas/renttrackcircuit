import inventoryData from '../mockData/inventoryItems.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let items = [...inventoryData];

export const inventoryService = {
  async getAll() {
    await delay(300);
    return [...items];
  },

  async getById(id) {
    await delay(200);
    const item = items.find(item => item.Id === parseInt(id, 10));
    if (!item) {
      throw new Error('Item not found');
    }
    return { ...item };
  },

  async create(itemData) {
    await delay(400);
    const maxId = items.length > 0 ? Math.max(...items.map(item => item.Id)) : 0;
    const newItem = {
      ...itemData,
      Id: maxId + 1,
      dateAdded: new Date().toISOString()
    };
    items.push(newItem);
    return { ...newItem };
  },

  async update(id, itemData) {
    await delay(300);
    const index = items.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Item not found');
    }
    
    const updatedItem = {
      ...items[index],
      ...itemData,
      Id: items[index].Id // Prevent Id modification
    };
    items[index] = updatedItem;
    return { ...updatedItem };
  },

  async delete(id) {
    await delay(300);
    const index = items.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Item not found');
    }
    
    const deletedItem = items[index];
    items.splice(index, 1);
    return { ...deletedItem };
  },

  async getByCategory(category) {
    await delay(250);
    return items.filter(item => item.category === category).map(item => ({ ...item }));
  },

  async getByStatus(status) {
    await delay(250);
    return items.filter(item => item.status === status).map(item => ({ ...item }));
  },

  async search(query) {
    await delay(300);
    const searchTerm = query.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm) ||
      item.sku.toLowerCase().includes(searchTerm) ||
      item.brand.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm)
    ).map(item => ({ ...item }));
  }
};

export default inventoryService;