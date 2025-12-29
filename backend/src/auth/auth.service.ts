import { Injectable, UnauthorizedException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as admin from 'firebase-admin';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from './role.enum';
import { FirebaseService } from '../../firebase/firebase.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private firebaseService: FirebaseService,
    ) {}

    async register(registerDto: RegisterDto) {
        try {
            const firestore = this.firebaseService.getFirestore();
            const auth = admin.auth(); // Firebase Admin Auth

            console.log('AuthService.register - firestore initialized?', !!firestore);

            if (!firestore) {
                throw new InternalServerErrorException('Firestore not initialized');
            }

            const usersCollection = firestore.collection('users');

            // Check if user exists in Firestore
            const userExist = await usersCollection.where('email', '==', registerDto.email).get();
            if (!userExist.empty) {
                throw new ConflictException('Email sudah terdaftar');
            }

            // Create user in Firebase Authentication
            let firebaseUser;
            try {
                firebaseUser = await auth.createUser({
                    email: registerDto.email,
                    password: registerDto.password,
                    emailVerified: false,
                });
                console.log('Firebase Auth user created:', firebaseUser.uid);
            } catch (firebaseError: any) {
                console.error('Firebase Auth creation error:', firebaseError);
                if (firebaseError.code === 'auth/email-already-exists') {
                    throw new ConflictException('Email sudah terdaftar di Firebase Auth');
                }
                throw new InternalServerErrorException('Gagal membuat user di Firebase Auth');
            }

            // Hash password for Firestore storage (backup)
            const hashPassword = await bcrypt.hash(registerDto.password, 10);

            const newUser = {
                uid: firebaseUser.uid, // Store Firebase UID
                email: registerDto.email,
                hashPassword, // Keep hashed password as backup
                nim: registerDto.nim,
                role: registerDto.role ?? Role.PRAKTIKAN,
                createdAt: new Date().toISOString(),
            };

            // Save to Firestore using Firebase UID as document ID
            await usersCollection.doc(firebaseUser.uid).set(newUser);

            const payload = { sub: firebaseUser.uid, email: newUser.email, role: newUser.role };
            const accessToken = this.jwtService.sign(payload);

            return { 
                user: { 
                    id: firebaseUser.uid, 
                    email: newUser.email, 
                    nim: newUser.nim, 
                    role: newUser.role, 
                    createdAt: newUser.createdAt 
                } 
            };
        } catch (err: any) {
            console.error('AuthService.register error:', err);
            if (err instanceof ConflictException || err instanceof InternalServerErrorException || err instanceof UnauthorizedException) {
                throw err;
            }
            throw new InternalServerErrorException(err?.message ?? 'Failed to register user');
        }
    }

    async login(loginDto: LoginDto) {
        const firestore = this.firebaseService.getFirestore();

        if (!firestore) {
            throw new InternalServerErrorException('Firestore not initialized');
        }

        const usersCollection = firestore.collection('users');

        const userExist = await usersCollection.where('email', '==', loginDto.email).get();
        if (userExist.empty) {
            throw new UnauthorizedException('Email atau password salah');
        }

        const checkPassword = await bcrypt.compare(loginDto.password, userExist.docs[0].data().hashPassword);
        if (!checkPassword) {
            throw new UnauthorizedException('Email atau password salah');
        }

        // Generate JWT token
        const payload = {
            sub: userExist.docs[0].id, 
            email: userExist.docs[0].data().email,
            role: userExist.docs[0].data().role,
        };
        const token = this.jwtService.sign(payload);
        
        return { accessToken: token, user: {
            id: userExist.docs[0].id,
            email: userExist.docs[0].data().email,
            nim: userExist.docs[0].data().nim,
            role: userExist.docs[0].data().role,    
        }
        };
    }
}