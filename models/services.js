import mongoose from "mongoose";
import Review from "./review";
import User from "./user";

const { Schema } = mongoose;

const serviceSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensuring that userId is always present
    },
    title: {
      type: String,
      required: true,
      trim: true, // Trimming unnecessary spaces
    },
    description: {
      type: String,
      required: true,
      trim: true, // Trimming unnecessary spaces
    },
    shortDesc: {
      type: String,
      required: true,
      trim: true, // Trimming unnecessary spaces
    },
    category: {
      type: String,
      required: true,
    },
    pricing: {
      basic: {
        price: {
          type: Number,
          required: true,
          min: 0, // Ensuring the price cannot be negative
        },
        revisions: {
          type: Number,
          required: true,
          min: 0, // Ensuring revisions cannot be negative
        },
        features: {
          type: [String],
          required: true,
          validate: {
            validator: (v) => v.length > 0,
            message: "Features cannot be empty",
          },
        },
        time: {
          type: Number,
          required: true,
          min: 1, // Time should be at least 1 to ensure valid delivery time
        },
      },
      standard: {
        price: {
          type: Number,
          required: false,
          min: 0,
        },
        revisions: {
          type: Number,
          required: false,
          min: 0,
        },
        features: {
          type: [String],
          required: false,
        },
        time: {
          type: Number,
          required: false,
          min: 1,
        },
      },
      premium: {
        price: {
          type: Number,
          required: false,
          min: 0,
        },
        revisions: {
          type: Number,
          required: false,
          min: 0,
        },
        features: {
          type: [String],
          required: false,
        },
        time: {
          type: Number,
          required: false,
          min: 1,
        },
      },
    },
    images: {
      type: [String],
      required: false,
      validate: {
        validator: (v) => Array.isArray(v) && v.every((url) => typeof url === 'string'),
        message: "Images should be an array of strings",
      },
    },
    videoURL: {
      type: String,
      required: false,
    },
    sales: {
      type: Number,
      default: 0,
    },
    requirements: [{
      question: { type: String },
      type: { type: String }
    }],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    keywords: {
      type: [String],
      required: true,
    },
    totalStars: {
      type: Number,
      default: 0,
    },
    starNumber: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const services = mongoose.models.service || mongoose.model("service", serviceSchema);

export default services;
