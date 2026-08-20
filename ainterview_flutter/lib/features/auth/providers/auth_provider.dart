// lib/features/auth/providers/auth_provider.dart
import 'package:flutter/foundation.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthProvider extends ChangeNotifier {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  User? _user;
  bool _isLoading = true;
  bool _isSetupComplete = false;

  User? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _user != null;
  bool get isSetupComplete => _isSetupComplete;
  String get displayName => _user?.displayName ?? _user?.email?.split('@').first ?? 'User';
  String get email => _user?.email ?? '';
  String? get photoUrl => _user?.photoURL;

  AuthProvider() {
    _auth.authStateChanges().listen(_onAuthChanged);
  }

  Future<void> _onAuthChanged(User? user) async {
    _user = user;
    if (user != null) {
      await _checkSetupComplete(user.uid);
    } else {
      _isSetupComplete = false;
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> _checkSetupComplete(String uid) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      // Check local cache first for speed
      final localDone = prefs.getBool('setup_complete_$uid') ?? false;
      if (localDone) { _isSetupComplete = true; return; }
      // Then check Firestore
      final doc = await _db.collection('users').doc(uid).get();
      _isSetupComplete = doc.data()?['setupComplete'] == true;
      if (_isSetupComplete) {
        await prefs.setBool('setup_complete_$uid', true);
      }
    } catch (_) {
      _isSetupComplete = false;
    }
  }

  // ── Google Sign-In ────────────────────────────────────────────────────────
  Future<({bool success, String? error})> signInWithGoogle() async {
    try {
      final googleUser = await _googleSignIn.signIn();
      if (googleUser == null) return (success: false, error: 'Sign-in cancelled');

      final googleAuth = await googleUser.authentication;
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );
      await _auth.signInWithCredential(credential);
      return (success: true, error: null);
    } on FirebaseAuthException catch (e) {
      return (success: false, error: _authError(e.code));
    } catch (e) {
      return (success: false, error: e.toString());
    }
  }

  // ── Email Sign-In ─────────────────────────────────────────────────────────
  Future<({bool success, String? error})> signInWithEmail(String email, String password) async {
    try {
      await _auth.signInWithEmailAndPassword(email: email, password: password);
      return (success: true, error: null);
    } on FirebaseAuthException catch (e) {
      return (success: false, error: _authError(e.code));
    }
  }

  // ── Register ──────────────────────────────────────────────────────────────
  Future<({bool success, String? error})> registerWithEmail(
      String email, String password, String name) async {
    try {
      final cred = await _auth.createUserWithEmailAndPassword(
          email: email, password: password);
      await cred.user?.updateDisplayName(name);
      await _db.collection('users').doc(cred.user!.uid).set({
        'name': name,
        'email': email,
        'createdAt': FieldValue.serverTimestamp(),
        'setupComplete': false,
      }, SetOptions(merge: true));
      return (success: true, error: null);
    } on FirebaseAuthException catch (e) {
      return (success: false, error: _authError(e.code));
    }
  }

  // ── Forgot Password ───────────────────────────────────────────────────────
  Future<({bool success, String? error})> resetPassword(String email) async {
    try {
      await _auth.sendPasswordResetEmail(email: email);
      return (success: true, error: null);
    } on FirebaseAuthException catch (e) {
      return (success: false, error: _authError(e.code));
    }
  }

  // ── Complete Setup ────────────────────────────────────────────────────────
  Future<void> completeSetup(Map<String, dynamic> data) async {
    if (_user == null) return;
    await _db.collection('users').doc(_user!.uid).set({
      ...data,
      'setupComplete': true,
      'updatedAt': FieldValue.serverTimestamp(),
    }, SetOptions(merge: true));
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('setup_complete_${_user!.uid}', true);
    _isSetupComplete = true;
    notifyListeners();
  }

  // ── Sign Out ──────────────────────────────────────────────────────────────
  Future<void> signOut() async {
    await _googleSignIn.signOut();
    await _auth.signOut();
    final prefs = await SharedPreferences.getInstance();
    if (_user != null) await prefs.remove('setup_complete_${_user!.uid}');
  }

  // ── Error Messages ────────────────────────────────────────────────────────
  String _authError(String code) {
    switch (code) {
      case 'user-not-found': return 'No account found with this email.';
      case 'wrong-password': return 'Incorrect password. Please try again.';
      case 'email-already-in-use': return 'This email is already registered.';
      case 'weak-password': return 'Password must be at least 6 characters.';
      case 'invalid-email': return 'Please enter a valid email address.';
      case 'too-many-requests': return 'Too many attempts. Please try again later.';
      case 'network-request-failed': return 'No internet connection.';
      default: return 'Something went wrong. Please try again.';
    }
  }
}
