
const profile=async(req,res)=>{
   const token=req.cookies.token;
   if(!token){
    return res.status(401).json({msg:"Not authorized"});
   }
   try{
    const user=jwt.verify(token,process.env.JWT_SECRET);
    return res.status(200).json({user});
   }
   catch(err){
    return res.status(500).json({msg:"unathorized"});  
   }
   }
   export {profile};
    