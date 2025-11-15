import { v4 as uuidv4 } from "uuid";


export default function EnrollmentsDao(db) {
  function enrollUserInCourse(userId, courseId) {
    const { enrollments } = db;
    enrollments.push({ _id: uuidv4(), user: userId, course: courseId });
  }

   function findCoursesForUser(userId) {
   const { enrollments, courses } = db;
   return courses.filter((course) =>
     enrollments.some((enrollment) => enrollment.course === course._id && enrollment.user
    === userId)
   );
 }

  return { enrollUserInCourse, findCoursesForUser };
}
