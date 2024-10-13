import { useQuery } from '@tanstack/react-query';
import { loginUserData } from '../../../utils/controlUserData';
import { getUserFeedData } from '../../../utils/controlFeedData';
import { motion } from 'framer-motion';
import FeedCard from '../FeedCard/FeedCard';
import { Skeleton } from '@mui/material';

function FeedList() {
  const { data, isLoading } = useQuery({
    queryKey: ['feed', loginUserData],
    queryFn: async () => getUserFeedData(),
    staleTime: 1000 * 60 * 5,
  });

  const listVar = {
    start: { opacity: 0 },
    end: {
      opacity: 1,
      transition: {
        type: 'spring',
        mass: 0.8,
        staggerChildren: 0.03,
      },
    },
  };

  return (
    <main className="mx-4  pt-[88px] pb-[120px]">
      <motion.ul
        variants={listVar}
        initial="start"
        animate="end"
        className="flex flex-col gap-3"
      >
        {isLoading ? (
          <>
            <Skeleton
              variant="rounded"
              sx={{ borderRadius: '0.5rem', width: 1, height: 216 }}
            >
              <li className="flex flex-col w-full gap-4 px-4 py-5 border rounded-lg bg-grayscale-white border-grayscale-100"></li>
            </Skeleton>
            <Skeleton
              variant="rounded"
              sx={{ borderRadius: '0.5rem', width: 1, height: 216 }}
            >
              <li className="flex flex-col w-full gap-4 px-4 py-5 border rounded-lg bg-grayscale-white border-grayscale-100"></li>
            </Skeleton>
            <Skeleton
              variant="rounded"
              sx={{ borderRadius: '0.5rem', width: 1, height: 216 }}
            >
              <li className="flex flex-col w-full gap-4 px-4 py-5 border rounded-lg bg-grayscale-white border-grayscale-100"></li>
            </Skeleton>
          </>
        ) : (
          data?.map((feed) => (
            <FeedCard
              key={feed.id}
              bookTitle={feed.expand?.book_id?.title}
              title={feed.title}
              content={feed.content}
              date={feed.created}
              nickname={feed.expand?.book_id?.expand.user_id.nickname}
              book_height={feed.expand?.book_id?.expand.user_id.book_height}
              isLoading={isLoading}
            />
          ))
        )}
      </motion.ul>
    </main>
  );
}

export default FeedList;
