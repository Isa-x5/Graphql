
export async function signIn(email: string, password: string) { 
  const credentials = `${email}:${password}`;
  const encodedCredentials = btoa(credentials); // convert string to bytes

  try {
    const response = await fetch("https://learn.reboot01.com/api/auth/signin", { 
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const token = await response.json();  // Token returned as json

      if (token) {
        const cleanToken = token.replace(/^"(.*)"$/, "$1");  // remove the token from the response
        localStorage.setItem("jwt", cleanToken); // set the token to the response 
        console.log("JWT Token saved:", localStorage.getItem('jwt'));

        return cleanToken; // Return the token for use in redirection
      } else {
        return "Login successful, but no token received.";
      }
    } else {
      const errorText = await response.json();
      return errorText; // Return the error message from the response
    }
  } catch (error) {
    console.error("Error during login:", error);
    return "An error occurred. Please try again."; // Return error message
  }
};


export const fetchUserInfo = async () => { // Get user information
  const token = localStorage.getItem('jwt');
  if (!token) return null;

  try {
    const response = await fetch('https://learn.reboot01.com/api/graphql-engine/v1/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
            {
                user {
                    firstName
                    lastName
                    id
                    login
                    email
                    campus
                }
            }
        `,
    }),
  }
);

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('jwt'); // remove  the token from local storage
};
