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

const TYPES_OF_AREAS_OF_EXPERTISE = {
    engineering: {
        label: 'Engineering',
        id: 'engineering',
    },
    qa: {
        label: 'QA',
        id: 'qa',
    },
    projectManagement: {
        label: 'Project Management',
        id: 'projectManagement',
    },
    productManagement: {
        label: 'Product Management',
        id: 'productManagement',
    },
    design: {
        label: 'Design',
        id: 'design',
    },
};

const getTypeOfRole = (person) => {
    return Object.values(TYPES_OF_ROLES).find((type) => type.label === person.typeOfRole);
};

const getAreaOfExpertise = (area) => {
    const typeOfArea = Object.values(TYPES_OF_AREAS_OF_EXPERTISE).find((areaType) => areaType.label === area);
    return typeOfArea ? typeOfArea.id : null;
};

const menteeCanBeMappedToMentor = (mentor, mentee) => {
    // do not match members of the same company
    if (mentor.workplace === mentee.workplace) {
        return null;
    }

    // match higher level of seniority with the same or lower levels of seniority
    const mentorTypeOfRole = getTypeOfRole(mentor);
    const menteeTypeOfRole = getTypeOfRole(mentee);

    // if they didn't choose "Other", look at the seniority level
    // else try to map everyone to everyone
    if (mentorTypeOfRole && menteeTypeOfRole) {
        if (mentorTypeOfRole.index < menteeTypeOfRole.index) {
            return null;
        }
    }

    // do not match people if they have different areas of expertise
    const mentorAreaOfExpertise = getAreaOfExpertise(mentor.areaOfExpertise);
    const menteeAreaOfExpertise = getAreaOfExpertise(mentee.topicsToBeMentoredOn);
    if (mentorAreaOfExpertise !== menteeAreaOfExpertise) {
        return null;
    }

    return mentee;
};

export const mapMenteesToMentors = (mentors, mentees) => {
    return mentors.map((mentor) => {
        const mappedMentees = mentees.map((mentee) => menteeCanBeMappedToMentor(mentor, mentee));

        return {
            ...mentor,
            mappedMentees: mappedMentees.filter((mentee) => mentee !== null),
        };
    });
};
