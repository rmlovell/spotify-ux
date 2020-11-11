var selectedCrate;

if(document.getElementById('0') != null){
    selectedCrate = document.getElementById('0').children;
}

document.body.addEventListener('keyup', function(event) { 
        
        const key = event.key; 
        switch (key) { 
            case "ArrowUp":
                for (i = 1; i < selectedCrate.length; i++) {
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
                    selectedCrate[i].style.top = top + "px";
                    selectedCrate[i].style.right = right + "px";
                    selectedCrate[i].style.zIndex = zIndex;
                    }
                break; 
            case "ArrowDown": 
            for (i = 1; i < selectedCrate.length; i++) {
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

        for (i = 1; i < crate.length; i++) {
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
            crate[i].style.top = top + "px";
            crate[i].style.right = right + "px";
            crate[i].style.zIndex = zIndex;
            }
    }

}

function selectCrate(index){
     selectedCrate = document.getElementById(index).children;
}

function albumSearch(){
    var text = document.getElementById("search").value;
    if(text == ""){ 
        return; 
    }
    $.post("/searchAlbums",
        {
            name: "Donald Duck",
            city: "Duckburg"
          },
          function(data, status){
            alert("Data: " + data + "\nStatus: " + status);
          });
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