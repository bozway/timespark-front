import '../styles.scss';
import { validateForm, setError, clearError } from './utils/form-validation';
import { initializeGoogleSignIn } from './utils/google-auth';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!validateForm(form)) return;
    
    if (password.value !== confirmPassword.value) {
      setError(confirmPassword, 'Passwords do not match');
      return;
    }

    // Here you would typically send the form data to your server
    console.log('Form submitted:', {
      email: document.getElementById('email').value,
      password: password.value
    });
  });

  // Real-time password match validation
  confirmPassword.addEventListener('input', () => {
    if (password.value !== confirmPassword.value) {
      setError(confirmPassword, 'Passwords do not match');
    } else {
      clearError(confirmPassword);
    }
  });

  initializeGoogleSignIn();
});