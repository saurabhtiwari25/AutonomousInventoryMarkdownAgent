import { useState, useEffect } from 'react';
import { getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem, deleteAllInventory } from '../api';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InventoryList() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    product_id: '',
    product_name: '',
    category: '',
    stock_quantity: 0,
    unit_cost: 0,
    current_price: 0,
    monthly_sales: 0,
  });

  const fetchInventory = async () => {
    setLoading(true);
    try {
      setInventory(await getInventory());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filtered = inventory.filter(
    (i) =>
      i.product_name?.toLowerCase().includes(search.toLowerCase()) ||
      i.product_id?.toLowerCase().includes(search.toLowerCase()) ||
      i.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item.product_id);
      setFormData({
        product_id: item.product_id,
        product_name: item.product_name,
        category: item.category,
        stock_quantity: item.stock_quantity,
        unit_cost: item.unit_cost,
        current_price: item.current_price,
        monthly_sales: item.monthly_sales || 0,
      });
    } else {
      setEditingId(null);
      setFormData({
        product_id: '',
        product_name: '',
        category: '',
        stock_quantity: 0,
        unit_cost: 0,
        current_price: 0,
        monthly_sales: 0,
      });
    }

    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateInventoryItem(editingId, formData);
      } else {
        await createInventoryItem(formData);
      }

      setShowModal(false);
      fetchInventory();
    } catch (err) {
      console.error(err);
      alert('Failed to save item');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm(`Delete ${productId}?`)) {
      try {
        await deleteInventoryItem(productId);
        fetchInventory();
      } catch (err) {
        console.error(err);
        alert('Failed to delete');
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to remove ALL inventory items? This cannot be undone.')) {
      try {
        await deleteAllInventory();
        fetchInventory();
      } catch (err) {
        console.error(err);
        alert('Failed to delete all items');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: ['product_id', 'product_name', 'category'].includes(name)
        ? value
        : Number(value),
    }));
  };

  return (
    <div className="flex flex-col flex-1 gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Inventory Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {inventory.length} products tracked
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            className="rounded-md !px-8 !py-3 !h-11 bg-destructive text-destructive-foreground hover:bg-destructive/90 text-sm font-medium gap-2"
            onClick={handleDeleteAll}
          >
            <Trash2 className="h-4 w-4" />
            Remove All
          </Button>
          <Button
            className="rounded-md !px-8 !py-3 !h-11 bg-[#eaeaea] dark:bg-[#333] text-[#111] dark:text-[#fafafa] border-[#ccc] dark:border-[#555] hover:bg-[#ddd] dark:hover:bg-[#444] text-sm font-medium gap-2"
            onClick={() => handleOpenModal()}
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Fixed Search Bar */}
      <div className="relative w-full max-w-md">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />

        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 pl-11 pr-4"
        />
      </div>

      <Card className="flex-1 overflow-hidden">
        <CardContent className="!p-0">
          {loading ? (
            <div className="animate-pulse p-12 text-center text-muted-foreground">
              Loading inventory...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Product ID</TableHead>
                    <TableHead className="text-xs">Name</TableHead>
                    <TableHead className="text-xs">Category</TableHead>
                    <TableHead className="text-right text-xs">Stock</TableHead>
                    <TableHead className="text-right text-xs">Cost</TableHead>
                    <TableHead className="text-right text-xs">Price</TableHead>
                    <TableHead className="text-right text-xs">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-12 text-center text-sm text-muted-foreground"
                      >
                        {search
                          ? 'No matching products.'
                          : 'No inventory items. Upload or create some!'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((item) => (
                      <TableRow
                        key={item.product_id}
                        className="transition-colors hover:bg-muted/50"
                      >
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {item.product_id}
                        </TableCell>

                        <TableCell className="text-sm font-medium">
                          {item.product_name}
                        </TableCell>

                        <TableCell>
                          <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                            {item.category}
                          </span>
                        </TableCell>

                        <TableCell className="text-right">
                          <span
                            className={`text-sm font-medium ${item.stock_quantity <= 10
                              ? 'text-destructive'
                              : ''
                              }`}
                          >
                            {item.stock_quantity}
                          </span>
                        </TableCell>

                        <TableCell className="text-right text-sm text-muted-foreground">
                          {item.unit_cost.toFixed(2)} ₹
                        </TableCell>

                        <TableCell className="text-right text-sm font-medium">
                          {item.current_price.toFixed(2)} ₹
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="rounded-md bg-transparent dark:bg-transparent hover:bg-[#eaeaea] dark:hover:bg-[#333]"
                              onClick={() => handleOpenModal(item)}
                            >
                              <Edit2 />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="rounded-md bg-transparent dark:bg-transparent hover:bg-[#eaeaea] dark:hover:bg-[#333] hover:text-destructive"
                              onClick={() => handleDelete(item.product_id)}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl">
              {editingId ? "Edit Inventory Item" : "Add New Inventory Item"}
            </DialogTitle>

            <p className="text-sm text-muted-foreground">
              {editingId
                ? "Update inventory, stock and pricing information."
                : "Create a new product in your inventory."}
            </p>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-8 pt-6">
            {/* Product Information */}

            <div className="space-y-4">

              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Product Information
              </h3>

              <div className="grid gap-4 md:grid-cols-2">

                <div className="space-y-2">
                  <Label htmlFor="product_id">Product ID</Label>

                  <Input
                    required
                    id="product_id"
                    name="product_id"
                    placeholder="SKU-1001"
                    value={formData.product_id}
                    onChange={handleChange}
                    readOnly={!!editingId}
                    className={editingId ? "bg-muted" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product_name">Product Name</Label>

                  <Input
                    required
                    id="product_name"
                    name="product_name"
                    placeholder="Wireless Mouse"
                    value={formData.product_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="category">Category</Label>

                  <Input
                    required
                    id="category"
                    name="category"
                    placeholder="Electronics"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>

              </div>

            </div>

            {/* Inventory */}

            <div className="space-y-4">

              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Inventory
              </h3>

              <div className="grid gap-4 md:grid-cols-2">

                <div className="space-y-2">
                  <Label>Stock Quantity</Label>

                  <div className="relative">

                    <Input
                      required
                      type="number"
                      name="stock_quantity"
                      value={formData.stock_quantity}
                      onChange={handleChange}
                      className="pr-12"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      pcs
                    </span>

                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Monthly Sales</Label>

                  <Input
                    type="number"
                    name="monthly_sales"
                    value={formData.monthly_sales}
                    onChange={handleChange}
                  />
                </div>

              </div>

            </div>

            {/* Pricing */}

            <div className="space-y-4">

              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Pricing
              </h3>

              <div className="grid gap-4 md:grid-cols-2">

                <div className="space-y-2">

                  <Label>Unit Cost</Label>

                  <div className="relative">

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      ₹
                    </span>

                    <Input
                      required
                      type="number"
                      step="0.01"
                      name="unit_cost"
                      value={formData.unit_cost}
                      onChange={handleChange}
                      className="pr-10"
                    />

                  </div>

                </div>

                <div className="space-y-2">

                  <Label>Selling Price</Label>

                  <div className="relative">

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      ₹
                    </span>

                    <Input
                      required
                      type="number"
                      step="0.01"
                      name="current_price"
                      value={formData.current_price}
                      onChange={handleChange}
                      className="pr-10"
                    />

                  </div>

                </div>

              </div>

            </div>

            <div className="flex justify-end gap-3 border-t pt-6">

              <Button
                type="button"
                className="rounded-md !px-8 !py-3 !h-11 bg-[#eaeaea] dark:bg-[#333] text-[#111] dark:text-[#fafafa] border-[#ccc] dark:border-[#555] hover:bg-[#ddd] dark:hover:bg-[#444] text-sm font-medium"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="rounded-md !px-8 !py-3 !h-11 bg-[#eaeaea] dark:bg-[#333] text-[#111] dark:text-[#fafafa] border-[#ccc] dark:border-[#555] hover:bg-[#ddd] dark:hover:bg-[#444] text-sm font-medium"
              >
                {editingId ? "Save Changes" : "Create Item"}
              </Button>

            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}