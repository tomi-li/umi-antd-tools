# 
DataPaginationWrap

省掉了
- routerRedux 分页更新 url 的逻辑
- 页码溢出的计算逻辑
- 数据加载 loading 问题
- 单层 分页还是双层分页的问题
- 无数据时的显示
- 不用传 dispatch

``` old
import { routerRedux } from 'dva/router';
import { Pagination } from 'antd';
import EmptyOccupy from '@/components/EmptyOccupy/EmptyOccupy';

const { dispatch, routeObj } = allProps;
const { query, pathname } = routeObj;

const pageChange = page => {
  dispatch(
    routerRedux.push({
      pathname,
      query: {
        ...query,
        page
      }
    }),
  );
};

const onPageSizeChange = (type, current, pageSize) => {
  dispatch(
    routerRedux.push({
      pathname,
      query: {
        ...query,
        limit: pageSize
      }
    }),
  );
};

if (videoList.length > 0) {
  return (
    <div className={styles['video-list']}>
      <Pagination
        showQuickJumper
        showSizeChanger
        onShowSizeChange={onPageSizeChange}
        current={+query.page || 1}
        pageSize={+query.limit || 40}
        total={total || 0}
        onChange={pageChange.bind(this)}
        showTotal={function (total) {
          return `Total Items：${total}`;
        }}
      />
      <div className={`container`}>
        {videoList.map((item, i) => {
          const itemProps = {
            ...allProps,
            item,
            index: i
          };

          return (
            <div key={item.video_id}>
              <VideoCardItem {...itemProps} />
            </div>
          );
        })}
      </div>
    </div>
  );
} else {
  return <EmptyOccupy />;
}
```

```new
import DataPaginationWrap from '@/components/DataPaginationWrap';

<DataPaginationWrap
    rows={videoList}
    count={total || 0}
    defaultPageSize={40}
    pageSizePropName={'limit'}
    loading={'reordering/getVideo'}
    wrapperClassName={styles['video-list']}
    listWrapperClassName={'container'}
    renderItem={(item, index) => {
      const itemProps = {
        ...allProps,
        item,
        index
      };
      return (
        <div key={item.video_id}>
          <VideoCardItem {...itemProps} />
        </div>
      );
    }}
  />
);
```
