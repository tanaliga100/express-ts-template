import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";
const UserSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a valid password"],
      minlength: 6,
      maxlength: 50,
    },
  },
  { timestamps: true }
);
// HASHED THE PASSWORD HERE || No params needed cause value is in the schema
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// GENERATE TOKEN HERE || use if the user properly authenticated;
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name, email: this.email },
    process.env.JWT_SECRET || "jwt_secret",
    {
      expiresIn: "1d",
    }
  );
};
// COMAPARE PASSWORD
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

const User = mongoose.model("User", UserSchema);
export default User;
