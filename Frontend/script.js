document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const profileMenu = document.getElementById('profile-menu');

    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('closed');
    });

    const fetchWeatherBtn = document.getElementById('fetch-weather');
    const locationInput = document.getElementById('location');

    fetchWeatherBtn.addEventListener('click', function() {
        const location = locationInput.value.trim();
        
        if (!location) {
            alert('Please enter a location');
            return;
        }

        fetchWeatherData(location);
    });

    function fetchWeatherData(location) {
        document.getElementById('loading').style.display = 'block';
        fetch(`http://localhost:3001/api/weather?location=${encodeURIComponent(location)}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('loading').style.display = 'none';
                if (data.hourly && data.hourly.length > 0) {
                    updateCharts(data.hourly);
                } else {
                    console.warn('Not enough data received, generating default charts.');
                    generateDefaultCharts(location);
                }
            })
            .catch(error => {
                document.getElementById('loading').style.display = 'none';
                console.error('Error:', error);
                generateDefaultCharts(location);
            });
    }

    function updateCharts(hourlyData) {
        // Prepare data for charts
        const temperatureData = {
            labels: hourlyData.map(item => new Date(item.dt * 1000).toLocaleTimeString()),
            min: hourlyData.map(item => item.temp.min),
            max: hourlyData.map(item => item.temp.max)
        };
        
        const humidityData = {
            labels: hourlyData.map(item => new Date(item.dt * 1000).toLocaleTimeString()),
            values: hourlyData.map(item => item.humidity)
        };
        
        const rainfallData = {
            labels: hourlyData.map(item => new Date(item.dt * 1000).toLocaleTimeString()),
            values: hourlyData.map(item => item.rain ? item.rain['1h'] : 0) // Default to 0 if no rain data
        };

        updateTemperatureChart(temperatureData);
        updateHumidityChart(humidityData);
        updateRainfallChart(rainfallData);
    }

    function generateDefaultCharts(location) {
        const defaultTemperatureData = {
            labels: ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM'],
            min: Array(12).fill(15), // Default min temperature
            max: Array(12).fill(25)  // Default max temperature
        };

        const defaultHumidityData = {
            labels: Array(12).fill('').map((_, i) => `${i} AM`),
            values: Array(12).fill(70) // Default humidity
        };

        const defaultRainfallData = {
            labels: Array(12).fill('').map((_, i) => `${i} AM`),
            values: Array(12).fill(0) // Default rainfall
        };

        updateTemperatureChart(defaultTemperatureData);
        updateHumidityChart(defaultHumidityData);
        updateRainfallChart(defaultRainfallData);
    }

    let temperatureChart, humidityChart, rainfallChart;

    function updateTemperatureChart(temperatureData) {
        const ctx = document.getElementById('temperatureChart').getContext('2d');
        if (temperatureChart) {
            temperatureChart.destroy(); // Destroy the existing chart
        }
        temperatureChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: temperatureData.labels,
                datasets: [{
                    label: 'Min Temperature (°C)',
                    data: temperatureData.min,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true
                }, {
                    label: 'Max Temperature (°C)',
                    data: temperatureData.max,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Temperature Chart'
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Temperature (°C)'
                        }
                    }
                }
            }
        });
    }

    function updateHumidityChart(humidityData) {
        const ctx = document.getElementById('humidityChart').getContext('2d');
        if (humidityChart) {
            humidityChart.destroy(); // Destroy the existing chart
        }
        humidityChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: humidityData.labels,
                datasets: [{
                    label: 'Humidity (%)',
                    data: humidityData.values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Humidity Chart'
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Humidity (%)'
                        }
                    }
                }
            }
        });
    }

    function updateRainfallChart(rainfallData) {
        const ctx = document.getElementById('rainfallChart').getContext('2d');
        if (rainfallChart) {
            rainfallChart.destroy(); // Destroy the existing chart
        }
        rainfallChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: rainfallData.labels,
                datasets: [{
                    label: 'Rainfall (mm)',
                    data: rainfallData.values,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Rainfall Chart'
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Rainfall (mm)'
                        }
                    }
                }
            }
        });
    }

    // Handle "Today" and "This Week" buttons
    const todayBtn = document.querySelector('.chart-buttons button:first-child');
    const thisWeekBtn = document.querySelector('.chart-buttons button:last-child');

    todayBtn.addEventListener('click', () => fetchWeatherData(locationInput.value, 'today'));
    thisWeekBtn.addEventListener('click', () => fetchWeatherData(locationInput.value, 'week'));
});
