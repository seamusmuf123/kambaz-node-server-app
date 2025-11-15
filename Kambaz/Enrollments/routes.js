import EnrollmentsDao from "../Enrollments/dao.js";
export default function EnrollmentsRoutes(app, db) {
    const dao = EnrollmentsDao(db);

    const enrollUserInCourse = (req, res) => {
        const { userId, courseId } = req.params;
        dao.enrollUserInCourse(userId, courseId);
        res.sendStatus(200);
    }
    app.post("/api/users/:userId/courses/:courseId/enrollments", enrollUserInCourse);

    const findAllEnrollments = (req, res) => {
        const { enrollments } = db;
        res.json(enrollments);
    }
    app.get("/api/enrollments", findAllEnrollments);

    const findCoursesForUser = (req, res) => {
        const { userId } = req.params;
       const courses =  dao.findCoursesForUser(userId);
       res.json(courses);
    }
    app.get("/api/users/:userId/courses", findCoursesForUser);
}