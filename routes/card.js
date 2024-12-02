const express = require("express");
const router = express.Router();

const {Card} = require("../schema/card.schema");

// route to add  card
router.post("/add", async (req, res) => {
    const { userId, number, expiration, cvc, name, isDefault } = req.body;
    try {
      let userCard = await Card.findOne({ userId });

      if (!userCard) {
        userCard = new Card({
          userId,
          cards: [
            { 
              number, 
              expiration, 
              cvc, 
              name, 
              isDefault: isDefault || false 
            }
          ]
        });
        await userCard.save();
        return res.status(201).json({ message: "Card added successfully" });
      }
  
      userCard.cards.push({  number,  expiration,  cvc,  name,  isDefault: isDefault || false });
  
      if (isDefault) {
        userCard.cards.forEach((card) => {
          if (card._id.toString() !== userCard.cards[userCard.cards.length - 1]._id.toString()) {
            card.isDefault = false;
          }
        });
      }
  
      await userCard.save();
      return res.status(201).json({ message: "Card added successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error adding card" });
    }
});

// route to edit card
router.put("/edit/:cardId", async (req, res) => {
    const { cardId } = req.params;
    const { number, expiration, cvc, name, isDefault } = req.body;
  
    try {
      const userCard = await Card.findOne({ "cards._id": cardId });
      if (!userCard) return res.status(404).json({ message: "Card not found" });
  
      const card = userCard.cards.id(cardId);
      if (number) card.number = number;
      if (expiration) card.expiration = expiration;
      if (cvc) card.cvc = cvc;
      if (name) card.name = name;
  
      if (isDefault) {
        userCard.cards.forEach(c => c.isDefault = c._id.toString() === cardId ? true : false);
      }
  
      await userCard.save();
      res.status(200).json({ message: "Card updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating card" });
    }
});

// route to delete card
router.delete("/delete/:cardId",  async (req, res) => {
    const { cardId } = req.params;
  
    try {
      const userCard = await Card.findOne({ "cards._id": cardId });
      if (!userCard) return res.status(404).json({ message: "Card not found" });
  
      userCard.cards = userCard.cards.filter(card => card._id.toString() !== cardId);
  
      if (userCard.cards.length === 0) {
        await userCard.remove();
      } else {
        await userCard.save();
      }
  
      res.status(200).json({ message: "Card deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting card" });
    }
});

// route to get all cards
router.get("/:userId",  async (req, res) => {
    const { userId } = req.params;
  
    try {
      const userCards = await Card.findOne({ userId });
  
      if (!userCards) {
        return res.status(404).json({ message: "No cards found" });
      }
  
      res.status(200).json({ cards: userCards.cards });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching cards" });
    }
  });
  
  
module.exports = router