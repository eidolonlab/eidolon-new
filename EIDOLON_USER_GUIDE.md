# 🧠 Eidolon Memory Training App - Complete User Guide

## 📋 Table of Contents
1. [What is Eidolon?](#what-is-eidolon)
2. [Getting Started](#getting-started)
3. [Core Features Walkthrough](#core-features-walkthrough)
4. [Admin Dashboard](#admin-dashboard)
5. [Technical Architecture](#technical-architecture)
6. [Data & Privacy](#data--privacy)
7. [Clinical Foundation](#clinical-foundation)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 What is Eidolon?

Eidolon is a **Progressive Web App (PWA)** for evidence-based memory training that combines:
- **Multi-sensory memory weaving** (past memories)
- **Future scenario rehearsal** (upcoming events)
- **Spaced retrieval training** (memory strengthening)
- **Clinical analytics** (progress tracking)

### Key Benefits
- ✅ **Offline-capable** - Works without internet
- ✅ **Privacy-first** - Data stored locally on your device
- ✅ **Research-backed** - Based on cognitive science
- ✅ **Cross-platform** - Works on any device with a browser

---

## 🚀 Getting Started

### Access Methods
- **Local Development**: `http://localhost:5173`
- **Live Website**: `https://tryeidolon.com`
- **Admin Panel**: Add `/admin` to either URL

### First Time Setup
1. **Visit the app** - No account required for basic use
2. **Review privacy settings** - Choose your data sharing preferences
3. **Install as PWA** (optional) - Add to home screen for app-like experience
4. **Create your first memory weave** - Start with something simple

---

## 🎨 Core Features Walkthrough

### 1. Dashboard (Home Page)
**What you see:**
- Welcome message and quick action cards
- Recent memory weaves and upcoming scenarios
- Progress metrics (NCS scores, PMAR rates, recall speed)
- Weekly training activity chart
- AI-powered memory insights

**Key Metrics Explained:**
- **NCS Score**: Narrative Coherence/Specificity (0-100)
- **PMAR**: Prospective Memory Adherence Rate (% of completed future scenarios)
- **Recall Speed**: Clinical metric for memory retrieval time

### 2. Memory Weaving (Create Past Memories)
**Purpose**: Transform simple memory seeds into rich, multi-sensory experiences

**The Process:**
1. **Choose Type**: Past memory reconstruction
2. **Plant Seed**: Enter a simple word/phrase (e.g., "grandmother's kitchen")
3. **Add Title**: Give your memory a memorable name
4. **Training Options**: 
   - Difficulty level (easy/medium/hard)
   - Errorless mode (gentle hints vs. free recall)

**Sensory Expansion (5 Senses):**
- 👁️ **Visual**: Colors, lighting, objects, scenes
- 👂 **Auditory**: Sounds, voices, music, ambient noise
- 👃 **Olfactory**: Scents, aromas, air quality
- ✋ **Tactile**: Textures, temperatures, physical sensations
- ❤️ **Emotional**: Feelings, moods, body sensations

**AI Assistance Features:**
- **Interactive Cue Engine**: Context-aware suggestions
- **Live Memory Analyzer**: Real-time feedback on memory strength
- **Smart Narrative Builder**: AI-generated story variations
- **Contextual Hints**: Intelligent prompts based on your content

**Enhancement Tools:**
- **Cue Library**: Add audio, colors, scents, location anchors
- **Bridge Back**: Add factual anchors and verification quizzes

### 3. Scenario Studio (Future Planning)
**Purpose**: Rehearse upcoming events with implementation intentions

**The Process:**
1. **Create Scenario**: Title, seed phrase, scheduled date/time
2. **If-Then Planning**: Create specific "If X happens, then I will Y" plans
3. **Rehearsal Narrative**: Visualize successful outcomes
4. **AI Suggestions**: Context-aware if-then plans

**Example If-Then Plans:**
- "If I feel nervous, then I will take three deep breaths"
- "If they ask a difficult question, then I will pause and think before answering"
- "If technology fails, then I will continue confidently without slides"

**PMAR Tracking**: Measures how often you follow through on planned scenarios

### 4. Retrieval Training (Memory Practice)
**Purpose**: Strengthen memories through spaced retrieval practice

**Training Modes:**
- **Standard Retrieval**: Free recall with AI coaching
- **Errorless Mode**: Gentle hints prevent incorrect responses
- **Clinical Timer**: Measures recall latency (speed)

**AI Coaching Features:**
- **Real-time Analysis**: Tracks word count, sensory elements, coherence
- **Smart Hints**: Progressive, context-aware guidance
- **Encouragement**: Motivational feedback based on progress
- **Performance Metrics**: Accuracy, detail level, emotional depth

**Session Results:**
- Recall time (clinical latency measurement)
- Details recalled (quantity of specific information)
- Accuracy score (comparison to original memory)

### 5. Memory Insights (Analytics)
**AI-Powered Analysis:**
- **Pattern Detection**: Identifies trends in your training
- **Strengths**: What you excel at in memory formation
- **Recommendations**: Personalized improvement suggestions
- **Progress Tracking**: Long-term cognitive development

**Clinical Metrics:**
- Memory strength scores
- Sensory integration patterns
- Narrative coherence trends
- Retrieval speed improvements

---

## 👨‍💼 Admin Dashboard

### Access
- **URL**: `https://tryeidolon.com/admin`
- **Authentication**: Email/password (create admin account on first visit)

### Admin Features
**User Analytics:**
- Total users, memory weaves, training sessions
- Average coherence scores and recall latency
- User cohort analysis and retention rates
- Clinical outcome measurements

**Research Data:**
- Anonymized usage patterns
- Memory training effectiveness metrics
- Cognitive improvement trends
- GDPR-compliant data export

**Privacy Controls:**
- All data is anonymized with user hashes
- No personal memory content is stored
- Consent-based data collection only

---

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Router** for navigation
- **Vite** for build tooling

### Data Storage
- **Local Storage**: All personal data stays on your device
- **Supabase** (optional): Anonymous analytics and admin features
- **PWA Capabilities**: Offline functionality, installable

### Key Components
```
src/
├── components/           # UI components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── WeaveCanvas.tsx  # Memory creation interface
│   ├── RetrievalTrainer.tsx # Training sessions
│   ├── ScenarioStudio.tsx   # Future planning
│   └── AdminDashboard.tsx   # Admin interface
├── contexts/            # State management
│   └── WeaveContext.tsx # Memory data management
├── hooks/              # Custom React hooks
│   ├── usePWA.ts       # PWA functionality
│   └── useSupabaseSync.ts # Data synchronization
└── lib/                # Utilities
    └── supabase.ts     # Database integration
```

### PWA Features
- **Service Worker**: Enables offline functionality
- **Web App Manifest**: Makes app installable
- **Responsive Design**: Works on all screen sizes
- **Push Notifications**: Spaced retrieval reminders

---

## 🔒 Data & Privacy

### Local-First Architecture
- **Your Memory Content**: Never leaves your device
- **Personal Data**: Stored in browser's local storage
- **Offline Capable**: Full functionality without internet

### Optional Data Sharing
Users can opt-in to share:
- **Usage Analytics**: Anonymous app usage patterns
- **Research Data**: Anonymized training effectiveness metrics

### GDPR Compliance
- **Consent Management**: Clear opt-in/opt-out controls
- **Data Export**: Download all your data anytime
- **Right to Deletion**: Permanently delete all data
- **Transparency**: Clear privacy policy and terms

### Admin Data
- **User Hashes**: Privacy-preserving identifiers
- **Aggregated Metrics**: No individual identification possible
- **Clinical Insights**: Population-level memory training trends

---

## 🧪 Clinical Foundation

### Evidence-Based Techniques

**Multi-Sensory Memory Weaving**
- Based on research showing multi-modal encoding creates stronger memories
- Visual, auditory, tactile, olfactory, and emotional elements
- Increases retrieval pathways and memory durability

**Spaced Retrieval Training**
- Implements the spacing effect for memory consolidation
- Optimal intervals between practice sessions
- Prevents forgetting curve degradation

**Implementation Intentions (If-Then Planning)**
- Proven strategy for goal achievement
- Increases follow-through on planned actions
- Reduces cognitive load during execution

**Errorless Learning**
- Prevents incorrect responses during training
- Particularly beneficial for cognitive rehabilitation
- Builds confidence while strengthening memories

### Clinical Metrics

**Narrative Coherence Score (NCS)**
- Measures autobiographical memory specificity
- 0-100 scale based on detail richness and structure
- Clinical indicator of memory quality

**Prospective Memory Adherence Rate (PMAR)**
- Percentage of completed future scenarios
- Real-world measure of implementation success
- Clinical metric for executive function

**Recall Latency**
- Time from cue to memory retrieval initiation
- Faster latency indicates stronger consolidation
- Standard cognitive assessment measure

---

## 🛠️ Troubleshooting

### Common Issues

**App Won't Load**
- Check internet connection for initial load
- Clear browser cache and reload
- Try incognito/private browsing mode

**Admin Panel Not Working**
- Ensure you're using the correct URL: `/admin`
- Check if Supabase is configured (for full functionality)
- Try creating a new admin account

**Data Not Saving**
- Check browser storage permissions
- Ensure you're not in private/incognito mode
- Try refreshing the page

**PWA Installation Issues**
- Use Chrome, Edge, or Safari for best PWA support
- Look for install prompt in address bar
- Check if already installed (may not show prompt)

### Performance Tips
- **Regular Training**: Use spaced intervals for best results
- **Detailed Memories**: More sensory details = stronger recall
- **Consistent Practice**: Regular sessions improve outcomes
- **Varied Content**: Mix past memories and future scenarios

### Getting Help
- **Privacy Questions**: privacy@tryeidolon.com
- **Technical Support**: support@tryeidolon.com
- **Research Inquiries**: partnerships@tryeidolon.com

---

## 🎯 Best Practices

### For Memory Weaving
1. **Start Simple**: Begin with clear, specific memory seeds
2. **Be Detailed**: Include multiple sensory modalities
3. **Stay Truthful**: Accuracy strengthens neural pathways
4. **Use Emotions**: Emotional content enhances retention

### For Scenario Planning
1. **Be Specific**: Detailed if-then plans work better
2. **Practice Regularly**: Mental rehearsal builds confidence
3. **Plan Contingencies**: Prepare for multiple outcomes
4. **Follow Through**: Complete scenarios to build PMAR

### For Retrieval Training
1. **Regular Practice**: Consistent sessions prevent forgetting
2. **Progressive Difficulty**: Start easy, increase challenge
3. **Use Errorless Mode**: When building confidence
4. **Track Progress**: Monitor improvement over time

---

## 📊 Understanding Your Progress

### Dashboard Metrics
- **Green Scores (80+)**: Excellent performance
- **Yellow Scores (60-79)**: Good with room for improvement
- **Red Scores (<60)**: Focus area for development

### Training Insights
- **Consistency**: Regular practice shows in weekly charts
- **Improvement**: Watch coherence scores increase over time
- **Balance**: Mix memory types for comprehensive training

### Clinical Relevance
- **NCS Scores**: Higher scores indicate better autobiographical memory
- **PMAR Rates**: Higher rates show better executive function
- **Recall Speed**: Faster times indicate stronger consolidation

---

*This guide covers the current functionality of Eidolon as deployed. The app continues to evolve with new features and improvements based on user feedback and clinical research.*

**Version**: Current deployment (January 2025)  
**Last Updated**: Today  
**For Support**: Visit https://tryeidolon.com or contact support@tryeidolon.com