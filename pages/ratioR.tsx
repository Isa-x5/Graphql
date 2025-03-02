import { useEffect, useState } from "react";
import styles from "../style/new.module.css";

// Define types for audits and the ratio
interface AuditNode {
    group: {
        captainLogin: string;
        path: string;
    };
}

interface AuditsData {
    pass: { captainLogin: string; projectName: string; status: string }[];
    fail: { captainLogin: string; projectName: string; status: string }[];
}

interface GraphQLResponse {
    data?: {
        user: Array<{
            validAudits: {
                nodes: AuditNode[];
            };
            failedAudits: {
                nodes: AuditNode[];
            };
        }>;
    };
    errors?: { message: string }[];
}

// Audit Ratio Component
export const AuditRatio: React.FC<{ auditRatio: number; totalUp: number; totalDown: number }> = ({ auditRatio, totalUp, totalDown }) => {
    // Calculate percentage for progress bars based on total up/down
    const progressDonePercentage = (totalUp / (totalUp + totalDown)) * 100;
    const progressReceivedPercentage = (totalDown / (totalUp + totalDown)) * 100;

    return (
        <div className={styles.auditContainer}>
            <h3 className={styles.auditTitle}>Audits ratio</h3>
            {/* Progress bar for completed audits */}
            <div className={styles.progressBar}>
                <div
                    className={styles.progressDone}
                    style={{ width: `${progressDonePercentage}%` }}
                ></div>
            </div>
            {/* Progress bar for received audits */}
            <div className={styles.progressBar}>
                <div
                    className={styles.progressReceived}
                    style={{ width: `${progressReceivedPercentage}%` }}
                ></div>
            </div>
            {/* Audit Ratio Display */}
            <div className={styles.auditRatio}>
                <span className={styles.ratioNumber}>{auditRatio}</span>
                <span className={styles.ratioText}>😲!</span>
            </div>
            {/* Audit Info Display */}
            <div className={styles.auditInfo}>
                <div className={styles.auditData}>{totalUp} MB<br />Completed ↑</div>
                <div className={styles.auditData}>{totalDown} MB<br />Received ↓</div>
            </div>
        </div>
    );
};

// Main Component for Fetching and Displaying Data
export const AuditR: React.FC = () => {
    const [audits, setAudits] = useState<AuditsData>({
        pass: [],
        fail: [],
    });
    const [error, setError] = useState<string | null>(null);

    // Add state for audit ratio and total up/down (example values)
    const [, setAuditRatio] = useState(0);
    const [, setTotalUp] = useState(0);
    const [, setTotalDown] = useState(0);

    // Fetch user audits on component mount
    useEffect(() => {
        async function fetchUserAudits() {
            const jwt = localStorage.getItem("jwt");
            if (!jwt || jwt.split(".").length !== 3) {
                console.error("Invalid Token");
                setError("Error: Invalid Token");
                return;
            }
            try {
                const response = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        query: `query {
                            user {
                                validAudits: audits_aggregate(where: {grade: {_gte: 1}}) {
                                    nodes {
                                        group {
                                            captainLogin
                                            path
                                        }
                                    }
                                }
                                failedAudits: audits_aggregate(where: {grade: {_lt: 1}}) {
                                    nodes {
                                        group {
                                            captainLogin
                                            path
                                        }
                                    }
                                }
                            }
                        }`,
                    }),
                });

                if (!response.ok) {
                    console.error("Failed to fetch audits info:", response.statusText);
                    setError("Failed to fetch audits info");
                    return;
                }

                const result: GraphQLResponse = await response.json();
                if (result.errors) {
                    console.error("GraphQL Errors:", result.errors);
                    setError("GraphQL Errors: " + result.errors.map((err) => err.message).join(", "));
                    return;
                }

                const userData = result.data?.user[0];
                if (!userData) {
                    setError("No user data found");
                    console.error("No user data found");
                    return;
                }

                const validAuditNodes = userData.validAudits?.nodes || [];
                const failedAuditNodes = userData.failedAudits?.nodes || [];

                const passAudits = validAuditNodes.map((node) => ({
                    captainLogin: node.group.captainLogin,
                    projectName: node.group.path.split("/").pop() || "Unknown",
                    status: "Pass",
                }));
                const failAudits = failedAuditNodes.map((node) => ({
                    captainLogin: node.group.captainLogin,
                    projectName: node.group.path.split("/").pop() || "Unknown",
                    status: "Fail",
                }));

                setAudits({
                    pass: passAudits,
                    fail: failAudits,
                });

                // Calculate audit ratio (example calculation)
                const totalPass = passAudits.length;
                const totalFail = failAudits.length;
                setTotalUp(totalPass * 50); // Example: 50 MB per pass
                setTotalDown(totalFail * 30); // Example: 30 MB per fail
                setAuditRatio((totalPass / (totalPass + totalFail)) * 100);
            } catch (error) {
                console.error("Fetch error:", error);
                setError("Error fetching audits");
            }
        }

        fetchUserAudits();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            {/* Display Audits Table */}
            <div className={styles.auditsContainer}>
                <section className={`${styles.auditSection} ${styles.passAudits}`}>
                    <h2 className={styles.header}>Passed Audits</h2>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Captain Login - Project Name</th>
                                <th className={styles.th}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {audits.pass.length > 0 ? (
                                audits.pass.map((audit, index) => (
                                    <tr key={index}>
                                        <td className={styles.td}>{`${audit.captainLogin} - ${audit.projectName}`}</td>
                                        <td className={`${styles.td} ${styles.pass}`}>{audit.status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className={`${styles.td} ${styles.noAudits}`}>No pass audits available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>

                <section className={`${styles.auditSection} ${styles.failAudits}`}>
                    <h2 className={styles.header}>Failed Audits</h2>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Captain Login - Project Name</th>
                                <th className={styles.th}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {audits.fail.length > 0 ? (
                                audits.fail.map((audit, index) => (
                                    <tr key={index}>
                                        <td className={styles.td}>{`${audit.captainLogin} - ${audit.projectName}`}</td>
                                        <td className={`${styles.td} ${styles.fail}`}>{audit.status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className={`${styles.td} ${styles.noAudits}`}>No fail audits available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
            </div>

            {/* Display Audit Ratio */}
        </div>
    );
};

export default AuditR;
