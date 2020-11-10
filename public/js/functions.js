
function appp(){
    alert("fff")
    document.body.addEventListener('keydown', function(event) { 
        const key = event.key; 
        switch (key) { 
            case "ArrowLeft": 
                str = 'Left'; 
                break; 
            case "ArrowRight": 
                str = 'Right'; 
                break; 
            case "ArrowUp": 
                str = 'Up'; 
                break; 
            case "ArrowDown": 
                str = 'Down'; 
                console.log(str);
                break; 
        } 
        console.log(str);
    });
}
