import { NextPage } from 'next';
import Footer from '../footer';
import Navbar from '../navbar';

const Layout: NextPage = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
