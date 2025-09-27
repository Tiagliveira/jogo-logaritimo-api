const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  avatar: {
    type: String,
    validate: {
      validator: v => /^https?:\/\/.+\.(svg|png|jpg|jpeg)$/.test(v),
      message: props => `${props.value} não é uma URL válida de imagem!`
    }
  },
  nivel: {
    type: Number,
    default: 1,
    min: 1
  },
  nivelMaximo: {
    type: Number,
    default: 1,
    min: 1
  },
  vidas: {
    type: Number,
    default: 3,
    min: 0
  },
  historico: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);