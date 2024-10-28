import React from "react";

const EditForm = ({
  formData,
  handleInputChange,
  handleSubmit,
  handleCancel,
}) => {
  const onSubmit = (e) => {
    e.preventDefault(); // Prevents the form from submitting via the browser
    handleSubmit(e); // Calls the actual submit function passed from the parent
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md w-1/2 mx-auto mt-6"
    >
      <h2 className="text-2xl font-bold mb-4">
        Edit {formData.firstName} {formData.lastName}
      </h2>
      <div className="mb-4">
        <label className="block mb-2">First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Mobile</label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Save Changes
      </button>
      <button
        type="button"
        className="bg-gray-500 text-white px-4 py-2 ml-4 rounded hover:bg-gray-600"
        onClick={handleCancel}
      >
        Cancel
      </button>
    </form>
  );
};

export default EditForm;
