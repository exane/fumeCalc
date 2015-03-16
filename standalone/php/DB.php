<?php
  require_once("../db.conf.php");
  DB::$db = new PDO("mysql:host=$HOST;dbname=$DB", $USER, $PW, [PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ]);



  class DB {
    static public $db;
    static public function save($obj) {
      $sql = "insert into fumecalc_history
              (date, account_before, deduction, after, note, history_id)
              values(:date, :before, :deduc, :after, :note, 1)";
      $query = DB::$db->prepare($sql);
      $query->execute([":date" => $obj["date"],
                       ":before" => $obj["before"],
                       ":deduc" => $obj["deduction"],
                       ":after" => $obj["after"],
                       ":note" => $obj["note"]]);
      DB::changeAccountBy($obj["deduction"]);
    }

    static public function load() {
      $sql = "select * from fumecalc_history";
      $query = DB::$db->prepare($sql);
      $query->execute();
      return ["account" => (int) DB::getAccount()->account, "history" => $query->fetchAll()];
    }

    static private function getAccount() {
      $sql = "select account from fumecalc";
      $query = DB::$db->prepare($sql);
      $query->execute();
      return $query->fetch();
    }

    static private function changeAccountBy($amount) {
      $sql = "update fumecalc set account = :account";
      $query = DB::$db->prepare($sql);
      $query->execute([":account" => ((int) DB::getAccount()->account) + (int) $amount]);
    }
  }