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
  return new Date(date.getTime() + minutes * 60000);
}

export const getFormatedTime = (time) => {
  if (time) {
    let hours = new Date(time).getTime();
    let minutes = new Date(time).getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes?.length < 2 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  } else {
    return "00:00";
  }
};
