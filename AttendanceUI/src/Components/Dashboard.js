import DonutChart from 'react-donut-chart';
import * as ReactBootStrap from "react-bootstrap";
import React, { useState, useEffect, useCallback } from "react";
import { Item } from 'semantic-ui-react';
import './Dashboard.css'
import "../Logo.css";
import { Table } from 'react-bootstrap'
const Donut = () => {
    const [donutchartdetails, setDonutchartdetails] = useState([]);
    const [chart, setChart] = useState([]);
    const [isShown, setIsShown] = useState(true);
    let chartdetails = [];
    const handleClick = (event) => {
        setIsShown((current) => !current);
    };
    const donutchart = useCallback(() => {
        fetch("http://127.0.0.1:7000/attendance/showempdesignation")
            .then((res) => res.json())
            .then(
                (data) => {
                    setDonutchartdetails(data);
                },
            );
    }, []);
    useEffect(() => {
        donutchart();
    }, []);
    const reactdonutcharthandleclick = (item, toggled) => {
        if (toggled) {
            // console.log(item);
            fetch("http://127.0.0.1:7000/attendance/empbydesignation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    designation: item.label
                }),
            })
                .then((res) => res.json())
                .then(
                    (data) => {
                        chartdetails = data
                        setChart(chartdetails)
                    },
                    // console.log("Data:", chart)
                );
        }
    };
    useEffect(() => {
    }, [chart]);
    return (
        <div>
            <div style={{ height: '200px', position: 'absolute', width: '100%', top: '50%', left: '-20%', textAlign: 'center', marginTop: '-150px', lineHeight: '20px' }}>
                <DonutChart
                    width={600}
                    data={donutchartdetails}
                    innerRadius={0.6}
                    outerRadius={0.9}
                    onClick={(item, toggled) => { reactdonutcharthandleclick(item, toggled); handleClick(); }}
                />
            </div>
            <br />
            <div style={{

            }}>
                <div
                    className="chartdetails"
                    style={{ display: isShown ? "none" : "block" }}
                >
                    <Table striped
                        bordered="danger"
                        borderColor="danger"
                        hover
                        variant="success">
                        <thead align="center">
                            <tr>
                                <th>
                                    <div
                                        style={{
                                            color: "teal",
                                            fontFamily: "-moz-initial",
                                            fontSize: "18px",
                                        }}
                                    >
                                        <b>Name</b>
                                    </div>
                                </th>
                                <th>
                                    <div
                                        style={{
                                            color: "teal",
                                            fontFamily: "-moz-initial",
                                            fontSize: "18px",
                                        }}
                                    >
                                        <b>Designation</b>
                                    </div>
                                </th>
                                <th>
                                    <div
                                        style={{
                                            color: "teal",
                                            fontFamily: "-moz-initial",
                                            fontSize: "18px",
                                        }}
                                    >
                                        <b>Mobileno</b>
                                    </div>
                                </th>
                                <th>
                                    <div
                                        style={{
                                            color: "teal",
                                            fontFamily: "-moz-initial",
                                            fontSize: "18px",
                                        }}
                                    >
                                        <b>Address</b>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody align="center">
                            {chart.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.designation}</td>
                                    <td>{item.mobile}</td>
                                    <td>{item.address}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
export default Donut;