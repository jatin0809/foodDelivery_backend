const express = require("express");
const router = express.Router();

const {Address} = require("../schema/address.schema")
// have to add authMiddlware
// Route to add address for a user
router.post("/add", async (req, res) => {
    const { userId, userName, state, city, pincode, phoneNumber, street } = req.body;
  
    try {
      let userAddress = await Address.findOne({ userId });
      if (!userAddress) {
        userAddress = new Address({
          userId,
          userName,
          addresses: [ {  state,  city,  pincode,  phoneNumber,  street,  isDefault: true } ],
        });
        await userAddress.save();
        return res.status(201).json({ message: "Address added successfully" });
      }

      const isDefault = userAddress.addresses.length === 0;

      userAddress.addresses.push({   state,  city,  pincode,  phoneNumber,  street,  isDefault });
      await userAddress.save();
      return res.status(201).json({ message: "Address added successfully" });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error adding address" });
    }
});

// route to edit address
router.put("/edit/:addressId", async (req, res) => {
    const { addressId } = req.params; 
    const { userId, state, city, pincode, phoneNumber, street, isDefault } = req.body;
  
    try {
      const address = await Address.findOne({ "userId": userId, "addresses._id": addressId });
      if (!address) {
        return res.status(404).json({ message: "Address not found or not owned by the user" });
      }

      const addressToUpdate = address.addresses.id(addressId); 
  
      if (state) addressToUpdate.state = state;
      if (city) addressToUpdate.city = city;
      if (pincode) addressToUpdate.pincode = pincode;
      if (phoneNumber) addressToUpdate.phoneNumber = phoneNumber;
      if (street) addressToUpdate.street = street;
      if (isDefault !== undefined) addressToUpdate.isDefault = isDefault; 
  
      await address.save();
      res.status(200).json({ message: "Address updated successfully"});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
});

// Route to delete an address
router.delete("/delete/:addressId", async (req, res) => {
    const { addressId } = req.params; 
    const { userId } = req.body; 
  
    try {
      const address = await Address.findOne({ "userId": userId, "addresses._id": addressId });
      if (!address) {
        return res.status(404).json({ message: "Address not found or not owned by the user" });
      }
  
      const addressToDelete = address.addresses.id(addressId);
      if (!addressToDelete) {
        return res.status(404).json({ message: "Address not found" });
      }
  
      address.addresses.pull(addressId);
      await address.save();
  
      res.status(200).json({ message: "Address deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
});
  
// route to get address
router.get("/:userId", async (req, res) => {
    const { userId } = req.params; 
    try {
      const address = await Address.findOne({ userId: userId });
      if (!address) {
        return res.status(404).json({ message: "No addresses found for this user" });
      }
  

      res.status(200).json({ address });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
 
module.exports = router;