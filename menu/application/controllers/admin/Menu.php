<?php
defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class Menu extends API_Controller {
	function __construct() {
		parent::__construct ();
		$this->load->Model('Menu_model');
	}
	public function menu_get() {
// 		$index=empty($this->get('rows'))?10:$this->get('rows');
// 		$offset=@$this->get('start');
// 		$num=($index*$offset)-$offset;
		$data=$this->Menu_model->get_menu($this->get('shopID'),$this->get('start'),$this->get('rows'));
		//$dd=from($d)->in($data)->where('$dd =>$dd[\'type\'] == 30031');
		$this->retAccess($data);
	}
	public function type_get() {
		// 		$index=empty($this->get('rows'))?10:$this->get('rows');
		// 		$offset=@$this->get('start');
		// 		$num=($index*$offset)-$offset;
		$data=$this->Menu_model->get_type($this->get('shopID'));
		//$dd=from($d)->in($data)->where('$dd =>$dd[\'type\'] == 30031');
		$this->retAccess($data);
	}
}
?>