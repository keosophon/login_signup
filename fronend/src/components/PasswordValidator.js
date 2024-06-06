// passwordValidation.js

const validatePassword = (password) => {
  const regex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  if (!regex.test(password)) {
    return "Password must contain at least 8 characters,one uppercase letter, one lowercase letter, one symbol, and one digit.";
  }

  return null; // Return null if the password is valid
};

export default validatePassword;
