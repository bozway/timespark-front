import moment from 'moment-timezone';

export function initializeTimezones() {
  const timezoneSelect = document.getElementById('timezone');
  const currentTimezone = moment.tz.guess();
  
  moment.tz.names().forEach(timezone => {
    const option = new Option(timezone, timezone);
    timezoneSelect.add(option);
    
    if (timezone === currentTimezone) {
      option.selected = true;
    }
  });
}