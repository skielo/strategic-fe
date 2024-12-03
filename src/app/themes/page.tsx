import { FC } from 'react';
import StrategicThemes from '../../components/StrategicThemes';
import Layout from '../../components/Layout';
import { ProtectedRoute } from '../../components/ProtectedRoute';


const ThemesPage: FC = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <StrategicThemes />
      </Layout>
    </ProtectedRoute>
  );
};

export default ThemesPage;