import mongoose from 'mongoose';
import User from '../../server/models/User.js';

describe('User Passport Validation Tests', () => {
  let testCount = 0;
  const getUniqueEmail = () => `passport.test${++testCount}@example.com`;
  
  const validUserData = {
    email: getUniqueEmail(),
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

  it('should fail validation when passport expiry date is before issue date', async () => {
    const userData = {
      ...validUserData,
      passport: {
        number: 'AB123456',
        issueDate: new Date('2023-01-01'),
        expiryDate: new Date('2022-01-01') // Data di scadenza precedente alla data di emissione
      }
    };

    let error;
    try {
      await User.create(userData);
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors['passport.expiryDate'].message)
      .toBe('Passport expiry date must be after issue date');
  });

  it('should fail validation when passport is expired', async () => {
    const userData = {
      ...validUserData,
      passport: {
        number: 'AB123456',
        issueDate: new Date('2020-01-01'),
        expiryDate: new Date('2024-01-01') // Data già passata rispetto alla data corrente (2025)
      }
    };

    const user = await User.create(userData);
    expect(user.isPassportValid()).toBe(false);
  });

  it('should pass validation with valid passport dates', async () => {
    const userData = {
      ...validUserData,
      email: getUniqueEmail(),
      passport: {
        number: 'AB123456',
        issueDate: new Date('2024-01-01'),
        expiryDate: new Date('2029-01-01') // Data futura valida
      }
    };

    const user = await User.create(userData);
    expect(user.isPassportValid()).toBe(true);
  });

  it('should fail validation when passport number is missing', async () => {
    const userData = {
      ...validUserData,
      passport: {
        issueDate: new Date('2024-01-01'),
        expiryDate: new Date('2029-01-01')
      }
    };

    let error;
    try {
      await User.create(userData);
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors['passport.number']).toBeDefined();
  });

  it('should fail validation when passport dates are missing', async () => {
    const userData = {
      ...validUserData,
      passport: {
        number: 'AB123456'
        // Date mancanti
      }
    };

    let error;
    try {
      await User.create(userData);
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors['passport.issueDate']).toBeDefined();
    expect(error.errors['passport.expiryDate']).toBeDefined();
  });
});