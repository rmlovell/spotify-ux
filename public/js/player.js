window.onSpotifyWebPlaybackSDKReady = async function() {
    // Getting token from server
    const tokenResponse = await fetch('/token');
    const tokenBody = await tokenResponse.text();
    const token = tokenBody;

    // Getting url from server
    const uriResponse = await fetch('/milkcrate/json');
    const uriBody = await uriResponse.json();

    // First album is initial uri
    let spotifyURI = uriBody[0][0]['album-uri'];

    // Initial record image
    document.getElementById('currentRecordImage').src = uriBody[0][0].img;

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
    player.addListener('player_state_changed', state => { 
        
        // Name of current song
        document.getElementById('currentSongPlaying').innerText = 'Current Song: ' + state['track_window']['current_track'].name;

        console.log('Current state');
        console.log(state); 
    });

    // Ready
    player.addListener('ready', async ({ device_id }) => {

        // Plays first song in first album selected
        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, 
        {
            method: 'PUT',
            body: JSON.stringify({"context_uri": spotifyURI}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        // Logs that device is ready
        // console.log('Ready with Device ID', device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    // Whenever play or pause button is clicked
    $('#playPauseButton').on('click', () => pauseOrPlay(player));

    // Space bar is clicked, pause or play will occur
    $(window).keypress(function(e) {
        if (e.which === 32) {
            pauseOrPlay(player);
        }
    });

    // Whenever back button is clicked
    document.getElementById('stepBackward').addEventListener('click', () => player.previousTrack());

    // Whenever forward button is clicked
    document.getElementById('stepForward').addEventListener('click', () => player.nextTrack());

    // Changes text to current song playing
    
    // Connect to the player!
    player.connect();
};

/**
 * Pauses or plays the current song.
 * @param {Object<Spotify Player>} player A spotify player object
 */
function pauseOrPlay(player) {
    player.togglePlay().then(() => {
        const button = document.getElementById('playPauseButton');
        const className = Array.from(button.classList);

        // Button is currently play
        if (className.includes('fa-play-circle')) {
            // Change button to pause
            button.classList.remove('fa-play-circle');
            button.classList.add('fa-pause-circle');
            // Stops vinyl from spinning
            document.getElementById('currentRecordImage').classList.remove('paused');
            document.getElementById('vinylTemplate').classList.remove('paused');
        // Button is currently paused
        } else {
            // Change to playy
            button.classList.remove('fa-pause-circle');
            button.classList.add('fa-play-circle');
            // Vinyl starts spinning
            document.getElementById('currentRecordImage').classList.add('paused');
            document.getElementById('vinylTemplate').classList.add('paused');
        }
    });
}