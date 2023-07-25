'use strict';

const userModel = (sequelize, DataTypes) => sequelize.define('userDataTEMP', {
  userId: {type: DataTypes.string, allowNull: false, unique: true},
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  preferred_name: { type: DataTypes.STRING, allowNull: true },
  date_of_birth: { type: DataTypes.DATE, allowNull: false },
  pronouns: { type: DataTypes.STRING, allowNull: true },
  em_name: { type: DataTypes.STRING, allowNull: false },
  em_relationship: { type: DataTypes.STRING, allowNull: false },
  em_phone: { type: DataTypes.STRING, allowNull: false },
  em_knowledge: { type: DataTypes.STRING, allowNull: false },
  em_name2: { type: DataTypes.STRING, allowNull: true },
  em_relationship2: { type: DataTypes.STRING, allowNull: true },
  em_phone2: { type: DataTypes.STRING, allowNull: true },
  em_knowledge2: { type: DataTypes.STRING, allowNull: true },
  q1: { type: DataTypes.ENUM([
    'Female',
    'Genderqueer',
    'Intersex',
    'Male',
    'Transgender',
    'Transgender Male to Female (MTF)',
    'Transgender Female to Male (FTM)',
    'Use your own words to describe your gender Identity',
  ]), allowNull: true }, // How would you describe your gender (How do you identify)?
  q1_other: { type: DataTypes.STRING, allowNull: true },
  q2: { type: DataTypes.ENUM([
    'Asexual',
    'Bisexual',
    'Gay',
    'Lesbian',
    'Pansexual',
    'Queer',
    'Questioning',
    'Straight',
    'Use your own words to describe your sexual orientation',
  ]), allowNull: true }, // How would you describe your sexual orientation (How do you Identify)?
  q2_other: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  contact: { type: DataTypes.ENUM(['Email', 'Phone', 'Text', 'Do not contact']), allowNull: true },
  ethnicity: { type: DataTypes.ENUM([
    'American Indian/Native American',
    'Black/African American',
    'Chinese',
    'Filipino',
    'Hispanic, Latino, Spanish',
    'Japanese',
    'Korean',
    'Other Asian',
    'Multiracial',
    'Other Pacific Islander',
    'South Asian',
    'Vietnamese',
    'White',
    'Use your own words to describe your race/ethnicity identity',
  ]), allowNull: true },
  ethnicity_other: { type: DataTypes.STRING, allowNull: true },
  englishUnderstanding: { type: DataTypes.ENUM(['No', 'Yes-If yes, which language?']), allowNull: true },
  englishUnderstanding_other: { type: DataTypes.STRING, allowNull: true },
  englishAtHome: { type: DataTypes.ENUM(['No', 'Yes-If yes, which language?']), allowNull: true },
  englishAtHome_other: { type: DataTypes.STRING, allowNull: true },
  q3: { type: DataTypes.STRING, allowNull: true },// What health conditions should we know about? For example, do you have allergies, dietary restrictions, are you taking medications you feel we should know about, have a medical condition that requires attention, etc.; or do you need accommodations due to a disability?
  safePlace: { type: DataTypes.ENUM(['Yes', 'No']), allowNull: true },
  q5: { type: DataTypes.ENUM(['Yes', 'No']), allowNull: true }, // Have you ever or are you currently experiencing homelessness (i.e. couch surfing, camping, car sleeping, staying with friends, etc.)?
  q6: { type: DataTypes.ENUM(['Yes', 'No']), allowNull: true }, // When you are hungry do you have enough food to eat?
  q7: { type: DataTypes.ENUM(['Yes', 'No']), allowNull: true }, // Do you have a safe place to sleep at night?
  q8: { type: DataTypes.ENUM(['Yes', 'No']), allowNull: true }, // Do you currently have a case manager (Such as DSHS, Comprehensive or Triumph)?
  q9: { type: DataTypes.ENUM(['Yes', 'No']), allowNull: true }, // Are you currently enrolled in school?
  school: { type: DataTypes.STRING, allowNull: true },
  q10: { type: DataTypes.ENUM(['Yes', 'No']), allowNull: true }, // Now or in the past, have you or people close to you experienced stress due to citizenship status?
  q11: { type: DataTypes.ENUM(['Yes', 'No']), allowNull: true }, // Are you now or have you ever been in the foster care system?
  q12: { type: DataTypes.ENUM(['Yes', 'No']), allowNull: true }, // Are you experiencing a disability (Physical, emotional, sensory, or mental)?
  q13: { type: DataTypes.ENUM(['Yes', 'No']), allowNull: true }, // Are you currently or have you ever been involved in the juvenile justice system?
  q14: { type: DataTypes.ENUM(['Yes', 'No']), allowNull: true }, // Have you ever been the victim of a crime, or had to deal with the impact of a crime on your life (Such as bullying, childhood physical abuse, robbery, etc.)?
  q15: { type: DataTypes.ENUM(['Yes', 'No']), allowNull: true }, // Have you ever contemplated suicide or engaged in self-harm?
  q16: { type: DataTypes.ENUM(['Yes', 'No']), allowNull: true }, // Have you ever been in jail or convicted of a crime?
  q17: { type: DataTypes.ENUM(['Yes', 'No']), allowNull: true }, // Have you ever struggled with alcohol or substance abuse?
  q18: { type: DataTypes.ENUM(['Yes', 'No']), allowNull: true }, // Have you or a close family member ever served in the military?
  q19: { type: DataTypes.ENUM(['Yes', 'No']), allowNull: true }, // Do you have medical insurance?
  q20: { type: DataTypes.ENUM([
    'Problems with Family',
    'Coming out questions',
    'Feelings of sadness or depression',
    'Health/medical concerns',
    'Questions about religion',
    'HIV testing',
    'Problems at school',
    'Alcohol, drug, or tobacco concerns',
    'Loneliness or isolation',
    'Safer sex information',
    'Sexually transmitted infections',
    'New social opportunities',
    'Want to help others/volunteer',
    'Other (please specify)',
  ]), allowNull: true }, // What specific needs, questions or concerns brought you to Helen House? (Please Check all that apply):
  q20_other: { type: DataTypes.STRING, allowNull: true },
  q21: { type: DataTypes.ENUM([
    'Friend',
    'Social media',
    'Faith/Religious Community',
    'Helen House Flyer',
    'Online search/website',
    'School staff or teacher',
    'Parent or guardian',
    'Other (please specify)',
  ]), allowNull: true }, // How did you learn about Helen House?
  q21_other: { type: DataTypes.STRING, allowNull: true },
  q22: { type: DataTypes.ENUM([
    '1',
    '2',
    '3',
    '4',
    '5']), allowNull: true }, // On a scale of 1-5, how do you feel your life is going most of the time? (Please circle one):
  q23: { type: DataTypes.ENUM([
    '1',
    '2',
    '3',
    '4',
    '5']), allowNull: true }, // ON a scale of 1-5, how much support do you feel you currently have? (Please circle one):
  q24: { type: DataTypes.ENUM([
    'A follower',
    'A leader',
    'Angry',
    'Artistic/creative',
    'Athletic',
    'Content',
    'Happy',
    'In counseling',
    'Intellectual',
    'Lonely',
    'On parole/probation',
    'Optimistic',
    'Out to family',
    'Out to friends',
    'Out to no one',
    'Outgoing',
    'Pessimistic',
    'Shy',
    'Vegetarian/Vegan',
    'Other (specify)',
  ]), allowNull: true }, // Please check all that apply to you:
  q24_other: { type: DataTypes.STRING, allowNull: true },
  //intake: { type: DataTypes.ENUM(['staff1, admin1, staff2, admin2']), allowNull: true }, // ! Challenge: How do we get this to be the username of the person who is logged in?
  q25: { type: DataTypes.STRING, allowNull: true }, // Lastly, we would love you to help us create Helen House’s community agreements. What are some guidelines you would like to honor as part of your time at Helen House? (for example: no judgmental statements, no stealing, etc.)
  q26: { type: DataTypes.STRING, allowNull: true },
  q27: { type: DataTypes.STRING, allowNull: true },
});

module.exports = userModel;
