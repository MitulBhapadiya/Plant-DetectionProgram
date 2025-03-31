
import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Bug, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Sprout size={28} />
            <span className="font-bold text-xl">Kishaan Margdarshan</span>
          </Link>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            className="md:hidden text-white hover:bg-primary-light" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/crop-info" 
              className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-primary-light transition duration-300"
            >
              <Sprout size={20} />
              <span>Crop Information</span>
            </Link>
            <Link 
              to="/disease-detection" 
              className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-primary-light transition duration-300"
            >
              <Bug size={20} />
              <span>Disease Recognition</span>
            </Link>
          </div>
        </div>
        
        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-2 space-y-2">
            <Link 
              to="/crop-info" 
              className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-primary-light transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <Sprout size={20} />
              <span>Crop Information</span>
            </Link>
            <Link 
              to="/disease-detection" 
              className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-primary-light transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <Bug size={20} />
              <span>Disease Recognition</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
