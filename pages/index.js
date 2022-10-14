import Head from "next/head";
import { getFeaturedEvents } from "../helpers/api-utils";
import EventList from "../components/events/event-list";
import NewsletterRegistration from "../components/input/newsletter-registration";

function HomePage(props) {
    return (
        <div>
            <Head>
                <title>NextJS Events</title>
                <meta name="description" content="Find the best NextJS meetups around your city!" />
            </Head>
            <NewsletterRegistration />
            <EventList items={props.events} />
        </div>
    )
}

export async function getStaticProps() {

    const featuredEvents = await getFeaturedEvents();
    return {
        props: {
            events: featuredEvents
        },
        revalidate: 1800
    }
}

export default HomePage;