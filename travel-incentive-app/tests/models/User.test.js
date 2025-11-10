import mongoose from 'mongoose';
import User from '../../server/models/User.js';

describe('User Model Test', () => {
  jest.setTimeout(30000); // Aumenta il timeout a 30 secondi

  beforeAll(async () => {
    // Assicurati che gli indici siano creati
    await User.createIndexes();
  });
  it('should create & save user successfully', async () => {
    const validUser = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      passwordHash: 'hashedPassword123',
      groupName: 'Group1',
      role: 'user',
      birthDate: new Date('1990-01-01'),
      nationality: 'IT',
      passport: {
        number: 'AB123456',
        issueDate: new Date('2020-01-01'),
        expiryDate: new Date('2025-01-01')
      }
    };

    const savedUser = await User.create(validUser);
    
    // Verifica che l'utente sia stato salvato correttamente
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(validUser.email);
    expect(savedUser.firstName).toBe(validUser.firstName);
    expect(savedUser.lastName).toBe(validUser.lastName);
  });

  it('should fail to save user without required fields', async () => {
    const userWithoutRequiredField = new User({ email: 'test@example.com' });
    let err;
    
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    
    expect(err.name).toBe('ValidationError');
  });

  it('should fail to save user with invalid email', async () => {
    const userWithInvalidEmail = {
      email: 'invalid-email',
      firstName: 'John',
      lastName: 'Doe',
      passwordHash: 'hashedPassword123',
      groupName: 'Group1',
      role: 'user',
      birthDate: new Date('1990-01-01'),
      nationality: 'IT',
      passport: {
        number: 'AB123456',
        issueDate: new Date('2020-01-01'),
        expiryDate: new Date('2025-01-01')
      }
    };

    let err;
    try {
      await User.create(userWithInvalidEmail);
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeDefined();
    expect(err.errors.email).toBeDefined();
  });

  it('should enforce unique email constraint', async () => {
    const baseUserData = {
      firstName: 'John',
      lastName: 'Doe',
      passwordHash: 'hashedPassword123',
      groupName: 'Group1',
      role: 'user',
      birthDate: new Date('1990-01-01'),
      nationality: 'IT',
      passport: {
        number: 'AB123456',
        issueDate: new Date('2020-01-01'),
        expiryDate: new Date('2025-01-01')
      }
    };

    // Primo utente
    const user1 = await User.create({
      ...baseUserData,
      email: 'unique@example.com'
    });

    expect(user1.email).toBe('unique@example.com');
    
    // Tentativo di creare un secondo utente con la stessa email
    let error;
    try {
      await User.create({
        ...baseUserData,
        email: 'unique@example.com'
      });
    } catch (err) {
      error = err;
    }
    
    expect(error).toBeDefined();
    expect(error.code).toBe(11000); // MongoDB duplicate key error code
  });
});