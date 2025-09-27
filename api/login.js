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

  if (!id || typeof id !== "string" || id.trim() === "") {
    return res.status(400).send("ID inválido");
  }

  try {
    const usuario = await User.findOne({ id: id.trim() });
    if (!usuario) return res.status(404).send("Usuário não encontrado");

    res.json({
      mensagem: `Login bem-sucedido para ${usuario.id}`,
      dados: {
        id: usuario.id,
        avatar: usuario.avatar,
        nivel: usuario.nivel,
        vidas: usuario.vidas,
        historico: usuario.historico,
      },
    });
  } catch (err) {
    res.status(500).send("Erro ao buscar usuário");
  }
};