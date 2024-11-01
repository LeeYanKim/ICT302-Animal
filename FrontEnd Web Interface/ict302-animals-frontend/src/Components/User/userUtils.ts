import API from '../../Internals/API';

// Create a function to store the user in the backend
export const storeUserInBackend = async (
    frontendContext: any,
    user: { uid: string; displayName: string | null; email: string | null }, 
    idToken: string, 
  ) => {
    try {
      const payload = {
        userName: user.displayName, // Set the username (can be from the sign-up form or default)
        userEmail: user.email, // Use the user's email
        permissionLevel: "user", // Set the default permission level
      };
  
      console.log("Payload being sent:", payload);  // Debugging step
  
      const response = await fetch(API.User(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`, // Send Firebase token
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Failed to store user in the backend");
      }
  
      const result = await response.json();
  
      // Extract and return the userId from the backend response
      const userId = result.userId;
      console.log("User ID from backend:", userId);

      frontendContext.user.contextRef.current.userId = userId;
      console.log("User stored/updated successfully in backend with userId:", frontendContext.user.contextRef.current.userId);
  
      return userId; // Return userId to use in the calling component if needed
  
    } catch (error) {
      console.error("Error storing user in backend:", error);
      throw error; // Propagate the error to handle in the calling component
    }
  };

const fetchUserAnimals = async (userId: string) => {
  try {
    const animalAccessResponse = await fetch(API.Download() + `/user/${userId}/animalIDs`);
    if (animalAccessResponse.ok) {
      const animalIDs = await animalAccessResponse.json();
      const animalDetailsPromises = animalIDs.map(async (animalID: string) =>
          await fetch(API.Download() + `/animals/details/${animalID}`)
      );
      const animalDetailsResponses: any[] = [];
      for (const animalID of animalIDs) {
        animalDetailsResponses.push(await fetch(API.Download() + `/animals/details/${animalID}`).then(response => response.json()));
      }
      return animalDetailsResponses;
    } else {
      console.warn('Failed to fetch animals data');
      return null;
    }
  } catch (error) {
    console.warn(error);
    return null;
  }
}

 // Utility function to update frontend context
export const updateFrontendContext = async (frontendContext: any, user: { uid: string; displayName: string | null; email: string | null }) => {
    frontendContext.user.valid = true;
    console.log("User ID from backend:", user.uid);
    //frontendContext.user.contextRef.current.userId = user.uid;
    frontendContext.user.contextRef.current.username = user.displayName || '';
    frontendContext.user.contextRef.current.email = user.email || '';
    frontendContext.user.contextRef.current.initials = user.displayName
      ? user.displayName.split(' ').map(name => name[0]).join('')
      : '';
    frontendContext.user.contextRef.current.loggedInState = true;
    let animals = await fetchUserAnimals(frontendContext.user.contextRef.current.userId);
    frontendContext.user.contextRef.current.userAnimals = animals ? animals : [];
  };

export const updateLoggedInUserAnimals = async (frontendContext: any) => {
  let animals = await fetchUserAnimals(frontendContext.user.contextRef.current.userId);
  frontendContext.user.contextRef.current.userAnimals = animals ? animals : [];
}

  /**
 * Validates if the input contains only whitelisted characters.
 * @param {string} input - The input string to validate.
 * @param {string} whitelist - A string of allowed characters (regex format).
 * @returns {boolean} - True if the input contains only whitelisted characters, false otherwise.
 */
export const validateInput = (input: string, whitelist: string): boolean => {
  const regex = new RegExp(`^[${whitelist}]+$`);
  return regex.test(input);
};

/**
 * Sanitizes the input by removing characters not in the whitelist.
 * @param {string} input - The input string to sanitize.
 * @param {string} whitelist - A string of allowed characters (regex format).
 * @returns {string} - The sanitized input string.
 */
export const sanitizeInput = (input: string, whitelist: string): string => {
  const regex = new RegExp(`[^${whitelist}]`, 'g');
  return input.replace(regex, '');
};

/**
 * Checks if the password meets security requirements and returns the strength level.
 * @param {string} password - The password to check.
 * @returns {string} - Returns 'Weak', 'Medium', or 'Strong' based on the criteria.
 */
export const checkPasswordStrength = (password: string): string => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strengthConditions = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;

  if (password.length < minLength) return 'Weak';
  if (strengthConditions === 1 || strengthConditions === 2) return 'Weak';
  if (strengthConditions === 3) return 'Medium';
  if (strengthConditions === 4) return 'Strong';

  return 'Weak';
};

/**
 * Provides feedback on which criteria are not met by the password.
 * @param {string} password - The input password to check.
 * @returns {string[]} - An array of feedback messages indicating what the password is missing.
 */
export const passwordFeedback = (password: string): string[] => {
  const feedback: string[] = [];
  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters long.');
  }
  if (!/[A-Z]/.test(password)) {
    feedback.push('Password must contain at least one uppercase letter.');
  }
  if (!/[a-z]/.test(password)) {
    feedback.push('Password must contain at least one lowercase letter.');
  }
  if (!/[0-9]/.test(password)) {
    feedback.push('Password must contain at least one number.');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    feedback.push('Password must contain at least one special character.');
  }
  return feedback;
};