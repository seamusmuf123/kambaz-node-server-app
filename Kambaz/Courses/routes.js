import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
  const dao = CoursesDao();
  const enrollmentsDao = EnrollmentsDao();

  const createCourse = async (req, res) => {
    try {
      const currentUser =
        req.session["currentUser"];

      if (!currentUser) {
        res.sendStatus(401);
        return;
      }

      const newCourse =
        await dao.createCourse(req.body);

      await enrollmentsDao.enrollUserInCourse(
        currentUser._id,
        newCourse._id
      );

      res.json(newCourse);
    } catch (error) {
      console.error(
        "CREATE COURSE ERROR:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  };

  const findAllCourses = async (
    req,
    res
  ) => {
    try {
      const courses =
        await dao.findAllCourses();

      res.json(courses);
    } catch (error) {
      console.error(
        "FIND COURSES ERROR:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  };

  const findCourseById = async (
    req,
    res
  ) => {
    try {
      const course =
        await dao.findCourseById(
          req.params.courseId
        );

      if (!course) {
        res.status(404).json({
          message: "Course not found",
        });
        return;
      }

      res.json(course);
    } catch (error) {
      console.error(
        "FIND COURSE ERROR:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  };

  const findCoursesForEnrolledUser =
    async (req, res) => {
      try {
        let { userId } = req.params;

        if (userId === "current") {
          const currentUser =
            req.session["currentUser"];

          if (!currentUser) {
            res.sendStatus(401);
            return;
          }

          userId = currentUser._id;
        }

        const courses =
          await enrollmentsDao.findCoursesForUser(
            userId
          );

        res.json(courses);
      } catch (error) {
        console.error(
          "FIND USER COURSES ERROR:",
          error
        );

        res.status(500).json({
          message: error.message,
        });
      }
    };

  const deleteCourse = async (
    req,
    res
  ) => {
    try {
      const { courseId } = req.params;

      await enrollmentsDao
        .unenrollAllUsersFromCourse(
          courseId
        );

      const status =
        await dao.deleteCourse(courseId);

      if (status.deletedCount === 0) {
        res.status(404).json({
          message: "Course not found",
        });
        return;
      }

      res.json(status);
    } catch (error) {
      console.error(
        "DELETE COURSE ERROR:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  };

  const updateCourse = async (
    req,
    res
  ) => {
    try {
      const { courseId } = req.params;

      const status =
        await dao.updateCourse(
          courseId,
          req.body
        );

      if (status.matchedCount === 0) {
        res.status(404).json({
          message: "Course not found",
        });
        return;
      }

      res.json(status);
    } catch (error) {
      console.error(
        "UPDATE COURSE ERROR:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  };

  const enrollUserInCourse = async (
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

      const enrollment =
        await enrollmentsDao
          .enrollUserInCourse(uid, cid);

      res.json(enrollment);
    } catch (error) {
      console.error(
        "ENROLL ERROR:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  };

  const unenrollUserFromCourse =
    async (req, res) => {
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

        const status =
          await enrollmentsDao
            .unenrollUserFromCourse(
              uid,
              cid
            );

        if (status.deletedCount === 0) {
          res.status(404).json({
            message:
              "Enrollment not found",
          });
          return;
        }

        res.json(status);
      } catch (error) {
        console.error(
          "UNENROLL ERROR:",
          error
        );

        res.status(500).json({
          message: error.message,
        });
      }
    };

  const findUsersForCourse = async (
    req,
    res
  ) => {
    try {
      const { cid } = req.params;

      const users =
        await enrollmentsDao
          .findUsersForCourse(cid);

      res.json(users);
    } catch (error) {
      console.error(
        "FIND COURSE USERS ERROR:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  };

  app.post(
    "/api/users/current/courses",
    createCourse
  );

  app.get(
    "/api/courses",
    findAllCourses
  );

  app.get(
    "/api/courses/:courseId",
    findCourseById
  );

  app.get(
    "/api/users/:userId/courses",
    findCoursesForEnrolledUser
  );

  app.delete(
    "/api/courses/:courseId",
    deleteCourse
  );

  app.put(
    "/api/courses/:courseId",
    updateCourse
  );

  app.post(
    "/api/users/:uid/courses/:cid",
    enrollUserInCourse
  );

  app.delete(
    "/api/users/:uid/courses/:cid",
    unenrollUserFromCourse
  );

  app.get(
    "/api/courses/:cid/users",
    findUsersForCourse
  );
}