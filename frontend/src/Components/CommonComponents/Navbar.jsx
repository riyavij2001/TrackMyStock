import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@heroui/react";
import { GraphBarIncreaseSolid } from '../Icons/GraphIcon';

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const menuItems = [{ name: 'About Us', link: "#aboutUs" }, { name: 'Subscribe', link: "#subscribe" }, { name: 'Search Stocks', link: "#stocks" }, { name: 'Contact Us', link: "#footer" }
  ];

  const handleScrollToSection = (sectionId) => {
    const section = document.querySelector(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMenuOpen(false); // Close the menu after scrolling
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} style={{ backgroundColor: 'rgba(15, 3, 23' }}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-white"
        />
        <NavbarBrand>
          <GraphBarIncreaseSolid color="white" />
          <p className="font-bold text-inherit text-white ml-2">Track My Stocks</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link className='text-white' href={"/"}>
            Home
          </Link>
        </NavbarItem>
        {menuItems.map((page) => (
          <NavbarItem>
            <Link className='text-white' href={page.link}>
              {page.name}
            </Link>
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
              <Button as={Link} className="bg-[#A05DD3] text-black font-semibold" href="/login" variant="flat">
                Login
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} className="bg-[#A05DD3] text-black font-semibold" href="/signup" variant="flat">
                SignUp
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              className="w-full"
              color={
                "primary"
              }
              href={item.link}
              onClick={() => handleScrollToSection(item.link)} // Added scroll handler
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}

      </NavbarMenu>
    </Navbar>
  );
}

export default NavigationBar