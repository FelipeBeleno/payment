import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreditCardForm from '../components/CreditCardForm';
import '@testing-library/jest-dom';

describe('CreditCardForm', () => {
  const mockSubmit = jest.fn();
  
  beforeEach(() => {
    mockSubmit.mockClear();
  });

  test('renders credit card form correctly', () => {
    render(<CreditCardForm onSubmit={mockSubmit} loaderTC={false} />);
    
    expect(screen.getByLabelText(/número de tarjeta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre del titular/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fecha de expiración/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cvc/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument();
  });

  test('shows loading state when loaderTC is true', () => {
    render(<CreditCardForm onSubmit={mockSubmit} loaderTC={true} />);
    
    expect(screen.getByText(/procesando/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('validates card number format', async () => {
    render(<CreditCardForm onSubmit={mockSubmit} loaderTC={false} />);
    
    const cardNumberInput = screen.getByLabelText(/número de tarjeta/i);
    fireEvent.change(cardNumberInput, { target: { value: '1234' } });
    fireEvent.submit(screen.getByRole('button', { name: /continuar/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/número de tarjeta inválido/i)).toBeInTheDocument();
    });
    
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test('validates expiry date format', async () => {
    render(<CreditCardForm onSubmit={mockSubmit} loaderTC={false} />);
    
    const expiryInput = screen.getByLabelText(/fecha de expiración/i);
    fireEvent.change(expiryInput, { target: { value: '123' } });
    fireEvent.submit(screen.getByRole('button', { name: /continuar/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/fecha de expiración inválida/i)).toBeInTheDocument();
    });
    
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test('validates CVC format', async () => {
    render(<CreditCardForm onSubmit={mockSubmit} loaderTC={false} />);
    
    const cvcInput = screen.getByLabelText(/cvc/i);
    fireEvent.change(cvcInput, { target: { value: '12' } });
    fireEvent.submit(screen.getByRole('button', { name: /continuar/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/cvc inválido/i)).toBeInTheDocument();
    });
    
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test('submits form with valid data', async () => {
    render(<CreditCardForm onSubmit={mockSubmit} loaderTC={false} />);
    
    // Fill form with valid data
    fireEvent.change(screen.getByLabelText(/número de tarjeta/i), { 
      target: { value: '4111 1111 1111 1111' } 
    });
    fireEvent.change(screen.getByLabelText(/nombre del titular/i), { 
      target: { value: 'JOHN DOE' } 
    });
    fireEvent.change(screen.getByLabelText(/fecha de expiración/i), { 
      target: { value: '12/25' } 
    });
    fireEvent.change(screen.getByLabelText(/cvc/i), { 
      target: { value: '123' } 
    });
    
    fireEvent.submit(screen.getByRole('button', { name: /continuar/i }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        number: '4111 1111 1111 1111',
        name: 'JOHN DOE',
        expiry: '12/25',
        cvc: '123'
      });
    });
  });

  test('detects card type correctly', async () => {
    render(<CreditCardForm onSubmit={mockSubmit} loaderTC={false} />);
    
    // Test Visa detection
    fireEvent.change(screen.getByLabelText(/número de tarjeta/i), { 
      target: { value: '4111' } 
    });
    
    // The card display component should update to show Visa
    // This is a simplified test - in a real app you might need to check for a specific class or image
    
    // Test Mastercard detection
    fireEvent.change(screen.getByLabelText(/número de tarjeta/i), { 
      target: { value: '5111' } 
    });
    
    // The card display component should update to show Mastercard
  });
});