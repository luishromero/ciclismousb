<?php
include_once('login.php');
$captcha = filter_input(INPUT_POST, 'g-recaptcha-response');
$nombre = filter_input(INPUT_POST, 'nombre');
$apellido = filter_input(INPUT_POST, 'apellido');
$correo = filter_input(INPUT_POST, 'correo');
$telefono = filter_input(INPUT_POST, 'telefono');
$instagram = filter_input(INPUT_POST, 'instagram');
$estado = filter_input(INPUT_POST, 'estado');
$municipio = filter_input(INPUT_POST, 'municipio');
$lunes = filter_input(INPUT_POST, 'lunes');
$martes = filter_input(INPUT_POST, 'martes');
$miercoles = filter_input(INPUT_POST, 'miercoles');
$jueves = filter_input(INPUT_POST, 'jueves');
$viernes = filter_input(INPUT_POST, 'viernes');
$sabado = filter_input(INPUT_POST, 'sabado');
$domingo = filter_input(INPUT_POST, 'domingo');
$cobertura = filter_input(INPUT_POST, 'cobertura');
$areasCoberturas = filter_input(INPUT_POST, 'areas-coberturas');
// $ = filter_input(INPUT_POST, '');

$sql = "INSERT INTO registro (NOMBRE, APELLIDO, CORREO, TELEFONO, INSTAGRAM, ESTADO, MUNICIPIO, LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO, DOMINGO, COBERTURA, AREAS_COBERTURAS) VALUES ('$nombre', '$apellido', '$correo', '$telefono', '$instagram', '$estado', '$municipio', '$lunes', '$martes', '$miercoles', '$jueves', '$viernes', '$sabado', '$domingo', '$cobertura', '$areasCoberturas');";
$conn = new PDO('mysql:host=' . $hostname . ';dbname=' . $database, $username, $password);

if (!$conn) {
    echo 'no connection\n';
    exit;
}
$secretKey = '6LddQqoZAAAAAJ30y1TB2M9gNDDS_gX6USZ-RlPF';
$ip = $_SERVER['REMOTE_ADDR'];
$url = 'https://www.google.com/recaptcha/api/siteverify?secret=' . urlencode($secretKey) .  '&response=' . urlencode($captcha);
$response = file_get_contents($url);
$responseKeys = json_decode($response,true);
if($responseKeys["success"]) {
    if ($conn->query($sql)) {
        echo 'Sugerencia procesada con exito';
    } else {
        echo 'Error al momento de registrar sus datos';
    }
} else {
    echo '<h2>Error: No se ha podido comprobar que usted no es un bot</h2>';
}
$conn = NULL;
