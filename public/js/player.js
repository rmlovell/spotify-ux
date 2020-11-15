window.onSpotifyWebPlaybackSDKReady = async function() {
    // Getting token from server
    const tokenResponse = await fetch('/token');
    const tokenBody = await tokenResponse.text();
    const token = tokenBody;

    // Getting url from server
    const uriResponse = await fetch('/milkcrate/json');
    const uriBody = await uriResponse.json();

    // First album is initial uri
    let spotify_uri = uriBody[0][0]['album-tracks-uri'].items[0].uri;

    // Milk Crate Player
    const player = new Spotify.Player({
        name: 'Milk Crate',
        getOAuthToken: cb => { cb(token); }
    });

    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });

    // Ready
    player.addListener('ready', async ({ device_id }) => {
        // Plays current 
        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, 
        {
            method: 'PUT',
            body: JSON.stringify({ uris: [spotify_uri] }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        console.log('Ready with Device ID', device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    player.connect();
};