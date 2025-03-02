import React from 'react';
import styles from "../style/new.module.css";
import {AuditR, AuditRatio} from './ratioR';

// Define the type for the props
interface RatioComponentProps {
    auditTatio: number; 
    totalDown: number;  
    totalUp: number;    
}
// Render the AuditsTable component 
const Ratiocomp: React.FC<RatioComponentProps> = ({ auditTatio, totalDown, totalUp }) => {
    return (
        <div className={styles.ratiocomponent}>
            {}
            <AuditRatio auditRatio={auditTatio} totalUp={totalUp} totalDown={totalDown} />
            <AuditR />
        </div>
    );
};

export default Ratiocomp;
