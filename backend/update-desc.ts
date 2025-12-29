import admin from './firebase/firebase';

const updateDescriptions = async () => {
  const firestore = admin.firestore();
  const modulCollection = firestore.collection('modul');
  
  try {
    const snapshot = await modulCollection.get();
    
    for (const doc of snapshot.docs) {
      await doc.ref.update({
        deskripsi: 'Click to access practicum module'
      });
      console.log(`Updated modul ${doc.id}`);
    }
    
    console.log('✅ All module descriptions updated to English!');
  } catch (error) {
    console.error('Error updating descriptions:', error);
  }
  
  process.exit(0);
};

updateDescriptions();
