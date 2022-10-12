import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Fragment, useState, useEffect } from "react";
import { getFilteredEvents } from "../../helpers/api-utils";
import EventList from "../../components/events/event-list";
import ResultsTitle from "../../components/events/results-title";
import Button from "../../components/ui/button";
import ErrorAlert from "../../components/ui/error-alert";

const fetcher = (url) => fetch(url).then((res) => res.json());

function FilteredEventsPage() {
    const [loadedEvents, setLoadedEvents] = useState();

    const router = useRouter();
    const filterData = router.query.slug;

    const { data, error } = useSWR(
        "https://next-meetup-f79c3-default-rtdb.firebaseio.com/events.json",
        fetcher);

    useEffect(() => {
        if (data) {
            const events = [];

            for (const key in data) {
                events.push({
                    id: key,
                    ...data[key],
                });
            }

            setLoadedEvents(events);
        }
    }, [data]);

    let pageHeadData = (
        <Head>
            <title>Filtered Events</title>
            <meta name="description" content="A list of filtered events." />
        </Head>
    )

    if (!loadedEvents) {
        return (
            <Fragment>
                {pageHeadData}
                <p className="center">Loading...</p>
            </Fragment>
        )
    }

    const filteredYear = filterData[0];
    const filteredMonth = filterData[1];

    const numYear = +filteredYear;
    const numMonth = +filteredMonth;

    pageHeadData = (
        <Head>
            <title>Filtered Events</title>
            <meta name="description" content={`All events for ${numMonth}-${numYear}.`} />
        </Head>
    )

    if (isNaN(numYear) || isNaN(numMonth) || numMonth < 1 || numMonth > 12 || error) {
        return (
            <Fragment>
                {pageHeadData}
                <ErrorAlert><p>Invalid filters. Please adjust your filters.</p></ErrorAlert>
                <div className="center">
                    <Button link="/events">Show All Events</Button>
                </div>
            </Fragment>
        )
    }

    const filteredEvents = loadedEvents.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate.getFullYear() === numYear && eventDate.getMonth() === numMonth - 1;
    });

    if (!filteredEvents || filteredEvents.length === 0) {
        return (
            <Fragment>
                {pageHeadData}
                <ErrorAlert><p>No events found!</p></ErrorAlert>
                <div className="center">
                    <Button link="/events">Show All Events</Button>
                </div>
            </Fragment>
        )
    }

    const date = new Date(numYear, numMonth - 1);

    return (
        <Fragment>
            {pageHeadData}
            <ResultsTitle date={date} />
            <EventList items={filteredEvents} />
        </Fragment>
    )
}

// export async function getServerSideProps(context) {
//     const filterData = context.params.slug;

//     const filteredYear = filterData[0];
//     const filteredMonth = filterData[1];

//     const numYear = +filteredYear;
//     const numMonth = +filteredMonth;

//     if (isNaN(numYear) || isNaN(numMonth) || numMonth < 1 || numMonth > 12) {
//         return {
//             props: {
//                 hasError: true,
//             }
//             // notFound: true,
//             // redirect: {
//             //     destination: "/error"
//             // }
//         }
//     }

//     const filteredEvents = await getFilteredEvents({
//         year: numYear,
//         month: numMonth
//     });

//     return {
//         props: {
//             filteredEvents: filteredEvents,
//             date: {
//                 year: numYear,
//                 month: numMonth
//             }
//         }
//     }
// }

export default FilteredEventsPage;