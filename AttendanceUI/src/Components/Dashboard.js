import DonutChart from 'react-donut-chart';
import * as ReactBootStrap from "react-bootstrap";
import React, { useState, useEffect, useCallback } from "react";
import { Item } from 'semantic-ui-react';
import './Dashboard.css'
import axios from "axios";
import Footer from "./Footer"
import Chart from 'chart.js/auto';
import { Bar,Doughnut } from "react-chartjs-2";
// import ApexChart from './Apexchart';
import Chart1 from "react-apexcharts";
import Chart3 from "./Chart.js";
import Chart4 from "./Slchart"
// import "../Logo.css";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import ReactFC from "react-fusioncharts";
import { People, Block, FreeBreakfast } from '@material-ui/icons';
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
    ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);
    const [employeeData, setEmployeeData] = useState([]);

    useEffect(() => {
      axios
        .get("http://127.0.0.1:7000/attendance/breakdetails")
        .then((response) => {
          setEmployeeData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }, []);
  
    const activeEmployees = employeeData.employees_active || [];
    const inactiveEmployees = employeeData.employees_not_active || [];
    const breakEmployees = employeeData.employees_on_break || [];
  
    const chartData = [
      {
        label: "Active Employees",
        value: activeEmployees.length,
        color: "#36A2EB",
      },
      {
        label: "Inactive Employees",
        value: inactiveEmployees.length,
        color: "#FF6384",
      },
      {
        label: "Break Employees",
        value: breakEmployees.length,
        color: "#8ED0E4",
      },
    ];
  
    const dataSource = {
      chart: {
        caption: "Employee Status Distribution",
        plottooltext: "<b>$value</b> employees are $label",
        showlegend: "1",
        showpercentvalues: "0", // set to 0 to show count instead of percentage
        legendposition: "bottom",
        usedataplotcolorforlabels: "1",
        theme: "fusion",
      },
      data: chartData,
    };
    
  
  
    const activeEmployeesCount = activeEmployees.length;
const inactiveEmployeesCount = inactiveEmployees.length;
const breakEmployeesCount = breakEmployees.length;
   
    const [deletedEmployees2, setDeletedEmployees2] = useState([]);
    const [chartOptions, setChartOptions] = useState({
      series: [
        {
          name: "Deleted Employees",
          data: [],
        },
      ],
      options: {
        chart: {
          type: "bar",
          height: 350,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: true,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        xaxis: {
          categories: [],
          title: {
            text: "Months",
          },
          labels: {
            style: {
              fontSize: "14px",
            },
          },
        },
        yaxis: {
          title: {
            text: "Number of Employees Realiving",
          },
        },
        fill: {
          opacity: 1,
        },
      },
    });
    
    useEffect(() => {
      axios
        .get("http://127.0.0.1:7000/attendance/deleted-employees/")
        .then((res) => {
          const employees = res.data;
          const months = Array.from({ length: 12 }, (_, i) => {
            const date = new Date();
            date.setUTCMonth(i);
            return date.toLocaleString('default', { month: 'long' });
          });
          const currentYear = new Date().getFullYear(); // get current year
          const employeeCounts = Array.from({ length: 12 }, () => 0);
          const employeeNames = Array.from({ length: 12 }, () => []);
          employees.forEach((employee) => {
            const date = new Date(employee.deleted_at);
            if (date.getFullYear() === currentYear) { // count employees only for current year
              const monthIndex = date.getMonth();
              employeeCounts[monthIndex]++;
              employeeNames[monthIndex].push(employee.name);
            }
          });
          const employeeCountByMonth = months.map((month, i) => {
            return { month: month, count: employeeCounts[i], names: employeeNames[i] };
          });
          const tooltip = {
            y: {
              formatter: function (val) {
                return val + " employees";
              },
            },
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
              const month = w.globals.labels[dataPointIndex];
              const count = series[seriesIndex][dataPointIndex];
              const names = seriesIndex === 0 ? employeeCountByMonth[dataPointIndex].names : null;
              let content = `<div class="tooltip-header">${month} ${currentYear}</div>`; // show current year in tooltip
              content += `<div class="tooltip-body">${count} employees</div>`;
              if (names) {
                content += `<div class="tooltip-body">Employees: ${names.join(", ")}</div>`;
              }
              return content;
            },
          };
          setChartOptions((prevState) => ({
            ...prevState,
            series: [
              {
                name: "Added Employees",
                data: employeeCountByMonth.map((entry) => entry.count),
              },
            ],
            options: {
              ...prevState.options,
              xaxis: {
                categories: months,
                title: {
                  text: "Months",
                },
                labels: {
                  style: {
                    fontSize: "14px",
                  },
                },
              },
              tooltip: tooltip,
            },
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);

    
    const [chartData4, setChartData4] = useState({
      options: {
        xaxis: {
          categories: [],
          title: {
            text: "Months",
          }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " employee(s)";
            },
          },
        },
      },
      series: [
        {
          name: "Employees Added",
          data: [],
        },
      ],
    });
    useEffect(() => {
      axios
        .get("http://127.0.0.1:7000/attendance/showemp")
        .then((res) => {
          // Map the data to an object with month and employee name properties
          const employeeData = res.data.map((employee) => {
            const addedDate = new Date(employee.
              dateofjoining);
            return {
              month: addedDate.toLocaleString("default", { month: "long" }),
              name: employee.name,
            };
          });
          
          // Group the employee data by month
          const groupedData = employeeData.reduce((acc, employee) => {
            if (!acc[employee.month]) {
              acc[employee.month] = [];
            }
            acc[employee.month].push(employee);
            return acc;
          }, {});
          
          // Populate the chart data with the grouped employee data
          const categories = Object.keys(groupedData);
          const seriesData = categories.map((category) => {
            return groupedData[category].length;
          });
          setChartData4({
            options: {
              xaxis: {
                categories: categories,
                title: {
                  text: "Months"
                }
              },
              tooltip: {
                y: {
                  formatter: function (val, { seriesIndex, dataPointIndex }) {
                    const employeeName = groupedData[categories[seriesIndex]][dataPointIndex].name;
                    return `${val} employee(s) added by ${employeeName}`;
                  },
                },
              },
              
            },
            series: [
              {
                name: "Employees Added",
                data: seriesData,
              },
            ],
          });
          
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    const [userExportData, setUserExportData] = useState([]);
    
    useEffect(() => {
      const fetchData = async () => {
        const data = [];
        for (let i = 1; i <= 12; i++) {
          const response = await fetch("http://127.0.0.1:7000/attendance/EmployeeSummaryExport", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              month: i,
              year: currentYear,
            }),
          });
          const result = await response.json();
          const totalUsers = result.length;
          const slTakenByUser = result.reduce((acc, user) => acc + user.SL_Taken, 0);
          const slTakenPercentage = (slTakenByUser / (totalUsers * 1)) * 100; // calculate percentage for each month
          const slNotTakenPercentage = 100 - slTakenPercentage;
          data.push({ month: i, slTakenPercentage, slNotTakenPercentage }); // add percentages to data array
        }
        setUserExportData(data);
      };
      fetchData();
    }, []);
    
    const chartOptions8 = {
      chart: {
        type: "pie",
      },
      series: userExportData.map((monthData) => monthData.slTakenPercentage), // use percentages from userExportData to generate the pie chart
      labels: userExportData.map((monthData) => `Month ${monthData.month}`),
      pie: {
        offsetX: -10,
        offsetY: 30,
      },
    };
    
    
    
    



    return (
        <body className='dashboard'>

        <div class="container5">
  <div>
    <People />
    <span>{activeEmployeesCount} Active Employees</span>
  </div>
  <div>
    <Block />
    <span>{inactiveEmployeesCount} Not Active Employees</span>
  </div>
  <div>
    <FreeBreakfast />
    <span>{breakEmployeesCount} Employees on Break</span>
  </div>
</div>
<div style={{ marginLeft:"-10%", width: '500px', height: '300px',marginTop:"5%" }}>
=
  <ReactFC
      type="pie3d"
      width="120%"
      height="120%"
      dataFormat="JSON"
      dataSource={dataSource}
    />
</div>

<div style={{marginLeft:"30%",marginTop:"-22%", width: '400px', height: '200px'}}>
    <Chart4 />
  </div>
    <div style={{marginLeft:"-10%",marginTop:"10%"}}>
        <Chart1
            options={chartOptions.options}
            series={chartOptions.series}
            type="bar"
            height={500}
            width={500}
        />
    </div>
   <div style={{marginLeft:"-50%",marginTop:"15%" }}>
<Chart3/>
</div>
      </body>
      
    )
}
export default Donut;