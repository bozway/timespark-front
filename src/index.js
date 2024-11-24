import './styles.scss';
import { initializeFormValidation } from './js/form-validation';
import { initializeGoogleSignIn } from './js/google-signin';

// Only initialize components if they're needed on the current page
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on a page with a form before initializing form validation
  if (document.querySelector('form')) {
    initializeFormValidation();
  }
  
  // Check if we have Google sign-in button before initializing
  if (document.querySelector('.btn-google')) {
    initializeGoogleSignIn();
  }
});