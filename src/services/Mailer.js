import nodemailer from "nodemailer";

// MAIL_USERNAME= cslab4086@gmail.com
// MAIL_PASSWORD= iitumkowoswxqzaw

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: "cslab4086@gmail.com",
    pass: "iitumkowoswxqzaw",
  },
});

const sendMail = (email, subject, text) => {
  const options = {
    from: "cslab4086@gmail.com",
    to: email,
    subject,
    text,
  };
  transporter.sendMail(options, (err, res) => {
    if (err) {
      return ApiError(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Email can't send"
      );
    }
    return true;
  });
};

export default sendMail;
