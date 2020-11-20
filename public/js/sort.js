// Current category (links to a function) 
let curr_category = undefined;
// Where collection will be stored 
window.collection = [];

// Whenever album collection page loads
window.addEventListener('load', async function() {
    
    const albums = document.getElementsByClassName('albums');
    
    // Adds front label to front album
    for (let i = 0; i < albums.length; ++i) {
        if (albums[i].style.top === '90px') {
            albums[i].classList.add('front');
        } else {
            albums[i].classList.remove('front');
        }
    }

    $('.front').draggable();

    updateAlbumText(curr_category);
    
    // Retrieves milk crate in json format
    const response = await fetch('/milkcrate/json');

    // If response is okay
    if (response.ok) {
        // Converts response to json format
        const body = await response.json();

        if (body.length > 0) {
            // Collection updated with body from response
            body.forEach(arr => collection.push(arr));
        }
    }

    // When unsort is clicked
    document.getElementById('unsort').addEventListener('click', function() {
        window.location.href = '/milkcrate';
    });

    // Sorting A-Z
    document.getElementById('alpha').addEventListener('click', () => sortingProcess(false, getNameCat, compareName));

    // Sorting Z-A
    document.getElementById('alpha-backwards').addEventListener('click', () => sortingProcess(true, getNameCat, compareName));

    // Sorting by artist A-Z
    document.getElementById('artist').addEventListener('click', () => sortingProcess(false, getArtistCat, compareArtName));

    // Sorting by artist Z-A
    document.getElementById('artist-backwards').addEventListener('click', () => sortingProcess(true, getArtistCat, compareArtName));

    // Sorting latest release date
    document.getElementById('popular').addEventListener('click', () => sortingProcess(false, getPopCat, comparePop));
    
    // Sorting for unknown release date
    document.getElementById('unknown').addEventListener('click', () => sortingProcess(true, getPopCat, comparePop));

    // Sorting latest release dates
    document.getElementById('latest').addEventListener('click', () => sortingProcess(false, getDateCat, compareDates));

    // Sorting oldest release dates
    document.getElementById('oldest').addEventListener('click', () => sortingProcess(true, getDateCat, compareDates));
});

// Performs sorting process when buttons are clicked
function sortingProcess(reverse, f_cat, f_comp) {
    curr_category = f_cat;
    collection.forEach(arr => {
        const sorted = arr.sort(f_comp);
        if (reverse) {
            const reversed = sorted.slice(0, sorted.length).reverse();
            finishSorting(reversed);
        } else {
            finishSorting(sorted);
        }
    });
}

// Compares two name values
function compareName(a, b) {
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

function getNameCat(curr_album, i) {
    // Alphabetical categories
    const alpha_cat = {
        "A-G": "ABCDEFG",
        "H-M": "HIJKLM",
        "N-T": "NOPQRST",
        "U-Z": "UVWXYZ"
    };

    let curr_cat = "NA / (Not alphabetical)";
    // Retrieves current alphabetical category of album
    for (let key in alpha_cat) {
        if (alpha_cat[key].includes(curr_album[i].id.toUpperCase()[0])) {
            curr_cat = key;
            break;
        }
    }
    return curr_cat;
}

function compareArtName(a, b) {
    // Object should have name key
    if (!Object.keys(a).includes('artist-name') || !Object.keys(b).includes('artist-name')) {
        return undefined;
    } else if (a.artist-name.toLowerCase() < b.artist-name.toLowerCase()) {
        return -1;
    } else if (a.artist-name.toLowerCase() > b.artist-name.toLowerCase()) {
        return 1;
    } else {
        return 0;
    }
}

function getArtistCat(curr_album, i) {
    let artist = "NA";
    collection.forEach(arr => {
        arr.forEach(obj => {
            if (Object.values(obj).includes(curr_album[i].id)) {
                console.log(obj)
                artist = obj['artist-name'];
            }
        });   
    });
    return "Artist: " + artist.toString();
}

// Compares two popular values
function comparePop(a, b) {
    // Object should have name key
    if (!Object.keys(a).includes('popularity') || !Object.keys(b).includes('popularity')) {
        return undefined;
    } else if (a.popularity > b.popularity) {
        return -1;
    } else if (a.popularity < b.popularity) {
        return 1;
    } else {
        return 0;
    }
}

function getPopCat(curr_album, i) {
    let pop_num = "NA";
    collection.forEach(arr => {
        arr.forEach(obj => {
            if (Object.values(obj).includes(curr_album[i].id)) {
                pop_num = obj.popularity;
            }
        });        
    });
    return "Popularity: " + pop_num.toString();
}

// Compares two dates
function compareDates(a, b) {
    const dateA = new Date(a.release);
    const dateB = new Date(b.release);
    if (!Object.keys(a).includes('release') || !Object.keys(b).includes('release')) {
        return undefined;
    } else if (dateA.getTime() > dateB.getTime()) {
        return -1;
    } else if (dateA.getTime() < dateB.getTime()) {
        return 1;
    } else {
        return 0;
    }
}

function getDateCat(curr_album, i) {
    let date = "NA";
    collection.forEach(arr => {
        arr.forEach(obj => {
            if (Object.values(obj).includes(curr_album[i].id)) {
                date = obj.release;
            }
        });   
    });
    return "Release: " + date.toString();
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
function updateAlbumText(sort) {
    const curr_album = getCurrAlbum();
    const album_text = document.getElementsByClassName('album-text');

    if (album_text !== null && curr_album.length > 0) {
        for (let i = 0; i < album_text.length; ++i) {
            // Sort has been used
            if (sort !== undefined) {
                const curr_cat = sort(curr_album, i);
                // Updates text underneat album covers
                $(album_text[i]).html(curr_album[i].id + "<br>" + curr_cat);
            // No sorting used
            } else {
                // Updates text underneat album covers
                album_text[i].innerText = curr_album[i].id;
            }
        }
    }
}

// Process when sorting is finished
function finishSorting(sorted) {
    if (sorted !== undefined) {
        // Replace HTML elements
        replaceElements(sorted);
        
        // Updates album text 
        updateAlbumText(curr_category);
        
        // Hides modal
        $('#sortModal').modal('hide');

        // close sidebar menu
        $("#sidebar").css('left', '-100vw');
    } else {
        alert("Error sorting files");
    }
}

// Checks and updates album name and sorting 
window.addEventListener('change', () => updateAlbumText(curr_category));

// Checks and updates album name and sorting 
window.addEventListener('keyup', () => updateAlbumText(curr_category));

// Checks and updates album name and sorting 
window.addEventListener('click', () => updateAlbumText(curr_category));