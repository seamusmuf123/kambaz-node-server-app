import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";
export default function CourseRoutes(app) {
  const dao = CoursesDao();
  const enrollmentsDao = EnrollmentsDao();
  const createCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const newCourse = await dao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  }
  app.post("/api/users/current/courses", createCourse);
  const findAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    res.send(courses);
  }
  app.get("/api/courses", findAllCourses);
  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = await enrollmentsDao.findCoursesForUser(userId);
    res.json(courses);
  };
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
    const status = await dao.deleteCourse(courseId);
    res.send(status);
  }
  app.delete("/api/courses/:courseId", deleteCourse);
  const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  }
  app.put("/api/courses/:courseId", updateCourse);

  const enrollUserInCourse = async (req, res) => {
  try {
    let { uid, cid } = req.params;

    if (uid === "current") {
      const currentUser =
        req.session["currentUser"];

      if (!currentUser) {
        res.sendStatus(401);
        return;
      }

      uid = currentUser._id;
    }

    const enrollment =
      await enrollmentsDao.enrollUserInCourse(
        uid,
        cid
      );

    res.json(enrollment);
  } catch (error) {
    console.error("ENROLL ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
  const unenrollUserFromCourse = async (
  req,
  res
) => {
  try {
    let { uid, cid } = req.params;

    if (uid === "current") {
      const currentUser =
        req.session["currentUser"];

      if (!currentUser) {
        res.sendStatus(401);
        return;
      }

      uid = currentUser._id;
    }

    const deletedEnrollment =
      await enrollmentsDao.unenrollUserFromCourse(
        uid,
        cid
      );

    if (!deletedEnrollment) {
      res.status(404).json({
        message: "Enrollment not found",
      });
      return;
    }

    res.json(deletedEnrollment);
  } catch (error) {
    console.error("UNENROLL ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);

  const findUsersForCourse = async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(cid);
    res.json(users);
  }
  app.get("/api/courses/:cid/users", findUsersForCourse);
}
