// Register service worker for offline capabilities
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(console.error);
    });
}

// Placeholder function to fetch data from Unraid GraphQL interface
export async function fetchUnraidData(query, fetchFn = fetch) {
    const response = await fetchFn('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    });
    return response.json();
}
