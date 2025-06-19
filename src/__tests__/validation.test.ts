import { validateCreditCard, validateDeliveryInfo } from '../utils/validation';
import { CreditCard, DeliveryInfo } from '../types/types';

describe('validateCreditCard', () => {
  test('validates valid credit card data', () => {
    const validCard: CreditCard = {
      number: '4111 1111 1111 1111',
      name: 'John Doe',
      expiry: '12/25',
      cvc: '123'
    };
    
    const errors = validateCreditCard(validCard);
    expect(errors).toHaveLength(0);
  });
  
  test('validates invalid card number', () => {
    const invalidCard: CreditCard = {
      number: '4111 1111 1111', // Too short
      name: 'John Doe',
      expiry: '12/25',
      cvc: '123'
    };
    
    const errors = validateCreditCard(invalidCard);
    expect(errors.some(e => e.field === 'number')).toBe(true);
  });
  
  test('validates invalid card holder name', () => {
    const invalidCard: CreditCard = {
      number: '4111 1111 1111 1111',
      name: '', // Empty
      expiry: '12/25',
      cvc: '123'
    };
    
    const errors = validateCreditCard(invalidCard);
    expect(errors.some(e => e.field === 'name')).toBe(true);
  });
  
  test('validates invalid expiry date format', () => {
    const invalidCard: CreditCard = {
      number: '4111 1111 1111 1111',
      name: 'John Doe',
      expiry: '1225', // Wrong format
      cvc: '123'
    };
    
    const errors = validateCreditCard(invalidCard);
    expect(errors.some(e => e.field === 'expiry')).toBe(true);
  });
  
  test('validates expired card', () => {
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 1);
    const month = String(pastDate.getMonth() + 1).padStart(2, '0');
    const year = String(pastDate.getFullYear()).slice(-2);
    
    const expiredCard: CreditCard = {
      number: '4111 1111 1111 1111',
      name: 'John Doe',
      expiry: `${month}/${year}`,
      cvc: '123'
    };
    
    const errors = validateCreditCard(expiredCard);
    expect(errors.some(e => e.field === 'expiry')).toBe(true);
  });
  
  test('validates invalid CVC', () => {
    const invalidCard: CreditCard = {
      number: '4111 1111 1111 1111',
      name: 'John Doe',
      expiry: '12/25',
      cvc: '12' // Too short
    };
    
    const errors = validateCreditCard(invalidCard);
    expect(errors.some(e => e.field === 'cvc')).toBe(true);
  });
});

describe('validateDeliveryInfo', () => {
  test('validates valid delivery info', () => {
    const validDelivery: DeliveryInfo = {
      fullName: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      zipCode: '10001',
      phone: '1234567890',
      email: 'john@example.com'
    };
    
    const errors = validateDeliveryInfo(validDelivery);
    expect(errors).toHaveLength(0);
  });
  
  test('validates invalid full name', () => {
    const invalidDelivery: DeliveryInfo = {
      fullName: '', // Empty
      address: '123 Main St',
      city: 'New York',
      zipCode: '10001',
      phone: '1234567890',
      email: 'john@example.com'
    };
    
    const errors = validateDeliveryInfo(invalidDelivery);
    expect(errors.some(e => e.field === 'fullName')).toBe(true);
  });
  
  test('validates invalid address', () => {
    const invalidDelivery: DeliveryInfo = {
      fullName: 'John Doe',
      address: '123', // Too short
      city: 'New York',
      zipCode: '10001',
      phone: '1234567890',
      email: 'john@example.com'
    };
    
    const errors = validateDeliveryInfo(invalidDelivery);
    expect(errors.some(e => e.field === 'address')).toBe(true);
  });
  
  test('validates invalid city', () => {
    const invalidDelivery: DeliveryInfo = {
      fullName: 'John Doe',
      address: '123 Main St',
      city: '', // Empty
      zipCode: '10001',
      phone: '1234567890',
      email: 'john@example.com'
    };
    
    const errors = validateDeliveryInfo(invalidDelivery);
    expect(errors.some(e => e.field === 'city')).toBe(true);
  });
  
  test('validates invalid zip code', () => {
    const invalidDelivery: DeliveryInfo = {
      fullName: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      zipCode: '123', // Too short
      phone: '1234567890',
      email: 'john@example.com'
    };
    
    const errors = validateDeliveryInfo(invalidDelivery);
    expect(errors.some(e => e.field === 'zipCode')).toBe(true);
  });
  
  test('validates invalid phone', () => {
    const invalidDelivery: DeliveryInfo = {
      fullName: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      zipCode: '10001',
      phone: '123', // Too short
      email: 'john@example.com'
    };
    
    const errors = validateDeliveryInfo(invalidDelivery);
    expect(errors.some(e => e.field === 'phone')).toBe(true);
  });
  
  test('validates invalid email', () => {
    const invalidDelivery: DeliveryInfo = {
      fullName: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      zipCode: '10001',
      phone: '1234567890',
      email: 'invalid-email' // Invalid format
    };
    
    const errors = validateDeliveryInfo(invalidDelivery);
    expect(errors.some(e => e.field === 'email')).toBe(true);
  });
});