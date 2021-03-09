import firebase from "firebase";
import { UserAuth } from "./userAuth";
import { Users } from "./users";
import { Reserves } from "./reserve";
import { ConfigReserve } from "./ConfigReserve";
import { DAY_OF_WEEK } from "./statics";

function initFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyBAJSp0ezkRg8wlVnu66y5jiTBDaFuPW4o",
    authDomain: "kts-workflow.firebaseapp.com",
    projectId: "kts-workflow",
    storageBucket: "kts-workflow.appspot.com",
    messagingSenderId: "130531488837",
    appId: "1:130531488837:web:bf07c5032350d9d0ec9f2c",
  };
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
}

export { initFirebase, UserAuth, Users, Reserves, ConfigReserve, DAY_OF_WEEK };
