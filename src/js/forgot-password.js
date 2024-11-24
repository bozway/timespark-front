import '../styles.scss';
import { validateForm } from './utils/form-validation';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('forgotPasswordForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!validateForm(form)) return;

    const email = document.getElementById('email')?.value;
    
    // Here you would typically send the reset request to your server
    console.log('Password reset requested for:', email);
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'alert alert-success mt-3';
    successMessage.textContent = 'If an account exists with this email, you will receive password reset instructions.';
    form.insertAdjacentElement('beforebegin', successMessage);
    
    // Clear the form
    form.reset();
  });
});