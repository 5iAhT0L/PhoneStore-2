import {
  validateRegister,
  validateLogin,
} from "../Validation/validate.js";

export const register = async (data) => {
  const result = validateRegister(data);

  if (!result.success) {
    const errors = result.error.issues.map((i) => i.message);
    const error = new Error(errors.join(", "));
    error.status = 400;
    throw error;
  }

  const validData = result.data;

  // SAFE fields only — DO NOT return password
  const safeData = {
    username: validData.username,
    email: validData.email,
    fullname: validData.fullname,
    role: validData.role,
    address: validData.address,
    phone_number: validData.phone_number,
    age: validData.age,
  };

  // TODO: database insert logic here

  return safeData;
};

export const login = async (data) => {
  const result = validateLogin(data);

  if (!result.success) {
    const errors = result.error.issues.map((i) => i.message);
    const error = new Error(errors.join(", "));
    error.status = 400;
    throw error;
  }

  const validData = result.data;

  // TODO: Fetch user from DB using validData.email
  // Example dummy DB result:
  const userFromDb = {
    id: 7,
    fullname: "Agung Santoso",
    username: "agungsantoso",
    email: "agung@example.com",
    role: "user",
    address: "Jl. Merdeka No.10",
    phone_number: "081234567890",
    age: 25,
    // password: "xxxxx"   ← THIS SHOULD NEVER BE RETURNED
  };

  // Return exactly what you want (NO PASSWORD)
  const safeLoginData = {
    id: userFromDb.id,
    fullname: userFromDb.fullname,
    username: userFromDb.username,
    email: userFromDb.email,
    role: userFromDb.role,
    address: userFromDb.address,
    phone_number: userFromDb.phone_number,
    age: userFromDb.age,
  };

  return safeLoginData;
};
