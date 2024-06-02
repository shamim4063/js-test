import delay from "delay";

export const charge = async (cardInformation, amount) => {
  console.log(`Taking chanrge from ${cardInformation.cardNumber}`);
  console.log(`Order amount ${amount}`);
  await delay(3000);
  return { status: "success" };
};
