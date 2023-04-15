import bcrypt from "bcryptjs";
export const comparePassword = async (
  candidatePassword: string,
  hashedPassword: string
) => {
  console.log({ candidatePassword });
  console.log({ hashedPassword });

  const isMatch = await bcrypt.compare(candidatePassword, hashedPassword);
  return isMatch;
};
