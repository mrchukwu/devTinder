const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      MaxLength: 50,
    },
    lastName: {
      type: String,
      MaxLength: 50,
    },

    emailId: {
      type: String,
      lowercase: true,
      required: [true, "Email is required"],
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
      message: 'Email must contain "@" symbol',
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "passwoard is required"],
      match: [
        /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{5,}$/,
        'Password must contain at least one uppercase letter and one special character',
      ],
    },

    age: {
      type: Number,
      required: true,
      min: 18,
      validate(value){
        return value >= 18;
      },
      message: "User must be at least 18 years old."
    },

    gender: {
      type: String,
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
    },

    about: {
      type: String,
      default: "Hi I am here to connect.",
    },

    skills: {
      type: [String],
      lowercase: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
