import React, { useState} from "react";
import UserCard from "./usercard";
import "../style/global.css";
import styles from "../style/new.module.css";
import UserInfo from './main';


export default function Home() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => setIsPopupVisible((prev) => !prev);

  return (
    <div className={styles.homecontainer}>
      <div className={styles.welcometext}>
      <h4>Welcome,</h4>
</div>
      <div className={styles.usercardcontainer}>
  <UserCard onTogglePopup={togglePopup} isPopupVisible={isPopupVisible} />
</div>
<div className={styles.userinfocontainer}>
  <UserInfo />
</div>
    </div>
  );
}
