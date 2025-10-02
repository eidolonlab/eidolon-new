# 📱 App Icon Requirements & Specifications

## iOS App Store Icon Requirements

### Required Sizes (All PNG format, no transparency)
- **20x20** (iPhone Notification) - 2x and 3x = 40x40, 60x60
- **29x29** (iPhone Settings) - 2x and 3x = 58x58, 87x87  
- **40x40** (iPhone Spotlight) - 2x and 3x = 80x80, 120x120
- **60x60** (iPhone App) - 2x and 3x = 120x120, 180x180
- **76x76** (iPad App) - 1x and 2x = 76x76, 152x152
- **83.5x83.5** (iPad Pro) - 2x = 167x167
- **1024x1024** (App Store) - 1x only

### Design Guidelines
- **No transparency** - solid background required
- **Square format** - will be automatically rounded by iOS
- **High contrast** - visible at small sizes
- **Simple design** - recognizable when scaled down
- **Brand consistent** - matches Eidolon visual identity

## Android App Store Icon Requirements

### Required Sizes (PNG format)
- **48x48** (mdpi)
- **72x72** (hdpi)
- **96x96** (xhdpi)
- **144x144** (xxhdpi)
- **192x192** (xxxhdpi)
- **512x512** (Google Play Store)

### Adaptive Icon (Android 8.0+)
- **Foreground**: 108x108 (safe area: 72x72 center)
- **Background**: 108x108 (solid color or simple pattern)
- **Legacy**: 192x192 (fallback for older devices)

### Design Guidelines
- **Foreground safe area**: Keep important elements in center 72x72
- **Background**: Can be solid color or simple pattern
- **No text** in small icons
- **High contrast** for visibility

## Recommended Icon Design

### Current Eidolon Brand Elements
- **Primary Color**: #4f46e5 (Indigo)
- **Secondary**: #6366f1 (Light Indigo)
- **Accent**: #8b5cf6 (Purple)
- **Symbol**: Brain icon or "E" lettermark

### Icon Concept Options

#### Option 1: Brain Symbol
- **Background**: Gradient from #4f46e5 to #6366f1
- **Foreground**: Stylized brain icon in white
- **Style**: Modern, medical, trustworthy

#### Option 2: "E" Lettermark
- **Background**: Solid #4f46e5
- **Foreground**: Bold "E" in white with subtle brain texture
- **Style**: Clean, professional, memorable

#### Option 3: Memory Symbol
- **Background**: Gradient indigo to purple
- **Foreground**: Abstract memory/connection symbol
- **Style**: Scientific, innovative, approachable

## Icon Creation Tools

### Professional Options
- **Adobe Illustrator** - Vector-based, all sizes
- **Sketch** - UI-focused design tool
- **Figma** - Collaborative design platform

### Budget-Friendly Options
- **Canva** - Templates and easy resizing
- **GIMP** - Free alternative to Photoshop
- **Inkscape** - Free vector graphics

### AI-Assisted Options
- **Midjourney** - AI icon generation
- **DALL-E** - AI image creation
- **Stable Diffusion** - Open-source AI art

## Icon Testing Checklist

### Before Submission
- [ ] Test at smallest size (20x20) - still recognizable?
- [ ] Test on light and dark backgrounds
- [ ] Test on different device screens
- [ ] Verify no copyright issues
- [ ] Check brand consistency
- [ ] Ensure accessibility (color contrast)

### Platform-Specific Tests
- [ ] **iOS**: Test with rounded corners applied
- [ ] **Android**: Test adaptive icon on different launchers
- [ ] **Both**: Test in app store search results
- [ ] **Both**: Test in notification area

## File Organization

```
app-store-assets/
├── ios-icons/
│   ├── icon-20@2x.png (40x40)
│   ├── icon-20@3x.png (60x60)
│   ├── icon-29@2x.png (58x58)
│   ├── icon-29@3x.png (87x87)
│   ├── icon-40@2x.png (80x80)
│   ├── icon-40@3x.png (120x120)
│   ├── icon-60@2x.png (120x120)
│   ├── icon-60@3x.png (180x180)
│   ├── icon-76.png (76x76)
│   ├── icon-76@2x.png (152x152)
│   ├── icon-83.5@2x.png (167x167)
│   └── icon-1024.png (1024x1024)
├── android-icons/
│   ├── ic_launcher_48.png (48x48)
│   ├── ic_launcher_72.png (72x72)
│   ├── ic_launcher_96.png (96x96)
│   ├── ic_launcher_144.png (144x144)
│   ├── ic_launcher_192.png (192x192)
│   └── ic_launcher_512.png (512x512)
└── source/
    ├── icon-source.ai (Adobe Illustrator)
    ├── icon-source.svg (Vector source)
    └── icon-guide.pdf (Brand guidelines)
```

## Next Steps

1. **Create master icon** at 1024x1024 resolution
2. **Generate all required sizes** using design tools
3. **Test icons** at various sizes and backgrounds
4. **Add to Xcode project** (iOS)
5. **Add to Android project** (Android Studio)
6. **Submit for review**

The icon is often the first impression users have of your app - invest time in making it memorable and professional!