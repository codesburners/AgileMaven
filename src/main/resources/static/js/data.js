/* ============================================================
   data.js — Data Layer for Customer Management Module
   Meridian Bank
   Uses Spring Boot REST API with in-memory cache for synchronous reads
   ============================================================ */

class DataStoreClass {

  constructor() {
    this.API_BASE = '/api/customers';
    this._cache = [];     // local cache for synchronous reads
    this._ready = false;
  }

  /* ----------------------------------------------------------
     Initialization — fetch all customers from the API
     ---------------------------------------------------------- */

  async init() {
    try {
      const res = await fetch(this.API_BASE);
      if (res.ok) {
        this._cache = await res.json();
      } else {
        console.error('Failed to load customers from API, status:', res.status);
        this._cache = [];
      }
    } catch (err) {
      console.error('Failed to connect to API:', err);
      this._cache = [];
    }
    this._ready = true;
  }

  /* ----------------------------------------------------------
     Private helpers
     ---------------------------------------------------------- */

  _refreshCache(customers) {
    if (Array.isArray(customers)) {
      this._cache = customers;
    }
  }

  async _fetchAndCache() {
    try {
      const res = await fetch(this.API_BASE);
      if (res.ok) {
        this._cache = await res.json();
      }
    } catch (err) {
      console.error('Cache refresh failed:', err);
    }
  }

  /* ----------------------------------------------------------
     CRUD — synchronous reads from cache, async writes to API
     ---------------------------------------------------------- */

  getCustomers() {
    return [...this._cache];
  }

  getCustomerById(id) {
    return this._cache.find(c => c.id === id) || null;
  }

  addCustomer(customer) {
    // Fire-and-forget API call, update cache immediately
    this._cache.push(customer);

    fetch(this.API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer)
    })
    .then(res => res.json())
    .then(saved => {
      // Update cache with server response (may have generated ID)
      const idx = this._cache.findIndex(c => c.id === customer.id);
      if (idx !== -1) this._cache[idx] = saved;
    })
    .catch(err => console.error('addCustomer API error:', err));

    return customer;
  }

  updateCustomer(id, updates) {
    // Update cache immediately
    const idx = this._cache.findIndex(c => c.id === id);
    if (idx === -1) return null;

    this._cache[idx] = { ...this._cache[idx], ...updates };

    // Fire API call
    fetch(`${this.API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    .then(res => {
      if (res.ok) return res.json();
      throw new Error('Update failed');
    })
    .then(saved => {
      const i = this._cache.findIndex(c => c.id === id);
      if (i !== -1) this._cache[i] = saved;
    })
    .catch(err => console.error('updateCustomer API error:', err));

    return this._cache[idx];
  }

  deleteCustomer(id) {
    const idx = this._cache.findIndex(c => c.id === id);
    if (idx === -1) return false;

    this._cache.splice(idx, 1);

    fetch(`${this.API_BASE}/${id}`, { method: 'DELETE' })
      .catch(err => console.error('deleteCustomer API error:', err));

    return true;
  }

  /* ----------------------------------------------------------
     Search & Filter
     ---------------------------------------------------------- */

  searchCustomers(query) {
    if (!query || !query.trim()) return this.getCustomers();

    const q = query.trim().toLowerCase();
    return this._cache.filter(c => {
      const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
      return (
        fullName.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    });
  }

  filterCustomers(filters) {
    let customers = this.getCustomers();

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
    const customer = this._cache.find(c => c.id === customerId);
    if (!customer) return null;

    if (!change.timestamp) {
      change.timestamp = new Date().toISOString();
    }
    customer.statusHistory.push(change);

    // Fire API call
    fetch(`${this.API_BASE}/${customerId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(change)
    })
    .catch(err => console.error('addStatusChange API error:', err));

    return customer;
  }

  addNote(customerId, note) {
    const customer = this._cache.find(c => c.id === customerId);
    if (!customer) return null;

    customer.notes = note;

    // Fire API call
    fetch(`${this.API_BASE}/${customerId}/notes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: note })
    })
    .catch(err => console.error('addNote API error:', err));

    return customer;
  }

  /* ----------------------------------------------------------
     Analytics
     ---------------------------------------------------------- */

  getStats() {
    const customers = this._cache;

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
    const customers = this._cache;
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
     Reset — calls the API to reset seed data
     ---------------------------------------------------------- */

  async resetToDefaults() {
    try {
      await fetch(`${this.API_BASE}/reset`, { method: 'POST' });
      await this.init(); // reload cache from API
    } catch (err) {
      console.error('resetData API error:', err);
    }
  }
}

/* ----------------------------------------------------------
   Export & initialize
   ---------------------------------------------------------- */
window.DataStore = new DataStoreClass();
