import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Modal,
  Linking
} from 'react-native';
import { useTheme } from '../../themes/ThemeContext';
import Card from '../core/Card';
import Button from '../core/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MediaService, MediaContent } from '../../services';

const mediaService = new MediaService();

const MediaScreen: React.FC = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MediaContent[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recommendedContent, setRecommendedContent] = useState<Record<string, MediaContent[]>>({});
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedMediaType, setSelectedMediaType] = useState<'music' | 'video' | 'podcast' | 'news'>('music');
  const [selectedContent, setSelectedContent] = useState<MediaContent | null>(null);
  const [contentModalVisible, setContentModalVisible] = useState(false);
  
  // Load recommended content when component mounts
  useEffect(() => {
    loadRecommendedContent();
  }, []);

  const loadRecommendedContent = async () => {
    setIsLoadingRecommendations(true);
    try {
      // Determine time of day for recommendations
      const hour = new Date().getHours();
      const timeOfDay = hour < 12 ? 'morning' : (hour < 18 ? 'afternoon' : 'evening');
      
      // Load different types of content
      const musicPromise = mediaService.getRecommendedMedia('music', timeOfDay);
      const videoPromise = mediaService.getRecommendedMedia('video', timeOfDay);
      const podcastPromise = mediaService.getRecommendedMedia('podcast', timeOfDay);
      const newsPromise = mediaService.getRecommendedMedia('news', timeOfDay);
      
      const [music, videos, podcasts, news] = await Promise.all([
        musicPromise, videoPromise, podcastPromise, newsPromise
      ]);
      
      setRecommendedContent({
        music,
        video: videos,
        podcast: podcasts,
        news
      });
    } catch (error) {
      console.error('Failed to load recommended content', error);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await mediaService.searchMedia({ 
        query: searchQuery,
        contentType: selectedMediaType,
        platform: selectedPlatforms.length === 1 ? selectedPlatforms[0] as any : undefined
      });
      setSearchResults(results);
    } catch (error) {
      console.error('Media search error', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleSelectContent = (content: MediaContent) => {
    setSelectedContent(content);
    setContentModalVisible(true);
  };
  
  const handleCloseContentModal = () => {
    setContentModalVisible(false);
    setTimeout(() => setSelectedContent(null), 300);
  };
  
  const handlePlayContent = async () => {
    if (!selectedContent) return;
    
    try {
      // In a real app, this might use a media player or redirect to the platform
      const result = await mediaService.playMedia(selectedContent.id);
      
      if (result.success) {
        // Simulate opening the content URL
        if (selectedContent.url) {
          Linking.openURL(selectedContent.url).catch(err => {
            console.error('Failed to open URL', err);
          });
        }
        handleCloseContentModal();
      } else {
        console.error('Failed to play media', result.message);
      }
    } catch (error) {
      console.error('Play media error', error);
    }
  };
  
  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(current => {
      if (current.includes(platform)) {
        return current.filter(p => p !== platform);
      } else {
        return [...current, platform];
      }
    });
  };
  
  // Platform selection UI
  const renderPlatformButtons = () => {
    const platforms = [
      { name: 'Spotify', value: 'spotify', icon: 'spotify' },
      { name: 'YouTube', value: 'youtube', icon: 'youtube' },
      { name: 'Other', value: 'other', icon: 'web' },
    ];
    
    return (
      <View style={styles.platformButtonsContainer}>
        {platforms.map(platform => (
          <TouchableOpacity
            key={platform.value}
            style={[
              styles.platformButton,
              selectedPlatforms.includes(platform.value) && { 
                backgroundColor: theme.colors.primary,
              },
            ]}
            onPress={() => togglePlatform(platform.value)}
          >
            <MaterialCommunityIcons 
              name={platform.icon as any} 
              size={24} 
              color={selectedPlatforms.includes(platform.value) ? 'white' : theme.colors.onSurface} 
            />
            <Text 
              style={[
                styles.platformButtonText,
                { color: selectedPlatforms.includes(platform.value) ? 'white' : theme.colors.onSurface }
              ]}
            >
              {platform.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  // Media type tabs
  const renderMediaTypeTabs = () => {
    const types = [
      { label: 'Music', value: 'music', icon: 'music' },
      { label: 'Video', value: 'video', icon: 'video' },
      { label: 'Podcast', value: 'podcast', icon: 'podcast' },
      { label: 'News', value: 'news', icon: 'newspaper' },
    ];
    
    return (
      <View style={styles.mediaTypeTabs}>
        {types.map(type => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.mediaTypeTab,
              selectedMediaType === type.value && { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setSelectedMediaType(type.value as any)}
          >
            <MaterialCommunityIcons 
              name={type.icon as any} 
              size={20} 
              color={selectedMediaType === type.value ? 'white' : theme.colors.onSurface} 
            />
            <Text
              style={[
                styles.mediaTypeText,
                { color: selectedMediaType === type.value ? 'white' : theme.colors.onSurface }
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  // Render recommended content section
  const renderRecommendationSection = (contentType: 'music' | 'video' | 'podcast' | 'news', title: string) => {
    const contents = recommendedContent[contentType] || [];
    
    if (contents.length === 0) return null;
    
    return (
      <View style={styles.recommendationSection}>
        <Text style={[styles.recommendationTitle, { color: theme.colors.onBackground }]}>
          {title}
        </Text>
        <FlatList
          horizontal
          data={contents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.recommendedItem} 
              onPress={() => handleSelectContent(item)}
            >              <View style={styles.recommendedThumbnail}>
                {item.thumbnail ? (
                  <Image 
                    source={{ uri: item.thumbnail }} 
                    style={styles.recommendedThumbnail}
                    onError={() => {}}
                  />
                ) : (
                  <View style={[styles.recommendedThumbnail, styles.placeholderContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <MaterialCommunityIcons 
                      name={item.contentType === 'music' ? 'music' : 
                            item.contentType === 'video' ? 'video' : 
                            item.contentType === 'podcast' ? 'podcast' : 'newspaper'} 
                      size={24} 
                      color={theme.colors.onSurfaceVariant} 
                    />
                  </View>
                )}
              </View>
              <Text 
                style={[styles.recommendedTitle, { color: theme.colors.onBackground }]} 
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <View style={styles.recommendedMeta}>
                {item.artist && (
                  <Text style={[styles.recommendedArtist, { color: theme.colors.secondary }]} numberOfLines={1}>
                    {item.artist}
                  </Text>
                )}
                <View style={styles.platformBadge}>
                  <MaterialCommunityIcons 
                    name={item.platform === 'spotify' ? 'spotify' : 
                          item.platform === 'youtube' ? 'youtube' : 'web'} 
                    size={12} 
                    color="white" 
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };
  
  // Content detail modal
  const renderContentModal = () => {
    if (!selectedContent) return null;
    
    return (
      <Modal
        visible={contentModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseContentModal}
      >
        <View style={styles.modalOverlay}>
          <View 
            style={[
              styles.modalContent, 
              { backgroundColor: theme.colors.surface }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.onBackground }]}>
                {selectedContent.title}
              </Text>
              <TouchableOpacity onPress={handleCloseContentModal}>
                <MaterialCommunityIcons name="close" size={24} color={theme.colors.onBackground} />
              </TouchableOpacity>
            </View>
              {selectedContent.thumbnail ? (
              <Image 
                source={{ uri: selectedContent.thumbnail }} 
                style={styles.contentImage}
                onError={() => {}}
              />
            ) : (
              <View style={[styles.contentImage, styles.placeholderContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
                <MaterialCommunityIcons 
                  name={selectedContent.contentType === 'music' ? 'music' : 
                        selectedContent.contentType === 'video' ? 'video' : 
                        selectedContent.contentType === 'podcast' ? 'podcast' : 'newspaper'} 
                  size={48} 
                  color={theme.colors.onSurfaceVariant} 
                />
              </View>
            )}
            
            <View style={styles.contentDetails}>
              {selectedContent.artist && (
                <Text style={[styles.contentArtist, { color: theme.colors.onBackground }]}>
                  {selectedContent.artist}
                </Text>
              )}
              
              <View style={styles.contentMeta}>
                <View style={styles.contentMetaItem}>
                  <MaterialCommunityIcons 
                    name={
                      selectedContent.contentType === 'music' ? 'music' : 
                      selectedContent.contentType === 'video' ? 'video' : 
                      selectedContent.contentType === 'podcast' ? 'podcast' : 
                      'newspaper'
                    } 
                    size={18} 
                    color={theme.colors.primary} 
                  />
                  <Text style={{ color: theme.colors.secondary, marginLeft: 4 }}>
                    {selectedContent.contentType.charAt(0).toUpperCase() + selectedContent.contentType.slice(1)}
                  </Text>
                </View>
                
                {selectedContent.duration && (
                  <View style={styles.contentMetaItem}>
                    <MaterialCommunityIcons name="clock-outline" size={18} color={theme.colors.primary} />
                    <Text style={{ color: theme.colors.secondary, marginLeft: 4 }}>
                      {Math.floor(selectedContent.duration / 60)}:{(selectedContent.duration % 60).toString().padStart(2, '0')}
                    </Text>
                  </View>
                )}
                
                <View style={styles.contentMetaItem}>
                  <MaterialCommunityIcons 
                    name={
                      selectedContent.platform === 'spotify' ? 'spotify' : 
                      selectedContent.platform === 'youtube' ? 'youtube' : 
                      'web'
                    } 
                    size={18} 
                    color={theme.colors.primary} 
                  />
                  <Text style={{ color: theme.colors.secondary, marginLeft: 4 }}>
                    {selectedContent.platform.charAt(0).toUpperCase() + selectedContent.platform.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.modalActions}>
              <Button
                title="Open Later"
                variant="outline"
                onPress={handleCloseContentModal}
              />
              <Button
                title="Play Now"
                onPress={handlePlayContent}
                icon="play"
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.headerTitle, { color: theme.colors.onBackground }]}>
        Media Hub
      </Text>
      
      {/* Platform Connection */}
      <Card
        title="Your Platforms"
        subtitle="Connect your media services"
        icon="connection"
        iconColor="#E91E63"
        elevated
      >
        <Text style={[styles.sectionDescription, { color: theme.colors.onBackground }]}>
          Connect your favorite media platforms for personalized recommendations and seamless playback.
        </Text>
        {renderPlatformButtons()}
      </Card>
      
      {/* Media Search */}
      <Card
        title="Media Search"
        subtitle="Find content across platforms"
        icon="magnify"
        iconColor="#FF9800"
        elevated
      >
        {renderMediaTypeTabs()}
        
        <View style={styles.searchContainer}>
          <TextInput
            style={[
              styles.searchInput,
              { 
                backgroundColor: theme.colors.surfaceVariant,
                color: theme.colors.onBackground,
                borderColor: theme.colors.outline
              }
            ]}
            placeholder="Search for content..."
            placeholderTextColor={theme.colors.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity 
            style={[styles.searchButton, { backgroundColor: theme.colors.primary }]} 
            onPress={handleSearch}
          >
            <MaterialCommunityIcons name="magnify" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        {isSearching ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
        ) : searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.searchResult}
                onPress={() => handleSelectContent(item)}
              >                {item.thumbnail ? (
                  <Image 
                    source={{ uri: item.thumbnail }} 
                    style={styles.searchResultImage}
                    onError={() => {}}
                  />
                ) : (
                  <View style={[styles.searchResultImage, styles.placeholderContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <MaterialCommunityIcons 
                      name={item.contentType === 'music' ? 'music' : 
                            item.contentType === 'video' ? 'video' : 
                            item.contentType === 'podcast' ? 'podcast' : 'newspaper'} 
                      size={24} 
                      color={theme.colors.onSurfaceVariant} 
                    />
                  </View>
                )}
                <View style={styles.searchResultInfo}>
                  <Text style={[styles.searchResultTitle, { color: theme.colors.onBackground }]}>
                    {item.title}
                  </Text>
                  <Text style={{ color: theme.colors.secondary }}>
                    {item.artist || 'Unknown artist'} • {item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}
                  </Text>
                </View>
                <MaterialCommunityIcons 
                  name="play-circle" 
                  size={32} 
                  color={theme.colors.primary} 
                />
              </TouchableOpacity>
            )}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : searchQuery.length > 0 && (
          <Text style={[styles.emptyText, { color: theme.colors.secondary }]}>
            No results found for "{searchQuery}"
          </Text>
        )}
      </Card>
      
      {/* Recommended Content */}
      <Card
        title="Recommended for You"
        subtitle="Based on your preferences"
        icon="playlist-star"
        iconColor="#4CAF50"
        elevated
      >
        {isLoadingRecommendations ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
        ) : Object.keys(recommendedContent).length > 0 ? (
          <View>
            {renderRecommendationSection('music', 'Music Recommendations')}
            {renderRecommendationSection('video', 'Video Suggestions')}
            {renderRecommendationSection('podcast', 'Podcasts for You')}
            {renderRecommendationSection('news', "Today's Headlines")}
          </View>
        ) : (
          <Text style={[styles.emptyText, { color: theme.colors.secondary }]}>
            No recommendations available. Connect platforms to get personalized suggestions.
          </Text>
        )}
      </Card>
      
      {renderContentModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  placeholderText: {
    marginBottom: 12,
  },
  bulletPointContainer: {
    marginBottom: 12,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionDescription: {
    marginBottom: 16,
  },
  platformButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  platformButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  platformButtonText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  mediaTypeTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  mediaTypeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  mediaTypeText: {
    marginLeft: 4,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  searchButton: {
    width: 46,
    height: 46,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    padding: 20,
  },
  searchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  searchResultImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultTitle: {
    fontWeight: '500',
    marginBottom: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  emptyText: {
    textAlign: 'center',
    padding: 16,
  },
  recommendationSection: {
    marginBottom: 24,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  recommendedItem: {
    width: 150,
    marginRight: 16,
  },
  recommendedThumbnail: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  recommendedTitle: {
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 4,
  },
  recommendedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recommendedArtist: {
    flex: 1,
    fontSize: 12,
  },
  platformBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  contentImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  contentDetails: {
    marginBottom: 24,
  },
  contentArtist: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  contentMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contentMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MediaScreen;
