/*eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts'; // assuming you have a function to show alerts
const stripe = Stripe(
  'pk_test_51NwENrG2DlmKh6ZVYQyccLROiUyoiMf73jTF0LOQBCjp5zed7Mxd0BxRQp8WgE8dT0FODln50sgSROiU1oxmOLW1003BohHLs2',
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);

    // 2) Create checkout form + charge credit card

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
    switch (err.type) {
      case 'StripeCardError':
        console.log(`A payment error occurred: ${err.message}`);
        break;
      case 'StripeInvalidRequestError':
        console.log('An invalid request occurred.');
        break;
      default:
        console.log('Another problem occurred, maybe unrelated to Stripe.');
        break;
    }
  }
};
