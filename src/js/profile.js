import '../styles.scss';
import { initializeImageUpload } from './utils/image-upload';
import { initializeTimezones } from './utils/timezone';
import { initializeGoogleCalendar } from './utils/google-calendar';
import { initializeFormSubmission } from './utils/form-handler';
import { initializePhoneInput } from './utils/phone-input';

document.addEventListener('DOMContentLoaded', () => {
  initializeTimezones();
  initializeImageUpload();
  initializeGoogleCalendar();
  initializeFormSubmission();
  initializePhoneInput();
});