export default {
  nav: {
    home: 'Home',
    profile: 'Profile',
    categories: 'Categories',
    privacy: 'Privacy',
    settings: 'Settings',
    more: 'More',
    homeDescription: 'Home',
    categoriesDescription: 'AI Effects',
    privacyDescription: 'Privacy Policy',
    moreDescription: 'Contact & About',
  },
  common: {
    search: 'Search',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    complete: 'Complete',
    month: 'Month',
    day: 'Day',
    all: 'All',
    image: 'Image',
    video: 'Video',
    noFavorites: 'No favorites yet',
    startCreating: 'Start creating works and add them to favorites!',
    characters: 'Characters',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    enabled: 'Enabled',
    enhanceSecurity: 'Enhance account security',
    enable: 'Enable',
    delete: 'Delete',
    export: 'Export',
    exportAll: 'Export All',
    exportGenerations: 'Export all generation records in JSON format',
    exportSettings: 'Export personal settings and preferences',
    exportAllData: 'Export all user data',
    profileVisibility: 'Profile Visibility',
    showGenerationHistory: 'Show Generation History',
    allowOthersViewHistory: 'Allow other users to view your generation history',
    showOnlineStatus: 'Show Online Status',
    contentSharingPermissions: 'Content Sharing Permissions',
    allowDirectMessages: 'Allow Direct Messages',
    allowOthersSendMessages: 'Allow other users to send you direct messages',
    dataCollectionAndAnalysis: 'Data Collection and Analysis',
    allowDataCollection: 'Allow Data Collection',
    allowUsCollectData: 'Allow us to collect usage data to improve service',
    allowAnalyticsTracking: 'Allow Analytics Tracking',
    allowUsAnalyzeBehavior: 'Allow us to analyze your usage behavior to optimize experience',
    dataRetentionPeriod: 'Data Retention Period (Days)',
    dataWillBeDeleted: 'Data exceeding this period will be automatically deleted',
    dataManagement: 'Data Management',
    exportData: 'Export Data',
    resetToDefault: 'Reset to Default',
    deleteAllData: 'Delete All Data',
  },
  auth: {
    title: 'Login to Och AI',
    googleLogin: 'Sign in with Google',
    or: 'or',
    magicLink: {
      title: 'Magic Link Login',
      description: 'Enter your email address and we will send a login link to your email',
      emailLabel: 'Email Address',
      emailPlaceholder: 'your@email.com',
      sendButton: 'Send Magic Link',
      sending: 'Sending...',
      success: 'Verification email sent, please check your email',
      error: 'Please enter your email address',
    },
    terms: 'By logging in, you agree to our Terms of Service and Privacy Policy',
    loading: 'Signing in...',
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'Learn how we protect your privacy and data security',
    section1: {
      title: 'Information Collection',
      content:
        'We collect information you voluntarily provide, including uploaded images, generation preferences, and account information. We do not collect your personal sensitive information unless you explicitly consent.',
    },
    section2: {
      title: 'Information Use',
      content:
        'We use the collected information to provide AI image generation services, improve user experience, provide customer support, and perform necessary technical maintenance.',
    },
    section3: {
      title: 'Information Protection',
      content:
        'We employ industry-standard security measures to protect your information, including data encryption, secure transmission, and access control. Your image data is securely processed after generation.',
    },
    section4: {
      title: 'Data Sharing',
      content:
        'We do not sell, trade, or transfer your personal information to third parties. We only share your information when legally required or with your explicit consent.',
    },
    section5: {
      title: 'Your Rights',
      content:
        'You have the right to access, correct, delete your personal information, and withdraw consent. If you are logged in, you can manage these options in the privacy settings of your profile.',
    },
    section6: {
      title: 'Contact Us',
      content:
        'If you have any questions about the privacy policy, please contact us through the feedback function in the app. We will respond to your inquiries within 24 hours.',
    },
    lastUpdated: 'Last Updated',
    updateDate: 'September 2025',
    manageSettings: {
      title: 'Manage Your Privacy Settings',
      description:
        'To manage your personal privacy settings and data permissions, please log in and configure them in your profile.',
      button: 'Go to Profile',
    },
  },
  home: {
    hero: {
      title: 'AI Image Generation & Editing',
      subtitle:
        'Upload your photos, choose AI effects, and get professional-grade images in seconds. Support for 50+ effects including 3D figurines, anime styles, HD enhancement, and more.',
      cta: 'Start Creating',
      explore: 'Explore Features',
      badge: 'AI-Powered Creative Tools',
      slogan: 'Transform Every Photo Into Art',
      before: 'Before',
      after: 'After',
      originalPhoto: 'Original Photo',
      aiArtwork: 'AI Artwork',
      tryFree: 'Try Free Now',
      goPro: 'Go Pro',
      freeTrial: '✨ 3 free generations • No credit card required • Powered by Nano Banana AI',
      poweredBy: 'Powered by Nano Banana AI',
      loading: 'Loading...',
      stats: {
        users: 'User Generations',
        models: 'AI Models',
        uptime: 'Uptime',
      },
    },
    features: {
      title: '50+ AI Image Effects',
      subtitle:
        'From 3D figurines to anime styles, from HD enhancement to artistic creation, meet all your image processing needs',
      viewAll: 'View All Features',
      badge: 'Powerful Features',
      preview: {
        figurine: {
          title: 'Photo → 3D Figurine',
          description:
            'Transform your photos into exquisite 3D collectible figurines with professional packaging',
          processingTime: 'Processing time: 30s',
          resolution: 'Resolution: 1024x1024',
          badge: '3D Figurine',
        },
        anime: {
          title: 'Real Photo → Anime Character',
          description:
            'Convert real photos into beautiful anime-style images while preserving character features',
          processingTime: 'Processing time: 25s',
          resolution: 'Resolution: 1024x1024',
          badge: 'Anime Style',
        },
        plushie: {
          title: 'Real Photo → Cute Plushie',
          description:
            'Transform real photos into adorable plushie style while preserving character features',
          processingTime: 'Processing time: 25s',
          resolution: 'Resolution: 1024x1024',
          badge: 'Plushie',
        },
      },
    },
    howItWorks: {
      title: 'How It Works',
      subtitle: 'Create amazing AI-generated content in just three simple steps',
      badge: 'How It Works',
      steps: {
        upload: {
          title: 'Upload Your Photo',
          description: 'Select any image - supports JPEG, PNG or WebP format, max 5MB',
        },
        choose: {
          title: 'Choose Art Style',
          description: 'Select from 50+ AI effects including 3D figurines, anime, plushie styles',
        },
        download: {
          title: 'Download & Share',
          description: 'Get your transformed artwork instantly and share on social media',
        },
      },
    },
    advancedFeatures: {
      title: 'Advanced AI Features',
      subtitle: 'Powered by Nano Banana AI for superior results',
      features: {
        promptBased: {
          title: 'Prompt-Based Local Editing',
          description:
            'Use och.ai for precise, context-aware updates without breaking composition. Superior to traditional image editing tools.',
        },
        multiImage: {
          title: 'Multi-Image Fusion',
          description:
            'Seamlessly fuse multiple images using och.ai technology. Advanced multi-image context understanding for complex compositions.',
        },
        worldKnowledge: {
          title: 'World Knowledge Integration',
          description:
            "Leverage advanced AI's vast knowledge base for contextually accurate image generation. och.ai models understand real-world relationships and semantics.",
        },
        characterConsistency: {
          title: 'Character Identity Preservation',
          description:
            'Maintain perfect facial identity and style consistency during editing. Leading LMArena och.ai performance in character consistency.',
        },
        sceneAware: {
          title: 'Scene-Aware Processing',
          description:
            'Maintain lighting, depth and composition when applying targeted edits. Superior scene integration capabilities compared to other AI models.',
        },
        professionalContent: {
          title: 'Professional Content Creation',
          description:
            'Generate consistent AI-driven content for social media, marketing and storytelling. Learn how to use och.ai in professional workflows.',
        },
      },
    },
    demo: {
      title: 'Demo Gallery',
      subtitle: 'See amazing works created by other users and get inspired for your own creations',
      beforeAfter: 'Before & After',
      seeMore: 'View More Works',
    },
    useCases: {
      title: 'Use Cases',
      subtitle:
        'Whether you are a designer, content creator or regular user, you can find suitable AI effects',
      badge: 'Use Cases',
      cases: [
        {
          title: 'Social Media Content',
          description:
            'Create unique avatars and cover images for Instagram, Xiaohongshu and other platforms',
          icon: '📱',
        },
        {
          title: 'Gaming Avatars',
          description:
            'Create exclusive avatars for games and social platforms, 3D figurine style makes characters more vivid',
          icon: '👤',
        },
        {
          title: 'Business Design',
          description:
            'Professional design needs such as product rendering and architectural models',
          icon: '💼',
        },
        {
          title: 'Art Creation',
          description:
            'Artistic effects like Van Gogh style and cyberpunk to unleash your creativity',
          icon: '🎨',
        },
      ],
    },
    pricing: {
      title: 'Choose Your Plan',
      subtitle: 'Flexible pricing plans to meet different needs',
      transparent: 'Transparent Pricing',
      free: 'Free',
      professional: 'Professional',
      enterprise: 'Enterprise',
      monthly: 'Monthly',
      tryFree: 'Try Free Now',
      upgradePro: 'Upgrade to Pro',
      contactSales: 'Contact Sales',
      freeFeatures: {
        generations: '3 generations per day',
        quality: 'High quality output',
        noCard: 'No credit card required',
        poweredBy: 'Powered by Nano Banana AI',
      },
      proFeatures: {
        generations: '100 generations per month',
        quality: 'HD quality output',
        priority: 'Priority processing',
        styles: 'All art styles included',
      },
      enterpriseFeatures: {
        generations: 'Unlimited generations',
        quality: 'Ultra HD quality',
        api: 'API access',
        support: 'Priority support',
      },
      trusted: {
        title: 'Trusted & Secure',
        subtitle: 'Built with advanced AI technology',
        description: 'Powered by Nano Banana AI for exceptional results',
      },
      powered: {
        title: 'Powered by Nano Banana AI',
        subtitle: 'Advanced AI technology',
        description:
          'Advanced AI technology for exceptional character consistency and scene preservation',
      },
      privacy: {
        title: 'Privacy First',
        subtitle: 'Your photos are never stored, shared, or used for training',
        description: 'Complete privacy protection with automatic deletion after processing',
      },
      testimonials: {
        title: 'User Reviews',
        quote:
          '"Amazing results! The 3D figurine effect is incredible. Much better than other AI tools I\'ve tried." - Ms. Zhang',
      },
      faq: {
        title: 'Frequently Asked Questions',
        subtitle: 'Everything you need to know',
        description:
          'Get answers to common questions about och.ai and our AI image generation service',
        questions: [
          {
            question: 'How does och.ai work?',
            answer:
              'Simply upload your photo, choose an AI art style, and get your transformed image in seconds. Powered by Nano Banana AI technology.',
          },
          {
            question: 'Is my data safe?',
            answer:
              'Yes! Your photos are never stored, shared, or used for training. Complete privacy protection with automatic deletion after processing.',
          },
          {
            question: 'Do you offer a free trial?',
            answer:
              'Yes! New users get 3 free generations to try our service. No credit card required to get started.',
          },
          {
            question: 'Can I use generated images commercially?',
            answer:
              'Absolutely! All generated images can be used for commercial projects, social media, marketing materials, and more.',
          },
          {
            question: 'What makes och.ai different?',
            answer:
              'We use advanced Nano Banana AI technology with superior character consistency and scene preservation compared to other AI tools.',
          },
          {
            question: 'How can I get support?',
            answer:
              'For technical support or customer service, contact us at support@och.ai. We typically respond within 24 hours.',
          },
        ],
      },
      finalCta: {
        title: 'Ready to transform your photos?',
        subtitle:
          'Join thousands of creators using och.ai to create amazing AI artwork. Start with 3 free generations today!',
        button: 'Try Free Now',
        viewPricing: 'View Pricing',
        noCard: 'No credit card required • 3 free generations • Powered by Nano Banana AI',
      },
    },
    gallery: {
      title: 'Gallery',
      subtitle: 'See amazing works created by other users and get inspired for your own creations',
      cases: {
        figurine: {
          title: '3D Figurine',
          description: 'Transform photos into collectible 3D figurines',
        },
        anime: {
          title: 'Anime Style',
          description: 'Convert real photos to anime characters',
        },
        plushie: {
          title: 'Plushie Style',
          description: 'Create adorable plushie versions',
        },
        artistic: {
          title: 'Artistic Effects',
          description: 'Apply various artistic transformations',
        },
      },
    },
    cta: {
      title: 'Ready to Start Creating?',
      subtitle: 'Join thousands of creators and experience the infinite possibilities of AI',
      button: 'Start Creating Now',
    },
  },
  app: {
    title: 'Och AI',
    history: 'History',
    back: 'Back',
    chooseAnotherEffect: 'Choose Another Effect',
    generateImage: 'Generate Image',
    generating: 'Generating...',
    result: 'Result',
    yourImageWillAppear: 'Your generated image will appear here.',
    login: 'Login',
    logout: 'Logout',
    settings: 'Settings',
    admin: 'Admin',
    loginRequired: 'Please login to use this feature',
    loginPrompt: {
      title: 'Login Required',
      cancel: 'Cancel',
    },
    magicLink: {
      title: 'Magic Link Login',
      description: "Enter your email address and we'll send you a login link",
      emailLabel: 'Email Address',
      emailPlaceholder: 'Enter your email address',
      sendLink: 'Send Login Link',
      sending: 'Sending...',
      linkSent: 'Login Link Sent',
      checkEmail:
        "We've sent a login link to your email. Please check your inbox and click the link to complete login.",
      emailSentTo: 'Sent to',
      close: 'Close',
    },
    loginOptions: {
      google: 'Sign in with Google',
      magicLink: 'Sign in with Magic Link',
    },
    userSettings: {
      title: 'User Settings',
      basicInfo: 'Basic Information',
      preferences: 'Preferences',
      displayName: 'Display Name',
      username: 'Username',
      avatarUrl: 'Avatar URL',
      language: 'Language',
      theme: 'Theme',
      notifications: 'Receive Notifications',
      save: 'Save Settings',
      saving: 'Saving...',
      saved: 'Saved',
      pleaseLogin: 'Please login to manage your settings',
      tabs: {
        profile: 'Profile',
        stats: 'Usage Stats',
        history: 'Generation History',
        account: 'Account Management',
        export: 'Data Export',
      },
      account: {
        title: 'Account Information',
        email: 'Email Address',
        registrationDate: 'Registration Date',
        subscriptionStatus: 'Subscription Status',
        free: 'Free',
        premium: 'Premium',
        admin: 'Admin',
      },
      security: {
        title: 'Security Settings',
        loginMethod: 'Login Method',
        twoFactorAuth: 'Two-Factor Authentication',
        twoFactorAuthDesc: 'Enhance account security',
        enable: 'Enable',
        enabled: 'Enabled',
        dangerZone: 'Danger Zone',
        deleteAccount: 'Delete Account',
        deleteAccountDesc: 'Permanently delete account and all data',
        delete: 'Delete',
      },
      export: {
        title: 'Data Export',
        generationHistory: 'Generation History',
        generationHistoryDesc: 'Export all generation records in JSON format',
        userSettings: 'User Settings',
        userSettingsDesc: 'Export personal settings and preferences',
        completeData: 'Complete Data',
        completeDataDesc: 'Export all user data',
        export: 'Export',
        exportAll: 'Export All',
        import: {
          title: 'Data Import',
          selectFile: 'Select JSON file',
          noFileChosen: 'No file chosen',
          importSettings: 'Import Settings',
        },
      },
      placeholders: {
        displayName: 'Enter your display name',
        username: 'Enter your username',
        avatarUrl: 'https://example.com/avatar.jpg',
      },
    },
    profile: {
      title: 'User Center',
      subtitle: 'Manage your account, settings and history',
      loginRequired: 'Login Required',
      loginRequiredDescription: 'You need to login to access the user center',
      tabs: {
        dashboard: 'Dashboard',
        history: 'History',
        favorites: 'My Favorites',
        settings: 'Settings',
        privacy: 'Privacy Control',
        admin: 'Admin Panel',
      },
      dashboard: {
        title: 'Dashboard',
        description: 'View your usage statistics and activity overview',
        overview: 'Overview',
        detailed: 'Detailed Stats',
        social: 'Social Data',
        stats: {
          totalGenerations: 'Total Generations',
          favorites: 'Favorites',
          thisWeek: 'This Week',
          thisMonth: 'This Month',
          today: 'Today',
          dailyAverage: 'Daily Average',
          mostUsed: 'Most Used Feature',
          recentActivity: 'Recent Activity',
          publicWorks: 'Public Works',
          totalLikes: 'Total Likes',
          totalComments: 'Total Comments',
        },
        quickActions: {
          title: 'Quick Actions',
          shareWork: 'Share Work',
          createNew: 'Create New Work',
        },
        noActivity: 'No recent activity',
        featureUsage: {
          title: 'Feature Usage Statistics',
        },
        userTypes: {
          creator: 'Creator',
          activeUser: 'Active User',
          aiEnthusiast: 'AI Enthusiast',
        },
        avatar: {
          title: 'Choose Avatar',
          description: 'Supports JPG, PNG, GIF formats, file size not exceeding 5MB',
          upload: 'Upload Avatar',
          change: 'Change Avatar',
        },
      },
      favorites: {
        title: 'My Favorites',
        description: 'Manage your favorite generated works',
        count: '{count} favorites',
        empty: 'No favorite works yet',
        share: 'Share Work',
        download: 'Download',
        remove: 'Remove from Favorites',
      },
      privacy: {
        title: 'Privacy Control',
        description: 'Manage your privacy settings and data permissions',
        dataControl: 'Data Control',
        exportData: 'Export Data',
        deleteData: 'Delete Data',
        privacySettings: 'Privacy Settings',
      },
      history: {
        title: 'Generation History',
        description: 'View and manage all your generation records',
        empty: 'No generation records yet, start creating your first image!',
      },
      settings: {
        title: 'Personal Settings',
        description: 'Manage your personal information and preferences',
      },
      admin: {
        title: 'Admin Panel',
        description: 'System and user management features',
      },
    },
    pricing: {
      title: 'Choose Your Plan',
      subtitle: 'Flexible pricing plans to meet different needs',
      monthly: 'Monthly',
      yearly: 'Yearly',
      year: 'year',
      month: 'month',
      free: 'Free',
      mostPopular: 'Most Popular',
      save: 'Save {percent}%',
      saveAmount: 'Save {percent}%',
      unlimitedGenerations: 'Unlimited Generations',
      dailyGenerations: '{count} generations per month',
      getStarted: 'Get Started',
      selectPlan: 'Select Plan',
      contactSales: 'Contact Sales',
      featureComparison: 'Feature Comparison',
      featureComparisonDescription: 'Detailed feature comparison to help you choose the best plan',
      featureComparisonDetails: {
        dailyGenerations: 'Monthly Generations',
        basicEffects: 'Basic AI Effects',
        advancedEffects: 'Advanced AI Effects',
        batchProcessing: 'Batch Processing',
        highResolution: 'High Resolution Output',
        noWatermark: 'No Watermark',
        apiAccess: 'API Access',
        commercialUse: 'Commercial Use',
        customModels: 'Custom Models',
        privateDeployment: 'Private Deployment',
        whiteLabel: 'White Label Solution',
        free: {
          dailyGenerations: '3 times',
        },
        standard: {
          dailyGenerations: '50 times',
          batchProcessing: '10 images',
        },
        professional: {
          dailyGenerations: '200 times',
          batchProcessing: 'Unlimited',
        },
        enterprise: {
          dailyGenerations: 'Unlimited',
          batchProcessing: 'Unlimited',
        },
      },
      features: {
        basicEffects: 'Basic AI Effects',
        advancedEffects: 'Advanced AI Effects',
        batchProcessing: 'Batch Processing',
        highResolution: 'High Resolution Output',
        noWatermark: 'No Watermark',
        apiAccess: 'API Access',
        commercialUse: 'Commercial Use',
        customModels: 'Custom Models',
        prioritySupport: 'Priority Support',
        privateDeployment: 'Private Deployment',
        whiteLabel: 'White Label Solution',
      },
      tiers: {
        free: {
          name: 'Free',
          description: 'Perfect for individuals and beginners',
        },
        basic: {
          name: 'Basic',
          description: 'Perfect for individuals and light users',
        },
        pro: {
          name: 'Pro',
          description: 'For professional creators and teams',
        },
        max: {
          name: 'Max',
          description: 'Designed for large enterprises and professional studios',
        },
      },
      faq: {
        title: 'Frequently Asked Questions',
        subtitle: 'Get answers to common questions about pricing and services',
        q1: 'How do I get started?',
        a1: 'Sign up for an account and get 3 free generations, no credit card required.',
        q2: 'Can I cancel anytime?',
        a2: 'Yes, you can cancel your subscription anytime in your account settings.',
        q3: 'What payment methods do you accept?',
        a3: 'We accept credit cards, PayPal, and other major payment methods.',
        q4: 'Do you offer refunds?',
        a4: 'We offer a 30-day money-back guarantee for all subscriptions.',
      },
    },
  },
  social: {
    title: 'Gallery',
    subtitle: 'Discover amazing creations from other users',
    loadMore: 'Load More',
    noMoreItems: 'No more items',
    like: 'Like',
    unlike: 'Unlike',
    comment: 'Comment',
    share: 'Share',
    follow: 'Follow',
    unfollow: 'Unfollow',
    shareToGallery: {
      title: 'Share to Gallery',
      subtitle: 'Share your creation with the community',
      titleLabel: 'Title',
      titlePlaceholder: 'Enter a title for your creation',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'Describe your creation (optional)',
      publicLabel: 'Make this public',
      publicDescription: 'Allow others to see and interact with your creation',
      shareButton: 'Share to Gallery',
      sharing: 'Sharing...',
      error: 'Failed to share. Please try again.',
      success: 'Successfully shared to gallery!',
    },
    collections: {
      title: 'Collections',
      createNew: 'Create Collection',
      createFirst: 'Create Your First Collection',
      name: 'Collection Name',
      namePlaceholder: 'Enter collection name',
      description: 'Description',
      descriptionPlaceholder: 'Describe this collection',
      makePublic: 'Make Public',
      create: 'Create',
      public: 'Public',
      private: 'Private',
      items: 'items',
      deleteConfirm: 'Are you sure you want to delete this collection?',
      empty: {
        title: 'No Collections Yet',
        description: 'Create collections to organize your works',
      },
    },
    gallery: {
      title: 'Gallery',
      subtitle: 'Share your creations and discover amazing works',
      publish: 'Publish to Gallery',
      unpublish: 'Remove from Gallery',
      edit: 'Edit Work',
      delete: 'Delete Work',
      viewDetails: 'View Details',
      shareTo: 'Share to',
      copyLink: 'Copy Link',
      shareSuccess: 'Shared successfully!',
      publishSuccess: 'Work published to gallery',
      unpublishSuccess: 'Work removed from gallery',
    },
    comments: {
      title: 'Comments',
      writeComment: 'Write a comment',
      reply: 'Reply',
      edit: 'Edit',
      delete: 'Delete',
      deleteConfirm: 'Are you sure you want to delete this comment?',
      empty: 'No comments yet, be the first to comment!',
      placeholder: 'Write your thoughts...',
      submit: 'Post',
      cancel: 'Cancel',
    },
    user: {
      profile: 'Profile',
      collections: 'Collections',
      followers: 'Followers',
      following: 'Following',
      works: 'Works',
      follow: 'Follow',
      unfollow: 'Unfollow',
      message: 'Message',
      share: 'Share',
    },
  },
  pricing: {
    title: 'Choose Your Plan',
    subtitle: 'Flexible pricing plans to meet different needs',
    monthly: 'Monthly',
    yearly: 'Yearly',
    year: 'year',
    month: 'month',
    free: 'Free',
    customPricing: 'Custom Pricing',
    mostPopular: 'Most Popular',
    save: 'Save {percent}%',
    saveAmount: 'Save {percent}%',
    unlimitedGenerations: 'Unlimited Generations',
    dailyGenerations: '{count} generations per day',
    getStarted: 'Get Started',
    selectPlan: 'Select Plan',
    contactSales: 'Contact Sales',
    featureComparison: 'Feature Comparison',
    featureComparisonDescription:
      'Detailed feature comparison to help you choose the most suitable plan',
    featureComparisonDetails: {
      dailyGenerations: 'Daily Generations',
      basicEffects: 'Basic AI Effects',
      advancedEffects: 'Advanced AI Effects',
      batchProcessing: 'Batch Processing',
      highResolution: 'High Resolution Output',
      noWatermark: 'No Watermark',
      apiAccess: 'API Access',
      commercialUse: 'Commercial Use',
      customModels: 'Custom Models',
      privateDeployment: 'Private Deployment',
      whiteLabel: 'White Label Solution',
      free: {
        dailyGenerations: '3 times',
      },
      standard: {
        dailyGenerations: '10 times',
        batchProcessing: '10 images',
      },
      professional: {
        dailyGenerations: '200 times',
        batchProcessing: 'Unlimited',
      },
      enterprise: {
        dailyGenerations: 'Unlimited',
        batchProcessing: 'Unlimited',
      },
    },
    features: {
      basicEffects: 'Basic AI Effects',
      advancedEffects: 'Advanced AI Effects',
      batchProcessing: 'Batch Processing',
      highResolution: 'High Resolution Output',
      noWatermark: 'No Watermark',
      apiAccess: 'API Access',
      commercialUse: 'Commercial Use',
      customModels: 'Custom Models',
      prioritySupport: 'Priority Support',
      privateDeployment: 'Private Deployment',
      whiteLabel: 'White Label Solution',
    },
    tiers: {
      free: {
        name: 'Free',
        description: 'Perfect for personal use and trial',
      },
      standard: {
        name: 'Standard',
        description: 'For content creators and small businesses',
      },
      professional: {
        name: 'Professional',
        description: 'For developers and medium enterprises',
      },
      enterprise: {
        name: 'Enterprise',
        description: 'For large enterprises and platform integration',
      },
    },
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Get answers to common questions about pricing and services',
      q1: 'Can I cancel my subscription anytime?',
      a1: 'Yes, you can cancel your subscription at any time without any additional fees.',
      q2: 'What payment methods do you support?',
      a2: 'We support credit cards, PayPal, Alipay, WeChat Pay, and many other payment methods.',
      q3: 'Is there a free trial?',
      a3: 'Yes, we offer a 7-day free trial to experience all professional features.',
      q4: 'How do I upgrade or downgrade my plan?',
      a4: 'You can upgrade or downgrade your plan anytime in account settings. Changes will take effect in the next billing cycle.',
    },
    featureLabels: {
      basicEffects: 'Basic AI Effects',
      advancedEffects: 'Advanced AI Effects',
      batchProcessing: 'Batch Processing',
      highResolution: 'High Resolution Output',
      noWatermark: 'No Watermark',
      apiAccess: 'API Access',
      commercialUse: 'Commercial Use',
      customModels: 'Custom Models',
      prioritySupport: 'Priority Support',
      privateDeployment: 'Private Deployment',
      whiteLabel: 'White Label Solution',
    },
    pricing: {
      title: 'Choose Your Plan',
      subtitle: 'Flexible pricing plans to meet different needs',
      monthly: 'Monthly',
      yearly: 'Yearly',
      year: 'year',
      month: 'month',
      free: 'Free',
      mostPopular: 'Most Popular',
      save: 'Save {percent}%',
      saveAmount: 'Save {percent}%',
      unlimitedGenerations: 'Unlimited Generations',
      dailyGenerations: '{count} generations per month',
      getStarted: 'Get Started',
      selectPlan: 'Select Plan',
      contactSales: 'Contact Sales',
      featureComparison: 'Feature Comparison',
      featureComparisonDescription: 'Detailed feature comparison to help you choose the best plan',
      featureComparisonDetails: {
        dailyGenerations: 'Monthly Generations',
        basicEffects: 'Basic AI Effects',
        advancedEffects: 'Advanced AI Effects',
        batchProcessing: 'Batch Processing',
        highResolution: 'High Resolution Output',
        noWatermark: 'No Watermark',
        apiAccess: 'API Access',
        commercialUse: 'Commercial Use',
        customModels: 'Custom Models',
        privateDeployment: 'Private Deployment',
        whiteLabel: 'White Label Solution',
        free: {
          dailyGenerations: '3 times',
        },
        standard: {
          dailyGenerations: '50 times',
          batchProcessing: '10 images',
        },
        professional: {
          dailyGenerations: '200 times',
          batchProcessing: 'Unlimited',
        },
        enterprise: {
          dailyGenerations: 'Unlimited',
          batchProcessing: 'Unlimited',
        },
      },
      features: {
        basicEffects: 'Basic AI Effects',
        advancedEffects: 'Advanced AI Effects',
        batchProcessing: 'Batch Processing',
        highResolution: 'High Resolution Output',
        noWatermark: 'No Watermark',
        apiAccess: 'API Access',
        commercialUse: 'Commercial Use',
        customModels: 'Custom Models',
        prioritySupport: 'Priority Support',
        privateDeployment: 'Private Deployment',
        whiteLabel: 'White Label Solution',
      },
      tiers: {
        free: {
          name: 'Free',
          description: 'Perfect for individuals and beginners',
        },
        basic: {
          name: 'Basic',
          description: 'Perfect for individuals and light users',
        },
        pro: {
          name: 'Pro',
          description: 'For professional creators and teams',
        },
        max: {
          name: 'Max',
          description: 'Designed for large enterprises and professional studios',
        },
      },
      faq: {
        title: 'Frequently Asked Questions',
        subtitle: 'Get answers to common questions about pricing and services',
        q1: 'How do I get started?',
        a1: 'Sign up for an account and get 3 free generations, no credit card required.',
        q2: 'Can I cancel anytime?',
        a2: 'Yes, you can cancel your subscription anytime in your account settings.',
        q3: 'What payment methods do you accept?',
        a3: 'We accept credit cards, PayPal, and other major payment methods.',
        q4: 'Do you offer refunds?',
        a4: 'We offer a 30-day money-back guarantee for all subscriptions.',
      },
    },
  },
  error: {
    uploadAndSelect: 'Please upload an image and select an effect.',
    uploadBoth: 'Please upload both required images.',
    enterPrompt: 'Please enter a prompt describing the change you want to see.',
    unknown: 'An unknown error occurred.',
    useAsInputFailed: 'Could not use the generated image as a new input.',
    title: 'An Error Occurred',
    message:
      'Sorry, the application encountered an unexpected error. We have logged this issue and will fix it as soon as possible.',
    retry: 'Retry',
    reload: 'Reload Page',
    contactSupport: 'If the problem persists, please contact technical support',
    errorDetails: 'Error Details (Development Mode)',
    errorMessage: 'Error Message:',
    stackTrace: 'Stack Trace:',
    componentLoadFailed: 'Component Load Failed',
    componentLoadFailedMessage:
      'Please refresh the page and try again, or contact technical support',
  },
  loading: {
    step1: 'Step 1: Creating line art...',
    step2: 'Step 2: Applying color palette...',
    default: 'Generating your masterpiece...',
    wait: 'This can sometimes take a moment.',
    videoInit: 'Initializing video generation...',
    videoPolling: 'Processing video, this may take a few minutes...',
    videoFetching: 'Finalizing and fetching your video...',
  },
  theme: {
    switchToLight: 'Switch to light theme',
    switchToDark: 'Switch to dark theme',
  },
  transformationSelector: {
    title: 'Start Creating!',
    description:
      'Choose your favorite creative effects and let AI add infinite possibilities to your images. Drag to reorder your most-used effects.',
    descriptionWithResult:
      'Amazing! Your creation is ready for the next round. Select a new effect to continue this creative journey.',
  },
  imageEditor: {
    upload: 'Click to upload',
    dragAndDrop: 'or drag and drop',
    drawMask: 'Draw Mask',
    maskPanelInfo: 'Draw on the image to create a mask for localized edits.',
    brushSize: 'Brush Size',
    undo: 'Undo',
    clearMask: 'Clear Mask',
  },
  resultDisplay: {
    viewModes: {
      result: 'Result',
      grid: 'Grid',
      slider: 'Slider',
      sideBySide: 'Side-by-Side',
    },
    labels: {
      original: 'Original',
      generated: 'Generated',
      lineArt: 'Line Art',
      finalResult: 'Final Result',
    },
    actions: {
      download: 'Download',
      downloadBoth: 'Download Both',
      downloadComparison: 'Download Comparison',
      useAsInput: 'Use as Input',
      useLineArtAsInput: 'Use Line Art as Input',
      useFinalAsInput: 'Use Final as Input',
      shareToGallery: 'Share to Gallery',
    },
    sliderPicker: {
      vs: 'vs',
    },
  },
  history: {
    title: 'Generation History',
    empty: 'Your generated images will appear here once you create something.',
    use: 'Use',
    save: 'Save',
    lineArt: 'Line Art',
    finalResult: 'Final Result',
  },
  transformations: {
    categories: {
      viral: { title: 'Viral & Fun' },
      photo: { title: 'Photo & Pro Edits' },
      design: { title: 'Design & Product' },
      tools: { title: 'Creative Tools' },
      effects: { title: '50+ Artistic Effects' },
    },
    video: {
      title: 'Video Generation',
      description:
        'Create a short video from a text prompt and an optional image. Choose your desired aspect ratio.',
      promptPlaceholder: 'e.g., A majestic lion roaring on a rocky outcrop at sunset',
      aspectRatio: 'Aspect Ratio',
      landscape: '16:9 Landscape',
      portrait: '9:16 Portrait',
    },
    effects: {
      customPrompt: {
        title: 'Custom Prompt',
        description:
          'Describe any change you can imagine. Upload up to two images for context (e.g., character and style reference). Your creativity is the only limit!',
        uploader1Title: 'Primary Image',
        uploader1Desc: 'The main image to edit.',
        uploader2Title: 'Reference Image (Optional)',
        uploader2Desc: 'A second image for style, content, or context.',
      },
      figurine: {
        title: '3D Figurine',
        description:
          'Turns your photo into a collectible 3D character figurine, complete with packaging.',
      },
      funko: {
        title: 'Funko Pop Figure',
        description: 'Reimagines your subject as an adorable Funko Pop! vinyl figure in its box.',
      },
      lego: {
        title: 'LEGO Minifigure',
        description: 'Builds a LEGO minifigure version of your subject, ready for play.',
      },
      crochet: {
        title: 'Crochet Doll',
        description: 'Transforms your image into a soft, handmade crochet doll.',
      },
      cosplay: {
        title: 'Anime to Cosplay',
        description: 'Brings an anime character to life as a realistic cosplay photo.',
      },
      plushie: {
        title: 'Cute Plushie',
        description: 'Converts your subject into a cuddly, soft plushie toy.',
      },
      keychain: {
        title: 'Acrylic Keychain',
        description:
          'Creates a cute acrylic keychain of your subject, perfect for hanging on a bag.',
      },
      hdEnhance: {
        title: 'HD Enhance',
        description:
          'Upscales your image, adding sharpness, clarity, and detail for a high-res look.',
      },
      pose: {
        title: 'Pose Reference',
        description: 'Applies a pose from one image to a character from another.',
        uploader1Title: 'Character',
        uploader1Desc: 'The main character',
        uploader2Title: 'Pose Reference',
        uploader2Desc: 'The pose to apply',
      },
      photorealistic: {
        title: 'To Photorealistic',
        description: 'Converts drawings or illustrations into stunningly realistic photos.',
      },
      fashion: {
        title: 'Fashion Magazine',
        description: 'Gives your photo a high-fashion, editorial look worthy of a magazine cover.',
      },
      hyperrealistic: {
        title: 'Hyper-realistic',
        description:
          'Applies a gritty, direct-flash photography style for a cool, hyper-realistic vibe.',
      },
      architecture: {
        title: 'Architecture Model',
        description: 'Transforms a building into a detailed miniature architectural model.',
      },
      productRender: {
        title: 'Product Render',
        description: 'Turns a product sketch into a professional, photorealistic 3D render.',
      },
      sodaCan: {
        title: 'Soda Can Design',
        description: 'Wraps your image onto a soda can and places it in a slick product shot.',
      },
      industrialDesign: {
        title: 'Industrial Design Render',
        description: 'Renders an industrial design sketch as a real product in a museum setting.',
      },
      iphoneWallpaper: {
        title: 'iPhone Wallpaper',
        description:
          'Instantly transforms your image into a stylish iPhone lock screen, complete with time, date, and UI elements, all presented in a beautiful product shot.',
      },
      colorPalette: {
        title: 'Color Palette Swap',
        description:
          'Converts an image to line art, then colors it using a second image as a palette.',
        uploader1Title: 'Original Image',
        uploader1Desc: 'The image to transform',
        uploader2Title: 'Color Palette',
        uploader2Desc: 'The color reference',
      },
      lineArt: {
        title: 'Line Art Drawing',
        description: 'Reduces your photo to its essential lines, creating a clean sketch.',
      },
      paintingProcess: {
        title: 'Painting Process',
        description:
          'Shows a 4-step grid of your image being created, from sketch to final painting.',
      },
      markerSketch: {
        title: 'Marker Sketch',
        description: 'Reimagines your photo as a vibrant sketch made with Copic markers.',
      },
      addIllustration: {
        title: 'Add Illustration',
        description: 'Adds charming, hand-drawn characters into your real-world photo.',
      },
      cyberpunk: {
        title: 'Cyberpunk',
        description: 'Transforms your scene into a neon-drenched, futuristic cyberpunk city.',
      },
      vanGogh: {
        title: 'Van Gogh Style',
        description:
          "Repaints your photo with the iconic, swirling brushstrokes of 'Starry Night'.",
      },
      isolate: {
        title: 'Isolate & Enhance',
        description: 'Cuts out a masked subject and creates a clean, high-definition portrait.',
      },
      screen3d: {
        title: '3D Screen Effect',
        description: 'Makes content on a screen in your photo appear to pop out in 3D.',
      },
      makeup: {
        title: 'Makeup Analysis',
        description: 'Analyzes makeup in a portrait and suggests improvements with red-pen markup.',
      },
      background: {
        title: 'Change Background',
        description: 'Swaps the existing background for a cool, retro Y2K aesthetic.',
      },
      pixelArt: {
        title: 'Pixel Art',
        description: 'Transform your image into retro 8-bit pixel art.',
      },
      watercolor: {
        title: 'Watercolor',
        description: 'Convert your image into a soft, vibrant watercolor painting.',
      },
      popArt: {
        title: 'Pop Art',
        description: 'Reimagine your image in the bold style of Andy Warhol.',
      },
      comicBook: {
        title: 'Comic Book',
        description: 'Turn your photo into a classic comic book panel.',
      },
      claymation: {
        title: 'Claymation',
        description: 'Recreate your image as a charming stop-motion clay scene.',
      },
      ukiyoE: {
        title: 'Ukiyo-e',
        description: 'Redraw your image as a traditional Japanese woodblock print.',
      },
      stainedGlass: {
        title: 'Stained Glass',
        description: 'Transform your image into a vibrant stained glass window.',
      },
      origami: {
        title: 'Origami',
        description: 'Reconstruct your subject from folded paper in an origami style.',
      },
      neonGlow: {
        title: 'Neon Glow',
        description: 'Outline your subject in bright, glowing neon lights.',
      },
      doodleArt: {
        title: 'Doodle Art',
        description: 'Overlay your image with playful, hand-drawn doodles.',
      },
      vintagePhoto: {
        title: 'Vintage Photo',
        description: 'Give your image an aged, sepia-toned vintage look.',
      },
      blueprintSketch: {
        title: 'Blueprint',
        description: 'Convert your image into a technical blueprint drawing.',
      },
      glitchArt: {
        title: 'Glitch Art',
        description: 'Apply a digital glitch effect with datamoshing and pixel sorting.',
      },
      doubleExposure: {
        title: 'Double Exposure',
        description: 'Blend your image with a nature scene in a double exposure.',
      },
      hologram: {
        title: 'Hologram',
        description: 'Project your subject as a futuristic, glowing blue hologram.',
      },
      lowPoly: {
        title: 'Low Poly',
        description: 'Reconstruct your image using a low-polygon geometric mesh.',
      },
      charcoalSketch: {
        title: 'Charcoal Sketch',
        description: 'Redraw your image as a dramatic, high-contrast charcoal sketch.',
      },
      impressionism: {
        title: 'Impressionism',
        description: 'Repaint your image in the style of an Impressionist masterpiece.',
      },
      cubism: {
        title: 'Cubism',
        description: 'Deconstruct your subject in the abstract, geometric style of Cubism.',
      },
      steampunk: {
        title: 'Steampunk',
        description: 'Reimagine your subject with gears, brass, and Victorian tech.',
      },
      fantasyArt: {
        title: 'Fantasy Art',
        description: 'Transform your image into an epic fantasy-style painting.',
      },
      graffiti: {
        title: 'Graffiti',
        description: 'Spray-paint your image as vibrant graffiti on a brick wall.',
      },
      minimalistLineArt: {
        title: 'Minimalist Line Art',
        description: 'Reduce your image to a single, continuous line drawing.',
      },
      storybook: {
        title: 'Storybook',
        description: "Redraw your image in a whimsical children's storybook style.",
      },
      thermal: {
        title: 'Thermal Vision',
        description: 'Apply a thermal imaging effect with a heat map palette.',
      },
      risograph: {
        title: 'Risograph',
        description: 'Simulate a grainy, limited-color risograph print.',
      },
      crossStitch: {
        title: 'Cross-Stitch',
        description: 'Convert your image into a handmade cross-stitch pattern.',
      },
      tattoo: {
        title: 'Tattoo Art',
        description: 'Redesign your subject as a classic American traditional tattoo.',
      },
      psychedelic: {
        title: 'Psychedelic',
        description: 'Apply a vibrant, swirling, psychedelic art style from the 1960s.',
      },
      gothic: {
        title: 'Gothic',
        description: 'Reimagine your scene with a dark, gothic art style.',
      },
      tribal: {
        title: 'Tribal Art',
        description: 'Redraw your subject using traditional tribal patterns.',
      },
      dotPainting: {
        title: 'Dot Painting',
        description: 'Recreate your image using the Aboriginal dot painting technique.',
      },
      chalk: {
        title: 'Chalk Drawing',
        description: 'Draw your image as a colorful chalk illustration on a sidewalk.',
      },
      sandArt: {
        title: 'Sand Art',
        description: 'Recreate your image as if it were made from colored sand.',
      },
      mosaic: {
        title: 'Mosaic',
        description: 'Transform your image into a mosaic of small ceramic tiles.',
      },
      paperQuilling: {
        title: 'Paper Quilling',
        description: 'Reconstruct your subject using rolled and shaped paper strips.',
      },
      woodCarving: {
        title: 'Wood Carving',
        description: 'Recreate your subject as a detailed wood carving.',
      },
      iceSculpture: {
        title: 'Ice Sculpture',
        description: 'Transform your subject into a translucent ice sculpture.',
      },
      bronzeStatue: {
        title: 'Bronze Statue',
        description: 'Turn your subject into a weathered bronze statue.',
      },
      galaxy: {
        title: 'Galaxy',
        description: 'Blend your image with a vibrant nebula and starry background.',
      },
      fire: {
        title: 'Fire',
        description: 'Reimagine your subject as if formed from roaring flames.',
      },
      water: {
        title: 'Water',
        description: 'Reimagine your subject as if formed from flowing water.',
      },
      smokeArt: {
        title: 'Smoke Art',
        description: 'Create your subject from elegant, swirling wisps of smoke.',
      },
      vectorArt: {
        title: 'Vector Art',
        description: 'Convert your photo into clean, scalable vector art.',
      },
      infrared: {
        title: 'Infrared',
        description: 'Simulate an infrared photo with surreal colors.',
      },
      knitted: {
        title: 'Knitted',
        description: 'Recreate your image as a cozy, knitted wool pattern.',
      },
      etching: {
        title: 'Etching',
        description: 'Redraw your image as a classic black and white etching.',
      },
      diorama: {
        title: 'Diorama',
        description: 'Turn your scene into a miniature 3D diorama in a box.',
      },
    },
  },
  categories: {
    creative: 'Creative Design',
    toys: 'Toy Models',
    fashion: 'Fashion & Beauty',
    realistic: 'Realistic Rendering',
    enhancement: 'Image Enhancement',
    reference: 'Reference Tools',
    all: 'All',
  },
  features: {
    allFeatures: {
      title: 'All Features',
      description: 'Browse and search all available AI generation features',
      searchPlaceholder: 'Search features...',
      foundCount: 'Found {count} features',
      categoryLabel: 'Category: ',
    },
    labels: {
      popular: 'Popular',
      new: 'New',
    },
    sort: {
      default: 'Default Sort',
      popular: 'Popular First',
      new: 'Newest First',
      name: 'Sort by Name',
    },
  },
  more: {
    title: 'More',
    subtitle: 'Contact us and learn more information',
    tabs: {
      contact: 'Contact',
      about: 'About',
    },
    contact: {
      title: 'Contact Us',
      feedback: {
        title: 'Feedback & Suggestions',
        content:
          'We highly value your feedback! If you encounter any issues during use or have improvement suggestions, please feel free to contact us.',
      },
      support: {
        title: 'Technical Support',
        content:
          'Encountering technical issues? Our technical support team will resolve them for you as soon as possible. Please describe the problems you encounter in detail, and we will provide professional help.',
      },
      feature: {
        title: 'Feature Requests',
        content:
          'Have new feature ideas? We welcome your creativity! Tell us about the new features you would like to see, and we will seriously consider them.',
      },
      contactMethods: {
        title: 'Contact Methods',
        email: {
          label: 'Email',
        },
        chat: {
          label: 'Online Support',
          hours: 'Weekdays 9:00-18:00',
        },
        app: {
          label: 'In-App Feedback',
          description: 'Submit feedback in your profile',
        },
      },
      responseTime: {
        label: 'Response Time',
        content: 'We will reply to your emails within 24 hours',
      },
    },
    about: {
      title: 'About App',
      app: {
        title: 'Och AI',
        content:
          'A powerful AI image generation and editing platform, providing 50+ professional-grade AI effects, including 3D figurines, anime styles, HD enhancement, and more.',
      },
      features: {
        title: 'Main Features',
        item1: 'AI Image Generation & Editing',
        item2: 'Multiple Artistic Style Conversion',
        item3: 'HD Image Enhancement',
        item4: '3D Effect Generation',
        item5: 'Custom Prompts',
        item6: 'Batch Processing Support',
      },
      technology: {
        title: 'Technical Features',
        item1: 'Based on Advanced AI Technology',
        item2: 'Real-time Generation Preview',
        item3: 'Cloud Secure Storage',
        item4: 'Multi-language Support',
        item5: 'Responsive Design',
      },
      contact: {
        title: 'Contact Us',
        content:
          'If you have any questions or suggestions, please contact us through the feedback function in the app. We are committed to providing you with the best AI image generation experience.',
      },
      version: {
        label: 'Version',
      },
      update: {
        label: 'Update',
        date: 'September 2025',
      },
    },
  },
}
