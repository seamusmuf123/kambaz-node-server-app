import model from "./model.js";

export default function EnrollmentsDao() {
  const enrollUserInCourse = async (
    userId,
    courseId
  ) => {
    return model.create({
      user: userId,
      course: courseId,
    });
  };

  const unenrollUserFromCourse = async (
    userId,
    courseId
  ) => {
    return model.findOneAndDelete({
      user: userId,
      course: courseId,
    });
  };

  const findCoursesForUser = async (userId) => {
    return model.find({ user: userId });
  };

  const unenrollAllUsersFromCourse = async (
    courseId
  ) => {
    return model.deleteMany({
      course: courseId,
    });
  };

  return {
    enrollUserInCourse,
    unenrollUserFromCourse,
    findCoursesForUser,
    unenrollAllUsersFromCourse,
  };
}