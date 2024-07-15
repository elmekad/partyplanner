const COHORT = "2404-FTB-MT-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
    events: [],
};

const eventList = document.querySelector("#events");

const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent);

async function render() {
    await getEvents();
    renderEvents();
}
render();

async function getEvents() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        if (result.success) {
            state.events = result.data;
        } else {
            console.error(result.error);
        }
    } catch (error) {
        console.error("Failed to fetch events:", error);
    }
}

function renderEvents() {
    eventList.innerHTML = '';
    state.events.forEach(event => {
        const eventItem = document.createElement("li");
        eventItem.textContent = `${event.name} - ${event.time} - ${event.date} - ${event.location} - ${event.description}`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteEvent(event.id));

        eventItem.append(deleteButton);
        eventList.append(eventItem);
    });
}

async function addEvent(event) {
    event.preventDefault();

    const formData = new FormData(addEventForm);
    const newEvent = {
        name: formData.get("name"),
        date: "2021-09-30T00:00:00.000Z",
        
        location: formData.get("location"),
        description: formData.get("description"),
    };

    console.log("Submitting new event", newEvent);

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newEvent)
        });

        const result = await response.json();
        if (result.success) {
            state.events.push(result.data);
            renderEvents();
            addEventForm.reset();
        } else {
            console.error("Error from API:", result.error);
        }
    } catch (error) {
        console.error("Failed to add an event:", error);
    }
}

async function deleteEvent(eventID) {
    const deleteUrl = `${API_URL}/${eventID}`;
    try {
        const response = await fetch(deleteUrl, {
            method: "DELETE"
        });

        if (response.ok) {
            console.log(`Deleted event with ID: ${eventID}`);
            await getEvents();
            renderEvents();
        } else {
            const result = await response.json();
            console.error("Failed to delete event:", result.error);
        }
    } catch (error) {
        console.error("Failed to delete event:", error);
    }
}
