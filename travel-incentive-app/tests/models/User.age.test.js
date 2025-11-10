import mongoose from 'mongoose';
import User from '../../server/models/User.js';

describe('User Age Validation Tests', () => {
  let testCount = 0;
  const getUniqueEmail = () => `age.test${++testCount}@example.com`;

  const validUserData = {
    email: getUniqueEmail(),
    firstName: 'John',
    lastName: 'Doe',
    passwordHash: 'hashedPassword123',
    groupName: 'Group1',
    role: 'user',
    nationality: 'IT',
    passport: {
      number: 'AB123456',
      issueDate: new Date('2020-01-01'),
      expiryDate: new Date('2025-01-01')
    }
  };

  it('should fail validation for users under 18', async () => {
    const userData = {
      ...validUserData,
      birthDate: new Date('2010-01-01') // 15 anni nel 2025
    };

    let error;
    try {
      await User.create(userData);
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.birthDate.message).toBe('User must be at least 18 years old');
  });

  it('should pass validation for users exactly 18 years old', async () => {
    const userData = {
      ...validUserData,
      birthDate: new Date('2007-11-07') // 18 anni esatti oggi (7 novembre 2025)
    };

    const user = await User.create(userData);
    expect(user.birthDate).toBeDefined();
    expect(user.birthDate.getFullYear()).toBe(2007);
  });

  it('should fail validation for future birth dates', async () => {
    const userData = {
      ...validUserData,
      birthDate: new Date('2026-01-01') // Data futura
    };

    let error;
    try {
      await User.create(userData);
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.birthDate.message).toBe('User must be at least 18 years old');
  });

  it('should pass validation for users over 18', async () => {
    const userData = {
      ...validUserData,
      email: getUniqueEmail(),
      birthDate: new Date('1990-01-01') // 35 anni nel 2025
    };

    const user = await User.create(userData);
    expect(user.birthDate).toBeDefined();
    expect(user.birthDate.getFullYear()).toBe(1990);
  });
});