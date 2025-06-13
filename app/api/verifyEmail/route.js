import { NextResponse } from "next/server";
import connectToDB from "../../../database/index";
import User from "../../../models/user";
export async function POST(req){

      try{
        await connectToDB();
          const reqBody = await req.json();
          const {token} = reqBody;
          console.log(token);

          const user = await User.findOne({
              verifyToken : token, verifyTokenExpiry:{$gt : new Date()}
             
          })
              
          if(!user){
            console.log("not user");
            return NextResponse.json({
                message:"verifyToken Expired",
                success:false,
            })

          }
          console.log("'user is present");
          user.isVerified = true;
          user.verifyToken= null;
          user.verifyTokenExpiry= null;

          await user.save();

       return NextResponse.json({
              message:"Email verified Registeration Successfull :)",
              success:true,
          });


      }catch (error) {
        console.log("Error while verifyEmail  . Please try again");
    
        return NextResponse.json({
          success: false,
          message: "Something went wrong ! Please try again later",
        });
      }

}