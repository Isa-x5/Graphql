import React, { useEffect, useState } from "react";
import Style from "../style/new.module.css";
import * as d3 from "d3";

interface Skill {
    type: string;
    amount: number;
}

const SkillChart: React.FC = () => {
    const [technicalSkills, setTechnicalSkills] = useState<Skill[]>([]);
    const [codeSkills, setCodeSkills] = useState<Skill[]>([]);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        const jwt = localStorage.getItem("jwt");

        if (!jwt || jwt.split(".").length !== 3) {
            console.error("Invalid Token");
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
                    query: `
                        query skills {
                            transaction(
                                where: {
                                    type: {_like: "%skill%"},
                                    object: {type: {_eq: "project"}}
                                }
                                order_by: [{type: asc}, {createdAt: desc}]
                                distinct_on: type
                            ) {
                                amount
                                type
                            }
                        }
                    `,
                }),
            });

            const result = await response.json();

            if (result.errors) {
                console.error("GraphQL Errors:", result.errors);
                return;
            }

            const fetchedSkills = result.data?.transaction || [];
            const technicalSkills = fetchedSkills.filter((skill: Skill) =>
                [
                    "skill_prog", "skill_algo", "skill_sys-admin", "skill_front-end", "skill_back-end",
                    "skill_stats", "skill_ai", "skill_game", "skill_tcp",
                ].includes(skill.type)
            );
            
            const codeSkills = fetchedSkills.filter((skill: Skill) =>
                [
                    "skill_go", "skill_js", "skill_html", "skill_css", "skill_unix", "skill_docker", "skill_sql", "skill_git",
                ].includes(skill.type)
            );

            setTechnicalSkills(technicalSkills);
            setCodeSkills(codeSkills);
        } catch (error) {
            console.error("Error fetching skills data:", error);
        }
    };

    useEffect(() => {
        if (technicalSkills.length > 0) {
            drawChart("#skills-chart-tech", technicalSkills, "rgba(0, 128, 255, 0.4)", "#007bff");
        }
        if (codeSkills.length > 0) {
            drawChart("#skills-chart-code", codeSkills, "rgba(255, 165, 0, 0.4)", "#ff8c00");
        }
    }, [technicalSkills, codeSkills]);

    const drawChart = (selector: string, data: Skill[], fill: string, stroke: string) => {
        const width = 300;
        const height = 300;
        const radius = Math.min(width, height) / 3;
        const angleSlice = (Math.PI * 2) / data.length;
        const maxValue = Math.max(...data.map(d => d.amount), 1);
    
        d3.select(selector).selectAll("*").remove();
    
        const svg = d3.select(selector)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);
    
        // Create the tooltip element
        const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("color", "red")
        .style("border", "1px solid red")
        .style("padding", "5px")
        .style("border-radius", "5px")
        .style("font-weight", "bold")  
    
        // Generate circular gridlines (Spiderweb effect)
        const gridLevels = 5;
        for (let i = 1; i <= gridLevels; i++) {
            const r = (i / gridLevels) * radius;
            svg.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", r)
                .style("fill", "none")
                .style("stroke", "#ccc")
                .style("stroke-dasharray", "2,2");
        }
    
        // Generate axes lines
        data.forEach((_, i) => {
            const angle = i * angleSlice;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
    
            svg.append("line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", x)
                .attr("y2", y)
                .style("stroke", "#aaa")
                .style("stroke-width", 1);
        });
    
        // Convert skill data into tuples of [angle, amount]
        const skillData = data.map((d, i) => [i * angleSlice, d.amount] as [number, number]);
    
        const radarLine = d3.lineRadial<[number, number]>()
            .radius(d => (d[1] / maxValue) * radius)
            .angle(d => d[0])
            .curve(d3.curveLinearClosed);
    
        // Draw radar shape
        svg.append("path")
            .datum(skillData)
            .attr("d", radarLine)
            .attr("fill", fill)
            .attr("stroke", stroke)
            .attr("stroke-width", 2);
    
        // Add skill labels
        data.forEach((d, i) => {
            const angle = i * angleSlice;
            const x = Math.cos(angle) * (radius + 15);
            const y = Math.sin(angle) * (radius + 15);
    
            svg.append("text")
                .attr("x", x)
                .attr("y", y)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .style("font-size", "10px")
                .style("fill", "none")
                .text(d.type.replace("skill_", "").replace("-", " "));
        });
    
        // Add hover functionality to the path (polygon)
        svg.selectAll("path")
            .on("mouseover", function() {
                tooltip.style("visibility", "visible");
            })
            .on("mousemove", function(event) {
                const mouseX = event.pageX;
                const mouseY = event.pageY;
    
                // Position tooltip at mouse cursor
                tooltip.style("left", mouseX + 10 + "px")
                    .style("top", mouseY - 10 + "px");
    
                // Display percentage inside the tooltip
                const index = Math.floor(event.offsetX / (width / data.length)); // assuming the point is clicked within the correct slice
                const skill = data[index];
                tooltip.text(`${skill.type.replace("skill_", "").replace("-", " ")}: ${skill.amount}%`);
            })
            .on("mouseout", function() {
                tooltip.style("visibility", "hidden");
            });
    };
    

    return (
        <div className={Style.Skill}>
            <div className={Style.skillsAmount}>
                <div className={Style.skillsAmount1}>
                    <h3 className={Style.h3m}>Technical Skills</h3>
                    <p className={Style.Code}>
                        {technicalSkills.length > 0
                            ? technicalSkills.map(skill => `${skill.type.replace("skill_", "").replace("-", " ")}: ${skill.amount}%`).join(", ")
                            : "No technical skills data available"
                        }
                    </p> 
                </div>
                <div className={Style.skillsAmount2}>
                    <h3 className={Style.h3z}>Skills</h3>
                    <p className={Style.code2}>
                        {codeSkills.length > 0
                            ? codeSkills.map(skill => `${skill.type.replace("skill_", "").replace("-", " ")}: ${skill.amount}%`).join(", ")
                            : "No skills data available"
                        }
                    </p>
                </div>
            </div>
            <div className={Style.ChartContainer}>
                <svg id="skills-chart-tech" className={Style.Chart1} width="400" height="400"></svg>
                <svg id="skills-chart-code" className={Style.Chart2} width="400" height="400"></svg>
            </div>
        </div>
    );
};

export default SkillChart;
