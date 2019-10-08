var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    _articleId: {
        type: Schema.Types.ObjectId,
        ref: "Title"
    },
    date: String,
    noteText: String
});
var Note = mongoose.model("Note", NoteSchema);
module.exports = Note;