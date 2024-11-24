export function initializeFormValidation() {
  const form = document.querySelector('form');
  if (!form) return;

  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  
  // Only add password validation if both fields exist
  if (password && confirmPassword) {
    confirmPassword.addEventListener('input', () => {
      if (password.value !== confirmPassword.value) {
        setError(confirmPassword, 'Passwords do not match');
      } else {
        clearError(confirmPassword);
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      setError(confirmPassword, 'Passwords do not match');
      return;
    }

    // Here you would typically send the form data to your server
    const formData = {
      email: document.getElementById('email')?.value
    };
    
    if (password) {
      formData.password = password.value;
    }

    console.log('Form submitted:', formData);
  });
}

function setError(element, message) {
  const inputGroup = element.parentElement;
  const errorDisplay = inputGroup.querySelector('.invalid-feedback') || 
    createErrorElement(inputGroup);
  
  element.classList.add('is-invalid');
  errorDisplay.textContent = message;
}

function clearError(element) {
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