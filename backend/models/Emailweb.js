import mongoose from 'mongoose';

const emailwebSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Emailweb = mongoose.model('Emailweb', emailwebSchema);

export default Emailweb;