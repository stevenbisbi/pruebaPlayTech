import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    date: { type: Date, required: true },
    transactionsCount: { type: Number, required: true },
    productsSold: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
      },
    ],
    totalIncome: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
