import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Portal from './pages/Portal';
import Playground from './pages/Playground';
import Status from './pages/Status';
import Enterprise from './pages/Enterprise';
import Careers from './pages/Careers';
import DocsLayout from './layouts/DocsLayout';
import Docs from './pages/Docs';
import About from './pages/About';

// Placeholder components for now
const Services = () => <div className="container" style={{ paddingTop: '150px' }}><h1>Services</h1><p>Coming Soon...</p></div>;
const Projects = () => <div className="container" style={{ paddingTop: '150px' }}><h1>Projects</h1><p>Coming Soon...</p></div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="projects" element={<Projects />} />
        <Route path="contact" element={<Contact />} />
        <Route path="portal" element={<Portal />} />
        <Route path="playground" element={<Playground />} />
        <Route path="status" element={<Status />} />
        <Route path="enterprise" element={<Enterprise />} />
        <Route path="careers" element={<Careers />} />
      </Route>

      <Route path="/docs" element={<DocsLayout />}>
        <Route index element={<Docs />} />
        <Route path="*" element={<Docs />} />
      </Route>
    </Routes>
  );
}

export default App;
