const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
    author_id: {type: Schema.Types.ObjectId, required: true },
    author_firstname: { type: String, required: true },
    author_lastname: { type: String, required: true },
    date_created: { type: Date, default: new Date(), required: true },
    body: { type: String, required: true },
    images: { type: [Object], default: []},
    likes: [ { type: Schema.Types.ObjectId }],
    comments: [ {
        author_id: { type: Schema.Types.ObjectId },
        author_firstname: { type: String, required: true },
        author_lastname: { type: String, required: true },
        date_created: { type: Date, default: new Date(), required: true },
        body: { type: String, required: true },
    }]
});

module.exports = mongoose.model('Post', PostSchema);