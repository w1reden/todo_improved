import mongoose, { Schema } from 'mongoose';

let folderSchema = new Schema({
  name: {
    type: String, 
    require: true
  },
  color: {
    type: String,
    require: true
  },
  userId: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

export default mongoose.model('Folder', folderSchema);