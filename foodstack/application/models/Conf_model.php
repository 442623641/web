<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Conf_model extends CI_Model{
	const TBL_MENU='market';
	public function get_market(){
		$query = $this->db->query('select a.ID as MarketID,a.name as market,b.`name` as province,city from 
									market a left join province b on a.provinceID=b.ID');
		return $query->result_array();
	}
}