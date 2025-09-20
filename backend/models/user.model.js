import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
    email:{type: String, required:true, unique:true},
    username:{type: String, required:true, unique:true},
    password:{type: String, required:true},
    token:{type: String},
});

export  const userModel = mongoose.model("users", userSchema);