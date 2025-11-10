import mongoose from 'mongoose';
import User from '../../server/models/User.js';

describe('User Preferences Tests', () => {
  const validUserData = {
    email: 'preferences.test@example.com',
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

  it('should save user with empty preferences', async () => {
    const user = await User.create(validUserData);
    expect(user.preferences).toBeDefined();
    expect(user.preferences.size).toBe(0);
  });

  it('should save user with simple preferences', async () => {
    const userData = {
      ...validUserData,
      email: 'simple.pref@example.com',
      preferences: new Map([
        ['theme', 'dark'],
        ['language', 'it']
      ])
    };

    const user = await User.create(userData);
    expect(user.preferences.get('theme')).toBe('dark');
    expect(user.preferences.get('language')).toBe('it');
  });

  it('should save user with complex preferences', async () => {
    const userData = {
      ...validUserData,
      email: 'complex.pref@example.com',
      preferences: new Map([
        ['notifications', {
          email: true,
          push: false,
          frequency: 'daily'
        }],
        ['displaySettings', {
          fontSize: 14,
          colorScheme: 'auto'
        }]
      ])
    };

    const user = await User.create(userData);
    expect(user.preferences.get('notifications')).toEqual({
      email: true,
      push: false,
      frequency: 'daily'
    });
    expect(user.preferences.get('displaySettings')).toEqual({
      fontSize: 14,
      colorScheme: 'auto'
    });
  });

  it('should update existing preferences', async () => {
    const user = await User.create({
      ...validUserData,
      email: 'update.pref@example.com',
      preferences: new Map([
        ['theme', 'light']
      ])
    });

    user.preferences.set('theme', 'dark');
    await user.save();

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.preferences.get('theme')).toBe('dark');
  });

  it('should handle different data types in preferences', async () => {
    const userData = {
      ...validUserData,
      email: 'types.pref@example.com',
      preferences: new Map([
        ['number', 42],
        ['string', 'test'],
        ['boolean', true],
        ['array', [1, 2, 3]],
        ['object', { key: 'value' }],
        ['null', null]
      ])
    };

    const user = await User.create(userData);
    expect(user.preferences.get('number')).toBe(42);
    expect(user.preferences.get('string')).toBe('test');
    expect(user.preferences.get('boolean')).toBe(true);
    expect(user.preferences.get('array')).toEqual([1, 2, 3]);
    expect(user.preferences.get('object')).toEqual({ key: 'value' });
    expect(user.preferences.get('null')).toBeNull();
  });
});