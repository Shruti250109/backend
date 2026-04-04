class ApiError extends Error{
    // you are creating class anmed APIerror jo extend karti hai Error class ko
    constructor(
        statusCode,
        message= "Something went wrong",
        error=[],
        stack=""
    ){
        super(message);
        this.statusCode= statusCode;
        this.data=null;
        this.message= message ;
        this.success= false;
        this.error=error;
        if(stack)
        {
            this.stack= stack;

        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export {ApiError}
// ye extra info deta hain error le baare me
// constructor runs when you create a new error jaha errors=[] hume extra info seta hai aur stack deta hai ki kaha error exactly hua tha like error trace
//  super(message) is used to Call parent Error class