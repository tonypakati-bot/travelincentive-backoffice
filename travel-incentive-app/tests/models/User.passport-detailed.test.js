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
      expiryDate: new Date('2030-01-01')
    }
  };

  beforeEach(async () => {
    // Pulisci il database prima di ogni test
    await User.deleteMany({});
  });

  describe('Basic Passport Validation', () => {
    it('should validate a passport with valid dates', async () => {
      const user = await User.create({
        ...validUserData,
        email: getUniqueEmail()
      });

      expect(user.passport.number).toBe('AB123456');
      expect(user.passport.issueDate).toBeInstanceOf(Date);
      expect(user.passport.expiryDate).toBeInstanceOf(Date);
    });

    it('should fail validation when passport number is missing', async () => {
      const userData = {
        ...validUserData,
        email: getUniqueEmail(),
        passport: {
          issueDate: new Date('2020-01-01'),
          expiryDate: new Date('2030-01-01')
        }
      };

      let error;
      try {
        await User.create(userData);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['passport.number'].message)
        .toBe('Path `number` is required.');
    });
  });

  describe('Passport Date Validation', () => {
    it('should fail validation when expiry date is before issue date', async () => {
      const userData = {
        ...validUserData,
        email: getUniqueEmail(),
        passport: {
          number: 'AB123456',
          issueDate: new Date('2023-01-01'),
          expiryDate: new Date('2022-01-01')
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

    it('should fail validation when expiry date equals issue date', async () => {
      const sameDate = new Date('2023-01-01');
      const userData = {
        ...validUserData,
        email: getUniqueEmail(),
        passport: {
          number: 'AB123456',
          issueDate: sameDate,
          expiryDate: sameDate
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

    it('should fail validation with invalid date formats', async () => {
      const userData = {
        ...validUserData,
        email: getUniqueEmail(),
        passport: {
          number: 'AB123456',
          issueDate: 'invalid-date',
          expiryDate: new Date('2030-01-01')
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
    });
  });

  describe('Passport Expiration Check', () => {
    it('should identify expired passports', async () => {
      const user = await User.create({
        ...validUserData,
        email: getUniqueEmail(),
        passport: {
          number: 'AB123456',
          issueDate: new Date('2020-01-01'),
          expiryDate: new Date('2024-01-01') // Data passata rispetto al 2025
        }
      });

      expect(user.isPassportValid()).toBe(false);
    });

    it('should identify valid passports', async () => {
      const user = await User.create({
        ...validUserData,
        email: getUniqueEmail(),
        passport: {
          number: 'AB123456',
          issueDate: new Date('2020-01-01'),
          expiryDate: new Date('2026-01-01') // Data futura rispetto al 2025
        }
      });

      expect(user.isPassportValid()).toBe(true);
    });

    it('should identify passports expiring today as valid', async () => {
      const today = new Date();
      const user = await User.create({
        ...validUserData,
        email: getUniqueEmail(),
        passport: {
          number: 'AB123456',
          issueDate: new Date('2020-01-01'),
          expiryDate: today
        }
      });

      expect(user.isPassportValid()).toBe(false);
    });
  });

  describe('Passport Updates', () => {
    it('should allow updating passport details', async () => {
      const user = await User.create({
        ...validUserData,
        email: getUniqueEmail()
      });

      user.passport.number = 'CD789012';
      user.passport.issueDate = new Date('2024-01-01');
      user.passport.expiryDate = new Date('2034-01-01');

      await user.save();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.passport.number).toBe('CD789012');
      expect(updatedUser.passport.issueDate.getFullYear()).toBe(2024);
      expect(updatedUser.passport.expiryDate.getFullYear()).toBe(2034);
    });

    it('should fail when updating with invalid dates', async () => {
      const user = await User.create({
        ...validUserData,
        email: getUniqueEmail()
      });

      user.passport.issueDate = new Date('2024-01-01');
      user.passport.expiryDate = new Date('2023-01-01');

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors['passport.expiryDate'].message)
        .toBe('Passport expiry date must be after issue date');
    });
  });
});