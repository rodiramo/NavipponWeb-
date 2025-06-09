import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { sendPasswordResetEmail } from "../services/emailService.js";

// FORGOT PASSWORD CONTROLLER
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    console.log(`Password reset requested for: ${email}`);

    // 1. Find user in MongoDB by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        message: "No existe una cuenta con este email",
      });
    }

    console.log(`User found: ${user.name} (ID: ${user._id})`);

    // 2. Generate random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log(`Generated reset token: ${resetToken}`);

    // 3. Hash the token before saving to database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 4. Save hashed token and expiration to user record
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    await user.save();

    console.log(`Token saved to database for user: ${user.email}`);

    // 5. Send email with the original (unhashed) token
    try {
      await sendPasswordResetEmail(user.email, resetToken);

      res.status(200).json({
        message: "Email de recuperación enviado exitosamente",
      });
    } catch (emailError) {
      // If email fails, remove token from database
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      console.error("Email sending failed:", emailError);
      return res.status(500).json({
        message: "Error enviando el email. Intenta nuevamente.",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    next(error);
  }
};

// VERIFY RESET TOKEN CONTROLLER
export const verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    console.log(`Verifying reset token: ${token}`);

    // 1. Hash the token from URL to compare with database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 2. Find user with this token that hasn't expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Token not found or expired");
      return res.status(400).json({
        message: "Token inválido o expirado",
      });
    }

    console.log(`Valid token for user: ${user.email}`);

    res.status(200).json({
      message: "Token válido",
      email: user.email,
    });
  } catch (error) {
    console.error("Verify token error:", error);
    next(error);
  }
};

// RESET PASSWORD CONTROLLER
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    console.log(
      `Password reset attempt with token: ${token.substring(0, 10)}...`
    );

    // 1. Validate new password
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    // 2. Hash the token to compare with database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 3. Find user with valid token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Invalid or expired token for password reset");
      return res.status(400).json({
        message: "Token inválido o expirado",
      });
    }

    console.log(`Resetting password for user: ${user.email}`);

    // 4. Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // 5. Update user in database
    user.password = hashedPassword;
    user.passwordResetToken = undefined; // Remove reset token
    user.passwordResetExpires = undefined; // Remove expiration
    await user.save();

    console.log(`Password successfully updated for: ${user.email}`);

    res.status(200).json({
      message: "Contraseña actualizada exitosamente",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    next(error);
  }
};
