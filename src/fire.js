import firebase from 'firebase';


// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCYZdujSf5zl4xQXO9ib-DQP-vrp5BzOaM",
	authDomain: "phonebook-777bd.firebaseapp.com",
	databaseURL: 'https://phone-book-777bd.firebaseio.com',
	// databaseURL: "https://phone-book-fe436.firebaseio.com",
	projectId: "phonebook-777bd",
	storageBucket: "phonebook-777bd.appspot.com",
	messagingSenderId: "941479613909",
	appId: "1:941479613909:web:712e0ba8943aef873dd95c"
};

// const firebaseConfig = {
// 	apiKey: "AIzaSyAHDUwcM0zO4yMCoyazo4w-HOeKfGsQL2g",
// 	authDomain: "phone-book-fe436.firebaseapp.com",
// 	databaseURL: "https://phone-book-fe436.firebaseio.com",
// 	projectId: "phone-book-fe436",
// 	storageBucket: "phone-book-fe436.appspot.com",
// 	messagingSenderId: "410083027161",
// 	appId: "1:410083027161:web:e69ec743153a72d48df6c8"
// };

try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {
  if (!/already exists/.test(err.message)) {
	console.error('Firebase initialization error', err.stack);
  }
}

const fire = firebase;
export default fire;