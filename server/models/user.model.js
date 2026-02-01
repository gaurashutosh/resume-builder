import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim:true,

    },
    email: {
        type: String,
        required: true,
        lowercase:true,
        trim:true,
        unique:true,
    },
    password: {
        type: String,
        required: true,
        select:false
    },
    refreshToken:{
        type: String,
        select:false
    }
    
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

export const User = mongoose.model("User", userSchema);
