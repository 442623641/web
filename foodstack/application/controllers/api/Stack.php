<?php
defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class Stack extends API_Controller {
	function __construct() {
		parent::__construct ();
	}
	public function menu_get() {
		$index = empty ( $this->get ( 'index' ) ) ? 1 : $this->get ( 'index' );
		$offset = @$this->get ( 'pageSize' );
		$num = ($index * $offset) - $offset;
		$sort=$this->get('sort');
		$sort||$sort="favo_count";
		$url= sprintf(config_item('stack_solr'),$this->get ( 'tag' ),$sort, $num,$offset);
		$response=$this->request($url);
		//echo $url;
		if(!$response||!isset($response['response'])||!isset($response['response']['docs']))
			$this->retAccess ([]);
		$this->retAccess ( $response['response']);
	}
}
?>