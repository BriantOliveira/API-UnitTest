const mongoose = require('mongoose');
// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;

const BookSchema = new Schema(
  {
    title: { type: String, require: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    pages: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  },
);

/** Setting the createdAt == to the current time */
BookSchema.pre('save', (next) => {
  const now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('book', BookSchema);
