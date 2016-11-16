<?php
defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class Menu extends API_Controller {
	function __construct() {
		parent::__construct ();
		$this->load->Model ( 'Key_model' );
	}
	
	public function key_post() {
		$tag=trim($this->post( 'tag' ));
		if(!$tag){
			return false;
		}
		$key=$this->Key_model->get_key($tag);
		return $this->db->Key_model->update_key($key['ID'],$key['key']);
		
	}
}
?>