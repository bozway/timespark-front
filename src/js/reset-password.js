import '../styles.scss';
import { validateForm, setError, clearError } from './utils/form-validation';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('resetPasswordForm');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!validateForm(form)) return;
    
    if (password.value !== confirmPassword.value) {
      setError(confirmPassword, 'Passwords do not match');
      return;
    }

    // Here you would typically send the new password to your server
    console.log('Password reset submitted');
  });

  // Real-time password match validation
  confirmPassword.addEventListener('input', () => {
    if (password.value !== confirmPassword.value) {
      setError(confirmPassword, 'Passwords do not match');
    } else {
      clearError(confirmPassword);
    }
  });
});