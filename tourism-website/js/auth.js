// ============================================================
//  AUTH.JS — Login & Register Validation + localStorage
// ============================================================

// ---------- UTILITY ----------
function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer') ||
    (() => {
      const c = document.createElement('div');
      c.id = 'toastContainer';
      c.className = 'toast-container-custom';
      document.body.appendChild(c);
      return c;
    })();

  const icon = type === 'success' ? '✅' : '❌';
  const toast = document.createElement('div');
  toast.className = `toast-custom toast-${type}`;
  toast.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3800);
}

function setFieldState(input, isValid, msg = '') {
  input.classList.remove('is-valid', 'is-invalid');
  const fb = input.parentElement.querySelector('.invalid-feedback, .valid-feedback');
  if (isValid) {
    input.classList.add('is-valid');
    if (fb && fb.classList.contains('valid-feedback')) {
      fb.classList.add('show');
      if (msg) fb.textContent = msg;
    }
    if (fb && fb.classList.contains('invalid-feedback')) fb.classList.remove('show');
  } else {
    input.classList.add('is-invalid');
    if (fb && fb.classList.contains('invalid-feedback')) {
      fb.classList.add('show');
      if (msg) fb.textContent = msg;
    }
    if (fb && fb.classList.contains('valid-feedback')) fb.classList.remove('show');
  }
}

function clearFieldState(input) {
  input.classList.remove('is-valid', 'is-invalid');
  const feedbacks = input.closest('.mb-3, .mb-4') ?
    input.closest('.mb-3, .mb-4').querySelectorAll('.invalid-feedback, .valid-feedback') : [];
  feedbacks.forEach(f => f.classList.remove('show'));
}

// ============================================================
//  REGISTER PAGE
// ============================================================
(function initRegister() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  const fullname   = document.getElementById('fullname');
  const email      = document.getElementById('regEmail');
  const phone      = document.getElementById('phone');
  const country    = document.getElementById('country');
  const password   = document.getElementById('regPassword');
  const confirm    = document.getElementById('confirmPassword');
  const terms      = document.getElementById('terms');
  const strengthFill = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');

  // --- Real-time validators ---
  fullname && fullname.addEventListener('input', () => validateFullname(fullname));
  email    && email.addEventListener('input',    () => validateEmail(email));
  phone    && phone.addEventListener('input',    () => validatePhone(phone));
  password && password.addEventListener('input', () => {
    validatePassword(password);
    updateStrength(password.value);
    if (confirm && confirm.value) validateConfirm(password, confirm);
  });
  confirm  && confirm.addEventListener('input',  () => validateConfirm(password, confirm));
  country  && country.addEventListener('change', () => validateCountry(country));

  // --- Toggle password visibility ---
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const isText = target.type === 'text';
      target.type = isText ? 'password' : 'text';
      btn.innerHTML = isText ? '👁️' : '🙈';
    });
  });

  // --- Strength meter ---
  function updateStrength(pwd) {
    if (!strengthFill) return;
    let score = 0;
    if (pwd.length >= 8)              score++;
    if (/[A-Z]/.test(pwd))            score++;
    if (/[0-9]/.test(pwd))            score++;
    if (/[^A-Za-z0-9]/.test(pwd))     score++;

    const levels = [
      { pct: '0%',   bg: '#e2e8f0', label: '' },
      { pct: '25%',  bg: '#ef4444', label: '🔴 Weak' },
      { pct: '50%',  bg: '#f59e0b', label: '🟡 Fair' },
      { pct: '75%',  bg: '#3b82f6', label: '🔵 Good' },
      { pct: '100%', bg: '#22c55e', label: '🟢 Strong' },
    ];
    const lvl = levels[score] || levels[0];
    strengthFill.style.width = lvl.pct;
    strengthFill.style.background = lvl.bg;
    if (strengthText) strengthText.textContent = lvl.label;
    strengthText && (strengthText.style.color = lvl.bg);
  }

  // --- Field validators ---
  function validateFullname(el) {
    const v = el.value.trim();
    if (!v) { setFieldState(el, false, 'Full name is required.'); return false; }
    if (!/^[a-zA-Z\s]{3,}$/.test(v)) { setFieldState(el, false, 'Min 3 letters, only alphabets.'); return false; }
    setFieldState(el, true, '✓ Looks good!'); return true;
  }

  function validateEmail(el) {
    const v = el.value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!v) { setFieldState(el, false, 'Email is required.'); return false; }
    if (!re.test(v)) { setFieldState(el, false, 'Enter a valid email address.'); return false; }
    // Check duplicate in localStorage
    const users = JSON.parse(localStorage.getItem('tourismUsers') || '[]');
    if (users.some(u => u.email === v)) { setFieldState(el, false, 'Email already registered. Try login.'); return false; }
    setFieldState(el, true, '✓ Email available!'); return true;
  }

  function validatePhone(el) {
    const v = el.value.trim();
    if (!v) { setFieldState(el, false, 'Phone number is required.'); return false; }
    if (!/^\d{10}$/.test(v)) { setFieldState(el, false, 'Enter a valid 10-digit phone number.'); return false; }
    setFieldState(el, true, '✓ Valid number!'); return true;
  }

  function validateCountry(el) {
    if (!el.value) { setFieldState(el, false, 'Please select your country.'); return false; }
    setFieldState(el, true); return true;
  }

  function validatePassword(el) {
    const v = el.value;
    if (!v) { setFieldState(el, false, 'Password is required.'); return false; }
    if (v.length < 8) { setFieldState(el, false, 'At least 8 characters required.'); return false; }
    if (!/[a-zA-Z]/.test(v)) { setFieldState(el, false, 'Must include at least one letter.'); return false; }
    if (!/[0-9]/.test(v)) { setFieldState(el, false, 'Must include at least one number.'); return false; }
    setFieldState(el, true, '✓ Strong password!'); return true;
  }

  function validateConfirm(pwdEl, cnfEl) {
    if (!cnfEl.value) { setFieldState(cnfEl, false, 'Please confirm your password.'); return false; }
    if (cnfEl.value !== pwdEl.value) { setFieldState(cnfEl, false, 'Passwords do not match.'); return false; }
    setFieldState(cnfEl, true, '✓ Passwords match!'); return true;
  }

  // --- Submit ---
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const v1 = validateFullname(fullname);
    const v2 = validateEmail(email);
    const v3 = validatePhone(phone);
    const v4 = validateCountry(country);
    const v5 = validatePassword(password);
    const v6 = validateConfirm(password, confirm);
    let termsOk = true;
    if (terms && !terms.checked) {
      document.getElementById('termsFeedback').classList.add('show');
      termsOk = false;
    } else if (terms) {
      document.getElementById('termsFeedback').classList.remove('show');
    }

    if (v1 && v2 && v3 && v4 && v5 && v6 && termsOk) {
      const users = JSON.parse(localStorage.getItem('tourismUsers') || '[]');
      users.push({
        fullname: fullname.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        country: country.value,
        password: password.value,
        registeredAt: new Date().toISOString()
      });
      localStorage.setItem('tourismUsers', JSON.stringify(users));
      showToast('🎉 Registration successful! Redirecting to login...', 'success');
      setTimeout(() => window.location.href = 'login.html', 2000);
    } else {
      showToast('Please fix the errors above.', 'error');
    }
  });
})();

// ============================================================
//  LOGIN PAGE
// ============================================================
(function initLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const email    = document.getElementById('loginEmail');
  const password = document.getElementById('loginPassword');

  email    && email.addEventListener('input',    () => validateLoginEmail(email));
  password && password.addEventListener('input', () => validateLoginPassword(password));

  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const isText = target.type === 'text';
      target.type = isText ? 'password' : 'text';
      btn.innerHTML = isText ? '👁️' : '🙈';
    });
  });

  function validateLoginEmail(el) {
    const v = el.value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!v) { setFieldState(el, false, 'Email is required.'); return false; }
    if (!re.test(v)) { setFieldState(el, false, 'Enter a valid email address.'); return false; }
    setFieldState(el, true); return true;
  }

  function validateLoginPassword(el) {
    if (!el.value) { setFieldState(el, false, 'Password is required.'); return false; }
    if (el.value.length < 6) { setFieldState(el, false, 'Password is too short.'); return false; }
    setFieldState(el, true); return true;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const v1 = validateLoginEmail(email);
    const v2 = validateLoginPassword(password);
    if (!v1 || !v2) { showToast('Please fill all fields correctly.', 'error'); return; }

    const users = JSON.parse(localStorage.getItem('tourismUsers') || '[]');
    const user  = users.find(u => u.email === email.value.trim() && u.password === password.value);

    if (user) {
      // Check Remember Me
      if (document.getElementById('rememberMe')?.checked) {
        localStorage.setItem('tourismLoggedIn', JSON.stringify({ email: user.email, fullname: user.fullname }));
      } else {
        sessionStorage.setItem('tourismLoggedIn', JSON.stringify({ email: user.email, fullname: user.fullname }));
      }
      showToast(`Welcome back, ${user.fullname}! 🌍`, 'success');
      setTimeout(() => window.location.href = 'index.html', 2000);
    } else {
      showToast('Invalid email or password. Please try again.', 'error');
      setFieldState(email, false, 'Email or password incorrect.');
      setFieldState(password, false, 'Email or password incorrect.');
    }
  });
})();
