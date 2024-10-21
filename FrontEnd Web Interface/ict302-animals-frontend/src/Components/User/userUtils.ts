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

 // Utility function to update frontend context
export const updateFrontendContext = async (frontendContext: any, user: { uid: string; displayName: string | null; email: string | null }) => {
    frontendContext.user.valid = true;
    frontendContext.user.contextRef.current.userId = user.uid;
    frontendContext.user.contextRef.current.username = user.displayName || '';
    frontendContext.user.contextRef.current.email = user.email || '';
    frontendContext.user.contextRef.current.initials = user.displayName
      ? user.displayName.split(' ').map(name => name[0]).join('')
      : '';
    frontendContext.user.contextRef.current.loggedInState = true;

  };