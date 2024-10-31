import { FC } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import KeyResults from '../../components/KeyResults';
import Link from 'next/link';

const KeyResultsPage: FC = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return (
      <Layout>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No Key Result Selected</h1>
          <p className="mb-4">Please select a key result from the Objectives page.</p>
          <Link href="/objectives" className="text-blue-500 hover:underline">
            Go to Objectives
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <KeyResults />
    </Layout>
  );
};

export default KeyResultsPage;