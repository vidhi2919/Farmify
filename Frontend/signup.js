const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Get the signup form element
  const signupForm = document.getElementById('signupForm');
  
  // Add event listener for form submission
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    // Get user input
    const name = document.getElementById('name').value;
    const mobile = document.getElementById('mobile').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Create user with email and password
    firebase.auth().createUserWithEmailAndPassword(username, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        
        // Add additional user info to Firebase
        return user.updateProfile({
          displayName: name
        }).then(() => {
          // Store additional user data in Firestore
          return firebase.firestore().collection('users').doc(user.uid).set({
            name: name,
            mobile: mobile,
            username: username
          });
        });
      })
      .then(() => {
        console.log('User registered successfully');
        // Redirect to login page or dashboard
        window.location.href = 'login.html';
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error:', errorCode, errorMessage);
        // Display error message to user
        alert('Error: ' + errorMessage);
      });
  });