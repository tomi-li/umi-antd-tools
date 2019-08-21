## SORT BY

前端如果有搜索加排序的需求, 可以在 Search Header 里面一起帮忙改善下

```
  <SortBy key={'sort'} options={[
          ['key1', 'asc', 'desc'], 可以这么写 支持 正叙倒叙
          'key2' // 只有正叙
        ]} />
```
会在 search header 里面生成组建样式， 点击会在 url 里面加入 key1_asc-key2_asc 的形式
按照 {key1}_{order2}-{key2}_{order2} 的规则

```
后端 extends helper  加入了 buildSort 方法就可以直接在 sequelize 里面实现排序


 public async pagedList(page: number, pageSize: number, criteria: object): Promise<object> {
   const where = this.ctx.helper.buildWhere(criteria);
   const order = this.ctx.helper.buildSort(criteria);
   return await this.Audit3StatisticModel.findAndCountAll({
     where,
     order,
     limit: pageSize,
     offset: (page - 1) * pageSize,
   });
 }
 
``` 

