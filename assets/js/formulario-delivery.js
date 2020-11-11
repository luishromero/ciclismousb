var mapCaracas;
var geojsonCaracas = null;
var googleStreet1;
var googleSatellite1;
var baseMaps1;
var mapLaGuaira;
var geojsonLaGuaira = null;
var googleStreet2;
var googleSatellite2;
var baseMaps2;
var ciudad;

// funcion al seleccionar estado
var seleccion;

function filtroEstado(estado) {
    document.getElementById("municipio").value = "Seleccione un Municipio";

    // oculta todos los municipios de la lista
    var municipioSelect = document.getElementsByClassName("municipio");
    for (x of municipioSelect) {
        x.classList.add("invisible");
    }

    // muestra los municipios del estado seleccionado
    var estadoCode = document.getElementsByClassName(estado.value);
    for (x of estadoCode) {
        x.classList.remove("invisible");
    }

    document.getElementById("section-coberturas-areas").classList.remove("invisible");
    document.getElementById("areas-coberturas").value = "";

    // oculta todos los mapas
    var bloqueMapa = document.getElementsByClassName("section-map");
    for (x of bloqueMapa) {
        x.classList.add("invisible");
    }

    // destilda las parroquias de los mapas
    var checkboxMapa = document.getElementsByClassName("checkbox-mapa");
    for (x of checkboxMapa) {
        x.checked = false;
    }

    resetGeojson();
};

// funcion al seleccionar municipio
var selecciones;

function filtroMunicipio(municipio) {
    document.getElementById("section-coberturas-areas").classList.remove("invisible");

    // oculta todos los mapas
    var bloqueMapa = document.getElementsByClassName("section-map");
    for (x of bloqueMapa) {
        x.classList.add("invisible");
    }

    // destilda las parroquias de los mapas
    var checkboxMapa = document.getElementsByClassName("checkbox-mapa");
    for (x of checkboxMapa) {
        x.checked = false;
    }

    resetGeojson();

    if (municipio.value == "MUN-100" || municipio.value == "MUN-184" || municipio.value == "MUN-196" || municipio.value == "MUN-180" || municipio.value == "MUN-186") {
        ciudad = "caracas";
        document.getElementById("section-map-caracas").classList.remove("invisible");
        document.getElementById("section-coberturas-areas").classList.add("invisible");
        constructorCaracas();
    } else if (municipio.value == "MUN-145") {
        ciudad = "la guaira";
        document.getElementById("section-map-la-guaira").classList.remove("invisible");
        document.getElementById("section-coberturas-areas").classList.add("invisible");
        constructorLaGuaira();
    };
};

// enviar formulario
document.getElementById("form-registro").addEventListener("submit", function (e) {
    e.preventDefault();
    var response = grecaptcha.getResponse();
    if (response.length === 0) {
        alert("Resuelva el captcha!");
    } else {

        // crea una lista y agrega las parroquias elegidas
        var checkboxMapa = document.getElementsByClassName("checkbox-mapa");
        var values = [];
        for (x of checkboxMapa) {
            if (x.checked == true) {
                values.push(x.value);
            }
        }

        // crea input en form y agrega parroquias elegidas
        var inputList = document.createElement("INPUT");
        inputList.setAttribute("type", "text");
        inputList.setAttribute("name", "cobertura");
        inputList.setAttribute("value", values.toString());
        inputList.classList.add("invisible");
        document.getElementById("form-registro").appendChild(inputList);

        setTimeout(function () {
            showAndUnshow();
        }, 2000);

        function showAndUnshow() {
            document.getElementById("form-registro").classList.add("invisible");
            document.getElementById("form-registro-title").classList.add("invisible");
            document.getElementById("msj-after-submit").classList.remove("invisible");
        }

        $.ajax({
            type: 'post',
            url: '../assets/php/post-delivery-form.php',
            data: $('#form-registro').serialize(),
            success: function () {
                setTimeout(function () { window.location.href = 'http://ciclismousb.com/delivery.html'; }, 5000);
            }
        });

    }
});

// constructores
function constructorCaracas() {
    googleStreet1 = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] });
    googleSatellite1 = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] });
    mapCaracas = L.map('map-caracas', {
        attributionControl: false,
        layers: [googleStreet1]
    });
    baseMaps1 = {
        "Calles": googleStreet1,
        "Satélite": googleSatellite1
    };
    L.control.layers(baseMaps1).addTo(mapCaracas);
    geojsonCaracas = L.geoJson(parroquiasCaracas, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(mapCaracas);
    mapCaracas.fitBounds(geojsonCaracas.getBounds());
};

function constructorLaGuaira() {
    googleStreet2 = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] });
    googleSatellite2 = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] });
    mapLaGuaira = L.map('map-la-guaira', {
        attributionControl: false,
        layers: [googleStreet2]
    });
    baseMaps2 = {
        "Calles": googleStreet2,
        "Satélite": googleSatellite2
    };
    L.control.layers(baseMaps2).addTo(mapLaGuaira);
    geojsonLaGuaira = L.geoJson(parroquiasLaGuaira, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(mapLaGuaira);
    mapLaGuaira.fitBounds(geojsonLaGuaira.getBounds());
};

// funcionalidad mapa
function style(feature) {
    return {
        fillColor: '#008080',
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.4
    };
};

function onEachFeature(feature, layer) {
    layer._leaflet_id = layer.feature.properties.COD_PAR;
    layer.on({
        click: selectFeature
    });
    layer.on('mouseover', function (ev) {
        layer.bindTooltip(layer.feature.properties.PARROQUIA).openTooltip();
    })
};

function selectFeature(e) {
    var layer = e.target;
    if (document.getElementById(layer._leaflet_id).checked == false) {
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        };
        document.getElementById(layer._leaflet_id).checked = true;
    } else if (document.getElementById(layer._leaflet_id).checked == true) {
        if (ciudad == "caracas") {
            geojsonCaracas.resetStyle(layer);
        } else if (ciudad == "la guaira") {
            geojsonLaGuaira.resetStyle(layer);
        };
        document.getElementById(layer._leaflet_id).checked = false;
    }
};

var dataId;

function checkboxSelect(parroquia) {
    dataId = parroquia.value;
    var layer;
    if (ciudad == "caracas") {
        layer = geojsonCaracas.getLayer(dataId);
    } else if (ciudad == "la guaira") {
        layer = geojsonLaGuaira.getLayer(dataId);
    };
    if (document.getElementById(dataId).checked == true) {
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        };
    } else if (document.getElementById(dataId).checked == false) {
        if (ciudad == "caracas") {
            geojsonCaracas.resetStyle(layer);
        } else if (ciudad == "la guaira") {
            geojsonLaGuaira.resetStyle(layer);
        };
    };
};

function resetGeojson() {
    if (geojsonCaracas != null) {
        geojsonCaracas.resetStyle();
    };
    if (geojsonLaGuaira != null) {
        geojsonLaGuaira.resetStyle();
    };
};