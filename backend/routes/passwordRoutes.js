import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js"; // Your existing user model
import VerificationCode from "../models/VerificationCode.js";
import { sendEmail } from "../services/sendEmail.js"; // Your email utility

const router = express.Router();

// Helper function to generate 6-digit code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to clean up old codes for an email
const cleanupOldCodes = async (email) => {
  await VerificationCode.deleteMany({
    email,
    $or: [
      { used: true },
      { expiresAt: { $lt: new Date() } },
      { attempts: { $gte: 3 } },
    ],
  });
};

// 1. Send verification code
router.post("/send-verification-code", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email es requerido" });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No encontramos una cuenta con ese email" });
    }

    // Clean up old codes for this email
    await cleanupOldCodes(email);

    // Check rate limiting (max 3 codes per 15 minutes)
    const recentCodes = await VerificationCode.countDocuments({
      email: email.toLowerCase(),
      createdAt: { $gt: new Date(Date.now() - 15 * 60 * 1000) },
    });

    if (recentCodes >= 3) {
      return res.status(429).json({
        message:
          "Demasiados intentos. Espera 15 minutos antes de solicitar otro código.",
      });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();

    // Save to database
    await VerificationCode.create({
      email: email.toLowerCase(),
      code: verificationCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    // Email template
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .code-box { 
            background: #f8f9fa; 
            border: 2px dashed #6c757d; 
            padding: 30px; 
            text-align: center; 
            margin: 20px 0; 
            border-radius: 10px;
          }
          .code { 
            font-size: 32px; 
            font-weight: bold; 
            letter-spacing: 8px; 
            color: #007bff;
            font-family: monospace;
          }
          .warning { color: #dc3545; font-size: 14px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Código de Verificación - Navippon</h2>
          <p>Hola,</p>
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
          <p>Tu código de verificación es:</p>
          
          <div class="code-box">
            <div class="code">${verificationCode}</div>
          </div>
          
          <p>Este código:</p>
          <ul>
            <li>Expira en <strong>5 minutos</strong></li>
            <li>Solo puede usarse una vez</li>
            <li>Es válido únicamente para ${email}</li>
          </ul>
          
          <div class="warning">
            <p><strong>¡Importante!</strong> Si no solicitaste este código, ignora este email. Tu cuenta está segura.</p>
          </div>
          
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #6c757d;">
            Este email fue enviado desde Navippon. No respondas a este mensaje.
          </p>
        </div>
      </body>
      </html>
    `;

    // Send email
    await sendEmail({
      to: email,
      subject: "Código de Verificación - Navippon",
      html: emailHTML,
    });

    res.json({
      message: "Código enviado exitosamente",
      email: email.toLowerCase(), // Return email for frontend reference
    });
  } catch (error) {
    console.error("Error sending verification code:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// 2. Verify code
router.post("/verify-code", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email y código son requeridos" });
    }

    // Find the verification record
    const verificationRecord = await VerificationCode.findOne({
      email: email.toLowerCase(),
      code: code.trim(),
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!verificationRecord) {
      // Increment attempts for any existing record
      await VerificationCode.updateMany(
        {
          email: email.toLowerCase(),
          code: code.trim(),
          used: false,
        },
        { $inc: { attempts: 1 } }
      );

      return res.status(400).json({ message: "Código inválido o expirado" });
    }

    // Check attempts limit
    if (verificationRecord.attempts >= 3) {
      return res.status(400).json({
        message: "Demasiados intentos incorrectos. Solicita un nuevo código.",
      });
    }

    // Mark as verified
    verificationRecord.verified = true;
    await verificationRecord.save();

    res.json({ message: "Código verificado exitosamente" });
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// 3. Reset password with verified code
router.post("/reset-password-with-code", async (req, res) => {
  try {
    const { email, code, password } = req.body;

    if (!email || !code || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son requeridos" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Find verified code
    const verificationRecord = await VerificationCode.findOne({
      email: email.toLowerCase(),
      code: code.trim(),
      used: false,
      verified: true,
      expiresAt: { $gt: new Date() },
    });

    if (!verificationRecord) {
      return res
        .status(400)
        .json({ message: "Código inválido, expirado o no verificado" });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Mark code as used and clean up all codes for this email
    await VerificationCode.updateMany(
      { email: email.toLowerCase() },
      { used: true }
    );

    // Clean up old codes
    setTimeout(() => cleanupOldCodes(email), 1000);

    res.json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
