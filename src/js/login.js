import '../styles.scss';
import { validateForm } from './utils/form-validation';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (!form) return;

  // Create error alert container
  const alertContainer = document.createElement('div');
  alertContainer.className = 'mb-4';
  form.insertBefore(alertContainer, form.firstChild);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm(form)) return;

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simulate API call - replace with actual API call
    try {
      const userExists = await checkUserExists(email);
      
      if (!userExists) {
        showError('User not found. <a href="/pages/signup.html" class="alert-link">Sign up now</a>');
        return;
      }

      const isPasswordValid = await validatePassword(email, password);
      
      if (!isPasswordValid) {
        showError('Incorrect password');
        return;
      }

      // Success - redirect to dashboard or home page
      console.log('Login successful');
      
    } catch (error) {
      showError('An error occurred. Please try again later.');
    }
  });

  function showError(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show';
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Remove any existing alerts
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);
  }
});

// Simulate API calls - replace with actual API integration
async function checkUserExists(email) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // For demo: return false for test@example.com
  return email !== 'test@example.com';
}

async function validatePassword(email, password) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // For demo: return false for 'wrongpass'
  return password !== 'wrongpass';
}