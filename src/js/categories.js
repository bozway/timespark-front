import { Modal } from 'bootstrap';
import Sortable from 'sortablejs';
import Papa from 'papaparse';
import Swal from 'sweetalert2';
import { showSuccess, showError } from './utils/notifications';
import { initializeAnimations, showConfirmDialog } from './utils/animations';

let categories = [];
let sortable = null;
let isAllExpanded = false;

document.addEventListener('DOMContentLoaded', () => {
  initializeAnimations();
  initializeSortable();
  initializeEventListeners();
  loadCategories();
});

// ... [Previous functions remain the same until handleCategoryInput] ...

async function loadCategories() {
  try {
    // Mock API call - replace with actual API
    const response = await fetch('/api/categories');
    categories = await response.json();
    renderCategories();
    
    // Show/hide empty state
    document.getElementById('emptyState').classList.toggle('d-none', categories.length > 0);
  } catch (error) {
    showError('Failed to load categories');
  }
}

function renderCategories() {
  const list = document.getElementById('categoryList');
  if (!list) return;
  
  list.innerHTML = '';
  const template = document.getElementById('categoryTemplate');
  const subTemplate = document.getElementById('subcategoryTemplate');
  
  categories.forEach(category => {
    const item = template.content.cloneNode(true).querySelector('.category-item');
    
    // Set main category data
    item.dataset.id = category.id;
    item.querySelector('.color-picker-circle').value = category.color;
    item.querySelector('.category-name').value = category.name;
    item.querySelector('.category-code').value = category.code;
    item.querySelector('.total-hours').textContent = 
      `${category.totalHours || 0}${category.totalHours === 1 ? 'h' : 'h'}`;
    
    if (category.description) {
      const descEl = item.querySelector('.category-description');
      descEl.classList.remove('d-none');
      descEl.querySelector('textarea').value = category.description;
    }
    
    // Add subcategories
    if (category.subcategories?.length) {
      const subcategoriesEl = item.querySelector('.subcategories');
      const headerEl = item.querySelector('.subcategories-header');
      const addSubBtn = item.querySelector('.add-sub-btn');
      
      [subcategoriesEl, headerEl, addSubBtn].forEach(el => el.classList.remove('d-none'));
      
      category.subcategories.forEach(sub => {
        const subItem = subTemplate.content.cloneNode(true).querySelector('.subcategory-item');
        
        subItem.dataset.id = sub.id;
        subItem.querySelector('.category-name').value = sub.name;
        subItem.querySelector('.priority-input').value = sub.priority;
        subItem.querySelector('.parent-code').textContent = category.code;
        subItem.querySelector('.category-code').value = sub.code.slice(-2);
        subItem.querySelector('.target-amount').value = sub.targetAmount;
        subItem.querySelector('.target-unit').value = sub.targetUnit;
        subItem.querySelector('.target-period').value = sub.targetPeriod;
        
        if (sub.description) {
          const descEl = document.createElement('div');
          descEl.className = 'subcategory-description ms-4 mb-2';
          descEl.innerHTML = `<textarea class="form-control form-control-sm" rows="2">${sub.description}</textarea>`;
          subcategoriesEl.appendChild(descEl);
        }
        
        subcategoriesEl.appendChild(subItem);
      });
    }
    
    list.appendChild(item);
  });
}

async function toggleAllCategories() {
  isAllExpanded = !isAllExpanded;
  const expandBtns = document.querySelectorAll('.expand-btn');
  
  expandBtns.forEach(btn => {
    const icon = btn.querySelector('i');
    const categoryItem = btn.closest('.category-item');
    const elements = [
      categoryItem.querySelector('.subcategories'),
      categoryItem.querySelector('.subcategories-header'),
      categoryItem.querySelector('.add-sub-btn')
    ];
    
    icon.classList.toggle('bi-plus-square', !isAllExpanded);
    icon.classList.toggle('bi-dash-square', isAllExpanded);
    
    elements.forEach(el => {
      if (el) {
        el.classList.toggle('d-none', !isAllExpanded);
      }
    });
  });
  
  document.getElementById('expandAllBtn').innerHTML = 
    `<i class="bi bi-chevron-${isAllExpanded ? 'contract' : 'expand'} me-2"></i>
     ${isAllExpanded ? 'Collapse All' : 'Expand All'}`;
}

async function sortCategoriesAlpha() {
  categories.sort((a, b) => a.name.localeCompare(b.name));
  await updateCategories();
  renderCategories();
  showSuccess('Categories sorted alphabetically');
}

async function sortCategoriesPriority() {
  const allSubcategories = categories
    .flatMap(cat => (cat.subcategories || []).map(sub => ({
      ...sub,
      parentName: cat.name
    })))
    .sort((a, b) => b.priority - a.priority);
    
  renderPrioritySortedView(allSubcategories);
  showSuccess('Categories sorted by priority');
}

function renderPrioritySortedView(subcategories) {
  const list = document.getElementById('categoryList');
  if (!list) return;
  
  list.innerHTML = '';
  const template = document.getElementById('subcategoryTemplate');
  
  subcategories.forEach(sub => {
    const item = template.content.cloneNode(true).querySelector('.subcategory-item');
    
    item.dataset.id = sub.id;
    item.querySelector('.category-name').value = sub.name;
    item.querySelector('.priority-input').value = sub.priority;
    item.querySelector('.parent-code').textContent = sub.code.slice(0, 1);
    item.querySelector('.category-code').value = sub.code.slice(-2);
    item.querySelector('.target-amount').value = sub.targetAmount;
    item.querySelector('.target-unit').value = sub.targetUnit;
    item.querySelector('.target-period').value = sub.targetPeriod;
    
    // Add parent category name
    const parentName = document.createElement('div');
    parentName.className = 'text-muted small';
    parentName.textContent = `Parent: ${sub.parentName}`;
    item.insertBefore(parentName, item.firstChild);
    
    list.appendChild(item);
  });
}

async function reassignLetterCodes() {
  const confirmed = await showConfirmDialog(
    'Reassign Category Codes',
    'This will reassign all main category codes (A-Z) in the current order. Continue?'
  );
  
  if (!confirmed) return;
  
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  categories.forEach((cat, index) => {
    const newCode = alphabet[index];
    if (!newCode) {
      throw new Error('Too many categories. Maximum is 26.');
    }
    cat.code = newCode;
    cat.subcategories?.forEach(sub => {
      sub.code = newCode + sub.code.slice(-2);
    });
  });
  
  await updateCategories();
  renderCategories();
  showSuccess('Category codes reassigned');
}

async function reassignNumberCodes() {
  const confirmed = await showConfirmDialog(
    'Reassign Subcategory Codes',
    'This will reassign all subcategory codes (01-99) in the current order. Continue?'
  );
  
  if (!confirmed) return;
  
  categories.forEach(cat => {
    cat.subcategories?.forEach((sub, index) => {
      sub.code = cat.code + String(index + 1).padStart(2, '0');
    });
  });
  
  await updateCategories();
  renderCategories();
  showSuccess('Subcategory codes reassigned');
}

function showImportModal() {
  const modal = new Modal(document.getElementById('importModal'));
  modal.show();
}

async function importCategories(file) {
  try {
    const text = await file.text();
    const { data } = Papa.parse(text, { header: true });
    
    // Validate and transform data
    const importedCategories = data.map(row => ({
      name: row.name,
      code: row.code,
      color: row.color,
      description: row.description,
      priority: parseInt(row.priority, 10),
      targetAmount: parseInt(row.target_amount, 10),
      targetUnit: row.target_unit,
      targetPeriod: row.target_period
    }));
    
    // Update categories
    categories = importedCategories;
    await updateCategories();
    renderCategories();
    
    // Hide modal and show success
    const modal = Modal.getInstance(document.getElementById('importModal'));
    modal.hide();
    showSuccess('Categories imported successfully');
  } catch (error) {
    showError('Failed to import categories: ' + error.message);
  }
}

function exportCategories() {
  const exportData = categories.map(cat => ({
    name: cat.name,
    code: cat.code,
    color: cat.color,
    description: cat.description || '',
    priority: '',
    target_amount: '',
    target_unit: '',
    target_period: '',
    subcategories: cat.subcategories?.map(sub => ({
      name: sub.name,
      code: sub.code,
      color: '',
      description: sub.description || '',
      priority: sub.priority,
      target_amount: sub.targetAmount,
      target_unit: sub.targetUnit,
      target_period: sub.targetPeriod
    }))
  })).flatMap(cat => [
    cat,
    ...(cat.subcategories || [])
  ]);
  
  const csv = Papa.unparse(exportData);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'categories.csv';
  a.click();
  window.URL.revokeObjectURL(url);
}

async function updateCategories() {
  // Mock API call - replace with actual API
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real app, you would send the categories to your server here
  console.log('Categories updated:', categories);
}

// Export all necessary functions
export {
  addNewCategory,
  addNewSubcategory,
  handleCategorySubmit,
  loadCategories,
  handleCategoryClick,
  handleCategoryInput,
  toggleAllCategories,
  sortCategoriesAlpha,
  sortCategoriesPriority,
  reassignLetterCodes,
  reassignNumberCodes,
  showImportModal,
  exportCategories,
  importCategories
};