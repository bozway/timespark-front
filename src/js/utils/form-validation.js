export function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input');

  inputs.forEach(input => {
    clearError(input);

    if (input.hasAttribute('required') && !input.value.trim()) {
      setError(input, 'This field is required');
      isValid = false;
    }

    if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
      setError(input, 'Please enter a valid email address');
      isValid = false;
    }

    if (input.type === 'password' && input.value) {
      const passwordErrors = validatePassword(input.value);
      if (passwordErrors.length > 0) {
        setError(input, passwordErrors.join('<br>'));
        isValid = false;
      }
    }
  });

  return isValid;
}

export function setError(element, message) {
  const inputGroup = element.parentElement;
  const errorDisplay = inputGroup.querySelector('.invalid-feedback') || 
    createErrorElement(inputGroup);
  
  element.classList.add('is-invalid');
  errorDisplay.innerHTML = message;
}

export function clearError(element) {
  element.classList.remove('is-invalid');
  const errorDisplay = element.parentElement.querySelector('.invalid-feedback');
  if (errorDisplay) {
    errorDisplay.textContent = '';
  }
}

function createErrorElement(parent) {
  const div = document.createElement('div');
  div.className = 'invalid-feedback';
  parent.appendChild(div);
  return div;
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
  }
  
  return errors;
}