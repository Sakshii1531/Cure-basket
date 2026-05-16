import { useState, useEffect } from 'react';
import api from '../utils/api';

const DEFAULTS = {
  curePlus: {
    title1: 'Join',
    title2: 'CureBasket Plus',
    description: 'Save up to 25% on every order. Free delivery. Priority support. Premium health perks.',
    buttonText: 'Start Free Trial',
    badge: 'Only ₹199/month after!',
  },
  expressDelivery: {
    title1: 'Express',
    title2: 'Delivery in 15 Mins',
    description: 'Running out of essentials? Get them delivered to your doorstep in the blink of an eye.',
    buttonText: 'Order Now',
    badge: 'No minimum order value!',
  },
  healthCheckup: {
    title1: 'Full Body',
    title2: 'Health Checkups',
    description: 'Home sample collection. NABL certified labs. Accurate results in 24 hours.',
    buttonText: 'Book a Test',
    badge: 'Starting from just ₹499!',
  },
  qualityCare: {
    title1: 'Quality care,',
    title2: 'better savings',
    description: 'Trusted medicines. Expert care. Savings you can count on.',
    buttonText: 'Upload Prescription',
    badge: 'It only takes 30 seconds!',
  },
};

// Module-level cache so all banner components share one fetch
let cachedBanners = null;
let fetchPromise = null;

const fetchBanners = () => {
  if (cachedBanners) return Promise.resolve(cachedBanners);
  if (fetchPromise) return fetchPromise;
  fetchPromise = api.get('/settings/promo_banners')
    .then(res => {
      cachedBanners = res.data.data ? { ...DEFAULTS, ...res.data.data } : DEFAULTS;
      return cachedBanners;
    })
    .catch(() => {
      cachedBanners = DEFAULTS;
      return DEFAULTS;
    })
    .finally(() => { fetchPromise = null; });
  return fetchPromise;
};

const usePromoBanners = (bannerKey) => {
  const [data, setData] = useState(cachedBanners?.[bannerKey] ?? DEFAULTS[bannerKey]);

  useEffect(() => {
    if (cachedBanners) {
      setData(cachedBanners[bannerKey] ?? DEFAULTS[bannerKey]);
      return;
    }
    fetchBanners().then(all => setData(all[bannerKey] ?? DEFAULTS[bannerKey]));
  }, [bannerKey]);

  return data;
};

export default usePromoBanners;
