import { showSuccess, showError } from './notifications';

export function initializeGoogleCalendar() {
  const connectBtn = document.getElementById('googleConnectBtn');
  const statusText = document.getElementById('googleAccountStatus');
  const settings = document.getElementById('calendarSettings');
  
  let isConnected = false;

  connectBtn.addEventListener('click', async () => {
    try {
      if (isConnected) {
        // Disconnect from Google
        await disconnectGoogle();
        isConnected = false;
        statusText.textContent = 'Not connected';
        connectBtn.textContent = 'Connect';
        settings.classList.add('d-none');
      } else {
        // Connect to Google
        await connectGoogle();
        isConnected = true;
        statusText.textContent = 'Connected as user@gmail.com';
        connectBtn.textContent = 'Disconnect';
        
        const calendars = await fetchGoogleCalendars();
        populateCalendarSelect(calendars);
        settings.classList.remove('d-none');
      }
    } catch (error) {
      showError('Failed to connect to Google');
    }
  });
}

async function connectGoogle() {
  // Mock function - replace with actual Google OAuth flow
  await new Promise(resolve => setTimeout(resolve, 1000));
}

async function disconnectGoogle() {
  // Mock function - replace with actual Google disconnect logic
  await new Promise(resolve => setTimeout(resolve, 1000));
}

async function fetchGoogleCalendars() {
  // Mock function - replace with actual Google Calendar API integration
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { id: 'primary', name: 'Primary Calendar' },
    { id: 'work', name: 'Work' },
    { id: 'personal', name: 'Personal' }
  ];
}

function populateCalendarSelect(calendars) {
  const select = document.getElementById('googleCalendar');
  select.innerHTML = '';
  
  calendars.forEach(calendar => {
    const option = new Option(calendar.name, calendar.id);
    select.add(option);
  });
}