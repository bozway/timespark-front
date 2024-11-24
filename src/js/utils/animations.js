import { Modal } from 'bootstrap';

export function initializeAnimations() {
  // Smooth expand/collapse for categories
  document.addEventListener('click', (e) => {
    const expandBtn = e.target.closest('.expand-btn');
    if (!expandBtn) return;

    const categoryItem = expandBtn.closest('.category-item');
    const icon = expandBtn.querySelector('i');
    const subcategories = categoryItem.querySelector('.subcategories');
    const subcategoriesHeader = categoryItem.querySelector('.subcategories-header');
    const addSubBtn = categoryItem.querySelector('.add-sub-btn');

    icon.classList.toggle('bi-plus-square');
    icon.classList.toggle('bi-dash-square');

    [subcategories, subcategoriesHeader, addSubBtn].forEach(el => {
      if (el) {
        el.classList.toggle('d-none');
      }
    });
  });

  // Smooth description toggle
  document.addEventListener('click', (e) => {
    const descBtn = e.target.closest('.description-btn');
    if (!descBtn) return;

    const item = descBtn.closest('.category-item, .subcategory-item');
    const descEl = item.classList.contains('category-item') ? 
      item.querySelector('.category-description') :
      item.nextElementSibling;

    if (descEl) {
      descEl.classList.toggle('d-none');
      if (!descEl.classList.contains('d-none')) {
        descEl.querySelector('textarea').focus();
      }
    }
  });
}

export function showConfirmDialog(title, text) {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">${text}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary confirm-btn">Confirm</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    const modalInstance = new Modal(modal);
    modalInstance.show();

    modal.querySelector('.confirm-btn').addEventListener('click', () => {
      modalInstance.hide();
      resolve(true);
    });

    modal.addEventListener('hidden.bs.modal', () => {
      modal.remove();
      resolve(false);
    });
  });
}