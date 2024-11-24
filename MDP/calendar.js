
function layOutDay(events) {
    // Clear previous events
    document.getElementById('calendar').innerHTML = '';
    
    if (!events || !events.length) return;

    // Sort events by start time
    events.sort((a, b) => a.start - b.start);

    // Find colliding event groups
    const collisionGroups = findCollisionGroups(events);

    // Render each group
    collisionGroups.forEach(group => {
        const columns = assignColumns(group);
        const maxColumn = Math.max(...group.map(event => event.column));
        const width = (600 - 20) / (maxColumn + 1); // 600px container width - 20px padding

        group.forEach(event => {
            renderEvent(event, width, maxColumn);
        });
    });
}


function findCollisionGroups(events) {
    const groups = [];
    let currentGroup = [];
    let maxEnd = 0;

    events.forEach(event => {
        if (event.start >= maxEnd) {
            if (currentGroup.length > 0) {
                groups.push(currentGroup);
                currentGroup = [];
            }
        }
        currentGroup.push(event);
        maxEnd = Math.max(maxEnd, event.end);
    });

    if (currentGroup.length > 0) {
        groups.push(currentGroup);
    }

    return groups;
}


function assignColumns(events) {
    events.forEach(event => {
        event.column = 0;
        let collision = true;
        while (collision) {
            collision = false;
            for (let other of events) {
                if (other === event) continue;
                if (eventsOverlap(event, other) && event.column === other.column) {
                    collision = true;
                    event.column++;
                    break;
                }
            }
        }
    });
    return events;
}


function eventsOverlap(event1, event2) {
    return !(event1.end <= event2.start || event2.end <= event1.start);
}


function renderEvent(event, width, maxColumns) {
    const container = document.getElementById('calendar');
    const eventElement = document.createElement('div');
    eventElement.className = 'event';

    // Calculate position
    const top = (event.start / 720) * 100;
    const height = ((event.end - event.start) / 720) * 100;
    const left = (event.column * width) + 10; // 10px padding

    // Apply styles
    eventElement.style.top = `${top}%`;
    eventElement.style.height = `${height}%`;
    eventElement.style.left = `${left}px`;
    eventElement.style.width = `${width}px`;

    // Add content
    eventElement.innerHTML = `
        <div class="event-time">${formatTime(event.start)} - ${formatTime(event.end)}</div>
        <div class="event-title">Sample Event</div>
        <div class="event-location">Sample Location</div>
    `;

    container.appendChild(eventElement);
}


function formatTime(minutes) {
    const hour = Math.floor(minutes / 60) + 9;
    const min = minutes % 60;
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${min.toString().padStart(2, '0')} ${period}`;
}

// Example usage
const testEvents = [
    {start: 30, end: 150},
    {start: 540, end: 600},
    {start: 560, end: 620},
    {start: 610, end: 670}
];

// Initialize the calendar with test events
window.addEventListener('DOMContentLoaded', () => {
    layOutDay(testEvents);
});