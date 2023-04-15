import bcrypt from "bcryptjs";

export const hashPassword = async (passwordToHash: string) => {
  const salt = await bcrypt.genSalt(5);
  const hashedPassword = await bcrypt.hash(passwordToHash, salt);
  return hashedPassword;
};
