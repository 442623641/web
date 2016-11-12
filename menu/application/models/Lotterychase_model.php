<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

//用户购彩模型（自购）
class Lotterychase_model extends CI_Model{
	const TBL_CHASEUSER = 'chaseuser';
	const TBL_LOTTERYCHASE = 'lotterychase';
	const TBL_CHASEUSERENTITY = 'chaseuserentity';
	const PRO = 'chaseorder_pro';
	const FLD_CHASE=' `ID`,`lotteryID`,`isWinners`,`issue`,`state` ,`money`,`winMoney` ,`multiple`,`memo`,`payState`,`chaseuser`.`createDate` ';
	const FLD_LOTTERYCHASE='`ID`,`state`,`issue`,`multiple`,`money`,`winMoney`,`runNumbers`';
	#添加追号订单
	public function add_chaseuser($params){
		//inuserID` `inmultiple` ,inlotteryID,`inisWinners,intext,chasestr`
		$sql = 'call '.self::PRO."('".$params['chaseID']."',".$params['userID'].','.
				$params['multiple'].','.$params['lotteryID'].','.
				$params['isWinners'].",'".$params['text']."','".
				$params['chasestr']."',".$params['betCount'].")";
		//var_dump($sql);
		$result=$this->db->query($sql);
		return $result->first_row('array');
	}
	#追号记录
	public function get_chaseusers($condition,$num,$offset){
		$this->db->select(self::FLD_CHASE);
		$this->db->from(self::TBL_CHASEUSER);
		$this->db->limit($offset,$num);
		$this->db->where($condition);
		$this->db->order_by('createDate','desc');  
		$this->db->order_by('updateDate','desc');
        $query = $this->db->get();  
        return $query->result_array(); 
	}
	#获取用户追号信息
	public function get_chaseuserJoinchaseentity($id){
		//$sql = "a.*,b.text";
		$this->db->select(self::FLD_CHASE.',`text`');
		$this->db->from(self::TBL_CHASEUSER);
		$this->db->join(self::TBL_CHASEUSERENTITY,'ID=chaseID','inner');
		$this->db->where('ID=',$id);
		$query = $this->db->get();  
        return $query->first_row('array'); 
	}
	#获取用户追号订单信息
	public function get_lotterychases($chaseID){
		$this->db->select(self::FLD_LOTTERYCHASE);
		$this->db->from(self::TBL_LOTTERYCHASE);
		$this->db->where('chaseID=',$chaseID);
		$query = $this->db->get();  
        return $query->result_array('array');
	}
	
	#更新订单信息
	public function update_lotterychase($lotteryID,$whe){	
		$sql='select a.ID,a.issue,a.money from '.self::TBL_LOTTERYCHASE." as a,lotteryissue as b where b.lotteryID=".$lotteryID." and a.issue>b.issue and a.state in (0,1) ".$whe;	
		$this->db->trans_begin();
		$querySl=$this->db->query($sql .' for update');
		$slCount=$this->db->affected_rows();
		$queryUp=$this->db->query('update '.self::TBL_LOTTERYCHASE.' set state=5,payState=3 where ID in (select c.ID from ('.$sql.') as c)');
		$upCount=$this->db->affected_rows();
		if($slCount!=$upCount){
			return false;
		}
		if ($this->db->trans_status() === FALSE)
		{
		    $this->db->trans_rollback();
		}
		else
		{
		    $this->db->trans_commit();
		}
		return $querySl->result_array('array');
	}
}