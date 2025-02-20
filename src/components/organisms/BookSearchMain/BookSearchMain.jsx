import SearchBar from '../../molecules/SearchBar/SearchBar';
import SearchInfo from '../../atoms/SearchInfo/SearchInfo';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { getAladinReqData } from '../../../api/searchAladin';
import SearchList from '../SearchList/SearchList';
import { Link } from 'react-router-dom';
import debounce from '../../../utils/debounce';

function BookSearchMain() {
  /* 책 검색 페이지에 필요한 데이터를 debouncedQuery로 요청.
  책 검색 페이지 내 SearchBar input value의 실시간 상태 업데이트를 위해 localQuery와 debouncedQuery를 구분하여 설정. */
  const [localQuery, setLocalQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    error,
    failureCount,
    failureReason,
  } = useInfiniteQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: ({ pageParam }) => getAladinReqData(debouncedQuery, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage && 'current_page' in lastPage) {
        return lastPage.current_page + 1;
      }
      return undefined;
    },
  });

  // 쿼리 요청 실패 횟수와 실패 이유를 기준으로 error throwing 기능 구현
  if (failureCount >= 1 && failureReason.message.startsWith('Server'))
    throw error;

  if (failureCount === 4) throw error;

  const updateDebouncedQuery = useMemo(
    () =>
      debounce((query) => {
        setDebouncedQuery(query);
      }),
    []
  );

  const handleQuery = useCallback(
    (e) => {
      setLocalQuery(e.target.value);
      updateDebouncedQuery(e.target.value);
    },
    [updateDebouncedQuery]
  );

  // SearchBar 내 input 창에 입력된 검색어와 실제 렌더링 된 데이터가 다를 경우 data가 stale 되었음을 표시하기 위한 상태 선언
  const isStale = debouncedQuery !== localQuery;

  // 클릭 시 input 내 query keyword value를 reset하는 'click' event handler 선언
  const handleReset = useCallback(() => {
    setLocalQuery('');
    updateDebouncedQuery('');
  }, [updateDebouncedQuery]);

  /* 무한 스크롤 기능 구현을 위한 react-intersection-observer 모듈 사용 */
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && debouncedQuery !== '') {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, debouncedQuery]);

  return (
    <main className="relative px-4 pt-[81px] pb-[200px] overflow-scroll h-screen hide-scrollbar">
      <SearchBar
        query={localQuery}
        onQueryChange={handleQuery}
        onResetClick={handleReset}
        pgName="book-search"
      />
      {debouncedQuery === '' ? (
        <div className="flex flex-col justify-center items-center absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]">
          <img className="w-24" src="/images/characters/locked.png" alt="" />
          <span className="text-grayscale-500 text-content-small">
            책을 검색하여 책장에 추가해보세요.
          </span>
        </div>
      ) : data?.pages[0].page_data.totalResults !== 0 ? (
        <>
          <SearchInfo
            query={debouncedQuery}
            totalResults={data?.pages[0].page_data.totalResults}
            isLoading={isLoading}
          />
          <SearchList data={data} isStale={isStale} isFetching={isFetching} />
          <div ref={hasNextPage ? ref : undefined}>
            {isFetchingNextPage ? (
              <p>불러오는 중...</p>
            ) : hasNextPage ? (
              <p></p>
            ) : (
              <p></p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] flex flex-col text-grayscale-500 text-content-small text-center gap-8">
            <span>검색 내역이 없어요.</span>
            <div className="flex flex-col">
              <span>해당 책이 없다면 책 정보를</span>
              <span>직접 입력하여 추가할 수 있답니다!</span>
            </div>
            <Link
              to="/library/book-registration"
              className="text-primary-500 underline underline-offset-4"
            >
              직접 입력하기
            </Link>
          </div>
        </>
      )}
    </main>
  );
}

export default BookSearchMain;
