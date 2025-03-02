import React, { Suspense } from 'react';
import styles from "../style/new.module.css";
import Skill from "./Skill"; // Import Skill component if needed

// Define the type for the props
interface TransactionData {
  amount: number;
}

interface LevelXpProps {
  userData: Record<string, string[]>; // replace any with a more specific type if you know the structure of userData
  transactionData: TransactionData[] | null; // Array of transaction objects or null
  auditData: Record<string, string[]>; 
  userXP: number | string; // XP can be a number or string
  userSkill: Record<string, string[]>; // replace any with a more specific type if you know the structure of userSkill
}

// ProgressGraph levels
const levels = [
  { level: 0, label: "Aspiring developer" },
  { level: 10, label: "Beginner developer" },
  { level: 20, label: "Apprentice developer" },
  { level: 30, label: "Assistant developer" },
  { level: 40, label: "Basic developer" },
  { level: 50, label: "Junior developer" },
  { level: 55, label: "Confirmed developer" },
  { level: 60, label: "Full-Stack developer" }
];

// Loading component
const Loading: React.FC = () => {
  return <div>Loading...</div>;
};

// ProgressGraph component
const ProgressGraph: React.FC<{ level: number }> = ({ level }) => {
  // Find the closest level label based on the input level
  const currentLevel = levels.reduce((prev, curr) => (
    Math.abs(curr.level - level) < Math.abs(prev.level - level) ? curr : prev
  ));

  // const progressPercentage = (level / 60) * 100; // Calculate the percentage of the progress

  return (
    <div className={styles.containerLevel}>
    <div className={styles.level}>
      {levels.map((lvl) => (
        <div
          key={lvl.level}
          className={styles.levelMarker}
          style={{ left: `${(lvl.level / 60) * 100}%` }} // Positions level markers based on level
        >
          <div className={styles.levelLabel}>{lvl.label}</div>
          <div
            className={`${styles.blob} ${lvl.level === currentLevel.level ? styles.activeBlob : ''}`}
          ></div>
        </div>
      ))}
    </div>
  </div>
);
};

// Levelxp component
const Levelxp: React.FC<LevelXpProps> = ({ transactionData, userXP}) => {
  const level = transactionData && transactionData.length > 0 ? transactionData[0].amount : 0;
  return (
<div className={styles.levelxpContainer}>
      <h1 className={styles.xp}>XP ➝ {userXP || 'N/A'}</h1>
      <div className={styles.levelxpInfo}>
        <h1 className={styles.levels}>Level ➝ {level === 0 ? 'N/A' : level}</h1>
        
        <Suspense fallback={<Loading />}>
          <ProgressGraph level={level} />
        </Suspense>
      </div>

      {/* Skill Component (Optional, if needed) */}
      <div className={styles.SkillContainer}>
        <Skill /> {/* Insert Skill component here if needed */}
      </div>
    </div>
  );
};

export default Levelxp;
