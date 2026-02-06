// Validation utility functions for resume builder forms

// Input filter helpers - strip unwanted characters as user types
export const stripNumbers = (value) => {
  return value.replace(/[0-9]/g, "");
};

export const stripLetters = (value) => {
  return value.replace(/[^0-9.]/g, "");
};

export const stripNonPhone = (value) => {
  return value.replace(/[^0-9+\-() ]/g, "");
};

// Email validation
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Phone validation (supports various formats)
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const phoneRegex = /^[\d\s\-+()]{7,20}$/;
  return phoneRegex.test(phone.trim());
};

// URL validation
export const isValidUrl = (url) => {
  if (!url) return true; // Optional fields
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
};

// Check if string contains only letters and spaces (no numbers)
export const isTextOnly = (text) => {
  if (!text) return true;
  const textOnlyRegex = /^[a-zA-Z\s.,'-]+$/;
  return textOnlyRegex.test(text.trim());
};

// Length validation
export const isValidLength = (text, min, max) => {
  if (!text) return min === 0;
  const length = text.trim().length;
  return length >= min && length <= max;
};

// GPA validation
export const isValidGPA = (gpa) => {
  if (!gpa) return true; // Optional
  const num = parseFloat(gpa);
  return !isNaN(num) && num >= 0 && num <= 10;
};

// Date validation (end date should be after start date)
export const isEndDateValid = (startDate, endDate, isCurrent) => {
  if (isCurrent) return true;
  if (!startDate || !endDate) return true;
  return new Date(endDate) >= new Date(startDate);
};

// Validation rules for each form
export const validatePersonalInfo = (data) => {
  const errors = {};

  if (!data.full_name?.trim()) {
    errors.full_name = "Full name is required";
  } else if (!isValidLength(data.full_name, 2, 100)) {
    errors.full_name = "Name must be 2-100 characters";
  }

  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.phone?.trim()) {
    errors.phone = "Phone number is required";
  } else if (!isValidPhone(data.phone)) {
    errors.phone = "Please enter a valid phone number";
  }

  if (data.linkedin && !isValidUrl(data.linkedin)) {
    errors.linkedin = "Please enter a valid LinkedIn URL";
  }

  if (data.github && !isValidUrl(data.github)) {
    errors.github = "Please enter a valid GitHub URL";
  }

  if (data.website && !isValidUrl(data.website)) {
    errors.website = "Please enter a valid website URL";
  }

  return errors;
};

export const validateEducation = (education) => {
  const errors = {};

  if (!education.institute?.trim()) {
    errors.institute = "Institute name is required";
  } else if (!isTextOnly(education.institute)) {
    errors.institute = "Institute name should not contain numbers";
  } else if (!isValidLength(education.institute, 2, 200)) {
    errors.institute = "Institute name must be 2-200 characters";
  }

  if (!education.degree?.trim()) {
    errors.degree = "Degree is required";
  } else if (!isTextOnly(education.degree)) {
    errors.degree = "Degree should not contain numbers";
  } else if (!isValidLength(education.degree, 2, 100)) {
    errors.degree = "Degree must be 2-100 characters";
  }

  if (education.field_of_study && !isTextOnly(education.field_of_study)) {
    errors.field_of_study = "Field of study should not contain numbers";
  }

  if (education.gpa && !isValidGPA(education.gpa)) {
    errors.gpa = "GPA must be between 0 and 10";
  }

  return errors;
};

export const validateExperience = (experience) => {
  const errors = {};

  if (!experience.company?.trim()) {
    errors.company = "Company name is required";
  } else if (!isValidLength(experience.company, 2, 200)) {
    errors.company = "Company name must be 2-200 characters";
  }

  if (!experience.position?.trim()) {
    errors.position = "Position is required";
  } else if (!isValidLength(experience.position, 2, 100)) {
    errors.position = "Position must be 2-100 characters";
  }

  if (!experience.start_date) {
    errors.start_date = "Start date is required";
  }

  if (!experience.is_current && !experience.end_date) {
    errors.end_date = "End date is required (or mark as current)";
  } else if (
    !isEndDateValid(
      experience.start_date,
      experience.end_date,
      experience.is_current,
    )
  ) {
    errors.end_date = "End date must be after start date";
  }

  if (
    experience.description &&
    !isValidLength(experience.description, 0, 2000)
  ) {
    errors.description = "Description must be under 2000 characters";
  }

  return errors;
};

export const validateProject = (project) => {
  const errors = {};

  if (!project.name?.trim()) {
    errors.name = "Project name is required";
  } else if (!isValidLength(project.name, 2, 100)) {
    errors.name = "Project name must be 2-100 characters";
  }

  if (project.type && !isValidLength(project.type, 0, 50)) {
    errors.type = "Project type must be under 50 characters";
  }

  if (project.description && !isValidLength(project.description, 0, 1000)) {
    errors.description = "Description must be under 1000 characters";
  }

  return errors;
};

export const validateSkill = (skill, existingSkills) => {
  if (!skill?.trim()) {
    return "Skill cannot be empty";
  }
  if (skill.trim().length > 50) {
    return "Skill must be under 50 characters";
  }
  if (
    existingSkills?.some((s) => s.toLowerCase() === skill.trim().toLowerCase())
  ) {
    return "This skill already exists";
  }
  if (existingSkills?.length >= 30) {
    return "Maximum 30 skills allowed";
  }
  return null;
};

export const validateProfessionalSummary = (summary) => {
  if (summary && summary.length > 500) {
    return "Summary must be under 500 characters";
  }
  return null;
};
