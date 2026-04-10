import bcrypt from "bcryptjs";

async function run() {
  const plainPassword = "secret";

  // Hash the password
  const hashed = await bcrypt.hash(plainPassword, 10);
  console.log("Hashed:", hashed);

  // Compare the plain password with the hash
  const isMatch = await bcrypt.compare(plainPassword, hashed);
  console.log("Password matches:", isMatch);
}

run();


