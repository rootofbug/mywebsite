const routine = [
    ["Wake up, Breakfast & Chat", "8:01 AM - 9:30 AM"],
    ["Blender", "9:31 AM - 12:00 PM"],
    ["Lunch Break & Chat", "12:01 PM - 2:00 PM"],
    ["Web", "2:01 PM - 5:00 PM"],
    ["Break & Chat", "5:01 PM - 7:00 PM"],
    ["Reading", "7:01 PM - 9:00 PM"],
    ["Upload Shorts", "9:01 PM - 9:30 PM"],
    ["Dinner", "9:31 PM - 10:00 PM"],
    ["Blender", "10:01 PM - 11:00 PM"],
    ["Web", "11:01 PM - 12:00 AM"],
    ["Chat", "12:01 AM - 1:00 AM"],
    ["Sleep", "1:01 AM - 8:00 AM"]
];

const routineTable = document.getElementById("routine-table");

routine.forEach(([activity, time]) => {
    const row = document.createElement("tr");
    
    const activityCell = document.createElement("td");
    activityCell.textContent = activity;
    row.appendChild(activityCell);
    
    const timeCell = document.createElement("td");
    timeCell.textContent = time;
    row.appendChild(timeCell);
    
    routineTable.appendChild(row);
});

async function fetchCurrentDateTime() {
    try {
        const response = await fetch('http://worldtimeapi.org/api/timezone/Asia/Dhaka');
        const data = await response.json();
        const currentDateTime = new Date(data.datetime);
        highlightCurrentTask(currentDateTime);
        updateDigitalClock(currentDateTime); // Initial call to update clock
        setInterval(() => {
            const now = new Date();
            updateDigitalClock(now);
            highlightCurrentTask(now);
        }, 1000); // Update clock and highlight every second
    } catch (error) {
        console.error('Error fetching the date and time:', error);
    }
}

function updateDigitalClock(currentDateTime) {
    const clockElement = document.getElementById("digital-clock");
    let hours = currentDateTime.getHours();
    const minutes = currentDateTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentDateTime.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;
    clockElement.textContent = formattedTime;
}


function highlightCurrentTask(currentDateTime) {
    const currentTime = currentDateTime.getHours() * 60 + currentDateTime.getMinutes(); // Current time in minutes since midnight
    
    const rows = document.querySelectorAll("#routine-table tr");
    
    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const timeRange = cells[1].textContent.split(" - ");
        const startTime = convertToMinutes(timeRange[0]);
        const endTime = convertToMinutes(timeRange[1]);
        
        // Adjust logic to handle endTime after midnight
        if (endTime < startTime) {
            if (currentTime >= startTime || currentTime < endTime) {
                row.classList.add("highlight");
            } else {
                row.classList.remove("highlight");
            }
        } else {
            if (currentTime >= startTime && currentTime < endTime) {
                row.classList.add("highlight");
            } else {
                row.classList.remove("highlight");
            }
        }
    });
}

function convertToMinutes(timeStr) {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
}

fetchCurrentDateTime();
