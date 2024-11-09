"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus, Copy } from "lucide-react";
import { initialVegetables } from "@/vegetables";
import { Vegetable } from "@/types/vegetable";

const VegetableOrderApp = () => {
  const [vegetables, setVegetables] = useState<Vegetable[]>([]);
  const [selectedItems, setSelectedItems] = useState<Record<number, boolean>>(
    {}
  );
  const [quantities, setQuantities] = useState<Record<number, string>>({});
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState("");
  const [orderHistory, setOrderHistory] = useState<Record<string, Vegetable[]>>(
    {}
  );

  useEffect(() => {
    const savedVegetables = localStorage.getItem("vegetables");
    // const savedSelections = localStorage.getItem("selectedItems");
    const savedQuantities = localStorage.getItem("quantities");
    const savedOrderHistory = localStorage.getItem("orderHistory");

    if (savedVegetables) {
      const parsedVegetables = JSON.parse(savedVegetables) as Vegetable[];
      // merge with initial list
      const combinedVegetables = parsedVegetables.concat(initialVegetables);
      const deduplicatedVegetables = [...new Set(combinedVegetables)];
      setVegetables(deduplicatedVegetables);
    } else {
      setVegetables(initialVegetables);
    }

    setSelectedItems({}); //savedSelections ? JSON.parse(savedSelections) :
    setQuantities(savedQuantities ? JSON.parse(savedQuantities) : {});
    setOrderHistory(savedOrderHistory ? JSON.parse(savedOrderHistory) : {});
  }, []);

  useEffect(() => {
    localStorage.setItem("vegetables", JSON.stringify(vegetables));
    localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
    localStorage.setItem("quantities", JSON.stringify(quantities));
    localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
  }, [vegetables, selectedItems, quantities, orderHistory]);

  const handleCheckboxChange = (id: number) => {
    setSelectedItems((prev) => {
      const newSelected = { ...prev, [id]: !prev[id] };
      if (!newSelected[id]) {
        const newQuantities = { ...quantities };
        delete newQuantities[id];
        setQuantities(newQuantities);
      } else {
        const veg = vegetables.find((v) => v.id === id);
        if (veg) {
          setQuantities((prev) => ({
            ...prev,
            [id]: veg.mostUsedQty || veg.defaultQty,
          }));
        }
      }
      return newSelected;
    });
  };

  const handleQuantityChange = (id: number, value: string) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddItem = () => {
    if (newItemName.trim()) {
      // keeping the default list from 1 to 100
      const newId = Math.max(...vegetables.map((v) => v.id), 100) + 1;
      const newVeg = {
        id: newId,
        name: newItemName.trim(),
        defaultQty: newItemQty.trim() || "500g",
        orderCount: 0,
        mostUsedQty: "",
      };
      setVegetables((prev) => [...prev, newVeg]);
      setNewItemName("");
      setNewItemQty("");
    }
  };

  const handleCopyOrder = () => {
    const selectedVegetables = vegetables.filter((v) => selectedItems[v.id]);
    const orderText =
      "Order:\n" +
      "---------\n" +
      selectedVegetables
        .map((v) => `${v.name} - ${quantities[v.id]}`)
        .join("\n");

    navigator.clipboard.writeText(orderText);

    // Update order history
    const currentDate = new Date().toLocaleDateString();
    setOrderHistory((prev) => {
      const updatedHistory = { ...prev };
      if (!updatedHistory[currentDate]) {
        updatedHistory[currentDate] = [];
      }
      updatedHistory[currentDate] = [
        ...updatedHistory[currentDate],
        ...selectedVegetables.map((v) => ({
          ...v,
          orderCount: (v.orderCount || 0) + 1,
          mostUsedQty: quantities[v.id],
        })),
      ];
      return updatedHistory;
    });

    alert("Order copied to clipboard! You can now paste it in WhatsApp.");
  };

  // Sort vegetables by order count, then display them in the list
  const sortedVegetables = [...vegetables].sort(
    (a, b) => (b.orderCount || 0) - (a.orderCount || 0)
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Vegetable Order List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedVegetables.map((veg) => (
            <div
              key={veg.id}
              className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded"
            >
              <input
                type="checkbox"
                className="w-6 h-6"
                checked={!!selectedItems[veg.id]}
                onChange={() => handleCheckboxChange(veg.id)}
              />
              <label className="flex-grow text-lg">{veg.name}</label>
              {selectedItems[veg.id] && (
                <div className="flex items-center space-x-2">
                  <span>-</span>
                  <Input
                    type="text"
                    value={quantities[veg.id] || ""}
                    onChange={(e) =>
                      handleQuantityChange(veg.id, e.target.value)
                    }
                    className="w-20 text-lg"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 border rounded-lg space-y-4">
          <h3 className="text-lg font-medium">Add New Item</h3>
          <div className="flex space-x-4">
            <Input
              placeholder="Item name (e.g., Brinjal/Baingan)"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="flex-grow"
            />
            <Input
              placeholder="Default Qty"
              value={newItemQty}
              onChange={(e) => setNewItemQty(e.target.value)}
              className="w-32"
            />
            <Button onClick={handleAddItem} className="w-20">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Button
          onClick={handleCopyOrder}
          className="mt-6 w-full h-12 text-lg"
          disabled={Object.keys(selectedItems).length === 0}
        >
          <Copy className="w-5 h-5 mr-2" />
          Copy Order for WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
};

export default VegetableOrderApp;
