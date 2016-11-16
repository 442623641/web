<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Key_model extends CI_Model{
	const TBL_STACK='stack';
	const TBL_STACK_EXTENSION='stackextension';
	const TBL_KEY='key';
	public function get_key($key){
		$this->db->where("key='".$key."'");
		$this->db->get(self::TBL_KEY);
		return $query->first_row('array');
	}
	public function set_Key($data){
		$this->db->insert(self::TBL_KEY,$data);
		return $query->result_array();
	}
	public function update_Key($id,$key){
	    $sql="update stack set key=concat(key,',".$id."') where key not like '%,".$id."%' and  key like '%".$key."%' ";
		return $this->db->query($sql);
	}	
}
?>