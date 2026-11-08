# Memory Rehab™ Lab

> Clinical Botanical Barrier Skincare & Routine Apothecary

High-performance botanical formulas dedicated to skin barrier recovery, soothing balance, and healthy everyday radiance.

## Features
- **3-Step Skincare Architecture:** Prep & Tone, Target & Treat, Hydrate & Lock.
- **Custom Modular CSS System:** Lightweight, responsive design with glassmorphic aesthetic.
- **Storefront & Admin Controls:** Real-time catalog management, discount promos, order calculation, and Flutterwave / WhatsApp checkout.
- **Local & Cloud Sync:** Offline-first LocalStorage backed by optional Firebase Cloud Firestore & Node.js backend services.

## Setup & Running Locally
```bash
# Install dependencies
npm install

# Start local server
npm start
```

Access storefront at `http://localhost:3000/` and Admin Portal at `http://localhost:3000/admin.html`.

## Flutterwave Setup
Create a Flutterwave account and add the secret key to your local `.env` file or your deployment's environment variables:

```env
FLW_SECRET_KEY=FLWSECK_TEST-your-test-secret
FLW_CURRENCY=NGN
```

Use the Flutterwave test secret while testing, then set the live secret only when ready to accept live payments. Optionally set `FLW_CALLBACK_URL` to a publicly reachable HTTPS URL ending in `/api/payments/flutterwave/callback`. The default callback URL is derived from the current request host. Never expose the secret key in frontend code.

## Deployment
Configured for automated static and serverless deployments with `vercel.json`.
