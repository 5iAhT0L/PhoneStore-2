import bcrypt from "bcrypt";
import { pool } from "../config/db.js";
import { validateLogin, validateRegister } from "../Validation/validate.js";
import { ResponseError } from "../errors/responseError.js";
import { da } from "zod/v4/locales";

// ==============================
// REGISTER SERVICE
// ==============================
export const register = async (data) => {
  const result = validateRegister(data);
  console.log(data);

  if (!result.success) {
    const errors = result.error.issues.map((i) => i.message);
    throw new ResponseError(errors.join(", "), 400);
  }

  const validData = result.data;

  // Hash password
  const hashedPassword = await bcrypt.hash(validData.password, 10);

  // Insert user ke database
  const [insert] = await pool.query(
    `INSERT INTO users (fullname, username, email, password, role, address, phone_number, age)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      validData.fullname,
      validData.username,
      validData.email,
      hashedPassword,
      validData.role,
      validData.address,
      validData.phone_number,
      validData.age,
    ]
  );

  // Return SAFE DATA (tanpa password)
  return {
    id: insert.insertId,
    fullname: validData.fullname,
    username: validData.username,
    email: validData.email,
    role: validData.role,
    address: validData.address,
    phone_number: validData.phone_number,
    age: validData.age,
  };
};

// ==============================
// LOGIN SERVICE
// ==============================
export const login = async (data) => {
  const result = validateLogin(data);

  if (!result.success) {
    const errors = result.error.issues.map((i) => i.message);
    throw new ResponseError(errors.join(", "), 400);
  }

  const { email, password } = result.data;

  // Cek user dari database
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (rows.length === 0) {
    throw new ResponseError("email atau password salah", 401);
  }

  const user = rows[0];

  // Cek password
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new ResponseError("email atau password salah", 401);
  }

  // SAFE USER (tanpa password)
  const { password: pw, ...safeUser } = user;

  return safeUser;
};
