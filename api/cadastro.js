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

  const { id, avatar } = req.body;

  if (!id || typeof id !== "string" || id.trim() === "") {
    return res.status(400).send("ID inválido");
  }

  const idLimpo = id.trim();

  try {
    const existe = await User.findOne({ id: idLimpo });
    if (existe) return res.status(409).send("Usuário já existe");

    const novo = new User({ id: idLimpo, avatar });
    await novo.save();

    res.send("Cadastro realizado com sucesso");
  } catch (err) {
    res.status(500).send("Erro ao cadastrar");
  }
};