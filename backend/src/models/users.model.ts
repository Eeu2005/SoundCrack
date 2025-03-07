import mongoose, { model } from "mongoose"
import type { User } from "../types.d.ts";
const SchemaUsers = new mongoose.Schema({
  email: {
    required: true,
    type: String,
  },
  tipo: {
    type: String,
    required: true,
    enum: ["padrao", "admin"],
    default: "padrao",
  },
  senha: {
    required: true,
    type: String,
  },
  albuns: {
    type: [mongoose.Types.ObjectId],
    ref: "albuns",
  },
});
export const modelUsers = model<User>("users",SchemaUsers)