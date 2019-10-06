import firebase from 'firebase'

class firebaseConfig {
    constructor() {
        var firebaseConfig = {
              apiKey: "",
              authDomain: "",
              databaseURL: "",
              projectId: "",
              storageBucket: "",
              messagingSenderId: "",
              appId: ""
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
    }
}

export default new firebaseConfig()