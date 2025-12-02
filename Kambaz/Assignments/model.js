import mongoose from "mongoose";
import schema from "./Schema.js";
const model = mongoose.model("AssignmentModel", schema);
export default model;