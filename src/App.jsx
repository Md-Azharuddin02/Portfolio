import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './Components/ErrorBoundary'
import Loader from './Components/Home/Loader';
import PageNotFound from './Components/PageNotFound';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"


const Layout = React.lazy(() => import('./Components/Layout/Layout'));
const Home = React.lazy(() => import('./Pages/Home'));


function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>

        <Analytics />
        <SpeedInsights/>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App; 