pragma solidity ^0.8.0;

contract PurchaseContract {
    struct Product {
        string itemName;
        uint256 itemPrice;
    }

    struct User {
        string firstName;
        string lastName;
        int256 balance;  // User's balance
    }

    mapping(address => User) public users;
    mapping(address => Product[]) public purchases;

    function setUser(string memory _firstName, string memory _lastName) public {
        users[msg.sender] = User(_firstName, _lastName, 0);  // Initialize balance to 0
    }

    function addProductToPurchase(string memory _itemName, uint256 _itemPrice) public {
        purchases[msg.sender].push(Product(_itemName, _itemPrice));
    }

    function retrievePurchaseDetails(uint256 purchaseIndex) public view returns (Product[] memory, uint256) {
        Product[] memory products = purchases[msg.sender];
        require(purchaseIndex < products.length, "Invalid purchase index");
        return (products, products.length);
    }

    function retrieveUserDetails() public view returns (string memory, string memory, int256) {
        User memory user = users[msg.sender];
        return (user.firstName, user.lastName, user.balance);
    }

    function deductAmount(int256 amount) public {
        require(users[msg.sender].balance >= amount, "Insufficient balance");
        users[msg.sender].balance -= amount;
    }

    function getBalance() public view returns (int256) {
        return users[msg.sender].balance;
    }
}
