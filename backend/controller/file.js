import s3 from '../config/s3.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import UserFile from '../model/userfile.js';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { GetObjectCommand } from "@aws-sdk/client-s3";
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
            userId:req.body.user.id,
            size:file.size
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

export const FetchFilelist=async(req,res)=>{
    const {userId}=req.params;
    if(!userId){
        return res.status(400).json({msg:"User ID is required"});
    }
    try{
        const files=await UserFile.find({userId});
        return res.status(200).json({files:files,msg:"Files fetched successfully"});
    }
    catch(err){
        console.error(err);
       return res.status(500).json({msg:"Error fetching files"});
    }
}



export const viewFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user?.id; 

    const file = await UserFile.findById(fileId);
    if (!file) {
      return res.status(404).json({ msg: "File not found" });
    }

    // Check access
    if (!file.isPublic && file.userId.toString() !== userId) {
      return res.status(403).json({ msg: "Not allowed to access this file" });
    }

    // Get file from S3
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.s3key,
    });

    const s3Response = await s3.send(command);

 
    res.setHeader("Content-Type", file.filetype);
    res.setHeader("Content-Disposition", `inline; filename="${file.filename}"`);

   
    s3Response.Body.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching file" });
  }
};

export const downloadFile = async (req, res) => {
    try {
    const file = await UserFile.findById(req.params.id); // get file info from DB

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.key, // stored S3 key
      Expires: 60, // link valid for 60 sec
      ResponseContentDisposition: `attachment; filename="${file.name}"` // force download
    };

    const url = s3.getSignedUrl("getObject", params);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: "Error generating download link" });
  }
}