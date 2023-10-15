import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import { experimentalStyled as styled, keyframes } from '@mui/material/styles'; // Import keyframes
import Grid from '@mui/material/Grid';
import CarouselComponent from '../components/CarouselComponent';

const Image = styled('img')({
  width: '100%',
  height: 200,
  objectFit: 'cover',
});

const ContentContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  paddingBottom: '10px',
});

const Title = styled('div')({
  color: '#007BFF',
  fontWeight: 'bold',
  '&:hover': {
    color: '#0056b3',
  },
});

const slideIn = keyframes` // Define keyframes for animation
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
`;

const Heading = styled('h4')({
  color: '#FFFFFF',
  position: 'relative',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '20px',
  animation: `${slideIn} 15s linear infinite`,
});

const SlideInContainer = styled('div')({
  background: '#354c7c',
  padding: '1px 0',
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform .2s', // Add transition here
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:8080/products');
    
    if (!response.ok) {
      throw new Error(`Network response was not ok (Status: ${response.status})`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleItemClick = (Product_Name) => {
    navigate(`/product/${Product_Name}`);
  };

  return (
    <div>
      <CarouselComponent />
      <SlideInContainer>
        <Heading>Trending Products!!</Heading>
      </SlideInContainer>
      <br/>
      <Grid container spacing={3}>
        {products.map((product, index) => (
          <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
            <Item>
              <ContentContainer onClick={() => handleItemClick(product.Product_Name)}>
              <Image src={product.Product_Images} alt={product.Product_Name} />
                <br/> 
                <Title>{product.Product_Name}</Title>
              </ContentContainer>
            </Item>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default HomePage;
