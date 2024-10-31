import { FC } from 'react';
import Layout from '../components/Layout';

const Home: FC = () => {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Strategic Management Dashboard</h1>
      <p>Welcome to the Strategic Management Dashboard. Please use the navigation menu to explore different sections.</p>
    </Layout>
  );
};

export default Home;
