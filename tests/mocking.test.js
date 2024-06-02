import { describe, expect, it, vi } from "vitest";
import { trackPageView } from "../src/lib/analytics";
import { getExchangeRate } from "../src/lib/currency";
import { sendEmail } from "../src/lib/email";
import { charge } from "../src/lib/payment";
import security from "../src/lib/security";
import { getShippingQuote } from "../src/lib/shipping";
import {
  getPriceInCurrency,
  getShippingInfo,
  renderPage,
  signUp,
  submitOrder,
  login,
} from "../src/mocking";

vi.mock("../src/lib/currency");
vi.mock("../src/lib/shipping");
vi.mock("../src/lib/analytics");
vi.mock("../src/lib/payment");
vi.mock("../src/lib/email", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    sendEmail: vi.fn(),
  };
});

describe("getPriceInCurrency", () => {
  it("should return price in target currency", () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5);

    const price = getPriceInCurrency(10, "AUD");

    expect(price).toBe(15);
  });
});

describe("getShippingInfo", () => {
  it("should return correct shipping info for cumilla", () => {
    vi.mocked(getShippingQuote).mockReturnValue({ cost: 3.2, estimatedDay: 2 });
    const shippingInfo = getShippingInfo("Cumilla");

    expect(shippingInfo).toMatch("$3.2");
    expect(shippingInfo).toMatch(/2 days/i);
    expect(shippingInfo).toMatch(/shipping cost/i);
  });

  it("should handle not-existent location gracefully", () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);
    const shipping = getShippingInfo();

    expect(shipping).toMatch(/unavailable/i);
  });
});

describe("renderPage", () => {
  it("should return content", async () => {
    const result = await renderPage();
    expect(result).toMatch(/home/i);
  });

  it("should call trackPageView", async () => {
    await renderPage();

    expect(trackPageView).toHaveBeenCalledWith("/home");
  });
});

describe("submitOrder", () => {
  const cardInformation = {
    cardNumber: "6327467623782837",
    cvv: "123",
    expiry: "04/27",
  };
  const order = { totalAmount: 25, totalItem: 2 };
  it("order submit success when payment gets success", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "success" });
    const orderStatus = await submitOrder(cardInformation, order);

    expect(charge).toHaveBeenCalledWith(cardInformation, order.totalAmount);
    expect(orderStatus.success).toBe(true);
  });

  it("order submit failed when payment gets failed", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "failed" });
    const orderStatus = await submitOrder(cardInformation, order);

    expect(orderStatus.success).toBe(false);
  });
});

describe("signUp", async () => {
  const email = "name@domain.com";
  it("should return false for invalid email", async () => {
    const result = await signUp("a");
    expect(result).toBe(false);
  });

  it("should return true for invalid email", async () => {
    const result = await signUp(email);
    expect(result).toBe(true);
  });

  it("should return true when signUp called with success message and email sending was success", async () => {
    vi.mocked(sendEmail).mockResolvedValue(true);
    const result = await signUp(email);
    expect(result).toBe(true);

    expect(sendEmail).toHaveBeenCalledOnce();
    const calls = vi.mocked(sendEmail).mock.calls[0];
    expect(calls[0]).toBe(email);
    expect(calls[1]).toMatch(/welcome/i);
  });
});

describe("login", () => {
  it("should email with one-time login", async () => {
    const email = "name@domain.com";
    const spy = vi.spyOn(security, "generateCode");

    await login(email);

    expect(sendEmail).toHaveBeenCalled();
    const code = spy.mock.results[0].value;
    expect(sendEmail).toHaveBeenCalledWith(email, code);
  });
});
