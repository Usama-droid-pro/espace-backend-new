const jwt = require('jsonwebtoken');
require('dotenv').config()
module.exports = (req, res, next) => {
  try {
    if(!req.headers.authorization){
        res.send("plz provide token ")
    }
    else{
        const token = req.headers.authorization.split(' ')[1];
        console.log(token)
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        console.log(decodedToken)
        const userId = decodedToken._id;
        console.log(userId + "user id")
        console.log(req.body.userId)
        if (req.body.userId && req.body.userId !== userId) 
        {
          res.json({
            message:"invalid user"
          })
      } 
       else {
        res.json({
            authenticated:true
        })
      next();
    }
    }
    
  } catch {
    res.status(401).json({
      error: "invalid token"
    });
  }
};