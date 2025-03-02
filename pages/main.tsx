"use client";

import React, { useEffect, useState } from 'react';
import { USER_INFO_QUERY, TRANSACTION_QUERY, AUDIT_QUERY , TOTAL_XP, User_Skill, Audit_Ratio} from '../app/Query';
import Levelxp from './LevelProg';
import Ratiocomp from './RatioComp';

interface User {
  id: string;
  name: string;
  email: string;
  // Add other user-related fields here
}

interface Transaction {
  id: string;
  amount: number;
  date: string;
  // Add other transaction-related fields here
}

interface AuditData {
  user: {
    auditRatio: number;
    totalUp: number;
    totalDown: number;
  }[];
}

interface UserSkill {
  skillName: string;
  skillLevel: number;
  // Add other skill-related fields here
}

// variables for audit ratio calculations
let auditTatio: number | null = null;
let totalUp: number | null = null;
let totalDown: number | null = null;

const UserInfo: React.FC = () => {
    
    // store fetched data
    const [userAudit, setUserAudit] = useState<AuditData | null>(null);
    const [userSkill, setUserSkill] = useState<UserSkill | null>(null);
    const [userXP, setUserXP] = useState<number | null>(null);
    const [userData, setUserData] = useState<User | null>(null);
    const [transactionData, setTransactionData] = useState<Transaction[] | null>(null);
    const [auditData, setAuditData] = useState<AuditData | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    

    // Function to fetch GraphQL data
    const fetchData = async (query: string) => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt || jwt.split(".").length !== 3) {
            setErrorMessage("Invalid Token");
            return;
        }

        try {
            const response = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                setErrorMessage("Failed to fetch data.");
                return;
            }

            const result = await response.json();
            if (result.errors) {
                setErrorMessage("GraphQL Errors: " + result.errors.map((error: { message: string; }) => error.message).join(", "));
                return;
            }

            return result.data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    // Fetch user info
    const fetchUserInfo = async () => {
        const data = await fetchData(USER_INFO_QUERY);
        if (data) {
            setUserData(data.user);
        }
    };
    // Fetch transaction history
    const fetchTransactionInfo = async () => {
        const data = await fetchData(TRANSACTION_QUERY);
        if (data) {
            setTransactionData(data.transaction);
        }
    };
    // Fetch audit information
    const fetchAuditInfo = async () => {
        const data = await fetchData(AUDIT_QUERY);
        if (data) {
            setAuditData(data.user);
        }
    };
    // Fetch total XP
    const fetchTotalXP = async () => {
        const data = await fetchData(TOTAL_XP);
        if (data) {
            setUserXP(data.transaction_aggregate?.aggregate?.sum?.amount);
        }
    };
    // Fetch user skill
    const fetchUserSkill = async () => {
        const data = await fetchData(User_Skill);
        if (data) {
            setUserSkill(data);
        }
    };
    // Fetch user audit
    const fetchUserAudit = async () => {
        const data = await fetchData(Audit_Ratio);
        if (data) {
            setUserAudit(data);
        }
    };

    useEffect(() => {
        if (userAudit) {
            auditTatio = userAudit.user[0].auditRatio;
            totalUp = userAudit.user[0].totalUp;
            totalDown = userAudit.user[0].totalDown;
        }
    }, [userAudit]); // Added userAudit as a dependency

    useEffect(() => {
        fetchUserAudit();
        fetchUserSkill();
        fetchUserInfo();
        fetchTransactionInfo();
        fetchAuditInfo();
        fetchTotalXP();
    }, []); // Only run once when the component mounts

    return (
        <div>
            {errorMessage && <div id="error-message">{errorMessage}</div>}
            {userData && transactionData && auditData && userSkill && userXP && (
  <Levelxp 
    userData={{ name: [userData.name], email: [userData.email] }} 
    transactionData={transactionData} 
    auditData={{ name: [userData.name], email: [userData.email] }} 
    userXP={userXP} 
    userSkill={{ name: [userData.name], email: [userData.email] }} 
  />
)}
            {userData && <Ratiocomp auditTatio={auditTatio ?? 0} totalDown={totalDown ?? 0} totalUp={totalUp ?? 0} />}
        </div>
    );
};
export default UserInfo;
