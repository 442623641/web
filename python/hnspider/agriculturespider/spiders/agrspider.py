#-*-coding:utf8-*-

from scrapy_redis.spiders import RedisSpider
from scrapy.selector import Selector
from scrapy.http import Request
from agriculturespider.items import AgrspiderItem
from scrapy.conf import settings
import re
import json
import time,datetime

class agrSpider(RedisSpider):
    name = "agrspider"
    redis_key = 'agrspider:start_urls'
    searchDate=settings['SEARCH_DATE'].strftime('%Y-%m-%d')
    today=settings['DOCDATE'].strftime('%Y-%m-%d')
    base_url='http://news.cnhnb.com/hangqing/'
    market_url='http://news.cnhnb.com/tools/market.ashx?id={0}&action=CollectPoint'
    start_urls = [base_url+'1.htm?stime={0}&etime={0}&action=query'.format(searchDate),
                  #http://news.cnhnb.com/hangqing/1.htm?area=3&stime=&etime=&collectpoint=0&action=query
                  #'http://www.daomubiji.com/qi-xing-lu-wang-01.html'
                  ]
    def parse(self,response):
        selector = Selector(response)
        html=selector.xpath('//select[@id="area"]/option[position() > 1]')
        pro = html.xpath('text()').extract()
        procode = html.xpath('@value').extract()
        for i in range(len(procode)):
            item = AgrspiderItem()
            item['province'] = pro[i]
            item['procode']=int(procode[i])
            yield Request(self.market_url.format(item['procode']),callback='parseMarkets', meta={'item':item})

    def parseMarkets(self, response):
        selector = Selector(response)
        item = response.meta['item']
        try:
            json_mar= json.loads(selector.xpath('//body/p/text()').extract()[0])
            if not json_mar['IsError'] and not json_mar['Data']:
                return
            collectpoints=json_mar['Data']
        except Exception,e:
            return
        for j in range(len(collectpoints)) :
            url=self.base_url+'1.htm?area={1}&stime={0}&etime={0}&action=query&collectpoint={2}'.format(self.searchDate,item['procode'],collectpoints[j]['id'])
            item['marketcode']=collectpoints[j]['id']
            yield Request(url, callback='parsePage', meta={'item':item})
    def parsePage(self, response):
        selector = Selector(response)
        item = response.meta['item']
        ul=selector.xpath('//div[@id="Contxt"]/ul[@class="hnw_pjtd"]')
        if not ul:
            return
        market=ul.xpath('li[position()=3]/text()').extract()
        breed=ul.xpath('li[position()=1]/a/text()').extract()
        max=ul.xpath('li[position()=4]/text()').extract()
        min=ul.xpath('li[position()=5]/text()').extract()
        average=ul.xpath('li[position()=6]/text()').extract()
        img= ul.xpath('li[position()=7]/img/@src').extract()
        for i in range(len(ul)):
            item['date']= self.today
            item['market']= market[i]
            item['breed'] = breed[i]
            item['max']=float(max[i])
            item['min']=float(min[i])
            item['average']=float(average[i])
            item['rise']=[+1,-1] ['dfd.png' in img[i]]
            item['unit']='元/kg'
            yield item
        nextLink = selector.xpath('//div[@class="page mt_40"]/center/a[last()]/@href').extract()
         #最后一页，没有下一页的链接
        if nextLink:
            nextLink = nextLink[0]
            print nextLink
            yield Request(nextLink,callback=self.parsePage,meta={'item':item})
        else:
            return