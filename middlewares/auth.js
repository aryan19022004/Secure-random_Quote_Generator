import { getUser} from '../service/auth.js'

 function restrictTo(roles = []){
    return function(req,res,next){
      if(!req.user) return res.render('signup')
      
      if(!roles.includes(req.user.role)) return res.end("UnAuthorised")
    }
  next();
 }//  req.users me  restrictToLoggedInUserOnly isko restrictTo ke pehle use krke  req.users dekh lenge 

async function restrictToLoggedInUserOnly(req,res,next){
  
  const Userid = req.cookies?.token;
  //  const Userid = req.headers?.['authorization']
  if(!Userid) return res.render('signup')
   // const token = Userid.split('Bearer ')[1];

  const user = getUser(Userid);
//  const user = getUser(token);
  if(!user) return res.render('signup')
  req.user = user;
 next();
}

export {
    restrictToLoggedInUserOnly,
    restrictTo
}


//cookie domain attached hote hai like agar browser me 2 websites
//  ne 2 2 cokkies banai hai to jb jb browser bhejega to aapka hi cookie bhejega
