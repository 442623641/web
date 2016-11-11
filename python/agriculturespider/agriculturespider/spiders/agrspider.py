#-*-coding:utf8-*-

from scrapy_redis.spiders import RedisSpider
from scrapy.selector import Selector
from scrapy.http import Request
from agriculturespider.items import AgrspiderItem
import re
import time,datetime

class agrSpider(RedisSpider):
    name = "agrspider"
    redis_key = 'agrspider:start_urls'
    pageSize=10000
    base_url='http://scjg.xn121.com/search.php'
    start_urls = [base_url,
                  #'http://www.daomubiji.com/qi-xing-lu-wang-01.html'
                  ]
    def parse(self,response):
        selector = Selector(response)
        html=selector.xpath('//select[@id="area"]/option[position() > 1]')
        content = html.xpath('text()').extract()
        procode = html.xpath('@value').extract()
        for i in range(len(procode)):
            url='{0}?area={1}&num={2}'.format(self.base_url,procode[i],self.pageSize)
            item = AgrspiderItem()
            item['province'] = content[i]
            item['procode']=procode[i]
            yield Request(url, callback='parsePage', meta={'item':item})

    def parsePage(self, response):
        selector = Selector(response)
        item = response.meta['item']
        allcount= int(selector.xpath('//div[@class="page selPage"]/div[@class="left"]/text()').re(r"\d+\.?\d*")[0])
        pagecount=allcount/self.pageSize+1
        for i in range(1,pagecount):
            url = '{0}?area={1}&num={2}&page={3}'.format(self.base_url,item['procode'],self.pageSize,i)
            yield Request(url, callback='parseContent',meta={'item':item})

    def parseContent(self, response):
        # <table cellpadding="0" cellspacing="0" width="100%" class="gqBox_3 search_8" border="0">
        # <tr>
        # <th>名称</th>
        # <th>价格</th>
        # <th>产地</th>
        # <th>发布日期</th>
		 #        </tr>
        # <tr  onmouseover="this.className='active'" onmouseout="this.className=''" >
        # <td><a href="./search.php?name=%E8%8B%A6%E4%B8%81%E8%8C%B6">苦丁茶</a> </td>
        # <td>120.00元/公斤</td>
        # <td><span class="blue"><a href="./search.php?marketid=334" title="贵州遵义市湄潭县西南茶城">贵州遵义市湄潭县西南茶城</a> </span></td>
        # <td>2016-01-20</td>
        # </tr>
        selector = Selector(response)
        item = response.meta['item']

        table=selector.xpath('//table[@class="gqBox_3 search_8"]/tr[position()>1]')
        breed = table.xpath('td[position()=1]/a/text()').extract()
        price=table.xpath('td[position()=2]/text()').extract()
        market=table.xpath('td/span/a/text()').extract()
        date=table.xpath('td[position()=4]/text()').extract()
        t = time.strptime(date[0],'%Y-%m-%d')
        y,m,d=t[0:3]
        #如果不是当天，停止抓取
        if (datetime.date.today()-datetime.date(y,m,d)).days>0:
            exit()
        for i in range(len(table)):
            t = time.strptime(date[i],'%Y-%m-%d')
            y,m,d=t[0:3]
            item['date']= datetime.date(y,m,d)
            item['breed']=breed[i]
            item['market']=market[i]
            item['price']=float(re.findall(r"\d+\.?\d*",price[i])[0])
            item['unit']=re.sub("[A-Za-z0-9\[\.]", "", price[i])
            yield item