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
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as DocumentPicker from 'expo-document-picker';
import { db, storage, auth } from '../firebaseConfig';

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
    // Filtres désactivés : suppression de toute la logique liée aux filtres
  const [activeTab, setActiveTab] = useState('Search');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalVisible, setApplyModalVisible] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('form'); 
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  
  // Filtres désactivés : suppression des états, fonctions et options

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setResumeFile(result.assets[0]);
      }
    } catch (err) {
      console.log('Error picking document', err);
    }
  };

  const submitApplication = async () => {
    if (!resumeFile) {
      alert("Veuillez d'abord sélectionner un CV.");
      return;
    }
    
    setApplicationStatus('submitting');
    
    try {
      let resumeDownloadURL = null;
      
      try {
        // 1. Convert document URI to Blob
        const response = await fetch(resumeFile.uri);
        const blob = await response.blob();
        
        // 2. Upload file to Firebase Storage
        const fileName = `${Date.now()}_${resumeFile.name.replace(/\s+/g, '_')}`;
        const storageRef = ref(storage, `resumes/${fileName}`);
        await uploadBytes(storageRef, blob);
        resumeDownloadURL = await getDownloadURL(storageRef);
      } catch (storageError) {
        console.warn("Storage upload failed, proceeding with Firestore save.", storageError);
      }
      
      // 3. Save application record to Firestore
      const applicationData = {
        jobId: selectedJob?.id || 'unknown',
        jobTitle: selectedJob?.title || 'Unknown Job',
        company: selectedJob?.company || 'Unknown',
        userId: auth?.currentUser?.uid || 'anonymous_user',
        coverLetter: coverLetter,
        resumeUrl: resumeDownloadURL || 'Non uploadé (Erreur Storage)',
        resumeName: resumeFile.name,
        status: 'pending',
        appliedAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'applications'), applicationData);
      
      setApplicationStatus('success');
    } catch (error) {
      console.error("Erreur lors de la candidature:", error);
      alert("Une erreur s'est produite lors de l'envoi vers Firestore. Assurez-vous que la base de données est accessible.");
      setApplicationStatus('form');
    }
  };

  const closeApplyModal = () => {
    setApplyModalVisible(false);
    setTimeout(() => {
      setApplicationStatus('form');
      setCoverLetter('');
      setSelectedJob(null);
      setResumeFile(null);
    }, 300);
  };

  // Recherche simple : filtrer les jobs selon le texte de recherche (titre, entreprise, lieu)
  const sortedAndFilteredJobs = jobs.filter(job => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return (
      (job.title && job.title.toLowerCase().includes(q)) ||
      (job.company && job.company.toLowerCase().includes(q)) ||
      (job.location && job.location.toLowerCase().includes(q))
    );
  });

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
        <TouchableOpacity 
          className="bg-indigo-600 px-5 py-2.5 rounded-full"
          onPress={() => {
            setSelectedJob(item);
            setApplyModalVisible(true);
          }}
        >
          <Text className="text-white font-semibold text-sm">Postuler</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Filtres désactivés : plus de fonctions de titre, reset, etc.

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
        {activeTab === 'Search' && (
          loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#4338ca" />
              <Text className="mt-2.5 text-slate-500">Chargement des offres...</Text>
            </View>
          ) : (
            <FlatList
            data={sortedAndFilteredJobs}
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
                <View className="flex-row items-center mx-5 mb-5">
                  <View className="flex-1 flex-row items-center bg-white border border-slate-200/60 rounded-2xl px-4 py-3 shadow-sm shadow-slate-100/50">
                    <Ionicons name="search" size={20} color="#94a3b8" className="mr-2" />
                    <TextInput 
                      className="flex-1 text-base text-slate-800"
                      placeholder="Rechercher (Designer, Paris...)"
                      placeholderTextColor="#94a3b8"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity onPress={() => setSearchQuery('')}>
                         <Ionicons name="close-circle" size={18} color="#cbd5e1" />
                      </TouchableOpacity>
                    )}
                  </View>
                  {/* Bouton options supprimé car plus de filtres */}
                </View>

                {/* Filtres désactivés : aucun bouton de filtre affiché */}
              </View>
            }
            ListEmptyComponent={
              <View className="items-center justify-center py-10 px-5 mt-4">
                <Ionicons name="search-outline" size={60} color="#cbd5e1" />
                <Text className="text-xl font-bold text-slate-800 mt-4 text-center">Aucune offre trouvée</Text>
                <Text className="text-slate-500 text-center mt-2 leading-5">Essayez de modifier votre recherche pour voir d'autres résultats.</Text>
                {searchQuery !== '' && (
                  <TouchableOpacity 
                    className="mt-6 bg-slate-100 px-6 py-3 rounded-full border border-slate-200"
                    onPress={() => setSearchQuery('')}
                  >
                    <Text className="text-slate-700 font-semibold text-sm">Effacer la recherche</Text>
                  </TouchableOpacity>
                )}
              </View>
            }
            renderItem={renderJobCard}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          />
          )
        )}

        {activeTab === 'Apps' && (
          <View className="flex-1 justify-center items-center px-5">
            <View className="w-20 h-20 bg-indigo-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="briefcase-outline" size={40} color="#4f46e5" />
            </View>
            <Text className="text-xl font-bold text-slate-800 text-center mb-2">Vos candidatures</Text>
            <Text className="text-slate-500 text-center leading-6">Retrouvez ici l'historique de vos candidatures et suivez leur avancement.</Text>
          </View>
        )}

        {activeTab === 'Messages' && (
          <View className="flex-1 justify-center items-center px-5">
            <View className="w-20 h-20 bg-indigo-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="chatbubble-ellipses-outline" size={40} color="#4f46e5" />
            </View>
            <Text className="text-xl font-bold text-slate-800 text-center mb-2">Messagerie</Text>
            <Text className="text-slate-500 text-center leading-6">Échangez avec les recruteurs une fois votre candidature retenue.</Text>
          </View>
        )}

        {activeTab === 'Profile' && (
          <ScrollView className="flex-1 px-5 pt-4">
            <View className="items-center mb-8 mt-4">
               <View className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-slate-100 shadow-sm bg-white">
                 <Image source={{ uri: 'https://i.pravatar.cc/100?img=47' }} className="w-full h-full" />
               </View>
               <Text className="text-2xl font-bold text-slate-900">John Doe</Text>
               <Text className="text-slate-500 mt-1 font-medium">Product Designer</Text>
            </View>

            <View className="bg-white rounded-[20px] p-2 mb-4 shadow-sm shadow-slate-200">
               <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-slate-100">
                 <View className="flex-row items-center">
                    <Ionicons name="person-outline" size={22} color="#64748b" />
                    <Text className="ml-4 font-semibold text-slate-700 text-base">Informations personnelles</Text>
                 </View>
                 <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
               </TouchableOpacity>
               <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-slate-100">
                 <View className="flex-row items-center">
                    <Ionicons name="document-text-outline" size={22} color="#64748b" />
                    <Text className="ml-4 font-semibold text-slate-700 text-base">Mon CV</Text>
                 </View>
                 <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
               </TouchableOpacity>
               <TouchableOpacity className="flex-row items-center justify-between p-4">
                 <View className="flex-row items-center">
                    <Ionicons name="settings-outline" size={22} color="#64748b" />
                    <Text className="ml-4 font-semibold text-slate-700 text-base">Paramètres</Text>
                 </View>
                 <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
               </TouchableOpacity>
            </View>
            
            <TouchableOpacity className="flex-row items-center justify-center p-4 mt-2 mb-20">
               <Ionicons name="log-out-outline" size={20} color="#ef4444" />
               <Text className="ml-2 font-bold text-red-500 text-base">Déconnexion</Text>
            </TouchableOpacity>
          </ScrollView>
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

        {/* Application Modal */}
        <Modal
          visible={isApplyModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeApplyModal}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            className="flex-1 justify-end bg-black/50"
          >
            <View className="bg-white rounded-t-3xl px-6 pt-5 pb-8 min-h-[60%]">
              
              <View className="items-center mb-4">
                <View className="w-12 h-1.5 bg-slate-200 rounded-full" />
              </View>

              <View className="flex-row justify-between items-start mb-6">
                <View className="flex-1">
                  <Text className="text-2xl font-extrabold text-slate-900 mb-1">Candidature</Text>
                  {selectedJob && (
                    <Text className="text-slate-600">
                      Vous postulez pour : <Text className="font-bold text-slate-800">{selectedJob.title}</Text> chez {selectedJob.company}
                    </Text>
                  )}
                </View>
                <TouchableOpacity onPress={closeApplyModal} className="bg-slate-100 p-2 rounded-full ml-3">
                  <Ionicons name="close" size={20} color="#64748b" />
                </TouchableOpacity>
              </View>

              {applicationStatus === 'form' && (
                <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
                  <View className="mb-5">
                    <Text className="text-sm font-bold text-slate-700 mb-2">CV / Resume *</Text>
                    <TouchableOpacity 
                      className={`border-2 ${resumeFile ? 'border-solid border-indigo-500 bg-indigo-50' : 'border-dashed border-slate-300 bg-slate-50'} rounded-xl p-4 flex-row items-center justify-center`}
                      onPress={handleDocumentPick}
                    >
                      <Ionicons name={resumeFile ? "document" : "document-text-outline"} size={24} color={resumeFile ? "#4f46e5" : "#94a3b8"} />
                      <Text className={`ml-2 font-medium ${resumeFile ? 'text-indigo-700' : 'text-slate-500'}`}>
                        {resumeFile ? resumeFile.name : 'Uploader un document (PDF, DOCX)'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="mb-5">
                     <Text className="text-sm font-bold text-slate-700 mb-2">Lettre de motivation (Optionnel)</Text>
                     <TextInput
                       className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 h-32"
                       placeholder="Parlez-nous de vous..."
                       placeholderTextColor="#94a3b8"
                       multiline
                       textAlignVertical="top"
                       value={coverLetter}
                       onChangeText={setCoverLetter}
                     />
                  </View>
                </ScrollView>
              )}

              {applicationStatus === 'submitting' && (
                <View className="flex-1 justify-center items-center py-10">
                  <ActivityIndicator size="large" color="#4f46e5" />
                  <Text className="mt-4 text-slate-600 font-medium">Envoi de la candidature...</Text>
                </View>
              )}

              {applicationStatus === 'success' && (
                <View className="flex-1 justify-center items-center py-10">
                  <View className="w-20 h-20 bg-green-100 flex items-center justify-center rounded-full mb-5">
                    <Ionicons name="checkmark-circle" size={50} color="#10b981" />
                  </View>
                  <Text className="text-2xl font-bold text-slate-900 mb-2 text-center">Félicitations !</Text>
                  <Text className="text-slate-500 text-center px-4 leading-6">
                    Votre candidature a bien été envoyée à {selectedJob?.company}.
                  </Text>
                </View>
              )}

              {applicationStatus === 'form' && (
                <TouchableOpacity 
                  className="bg-indigo-600 rounded-full py-4 items-center mt-2 shadow-sm shadow-indigo-200"
                  onPress={submitApplication}
                >
                  <Text className="text-white font-bold text-lg">Soumettre</Text>
                </TouchableOpacity>
              )}
              {applicationStatus === 'success' && (
                <TouchableOpacity 
                  className="bg-slate-900 rounded-full py-4 items-center mt-2"
                  onPress={closeApplyModal}
                >
                  <Text className="text-white font-bold text-lg">Retour aux offres</Text>
                </TouchableOpacity>
              )}
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Filtres désactivés : plus de modale de filtre */}

      </View>
    </SafeAreaView>
  );
}
