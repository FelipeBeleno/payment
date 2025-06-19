import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PaymentModal from '../components/PaymentModal';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom';
import { PaymentSummary, Product } from '../types/types';

// Mock de axios
jest.mock('../utils/axiosConfig', () => ({
  post: jest.fn().mockResolvedValue({
    data: {
      data: { id: 'test-token-123' },
      status: true
    }
  })
}));

// Mock de los componentes hijos
jest.mock('../components/CreditCardForm', () => {
  return function DummyCreditCardForm({ onSubmit }: any) {
    return (
      <div data-testid="credit-card-form">
        <button onClick={() => onSubmit({
          number: '4111 1111 1111 1111',
          name: 'TEST USER',
          expiry: '12/25',
          cvc: '123'
        })}>
          Submit Card
        </button>
      </div>
    );
  };
});

jest.mock('../components/DeliveryForm', () => {
  return function DummyDeliveryForm({ onSubmit, onBack }: any) {
    return (
      <div data-testid="delivery-form">
        <button onClick={() => onBack()}>Go Back</button>
        <button onClick={() => onSubmit({
          fullName: 'Test User',
          address: 'Test Address',
          city: 'Test City',
          zipCode: '12345',
          phone: '1234567890',
          email: 'test@example.com'
        })}>
          Submit Delivery
        </button>
      </div>
    );
  };
});

jest.mock('../components/PaymentSummary', () => {
  return function DummyPaymentSummary({ onPayment, onBack }: any) {
    return (
      <div data-testid="payment-summary">
        <button onClick={() => onBack()}>Go Back</button>
        <button onClick={() => onPayment()}>Complete Payment</button>
      </div>
    );
  };
});

describe('PaymentModal', () => {
  const mockStore = configureStore([]);
  const initialState = {
    paymentData: {
      deviceId: 'test-device',
      sesionId: 'test-session',
      tokenId: ''
    },
    statusTransaction: {
      status: '',
      orderId: ''
    }
  };
  
  const store = mockStore(initialState);
  
  const mockOnClose = jest.fn();
  const mockOnPaymentComplete = jest.fn();
  
  const mockProduct: Product = {
    _id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    stock: 10,
    imageUrl: 'test.jpg'
  };
  
  const mockPaymentSummary: PaymentSummary = {
    productQuantity: 1,
    productPrice: 100,
    total: 108.5
  };
  
  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnPaymentComplete.mockClear();
    store.clearActions();
  });

  test('renders payment modal with initial card step', () => {
    render(
      <Provider store={store}>
        <PaymentModal 
          onClose={mockOnClose} 
          paymentSummary={mockPaymentSummary}
          onPaymentComplete={mockOnPaymentComplete}
          product={mockProduct}
        />
      </Provider>
    );
    
    expect(screen.getByText(/información de pago/i)).toBeInTheDocument();
    expect(screen.getByTestId('credit-card-form')).toBeInTheDocument();
  });

  test('navigates through payment steps', async () => {
    render(
      <Provider store={store}>
        <PaymentModal 
          onClose={mockOnClose} 
          paymentSummary={mockPaymentSummary}
          onPaymentComplete={mockOnPaymentComplete}
          product={mockProduct}
        />
      </Provider>
    );
    
    // Step 1: Credit Card Form
    expect(screen.getByTestId('credit-card-form')).toBeInTheDocument();
    
    // Submit card form
    fireEvent.click(screen.getByText('Submit Card'));
    
    // Wait for transition to delivery form
    await waitFor(() => {
      expect(screen.getByTestId('delivery-form')).toBeInTheDocument();
    });
    
    // Step 2: Delivery Form
    expect(screen.getByText(/información de entrega/i)).toBeInTheDocument();
    
    // Submit delivery form
    fireEvent.click(screen.getByText('Submit Delivery'));
    
    // Wait for transition to payment summary
    await waitFor(() => {
      expect(screen.getByTestId('payment-summary')).toBeInTheDocument();
    });
    
    // Step 3: Payment Summary
    expect(screen.getByText(/resumen de pago/i)).toBeInTheDocument();
    
    // Complete payment
    fireEvent.click(screen.getByText('Complete Payment'));
    
    // Verify payment completion callback was called
    await waitFor(() => {
      expect(mockOnPaymentComplete).toHaveBeenCalledWith(true);
    });
  });

  test('handles back navigation between steps', async () => {
    render(
      <Provider store={store}>
        <PaymentModal 
          onClose={mockOnClose} 
          paymentSummary={mockPaymentSummary}
          onPaymentComplete={mockOnPaymentComplete}
          product={mockProduct}
        />
      </Provider>
    );
    
    // Navigate to delivery form
    fireEvent.click(screen.getByText('Submit Card'));
    
    await waitFor(() => {
      expect(screen.getByTestId('delivery-form')).toBeInTheDocument();
    });
    
    // Go back to card form
    fireEvent.click(screen.getByText('Go Back'));
    
    await waitFor(() => {
      expect(screen.getByTestId('credit-card-form')).toBeInTheDocument();
    });
    
    // Navigate to delivery form again
    fireEvent.click(screen.getByText('Submit Card'));
    
    await waitFor(() => {
      expect(screen.getByTestId('delivery-form')).toBeInTheDocument();
    });
    
    // Navigate to payment summary
    fireEvent.click(screen.getByText('Submit Delivery'));
    
    await waitFor(() => {
      expect(screen.getByTestId('payment-summary')).toBeInTheDocument();
    });
    
    // Go back to delivery form
    fireEvent.click(screen.getByText('Go Back'));
    
    await waitFor(() => {
      expect(screen.getByTestId('delivery-form')).toBeInTheDocument();
    });
  });

  test('closes modal when close button is clicked', () => {
    render(
      <Provider store={store}>
        <PaymentModal 
          onClose={mockOnClose} 
          paymentSummary={mockPaymentSummary}
          onPaymentComplete={mockOnPaymentComplete}
          product={mockProduct}
        />
      </Provider>
    );
    
    fireEvent.click(screen.getByRole('button', { name: '' })); // Close button has no text
    expect(mockOnClose).toHaveBeenCalled();
  });
});