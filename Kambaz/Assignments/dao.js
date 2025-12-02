import model from "../Assignments/model.js";
import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao() {

  async function findAssignments(courseId) {
    const assignments = await model.find({ course: courseId });
    return assignments;
  }

  async function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    return model.create(newAssignment);
  }

  async function deleteAssignment(assignmentId) {
    const status = await model.deleteOne({ _id: assignmentId });
    return status;
  }

  async function updateAssignments(assignmentId, assignmentUpdates) {
    return model.updateOne({ _id: assignmentId.toString() }, { $set: assignmentUpdates });
  }

  return {
    findAssignments,
    createAssignment,
    deleteAssignment,
    updateAssignments
  };
}