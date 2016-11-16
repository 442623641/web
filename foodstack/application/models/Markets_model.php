<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Markets_model extends CI_Model{
// 	const TBL_PRICE='price_';
// 	private $fields=[ "breed","min","max","average","rise","market","date","unit"];
// 	public function get_markets($params,$date,$offset,$limit){
// 		$this->mongo_db->limit($limit);
// 		$this->mongo_db->offset($offset);
// 		return $this->mongo_db->select($this->fields)->get_where(self::TBL_PRICE.$date, $params);	
// 	}
	const TBL_FOOD='food';
	const FLD_FOOD='`type`,`average`,`name`,`minPrice`,`maxPrice`,`avgPrice`,`link` ,`letter`,`pinyin`';
	public function get_markets($condition,$num,$offset){
		$this->db->limit($offset,$num);
		$this->db->order_by('createDate','desc');
		$this->db->order_by('type');
		$this->db->select(self::FLD_FOOD);
		$this->db->from(self::TBL_FOOD);
		$this->db->where('createDate=(select max(createDate) from food)');
		$this->db->where($condition);
		$query = $this->db->get();
		return $query->result_array();
	}
	public function get_foods($num,$offset){
		$this->db->limit($offset,$num);
		//SELECT name,link from food GROUP BY name
		$this->db->select('`name`,`link`');
		$this->db->from(self::TBL_FOOD);
		$this->db->group_by('`name`');
		$query = $this->db->get();
		return $query->result_array();
	}
	public function get_foodType(){
		$query = $this->db->get('foodType');
		return $query->result_array();
	}
	public function get_material($condition){
		//return $this->mongo_db->get('material');
	 	//return $this->db->get_where('material', $condition);
		$this->db->where($condition);
		$query = $this->db->get('material');
		return $query->first_row('array');
 	}
	public function insert_material($data){
		return $this->db->insert_batch('material',$data);
	}
	public function get_provinceMarket($ID){
		$this->db->where('provinceID='.$ID);
		$query = $this->db->get('market');
		return $query->result_array();
	}
	public function get_province(){
		$query = $this->db->get('province');
		return $query->result_array();
	}
	public function get_priceOfProvince($id,$marketId){
		$query = $this->db->query('select a.avgPrice,b.name from food a left join market b on a.marketID=b.ID '.
					'where a.link='.$id.' and a.marketID in '.
					'(SELECT ID from market where provinceID='.
					'(SELECT DISTINCT provinceID FROM market where ID='.$marketId.')) '.
					'and createDate =(SELECT MAX(createDate) from food)');
		return $query->result_array();
	}
}