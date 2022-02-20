import firebase from "firebase";

export class FirebaseConnector {
  db!: firebase.firestore.Firestore;

  private static _instance?: FirebaseConnector;

  private constructor() {
    const firebaseConfig = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId:
        process.env.REACT_APP_FIREBASE_STORAGE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID,
    };

    const firebaseApp = firebase.initializeApp(firebaseConfig);
    this.db = firebaseApp.firestore();
    return this;
  }

  private static _initialize() {
    this._instance = new FirebaseConnector();
    return this._instance;
  }

  static getInstance() {
    return this._instance ? this._instance : this._initialize();
  }
}
