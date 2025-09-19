export default {
  nav: {
    home: 'Home',
    profile: 'Profile',
    categories: 'Categories',
    privacy: 'Privacy',
    settings: 'Settings',
  },
  common: {
    search: 'Search',
  },
  home: {
    hero: {
      title: 'Start Creating!',
      subtitle:
        'Ready to reshape your reality? Choose a category and start casting spells. You can also drag and drop to reorder your favorite categories.',
      cta: 'Start Creating',
      explore: 'Explore Features',
      badge: 'AI-Powered Creative Tools',
      stats: {
        users: 'User Generations',
        models: 'AI Models',
        uptime: 'Uptime',
      },
    },
    features: {
      title: 'Powerful AI Features',
      subtitle:
        'From creative design to professional rendering, we provide comprehensive AI generation tools',
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
        enhance: {
          title: 'Blurry Photo → HD Image',
          description:
            'AI intelligently enhances image clarity and detail quality, turning blurry photos into HD',
          processingTime: 'Processing time: 20s',
          resolution: 'Resolution: 2048x2048',
          badge: 'HD Enhance',
        },
      },
    },
    howItWorks: {
      title: 'How It Works',
      subtitle: 'Create amazing AI-generated content in just three simple steps',
      step1: {
        title: 'Upload Image',
        description: 'Choose the image you want to transform, supporting multiple formats',
      },
      step2: {
        title: 'Select Effect',
        description: 'Choose from 15+ professional effects or use custom prompts',
      },
      step3: {
        title: 'Generate Result',
        description: 'AI will generate high-quality results for you in seconds',
      },
    },
    demo: {
      title: 'Demo Showcase',
      subtitle: 'See amazing works created by other users and get inspired for your own creations',
      beforeAfter: 'Before & After',
      seeMore: 'View More Works',
    },
    useCases: {
      title: 'Use Cases',
      subtitle:
        'Whether you are a designer, content creator or regular user, you can find suitable AI effects',
      cases: [
        {
          title: 'Social Media Content',
          description:
            'Create unique avatars and cover images for Instagram, Xiaohongshu and other platforms',
          icon: '📱',
        },
        {
          title: 'Personal Collection',
          description:
            'Transform photos into 3D figurines, anime style and other personalized collectibles',
          icon: '🎭',
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
        history: 'History',
        settings: 'Settings',
        admin: 'Admin Panel',
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
    error: {
      uploadAndSelect: 'Please upload an image and select an effect.',
      uploadBoth: 'Please upload both required images.',
      enterPrompt: 'Please enter a prompt describing the change you want to see.',
      unknown: 'An unknown error occurred.',
      useAsInputFailed: 'Could not use the generated image as a new input.',
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
  error: {
    title: 'An Error Occurred',
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
}
