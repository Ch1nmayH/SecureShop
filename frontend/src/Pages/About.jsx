import React from 'react';

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">About SecureShop</h1>
      <p className="text-lg text-gray-700 text-center max-w-2xl">
        SecureShop is your trusted eCommerce platform that offers secure and convenient online shopping experiences. 
        We prioritize your security by leveraging the latest technologies, including cryptocurrency payments, to ensure 
        that your transactions are safe and reliable. At SecureShop, we are committed to providing the best customer service 
        and a wide range of quality products to meet your needs.
      </p>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-blue-600">Our Mission</h2>
        <p className="text-lg text-gray-600 mt-2">
          To revolutionize online shopping by integrating advanced security measures and offering an exceptional shopping experience.
        </p>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-blue-600">Our Vision</h2>
        <p className="text-lg text-gray-600 mt-2">
          To be the leading eCommerce platform where customers can shop with confidence, knowing their data and transactions are secure.
        </p>
      </div>
    </div>
  );
};

export default About;
