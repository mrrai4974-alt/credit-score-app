import { api } from './api';

interface Order {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  bookingId: string;
  mock: boolean;
}

interface Verified {
  ok: boolean;
  booking: unknown;
}

interface CheckoutResult {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/**
 * Open Razorpay Checkout and resolve with the payment result.
 * Uses the web checkout (window.Razorpay) when present. On native, integrate
 * `react-native-razorpay` here (needs a custom dev client, not Expo Go).
 */
function openCheckout(order: Order): Promise<CheckoutResult> {
  const RZP = (globalThis as { Razorpay?: new (opts: unknown) => { open: () => void } }).Razorpay;
  if (!RZP) {
    return Promise.reject(
      new Error(
        'Razorpay Checkout is not available in this build. Load the web checkout script, or integrate react-native-razorpay for native.',
      ),
    );
  }
  return new Promise((resolve, reject) => {
    const rzp = new RZP({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency,
      name: 'Doorstep Bike Service',
      description: 'Doorstep two-wheeler service',
      handler: (resp: CheckoutResult) =>
        resolve({
          razorpay_order_id: resp.razorpay_order_id,
          razorpay_payment_id: resp.razorpay_payment_id,
          razorpay_signature: resp.razorpay_signature,
        }),
      modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
    });
    rzp.open();
  });
}

/** Full pay flow: create an order, complete checkout, verify on the server. */
export async function payForBooking(bookingId: string): Promise<Verified> {
  const order = await api.post<Order>('/payments/order', { bookingId });

  let checkout: CheckoutResult;
  if (order.mock) {
    // No Razorpay keys configured on the backend — accept in mock mode so the
    // flow is demonstrable end-to-end without credentials.
    checkout = {
      razorpay_order_id: order.orderId,
      razorpay_payment_id: 'pay_mock_' + Date.now(),
      razorpay_signature: 'mock',
    };
  } else {
    checkout = await openCheckout(order);
  }

  return api.post<Verified>('/payments/verify', { bookingId, ...checkout });
}
