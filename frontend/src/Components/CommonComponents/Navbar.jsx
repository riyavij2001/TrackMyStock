import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { Link } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
} from "@heroui/react";
import { GraphBarIncreaseSolid } from '../Icons/GraphIcon';

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const menuItems = [
    { name: 'Home', link: "/" },
    { name: 'About Us', link: "/about-us" },
    { name: 'Subscribe', link: "/subscribe" },
    { name: 'Search Stocks', link: "/stocks" },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} style={{ background:'transparent' }} className="sticky top-0 z-50">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-white"
        />
        <NavbarBrand as={Link} to="/">
          <GraphBarIncreaseSolid color="#a8d603" />
          <p className="font-bold text-inherit text-[#a8d603] ml-2">Track My Stocks</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((page, index) => (
          <NavbarItem key={index}>
            {page.link === "#footer" ? (
              <a
                href={page.link}
                className="text-white"
                onClick={(e) => handleSmoothScroll(e, 'footer')}
              >
                {page.name}
              </a>
            ) : (
              <Link className="text-white" to={page.link}>
                {page.name}
              </Link>
            )}
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        {isAuthenticated ? (
          <NavbarItem>
            <Button
              className="bg-[#A05DD3] text-black font-semibold"
              onPress={handleLogout}
              variant="flat"
            >
              Logout
            </Button>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem>
              <Button as={Link} className="bg-[#a8d603] text-black font-semibold" to="/login" variant="flat">
                Login
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} className="bg-[#a8d603] text-black font-semibold" to="/signup" variant="flat">
                SignUp
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default NavigationBar;