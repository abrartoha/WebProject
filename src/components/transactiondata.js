
  
  const transactionData = [
    {
      id: 'transaction1',
      items: [
        { itemName: 'Digital Landscape', quantity: 2, price: 0.5 },
        { itemName: 'Robot Uprising', quantity: 1, price: 1.4 }
      ],
      totalPrice: 2 * 0.5 + 1 * 1.4,
      orderStatus: 'Completed',
      hashNumber: 'a1b2c3d4',
      purchaseDate: new Date('2023-09-01T10:30:00Z')
    },
    {
      id: 'transaction2',
      items: [
        { itemName: 'Alien Princess', quantity: 3, price: 0.6 },
        { itemName: 'Cyberpunk Character', quantity: 2, price: 0.8 }
      ],
      totalPrice: 3 * 0.6 + 2 * 0.8,
      orderStatus: 'Processing',
      hashNumber: 'e5f6g7h8',
      purchaseDate: new Date('2023-09-02T15:45:00Z')
    },
    {
      id: 'transaction3',
      items: [
        { itemName: 'Techno Downtown', quantity: 1, price: 1.3 },
        { itemName: 'Underwater Metropolis', quantity: 2, price: 1.1 },
        { itemName: 'Desert Nomad', quantity: 2, price: 0.65 }
      ],
      totalPrice: 1 * 1.3 + 2 * 1.1 + 2 * 0.65,
      orderStatus: 'Completed',
      hashNumber: 'i9j0k1l2',
      purchaseDate: new Date('2023-09-03T09:15:00Z')
    },
    {
      id: 'transaction4',
      items: [
        { itemName: 'Floating Islands', quantity: 4, price: 1 },
        { itemName: 'Futuristic Cityscape', quantity: 1, price: 1.2 }
      ],
      totalPrice: 4 * 1 + 1 * 1.2,
      orderStatus: 'Shipped',
      hashNumber: 'm3n4o5p6',
      purchaseDate: new Date('2023-09-04T14:20:00Z')
    },
    {
      id: 'transaction5',
      items: [
        { itemName: 'Neon Jungle', quantity: 3, price: 0.7 }
      ],
      totalPrice: 3 * 0.7,
      orderStatus: 'Completed',
      hashNumber: 'q7r8s9t0',
      purchaseDate: new Date('2023-09-05T12:00:00Z')
    },
    {
      id: 'transaction6',
      items: [
        { itemName: 'Galactic Warrior', quantity: 2, price: 0.9 },
        { itemName: 'Cosmic Waterfalls', quantity: 1, price: 0.95 }
      ],
      totalPrice: 2 * 0.9 + 1 * 0.95,
      orderStatus: 'Processing',
      hashNumber: 'u1v2w3x4',
      purchaseDate: new Date('2023-09-06T17:30:00Z')
    },
    {
      id: 'transaction7',
      items: [
        { itemName: 'Mystic Mountains', quantity: 1, price: 0.85 },
        { itemName: 'Neon Marketplace', quantity: 2, price: 1.15 },
        { itemName: 'Digital Druid', quantity: 3, price: 0.75 }
      ],
      totalPrice: 1 * 0.85 + 2 * 1.15 + 3 * 0.75,
      orderStatus: 'Completed',
      hashNumber: 'y5z6a7b8',
      purchaseDate: new Date('2023-09-07T08:45:00Z')
    },
    {
      id: 'transaction8',
      items: [
        { itemName: 'Futuristic Cityscape', quantity: 2, price: 1.2 },
        { itemName: 'Alien Princess', quantity: 2, price: 0.6 }
      ],
      totalPrice: 2 * 1.2 + 2 * 0.6,
      orderStatus: 'Shipped',
      hashNumber: 'c9d0e1f2',
      purchaseDate: new Date('2023-09-08T11:00:00Z')
    },
    {
      id: 'transaction9',
      items: [
        { itemName: 'Floating Islands', quantity: 1, price: 1 },
        { itemName: 'Digital Landscape', quantity: 3, price: 0.5 }
      ],
      totalPrice: 1 * 1 + 3 * 0.5,
      orderStatus: 'Processing',
      hashNumber: 'g3h4i5j6',
      purchaseDate: new Date('2023-09-09T13:15:00Z')
    },
    {
      id: 'transaction10',
      items: [
        { itemName: 'Cyberpunk Character', quantity: 4, price: 0.8 },
        { itemName: 'Desert Nomad', quantity: 5, price: 0.65 }
      ],
      totalPrice: 4 * 0.8 + 5 * 0.65,
      orderStatus: 'Completed',
      hashNumber: 'k7l8m9n0',
      purchaseDate: new Date('2023-09-10T16:00:00Z')
    }
  ];
  
  export default transactionData;
  