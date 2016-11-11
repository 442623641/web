#-*-coding:utf8-*-

from scrapy_redis.spiders import RedisSpider
from scrapy.selector import Selector
from scrapy.http import Request
from agriculturespider.items import FoodspiderItem
from scrapy.conf import settings
import re
import json
import time,datetime

class agrSpider(RedisSpider):
  #for  x in settings['FOODS']:
   #     print(x['name']+','+x['link']);
    #exit()
    name = "agrspider"
    redis_key = 'agrspider:start_urls'
    searchDate=settings['SEARCH_DATE'].strftime('%Y-%m-%d')
    today=settings['DOCDATE'].strftime('%Y-%m-%d')
    base_url='http://app.95e.com'
    market_url='http://news.cnhnb.com/tools/market.ashx?id={0}&action=CollectPoint'
    start_urls = [base_url+'/vm/getMaterial2.aspx',
                  #http://news.cnhnb.com/hangqing/1.htm?area=3&stime=&etime=&collectpoint=0&action=query
                  #'http://www.daomubiji.com/qi-xing-lu-wang-01.html'
                  ]
    def parse(self,response):
        for  x in settings['FOODS']:
            item = FoodspiderItem()
            item['name']=x['name']
            item['link']=x['link']
            yield Request(url=self.base_url+'/vm/getMaterial2.aspx?name={0}'.format(item['name']),callback='parseMaterial', meta={'item':item})
    def parseMaterial(self, response):
        selector = Selector(response)
        item = response.meta['item']
        try:
            #json_mar= json.loads(selector.xpath('//body/p/text()').extract()[0].encode('utf-8').replace('<sub>','').replace('</sub>',''))
            json_mar=json.loads(response.body_as_unicode().encode('utf-8'))
            if not json_mar['errorCode'] and not json_mar['data']:
                return
            data=json_mar['data']
            if data['description']:
                item['description']=data['description']
            if data['description']:
                item['description']=data['description']
            if data['synonym']:
                item['synonym']=data['synonym']
            m=data['nutritionDesciption']
            if m:
                item['per']=m['per']
                if m['content']:
                    item['content']=m['content']
                    #item['content']=json.dump(m['content'])
            if data['compatibility']:
                    compatibility=data['compatibility']
                    if compatibility['good']:
                        for i in range(len(compatibility['good'])):
                            compatibility['good'][i]['pic']=(int)(re.findall('http://img.95e.com/vm/mat/FQF(.*?)\.',compatibility['good'][i]['pic'])[0])
                    item['goodcp']=compatibility['good']
                    if compatibility['bad']:
                        for i in range(len(compatibility['bad'])):
                            compatibility['bad'][i]['pic']=(int)(re.findall('http://img.95e.com/vm/mat/FQF(.*?)\.',compatibility['bad'][i]['pic'])[0])
                    item['badcp']=compatibility['bad']
        except Exception,e:
            print e
            return
        yield item