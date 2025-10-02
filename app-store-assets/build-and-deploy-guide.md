# 🚀 Eidolon Mobile App Build & Deploy Guide

## Step-by-Step Build Process

### Prerequisites Verification
Before building, ensure you have:
- [ ] **Node.js** installed (v16 or higher)
- [ ] **Capacitor CLI** installed globally: `npm install -g @capacitor/cli`
- [ ] **Xcode** installed (for iOS, Mac only)
- [ ] **Android Studio** installed (for Android)
- [ ] **Developer accounts** set up (Apple & Google)

### 1. Prepare Your Web App

```bash
# Ensure your web app builds successfully
npm run build

# Verify the build works
npm run preview
```

**✅ Checkpoint:** Your web app should load at http://localhost:4173 without errors.

### 2. Sync to Mobile Platforms

```bash
# Sync your web app to mobile platforms
npm run mobile:sync

# This runs: npx cap sync
# - Copies web assets to native projects
# - Updates native dependencies
# - Syncs configuration changes
```

### 3. iOS Build Process

#### Open iOS Project
```bash
npm run ios:open
# This opens Xcode with your iOS project
```

#### In Xcode:
1. **Select your development team**
   - Click on "App" in the project navigator
   - Go to "Signing & Capabilities"
   - Select your Apple Developer team

2. **Configure Bundle Identifier**
   - Ensure it's set to: `com.tryeidolon.app`
   - Must match your App Store Connect app

3. **Add App Icons**
   - Navigate to `App/Assets.xcassets/AppIcon.appiconset`
   - Drag and drop all required icon sizes
   - Xcode will show which sizes are missing

4. **Test on Device**
   - Connect your iPhone/iPad
   - Select your device in Xcode
   - Click "Build and Run" (▶️ button)

5. **Archive for App Store**
   - Select "Any iOS Device" as target
   - Product → Archive
   - Wait for archive to complete
   - Click "Distribute App" → "App Store Connect"

### 4. Android Build Process

#### Open Android Project
```bash
npm run android:open
# This opens Android Studio with your project
```

#### In Android Studio:
1. **Sync Project**
   - Click "Sync Now" if prompted
   - Wait for Gradle sync to complete

2. **Add App Icons**
   - Navigate to `app/src/main/res/`
   - Add icons to appropriate `mipmap-*` folders
   - Update `ic_launcher.xml` if using adaptive icons

3. **Test on Device**
   - Connect your Android device (enable USB debugging)
   - Click "Run" (▶️ button)
   - Select your device

4. **Generate Signed Bundle**
   - Build → Generate Signed Bundle/APK
   - Choose "Android App Bundle"
   - Create or select signing key
   - Build release bundle

## App Store Submission Process

### iOS App Store Connect

#### 1. Create App Record
1. **Log into App Store Connect**
   - Visit: https://appstoreconnect.apple.com
   - Sign in with your Apple Developer account

2. **Create New App**
   - Click "My Apps" → "+" → "New App"
   - **Platform:** iOS
   - **Name:** Eidolon - Memory Training
   - **Primary Language:** English (U.S.)
   - **Bundle ID:** com.tryeidolon.app (must match Xcode)
   - **SKU:** eidolon-ios-app (unique identifier)

#### 2. App Information
```
Name: Eidolon - Memory Training
Subtitle: Evidence-Based Cognitive Training
Category: Health & Fitness
Secondary Category: Education
Content Rights: I own or have licensed all rights to this app
Age Rating: 4+ (complete questionnaire)
```

#### 3. Pricing and Availability
```
Price: Free
Availability: All territories
App Store Distribution: Make this app available on the App Store
```

#### 4. App Privacy
```
Privacy Policy URL: https://tryeidolon.com/privacy-policy.html
Privacy Practices: Complete questionnaire
- Data Not Collected: ✓ (all data stored locally)
- Data Used to Track You: None
- Data Linked to You: None
```

#### 5. Prepare for Submission
```
App Description: [Use description from app-descriptions.md]
Keywords: memory training,brain training,cognitive fitness,ADHD support,memory improvement
Screenshots: Upload 5 screenshots for iPhone 6.7"
App Preview: Upload 30-second video (optional but recommended)
```

### Google Play Console

#### 1. Create Application
1. **Log into Google Play Console**
   - Visit: https://play.google.com/console
   - Sign in with your Google account

2. **Create App**
   - Click "Create app"
   - **App name:** Eidolon - Memory Training
   - **Default language:** English (United States)
   - **App or game:** App
   - **Free or paid:** Free

#### 2. App Content
```
Content rating: Complete questionnaire (likely Everyone)
Target audience: 13 and older
Privacy Policy: https://tryeidolon.com/privacy-policy.html
```

#### 3. Data Safety
Complete the data safety questionnaire:
```
Personal info: Not collected
Financial info: Not collected
Health and fitness: Not collected
Messages: Not collected
Photos and videos: Only stored locally on device
Audio files: Only stored locally on device
Files and docs: Only stored locally on device
App activity: Anonymous usage analytics (optional, with consent)
App info and performance: Crash logs (anonymous)
Device or other IDs: Anonymous identifiers for analytics (optional)
```

#### 4. Store Listing
```
App name: Eidolon - Memory Training
Short description: Evidence-based memory training with multi-sensory weaving
Full description: [Use description from app-descriptions.md]
App icon: 512 x 512 PNG
Feature graphic: 1024 x 500 PNG
Screenshots: 2-8 screenshots for phones, tablets optional
```

## Build Commands Reference

### Development
```bash
# Start development server
npm run dev

# Build web app
npm run build

# Preview built app
npm run preview
```

### Mobile Development
```bash
# Sync changes to mobile
npm run mobile:sync

# Build and open iOS (requires Mac + Xcode)
npm run ios:build
npm run ios:open

# Build and open Android (requires Android Studio)
npm run android:build
npm run android:open
```

### Production Builds
```bash
# Full mobile build process
npm run build:mobile

# iOS production build (in Xcode)
# Product → Archive → Distribute App → App Store Connect

# Android production build (in Android Studio)
# Build → Generate Signed Bundle/APK → Android App Bundle
```

## Troubleshooting Common Issues

### iOS Build Issues
**Problem:** "No matching provisioning profiles found"
**Solution:** 
1. Ensure Apple Developer account is active
2. Create App ID in Apple Developer portal
3. Generate provisioning profile
4. Download and install in Xcode

**Problem:** "Bundle identifier already exists"
**Solution:**
1. Change bundle ID in capacitor.config.ts
2. Update in Xcode project settings
3. Create new App ID in Apple Developer portal

### Android Build Issues
**Problem:** "Gradle sync failed"
**Solution:**
1. Update Android Studio to latest version
2. Update Gradle wrapper in android/gradle/wrapper/
3. Clean and rebuild project

**Problem:** "Signing key not found"
**Solution:**
1. Generate new signing key in Android Studio
2. Store securely for future updates
3. Configure signing in build.gradle

### Capacitor Sync Issues
**Problem:** "Web assets not found"
**Solution:**
1. Run `npm run build` first
2. Ensure dist/ folder exists
3. Check capacitor.config.ts webDir setting

## Testing Strategy

### Pre-Submission Testing
1. **Functionality Testing**
   - All features work on mobile
   - Offline functionality works
   - Performance is acceptable
   - No crashes or major bugs

2. **Device Testing**
   - Test on multiple iOS devices (iPhone, iPad)
   - Test on multiple Android devices (different manufacturers)
   - Test on different OS versions
   - Test on different screen sizes

3. **User Experience Testing**
   - Navigation feels native
   - Touch targets are appropriate size
   - Text is readable on small screens
   - Loading times are acceptable

### Beta Testing
1. **iOS TestFlight**
   - Upload build to App Store Connect
   - Add internal testers (up to 100)
   - Add external testers (up to 10,000)
   - Collect feedback and iterate

2. **Google Play Internal Testing**
   - Upload AAB to Play Console
   - Add internal testers (up to 100)
   - Create testing track
   - Gather feedback and improve

## Launch Timeline

### Week 1: Setup & Build
- **Day 1-2:** Set up developer accounts
- **Day 3-4:** Install development tools
- **Day 5-7:** First builds and local testing

### Week 2: Assets & Testing
- **Day 1-3:** Create all app store assets
- **Day 4-5:** Beta testing with internal team
- **Day 6-7:** Fix issues and polish

### Week 3: Submission
- **Day 1-2:** Submit to both app stores
- **Day 3-7:** Respond to review feedback if needed

### Week 4: Launch
- **Day 1:** Apps approved and live
- **Day 2-7:** Execute launch marketing campaign

## Success Metrics to Track

### Technical Metrics
- **Crash rate:** <0.1% (industry standard)
- **App size:** <50MB (current: ~15MB)
- **Load time:** <3 seconds on 4G
- **Battery usage:** Minimal impact

### Business Metrics
- **Download rate:** Target 1000+ in first month
- **Conversion rate:** 15% free to premium
- **User retention:** 70% Day 1, 40% Day 7, 20% Day 30
- **App store rating:** 4.5+ stars

### User Experience Metrics
- **Session duration:** 8+ minutes average
- **Feature adoption:** 80% use memory weaving, 60% use scenarios
- **Support tickets:** <2% of users need help
- **Review sentiment:** 90%+ positive

## Post-Launch Maintenance

### Regular Updates
- **Monthly releases** with new features
- **Bug fixes** within 48 hours of discovery
- **OS compatibility** updates as needed
- **Security updates** as required

### App Store Optimization
- **Monitor keywords** and adjust for better discovery
- **A/B test screenshots** and descriptions
- **Respond to reviews** professionally and promptly
- **Track competitor** features and positioning

---

**🎯 Ready to Launch!** Your Eidolon app is technically ready for app store submission. The main remaining work is creating the visual assets and going through the submission process.

*Would you like me to help create specific assets like app icons or screenshots next?*