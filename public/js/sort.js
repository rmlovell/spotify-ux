// Whenever album collection page loads
window.addEventListener('load', async function() {
    
    updateAlbumText();
    
    // Where collection will be stored 
    collection = [];
    
    // Retrieves milk crate in json format
    const response = await fetch('/milkcrate/json');

    // If response is okay
    if (response.ok) {
        // Converts response to json format
        const body = await response.json();
        // Collection updated with body from response
        collection = Array.from(body[0]);
    }

    // Sorting alphabetically
    document.getElementById('alpha').addEventListener('click', async function() {
        const sorted = collection.sort((a, b) => {
            // Object should have name key
            if (Object.keys(a).includes('name') || Object.keys(b).includes('name')) {
                return undefined;
            } else if (a.name < b.name) {
                return -1;
            } else if (a.name > b.name) {
                return 1;
            } else {
                return 0;
            }
        });

        if (sort !== undefined) {
            replaceElements(sorted);
        } else {
            alert("Error sorting files");
        }
    });
});

function replaceElements(data) {
    // Initial coordinate values
    let top = 90, right = 90, z_index = 19;
    
    const elems = Array.from(document.getElementsByClassName('albums'));
    
    elems.forEach(item => {
        // Gets indicies of HTML elements in order of data array
        const currIndex = data.findIndex(i => i.name === item.id);
        
        // Changes coordinates of albums
        document.getElementsByClassName('albums')[currIndex].style['top'] = top.toString() + 'px';
        document.getElementsByClassName('albums')[currIndex].style['right'] = right.toString() + 'px';
        document.getElementsByClassName('albums')[currIndex].style['z-index'] = z_index.toString();

        // Decrements values
        top = top - 10;
        right = right - 10;
        z_index = z_index - 1;

        // Resets values
        if (top < 0) { top = 90; }
        if (right < 0) { right = 90; }
        if (z_index < 10) { z_index = 19; }
    });
}

// Gets current album 
function getCurrAlbum() {
    const albums = Array.from(document.getElementsByClassName('albums'));
    return albums.filter(item1 => item1.style['top'] === '90px').filter(item2 => item2.style['right'] === '90px');
} 

// Updates album text
function updateAlbumText() {
    const curr_album = getCurrAlbum();
    const album_text = document.getElementById('album-text');

    if (album_text !== null && curr_album.length > 0) {
        album_text.innerText = curr_album[0].id;
    }
}

// Checks and updates album name and sorting 
window.addEventListener('change', updateAlbumText);