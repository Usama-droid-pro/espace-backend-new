const multer = require('multer');

try{
   var storage=multer.diskStorage({
      destination:function(req,file,cb){
          cb(null, "userImages/")
      },
      filename:function(req,file,cb){
          cb(null ,Date.now() + "--" + file.originalname)
      }
  })
  var upload = multer({storage:storage})
  module.exports=upload
}
catch(err){
    console.log(err);
}