import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Layout } from './components/Layout';
import { Brands } from './pages/Brands';
import { Catalog } from './pages/Catalog';
import { Cities } from './pages/Cities';
import { Content } from './pages/Content';
import { Dashboard } from './pages/Dashboard';
import { Disputes } from './pages/Disputes';
import { Franchise } from './pages/Franchise';
import { Mechanics } from './pages/Mechanics';
import { Memberships } from './pages/Memberships';
import { Orders } from './pages/Orders';
import { Promotions } from './pages/Promotions';

const App: React.FC = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/mechanics" element={<Mechanics />} />
      <Route path="/disputes" element={<Disputes />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/brands" element={<Brands />} />
      <Route path="/cities" element={<Cities />} />
      <Route path="/franchise" element={<Franchise />} />
      <Route path="/memberships" element={<Memberships />} />
      <Route path="/promotions" element={<Promotions />} />
      <Route path="/content" element={<Content />} />
    </Routes>
  </Layout>
);

export default App;
