import AssignmentsDao from "../Assignments/dao.js";

export default function AssignmentRoutes(app, db) {
  const dao = AssignmentsDao(db);

  app.get("/api/courses/:courseId/assignments", (req, res) => {
    const { courseId } = req.params;
    const assignments = dao.findAssignments(courseId);
    res.json(assignments);
  });

  app.post("/api/courses/:courseId/assignments", (req, res) => {
    const { courseId } = req.params;
    const newAssignment = dao.createAssignment({
      ...req.body,
      course: courseId,
    });
    res.json(newAssignment);
  });

  app.delete("/api/assignments/:id", (req, res) => {
    dao.deleteAssignment(req.params.id);
    res.sendStatus(200);
  });

  app.put("/api/assignments/:id", (req, res) => {
    const updated = dao.updateAssignment(req.params.id, req.body);
    res.json(updated);
  });
}
