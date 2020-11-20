var selectedCrate;

if(document.getElementById('0') != null){
    selectedCrate = document.getElementById('0').children;
    selectedCrate[0].classList.add("glow")
}

document.body.addEventListener('keyup', function(event) { 
        
        const key = event.key; 
        switch (key) { 
            case "ArrowUp":
                for (i = 2; i < selectedCrate.length; i++) {
                    var top = parseInt(selectedCrate[i].style.top);
                    var right = parseInt(selectedCrate[i].style.right);
                    var zIndex = parseInt(selectedCrate[i].style.zIndex);
                    top = top + 10;
                    right = right + 10;
                    zIndex = zIndex + 1;
                    if( top > 90 && right > 90  ){
                        top = 0;
                        right = 0;
                        zIndex = 10;
                    }
                    if(top == 90 && right == 90){
                        selectedCrate[0].innerHTML = selectedCrate[i].id; 
                    }
                    selectedCrate[i].style.top = top + "px";
                    selectedCrate[i].style.right = right + "px";
                    selectedCrate[i].style.zIndex = zIndex;
                    
                    }
                //selectedCrate[0].innerHTML = selectedCrate[3].id;
                break; 
            case "ArrowDown": 
            for (i = 2; i < selectedCrate.length; i++) {
                var top = parseInt(selectedCrate[i].style.top);
                var right = parseInt(selectedCrate[i].style.right);
                var zIndex = parseInt(selectedCrate[i].style.zIndex);
                top = top - 10;
                right = right - 10;
                zIndex = zIndex - 1;
                if( top < 0 && right < 0  ){
                    top = 90;
                    right = 90;
                    zIndex = 20;
                }
                if(top == 90 ){
                    selectedCrate[0].innerHTML = selectedCrate[i].id; 
                }
                selectedCrate[i].style.top = top + "px";
                selectedCrate[i].style.right = right + "px";
                selectedCrate[i].style.zIndex = zIndex;
                }
                break; 
        } 
        //console.log(str);

});

function search(){
    console.log(document.getElementById("search").text);
}



function bringFront(name){
    var album = document.getElementById(name);
    var crate = document.getElementById(name).parentElement.children;
    //console.log(parseInt(album.style.top));
    positionNumber = (90 - parseInt(album.style.top)) / 10
    //console.log(positionNumber);
    for (let j = 0; j < positionNumber; j++) {

        for (i = 2; i < crate.length; i++) {
            var top = parseInt(crate[i].style.top);
            var right = parseInt(crate[i].style.right);
            var zIndex = parseInt(crate[i].style.zIndex);
            top = top + 10;
            right = right + 10;
            zIndex = zIndex + 1;
            if( top > 90 && right > 90  ){
                top = 0;
                right = 0;
                zIndex = 10;
            }
            if(top == 90 && right == 90){
                crate[0].innerHTML = crate[i].id; 
            }
            crate[i].style.top = top + "px";
            crate[i].style.right = right + "px";
            crate[i].style.zIndex = zIndex;
            }
    }
    return 

}

function selectCrate(index){
     var x = document.getElementsByClassName("glow");
     var i;
     for (i = 0; i < x.length; i++) {
        x[i].classList.remove("glow");
     }
     selectedCrate = document.getElementById(index).children;
     selectedCrate[0].classList.add("glow")
}

function albumSearch(){
    var text = document.getElementById("search").value;
    if(text == ""){ 
        return; 
    }
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/searchAlbums' , true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.addEventListener('readystatechange', function(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var data = JSON.parse(xhr.responseText);
          var results = document.getElementById("results");
          results.innerHTML = '';
          data.forEach(element => {
            var div = document.createElement("DIV");
            var img = document.createElement("IMG");
            var plus = document.createElement("IMG");
            var artistDescription = document.createElement("PRE");
            var albumDescription = document.createElement("PRE");
            var br = document.createElement("BR");
            var frame = document.createElement("DIV");
            frame.classList.add("show");
            img.classList.add("smAlbum");
            img.classList.add("pt-1");
            img.src = element.img;
            plus.src = "/img/plus.png";
            plus.classList.add("plus");
            plus.classList.add("pt-1");
            plus.classList.add("smAlbum");
            plus.onclick = function() {addAlbum(element.id)};
            artistDescription.classList.add("p-0");
            artistDescription.classList.add("pt-1");
            artistDescription.classList.add("pl-3");
            artistDescription.classList.add("mb-0");
            albumDescription.classList.add("p-0");
            albumDescription.classList.add("pt-1");
            albumDescription.classList.add("pl-3");
            albumDescription.classList.add("mb-0");
            albumDescription.innerHTML = element.albumName;
            artistDescription.innerHTML = element.artistName;
            frame.appendChild(img)
            frame.appendChild(plus);
            div.appendChild(frame)
            div.appendChild(artistDescription);
            div.appendChild(albumDescription);
            div.appendChild(br);
            results.appendChild(div);
          });

        }
    });
    let params = {'text' : text}
    xhr.send(JSON.stringify(params));
}


function addAlbum(id){
    //console.log(str);
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/addAlbums' , true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.addEventListener('readystatechange', function(e) {
        console.log(e);
    });
    let params = {'id' : id}
    xhr.send(JSON.stringify(params));

    window.location.href = '/milkcrate';
}

$("#menu").click(function(e) {
    e.preventDefault();
    $("#sidebar").css('left', '0px');
  
  });
  
  // close sidebar menu
  $("#exit").click(function(e) {
    e.preventDefault();
    $("#sidebar").css('left', '-100vw');
  });

// Adds a class label for albums in front
window.addEventListener('keyup', () => {
    const albums = document.getElementsByClassName('albums');

    for (let i = 0; i < albums.length; ++i) {
        if (albums[i].style.top === '90px') {
            albums[i].classList.add('front');
        } else {
            albums[i].classList.remove('front');
        }
    }
    // Makes front albums draggable
    $(".front").draggable({
        revert:  function(dropped) {
            var $draggable = $(this),
                hasBeenDroppedBefore = $draggable.data('hasBeenDropped'),
                wasJustDropped = dropped && dropped[0].id == "droppable";
            if(wasJustDropped) {
                // don't revert, it's in the droppable
                return false;
            } else {
                if (hasBeenDroppedBefore) {
                    // don't rely on the built in revert, do it yourself
                    $draggable.animate({ top: 0, left: 0 }, 'slow');
                    return false;
                } else {
                    // just let the built in revert work, although really, you could animate to 0,0 here as well
                    return true;
                }
            }
        }
    });
});

$('#trash').droppable({
    over: async function(event, ui) {
            
        const parent = ui.draggable[0].parentNode;

        ui.draggable.remove();

        // Moves albums up
        moveAlbumsUp(parent);

        let id = undefined;
        collection.forEach(arr => {
            arr.forEach(obj => {
                if (obj.name === ui.draggable.prop('id')) {
                    id = obj.id;
                }
            });
        })
        // Sends delete request to spotify   
        const response = await fetch('/deleteAlbums', {
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