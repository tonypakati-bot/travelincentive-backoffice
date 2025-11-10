import mongoose from 'mongoose';
import User from '../../server/models/User.js';

describe('User Role Validation Tests', () => {
  let testCount = 0;
  const getUniqueEmail = () => `role.test${++testCount}@example.com`;

  const validUserData = {
    email: getUniqueEmail(),
    firstName: 'John',
    lastName: 'Doe',
    passwordHash: 'hashedPassword123',
    groupName: 'Group1',
    role: 'user',
    birthDate: new Date('1990-01-01'),
    nationality: 'IT'
  };

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('Role Assignment', () => {
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
      expect(error.errors.role.message).toContain('is not a valid enum value');
    });
  });

  describe('Role Permissions', () => {
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

    it('guide should have specific permissions', async () => {
      const user = await User.create({
        ...validUserData,
        email: getUniqueEmail(),
        role: 'guide',
        certifications: ['Tour Guide License', 'First Aid'],
        languages: ['English', 'Italian'],
        yearsOfExperience: 5,
        specializations: ['Art History', 'Architecture'],
        licenseNumber: 'GT123456'
      });

      expect(user.hasPermission('manage_tours')).toBe(true);
      expect(user.hasPermission('view_participants')).toBe(true);
      expect(user.hasPermission('manage_users')).toBe(false);
    });
  });

  describe('Role Updates', () => {
    it('should allow updating role to valid value', async () => {
      const user = await User.create({
        ...validUserData,
        email: getUniqueEmail()
      });

      user.role = 'guide';
      await user.save();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.role).toBe('guide');
    });

    it('should fail updating to invalid role', async () => {
      const user = await User.create({
        ...validUserData,
        email: getUniqueEmail()
      });

      user.role = 'invalid_role';
      
      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.role).toBeDefined();
    });
  });

  describe('Role-based Methods', () => {
    it('should correctly identify admin role', async () => {
      const user = await User.create({
        ...validUserData,
        email: getUniqueEmail(),
        role: 'admin',
        authorizationCode: 'ADMIN123'
      });

      expect(user.isAdmin()).toBe(true);
      expect(user.isGuide()).toBe(false);
    });

    it('should correctly identify guide role', async () => {
      const user = await User.create({
        ...validUserData,
        email: getUniqueEmail(),
        role: 'guide',
        certifications: ['Tour Guide License'],
        languages: ['English'],
        yearsOfExperience: 3,
        specializations: ['Cultural Heritage'],
        licenseNumber: 'GT789012'
      });

      expect(user.isGuide()).toBe(true);
      expect(user.isAdmin()).toBe(false);
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

  describe('Role-specific Validations', () => {
    it('guide should require additional fields', async () => {
      const userData = {
        ...validUserData,
        email: getUniqueEmail(),
        role: 'guide'
      };

      let error;
      try {
        const user = new User(userData);
        await user.validate();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.certifications).toBeDefined();
      expect(error.errors.certifications.message).toBe('Certifications are required for guide role');
    });

    it('admin should require special authorization code', async () => {
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

      // Assuming admins require an authorization code
      expect(error).toBeDefined();
      expect(error.errors.authorizationCode).toBeDefined();
    });
  });
});