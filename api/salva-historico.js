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

  const { id, historico } = req.body;

  if (!id || !Array.isArray(historico)) {
    return res.status(400).send("Dados inválidos");
  }

  try {
    await User.updateOne({ id: id.trim() }, { historico });
    res.send("Histórico salvo com sucesso");
  } catch (err) {
    res.status(500).send("Erro ao salvar histórico");
  }
};