// Copy this EXACT content and replace your entire services/emailService.js file

import nodemailer from "nodemailer";

console.log("Loading email service...");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "EMAIL_APP_PASSWORD:",
  process.env.EMAIL_APP_PASSWORD ? "PRESENT" : "MISSING"
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

console.log("Transporter created successfully");

export const sendPasswordResetEmail = async (userEmail, resetToken) => {
  console.log("sendPasswordResetEmail function called");
  console.log("userEmail:", userEmail);
  console.log("resetToken:", resetToken);

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  console.log("resetUrl:", resetUrl);

  const mailOptions = {
    from: `"Navippon Support" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Recuperación de contraseña - Navippon",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container {
              max-width: 600px;
              margin: 0 auto;
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .header {
              background: linear-gradient(135deg,rgb(187, 22, 77) 0%,rgb(75, 8, 33) 100%);
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .header h1 {
              color: white;
              margin: 0;
              font-size: 24px;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
             border: "1.5px solid linear-gradient(135deg, #FF4081 0%, #660F34 100%)";
          
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 50px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Recuperación de Contraseña Navippon</h1>
            </div>
            <div class="content">
              <h2>¡Hola!</h2>
              <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Navippon.</p>
              <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button" >Restablecer Contraseña</a>
              </div>
              
              <p><strong>Este enlace expirará en 1 hora por seguridad.</strong></p>
              
              <p>Si no solicitaste este cambio, puedes ignorar este email. Tu contraseña no será modificada.</p>
              
              <div class="footer">
                <p>Si tienes problemas con el botón, copia y pega este enlace en tu navegador:</p>
                <p style="word-break: break-all; color:#E63675;">${resetUrl}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p>© 2025 Navippon. Todos los derechos reservados.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    console.log("About to send email...");
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${userEmail}`);
    console.log(`Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Failed to send email to ${userEmail}:`, error);
    throw new Error("Error sending email");
  }
};
