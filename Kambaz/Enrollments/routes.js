import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app) {
  const dao = EnrollmentsDao();

  const findAllEnrollments = async (req, res) => {
    try {
      const enrollments = await dao.findAllEnrollments();
      res.json(enrollments);
    } catch (error) {
      console.error("FIND ENROLLMENTS ERROR:", error);

      res.status(500).json({
        message: error.message,
      });
    }
  };

  app.get("/api/enrollments", findAllEnrollments);
}