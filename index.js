const CSVtoJSON = require('csvtojson');
const fs = require('fs');

const convert = (path) => {
  return new Promise((resolve, reject) => {
    CSVtoJSON().fromFile(path)
      .then(source => {
        resolve(source)
      })
      .catch(error => {
        console.error(error)
      })
  })
}

Promise.all([convert('./data/courses.csv'),
convert('./data/marks.csv'),
convert('./data/students.csv'),
convert('./data/tests.csv')])
  .then(res => {
    const dataObj = {
      courses: { ...res[0] },
      marks: { ...res[1] },
      students: { ...res[2] },
      tests: { ...res[3] }
    }

    Object.values(dataObj.students).forEach(student => {
      const marksFilter = Object.values(dataObj.marks).filter((mark) => mark.student_id === student.id)
      dataObj.students[student.id - 1].courses = []
      const studentCourses = {}

      console.log("start")
      marksFilter.forEach(mark => {
        console.log(mark)
        studentCourses[dataObj.tests[mark.test_id - 1].course_id] = []
      })
      console.log("end")
      // console.log(studentCourses)
    })
  })
  .catch(error => {
    console.error(error)
  })