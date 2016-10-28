<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

//商品模型
class Lotteryissue_model extends CI_Model{
	const TBL_LOTTERYISSUE = 'lotteryissue';
	const TBL_LOTTERYSTOP = 'lotterystop';
	#获取当期期号
	public function getIssue($lotteryID){
		$condition['lotteryID']=$lotteryID;
		$this->db->select('issue,stopTime,nextTime,nextIssue,NOW() as now');
		$query = $this->db->where($condition)->get(self::TBL_LOTTERYISSUE);
		return $query->row_array();
	}
	#获取休市时间
	public function getLotteryStop($lotteryID){
		$condition['lotteryID']=$lotteryID;
		$query = $this->db->where($condition)->get(self::TBL_LOTTERYSTOP);
		return $query->row_array();
	}
}