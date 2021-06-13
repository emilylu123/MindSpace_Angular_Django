import { Injectable } from '@angular/core';
import { User } from '../services/user';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  _djangoUrl = 'http://127.0.0.1:8000/';
  _djangoToken: string;

  constructor(
    private afs: AngularFirestore, // Inject Firestore service
    private afAuth: AngularFireAuth, // Inject Firebase auth service
    private router: Router,
    private http: HttpClient
  ) {
    /* Saving user data in local storage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));

        // Set djangoToken that is saved before
        this._djangoToken = localStorage.getItem('djangoToken');
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  // Sign in with Google
  googleAuth(): Promise<void> {
    return this.authLogin(new auth.GoogleAuthProvider());
  }

  // Pass the returned token from FireAuth to django server for getting djangoToken
  getDjangoToken(
    uid: string,
    fireAuthToken: string
  ): Observable<{ token: string }> {
    return this.http
      .post(this.djangoUrl + 'api/user/token/', {
        uid: uid,
        token: fireAuthToken,
      })
      .pipe(take(1)) as Observable<{ token: string }>;
  }

  // Auth logic to run auth providers : Google
  async authLogin(provider) {
    try {
      let result = await this.afAuth.auth.signInWithPopup(provider);
      this.setUserData(result.user);
      let idToken = await this.afAuth.auth.currentUser.getIdToken(true);
      this.getDjangoToken(result.user.uid, idToken).subscribe((djangoToken) => {
        this._djangoToken = djangoToken.token;
        localStorage.setItem('djangoToken', djangoToken.token);
        this.router.navigate(['/auth/dashboard']);
      });
    } catch (error) {
      window.alert(error);
    }
  }

  // Sign in with email/password
  async signIn(email, password) {
    try {
      let result = await this.afAuth.auth.signInWithEmailAndPassword(
        email,
        password
      );
      this.setUserData(result.user, result.user.displayName);
      // TBD: if the email is not verified, do not proceed
      let idToken = await this.afAuth.auth.currentUser.getIdToken(true);
      this.getDjangoToken(result.user.uid, idToken).subscribe((djangoToken) => {
        this._djangoToken = djangoToken.token;
        localStorage.setItem('djangoToken', djangoToken.token);
        this.router.navigate(['/auth/dashboard']);
      });
    } catch (error) {
      window.alert(error);
    }
  }

  // Sign up with email/password
  async signUp(email, password) {
    try {
      let result = await this.afAuth.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      /* Call the sendVerificaitonMail() function when new user sign
        up and returns promise */
      this.sendVerificationMail();

      this.setUserData(result.user);
    } catch (error) {
      window.alert(error.message);
    }
  }

  // Send email verification when new user sign up
  async sendVerificationMail() {
    await this.afAuth.auth.currentUser.sendEmailVerification();
    this.router.navigate(['auth', 'verify-email-address']);
  }

  // Reset Forgot password
  async forgotPassword(passwordResetEmail) {
    try {
      await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
      window.alert('Password reset email sent, check your inbox.');
    } catch (error) {
      window.alert(error);
    }
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    // Those ends with test.com are created by admin
    return (
      user !== null &&
      (user.emailVerified || user.email.endsWith('test.com')) &&
      this._djangoToken != null
    );
  }

  get djangoUrl(): string {
    return this._djangoUrl;
  }

  get djangoToken(): string {
    return this._djangoToken;
  }

  /* Setting up user data when sign in with username/password,
  // sign up with username/password and sign in with social auth
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user, username?) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || username,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Sign out
  async signOut() {
    await this.afAuth.auth.signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('djangoToken');
    this._djangoToken = null;
    this.router.navigate(['landing']);
  }
}
