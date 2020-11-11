<?php
include_once('login.php');
$nomen = $_GET['nomen'];
$conn = new PDO('mysql:host='.$hostname.';dbname='.$database, $username, $password);
if (!$conn) {
	echo 'no connection\n';
	exit;
}
$sql = "SELECT * FROM listadodelivery WHERE COBERTURA_MUN LIKE '%$nomen%' ORDER BY RAND()";
$rs = $conn->query($sql);
if (!$rs){
    echo 'An SQL error occured.\n';
    exit;
}else{
    $results = $rs->fetchAll(PDO::FETCH_ASSOC);
    header('Content-type: application/json');
    echo json_encode($results, JSON_UNESCAPED_UNICODE );
}
$conn = NULL;
?>