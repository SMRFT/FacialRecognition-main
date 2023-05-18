import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApexCharts from 'apexcharts';

function ApexChart() {
  const [employeeData, setEmployeeData] = useState([]);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:7000/attendance/showemp')
      .then((res) => {
        const data = res.data;
        const employees = {};
        data.forEach((employee) => {
          const addedDate = new Date(employee.dateofjoining);
          const month = addedDate.toLocaleString('default', { month: 'long' });
          if (!employees[month]) {
            employees[month] = [];
          }
          employees[month].push(employee.name);
        });
        const employeeData = Object.keys(employees).map((month) => ({
          month,
          count: employees[month].length,
          employees: employees[month].join(', '),
        }));
        setEmployeeData(employeeData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (employeeData.length) {
      const chartOptions = {
        chart: {
          id: 'chartyear',
          type: 'pie',
          height: 400,
          // background: '#F6F8FA',
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
            },
          },
          title: {
            text: 'Employee Count by Month',
            align: 'center',
            margin: 10,
            style: {
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333',
            },
          },
        },
        
        // theme: {
        //   monochrome: {
        //     enabled: true
        //   }
        // },
        plotOptions: {
          pie: {
            colors: ['#000000'],
            dataLabels: {
              enabled: true,
              formatter: (value, { seriesIndex, dataPointIndex, w }) => {
                const employeeCount = employeeData[dataPointIndex].count;
                const employeeNames = employeeData[dataPointIndex].employees;
                return `${employeeCount} employees: ${employeeNames}`;
              },
              style: {
                fontSize: '14px',
              },
            },
          },
        },
        
        series: employeeData.map((e) => e.count),
        labels: employeeData.map((e) => e.month),
        tooltip: {
          y: {
            formatter: (value, { series, seriesIndex, dataPointIndex, w }) => {
              const employeeNames = employeeData[dataPointIndex].employees;
              return `${value} employees: ${employeeNames}`;
            },
          },
        },
      };
      const chart = new ApexCharts(document.querySelector('#chart'), chartOptions);
      chart.render();
    }
  }, [employeeData]);

  
  

  return <div id="chart" style={{width:"45%",marginLeft:"50%",marginTop:"-30%"}}></div>;
}

export default ApexChart;
