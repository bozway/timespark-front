export function initializeGoogleSignIn() {
  const googleButton = document.querySelector('.btn-google');
  
  if (googleButton) {
    googleButton.addEventListener('click', () => {
      // Here you would typically initialize Google Sign-In
      console.log('Google sign-in clicked');
    });
  }
}