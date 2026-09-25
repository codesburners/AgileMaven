// ============================================================
// App — SPA Router & Orchestration
// ============================================================

window.App = (() => {
  let currentRole = null; // 'customer' | 'officer'

  async function init() {
    await DataStore.init();
    window.addEventListener('hashchange', handleRoute);
    handleRoute();
  }

  function navigateTo(hash) {
    window.location.hash = hash;
  }

  function getRole() {
    return 'customer';
  }

  function isAuthenticated() {
    return !!sessionStorage.getItem('currentCustomerId');
  }

  function logout() {
    sessionStorage.removeItem('currentCustomerId');
    window.location.hash = '#home';
    window.location.reload();
  }

  function handleRoute() {
    let hash = window.location.hash.replace('#', '');

    if (!hash) {
      hash = 'home';
      window.location.hash = hash;
      return;
    }

    const appContainer = document.getElementById('app');

    // Public Routes
    if (hash === 'home') {
      if (window.PublicPages) window.PublicPages.renderLandingPage(appContainer);
      return;
    }
    if (hash === 'services') {
      if (window.PublicPages) window.PublicPages.renderServicesPage(appContainer);
      return;
    }
    if (hash === 'about') {
      if (window.PublicPages) window.PublicPages.renderAboutPage(appContainer);
      return;
    }
    if (hash === 'login') {
      if (window.PublicPages) window.PublicPages.renderLoginPage(appContainer);
      return;
    }

    // Auth Guard for Protected Routes
    // Allow customer-register to be public (or keep it protected depending on flow)
    // Actually, registration is usually public. Let's make customer-register public too.
    if (hash === 'customer-register') {
      renderShell(true); // render simplified shell? No, just normal shell for now.
    } else if (!isAuthenticated()) {
      if (window.Toast) window.Toast.show('Please login to access the dashboard', 'warning');
      window.location.hash = 'login';
      return;
    }

    // Render App Shell (Sidebar + Main Content)
    renderShell();
    const main = document.getElementById('main-content');
    if (!main) return;

    if (hash === 'apex-portal') {
      if (!isAuthenticated()) { window.location.hash = 'login'; return; }
      renderShell();
      const main = document.querySelector('#main-content');
      main.innerHTML = `
        <div style="width: 100%; height: calc(100vh - 40px); overflow: hidden; background: #fff;">
          <iframe src="apex-portal/index.html" style="width: 100%; height: 100%; border: none;"></iframe>
        </div>
      `;
      return;
    }

    // Route matching
    if (hash === 'customer-dashboard') CustomerPages.renderDashboard(main);
    else if (hash === 'customer-register') CustomerPages.renderRegistration(main);
    else if (hash === 'customer-profile') CustomerPages.renderProfile(main);
    else if (hash === 'customer-kyc') CustomerPages.renderKYCStatus(main);
    else if (hash === 'officer-dashboard') OfficerPages.renderDashboard(main);
    else if (hash === 'officer-queue') OfficerPages.renderCustomerQueue(main);
    else if (hash === 'officer-status') OfficerPages.renderStatusManagement(main);
    else if (hash.startsWith('officer-review-')) {
      const custId = hash.replace('officer-review-', '');
      OfficerPages.renderKYCReview(main, custId);
    }
    else if (hash.startsWith('officer-detail-')) {
      const custId = hash.replace('officer-detail-', '');
      OfficerPages.renderCustomerDetail(main, custId);
    }
    else {
      main.innerHTML = '<div class="empty-state"><h3>Page not found</h3><p>The page you\'re looking for doesn\'t exist.</p></div>';
    }

    // Update active sidebar link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.route === hash);
    });
  }

  function renderRoleSelector() {
    // Removed - defaulting directly to customer role
  }  function renderShell(isPublic = false) {
    const app = document.getElementById('app');
    
    // Don't re-render shell if it's already present
    if (document.getElementById('main-content') && document.querySelector('.sidebar')) return;

    // If registering without login, hide some nav items
    let customerNav = [
      { route: 'customer-dashboard', icon: 'home', label: 'Dashboard' },
      { route: 'customer-profile', icon: 'user', label: 'My Profile' },
      { route: 'customer-kyc', icon: 'check-circle', label: 'KYC Status' },
      { route: 'apex-portal', icon: 'monitor', label: 'Apex Portal' },
    ];

    if (!isAuthenticated()) {
      customerNav = [{ route: 'customer-register', icon: 'user-plus', label: 'Register' }];
    }

    const navItems = customerNav;
    const roleLabel = isAuthenticated() ? 'Customer' : 'Guest';
    const roleBadgeClass = isAuthenticated() ? 'badge-active' : 'badge-pending';
    
    const icons = {
      home: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
      'user-plus': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>',
      user: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      'check-circle': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    };

    app.innerHTML = `
      <div class="app-container">
        <aside class="sidebar" id="sidebar">
          <div class="sidebar-header">
            <div class="sidebar-brand">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="1.5">
                <path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4M5 21V10.87M19 21V10.87"/>
              </svg>
              <span class="sidebar-brand-text">Meridian Bank</span>
            </div>
            <button class="sidebar-toggle" id="sidebar-toggle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
          <div class="sidebar-role">
            <span class="badge ${roleBadgeClass}">${roleLabel}</span>
          </div>
          <nav class="sidebar-nav">
            ${navItems.map(item => `
              <a class="nav-link" data-route="${item.route}" href="#${item.route}">
                ${icons[item.icon]}
                <span class="nav-link-text">${item.label}</span>
              </a>`).join('')}
          </nav>
          <div class="sidebar-footer">
            ${isAuthenticated() ? `
              <button class="btn btn-ghost btn-sm" id="btn-logout" style="width:100%;justify-content:flex-start;gap:0.5rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span class="nav-link-text">Logout</span>
              </button>
            ` : `
              <button class="btn btn-ghost btn-sm" onclick="window.location.hash='home'" style="width:100%;justify-content:flex-start;gap:0.5rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <span class="nav-link-text">Back to Home</span>
              </button>
            `}
            <button class="btn btn-ghost btn-sm" id="btn-reset-data" style="width:100%;justify-content:flex-start;gap:0.5rem;margin-top:0.25rem;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
              <span class="nav-link-text">Reset Data</span>
            </button>
          </div>
        </aside>
        <main class="main-content" id="main-content"></main>
      </div>
    `;

    // Sidebar toggle (mobile)
    document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.toggle('collapsed');
    });

    document.getElementById('btn-logout')?.addEventListener('click', () => logout());

    document.getElementById('btn-reset-data')?.addEventListener('click', () => {
      Modal.confirm('Reset Data', 'This will reset all customer data to the original demo data. Are you sure?', async () => {
        await DataStore.resetToDefaults();
        Toast.show('Data reset to defaults', 'success');
        handleRoute();
      });
    });

    // Nav link clicks
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', e => {
        // Close sidebar on mobile after navigation
        if (window.innerWidth < 768) {
          document.getElementById('sidebar')?.classList.add('collapsed');
        }
      });
    });
  }

  // Public API
  return { init, navigateTo, getRole, logout };
})();

// Boot the app
document.addEventListener('DOMContentLoaded', () => App.init());
