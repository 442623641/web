<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

//用户购彩模型（自购）
class Lotteryuser_model extends CI_Model{
	const TBL_LOTTERYUSER = 'lotteryuser';
	const TBL_LOTTERYUSERENTITY = 'lotteryuserentity';
	#添加用户订单
	public function add_lotteryuser($data,$dataEntity){
		$this->db->trans_start();
		$this->db->insert(self::TBL_LOTTERYUSER,$data);
		$this->db->insert(self::TBL_LOTTERYUSERENTITY,$dataEntity);
		$this->db->trans_complete();
		if ($this->db->trans_status() === FALSE)
		{
		   return false;
		}
		return true;
	}
	
	#自购订单记录
	public function get_lotteryusers($condition,$num,$offset){
		$this->db->limit($offset,$num);
		$this->db->where($condition);
		$this->db->order_by('createDate','desc');  
		$this->db->order_by('updateDate','desc');
        $query = $this->db->get(self::TBL_LOTTERYUSER);  
        return $query->result_array(); 
	}
	
	#订单详细信息
	public function get_lotteryuser($id){
		$this->db->select('ID,lotteryID,state,issue,multiple,money,winMoney,createDate,updateDate,payState,runNumbers,text');
		$this->db->from(self::TBL_LOTTERYUSER);
		$this->db->join(self::TBL_LOTTERYUSERENTITY,'ID=lotteryUserID','inner');
		$this->db->where('ID=',$id);
		$query = $this->db->get();  
        return $query->first_row('array');
	}
	#副订单信息
	public function get_lotteryuserentity($id){
		$this->db->where('lotteryUserID=',$id);
		$query = $this->db->get(self::TBL_LOTTERYUSERENTITY);  
        return $query->first_row('array');
	}
	#获取订单信息
	public function update_lotteryUser($condition,$data){
		#$data['updateDate']=date('y-m-d H:i:s',time());
        $this->db->where($condition);
        $this->db->update(self::TBL_LOTTERYUSERENTITY,$data);
        return $this->db->affected_rows();
	} 
	

}