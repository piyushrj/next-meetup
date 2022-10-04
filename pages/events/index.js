import { Fragment } from "react";
import { useRouter } from "next/router";
import { getAllEvents } from "../../dummy-data";
import EventList from "../../components/events/event-list";
import EventsSearch from "../../components/events/events-search";

function EventsPage() {
    const router = useRouter();
    const events = getAllEvents();

    function findEventsHandler(year, momth) {
        const fullPath = `/events/${year}/${momth}`;
        router.push(fullPath);
    }

    return (
        <Fragment>
            <EventsSearch onSearch={findEventsHandler} />
            <EventList items={events} />
        </Fragment>
    )
}

export default EventsPage;