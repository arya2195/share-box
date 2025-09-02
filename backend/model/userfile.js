import mongoose from 'mongoose';
const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    filetype: { type: String, required: true },
    fileurl: { type: String, required: true },
    shareid: { type: String, unique: true, sparse: true },
    uploadedAt: { type: Date, default: Date.now },
    s3key: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isshared: { type: Boolean, default: false },
    size: { type: Number, required: true }
});
const UserFile = mongoose.model('UserFile', fileSchema);
export default UserFile;