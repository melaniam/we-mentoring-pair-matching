const TYPES_OF_ROLES = {
    student: {
        label: 'Student',
        index: 1,
    },
    individualContributor: {
        label: 'Individual Contributor',
        index: 2,
    },
    firstLevelManager: {
        label: 'First level Manager (managing individual contributors, for example Manager)',
        index: 3,
    },
    secondLevelManager: {
        label: 'Second level Manager (managing managers, for example roles such as Head of, Director)',
        index: 4,
    },
    thirdLevelManager: {
        label: 'Third level Manager (managing managers of managers, for example Director, VP,  CxO)',
        index: 5,
    },
    other: {
        label: 'Other',
        index: 0,
    },
};

const getTypeOfRole = (person) => {
    return Object.values(TYPES_OF_ROLES).find((type) => type.label === person.typeOfRole.trim());
};

const getTopicsOnWhichMenteeCanBeMentoredByMentor = (mentor, mentee) => {
    // do not match members of the same company
    if (mentor.workplace === mentee.workplace) {
        return [];
    }

    // match higher level of seniority with the same or lower levels of seniority
    const mentorTypeOfRole = getTypeOfRole(mentor);
    const menteeTypeOfRole = getTypeOfRole(mentee);

    // if they didn't choose "Other", look at the seniority level
    // else try to map everyone to everyone
    if (mentorTypeOfRole && menteeTypeOfRole) {
        const levelDiff = mentorTypeOfRole.index - menteeTypeOfRole.index;
        if (levelDiff < 0 || levelDiff > 2) {
            return [];
        }
    }

    const mentorTopics = mentor.topicsToMentorOn.split(',');
    const menteeTopics = mentee.topicsToBeMentoredOn.split(',');

    const matchingMentorTopics = mentorTopics.filter((mentorTopic) =>
        menteeTopics.some((menteeTopic) => menteeTopic === mentorTopic)
    );

    return matchingMentorTopics;
};

export const mapMenteesToMentors = (mentors, mentees) => {
    const results = [];

    // First pass
    mentors.forEach((mentor) => {
        mentees.forEach((mentee) => {
            const topics = getTopicsOnWhichMenteeCanBeMentoredByMentor(mentor, mentee);

            if (topics.length > 0) {
                // && !mentor.assignedOnce && !mentee.assigned) {
                // mentor.assignedOnce = true;
                // mentee.assigned = true;

                results.push({
                    mentor: mentor.name,
                    mentorRole: mentor.role,
                    mentorAreaOfExpertise: mentor.areaOfExpertise,
                    mentorTopicsLong: mentor.topicsToMentorOn_long,
                    commonTopics: topics,
                    mentee: mentee.name,
                    menteeRole: mentee.typeOfRole,
                    menteeTopicsLong: mentee.topicsToBeMentoredOn_long,
                    menteeLearningGoal: mentee.learningGoal,
                });
            }
        });
    });

    // Second pass
    // mentors.forEach((mentor) => {
    //     if (mentor.numberOfMentees === '1') {
    //         return;
    //     }

    //     const mentorWantsToBeContacted = mentor.numberOfMentees.includes('contact');

    //     mentees.forEach((mentee) => {
    //         const topics = getTopicsOnWhichMenteeCanBeMentoredByMentor(mentor, mentee);

    //         if (topics.length > 0 && !mentor.assignedTwice && !mentee.assigned) {
    //                 mentor.assignedTwice = true;
    //                 mentee.assigned = true;

    //             results.push({
    //                 mentor: mentor.name,
    //                 mentee: mentee.name,
    //                 topics,
    //                 contact: mentorWantsToBeContacted ? 'contact!' : '',
    //             });
    //         }
    //     });
    // });

    // mentors.forEach((mentor) => {
    //     if (!mentor.assignedOnce) {
    //         results.push({
    //             mentor: mentor.name,
    //             mentee: '-',
    //         });
    //     }
    // });

    // mentees.forEach((mentee) => {
    //     if (!mentee.assigned) {
    //         results.push({
    //             mentor: '-',
    //             mentee: mentee.name,
    //         });
    //     }
    // });

    return results;
};
