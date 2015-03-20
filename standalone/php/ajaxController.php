<?php
  require "DB.php";

  if(isset($_GET["loadDB"]) && $_GET["loadDB"] == true) {
    echo json_encode(DB::load());
  }
  if(isset($_POST["saveDB"]) && $_POST["saveDB"] == true) {
    DB::save($_POST["obj"]);
  }
  if(isset($_POST["payoutDB"]) && $_POST["payoutDB"] == true) {
    DB::payOut($_POST["obj"]);
  }