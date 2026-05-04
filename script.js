import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getAuth, RecaptchaVerifier, signInWithPhoneNumber }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// CONFIG
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// RECAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  size: 'normal'
});

let confirmationResult;

// SEND OTP
document.getElementById("phone").addEventListener("blur", async () => {
  const phone = document.getElementById("phone").value;

  if (!phone.startsWith("+254")) {
    alert("Use +254 format");
    return;
  }

  try {
    confirmationResult = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
    alert("OTP sent");
  } catch (e) {
    alert("OTP error");
    console.error(e);
  }
});

// VERIFY OTP
document.getElementById("verifyOtp").onclick = async () => {
  const code = document.getElementById("otp").value;

  try {
    await confirmationResult.confirm(code);
    alert("Verified ✅");
  } catch {
    alert("Wrong OTP");
  }
};

// SAVE FORM
document.getElementById("submitBtn").onclick = async () => {

  const data = {
    name: name.value,
    email: email.value,
    phone: phone.value,
    national_id: nid.value,
    service: service.value,
    created_at: new Date()
  };

  if (Object.values(data).includes("")) {
    alert("Fill all fields");
    return;
  }

  await addDoc(collection(db, "registrations"), data);
  alert("Saved");
};

// IPO LIVE
let price = 150;
let progress = 68;

const priceEl = document.querySelector('.price-display');
const bar = document.querySelector('.progress-fill');
const text = document.getElementById('progressText');

setInterval(() => {
  price += (Math.random() - 0.5) * 2;
  progress += Math.random();

  if (progress > 100) progress = 100;

  priceEl.innerHTML = `<span>Ksh</span> ${price.toFixed(2)}`;
  bar.style.width = progress + "%";
  text.textContent = Math.floor(progress) + "%";

}, 2000);

// PAYMENT
window.payNow = function () {
  FlutterwaveCheckout({
    public_key: "YOUR_PUBLIC_KEY",
    tx_ref: "DEXTA-" + Date.now(),
    amount: 15000,
    currency: "KES",
    payment_options: "card,mobilemoney",
    customer: {
      email: email.value,
      phone_number: phone.value,
      name: name.value
    },
    callback: function () {
      alert("Payment successful");
    }
  });
};