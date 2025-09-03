<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    include("../Expo/conexiones/conexion.php");

    $nombre = $_POST["firstName"];
    $apellido = $_POST["lastName"];
    $correo = $_POST["regEmail"];
    $contrasena = password_hash($_POST["regPassword"], PASSWORD_DEFAULT);

    $sql = "INSERT INTO datos (nombre, apellido, correo, contrasena)
            VALUES (?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $nombre, $apellido, $correo, $contrasena);

    if ($stmt->execute()) {
        echo "¡Registro exitoso!";
    } else {
        echo "Error: " . $stmt->error;
    }                

    $stmt->close();
    $conn->close();
}
?>