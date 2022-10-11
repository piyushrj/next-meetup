import { Fragment } from "react";
import { useRouter } from "next/router";
import { getAllEvents } from "../../helpers/api-utils";
import EventList from "../../components/events/event-list";
import EventsSearch from "../../components/events/events-search";

function EventsPage(props) {
    const router = useRouter();
    const events = props.events;

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

export async function getStaticProps() {
    const events = await getAllEvents();
    return {
        props: {
            events: events
        },
        revalidate: 1800
    }
}

export default EventsPage;