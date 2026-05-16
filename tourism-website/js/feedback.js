// ============================================================
//  FEEDBACK.JS — Feedback Form Validation
// ============================================================

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
  setTimeout(() => toast.remove(), 4000);
}

function setFieldState(input, isValid, msg = '') {
  input.classList.remove('is-valid', 'is-invalid');
  const parent = input.closest('.mb-3, .mb-4, .rating-group') || input.parentElement;
  const invalids = parent.querySelectorAll('.invalid-feedback');
  const valids   = parent.querySelectorAll('.valid-feedback');

  if (isValid) {
    input.classList.add('is-valid');
    invalids.forEach(f => f.classList.remove('show'));
    valids.forEach(f => { f.classList.add('show'); if (msg) f.textContent = msg; });
  } else {
    input.classList.add('is-invalid');
    valids.forEach(f => f.classList.remove('show'));
    invalids.forEach(f => { f.classList.add('show'); if (msg) f.textContent = msg; });
  }
}

(function initFeedback() {
  const form = document.getElementById('feedbackForm');
  if (!form) return;

  const nameEl    = document.getElementById('fbName');
  const emailEl   = document.getElementById('fbEmail');
  const destEl    = document.getElementById('fbDest');
  const dateEl    = document.getElementById('fbDate');
  const commentEl = document.getElementById('fbComment');
  const charCount = document.getElementById('charCount');

  // Set max date to today
  if (dateEl) {
    const today = new Date().toISOString().split('T')[0];
    dateEl.setAttribute('max', today);
  }

  // Char counter
  if (commentEl && charCount) {
    commentEl.addEventListener('input', () => {
      const len = commentEl.value.length;
      charCount.textContent = `${len}/500`;
      charCount.style.color = len > 480 ? '#ef4444' : '#6b7280';
      if (len > 0) validateComment(commentEl);
    });
  }

  // Real-time
  nameEl    && nameEl.addEventListener('input',    () => validateName(nameEl));
  emailEl   && emailEl.addEventListener('input',   () => validateEmail(emailEl));
  destEl    && destEl.addEventListener('change',   () => validateDest(destEl));
  dateEl    && dateEl.addEventListener('change',   () => validateDate(dateEl));

  // --- Star rating ---
  const ratingInputs = document.querySelectorAll('input[name="rating"]');
  let ratingSelected = 0;

  ratingInputs.forEach(input => {
    input.addEventListener('change', () => {
      ratingSelected = parseInt(input.value);
      const errEl = document.getElementById('ratingError');
      if (errEl) errEl.classList.remove('show');
    });
  });

  // --- Validators ---
  function validateName(el) {
    const v = el.value.trim();
    if (!v) { setFieldState(el, false, 'Name is required.'); return false; }
    if (v.length < 2) { setFieldState(el, false, 'Name must be at least 2 characters.'); return false; }
    setFieldState(el, true, '✓'); return true;
  }

  function validateEmail(el) {
    const v = el.value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!v) { setFieldState(el, false, 'Email is required.'); return false; }
    if (!re.test(v)) { setFieldState(el, false, 'Enter a valid email address.'); return false; }
    setFieldState(el, true, '✓'); return true;
  }

  function validateDest(el) {
    if (!el.value) { setFieldState(el, false, 'Please select a destination.'); return false; }
    setFieldState(el, true); return true;
  }

  function validateDate(el) {
    if (!el.value) { setFieldState(el, false, 'Visit date is required.'); return false; }
    const selected = new Date(el.value);
    const today    = new Date(); today.setHours(0,0,0,0);
    if (selected > today) { setFieldState(el, false, 'Visit date cannot be in the future.'); return false; }
    setFieldState(el, true, '✓'); return true;
  }

  function validateComment(el) {
    const v = el.value.trim();
    if (!v) { setFieldState(el, false, 'Comment is required.'); return false; }
    if (v.length < 20) { setFieldState(el, false, `At least 20 characters needed. (${v.length}/20)`); return false; }
    if (v.length > 500) { setFieldState(el, false, 'Max 500 characters.'); return false; }
    setFieldState(el, true, '✓ Great feedback!'); return true;
  }

  function validateRating() {
    const errEl = document.getElementById('ratingError');
    if (ratingSelected === 0) {
      if (errEl) errEl.classList.add('show');
      return false;
    }
    if (errEl) errEl.classList.remove('show');
    return true;
  }

  // --- Submit ---
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const v1 = validateName(nameEl);
    const v2 = validateEmail(emailEl);
    const v3 = validateDest(destEl);
    const v4 = validateDate(dateEl);
    const v5 = validateComment(commentEl);
    const v6 = validateRating();

    if (v1 && v2 && v3 && v4 && v5 && v6) {
      // Save to localStorage
      const feedbacks = JSON.parse(localStorage.getItem('tourismFeedbacks') || '[]');
      feedbacks.push({
        name: nameEl.value.trim(),
        email: emailEl.value.trim(),
        destination: destEl.value,
        rating: ratingSelected,
        date: dateEl.value,
        comment: commentEl.value.trim(),
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('tourismFeedbacks', JSON.stringify(feedbacks));

      // Show success screen
      const successDiv = document.getElementById('feedbackSuccess');
      const formSection = document.getElementById('feedbackFormSection');
      if (successDiv && formSection) {
        formSection.style.display = 'none';
        successDiv.style.display = 'block';
        document.getElementById('successName').textContent = nameEl.value.trim();
      } else {
        showToast('Thank you for your feedback! 🌟', 'success');
        form.reset();
        ratingSelected = 0;
        if (charCount) charCount.textContent = '0/500';
        document.querySelectorAll('.form-control, .form-select').forEach(el => {
          el.classList.remove('is-valid', 'is-invalid');
        });
      }
    } else {
      showToast('Please complete all required fields.', 'error');
    }
  });
})();
