import { MediaContent, MediaSearchParams } from './api.types';

// Mock service for media integrations
// In a production app, this would connect to real APIs like Spotify, YouTube, etc.
export class MediaService {
  // Fetch media based on user preferences and time of day
  async getRecommendedMedia(
    contentType: 'music' | 'video' | 'podcast' | 'news',
    timeOfDay: 'morning' | 'afternoon' | 'evening'
  ): Promise<MediaContent[]> {
    // In a real app, this would call external APIs
    // For now, we'll return mock data
    return mockMediaByType[contentType] || [];
  }

  // Search media across platforms
  async searchMedia(params: MediaSearchParams): Promise<MediaContent[]> {
    const { query, contentType, platform } = params;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter mock data based on search parameters
    let results = [...mockAllMedia];
    
    if (contentType) {
      results = results.filter(item => item.contentType === contentType);
    }
    
    if (platform) {
      results = results.filter(item => item.platform === platform);
    }
    
    // Simple search by title
    results = results.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    
    return results.slice(0, params.limit || 10);
  }

  // Connect to media platforms
  async connectPlatform(platform: 'spotify' | 'youtube' | 'other', credentials: any): Promise<boolean> {
    // In a real app, this would handle OAuth or API key authentication
    console.log(`Connecting to ${platform} with credentials`, credentials);
    return true;
  }

  // Play media content
  async playMedia(mediaId: string): Promise<{ success: boolean, message?: string }> {
    const media = mockAllMedia.find(item => item.id === mediaId);
    if (!media) {
      return { success: false, message: 'Media not found' };
    }
    
    console.log(`Playing ${media.title} from ${media.platform}`);
    return { success: true };
  }
}

// Mock data
const mockMediaByType: Record<string, MediaContent[]> = {
  music: [
    {
      id: 'music1',
      title: 'Morning Energy Boost',
      artist: 'Wellness Beats',
      duration: 180,
      thumbnail: 'https://example.com/images/morning-playlist.jpg',
      url: 'https://example.com/music/morning-playlist',
      platform: 'spotify',
      contentType: 'music'
    },
    {
      id: 'music2',
      title: 'Focus Flow',
      artist: 'Deep Work',
      duration: 2400,
      thumbnail: 'https://example.com/images/focus-flow.jpg',
      url: 'https://example.com/music/focus-flow',
      platform: 'spotify',
      contentType: 'music'
    }
  ],
  video: [
    {
      id: 'video1',
      title: 'Quick Morning Workout',
      duration: 600,
      thumbnail: 'https://example.com/images/morning-workout.jpg',
      url: 'https://example.com/videos/morning-workout',
      platform: 'youtube',
      contentType: 'video'
    },
    {
      id: 'video2',
      title: 'Evening Yoga for Relaxation',
      duration: 900,
      thumbnail: 'https://example.com/images/evening-yoga.jpg',
      url: 'https://example.com/videos/evening-yoga',
      platform: 'youtube',
      contentType: 'video'
    }
  ],
  podcast: [
    {
      id: 'podcast1',
      title: 'Productivity Tips for Professionals',
      artist: 'Career Success',
      duration: 1800,
      thumbnail: 'https://example.com/images/productivity-podcast.jpg',
      url: 'https://example.com/podcasts/productivity-tips',
      platform: 'spotify',
      contentType: 'podcast'
    }
  ],
  news: [
    {
      id: 'news1',
      title: 'Today\'s Top Headlines',
      duration: 300,
      thumbnail: 'https://example.com/images/news-today.jpg',
      url: 'https://example.com/news/headlines',
      platform: 'other',
      contentType: 'news'
    }
  ]
};

// Combine all mock media for search functionality
const mockAllMedia = [
  ...mockMediaByType.music || [],
  ...mockMediaByType.video || [],
  ...mockMediaByType.podcast || [],
  ...mockMediaByType.news || []
];
