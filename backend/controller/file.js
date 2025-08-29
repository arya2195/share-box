import s3 from '../config/s3.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import UserFile from '../model/userfile.js';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
export const uploadFile = async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }
    const key = `${Date.now()}_${file.originalname}`;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        const data = await s3.send(new PutObjectCommand(params));
        const region = process.env.AWS_REGION;
        const bucket = process.env.AWS_BUCKET_NAME;
        const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
        const filedata=new UserFile({
            filename:file.originalname,
            filetype:file.mimetype,
            fileurl:url,
            s3key:key,
            userId:req.body?.userId
        });
        await filedata.save();
        return res.status(200).json({ msg: 'File uploaded successfully', url, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Error uploading file' });
    }
};

export const deleteFile=async(req,res)=>{
    const {fileId}=req.params;
    if(!fileId){
        return res.status(400).json({msg:"File ID is required"});
    }
    try{
        const file=await UserFile.findById(fileId);
        if(!file){
            return res.status(404).json({msg:"File not found"});
        }
        const key=file.s3key;
        const params={
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:key
        };
        await s3.send(new DeleteObjectCommand(params));
        await UserFile.findByIdAndDelete(fileId);
        return res.status(200).json({msg:"File deleted successfully"});
    }
    catch(err){
        console.error(err);
       return res.status(500).json({msg:"Error deleting file"});
    }
}

export const FileList=async(req,res)=>{
    const {userId}=req.params;
    if(!userId){
        return res.status(400).json({msg:"User ID is required"});
    }
    try{
        const files=await UserFile.find({userId});
        return res.status(200).json({files});
    }
    catch(err){
        console.error(err);
       return res.status(500).json({msg:"Error fetching files"});
    }
}
