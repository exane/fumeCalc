<?php
  require_once("../db.conf.php");

  DB::$db = new PDO("mysql:host=$HOST;dbname=$DB", $USER, $PW, [PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ]);

  //DB::$ID = 1;

  class DB {
    static public $db;
    static public $ID;

    static public function save($obj) {
      $sql = "insert into fumecalc_history
              (date, account_before, deduction, after, note, fees, client, signed, private, history_id)
              values(:date, :before, :deduc, :after, :note, :fees, :client, :signed, :private, :history_id)";
      $query = DB::$db->prepare($sql);
      $query->execute([":date" => $obj["date"], ":history_id" => DB::$ID, ":before" => $obj["before"], ":deduc" => $obj["deduction"], ":after" => $obj["after"], ":fees" => $obj["fees"], ":signed" => $obj["signed"], ":client" => $obj["client"], ":note" => $obj["note"], ":private" => $obj["isPrivate"] != "false" ? 1 : 0]);

      if(isset($obj["isPrivate"]) && $obj["isPrivate"] != "false") {
        DB::changePrivateAccountsBy($obj["deduction"], $obj["signed"]);

        return 0;
      }
      DB::changeAccountBy($obj["deduction"] - $obj["fees"]);
    }

    static public function load() {
      $sql = "select * from fumecalc_history where history_id = :id";
      $query = DB::$db->prepare($sql);
      $query->execute([":id" => DB::$ID]);

      return ["account" => DB::getAccount(), "history" => $query->fetchAll()];
    }

    static private function getAccount() {
      DB::handleAccountTable();
      $sql = "select fume, tim, viktor from fumecalc where id = :id";
      $query = DB::$db->prepare($sql);
      $query->execute([":id" => DB::$ID]);

      return $query->fetch();
    }

    static private function changePrivateAccountsBy($amount, $account, $_flag = false) {
      DB::handleAccountTable();
      $sql = "update fumecalc set $account = :amount where id = :id";
      $query = DB::$db->prepare($sql);
      $query->execute([":amount" => ((int)DB::getAccount()->$account + (int)$amount), ":id" => DB::$ID]);
    }

    static private function changeAccountBy($amount) {
      DB::handleAccountTable();
      $sql = "update fumecalc set fume = :account where id = :id";
      $query = DB::$db->prepare($sql);
      $query->execute([":account" => ((int)DB::getAccount()->fume) + (int)$amount, ":id" => DB::$ID]);
    }

    static public function payOut($payOutObj) {
      foreach($payOutObj as $key => $obj) {
        DB::save($obj);
      }
    }

    static public function checkAccountTable() {
      $sql = "select id from fumecalc where id = :id";
      $query = DB::$db->prepare($sql);
      $query->execute([":id" => DB::$ID]);

      return $query->rowCount() > 0 ? true : false;
    }

    static private function createAccountTable() {
      $sql = "insert into fumecalc(id, fume, tim, viktor) values(:id, 0, 0, 0)";
      $query = DB::$db->prepare($sql);
      $query->execute([":id" => DB::$ID]);
    }

    static private function handleAccountTable() {
      if(DB::checkAccountTable()) return 1;
      DB::createAccountTable();
      return 0;
    }
  }