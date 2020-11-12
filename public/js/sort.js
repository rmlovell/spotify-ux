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

        if (body.length > 0) {
            // Collection updated with body from response
            collection = Array.from(body[0]);
        }
    }

    // Sorting A-Z
    document.getElementById('alpha').addEventListener('click', async function() {
        const sorted = collection.sort(compare);
        finishSorting(sorted);
    });

    // Sorting Z-A
    document.getElementById('alpha-backwards').addEventListener('click', async function() {
        const sorted = collection.sort(compare);
        const reversed = sorted.slice(0, sorted.length).reverse();
        finishSorting(reversed);
    });
});

// Compares two values in an order
function compare(a, b) {
    // Object should have name key
     if (!Object.keys(a).includes('name') || !Object.keys(b).includes('name')) {
        return undefined;
    } else if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
    } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
    } else {
        return 0;
    }
}

// Process when sorting is finished
function finishSorting(sorted) {
    if (sorted !== undefined) {
        // Replace HTML elements
        replaceElements(sorted);
        
        // Updates album text 
        updateAlbumText();
        
        // Hides modal
        $('#sortModal').modal('hide');

        // close sidebar menu
        $("#sidebar").css('left', '-100vw');
        
    } else {
        alert("Error sorting files");
    }
}

function replaceElements(data) {
    
    // Initial coordinate values
    let top = 90, right = 90, z_index = 19;
    
    const elems = Array.from(document.getElementsByClassName('albums'));

    data.forEach(item => {
        // Gets indicies of HTML elements in order of data array
        const currIndex = elems.findIndex(i => i.id === item.name);
        
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
    })
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