// ============================================================
// Officer Pages — HITL Officer-facing views
// ============================================================

window.OfficerPages = (() => {

  // ── Officer Dashboard ──────────────────────────────────────
  function renderDashboard(container) {
    const stats = DataStore.getStats();
    const activity = DataStore.getRecentActivity();

    const total = stats.total;
    const kycData = [
      { label: 'Pending', count: stats.pending, color: 'var(--color-warning)' },
      { label: 'Approved', count: stats.approved, color: 'var(--color-success)' },
      { label: 'Rejected', count: stats.rejected, color: 'var(--color-danger)' },
    ];
    const maxBar = Math.max(...kycData.map(d => d.count), 1);

    container.innerHTML = `
      <div class="page-header animate-fade-in">
        <h1>Officer Dashboard</h1>
        <div class="page-header-actions">
          <button class="btn btn-primary" id="btn-review-pending">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
            Review Pending KYC
          </button>
        </div>
      </div>

      <!-- Stats Row 1 -->
      <div class="stats-grid animate-slide-up">
        <div class="card stat-card">
          <div class="stat-card-icon" style="background:var(--gradient-primary);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="stat-card-info">
            <span class="stat-card-value">${stats.total}</span>
            <span class="stat-card-label">Total Customers</span>
          </div>
        </div>
        <div class="card stat-card">
          <div class="stat-card-icon" style="background:linear-gradient(135deg, #f59e0b, #d97706);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div class="stat-card-info">
            <span class="stat-card-value">${stats.pending}</span>
            <span class="stat-card-label">Pending KYC</span>
          </div>
        </div>
        <div class="card stat-card">
          <div class="stat-card-icon" style="background:linear-gradient(135deg, #10b981, #059669);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div class="stat-card-info">
            <span class="stat-card-value">${stats.approved}</span>
            <span class="stat-card-label">Approved</span>
          </div>
        </div>
        <div class="card stat-card">
          <div class="stat-card-icon" style="background:linear-gradient(135deg, #f43f5e, #e11d48);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </div>
          <div class="stat-card-info">
            <span class="stat-card-value">${stats.rejected}</span>
            <span class="stat-card-label">Rejected</span>
          </div>
        </div>
      </div>

      <!-- Stats Row 2 -->
      <div class="stats-grid animate-slide-up" style="animation-delay:0.1s;">
        <div class="card stat-card stat-card-sm">
          <div class="stat-card-info"><span class="stat-card-value">${stats.active}</span><span class="stat-card-label">Active</span></div>
          <span class="badge badge-active">Active</span>
        </div>
        <div class="card stat-card stat-card-sm">
          <div class="stat-card-info"><span class="stat-card-value">${stats.suspended}</span><span class="stat-card-label">Suspended</span></div>
          <span class="badge badge-suspended">Suspended</span>
        </div>
        <div class="card stat-card stat-card-sm">
          <div class="stat-card-info"><span class="stat-card-value">${stats.frozen}</span><span class="stat-card-label">Frozen</span></div>
          <span class="badge badge-frozen">Frozen</span>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-top:1.5rem;" class="animate-slide-up" style="animation-delay:0.2s;">
        <!-- KYC Distribution Chart -->
        <div class="card">
          <div class="card-header"><h3>KYC Status Distribution</h3></div>
          <div class="card-body">
            <div class="bar-chart">
              ${kycData.map(d => `
                <div class="bar-chart-item">
                  <span class="bar-chart-label">${d.label}</span>
                  <div class="bar-chart-track">
                    <div class="bar-chart-fill" style="width:${(d.count / maxBar) * 100}%;background:${d.color};"></div>
                  </div>
                  <span class="bar-chart-value">${d.count}</span>
                </div>`).join('')}
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card">
          <div class="card-header">
            <h3>Recent Activity</h3>
          </div>
          <div class="card-body" style="max-height:300px;overflow-y:auto;">
            ${activity.length > 0 ? `<div class="activity-feed">${activity.map(a => `
              <div class="activity-item">
                <div class="activity-dot" style="background:${getStatusColor(a.toStatus)};"></div>
                <div class="activity-content">
                  <strong>${Utils.escapeHtml(a.customerName || 'Customer')}</strong>
                  <span>${a.fromStatus} → ${a.toStatus}</span>
                  <small>${Utils.timeAgo(a.timestamp)}</small>
                </div>
              </div>`).join('')}</div>` : '<p style="color:var(--color-text-muted);">No recent activity.</p>'}
          </div>
        </div>
      </div>
    `;

    container.querySelector('#btn-review-pending')?.addEventListener('click', () => App.navigateTo('officer-queue'));
  }

  function getStatusColor(status) {
    const map = { pending: 'var(--color-warning)', under_review: 'var(--color-info)', approved: 'var(--color-success)', rejected: 'var(--color-danger)', active: 'var(--color-success)', suspended: 'var(--color-warning)', frozen: 'var(--color-text-muted)', closed: 'var(--color-danger)' };
    return map[status] || 'var(--color-primary)';
  }


  // ── Customer Queue ─────────────────────────────────────────
  function renderCustomerQueue(container) {
    let currentFilters = { kycStatus: '', accountStatus: '', riskLevel: '' };
    let searchQuery = '';
    let sortField = 'registrationDate';
    let sortDir = 'desc';

    function render() {
      let customers = DataStore.getCustomers();

      // Search
      if (searchQuery) {
        customers = DataStore.searchCustomers(searchQuery);
      }

      // Filter
      const activeFilters = {};
      if (currentFilters.kycStatus) activeFilters.kycStatus = currentFilters.kycStatus;
      if (currentFilters.accountStatus) activeFilters.accountStatus = currentFilters.accountStatus;
      if (currentFilters.riskLevel) activeFilters.riskLevel = currentFilters.riskLevel;
      if (Object.keys(activeFilters).length > 0) {
        customers = customers.filter(c => {
          return (!activeFilters.kycStatus || c.kycStatus === activeFilters.kycStatus) &&
                 (!activeFilters.accountStatus || c.accountStatus === activeFilters.accountStatus) &&
                 (!activeFilters.riskLevel || c.riskLevel === activeFilters.riskLevel);
        });
      }

      // Sort
      customers.sort((a, b) => {
        let va = a[sortField], vb = b[sortField];
        if (sortField === 'registrationDate') { va = new Date(va); vb = new Date(vb); }
        if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
        if (va < vb) return sortDir === 'asc' ? -1 : 1;
        if (va > vb) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });

      const totalAll = DataStore.getCustomers().length;

      container.innerHTML = `
        <div class="page-header animate-fade-in">
          <h1>Customer Queue</h1>
          <div class="page-header-actions">
            <span style="color:var(--color-text-muted);font-size:0.85rem;">Showing ${customers.length} of ${totalAll} customers</span>
          </div>
        </div>

        <!-- Search & Filters -->
        <div class="card animate-slide-up" style="margin-bottom:1.5rem;">
          <div class="card-body">
            <div class="filter-bar">
              <div class="search-bar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" class="form-input" id="queue-search" placeholder="Search by name, email, or ID..." value="${Utils.escapeHtml(searchQuery)}">
              </div>
              <select class="form-select" id="filter-kyc" style="width:auto;">
                <option value="">All KYC Status</option>
                <option value="pending" ${currentFilters.kycStatus === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="under_review" ${currentFilters.kycStatus === 'under_review' ? 'selected' : ''}>Under Review</option>
                <option value="approved" ${currentFilters.kycStatus === 'approved' ? 'selected' : ''}>Approved</option>
                <option value="rejected" ${currentFilters.kycStatus === 'rejected' ? 'selected' : ''}>Rejected</option>
              </select>
              <select class="form-select" id="filter-account" style="width:auto;">
                <option value="">All Account Status</option>
                <option value="active" ${currentFilters.accountStatus === 'active' ? 'selected' : ''}>Active</option>
                <option value="suspended" ${currentFilters.accountStatus === 'suspended' ? 'selected' : ''}>Suspended</option>
                <option value="frozen" ${currentFilters.accountStatus === 'frozen' ? 'selected' : ''}>Frozen</option>
                <option value="closed" ${currentFilters.accountStatus === 'closed' ? 'selected' : ''}>Closed</option>
              </select>
              <select class="form-select" id="filter-risk" style="width:auto;">
                <option value="">All Risk Levels</option>
                <option value="low" ${currentFilters.riskLevel === 'low' ? 'selected' : ''}>Low</option>
                <option value="medium" ${currentFilters.riskLevel === 'medium' ? 'selected' : ''}>Medium</option>
                <option value="high" ${currentFilters.riskLevel === 'high' ? 'selected' : ''}>High</option>
              </select>
              <button class="btn btn-ghost btn-sm" id="btn-clear-filters">Clear</button>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="card animate-slide-up" style="animation-delay:0.1s;">
          <div class="table-responsive">
            ${customers.length > 0 ? `
            <table class="data-table">
              <thead>
                <tr>
                  <th class="sortable" data-field="id">ID</th>
                  <th class="sortable" data-field="firstName">Name</th>
                  <th class="sortable" data-field="email">Email</th>
                  <th class="sortable" data-field="kycStatus">KYC</th>
                  <th class="sortable" data-field="accountStatus">Account</th>
                  <th class="sortable" data-field="riskLevel">Risk</th>
                  <th class="sortable" data-field="registrationDate">Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${customers.map(c => `
                  <tr>
                    <td><code style="font-size:0.8rem;">${c.id}</code></td>
                    <td>
                      <div style="display:flex;align-items:center;gap:0.5rem;">
                        <div class="avatar avatar-sm">${Utils.getInitials(c.firstName, c.lastName)}</div>
                        <span>${Utils.escapeHtml(c.firstName)} ${Utils.escapeHtml(c.lastName)}</span>
                      </div>
                    </td>
                    <td style="font-size:0.85rem;">${Utils.escapeHtml(c.email)}</td>
                    <td><span class="badge badge-${c.kycStatus}">${formatKycLabel(c.kycStatus)}</span></td>
                    <td><span class="badge badge-${c.accountStatus}">${c.accountStatus}</span></td>
                    <td><span class="badge badge-${c.riskLevel}">${c.riskLevel}</span></td>
                    <td style="font-size:0.85rem;">${Utils.formatDate(c.registrationDate)}</td>
                    <td>
                      <div style="display:flex;gap:0.25rem;">
                        <button class="btn btn-ghost btn-sm btn-view" data-id="${c.id}" title="View Details">👁</button>
                        ${c.kycStatus === 'pending' || c.kycStatus === 'under_review' ? `<button class="btn btn-primary btn-sm btn-review" data-id="${c.id}" title="Review KYC">Review</button>` : ''}
                      </div>
                    </td>
                  </tr>`).join('')}
              </tbody>
            </table>` : `
            <div class="empty-state" style="padding:3rem;">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <h3>No customers found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>`}
          </div>
        </div>
      `;

      // Event listeners
      const searchInput = container.querySelector('#queue-search');
      searchInput?.addEventListener('input', Utils.debounce(e => {
        searchQuery = e.target.value.trim();
        render();
      }, 300));

      container.querySelector('#filter-kyc')?.addEventListener('change', e => { currentFilters.kycStatus = e.target.value; render(); });
      container.querySelector('#filter-account')?.addEventListener('change', e => { currentFilters.accountStatus = e.target.value; render(); });
      container.querySelector('#filter-risk')?.addEventListener('change', e => { currentFilters.riskLevel = e.target.value; render(); });
      container.querySelector('#btn-clear-filters')?.addEventListener('click', () => { currentFilters = { kycStatus: '', accountStatus: '', riskLevel: '' }; searchQuery = ''; render(); });

      container.querySelectorAll('.sortable').forEach(th => {
        th.addEventListener('click', () => {
          const field = th.dataset.field;
          if (sortField === field) { sortDir = sortDir === 'asc' ? 'desc' : 'asc'; }
          else { sortField = field; sortDir = 'asc'; }
          render();
        });
      });

      container.querySelectorAll('.btn-view').forEach(btn => btn.addEventListener('click', () => App.navigateTo('officer-detail-' + btn.dataset.id)));
      container.querySelectorAll('.btn-review').forEach(btn => btn.addEventListener('click', () => App.navigateTo('officer-review-' + btn.dataset.id)));
    }

    render();
  }

  function formatKycLabel(s) {
    return { pending: 'Pending', under_review: 'Under Review', approved: 'Approved', rejected: 'Rejected' }[s] || s;
  }


  // ── KYC Review ─────────────────────────────────────────────
  function renderKYCReview(container, customerId) {
    const customer = DataStore.getCustomerById(customerId);
    if (!customer) {
      container.innerHTML = '<div class="empty-state"><h3>Customer not found</h3><button class="btn btn-primary" id="btn-back-queue">Back to Queue</button></div>';
      container.querySelector('#btn-back-queue')?.addEventListener('click', () => App.navigateTo('officer-queue'));
      return;
    }

    // Mark as under review if pending
    if (customer.kycStatus === 'pending') {
      DataStore.updateCustomer(customerId, { kycStatus: 'under_review' });
      DataStore.addStatusChange(customerId, {
        timestamp: new Date().toISOString(),
        fromStatus: 'pending',
        toStatus: 'under_review',
        changedBy: 'HITL Officer',
        reason: 'KYC review initiated'
      });
      customer.kycStatus = 'under_review';
    }

    container.innerHTML = `
      <div class="page-header animate-fade-in">
        <h1>KYC Review</h1>
        <div class="page-header-actions">
          <button class="btn btn-ghost" id="btn-back-queue2">← Back to Queue</button>
        </div>
      </div>

      <!-- Customer Summary -->
      <div class="card animate-slide-up" style="margin-bottom:1.5rem;">
        <div class="card-body" style="display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;">
          <div class="avatar avatar-lg">${Utils.getInitials(customer.firstName, customer.lastName)}</div>
          <div>
            <h2 style="margin:0;color:var(--color-text);">${Utils.escapeHtml(customer.firstName)} ${Utils.escapeHtml(customer.lastName)}</h2>
            <p style="margin:0.25rem 0 0;color:var(--color-text-muted);">${customer.id} · Registered ${Utils.formatDate(customer.registrationDate)}</p>
          </div>
          <div style="margin-left:auto;display:flex;gap:0.5rem;">
            <span class="badge badge-${customer.kycStatus}">${formatKycLabel(customer.kycStatus)}</span>
            <span class="badge badge-${customer.riskLevel}">Risk: ${customer.riskLevel}</span>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;" class="animate-slide-up" style="animation-delay:0.1s;">
        <!-- Documents -->
        <div class="card">
          <div class="card-header"><h3>📄 Submitted Documents</h3></div>
          <div class="card-body">
            ${customer.documents && customer.documents.length > 0 ? customer.documents.map((d, i) => `
              <div class="doc-review-item" style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem;border-radius:var(--radius-md);background:var(--color-surface-hover);margin-bottom:0.5rem;cursor:pointer;" data-doc-idx="${i}">
                <div style="width:40px;height:40px;border-radius:8px;background:var(--color-primary-alpha);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div style="flex:1;">
                  <strong style="color:var(--color-text);font-size:0.9rem;">${Utils.escapeHtml(d.fileName)}</strong>
                  <p style="margin:0;font-size:0.75rem;color:var(--color-text-muted);">${d.type} · ${Utils.formatDate(d.uploadDate)}</p>
                </div>
                <span class="badge badge-${d.status}">${d.status}</span>
              </div>`).join('') : '<p style="color:var(--color-text-muted);">No documents submitted.</p>'}
          </div>
        </div>

        <!-- Verification Checklist -->
        <div class="card">
          <div class="card-header"><h3>✅ Verification Checklist</h3></div>
          <div class="card-body">
            <div style="display:flex;flex-direction:column;gap:0.75rem;">
              ${['Identity Verified', 'Address Verified', 'Document Authenticity', 'PEP Check Complete', 'Sanctions Check Complete'].map((item, i) => `
                <label class="checklist-item" style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem;border-radius:var(--radius-md);background:var(--color-surface-hover);cursor:pointer;transition:all 0.2s;">
                  <input type="checkbox" class="verify-check" id="check-${i}">
                  <span style="color:var(--color-text);">${item}</span>
                </label>`).join('')}
            </div>
          </div>
        </div>

        <!-- Risk Assessment -->
        <div class="card">
          <div class="card-header"><h3>⚠️ Risk Assessment</h3></div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label">Risk Level</label>
              <select class="form-select" id="review-risk">
                <option value="low" ${customer.riskLevel === 'low' ? 'selected' : ''}>Low — Standard customer, no flags</option>
                <option value="medium" ${customer.riskLevel === 'medium' ? 'selected' : ''}>Medium — Some flags, enhanced monitoring</option>
                <option value="high" ${customer.riskLevel === 'high' ? 'selected' : ''}>High — PEP or suspicious, close monitoring</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Officer Notes -->
        <div class="card">
          <div class="card-header"><h3>📝 Officer Notes</h3></div>
          <div class="card-body">
            <textarea class="form-textarea" id="review-notes" rows="4" placeholder="Add your review notes here...">${Utils.escapeHtml(customer.notes || '')}</textarea>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="card animate-slide-up" style="margin-top:1.5rem;">
        <div class="card-body" style="display:flex;gap:1rem;justify-content:flex-end;flex-wrap:wrap;">
          <button class="btn btn-warning" id="btn-request-info">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Request More Info
          </button>
          <button class="btn btn-danger" id="btn-reject-kyc">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            Reject KYC
          </button>
          <button class="btn btn-success" id="btn-approve-kyc">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Approve KYC
          </button>
        </div>
      </div>
    `;

    // Document click -> show modal
    container.querySelectorAll('.doc-review-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.docIdx);
        const doc = customer.documents[idx];
        Modal.show({
          title: 'Document Details',
          content: `
            <div style="text-align:center;padding:2rem;">
              <div style="width:80px;height:80px;border-radius:16px;background:var(--color-primary-alpha);display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <h3 style="color:var(--color-text);margin:0 0 0.5rem;">${Utils.escapeHtml(doc.fileName)}</h3>
              <p style="color:var(--color-text-muted);margin:0;">Type: ${doc.type}</p>
              <p style="color:var(--color-text-muted);margin:0.25rem 0;">Uploaded: ${Utils.formatDate(doc.uploadDate)}</p>
              <span class="badge badge-${doc.status}" style="margin-top:0.5rem;display:inline-block;">${doc.status}</span>
              <p style="margin-top:1.5rem;color:var(--color-text-muted);font-size:0.85rem;font-style:italic;">Document preview is available after Java backend integration.</p>
            </div>`,
          actions: [{ label: 'Close', class: 'btn btn-ghost', onClick: () => Modal.close() }]
        });
      });
    });

    container.querySelector('#btn-back-queue2')?.addEventListener('click', () => App.navigateTo('officer-queue'));

    // Approve
    container.querySelector('#btn-approve-kyc')?.addEventListener('click', () => {
      Modal.confirm('Approve KYC', `Are you sure you want to approve KYC for ${customer.firstName} ${customer.lastName}?`, () => {
        const notes = container.querySelector('#review-notes')?.value || '';
        const risk = container.querySelector('#review-risk')?.value || customer.riskLevel;
        DataStore.updateCustomer(customerId, { kycStatus: 'approved', riskLevel: risk, notes: notes });
        DataStore.addStatusChange(customerId, {
          timestamp: new Date().toISOString(), fromStatus: 'under_review', toStatus: 'approved',
          changedBy: 'HITL Officer', reason: 'KYC approved after review'
        });
        // Update document statuses
        const updatedDocs = customer.documents.map(d => ({ ...d, status: 'approved' }));
        DataStore.updateCustomer(customerId, { documents: updatedDocs });
        Toast.show('KYC approved successfully', 'success');
        App.navigateTo('officer-queue');
      });
    });

    // Reject
    container.querySelector('#btn-reject-kyc')?.addEventListener('click', () => {
      Modal.show({
        title: 'Reject KYC',
        content: `
          <div class="form-group">
            <label class="form-label">Rejection Reason *</label>
            <textarea class="form-textarea" id="reject-reason" rows="3" placeholder="Please provide a reason for rejection..."></textarea>
          </div>`,
        actions: [
          { label: 'Cancel', class: 'btn btn-ghost', onClick: () => Modal.close() },
          { label: 'Reject KYC', class: 'btn btn-danger', onClick: () => {
            const reason = document.querySelector('#reject-reason')?.value?.trim();
            if (!reason) { Toast.show('Please provide a rejection reason', 'warning'); return; }
            const notes = container.querySelector('#review-notes')?.value || '';
            DataStore.updateCustomer(customerId, { kycStatus: 'rejected', notes: notes + '\n\nRejection: ' + reason });
            DataStore.addStatusChange(customerId, {
              timestamp: new Date().toISOString(), fromStatus: 'under_review', toStatus: 'rejected',
              changedBy: 'HITL Officer', reason: reason
            });
            const updatedDocs = customer.documents.map(d => ({ ...d, status: 'rejected' }));
            DataStore.updateCustomer(customerId, { documents: updatedDocs });
            Modal.close();
            Toast.show('KYC rejected', 'error');
            App.navigateTo('officer-queue');
          }}
        ]
      });
    });

    // Request more info
    container.querySelector('#btn-request-info')?.addEventListener('click', () => {
      Toast.show('Request for additional information sent to customer', 'info');
    });
  }


  // ── Customer Detail ────────────────────────────────────────
  function renderCustomerDetail(container, customerId) {
    const customer = DataStore.getCustomerById(customerId);
    if (!customer) {
      container.innerHTML = '<div class="empty-state"><h3>Customer not found</h3><button class="btn btn-primary" id="btn-back-q">Back to Queue</button></div>';
      container.querySelector('#btn-back-q')?.addEventListener('click', () => App.navigateTo('officer-queue'));
      return;
    }

    let activeTab = 'overview';

    function render() {
      const c = DataStore.getCustomerById(customerId); // Re-read in case of updates

      container.innerHTML = `
        <div class="page-header animate-fade-in">
          <h1>Customer Detail</h1>
          <div class="page-header-actions">
            <button class="btn btn-ghost" id="btn-back-q2">← Back to Queue</button>
          </div>
        </div>

        <!-- Header Card -->
        <div class="card animate-slide-up" style="margin-bottom:1.5rem;">
          <div class="card-body" style="display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;">
            <div class="avatar avatar-lg">${Utils.getInitials(c.firstName, c.lastName)}</div>
            <div style="flex:1;">
              <h2 style="margin:0;color:var(--color-text);">${Utils.escapeHtml(c.firstName)} ${Utils.escapeHtml(c.lastName)}</h2>
              <p style="margin:0.25rem 0 0.5rem;color:var(--color-text-muted);">${c.id} · ${c.email}</p>
              <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                <span class="badge badge-${c.kycStatus}">KYC: ${formatKycLabel(c.kycStatus)}</span>
                <span class="badge badge-${c.accountStatus}">${c.accountStatus}</span>
                <span class="badge badge-${c.riskLevel}">Risk: ${c.riskLevel}</span>
              </div>
            </div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
              <button class="btn btn-outline btn-sm" id="btn-change-status">Change Status</button>
              <button class="btn btn-outline btn-sm" id="btn-change-risk">Change Risk</button>
              ${c.kycStatus === 'pending' || c.kycStatus === 'under_review' ? `<button class="btn btn-primary btn-sm" id="btn-go-review">Review KYC</button>` : ''}
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs animate-slide-up" style="margin-bottom:1.5rem;">
          <button class="tab-item ${activeTab === 'overview' ? 'tab-active' : ''}" data-tab="overview">Overview</button>
          <button class="tab-item ${activeTab === 'documents' ? 'tab-active' : ''}" data-tab="documents">Documents</button>
          <button class="tab-item ${activeTab === 'history' ? 'tab-active' : ''}" data-tab="history">Status History</button>
          <button class="tab-item ${activeTab === 'notes' ? 'tab-active' : ''}" data-tab="notes">Notes</button>
        </div>

        <div id="tab-content" class="animate-fade-in"></div>
      `;

      const tabContent = container.querySelector('#tab-content');

      if (activeTab === 'overview') {
        tabContent.innerHTML = `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">
            <div class="card"><div class="card-header"><h3>Personal Information</h3></div><div class="card-body">
              <div class="info-grid">
                <div class="info-row"><span class="info-label">Full Name</span><span class="info-value">${Utils.escapeHtml(c.firstName)} ${Utils.escapeHtml(c.lastName)}</span></div>
                <div class="info-row"><span class="info-label">Date of Birth</span><span class="info-value">${c.dateOfBirth || '-'}</span></div>
                <div class="info-row"><span class="info-label">Gender</span><span class="info-value">${c.gender || '-'}</span></div>
                <div class="info-row"><span class="info-label">Registration</span><span class="info-value">${Utils.formatDate(c.registrationDate)}</span></div>
              </div>
            </div></div>
            <div class="card"><div class="card-header"><h3>Contact Information</h3></div><div class="card-body">
              <div class="info-grid">
                <div class="info-row"><span class="info-label">Email</span><span class="info-value">${Utils.escapeHtml(c.email)}</span></div>
                <div class="info-row"><span class="info-label">Phone</span><span class="info-value">${c.phone}</span></div>
                <div class="info-row"><span class="info-label">City</span><span class="info-value">${Utils.escapeHtml(c.city)}</span></div>
                <div class="info-row"><span class="info-label">Country</span><span class="info-value">${Utils.escapeHtml(c.country)}</span></div>
                <div class="info-row"><span class="info-label">Address</span><span class="info-value">${Utils.escapeHtml(c.address)}</span></div>
              </div>
            </div></div>
          </div>`;
      } else if (activeTab === 'documents') {
        tabContent.innerHTML = `<div class="card"><div class="card-header"><h3>Documents</h3></div><div class="card-body">
          ${c.documents && c.documents.length > 0 ? `
            <table class="data-table"><thead><tr><th>File</th><th>Type</th><th>Uploaded</th><th>Status</th></tr></thead><tbody>
              ${c.documents.map(d => `<tr>
                <td>${Utils.escapeHtml(d.fileName)}</td>
                <td>${d.type}</td>
                <td>${Utils.formatDate(d.uploadDate)}</td>
                <td><span class="badge badge-${d.status}">${d.status}</span></td>
              </tr>`).join('')}
            </tbody></table>` : '<p style="color:var(--color-text-muted);">No documents.</p>'}
        </div></div>`;
      } else if (activeTab === 'history') {
        tabContent.innerHTML = `<div class="card"><div class="card-header"><h3>Status History</h3></div><div class="card-body">
          ${c.statusHistory && c.statusHistory.length > 0 ? `
            <div class="timeline">${c.statusHistory.slice().reverse().map(h => `
              <div class="timeline-item">
                <div class="timeline-dot" style="background:${getStatusColor(h.toStatus)};"></div>
                <div class="timeline-content">
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <strong style="color:var(--color-text);">${h.fromStatus} → ${h.toStatus}</strong>
                    <small style="color:var(--color-text-muted);">${Utils.formatDateTime(h.timestamp)}</small>
                  </div>
                  <p style="margin:0.25rem 0 0;font-size:0.85rem;color:var(--color-text-muted);">By: ${h.changedBy} · ${h.reason || 'No reason provided'}</p>
                </div>
              </div>`).join('')}</div>` : '<p style="color:var(--color-text-muted);">No status changes yet.</p>'}
        </div></div>`;
      } else if (activeTab === 'notes') {
        tabContent.innerHTML = `<div class="card"><div class="card-header"><h3>Officer Notes</h3></div><div class="card-body">
          ${c.notes ? `<div style="background:var(--color-surface-hover);padding:1rem;border-radius:var(--radius-md);margin-bottom:1rem;white-space:pre-wrap;color:var(--color-text);font-size:0.9rem;">${Utils.escapeHtml(c.notes)}</div>` : ''}
          <div class="form-group">
            <label class="form-label">Add Note</label>
            <textarea class="form-textarea" id="new-note" rows="3" placeholder="Write a note about this customer..."></textarea>
          </div>
          <button class="btn btn-primary btn-sm" id="btn-save-note">Save Note</button>
        </div></div>`;

        tabContent.querySelector('#btn-save-note')?.addEventListener('click', () => {
          const note = tabContent.querySelector('#new-note')?.value?.trim();
          if (!note) { Toast.show('Please write a note first', 'warning'); return; }
          const existing = c.notes || '';
          const timestamp = Utils.formatDateTime(new Date().toISOString());
          const updatedNotes = existing + (existing ? '\n\n' : '') + `[${timestamp}] ${note}`;
          DataStore.updateCustomer(customerId, { notes: updatedNotes });
          Toast.show('Note saved', 'success');
          render();
        });
      }

      // Tab listeners
      container.querySelectorAll('.tab-item').forEach(tab => {
        tab.addEventListener('click', () => { activeTab = tab.dataset.tab; render(); });
      });

      container.querySelector('#btn-back-q2')?.addEventListener('click', () => App.navigateTo('officer-queue'));
      container.querySelector('#btn-go-review')?.addEventListener('click', () => App.navigateTo('officer-review-' + customerId));

      // Change status
      container.querySelector('#btn-change-status')?.addEventListener('click', () => {
        Modal.show({
          title: 'Change Account Status',
          content: `
            <div class="form-group">
              <label class="form-label">New Status</label>
              <select class="form-select" id="new-status">
                <option value="active" ${c.accountStatus === 'active' ? 'selected' : ''}>Active</option>
                <option value="suspended" ${c.accountStatus === 'suspended' ? 'selected' : ''}>Suspended</option>
                <option value="frozen" ${c.accountStatus === 'frozen' ? 'selected' : ''}>Frozen</option>
                <option value="closed" ${c.accountStatus === 'closed' ? 'selected' : ''}>Closed</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Reason</label>
              <textarea class="form-textarea" id="status-reason" rows="2" placeholder="Reason for status change..."></textarea>
            </div>`,
          actions: [
            { label: 'Cancel', class: 'btn btn-ghost', onClick: () => Modal.close() },
            { label: 'Update Status', class: 'btn btn-primary', onClick: () => {
              const newStatus = document.querySelector('#new-status')?.value;
              const reason = document.querySelector('#status-reason')?.value?.trim() || 'Status updated by officer';
              if (newStatus === c.accountStatus) { Modal.close(); return; }
              DataStore.addStatusChange(customerId, {
                timestamp: new Date().toISOString(), fromStatus: c.accountStatus, toStatus: newStatus,
                changedBy: 'HITL Officer', reason
              });
              DataStore.updateCustomer(customerId, { accountStatus: newStatus });
              Modal.close();
              Toast.show(`Account status changed to ${newStatus}`, 'success');
              render();
            }}
          ]
        });
      });

      // Change risk
      container.querySelector('#btn-change-risk')?.addEventListener('click', () => {
        Modal.show({
          title: 'Change Risk Level',
          content: `
            <div class="form-group">
              <label class="form-label">Risk Level</label>
              <select class="form-select" id="new-risk-level">
                <option value="low" ${c.riskLevel === 'low' ? 'selected' : ''}>Low</option>
                <option value="medium" ${c.riskLevel === 'medium' ? 'selected' : ''}>Medium</option>
                <option value="high" ${c.riskLevel === 'high' ? 'selected' : ''}>High</option>
              </select>
            </div>`,
          actions: [
            { label: 'Cancel', class: 'btn btn-ghost', onClick: () => Modal.close() },
            { label: 'Update', class: 'btn btn-primary', onClick: () => {
              const newRisk = document.querySelector('#new-risk-level')?.value;
              DataStore.updateCustomer(customerId, { riskLevel: newRisk });
              Modal.close();
              Toast.show(`Risk level updated to ${newRisk}`, 'success');
              render();
            }}
          ]
        });
      });
    }

    render();
  }


  // ── Status Management ──────────────────────────────────────
  function renderStatusManagement(container) {
    let selectedIds = new Set();

    function render() {
      const customers = DataStore.getCustomers();
      const stats = DataStore.getStats();
      const allChanges = [];

      customers.forEach(c => {
        (c.statusHistory || []).forEach(h => {
          allChanges.push({ ...h, customerId: c.id, customerName: `${c.firstName} ${c.lastName}` });
        });
      });
      allChanges.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      container.innerHTML = `
        <div class="page-header animate-fade-in">
          <h1>Status Management</h1>
        </div>

        <!-- Stats -->
        <div class="stats-grid animate-slide-up" style="margin-bottom:1.5rem;">
          <div class="card stat-card stat-card-sm"><div class="stat-card-info"><span class="stat-card-value">${stats.active}</span><span class="stat-card-label">Active</span></div></div>
          <div class="card stat-card stat-card-sm"><div class="stat-card-info"><span class="stat-card-value">${stats.suspended}</span><span class="stat-card-label">Suspended</span></div></div>
          <div class="card stat-card stat-card-sm"><div class="stat-card-info"><span class="stat-card-value">${stats.frozen}</span><span class="stat-card-label">Frozen</span></div></div>
        </div>

        <!-- Bulk Actions Bar -->
        <div class="card bulk-actions-bar animate-slide-up" style="margin-bottom:1rem;${selectedIds.size > 0 ? '' : 'display:none;'}">
          <div class="card-body" style="display:flex;align-items:center;gap:1rem;">
            <span style="color:var(--color-text);font-weight:600;">${selectedIds.size} selected</span>
            <button class="btn btn-success btn-sm" id="bulk-activate">Activate</button>
            <button class="btn btn-warning btn-sm" id="bulk-suspend">Suspend</button>
            <button class="btn btn-danger btn-sm" id="bulk-freeze">Freeze</button>
            <button class="btn btn-ghost btn-sm" id="bulk-clear" style="margin-left:auto;">Clear Selection</button>
          </div>
        </div>

        <!-- Customer Table -->
        <div class="card animate-slide-up" style="margin-bottom:1.5rem;">
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr>
                <th><input type="checkbox" id="select-all"></th>
                <th>Customer</th>
                <th>Account Status</th>
                <th>KYC Status</th>
                <th>Risk</th>
                <th>Action</th>
              </tr></thead>
              <tbody>
                ${customers.map(c => `
                  <tr>
                    <td><input type="checkbox" class="row-select" data-id="${c.id}" ${selectedIds.has(c.id) ? 'checked' : ''}></td>
                    <td>
                      <div style="display:flex;align-items:center;gap:0.5rem;">
                        <div class="avatar avatar-sm">${Utils.getInitials(c.firstName, c.lastName)}</div>
                        <div><strong>${Utils.escapeHtml(c.firstName)} ${Utils.escapeHtml(c.lastName)}</strong><br><small style="color:var(--color-text-muted);">${c.id}</small></div>
                      </div>
                    </td>
                    <td><span class="badge badge-${c.accountStatus}">${c.accountStatus}</span></td>
                    <td><span class="badge badge-${c.kycStatus}">${formatKycLabel(c.kycStatus)}</span></td>
                    <td><span class="badge badge-${c.riskLevel}">${c.riskLevel}</span></td>
                    <td><button class="btn btn-outline btn-sm btn-inline-status" data-id="${c.id}">Change</button></td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Audit Log -->
        <div class="card animate-slide-up">
          <div class="card-header"><h3>📋 Audit Log</h3></div>
          <div class="card-body" style="max-height:400px;overflow-y:auto;">
            ${allChanges.length > 0 ? `
              <table class="data-table">
                <thead><tr><th>Time</th><th>Customer</th><th>Change</th><th>By</th><th>Reason</th></tr></thead>
                <tbody>${allChanges.slice(0, 30).map(ch => `
                  <tr>
                    <td style="font-size:0.8rem;white-space:nowrap;">${Utils.formatDateTime(ch.timestamp)}</td>
                    <td>${Utils.escapeHtml(ch.customerName)}</td>
                    <td><span class="badge badge-${ch.fromStatus}" style="font-size:0.7rem;">${ch.fromStatus}</span> → <span class="badge badge-${ch.toStatus}" style="font-size:0.7rem;">${ch.toStatus}</span></td>
                    <td>${ch.changedBy || '-'}</td>
                    <td style="font-size:0.85rem;max-width:200px;overflow:hidden;text-overflow:ellipsis;">${Utils.escapeHtml(ch.reason || '-')}</td>
                  </tr>`).join('')}</tbody>
              </table>` : '<p style="color:var(--color-text-muted);">No status changes recorded.</p>'}
          </div>
        </div>
      `;

      // Checkbox listeners
      container.querySelector('#select-all')?.addEventListener('change', e => {
        const checked = e.target.checked;
        container.querySelectorAll('.row-select').forEach(cb => {
          cb.checked = checked;
          if (checked) selectedIds.add(cb.dataset.id); else selectedIds.delete(cb.dataset.id);
        });
        render();
      });

      container.querySelectorAll('.row-select').forEach(cb => {
        cb.addEventListener('change', () => {
          if (cb.checked) selectedIds.add(cb.dataset.id); else selectedIds.delete(cb.dataset.id);
          render();
        });
      });

      // Bulk actions
      function bulkAction(newStatus) {
        Modal.confirm(`Bulk ${newStatus}`, `${newStatus} ${selectedIds.size} selected customer(s)?`, () => {
          selectedIds.forEach(id => {
            const c = DataStore.getCustomerById(id);
            if (c && c.accountStatus !== newStatus) {
              DataStore.addStatusChange(id, {
                timestamp: new Date().toISOString(), fromStatus: c.accountStatus, toStatus: newStatus,
                changedBy: 'HITL Officer', reason: `Bulk ${newStatus} action`
              });
              DataStore.updateCustomer(id, { accountStatus: newStatus });
            }
          });
          selectedIds.clear();
          Toast.show(`${newStatus} applied to selected customers`, 'success');
          render();
        });
      }
      container.querySelector('#bulk-activate')?.addEventListener('click', () => bulkAction('active'));
      container.querySelector('#bulk-suspend')?.addEventListener('click', () => bulkAction('suspended'));
      container.querySelector('#bulk-freeze')?.addEventListener('click', () => bulkAction('frozen'));
      container.querySelector('#bulk-clear')?.addEventListener('click', () => { selectedIds.clear(); render(); });

      // Inline status change
      container.querySelectorAll('.btn-inline-status').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const c = DataStore.getCustomerById(id);
          Modal.show({
            title: `Change Status — ${c.firstName} ${c.lastName}`,
            content: `
              <div class="form-group">
                <label class="form-label">New Status</label>
                <select class="form-select" id="inline-new-status">
                  <option value="active" ${c.accountStatus === 'active' ? 'selected' : ''}>Active</option>
                  <option value="suspended" ${c.accountStatus === 'suspended' ? 'selected' : ''}>Suspended</option>
                  <option value="frozen" ${c.accountStatus === 'frozen' ? 'selected' : ''}>Frozen</option>
                  <option value="closed" ${c.accountStatus === 'closed' ? 'selected' : ''}>Closed</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Reason</label>
                <textarea class="form-textarea" id="inline-reason" rows="2" placeholder="Reason..."></textarea>
              </div>`,
            actions: [
              { label: 'Cancel', class: 'btn btn-ghost', onClick: () => Modal.close() },
              { label: 'Update', class: 'btn btn-primary', onClick: () => {
                const ns = document.querySelector('#inline-new-status')?.value;
                const reason = document.querySelector('#inline-reason')?.value?.trim() || 'Status updated';
                if (ns !== c.accountStatus) {
                  DataStore.addStatusChange(id, { timestamp: new Date().toISOString(), fromStatus: c.accountStatus, toStatus: ns, changedBy: 'HITL Officer', reason });
                  DataStore.updateCustomer(id, { accountStatus: ns });
                }
                Modal.close();
                Toast.show('Status updated', 'success');
                render();
              }}
            ]
          });
        });
      });
    }

    render();
  }


  // Public API
  return { renderDashboard, renderCustomerQueue, renderKYCReview, renderCustomerDetail, renderStatusManagement };

})();
