import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const normalize = (v?: string) => (v ? v.replace(/^"|"$/g, '').replace(/,$/, '') : v);

const candidateServiceAccountPaths = [
  path.resolve(__dirname, '../../firebase-service-account.json'), 
  path.resolve(__dirname, '../firebase-service-account.json'),
  path.resolve(__dirname, '../../../firebase-service-account.json'),
  path.resolve(process.cwd(), 'firebase-service-account.json'),
];

let serviceAccountPath: string | undefined;
for (const p of candidateServiceAccountPaths) {
  try {
    if (fs.existsSync(p)) {
      serviceAccountPath = p;
      break;
    }
  } catch (e) {
    // ignore
  }
}

console.log('DEBUG firebase: searched service account paths, found=', serviceAccountPath);

if (!admin.apps.length) {
  if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8')) as admin.ServiceAccount;
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp();
  } else if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PROJECT_ID) {
    const privateKey = normalize(process.env.FIREBASE_PRIVATE_KEY)!.replace(/\\n/g, '\n');
    const clientEmail = normalize(process.env.FIREBASE_CLIENT_EMAIL)!;
    const projectId = normalize(process.env.FIREBASE_PROJECT_ID)!;
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      } as admin.ServiceAccount),
    });
  } else {
    console.warn(
      'Firebase service account not found at',
      serviceAccountPath,
      'and GOOGLE_APPLICATION_CREDENTIALS not set. Firebase SDK not initialized.'
    );
  }
}

export default admin;