# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

from scrapy import Field, Item


class AgrspiderItem(Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    province=Field()
    procode=Field()
    date = Field()
    breed = Field()
    market = Field()
    price = Field()
    unit=Field()