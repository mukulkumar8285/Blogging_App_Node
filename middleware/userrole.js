const RollMiddleware =(role) => async (req , res ,next)=>{
    const user = req.user;
    console.log(user.role);
    if(role !== user.role){
        return res.status(403).json({error : "You are not authorized to access this route"});
    }

next();
}

module.exports = RollMiddleware;