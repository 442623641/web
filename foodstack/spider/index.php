<?php
//
 	//echo  decodeUnicode(json_encode($markets));
 }
function insertProvince($data){
}
function getTypecode($type){
//
function getFailOrder($table,$sel,$lotteryID,$issue){
    $sql="select ".$sel." from ".$table." where lotteryID=".$lotteryID." and state in(0,8,11) and issue<".$issue;
    $query=exec_sql($sql,1);
    return $query;
}

//修改数据库表
function updateData($table,$arr1,$arr2){
    $set1=implode(',',$arr1);
    $set2=' and '.implode(' and ', $arr2);
    $sql="update ".$table." set ".$set1." where 1=1 ".$set2;

    exec_sql($sql,2);
}