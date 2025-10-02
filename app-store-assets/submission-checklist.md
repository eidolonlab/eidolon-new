# ✅ App Store Submission Checklist

## Pre-Submission Requirements

### Developer Accounts Setup
- [ ] **Apple Developer Account** ($99/year)
  - Sign up at: https://developer.apple.com
  - Complete enrollment process (can take 24-48 hours)
  - Verify identity and payment method
- [ ] **Google Play Developer Account** ($25 one-time)
  - Sign up at: https://play.google.com/console
  - Complete registration and verification
  - Accept developer agreement

### Development Environment
- [ ] **Mac computer** with macOS (for iOS development)
- [ ] **Xcode** installed (latest version from Mac App Store)
- [ ] **Android Studio** installed
- [ ] **iOS device** for testing (iPhone/iPad)
- [ ] **Android device** for testing

### App Assets Created
- [ ] **App icons** (all required sizes for both platforms)
- [ ] **Screenshots** (5 screenshots per platform/device size)
- [ ] **App descriptions** written and optimized
- [ ] **Keywords** researched and selected
- [ ] **Privacy policy** accessible online ✅ (already done)
- [ ] **Terms of service** accessible online ✅ (already done)

## iOS App Store Submission

### App Store Connect Setup
1. **Create App Record**
   - Log into App Store Connect
   - Click "My Apps" → "+" → "New App"
   - Fill in app information:
     - **Platform:** iOS
     - **Name:** Eidolon - Memory Training
     - **Primary Language:** English
     - **Bundle ID:** com.tryeidolon.app
     - **SKU:** eidolon-memory-training

2. **App Information**
   - **Category:** Health & Fitness (Primary), Education (Secondary)
   - **Content Rights:** You own or have licensed all rights
   - **Age Rating:** Complete questionnaire (likely 4+)
   - **Privacy Policy URL:** https://tryeidolon.com/privacy-policy.html

3. **Pricing and Availability**
   - **Price:** Free (with in-app purchases)
   - **Availability:** All territories
   - **App Store Distribution:** Available

### Build Upload Process
1. **Build in Xcode**
   ```bash
   npm run ios:build
   npm run ios:open
   ```
2. **Archive the app** (Product → Archive in Xcode)
3. **Upload to App Store Connect** (Distribute App → App Store Connect)
4. **Wait for processing** (10-60 minutes)

### App Store Review Submission
1. **Select build** in App Store Connect
2. **Add app metadata:**
   - App description
   - Keywords
   - Screenshots
   - App preview videos (optional)
3. **Submit for review**
4. **Wait for approval** (24-48 hours typically)

## Google Play Store Submission

### Google Play Console Setup
1. **Create Application**
   - Log into Google Play Console
   - Click "Create app"
   - Fill in app details:
     - **App name:** Eidolon - Memory Training
     - **Default language:** English
     - **App or game:** App
     - **Free or paid:** Free

2. **App Content**
   - **Content rating:** Complete questionnaire
   - **Target audience:** 13+ (or appropriate age)
   - **Privacy Policy:** https://tryeidolon.com/privacy-policy.html
   - **Data safety:** Complete data collection questionnaire

### Build Upload Process
1. **Build APK/AAB**
   ```bash
   npm run android:build
   npm run android:open
   ```
2. **Generate signed bundle** in Android Studio
3. **Upload to Play Console** (Release → Production → Create new release)
4. **Add release notes**

### Store Listing
1. **Product details:**
   - App name and description
   - Screenshots for all device types
   - Feature graphic (1024 x 500)
   - App icon (512 x 512)

2. **Store settings:**
   - Category: Health & Fitness
   - Tags: memory training, brain training, cognitive fitness
   - Contact details

## Testing Before Submission

### iOS Testing
- [ ] **TestFlight internal testing** (up to 100 testers)
- [ ] **TestFlight external testing** (up to 10,000 testers)
- [ ] **Device compatibility** testing
- [ ] **iOS version compatibility** (iOS 13+)
- [ ] **Performance testing** on older devices

### Android Testing
- [ ] **Internal testing** (up to 100 testers)
- [ ] **Closed testing** (up to 1,000 testers)
- [ ] **Open testing** (unlimited testers)
- [ ] **Device compatibility** across manufacturers
- [ ] **Android version compatibility** (API 21+)

## Common Rejection Reasons & How to Avoid

### iOS App Store
- **Incomplete functionality** → Ensure all features work
- **Crashes or bugs** → Thorough testing required
- **Misleading metadata** → Accurate descriptions only
- **Privacy violations** → Clear privacy policy and practices
- **Design guidelines** → Follow Human Interface Guidelines

### Google Play Store
- **Policy violations** → Review content policies
- **Technical issues** → Test on multiple devices
- **Metadata quality** → Professional descriptions and images
- **Privacy compliance** → Complete data safety section
- **Target API level** → Meet current requirements

## Post-Submission Monitoring

### After Submission
- [ ] **Monitor review status** daily
- [ ] **Respond to reviewer feedback** within 7 days
- [ ] **Prepare for potential rejections** with fixes ready
- [ ] **Plan launch marketing** for approval day

### After Approval
- [ ] **Monitor crash reports** and user feedback
- [ ] **Respond to user reviews** professionally
- [ ] **Track key metrics** (downloads, ratings, revenue)
- [ ] **Plan regular updates** (monthly recommended)

## Launch Day Preparation

### Marketing Assets Ready
- [ ] **Press release** for mobile app launch
- [ ] **Social media posts** announcing availability
- [ ] **Email announcement** to existing users
- [ ] **Website updates** with app store badges

### Support Preparation
- [ ] **FAQ updates** for mobile-specific questions
- [ ] **Support documentation** for app store users
- [ ] **Feedback collection** system for mobile users
- [ ] **Bug reporting** process for mobile issues

## Revenue Optimization

### In-App Purchase Setup
- [ ] **iOS:** Configure in App Store Connect
- [ ] **Android:** Configure in Google Play Console
- [ ] **Test purchases** in sandbox environment
- [ ] **Implement purchase flow** in app
- [ ] **Set up analytics** for purchase tracking

### Subscription Management
- [ ] **Free trial periods** (7 days recommended)
- [ ] **Subscription tiers** clearly defined
- [ ] **Cancellation flow** user-friendly
- [ ] **Renewal notifications** implemented

## Timeline Estimate

### Week 1: Setup & Assets
- Set up developer accounts
- Create all required assets
- Build and test locally

### Week 2: Testing & Polish
- Internal testing on devices
- Fix any platform-specific issues
- Finalize store listings

### Week 3: Submission
- Submit to both app stores
- Respond to any feedback
- Make required changes

### Week 4: Launch
- Apps approved and live
- Execute launch marketing
- Monitor initial performance

## Success Metrics to Track

### Download Metrics
- **App store impressions** and conversion rates
- **Download numbers** by platform and region
- **User acquisition cost** by channel

### User Engagement
- **App opens** and session duration
- **Feature usage** compared to web version
- **Retention rates** (Day 1, 7, 30)

### Revenue Metrics
- **Free to premium conversion** rates
- **In-app purchase revenue** by platform
- **Subscription retention** and churn rates

### Quality Metrics
- **App store ratings** and review sentiment
- **Crash rates** and performance issues
- **Support ticket volume** and resolution time

---

**🎯 Goal:** Launch Eidolon as a top-rated memory training app that provides genuine cognitive benefits while maintaining the highest privacy and quality standards.

*This checklist ensures a smooth app store submission process and successful mobile app launch.*