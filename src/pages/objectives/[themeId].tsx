import { FC } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Objectives from '../../components/Objectives';
import Link from 'next/link';

const ObjectivesPage: FC = () => {
  const router = useRouter();
  const { themeId } = router.query;

  if (!themeId) {
    return (
      <Layout>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No Theme Selected</h1>
          <p className="mb-4">Please select a theme from the Strategic Themes page.</p>
          <Link href="/themes" className="text-blue-500 hover:underline">
            Go to Strategic Themes
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Objectives />
    </Layout>
  );
};

export default ObjectivesPage;