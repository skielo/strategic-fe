import { FC } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Goals from '../../components/Goals';
import Link from 'next/link';

const GoalsPage: FC = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return (
      <Layout>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No Goal Selected</h1>
          <p className="mb-4">Please select a goal from the Key Results page.</p>
          <Link href="/key-results" className="text-blue-500 hover:underline">
            Go to Key Results
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Goals />
    </Layout>
  );
};

export default GoalsPage;