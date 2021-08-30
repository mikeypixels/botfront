import React from 'react';

// import './bootstrap.min.css';
// import './icons.min.css';
// import './app.min.css';
// import './feather.css';
// import './style.css';
import $ from 'jquery';
import ReactApexChart from 'react-apexcharts';
import { Options } from 'docker-cli-js';
// import ApexCharts from 'apexcharts';
// import ApexCharts from "apexcharts";
// import Chart from "react-apexcharts";

var months = [];
var user_count = [];
var user_msgs = [];

var series = null;
var options = null;

$(document).ready(function () {
    getChats();
});

// series = [{
//     name: 'series',
//     data: [31, 40, 28, 51, 42, 109, 100]
// }];

// options = {
//     chart: {
//       height: 350,
//       type: 'line'
//     },
//     dataLabels: {
//       enabled: false
//     },
//     stroke: {
//       curve: 'smooth'
//     },
//     xaxis: {
//       type: 'datetime',
//       categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
//     },
//     tooltip: {
//       x: {
//         format: 'dd/MM/yy HH:mm'
//       },
//     },
//   };

export default function Analytics() {

    getChats();

    return (
        <div className='page-content'>
            <div className='container-fluid'>
                <div className='row'>
                    <div class='col-md-6 col-xl-3'>
                        <div class='card'>
                            <div class='card-body'>
                                {/* <div class="float-end mt-2">
                                        </div> */}
                                <div>
                                    <h4 class='mb-1 mt-1 text-center'>
                                        <span data-plugin='counterup'>Today</span>
                                    </h4>
                                </div>
                                <div class='row'>
                                    <div class='col-md-4'>
                                        <p class='text-muted mb-0'>
                                            <i aria-hidden='true' class='user icon'></i>
                                            Users
                                        </p>
                                        <p class='text-muted mt-3 mb-0 '>
                                            <span
                                                style={{ color: '#f1b44c', fontSize: 20 }}
                                                class=' me-1 today-users'
                                            ></span>
                                        </p>
                                    </div>
                                    <div class='col-md-4 offset-md-4'>
                                        <p class='text-muted mb-0'>
                                            <i
                                                aria-hidden='true'
                                                class='comment icon'
                                            ></i>
                                            Messages
                                        </p>
                                        <p class='text-muted mt-3 mb-0 '>
                                            <span
                                                style={{ color: '#5b73e8', fontSize: 20 }}
                                                class=' me-1 today-msgs'
                                            ></span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class='col-md-6 col-xl-3'>
                        <div class='card' id='analytic-card'>
                            <div class='card-body'>
                                <div>
                                    <h4 class='mb-1 mt-1 text-center'>
                                        <span data-plugin='counterup'>This Week</span>
                                    </h4>
                                </div>
                                <div class='row'>
                                    <div class='col-md-4'>
                                        <p class='text-muted mb-0'>
                                            <i aria-hidden='true' class='user icon'></i>
                                            Users
                                        </p>
                                        <p class='text-muted mt-3 mb-0 '>
                                            <span
                                                style={{ color: '#f1b44c', fontSize: 20 }}
                                                class=' me-1 this-week-users'
                                            ></span>
                                        </p>
                                    </div>
                                    <div class='col-md-4 offset-md-4'>
                                        <p class='text-muted mb-0'>
                                            <i
                                                aria-hidden='true'
                                                class='comment icon'
                                            ></i>
                                            Messages
                                        </p>
                                        <p class='text-muted mt-3 mb-0 '>
                                            <span
                                                style={{ color: '#5b73e8', fontSize: 20 }}
                                                class=' me-1 this-week-msgs'
                                            ></span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class='col-md-6 col-xl-3'>
                        <div class='card'>
                            <div class='card-body'>
                                <div>
                                    <h4 class='mb-1 mt-1 text-center'>
                                        <span data-plugin='counterup'>This Month</span>
                                    </h4>
                                </div>
                                <div class='row'>
                                    <div class='col-md-4'>
                                        <p class='text-muted mb-0 '>
                                            <i aria-hidden='true' class='user icon'></i>
                                            Users
                                        </p>
                                        <p class='text-muted mt-3 mb-0 '>
                                            <span
                                                style={{ color: '#f1b44c', fontSize: 20 }}
                                                class=' me-1 this-month-users'
                                            ></span>
                                        </p>
                                    </div>
                                    <div class='col-md-4 offset-md-4'>
                                        <p class='text-muted mb-0'>
                                            <i
                                                aria-hidden='true'
                                                class='comment icon'
                                            ></i>
                                            Messages
                                        </p>
                                        <p class='text-muted mt-3 mb-0 '>
                                            <span
                                                style={{ color: '#5b73e8', fontSize: 20 }}
                                                class=' me-1 this-month-msgs'
                                            ></span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class='col-md-6 col-xl-3'>
                        <div class='card'>
                            <div class='card-body'>
                                <div>
                                    <h4 class='mb-1 mt-1 text-center'>
                                        <span data-plugin='counterup'>This Year</span>
                                    </h4>
                                </div>
                                <div class='row'>
                                    <div class='col-md-4'>
                                        <p class='text-muted mb-0'>
                                            <i aria-hidden='true' class='user icon'></i>
                                            Users
                                        </p>
                                        <p class='text-muted mt-3 mb-0 '>
                                            <span
                                                style={{ color: '#f1b44c', fontSize: 20 }}
                                                class=' me-1 this-year-users'
                                            ></span>
                                        </p>
                                    </div>
                                    <div class='col-md-4 offset-md-4'>
                                        <p class='text-muted mb-0'>
                                            <i
                                                aria-hidden='true'
                                                class='comment icon'
                                            ></i>
                                            Messages
                                        </p>
                                        <p class='text-muted mt-3 mb-0 '>
                                            <span
                                                style={{ color: '#5b73e8', fontSize: 20 }}
                                                class=' me-1 this-year-msgs'
                                            ></span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xl-6'>
                        <div className='card'>
                            <div className='card-body'>
                                <h4 className='card-title mb-4' class='users_chart'>
                                    Users
                                </h4>
                                <div
                                    id='line_chart_dashed'
                                    class='users_chart'
                                    className='apex-charts'
                                    dir='ltr'
                                />
                                {/* <ReactApexChart
                                    options={options}
                                    series={series}
                                    type='line'
                                    height={350}
                                /> */}
                            </div>
                        </div>
                    </div>
                    <div className='col-xl-6'>
                        <div className='card'>
                            <div className='card-body'>
                                <h4 className='card-title mb-4' class='msgs_chart'>
                                    Messages
                                </h4>
                                <div
                                    id='line_chart_data'
                                    class='msgs_chart'
                                    className='apex-charts'
                                    dir='ltr'
                                />
                                {/* <ReactApexChart
                                    options={options}
                                    series={series}
                                    type='line'
                                    height={350}
                                /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

('use strict');

// get data to fill graph
function getChats() {
    $.ajax({
        url: 'https://belltro.xyz:5072/chats',
        headers: {
            'Content-Type': 'application/json',
        },
        type: 'GET',
        success: function (data) {
            months = [];
            user_count = [];
            user_msgs = [];

            // Object.keys(data.all_months).forEach(function(key) {
            //     var month = data.all_months[key];
            //     months.push(month);
            //     user_count.push(data.all_months[month].user_count);
            //     user_msgs.push(data.all_months[month].user_msgs);
            // });
            for (var month in data.all_months) {
                months.push(month);
                user_count.push(data.all_months[month].user_count);
                user_msgs.push(data.all_months[month].user_msgs); // insertUserMessage(data[i]['message'], data[i]['time'])
                // replies = data[i]['replies']
                // for (const key in replies) {
                //     insertBotMessage(replies[key]);
                // }
            } // $('.message').slice(-1)[0].scrollIntoView({block: "end"});

            $('.today-msgs').text(data.today['user_msgs']);
            $('.today-users').text(data.today['user_count']);
            $('.this-week-msgs').text(data.week['user_msgs']);
            $('.this-week-users').text(data.week['user_count']);
            $('.this-month-msgs').text(data.this_month['user_msgs']);
            $('.this-month-users').text(data.this_month['user_count']);
            $('.this-year-msgs').text(data.this_year['user_msgs']);
            $('.this-year-users').text(data.this_year['user_count']);

            largestUserCount = user_count[0];
            smallestUserCount = user_count[0];

            for (i = 0; i < user_count.length; i++) {
                if (largestUserCount < user_count[i]) {
                    largestUserCount = user_count[i];
                }

                if (smallestUserCount > user_count[i]) {
                    smallestUserCount = user_count[i];
                }
            }

            largestUserMsgs = user_msgs[0];
            smallestUserMsgs = user_msgs[0];

            for (j = 0; j < user_msgs.length; j++) {
                if (largestUserMsgs < user_msgs[j]) {
                    largestUserMsgs = user_msgs[j];
                }

                if (smallestUserMsgs > user_msgs[j]) {
                    smallestUserMsgs = user_msgs[j];
                }
            }

            // Messages Analytics Start Here

            document.getElementById('line_chart_data').innerHTML = '';
            document.getElementById('line_chart_dashed').innerHTML = '';

            optionsMsgs = {
                chart: {
                    height: 380,
                    type: 'line',
                    zoom: {
                        enabled: !1,
                    },
                    toolbar: {
                        show: !1,
                    },
                },
                colors: ['#5b73e8'],
                dataLabels: {
                    enabled: !1,
                },
                stroke: {
                    width: [3, 3],
                    curve: 'straight',
                },
                series: [
                    {
                        name: 'Year-2020',
                        data: user_msgs,
                    },
                ],
                grid: {
                    row: {
                        colors: ['transparent', 'transparent'],
                        opacity: 0.2,
                    },
                    borderColor: '#f1f1f1',
                },
                markers: {
                    style: 'inverted',
                    size: 6,
                },
                xaxis: {
                    categories: months,
                    title: {
                        text: 'Month',
                    },
                },
                yaxis: {
                    title: {
                        text: 'Messages',
                    },
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'right',
                    floating: !0,
                    offsetY: -25,
                    offsetX: -5,
                },
                responsive: [
                    {
                        breakpoint: 600,
                        options: {
                            chart: {
                                toolbar: {
                                    show: !1,
                                },
                            },
                            legend: {
                                show: !1,
                            },
                        },
                    },
                ],
            };

            var chart = new ApexCharts(
                document.querySelector('#line_chart_data'),
                optionsMsgs
            );
            chart.render();

            // Users Analytics Start Here

            optionsUsers = {
                chart: {
                    height: 380,
                    type: 'line',
                    zoom: {
                        enabled: !1,
                    },
                    toolbar: {
                        show: !1,
                    },
                },
                colors: ['#f1b44c'],
                dataLabels: {
                    enabled: !1,
                },
                stroke: {
                    width: [3, 3],
                    curve: 'straight',
                },
                series: [
                    {
                        name: 'Year-2020',
                        // data: [10,09,20,33,90]
                        data: user_count,
                    },
                ],
                // title: {
                //     text: "Page Statistics",
                //     align: "left"
                // },
                grid: {
                    row: {
                        colors: ['transparent', 'transparent'],
                        opacity: 0.2,
                    },
                    borderColor: '#f1f1f1',
                },
                markers: {
                    style: 'inverted',
                    size: 6,
                },
                xaxis: {
                    categories: months,
                    // categories: ["Apr", "May", "Jun", "Jul", "Aug"],
                    title: {
                        text: 'Month',
                    },
                },
                yaxis: {
                    title: {
                        text: 'Users',
                    },
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'right',
                    floating: !0,
                    offsetY: -25,
                    offsetX: -5,
                },
                responsive: [
                    {
                        breakpoint: 600,
                        options: {
                            chart: {
                                toolbar: {
                                    show: !1,
                                },
                            },
                            legend: {
                                show: !1,
                            },
                        },
                    },
                ], // Users Analytics End Here
            };

            var chart2 = new ApexCharts(
                document.querySelector('#line_chart_dashed'),
                optionsUsers
            );
            chart2.render();

        },
        error: function (err) {
            alert('Something wrong happened on fetching chats!');
        },
    });
}

// setInterval(function () {
//     getChats();
// }, 5000);

// analytics
// function getAnalytics() {
//     $.ajax({
//         url: 'https://belltro.xyz:5072/analytics',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         type: 'GET',
//         success: function (data) {
//             $('.users-analytics').text(data['users'])
//             $('.messages-analytics').text(data['messages'])
//             $('.sessions-analytics').text(data['sessions'])
//             $('.calls-analytics').text('900')

//         },
//         error: function (err) {
//             console.log('Something wrong happened on fetching users!')
//         }
//     });
// }

// setInterval(function () {
//     getChats();
// }, 5000);

// var options1 = {
//     series: [{
//         data: [25, 66, 41, 89, 63, 25, 44, 20, 36, 40, 54]
//     }],
//     fill: {
//         colors: ["#5b73e8"]
//     },
//     chart: {
//         type: "bar",
//         width: 70,
//         height: 40,
//         sparkline: {
//             enabled: !0
//         }
//     },
//     plotOptions: {
//         bar: {
//             columnWidth: "50%"
//         }
//     },
//     labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
//     xaxis: {
//         crosshairs: {
//             width: 1
//         }
//     },
//     tooltip: {
//         fixed: {
//             enabled: !1
//         },
//         x: {
//             show: !1
//         },
//         y: {
//             title: {
//                 formatter: function(e) {
//                     return ""
//                 }
//             }
//         },
//         marker: {
//             show: !1
//         }
//     }
// },
// chart = new ApexCharts(document.querySelector("#total-revenue-chart"), options1);
// chart.render();
// var options = {
//     fill: {
//         colors: ["#34c38f"]
//     },
//     series: [70],
//     chart: {
//         type: "radialBar",
//         width: 45,
//         height: 45,
//         sparkline: {
//             enabled: !0
//         }
//     },
//     dataLabels: {
//         enabled: !1
//     },
//     plotOptions: {
//         radialBar: {
//             hollow: {
//                 margin: 0,
//                 size: "60%"
//             },
//             track: {
//                 margin: 0
//             },
//             dataLabels: {
//                 show: !1
//             }
//         }
//     }
// }
