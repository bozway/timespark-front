import { getCountries, getCountryCallingCode, parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

export function initializePhoneInput() {
  const countrySelect = document.getElementById('phoneCountry');
  const phoneInput = document.getElementById('phoneNumber');
  const phoneDisplay = document.getElementById('fullPhoneNumber');
  
  // Populate country codes
  getCountries().forEach(country => {
    const code = getCountryCallingCode(country);
    const option = new Option(`${country} (+${code})`, country);
    countrySelect.add(option);
  });

  // Set default country (e.g., US)
  countrySelect.value = 'US';
  updatePhoneDisplay();

  // Update display when either input changes
  countrySelect.addEventListener('change', () => {
    updatePhoneDisplay();
    validatePhoneNumber();
  });
  
  phoneInput.addEventListener('input', () => {
    formatPhoneNumber();
    updatePhoneDisplay();
    validatePhoneNumber();
  });

  function formatPhoneNumber() {
    const country = countrySelect.value;
    let number = phoneInput.value.replace(/\D/g, '');

    // Format based on country
    if (country === 'US') {
      // Format: (XXX) XXX-XXXX
      if (number.length > 0) {
        number = number.match(new RegExp('.{1,4}$|.{1,3}', 'g'))
                      .join('-')
                      .replace(/^(\d{3})-?/, '($1) ');
      }
    } else if (country === 'CN') {
      // Format: XXX XXXX XXXX
      if (number.length > 0) {
        number = number.match(new RegExp('.{1,4}$|.{1,4}', 'g'))
                      .join(' ');
      }
    }

    phoneInput.value = number;
  }

  function validatePhoneNumber() {
    const country = countrySelect.value;
    const number = phoneInput.value.replace(/\D/g, '');
    const fullNumber = `+${getCountryCallingCode(country)}${number}`;
    
    try {
      const isValid = isValidPhoneNumber(fullNumber, country);
      const phoneNumber = parsePhoneNumber(fullNumber, country);
      
      if (!isValid) {
        setError();
        return false;
      }

      // Country-specific validation
      if (country === 'US' && number.length !== 10) {
        setError('US numbers must be 10 digits');
        return false;
      } else if (country === 'CN' && (number.length < 11 || number.length > 12)) {
        setError('Chinese numbers must be 11-12 digits');
        return false;
      }

      clearError();
      return true;
    } catch (error) {
      setError();
      return false;
    }
  }

  function updatePhoneDisplay() {
    const country = countrySelect.value;
    const code = getCountryCallingCode(country);
    const number = phoneInput.value.replace(/\D/g, '');
    phoneDisplay.value = number ? `+${code}${number}` : '';
  }

  function setError(message = 'Please enter a valid phone number') {
    phoneInput.classList.add('is-invalid');
    const feedback = phoneInput.parentElement.querySelector('.invalid-feedback') || 
      createFeedbackElement(phoneInput.parentElement);
    feedback.textContent = message;
  }

  function clearError() {
    phoneInput.classList.remove('is-invalid');
    const feedback = phoneInput.parentElement.querySelector('.invalid-feedback');
    if (feedback) {
      feedback.textContent = '';
    }
  }

  function createFeedbackElement(parent) {
    const div = document.createElement('div');
    div.className = 'invalid-feedback';
    parent.appendChild(div);
    return div;
  }

  // Export validation function for form submission
  phoneInput.validate = validatePhoneNumber;
}