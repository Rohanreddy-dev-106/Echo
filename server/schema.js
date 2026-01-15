import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema({
   sender: { type: String, minlength: 1, maxlength: 10, required: true },
   message: { type: String, minlength: 1, maxlength: 100, required: true }

}, { timestamps: true });

export default mongoose.model("Message", MessageSchema);
