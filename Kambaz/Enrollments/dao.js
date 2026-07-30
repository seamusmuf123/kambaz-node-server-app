import model from "./model.js";

export default function EnrollmentsDao() {
  const findAllEnrollments = () => model.find();

  const enrollUserInCourse = async (userId, courseId) => {
    const existingEnrollment = await model.findOne({
      user: userId,
      course: courseId,
    });

    if (existingEnrollment) {
      return existingEnrollment;
    }

    return model.create({
      user: userId,
      course: courseId,
    });
  };

  const unenrollUserFromCourse = (userId, courseId) =>
    model.findOneAndDelete({
      user: userId,
      course: courseId,
    });

  const findEnrollmentsForUser = (userId) =>
    model.find({
      user: userId,
    });

  const unenrollAllUsersFromCourse = (courseId) =>
    model.deleteMany({
      course: courseId,
    });

  const findEnrollment = (userId, courseId) =>
  model.findOne({
    user: userId,
    course: courseId,
  });

  return {
    findAllEnrollments,
    enrollUserInCourse,
    unenrollUserFromCourse,
    findEnrollmentsForUser,
    unenrollAllUsersFromCourse,
    findEnrollment,
  };
}