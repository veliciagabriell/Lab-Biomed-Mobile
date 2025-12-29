import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

@Injectable()
export class FirebaseService {
  public app?: admin.app.App;

  constructor() {
    if (admin.apps.length) {
      this.app = admin.apps[0] ?? undefined;
      console.log('FirebaseService: using existing admin app');
      return;
    }

    try {
      const normalize = (v?: string) => (v ? v.replace(/^"|"$/g, '').replace(/,$/, '') : v);
      const serviceAccountPath = path.join(__dirname, '../../firebase-service-account.json');

      if (fs.existsSync(serviceAccountPath)) {
        console.log('FirebaseService: initializing using firebase-service-account.json');
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8')) as admin.ServiceAccount;
        this.app = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.log('FirebaseService: initializing using GOOGLE_APPLICATION_CREDENTIALS');
        this.app = admin.initializeApp();
      } else if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PROJECT_ID) {
        console.log('FirebaseService: initializing using FIREBASE_PRIVATE_KEY env vars');
        const privateKey = normalize(process.env.FIREBASE_PRIVATE_KEY)!.replace(/\\n/g, '\n');
        const clientEmail = normalize(process.env.FIREBASE_CLIENT_EMAIL)!;
        const projectId = normalize(process.env.FIREBASE_PROJECT_ID)!;
        this.app = admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          } as admin.ServiceAccount),
        });
      } else {
        console.warn('Firebase not initialized: service account JSON not found and env vars not set.');
      }
      console.log('FirebaseService: admin.apps.length =', admin.apps.length);
    } catch (err) {
      console.warn('Failed to initialize Firebase in FirebaseService:', err?.message ?? err);
    }
  }

  getFirestore() {
    return admin.apps.length ? admin.firestore() : null;
  }

  getAuth() {
    return admin.apps.length ? admin.auth() : null;
  }
}