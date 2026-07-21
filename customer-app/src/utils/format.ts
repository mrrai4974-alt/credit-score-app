export const GST_RATE = 0.18;

export const inr = (amount: number): string =>
  '₹' + amount.toLocaleString('en-IN');

export const withGst = (base: number): number =>
  Math.round(base * (1 + GST_RATE));

export const gstAmount = (base: number): number =>
  Math.round(base * GST_RATE);
