export function showSuccess(message) {
  createAlert(message, 'success');
}

export function showError(message) {
  createAlert(message, 'danger');
}

function createAlert(message, type) {
  // Remove any existing alerts
  document.querySelectorAll('.alert').forEach(alert => alert.remove());

  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
  alert.style.zIndex = '1050';
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(alert);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    alert.remove();
  }, 5000);
}