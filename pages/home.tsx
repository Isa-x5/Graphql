import React, { useState, useEffect} from "react";
import { useRouter } from 'next/router';
import UserCard from "./usercard";
import "../style/global.css";
import styles from "../style/new.module.css";
import UserInfo from './main';


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwt'); // Retrieve token from localStorage
    if (!token) {
      router.push('/login'); // Redirect to login if no token exists
    }
  }, [router]);

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
