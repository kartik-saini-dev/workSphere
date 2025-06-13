import connectToDB from "../../../database/index";
import User from "../../../models/user";
import Joi from "joi";
import { NextResponse } from "next/server";
import { sendEmail } from "../../../helpers/sendEmail";
import xss from 'xss';

const schema = Joi.object({
  email: Joi.string().email().required(),
});



export async function POST(req) {
  await connectToDB();

  const {  email} = await req.json();
  //validate the schema
  const sanitizedData = {
    email: xss(email),
  };
  const { error } = schema.validate(sanitizedData);

  if (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    //check if the user is exists or not

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Unregistered Email",
      });
    } else {

        const mailResponse = await sendEmail(email,"Reset",user._id);

      if (mailResponse) {
        return NextResponse.json({
          success: true,
          message: "We send you a link to your gmail account ! For Reset Password",
        });
      }
    }
  } catch (error) {
    console.log("Error while Resetting Password. Please try again");

    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again later",
    });
  }
}