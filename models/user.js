const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profile_image: { type: Object },
    friends: [{ type: Schema.Types.ObjectId }],
    invite_sent: [{ type: Schema.Types.ObjectId }],
    invite_received: [{ type: Schema.Types.ObjectId }],
});

module.exports = mongoose.model('User', UserSchema);