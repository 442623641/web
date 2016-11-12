<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

//用户购彩模型（自购）
class Shop_model extends CI_Model{
	const TBL_SHOP = 'shop';
	// const TBL_LOTTERYUSERENTITY = 'lotteryuserentity';
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
	
	#shop
	public function get_shop($condition){
		$this->db->where($condition);
        $query = $this->db->get(self::TBL_SHOP);  
        return $query->first_row(); 
	}
	#shop
	public function insert_shop($data){
		return $this->db->insert(self::TBL_SHOP,$data);
	}
	#shop
	public function update_shop($data){
		$this->db->where(['ID'=>$data['ID']]);
		return $this->db->update(self::TBL_SHOP,$data);
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