import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
})

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    priceId: null,
    documents: 1,
    watermark: true,
  },
  PRO: {
    name: "Pro",
    price: 9,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    documents: -1,
    watermark: false,
  },
  BUSINESS: {
    name: "Business",
    price: 19,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
    documents: -1,
    watermark: false,
  },
}