const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      MaxLength: 50,
      trim: true
    },
    lastName: {
      type: String,
      MaxLength: 50,
      trim: true
    },

    emailId: {
      type: String,
      lowercase: true,
      required: true,
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error("Invalid email address " + value)
        }
      },
      // match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      trim: true,
      required: [true, "passwoard is required"],
      validate(value){
        if(!validator.isStrongPassword(value)){
          throw new Error("Enter a strong password " + value);
        }
      }
      // match: [
      //   /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{5,}$/,
      //   'Password must contain at least one uppercase letter and one special character',
      // ],
    },

    age: {
      type: Number,
      // required: true,
      min: 18,
      validate(value){
        return value >= 18;
      },
      message: "User must be at least 18 years old."
    },

    gender: {
      type: String,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },

    photoUrl: {
      type: String,
      default:
        "https://www.freepik.com/premium-vector/man-professional-business-casual-young-avatar-icon-illustration_270519234.htm",
        validate(value){
          if(!validator.isURL(value)){
            throw new Error("Invalid photo URL")
          }
        }
    },

    about: {
      type: String,
      MaxLength: 250,
      default: "Hi I am here to connect.",
    },

    skills: {
      type: [String],
      validate(value){
        return value.length <= 10;
      },
      message: "Skills should not be more than 10",
      lowercase: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
