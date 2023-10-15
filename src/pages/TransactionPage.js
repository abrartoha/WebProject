import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  TextField,
  FormControl,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
} from '@mui/material';
import axios from 'axios';

const statusColors = {
  Completed: 'success',
  Processing: 'info',
  Shipped: 'warning',
};

const TransectionPage = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:8080/orders');
        const transactionData = response.data;

        for (const transaction of transactionData) {
          // Fetch order total from another API endpoint
          const totalResponse = await axios.get(`http://localhost:8080/Shopping_Cart/${transaction.Cart_ID}`);
          if (totalResponse.data && totalResponse.data[0] && totalResponse.data[0].Total) {
            transaction.Total = totalResponse.data[0].Total;
          }
        }

        setTransactions(transactionData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchTransactions();
  }, []);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.checked);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (!startDate || !endDate) {
      return true;
    }

    const transactionDate = new Date(transaction.Order_DateTime);
    return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
  }).filter((transaction) => !statusFilter || transaction.Order_Status === 'Completed');

  const sortedTransactions = sortBy
    ? [...filteredTransactions].sort((a, b) =>
        sortBy === 'lowToHigh' ? a.Total - b.Total : b.Total - a.Total
      )
    : filteredTransactions;

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Transaction History
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Filter
              </Typography>
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                fullWidth
                sx={{ marginTop: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FormControlLabel
                control={<Checkbox checked={statusFilter} onChange={handleStatusChange} />}
                label="Show Completed Transactions"
                sx={{ marginTop: 2 }}
              />
              <FormControl fullWidth sx={{ marginTop: 2 }}>
                <Select value={sortBy} onChange={handleSortChange} displayEmpty>
                  <MenuItem value="">Sort By</MenuItem>
                  <MenuItem value="lowToHigh">Price: Low to High</MenuItem>
                  <MenuItem value="highToLow">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={9}>
          <List>
            {sortedTransactions.map((transaction) => (
              <ListItem key={transaction.Order_ID}>
                <Card variant="outlined" sx={{ width: '100%' }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={3}>
                        <Typography variant="h6" gutterBottom>
                          Hash Value
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {transaction.Order_ID}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Typography variant="h6" gutterBottom>
                          Total Price
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {transaction.Total}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Typography variant="h6" gutterBottom>
                          Purchase Date
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {transaction.Order_DateTime}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Typography variant="h6" gutterBottom>
                          Status
                        </Typography>
                        <Chip
                          label={transaction.Order_Status}
                          color={statusColors[transaction.Order_Status]}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TransectionPage;
