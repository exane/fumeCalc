<?php
  require_once("../db.conf.php");

  DB::$db = new PDO("mysql:host=$HOST;dbname=$DB", $USER, $PW, [PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ]);


  class DB {
    static public $db;

    static public function save($obj) {
      $sql = "insert into fumecalc_history
              (date, account_before, deduction, after, note, fees, client, signed, private, history_id)
              values(:date, :before, :deduc, :after, :note, :fees, :client, :signed, :private, 1)";
      $query = DB::$db->prepare($sql);
      $query->execute([":date" => $obj["date"], ":before" => $obj["before"], ":deduc" => $obj["deduction"], ":after" => $obj["after"], ":fees" => $obj["fees"], ":signed" => $obj["signed"], ":client" => $obj["client"], ":note" => $obj["note"], ":private" => $obj["isPrivate"] != "false" ? 1 : 0]);

      if(isset($obj["isPrivate"]) && $obj["isPrivate"] != "false") {
        DB::changePrivateAccountsBy(($obj["deduction"] - $obj["fees"]) / 2, $obj["isPrivate"]);

      }
      DB::changeAccountBy($obj["deduction"] - $obj["fees"]);
    }

    static public function load() {
      $sql = "select * from fumecalc_history";
      $query = DB::$db->prepare($sql);
      $query->execute();

      return ["account" => DB::getAccount(), "history" => $query->fetchAll()];
    }

    static private function getAccount() {
      $sql = "select fume, tim, viktor from fumecalc";
      $query = DB::$db->prepare($sql);
      $query->execute();

      return $query->fetch();
    }

    static private function changePrivateAccountsBy($amount, $account, $_flag = false) {
      $sql = "update fumecalc set $account = :amount";
      $query = DB::$db->prepare($sql);
      $query->execute([":amount" => ((int)DB::getAccount()->$account + (int)$amount)]);

      if($_flag)
        return 0;

      if($account == "tim") {
        return DB::changePrivateAccountsBy(-$amount, "viktor", true);
      }

      return DB::changePrivateAccountsBy(-$amount, "tim", true);
    }

    static private function changeAccountBy($amount) {
      $sql = "update fumecalc set fume = :account";
      $query = DB::$db->prepare($sql);
      $query->execute([":account" => ((int)DB::getAccount()->fume) + (int)$amount]);
    }
  }