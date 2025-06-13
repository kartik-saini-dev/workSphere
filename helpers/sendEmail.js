import User from "../models/user";
import { hash } from "bcryptjs";
import nodemailer from "nodemailer";

const { AUTH_EMAIL, AUTH_PASSWORD } = process.env;

export const sendEmail = async (email,emailType,userId)=>{
    
    try{

        const hashToken = await hash(userId.toString(),10);
         
        if (emailType == "Verify"){

            await User.findByIdAndUpdate(userId,{
                verifyToken : hashToken,
                verifyTokenExpiry: new Date(Date.now() + 3600000),
            })

        }else if (emailType == "Reset"){
            await User.findByIdAndUpdate(userId,{
                resetToken : hashToken,
                resetTokenExpiry: new Date(Date.now() + 3600000),
            })
        }
        // in order to use sandbox for email verification
        // var transport = nodemailer.createTransport({
        //     host: "sandbox.smtp.mailtrap.io",
        //     port: 2525,
        //     secure: false, // true for 465, false for other ports
        //     auth: {
        //       user: "......",
        //       pass: "...." 
        //     }
        //   });
        
        var transport = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: AUTH_EMAIL,
            pass: AUTH_PASSWORD// go to google account security then 2 step verification then app password then  app name is nodemailer 
          },
          tls: {
            rejectUnauthorized: false // Add this to allow self-signed certificates
          }
        
        });
        
               
          const verificationLink = `${process.env.BASE_URL}/verifyEmail?token=${hashToken}`;
          const resetLink = `${process.env.BASE_URL}/resetPassword?token=${hashToken}`;
          const mailOptions = {
            from: `${AUTH_EMAIL}`,
            to: email,
            subject: `${emailType === "Verify" ? "Welcome to Our Website - Verify Your Email" : "Reset Your Password"}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px;">
                <header style="text-align: center; padding-bottom: 20px;">
                  <h1 style="color: #4CAF50; margin: 0;">${emailType === "Verify" ? "Welcome to Our Website!" : "Reset Your Password"}</h1>
                  <p style="color: #555;">We're glad to have you on board.</p>
                </header>
                <main>
                  <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    ${
                      emailType === "Verify"
                        ? `Thank you for joining us! To complete your registration, please verify your email by clicking the button below.`
                        : `You recently requested to reset your password. Click the button below to proceed.`
                    }
                  </p>
                  <div style="text-align: center; margin: 20px 0;">
                    <a href="${emailType === "Verify" ? verificationLink : resetLink}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
                      ${emailType === "Verify" ? "Verify Email" : "Reset Password"}
                    </a>
                  </div>
                  <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    ${
                      emailType === "Verify"
                        ? `If you did not create this account, you can ignore this email.`
                        : `If you did not request a password reset, please secure your account immediately.`
                    }
                  </p>
                </main>
                <footer style="text-align: center; color: #777; font-size: 14px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
                  <p>Need help? Contact us at <a href="mailto:kartiksaini71011@gmail.com" style="color: #4CAF50; text-decoration: none;">kartiksaini71011@gmail.com</a></p>
                  <p style="margin: 0;">&copy; ${new Date().getFullYear()} Our Website. All rights reserved.</p>
                </footer>
              </div>
            `,
          };
          
          return new Promise((resolve) => {
            transport.sendMail(mailOptions, (error) => {
              if (error) {
                console.error(error,"this error in promise ");
                resolve(false);
              } else {
                resolve(true);
              }
            });
          });
        } catch (error) {
          console.error(error,"this error while verify email");
          return false;
        }
      };
