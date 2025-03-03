import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "../style/usercard.css";
import  {logout}  from "../app/auth";

// Define TypeScript interfaces based on the expected data structure
interface UserAttrs {
  firstName?: string;
  lastName?: string;
  email?: string;
  addressCountry?: string;
  genders?: string;
  CPRnumber?: string;
  PhoneNumber?: string;
  dateOfBirth?: string;
  qualification?: string;
  Degree?: string;
}

interface UserData {
  attrs: UserAttrs;
}

const USER_INFO_QUERY = `
  {
    user {
      attrs
    }
  }
`;

interface UserCardProps {
  onTogglePopup: () => void;
  isPopupVisible: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ onTogglePopup, isPopupVisible }) => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null); // Replace any with proper type
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt || jwt.split(".").length !== 3) {
      setErrorMessage("Invalid Token");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: USER_INFO_QUERY }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data.");
      }

      const result = await response.json();
      if (result.errors) {
        throw new Error(
          "GraphQL Errors: " +
            result.errors.map((error: { message: string }) => error.message).join(", ")
        );
      }

      const userInfo = result.data?.user;
      if (Array.isArray(userInfo) && userInfo.length > 0) {
        setUserData(userInfo[0]);
      } else {
        setErrorMessage("No user info available.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Remove JWT token by calling the logout function
    logout();
    
    // Optionally log the token removal
    console.log("JWT token removed:", localStorage.getItem("jwt"));
    
    // Redirect to the login page
    router.push("/login");
  };

  return (
    <div>
      {/* User Info Button */}
      <button type="button" onClick={onTogglePopup} className="user-info-btn">
        🥷 
      </button>

      {/* User Info Popup */}
      {isPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="logoutBtn" onClick={handleLogout}>
              Logout
            </button>

            <h1 className="welcome">Code Ninja 🥷</h1>
            <div className="line"></div>
            <div className="col">
              {loading ? (
                <p>Loading user data...</p>
              ) : errorMessage ? (
                <p>{errorMessage}</p>
              ) : userData?.attrs ? (
                <div className="div">
                  <h1 id="name" className="name">
                    {userData.attrs.firstName || "N/A"} {userData.attrs.lastName || "N/A"}!
                  </h1>
                  <p id="email" className="paragraph">
                    {userData.attrs.email || "N/A"}
                  </p>
                  <p id="campus" className="paragraph">
                    {userData.attrs.addressCountry || "N/A"}
                  </p>
                  <p id="gender" className="paragraph">
                    Gender: {userData.attrs.genders || "N/A"}
                  </p>
                  <p id="cpr" className="paragraph">
                    CPR Number: {userData.attrs.CPRnumber || "N/A"}
                  </p>
                  <p id="phone" className="paragraph">
                    Phone: {userData.attrs.PhoneNumber || "N/A"}
                  </p>
                  <p id="dob" className="paragraph">
                    Date of Birth: {userData.attrs.dateOfBirth ? new Date(userData.attrs.dateOfBirth).toLocaleDateString('en-GB') : "N/A"}
                  </p>
                  <p id="qualification" className="paragraph">
                    Qualification: {userData.attrs.qualification || "N/A"}
                  </p>
                  <p id="degree" className="paragraph">
                    Degree: {userData.attrs.Degree || "N/A"}
                  </p>
                </div>
              ) : (
                <div>No user information available.</div>
              )}
            </div>
            <button type="button" onClick={onTogglePopup} className="close-btn">
            ❌
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
