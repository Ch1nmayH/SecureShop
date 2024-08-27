const SecurePayments = () => {
    const cards = [
      {
        id: 1,
        title: "MetaMask Wallet",
        description: "Easily manage your Ethereum and ERC-20 tokens with MetaMask. Your keys, your crypto.",
        icon: "🔐", // Add a lock icon for security
      },
      {
        id: 2,
        title: "Cryptocurrency",
        description: "Start using digital currency for fast and secure transactions globally.",
        icon: "💸", // Add a money wings icon for cryptocurrency
      },
      {
        id: 3,
        title: "Secure Payments",
        description: "Enjoy safe and secure payments with blockchain technology and MetaMask integration.",
        icon: "🛡️", // Add a shield icon for secure payments
      },
    ];
  
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Secure Payments with MetaMask</h2>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
          {cards.map((card) => (
            <div key={card.id} className="bg-white shadow-md rounded-lg p-4 text-center transition-transform transform hover:scale-105">
              <div className="text-5xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-700">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  

export default SecurePayments;