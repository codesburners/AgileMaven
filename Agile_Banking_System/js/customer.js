// ============================================================
// Customer Pages — Customer-facing views
// ============================================================

window.CustomerPages = (() => {

  // Track the currently "logged-in" customer (by ID stored in sessionStorage)
  function currentCustomerId() {
    return sessionStorage.getItem('currentCustomerId');
  }
  function setCurrentCustomer(id) {
    sessionStorage.setItem('currentCustomerId', id);
  }

  // ── Dashboard ──────────────────────────────────────────────
  function renderDashboard(container) {
    const custId = currentCustomerId();
    const customer = custId ? DataStore.getCustomerById(custId) : null;

    if (!customer) {
      container.innerHTML = `
        <div class="page-header">
          <h1>Customer Dashboard</h1>
        </div>
        <div class="empty-state animate-fade-in">
          <div class="empty-state-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h3>Welcome to Meridian Banking</h3>
          <p>Get started by registering as a new customer and completing your KYC verification.</p>
          <button class="btn btn-primary btn-lg" id="btn-go-register">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            Register Now
          </button>
          <p style="margin-top:1.5rem;color:var(--color-text-muted);font-size:0.85rem;">Already registered? Select your profile below.</p>
          <div id="existing-customers" style="margin-top:1rem;display:flex;flex-wrap:wrap;gap:0.75rem;justify-content:center;"></div>
        </div>`;
      container.querySelector('#btn-go-register')?.addEventListener('click', () => App.navigateTo('customer-register'));

      // Show existing customers as selectable chips
      const customers = DataStore.getCustomers();
      const wrapper = container.querySelector('#existing-customers');
      customers.forEach(c => {
        const chip = document.createElement('button');
        chip.className = 'btn btn-outline btn-sm';
        chip.textContent = `${c.firstName} ${c.lastName} (${c.id})`;
        chip.addEventListener('click', () => { setCurrentCustomer(c.id); App.navigateTo('customer-dashboard'); });
        wrapper.appendChild(chip);
      });
      return;
    }

    // Logged-in dashboard
    const kycProgress = { pending: 25, under_review: 50, approved: 100, rejected: 0 };
    const kycPercent = kycProgress[customer.kycStatus] || 0;
    const greeting = getGreeting();

    container.innerHTML = `
      <div class="page-header animate-fade-in">
        <h1>${greeting}, ${Utils.escapeHtml(customer.firstName)}!</h1>
        <div class="page-header-actions">
          <button class="btn btn-ghost btn-sm" id="btn-switch-customer">Switch Profile</button>
        </div>
      </div>

      <div class="dashboard-grid animate-slide-up">
        <!-- Welcome Card -->
        <div class="card stat-card" style="grid-column: span 2;">
          <div class="stat-card-icon" style="background:var(--gradient-primary);">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div class="stat-card-info">
            <span class="stat-card-label">Customer ID</span>
            <span class="stat-card-value">${customer.id}</span>
          </div>
          <span class="badge badge-${customer.accountStatus}" style="margin-left:auto;">${customer.accountStatus}</span>
        </div>

        <!-- KYC Status -->
        <div class="card" style="grid-column: span 2;">
          <div class="card-header"><h3>KYC Verification Status</h3></div>
          <div class="card-body">
            <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;">
              <span class="badge badge-${customer.kycStatus}" style="font-size:0.9rem;padding:0.4rem 1rem;">${formatKycStatus(customer.kycStatus)}</span>
              <span style="color:var(--color-text-muted);font-size:0.85rem;">Last updated: ${Utils.formatDate(customer.registrationDate)}</span>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width:${kycPercent}%;"></div>
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:0.5rem;font-size:0.75rem;color:var(--color-text-muted);">
              <span>Submitted</span><span>Under Review</span><span>Approved</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <div class="card-header"><h3>Quick Actions</h3></div>
          <div class="card-body" style="display:flex;flex-direction:column;gap:0.75rem;">
            <button class="btn btn-primary" id="btn-view-profile">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              View My Profile
            </button>
            <button class="btn btn-outline" id="btn-view-kyc">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>
              KYC Status
            </button>
            <button class="btn btn-primary" id="btn-apex-portal" style="background: linear-gradient(135deg, var(--clr-primary), var(--clr-accent)); border: none;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              Launch Apex Portal
            </button>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card">
          <div class="card-header"><h3>Recent Activity</h3></div>
          <div class="card-body">
            ${renderActivityFeed(customer)}
          </div>
        </div>
      </div>
    `;

    container.querySelector('#btn-switch-customer')?.addEventListener('click', () => {
      sessionStorage.removeItem('currentCustomerId');
      App.navigateTo('customer-dashboard');
    });
    container.querySelector('#btn-view-profile')?.addEventListener('click', () => App.navigateTo('customer-profile'));
    container.querySelector('#btn-view-kyc')?.addEventListener('click', () => App.navigateTo('customer-kyc'));
    container.querySelector('#btn-apex-portal')?.addEventListener('click', () => App.navigateTo('apex-portal'));
  }

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  function formatKycStatus(s) {
    return { pending: 'Pending', under_review: 'AI Review (CDD/EDD)', approved: 'Approved', rejected: 'Rejected' }[s] || s;
  }

  function renderActivityFeed(customer) {
    if (!customer.statusHistory || customer.statusHistory.length === 0) {
      return '<p style="color:var(--color-text-muted);font-size:0.85rem;">No activity yet.</p>';
    }
    const items = customer.statusHistory.slice(-5).reverse();
    return `<div class="timeline">${items.map(h => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <strong>${h.fromStatus} → ${h.toStatus}</strong>
          <p style="margin:0.2rem 0 0;font-size:0.8rem;color:var(--color-text-muted);">${h.reason || 'Status updated'} · ${Utils.timeAgo(h.timestamp)}</p>
        </div>
      </div>`).join('')}</div>`;
  }


  // ── Registration Wizard ────────────────────────────────────
  let regData = {};
  let regStep = 0;
  let regDocuments = [];

  function renderRegistration(container) {
    regData = {};
    regStep = 0;
    regDocuments = [];
    renderRegStep(container);
  }

  function renderRegStep(container) {
    const steps = ['Personal Info', 'Contact Details', 'Document Upload', 'Review & Submit'];
    container.innerHTML = `
      <div class="page-header animate-fade-in">
        <h1>New Customer Registration</h1>
      </div>
      <div class="card animate-slide-up" style="max-width:800px;margin:0 auto;">
        <div class="card-body">
          <!-- Stepper -->
          <div class="stepper">
            ${steps.map((s, i) => `
              <div class="step ${i < regStep ? 'step-completed' : ''} ${i === regStep ? 'step-active' : ''}">
                <div class="step-number">${i < regStep ? '✓' : i + 1}</div>
                <div class="step-label">${s}</div>
              </div>`).join('')}
          </div>
          <div id="step-content" style="margin-top:2rem;"></div>
          <div style="display:flex;justify-content:space-between;margin-top:2rem;">
            <button class="btn btn-ghost" id="btn-prev" ${regStep === 0 ? 'style="visibility:hidden"' : ''}>← Previous</button>
            <button class="btn btn-primary" id="btn-next">${regStep === 3 ? 'Submit Registration' : 'Next →'}</button>
          </div>
        </div>
      </div>`;

    const stepContent = container.querySelector('#step-content');
    if (regStep === 0) renderStep1(stepContent);
    else if (regStep === 1) renderStep2(stepContent);
    else if (regStep === 2) renderStep3(stepContent);
    else renderStep4(stepContent);

    container.querySelector('#btn-prev')?.addEventListener('click', () => {
      saveCurrentStep(container);
      regStep--;
      renderRegStep(container);
    });
    container.querySelector('#btn-next')?.addEventListener('click', () => {
      if (regStep === 3) {
        submitRegistration(container);
      } else {
        if (!validateCurrentStep(container)) return;
        saveCurrentStep(container);
        regStep++;
        renderRegStep(container);
      }
    });
  }

  function renderStep1(el) {
    el.innerHTML = `
      <h3 style="margin-bottom:1.5rem;color:var(--color-text);">Personal Information</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div class="form-group">
          <label class="form-label">First Name *</label>
          <input class="form-input" id="reg-firstName" value="${regData.firstName || ''}" data-validate="required" placeholder="Enter first name">
        </div>
        <div class="form-group">
          <label class="form-label">Last Name *</label>
          <input class="form-input" id="reg-lastName" value="${regData.lastName || ''}" data-validate="required" placeholder="Enter last name">
        </div>
        <div class="form-group">
          <label class="form-label">Date of Birth *</label>
          <input class="form-input" id="reg-dob" type="date" value="${regData.dateOfBirth || ''}" data-validate="required">
        </div>
        <div class="form-group">
          <label class="form-label">Gender</label>
          <select class="form-select" id="reg-gender">
            <option value="">Select Gender</option>
            <option value="Male" ${regData.gender === 'Male' ? 'selected' : ''}>Male</option>
            <option value="Female" ${regData.gender === 'Female' ? 'selected' : ''}>Female</option>
            <option value="Other" ${regData.gender === 'Other' ? 'selected' : ''}>Other</option>
          </select>
        </div>
      </div>`;
  }

  function renderStep2(el) {
    el.innerHTML = `
      <h3 style="margin-bottom:1.5rem;color:var(--color-text);">Contact Details</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div class="form-group">
          <label class="form-label">Email Address *</label>
          <input class="form-input" id="reg-email" type="email" value="${regData.email || ''}" data-validate="required|email" placeholder="email@example.com">
        </div>
        <div class="form-group">
          <label class="form-label">Phone Number *</label>
          <input class="form-input" id="reg-phone" value="${regData.phone || ''}" data-validate="required|phone" placeholder="10-digit phone">
        </div>
        <div class="form-group" style="grid-column:span 2;">
          <label class="form-label">Address *</label>
          <textarea class="form-textarea" id="reg-address" rows="3" data-validate="required" placeholder="Full address">${regData.address || ''}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">City *</label>
          <input class="form-input" id="reg-city" value="${regData.city || ''}" data-validate="required" placeholder="City">
        </div>
        <div class="form-group">
          <label class="form-label">Country *</label>
          <input class="form-input" id="reg-country" value="${regData.country || 'India'}" data-validate="required">
        </div>
      </div>`;
  }

  function renderStep3(el) {
    el.innerHTML = `
      <h3 style="margin-bottom:1.5rem;color:var(--color-text);">Document Upload</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div class="form-group">
          <label class="form-label">Document Type</label>
          <select class="form-select" id="reg-docType">
            <option value="Aadhaar Card">Aadhaar Card</option>
            <option value="PAN Card">PAN Card</option>
            <option value="Passport">Passport</option>
            <option value="Driver's License">Driver's License</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Document Name</label>
          <input class="form-input" id="reg-docName" placeholder="e.g. aadhaar_front.pdf">
        </div>
      </div>
      <div class="upload-zone" id="upload-zone" style="margin-top:1rem; cursor:pointer;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <p style="margin-top:0.75rem;color:var(--color-text-muted);">Click to browse and upload file</p>
        <p style="font-size:0.75rem;color:var(--color-text-muted);">Supported: PDF, JPG, PNG (Max 5MB)</p>
        <input type="file" id="reg-fileInput" style="display:none;" accept=".pdf,.jpg,.jpeg,.png">
      </div>
      <button class="btn btn-outline btn-sm" id="btn-add-doc" style="margin-top:1rem;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Document
      </button>
      <div id="doc-list" style="margin-top:1.5rem;display:flex;flex-direction:column;gap:0.75rem;">
        ${regDocuments.map((d, i) => renderDocCard(d, i)).join('')}
      </div>
      ${regDocuments.length === 0 ? '<p style="margin-top:1rem;color:var(--color-text-muted);font-size:0.85rem;">No documents added yet. Add at least one document to proceed.</p>' : ''}
    `;

    el.querySelector('#btn-add-doc')?.addEventListener('click', () => {
      const docType = el.querySelector('#reg-docType').value;
      const docName = el.querySelector('#reg-docName').value.trim();
      if (!docName) { Toast.show('Please enter a document name or upload a file', 'warning'); return; }
      addDocument(docType, docName);
    });

    const fileInput = el.querySelector('#reg-fileInput');
    el.querySelector('#upload-zone')?.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput?.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const docType = el.querySelector('#reg-docType').value;
        addDocument(docType, file.name);
        fileInput.value = ''; // Reset input
      }
    });

    function addDocument(type, name) {
      regDocuments.push({ id: `DOC-${Date.now()}`, type: type, fileName: name, uploadDate: new Date().toISOString(), status: 'pending' });
      el.querySelector('#reg-docName').value = '';
      const docList = el.querySelector('#doc-list');
      docList.innerHTML = regDocuments.map((d, i) => renderDocCard(d, i)).join('');
      attachDocRemoveListeners(el);
      Toast.show('Document uploaded successfully', 'success');
    }

    attachDocRemoveListeners(el);
  }

  function renderDocCard(doc, idx) {
    return `
      <div class="card" style="padding:1rem;display:flex;align-items:center;gap:1rem;">
        <div style="width:40px;height:40px;border-radius:8px;background:var(--color-primary-alpha);display:flex;align-items:center;justify-content:center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <div style="flex:1;">
          <strong style="color:var(--color-text);">${Utils.escapeHtml(doc.fileName)}</strong>
          <p style="margin:0;font-size:0.8rem;color:var(--color-text-muted);">${doc.type}</p>
        </div>
        <span class="badge badge-pending">Pending</span>
        <button class="btn btn-ghost btn-sm doc-remove" data-idx="${idx}" title="Remove">✕</button>
      </div>`;
  }

  function attachDocRemoveListeners(el) {
    el.querySelectorAll('.doc-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        regDocuments.splice(parseInt(btn.dataset.idx), 1);
        renderStep3(el.querySelector ? el : el);
        // re-render step 3
        const stepContent = document.querySelector('#step-content');
        if (stepContent) renderStep3(stepContent);
      });
    });
  }

  function renderStep4(el) {
    el.innerHTML = `
      <h3 style="margin-bottom:1.5rem;color:var(--color-text);">Review & Submit</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">
        <div class="card" style="padding:1.25rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
            <h4 style="color:var(--color-primary);margin:0;">Personal Info</h4>
            <button class="btn btn-ghost btn-sm edit-step" data-step="0">Edit</button>
          </div>
          <div class="review-field"><span>Name</span><strong>${Utils.escapeHtml(regData.firstName || '')} ${Utils.escapeHtml(regData.lastName || '')}</strong></div>
          <div class="review-field"><span>Date of Birth</span><strong>${regData.dateOfBirth || '-'}</strong></div>
          <div class="review-field"><span>Gender</span><strong>${regData.gender || '-'}</strong></div>
        </div>
        <div class="card" style="padding:1.25rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
            <h4 style="color:var(--color-primary);margin:0;">Contact Details</h4>
            <button class="btn btn-ghost btn-sm edit-step" data-step="1">Edit</button>
          </div>
          <div class="review-field"><span>Email</span><strong>${Utils.escapeHtml(regData.email || '')}</strong></div>
          <div class="review-field"><span>Phone</span><strong>${regData.phone || '-'}</strong></div>
          <div class="review-field"><span>Address</span><strong>${Utils.escapeHtml(regData.address || '')} ${Utils.escapeHtml(regData.city || '')}, ${Utils.escapeHtml(regData.country || '')}</strong></div>
        </div>
        <div class="card" style="padding:1.25rem;grid-column:span 2;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
            <h4 style="color:var(--color-primary);margin:0;">Documents (${regDocuments.length})</h4>
            <button class="btn btn-ghost btn-sm edit-step" data-step="2">Edit</button>
          </div>
          ${regDocuments.length > 0 ? regDocuments.map(d => `
            <div style="display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0;border-bottom:1px solid var(--color-border);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span>${Utils.escapeHtml(d.fileName)}</span>
              <span class="badge badge-pending" style="margin-left:auto;">${d.type}</span>
            </div>`).join('') : '<p style="color:var(--color-warning);">⚠ No documents uploaded</p>'}
        </div>
      </div>
      <div style="margin-top:1.5rem;padding:1rem;border-radius:var(--radius-md);background:var(--color-surface-hover);">
        <label style="display:flex;align-items:center;gap:0.75rem;cursor:pointer;color:var(--color-text);">
          <input type="checkbox" id="reg-terms"> I confirm that all the information provided is accurate and I agree to the terms and conditions.
        </label>
      </div>`;

    el.querySelectorAll('.edit-step').forEach(btn => {
      btn.addEventListener('click', () => {
        regStep = parseInt(btn.dataset.step);
        renderRegStep(document.querySelector('#main-content'));
      });
    });
  }

  function saveCurrentStep(container) {
    if (regStep === 0) {
      regData.firstName = container.querySelector('#reg-firstName')?.value?.trim() || regData.firstName;
      regData.lastName = container.querySelector('#reg-lastName')?.value?.trim() || regData.lastName;
      regData.dateOfBirth = container.querySelector('#reg-dob')?.value || regData.dateOfBirth;
      regData.gender = container.querySelector('#reg-gender')?.value || regData.gender;
    } else if (regStep === 1) {
      regData.email = container.querySelector('#reg-email')?.value?.trim() || regData.email;
      regData.phone = container.querySelector('#reg-phone')?.value?.trim() || regData.phone;
      regData.address = container.querySelector('#reg-address')?.value?.trim() || regData.address;
      regData.city = container.querySelector('#reg-city')?.value?.trim() || regData.city;
      regData.country = container.querySelector('#reg-country')?.value?.trim() || regData.country;
    }
  }

  function validateCurrentStep(container) {
    if (regStep === 0) {
      const fn = container.querySelector('#reg-firstName')?.value?.trim();
      const ln = container.querySelector('#reg-lastName')?.value?.trim();
      const dob = container.querySelector('#reg-dob')?.value;
      if (!fn || !ln) { Toast.show('Please fill in all required fields', 'warning'); return false; }
      if (!dob) { Toast.show('Please enter your date of birth', 'warning'); return false; }
      // Age check
      const age = (new Date() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000);
      if (age < 18) { Toast.show('You must be at least 18 years old', 'error'); return false; }
      return true;
    }
    if (regStep === 1) {
      const email = container.querySelector('#reg-email')?.value?.trim();
      const phone = container.querySelector('#reg-phone')?.value?.trim();
      const address = container.querySelector('#reg-address')?.value?.trim();
      const city = container.querySelector('#reg-city')?.value?.trim();
      if (!email || !Validate.email(email)) { Toast.show('Please enter a valid email', 'warning'); return false; }
      if (!phone || !Validate.phone(phone)) { Toast.show('Please enter a valid 10-digit phone number', 'warning'); return false; }
      if (!address || !city) { Toast.show('Please fill in all required fields', 'warning'); return false; }
      return true;
    }
    if (regStep === 2) {
      if (regDocuments.length === 0) { Toast.show('Please add at least one document', 'warning'); return false; }
      return true;
    }
    return true;
  }

  function submitRegistration(container) {
    const terms = container.querySelector('#reg-terms');
    if (!terms || !terms.checked) {
      Toast.show('Please accept the terms and conditions', 'warning');
      return;
    }

    // Show loading
    const btn = container.querySelector('#btn-next');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="btn-spinner"></span> Submitting...';
    }

    setTimeout(() => {
      const newId = Utils.generateId('CUS');
      const customer = {
        id: newId,
        firstName: regData.firstName,
        lastName: regData.lastName,
        email: regData.email,
        phone: regData.phone,
        dateOfBirth: regData.dateOfBirth,
        gender: regData.gender || '',
        address: regData.address,
        city: regData.city,
        country: regData.country || 'India',
        registrationDate: new Date().toISOString(),
        kycStatus: 'under_review',
        accountStatus: 'active',
        riskLevel: 'low',
        documents: regDocuments,
        statusHistory: [{
          timestamp: new Date().toISOString(),
          fromStatus: 'none',
          toStatus: 'under_review',
          changedBy: 'System',
          reason: 'Automated CDD & EDD Review Initiated'
        }],
        notes: ''
      };

      DataStore.addCustomer(customer);
      setCurrentCustomer(newId);
      Toast.show('Registration successful! Automated CDD/EDD Review initiated.', 'success');
      App.navigateTo('customer-dashboard');
    }, 1500);
  }


  // ── Profile Page ───────────────────────────────────────────
  function renderProfile(container) {
    const custId = currentCustomerId();
    const customer = custId ? DataStore.getCustomerById(custId) : null;
    if (!customer) {
      container.innerHTML = '<div class="empty-state"><h3>No profile selected</h3><p>Please register or select a customer from the dashboard.</p><button class="btn btn-primary" id="btn-go-dash">Go to Dashboard</button></div>';
      container.querySelector('#btn-go-dash')?.addEventListener('click', () => App.navigateTo('customer-dashboard'));
      return;
    }

    let editing = false;

    function render() {
      container.innerHTML = `
        <div class="page-header animate-fade-in">
          <h1>My Profile</h1>
          <div class="page-header-actions">
            <button class="btn ${editing ? 'btn-success' : 'btn-outline'}" id="btn-toggle-edit">
              ${editing ? '💾 Save Changes' : '✏️ Edit Profile'}
            </button>
          </div>
        </div>

        <div class="profile-layout animate-slide-up">
          <!-- Profile Header Card -->
          <div class="card" style="text-align:center;padding:2rem;">
            <div class="avatar avatar-lg" style="margin:0 auto 1rem;">
              ${Utils.getInitials(customer.firstName, customer.lastName)}
            </div>
            <h2 style="margin:0;color:var(--color-text);">${Utils.escapeHtml(customer.firstName)} ${Utils.escapeHtml(customer.lastName)}</h2>
            <p style="color:var(--color-text-muted);margin:0.25rem 0 1rem;">${customer.id}</p>
            <div style="display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap;">
              <span class="badge badge-${customer.kycStatus}">KYC: ${formatKycStatus(customer.kycStatus)}</span>
              <span class="badge badge-${customer.accountStatus}">${customer.accountStatus}</span>
              <span class="badge badge-${customer.riskLevel}">Risk: ${customer.riskLevel}</span>
            </div>
          </div>

          <!-- Personal Info -->
          <div class="card">
            <div class="card-header"><h3>Personal Information</h3></div>
            <div class="card-body">
              <div class="info-grid">
                ${infoField('First Name', 'firstName', customer.firstName, editing)}
                ${infoField('Last Name', 'lastName', customer.lastName, editing)}
                ${infoField('Date of Birth', 'dateOfBirth', customer.dateOfBirth, editing, 'date')}
                ${infoField('Gender', 'gender', customer.gender || '-', editing)}
              </div>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="card">
            <div class="card-header"><h3>Contact Information</h3></div>
            <div class="card-body">
              <div class="info-grid">
                ${infoField('Email', 'email', customer.email, editing, 'email')}
                ${infoField('Phone', 'phone', customer.phone, editing)}
                ${infoField('City', 'city', customer.city, editing)}
                ${infoField('Country', 'country', customer.country, editing)}
              </div>
              ${editing ? '' : `<div class="info-row" style="margin-top:0.75rem;">
                <span class="info-label">Address</span>
                <span class="info-value">${Utils.escapeHtml(customer.address)}</span>
              </div>`}
              ${editing ? `<div class="form-group" style="margin-top:0.75rem;">
                <label class="form-label">Address</label>
                <textarea class="form-textarea" id="edit-address" rows="2">${Utils.escapeHtml(customer.address)}</textarea>
              </div>` : ''}
            </div>
          </div>

          <!-- Documents -->
          <div class="card">
            <div class="card-header"><h3>Documents</h3></div>
            <div class="card-body">
              ${customer.documents && customer.documents.length > 0 ? customer.documents.map(d => `
                <div style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem 0;border-bottom:1px solid var(--color-border);">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <div style="flex:1;">
                    <strong style="color:var(--color-text);">${Utils.escapeHtml(d.fileName)}</strong>
                    <p style="margin:0;font-size:0.75rem;color:var(--color-text-muted);">${d.type} · ${Utils.formatDate(d.uploadDate)}</p>
                  </div>
                  <span class="badge badge-${d.status}">${d.status}</span>
                </div>`).join('') : '<p style="color:var(--color-text-muted);">No documents uploaded.</p>'}
            </div>
          </div>

          <!-- Status History -->
          <div class="card">
            <div class="card-header"><h3>Status History</h3></div>
            <div class="card-body">
              ${renderActivityFeed(customer)}
            </div>
          </div>
        </div>
      `;

      container.querySelector('#btn-toggle-edit')?.addEventListener('click', () => {
        if (editing) {
          // Save
          const updates = {};
          const fields = ['firstName', 'lastName', 'email', 'phone', 'city', 'country'];
          fields.forEach(f => {
            const el = container.querySelector(`#edit-${f}`);
            if (el) updates[f] = el.value.trim();
          });
          const dobEl = container.querySelector('#edit-dateOfBirth');
          if (dobEl) updates.dateOfBirth = dobEl.value;
          const genderEl = container.querySelector('#edit-gender');
          if (genderEl) updates.gender = genderEl.value;
          const addrEl = container.querySelector('#edit-address');
          if (addrEl) updates.address = addrEl.value.trim();

          DataStore.updateCustomer(customer.id, updates);
          Object.assign(customer, updates);
          editing = false;
          Toast.show('Profile updated successfully', 'success');
        } else {
          editing = true;
        }
        render();
      });
    }

    render();
  }

  function infoField(label, key, value, editing, type = 'text') {
    if (editing) {
      return `<div class="form-group"><label class="form-label">${label}</label><input class="form-input" type="${type}" id="edit-${key}" value="${Utils.escapeHtml(String(value))}"></div>`;
    }
    return `<div class="info-row"><span class="info-label">${label}</span><span class="info-value">${Utils.escapeHtml(String(value))}</span></div>`;
  }


  // ── KYC Status Page ────────────────────────────────────────
  function renderKYCStatus(container) {
    const custId = currentCustomerId();
    const customer = custId ? DataStore.getCustomerById(custId) : null;
    if (!customer) {
      container.innerHTML = '<div class="empty-state"><h3>No profile selected</h3><button class="btn btn-primary" id="btn-go-dash2">Go to Dashboard</button></div>';
      container.querySelector('#btn-go-dash2')?.addEventListener('click', () => App.navigateTo('customer-dashboard'));
      return;
    }

    const stages = [
      { key: 'submitted', label: 'Submitted', icon: '📄' },
      { key: 'under_review', label: 'Under Review', icon: '🔍' },
      { key: 'verified', label: 'Verified', icon: '✅' },
      { key: 'approved', label: 'Approved', icon: '🎉' }
    ];

    const statusMap = { pending: 0, under_review: 1, approved: 3, rejected: -1 };
    const currentStage = statusMap[customer.kycStatus] ?? 0;
    const isRejected = customer.kycStatus === 'rejected';

    container.innerHTML = `
      <div class="page-header animate-fade-in">
        <h1>KYC Verification Status</h1>
      </div>

      <div class="animate-slide-up" style="max-width:800px;margin:0 auto;">
        ${isRejected ? `
          <div class="card" style="border-left:4px solid var(--color-danger);margin-bottom:1.5rem;">
            <div class="card-body" style="display:flex;align-items:center;gap:1rem;">
              <div style="font-size:2rem;">⚠️</div>
              <div>
                <h3 style="color:var(--color-danger);margin:0;">KYC Rejected</h3>
                <p style="color:var(--color-text-muted);margin:0.25rem 0 0;">Your KYC verification was not approved. Please review the feedback and resubmit your documents.</p>
              </div>
              <button class="btn btn-danger btn-sm" id="btn-resubmit" style="margin-left:auto;">Resubmit</button>
            </div>
          </div>` : ''}

        <!-- Progress Stepper -->
        <div class="card" style="margin-bottom:1.5rem;">
          <div class="card-body">
            <div class="stepper">
              ${stages.map((s, i) => `
                <div class="step ${i <= currentStage && !isRejected ? (i < currentStage ? 'step-completed' : 'step-active') : ''} ${isRejected ? 'step-rejected' : ''}">
                  <div class="step-number">${i < currentStage && !isRejected ? '✓' : s.icon}</div>
                  <div class="step-label">${s.label}</div>
                </div>`).join('')}
            </div>
          </div>
        </div>

        <!-- Details -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">
          <div class="card">
            <div class="card-header"><h3>Submission Details</h3></div>
            <div class="card-body">
              <div class="info-row"><span class="info-label">Submitted On</span><span class="info-value">${Utils.formatDate(customer.registrationDate)}</span></div>
              <div class="info-row"><span class="info-label">Current Status</span><span class="info-value"><span class="badge badge-${customer.kycStatus}">${formatKycStatus(customer.kycStatus)}</span></span></div>
              <div class="info-row"><span class="info-label">Risk Level</span><span class="info-value"><span class="badge badge-${customer.riskLevel}">${customer.riskLevel}</span></span></div>
              <div class="info-row"><span class="info-label">Estimated Review</span><span class="info-value">2-3 Business Days</span></div>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><h3>Documents</h3></div>
            <div class="card-body">
              ${customer.documents && customer.documents.length > 0 ? customer.documents.map(d => `
                <div style="display:flex;align-items:center;gap:0.5rem;padding:0.5rem 0;border-bottom:1px solid var(--color-border);">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span style="flex:1;font-size:0.85rem;">${Utils.escapeHtml(d.fileName)}</span>
                  <span class="badge badge-${d.status}" style="font-size:0.7rem;">${d.status}</span>
                </div>`).join('') : '<p style="color:var(--color-text-muted);">No documents.</p>'}
            </div>
          </div>

          <!-- Review Notes -->
          <div class="card" style="grid-column:span 2;">
            <div class="card-header"><h3>Reviewer Notes</h3></div>
            <div class="card-body">
              ${customer.notes ? `<p style="color:var(--color-text);">${Utils.escapeHtml(customer.notes)}</p>` : '<p style="color:var(--color-text-muted);">No reviewer notes yet.</p>'}
            </div>
          </div>
        </div>

        <!-- Timeline -->
        <div class="card" style="margin-top:1.5rem;">
          <div class="card-header"><h3>Verification Timeline</h3></div>
          <div class="card-body">${renderActivityFeed(customer)}</div>
        </div>
      </div>
    `;

    container.querySelector('#btn-resubmit')?.addEventListener('click', () => {
      DataStore.updateCustomer(customer.id, { kycStatus: 'pending' });
      DataStore.addStatusChange(customer.id, {
        timestamp: new Date().toISOString(),
        fromStatus: 'rejected',
        toStatus: 'pending',
        changedBy: 'Customer',
        reason: 'KYC documents resubmitted'
      });
      Toast.show('KYC resubmitted for review', 'success');
      App.navigateTo('customer-kyc');
    });
  }

  // Public API
  return { renderDashboard, renderRegistration, renderProfile, renderKYCStatus };

})();
