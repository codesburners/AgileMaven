/* ============================================================
   data.js — Data Layer for Customer Management Module
   Meridian Bank
   Uses localStorage for persistence with seed data initialization
   ============================================================ */

class DataStoreClass {

  constructor() {
    this.STORAGE_KEY = 'agile_bank_customers';
  }

  /* ----------------------------------------------------------
     Initialization
     ---------------------------------------------------------- */

  init() {
    const existing = localStorage.getItem(this.STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._seedData()));
    }
  }

  /* ----------------------------------------------------------
     Private helpers
     ---------------------------------------------------------- */

  _read() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  _write(customers) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customers));
  }

  /* ----------------------------------------------------------
     CRUD
     ---------------------------------------------------------- */

  getCustomers() {
    return this._read();
  }

  getCustomerById(id) {
    return this._read().find(c => c.id === id) || null;
  }

  addCustomer(customer) {
    const customers = this._read();
    customers.push(customer);
    this._write(customers);
    return customer;
  }

  updateCustomer(id, updates) {
    const customers = this._read();
    const idx = customers.findIndex(c => c.id === id);
    if (idx === -1) return null;

    customers[idx] = { ...customers[idx], ...updates };
    this._write(customers);
    return customers[idx];
  }

  deleteCustomer(id) {
    const customers = this._read();
    const idx = customers.findIndex(c => c.id === id);
    if (idx === -1) return false;

    customers.splice(idx, 1);
    this._write(customers);
    return true;
  }

  /* ----------------------------------------------------------
     Search & Filter
     ---------------------------------------------------------- */

  searchCustomers(query) {
    if (!query || !query.trim()) return this._read();

    const q = query.trim().toLowerCase();
    return this._read().filter(c => {
      const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
      return (
        fullName.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    });
  }

  filterCustomers(filters) {
    let customers = this._read();

    if (filters.kycStatus) {
      customers = customers.filter(c => c.kycStatus === filters.kycStatus);
    }
    if (filters.accountStatus) {
      customers = customers.filter(c => c.accountStatus === filters.accountStatus);
    }
    if (filters.riskLevel) {
      customers = customers.filter(c => c.riskLevel === filters.riskLevel);
    }

    return customers;
  }

  /* ----------------------------------------------------------
     Status History & Notes
     ---------------------------------------------------------- */

  addStatusChange(customerId, change) {
    const customers = this._read();
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return null;

    customer.statusHistory.push({
      timestamp: new Date().toISOString(),
      ...change
    });

    this._write(customers);
    return customer;
  }

  addNote(customerId, note) {
    const customers = this._read();
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return null;

    customer.notes = note;
    this._write(customers);
    return customer;
  }

  /* ----------------------------------------------------------
     Analytics
     ---------------------------------------------------------- */

  getStats() {
    const customers = this._read();

    return {
      total:     customers.length,
      pending:   customers.filter(c => c.kycStatus === 'pending').length,
      approved:  customers.filter(c => c.kycStatus === 'approved').length,
      rejected:  customers.filter(c => c.kycStatus === 'rejected').length,
      active:    customers.filter(c => c.accountStatus === 'active').length,
      suspended: customers.filter(c => c.accountStatus === 'suspended').length,
      frozen:    customers.filter(c => c.accountStatus === 'frozen').length
    };
  }

  getRecentActivity() {
    const customers = this._read();
    const activity = [];

    customers.forEach(c => {
      if (c.statusHistory) {
        c.statusHistory.forEach(h => {
          activity.push({
            ...h,
            customerName: `${c.firstName} ${c.lastName}`
          });
        });
      }
    });

    activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return activity.slice(0, 10);
  }

  /* ----------------------------------------------------------
     Seed Data
     ---------------------------------------------------------- */

  _seedData() {
    return [
      {
        id: 'CUS-001',
        firstName: 'Aarav',
        lastName: 'Sharma',
        email: 'aarav.sharma@email.com',
        phone: '9876543210',
        dateOfBirth: '1985-04-12',
        address: 'Flat 4B, Harmony Apartments, MG Road',
        city: 'Bangalore',
        country: 'India',
        registrationDate: '2026-01-10T08:30:00.000Z',
        kycStatus: 'approved',
        accountStatus: 'active',
        riskLevel: 'low',
        documents: [
          { id: 'DOC-001', type: 'Aadhaar Card', fileName: 'aarav_aadhaar.pdf', uploadDate: '2026-01-10T08:45:00.000Z', status: 'approved' },
          { id: 'DOC-002', type: 'PAN Card', fileName: 'aarav_pan.jpg', uploadDate: '2026-01-10T08:45:00.000Z', status: 'approved' }
        ],
        statusHistory: [
          { timestamp: '2026-01-10T08:30:00.000Z', fromStatus: 'none', toStatus: 'pending', changedBy: 'System', reason: 'New registration' },
          { timestamp: '2026-01-11T10:15:00.000Z', fromStatus: 'pending', toStatus: 'under_review', changedBy: 'Officer Smith', reason: 'KYC review started' },
          { timestamp: '2026-01-11T14:30:00.000Z', fromStatus: 'under_review', toStatus: 'approved', changedBy: 'Officer Smith', reason: 'All documents verified successfully' }
        ],
        notes: 'Standard KYC verified. Clean PEP checks.'
      },
      {
        id: 'CUS-002',
        firstName: 'Priya',
        lastName: 'Patel',
        email: 'priya.patel@email.com',
        phone: '9123456780',
        dateOfBirth: '1992-11-25',
        address: '12, Sunrise Avenue, Bandra West',
        city: 'Mumbai',
        country: 'India',
        registrationDate: '2026-07-14T11:20:00.000Z',
        kycStatus: 'pending',
        accountStatus: 'active',
        riskLevel: 'medium',
        documents: [
          { id: 'DOC-003', type: 'Passport', fileName: 'priya_passport.pdf', uploadDate: '2026-07-14T11:25:00.000Z', status: 'pending' }
        ],
        statusHistory: [
          { timestamp: '2026-07-14T11:20:00.000Z', fromStatus: 'none', toStatus: 'pending', changedBy: 'System', reason: 'New registration' }
        ],
        notes: ''
      },
      {
        id: 'CUS-003',
        firstName: 'Rahul',
        lastName: 'Verma',
        email: 'rahul.verma@email.com',
        phone: '9988776655',
        dateOfBirth: '1980-02-14',
        address: '45, Park Street',
        city: 'Kolkata',
        country: 'India',
        registrationDate: '2026-07-12T09:10:00.000Z',
        kycStatus: 'under_review',
        accountStatus: 'active',
        riskLevel: 'medium',
        documents: [
          { id: 'DOC-004', type: 'Aadhaar Card', fileName: 'rahul_aadhaar.pdf', uploadDate: '2026-07-12T09:15:00.000Z', status: 'under_review' },
          { id: 'DOC-005', type: 'Driver\'s License', fileName: 'rahul_dl.jpg', uploadDate: '2026-07-12T09:16:00.000Z', status: 'under_review' }
        ],
        statusHistory: [
          { timestamp: '2026-07-12T09:10:00.000Z', fromStatus: 'none', toStatus: 'pending', changedBy: 'System', reason: 'New registration' },
          { timestamp: '2026-07-15T08:30:00.000Z', fromStatus: 'pending', toStatus: 'under_review', changedBy: 'Officer Jones', reason: 'Review initiated' }
        ],
        notes: 'Address proof slightly blurry. May need to request a clearer copy.'
      },
      {
        id: 'CUS-004',
        firstName: 'Sneha',
        lastName: 'Gupta',
        email: 'sneha.gupta@email.com',
        phone: '9871122334',
        dateOfBirth: '1995-09-30',
        address: '88, Vasant Vihar',
        city: 'New Delhi',
        country: 'India',
        registrationDate: '2026-06-20T14:45:00.000Z',
        kycStatus: 'rejected',
        accountStatus: 'suspended',
        riskLevel: 'high',
        documents: [
          { id: 'DOC-006', type: 'PAN Card', fileName: 'sneha_pan.pdf', uploadDate: '2026-06-20T14:50:00.000Z', status: 'rejected' }
        ],
        statusHistory: [
          { timestamp: '2026-06-20T14:45:00.000Z', fromStatus: 'none', toStatus: 'pending', changedBy: 'System', reason: 'New registration' },
          { timestamp: '2026-06-21T10:00:00.000Z', fromStatus: 'pending', toStatus: 'under_review', changedBy: 'Officer Smith', reason: 'Review initiated' },
          { timestamp: '2026-06-21T16:20:00.000Z', fromStatus: 'under_review', toStatus: 'rejected', changedBy: 'Officer Smith', reason: 'Name mismatch on PAN card' },
          { timestamp: '2026-06-21T16:25:00.000Z', fromStatus: 'active', toStatus: 'suspended', changedBy: 'System', reason: 'Account suspended due to KYC rejection' }
        ],
        notes: 'Critical name mismatch between application and PAN card. Requesting re-submission with valid name proof.'
      },
      {
        id: 'CUS-005',
        firstName: 'Vikram',
        lastName: 'Singh',
        email: 'vikram.singh@email.com',
        phone: '9001234567',
        dateOfBirth: '1975-01-20',
        address: '15, Sector 17',
        city: 'Chandigarh',
        country: 'India',
        registrationDate: '2025-11-05T09:00:00.000Z',
        kycStatus: 'approved',
        accountStatus: 'frozen',
        riskLevel: 'high',
        documents: [
          { id: 'DOC-010', type: 'Passport', fileName: 'vikram_pass.pdf', uploadDate: '2025-11-05T09:10:00.000Z', status: 'approved' },
          { id: 'DOC-011', type: 'PAN Card', fileName: 'vikram_pan.pdf', uploadDate: '2025-11-05T09:11:00.000Z', status: 'approved' }
        ],
        statusHistory: [
          { timestamp: '2025-11-05T09:00:00.000Z', fromStatus: 'none', toStatus: 'pending', changedBy: 'System', reason: 'New registration' },
          { timestamp: '2025-11-08T11:00:00.000Z', fromStatus: 'pending', toStatus: 'approved', changedBy: 'Officer Jones', reason: 'KYC verified' },
          { timestamp: '2026-05-14T09:45:00.000Z', fromStatus: 'active',  toStatus: 'frozen',   changedBy: 'Officer Kapoor',   reason: 'Suspicious transaction activity flagged'}
        ],
        notes: 'Account frozen pending investigation. Compliance team reviewing transaction patterns from Apr-May 2026.'
      },
      {
        id: 'CUS-006',
        firstName: 'Ananya',
        lastName: 'Reddy',
        email: 'ananya.reddy@email.com',
        phone: '9444333222',
        dateOfBirth: '1998-07-09',
        address: '22, Jubilee Hills, Road No. 10',
        city: 'Hyderabad',
        country: 'India',
        registrationDate: '2026-07-10T10:00:00.000Z',
        kycStatus: 'pending',
        accountStatus: 'active',
        riskLevel: 'low',
        documents: [
          { id: 'DOC-013', type: 'Aadhaar Card', fileName: 'ananya_aadhaar.pdf', uploadDate: '2026-07-10T10:15:00.000Z', status: 'pending' }
        ],
        statusHistory: [
          { timestamp: '2026-07-10T10:00:00.000Z', fromStatus: 'none', toStatus: 'pending', changedBy: 'System', reason: 'New registration' }
        ],
        notes: 'Recently registered. Single document submitted — additional ID may be required.'
      }
    ];
  }
}

/* ----------------------------------------------------------
   Export & initialize
   ---------------------------------------------------------- */
window.DataStore = new DataStoreClass();
window.DataStore.init();
