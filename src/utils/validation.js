
const validator = require("validator");

const validateSignupData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password")
    }
}


const validateLoginData = (req) => {
    const {emailId, password} = req.body;

    if(!emailId){
        throw new Error("Invalid credentials"); 
    }else if(!password){
        throw new Error("Invalid credentials")
    }
}

const validateProfileEditData = (req) => {
   const allowedEditFileds = ["firstName", "lastName", "emailId", "age", "gender", "photoUrl", "about", "skills"];
   const validGender = ["male", "female", "other"];
   const body = req.body;


   const isEditAllowed = Object.keys(body).every(field => allowedEditFileds.includes(field));
   
   if(!isEditAllowed){
    throw new Error("Request contains invalid fields")
   }

    if (body.age !== undefined) {
        const age = Number(body.age)
        if(isNaN(age) || age < 18)
        throw new Error("Age must be 18 or older");
    }

    if (body.gender !== undefined && !validGender.includes(body.gender.toLowerCase())) {
        throw new Error("Gender must be 'male', 'female', or 'other'");
    }

    // You can add similar conditional checks for other fields
    if (body.photoUrl !== undefined && !validator.isURL(body.photoUrl)) {
        throw new Error("Photo URL is not valid");
    }

    if (body.about !== undefined && body.about.length > 350) {
        throw new Error("About must be 350 characters or fewer");
    }

    if (body.skills !== undefined && body.skills.length > 10) {
        throw new Error("Skills should not exceed 10 items");
    }


   return true;
   
}

const validatePasswordEdit = (req) => {
    const {password} = req.body;

    if(!password || typeof password!== "string" || password.trim() === ""){
        throw new Error("Invalid credentials")
    }
}

module.exports = {
    validateSignupData,
    validateLoginData,
    validateProfileEditData,
    validatePasswordEdit
}   