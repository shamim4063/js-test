export const getShippingQuote = (destination) => {
  console.log(`Getting shipping info for ${destination}`);
  return { cost: 10 * Math.random(), estimatedDay: 3 };
};
