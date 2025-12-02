import AssignmentsDao from "../Assignments/dao.js";

export default function AssignmentRoutes(app, db) {
  const dao = AssignmentsDao(db);

  const findAssignmentsForCourse = async (req, res) => {
    const { courseId } = req.params;
    const assignments = await dao.findAssignments(courseId);
    res.json(assignments);
  };
  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);

  const createAssignmentForCourse = async (req, res) => {
  const newAssignment = await dao.createAssignment(req.body);
    res.json(newAssignment);
  };
  app.post("/api/assignments/:assignmentId", createAssignmentForCourse);

  const deleteAssignmentForCourse = async (req, res) => {
    const { assignmentId } = req.params;
    const status = await dao.deleteAssignment(assignmentId);
    res.send(status);
  };
  app.delete("/api/assignments/:assignmentId", deleteAssignmentForCourse);

  const updateAssignmentForCourse = async (req, res) => {
    const { assignmentId } = req.params;
    const assignmentUpdates = req.body;
    console.log("Received assignment updates:", assignmentId);
    const updated = await dao.updateAssignments(assignmentId, assignmentUpdates);
    res.send(updated);
  };
  app.put("/api/assignments/:assignmentId", updateAssignmentForCourse);
}
