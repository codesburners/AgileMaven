// ============================================================
// Public Pages — Landing & Authentication
// ============================================================

window.PublicPages = (() => {

  /**
   * Renders the public site shell (navbar & footer) and injects the content
   */
  function renderPublicShell(container, contentHTML) {
    container.innerHTML = `
      <nav class="public-navbar">
        <a href="#home" class="brand">
          <div class="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4M5 21V10.87M19 21V10.87"/>
            </svg>
          </div>
          <span class="brand-text">Meridian Bank</span>
        </a>
        <div class="public-nav-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#about">About Us</a>
        </div>
        <div class="public-nav-actions">
          <a href="#login" class="btn btn-ghost btn-sm">Login</a>
          <a href="#customer-register" class="btn btn-primary btn-sm">Open Account</a>
        </div>
      </nav>
      
      <div class="public-layout">
        ${contentHTML}
        
        <footer class="public-footer">
          &copy; ${new Date().getFullYear()} Meridian Bank. All rights reserved.
        </footer>
      </div>
    `;
  }

  /**
   * Renders the main landing page
   */
  function renderLandingPage(container) {
    const content = `
      <section class="hero-section" id="vanta-hero">
        <div class="hero-content" style="animation: slideUp 0.8s ease forwards, floatAnimation 6s ease-in-out infinite 0.8s;">
          <span class="hero-badge">Next-Generation Banking</span>
          <h1 class="hero-title">Banking Made Simple,<br>Secure, and Agile.</h1>
          <p class="hero-subtitle">
            Experience seamless digital onboarding, real-time transaction monitoring, and a premium banking experience tailored to your lifestyle.
          </p>
          <div class="hero-actions">
            <a href="#customer-register" class="btn btn-primary pulse-btn">Open an Account</a>
            <a href="#login" class="btn btn-outline" style="background:var(--clr-bg-card)">Login to Dashboard</a>
          </div>
        </div>
      </section>

      <section class="features-section">
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h3 class="feature-title">Instant Verification</h3>
            <p class="feature-desc">Our automated KYC process gets you verified and ready to bank in minutes, not days.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 class="feature-title">Bank-Grade Security</h3>
            <p class="feature-desc">State-of-the-art encryption and fraud monitoring to keep your assets completely safe.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <h3 class="feature-title">Digital First</h3>
            <p class="feature-desc">Manage your entire financial life from our intuitive web and mobile dashboard.</p>
          </div>
        </div>
      </section>
    `;
    renderPublicShell(container, content);

    // Initialize 3D Background if Vanta is loaded
    if (window.VANTA && window.VANTA.NET) {
      // Clean up previous instance if exists to prevent memory leaks
      if (window.vantaEffect) window.vantaEffect.destroy();
      
      window.vantaEffect = window.VANTA.NET({
        el: "#vanta-hero",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x0085ca,      // Meridian Bank Accent Blue
        backgroundColor: 0xf4f6f9, // Light Theme Background
        points: 12.00,
        maxDistance: 22.00,
        spacing: 18.00,
        showDots: true
      });
    }
  }

  /**
   * Renders the Services page
   */
  function renderServicesPage(container) {
    const content = `
      <section class="hero-section" style="padding: 4rem 1rem; min-height: auto;">
        <div class="hero-content">
          <h1 class="hero-title" style="font-size: 3rem;">Our Financial Services</h1>
          <p class="hero-subtitle">Comprehensive solutions for your personal and business banking needs.</p>
        </div>
      </section>
      <section class="features-section" style="background: transparent;">
        <div class="features-grid">
          <div class="feature-card animate-slide-up" style="animation-delay: 0.1s">
            <h3 class="feature-title">Checking & Savings</h3>
            <p class="feature-desc">High-yield accounts with no hidden fees and instant access to your funds.</p>
          </div>
          <div class="feature-card animate-slide-up" style="animation-delay: 0.2s">
            <h3 class="feature-title">Wealth Management</h3>
            <p class="feature-desc">Expert advisory and automated portfolios to help grow your wealth sustainably.</p>
          </div>
          <div class="feature-card animate-slide-up" style="animation-delay: 0.3s">
            <h3 class="feature-title">Loans & Mortgages</h3>
            <p class="feature-desc">Competitive rates and instant approvals for personal loans and home financing.</p>
          </div>
          <div class="feature-card animate-slide-up" style="animation-delay: 0.4s">
            <h3 class="feature-title">Credit Cards</h3>
            <p class="feature-desc">Premium rewards, zero foreign transaction fees, and robust fraud protection.</p>
          </div>
        </div>
      </section>
    `;
    renderPublicShell(container, content);
  }

  /**
   * Renders the About Us page
   */
  function renderAboutPage(container) {
    const content = `
      <section class="hero-section" style="padding: 4rem 1rem; min-height: auto;">
        <div class="hero-content">
          <h1 class="hero-title" style="font-size: 3rem;">About Meridian Bank</h1>
          <p class="hero-subtitle">Building the future of digital banking on a foundation of trust and agility.</p>
        </div>
      </section>
      <section class="features-section" style="background: transparent; max-width: 800px; margin: 0 auto;">
        <div style="color: var(--clr-text-secondary); line-height: 1.8; font-size: 1.1rem; padding: 2rem;">
          <p style="margin-bottom: 1.5rem;">Founded with the vision of modernizing personal finance, <strong>Meridian Bank</strong> leverages state-of-the-art AI technology and robust security protocols to offer a banking experience that is entirely centered around the customer.</p>
          <p style="margin-bottom: 1.5rem;">Our proprietary automated KYC/CDD systems ensure compliance without sacrificing user experience, bringing institutional-grade banking straight to your devices in minutes.</p>
          <p>We believe banking should be transparent, secure, and effortlessly agile.</p>
        </div>
      </section>
    `;
    renderPublicShell(container, content);
  }

  /**
   * Renders the login page
   */
  function renderLoginPage(container) {
    const content = `
      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your Meridian Bank account</p>
          </div>
          <form id="login-form">
            <div class="form-group">
              <label class="form-label">Customer ID or Email</label>
              <input type="text" class="form-input" id="login-id" placeholder="e.g. CUS-001 or email@domain.com" data-validate="required">
              <span class="form-error">Please enter your ID or Email</span>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" class="form-input" id="login-password" placeholder="••••••••" value="password123" data-validate="required">
              <span class="form-error">Please enter your password</span>
            </div>
            
            <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 1rem;">
              Sign In
            </button>
          </form>
          
          <div class="login-divider">or</div>
          
          <button class="btn btn-outline" id="btn-demo-login" style="width: 100%; justify-content: center;">
            Auto-Login (Demo)
          </button>
          
          <div class="login-footer">
            Don't have an account? <a href="#customer-register">Register here</a>
          </div>
        </div>
      </div>
    `;
    
    renderPublicShell(container, content);

    // Event Listeners
    const form = document.getElementById('login-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (window.Validate.form(form)) {
          const loginId = document.getElementById('login-id').value.trim();
          handleLogin(loginId);
        }
      });
    }

    const demoBtn = document.getElementById('btn-demo-login');
    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        handleLogin('CUS-001'); // Auto-login as Aarav Sharma for demo
      });
    }
  }

  function handleLogin(identifier) {
    const customers = window.DataStore.getCustomers();
    const customer = customers.find(c => 
      c.id.toLowerCase() === identifier.toLowerCase() || 
      c.email.toLowerCase() === identifier.toLowerCase()
    );

    if (customer) {
      window.Toast.show('Login successful!', 'success');
      // Store auth state
      sessionStorage.setItem('currentCustomerId', customer.id);
      window.location.hash = 'customer-dashboard';
    } else {
      window.Toast.show('Invalid ID or Email. (Hint: use CUS-001)', 'error');
    }
  }

  return { renderLandingPage, renderServicesPage, renderAboutPage, renderLoginPage };
})();
