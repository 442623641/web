# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

from scrapy import Field, Item


class AgrspiderItem(Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    breed = Field()
    price = Field()
    min=Field()
    max=Field()
    average=Field()
    market = Field()
    date = Field()
    province=Field()
    averageFlag=Field()
    updated=Field()
    link=Field()
    marketType=Field()
    foodType=Field()
class FoodspiderItem(Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    name = Field()
    per= Field()
    content = Field()
    link=Field()
    description=Field()
    goodcp=Field()
    badcp = Field()
    synonym = Field()
    category=Field()