import { showSuccess, showError } from './notifications';

export function initializeFormSubmission() {
  const form = document.getElementById('profileForm');
  const emailInput = document.getElementById('email');
  const googleStatus = document.getElementById('googleAccountStatus');
  const displayNameInput = document.getElementById('displayName');
  const fullNameInput = document.getElementById('fullName');
  const bioInput = document.getElementById('bio');
  
  // Update display name in header when input changes
  displayNameInput.addEventListener('input', (e) => {
    document.getElementById('displayNameHeader').textContent = e.target.value || 'Your Name';
  });

  // Validate display name
  displayNameInput.addEventListener('input', () => {
    const value = displayNameInput.value.trim();
    if (value.length < 2) {
      setError(displayNameInput, 'Display name must be at least 2 characters long');
    } else if (value.length > 50) {
      setError(displayNameInput, 'Display name cannot exceed 50 characters');
    } else if (!/^[a-zA-Z0-9\s._-]+$/.test(value)) {
      setError(displayNameInput, 'Display name can only contain letters, numbers, spaces, dots, underscores, and hyphens');
    } else {
      clearError(displayNameInput);
    }
  });

  // Validate full name
  fullNameInput.addEventListener('input', () => {
    const value = fullNameInput.value.trim();
    if (value.length < 2) {
      setError(fullNameInput, 'Full name must be at least 2 characters long');
    } else if (value.length > 100) {
      setError(fullNameInput, 'Full name cannot exceed 100 characters');
    } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
      setError(fullNameInput, 'Full name can only contain letters, spaces, hyphens, and apostrophes');
    } else {
      clearError(fullNameInput);
    }
  });

  // Validate email
  emailInput.addEventListener('input', () => {
    const value = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setError(emailInput, 'Please enter a valid email address');
    } else {
      clearError(emailInput);
    }
  });

  // Validate bio
  bioInput.addEventListener('input', () => {
    const value = bioInput.value.trim();
    const remainingChars = 500 - value.length;
    if (value.length > 500) {
      setError(bioInput, `Bio is too long. Please remove ${-remainingChars} characters`);
    } else {
      clearError(bioInput);
      const feedback = bioInput.parentElement.querySelector('.form-text') || 
        createFeedbackElement(bioInput.parentElement, 'form-text');
      feedback.textContent = `${remainingChars} characters remaining`;
    }
  });

  // Validate birthday
  const birthdayInput = document.getElementById('birthday');
  birthdayInput.addEventListener('change', () => {
    const birthday = new Date(birthdayInput.value);
    const today = new Date();
    const minAge = new Date();
    minAge.setFullYear(today.getFullYear() - 13); // 13 years minimum age

    if (birthday > today) {
      setError(birthdayInput, 'Birthday cannot be in the future');
    } else if (birthday > minAge) {
      setError(birthdayInput, 'You must be at least 13 years old');
    } else {
      clearError(birthdayInput);
    }
  });

  // Handle email field state based on Google connection
  function updateEmailFieldState() {
    const isGoogleConnected = googleStatus.textContent.includes('Connected');
    emailInput.readOnly = isGoogleConnected;
    emailInput.classList.toggle('bg-light', isGoogleConnected);
    
    if (isGoogleConnected) {
      const googleEmail = googleStatus.textContent.match(/Connected as (.+@.+)/)?.[1];
      if (googleEmail) {
        emailInput.value = googleEmail;
      }
    }
  }

  // Initial state
  updateEmailFieldState();

  // Watch for Google connection status changes
  const observer = new MutationObserver(updateEmailFieldState);
  observer.observe(googleStatus, { characterData: true, childList: true, subtree: true });
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous validation state
    form.querySelectorAll('.is-invalid').forEach(element => {
      element.classList.remove('is-invalid');
    });

    // Perform all validations
    let isValid = true;

    // Display Name validation
    if (!displayNameInput.value.trim()) {
      setError(displayNameInput, 'Display name is required');
      isValid = false;
    }

    // Full Name validation
    if (!fullNameInput.value.trim()) {
      setError(fullNameInput, 'Full name is required');
      isValid = false;
    }

    // Email validation
    if (!emailInput.value.trim()) {
      setError(emailInput, 'Email is required');
      isValid = false;
    }

    // Birthday validation
    if (!birthdayInput.value) {
      setError(birthdayInput, 'Birthday is required');
      isValid = false;
    }

    // Sex validation
    const sexSelect = document.getElementById('sex');
    if (!sexSelect.value) {
      setError(sexSelect, 'Please select your sex');
      isValid = false;
    }

    // Timezone validation
    const timezoneSelect = document.getElementById('timezone');
    if (!timezoneSelect.value) {
      setError(timezoneSelect, 'Please select your timezone');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const formData = {
      displayName: displayNameInput.value,
      fullName: fullNameInput.value,
      email: emailInput.value,
      phone: document.getElementById('fullPhoneNumber').value,
      birthday: birthdayInput.value,
      sex: sexSelect.value,
      bio: bioInput.value,
      timezone: timezoneSelect.value,
      language: document.getElementById('language').value,
      timeFormat: document.querySelector('input[name="timeFormat"]:checked').value,
      googleCalendarId: document.getElementById('googleCalendar').value,
      profilePicture: document.getElementById('profilePicture').src
    };

    try {
      await saveProfile(formData);
      showSuccess('Profile updated successfully');
    } catch (error) {
      showError('Failed to update profile');
    }
  });
}

function setError(element, message) {
  element.classList.add('is-invalid');
  const feedback = element.parentElement.querySelector('.invalid-feedback') || 
    createFeedbackElement(element.parentElement, 'invalid-feedback');
  feedback.textContent = message;
}

function clearError(element) {
  element.classList.remove('is-invalid');
  const feedback = element.parentElement.querySelector('.invalid-feedback');
  if (feedback) {
    feedback.textContent = '';
  }
}

function createFeedbackElement(parent, className) {
  const div = document.createElement('div');
  div.className = className;
  parent.appendChild(div);
  return div;
}

async function saveProfile(data) {
  // Mock function - replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Profile data saved:', data);
}