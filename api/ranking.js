const mongoose = require("mongoose");
const User = require("./mongo");

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://tiagliveira.github.io");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).send("Método não permitido");

  try {
    // Conexão segura com MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    // Busca os 10 melhores jogadores
    const ranking = await User.find({}, "id nivelMaximo avatar")
      .sort({ nivelMaximo: -1 })
      .limit(10)
      .lean();

    res.status(200).json(ranking);
  } catch (err) {
    console.error("Erro ao buscar ranking:", err);
    res.status(500).send("Erro interno ao buscar ranking");
  }
};