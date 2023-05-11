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
          type: 'bar',
          height: 350,
          background: '#F6F8FA',
          toolbar: {
            show: true,
            tools: {
              download: false,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
            },
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            endingShape: 'flat',
            columnWidth: '30%',
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent'],
        },
        series: [
          {
            name: 'Employees',
            data: employeeData.map((e) => e.count),
          },
        ],
        xaxis: {
          categories: employeeData.map((e) => e.month),
          title: {
            text: 'Month',
          },
        },
        yaxis: {
          title: {
            text: 'Number of Employees',
          },
        },
        tooltip: {
          y: {
            formatter: (value) => value + ' employees',
          },
          x: {
            formatter: (value) => value,
          },
          marker: {
            show: false,
          },
        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
            const employeeCount = employeeData[dataPointIndex].count;
            const employeeNames = employeeData[dataPointIndex].employees;
            return `<div class="apexcharts-tooltip-custom">
              <div class="employee-count">${employeeCount} employees</div>
              <div class="employee-names">${employeeNames}</div>
            </div>`;
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
