const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pin: {
      type: String,
      required: true,
    },
    // email: {
    //   type: String,
    //   required: true,
    // },
    bloodUnit: {
      type: Number,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    donors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Donor",
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    //   required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
