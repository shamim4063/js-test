import delay from "delay";

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sendEmail = async (to, message) => {
  console.log(`Sending email to ${to}`);
  console.log(`Message: ${message}`);
  await delay(3000);
  return true;
};
