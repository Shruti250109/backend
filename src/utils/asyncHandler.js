const asyncHandler=(fn)=> async (req,res,next)=>{
    try{
        await fn(req,res,next)
    }
    catch(error) {
    res.status(error.statusCode || 500).json({
        success : false,
        message :error.message
    })
    }
}
export {asyncHandler}
// asyncHandler is written to handle errors in async code (like DB calls, APIs, etc.)
// leta hai wo functionn as input as fn the dekhtab hai ki kya wo function sahi chal raha warna error pakad leta hai bas