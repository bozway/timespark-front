import Cropper from 'cropperjs';
import { Modal } from 'bootstrap';

let cropper = null;
let cropperModal = null;

export function initializeImageUpload() {
  const pictureInput = document.getElementById('pictureInput');
  const changePictureBtn = document.getElementById('changePictureBtn');
  cropperModal = new Modal(document.getElementById('cropperModal'));
  
  changePictureBtn.addEventListener('click', () => {
    pictureInput.click();
  });

  pictureInput.addEventListener('change', (e) => {
    if (e.target.files?.length) {
      const reader = new FileReader();
      reader.onload = (e) => {
        initializeCropper(e.target.result);
        cropperModal.show();
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });

  document.getElementById('cropButton').addEventListener('click', () => {
    if (!cropper) return;
    
    const croppedCanvas = cropper.getCroppedCanvas({
      width: 300,
      height: 300
    });

    document.getElementById('profilePicture').src = croppedCanvas.toDataURL();
    cropperModal.hide();
  });
}

function initializeCropper(imageUrl) {
  const image = document.getElementById('cropperImage');
  image.src = imageUrl;
  
  if (cropper) {
    cropper.destroy();
  }
  
  cropper = new Cropper(image, {
    aspectRatio: 1,
    viewMode: 1,
    dragMode: 'move',
    autoCropArea: 1,
    restore: false,
    guides: true,
    center: true,
    highlight: false,
    cropBoxMovable: false,
    cropBoxResizable: false,
    toggleDragModeOnDblclick: false
  });
}