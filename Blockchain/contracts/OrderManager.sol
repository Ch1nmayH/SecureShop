// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OrderManager {
    struct Product {
        string name;
        uint256 price;
        uint256 quantity;
    }

    struct Order {
        address userAddress;
        address receiverAddress;
        Product[] products;
        uint256 totalAmount;
        uint256 timestamp;
    }

    mapping(uint256 => Order) public orders;
    uint256 public orderCount;

    event OrderPlaced(
        uint256 indexed orderId,
        address indexed userAddress,
        address indexed receiverAddress,
        uint256 totalAmount,
        uint256 timestamp
    );

    function placeOrder(
        address _receiverAddress,
        Product[] memory _products
    ) public payable {
        uint256 totalCost = 0;

        // Calculate total cost
        for (uint256 i = 0; i < _products.length; i++) {
            totalCost += _products[i].price * _products[i].quantity;
        }

        require(msg.value >= totalCost, "Insufficient funds sent");

        // Store the order
        orderCount++;
        Order storage newOrder = orders[orderCount];
        newOrder.userAddress = msg.sender;
        newOrder.receiverAddress = _receiverAddress;
        newOrder.totalAmount = totalCost;
        newOrder.timestamp = block.timestamp;

        // Copy products to the order
        for (uint256 i = 0; i < _products.length; i++) {
            newOrder.products.push(_products[i]); // Push each product to the array
        }

        emit OrderPlaced(orderCount, msg.sender, _receiverAddress, totalCost, block.timestamp);
    }

    function getOrderDetails(uint256 orderId) public view returns (
        address userAddress,
        address receiverAddress,
        Product[] memory products,
        uint256 totalAmount,
        uint256 timestamp
    ) {
        Order storage order = orders[orderId];
        return (
            order.userAddress,
            order.receiverAddress,
            order.products,
            order.totalAmount,
            order.timestamp
        );
    }
}
