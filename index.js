// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required
import { initializeApp } from 'firebase/app';

// Add the Firebase products and methods that you want to use
import { getAuth, EmailAuthProvider } from 'firebase/auth';
import {
  getAuth,
  EmailAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

import {
  getFirestore,
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';



import * as firebaseui from 'firebaseui';

// Document elements
const startRsvpButton = document.getElementById('startRsvp');
const guestbookContainer = document.getElementById('guestbook-container');

const form = document.getElementById('leave-message');
const input = document.getElementById('message');
const guestbook = document.getElementById('guestbook');
const numberAttending = document.getElementById('number-attending');
const rsvpYes = document.getElementById('rsvp-yes');
const rsvpNo = document.getElementById('rsvp-no');

let rsvpListener = null;
let guestbookListener = null;

let db, auth;

async function main() {
  // Add Firebase project configuration object here
  const firebaseConfig = {

    apiKey: "AIzaSyCMSze79W8tcT0r32-KHJEz5TYXCRsGd4I",
  
    authDomain: "crucial-guard-358714.firebaseapp.com",
  
    projectId: "crucial-guard-358714",
  
    storageBucket: "crucial-guard-358714.appspot.com",
  
    messagingSenderId: "114391750574",
  
    appId: "1:114391750574:web:666cf956e6f641c7aada3f",
  
    measurementId: "G-6CXR1FMZYF"
  
  };
  // initializeApp(firebaseConfig);
  initializeApp(firebaseConfig);
  auth = getAuth();
// save a reference to the Firestore db object right after initializeApp
  db = getFirestore();

   // Listen to RSVP button clicks
  startRsvpButton.addEventListener("click",
   () => {
        ui.start("#firebaseui-auth-container", uiConfig);
  });
  // Called when the user clicks the RSVP button
startRsvpButton.addEventListener('click', () => {
  if (auth.currentUser) {
    // User is signed in; allows user to sign out
    signOut(auth);
  } else {
    // No user is signed in; allows user to sign in
    ui.start('#firebaseui-auth-container', uiConfig);
  }
});

  // Listen to the current Auth state
  onAuthStateChanged(auth, user => {
    if (user) {
      startRsvpButton.textContent = 'LOGOUT';
    } else {
      startRsvpButton.textContent = 'RSVP';
    }
  });

  // Listen to the form submission
  form.addEventListener('submit', async e => {
    // Prevent the default form redirect
    e.preventDefault();
    // Write a new message to the database collection "guestbook"
    addDoc(collection(db, 'guestbook'), {
      text: input.value,
      timestamp: Date.now(),
      name: auth.currentUser.displayName,
      userId: auth.currentUser.uid
    });
    // clear message input field
    input.value = '';
    // Return false to avoid redirect
    return false;
  });
// Listen to the current Auth state
onAuthStateChanged(auth, user => {
  if (user) {
    startRsvpButton.textContent = 'LOGOUT';
    // Show guestbook to logged-in users
    guestbookContainer.style.display = 'block';
  } else {
    startRsvpButton.textContent = 'RSVP';
    // Hide guestbook for non-logged-in users
    guestbookContainer.style.display = 'none';
  }
});
<section id="guestbook-container">
<h2>Discussion</h2>

<form></form>

<section id="guestbook"></section>

</section>
 // Create query for messages
 const q = query(collection(db, 'guestbook'), orderBy('timestamp', 'desc'));
 onSnapshot(q, snaps => {
   // Reset page
   guestbook.innerHTML = '';
   // Loop through documents in database
   snaps.forEach(doc => {
     // Create an HTML entry for each document and add it to the chat
     const entry = document.createElement('p');
     entry.textContent = doc.data().name + ': ' + doc.data().text;
     guestbook.appendChild(entry);
   });
 });

// Listen to guestbook updates
 function subscribeGuestbook() {
  const q = query(collection(db, 'guestbook'), orderBy('timestamp', 'desc'));
  guestbookListener = onSnapshot(q, snaps => {
    // Reset page
    guestbook.innerHTML = '';
    // Loop through documents in database
    snaps.forEach(doc => {
      // Create an HTML entry for each document and add it to the chat
      const entry = document.createElement('p');
      entry.textContent = doc.data().name + ': ' + doc.data().text;
      guestbook.appendChild(entry);
    });
  });
}
// Unsubscribe from guestbook updates
function unsubscribeGuestbook() {
  if (guestbookListener != null) {
    guestbookListener();
    guestbookListener = null;
  }
}
// Listen to the current Auth state
onAuthStateChanged(auth, user => {
  if (user) {
    startRsvpButton.textContent = 'LOGOUT';
    // Show guestbook to logged-in users
    guestbookContainer.style.display = 'block';
    // Subscribe to the guestbook collection
    subscribeGuestbook();
  } else {
    startRsvpButton.textContent = 'RSVP';
    // Hide guestbook for non-logged-in users
    guestbookContainer.style.display = 'none';
    // Unsubscribe from the guestbook collection
    unsubscribeGuestbook();
  }
});


  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // Handle sign-in.

        // Return false to avoid redirect.
        return false;
      },
    },
  };

   const ui = new firebaseui.auth.AuthUI(auth);
}
main();
