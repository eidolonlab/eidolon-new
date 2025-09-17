import type { Weave, RetrievalSession } from '../contexts/WeaveContext';

export const createSampleWeaves = (): Weave[] => {
  const now = new Date();
  
  return [
    // Sample Past Memory 1
    {
      id: 'sample-past-1',
      type: 'past',
      seed: 'grandmother\'s kitchen',
      title: 'Sunday Morning at Grandma\'s',
      narrative: 'I remember walking into grandmother\'s kitchen on that Sunday morning. The warm golden sunlight streamed through the lace curtains, casting dancing patterns on the worn wooden table. I could hear the gentle sizzling of bacon in the cast iron pan and the soft humming of my grandmother as she moved gracefully around her domain. The air was filled with the rich aroma of fresh coffee brewing and the sweet scent of cinnamon rolls rising in the oven. Everything felt warm and safe - the smooth coolness of the marble countertop under my small hands, the soft fabric of grandma\'s apron as she hugged me close. I felt completely loved and at peace, surrounded by the comfort of family traditions and unconditional care.',
      sensoryDetails: {
        visual: 'Warm golden sunlight streaming through lace curtains, casting dancing patterns on worn wooden table, grandmother moving gracefully in her floral apron',
        auditory: 'Gentle sizzling of bacon in cast iron pan, soft humming, coffee percolating, quiet morning sounds',
        olfactory: 'Rich aroma of fresh coffee brewing, sweet scent of cinnamon rolls rising, hint of vanilla and butter',
        tactile: 'Smooth coolness of marble countertop, soft fabric of grandmother\'s apron, warm kitchen air',
        emotional: 'Completely loved and at peace, surrounded by comfort of family traditions and unconditional care'
      },
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      lastRetrieved: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      retrievalCount: 2,
      coherenceScore: 92,
      tags: ['family', 'comfort', 'childhood'],
      errorlessMode: false,
      difficultyLevel: 'medium',
      cues: {
        music: 'Peaceful Piano',
        colors: ['#FFE66D', '#FF8E53', '#C7CEEA', '#F4A460'],
        scents: ['Vanilla', 'Cinnamon', 'Coffee']
      },
      bridgeData: {
        factualAnchors: [
          'It was a Sunday morning in October',
          'Grandmother lived on Maple Street',
          'The kitchen had a gas stove from the 1950s',
          'She always made cinnamon rolls on Sundays'
        ],
        peopleInvolved: ['Grandmother Helen', 'Me (age 8)']
      }
    },
    
    // Sample Past Memory 2
    {
      id: 'sample-past-2',
      type: 'past',
      seed: 'first day at work',
      title: 'Starting My Career Journey',
      narrative: 'I remember walking through the glass doors of the office building on my first day at work. The lobby was bright and modern, with polished marble floors that reflected the overhead lights. I could hear the gentle hum of air conditioning and the distant sound of elevators opening and closing. The air smelled clean and professional, with a hint of fresh flowers from the reception desk arrangement. My new badge felt smooth and official in my hand, and I could feel my heart beating with nervous excitement. I felt a mixture of anticipation and determination, ready to prove myself in this new chapter of my life.',
      sensoryDetails: {
        visual: 'Bright modern lobby with polished marble floors reflecting overhead lights, glass doors, professional reception area',
        auditory: 'Gentle hum of air conditioning, distant elevator sounds, quiet professional atmosphere',
        olfactory: 'Clean professional air with hint of fresh flowers from reception desk arrangement',
        tactile: 'Smooth new employee badge in hand, cool air conditioning, firm handshakes',
        emotional: 'Nervous excitement, heart beating fast, mixture of anticipation and determination to prove myself'
      },
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      lastRetrieved: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      retrievalCount: 1,
      coherenceScore: 85,
      tags: ['career', 'milestone', 'professional'],
      errorlessMode: false,
      difficultyLevel: 'medium',
      cues: {
        music: 'Focus Flow',
        location: { name: 'Downtown Office Building' }
      },
      bridgeData: {
        factualAnchors: [
          'It was a Monday morning in September',
          'The building was on 5th Avenue',
          'I started at 9:00 AM sharp',
          'My manager\'s name was Sarah Johnson'
        ],
        peopleInvolved: ['Sarah Johnson (Manager)', 'Rebecca (HR)', 'Me']
      }
    },
    
    // Sample Future Scenario 1
    {
      id: 'sample-future-1',
      type: 'future',
      seed: 'important presentation',
      title: 'Quarterly Review Presentation',
      narrative: 'I\'m preparing for my quarterly review presentation next week. I envision walking into the conference room with confidence, seeing the familiar faces of my colleagues and the large screen ready for my slides. I anticipate hearing the gentle hum of the projector and the attentive silence as I begin speaking. The room will feel professional yet supportive, with the cool temperature keeping everyone alert. I want to approach this feeling calm, prepared, and excited to share my achievements. By rehearsing these details, I\'m building confidence for when the moment arrives.',
      sensoryDetails: {
        visual: 'Conference room with large screen, familiar colleague faces, professional lighting, organized presentation materials',
        auditory: 'Gentle projector hum, attentive silence, clear confident voice, occasional supportive murmurs',
        olfactory: 'Clean conference room air, hint of coffee from nearby break room',
        tactile: 'Cool professional temperature, smooth presentation clicker, firm confident handshakes',
        emotional: 'Calm, prepared, and excited to share achievements, confident in my abilities'
      },
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      scheduledFor: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      retrievalCount: 0,
      coherenceScore: 88,
      tags: ['work', 'presentation', 'career'],
      completed: false,
      errorlessMode: false,
      difficultyLevel: 'medium',
      ifThenPlans: [
        'If I feel nervous, then I will take three deep breaths and remind myself of my preparation',
        'If someone asks a challenging question, then I will pause, think, and answer honestly',
        'If technology fails, then I will continue confidently without slides and engage directly',
        'If I lose my place, then I will pause, refer to my notes, and continue smoothly'
      ],
      cues: {
        music: 'Focus Flow',
        colors: ['#4ECDC4', '#44A08D', '#096DD9', '#B8E6B8'],
        location: { name: 'Main Conference Room' }
      }
    },
    
    // Sample Future Scenario 2
    {
      id: 'sample-future-2',
      type: 'future',
      seed: 'family dinner',
      title: 'Holiday Family Gathering',
      narrative: 'I\'m preparing for our family holiday dinner next month. I imagine the dining room filled with warm candlelight and the cheerful chatter of relatives catching up. I anticipate the delicious aromas of traditional holiday foods and the clinking of glasses during toasts. The atmosphere will feel festive yet intimate, with everyone gathered around the extended table. I want to approach this feeling grateful, present, and ready to create meaningful connections with family members I haven\'t seen in a while.',
      sensoryDetails: {
        visual: 'Dining room with warm candlelight, extended table with holiday decorations, family members in festive attire',
        auditory: 'Cheerful family chatter, clinking glasses during toasts, background holiday music, laughter',
        olfactory: 'Delicious aromas of traditional holiday foods, pine from decorations, vanilla candles',
        tactile: 'Warm hugs from relatives, smooth wine glasses, comfortable dining chairs, cozy room temperature',
        emotional: 'Grateful, present, and ready to create meaningful family connections, joy and warmth'
      },
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      scheduledFor: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      retrievalCount: 1,
      coherenceScore: 90,
      tags: ['family', 'holiday', 'celebration'],
      completed: false,
      errorlessMode: false,
      difficultyLevel: 'easy',
      ifThenPlans: [
        'If conversation gets tense, then I will redirect to positive shared memories',
        'If I feel overwhelmed, then I will step outside for fresh air and return refreshed',
        'If someone asks about sensitive topics, then I will acknowledge and gently change the subject',
        'If I want to leave early, then I will stay for at least one meaningful conversation'
      ],
      cues: {
        music: 'Warm Holiday Ambience',
        colors: ['#FF6B6B', '#FFE66D', '#52C41A', '#F4A460'],
        scents: ['Vanilla', 'Pine Forest', 'Cinnamon'],
        location: { name: 'Family Home Dining Room' }
      }
    },
    
    // Sample Past Memory 3
    {
      id: 'sample-past-3',
      type: 'past',
      seed: 'beach sunset',
      title: 'Perfect Evening by the Ocean',
      narrative: 'I remember that perfect evening by the ocean when the sunset painted the sky in brilliant oranges and purples. The waves rhythmically crashed against the shore, creating a soothing soundtrack that seemed to sync with my breathing. The salty sea air filled my lungs with each deep breath, mixed with the faint scent of seaweed and distant barbecues. The sand felt warm and soft beneath my bare feet, still holding the heat from the day\'s sun. I felt completely at peace, grateful for this moment of natural beauty and the sense of infinite possibility that stretched out before me like the endless horizon.',
      sensoryDetails: {
        visual: 'Brilliant orange and purple sunset painting the sky, waves crashing rhythmically, endless horizon stretching ahead',
        auditory: 'Rhythmic waves crashing against shore, gentle sea breeze, distant seagulls calling, peaceful silence',
        olfactory: 'Salty sea air, faint scent of seaweed, distant barbecue smoke, fresh ocean breeze',
        tactile: 'Warm soft sand beneath bare feet, gentle sea breeze on skin, cool ocean spray occasionally',
        emotional: 'Completely at peace, grateful for natural beauty, sense of infinite possibility and freedom'
      },
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      retrievalCount: 0,
      coherenceScore: 94,
      tags: ['nature', 'peace', 'sunset'],
      errorlessMode: false,
      difficultyLevel: 'medium',
      cues: {
        music: 'Ocean Waves',
        colors: ['#FF8E53', '#FFE66D', '#4ECDC4', '#C7CEEA'],
        scents: ['Ocean Breeze', 'Fresh Linen']
      },
      bridgeData: {
        factualAnchors: [
          'It was a Friday evening in late summer',
          'The beach was Sunset Cove on the west coast',
          'Temperature was about 72°F',
          'Sunset occurred at 7:45 PM'
        ],
        peopleInvolved: ['Me', 'A few distant beachgoers']
      }
    }
  ];
};

export const createSampleRetrievalSessions = (): RetrievalSession[] => {
  const now = new Date();
  
  return [
    {
      id: 'sample-session-1',
      weaveId: 'sample-past-1',
      startTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      endTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 1000), // 2 minutes later
      latencyMs: 8500,
      detailsRecalled: 4,
      accuracy: 85,
      difficulty: 'medium'
    },
    {
      id: 'sample-session-2',
      weaveId: 'sample-past-2',
      startTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      endTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 1000), // 3 minutes later
      latencyMs: 12000,
      detailsRecalled: 3,
      accuracy: 78,
      difficulty: 'medium'
    },
    {
      id: 'sample-session-3',
      weaveId: 'sample-past-1',
      startTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      endTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 1000), // 1.5 minutes later
      latencyMs: 6200,
      detailsRecalled: 5,
      accuracy: 92,
      difficulty: 'easy'
    },
    {
      id: 'sample-session-4',
      weaveId: 'sample-future-1',
      startTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      endTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 1000), // 4 minutes later
      latencyMs: 15000,
      detailsRecalled: 3,
      accuracy: 88,
      difficulty: 'hard'
    }
  ];
};