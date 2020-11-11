var zoneSelected;
var nomen = "";

// Suggestion engine
var zonas = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: zonas
});

$('#inputZona').typeahead({
    highlight: true,
    minLength: 2
},
    {
        name: 'zonas',
        source: zonas
    }
);

function findNomen(zoneSelected) {
    for (var i = 0; i < nomenList.length; i++) {
        if (zoneSelected == nomenList[i].RESULTADO) {
            nomen = nomenList[i].COD_MUNICIPIO;
        }
    }
};

$('#inputZona').bind('typeahead:select', function (ev, suggestion) {
    zoneSelected = suggestion;
    findNomen(zoneSelected);
});

// listener form delivery
document.getElementById("form-search-zone").addEventListener("submit", function (e) {
    e.preventDefault();
    document.getElementById("spinner").classList.remove("invisible");
    if (document.getElementById("inputState").value == "Seleccione una ciudad...") {
        alert("Debe elegir una ciudad");
    } else if (document.getElementById("inputState").value == "Caracas" && document.getElementById("inputZona").value == "") {
        alert("debe elegir una zona");
    } else if (document.getElementById("inputState").value == "Caracas" && document.getElementById("inputZona").value != "") {
        getDataNomen();
    } else {
        spinner.removeAttribute('hidden');
        getDataCity();
    }

});

// listener to registry button
document.getElementById("button-registry").addEventListener("click", function () {
    window.open("formulario-delivery.html");
});

// Get data from DB
function getDataCity() {
    $.ajax({
        dataType: 'json',
        type: 'GET',
        url: '../assets/php/get-delivery-city.php',
        data: $('#form-search-zone').serialize(),
        success: function (data) {
            mapData(data);
        },
        error: function () {
            setTimeout(function () {
                getDataCity();
            }, 2000)
        }
    });
};

// Get data from DB
function getDataNomen() {
    $.ajax({
        dataType: 'json',
        type: 'GET',
        url: '../assets/php/get-delivery-nomen.php',
        data: { nomen: nomen },
        success: function (data) {
            mapData(data);
        },
        error: function () {
            setTimeout(function () {
                getDataNomen();
            }, 2000)
        }
    });
};

// Insert every card into the result section
function mapData(data) {
    deliveryData = data;
    nomen = "";
    document.getElementById("spinner").classList.add("invisible");
    document.getElementById("delivery").scrollIntoView({ block: "center" });
    document.getElementById("delivery-list").innerHTML = "";
    document.getElementById("delivery-results-text").textContent = "";

    for (object of deliveryData) {

        var card = document.createElement("DIV");
        card.classList.add("col-xl-3", "col-lg-4", "col-md-6");
        card.setAttribute("data-aos", "fade-up");
        card.setAttribute("data-aos-delay", "50");

        var cardChildOne = document.createElement("DIV");
        cardChildOne.classList.add("member");
        card.appendChild(cardChildOne);

        var cardChildTwo = document.createElement("DIV");
        cardChildTwo.classList.add("pic");
        var imagen = new Image();
        imagen.src = ("assets/img/delivery/" + object.USER_ID + ".jpg");
        imagen.classList.add("img-fluid");
        cardChildTwo.appendChild(imagen);
        cardChildOne.appendChild(cardChildTwo);

        var cardChildThree = document.createElement("DIV");
        cardChildThree.classList.add("member-info");
        var nombre = document.createElement("H4");
        var nombreText = document.createTextNode(object.NOMBRE + " " + object.APELLIDO);
        nombre.appendChild(nombreText);
        cardChildThree.appendChild(nombre);
        cardChildOne.appendChild(cardChildThree);

        var cardChildFour = document.createElement("DIV");
        cardChildFour.classList.add("social");

        var whatsapp = document.createElement("A");
        whatsapp.setAttribute("href", "https://wa.me/" + object.TELEFONO);
        whatsapp.setAttribute("target", "_blank");
        var whatsappInner = document.createElement("I");
        whatsappInner.classList.add("icofont-whatsapp");
        var whatsappText = document.createTextNode("Whatsapp");
        whatsappInner.appendChild(whatsappText);
        whatsapp.appendChild(whatsappInner);
        cardChildFour.appendChild(whatsapp);

        var instagram = document.createElement("A");
        instagram.setAttribute("href", "https://instagram.com/" + object.INSTAGRAM);
        instagram.setAttribute("target", "_blank");
        var instagramInner = document.createElement("I");
        instagramInner.classList.add("icofont-instagram");
        var instagramText = document.createTextNode("Instagram");
        instagramInner.appendChild(instagramText);
        instagram.appendChild(instagramInner)
        cardChildFour.appendChild(instagram);

        cardChildThree.appendChild(cardChildFour);

        document.getElementById("delivery-list").append(card);

    }

    // $.each(deliveryData, function (index, object) {

    // });

    if (document.getElementById("inputState").value == "Caracas") {
        document.getElementById("inputZona").value = "";
    } else {
        document.getElementById("form-search-zone").reset();
        document.getElementById("div-input-zona").style.display = "none";
    }
};