import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, phone, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "navipponweb@gmail.com",
      pass: "hqyn oniv ktay ttzo",  
    },
  });

  const mailOptions = {
    from: email,
    to: "navipponweb@gmail.com",
    subject: `Nuevo mensaje de contacto de ${name}`,
    text: `
Nombre: ${name}
Correo: ${email}
Teléfono: ${phone}
Mensaje: ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: "Mensaje enviado con éxito" });
  } catch (error) {
    console.error("Error enviando correo:", error);
    res.status(500).json({ message: "Error al enviar el mensaje" });
  }
});

export default router;