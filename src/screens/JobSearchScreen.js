import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TextInput, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  FlatList,
  StatusBar,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const JOB_DATA = [
  {
    id: '1',
    title: 'Senior Product Designer',
    company: 'Linear Systems',
    location: 'Paris, FR',
    salary: '75k DA - 95k DA',
    tags: [
      { label: 'REMOTE FRIENDLY', color: '#e0f4ea', textColor: '#2e8c61' },
      { label: 'FULL-TIME', color: '#e5ebfb', textColor: '#3a61c3' }
    ],
    logoColor: '#f1f5f9',
    icon: 'cube-outline'
  },
  {
    id: '2',
    title: 'Lead Growth Engineer',
    company: 'Streamline AI',
    location: 'Bordeaux, FR',
    salary: '80k DA - 110k DA',
    tags: [
      { label: 'HYBRID', color: '#f0e5fa', textColor: '#8442d8' },
      { label: 'FULL-TIME', color: '#e5ebfb', textColor: '#3a61c3' }
    ],
    logoColor: '#fdf2f8',
    icon: 'chart-box-outline'
  },
  {
    id: '3',
    title: 'VP of Engineering',
    company: 'Atlas Protocol',
    location: 'Remote',
    salary: '120k DA - 150k DA',
    tags: [
      { label: 'WORLD REMOTE', color: '#e0f4ea', textColor: '#2e8c61' },
      { label: 'CONTRACT', color: '#e5ebfb', textColor: '#3a61c3' }
    ],
    logoColor: '#1e293b',
    icon: 'pi' // approximated
  }
];

export default function JobSearchScreen() {
  const [activeTab, setActiveTab] = useState('Search');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "jobs"));
        if (!querySnapshot.empty) {
          const jobsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setJobs(jobsData);
        } else {
          // Fallback to static data if Firestore is empty
          setJobs(JOB_DATA);
        }
      } catch (error) {
        console.error("Error fetching jobs from Firebase: ", error);
        setJobs(JOB_DATA); // Fallback on error (e.g., missing permissions)
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);
  
  const renderJobCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <View style={[styles.companyLogo, { backgroundColor: item.logoColor || '#f1f5f9' }]}>
           <MaterialCommunityIcons name={item.icon || 'briefcase-outline'} size={20} color={item.logoColor === '#1e293b' ? '#fff' : '#0ea5e9'} />
        </View>
        <TouchableOpacity>
          <Ionicons name="bookmark" size={20} color="#64748b" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.companyInfo}>{item.company} • {item.location}</Text>
      
      <View style={styles.tagsContainer}>
        {item.tags && item.tags.map((tag, index) => (
          <View key={index} style={[styles.tag, { backgroundColor: tag.color || '#e2e8f0' }]}>
            <Text style={[styles.tagText, { color: tag.textColor || '#334155' }]}>{tag.label}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.salary}>{item.salary}</Text>
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Voir détails</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8faff" />
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="menu" size={24} color="#334155" />
          </TouchableOpacity>
          
          <Text style={styles.logoText}>JobLink</Text>
          
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications" size={20} color="#64748b" />
            </TouchableOpacity>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: 'https://i.pravatar.cc/100?img=47' }} 
                style={styles.avatar} 
              />
            </View>
          </View>
        </View>

        {/* Hero Section */}
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#4338ca" />
            <Text style={{ marginTop: 10, color: '#64748b' }}>Chargement des offres...</Text>
          </View>
        ) : (
          <FlatList
            data={jobs}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <View style={styles.heroSection}>
                <Text style={styles.heroTitle}>
                  Find your next <Text style={styles.heroTitleItalic}>impact</Text>.
                </Text>
                <Text style={styles.heroSubtitle}>
                  Curated opportunities for high-performing talent.
                </Text>
              </View>

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
                <TextInput 
                  style={styles.searchInput}
                  placeholder="Search jobs, companies..."
                  placeholderTextColor="#94a3b8"
                />
              </View>

              {/* Filters */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.filtersContainer}
                contentContainerStyle={styles.filtersContent}
              >
                <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}>
                  <Ionicons name="location-sharp" size={14} color="#fff" />
                  <Text style={[styles.filterChipText, styles.filterChipTextActive]}>Paris, FR</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.filterChip}>
                  <Text style={styles.filterChipText}>Product Design</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.filterChip}>
                  <Text style={styles.filterChipText}>Contract</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          }
          renderItem={renderJobCard}
          contentContainerStyle={styles.listContent}
        />
        )}

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Search')}>
            <Ionicons name={activeTab === 'Search' ? "search" : "search-outline"} size={24} color={activeTab === 'Search' ? "#3b82f6" : "#94a3b8"} />
            <Text style={[styles.navText, activeTab === 'Search' && styles.navTextActive]}>SEARCH</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Apps')}>
            <Ionicons name={activeTab === 'Apps' ? "briefcase" : "briefcase-outline"} size={24} color={activeTab === 'Apps' ? "#3b82f6" : "#94a3b8"} />
            <Text style={[styles.navText, activeTab === 'Apps' && styles.navTextActive]}>APPS</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Messages')}>
            <Ionicons name={activeTab === 'Messages' ? "chatbubble" : "chatbubble-outline"} size={24} color={activeTab === 'Messages' ? "#3b82f6" : "#94a3b8"} />
            <Text style={[styles.navText, activeTab === 'Messages' && styles.navTextActive]}>MESSAGES</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Profile')}>
            <Ionicons name={activeTab === 'Profile' ? "person" : "person-outline"} size={24} color={activeTab === 'Profile' ? "#3b82f6" : "#94a3b8"} />
            <Text style={[styles.navText, activeTab === 'Profile' && styles.navTextActive]}>PROFILE</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8faff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4338ca', // Indigo / Purple
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBtn: {
    marginRight: 16,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  heroSection: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  heroTitleItalic: {
    fontStyle: 'italic',
    color: '#2563eb',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    marginHorizontal: 20,
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
  },
  filtersContainer: {
    marginBottom: 24,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterChip: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: '#1d4ed8', // Dark blue
  },
  filterChipText: {
    fontWeight: '600',
    color: '#334155',
    fontSize: 14,
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for bottom nav
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  companyInfo: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 16,
  },
  salary: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
  },
  applyButton: {
    backgroundColor: '#4f46e5', // Indigo
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
  },
  applyButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  navText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  navTextActive: {
    color: '#3b82f6',
  }
});
