import StreamsDashboard from "./components/StreamsDashboard";

async function getStreams() {
  // Fetch streams on the server with no-store caching (Server-Side Rendering)
  // to ensure users always receive the most up-to-date links and kickoff times.
  const res = await fetch("https://api.esportex.site/api/streams", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch stream data from API.");
  }

  return res.json();
}

export default async function Page() {
  const sportsData = await getStreams();

  return <StreamsDashboard initialData={sportsData} />;
}
