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
      const studentCourses = dataObj.students[student.id - 1].courses
      const averages = {}

      // course averages
      marksFilter.forEach(mark => {
        const test = Object.values(dataObj.tests).find(test => test.id === mark.test_id)
        const course = Object.values(dataObj.courses).find(course => course.id === test.course_id)
        const weightedMark = mark.mark * (test.weight / 100)
        if (!averages[course.id]) {
          averages[course.id] = 0
          averages[course.id] += weightedMark
        } else {
          averages[course.id] += weightedMark
        }
      })

      // total average
      const totalAvg = Object.values(averages).reduce((prev, curr) => prev + curr, 0) / 3

      
    })
  })
  .catch(error => {
    console.error(error)
  })