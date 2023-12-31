import {useContext, useState} from 'react';
import {searchBookByISBN, searchBooksByCategory} from '../api/books.api';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Input,
  InputGroup,
  InputRightElement,
  Image,
  FormControl,
  FormLabel,
  FormHelperText
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  SearchIcon
} from '@chakra-ui/icons';
import {NavLink, useNavigate} from 'react-router-dom';
import {CartContext} from '../context/CartContext';
import {AuthContext} from '../context/auth.context';
import {SearchContext} from '../context/search.context';
import {FaShoppingCart, FaUser} from 'react-icons/fa';

const Navbar = () => {
  const {itemCount} = useContext(CartContext);
  const {isLoggedIn, logOutUser, isAdmin} = useContext(AuthContext);
  const {searchTerm, setSearchTerm, handleSearchResults} =
    useContext(SearchContext);
  const {isOpen, onToggle} = useDisclosure();
  const navigate = useNavigate();
  const ISBN = input => {
    return /^(?:\d{10}|\d{13})$/.test(input);
  }; // check if it is a isbn number 10 or 13

  const handleSearchSubmit = async event => {
    event.preventDefault();
    handleSearchResults();
    setSearchTerm('');

    navigate('/books');
  };

  const handleSearchTerm = event => {
    setSearchTerm(event.target.value);
  };

  const NAV_ITEMS = [
    {
      label: 'Home',
      href: '/'
    },
    {
      label: 'About',
      href: '/about'
    },
    {
      label: 'Books',
      href: '/books'
    }
  ];

  const MobileNav = () => {
    return (
      <Stack
        bg={useColorModeValue('white', 'gray.800')}
        p={4}
        display={{md: 'none'}}>
        {NAV_ITEMS.map(navItem => (
          <Link
            key={navItem.label}
            as={NavLink}
            to={navItem.href}
            role={'group'}
            display={'block'}
            p={2}
            rounded={'md'}
            fontWeight={'700'}
            _hover={{color: 'orange.400'}}>
            {navItem.label}
          </Link>
        ))}
      </Stack>
    );
  };

  return (
    <Box mt={'6'}>
      <Flex
        bg={useColorModeValue('white')}
        color={useColorModeValue('white')}
        minH={'60px'}
        py={{base: 2}}
        px={{base: 4}}
        align={'center'}
        maxWidth='100%'>
        <Flex
          flex={{base: 1, md: 'auto'}}
          ml={{base: -2}}
          display={{base: 'flex', md: 'none'}}
          align={'center'}>
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex
          flex={{base: 1}}
          justify={{base: 'center', md: 'start'}}
          align={'center'}>
          <Image
            src='https://res.cloudinary.com/dd3f3lrg3/image/upload/v1690147851/logo-bookchap-color_ml1ptm.png'
            alt='bookChap Logo'
            h={{base: '15px', sm: '20px', md: '35px'}}
            w='auto'
            align='center'
          />

          <Flex display={{base: 'none', md: 'flex'}} ml={10} align={'center'}>
            <Stack direction={'row'} spacing={6} align={'center'}>
              {NAV_ITEMS.map(navItem => (
                <Box key={navItem.label} align={'center'}>
                  <Popover trigger={'hover'} placement={'bottom-start'}>
                    <PopoverTrigger>
                      <Link
                        as={NavLink}
                        to={navItem.href}
                        p={2}
                        fontSize={'md'}
                        fontWeight={700}
                        color={'gray.900'}
                        _hover={{
                          textDecoration: 'none',
                          color: 'orange.400'
                        }}>
                        {navItem.label}
                      </Link>
                    </PopoverTrigger>
                  </Popover>
                </Box>
              ))}
              <Box align={'center'}>
                <form onSubmit={handleSearchSubmit}>
                  <FormControl>
                    <Popover trigger={'hover'} placement={'bottom-start'}>
                      <PopoverTrigger>
                        <InputGroup>
                          <Input
                            placeholder='Search by ISBN or Category'
                            size='sm'
                            fontSize={{base: 'xs'}}
                            width={{base: '100%', md: '300px'}}
                            color={'black'}
                            onChange={handleSearchTerm}
                            value={searchTerm}
                          />

                          <InputRightElement>
                            <button type='submit'>
                              <SearchIcon color='gray.400' mb={'8px'} />
                            </button>
                          </InputRightElement>
                        </InputGroup>
                      </PopoverTrigger>
                    </Popover>
                  </FormControl>
                </form>
              </Box>
            </Stack>
          </Flex>
        </Flex>

        <Stack
          flex={{base: 1, md: 0}}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
          align={'center'}>
          {isLoggedIn && !isAdmin && (
            <>
              <Link
                as={NavLink}
                to='/cart'
                fontSize={'sm'}
                fontWeight={700}
                variant={'link'}
                color={'black'}
                _hover={{color: 'orange.400'}}>
                <Stack direction='row' align='center'>
                  <FaShoppingCart />
                  <Text>({itemCount})</Text>
                </Stack>

                {/* Cart ({itemCount}) */}
              </Link>
              <Link
                as={NavLink}
                to='/user-dashboard'
                fontSize={'sm'}
                fontWeight={700}
                variant={'link'}
                color={'black'}
                _hover={{color: 'orange.400'}}>
                <Stack direction='row' align='center'>
                  <FaUser />
                  <Text>Client</Text>
                </Stack>
              </Link>
              <Button
                as={'a'}
                display={{base: 'none', md: 'inline-flex'}}
                fontSize={'md'}
                fontWeight={700}
                color={'white'}
                bg={'orange.400'}
                _hover={{
                  bg: 'orange.500'
                }}
                onClick={logOutUser}>
                Logout
              </Button>
            </>
          )}

          {isLoggedIn && isAdmin && (
            <>
              <Link
                as={NavLink}
                to='/admin-dashboard'
                fontSize={'sm'}
                fontWeight={400}
                variant={'link'}
                color={'black'}
                _hover={{color: 'orange.400'}}>
                <Stack direction='row' align='center'>
                  <FaUser />
                  <Text>Admin</Text>
                </Stack>
              </Link>
              <Button
                as={'a'}
                display={{base: 'none', md: 'inline-flex'}}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'orange.400'}
                _hover={{
                  bg: 'orange.500'
                }}
                onClick={logOutUser}>
                Logout
              </Button>
            </>
          )}

          {!isLoggedIn && (
            <>
              <Stack
                flex={{base: 1, md: 0}}
                justify={'flex-end'}
                direction={'row'}
                spacing={6}
                align={'center'}>
                <Button
                  as={'a'}
                  fontSize={'md'}
                  fontWeight={700}
                  variant={'link'}
                  href={'/login'}
                  color={'black'}
                  _hover={{color: 'orange.400'}}>
                  Login
                </Button>
                <Button
                  as={'a'}
                  display={{base: 'none', md: 'inline-flex'}}
                  fontSize={'md'}
                  fontWeight={700}
                  color={'white'}
                  bg={'orange.400'}
                  href={'/signup'}
                  _hover={{
                    bg: 'orange.500'
                  }}>
                  Signup
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
};

export default Navbar;
