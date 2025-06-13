import connectToDB from "../../../database/index";
import User from "../../../models/user";
import { hash } from "bcryptjs";
import Joi from "joi";
import { NextResponse } from "next/server";
import { sendEmail } from "../../../helpers/sendEmail";
import xss from 'xss';

const schema = Joi.object({
    username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  img: Joi.string().allow(""),
  country: Joi.string().required(),
  phone: Joi.string().allow(""),
  desc: Joi.string().allow(""),
  isSeller: Joi.boolean().default(false),
});



export async function POST(req) {
  await connectToDB();

  const { username, email, password, img, country,phone,desc,isSeller} = await req.json();
  //validate the schema
  const sanitizedData = {
    username: xss(username),
    email: xss(email),
    password: xss(password),
    country: xss(country),
    phone: xss(phone),
    desc: xss(desc),
  };
  const { error } = schema.validate(sanitizedData,img,isSeller);

  if (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    //check if the user is exists or not

    const isUserAlreadyExists = await User.findOne({ email });

    if (isUserAlreadyExists) {
      return NextResponse.json({
        success: false,
        message: "User is already exists. Please try with different email.",
      });
    } else {
      const hashPassword = await hash(password, 12);

      const newlyCreatedUser = await User.create({
        username,
        email,
        password: hashPassword,
        img,
        country,
        phone,
        desc,
        isSeller,
      });

        const mailResponse = await sendEmail(email,"Verify",newlyCreatedUser._id);
          
        console.log(mailResponse);

      if (mailResponse) {
        return NextResponse.json({ 
          success: true,
          message: "We send you a link to your gmail account ! Please Verify your Email",
        });
      }else {
          return NextResponse.json({ 
          success: false,
          message: "Failed to send you  a link for Verifying",
        });
      }
    }
  } catch (error) {
    console.log("Error while new user registration. Please try again");

    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again later",
    });
  }
}