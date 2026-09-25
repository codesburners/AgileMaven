/* ============================================================
   utils.js — Shared Utilities
   Meridian Bank — Customer Management Module
   Toast · Modal · Validation · Utility helpers
   ============================================================ */

/* ----------------------------------------------------------
   1. Toast Notification System
   ---------------------------------------------------------- */

const Toast = (() => {

  const ICONS = {
    success: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="2"/><path d="M6 10l3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    error:   `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="2"/><path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    warning: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l9 16H1L10 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M10 8v4M10 14.5v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    info:    `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="2"/><path d="M10 9v5M10 6.5v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
  };

  function _ensureContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.style.cssText = `
        position: fixed; top: 24px; right: 24px; z-index: 10000;
        display: flex; flex-direction: column; gap: 10px;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }
    return container;
  }

  function show(message, type = 'info', duration = 3000) {
    const container = _ensureContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.style.cssText = `
      display: flex; align-items: center; gap: 10px;
      padding: 14px 20px; border-radius: 10px;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 14px; font-weight: 500;
      color: #fff; pointer-events: auto;
      box-shadow: 0 8px 24px rgba(0,0,0,.18);
      transform: translateX(120%);
      transition: transform .35s cubic-bezier(.4,0,.2,1), opacity .3s ease;
      opacity: 0;
    `;

    const bgColors = {
      success: 'linear-gradient(135deg, #059669, #10b981)',
      error:   'linear-gradient(135deg, #dc2626, #ef4444)',
      warning: 'linear-gradient(135deg, #d97706, #f59e0b)',
      info:    'linear-gradient(135deg, #2563eb, #3b82f6)'
    };
    toast.style.background = bgColors[type] || bgColors.info;

    toast.innerHTML = `
      <span class="toast__icon">${ICONS[type] || ICONS.info}</span>
      <span class="toast__msg">${_escapeHtml(message)}</span>
      <button class="toast__close" style="
        background:none; border:none; color:inherit; cursor:pointer;
        margin-left:8px; padding:2px; opacity:.8; font-size:18px; line-height:1;
      " aria-label="Dismiss">&times;</button>
    `;

    container.appendChild(toast);

    /* animate in */
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    });

    /* close handler */
    const dismiss = () => {
      toast.style.transform = 'translateX(120%)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 350);
    };

    toast.querySelector('.toast__close').addEventListener('click', dismiss);

    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
  }

  function _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  return { show };
})();


/* ----------------------------------------------------------
   2. Modal System
   ---------------------------------------------------------- */

const Modal = (() => {

  let _overlay = null;

  function _createOverlay() {
    if (_overlay) return _overlay;

    _overlay = document.createElement('div');
    _overlay.id = 'modal-overlay';
    _overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9000;
      display: flex; align-items: center; justify-content: center;
      background: rgba(15, 23, 42, .55);
      backdrop-filter: blur(4px);
      opacity: 0;
      transition: opacity .25s ease;
    `;
    _overlay.addEventListener('click', (e) => {
      if (e.target === _overlay) close();
    });

    document.body.appendChild(_overlay);
    requestAnimationFrame(() => { _overlay.style.opacity = '1'; });

    return _overlay;
  }

  /**
   * show({ title, content, actions })
   * actions: [{ label, class, onClick }]
   */
  function show({ title = '', content = '', actions = [] } = {}) {
    close();                       /* close any existing modal first */
    const overlay = _createOverlay();

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
      background: #fff; border-radius: 16px;
      width: 90%; max-width: 520px;
      box-shadow: 0 24px 48px rgba(0,0,0,.18);
      font-family: 'Inter', system-ui, sans-serif;
      transform: translateY(20px) scale(.97);
      transition: transform .3s cubic-bezier(.4,0,.2,1);
      overflow: hidden;
    `;

    /* Header */
    const header = document.createElement('div');
    header.style.cssText = `
      display:flex; align-items:center; justify-content:space-between;
      padding: 20px 24px; border-bottom: 1px solid #e2e8f0;
    `;
    header.innerHTML = `
      <h3 style="margin:0; font-size:18px; font-weight:700; color:#0f172a;">${title}</h3>
      <button id="modal-close-btn" style="
        background:none; border:none; font-size:22px; cursor:pointer;
        color:#94a3b8; padding:4px; line-height:1;
      " aria-label="Close">&times;</button>
    `;

    /* Body */
    const body = document.createElement('div');
    body.className = 'modal__body';
    body.style.cssText = 'padding: 24px; color: #334155; font-size: 15px; line-height: 1.6;';
    if (typeof content === 'string') {
      body.innerHTML = content;
    } else {
      body.appendChild(content);
    }

    /* Footer / actions */
    const footer = document.createElement('div');
    footer.style.cssText = `
      display:flex; justify-content:flex-end; gap:10px;
      padding: 16px 24px; border-top: 1px solid #e2e8f0;
      background: #f8fafc;
    `;

    actions.forEach(action => {
      const btn = document.createElement('button');
      btn.textContent = action.label;
      btn.className = action.class || '';
      btn.style.cssText = `
        padding: 10px 22px; border-radius: 8px; border: 1px solid #e2e8f0;
        font-size: 14px; font-weight: 600; cursor: pointer;
        transition: background .2s, color .2s;
        font-family: inherit;
      `;

      if (action.class && action.class.includes('btn-danger')) {
        btn.style.background = '#ef4444';
        btn.style.color = '#fff';
        btn.style.border = 'none';
      } else if (action.class && action.class.includes('btn-primary')) {
        btn.style.background = '#2563eb';
        btn.style.color = '#fff';
        btn.style.border = 'none';
      } else {
        btn.style.background = '#fff';
        btn.style.color = '#334155';
      }

      btn.addEventListener('click', () => {
        if (action.onClick) action.onClick();
      });
      footer.appendChild(btn);
    });

    modal.appendChild(header);
    modal.appendChild(body);
    if (actions.length) modal.appendChild(footer);
    overlay.appendChild(modal);

    header.querySelector('#modal-close-btn').addEventListener('click', close);

    /* animate in */
    requestAnimationFrame(() => {
      modal.style.transform = 'translateY(0) scale(1)';
    });

    /* trap focus */
    modal.setAttribute('tabindex', '-1');
    modal.focus();
  }

  /**
   * Convenience confirmation dialog
   */
  function confirm(title, message, onConfirm) {
    show({
      title,
      content: `<p style="margin:0;">${message}</p>`,
      actions: [
        { label: 'Cancel',  class: 'btn-secondary', onClick: close },
        { label: 'Confirm', class: 'btn-danger',    onClick: () => { close(); onConfirm(); } }
      ]
    });
  }

  function close() {
    if (!_overlay) return;
    _overlay.style.opacity = '0';
    setTimeout(() => {
      if (_overlay) { _overlay.remove(); _overlay = null; }
    }, 250);
  }

  return { show, confirm, close };
})();


/* ----------------------------------------------------------
   3. Validation Helpers
   ---------------------------------------------------------- */

const Validate = (() => {

  function email(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val).trim());
  }

  function phone(val) {
    return /^\d{10}$/.test(String(val).trim());
  }

  function required(val) {
    return val !== null && val !== undefined && String(val).trim().length > 0;
  }

  function minLength(val, min) {
    return String(val).trim().length >= min;
  }

  function date(val) {
    if (!val) return false;
    const d = new Date(val);
    if (isNaN(d.getTime())) return false;
    return d < new Date();           /* must be in the past */
  }

  /**
   * Validate all fields inside a form that carry data-validate attributes.
   * Supported data-validate values: required, email, phone, date, minLength:N
   * Adds/removes .field-error class and shows an inline error span.
   * Returns true when every field passes.
   */
  function form(formElement) {
    const fields = formElement.querySelectorAll('[data-validate]');
    let valid = true;

    fields.forEach(field => {
      const rules = field.getAttribute('data-validate').split('|');
      const val   = field.value;
      let errorMsg = '';

      for (const rule of rules) {
        if (rule === 'required' && !required(val)) {
          errorMsg = 'This field is required';
          break;
        }
        if (rule === 'email' && val && !email(val)) {
          errorMsg = 'Enter a valid email address';
          break;
        }
        if (rule === 'phone' && val && !phone(val)) {
          errorMsg = 'Enter a valid 10-digit phone number';
          break;
        }
        if (rule === 'date' && val && !date(val)) {
          errorMsg = 'Enter a valid date in the past';
          break;
        }
        if (rule.startsWith('minLength:')) {
          const min = parseInt(rule.split(':')[1], 10);
          if (val && !minLength(val, min)) {
            errorMsg = `Minimum ${min} characters required`;
            break;
          }
        }
      }

      /* Clear previous error */
      field.classList.remove('field-error');
      const prev = field.parentNode.querySelector('.field-error-msg');
      if (prev) prev.remove();

      if (errorMsg) {
        valid = false;
        field.classList.add('field-error');
        const span = document.createElement('span');
        span.className = 'field-error-msg';
        span.style.cssText = 'color:#ef4444; font-size:12px; margin-top:4px; display:block;';
        span.textContent = errorMsg;
        field.parentNode.appendChild(span);
      }
    });

    return valid;
  }

  return { email, phone, required, minLength, date, form };
})();


/* ----------------------------------------------------------
   4. Utility Functions
   ---------------------------------------------------------- */

const Utils = (() => {

  /**
   * Generate a sequential ID with prefix, e.g. 'CUS-007'
   */
  function generateId(prefix) {
    const customers = window.DataStore ? window.DataStore.getCustomers() : [];
    let maxNum = 0;

    customers.forEach(c => {
      const parts = c.id.split('-');
      const num   = parseInt(parts[parts.length - 1], 10);
      if (num > maxNum) maxNum = num;
    });

    const next = String(maxNum + 1).padStart(3, '0');
    return `${prefix}-${next}`;
  }

  /**
   * formatDate('2026-01-15') → 'Jan 15, 2026'
   */
  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  /**
   * formatDateTime('2026-01-15T14:30:00Z') → 'Jan 15, 2026, 2:30 PM'
   */
  function formatDateTime(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    });
  }

  /**
   * timeAgo('2026-07-15T12:00:00Z') → '3 hours ago'
   */
  function timeAgo(dateStr) {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours   = Math.floor(minutes / 60);
    const days    = Math.floor(hours / 24);
    const weeks   = Math.floor(days / 7);
    const months  = Math.floor(days / 30);
    const years   = Math.floor(days / 365);

    if (seconds < 60)  return 'just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60)  return `${minutes} minutes ago`;
    if (hours === 1)   return '1 hour ago';
    if (hours < 24)    return `${hours} hours ago`;
    if (days === 1)    return '1 day ago';
    if (days < 7)      return `${days} days ago`;
    if (weeks === 1)   return '1 week ago';
    if (weeks < 5)     return `${weeks} weeks ago`;
    if (months === 1)  return '1 month ago';
    if (months < 12)   return `${months} months ago`;
    if (years === 1)   return '1 year ago';
    return `${years} years ago`;
  }

  /**
   * getInitials('Aarav', 'Sharma') → 'AS'
   */
  function getInitials(firstName, lastName) {
    const f = firstName ? firstName.charAt(0).toUpperCase() : '';
    const l = lastName  ? lastName.charAt(0).toUpperCase()  : '';
    return `${f}${l}`;
  }

  /**
   * Standard debounce
   */
  function debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /**
   * Escape HTML entities to prevent XSS
   */
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(str).replace(/[&<>"']/g, c => map[c]);
  }

  return { generateId, formatDate, formatDateTime, timeAgo, getInitials, debounce, escapeHtml };
})();


/* ----------------------------------------------------------
   Global Exports
   ---------------------------------------------------------- */
window.Toast    = Toast;
window.Modal    = Modal;
window.Validate = Validate;
window.Utils    = Utils;
