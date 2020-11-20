window.addEventListener('load', async () => {
    const discovery = [];
    const response = await fetch('/milkcrate/json');
    
    if (response.ok) {
        // Converts response to json format
        const body = await response.json();

        if (body.length > 0) {
            // Discovery updated with body from response
            body.forEach(arr => discovery.push(arr));
        }
    }

    // Album plus is droppable
    $('#plus').droppable({
        over: async function(event, ui) {
                
            const parent = ui.draggable[0].parentNode;
    
            ui.draggable.remove();
    
            // Moves albums up
            moveAlbumsUp(parent);
    
            let id = undefined;
            discovery.forEach(arr => {
                arr.forEach(obj => {
                    if (obj.name === ui.draggable.prop('id')) {
                        id = obj.id;
                    }
                });
            })
            // Sends delete request to spotify   
            const response = await fetch('/addAlbums', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({id: id})
            });
        }
    });

    function moveAlbumsUp(parent) {
        const childElems = parent.children;
    
        for (let i = 0; i < childElems.length; ++i) {
            
            if (childElems[i].classList.contains('albums')) {
                const top = parseInt(childElems[i].style.top);
                const newTop = top + 10;
    
                childElems[i].style.top = newTop.toString() + 'px';
                childElems[i].style.right = newTop.toString() + 'px';
    
                const zIndex = parseInt(childElems[i].style['z-index']);
                const newZ = zIndex + 1;
    
                childElems[i].style['z-index'] = newZ.toString();
    
                if (childElems[i].style.top === '90px') {
                    childElems[i].classList.add('front');
                    $('.front').draggable();
                    document.getElementsByClassName('album-text')[parent.id].innerText = childElems[i].id;
                }
            }
        }
    }
});