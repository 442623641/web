<?php
class Test extends CI_Controller{
	
	public function t(){
		
		$this->load->library('mymongo');
		
		$mongo = new MyMongo();
		
		$value = array("name" => "小明7", "age" => 27, "addr" => array("country" => "中国", "province" => "广西", "city" => "桂林"));
		$mongo->insert('blog', $value);

	}
	
}