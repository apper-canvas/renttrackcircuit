import rentalData from '../mockData/rentals.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let rentals = [...rentalData];

export const rentalService = {
  async getAll() {
    await delay(300);
    return [...rentals];
  },

  async getById(id) {
    await delay(200);
    const rental = rentals.find(rental => rental.Id === parseInt(id, 10));
    if (!rental) {
      throw new Error('Rental not found');
    }
    return { ...rental };
  },

  async create(rentalData) {
    await delay(400);
    const maxId = rentals.length > 0 ? Math.max(...rentals.map(rental => rental.Id)) : 0;
    const newRental = {
      ...rentalData,
      Id: maxId + 1,
      status: 'active',
      returnDate: null,
      lateFee: 0
    };
    rentals.push(newRental);
    return { ...newRental };
  },

  async update(id, rentalData) {
    await delay(300);
    const index = rentals.findIndex(rental => rental.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Rental not found');
    }
    
    const updatedRental = {
      ...rentals[index],
      ...rentalData,
      Id: rentals[index].Id // Prevent Id modification
    };
    rentals[index] = updatedRental;
    return { ...updatedRental };
  },

  async delete(id) {
    await delay(300);
    const index = rentals.findIndex(rental => rental.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Rental not found');
    }
    
    const deletedRental = rentals[index];
    rentals.splice(index, 1);
    return { ...deletedRental };
  },

  async getActiveRentals() {
    await delay(250);
    return rentals.filter(rental => rental.status === 'active').map(rental => ({ ...rental }));
  },

  async getOverdueRentals() {
    await delay(250);
    const today = new Date();
    return rentals.filter(rental => 
      rental.status === 'active' && 
      new Date(rental.dueDate) < today
    ).map(rental => ({ ...rental }));
  },

  async processReturn(id, returnData) {
    await delay(400);
    const index = rentals.findIndex(rental => rental.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Rental not found');
    }
    
    const rental = rentals[index];
    const returnDate = new Date();
    const dueDate = new Date(rental.dueDate);
    
    // Calculate late fee if overdue
    let lateFee = 0;
    if (returnDate > dueDate) {
      const daysLate = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
      lateFee = daysLate * 15; // $15 per day late fee
    }
    
    const updatedRental = {
      ...rental,
      status: 'returned',
      returnDate: returnDate.toISOString(),
      lateFee: lateFee,
      notes: returnData.notes || rental.notes
    };
    
    rentals[index] = updatedRental;
    return { ...updatedRental };
  }
};

export default rentalService;