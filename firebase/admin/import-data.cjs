const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const filePath = path.resolve(__dirname, "../data/board-questions.json");
const rawData = fs.readFileSync(filePath, "utf-8");
const data = JSON.parse(rawData);

async function importData() {
  const categories = data.categories;

  for (const [key, categorie] of Object.entries(categories)) {
    const catRef = db.collection("categories").doc(key);
    await catRef.set({ nom: categorie.nom });

    if (categorie.questions && Array.isArray(categorie.questions)) {
      for (const question of categorie.questions) {
        await catRef.collection("questions").add({
          question: question.question,
          choices: question.choices,
          answer: question.answer,
          explanation: question.explanation,
        });
      }
    }
  }

  console.log("✅ Données importées avec succès !");
}

importData().catch((err) => {
  console.error("❌ Erreur pendant l’import :", err);
});
