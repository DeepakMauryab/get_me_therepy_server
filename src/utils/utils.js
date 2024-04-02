import jwt from "jsonwebtoken";

export const generateRandomNumber = (length) => {
  let number = "";
  const naturalNumber = "0123456789";
  const digitLength = naturalNumber.length;
  for (let i = 0; i < length; i++) {
    number += naturalNumber[Math.floor(Math.random() * digitLength)];
  }

  return number;
};

export const jwtGenerate = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
  return token;
};
export function addMinutesInDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60000).toISOString();
}
