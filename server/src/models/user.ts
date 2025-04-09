import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    urls: [{
        type: Schema.Types.ObjectId,
        ref: 'ShortUrl'
    }]
}, {
    timestamps: true,
})

const User = mongoose.model("User", userSchema);
export default User;