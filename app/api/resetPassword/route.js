
import { NextResponse } from 'next/server';
import connectToDB from '../../../database/index';
import User from '../../../models/user';
import { hash } from 'bcryptjs';

export async function POST(req) {
  await connectToDB();

  try {
    const reqBody = await req.json();
    const { token, password } = reqBody;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({
        message: 'Invalid or expired reset token',
        success: false,
      });
    }

    // Hash the new password
    const hashedPassword = await hash(password, 10);

    // Update user password and reset token
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    return NextResponse.json({
      message: 'Password reset successfully',
      success: true,
    });
  } catch (error) {
    console.error('Error resetting password:', error);

    return NextResponse.json({
      success: false,
      message: 'Something went wrong! Please try again later',
    });
  }
}
