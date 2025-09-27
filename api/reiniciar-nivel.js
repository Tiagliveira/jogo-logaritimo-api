const mongoose = require("mongoose");
const User = require("../mongo");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://tiagliveira.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).send("Método não permitido");

  const { id } = req.body;

  try {
    await User.updateOne({ id }, { nivel: 1, vidas: 3 });
    res.send("✅ Nível reiniciado para 1 e vidas restauradas para 3");
  } catch (err) {
    res.status(500).send("Erro ao reiniciar nível");
  }
};