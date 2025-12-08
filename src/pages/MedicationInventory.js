// src/pages/Inventory_v2.js - Glassmorphic Community Inventory

import React, { useState, useEffect } from "react";
import sofieCore from "../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../theme/GlassmorphismTheme";

const Inventory = () => {
  const [inventory, setInventory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("food");
  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState("");

  useEffect(() => {
    const inventoryService = sofieCore.getService("inventory");
    if (inventoryService) {
      setInventory(inventoryService.getInventory());
    }
  }, []);

  const handleAddItem = () => {
    const inventoryService = sofieCore.getService("inventory");
    if (inventoryService && newItem && newQuantity) {
      inventoryService.addItem(selectedCategory, newItem, parseInt(newQuantity));
      setInventory(inventoryService.getInventory());
      setNewItem("");
      setNewQuantity("");
    }
  };

  const categories = Object.keys(inventory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-teal-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <GlassSection colors={{ primary: "teal", secondary: "cyan" }} elevation="high">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-900 to-cyan-700 dark:from-teal-100 dark:to-cyan-400 bg-clip-text text-transparent">
            📦 Community Inventory
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">Track and manage shared resources across the community</p>
        </GlassSection>

        <GlassGrid cols={1} colsMd={2} gap={6}>
          {/* Categories Sidebar */}
          <GlassCard colors={{ primary: "teal", secondary: "cyan" }}>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Categories</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white"
                      : "bg-white/30 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300 border border-white/20 dark:border-slate-700/50 hover:bg-white/50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <span className="capitalize">{category}</span>
                  <span className="ml-2 text-sm opacity-75">({inventory[category]?.quantity || 0} {inventory[category]?.unit})</span>
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Add Item Form */}
          <GlassCard colors={{ primary: "green", secondary: "emerald" }}>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Add to Inventory</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Item Name</label>
                <input
                  type="text"
                  placeholder="e.g., Tomato Seeds"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Quantity</label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder-slate-500"
                />
              </div>
              <button
                onClick={handleAddItem}
                className="w-full px-4 py-2 rounded-lg font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:shadow-lg transition-all"
              >
                Add to Inventory
              </button>
            </div>
          </GlassCard>
        </GlassGrid>

        {/* Items Grid */}
        <GlassSection colors={{ primary: "slate", secondary: "gray" }}>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            {selectedCategory.toUpperCase()} Items
          </h2>
          <GlassGrid cols={1} colsMd={3} gap={4}>
            {inventory[selectedCategory]?.categories &&
              Object.entries(inventory[selectedCategory].categories).map(([item, quantity]) => (
                <GlassCard key={item} colors={{ primary: "teal", secondary: "cyan" }}>
                  <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase">Item</p>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2 mb-2">{item}</h3>
                  <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">{quantity}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{inventory[selectedCategory]?.unit}</p>
                </GlassCard>
              ))}
            {(!inventory[selectedCategory]?.categories || Object.keys(inventory[selectedCategory].categories).length === 0) && (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-600 dark:text-slate-400 text-lg font-semibold">No items in this category yet</p>
              </div>
            )}
          </GlassGrid>
        </GlassSection>

        {/* Web3 Badge */}
        <GlassCard colors={{ primary: "slate", secondary: "gray" }}>
          <p className="text-center text-sm font-semibold text-slate-600 dark:text-slate-400">
            🔗 Inventory tracked on blockchain • Verified across network
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

export default Inventory;
