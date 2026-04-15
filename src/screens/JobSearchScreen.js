import React, { useState, useEffect } from 'react';
import { 
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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = jobs.filter(job => 
    job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <View className="bg-white rounded-[24px] p-6 mb-5 shadow-sm shadow-slate-200 elevation-3">
      <View className="flex-row justify-between items-start mb-4">
        <View className="w-12 h-12 rounded-xl justify-center items-center" style={{ backgroundColor: item.logoColor || '#f1f5f9' }}>
           <MaterialCommunityIcons name={item.icon || 'briefcase-outline'} size={20} color={item.logoColor === '#1e293b' ? '#fff' : '#0ea5e9'} />
        </View>
        <TouchableOpacity>
          <Ionicons name="bookmark" size={20} color="#64748b" />
        </TouchableOpacity>
      </View>
      
      <Text className="text-lg font-bold text-slate-900 mb-1.5">{item.title}</Text>
      <Text className="text-sm text-slate-600 mb-4">{item.company} • {item.location}</Text>
      
      <View className="flex-row flex-wrap gap-2 mb-6">
        {item.tags && item.tags.map((tag, index) => (
          <View key={index} className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: tag.color || '#e2e8f0' }}>
            <Text className="text-[11px] font-bold tracking-wider" style={{ color: tag.textColor || '#334155' }}>{tag.label}</Text>
          </View>
        ))}
      </View>
      
      <View className="flex-row justify-between items-center border-t border-slate-100 pt-4">
        <Text className="text-base font-bold text-blue-600">{item.salary}</Text>
        <TouchableOpacity className="bg-indigo-600 px-5 py-2.5 rounded-full">
          <Text className="text-white font-semibold text-sm">Voir détails</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#f8faff]" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8faff" />
      <View className="flex-1">
        
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3">
          <TouchableOpacity>
            <Ionicons name="menu" size={24} color="#334155" />
          </TouchableOpacity>
          
          <Text className="text-xl font-extrabold text-indigo-700 tracking-tight">JobLink</Text>
          
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-4">
              <Ionicons name="notifications" size={20} color="#64748b" />
            </TouchableOpacity>
            <View className="w-8 h-8 rounded-full overflow-hidden">
              <Image 
                source={{ uri: 'https://i.pravatar.cc/100?img=47' }} 
                className="w-full h-full"
              />
            </View>
          </View>
        </View>

        {/* Hero Section */}
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#4338ca" />
            <Text className="mt-2.5 text-slate-500">Chargement des offres...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredJobs}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View>
                <View className="px-5 mt-4 mb-6">
                  <Text className="text-3xl font-extrabold text-slate-900 mb-2 leading-10 tracking-tight">
                    Find your next <Text className="italic text-blue-600">impact</Text>.
                  </Text>
                  <Text className="text-base text-slate-600 leading-6">
                    Curated opportunities for high-performing talent.
                  </Text>
                </View>

                {/* Search Bar */}
                <View className="flex-row items-center bg-slate-100 mx-5 rounded-full px-4 py-3 mb-5">
                  <Ionicons name="search" size={20} color="#94a3b8" className="mr-2" />
                  <TextInput 
                    className="flex-1 text-base text-slate-700"
                    placeholder="Search jobs, companies..."
                    placeholderTextColor="#94a3b8"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                {/* Filters */}
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  className="mb-6"
                  contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
                >
                  <TouchableOpacity className="bg-blue-700 px-4 py-2.5 rounded-full flex-row items-center gap-1.5">
                    <Ionicons name="location-sharp" size={14} color="#fff" />
                    <Text className="font-semibold text-white text-sm">Paris, FR</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity className="bg-slate-200 px-4 py-2.5 rounded-full flex-row items-center gap-1.5">
                    <Text className="font-semibold text-slate-700 text-sm">Product Design</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity className="bg-slate-200 px-4 py-2.5 rounded-full flex-row items-center gap-1.5">
                    <Text className="font-semibold text-slate-700 text-sm">Contract</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            }
            renderItem={renderJobCard}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          />
        )}

        {/* Bottom Navigation */}
        <View className="flex-row justify-around items-center bg-white py-3 px-2 border-t border-slate-100 absolute bottom-0 left-0 right-0" style={{ paddingBottom: Platform.OS === 'ios' ? 28 : 12 }}>
          <TouchableOpacity className="items-center justify-center w-16" onPress={() => setActiveTab('Search')}>
            <Ionicons name={activeTab === 'Search' ? "search" : "search-outline"} size={24} color={activeTab === 'Search' ? "#3b82f6" : "#94a3b8"} />
            <Text className={`text-[10px] font-bold mt-1 tracking-wider ${activeTab === 'Search' ? 'text-blue-500' : 'text-slate-400'}`}>SEARCH</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center justify-center w-16" onPress={() => setActiveTab('Apps')}>
            <Ionicons name={activeTab === 'Apps' ? "briefcase" : "briefcase-outline"} size={24} color={activeTab === 'Apps' ? "#3b82f6" : "#94a3b8"} />
            <Text className={`text-[10px] font-bold mt-1 tracking-wider ${activeTab === 'Apps' ? 'text-blue-500' : 'text-slate-400'}`}>APPS</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center justify-center w-16" onPress={() => setActiveTab('Messages')}>
            <Ionicons name={activeTab === 'Messages' ? "chatbubble" : "chatbubble-outline"} size={24} color={activeTab === 'Messages' ? "#3b82f6" : "#94a3b8"} />
            <Text className={`text-[10px] font-bold mt-1 tracking-wider ${activeTab === 'Messages' ? 'text-blue-500' : 'text-slate-400'}`}>MESSAGES</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center justify-center w-16" onPress={() => setActiveTab('Profile')}>
            <Ionicons name={activeTab === 'Profile' ? "person" : "person-outline"} size={24} color={activeTab === 'Profile' ? "#3b82f6" : "#94a3b8"} />
            <Text className={`text-[10px] font-bold mt-1 tracking-wider ${activeTab === 'Profile' ? 'text-blue-500' : 'text-slate-400'}`}>PROFILE</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}
