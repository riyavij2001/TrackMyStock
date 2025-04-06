import React from 'react'
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

  const menuItems = [ { name: 'About Us', link: "#aboutUs" }, { name: 'Subscribe', link: "#subscribe" }, { name: 'Search Stocks', link: "#stocks" }, { name: 'Contact Us', link: "#contact" }
  ];

  const handleScrollToSection = (sectionId) => {
    const section = document.querySelector(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      handleCloseNavMenu();
    }
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
        {/* <NavbarItem isActive>
          <Link className='text-white' aria-current="page" href="#">
            About Us
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className='text-white' href="#">
            Search Stocks
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className='text-white' href="#">
            Subscribe
          </Link>
        </NavbarItem> */}
      </NavbarContent>
      <NavbarContent justify="end">
        {/* <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem> */}
        <NavbarItem>
          <Button as={Link} className='bg-[#A05DD3] text-black font-semibold' href="/login" variant="flat">
            Login
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

export default NavigationBar