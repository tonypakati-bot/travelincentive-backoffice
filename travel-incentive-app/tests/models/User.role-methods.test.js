import mongoose from 'mongoose';
import User from '../../server/models/User.js';

describe('User Role and Methods Tests', () => {
  const validUserData = {
    email: 'role.test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    passwordHash: 'hashedPassword123',
    groupName: 'Group1',
    birthDate: new Date('1990-01-01'),
    nationality: 'IT',
    passport: {
      number: 'AB123456',
      issueDate: new Date('2020-01-01'),
      expiryDate: new Date('2025-01-01')
    }
  };

  // Test validazione ruoli
  describe('Role Validation', () => {
    it('should pass validation with valid role: user', async () => {
      const userData = { ...validUserData, role: 'user' };
      const user = await User.create(userData);
      expect(user.role).toBe('user');
    });

    it('should pass validation with valid role: admin', async () => {
      const userData = { ...validUserData, role: 'admin', email: 'admin@example.com' };
      const user = await User.create(userData);
      expect(user.role).toBe('admin');
    });

    it('should pass validation with valid role: super_admin', async () => {
      const userData = { ...validUserData, role: 'super_admin', email: 'super@example.com' };
      const user = await User.create(userData);
      expect(user.role).toBe('super_admin');
    });

    it('should fail validation with invalid role', async () => {
      const userData = { ...validUserData, role: 'invalid_role' };
      
      let error;
      try {
        await User.create(userData);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.role).toBeDefined();
    });
  });

  // Test metodi custom
  describe('Custom Methods', () => {
    it('should correctly return full name', async () => {
      const user = await User.create({
        ...validUserData,
        role: 'user',
        email: 'fullname@example.com'
      });
      expect(user.getFullName()).toBe('John Doe');
    });

    it('should find users by group', async () => {
      // Pulisci il database prima del test
      await User.deleteMany({});
      
      // Crea alcuni utenti di test con gruppi diversi
      await User.create({
        ...validUserData,
        role: 'user',
        email: 'group1.1@example.com'
      }); // Group1
      await User.create({
        ...validUserData,
        role: 'user',
        email: 'group2@example.com',
        groupName: 'Group2'
      });
      await User.create({
        ...validUserData,
        role: 'user',
        email: 'group1.2@example.com',
        groupName: 'Group1'
      });

      const group1Users = await User.findByGroup('Group1');
      expect(group1Users).toHaveLength(2);
      expect(group1Users.every(user => user.groupName === 'Group1')).toBe(true);

      const group2Users = await User.findByGroup('Group2');
      expect(group2Users).toHaveLength(1);
      expect(group2Users[0].groupName).toBe('Group2');
    });
  });
});