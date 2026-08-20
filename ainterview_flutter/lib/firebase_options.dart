// lib/firebase_options.dart
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) return web;
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      default:
        return android;
    }
  }

  // ── Web ──────────────────────────────────────────────────────────────────
  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyDIGsJExbfhvSc17P-9La7DCPDbtxZawao',
    authDomain: 'ainterview-platform.firebaseapp.com',
    projectId: 'ainterview-platform',
    storageBucket: 'ainterview-platform.firebasestorage.app',
    messagingSenderId: '762318025923',
    appId: '1:762318025923:web:809a603ac7ab49f3a75e76',
    measurementId: 'G-4LCFQV3VJ9',
  );

  // ── Android ──────────────────────────────────────────────────────────────
  // NOTE: Replace appId below with your actual Android app ID from Firebase Console
  // Go to: Firebase Console → Project Settings → Add App → Android
  // Package name: com.ainterview.app
  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyDIGsJExbfhvSc17P-9La7DCPDbtxZawao',
    authDomain: 'ainterview-platform.firebaseapp.com',
    projectId: 'ainterview-platform',
    storageBucket: 'ainterview-platform.firebasestorage.app',
    messagingSenderId: '762318025923',
    appId: '1:762318025923:android:e92408b066d123456789ab',
  );

  // ── iOS ──────────────────────────────────────────────────────────────────
  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyDIGsJExbfhvSc17P-9La7DCPDbtxZawao',
    authDomain: 'ainterview-platform.firebaseapp.com',
    projectId: 'ainterview-platform',
    storageBucket: 'ainterview-platform.firebasestorage.app',
    messagingSenderId: '762318025923',
    appId: '1:762318025923:ios:REPLACE_WITH_IOS_APP_ID',
    iosClientId: 'REPLACE_WITH_IOS_CLIENT_ID.apps.googleusercontent.com',
    iosBundleId: 'com.ainterview.app',
  );
}
