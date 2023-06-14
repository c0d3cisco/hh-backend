'use strict';

const userModel = (sequelize, DataTypes) => sequelize.define('userData', {
  userId: {type: DataTypes.INTEGER, allowNull: false, unique: true},
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: true },
  preferred_name: { type: DataTypes.STRING, allowNull: true },
  date_of_birth: { type: DataTypes.DATE, allowNull: true },
  pronouns: { type: DataTypes.STRING, allowNull: true },
  em_name: { type: DataTypes.STRING, allowNull: true },
  em_relationship: { type: DataTypes.STRING, allowNull: true },
  em_phone: { type: DataTypes.STRING, allowNull: true },
  em_knowledge: { type: DataTypes.STRING, allowNull: true },
  em_name2: { type: DataTypes.STRING, allowNull: true },
  em_relationship2: { type: DataTypes.STRING, allowNull: true },
  em_phone2: { type: DataTypes.STRING, allowNull: true },
  em_knowledge2: { type: DataTypes.STRING, allowNull: true },
  // TODO: Finish out the enum fields for q1, q2, q20, q21
  // TODO: figure out multiple selections for enum type
  q1: { type: DataTypes.ENUM(['Female', 'Genderqueer', 'Intersex', 'Male']), allowNull: true }, // How would you describe your gender (How do you identify)?
  q1_other: { type: DataTypes.STRING, allowNull: true },
  q2: { type: DataTypes.ENUM(['Asexual', 'Bisexual', 'Queer', 'Gay']), allowNull: true }, // How would you describe your sexual orientation (How do you Identify)?
  q2_other: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  contact: { type: DataTypes.ENUM(['Email', 'Phone', 'Text', 'Do not contact']), allowNull: true },
  ethnicity: { type: DataTypes.ENUM(['American Indian/Native American', 'Japanese']), allowNull: true },
  ethnicity_other: { type: DataTypes.STRING, allowNull: true },
  englishUnderstanding: { type: DataTypes.ENUM(['None', 'Some', 'Fluent']), allowNull: true },
  englishUnderstanding_other: { type: DataTypes.STRING, allowNull: true },
  englishAtHome: { type: DataTypes.ENUM(['Yes', 'No']), allowNull: true },
  englishAtHome_other: { type: DataTypes.STRING, allowNull: true },
  q3: { type: DataTypes.STRING, allowNull: true },// What health conditions should we know about? For example, do you have allergies, dietary restrictions, are you taking medications you feel we should know about, have a medical condition that requires attention, etc.; or do you need accommodations due to a disability?
  q4: { type: DataTypes.STRING, allowNull: true }, // We work with youth from a wide variety of backgrounds who bring a variety of experiences. We would like to know more about your experiences and background:
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
  q20: { type: DataTypes.ENUM(['Problems with Family', 'Coming out questions']), allowNull: true }, // What specific needs, questions or concerns brought you to Helen House? (Please Check all that apply):
  q20_other: { type: DataTypes.STRING, allowNull: true },
  q21: { type: DataTypes.ENUM(['Friend', 'Parent or guardian']), allowNull: true }, // How did you learn about Helen House?
  q21_other: { type: DataTypes.STRING, allowNull: true },
  q22: { type: DataTypes.ENUM(['1 - Terrible', '2', '3', '4', '5 - Excellent']), allowNull: true }, // On a scale of 1-5, how do you feel your life is going most of the time? (Please circle one):
  q23: { type: DataTypes.ENUM(['1 - No Support', '2', '3', '4', '5 - Excellent Support']), allowNull: true }, // ON a scale of 1-5, how much support do you feel you currently have? (Please circle one):
  q24: { type: DataTypes.ENUM(['A follower', 'A leader']), allowNull: true }, // Please check all that apply to you:
  q24_other: { type: DataTypes.STRING, allowNull: true },
  //intake: { type: DataTypes.ENUM(['staff1, admin1, staff2, admin2']), allowNull: true }, // ! Challenge: How do we get this to be the username of the person who is logged in?
  q25: { type: DataTypes.STRING, allowNull: true }, // Lastly, we would love you to help us create Helen House’s community agreements. What are some guidelines you would like to honor as part of your time at Helen House? (for example: no judgmental statements, no stealing, etc.)
  intakeStaff: { type: DataTypes.STRING, allowNull: true },
  intakeDate: { type: DataTypes.DATE, allowNull: true },
  intakeNotes: { type: DataTypes.STRING, allowNull: true },
});

module.exports = userModel;
