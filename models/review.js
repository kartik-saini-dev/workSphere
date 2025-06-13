import mongoose from "mongoose";
const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    serviceId: {
      type: String,
      required: true,
    },
    reviewer: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      enum:[1,2,3,4,5]
    },
    desc: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Reviews = mongoose.models.Review || mongoose.model("Review",ReviewSchema);
export default Reviews