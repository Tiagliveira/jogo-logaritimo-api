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

  const { id, nivelAtual, vidas } = req.body;

  // Validação básica
  if (!id || typeof id !== "string" || id.trim().length < 3) {
    return res.status(400).send("ID inválido");
  }

  if (typeof nivelAtual !== "number" || nivelAtual < 1) {
    return res.status(400).send("Nível inválido");
  }

  if (typeof vidas !== "number" || vidas < 0) {
    return res.status(400).send("Número de vidas inválido");
  }

  const idLimpo = id.trim();

  try {
    const usuario = await User.findOne({ id: idLimpo });

    if (!usuario) {
      return res.status(404).send("Usuário não encontrado");
    }

    const nivelMaximo = usuario.nivelMaximo || 1;

    const atualizacao = {
      nivel: nivelAtual,
      vidas,
    };

    if (nivelAtual > nivelMaximo) {
      atualizacao.nivelMaximo = nivelAtual;
    }

    await User.updateOne({ id: idLimpo }, atualizacao);

    const mensagem = nivelAtual > nivelMaximo
      ? "✅ Nível e nível máximo atualizados!"
      : "✅ Nível atualizado!";

    res.send(mensagem);
  } catch (err) {
    console.error("Erro ao atualizar nível:", err);
    res.status(500).send("Erro interno ao atualizar nível");
  }
};