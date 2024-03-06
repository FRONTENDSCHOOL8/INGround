import { createBrowserRouter } from 'react-router-dom';
import App from '/src/app/App';
import LibraryPage from '/src/components/pages/LibraryPage';
import RecordPage from '/src/components/pages/RecordPage';
import FeedPage from '/src/components/pages/FeedPage';
import CharacterPage from '/src/components/pages/CharacterPage';
import MypagePage from '/src/components/pages/MypagePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'library',
        element: <LibraryPage />,
      },
      {
        path: 'record',
        element: <RecordPage />,
      },
      {
        path: 'feed',
        element: <FeedPage />,
      },
      {
        path: 'character',
        element: <CharacterPage />,
      },
      {
        path: 'mypage',
        element: <MypagePage />,
      },
    ],
  },
]);

export default router;
