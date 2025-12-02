import mongoose from "mongoose";
import schema from "./Schema.js";
const model = mongoose.model("CourseModel", schema);
export default model;