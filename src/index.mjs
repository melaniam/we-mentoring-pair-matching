import fs from "fs";
import csv from "csv-parser";
import stripBom from "strip-bom-stream";

const pathToMentorsFile = "./input/mentors.csv";
const pathToMenteesFile = "./input/mentees.csv";

const mentorsPromise = new Promise((resolve, reject) => {
    const mentors = [];
    
    fs.createReadStream(pathToMentorsFile)
        .pipe(stripBom())
        .pipe(csv({ separator: "," }))
        .on("data", (data) => mentors.push(data))
        .on("end", async () => {
            resolve(mentors);
        });
});

const menteesPromise = new Promise((resolve, reject) => {
    const mentees = [];
    fs.createReadStream(pathToMenteesFile)
        .pipe(stripBom())
        .pipe(csv({ separator: "," }))
        .on("data", (data) => mentees.push(data))
        .on("end", async () => {
            resolve(mentees);
        });
})
  
  
Promise.all([mentorsPromise, menteesPromise]).then(([mentors, mentees]) => {
    console.log('----- mentors', mentors);
    console.log('----- mentees', mentees);
})


