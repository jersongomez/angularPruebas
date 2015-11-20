<?php

$usuarios = array();

$usuarios[0]['documento'] = "123";
$usuarios[0]['nombres'] = "pepito";
$usuarios[0]['apellidos'] = "perez";
$usuarios[0]['fechaNacimiento'] = "1990-03-19";
$usuarios[0]['sexo'] = "m";

$usuarios[1]['documento'] = "345";
$usuarios[1]['nombres'] = "juan";
$usuarios[1]['apellidos'] = "lopez";
$usuarios[1]['fechaNacimiento'] = "1995-06-02";
$usuarios[1]['sexo'] = "m";

echo json_encode($usuarios);

?>
