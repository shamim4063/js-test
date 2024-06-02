import { trackPageView } from "./lib/analytics";
import { getExchangeRate } from "./lib/currency";
import { sendEmail, validateEmail } from "./lib/email";
import { charge } from "./lib/payment";
import security from "./lib/security";
import { getShippingQuote } from "./lib/shipping";

export const getPriceInCurrency = (price, currency) => {
  const rate = getExchangeRate("USD", currency);
  return rate * price;
};

export const getShippingInfo = (destination) => {
  const quote = getShippingQuote(destination);
  if (!quote) return "Shipping Unavailable";
  return `Shipping Cost $${quote.cost} ${quote.estimatedDay} Days.`;
};

export const renderPage = () => {
  trackPageView("/home");

  return `<div>home content</div>`;
};

export const submitOrder = async (cardInformation, order) => {
  const paymentOutput = await charge(cardInformation, order.totalAmount);
  if (paymentOutput.status === "failed")
    return { success: false, error: "payment_error" };
  return { success: true };
};

export const signUp = async (email) => {
  if (!validateEmail(email)) return false;
  await sendEmail(email, "Welcome aboard!");
  return true;
};

export const login = async (email) => {
  const code = security.generateCode();
  await sendEmail(email, code);
};
