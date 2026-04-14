import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0eZfCKjT8MuykV7GJtw-rio7QnNpLJ40",
  authDomain: "joblink-8d820.firebaseapp.com",
  projectId: "joblink-8d820",
  storageBucket: "joblink-8d820.firebasestorage.app",
  messagingSenderId: "821320100593",
  appId: "1:821320100593:web:13606aa0607c96c5911750"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const JOB_DATA = [
  {
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

async function seed() {
  console.log("Seeding started...");
  for (const job of JOB_DATA) {
    try {
      const docRef = await addDoc(collection(db, "jobs"), job);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  console.log("Seeding finished.");
  process.exit(0);
}

seed();
