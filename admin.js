import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  projectId: "YOUR_PROJECT_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const table = document.getElementById("table");

const load = async () => {
  const snap = await getDocs(collection(db, "registrations"));

  snap.forEach(doc => {
    const d = doc.data();

    table.innerHTML += `
      <tr>
        <td>${d.name}</td>
        <td>${d.email}</td>
        <td>${d.phone}</td>
      </tr>`;
  });
};

load();