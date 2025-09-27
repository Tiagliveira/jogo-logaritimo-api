import mongoose from "mongoose";
import User from "../mongo.js"; // ajuste a extensão se necessário

let isConnected = false;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://tiagliveira.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Preflight
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).send("Método não permitido");

  // Conexão segura com MongoDB
  if (!isConnected) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
  }

  const { id } = req.body;

  // Validação básica
  if (!id || typeof id !== "string" || id.trim().length < 3) {
    return res.status(400).send("ID inválido");
  }

  const idLimpo = id.trim();

  try {
    const existe = await User.findOne({ id: idLimpo });
    res.status(200).json({ existe: !!existe });
  } catch (err) {
    console.error("Erro ao verificar usuário:", err);
    res.status(500).send("Erro interno ao verificar usuário");
  }
}