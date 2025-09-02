import jwt from 'jsonwebtoken';
import User from '../model/user.js';
import dotenv from 'dotenv';
dotenv.config();
const profile = async (req, res) => {
   const token = req.cookies.token;
   if (!token) {
      return res.status(401).json({ msg: "Not authorized" });
   }
   try {
      const user = jwt.verify(token, process.env.JWTSECRET);
      console.log(user)
      const userdetail = await User.findById(user.id)
      return res.status(200).json({ user: userdetail });
   }
   catch (err) {
      return res.status(500).json({ msg: "unathorized" });
   }
}
export { profile };
