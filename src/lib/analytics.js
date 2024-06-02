import delay from "delay";

export const trackPageView = async (pagePath) => {
  console.log(`Sending to analytics...`);
  console.log(`Path: ${pagePath}`);
  await delay(3000);
};
