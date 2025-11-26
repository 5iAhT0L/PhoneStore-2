import { pool } from "../config/db.js";
import { ResponseError } from "../errors/responseError.js";
import { loginSchema, registerSchema } from "../Validation/authValidation.js";
import { validate } from "../Validation/validate.js";
import bcrypt from "bcrypt";

export const getAllUsers = async () => {
  const [users] = await pool.query(
    `SELECT id, fullname, username, email, role, address, phone_number, age FROM users`
  );
  return users;
};

export const register = async (request) => {
  const validated = validate(registerSchema, request);

  const {
    fullname,
    username,
    email,
    password,
    role,
    address,
    phone_number,
    age,
  } = validated;

  const hashedPassword = await bcrypt.hash(password, 10);

  const [users] = await pool.query(
    `SELECT INTO users fullname, username, email, password, role, address, phone_number, age
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      fullname,
      username,
      email,
      hashedPassword,
      role,
      address,
      phone_number,
      age,
    ]
  );

  const newUser = {
    id: users.insertId,
    fullname,
    username,
    email,
    role,
    address,
    phone_number,
    age,
  };

  return newUser;
};

export const login = async (request) => {
  const { email, password } = validate(loginSchema, request);

  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (rows.length === 0) {
    throw new ResponseError("email atau password salah", 401);
  }

  const user = rows[0];

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ResponseError(401, "email atau password salah");
  }

  return {
    id: user.insertId,
    fullname: user.fullname,
    username: user.username,
    email: user.email,
    role: user.role,
    address: user.address,
    phone_number: user.phone_number,
    age: user.age,
  };
};
