import { useState } from 'react';
import './index.css';

export default function App() {
  // Application Mode Toggle
  const [viewMode, setViewMode] = useState<'catalog' | 'portal'>('catalog');
  
  // Navigation States
  const [catalogTab, setCatalogTab] = useState('Accounts');
  const [portalTab, setPortalTab] = useState('Overview');

  // Interactive Calculators
  const [fdAmount, setFdAmount] = useState<number>(100000);
  const [fdYears, setFdYears] = useState<number>(3);
  const [dailyLimit, setDailyLimit] = useState<number>(100000);

  // Transfer Form State
  const [recipient, setRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferSuccess, setTransferSuccess] = useState(false);

  const handleApply = (productName: string) => {
    alert(`Application Initiated for: "${productName}". Redirecting to identity verification...`);
  };

  return (
    <div className="app-container">
      {/* Dynamic Header */}
      <header className="header-card">
        <div>
          <h1 className="brand-title">Apex Banking Systems</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {viewMode === 'catalog' ? "Explore banking products & calculate yields" : "Manage active accounts, transfers & safety parameters"}
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="mode-switcher">
          <button 
            className={`mode-btn ${viewMode === 'catalog' ? 'active' : ''}`}
            onClick={() => setViewMode('catalog')}
          >
            Product Catalog
          </button>
          <button 
            className={`mode-btn ${viewMode === 'portal' ? 'active' : ''}`}
            onClick={() => setViewMode('portal')}
          >
            Customer Portal
          </button>
        </div>
      </header>

      {/* Dynamic Navigation Strip */}
      <div className="nav-tab-container">
        <div className="nav-tabs">
          {viewMode === 'catalog' ? (
            ['Trending', 'Accounts', 'Deposits', 'Cards', 'Loans'].map((tab) => (
              <button key={tab} className={`tab-btn ${catalogTab === tab ? 'active' : ''}`} onClick={() => setCatalogTab(tab)}>
                {tab}
              </button>
            ))
          ) : (
            ['Overview', 'Fund Transfers', 'Card & Limits', 'Statements', 'Service Requests', 'Mailbox & Profile'].map((tab) => (
              <button key={tab} className={`tab-btn ${portalTab === tab ? 'active' : ''}`} onClick={() => setPortalTab(tab)}>
                {tab}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Content Render */}
      <main>
        {/* ===================== MODE 1: PRODUCTS CATALOG ===================== */}
        {viewMode === 'catalog' && (
          <div>
            {catalogTab === 'Trending' && (
              <div className="grid-container">
                <div className="card highlight">
                  <div>
                    <span className="badge orange">🔥 Featured Yield</span>
                    <h3>Accelerator Savings Account</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Earn up to 7.8% p.a. interest with no balance maintenance fee.</p>
                  </div>
                  <button className="primary-btn" style={{ background: 'var(--accent-red)' }} onClick={() => handleApply('Accelerator Savings')}>Apply Now</button>
                </div>
              </div>
            )}

            {catalogTab === 'Accounts' && (
              <div className="grid-container">
                <div className="card">
                  <div>
                    <span className="badge blue">Retail</span>
                    <h3>Savings Account</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Standard everyday account with free debit card and netbanking access.</p>
                  </div>
                  <button className="primary-btn" onClick={() => handleApply('Savings Account')}>Open Savings Account</button>
                </div>

                <div className="card">
                  <div>
                    <span className="badge blue">Commercial</span>
                    <h3>Current Account</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Unlimited transactions and overdraft support for business operations.</p>
                  </div>
                  <button className="primary-btn" onClick={() => handleApply('Current Account')}>Open Current Account</button>
                </div>

                <div className="card">
                  <div>
                    <span className="badge blue">Corporate</span>
                    <h3>Salary Account</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Zero balance account with automated corporate payroll credits.</p>
                  </div>
                  <button className="primary-btn" onClick={() => handleApply('Salary Account')}>Setup Salary Account</button>
                </div>

                <div className="card">
                  <div>
                    <span className="badge teal">Tax Saving</span>
                    <h3>PPF / PDF Account</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>15-year tax-exempt wealth accumulation under Section 80C.</p>
                  </div>
                  <button className="primary-btn" onClick={() => handleApply('PPF/PDF Account')}>Open Tax Saved Account</button>
                </div>
              </div>
            )}

            {catalogTab === 'Deposits' && (
              <div className="grid-container">
                <div className="card">
                  <div>
                    <span className="badge green">Fixed Returns</span>
                    <h3>Fixed Deposit (FD)</h3>
                    <div className="widget-box">
                      <div className="widget-row">
                        <label style={{ fontSize: '0.85rem' }}>Amount (₹)</label>
                        <input type="number" className="input-field" style={{ width: '100px', padding: '0.3rem' }} value={fdAmount} onChange={(e) => setFdAmount(Number(e.target.value))} />
                      </div>
                      <div className="widget-row">
                        <label style={{ fontSize: '0.85rem' }}>Tenure (Years)</label>
                        <input type="number" className="input-field" style={{ width: '60px', padding: '0.3rem' }} value={fdYears} onChange={(e) => setFdYears(Number(e.target.value))} />
                      </div>
                      <div className="widget-row" style={{ marginTop: '0.5rem', color: 'var(--accent-green)', fontWeight: 'bold' }}>
                        <span>Yield (7.5%)</span>
                        <span>₹{Math.round(fdAmount * Math.pow(1.075, fdYears)).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                  <button className="primary-btn" onClick={() => handleApply('Fixed Deposit')}>Book FD Now</button>
                </div>

                <div className="card">
                  <div>
                    <span className="badge green">Habitual Saving</span>
                    <h3>Recurring Deposit (RD)</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Invest monthly starting from ₹500 with guaranteed quarterly compounding.</p>
                  </div>
                  <button className="primary-btn" onClick={() => handleApply('Recurring Deposit')}>Start RD Plan</button>
                </div>

                <div className="card">
                  <div>
                    <span className="badge blue">Physical Vault</span>
                    <h3>Safe Deposit Locker</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Biometrically secured vault storage for physical assets and documents.</p>
                  </div>
                  <button className="primary-btn" onClick={() => handleApply('Safe Deposit Locker')}>Check Locker Availability</button>
                </div>
              </div>
            )}

            {catalogTab === 'Cards' && (
              <div className="grid-container">
                <div className="card">
                  <div>
                    <span className="badge blue">Credit Line</span>
                    <h3>Credit Cards</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enjoy 45 days interest-free spending with reward point redemptions.</p>
                  </div>
                  <button className="primary-btn" onClick={() => handleApply('Credit Card')}>Apply For Credit Card</button>
                </div>

                <div className="card">
                  <div>
                    <span className="badge blue">Linked Balance</span>
                    <h3>Debit Cards</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Contactless tap-and-pay chip cards linked directly to your balance.</p>
                  </div>
                  <button className="primary-btn" onClick={() => handleApply('Debit Card')}>Request Debit Card</button>
                </div>
              </div>
            )}

            {catalogTab === 'Loans' && (
              <div className="grid-container">
                <div className="card">
                  <div>
                    <span className="badge teal">Property</span>
                    <h3>Home Loan</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>30-year property financing starting at **8.45% p.a.**</p>
                  </div>
                  <button className="primary-btn" onClick={() => handleApply('Home Loan')}>Apply for Home Loan</button>
                </div>

                <div className="card">
                  <div>
                    <span className="badge teal">Unsecured</span>
                    <h3>Personal Loan</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Instant collateral-free funds up to ₹20,00,000 processed in 2 hours.</p>
                  </div>
                  <button className="primary-btn" onClick={() => handleApply('Personal Loan')}>Check Instant Eligibility</button>
                </div>

                <div className="card">
                  <div>
                    <span className="badge teal">Vehicle</span>
                    <h3>Auto Loan</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Up to 90% on-road price financing for personal cars.</p>
                  </div>
                  <button className="primary-btn" onClick={() => handleApply('Auto Loan')}>Apply for Auto Loan</button>
                </div>

                <div className="card">
                  <div>
                    <span className="badge teal">Academic</span>
                    <h3>Education Loan</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Funding for global education with deferred moratorium repayment options.</p>
                  </div>
                  <button className="primary-btn" onClick={() => handleApply('Education Loan')}>Apply for Education Support</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== MODE 2: CUSTOMER PORTAL ===================== */}
        {viewMode === 'portal' && (
          <div>
            {portalTab === 'Overview' && (
              <div className="grid-container">
                <div className="card" style={{ gridColumn: 'span 2' }}>
                  <h3>Linked Accounts Summary</h3>
                  <table className="data-table">
                    <thead>
                      <tr><th>Account Type</th><th>Account No</th><th>Available Balance</th></tr>
                    </thead>
                    <tbody>
                      <tr><td><strong>Savings Account</strong></td><td>•••• 4821</td><td><strong style={{ color: 'var(--accent-blue)' }}>₹2,45,800.00</strong></td></tr>
                      <tr><td><strong>Current Account</strong></td><td>•••• 9102</td><td><strong>₹12,10,000.00</strong></td></tr>
                      <tr><td><strong>Fixed Deposit (FD)</strong></td><td>FD-88392</td><td><strong>₹5,00,000.00</strong></td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="card">
                  <h3>Quick Portal Operations</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button className="primary-btn" onClick={() => setPortalTab('Fund Transfers')}>Send Money (UPI/NEFT)</button>
                    <button className="primary-btn" style={{ background: '#0ea5e9' }} onClick={() => setPortalTab('Statements')}>Get Statements</button>
                    <button className="primary-btn" style={{ background: '#10b981' }} onClick={() => { setViewMode('catalog'); setCatalogTab('Deposits'); }}>+ Book New FD</button>
                  </div>
                </div>
              </div>
            )}

            {portalTab === 'Fund Transfers' && (
              <div className="card" style={{ maxWidth: '480px' }}>
                <h3>Transfers (NEFT / RTGS / IMPS / UPI)</h3>
                {transferSuccess ? (
                  <div style={{ background: '#d1fae5', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
                    <h4 style={{ color: '#065f46', margin: 0 }}>Transfer Executed!</h4>
                    <p style={{ fontSize: '0.9rem' }}>₹{transferAmount} sent to beneficiary {recipient}.</p>
                    <button className="primary-btn" onClick={() => setTransferSuccess(false)}>Make Another Transfer</button>
                  </div>
                ) : (
                  <div style={{ marginTop: '1rem' }}>
                    <div className="form-group">
                      <label>Beneficiary VPA / Account Number</label>
                      <input className="input-field" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. john@upi" />
                    </div>
                    <div className="form-group">
                      <label>Amount (₹)</label>
                      <input type="number" className="input-field" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} placeholder="5000" />
                    </div>
                    <button className="primary-btn" onClick={() => setTransferSuccess(true)}>Authorize & Send Funds</button>
                  </div>
                )}
              </div>
            )}

            {portalTab === 'Card & Limits' && (
              <div className="card" style={{ maxWidth: '480px' }}>
                <h3>Transaction Limit Controls</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Set daily spending limit across internet banking and debit cards.</p>
                <div style={{ margin: '1.5rem 0' }}>
                  <label>Daily Ceiling: <strong>₹{dailyLimit.toLocaleString('en-IN')}</strong></label>
                  <input type="range" min="10000" max="500000" step="10000" value={dailyLimit} onChange={(e) => setDailyLimit(Number(e.target.value))} style={{ width: '100%', marginTop: '0.5rem' }} />
                </div>
                <button className="primary-btn" onClick={() => alert('Daily security spending threshold updated.')}>Save Limits</button>
              </div>
            )}

            {portalTab === 'Statements' && (
              <div className="card">
                <h3>Account Statements</h3>
                <p style={{ color: 'var(--text-muted)' }}>Generate and download verified statements for tax & audit tracking.</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button className="primary-btn" style={{ width: 'auto' }} onClick={() => alert('Downloading PDF Statement...')}>Download PDF Report</button>
                  <button className="primary-btn" style={{ width: 'auto', background: '#10b981' }} onClick={() => alert('Exporting CSV File...')}>Export CSV Log</button>
                </div>
              </div>
            )}

            {portalTab === 'Service Requests' && (
              <div className="card">
                <h3>Service Request Tracking</h3>
                <table className="data-table">
                  <thead><tr><th>Ticket ID</th><th>Service Details</th><th>Status</th></tr></thead>
                  <tbody>
                    <tr><td>SR-9082</td><td>New Cheque Book Delivery</td><td><span style={{ background: '#fef3c7', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>In Progress</span></td></tr>
                    <tr><td>SR-8112</td><td>Email Update Authorization</td><td><span style={{ background: '#d1fae5', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Resolved</span></td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {portalTab === 'Mailbox & Profile' && (
              <div className="card" style={{ maxWidth: '500px' }}>
                <h3>Bank Support Secure Mailbox</h3>
                <div style={{ background: 'var(--panel-sub)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', marginTop: '1rem' }}>
                  <strong>Notice from Apex Helpdesk:</strong>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem' }}>Your annual interest certificate for tax filing is now available for direct download in the statements tab.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}