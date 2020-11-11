<?php
$captcha = filter_input(INPUT_POST, 'g-recaptcha-response');
$name = $_POST['name'];
$visitor_email = $_POST['email'];
$message = $_POST['message'];

//Validate first
if(empty($name)||empty($visitor_email)) 
{
  echo "Nombre y Correo son obligatorios!";
  exit;
}

//Validate first
if(IsInjected($visitor_email))
{
  echo "Ingrese un correo válido!";
  exit;
}

$email_from = 'noreply@ciclismousb.com';//<== update the email address
$email_subject = "INTERNO - Contacto desde Página Web";
$email_body = "Nombre:\n $name.\n".
              "Mensaje:\n $message\n".
              "Correo:\n $visitor_email";
    
$to = "info@ciclismousb.com";//<== update the email address
$headers = "From: $email_from \r\n";
$headers .= "Reply-To: $visitor_email \r\n";


$secretKey = '6LddQqoZAAAAAJ30y1TB2M9gNDDS_gX6USZ-RlPF';
$ip = $_SERVER['REMOTE_ADDR'];
$url = 'https://www.google.com/recaptcha/api/siteverify?secret=' . urlencode($secretKey) .  '&response=' . urlencode($captcha);
$response = file_get_contents($url);
$responseKeys = json_decode($response,true);
if($responseKeys["success"]) {
  //Send the email!
  mail($to,$email_subject,$email_body,$headers);
} else {
  echo 'No se ha procesado su solicitud';
}

// Function to validate against any email injection attempts
function IsInjected($str) {
  $injections = array('(\n+)',
              '(\r+)',
              '(\t+)',
              '(%0A+)',
              '(%0D+)',
              '(%08+)',
              '(%09+)'
              );
  $inject = join('|', $injections);
  $inject = "/$inject/i";
  if(preg_match($inject,$str))
    {
    return true;
  }
  else
    {
    return false;
  }
}

?>