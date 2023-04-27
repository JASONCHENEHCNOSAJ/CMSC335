//Your code should rely on at least one arrow (lambda) function. So we can identify the function during grading, add the comment /* LAMBDA */ near the function.
// Your code should use the document.querySelector() method at least once

let loadedphoto = false;
let currphotoarr = [];
let currind = 0;
let idGlobal;
function loadphoto() {
    clearInterval(idGlobal);
    let folder = document.querySelector("#photofolder").value;
    let name = document.querySelector("#commonname").value;
    let startnum = document.querySelector("#startnum").value;
    let endnum = document.querySelector("#endnum").value;

    let path = folder.concat(name);
    let photos = []
    let index = 0;

    for (let i = startnum; i <= endnum; i++) {
        photos[index] = path.concat() + i + ".jpg";
        index++;
    }

    currphotoarr = photos;

    if (endnum < startnum) {
        document.getElementById("statusfieldset").innerHTML = "Error: Invalid Range";
    } else {
        console.log(photos)
        document.getElementById("currphoto").value = photos[0];
        document.querySelector("#displayimage").src = photos[0];
        document.getElementById("statusfieldset").innerHTML = "Photo Viewer System";
        loadedphoto = true;
    }
}


function prevphoto() {
    if (loadedphoto) {
        let prevphoto;

        if (currind > 0) {
            currind--;
        } else {
            currind = currphotoarr.length - 1;
        }
        console.log(currind)
        prevphoto = currphotoarr[currind];
        document.getElementById("currphoto").value = prevphoto;
        document.querySelector("#displayimage").src = prevphoto;
    } else {
        document.getElementById("statusfieldset").innerHTML = "Error: you must load data first"
    }

}

function nextphoto() {

    if (loadedphoto) {
        let nextphoto;

        if (currind < currphotoarr.length - 1) {
            currind++;
        } else {
            currind = 0;
        }
        console.log(currind);
        nextphoto = currphotoarr[currind];

        document.getElementById("currphoto").value = nextphoto;
        document.querySelector("#displayimage").src = nextphoto;
    } else {
        document.getElementById("statusfieldset").innerHTML = "Error: you must load data first"
    }

}

let firstphoto = () => {
    let firstphoto;

    if (loadedphoto) {
        currind = 0;
        firstphoto = currphotoarr[currind];
        document.getElementById("currphoto").value = firstphoto;
        document.querySelector("#displayimage").src = firstphoto;
    } else {
        document.getElementById("statusfieldset").innerHTML = "Error: you must load data first"
    }

}

let lastphoto = () => {
    let lastphoto;
    if (loadedphoto) {
        currind = currphotoarr.length - 1;
        lastphoto = currphotoarr[currind];
        document.getElementById("currphoto").value = lastphoto;
        document.querySelector("#displayimage").src = lastphoto;
    } else {
        document.getElementById("statusfieldset").innerHTML = "Error: you must load data first"
    }

}

function loadjson() {
    clearInterval(idGlobal);

    let currURL;
    let jsonphotos = [];

    let url = document.querySelector("#url").value;
    fetch(url)
        .then(response => response.json())
        .then(json => {
            
            currURL = JSON.parse(JSON.stringify(json))
            for (let i = 0; i < json.images.length; i++) {
                jsonphotos[i] = json.images[i].imageURL;
            }

            document.getElementById("currphoto").value = jsonphotos[0];
            document.querySelector("#displayimage").src = jsonphotos[0];
            document.getElementById("statusfieldset").innerHTML = "Photo Viewer System";

            currphotoarr = jsonphotos;
            console.log(jsonphotos);
            loadedphoto = true;
        });
}

function slideshow() {
    clearInterval(idGlobal);
    idGlobal = setInterval(changepic, 1000);

}
function rslideshow() {
    clearInterval(idGlobal);
    idGlobal = setInterval(rchangepic, 1000);
}

function sslideshow() {
    clearInterval(idGlobal);
}
function rchangepic() {
    currind = Math.floor(Math.random() * (currphotoarr.length));
    console.log(currind)
    document.getElementById("currphoto").value = currphotoarr[currind];
    document.querySelector("#displayimage").src = currphotoarr[currind];
}
function changepic() {
    if (currind < currphotoarr.length - 1) {
        currind++;
    } else {
        currind = 0;
    }
    console.log(currind)
    document.getElementById("currphoto").value = currphotoarr[currind];
    document.querySelector("#displayimage").src = currphotoarr[currind];
}

function resetf() {
    document.getElementById("form").reset();
    loadedphoto = false;
}