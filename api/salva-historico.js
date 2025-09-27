const mongoose = require("mongoose");
const User = require("../mongo");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://tiagliveira.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).send("Método não permitido");

  const { id, historico } = req.body;

  // Validação corrigida
  if (!id || typeof id !== "string" || id.trim().length < 3 || !Array.isArray(historico)) {
    return res.status(400).send("Dados inválidos");
  }

  const idLimpo = id.trim();

  try {
    const resultado = await User.updateOne({ id: idLimpo }, { historico });

    if (resultado.matchedCount === 0) {
      return res.status(404).send("Usuário não encontrado");
    }

    res.status(200).send("✅ Histórico salvo com sucesso");
  } catch (err) {
    console.error("Erro ao salvar histórico:", err);
    res.status(500).send("Erro interno ao salvar histórico");
  }
};