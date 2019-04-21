import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//firebase auth
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

import { UsuarioProvider } from '../../providers/usuario/usuario';
import { HomePage } from "../home/home";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, 
              private afAuth: AngularFireAuth,
              public _us:UsuarioProvider,
              private platform:Platform,
              private fb: Facebook,
              private googlePlus: GooglePlus) {
  }

  signInGoogle(){
    this.googlePlus.login({
      'webClientId': '770550794542-kvog0n8f7dubvfjsqspslicakqerknik.apps.googleusercontent.com',
      'offline': true
    }).then( res => {
      firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
      .then( user => {
        console.log(JSON.stringify(user));
        this._us.cargarUsuario(
        user.displayName,
        user.email,
        user.photoURL,
        user.uid,
        'google'
      );
      this.navCtrl.setRoot(HomePage);
      })
      .catch( error => console.log("Firebase failure: " + JSON.stringify(error)));
    }).catch(err => console.error("Error: "+ JSON.stringify(err)));

  }

  signInWithFacebook() {

    if (this.platform.is('cordova')) {
      //movil
      this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        firebase.auth().signInWithCredential(facebookCredential)
          .then( user => {
            console.log(user);
            this._us.cargarUsuario(
              user.displayName,
              user.email,
              user.photoURL,
              user.uid,
              'facebook'
            );
            this.navCtrl.setRoot(HomePage);
          }).catch(e=> console.log('Error con el login' + JSON.stringify(e)));
      });
    }else{
      //escritorio
      this.afAuth.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => {
          console.log(res);
          let user = res.user;
          this._us.cargarUsuario(
            user.displayName,
            user.email,
            user.photoURL,
            user.uid,
            'facebook'
          );
          this.navCtrl.setRoot(HomePage);
        });
    }
    
  }

}
