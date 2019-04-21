import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UsuarioProvider, Credenciales } from '../../providers/usuario/usuario';

import { AngularFireAuth } from '@angular/fire/auth';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: Credenciales = {};

  constructor(public navCtrl: NavController,
              public _us:UsuarioProvider,
              private afAuth:AngularFireAuth) {

    this.user = this._us.usuario;

    this.afAuth.authState.subscribe(user=>{
      console.log("AFAUTH!!!",JSON.stringify(user));
      
    });
  
  }

  salir(){
    this.afAuth.auth.signOut().then( res=>{
      this._us.usuario={}
      this.navCtrl.setRoot(LoginPage);
    })
  }

}
