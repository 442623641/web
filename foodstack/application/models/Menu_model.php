<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Menu_model extends CI_Model{
	const TBL_MENU='menu';

	public function get_menuByName($name,$num,$offset){
 		$this->db->limit($offset,$num);
		$this->db->order_by('ID','desc');
		$this->db->select('ID,name,brief,pic,tips');
		$this->db->from(self::TBL_MENU);
		$this->db->like('materials', $name, 'both');
		$query = $this->db->get();
		return $query->result_array();
	}
	public function get_menu($condition){
		$this->db->where($condition);
		$query = $this->db->get(self::TBL_MENU);
		return $query->first_row('array');
	}
	public function get_menus($name,$num,$offset){
		$this->db->limit($offset,$num);
		$this->db->order_by('ID','desc');
		$this->db->select('ID,name,brief,pic,tips');
		$this->db->from(self::TBL_MENU);
		if($name){
			$this->db->like('name', $name, 'both');
		}
		$query = $this->db->get();
		return $query->result_array();
	}
	public function get_menusCounts($name){
		if($name){
			$this->db->like('name', $name, 'both');
		}
		return $this->db->count_all_results(self::TBL_MENU);
		
		 
	}
}