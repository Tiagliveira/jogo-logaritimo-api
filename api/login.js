const mongoose = require("mongoose");
const User = require("../mongo");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://tiagliveira.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Preflight
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).send("Método não permitido");

  const { id } = req.body;

  // Validação básica
  if (!id || typeof id !== "string" || id.trim().length < 3) {
    return res.status(400).send("ID inválido");
  }

  const idLimpo = id.trim();

  try {
    const usuario = await User.findOne({ id: idLimpo });

    if (!usuario) {
      return res.status(404).send("Usuário não encontrado");
    }

    res.status(200).json({
      mensagem: `Login bem-sucedido para ${usuario.id}`,
      dados: {
        id: usuario.id,
        avatar: usuario.avatar,
        nivel: usuario.nivel,
        vidas: usuario.vidas,
        historico: usuario.historico || [],
      },
    });
  } catch (err) {
    console.error("Erro ao buscar usuário:", err);
    res.status(500).send("Erro interno ao buscar usuário");
  }
};