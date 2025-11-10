import mongoose from 'mongoose';
import User from '../../server/models/User.js';

describe('User Model Tests', () => {
  let testCount = 0;
  const getUniqueEmail = () => `test${++testCount}@example.com`;

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
    await User.deleteMany({});
  });

  describe('Basic User Validation', () => {
    it('should create a valid user', async () => {
      const user = await User.create(validUserData);
      expect(user._id).toBeDefined();
      expect(user.email).toBe(validUserData.email);
    });

    it('should fail when email is invalid', async () => {
      const userData = {
        ...validUserData,
        email: 'invalid-email'
      };

      let error;
      try {
        await User.create(userData);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.email).toBeDefined();
    });

    it('should fail when required fields are missing', async () => {
      const userData = {
        email: getUniqueEmail()
      };

      let error;
      try {
        await User.create(userData);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.firstName).toBeDefined();
      expect(error.errors.lastName).toBeDefined();
      expect(error.errors.passwordHash).toBeDefined();
    });

    it('should fail for users under 18', async () => {
      const userData = {
        ...validUserData,
        email: getUniqueEmail(),
        birthDate: new Date(Date.now() - (17 * 365 * 24 * 60 * 60 * 1000))
      };

      let error;
      try {
        await User.create(userData);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.birthDate).toBeDefined();
    });
  });

  describe('Passport Validation', () => {
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
      expect(error.errors['passport.number']).toBeDefined();
    });

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
  });

  describe('Role Management', () => {
    it('should create a user with valid default role', async () => {
      const user = await User.create({
        ...validUserData,
        email: getUniqueEmail()
      });
      expect(user.role).toBe('user');
    });

    it('should create an admin user', async () => {
      const user = await User.create({
        ...validUserData,
        email: getUniqueEmail(),
        role: 'admin',
        authorizationCode: 'ADMIN123'
      });
      expect(user.role).toBe('admin');
    });

    it('should create a guide with certifications', async () => {
      const user = await User.create({
        ...validUserData,
        email: getUniqueEmail(),
        role: 'guide',
        certifications: ['Tour Guide License', 'First Aid']
      });
      expect(user.role).toBe('guide');
      expect(user.certifications).toHaveLength(2);
    });

    it('should fail with invalid role', async () => {
      const userData = {
        ...validUserData,
        email: getUniqueEmail(),
        role: 'invalid_role'
      };

      let error;
      try {
        await User.create(userData);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.role).toBeDefined();
    });

    it('should fail creating guide without certifications', async () => {
      const userData = {
        ...validUserData,
        email: getUniqueEmail(),
        role: 'guide'
      };

      let error;
      try {
        await User.create(userData);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.certifications).toBeDefined();
    });

    it('should fail creating admin without authorization code', async () => {
      const userData = {
        ...validUserData,
        email: getUniqueEmail(),
        role: 'admin'
      };

      let error;
      try {
        await User.create(userData);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.authorizationCode).toBeDefined();
    });
  });

  describe('Role-based Permissions', () => {
    it('admin should have all permissions', async () => {
      const user = await User.create({
        ...validUserData,
        email: getUniqueEmail(),
        role: 'admin',
        authorizationCode: 'ADMIN123'
      });

      expect(user.hasPermission('manage_users')).toBe(true);
      expect(user.hasPermission('view_reports')).toBe(true);
      expect(user.hasPermission('edit_content')).toBe(true);
      expect(user.hasPermission('manage_tours')).toBe(true);
    });

    it('guide should have specific permissions', async () => {
      const user = await User.create({
        ...validUserData,
        email: getUniqueEmail(),
        role: 'guide',
        certifications: ['Tour Guide License']
      });

      expect(user.hasPermission('manage_tours')).toBe(true);
      expect(user.hasPermission('view_participants')).toBe(true);
      expect(user.hasPermission('manage_users')).toBe(false);
    });

    it('regular user should have limited permissions', async () => {
      const user = await User.create({
        ...validUserData,
        email: getUniqueEmail(),
        role: 'user'
      });

      expect(user.hasPermission('view_content')).toBe(true);
      expect(user.hasPermission('edit_profile')).toBe(true);
      expect(user.hasPermission('manage_users')).toBe(false);
    });

    it('super_admin should have all permissions', async () => {
      const user = await User.create({
        ...validUserData,
        email: getUniqueEmail(),
        role: 'super_admin'
      });

      expect(user.hasPermission('anything')).toBe(true);
      expect(user.hasPermission('everything')).toBe(true);
    });
  });

  describe('Custom Methods', () => {
    describe('getFullName()', () => {
      it('should return correctly formatted full name', async () => {
        const user = await User.create({
          ...validUserData,
          firstName: 'John',
          lastName: 'Doe',
          email: getUniqueEmail()
        });
        expect(user.getFullName()).toBe('John Doe');
      });

      it('should handle names with spaces', async () => {
        const user = await User.create({
          ...validUserData,
          firstName: 'Mary Jane',
          lastName: 'Smith Wilson',
          email: getUniqueEmail()
        });
        expect(user.getFullName()).toBe('Mary Jane Smith Wilson');
      });

      it('should handle names with special characters', async () => {
        const user = await User.create({
          ...validUserData,
          firstName: 'José',
          lastName: "O'Connor",
          email: getUniqueEmail()
        });
        expect(user.getFullName()).toBe('José O\'Connor');
      });
    });

    describe('findByGroup() [Static Method]', () => {
      beforeEach(async () => {
        // Crea alcuni utenti di test con gruppi diversi
        await User.create({
          ...validUserData,
          email: getUniqueEmail(),
          groupName: 'Group1',
          firstName: 'User1'
        });
        await User.create({
          ...validUserData,
          email: getUniqueEmail(),
          groupName: 'Group1',
          firstName: 'User2'
        });
        await User.create({
          ...validUserData,
          email: getUniqueEmail(),
          groupName: 'Group2',
          firstName: 'User3'
        });
      });

      it('should find all users in a specific group', async () => {
        const group1Users = await User.findByGroup('Group1');
        expect(group1Users).toHaveLength(2);
        expect(group1Users.every(user => user.groupName === 'Group1')).toBe(true);
      });

      it('should return empty array for non-existent group', async () => {
        const nonExistentGroupUsers = await User.findByGroup('NonExistentGroup');
        expect(nonExistentGroupUsers).toHaveLength(0);
      });

      it('should return users with all their properties', async () => {
        const group1Users = await User.findByGroup('Group1');
        const user = group1Users[0];
        
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('firstName');
        expect(user).toHaveProperty('lastName');
        expect(user).toHaveProperty('groupName', 'Group1');
      });

      it('should handle case-sensitive group names', async () => {
        const group1Users = await User.findByGroup('GROUP1');
        expect(group1Users).toHaveLength(0); // Dovrebbe essere case-sensitive
      });
    });

    describe('Role Identification Methods', () => {
      it('should correctly identify admin role', async () => {
        const user = await User.create({
          ...validUserData,
          email: getUniqueEmail(),
          role: 'admin',
          authorizationCode: 'ADMIN123'
        });
        expect(user.isAdmin()).toBe(true);
      });

      it('should correctly identify guide role', async () => {
        const user = await User.create({
          ...validUserData,
          email: getUniqueEmail(),
          role: 'guide',
          certifications: ['Tour Guide License']
        });
        expect(user.isGuide()).toBe(true);
      });

      it('should correctly identify regular user role', async () => {
        const user = await User.create({
          ...validUserData,
          email: getUniqueEmail(),
          role: 'user'
        });
        expect(user.isAdmin()).toBe(false);
        expect(user.isGuide()).toBe(false);
      });
    });
  });
});