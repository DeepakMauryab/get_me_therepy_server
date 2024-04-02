import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const CustomerSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    mobileNumber: {
      type: String,
    },
    password: {
      type: String,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

CustomerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  }
});

const Customer = new mongoose.model("customer", CustomerSchema);

export default Customer;
