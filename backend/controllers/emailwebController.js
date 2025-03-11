import asyncHandler from 'express-async-handler';
import Emailweb from '../models/Emailweb.js';

const createEmailweb = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;

  const emailweb = new Emailweb({
    name,
    email,
    phone,
    message,
  });

  const createdEmailweb = await emailweb.save();
  res.status(201).json(createdEmailweb);
});

const getEmailwebs = asyncHandler(async (req, res) => {
  const emailwebs = await Emailweb.find({});
  res.json(emailwebs);
});


const getEmailwebById = asyncHandler(async (req, res) => {
  const emailweb = await Emailweb.findById(req.params.id);

  if (emailweb) {
    res.json(emailweb);
  } else {
    res.status(404);
    throw new Error('Mensaje no encontrado');
  }
});

const deleteEmailweb = asyncHandler(async (req, res) => {
  const emailweb = await Emailweb.findById(req.params.id);

  if (emailweb) {
    await emailweb.remove();
    res.json({ message: 'Mensaje eliminado' });
  } else {
    res.status(404);
    throw new Error('Mensaje no encontrado');
  }
});

export { createEmailweb, getEmailwebs, getEmailwebById, deleteEmailweb };