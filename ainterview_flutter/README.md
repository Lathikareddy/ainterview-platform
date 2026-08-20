# AInterview Flutter Android App
## AI Interview Simulator — Native Android

A full-featured AI interview practice app built with Flutter, mirroring the web platform.

### Features
- 🔐 Firebase Authentication (Google + Email/Password)
- 🧠 AI Interview Simulator (Text, Voice, Video modes)
- 📊 Analytics Dashboard with score tracking  
- 🎯 Practice Q&A Bank with category filters
- 🏆 Community Leaderboard
- ⚙️ User Profile & Settings

### Quick Start

1. **Install Flutter**: https://flutter.dev/docs/get-started/install/windows
2. **Scaffold project**: `flutter create --org com.ainterview --platforms android .`
3. **Get dependencies**: `flutter pub get`
4. **Add Firebase**: Download `google-services.json` from Firebase Console → `android/app/`
5. **Run**: `flutter run`

### Tech Stack
- Flutter 3.22+ / Dart 3.3+
- Firebase Auth + Firestore
- Provider (state management)
- GoRouter (navigation)
- FL Chart (analytics)
- Speech-to-Text (voice interviews)

### Project Structure
See full guide in `setup_flutter.ps1` for automated setup.
