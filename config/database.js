import mongoose from "mongoose";
import moment from "moment";

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log(
        `[${moment().format("YYYY-MM-DD HH:mm:ss")}] ✅ Database connected`
      );
    })
    .catch((error) => {
      console.log(
        `[${moment().format(
          "YYYY-MM-DD HH:mm:ss"
        )}] ❌ Database connection error:`,
        error
      );
    });
};
export default connectDB;
