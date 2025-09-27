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

  const { id, nivelAtual, vidas } = req.body;

  try {
    const usuario = await User.findOne({ id });
    const nivelMaximo = usuario?.nivelMaximo || 1;

    if (nivelAtual > nivelMaximo) {
      await User.updateOne(
        { id },
        { nivel: nivelAtual, nivelMaximo: nivelAtual, vidas }
      );
      res.send("✅ Nível e nível máximo atualizados!");
    } else {
      await User.updateOne({ id }, { nivel: nivelAtual, vidas });
      res.send("✅ Nível atualizado!");
    }
  } catch (err) {
    res.status(500).send("Erro ao atualizar nível");
  }
};
