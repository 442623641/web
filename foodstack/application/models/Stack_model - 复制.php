<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Stack_model extends CI_Model{
	const TBL_STACK='stack';
	const TBL_STACK_EXTENSION='stackextension';
	public function get_menu($id){
		$query = $this->db->query('SELECT ID,title,material,comment,pic,vc,
					favo_count,clicks,tags,class,time,minor,step,tips,photo from
				 stack a inner JOIN stackextension b on a.ID = b.stackID where ID='.$id);
		return $query->first_row('array');
	}
	public function get_menus($name,$value,$num,$offset){
		$this->db->limit($offset,$num);
		$this->db->order_by('favo_count','desc');
		$this->db->select('ID,title,pic,comment,clicks,favo_count,vc');
		$this->db->from(self::TBL_STACK);
		if($value){
			$this->db->like($name, $value, 'both');
		}
		$query = $this->db->get();
		return $query->result_array();
	}
	public function get_menusTop($offset=10,$orderby='favo_count'){
		$this->db->limit($offset);
		$this->db->order_by($orderby,'desc');
		$this->db->select('ID,title,pic,comment,clicks,favo_count,vc');
		$this->db->from(self::TBL_STACK);
		$query = $this->db->get();
		return $query->result_array();
	}
	public function get_menusCounts($name,$value){
		if($value){
			$this->db->like($name, $value, 'both');
		}
		return $this->db->count_all_results(self::TBL_STACK);
	}
	
}