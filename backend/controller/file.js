import s3 from '../config/s3.js';
import { v4 as uuidv4 } from 'uuid';
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
        const filedata = new UserFile({
            filename: file.originalname,
            filetype: file.mimetype,
            fileurl: url,
            s3key: key,
            userId: req.user.id,
            size: file.size
        });
        await filedata.save();
        return res.status(200).json({ msg: 'File uploaded successfully', url, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err, msg: 'Error uploading file' });
    }
};

export const deleteFile = async (req, res) => {
    const { fileId } = req.params;
    if (!fileId) {
        return res.status(400).json({ msg: "File ID is required" });
    }
    try {
        const file = await UserFile.findById(fileId);
        if (!file) {
            return res.status(404).json({ msg: "File not found" });
        }
        const key = file.s3key;
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key
        };
        await s3.send(new DeleteObjectCommand(params));
        await UserFile.findByIdAndDelete(fileId);
        return res.status(200).json({ msg: "File deleted successfully" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error deleting file" });
    }
}



export const FetchFilelist = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(400).json({ msg: "User ID is required" });
    }
    try {
        const files = await UserFile.find({ userId });
        return res.status(200).json({ files: files, msg: "Files fetched successfully" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error fetching files" });
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

        
        if (file.userId.toString() !== userId) {
            return res.status(403).json({ msg: "Not allowed to access this file" });
        }

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
        const file = await UserFile.findById(req.params.fileId); // get file info from DB
        if (!file) {
            return res.status(404).json({ msg: "File not found" });
        }

        if (file.userId.toString() !== req.user.id) {
            return res.status(403).json({ msg: "Not allowed to access this file" });
        }

  
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: file.s3key,
        });

        const s3Response = await s3.send(command);

      
        res.setHeader("Content-Type", file.filetype);
        res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
        res.setHeader("Content-Length", file.size);

    
        s3Response.Body.pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error downloading file" });
    }
}

export const sharefile = async (req, res) => {
    const { fileId } = req.params;
    const { id } = req.user;
    console.log("bjhjhbj",id)
    console.log(req.user)
    if (!fileId) {
        return res.status(400).json({ msg: "File ID is required" });
    }
    try {
        const file = await UserFile.findById(fileId);
        if (!file) {
            return res.status(404).json({ msg: "File not found" });
        }

        if (file.userId.toString() !== id) {
            return res.status(403).json({ msg: "Not allowed to share this file" });
        }
        if(file.isshared==true){
             const shareablelink = `${process.env.FRONTEND_URL}/shared/${file.shareid}`;
            return res.status(200).json({msg:"File is already public",shareablelink})
        }
     
        console.log("file is being shared");
        const shareid = uuidv4();
       file.isshared = true;
       file.shareid=shareid;
        await file.save();
        const region = process.env.AWS_REGION;
        const bucket = process.env.AWS_BUCKET_NAME;
        const fileurl = `https://${bucket}.s3.${region}.amazonaws.com/${file.s3key}`;
        const shareablelink = `${process.env.FRONTEND_URL}/shared/${shareid}`;
        return res.status(200).json({ msg: "File is now public", fileurl, shareablelink });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error sharing file" });
    }

}

export const viewsharedfile = async (req, res) => {
    const { shareid } = req.params;
    console.log("id is ",shareid)
    if (!shareid) {
        return res.status(400).json({ msg: "Share ID is required" });
    }
    try {
        const file = await UserFile.findOne({ shareid, isshared: true });
        if (!file) {
            return res.status(404).json({ msg: "Shared file not found" });
        }
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
        return res.status(500).json({ msg: "Error fetching shared file" });
    }
}



export const downloadsharedfile = async (req, res) => {
    const { shareid } = req.params;
    if (!shareid) {
        return res.status(400).json({ msg: "Share ID is required" });
    }
    try {
        const file = await UserFile.findOne({ shareid, isPublic: true });
        if (!file) {
            return res.status(404).json({ msg: "Shared file not found" });
        }
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: file.s3key,
        });
        const s3Response = await s3.send(command);
        res.setHeader("Content-Type", file.filetype);
        res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
        res.setHeader("Content-Length", file.size);
        s3Response.Body.pipe(res);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error downloading shared file" });
    }
}


export const deletesharelink=async(req,res)=>{
    const {fileId}=req.params;
    const {id}=req.user;
    if(!fileId){
        return res.status(400).json({msg:"File ID is required"});
    }
    try{
        const file=await UserFile.findById(fileId);
        if(!file){
            return res.status(404).json({msg:"File not found"});
        }
        if(file.userId.toString()!==id){
            return res.status(403).json({msg:"Not allowed to delete share link"});
        }
        if(file.isshared==false){
            return res.status(400).json({msg:"File is not shared"});
        }
        file.isshared=false;
        file.shareid=undefined;
        await file.save();
        return res.status(200).json({msg:"Share link deleted successfully"});
    }
    catch(err){
        return res.status(500).json({msg:"Error deleting share link"});

    }   
}

export const fetchsharelink=async(req,res)=>{
    const {fileId}=req.params;
    const {id}=req.user;
    if(!fileId){
        return res.status(400).json({msg:"File ID is required"});
    }
    try{
        const file=await UserFile.findById(fileId);
        if(!file){
            return res.status(404).json({msg:"File not found"});
        }
        if(file.userId.toString()!==id){
            return res.status(403).json({msg:"Not allowed to fetch share link"});
        }
        if(file.isshared==false){
            return res.status(400).json({msg:"File is not shared"});
        }
        const shareablelink=`${process.env.FRONTEND_URL}/shared/${file.shareid}`;
        return res.status(200).json({msg:"Share link fetched successfully",shareablelink});
    }
    catch(err){
        return res.status(500).json({msg:"Error fetching share link"});
    }
}